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
  isChanged: boolean;
}

export default function DateRangePicker({
  onChange,
  onModifiedChange,
  initialStartDate = subDays(new Date(), 3),
  initialEndDate = new Date(),
  isChanged
}: DateRangePickerProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  })
  const [isUpdated, setIsUpdated] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsUpdated(isChanged)
  }, [isChanged])
  

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

  const formatDisplayDate = (date: Date | null) => {
    return date ? format(date, 'dd.MM.yyyy') : '00.00.00'
  }

  const handleCustomRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection
    setCustomRange({ startDate, endDate })
    if (onModifiedChange) onModifiedChange(true)
  }

  const handleApply = () => {
    if (customRange.startDate && customRange.endDate) {
      onChange({
        MinCreatedLocal: startOfDayISO(customRange.startDate),
        MaxCreatedLocal: endOfDayISO(customRange.endDate)
      })
    } else {
      // Clear the dates if none selected
      onChange({
        MinCreatedLocal: '',
        MaxCreatedLocal: ''
      })
    }
    setDropdownOpen(false)
  }

  const handleClear = () => {
    setCustomRange({ startDate: null, endDate: null })
    if (onModifiedChange) onModifiedChange(true)
  }

  useEffect(() => {
    // Initialize with default dates if not set
    if (!customRange.startDate && !customRange.endDate) {
      setCustomRange({
        startDate: initialStartDate,
        endDate: initialEndDate
      })
    }
  }, [initialStartDate, initialEndDate])

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
        {isUpdated ? `${formatDisplayDate(customRange.startDate)} - ${formatDisplayDate(customRange.endDate)}` : '00.00.00 - 00.00.00'}
      </button>

      {dropdownOpen && (
        <div className="absolute top-0 right-full mr-2 w-auto bg-white border border-gray-200 rounded-md shadow-md z-10 p-2">
          <DateRange
            ranges={[{
              startDate: customRange.startDate || initialStartDate,
              endDate: customRange.endDate || initialEndDate,
              key: 'selection'
            }]}
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