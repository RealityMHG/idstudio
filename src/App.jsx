import React, { useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ContentSection from './components/ContentSection'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import useEditorialMotion from './hooks/useEditorialMotion'

export default function App() {
  const mainRef = useRef(null)
  useEditorialMotion(mainRef)
  return (
    <div className="app">
      <CustomCursor />
      <Header />
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <Hero />
        <ContentSection />
      </main>
      <Footer />
    </div>
  )
}
