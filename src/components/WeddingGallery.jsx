import { useState, useCallback, useEffect, memo } from 'react'
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

  const openModal = useCallback((index) => {
    setSelectedImage(index)
    setCurrentIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = ''
  }, [])

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

      {selectedImage !== null && (
        <div className='fixed inset-0 z-50 flex justify-center bg-black' onClick={closeModal}>
          <div className='relative w-full max-w-[640px] h-full' onClick={(e) => e.stopPropagation()}>
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
