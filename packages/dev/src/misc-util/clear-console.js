import { execSync } from 'child_process'

/******************************************************************************/
// Data
/******************************************************************************/

const PROCESS_CONSOLE = { stdio: [0, 1, 2] }

/******************************************************************************/
// Main
/******************************************************************************/

function clearConsole () {

  execSync('clear && printf \'\\e[3J\'', PROCESS_CONSOLE)

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default clearConsole
