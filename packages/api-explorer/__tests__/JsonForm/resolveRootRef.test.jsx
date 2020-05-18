import resolveRootRef from '../../src/JsonForm/resolveRootRef'
import ROOT_REF_SCHEMA from '../datatest/config-root-ref-and-nested.json'
import EXPECTED_ROOT_REF from '../datatest/config-root-ref-and-nested.expected.json'
import CIRCULAR_ROOT_SCHEMA from '../datatest/circular-on-root.json'
import MISSING_REFERENCE from '../datatest/missing-reference.json'

test('resolve correctly $ref on root', async () => {
  const resp = await resolveRootRef(ROOT_REF_SCHEMA)
  expect(resp).toEqual(EXPECTED_ROOT_REF)
})

test('circular on root throws error', async () => {
  await expect(() => resolveRootRef(CIRCULAR_ROOT_SCHEMA)).toThrowError(new Error('circular reference'))
})

test('missing reference on root throws error', async () => {
  await expect(() => resolveRootRef(MISSING_REFERENCE)).toThrowError(new Error('missing reference'))
})
