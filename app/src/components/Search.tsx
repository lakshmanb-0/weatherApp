'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '../hooks/useToast'
import { getSearchData } from '@/app/actions'
import { TypeSearchOptions } from '../types'
import Link from 'next/link'
import { IoMdLocate } from 'react-icons/io'
import { myDebounce } from '../utils/utils'

type Props = {
    search: string
    onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSearchEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Search: React.FC<Props> = ({ search, onChangeSearch, handleSearchEnter }) => {
    const inputOptionRef = useRef<HTMLUListElement>(null)
    const router = useRouter()
    const showToast = useToast()
    const [searchOption, setSearchOption] = useState<TypeSearchOptions[]>([])

    // Fetch Geo Location based on user permission
    const fetchGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    router.push(`/weather/${latitude}/${longitude}`);
                },
                () => showToast('Please allow location access', 'error')
            );
        }
    };

    // Update searchOption state after user pause typing for 400ms
    const debouncedHandleSearchData = myDebounce(async (value: string) => {
        let data = (value == '' ? [] : await getSearchData(value))
        setSearchOption(data)
    }, 400)

    useEffect(() => {
        search.length && debouncedHandleSearchData(search)
        return () => {
            debouncedHandleSearchData.cancel()
        }
    }, [search])


    //search options show or not
    const mouseEvent = (display: string) => {
        if (inputOptionRef && inputOptionRef.current) {
            inputOptionRef.current.style.display = display
        }
    }

    return (
        <div className='relative w-fit'
            onMouseLeave={() => mouseEvent('none')}
            onMouseEnter={() => mouseEvent('block')}
        >
            <input type="text"
                placeholder='Search'
                value={search}
                onKeyDown={handleSearchEnter}
                onChange={onChangeSearch}
                className='px-3 py-2 rounded-3xl outline-none border-2 border-transparent dark:bg-darkBlue focus-within:border-skyBlue pr-9 w-full'
            />
            <IoMdLocate
                size={20}
                title='Current Location'
                className='absolute top-3 right-3 cursor-pointer '
                onClick={fetchGeoLocation}
            />

            <div className='relative'>
                <ul className={`absolute top-0 w-full bg-white dark:bg-darkBlue z-10 hidden shadow-lg`}
                    ref={inputOptionRef}>
                    {
                        (searchOption?.length && search != '')
                            ? searchOption?.map((item: TypeSearchOptions, index: number) => (
                                <li key={index} className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-skyBlue'>
                                    <Link href={`/weather/${item.coordinates.lat}/${item.coordinates.lon}`} className='block' replace>{item.name + ', ' + item.cou_name_en}
                                    </Link>
                                </li>
                            ))
                            : (search !== '' && <li className='py-1'>No data found</li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default React.memo(Search)