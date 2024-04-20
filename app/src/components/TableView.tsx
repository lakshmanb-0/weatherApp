'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TypeGeoNames, TypeSearchOptions } from '../types'
import { getGeoNames, getSearchData } from '../../actions'
import Link from 'next/link'
import { IoMdLocate } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { useToast } from '../hooks/useToast'
import { TbLocationCheck } from 'react-icons/tb'

const TableView = ({ data }: { data: TypeGeoNames[] }) => {
    const [sortedData, setSortedData] = useState<TypeGeoNames[]>(data)
    const [filter, setFilter] = useState<string>('limit')
    const [search, setSearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [searchOption, setSearchOption] = useState<TypeSearchOptions[]>([])
    const [limit, setLimit] = useState<number>(20)
    const [searchQuery, setSearchQuery] = useState('')
    const infinityRef = useRef<HTMLDivElement>(null)
    const inputOptionRef = useRef<HTMLUListElement>(null)
    const router = useRouter()
    const showToast = useToast()

    // Fetch data from GeoNames API based on filter
    useEffect(() => {
        fetchFIlterDAta(sortedData)
    }, [filter])

    useEffect(() => {
        let session = JSON.parse(sessionStorage.getItem('limit')!)
        if (session) {
            setLimit(session.limit)
            setSearchQuery(session.searchQuery)
        }
    }, [])

    // Handle infinity scroll and update limit state
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const first = entries[0];
            if (first.isIntersecting) {
                setLimit(prev => prev + 10)
            }
        }, { threshold: 1.0 });

        if (infinityRef.current) {
            observer.observe(infinityRef.current);
        }

        return () => {
            if (infinityRef.current) observer.unobserve(infinityRef.current);
        };
    }, []);

    // Fetch data from GeoNames API based on scroll
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            let data: { message: string, results: TypeGeoNames[] } = await getGeoNames(`&limit=${limit}${searchQuery}`)
            if (data?.message) { showToast(data?.message, 'error') }
            else {
                fetchFIlterDAta(data.results)
                sessionStorage.setItem('limit', JSON.stringify({ limit: limit, searchQuery: searchQuery }));
            }
            setLoading(false)
        }
        fetchData()
    }, [limit])

    // Handle Filter state according to user selection
    const fetchFIlterDAta = async (data: TypeGeoNames[]) => {
        setLoading(true)

        let filterData = [...data ?? []]
        switch (filter) {
            case 'name ASC':
                filterData.sort((a, b) => a.name.localeCompare(b.name))
                break;
            case 'name DESC':
                filterData.sort((a, b) => b.name.localeCompare(a.name))
                break;
            case 'population ASC':
                filterData.sort((a, b) => a.population - b.population)
                break;
            case 'population DESC':
                filterData.sort((a, b) => b.population - a.population)
                break;
            case 'country ASC':
                filterData.sort((a, b) => a.cou_name_en.localeCompare(b.cou_name_en))
                break;
            case 'country DESC':
                filterData.sort((a, b) => b.cou_name_en.localeCompare(a.cou_name_en))
                break;
        }
        setSortedData(filterData)

        setLoading(false)
    }

    // Handle onclick of filter option 
    const handleFilter = (filterOption: string) => {
        switch (filterOption) {
            case 'name':
                setFilter(prev => prev === 'name ASC' ? 'name DESC' : 'name ASC')
                break;
            case 'population':
                setFilter(prev => prev === 'population ASC' ? 'population DESC' : 'population ASC')
                break;
            case 'country':
                setFilter(prev => prev === 'country ASC' ? 'country DESC' : 'country ASC')
                break;
        }
    }

    // Handle Search input on change and update search option 
    useEffect(() => {
        const handleSearchData = async () => {
            let data = (search == '' ? [] : await getSearchData(search))
            setSearchOption(data)
        }
        search.length && handleSearchData()
    }, [search])

    // Handle Search input on enter key press and update search query state with user input value
    const handleSearchEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search.length > 0) {
            e.preventDefault()
            setFilter('')
            setSearchQuery(`&where=search(name,"${search}")`)
            setLimit(prev => prev == 30 ? 20 : 30)
            // setSearch('')
        }
    }

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

    // Reset Table
    const resetTable = () => {
        setFilter('')
        setSearchQuery('')
        setLimit(20)
        setSearch('')
    }

    return (
        <div>
            <section className='w-fit mx-auto flex mt-5 sm:mt-10 items-center gap-4 px-2'>
                <div className='relative'
                    onMouseLeave={() => {
                        if (inputOptionRef && inputOptionRef.current) {
                            inputOptionRef.current.style.display = 'none';
                        }
                    }}
                    onMouseEnter={() => {
                        if (inputOptionRef && inputOptionRef.current) {
                            inputOptionRef.current.style.display = 'block';
                        }
                    }}
                >
                    <input type="text"
                        placeholder='Search'
                        value={search}
                        onKeyDown={handleSearchEnter}
                        onChange={(e) => setSearch(e.target.value)}
                        className='px-3 py-2 rounded-3xl outline-none border-2 border-transparent dark:bg-darkBlue focus-within:border-skyBlue pr-9 w-full' />
                    <div className='absolute top-3 right-3 cursor-pointer ' onClick={fetchGeoLocation}><IoMdLocate size={20} /></div>

                    <div className='relative'>
                        <ul className={`absolute top-0 w-full bg-white dark:bg-darkBlue z-10 ${search.length ? 'block' : 'hidden'} shadow-lg`}
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
                <div>
                    <Link href={`/locations`}
                        title='Check previous locations'
                    >
                        <TbLocationCheck size={20} />
                    </Link>
                </div>
            </section>
            <div className='w-fit ml-auto mr-4 sm:mr-10'>
                <button className='mt-3 text-sm p-2 sm:p-3 bg-darkBlue dark:bg-white text-white dark:text-darkBlue rounded-xl '
                    onClick={resetTable}
                >
                    Reset Table
                </button>
            </div>

            <div className='m-4 sm:m-10 relative'>
                <table className='w-full bg-white dark:bg-darkBlue rounded-3xl table-fixed '>
                    <thead >
                        <tr className='border-b-2 text-left text-sm sm:text-xl font-bold border-b-gray-100'>
                            <th className='p-5 hidden sm:block'>Id</th>
                            <th className='p-5 cursor-pointer' onClick={() => handleFilter('name')}>
                                Name
                                {filter.includes('name ASC') ? <>&#8693;</> : <>&#8645;</>}
                            </th>
                            <th className='p-5 cursor-pointer' onClick={() => handleFilter('country')}>
                                Country
                                {filter.includes('country ASC') ? <>&#8693;</> : <>&#8645;</>}

                            </th>
                            <th className='p-5 hidden sm:block'>Timezone</th>
                            <th className='p-5 cursor-pointer truncate ...' onClick={() => handleFilter('population')}>
                                Population
                                {filter.includes('population ASC') ? <>&#8693;</> : <>&#8645;</>}
                            </th>
                        </tr>
                    </thead>
                    <tbody className='p-4 dark:text-white/70 text-sm sm:text-base'>
                        {sortedData?.map((item, index) => (
                            <tr key={index} className=' odd:bg-lightBlue/50 dark:odd:bg-darkGray/10 hover:bg-skyBlue dark:hover:bg-skyBlue  hover:text-white dark:hover:text-white'
                                onClick={() => router.push(`/weather/${item.coordinates.lat}/${item.coordinates.lon}`)}
                            >
                                <td className='p-4 hidden sm:block'>{item.geoname_id}</td>
                                <td className='p-4 truncate ...'>
                                    <Link href={`/weather/${item.coordinates.lat}/${item.coordinates.lon}`}>{item.name}
                                    </Link>
                                </td>
                                <td className='p-4 truncate ...' title={item.cou_name_en}>{item.cou_name_en}</td>
                                <td className='p-4 truncate ... hidden sm:block' title={item.timezone} >{item.timezone}</td>
                                <td className='p-4'>{item.population.toLocaleString()}</td>
                            </tr>
                        ))}
                        {sortedData?.length == 0 && <tr className='text-center'><td colSpan={5} className='p-4'>No City found</td></tr>}
                    </tbody>
                </table>
                <div className={`absolute inset-0 cursor-pointer w-full h-full rounded-2xl backdrop-blur-sm bg-transparent ${loading ? 'block' : 'hidden'}`} />

            </div>


            <div ref={infinityRef} className={`${sortedData?.length < limit || limit == 100 ? 'hidden' : 'block'}`} />
            {sortedData?.length <= limit && (
                <div className='w-fit mx-auto text-center pb-5'>
                    No cities found?. Please try searching.
                </div>
            )}
        </div>
    )
}

export default TableView