import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #0f1729 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 배경 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '200px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          }}
        />

        {/* 콘텐츠 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            padding: '0 100px',
            width: '100%',
          }}
        >
          {/* 로고 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={140}
            height={140}
            style={{ borderRadius: '28px', flexShrink: 0 }}
            alt="Business AI Team Logo"
          />

          {/* 구분선 */}
          <div
            style={{
              width: '2px',
              height: '160px',
              background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.5), transparent)',
              flexShrink: 0,
            }}
          />

          {/* 텍스트 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-1px',
              }}
            >
              Business AI Team
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#71717a',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              마케팅 · 재무 · 법무 · HR · 개발
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                }}
              />
              <span style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 500 }}>
                AI 전문가 팀과 함께하는 비즈니스 어시스턴트
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
