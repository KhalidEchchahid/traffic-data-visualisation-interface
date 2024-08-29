"use client"
import React from 'react'
import { Button } from './ui/button'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  pageNumber : number ,
  isNext: boolean 
}

const Pagination = ({ pageNumber, isNext }: Props) => {

  const router = useRouter();

  const searchParams = useSearchParams();

  const handelNavigation = (direction: string) => {
    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    })

    router.push(newUrl);
  }

  return (
    <div className='flex w-full items-center justify-center gap-2 mb-10'>
      <Button
        disabled={pageNumber === 1}
        onClick={() => handelNavigation('prev')}
        className='border-gray-200 btn flex min-h-[36px] items-center justify-center gap-2 border bg-white'
      >
        <p className='text-body-medium text-slate-600'>Prev</p>
      </Button>
      <div className='bg-black flex justify-center items-center rounded-md px-3.5 py-2'>
        <p className='text-body-semibold text-white'>{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handelNavigation('next')}
        className='border-gray-200 btn flex min-h-[36px] items-center justify-center gap-2 border bg-white'
      >
        <p className='text-body-medium text-slate-600'>Next</p>
      </Button>
    </div>
  )
}



export default Pagination