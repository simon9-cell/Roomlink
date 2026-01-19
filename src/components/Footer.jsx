import React from 'react'

const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full h-10 bg-black/10 backdrop-blur-md border-t border-white/30 py-8 font-body'>
      <div className='max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
        
        <div className='flex flex-col items-center md:items-start'>
          <h1 className='text-2xl font-black text-[#00df9a] font-logo'>RoomLink</h1>
          <p className='text-xs text-gray-400'>Connecting rooms and people.</p>
        </div>

        <ul className='flex gap-8 text-gray-300 text-sm'>
          <li className='hover:text-[#00df9a] cursor-pointer'>About</li>
          <li className='hover:text-[#00df9a] cursor-pointer'>Privacy</li>
        </ul>

        {/* Dynamic Year goes here */}
        <p className='text-sm text-gray-300 uppercase tracking-widest'>
          © {currentYear} RoomLink
        </p>
      </div>
    </footer>
  )
}

export default Footer