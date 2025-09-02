import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Contact = () => {
  const [copyStatus, setCopyStatus] = useState('idle')
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  })

  // BibTeX引用信息
  const bibtexCitation = `@article{motionvid2024,
  title={MotionVid: High-Quality Video Generation with Motion-Aware Diffusion},
  author={Zhang, Wei and Li, Ming and Wang, Jie and Chen, Yun},
  journal={arXiv preprint arXiv:2024.xxxxx},
  year={2024},
  url={https://github.com/example/motionvid}
}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bibtexCitation)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 1000)
    } catch (err) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 1000)
    }
  }

  return (
    <section id="contact" ref={ref} className="pt-10 pb-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Cite Our Work</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-4xl mx-auto">
            If our research is helpful to you, please cite our paper using the following BibTeX format
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
             className="backdrop-blur-sm rounded-2xl p-8 border border-gray-300/50 relative"
             style={{ backgroundColor: '#d3e8fd' }}
             initial={{ opacity: 0, y: 50 }}
             animate={inView ? { opacity: 1, y: 0 } : {}}
             transition={{ duration: 0.8, delay: 0.2 }}
           >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                  <span className="text-gray-700 text-base font-medium">BibTeX Citation</span>
                </div>
              
              {/* 复制按钮 */}
              <motion.button
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                  copyStatus === 'success' 
                    ? 'bg-green-500 text-white' 
                    : copyStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-300 text-white hover:bg-blue-400'
                }`}
                whileHover={{ scale: copyStatus === 'idle' ? 1.05 : 1 }}
                whileTap={{ scale: copyStatus === 'idle' ? 0.95 : 1 }}
                disabled={copyStatus !== 'idle'}
              >
                {copyStatus === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : copyStatus === 'error' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                <span>
                  {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Failed!' : 'Copy'}
                </span>
              </motion.button>
            </div>
            
            {/* BibTeX内容 */}
             <div className="relative">
               <pre className="text-gray-800 text-sm leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap text-left">
                 <code>{bibtexCitation}</code>
               </pre>
             </div>
            

          </motion.div>
          
          {/* 使用说明 */}
           <motion.div
             className="mt-6 text-center"
             initial={{ opacity: 0 }}
             animate={inView ? { opacity: 1 } : {}}
             transition={{ duration: 0.8, delay: 0.6 }}
           >
             <p className="text-gray-600 text-sm">
                Add the above BibTeX entry to your references or paste it directly into your LaTeX document
              </p>
           </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact