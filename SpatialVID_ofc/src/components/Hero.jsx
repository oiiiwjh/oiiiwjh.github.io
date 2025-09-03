import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import gsap from 'gsap'
import githubLogo from '../logo/github.svg'
import huggingfaceLogo from '../logo/huggingface-color.svg'
import arxivLogo from '../logo/arxiv-logomark-small.svg'
import spatialLogo from '../logo/spatial.png'

// 字符分割组件
const CharHighlight = ({ text, className }) => {
  return (
    <span className={`char-highlight ${className}`}>
      {text.split('').map((char, index) => (
        <span key={index} className="char">
          {char}
        </span>
      ))}
    </span>
  )
}

const AnimatedSphere = () => {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#0071e3"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  )
}

const Hero = () => {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.8'
    )
    .fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )

    // 鼠标移动视差效果
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const xPos = (clientX / innerWidth - 0.5) * 20
      const yPos = (clientY / innerHeight - 0.5) * 20
      
      gsap.to(titleRef.current, {
        x: xPos,
        y: yPos,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const scrollToNext = () => {
    const nextSection = document.querySelector('#about')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景3D场景 */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* 背景 */}
      <div className="absolute inset-0 z-10" style={{ backgroundColor: '#eef5ff' }} />
      
      {/* 主要内容 */}
      <div className="relative z-20 text-center px-6 py-16 w-full max-w-none mx-auto lg:max-w-7xl xl:max-w-none 2xl:max-w-none">
        <motion.h1
          ref={titleRef}
          className="flex items-center justify-center gap-4 text-5xl sm:text-5xl md:text-7xl lg:text-9xl xl:text-11xl 2xl:text-14xl font-bold mb-10 leading-tight"
          initial={{ opacity: 0 }}
        >
          <img 
            src={spatialLogo} 
            alt="SpatialVID Logo" 
            className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36"
          />
          <CharHighlight text="SpatialVID" />
        </motion.h1>
        
        <motion.p
          ref={subtitleRef}
          className="text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl text-black mb-12 max-w-[60vw] mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {/* A Large-Scale Dynamic Video Dataset with Explicit Geometric Metadata and Structured Spatiotemporal Captions */}
          A Large-Scale Video Dataset with 3D Annotation
        </motion.p>
        
        <motion.div
          ref={heroRef}
          className="text-2xl md:text-md lg:text-xl xl:text-2xl 2xl:text-3xl text-black mb-16 max-w-[75vw] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="mb-3">
            John Smith<sup>1</sup>, Emily Chen<sup>2</sup>, Michael Johnson<sup>1</sup>, Sarah Williams<sup>3</sup>
          </div>
          <div className="text-lg leading-relaxed">
            <sup>1</sup>Stanford University, <sup>2</sup>MIT Computer Science and Artificial Intelligence Laboratory, <sup>3</sup>Carnegie Mellon University
          </div>
        </motion.div>
        
        <motion.div
          ref={ctaRef}
          className="flex flex-col gap-8 justify-center items-center"
          initial={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 113, 227, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToNext}
              className="apple-button text-xl md:text-md lg:text-lg xl:text-xl 2xl:text-3xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-550 hover:to-teal-550 text-gray-700"
            >
              Explore Project
            </motion.button>
            
            <motion.a
                 href="https://www.google.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="inline-block text-xl md:text-md lg:text-md xl:text-xl 2xl:text-3xl px-6 py-3 text-gray-700 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
                 style={{
                   backgroundColor: '#d3e8fd',
                   borderColor: '#d3e8fd',
                   border: '2px solid #d3e8fd'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = '#c2ddf8'
                   e.currentTarget.style.borderColor = '#b4daff'
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = '#d3e8fd'
                   e.currentTarget.style.borderColor = '#d3e8fd'
                 }}
               >
                 Download Dataset
               </motion.a>
          </div>
          
          {/* 外部链接按钮 */}
           <div className="flex flex-wrap gap-4 justify-center items-center">
             <motion.a
               href="https://github.com/NJU-3DV/spatialVID"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               className="flex items-center gap-2 px-4 py-2 text-sm md:text-sm lg:text-md xl:text-lg 2xl:text-2xl text-gray-700 rounded-lg font-medium transition-all duration-300 text-base hover:shadow-md"
               style={{
                 backgroundColor: '#d3e8fd',
                 borderColor: '#d3e8fd',
                 border: '1px solid #d3e8fd'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#c2ddf8'
                 e.currentTarget.style.borderColor = '#b4daff'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = '#d3e8fd'
                 e.currentTarget.style.borderColor = '#d3e8fd'
               }}
             >
               <img src={githubLogo} alt="GitHub" className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-7 2xl:h-7" />
               GitHub
             </motion.a>
             
             <motion.a
               href="https://huggingface.co/SpatialVid"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               className="flex items-center gap-2 px-4 py-2 text-sm md:text-sm lg:text-md xl:text-lg 2xl:text-2xl text-gray-700 rounded-lg font-medium transition-all duration-300 text-base hover:shadow-md"
               style={{
                 backgroundColor: '#d3e8fd',
                 borderColor: '#d3e8fd',
                 border: '1px solid #d3e8fd'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#c2ddf8'
                 e.currentTarget.style.borderColor = '#b4daff'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = '#d3e8fd'
                 e.currentTarget.style.borderColor = '#d3e8fd'
               }}
             >
               <img src={huggingfaceLogo} alt="HuggingFace" className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-7 2xl:h-7" />
               HuggingFace
             </motion.a>
             
             <motion.a
               href="https://www.overleaf.com/project/6865206aea2b8c252a516de3"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.95 }}
               className="flex items-center gap-2 px-4 py-2 text-sm md:text-sm lg:text-md xl:text-lg 2xl:text-2xl text-gray-700 rounded-lg font-medium transition-all duration-300 text-base hover:shadow-md"
               style={{
                 backgroundColor: '#d3e8fd',
                 borderColor: '#d3e8fd',
                 border: '1px solid #d3e8fd'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = '#c2ddf8'
                 e.currentTarget.style.borderColor = '#b4daff'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = '#d3e8fd'
                 e.currentTarget.style.borderColor = '#d3e8fd'
               }}
             >
               <img src={arxivLogo} alt="arXiv" className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-7 2xl:h-7" />
               arXiv
             </motion.a>
           </div>
        </motion.div>
      </div>
      

    </section>
  )
}

export default Hero