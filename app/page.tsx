import React from 'react'
import { getGeoNames } from './actions'
import { TableView } from './src/components'

const page = async () => {
  const data = await getGeoNames('&limit=20') //table data

  return (
    <div className='max-Width'>
      <TableView data={data.results ?? []} />
    </div>
  )
}

export default page 