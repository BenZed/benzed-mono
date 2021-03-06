import Color from './color'

/******************************************************************************/
// Doc
/******************************************************************************/

const fontStack = `'Helvetica Neue', 'Lucida Grande', sans-serif`

/******************************************************************************/
// Data
/******************************************************************************/

export default {

  bg: Color('black'),
  fg: Color('white'),

  fonts: {
    title: fontStack,
    body: fontStack,
    mono: 'monospace'
  }

}
