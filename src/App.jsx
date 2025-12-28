import { useScroll, useTransform, motion } from 'framer-motion'
import { useState, useEffect, useCallback, memo, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import confetti from 'canvas-confetti'

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
  const action = type === 'bride' ? '시집' : '장가'

  return { name, suffix, action }
}

const greeting = getGreeting()

// 갤러리 이미지 목록
const galleryImages = [
  '/images/gallery1.jpg',
  '/images/gallery2.jpg',
  '/images/gallery3.jpg',
  '/images/gallery4.jpg',
  '/images/gallery10.jpg',
  '/images/gallery6.jpg',
  '/images/gallery7.jpg',
  '/images/gallery8.jpg',
  '/images/gallery9.jpg',
]

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
  const [galleryLoaded, setGalleryLoaded] = useState(false)
  const confettiFiredRef = useRef(false)
  const { scrollYProgress } = useScroll()

  const isReady = fontsLoaded && galleryLoaded

  useEffect(() => {
    if (isReady && !confettiFiredRef.current) {
      confettiFiredRef.current = true
      const timer = setTimeout(() => {
        fireConfetti()
      }, 1800) // 글자 애니메이션 완료 시점
      return () => clearTimeout(timer)
    }
  }, [isReady])

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

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })

    // 갤러리 이미지 미리 로드
    let loadedCount = 0
    const totalImages = galleryImages.length

    galleryImages.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setGalleryLoaded(true)
        }
      }
      img.src = src
      if (img.complete) {
        loadedCount++
        if (loadedCount === totalImages) {
          setGalleryLoaded(true)
        }
      }
    })
  }, [])

  // 폰트 + 갤러리 로딩 전 로딩 화면
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

  // 2026년 3월 달력 데이터
  const marchDays = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className='flex justify-center w-full min-h-screen'>
      <div className='w-full flex flex-col items-center max-w-[640px]'>
        <div className='relative w-full h-screen sm:h-auto bg-[#f5f0eb]'>
          {/* 이미지 */}
          <img
            src='/images/32 0Q0A7334a.jpg'
            className='object-cover object-[80%_center] w-full h-full sm:object-contain sm:h-auto'
            alt='이미지'
          />

          {/* 이미지 위 텍스트 - Our Wedding Day */}
          <motion.div
            className='absolute text-center text-yellow-200 top-[24%] left-0 right-0 mx-auto w-full'
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

          {/* <img
            src='/images/people.png'
            className='absolute w-[40%] bottom-[-0.2%] right-[7.35%] h-auto object-contain z-20 pointer-events-none'
            alt='사람'
          /> */}

          {/* 년도 ----- 날짜 표시 */}
          <div className='absolute z-50 flex items-center justify-center gap-4 font-bold text-yellow-200 -translate-x-1/2 bottom-4 left-1/2 whitespace-nowrap'>
            <span className='text-lg tracking-widest text-right'>2026年</span>
            <span className='w-20 border-t border-yellow-200'></span>
            <span className='text-lg tracking-widest text-left'>03.22</span>
          </div>
        </div>
        {/* 개인화 인사 영역 - 쿼리스트링 있을 때만 표시 */}
        {greeting && (
          <div className='w-full pt-20 text-center bg-white'>
            <motion.p
              className='text-4xl md:text-4xl lg:text-5xl leading-1.2 text-gray-500'
              style={{ fontFamily: "'Nanum Pen Script', cursive" }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {greeting.name}
              {greeting.suffix}, 나 {greeting.action}간다 !
            </motion.p>
          </div>
        )}
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
        {/* 신랑신부 소개 - 그라데이션 오버레이 */}
        <div className='w-full'>
          <div className='relative'>
            <img src='/images/1-2HS_0857a.jpg' className='object-contain w-full h-auto' alt='신랑' />
            {/* 상단 그라데이션 - 흰색에서 투명으로 */}
            <div className='absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent' />
            {/* 하단 그라데이션 - 텍스트용 */}
            <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />{' '}
            <div className='absolute text-left left-8 bottom-6'>
              <span className='text-xs tracking-[0.3em] text-white/70'>GROOM</span>
              <p className='mt-1 text-base text-white'>
                김홍만 · 이정안 의 아들 <span className='font-medium'>산결</span>
              </p>
            </div>
          </div>
          <div className='relative'>
            <img src='/images/1-1HS_0907a.jpg' className='object-contain w-full h-auto' alt='신부' />
            {/* 하단 그라데이션 - 텍스트용 어두운 영역 */}
            <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
            {/* 맨 하단 흰색 페이드 */}
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
        <div className='w-full px-8 py-20 text-lg leading-loose text-center text-gray-700 bg-white'>
          <span className='block mb-4'>예식 안내</span>
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
              {/* 요일 헤더 */}
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={`header-${index}`}
                  className={`text-xs font-medium py-2 ${index === 0 ? 'text-rose-400' : 'text-gray-400'}`}
                >
                  {day}
                </div>
              ))}
              {/* 날짜 - 2026년 3월 1일은 일요일 */}
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
          {/* <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          > */}
          <h3
            className='mb-8 text-xl tracking-widest text-center text-gray-600'
            style={{ fontFamily: 'WhiteAngelica' }}
          >
            Gallery
          </h3>
          <WeddingGallery />
          {/* </motion.div> */}
        </div>
      </div>
    </div>
  )
}

