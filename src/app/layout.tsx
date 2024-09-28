import { AuthWrapper } from '@/components/AuthWrapper'
import { DashboardWrapper } from '@/components/DashboardWrapper'
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider'
import RecoilRootWrapper from '@/components/RecoilWrapper'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pouder Admin',
  description: 'Pouder Admin',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang={'ko'} className="scroll-smooth">
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ReactQueryClientProvider>
          <RecoilRootWrapper>
            <AuthWrapper user={user}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                <DashboardWrapper>
                  <AntdRegistry>{children}</AntdRegistry>
                </DashboardWrapper>
                <Toaster />
              </ThemeProvider>
            </AuthWrapper>
          </RecoilRootWrapper>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
