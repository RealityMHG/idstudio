import React from 'react'

export default function Header(){
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="id studio home">id studio</a>
      <nav>
        <a href="#studio">Studio</a>
        <a href="#lookbook">Lookbook</a>
        <a href="#services">Services</a>
        <a href="#booking">Book</a>
      </nav>
    </header>
  )
}
