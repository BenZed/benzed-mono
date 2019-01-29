import React from 'react'

/******************************************************************************/
// Main Component
/******************************************************************************/

const Values = ({ children, ...props }) =>
  <div {...props}>
    value-picker: {props.value}
  </div>

/******************************************************************************/
// Exports
/******************************************************************************/

export default Values