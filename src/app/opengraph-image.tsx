import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F7F5',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 72, color: '#1C1C1A', fontWeight: 300, letterSpacing: '-1px' }}>
          Jack Hanan
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            color: '#6B6B66',
            letterSpacing: '6px',
            textTransform: 'uppercase',
          }}
        >
          Portfolio
        </div>
      </div>
    ),
    { ...size }
  )
}
