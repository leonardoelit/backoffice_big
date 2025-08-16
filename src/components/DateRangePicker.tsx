'use client'

import React, { useEffect, useRef, useState } from 'react'
import { format, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns'
import { DateRange } from 'react-date-range'

type Option =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'This Month'
  | 'Last Month'
  | 'All Time'
  | 'Custom Date'

interface DateRangeResult {
  MinCreatedLocal: string
  MaxCreatedLocal: string
}

const formatDate = (date: Date) => format(date, 'dd-MM-yy')

export default function DateRangePicker({
  onChange,
}: {
  onChange: (range: DateRangeResult) => void
}) {
  const [selectedLabel, setSelectedLabel] = useState<Option>('Today')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: subDays(new Date(), 3),
    endDate: new Date(),
  })
  const [appliedCustomRange, setAppliedCustomRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: subDays(new Date(), 3),
    endDate: new Date(),
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  const calculateRange = (option: Option): DateRangeResult => {
    const now = new Date()
    let from = now
    let to = from

    switch (option) {
      case 'Today':
        from = now
        to = from
        break
      case 'Yesterday':
        from = subDays(now, 1)
        to = from
        break
      case 'Last 7 Days':
        from = subDays(now, 7)
        break
      case 'Last 30 Days':
        from = subDays(now, 30)
        break
      case 'This Month':
        from = startOfMonth(now)
        to = endOfMonth(now)
        break
      case 'Last Month': {
        const lastMonth = subMonths(now, 1)
        from = startOfMonth(lastMonth)
        to = endOfMonth(lastMonth)
        break
      }
       case 'All Time': {
        from = new Date(2000, 0, 1) // Jan 1, 2000
        to = now
        break
      }
      case 'Custom Date':
        from = appliedCustomRange.startDate
        to = appliedCustomRange.endDate
        break
    }

    return {
      MinCreatedLocal: formatDate(from),
      MaxCreatedLocal: formatDate(to),
    }
  }

  const handleSelect = (option: Option) => {
    setSelectedLabel(option)
    if (option !== 'Custom Date') {
      const range = calculateRange(option)
      onChange(range)
      setDropdownOpen(false)
    }
  }

  const handleCustomRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection
    setCustomRange({ startDate, endDate })
  }

  const handleApply = () => {
    setAppliedCustomRange({ ...customRange })
    const formatted = {
      MinCreatedLocal: formatDate(customRange.startDate),
      MaxCreatedLocal: formatDate(customRange.endDate),
    }
    onChange(formatted)
    setDropdownOpen(false)
  }

  const { MinCreatedLocal, MaxCreatedLocal } = calculateRange(selectedLabel)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 w-[190px] justify-between"
        >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {`${MinCreatedLocal.replace(/-/g, '.')} - ${MaxCreatedLocal.replace(/-/g, '.')}`}
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-md z-10 p-2">
          {(
            [
              'Today',
              'Yesterday',
              'Last 7 Days',
              'Last 30 Days',
              'This Month',
              'Last Month',
              'All Time',
              'Custom Date',
            ] as Option[]
          ).map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                selectedLabel === option ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {option}
            </button>
          ))}

          {selectedLabel === 'Custom Date' && (
            <div className="absolute top-0 right-full mr-2 z-20 bg-white border border-gray-200 rounded-md shadow-lg">
              <DateRange
                ranges={[
                  {
                    startDate: customRange.startDate,
                    endDate: customRange.endDate,
                    key: 'selection',
                  },
                ]}
                onChange={handleCustomRangeChange}
                maxDate={new Date()}
                rangeColors={['#3b82f6']}
              />

              <div className="flex justify-end px-3 pb-3">
                <button
                  onClick={handleApply}
                  className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
