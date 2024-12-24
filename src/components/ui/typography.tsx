import React from 'react'

interface TypographyProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'blockquote'
    | 'inlineCode'
    | 'lead'
    | 'large'
    | 'small'
    | 'caption'
    | 'muted'
  children: React.ReactNode
  className?: string
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
}) => {
  let Component: keyof JSX.IntrinsicElements = 'p'
  let typoClassName = ''

  switch (variant) {
    case 'h1':
      Component = 'h1'
      typoClassName = 'text-4xl font-bold tracking-tight lg:text-5xl'
      break
    case 'h2':
      Component = 'h2'
      typoClassName = 'text-3xl font-bold tracking-tight lg:text-4xl'
      break
    case 'h3':
      Component = 'h3'
      typoClassName = 'text-2xl font-semibold tracking-tight lg:text-3xl'
      break
    case 'h4':
      Component = 'h4'
      typoClassName = 'text-xl font-semibold tracking-tight lg:text-2xl'
      break
    case 'h5':
      Component = 'h5'
      typoClassName = 'text-lg font-semibold tracking-tight lg:text-xl'
      break
    case 'h6':
      Component = 'h6'
      typoClassName = 'text-base font-semibold tracking-tight'
      break
    case 'caption':
      Component = 'div'
      typoClassName = 'text-xs font-medium tracking-tight'
      break
    case 'p':
      Component = 'p'
      typoClassName = 'leading-7'
      break
    case 'blockquote':
      Component = 'blockquote'
      typoClassName = 'mt-6 border-l-2 pl-6 italic'
      break
    case 'lead':
      Component = 'p'
      typoClassName = 'text-xl text-muted-foreground'
      break
    case 'inlineCode':
      Component = 'code'
      typoClassName =
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
      break
    case 'large':
      Component = 'p'
      typoClassName = 'text-lg font-semibold'
      break
    case 'small':
      Component = 'small'
      typoClassName = 'text-sm font-medium leading-none'
      break
    case 'muted':
      Component = 'p'
      typoClassName = 'text-xs text-muted-foreground'
      break
    default:
      Component = 'p'
      break
  }

  return (
    <Component className={`${typoClassName} ${className ? className : ''}`}>
      {children}
    </Component>
  )
}

export default Typography
