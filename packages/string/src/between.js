
/******************************************************************************/
// Main
/******************************************************************************/

/**
 * Gets a substring between the two given markers.
 *
 * @param  {string} str        Source string.
 * @param  {string} open       Open marker.
 * @param  {string} close=open Close marker.
 *
 * @return {string}            Substring of the source between the two markers.
 * @return {null}              If nothing could be found.
 */
function between (str, open, close = open) {

  if (this !== undefined) {
    close = open || str
    open = str
    str = this
  }

  if (typeof str !== 'string')
    throw new Error('between() must be called on a string')

  if (!open || typeof open !== 'string' || !close || typeof close !== 'string')
    throw new Error('delimeters must be non-empty strings')

  const openIndex = str.indexOf(open)
  if (openIndex === -1)
    return null

  let closeIndex = str.substr(openIndex + open.length).indexOf(close)
  if (closeIndex === -1)
    return null

  closeIndex += open.length

  return str.substr(openIndex, closeIndex + close.length)

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default between
