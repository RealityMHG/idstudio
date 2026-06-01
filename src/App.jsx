import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ContentSection from './components/ContentSection'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <div className="app">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <ContentSection />
      </main>
      <Footer />
    </div>
  )
}
