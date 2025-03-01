import React from 'react'

function SearchBar({categories,onCategoryChange}) {
  return (
    <div className='search-bar'>
        <label htmlFor='category-filter display-4'>Filter by Category: </label>
        <select id='category-filter' onChange={(e)=>onCategoryChange(e.target.value)} >
            <option value="">All Categories</option>
            {
                categories.map((category)=>(
                    <option key={category} value={category}>{category}</option>
                ))
            }
        </select>

    </div>
  )
}

export default SearchBar