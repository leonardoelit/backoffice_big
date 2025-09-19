'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import { subDays, format } from 'date-fns'

interface DateRangeResult {
  MinCreatedLocal: string
  MaxCreatedLocal: string
}

interface DateRangePickerProps {
  onChange: (range: DateRangeResult) => void
  onModifiedChange?: (modified: boolean) => void
  initialStartDate?: Date
  initialEndDate?: Date
  isChanged: boolean
}

export default function DateRangePicker({
  onChange,
  onModifiedChange,
  initialStartDate = new Date(),
  initialEndDate = new Date(),
  isChanged
}: DateRangePickerProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: initialStartDate,
    endDate: initialEndDate
  })
  const [isUpdated, setIsUpdated] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsUpdated(isChanged)
  }, [isChanged])

  useEffect(() => {
  setCustomRange({
    startDate: initialStartDate,
    endDate: initialEndDate
  })
}, [initialStartDate?.getTime(), initialEndDate?.getTime()])

  const startOfDayISO = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }

  const endOfDayISO = (date: Date) => {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
  }

  const formatDisplayDate = (date: Date) => {
    return format(date, 'dd.MM.yyyy')
  }

  const handleCustomRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection
    setCustomRange({ startDate, endDate })
    if (onModifiedChange) onModifiedChange(true)
  }

  const handleApply = () => {
    onChange({
      MinCreatedLocal: startOfDayISO(customRange.startDate),
      MaxCreatedLocal: endOfDayISO(customRange.endDate)
    })
    setDropdownOpen(false)
  }

  const handleClear = () => {
    const defaultStart = initialStartDate
    const defaultEnd = initialEndDate
    setCustomRange({ startDate: defaultStart, endDate: defaultEnd })
    if (onModifiedChange) onModifiedChange(true)
    onChange({
      MinCreatedLocal: startOfDayISO(defaultStart),
      MaxCreatedLocal: endOfDayISO(defaultEnd)
    })
  }

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
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-dark rounded-md px-4 py-2 text-sm text-black dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 w-[190px] justify-between"
      >
        {isUpdated
          ? `${formatDisplayDate(customRange.startDate)} - ${formatDisplayDate(customRange.endDate)}`
          : '00.00.00 - 00.00.00'}
      </button>

      {dropdownOpen && (
        <div className="absolute top-0 right-full mr-2 w-auto bg-white border border-gray-200 rounded-md shadow-md z-10 p-2">
          <DateRange
            ranges={[
              {
                startDate: customRange.startDate,
                endDate: customRange.endDate,
                key: 'selection'
              }
            ]}
            onChange={handleCustomRangeChange}
            maxDate={new Date()}
            rangeColors={['#3b82f6']}
          />

          <div className="flex justify-between px-3 pb-3">
            <button
              onClick={handleClear}
              className="mt-2 px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
            >
              Clear
            </button>
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
  )
}
