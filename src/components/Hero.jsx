import React from 'react'
import BrandWordmark from './BrandWordmark'

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export default function Hero(){
  return (
    <section className="hero">
      <div className="hero__media">
        <img src={publicAsset('/images/id-studio-hero.png')} alt="A stylist finishing a client's hair in an editorial salon setting" width="1774" height="887" fetchPriority="high" decoding="async" />
      </div>
      <div className="hero__inner">
        <p className="hero__kicker">Hair, shape, identity</p>
        <h1 className="hero__title" aria-label="ID HAIR STUDIO">
          <span className="sr-only">ID HAIR STUDIO</span>
          <BrandWordmark />
        </h1>
        <p className="hero__spaced">"Hair should look like you meant it."</p>
      </div>
    </section>
  )
}
