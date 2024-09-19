import React from 'react'

const LayoutGlobal = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <>
      <div>{children}</div>
    </>
  )
}

export default LayoutGlobal
