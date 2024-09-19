import GoogleLogin from '@/components/Auth/GoogleLogin'
import Logo from '@/components/ui/logo'
import Typography from '@/components/ui/typography'
import { BookmarkCheck } from 'lucide-react'

export default async function LoginPage() {
  return (
    <main className="w-full h-screen flex items-center justify-center p-10">
      <div className="w-96 space-y-8 text-center">
        <div className="flex justify-center">
          <Logo className="w-14 h-14" />
        </div>
        <div className="space-y-1">
          <Typography variant="h4">No more pain for</Typography>
          <div className="flex justify-center flex-wrap space-x-2">
            <Typography variant="h4">
              <span className="flex items-center space-x-2 text-primary">
                <BookmarkCheck
                  size={24}
                  strokeWidth={3}
                  className="text-fuchsia-500"
                />
                <span className="text-fuchsia-500">bookmarks</span>
              </span>
            </Typography>
          </div>
        </div>
        <div>
          <GoogleLogin />
        </div>
      </div>
    </main>
  )
}
