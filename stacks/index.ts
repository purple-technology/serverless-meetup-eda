import { App } from 'sst/constructs'

import { depositServiceStack } from './depositService'
import { recentActionsStack } from './recentActionsService'
import { withdrawalServiceStack } from './withdrawalService'

export default function (app: App): void {
	app.setDefaultRemovalPolicy('destroy')

	app.setDefaultFunctionProps({
		logRetention: 'one_week',
		runtime: 'nodejs18.x',
		architecture: 'arm_64'
	})

	app.stack(depositServiceStack, { id: 'deposit-service' })
	app.stack(withdrawalServiceStack, { id: 'withdrawal-service' })
	app.stack(recentActionsStack, { id: 'recent-actions-service' })
}
