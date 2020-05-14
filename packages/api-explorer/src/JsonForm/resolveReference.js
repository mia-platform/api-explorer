import {dereference} from 'reftools/lib/dereference'
import {omit} from 'ramda'

import resolveRootRef from './resolveRootRef'



export default async function resolveReference (schema) {
  const resolvedRoot = resolveRootRef(schema)
  try {
    console.log('I AM NEW')
    // const convertedAgain = await parser.dereference(resolvedRoot, {dereference: {circular: false}})
    const convertedAgain = dereference(resolvedRoot)
    console.log('converted correct ', convertedAgain)
    return omit(['components'], convertedAgain)
  }catch(err) {
    console.log(err)
    throw err
    // return refReplacer(schema)
  }
}