import resolveReference from '../../src/JsonForm/resolveReference'
import SCHEMA_BUG from '../datatest/config-root-ref-and-nested.json'
import EXPECTED_SCHEMA_BUG from '../datatest/config-root-ref-and-nested.expected.json'
import CIRCULAR_ROOT_SCHEMA from '../datatest/circular-on-root.json'
import MISSING_REFERENCE from '../datatest/missing-reference.json'
import CIRCULAR_SCHEMA from '../datatest/circular.json'
import SIMPLE_SCHEMA from '../datatest/simple.json'
import SIMPLE2_SCHEMA from '../datatest/simple2.json'
import SIMPLE3_SCHEMA from '../datatest/simple3.json'

test('resolve correctly with nested $ref', async () => {
  const resp = await resolveReference(SCHEMA_BUG)
  expect(resp).toEqual(EXPECTED_SCHEMA_BUG)
})

test('circular on root throws error', async () => {
  await expect(resolveReference(CIRCULAR_ROOT_SCHEMA)).rejects.toEqual(new Error('circular reference'))
})

test('missing reference on root throws error', async () => {
  await expect(resolveReference(MISSING_REFERENCE)).rejects.toEqual(new Error('missing reference'))
})

test.only('resolve correctly with circular $ref', async () => {
  const resp = await resolveReference(CIRCULAR_SCHEMA)
  expect(resp.properties.children.items.properties.children.items.properties).toEqual({})
})


test('resolve correctly with test', async () => {
  const resp = await resolveReference(SIMPLE_SCHEMA)
  expect(resp).toEqual({
    "type": "array",
    "items": {
        "type": "string"
    }
})
})



test('resolve correctly with test2', async () => {
  const resp = await resolveReference(SIMPLE2_SCHEMA)
  expect(resp).toEqual({
    "type": "array",
    "items": {
            "type": "object",
            "properties":{
                "fields":  {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            } 
        }
})
})

test('resolve correctly with test3', async () => {
  const resp = await resolveReference(SIMPLE3_SCHEMA)
  expect(resp).toEqual({
    "type": "array",
    "items": {
            "type": "object",
            "properties":{
                "fields":  {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            } 
        }
})
})