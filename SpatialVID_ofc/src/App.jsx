import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Research from './components/Research'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  useEffect(() => {
    // 初始化Lenis平滑滚动
    const lenis = new Lenis({
      duration: 0.15,
      easing: (t) => t,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.2,
      smoothTouch: false,
      touchMultiplier: 2.0,
      infinite: false,
      normalizeWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Features />
      {/* <Research /> */}
      <Contact />
      <Footer />
    </div>
  )
}

export default App