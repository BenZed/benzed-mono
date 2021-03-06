import styled from 'styled-components'

import { Visible } from './visible'
import { CssCloner } from '../util/cloner'

import { createPropTypesFor } from '@benzed/schema'

/******************************************************************************/
// RegExp
/******************************************************************************/

const TOP = /top/i
const BOT = /bottom/i
const LEFT = /left/i
const RIGHT = /right/i

const UNIT = /(em|%|vw|vh|px)$/

/******************************************************************************/
// Css Func
/******************************************************************************/

const translateInOut = props => {

  const { visibility: vis, from, to } = props

  if (vis === 'shown')
    return

  const dir = vis === 'hiding'
    ? to || from || 'bottom'
    : from || to || 'top'

  let [ x, y ] = dir.split(' ')

  if (LEFT.test(dir))
    x = '-100%'
  else if (RIGHT.test(dir))
    x = '100%'

  if (TOP.test(dir))
    y = '-100%'
  else if (BOT.test(dir))
    y = '100%'

  if (!UNIT.test(x))
    x = '0%'

  if (!UNIT.test(y))
    y = '0%'

  return {
    // ...style,
    transform: `translate(${x}, ${y})`
  }

}

/******************************************************************************/
// Effect
/******************************************************************************/

const Slide = styled(CssCloner).attrs(props => ({
  style: translateInOut(props)
}))`
  transition: transform 250ms;
`::Visible.nest(false)

Slide.propTypes = createPropTypesFor(React => <proptypes>
  <string key='from' />
  <string key='to' />
</proptypes>)

/******************************************************************************/
// Exports
/******************************************************************************/

export default Slide
