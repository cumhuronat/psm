Postgresql Snapshot Manager
=================

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @storespynet/psm
$ psm COMMAND
running command...
$ psm (--version)
@storespynet/psm/1.0.0 win32-x64 node-v18.11.0
$ psm --help [COMMAND]
USAGE
  $ psm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`psm create NAME`](#psm-create-name)
* [`psm delete [NAME]`](#psm-delete-name)
* [`psm help [COMMAND]`](#psm-help-command)
* [`psm list [FILE]`](#psm-list-file)
* [`psm start NAME`](#psm-start-name)
* [`psm stop NAME`](#psm-stop-name)

## `psm create NAME`

create a new snapshot

```
USAGE
  $ psm create [NAME]

ARGUMENTS
  NAME  name of the snapshot to create

DESCRIPTION
  create a new snapshot

EXAMPLES
  $ psm create staging1
```

_See code: [dist/commands/create.ts](https://github.com/storespynet/psm/blob/v1.0.0/dist/commands/create.ts)_

## `psm delete [NAME]`

delete a snapshot

```
USAGE
  $ psm delete [NAME]

ARGUMENTS
  NAME  name of the snapshot to delete

DESCRIPTION
  delete a snapshot

EXAMPLES
  $ psm delete staging1
```

_See code: [dist/commands/delete.ts](https://github.com/storespynet/psm/blob/v1.0.0/dist/commands/delete.ts)_

## `psm help [COMMAND]`

Display help for psm.

```
USAGE
  $ psm help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for psm.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.17/src/commands/help.ts)_

## `psm list [FILE]`

list all snapshots

```
USAGE
  $ psm list [FILE]

DESCRIPTION
  list all snapshots

EXAMPLES
  $ psm list
```

_See code: [dist/commands/list.ts](https://github.com/storespynet/psm/blob/v1.0.0/dist/commands/list.ts)_

## `psm start NAME`

start a snapshot

```
USAGE
  $ psm start [NAME]

ARGUMENTS
  NAME  name of the snapshot to start

DESCRIPTION
  start a snapshot

EXAMPLES
  $ psm start staging1
```

_See code: [dist/commands/start.ts](https://github.com/storespynet/psm/blob/v1.0.0/dist/commands/start.ts)_

## `psm stop NAME`

stop a snapshot

```
USAGE
  $ psm stop [NAME]

ARGUMENTS
  NAME  name of the snapshot to stop

DESCRIPTION
  stop a snapshot

EXAMPLES
  $ psm stop staging1
```

_See code: [dist/commands/stop.ts](https://github.com/storespynet/psm/blob/v1.0.0/dist/commands/stop.ts)_
<!-- commandsstop -->
