import copy from './copy'

/******************************************************************************/
// Main
/******************************************************************************/

function change (data, mutator) {

  if (this !== undefined) {
    mutator = data
    data = this
  }

  if (data == null || typeof data !== 'object')
    throw new Error('data must be an object')

  const copied = copy(data)

  mutator(copied)

  return copied

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default change
