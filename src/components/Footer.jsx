import React from 'react'
import BrandWordmark from './BrandWordmark'

export default function Footer(){
  return (
    <footer className="site-footer">
      <span className="footer-brand">
        <span className="sr-only">ID HAIR STUDIO</span>
        <BrandWordmark />
      </span>
      <span>Hair salon and creative studio</span>
      <nav aria-label="Social links">
        <a href="https://www.instagram.com/idstudio" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.facebook.com/idstudio" target="_blank" rel="noreferrer">Facebook</a>
      </nav>
    </footer>
  )
}
