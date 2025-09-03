import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Research = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const researchAreas = [
    {
      title: '深度学习优化',
      subtitle: 'Deep Learning Optimization',
      description: '研究新型神经网络架构和训练算法，提高模型的效率和准确性。',
      details: [
        '开发了新的注意力机制，提升模型性能30%',
        '设计轻量级网络架构，减少参数量50%',
        '优化训练算法，加速收敛速度2倍',
        '在多个基准数据集上达到SOTA性能'
      ],
      progress: 85,
      publications: 8,
      collaborators: 5
    },
    {
      title: '自然语言处理',
      subtitle: 'Natural Language Processing',
      description: '探索语言模型的理解和生成能力，推动人机交互技术发展。',
      details: [
        '构建多语言预训练模型，支持50+语言',
        '开发情感分析系统，准确率达95%',
        '实现智能对话系统，通过图灵测试',
        '发布开源工具包，被1000+研究者使用'
      ],
      progress: 78,
      publications: 12,
      collaborators: 8
    },
    {
      title: '计算机视觉',
      subtitle: 'Computer Vision',
      description: '开发先进的图像识别和分析技术，应用于医疗、安防等领域。',
      details: [
        '医疗影像诊断准确率提升至98%',
        '实时目标检测速度达100FPS',
        '3D重建技术精度提升40%',
        '与5家医院建立合作关系'
      ],
      progress: 92,
      publications: 15,
      collaborators: 12
    },
    {
      title: '智能系统',
      subtitle: 'Intelligent Systems',
      description: '构建自适应和自学习的智能系统，解决复杂的现实世界问题。',
      details: [
        '开发自适应推荐系统，用户满意度提升45%',
        '设计智能调度算法，效率提升60%',
        '构建预测模型，准确率达90%',
        '部署在10+企业生产环境'
      ],
      progress: 73,
      publications: 6,
      collaborators: 7
    }
  ]

  const showcaseImages = [
     {
       url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       title: '深度学习模型可视化',
       description: '展示我们最新的神经网络架构和训练过程'
     },
     {
       url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       title: '自然语言处理界面',
       description: '多语言智能对话系统的用户交互界面'
     },
     {
       url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       title: '计算机视觉应用',
       description: '医疗影像分析和实时目标检测系统'
     },
     {
       url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       title: '智能系统控制台',
       description: '自适应推荐和智能调度系统的管理界面'
     }
   ]

  // 自动轮播效果
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isHovered, showcaseImages.length])

  return (
    <section id="research" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">研究领域</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            我们在多个前沿领域开展深入研究，致力于推动科技进步和社会发展
          </p>
        </motion.div>

        {/* 研究领域标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {researchAreas.map((area, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {area.title}
            </motion.button>
          ))}
        </div>

        {/* 研究内容详情 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 mb-20"
          >
            {/* 左侧：详细信息 */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {researchAreas[activeTab].title}
                </h3>
                <p className="text-lg text-blue-400 mb-4">
                  {researchAreas[activeTab].subtitle}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {researchAreas[activeTab].description}
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">主要成果：</h4>
                <ul className="space-y-3">
                  {researchAreas[activeTab].details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start text-gray-300"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* 右侧：统计数据 */}
            <div className="space-y-8">
              <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
                <h4 className="text-xl font-semibold text-white mb-6">项目进展</h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">完成度</span>
                      <span className="text-white font-semibold">{researchAreas[activeTab].progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${researchAreas[activeTab].progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">
                        {researchAreas[activeTab].publications}
                      </div>
                      <div className="text-gray-400 text-sm">发表论文</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">
                        {researchAreas[activeTab].collaborators}
                      </div>
                      <div className="text-gray-400 text-sm">合作伙伴</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 效果展示轮播 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">
            效果展示
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            {/* 图片轮播容器 */}
            <div className="relative overflow-hidden rounded-2xl h-[500px]">
              {showcaseImages.map((image, index) => (
                <motion.div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 悬停时显示的描述 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered && index === currentImageIndex ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  >
                    <div className="text-center text-white p-8">
                      <h4 className="text-2xl font-bold mb-4">{image.title}</h4>
                      <p className="text-lg text-gray-200">{image.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            {/* 进度点 */}
            <div className="flex justify-center mt-6 space-x-3">
              {showcaseImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Research