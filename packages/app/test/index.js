import { clearConsole, TestApi, TestClient } from '@benzed/dev'
import { addPath } from 'module-alias'
import path from 'path'

/* global */

/******************************************************************************/
// Env
/******************************************************************************/

if (process.env.NODE_ENV !== 'test')
  process.env.NODE_ENV = 'test'

/******************************************************************************/
// Global
/******************************************************************************/

clearConsole()
addPath(path.resolve(__dirname, '../'))

global.TestApi = TestApi
global.TestClient = TestClient

/******************************************************************************/
// Export
/******************************************************************************/
