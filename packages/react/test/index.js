import { clearConsole } from '@benzed/dev'

import { addPath } from 'module-alias'
import path from 'path'

import 'styled-components-test-utils/lib/chai'
import 'colors'

/******************************************************************************/
// Execute
/******************************************************************************/

clearConsole()
addPath(path.resolve(__dirname, '../'))

/******************************************************************************/
// Export
/******************************************************************************/
