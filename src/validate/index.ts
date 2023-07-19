import Ajv from 'ajv'
import schema from './schema.json'
import type { JTDDataType } from 'ajv/dist/jtd'

const ajv = new Ajv()
type ValidSEP001 = JTDDataType<SEP001>
export const validStandard = ajv.compile<ValidSEP001>(schema)
