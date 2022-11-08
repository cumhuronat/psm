import {CliUx, Command} from '@oclif/core'
import {getSnapshots} from '../utils/helpers'
import {execSync} from 'node:child_process'
// convert the following import to dynamic import
import inquirer from 'inquirer'

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

    if (!allSnapshots.some(snap => snap.name === snapshot)) {
      this.error('snapshot does not exist')
    }

    const confirm = await CliUx.ux.prompt(`Are you sure you want to delete ${snapshot}? (y/n)`)

    if (confirm === 'y') {
      try {
        execSync(`systemctl stop --quiet postgresql@14-${args.name}.service`)
        this.log(`snapshot ${args.name} has been stopped`)
      } catch {
        this.error('snapshot could not be stopped')
      }
    } else {
      this.log('cancelled by user')
    }
  }
}
