import { motion } from 'framer-motion'

export default function FooterSection() {
  return (
    <div className='w-full bg-white'>
      {/* 텍스트 영역 */}
      <motion.div
        className='px-6 pt-20 pb-16 text-center'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className='text-base leading-loose text-gray-700'>
          서로의 손을 꼭 잡고,
          <br />
          함께 걸어가겠습니다.
          <br />
          <br />
          감사합니다.
        </p>
        {/* <p className='mt-6 text-sm text-gray-600'>산결 &amp; 수민</p> */}
      </motion.div>

      {/* 이미지 */}
      <div className='relative'>
        <img src='/images/gallery10.jpg' alt='감사합니다' className='object-cover w-full h-[70vh]' />
        {/* 상단 그라데이션 */}
        <div className='absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent' />
      </div>
    </div>
  )
}
