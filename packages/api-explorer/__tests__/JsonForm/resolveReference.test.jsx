import resolveReference from '../../src/JsonForm/resolveReference'
import SCHEMA_BUG from './config-root-ref-and-nested.json'
import EXPECTED_SCHEMA_BUG from './config-root-ref-and-nested.expected.json'

test('resolve correctly with nested $ref', async () => {
  const resp = await resolveReference(SCHEMA_BUG)
  expect(resp).toEqual(EXPECTED_SCHEMA_BUG)
})
