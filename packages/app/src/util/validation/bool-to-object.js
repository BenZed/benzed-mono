
/******************************************************************************/
// Main
/******************************************************************************/

function boolToObject (value) {

  if (value === true)
    return {}

  if (value === false)
    return null

  return value

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default boolToObject