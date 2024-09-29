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
          colorPrimary: 'hsl(var(--primary))',
          colorBgContainer: 'hsl(var(--background))',
          colorBorder: 'hsl(var(--border))',
          colorBorderSecondary: 'hsl(var(--border))',
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
