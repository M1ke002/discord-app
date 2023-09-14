import React from 'react'

//this layout will be applied to all pages (routes) in this folder (auth)
const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='bg-red-500'>{children}</div>
  )
}

export default layout