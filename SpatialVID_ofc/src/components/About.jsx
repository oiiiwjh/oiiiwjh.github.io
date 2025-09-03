import { motion } from 'framer-motion'
import { useState } from 'react'

const About = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const stats = [
    { number: '21000h', label: 'Raw Video Processed' },
    { number: '7089h', label: 'Video Length' },
    { number: '2.7M', label: 'Dynamic Clips' },
    { number: '127M', label: 'Images Annotated' },
    { number: '720M', label: 'Caption Words' }
  ]

  return (
    <section id="about" className="pt-20 pb-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <span className="gradient-text">Overview</span>
        </motion.h2>
        
        {/* 主要内容 */}
        <div className="flex flex-col items-center text-center">
          {/* YouTube视频 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.1 }}
            className="relative mb-16 w-[90%] max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-none"
          >
            <div className="relative w-full aspect-video overflow-hidden rounded-3xl bg-gray-100">
              {/* 加载指示器 */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading Video...</p>
                    <p className="text-gray-400 text-sm mt-2">Video is loading, please wait.</p>
                  </div>
                </div>
              )}
              
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/pgNCgJG0vnY?autoplay=0&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsVideoLoaded(true)}
                loading="lazy"
              ></iframe>
            </div>
            
            {/* 浮动元素 */}


          </motion.div>
          
          {/* 下方内容 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.1 }}
            className="w-[90%] max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-none"
          >
            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-1 mb-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.1 }}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* 大图展示 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.1 }}
              className="mb-12 w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-none mx-auto"
            >
              <div className="relative w-full overflow-visible rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:z-10">
                <img 
                  src="/img/overview.png" 
                  alt="Overview"
                  className="w-full h-auto hover:opacity-100 transition-all duration-500 hover:scale-[1.02]"
                />
              </div>
            </motion.div>

            
            {/* <p className="text-xl text-gray-400 leading-relaxed mb-8">
              SpatialVID is a large-scale dynamic video dataset with 
              <br />
              explicit geometric metadata and structured spatiotemporal captions
            </p> */}
            
            <p className="text-lg text-gray-500 leading-relaxed mb-1">
              SpatialVID encompasses diverse scenes curated from over 21,000 hours of raw video. The resulting dataset consists of 7,089 hours of annotated videos, comprising 2.7 million dynamic clips. The dataset provides rich spatial annotations, including camera poses, depth maps, and dynamic masks, as well as structured captions and labels describing camera motion, scene types, and their combinations.
            </p>
          </motion.div>
        </div>
        
      </div>
    </section>
  )
}

export default About