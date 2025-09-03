import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import spatialLogo from '../logo/spatial.png'

const Navbar = () => {
  const [isOnHomePage, setIsOnHomePage] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.querySelector('#home')
      if (homeSection) {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight
        setIsOnHomePage(window.scrollY < homeSectionBottom - 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Overview', href: '#about' },
    { name: 'Samples', href: '#gallery' },
    { name: 'Statistics', href: '#features' },
    // { name: 'Research', href: '#research' },
    { name: 'Citation', href: '#contact' },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl ${
        !isOnHomePage
          ? 'border-b border-gray-200/50'
          : ''
      }`}
      style={{
        // 导航栏背景色，在首页时透明但保持毛玻璃效果，离开首页时显示背景色
        backgroundColor: isOnHomePage ? 'transparent' : 'rgba(238, 245, 255, 0.85)'
      }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="flex items-center justify-between max-h-[8vh] h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 2xl:h-22">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold gradient-text cursor-pointer"
            onClick={() => scrollToSection('#home')}
          >
            <img src={spatialLogo} alt="SpatialVID Logo" className="max-w-[6vh] max-h-[6vh] w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12" />
            SpatialVID
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10 2xl:space-x-12">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.href)}
                className="text-black hover:text-gray-700 transition-colors duration-300 font-medium text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl"
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1"
          >
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0,
              }}
              className="w-6 h-0.5 bg-black transition-all duration-300"
            />
            <motion.span
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-black transition-all duration-300"
            />
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0,
              }}
              className="w-6 h-0.5 bg-black transition-all duration-300"
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : -20,
                }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-black hover:text-gray-700 transition-colors duration-300 font-medium text-lg py-2"
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar