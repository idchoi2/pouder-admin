export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`invert dark:invert-0 ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="185" cy="185" r="169" stroke="#FAFAFA" stroke-width="32" />
        <circle cx="327" cy="327" r="169" stroke="#FAFAFA" stroke-width="32" />
        <circle cx="185" cy="185" r="110" fill="#FAFAFA" />
      </svg>
    </div>
  )
}
