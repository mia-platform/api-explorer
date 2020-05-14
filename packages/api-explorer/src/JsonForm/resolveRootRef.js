import get from 'lodash.get'
import {omit} from 'ramda'

export default function resolveRootRef(schema, count = 0) {
  if (count === 8) {
    throw new Error('circular reference')
  }

  const ref = schema.$ref
  if(!ref) {
    return schema
  }

  // e.g.: "#/components/schemas/Pet" -> "components.schemas.Pet"
  const componentsPath = ref.slice(2, ref.length).replace(/\//g, '.')
  const foundReference = get(schema, componentsPath)

  if(!foundReference) {
    throw new Error('missing reference')
  }

  return resolveRootRef({
    ...omit(['$ref'], schema),
    ...foundReference
  }, count + 1)
}