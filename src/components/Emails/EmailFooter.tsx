function EmailFooter() {
  return (
    <div
      style={{
        padding: '20px 0',
      }}>
      © {new Date().getFullYear()}{' '}
      <a href={process.env.NEXT_PUBLIC_URL} target="_blank">
        Pouder
      </a>
    </div>
  )
}

export default EmailFooter
