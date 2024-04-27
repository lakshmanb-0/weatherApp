'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TypeGeoNames } from '../types'
import { getGeoNames } from '../../actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '../hooks/useToast'
import { TbLocationCheck } from 'react-icons/tb'
import Search from './Search'
import { myThrottle } from '../utils/utils'

const TableView: React.FC<{ data: TypeGeoNames[] }> = ({ data }) => {
    const [sortedData, setSortedData] = useState<TypeGeoNames[]>(data)
    const [filter, setFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [limit, setLimit] = useState<number>(0)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const infinityRef = useRef<HTMLDivElement>(null)
    const showToast = useToast()


    useEffect(() => {
        // session storage check
        let session = JSON.parse(sessionStorage.getItem('limit')!)
        if (session) {
            setLimit(session.limit)
            setSearchQuery(session.searchQuery)
            let value = session.searchQuery.replace(/^.*"(.*)".*$/, '$1');
            setSearch(value)
        }
        else setLimit(20)



        // intersection observer for infinity scroll
        const observer = new IntersectionObserver(entries => {
            const first = entries[0];
            if (first.isIntersecting) {
                setLimit((prev = 20) => Math.min(prev + 10, 100));
            }
        }, { threshold: 0.1 });

        if (infinityRef.current) {
            observer.observe(infinityRef.current);
        }


        // scroll listener
        window.addEventListener('scroll', handleScrollThrottled);
        return () => {
            if (infinityRef.current) observer.unobserve(infinityRef.current);
            window.removeEventListener('scroll', handleScrollThrottled);

        };
    }, [])

    // Fetch data from GeoNames API based on scroll
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            let data: { message: string, results: TypeGeoNames[] } = await getGeoNames(`&limit=${limit}${searchQuery}`)
            if (data?.message) showToast(data?.message, 'error')
            else {
                fetchFIlterDAta(data.results)
                sessionStorage.setItem('limit', JSON.stringify({ limit: limit, searchQuery: searchQuery }));
            }
            setLoading(false)

            //scroll restoration after data fetch
            if (!!sessionStorage.getItem('scrollPosition')) {
                setTimeout(() => {
                    window.scrollTo({
                        top: JSON.parse(sessionStorage.getItem('scrollPosition')!),
                        behavior: 'smooth'
                    })
                    sessionStorage.removeItem('scrollPosition')
                }, 1000);
            }
        }
        !!limit && fetchData()
    }, [limit])

    // Fetch data from GeoNames API based on filter
    useEffect(() => {
        fetchFIlterDAta(sortedData)
    }, [filter])

    // Handle Filter state according to user selection
    const fetchFIlterDAta = async (data: TypeGeoNames[]) => {
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
    }
    // Handle onclick of filter option 
    const handleFilter = (e: React.MouseEvent<HTMLElement>) => {
        let { innerText } = e.target as HTMLElement
        let filterOption = innerText.replace(/[^a-zA-Z]/g, '').toLowerCase()

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

    // Throttling the scroll event handler
    const handleScrollThrottled = myThrottle(() => {
        if ((window.scrollY + window.innerHeight) >= document.documentElement.offsetHeight - 600) {
            setLimit((prev = 20) => Math.min(prev + 10, 100));
        }
    }, 1000);

    // Handle search input change
    const onChangeSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, [setSearch])

    // Handle Search input on enter key press and update search query state with user input value
    const handleSearchEnter = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        let { value } = e.target as HTMLInputElement;
        if (e.key === 'Enter' && value.length > 0) {
            e.preventDefault()
            setFilter('')
            setSearchQuery(`&where=search(name,"${value}")`)
            setLimit(prev => prev == 30 ? 20 : 30)
        }
    }, [])

    // Reset Table
    const resetTable = () => {
        setFilter('')
        setSearchQuery('')
        setLimit(20)
        setSearch('')
        sessionStorage.removeItem('limit')
    }

    return (
        <div>
            <section className='w-full flex justify-center mt-5 sm:mt-10 items-center gap-4 px-2'>
                <Search search={search} onChangeSearch={onChangeSearch} handleSearchEnter={handleSearchEnter} />
                <Link
                    href={`/locations`}
                    title='Check previous locations'
                >
                    <TbLocationCheck size={20} />
                </Link>
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
                            <th className='p-5 cursor-pointer' onClick={handleFilter}>
                                Name
                                {filter.includes('name ASC') ? <>&#8693;</> : <>&#8645;</>}
                            </th>
                            <th className='p-5 cursor-pointer' onClick={handleFilter}>
                                Country
                                {filter.includes('country ASC') ? <>&#8693;</> : <>&#8645;</>}

                            </th>
                            <th className='p-5 hidden sm:block'>Timezone</th>
                            <th className='p-5 cursor-pointer truncate ...' onClick={handleFilter}>
                                Population
                                {filter.includes('population ASC') ? <>&#8693;</> : <>&#8645;</>}
                            </th>
                        </tr>
                    </thead>
                    <tbody className='p-4 dark:text-white/70 text-sm sm:text-base'>
                        {!!sortedData?.length
                            ? sortedData?.map((item) => (
                                <TableRows item={item} key={item.geoname_id} />
                            ))
                            : <tr className='text-center'><td colSpan={5} className='p-4'>No City found</td></tr>
                        }
                    </tbody>
                </table>
                <div className={`absolute inset-0 cursor-pointer w-full h-full rounded-2xl backdrop-blur-sm bg-transparent ${(loading && searchQuery.length) ? 'block' : 'hidden'}`} />
            </div>

            <div>
                <div ref={infinityRef} className={`${sortedData?.length < limit || limit == 100 ? 'hidden' : 'block'}`} />
                {!!loading && <div className='w-full text-center text-lg animate-bounce py-2'>Loading...</div>}
                {limit == 100 && (
                    <div className='w-fit mx-auto text-center pb-5'>
                        No cities found?. Please try searching.
                    </div>
                )}
            </div>

        </div>
    )
}

export default TableView;


// table rows 
const TableRows = ({ item }: { item: TypeGeoNames }) => {
    const router = useRouter()
    return (
        <tr className='odd:bg-lightBlue/50 dark:odd:bg-darkGray/10 hover:bg-skyBlue dark:hover:bg-skyBlue  hover:text-white dark:hover:text-white cursor-pointer'
            onClick={() => {
                sessionStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
                router.push(`/weather/${item.coordinates.lat}/${item.coordinates.lon}`)
            }}
        >
            <td className='p-4 hidden sm:block'>{item.geoname_id}</td>
            <td className='p-4 truncate ...'>{item.name}</td>
            <td className='p-4 truncate ...' title={item.cou_name_en}>{item.cou_name_en}</td>
            <td className='p-4 truncate ... hidden sm:block' title={item.timezone} >{item.timezone}</td>
            <td className='p-4'>{item.population.toLocaleString()}</td>
        </tr>
    )
}