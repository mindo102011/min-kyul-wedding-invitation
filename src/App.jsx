import { motion } from 'framer-motion'
import { useMemo } from 'react'

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

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className='flex justify-center w-full min-h-screen'>
      <div className='w-full flex flex-col items-center max-w-[640px]'>
        <div className='relative w-full'>
          {/* 이미지 */}
          <img src='/images/32 0Q0A7334a.jpg' className='object-contain w-full h-auto' alt='이미지' />

          {/* 이미지 위 텍스트 - Our Wedding Day */}

          <motion.div
            className='absolute text-center text-yellow-200 -translate-x-1/2 top-[22%] sm:top-[30%] md:top-48 left-1/2'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {['Our', 'Wedding', 'Day'].map((word, wordIndex) => (
              <motion.p
                key={wordIndex}
                className='text-7xl sm:text-9xl md:text-9xl lg:text-9xl tracking-[0.05em] flex justify-center'
              >
                {word.split('').map((char, charIndex) => (
                  <motion.span key={charIndex} variants={letterVariants} style={{ fontFamily: 'Blacksword' }}>
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            ))}
          </motion.div>

          <img
            src='/images/people.png'
            className='absolute bottom-[-0.2%] right-[7.2%] w-[40%] h-auto object-contain z-20 pointer-events-none'
            alt='사람'
          />

          {/* 이미지 위 텍스트 - 날짜/장소 */}
          <div className='absolute text-center text-white -translate-x-1/2 bottom-8 left-1/2'>
            <p className='mb-1 text-lg'>2025.10.18 SAT PM 02:00</p>
            <p className='text-xl font-medium'>로얄파크컨벤션</p>
          </div>
        </div>
        {/* 개인화 인사 영역 - 쿼리스트링 있을 때만 표시 */}
        {greeting && (
          <div className='w-full pt-20 text-center bg-white'>
            <p className='text-6xl text-gray-500' style={{ fontFamily: "'Nanum Pen Script', cursive" }}>
              {greeting.name}
              {greeting.suffix}, 나 {greeting.action}간다 !
            </p>
          </div>
        )}
        {/* 이미지 아래 영역 - 인사말 */}
        <div className='z-40 w-full py-20 text-center bg-white'>
          <span className='block mb-8 text-xl leading-loose text-gray-700'>Invitation</span>
          <p className='text-lg leading-loose text-gray-700'>
            서로가 마주보며 다져온 사랑을
            <br />
            이제 함께 한 곳을 바라보며
            <br />
            걸어갈 수 있는 큰 사랑으로 키우고자 합니다.
            <br />
            저희 두 사람이 사랑의 이름으로
            <br />
            지켜나갈 수 있게 앞날을
            <br />
            축복해 주시면 감사하겠습니다.
          </p>
        </div>
        <div className='relative w-full'>
          {/* 이미지 */}
          <img src='/images/20HS_1048a.jpg' className='object-contain w-full h-auto' alt='이미지' />
        </div>
        {/* 이미지2 아래 영역 - 신랑신부 소개 */}
        <div className='w-full py-20 text-center bg-white'>
          <span className='block text-xl leading-loose text-gray-700'>김 홍만 · 이 정안 의 아들 산결</span>
          <span className='block text-xl leading-loose text-gray-700'>이 승화 · 강 경아 의 딸 수민</span>
        </div>
        {/* 예식 안내 */}
        <div className='w-full px-8 py-20 text-center bg-white'>
          <span className='block text-xl leading-loose text-gray-700'>예식 안내</span>
          <span className='block text-xl leading-loose text-gray-700'>2026년 3월 22일 일요일 오후 2시 30분</span>
          <span className='block text-xl leading-loose text-gray-700'>로얄파크컨벤션 1층 파크홀</span>
        </div>
      </div>
    </div>
  )
}
export default App
