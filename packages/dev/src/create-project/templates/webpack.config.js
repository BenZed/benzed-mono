export default ({ ui, pretty }) => ui && pretty`
const { WebpackConfig } = require('@benzed/dev')

/******************************************************************************/
// Data
/******************************************************************************/

const config = {}

/******************************************************************************/
// Exports
/******************************************************************************/

module.exports = new WebpackConfig(config)
`
