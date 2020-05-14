import refReplacer from '../../src/JsonForm/refReplacer'

import anyOf from '../datatest/anyOf.json'
import anyOfExpected from '../datatest/anyOf.refReplacer.expected.json'
import simple from '../datatest/simple.json'
import simpleExpected from '../datatest/simple.refReplacer.expected.json'
import simple2 from '../datatest/simple2.json'
import simple2Expected from '../datatest/simple2.refReplacer.expected.json'

describe('refReplacer', () => {
    it('anyOf', () => {
        expect(refReplacer(anyOf)).toEqual(anyOfExpected)
    })
    it('simple', () => {
        expect(refReplacer(simple)).toEqual(simpleExpected)
    })
    it('simple2', () => {
        expect(refReplacer(simple2)).toEqual(simple2Expected)
    })
})