import * as events from 'aws-cdk-lib/aws-events'
import { EventBus, Function, StackContext, use } from 'sst/constructs'
import { Table } from 'sst/constructs'

import { depositServiceStack } from './depositService'
import { withdrawalServiceStack } from './withdrawalService'

interface RecentActionsStackOutput {}

export function recentActionsStack({
	stack
}: StackContext): RecentActionsStackOutput {
	const executionsTable = new Table(stack, 'executions', {
		fields: {
			executionId: 'string',
			clientId: 'string'
		},
		primaryIndex: { partitionKey: 'executionId' }
	})

	const depositService = use(depositServiceStack)
	const withdrawalService = use(withdrawalServiceStack)

	const stateMachineHandler = new Function(stack, 'Function', {
		handler: 'services/recentActions/src/stateMachineHandler/index.handler',
		environment: {
			EXECUTIONS_TABLE: executionsTable.tableName
		}
	})
	stateMachineHandler.bind([executionsTable])

	new EventBus(stack, 'RecentActionsBus', {
		cdk: {
			eventBus: events.EventBus.fromEventBusName(
				stack,
				'ImportedBus',
				'default'
			)
		},
		rules: {
			stepFunctionsStatusChange: {
				pattern: {
					source: ['aws.states'],
					detailType: ['Step Functions Execution Status Change'],
					detail: {
						stateMachineArn: [
							depositService.depositStateMachine.stateMachineArn,
							withdrawalService.withdrawalStateMachine.stateMachineArn
						]
					}
				},
				targets: {
					stateMachineHandler
				}
			}
		}
	})

	return {}
}
