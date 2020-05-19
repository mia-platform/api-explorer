import refReplacer from '../../src/JsonForm/refReplacer'

import anyOf from '../datatest/anyOf.json'
import anyOfExpected from '../datatest/anyOf.refReplacer.expected.json'
import simple from '../datatest/simple.json'
import simpleExpected from '../datatest/simple.refReplacer.expected.json'
import simple2 from '../datatest/simple2.json'
import simple2Expected from '../datatest/simple2.refReplacer.expected.json'
import simple3 from '../datatest/simple3.json'
import simple3Expected from '../datatest/simple3.refReplacer.expected.json'
import withNot from '../datatest/not.json'
import withNotExpected from '../datatest/not.refReplacer.expected.json'

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

    it('simple3', () => {
        expect(refReplacer(simple3)).toEqual(simple3Expected)
    })

    it('with not', () => {
        expect(refReplacer(withNot)).toEqual(withNotExpected)
    })
})