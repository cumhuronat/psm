import * as fs from 'fs-extra'
import {execSync} from 'node:child_process'

export function getSnapshots(): Array<{ name: string, port: number, active: boolean }> {
  const folders = fs.readdirSync('/etc/postgresql/14').filter(folder => folder !== 'main')
  const snapshots: Array<{ name: string, port: number, active: boolean }> = []
  for (const folder of folders) {
    const postgresql = fs.readFileSync(`/etc/postgresql/14/${folder}/postgresql.conf`, 'utf8')
    // get the name of the snapshot from data directory
    const name = postgresql.match(/data_directory = '\/pg_data\/14\/(.*)'/)?.[1]
    const port = postgresql.match(/port = (.*)/)?.[1]
    let active = true
    try {
      execSync(`systemctl is-active --quiet postgresql@14-${name}.service`)
    } catch {
      active = false
    }

    if (name && port) snapshots.push({name: name, port: Number.parseInt(port, 10), active: active})
  }

  return snapshots
}

export function getEmptyPort(): number {
  for (let i = 60_000; i < 61_000; i++) {
    if (!getSnapshots().some(snapshot => snapshot.port === i)) return i
  }

  throw new Error('no empty port found')
}

