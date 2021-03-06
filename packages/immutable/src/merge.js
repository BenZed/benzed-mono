import copy from './copy'
import is from 'is-explicit'

import { $$circular } from './symbols'

/******************************************************************************/
// Helper
/******************************************************************************/

function mergeMutate (a, b) {

  const isAObject = is.plainObject(a)
  const isBObject = is.plainObject(b)

  // TODO untested
  const bIsCircular = b === $$circular
  if (bIsCircular)
    return a

  if (!isAObject || !isBObject)
    return b

  for (const key in b)
    a[key] = mergeMutate(a[key], b[key])

  return a
}

/******************************************************************************/
// Main
/******************************************************************************/

/**
 * merge - Description
 *
 * @param {type} a Description
 * @param {type} b Description
 *
 * @return {type} Description
 */
function merge (a, b) {

  if (this !== undefined) {
    b = a
    a = this
  }

  a = copy(a)
  b = copy(b)

  return mergeMutate(a, b)
}

/******************************************************************************/
// Exports
/******************************************************************************/

merge.mut = mergeMutate

export default merge
