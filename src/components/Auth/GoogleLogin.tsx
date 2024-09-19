'use client'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function GoogleLogin() {
  const supabase = createClient()

  /**
   * Login with Google
   */
  const loginWithGoogle = async () => {
    // query params' next
    const next = new URLSearchParams(window.location.search).get('next')

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${location.origin}/auth/callback${
          next ? `?next=${next}` : ''
        }`,
      },
    })
  }

  return (
    <div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          loginWithGoogle()
        }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.0026 2C5.58327 2 2 5.582 2 10C2 14.418 5.58327 18 10.0026 18C16.6759 18 18.1794 11.8047 17.5534 8.66667H16.6667H15.1549H10V11.3333H15.1589C14.5658 13.6322 12.484 15.3333 10 15.3333C7.05467 15.3333 4.66667 12.9453 4.66667 10C4.66667 7.05467 7.05467 4.66667 10 4.66667C11.3393 4.66667 12.5594 5.16383 13.4961 5.97917L15.3906 4.08594C13.968 2.78994 12.0779 2 10.0026 2Z"
            className="fill-white dark:fill-black"
          />
        </svg>
        <span className="ml-2">Start with Google</span>
      </Button>
    </div>
  )
}
