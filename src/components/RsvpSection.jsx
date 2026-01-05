import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyo9sApHoBs2dQXVCwC8-y4oFoA33c06XUFCrCw5doKhT40I1bFQIrYJsBdVj_m2ufvew/exec'

function RsvpSection() {
  const [formData, setFormData] = useState({
    name: '',
    side: '',
    attending: '',
    guests: '1',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const iframeRef = useRef(null)
  const sectionRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    if (!formData.name || !formData.side || !formData.attending) {
      e.preventDefault()
      alert('이름, 구분, 참석 여부를 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    // 2초 후 완료 처리 (iframe 응답 대기)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // 감사합니다 영역으로 스크롤
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div ref={sectionRef} className='w-full px-6 py-16 bg-white'>
        <motion.div
          className='max-w-md mx-auto text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='mb-4 text-4xl'>💌</div>
          <p className='mb-2 text-lg text-gray-700'>감사합니다!</p>
          <p className='text-sm text-gray-500'>참석 의사가 전달되었습니다.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='w-full px-6 py-16 bg-white'>
      {/* 숨겨진 iframe */}
      <iframe ref={iframeRef} name='hidden_iframe' style={{ display: 'none' }} />

      <motion.div
        className='max-w-md mx-auto'
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h3 className='mb-4 text-xl text-center text-gray-600' style={{ fontFamily: 'WhiteAngelica' }}>
          Attendance
        </h3>
        <p className='mb-8 text-sm leading-relaxed text-center text-gray-500'>
          축하의 마음으로 참석해주시는 분들을 위해
          <br />
          식사 준비를 하고 있습니다.
          <br />
          참석 여부를 알려주시면 감사하겠습니다.
        </p>

        <form
          action={GOOGLE_SCRIPT_URL}
          method='POST'
          target='hidden_iframe'
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          {/* 신랑측/신부측 */}
          <div>
            <label className='block mb-2 text-sm text-gray-600'>구분</label>
            <div className='flex gap-3'>
              <label className='flex-1'>
                <input
                  type='radio'
                  name='side'
                  value='신랑측'
                  checked={formData.side === '신랑측'}
                  onChange={handleChange}
                  className='sr-only peer'
                />
                <div className='py-3 text-sm text-center text-gray-600 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-400 peer-checked:text-blue-400 peer-checked:bg-blue-50'>
                  신랑측
                </div>
              </label>
              <label className='flex-1'>
                <input
                  type='radio'
                  name='side'
                  value='신부측'
                  checked={formData.side === '신부측'}
                  onChange={handleChange}
                  className='sr-only peer'
                />
                <div className='py-3 text-sm text-center text-gray-600 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-rose-400 peer-checked:text-rose-400 peer-checked:bg-rose-50'>
                  신부측
                </div>
              </label>
            </div>
          </div>

          {/* 참석 여부 */}
          <div>
            <label className='block mb-2 text-sm text-gray-600'>참석 여부</label>
            <div className='flex gap-3'>
              <label className='flex-1'>
                <input
                  type='radio'
                  name='attending'
                  value='참석'
                  checked={formData.attending === '참석'}
                  onChange={handleChange}
                  className='sr-only peer'
                />
                <div className='py-3 text-sm text-center text-gray-600 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-rose-400 peer-checked:text-rose-400 peer-checked:bg-rose-50'>
                  참석할게요
                </div>
              </label>
              <label className='flex-1'>
                <input
                  type='radio'
                  name='attending'
                  value='불참'
                  checked={formData.attending === '불참'}
                  onChange={handleChange}
                  className='sr-only peer'
                />
                <div className='py-3 text-sm text-center text-gray-600 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-gray-400 peer-checked:text-gray-500 peer-checked:bg-gray-50'>
                  참석이 어려워요
                </div>
              </label>
            </div>
          </div>

          {/* 참석 인원 - 참석 선택시에만 표시 */}
          {formData.attending === '참석' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className='block mb-2 text-sm text-gray-600'>참석 인원</label>
              <select
                name='guests'
                value={formData.guests}
                onChange={handleChange}
                className='w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400'
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* 이름 */}
          <div>
            <label className='block mb-2 text-sm text-gray-600'>이름</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='이름을 입력해주세요'
              className='w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400'
            />
          </div>

          {/* 메시지 */}
          <div>
            <label className='block mb-2 text-sm text-gray-600'>축하 메시지 (선택)</label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              placeholder='축하 메시지를 남겨주세요'
              rows={3}
              className='w-full px-4 py-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400'
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-3 mt-2 text-sm text-white transition-colors rounded-lg bg-rose-400 hover:bg-rose-500 disabled:bg-gray-300 disabled:cursor-not-allowed'
          >
            {isSubmitting ? '전송 중...' : '참석 의사 전달하기'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default RsvpSection
