function App() {
  return (
    <div className='w-full min-h-screen flex justify-center'>
      <div className='w-full flex flex-col items-center max-w-[640px]'>
        <div className='relative w-full'>
          {/* 이미지 */}
          <img src='/images/32 0Q0A7334a.jpg' className='w-full h-auto object-contain' alt='이미지' />

          {/* 이미지 위 텍스트 - 날짜/장소 */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white'>
            <p className='text-lg mb-1'>2025.10.18 SAT PM 02:00</p>
            <p className='text-xl font-medium'>로얄파크컨벤션</p>
          </div>
        </div>
        {/* 이미지 아래 영역 - 인사말 */}
        <div className='w-full py-20 text-center bg-white'>
          <span className='text-xl leading-loose text-gray-700 block mb-8'>Invitation</span>
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
          <img src='/images/20HS_1048a.jpg' className='w-full h-auto object-contain' alt='이미지' />
        </div>
        {/* 이미지2 아래 영역 - 신랑신부 소개 */}
        <div className='w-full py-20 text-center bg-white'>
          <span className='text-xl leading-loose text-gray-700 block'>김 홍만 · 이 정안 의 아들 산결</span>
          <span className='text-xl leading-loose text-gray-700 block'>이 승화 · 강 경아 의 딸 수민</span>
        </div>
        {/* 예식 안내 */}
        <div className='w-full px-8 py-20 text-center bg-white'>
          <span className='text-xl leading-loose text-gray-700 block'>예식 안내</span>
          <span className='text-xl leading-loose text-gray-700 block'>2026년 3월 22일 일요일 오후 2시 30분</span>
          <span className='text-xl leading-loose text-gray-700 block'>로얄파크컨벤션 1층 파크홀</span>
        </div>
      </div>
    </div>
  )
}
export default App
