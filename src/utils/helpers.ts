import * as fs from "fs-extra";

export function getSnapshots(): Array<{ name: string, port: number }> {
  const folders = fs.readdirSync('/etc/postgresql/14');
  const snapshots: Array<{ name: string, port: number }> = []
  for (const folder of folders) {
    let postgresql = fs.readFileSync(`/etc/postgresql/14/${folder}/postgresql.conf`, "utf8")
    //get the name of the snapshot from data directory
    let name = postgresql.match(/data_directory = '\/pg_data\/14\/(.*)'/)?.[1]
    let port = postgresql.match(/port = (.*)/)?.[1]
    if (name && port) snapshots.push({"name": name, "port": parseInt(port)})
  }
  return snapshots
}

export function getEmptyPort(): number {
  for (let i = 60000; i < 61000; i++) {
    if (!getSnapshots().find(snapshot => snapshot.port === i)) return i
  }
  throw new Error('no empty port found')
}



