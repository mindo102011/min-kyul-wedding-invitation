import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const accountData = {
  groom: {
    label: '신랑측 계좌번호',
    accounts: [
      { relation: '신랑', name: '김산결', bank: '카카오뱅크', account: '3333-00-0000000' },
      { relation: '신랑 아버지', name: '김홍만', bank: '국민은행', account: '000000-00-000000' },
      { relation: '신랑 어머니', name: '이정안', bank: '신한은행', account: '000-000-000000' },
    ],
  },
  bride: {
    label: '신부측 계좌번호',
    accounts: [
      { relation: '신부', name: '이수민', bank: '카카오뱅크', account: '3333-00-0000000' },
      { relation: '신부 아버지', name: '이승화', bank: '우리은행', account: '0000-000-000000' },
      { relation: '신부 어머니', name: '강경아', bank: '농협은행', account: '000-0000-0000-00' },
    ],
  },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        alert('복사 실패했습니다')
      }
    }
  }

  return (
    <button
      onClick={handleCopy}
      className='px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap'
    >
      {copied ? '복사됨' : '복사하기'}
    </button>
  )
}

function AccountAccordion({ type, data }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='w-full overflow-hidden border border-gray-200 rounded-xl'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between w-full px-5 py-4 text-left transition-colors bg-white hover:bg-gray-50'
      >
        <span className='font-medium text-gray-700'>{data.label}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className='w-5 h-5 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='border-t border-gray-200 bg-gray-50/50'>
              {data.accounts.map((account, index) => (
                <div
                  key={index}
                  className={`px-5 py-4 ${index !== data.accounts.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-xs text-gray-400'>{account.relation}</span>
                      <span className='text-sm font-medium text-gray-700'>{account.name}</span>
                      <span className='text-sm text-gray-600'>
                        {account.bank} {account.account}
                      </span>
                    </div>
                    <CopyButton text={`${account.bank} ${account.account}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AccountSection() {
  return (
    <div className='w-full px-6 py-16 bg-white'>
      <motion.div
        className='max-w-md mx-auto'
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h3 className='mb-4 text-xl text-center text-gray-600' style={{ fontFamily: 'WhiteAngelica' }}>
          Gift
        </h3>
        <p className='mb-8 text-sm leading-relaxed text-center text-gray-500'>
          마음 전해주실 곳을 안내드립니다.
          <br />
          보내주시는 축복, 감사히 간직하겠습니다.
        </p>

        <div className='flex flex-col gap-3'>
          <AccountAccordion data={accountData.groom} />
          <AccountAccordion data={accountData.bride} />
        </div>
      </motion.div>
    </div>
  )
}
