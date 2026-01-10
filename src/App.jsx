import { useScroll, useTransform, motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import WeddingGallery from './components/WeddingGallery'
import AccountSection from './components/AccountSection'
import FooterSection from './components/FooterSection'
import RsvpSection from './components/RsvpSection'

function getGreeting() {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const name = params.get('name')
  const type = params.get('type')

  if (!name) return null

  const lastChar = name.charAt(name.length - 1)
  const lastCharCode = lastChar.charCodeAt(0)
  const hasFinalConsonant = (lastCharCode - 44032) % 28 !== 0
  const suffix = hasFinalConsonant ? '아' : '야'

  const actionMap = {
    bride: '시집',
    groom: '장가',
    both: '결혼한다!',
  }
  const action = actionMap[type] || '결혼한다!'

  return { name, suffix, action }
}

const greeting = getGreeting()

// 빵빠레(컨페티) 효과 함수 - 화면 하단에서 위로 터짐
function fireConfetti() {
  const colors = ['#ff69b4', '#ffd700', '#ff6347', '#00ced1', '#9370db', '#ffb6c1', '#98d8c8', '#f7dc6f']

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 1 },
    colors: colors,
    startVelocity: 45,
    gravity: 0.7,
    ticks: 600,
    decay: 0.94,
    scalar: 1.2,
    drift: 0,
    zIndex: 100,
  })

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 1 },
      colors: colors,
      startVelocity: 40,
      gravity: 0.7,
      ticks: 600,
      decay: 0.94,
      scalar: 1.1,
      zIndex: 100,
    })
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.8, y: 1 },
      colors: colors,
      startVelocity: 40,
      gravity: 0.7,
      ticks: 600,
      decay: 0.94,
      scalar: 1.1,
      zIndex: 100,
    })
  }, 100)
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [introVisible, setIntroVisible] = useState(!!greeting)
  const [introFading, setIntroFading] = useState(false)
  const confettiFiredRef = useRef(false)
  const { scrollYProgress } = useScroll()

  const isReady = fontsLoaded && heroLoaded

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.05,
      },
    },
  }

  const weddingOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  // 폰트 + 히어로 이미지 로딩
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })

    // 히어로 이미지만 프리로드
    const heroImg = new Image()
    heroImg.onload = () => setHeroLoaded(true)
    heroImg.onerror = () => setHeroLoaded(true) // 에러 시에도 진행
    heroImg.src = '/images/32 0Q0A7334a.jpg'
  }, [])

  // 인트로 화면에서 스크롤 감지
  useEffect(() => {
    if (!introVisible || !isReady) return

    const handleScroll = (e) => {
      e.preventDefault()
      if (!introFading) {
        setIntroFading(true)
        setTimeout(() => {
          setIntroVisible(false)
          window.scrollTo(0, 0)
        }, 800)
      }
    }

    const handleWheel = (e) => {
      if (e.deltaY > 0) handleScroll(e)
    }

    const handleTouchStart = (e) => {
      window.touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      const deltaY = window.touchStartY - e.touches[0].clientY
      if (deltaY > 30) handleScroll(e)
    }

    document.body.style.overflow = 'hidden'

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [introVisible, introFading, isReady])

  // 컨페티 - 인트로 없거나 인트로 사라진 후 1.8초 뒤 발사
  useEffect(() => {
    if (!isReady) return
    if (introVisible) return

    if (!confettiFiredRef.current) {
      confettiFiredRef.current = true
      const timer = setTimeout(() => {
        fireConfetti()
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [isReady, introVisible])

  // 로딩 화면
  if (!isReady) {
    return (
      <div className='flex items-center justify-center w-full min-h-screen bg-white'>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className='text-xl text-gray-400'
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  // 인트로 화면
  // 인트로 화면
  if (introVisible) {
    const isBoth = new URLSearchParams(window.location.search).get('type') === 'both'

    return (
      <motion.div
        className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfbf7]'
        animate={{ opacity: introFading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='text-center'
        >
          <p className='text-3xl leading-relaxed text-gray-600' style={{ fontFamily: '나눔손글씨_강부장님체' }}>
            {isBoth ? (
              <>
                {greeting.name}
                {greeting.suffix},<br />
                우리 결혼한다 !
              </>
            ) : (
              <>
                {greeting.name}
                {greeting.suffix},<br />나 {greeting.action}간다 !
              </>
            )}
          </p>
        </motion.div>

        <motion.div
          className='absolute text-sm text-gray-400 bottom-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className='flex flex-col items-center gap-2'
          >
            <span>스크롤하여 청첩장 보기</span>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  // 메인 청첩장
  const marchDays = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className='flex justify-center w-full min-h-screen'>
      <div className='w-full flex flex-col items-center max-w-[640px] relative'>
        {/* 메인 히어로 이미지 */}
        <div className='relative w-full h-screen sm:h-auto bg-[#f5f0eb]'>
          <img
            src='/images/32 0Q0A7334a.jpg'
            className='object-cover object-[80%_center] w-full h-full sm:object-contain sm:h-auto'
            alt='이미지'
          />
          {/* Our Wedding Day 텍스트 */}
          <motion.div
            className='absolute text-center text-yellow-200 top-[20%] left-0 right-0 mx-auto w-full'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            style={{ opacity: weddingOpacity }}
          >
            {['Our', 'Wedding', 'Day'].map((word, wordIndex) => (
              <motion.p key={wordIndex} className='text-7xl sm:text-8xl tracking-[0.05em] flex justify-center'>
                {word.split('').map((char, charIndex) => (
                  <motion.span key={charIndex} variants={letterVariants} style={{ fontFamily: 'Blacksword' }}>
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            ))}
          </motion.div>

          {/* 년도 날짜 표시 */}
          <div className='absolute z-50 flex items-center justify-center gap-4 font-bold text-yellow-200 -translate-x-1/2 bottom-4 left-1/2 whitespace-nowrap'>
            <span className='text-lg tracking-widest text-right'>2026年</span>
            <span className='w-20 border-t border-yellow-200'></span>
            <span className='text-lg tracking-widest text-left'>03.22</span>
          </div>
        </div>

        {/* 인사말 */}
        <div className='z-40 w-full pt-20 pb-20 text-center bg-white'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className='block mb-8 text-xl leading-loose text-gray-700' style={{ fontFamily: 'WhiteAngelica' }}>
              Invitation
            </span>
            <p className='text-base leading-loose text-gray-700'>
              늦가을의 설렘으로 만나
              <br />
              다섯 번의 겨울을 나란히 걸었습니다.
              <br />
              남아있는 찬 기운을 뒤로하고,
              <br />
              이제 막 피어나는 봄날의 부부가 됩니다.
              <br />
              저희의 시작이 따뜻한 봄으로 피어날 수 있도록
              <br />
              함께 축복해 주세요.
            </p>
          </motion.div>
        </div>

        {/* 신랑신부 소개 */}
        <div className='w-full'>
          <div className='relative'>
            <img src='/images/1-2HS_0857a.jpg' className='object-contain w-full h-auto' alt='신랑' />
            <div className='absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent' />
            <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
            <div className='absolute text-left left-8 bottom-6'>
              <span className='text-xs tracking-[0.3em] text-white/70'>GROOM</span>
              <p className='mt-1 text-base text-white'>
                김홍만 · 이정안 의 아들 <span className='font-medium'>산결</span>
              </p>
            </div>
          </div>
          <div className='relative'>
            <img src='/images/1-1HS_0907a.jpg' className='object-contain w-full h-auto' alt='신부' />
            <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent' />
            <div className='absolute text-right right-8 bottom-10'>
              <span className='text-xs tracking-[0.3em] text-white/70'>BRIDE</span>
              <p className='mt-1 text-base text-white'>
                이승화 · 강경아 의 딸 <span className='font-medium'>수민</span>
              </p>
            </div>
          </div>
        </div>

        {/* 예식 안내 */}
        <div className='w-full px-8 pt-20 pb-10 text-base leading-loose text-center text-gray-700 bg-white'>
          <span className='block mb-8' style={{ fontFamily: 'WhiteAngelica' }}>
            Information
          </span>
          <span className='block font-bold'>2026년 3월 22일 일요일 오후 2시 30분</span>
          <span className='block font-bold'>로얄파크컨벤션 1층 파크홀</span>
        </div>

        {/* 달력 */}
        <div className='w-full px-8 pt-12 pb-20 bg-white'>
          <motion.div
            className='max-w-xs mx-auto'
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h3 className='mb-6 text-xl font-light tracking-widest text-center text-gray-600'>2026.03.22</h3>
            <div className='grid grid-cols-7 gap-1 text-center'>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={`header-${index}`}
                  className={`text-xs font-medium py-2 ${index === 0 ? 'text-rose-400' : 'text-gray-400'}`}
                >
                  {day}
                </div>
              ))}
              {marchDays.map((date) => {
                const isWeddingDay = date === 22
                const dayOfWeek = (date - 1) % 7
                const isSunday = dayOfWeek === 0

                return (
                  <div
                    key={date}
                    className={`py-2 text-sm relative flex items-center justify-center ${
                      isWeddingDay ? '' : isSunday ? 'text-rose-400' : 'text-gray-600'
                    }`}
                  >
                    {isWeddingDay ? (
                      <div className='relative'>
                        <motion.div
                          className='flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-rose-400'
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(251, 113, 133, 0.7)',
                              '0 0 0 10px rgba(251, 113, 133, 0)',
                              '0 0 0 0 rgba(251, 113, 133, 0)',
                            ],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        >
                          {date}
                        </motion.div>
                        <div className='absolute w-full text-[10px] text-rose-400 -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap'>
                          PM 2:30
                        </div>
                      </div>
                    ) : (
                      date
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* 지도 영역 */}
        <div className='flex flex-col w-full gap-4 pb-10 text-lg leading-loose text-center text-gray-700 bg-white'>
          <span className='block text-xl' style={{ fontFamily: 'WhiteAngelica' }}>
            Location
          </span>
          <img src='/images/map.png' alt='약도' />
          <div className='flex justify-center gap-3 px-4 mt-2'>
            <a
              href='https://map.naver.com/v5/search/로얄파크컨벤션'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center flex-1 gap-2 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg'
            >
              <img src='/images/navermap_logo.png' alt='네이버' className='w-4 h-4' />
              네이버
            </a>
            <a
              href='https://map.kakao.com/link/search/로얄파크컨벤션'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center flex-1 gap-2 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg'
            >
              <img src='/images/kakaomap_logo.png' alt='카카오' className='w-4 h-4' />
              카카오
            </a>
            <a
              href='https://tmap.life/로얄파크컨벤션'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center flex-1 gap-2 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg'
            >
              <img src='/images/tmap_logo.svg' alt='티맵' className='w-4 h-4' />
              티맵
            </a>
          </div>
        </div>
        {/* 웨딩 사진 갤러리 */}
        <div className='w-full py-16 bg-white'>
          <h3
            className='mb-8 text-xl tracking-widest text-center text-gray-600'
            style={{ fontFamily: 'WhiteAngelica' }}
          >
            Gallery
          </h3>
          <WeddingGallery />
        </div>
        {/* 계좌번호 안내 */}
        <AccountSection />
        <RsvpSection />
        <FooterSection />
      </div>
    </div>
  )
}

// 웨딩 갤러리 컴포넌트

export default App
