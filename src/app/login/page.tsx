import GoogleLogin from '@/components/Auth/GoogleLogin'

export default async function LoginPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center p-10">
      <div className="w-80 space-y-10 text-center">
        <div className="space-y-2">
          <h1 className="font-extrabold text-2xl">Pouder</h1>
          <h2 className="text-lg">
            No more pain for <span className="text-primary">Bookmark</span>
          </h2>
        </div>
        <div>
          <GoogleLogin />
        </div>
      </div>
    </main>
  )
}
