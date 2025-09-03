import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import gsap from 'gsap'

const Features = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  })

  useEffect(() => {
    if (inView && cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        }
      )
    }
  }, [inView])

  const images = [
    {
      src: '/img/page_img1.png',
      description: '这是第一张展示图片的介绍文字，可以描述图片的内容和相关信息。'
    },
    {
      src: '/img/page_img2.png',
      description: '这是第二张展示图片的介绍文字，可以描述图片的内容和相关信息。'
    },
    {
      src: '/img/page_img3.png',
      description: '这是第三张展示图片的介绍文字，可以描述图片的内容和相关信息。'
    }
  ]

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <h2 className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-center mb-6">
            <span className="gradient-text">Statistics</span>
          </h2>
          <p className="text-2xl 2xl:text-3xl text-gray-500 max-w-[70vw] mx-auto mb-4">
            我们的研究项目具备多项先进特性，为科研工作提供强有力的技术支持
          </p>
        </motion.div>
        
        <div ref={cardsRef} className="flex flex-col items-center space-y-12">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.1 }}
            >
              <div className="text-center">
                <img 
                  src={image.src} 
                  alt={`展示图片 ${index + 1}`}
                  className="w-full h-auto object-contain rounded-lg mb-6"
                />
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-justify">
                   {image.description}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features