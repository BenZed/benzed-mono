import Color from 'color'

import { $$copy, $$equals, equals } from '@benzed/immutable'

// TODO Build this

/******************************************************************************/
// Main
/******************************************************************************/
//
// class Color {
//
//   r = 0
//   g = 0
//   b = 0
//   a = 1
//
//   toString () {
//
//     const { r, g, b, a } = this
//
//     return a < 1
//       ? `rgba(${r}, ${g}, ${b}, ${a})`
//       : `rgb(${r}, ${g}, ${b})`
//
//   }
//
// }

Color.prototype[$$copy] = function () {
  return new Color([...this.color])
}

Color.prototype[$$equals] = function (b) {
  return b instanceof Color && equals(this.color, b.color)
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default Color
