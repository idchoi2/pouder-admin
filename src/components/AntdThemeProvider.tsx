'use client'

import { ConfigProvider, theme } from 'antd'
import koKr from 'antd/locale/ko_KR'
import { ReactNode } from 'react'

function AntdThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={koKr}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: 'hsl(var(--background))',
          colorBorder: 'hsl(var(--border))',
          colorBorderSecondary: 'hsl(var(--border))',
          colorLink: 'hsl(var(--primary))',
          colorLinkActive: 'hsl(var(--accent))',
          colorText: 'hsl(var(--foreground))',
        },
        components: {
          Table: {
            headerBg: 'hsl(var(--background))',
            rowHoverBg: 'hsl(var(--accent))',
            borderColor: 'hsl(var(--border))',
            colorText: 'hsl(var(--foreground))',
            headerColor: 'hsl(var(--foreground))',
            colorPrimary: 'hsl(var(--primary))',
          },
          Pagination: {
            itemBg: 'hsl(var(--background))',
            // itemActiveBg: 'hsl(var(--primary))',
          },
          Spin: {
            colorBgBase: 'hsl(var(--accent))',
            colorText: 'hsl(var(--foreground))',
            colorPrimary: 'hsl(var(--primary))',
          },
        },
      }}>
      {children}
    </ConfigProvider>
  )
}

export default AntdThemeProvider
