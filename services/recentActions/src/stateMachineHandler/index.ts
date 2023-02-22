import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import type { Handler } from 'aws-lambda'
import { isDepositInput } from 'deposit/src/types'

import { Event, RecentAction } from './types'

export const handler: Handler<Event, void> = async (event): Promise<void> => {
	console.log(JSON.stringify(event, undefined, 4))
	const recentAction = parseRecentAction(event)

	const dynamodbClient = new DynamoDBClient({})
	await dynamodbClient.send(
		new PutItemCommand({
			TableName: process.env.EXECUTIONS_TABLE,
			Item: marshall(recentAction, { removeUndefinedValues: true })
		})
	)
}

const parseRecentAction = (event: Event): RecentAction => {
	const {
		detail: {
			executionArn,
			status,
			input: executionInput,
			output: executionOutput
		}
	} = event

	const input = executionInput ? JSON.parse(executionInput) : undefined
	const output = executionOutput ? JSON.parse(executionOutput) : undefined

	return {
		executionId: executionArn,
		clientId: parseClientId(input),
		status,
		input,
		output
	}
}

const parseClientId = (input: unknown): string => {
	let clientId: string | undefined = undefined
	if (isDepositInput(input)) {
		clientId = input.clientId
	}

	if (!clientId) {
		throw new Error('')
	}
	return clientId
}
