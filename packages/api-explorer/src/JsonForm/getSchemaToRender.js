import get from 'lodash.get'

export default function getSchemaToRender(schema){
  const withoutTitle = {...schema, title: " "}
  const ref = withoutTitle.$ref
  if(!ref) {
    return withoutTitle
  }
  // e.g.:    "#/components/schemas/Pet" -> ".components.schemas.Pet"
  const componentsPath = ref.slice(1, ref.length).replace(/\//g, '.')
  const foundReference = get(schema, `definitions${componentsPath}`)
  if(!foundReference) {
    return withoutTitle
  }
  return {
    ...withoutTitle,
    '$ref': undefined,
    ...foundReference
  }
}