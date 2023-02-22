import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import { JsonPath, Pass } from 'aws-cdk-lib/aws-stepfunctions'
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks'
import * as sst from 'sst/constructs'
import { FunctionalStack } from 'sst/constructs/FunctionalStack'

type WithdrawalServiceStackOutput = {
	withdrawalStateMachine: sfn.StateMachine
}

export const withdrawalServiceStack: FunctionalStack<
	WithdrawalServiceStackOutput
> = ({ stack }) => {
	const app = stack.node.root as sst.App
	const { stage, name } = app

	const withdrawalStateMachine = new sfn.StateMachine(stack, 'withdrawal', {
		stateMachineName: `${stage}-${name}-withdrawal`,
		definition: new tasks.LambdaInvoke(
			stack,
			'Withdrawal from trading account',
			{
				lambdaFunction: new sst.Function(stack, 'withdrawFromTradingAccount', {
					handler: `services/withdrawal/src/withdrawFromTradingAccount/index.handler`
				}),
				payloadResponseOnly: true
			}
		).next(new Pass(stack, 'Notify client', { resultPath: JsonPath.DISCARD }))
	})

	return {
		withdrawalStateMachine
	}
}
