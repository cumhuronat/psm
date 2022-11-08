import {CliUx, Command} from '@oclif/core'
import {getSnapshots} from '../utils/helpers'
import  chalk from 'chalk'

export default class List extends Command {
  static description = 'list all snapshots'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const snapshots = getSnapshots()

    CliUx.ux.table(snapshots, {
      name: {
        minWidth: 20,
        header: 'Snapshot',
      },
      port: {
        get: row => row.port,
      },
      status: {
        get: row => row.active ? chalk.cyan('running') : chalk.red('stopped'),
      },
    }, {
      printLine: this.log.bind(this),
    })
  }
}
