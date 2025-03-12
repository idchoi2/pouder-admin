import GoogleLogin from '@/components/Auth/GoogleLogin'
import LogoText from '@/components/ui/logo-text'

export default async function LoginPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center p-10">
      <div className="w-80 space-y-10 text-center">
        <div className="space-y-2">
          <div className="space-x-4 flex items-center justify-center">
            <div className="flex justify-center">
              <LogoText className="w-40 h-20" />
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
