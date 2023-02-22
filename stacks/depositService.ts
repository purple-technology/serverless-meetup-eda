import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import { JsonPath, Pass } from 'aws-cdk-lib/aws-stepfunctions'
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks'
import * as sst from 'sst/constructs'
import { FunctionalStack } from 'sst/constructs/FunctionalStack'

type DepositServiceStackOutput = {
	depositStateMachine: sfn.StateMachine
}

export const depositServiceStack: FunctionalStack<
	DepositServiceStackOutput
> = ({ stack }) => {
	const app = stack.node.root as sst.App
	const { stage, name } = app

	const depositToTradingAccountStep = new tasks.LambdaInvoke(
		stack,
		'Deposit to trading account',
		{
			lambdaFunction: new sst.Function(stack, 'depositToTradingAccount', {
				handler: `services/deposit/src/depositToTradingAccount/index.handler`
			}),
			payloadResponseOnly: true
		}
	)
	const notifySupportStep = new Pass(stack, 'Notify support', {
		resultPath: JsonPath.DISCARD
	})

	const depositStateMachine = new sfn.StateMachine(stack, 'deposit', {
		stateMachineName: `${stage}-${name}-deposit`,
		definition: depositToTradingAccountStep.next(notifySupportStep)
	})

	return {
		depositStateMachine
	}
}
