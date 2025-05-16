type HatIconProps = {
  color: string
  className?: string
}

export function HatIcon({ color, className = "" }: HatIconProps) {
  // Hat SVG paths for each color
  const renderHat = (color: string) => {
    switch (color) {
      case "blue":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#3b82f6"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          </svg>
        )
      case "white":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#ffffff"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />
          </svg>
        )
      case "red":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
          </svg>
        )
      case "black":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#000000"
              stroke="#374151"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#000000" stroke="#374151" strokeWidth="2" />
          </svg>
        )
      case "yellow":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          </svg>
        )
      case "green":
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 100 80" className={className}>
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#3b82f6"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          </svg>
        )
    }
  }

  return renderHat(color)
}
