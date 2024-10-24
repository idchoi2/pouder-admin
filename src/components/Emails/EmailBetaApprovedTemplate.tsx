import { LINK_CHROME_EXTENSION, LINK_DISCORD } from '@/configs'
import * as React from 'react'
import EmailFooter from './EmailFooter'

interface EmailBetaApprovedTemplateProps {
  name: string
}

export const EmailBetaApprovedTemplate: React.FC<
  Readonly<EmailBetaApprovedTemplateProps>
> = ({ name }) => (
  <div>
    <div>
      <p>안녕하세요, {name}님!</p>
      <p>
        Pouder에 가입하신 것을 축하드립니다! Neon Genesis Bookmarking 서비스를
        경험하실 수 있어서 기쁩니다.
      </p>
      <p>
        Pouder 계정이 성공적으로 생성되었으며, 아래 링크를 통해 지금 바로
        서비스를 사용하실 수 있습니다.
      </p>
      <p>
        지금 시작하세요:{' '}
        <a href="https://pouder.site/login">https://pouder.site/login</a>
      </p>
      <p>
        크롬 익스텐션 설치를 통해 더욱 편리하게 Pouder를 사용하실 수 있습니다.
        <a href={LINK_CHROME_EXTENSION}>크롬 익스텐션 다운로드</a>
      </p>
      <p>
        서비스 사용 중에 질문이 있거나 피드백을 남기고 싶으시면 Discord에서
        언제든지 문의해 주세요: <a href={LINK_DISCORD}>{LINK_DISCORD}</a>
      </p>
      <p>감사합니다.</p>
      <p>Team Pouder</p>
    </div>
    <EmailFooter />
  </div>
)
