import React from 'react'
import styled from 'styled-components'

import Page from './page'
import { PropTypeSchema, object, required } from '@benzed/schema'

import $ from '../../theme'

/******************************************************************************/
// Styled
/******************************************************************************/

const MissingPage = Page.extend`
  margin: 1em;
`

const Band = styled.h1`

  background-color: ${$.theme.brand.primary};
  color: ${$.theme.brand.primary.darken(0.5)};

  h2 {
    font-size: 2.5em;
    margin-left: 0.5em;
  }

  padding: 0.25em;
`

/******************************************************************************/
// Main Component
/******************************************************************************/

const Missing = ({ location }) =>
  <MissingPage>
    <Band>
      PAGE NOT FOUND
    </Band>
    <br/>
    <h2>{location.pathname} is not a valid page.</h2>
  </MissingPage>

/******************************************************************************/
// Prop Types
/******************************************************************************/

Missing.propTypes = new PropTypeSchema({
  location: object(required)
})

/******************************************************************************/
// Exports
/******************************************************************************/

export default Missing
