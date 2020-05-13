import parser from '@apidevtools/json-schema-ref-parser'
import get from 'lodash.get'
import {omit} from 'ramda'

function resolveRootRef(schema, count = 0) {
  if (count === 8) {
    return {}
  }

  const ref = schema.$ref
  if(!ref) {
    return schema
  }

  // e.g.: "#/components/schemas/Pet" -> ".components.schemas.Pet"
  const componentsPath = ref.slice(2, ref.length).replace(/\//g, '.')
  const foundReference = get(schema, componentsPath)

  if(!foundReference) {
    return {}
  }

  return resolveRootRef({
    ...omit(['$ref'], schema),
    ...foundReference
  }, count + 1)
}

export default async function resolveReference (schema) {
  // ref: https://github.com/APIDevTools/json-schema-ref-parser/issues/174
  // if it remains in the root $ ref, the library cannot resolve the other nested references
  // https://codesandbox.io/s/bug-json-schema-ref-parser-8dehm?file=/src/index.js
  const convertedAgain = await parser.dereference(resolveRootRef(schema))
  return convertedAgain
}