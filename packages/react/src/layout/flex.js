import React from 'react'
import styled from 'styled-components'
import { createPropTypesFor } from '@benzed/schema'
import is from 'is-explicit'

/******************************************************************************/
//
/******************************************************************************/

const wrap = ({ wrap }) =>
  wrap === 'reverse'
    ? 'wrap-reverse'
    : wrap
      ? 'wrap'
      : 'nowrap'

/******************************************************************************/
// Main Components
/******************************************************************************/

const Flex = styled.div.attrs({
  style: ({ basis, grow, shrink, justify, items, content, self }) => Object({
    flexGrow: grow,
    flexShrink: shrink,
    flexBasis: is.number(basis) ? `${basis}em` : basis,
    justifyContent: justify,
    alignItems: items,
    alignContent: content,
    alignSelf: self
  })
})`
  display: flex;
  flex-wrap: ${wrap};
`

Flex.propTypes = createPropTypesFor(React => <proptypes>
  <multi key='grow'>
    <string/>
    <number/>
  </multi>

  <multi key='shrink'>
    <string/>
    <number/>
  </multi>

  <multi key='basis'>
    <string />
    <number />
  </multi>

  <value key='wrap'>
    {true}{false}{'reverse'}
  </value>

  <value key='justify'>
    flex-start flex-end center space-between space-around initial inherit
  </value>

  <value key='items'>
    stretch center flex-start flex-end baseline initial inherit
  </value>

  <value key='content'>
    stretch center flex-start flex-end space-between space-around initial inherit
  </value>

  <value key='self'>
    auto stretch center flex-start flex-end baseline initial inherit
  </value>
</proptypes>)

Flex.Column = styled(Flex)`
  flex-direction: column;
`

Flex.Row = styled(Flex)`
  flex-direction: row;
`

/******************************************************************************/
// Exports
/******************************************************************************/

export default Flex
