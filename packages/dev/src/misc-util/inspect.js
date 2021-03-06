import { inspect as _inspect } from 'util'

/******************************************************************************/
// Main
/******************************************************************************/

function inspect (strings, ...params) {

  let str = ''
  for (let i = 0; i < strings.length; i++) {
    str += strings[i]
    if (i < params.length) {
      const param = params[i]
      str += typeof param === 'object' && param !== null && 'toString' in param
        ? param.toString()
        : _inspect(params[i])
    }
  }

  return str
}

inspect.log = (strings, ...params) =>
  console.log(inspect(strings, ...params))

/******************************************************************************/
// Exports
/******************************************************************************/

export default inspect
