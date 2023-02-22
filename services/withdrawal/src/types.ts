import Ajv, { JSONSchemaType } from 'ajv'
const ajv = new Ajv()

export type Input = {
	amount: number
	accountNumber: string
	clientId: string
}

const schema: JSONSchemaType<Input> = {
	type: 'object',
	properties: {
		amount: { type: 'number' },
		accountNumber: { type: 'string' },
		clientId: { type: 'string' }
	},
	required: ['amount', 'accountNumber', 'clientId']
}

export const isDepositInput = (input: unknown): input is Input => {
	const validate = ajv.compile(schema)
	return validate(input)
}
