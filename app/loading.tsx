import Image from 'next/image'
import React from 'react'

const loading = () => {
    return (
        <div className='w-full h-screen grid place-items-center'>
            <Image src='/loading.gif' alt='weather' width={400} height={400} />
        </div>
    )
}

export default loading