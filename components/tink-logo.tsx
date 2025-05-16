import Image from "next/image"

interface TinkLogoProps {
  size?: number
  className?: string
}

export function TinkLogo({ size = 60, className = "" }: TinkLogoProps) {
  // Calculate height based on the aspect ratio of the original image (approximately 1:1)
  const height = size

  return (
    <div className={className}>
      <Image src="/tink-logo.png" alt="Tink Logo" width={size} height={height} priority />
    </div>
  )
}
