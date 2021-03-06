import { clearConsole } from '@benzed/dev'

import { addPath } from 'module-alias'
import path from 'path'

import 'colors'

/******************************************************************************/
// Execute
/******************************************************************************/

process.env.NODE_ENV = 'test'
clearConsole()
addPath(path.resolve(__dirname, '../'))

/******************************************************************************/
// Export
/******************************************************************************/
