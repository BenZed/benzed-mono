import { get } from '@benzed/immutable'

import basicTheme from '../themes/basic'
import is from 'is-explicit'

/******************************************************************************/
// DATA
/******************************************************************************/

const STACK = Symbol('stack-of-style-methods-and-params')

const STYLE = Symbol('create-style-value-from-stack-methods')

/******************************************************************************/
// Stack Functions
/******************************************************************************/

function getPropAtPath (path, value, props) {
  return get.mut(props, path)
}

function applyMutator (mutator, value, props) {
  return mutator(value, props)
}

/******************************************************************************/
// Helper
/******************************************************************************/

function extendStylerWithTheme (Styler, theme) {

  return class ThemedStyler extends Styler {

    // add style getter logic here

    get theme () {
      return null
    }

  }
}

function StylerInterface (Styler) {

  if (this instanceof StylerInterface === false)
    return new StylerInterface(Styler)

  const names = new Set()

  let { prototype } = Styler
  while (prototype !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(prototype))
      if (name in this === false)
        names.add(name)

    prototype = Object.getPrototypeOf(prototype)
  }

  for (const name of names)
    Object.defineProperty(this, name, {
      enumerable: true,
      configurable: false,
      get () {
        const styler = new Styler()
        const value = styler[name]
        return is.func(value)
          ? styler::value
          : value
      }
    })

}

/******************************************************************************/
// Main
/******************************************************************************/

class Styler {

  static createInterface (theme) {

    const Styler = theme
      ? extendStylerWithTheme(this, theme)
      : this

    return new StylerInterface(Styler, theme)
  }

  // Style Manipulators

  prop (...path) {

    if (path.length === 0)
      throw new Error('Provide at least one string argument as a path.')

    if (!path.every(is.string))
      throw new Error('Path arguments must all be strings.')

    this[STACK].push(getPropAtPath, path)

    return this
  }

  mut (mutator) {

    if (!is.func(mutator))
      throw new Error('Mutator must be a function.')

    this[STACK].push(applyMutator, mutator)

    return this
  }

  // Style Compilation

  toString () {
    return this[STYLE]
  }

  valueOf () {
    return this[STYLE]
  }

  [STYLE] = props => {

    let value

    const { funcs, params } = this[STACK]

    for (let i = 0; i < funcs.length; i++) {
      const func = funcs[i]
      const param = params[i]

      value = func(param, value, props)
    }

    return value
  }

  [STACK] = {
    funcs: [],
    params: [],
    push (func, param) {
      this.funcs.push(func)
      this.params.push(param)
    }
  }
}

/******************************************************************************/
// Basic Theme Interface
/******************************************************************************/

const $ = Styler.createInterface(basicTheme)

/******************************************************************************/
// Exports
/******************************************************************************/

export default Styler

export {
  Styler,
  $
}
