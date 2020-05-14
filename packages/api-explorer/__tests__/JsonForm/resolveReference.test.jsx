import resolveReference from '../../src/JsonForm/resolveReference'
import SCHEMA_BUG from '../datatest/config-root-ref-and-nested.json'
import EXPECTED_SCHEMA_BUG from '../datatest/config-root-ref-and-nested.expected.json'
import CIRCULAR_SCHEMA from '../datatest/circular-on-root.json'
import MISSING_REFERENCE from '../datatest/missing-reference.json'

test('resolve correctly with nested $ref', async () => {
  const resp = await resolveReference(SCHEMA_BUG)
  expect(resp).toEqual(EXPECTED_SCHEMA_BUG)
})

test('circular on root throws error', async () => {
  await expect(resolveReference(CIRCULAR_SCHEMA)).rejects.toEqual(new Error('circular reference'))
})

test('missing reference on root throws error', async () => {
  await expect(resolveReference(MISSING_REFERENCE)).rejects.toEqual(new Error('missing reference'))
})
