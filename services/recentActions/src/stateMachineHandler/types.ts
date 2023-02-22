import type { EventBridgeEvent } from 'aws-lambda'

type Status = 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED'

export type Event = EventBridgeEvent<
	'Step Functions Execution Status Change',
	Detail
>

export type Detail = {
	executionArn: string
	stateMachineArn: string
	name: string
	status: Status
	startDate: number
	stopDate: number
	input: string
	output: string | null
	inputDetails: object
	outputDetails: object
	error: null
	cause: null
}

export type RecentAction = {
	executionId: string
	status: Status
	clientId: string
	input: unknown
	output?: unknown
}
