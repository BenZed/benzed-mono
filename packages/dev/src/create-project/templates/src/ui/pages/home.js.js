
export default ({ ui, name, routing, pretty }) => ui && routing && pretty`
import React from 'react'
import Page from './page'

/******************************************************************************/
// Main Component
/******************************************************************************/

const Home = ({ children, ...props }) =>
  <Page>
    ${name} home page
  </Page>

/******************************************************************************/
// Exports
/******************************************************************************/

export default Home
`
