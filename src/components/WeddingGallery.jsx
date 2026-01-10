import { useState, useCallback, useEffect, memo, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { galleryImages } from '../constants/galleryImages'

const thumbnailImages = galleryImages.slice(0, 9)

function WeddingGallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    dragFree: false,
    containScroll: 'trimSnaps',
  })

  const touchStartY = useRef(0)

  const openModal = useCallback((index) => {
    setSelectedImage(index)
    setCurrentIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = ''
  }, [])

  // 아래로 스와이프 감지
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY.current
      if (deltaY > 80) {
        closeModal()
      }
    },
    [closeModal],
  )

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
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi && selectedImage !== null) {
      emblaApi.scrollTo(selectedImage, true)
    }
  }, [emblaApi, selectedImage])

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
      <div className='grid grid-cols-3 gap-1 px-4'>
        {thumbnailImages.map((src, index) => (
          <div key={index} className='overflow-hidden cursor-pointer aspect-square' onClick={() => openModal(index)}>
            <img src={src} alt={`웨딩 사진 ${index + 1}`} className='object-cover w-full h-full' />
          </div>
        ))}
      </div>
      <p className='flex items-center justify-center gap-1 mt-6 text-sm text-center text-gray-400'>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
          />
        </svg>
        사진을 누르면 더 많은 사진을 볼 수 있어요
      </p>

      {selectedImage !== null && (
        <div className='fixed inset-0 z-50 flex justify-center bg-black' onClick={closeModal}>
          <div
            className='relative w-full max-w-[640px] h-full'
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeModal}
              className='absolute z-10 flex items-center justify-center w-10 h-10 text-3xl text-white top-4 right-4'
              aria-label='닫기'
            >
              ✕
            </button>
            <div className='absolute z-10 text-sm text-white -translate-x-1/2 top-4 left-1/2'>
              {currentIndex + 1} / {galleryImages.length}
            </div>
            <div className='flex items-center w-full h-full overflow-hidden' ref={emblaRef}>
              <div className='flex h-full'>
                {galleryImages.map((src, index) => (
                  <div key={index} className='flex-[0_0_100%] min-w-0 flex items-center justify-center h-full'>
                    <ModalImage src={src} index={index} isActive={Math.abs(currentIndex - index) <= 1} />
                  </div>
                ))}
              </div>
            </div>
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
        </div>
      )}
    </>
  )
}

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

export default WeddingGallery
