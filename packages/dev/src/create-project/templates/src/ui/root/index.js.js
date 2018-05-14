import { capitalize } from '@benzed/string'

/******************************************************************************/
// Exports
/******************************************************************************/

export default ({ frontend, ui, pretty }) => ui &&

pretty`import ${frontend::capitalize()} from './${frontend}'

/******************************************************************************/
// Exports
/******************************************************************************/

export default ${frontend::capitalize()}
`