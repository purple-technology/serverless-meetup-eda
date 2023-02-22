# Event-driven architecture

An example of implementation recent actions using SST

## How to start

- configure `AWS_PROFILE` and `AWS_REGION` in `.env` and `.vscode/launch.json`
- you can use CLI command `aws sso login --profile <PROFILE_NAME>` for login to AWS account

## Commands

### `npm run start`

Starts the Live Lambda Development environment.

### `npm run build`

Build your app and synthesize your stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.
