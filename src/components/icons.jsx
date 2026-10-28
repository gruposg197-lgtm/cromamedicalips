function Svg({ size = 20, children, viewBox = '0 0 24 24', ...rest }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export function IconCheck({ size, color = 'currentColor', strokeWidth = 2.2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  )
}

export function IconHeart({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  )
}

export function IconUser({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  )
}

export function IconUsers({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  )
}

export function IconShield({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  )
}

export function IconProgress({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </Svg>
  )
}

export function IconPhone({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  )
}

export function IconMail({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </Svg>
  )
}

export function IconClock({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Svg>
  )
}

export function IconMapPin({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  )
}

export function IconDownload({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </Svg>
  )
}

export function IconEye({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function IconEdit({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  )
}

export function IconKey({ size, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Svg size={size} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </Svg>
  )
}

export function IconPause({ size, color = 'currentColor' }) {
  return (
    <Svg size={size}>
      <rect x="6" y="5" width="4" height="14" rx="1" fill={color} />
      <rect x="14" y="5" width="4" height="14" rx="1" fill={color} />
    </Svg>
  )
}

export function IconPlay({ size, color = 'currentColor' }) {
  return (
    <Svg size={size}>
      <path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5z" fill={color} />
    </Svg>
  )
}

export function IconCloud({ size = 20, color = '#1d5fbf' }) {
  return (
    <Svg size={size}>
      <path d="M6.5 19h11a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.6 10.2 4 4 0 0 0 6.5 19z" fill={color} />
    </Svg>
  )
}
