import resolveReference from '../../src/JsonForm/resolveReference'
import SCHEMA_BUG from './resolve-reference-schema-bug.json'
import EXPECTED_SCHEMA_BUG from './resolve-reference-schema-bug.expected.json'

test('resolve correctly', async () => {
  const resp = await resolveReference(SCHEMA_BUG)
  expect(resp).toEqual(EXPECTED_SCHEMA_BUG)
})
