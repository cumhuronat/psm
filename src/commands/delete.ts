import {CliUx, Command} from '@oclif/core'
import {getSnapshots} from '../utils/helpers'
import {execSync} from 'node:child_process'
import * as inquirer from 'inquirer'

export default class Delete extends Command {
  static description = 'delete a snapshot'

  static examples = [
    '<%= config.bin %> <%= command.id %> staging1',
  ]

  static args = [{name: 'name', required: false, description: 'name of the snapshot to delete'}]

  public async run(): Promise<void> {
    const {args} = await this.parse(Delete)
    const allSnapshots = getSnapshots()
    let snapshot = args.name
    if (!snapshot) {
      const responses: any = await inquirer.prompt([{
        name: 'snapshot',
        message: 'select a snapshot',
        type: 'list',
        choices: allSnapshots.map(snapshot => snapshot.name),
      }])
      snapshot = responses.snapshot
    }

    const selectedSnapshot = allSnapshots.find(snap => snap.name === snapshot)

    if (!selectedSnapshot) {
      this.error('snapshot does not exist')
    }

    const confirm = await CliUx.ux.prompt(`Are you sure you want to delete ${snapshot}? (y/n)`)

    if (confirm === 'y') {
      if (selectedSnapshot.active) {
        try {
          CliUx.ux.action.start('stopping postgres instance')
          execSync(`systemctl stop --quiet postgresql@14-${snapshot}.service`)
          CliUx.ux.action.stop()
        } catch {
          CliUx.ux.action.stop('could not stop postgres instance')
        }
      }

      try {
        CliUx.ux.action.start('removing snapshot on disk')
        execSync(`btrfs subvolume delete /pg_data/14/${snapshot}`)
        CliUx.ux.action.stop()
      } catch {
        CliUx.ux.action.stop('could not delete snapshot on disk')
      }

      try {
        CliUx.ux.action.start('removing postgres configuration on disk')
        execSync(`rm -rf /etc/postgresql/14/${snapshot}`)
        CliUx.ux.action.stop()
      } catch {
        CliUx.ux.action.stop('could not delete postgres configuration on disk')
      }
    } else {
      this.log('cancelled by user')
    }
  }
}
