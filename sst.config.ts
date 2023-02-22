import { getStage } from '@purple/serverless-git-branch-stage-plugin'
import type { SSTConfig } from 'sst'

import stacks from './stacks'

const config: SSTConfig = {
	config() {
		return {
			name: 'meetup3',
			region: 'eu-central-1',
			main: 'stacks/index.ts',
			stage: getStage()
		}
	},
	stacks
}

export default config
