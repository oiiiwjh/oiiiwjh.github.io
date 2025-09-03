import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import gsap from 'gsap'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const galleryRef = useRef(null)
  
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  })

  useEffect(() => {
    if (inView && galleryRef.current) {
      // 检查是否已经播放过动画
      const hasPlayedAnimation = sessionStorage.getItem('gallery-animation-played')
      
      if (!hasPlayedAnimation) {
        // 首次加载时播放动画
        gsap.fromTo(
          galleryRef.current.children,
          {
            y: 50,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
          }
        )
        // 标记动画已播放
        sessionStorage.setItem('gallery-animation-played', 'true')
      } else {
        // 非首次加载时直接设置最终状态
        gsap.set(galleryRef.current.children, {
          y: 0,
          opacity: 1,
          scale: 1
        })
      }
    }
  }, [inView, selectedCategory, showMore])

  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'urban', name: 'Urban' },
    { id: 'natural', name: 'Natural' },
    { id: 'rural', name: 'Rural' },
    { id: 'interior', name: 'Interior' },
    { id: 'waterfront', name: 'Waterfront' },
  ]

  const galleryItems = [
    {
      id: 1,
      title: 'AI模型架构图',
      category: 'urban',
      description: (
        <div style={{lineHeight: '1.4', textAlign: 'left'}}>
          <div style={{marginBottom: '8px', paddingLeft: '16px', textIndent: '-16px'}}>• 展示我们最新开发的<strong style={{color: '#0071e3'}}>深度学习模型架构</strong>，具有创新的<strong>注意力机制</strong>。</div>
          <div style={{marginBottom: '8px', paddingLeft: '16px', textIndent: '-16px'}}>• 这个项目采用了最先进的<span style={{color: '#ff6b35', fontWeight: 'bold'}}>Transformer架构</span>，结合了多头注意力机制和残差连接，能够有效处理复杂的序列数据。</div>
          <div style={{marginBottom: '8px', paddingLeft: '16px', textIndent: '-16px'}}>• 模型在多个基准数据集上都取得了<strong style={{color: '#28a745'}}>优异的性能</strong>，特别是在长序列建模任务中表现突出。</div>
          <div style={{paddingLeft: '16px', textIndent: '-16px'}}>• 我们还引入了新的<span style={{color: '#6f42c1'}}>正则化技术</span>和<span style={{color: '#6f42c1'}}>优化策略</span>，使得模型训练更加稳定高效。该架构已经在实际生产环境中得到验证，能够处理大规模的实时数据流，为用户提供准确可靠的预测结果。</div>
        </div>
      ),
      image: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['PyTorch', 'Transformer', 'CUDA']
    },
    {
      id: 2,
      title: '医疗影像分析',
      category: 'natural',
      description: '基于深度学习的医疗影像诊断系统，准确率达到98%以上。该系统采用了先进的卷积神经网络架构，能够自动识别和分析各种医疗影像中的异常区域。通过大量的医疗数据训练，模型能够准确检测肿瘤、病变等关键信息，为医生提供可靠的辅助诊断。系统还集成了图像预处理、特征提取和结果可视化等功能模块，形成了完整的医疗影像分析流水线。在多家医院的临床试验中，该系统显著提高了诊断效率和准确性，得到了医疗专家的高度认可。',
      image: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['CNN', 'ResNet', 'OpenCV']
    },
    {
      id: 3,
      title: '智能对话系统',
      category: 'rural',
      description: '多轮对话系统，支持上下文理解和情感分析。该系统基于大规模预训练语言模型构建，具备强大的自然语言理解和生成能力。通过深度学习技术，系统能够理解用户的意图，维护对话上下文，并生成自然流畅的回复。系统还集成了情感分析模块，能够识别用户的情感状态，提供更加个性化的服务。在客服、教育、娱乐等多个领域都有广泛应用，用户满意度超过95%。系统支持多语言交互，具备良好的扩展性和可维护性。',
      image: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['BERT', 'GPT', 'NLP']
    },
    {
      id: 4,
      title: '实时数据监控',
      category: 'interior',
      description: '实时数据流处理和可视化系统，支持大规模数据分析。该系统采用分布式架构设计，能够处理每秒数百万条数据记录，提供实时的数据分析和可视化服务。系统集成了多种数据源，包括数据库、消息队列、API接口等，通过统一的数据处理引擎进行清洗、转换和聚合。可视化界面采用现代化的设计理念，提供丰富的图表类型和交互功能，用户可以自定义仪表板和报表。系统还具备智能告警功能，能够及时发现异常情况并通知相关人员。',
      image: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['D3.js', 'React', 'WebSocket']
    },
    {
      id: 5,
      title: '目标检测系统',
      category: 'natural',
      description: '高精度实时目标检测，支持多类别物体识别。该系统基于最新的YOLO架构开发，能够在保证高精度的同时实现实时检测。系统支持80多种常见物体的识别，包括人员、车辆、动物等，检测精度达到95%以上。通过优化的网络结构和推理引擎，系统能够在普通GPU上达到60FPS的处理速度。系统还支持自定义训练，用户可以根据特定需求添加新的检测类别。在安防监控、自动驾驶、工业检测等领域都有成功应用案例。',
      image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['YOLO', 'TensorFlow', 'OpenCV']
    },
    {
      id: 6,
      title: '语言模型训练',
      category: 'rural',
      description: '大规模语言模型的分布式训练和优化过程。该项目展示了如何在多GPU集群上高效训练大规模语言模型，采用了数据并行和模型并行相结合的策略。通过优化的训练流水线和内存管理技术，显著提高了训练效率和模型质量。项目还包含了完整的实验管理和模型评估框架，能够自动跟踪训练过程中的各项指标。训练出的模型在多个NLP任务上都取得了优异的性能，特别是在文本生成和理解任务中表现突出。该训练框架已经开源，为研究社区提供了宝贵的资源。',
      image: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Transformer', 'Distributed', 'TPU']
    },
    {
      id: 7,
      title: '神经网络可视化',
      category: 'urban',
      description: '神经网络内部结构和学习过程的可视化展示。该工具能够直观地展示神经网络的架构、权重分布、激活模式等关键信息，帮助研究人员更好地理解模型的工作原理。通过交互式的可视化界面，用户可以实时观察训练过程中网络参数的变化，分析不同层的特征表示。工具还支持多种可视化技术，包括t-SNE、PCA、注意力热图等，为模型分析提供了丰富的视角。该工具在模型调试、性能优化和科研教学中都发挥了重要作用，获得了广泛的用户好评。',
      image: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['TensorBoard', 'Matplotlib', 'Plotly']
    },
    {
      id: 8,
      title: '性能分析仪表板',
      category: 'interior',
      description: '模型性能和系统指标的综合分析仪表板。该仪表板集成了多维度的性能监控功能，能够实时跟踪模型的准确率、延迟、吞吐量等关键指标。通过直观的图表和报表，用户可以快速了解系统的运行状态和性能趋势。仪表板还支持自定义告警规则，当指标异常时会及时通知相关人员。系统采用微服务架构设计，具备良好的扩展性和可维护性。在多个生产环境中部署使用，有效提高了系统运维效率和服务质量。',
      image: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Grafana', 'Prometheus', 'React']
    },
    {
      id: 9,
      title: '3D场景重建',
      category: 'waterfront',
      description: '基于多视角图像的3D场景重建技术。该技术采用了最新的神经辐射场(NeRF)方法，能够从稀疏的2D图像中重建出高质量的3D场景。通过深度学习技术，系统能够学习场景的几何结构和材质属性，生成逼真的新视角图像。技术在虚拟现实、增强现实、数字孪生等领域都有广泛应用前景。系统还支持实时渲染和交互操作，用户可以自由浏览重建的3D场景。该技术在多个国际会议上发表了相关论文，得到了学术界的高度认可。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['NeRF', 'PyTorch', 'TensorFlow']
    },
    {
      id: 10,
      title: '强化学习智能体',
      category: 'urban',
      description: '基于深度强化学习的智能决策系统，能够在复杂环境中自主学习和优化策略。该系统采用了Actor-Critic架构，结合了价值函数和策略梯度方法，在游戏AI、机器人控制、资源调度等领域都有出色表现。通过大量的环境交互和试错学习，智能体能够发现最优的行为策略，并在动态环境中持续适应和改进。',
      image: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['RL', 'PyTorch', 'OpenAI Gym']
    },
    {
      id: 11,
      title: '语音识别系统',
      category: 'rural',
      description: '高精度多语言语音识别系统，支持实时语音转文字和语音命令识别。系统采用了最新的Transformer架构和注意力机制，能够准确识别不同口音和语速的语音输入。集成了噪声抑制和回声消除技术，在嘈杂环境中也能保持良好的识别效果。广泛应用于智能助手、会议记录、语音翻译等场景。',
      image: 'https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['ASR', 'Transformer', 'CUDA']
    },
    {
      id: 12,
      title: '图像生成模型',
      category: 'waterfront',
      description: '基于生成对抗网络的高质量图像生成系统，能够根据文本描述生成逼真的图像。模型采用了最新的扩散模型技术，在图像质量、多样性和可控性方面都有显著提升。支持风格迁移、图像编辑、超分辨率等多种功能，为创意设计和内容生产提供了强大的工具支持。',
      image: 'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['GAN', 'Diffusion', 'PyTorch']
    },
    {
      id: 13,
      title: '区块链分析平台',
      category: 'interior',
      description: '区块链数据分析和可视化平台，提供交易追踪、风险评估和市场分析功能。平台能够实时监控多个区块链网络的交易活动，识别异常模式和潜在风险。通过先进的图分析算法和机器学习技术，为用户提供深入的市场洞察和投资建议。界面直观友好，支持自定义报表和告警设置。',
      image: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Blockchain', 'Graph', 'React']
    },
    {
      id: 14,
      title: '自动驾驶感知',
      category: 'natural',
      description: '自动驾驶汽车的环境感知和决策系统，集成了多传感器融合技术。系统能够实时处理摄像头、激光雷达、毫米波雷达等多种传感器数据，准确识别道路、车辆、行人、交通标志等关键信息。通过深度学习和传统计算机视觉技术的结合，实现了高精度的目标检测和轨迹预测，为安全驾驶提供可靠保障。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['LiDAR', 'Computer Natural', 'ROS']
    },
    {
      id: 15,
      title: '知识图谱构建',
      category: 'rural',
      description: '大规模知识图谱自动构建和推理系统，能够从非结构化文本中抽取实体、关系和事件信息。系统采用了最新的预训练语言模型和图神经网络技术，实现了高精度的信息抽取和知识融合。构建的知识图谱支持复杂查询和推理，为智能问答、推荐系统、决策支持等应用提供了丰富的知识基础。',
      image: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Knowledge Graph', 'NER', 'GNN']
    },
    {
      id: 16,
      title: '量化交易系统',
      category: 'urban',
      description: '基于机器学习的量化交易策略开发和执行平台。系统集成了多种技术指标分析、基本面分析和情感分析功能，能够自动发现市场机会并执行交易策略。采用了深度学习、强化学习等先进算法，在风险控制的前提下追求稳定收益。平台支持多市场、多品种的交易，具备完善的回测和风控功能。',
      image: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Quant', 'ML', 'Risk Management']
    },
    {
      id: 17,
      title: '智能推荐引擎',
      category: 'interior',
      description: '个性化推荐系统，基于用户行为和内容特征提供精准推荐。系统采用了协同过滤、深度学习、图神经网络等多种推荐算法，能够处理冷启动问题并提供多样化的推荐结果。支持实时推荐和批量推荐，具备A/B测试和效果评估功能。广泛应用于电商、内容平台、社交网络等场景，显著提升了用户体验和业务指标。',
      image: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Recommendation', 'Deep Learning', 'Graph']
    },
    {
      id: 18,
      title: '边缘计算平台',
      category: 'waterfront',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 19,
      title: '边缘计算平台',
      category: 'urban',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 20,
      title: '边缘计算平台',
      category: 'natural',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 21,
      title: '边缘计算平台',
      category: 'waterfront',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 22,
      title: '边缘计算平台',
      category: 'natural',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 23,
      title: '边缘计算平台',
      category: 'waterfront',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 24,
      title: '边缘计算平台',
      category: 'interior',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 25,
      title: '边缘计算平台',
      category: 'waterfront',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 26,
      title: '边缘计算平台',
      category: 'rural',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 27,
      title: '边缘计算平台',
      category: 'interior',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 28,
      title: '边缘计算平台',
      category: 'natural',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 29,
      title: '边缘计算平台',
      category: 'urban',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
    {
      id: 30,
      title: '边缘计算平台',
      category: 'rural',
      description: '面向物联网的边缘计算和AI推理平台，支持在资源受限的边缘设备上部署深度学习模型。平台采用了模型压缩、量化、剪枝等优化技术，显著降低了模型的计算和存储需求。支持多种硬件平台和推理框架，提供了完整的模型部署和管理工具链。在智能制造、智慧城市、自动驾驶等场景中发挥重要作用。',
      image: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif',
      gifs: [
        { src: 'https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif', title: 'Video Clip' },
        { src: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', title: 'Depth' },
        { src: 'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif', title: 'Camera Pose' },
        { src: 'https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif', title: 'Dynamic Mask' }
      ],
      tech: ['Edge Computing', 'Model Optimization', 'IoT']
    },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  // 根据showMore状态决定显示的样例数量
  const displayedItems = showMore ? filteredItems : filteredItems.slice(0, 9)

  return (
    <section id="gallery" ref={ref} className="pt-20 pb-12 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <h2 className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-center mb-6">
            <span className="gradient-text">Samples</span>
          </h2>
          <p className="text-2xl 2xl:text-3xl text-gray-500 max-w-[70vw] mx-auto mb-4">
            Click the tags to filter, and click the samples to view detailed information
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'bg-[#d3e8fd] text-gray-400 hover:bg-[#d3e8fd] hover:text-gray-500 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* 图片网格 */}
        <motion.div
          ref={galleryRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence>
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] transition-shadow duration-300 group-hover:shadow-2xl">
                  {/* 图片 */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* 放大图标 */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Explore more samples 按钮 */}
        {filteredItems.length > 9 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setShowMore(!showMore)}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{showMore ? 'Show Less' : 'Show More Samples'}</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: showMore ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
          </motion.div>
        )}

        {/* 图片模态框 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => {
                    setSelectedImage(null)
                    setIsDescriptionExpanded(false)
                  }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                onWheel={(e) => {
                  // 只允许描述区域滚动，阻止其他区域的滚动事件冒泡
                  if (!e.target.closest('.overflow-y-auto')) {
                    e.preventDefault()
                  }
                }}
                style={{ 
                  // 超大屏幕(>1440px)
                  '@media (min-width: 1441px)': {
                    maxWidth: '60vw',
                    width: 'min(60vw, 1000px)',
                    height: 'min(90vh, 1000px)'
                  },
                  // 大屏幕(1024px-1440px)
                  maxWidth: '60vw',
                  width: 'min(60vw, 800px)',
                  height: 'min(90vh, 800px)',
                  // 中屏幕(768px-1024px): 最大宽度75vw,最大高度85vh
                  '@media (max-width: 1024px)': {
                    maxWidth: '75vw',
                    width: 'min(75vw, 700px)',
                    height: 'min(90vh, 700px)'
                  },
                  // 小屏幕(<768px): 最大宽度90vw,最大高度80vh
                  '@media (max-width: 768px)': {
                    maxWidth: '90vw', 
                    width: 'min(90vw, 600px)',
                    height: 'min(90vh, 600px)'
                  },
                  backgroundColor: '#eef5ff'
                }}
                onClick={(e) => e.stopPropagation()}
Natraz              >
                {/* 上半部分：GIF展示区域 */}
                <div className={`${isDescriptionExpanded ? 'h-1/4' : 'h-3/4'} p-6 min-h-0 transition-all duration-300`}>
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {selectedImage.gifs.map((gif, index) => (
                      <div key={`${selectedImage.id}-gif-${index}-${gif.src}`} className="flex flex-col items-center justify-center">
                        <div className="aspect-video rounded-lg overflow-hidden w-full max-w-sm">
                          <img
                            src={gif.src}
                            alt={`${selectedImage.title} - ${gif.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="mt-3 text-xs md:text-sm lg:text-md xl:text-lg 2xl:text:xl text-gray-600 font-medium text-center">{gif.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 下半部分：描述和标签 */}
                <motion.div 
                  className="p-6 bg-white/95 flex flex-col border-t border-gray-200"
                  animate={{
                    height: isDescriptionExpanded ? '75%' : '25%'
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ height: isDescriptionExpanded ? '75%' : '25%' }}
                >
                  {/* 展开/收起按钮 */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg 2xl:text-xl font-semibold text-gray-800">Captions</h3>
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Collapse
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Expand
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto mb-4 min-h-0" onWheel={(e) => e.stopPropagation()}>
                    <div className="text-gray-700 text-base leading-relaxed h-full">
                      {isDescriptionExpanded ? (
                        selectedImage.description
                      ) : (
                        // 只显示第一项描述
                        typeof selectedImage.description === 'string' ? (
                          <div className="text-gray-700 text-base md:text-sm lg:text-md xl:text-base 2xl:text-xl leading-relaxed">
                            {selectedImage.description.split('。')[0] + '。'}
                          </div>
                        ) : (
                          <div style={{lineHeight: '1.4', textAlign: 'left'}}>
                            <div style={{marginBottom: '8px', paddingLeft: '16px', textIndent: '-16px'}}>• 展示我们最新开发的<strong style={{color: '#0071e3'}}>深度学习模型架构</strong>，具有创新的<strong>注意力机制</strong>。</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {selectedImage.tech.map((tech, index) => (
                      <span
                        key={`${selectedImage.id}-tech-${index}-${tech}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
                
                {/* 关闭按钮 */}
                <button
                  onClick={() => {
                  setSelectedImage(null)
                  setIsDescriptionExpanded(false)
                }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-[#b4daff] hover:bg-white/30 hover:text-[#b4daff] hover:shadow-sm transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Gallery