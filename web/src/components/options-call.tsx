import React from 'react'

function OptionsCall({callUser}:any) {
  return (
    <div>
      <button onClick={callUser}>
        call this user
      </button>
    </div>
  )
}

export default OptionsCall