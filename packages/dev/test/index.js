import { clearConsole } from '../src'
import { addPath } from 'module-alias'
import path from 'path'

/******************************************************************************/
// Setup
/******************************************************************************/

addPath(path.join(__dirname, '../'))
clearConsole()
