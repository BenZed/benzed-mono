import React from 'react'
import { branded, Color, GlobalStyle } from '../../themes'

import Main from './main'

/******************************************************************************/
// ReTheme
/******************************************************************************/

const exampleTheme = {
  ...branded,
  fg: new Color('#1b3147'),
  bg: new Color('#e0e1e2')
}

/******************************************************************************/
// Main
/******************************************************************************/

const Example = ({ arr }) =>
  <GlobalStyle theme={exampleTheme}>
    <Main/>
  </GlobalStyle>

/******************************************************************************/
// Exports
/******************************************************************************/

export default Example
