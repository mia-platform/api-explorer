import parser from '@apidevtools/json-schema-ref-parser'
import {omit} from 'ramda'

export default async function resolveReference (schema) {
  const converted = await parser.dereference(schema)
  // ref: https://github.com/APIDevTools/json-schema-ref-parser/issues/174
  const convertedAgain = await parser.dereference(omit(['$ref'], converted))
  return convertedAgain
}