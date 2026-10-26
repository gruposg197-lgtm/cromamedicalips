export function LogoMark({ color = '#020b4c', size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <line x1="29" y1="12" x2="15" y2="23" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="15" y1="24" x2="26" y2="39" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="30" cy="10" r="7" fill={color} />
      <circle cx="13" cy="24" r="8" fill={color} />
      <circle cx="27" cy="40" r="6" fill={color} />
      <circle cx="40" cy="27" r="5" fill={color} />
    </svg>
  )
}

export default function Logo({ dark = false, size = 32 }) {
  const mark = dark ? '#ffffff' : '#020b4c'
  const title = dark ? '#ffffff' : '#020b4c'
  const subtitle = dark ? '#a0dcff' : '#1d289c'

  return (
    <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <LogoMark color={mark} size={size} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.02em', color: title }}>CROMA MEDICAL</div>
        <div style={{ fontWeight: 500, fontSize: 8, letterSpacing: '0.4em', color: subtitle, marginTop: 3 }}>
          SALUD INTEGRAL
        </div>
      </div>
    </div>
  )
}
