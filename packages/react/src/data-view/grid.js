import styled from 'styled-components'

import GridCell from './grid-cell'
import Virtual from './virtual'

/******************************************************************************/
// Main Components
/******************************************************************************/

const Grid = styled(Virtual)``

/******************************************************************************/
// Extends
/******************************************************************************/

Grid.Cell = GridCell

/******************************************************************************/
// Exports
/******************************************************************************/

export default Grid
