import parser from '@apidevtools/json-schema-ref-parser'
import {omit} from 'ramda'

export default async function resolveReference (schema) {
  const converted = await parser.dereference(schema)
  // ref: https://github.com/APIDevTools/json-schema-ref-parser/issues/174
  // if it remains in the root $ ref, the library cannot resolve the other nested references
  // https://codesandbox.io/s/bug-json-schema-ref-parser-8dehm?file=/src/index.js
  const convertedAgain = await parser.dereference(omit(['$ref'], converted))
  return convertedAgain
}
