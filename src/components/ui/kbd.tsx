import React from 'react'

const Kbd = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <kbd
      className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground opacity-100 ${
        className ? className : ''
      }`}>
      {children}
    </kbd>
  )
}

export { Kbd }
