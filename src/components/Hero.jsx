import React from 'react'

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export default function Hero(){
  return (
    <section className="hero">
      <div className="hero__media">
        <img src={publicAsset('/images/id-studio-hero.png')} alt="A stylist finishing a client's hair in an editorial salon setting" />
      </div>
      <div className="hero__inner">
        <p className="hero__kicker">Hair, shape, identity</p>
        <h1 className="hero__title">id studio</h1>
        <p className="hero__spaced">"Hair should look like you meant it."</p>
      </div>
    </section>
  )
}
