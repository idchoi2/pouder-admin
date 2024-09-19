import Sidebar from './Sidebar'

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="w-full h-screen flex space-x-10">
      <Sidebar />
      <div className="w-full grow">{children}</div>
    </main>
  )
}
