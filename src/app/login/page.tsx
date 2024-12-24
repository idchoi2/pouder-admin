import GoogleLogin from '@/components/Auth/GoogleLogin'
import Logo from '@/components/ui/logo'
import Typography from '@/components/ui/typography'

export default async function LoginPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center p-10">
      <div className="w-80 space-y-10 text-center">
        <div className="space-y-2">
          <div className="space-x-4 flex items-center justify-center">
            <div className="flex justify-center">
              <Logo className="w-8 h-8" />
            </div>
            <div className="flex justify-center">
              <Typography variant="h2" className="!font-extrabold">
                Pouder
              </Typography>
            </div>
          </div>
        </div>
        <div>
          <GoogleLogin />
        </div>
      </div>
    </main>
  )
}
