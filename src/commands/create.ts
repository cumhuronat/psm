import {CliUx, Command} from '@oclif/core'
import * as fs from 'fs-extra'
import {execSync} from 'node:child_process'
import {getSnapshots, getEmptyPort} from '../utils/helpers'

export default class Create extends Command {
  static description = 'create a new snapshot'

  static examples = [
    '<%= config.bin %> <%= command.id %> staging1',
  ]

  static args = [{name: 'name', required: true, description: 'name of the snapshot to create'}]

  public async run(): Promise<void> {
    const {args} = await this.parse(Create)
    const allSnapshots = getSnapshots()
    if (allSnapshots.some(snapshot => snapshot.name === args.name)) {
      this.error('snapshot already exists')
    }

    const port = getEmptyPort()

    try {
      CliUx.ux.action.start('creating snapshot on disk')
      execSync(`btrfs subvolume snapshot /pg_data/14/main /pg_data/14/${args.name}`)
      CliUx.ux.action.stop()
    } catch {
      CliUx.ux.action.stop('could not create snapshot on disk')
      return
    }

    try {
      CliUx.ux.action.start('removing standby.signal on new snapshot')
      fs.removeSync(`/pg_data/14/${args.name}/standby.signal`)
      fs.removeSync(`/pg_data/14/${args.name}/postmaster.opts`)
      fs.removeSync(`/pg_data/14/${args.name}/postmaster.pid`)
      CliUx.ux.action.stop()
    } catch {
      CliUx.ux.action.stop('could not remove standby.signal on new snapshot')
      return
    }

    try {
      CliUx.ux.action.start('configuring postgresql.auto.conf')
      let autoConf = fs.readFileSync(`/pg_data/14/${args.name}/postgresql.auto.conf`, 'utf8')
      autoConf = autoConf.replace(/archive_mode = 'on'/g, 'archive_mode = \'off\'')
      autoConf = autoConf.replace(/archive_command = '.*?'/g, 'archive_command = \'/bin/true\'')
      autoConf = autoConf.replace(/restore_command = '.*?'/g, '#restore_command = \'\'')
      fs.writeFileSync(`/pg_data/14/${args.name}/postgresql.auto.conf`, autoConf, 'utf8')
      CliUx.ux.action.stop()
    } catch {
      CliUx.ux.action.stop('could not configure postgresql.auto.conf')
      return
    }

    try {
      CliUx.ux.action.start('creating a new postgres service')
      execSync(`cp -rp /etc/postgresql/14/main /etc/postgresql/14/${args.name}`)
      let postgresql = fs.readFileSync(`/etc/postgresql/14/${args.name}/postgresql.conf`, 'utf8')
      postgresql = postgresql.replace(/\/pg_data\/14\/main/g, `/pg_data/14/${args.name}`)
      postgresql = postgresql.replace(/port = 5432/g, `port = ${port}`)
      postgresql = postgresql.replace(/cluster_name = '14\/main'/, 'cluster_name = \'14/' + args.name + '\'')
      fs.writeFileSync(`/etc/postgresql/14/${args.name}/postgresql.conf`, postgresql, 'utf8')
      CliUx.ux.action.stop()
    } catch {
      CliUx.ux.action.stop('could not create a new postgres service')
      return
    }


    try {
      CliUx.ux.action.start('starting new postgres instance')
      execSync(`systemctl start --quiet postgresql@14-${args.name}.service`)
      CliUx.ux.action.stop()
    } catch {
      CliUx.ux.action.stop('could not start new postgres instance')
    }

    this.log(`snapshot ${args.name} has been created`)
  }
}
