import React from 'react'
import BrandWordmark from './BrandWordmark'
import SalonImage from './SalonImage'
import { salonImages } from '../content/salonImages'

export default function Hero(){
  return (
    <section className="hero" data-scroll-scene="cover">
      <div className="hero__media">
        <SalonImage image={salonImages.hero} sizes="(max-width: 780px) 72vw, (max-width: 1024px) 65vw, 52vw" priority />
      </div>
      <div className="hero__inner">
        <p className="hero__kicker"><span>Hair, shape, identity</span></p>
        <h1 className="hero__title" aria-label="ID HAIR STUDIO">
          <span className="sr-only">ID HAIR STUDIO</span>
          <span className="hero__brand-mask"><BrandWordmark /></span>
        </h1>
        <p className="hero__spaced"><span>“Hair should look </span><span>like you meant it.”</span></p>
        <a className="hero__scroll" href="#studio"><span>Explore the studio</span><span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}
