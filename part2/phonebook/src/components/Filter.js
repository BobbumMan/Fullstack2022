import React from "react"

const Filter = ({search, handleSearchChange}) => (
    <>
      <div>
        <input value={search} onChange={handleSearchChange}/>
      </div>
    </>
)

export default Filter