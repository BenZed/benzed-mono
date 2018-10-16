
/******************************************************************************/
// Data
/******************************************************************************/

const ROOT = Symbol('root-type')

/******************************************************************************/
// Main
/******************************************************************************/

class Type {

  static ROOT = ROOT

  constructor (type = null) {
    this[ROOT] = type
  }

  compile () {
    return []
  }

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default Type
