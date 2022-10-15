import Image from 'next/image'
import React, { useState } from 'react'

interface Props {
  style: string
  href: string
  src: string
  srcHovered: string
  title: string
}

const footerImageWidth = 20
const footerImageHeight = 20

const FooterLogo = ({ style, href, src, srcHovered, title }: Props) => {
  const [isHovering, setIsHovered] = useState(false)
  const onMouseEnter = () => setIsHovered(true)
  const onMouseLeave = () => setIsHovered(false)
  return (
    <div className={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <a target="_blank" href={href} rel="noopener noreferrer">
        {isHovering ? (
          <Image src={srcHovered} width={footerImageWidth} height={footerImageHeight} alt="logo" />
        ) : (
          <Image src={src} width={footerImageWidth} height={footerImageHeight} alt="logo" />
        )}
        <p>{title}</p>
      </a>
    </div>
  )
}

export default FooterLogo