// 웨딩 갤러리 컴포넌트
function WeddingGallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    dragFree: false,
    containScroll: 'trimSnaps',
  })

  const openModal = useCallback((index) => {
    setSelectedImage(index)
    setCurrentIndex(index)
    // 모달 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = ''
  }, [])

  // 인접 이미지 preload
  useEffect(() => {
    if (selectedImage !== null) {
      const preloadIndices = [
        (selectedImage - 1 + galleryImages.length) % galleryImages.length,
        (selectedImage + 1) % galleryImages.length,
      ]
      preloadIndices.forEach((idx) => {
        const img = new Image()
        img.src = galleryImages[idx]
      })
    }
  }, [selectedImage])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi && selectedImage !== null) {
      emblaApi.scrollTo(selectedImage, true) // true = instant scroll
    }
  }, [emblaApi, selectedImage])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev()
      if (e.key === 'ArrowRight') emblaApi?.scrollNext()
    }

    if (selectedImage !== null) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, emblaApi, closeModal])

  return (
    <>
      {/* 썸네일 그리드 */}
      <div className='grid grid-cols-3 gap-1 px-4'>
        {galleryImages.map((src, index) => (
          <div key={index} className='overflow-hidden cursor-pointer aspect-square' onClick={() => openModal(index)}>
            <img src={src} alt={`웨딩 사진 ${index + 1}`} className='object-cover w-full h-full' />
          </div>
        ))}
      </div>

      {/* 전체화면 모달 */}
      {selectedImage !== null && (
        <div className='fixed inset-0 z-50 bg-black' onClick={closeModal}>
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            className='absolute z-10 flex items-center justify-center w-10 h-10 text-3xl text-white top-4 right-4'
            aria-label='닫기'
          >
            ✕
          </button>

          {/* 이미지 카운터 */}
          <div className='absolute z-10 text-sm text-white -translate-x-1/2 top-4 left-1/2'>
            {currentIndex + 1} / {galleryImages.length}
          </div>

          {/* 캐러셀 */}
          <div
            className='flex items-center w-full h-full overflow-hidden'
            ref={emblaRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex h-full'>
              {galleryImages.map((src, index) => (
                <div key={index} className='flex-[0_0_100%] min-w-0 flex items-center justify-center h-full'>
                  <ModalImage src={src} index={index} isActive={Math.abs(currentIndex - index) <= 1} />
                </div>
              ))}
            </div>
          </div>

          {/* 이전/다음 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              emblaApi?.scrollPrev()
            }}
            className='absolute flex items-center justify-center w-12 h-12 text-4xl text-white -translate-y-1/2 left-4 top-1/2'
            aria-label='이전'
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              emblaApi?.scrollNext()
            }}
            className='absolute flex items-center justify-center w-12 h-12 text-4xl text-white -translate-y-1/2 right-4 top-1/2'
            aria-label='다음'
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}

// 모달 이미지 컴포넌트 - 보이는 것만 로드
const ModalImage = memo(function ModalImage({ src, index, isActive }) {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!isActive) {
    return <div className='w-full h-full' />
  }

  return (
    <>
      {!isLoaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin' />
        </div>
      )}
      <img
        src={src}
        alt={`웨딩 사진 ${index + 1}`}
        className={`object-contain max-w-full max-h-full transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        draggable={false}
      />
    </>
  )
})

export default App
