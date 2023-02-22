import { v4 as uuidv4 } from 'uuid'

import { Input } from '../types'
import { Output } from './types'

export const handler = (input: Input): Output => {
	return { ...input, ticketNumber: uuidv4() }
}
