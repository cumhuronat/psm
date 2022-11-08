import {Command} from '@oclif/core'
import {getSnapshots} from '../utils/helpers'
import {execSync} from 'node:child_process'

export default class Start extends Command {
  static description = 'start a snapshot'

  static examples = [
    '<%= config.bin %> <%= command.id %> staging1',
  ]

  static args = [{name: 'name', required: true, description: 'name of the snapshot to start'}]

  public async run(): Promise<void> {
    const {args} = await this.parse(Start)
    const allSnapshots = getSnapshots()
    if (!allSnapshots.some(snapshot => snapshot.name === args.name)) {
      this.error('snapshot does not exist')
    }

    try {
      execSync(`systemctl start --quiet postgresql@14-${args.name}.service`)
      this.log(`snapshot ${args.name} has been started`)
    } catch {
      this.error('snapshot could not be started')
    }
  }
}
