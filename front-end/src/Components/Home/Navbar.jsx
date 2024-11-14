import React from 'react'
import { BsPerson } from 'react-icons/bs'
import {HomeStyle} from './HomeStyle.css'
import { HiOutlineMenuAlt4 } from 'react-icons/hi';

const Navbar = () => {
  return (
    <div className='flex w-full justify-between items-center h-20 px-4 absolute z-10 text-black'>

        <div>
            <h1>AID NEARBY</h1>
        </div>

        <ul className='hidden md:flex'>
            <li>Home</li>
            <li>My Profile</li>
            <li>Ads</li>
            <li>My history</li>
            <li>Help</li>
        </ul>

        <div className='hidden md:flex'>
            <BsPerson size={20} />
        </div>

        {/* Hamburger */}
        <div className='md:hidden z-10'>
            <HiOutlineMenuAlt4 size={20} />
        </div>

        <div className='absolute text-black left-0 top-0 w-full bg-gray-100/90 px-4 py-7 flex flex-col'>
            <ul className='hidden md:flex'>
                <li>Home</li>
                <li>My Profile</li>
                <li>Ads</li>
                <li>My history</li>
                <li>Help</li>

                <div className='flex flex-col'>
                    <button>Account</button>
                    <button>Logout</button>
                </div>
            </ul>
            
        </div>

        
      
    </div>
  )
}

export default Navbar
