'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'

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

export default function DateRangePickerWithTime({
  onChange,
  onModifiedChange,
  initialStartDate = new Date(new Date().setHours(0, 0, 0, 0)), // today start
  initialEndDate = new Date(new Date().setHours(23, 59, 59, 999)), // today end
  isChanged
}: DateRangePickerProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{
    startDate: Date | null
    endDate: Date | null
    startHour: string
    startMinute: string
    endHour: string
    endMinute: string
  }>({
    startDate: null,
    endDate: null,
    startHour: '00',
    startMinute: '00',
    endHour: '23',
    endMinute: '59'
  })

  const [isUpdated, setIsUpdated] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsUpdated(isChanged)
  }, [isChanged])

  const formatDisplayDate = (date: Date | null, hour?: string, minute?: string) => {
    if (!date) return '00.00.00'
    return `${format(date, 'dd.MM.yyyy')} ${hour ?? '00'}:${minute ?? '00'}`
  }

  const handleCustomRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection
    setCustomRange((prev) => ({
      ...prev,
      startDate,
      endDate
    }))
    if (onModifiedChange) onModifiedChange(true)
  }

  const handleApply = () => {
    if (customRange.startDate && customRange.endDate) {
      const start = new Date(customRange.startDate)
      const end = new Date(customRange.endDate)

      start.setHours(Number(customRange.startHour), Number(customRange.startMinute), 0, 0)
      end.setHours(Number(customRange.endHour), Number(customRange.endMinute), 59, 999)

      onChange({
        MinCreatedLocal: start.toISOString(),
        MaxCreatedLocal: end.toISOString()
      })
    } else {
      onChange({
        MinCreatedLocal: '',
        MaxCreatedLocal: ''
      })
    }
    setDropdownOpen(false)
  }

  const handleClear = () => {
    setCustomRange({
      startDate: null,
      endDate: null,
      startHour: '00',
      startMinute: '00',
      endHour: '23',
      endMinute: '59'
    })
    if (onModifiedChange) onModifiedChange(true)
  }

  useEffect(() => {
  if (
    customRange.startDate?.getTime() !== initialStartDate?.getTime() ||
    customRange.endDate?.getTime() !== initialEndDate?.getTime()
  ) {
    setCustomRange((prev) => ({
      ...prev,
      startDate: initialStartDate || null,
      endDate: initialEndDate || null,
      startHour: initialStartDate ? String(initialStartDate.getHours()).padStart(2,'0') : '00',
      startMinute: initialStartDate ? String(initialStartDate.getMinutes()).padStart(2,'0') : '00',
      endHour: initialEndDate ? String(initialEndDate.getHours()).padStart(2,'0') : '23',
      endMinute: initialEndDate ? String(initialEndDate.getMinutes()).padStart(2,'0') : '59'
    }))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [initialStartDate?.getTime(), initialEndDate?.getTime()])


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
        className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 w-[260px] justify-between"
      >
        {isUpdated
          ? `${formatDisplayDate(customRange.startDate, customRange.startHour, customRange.startMinute)} - ${formatDisplayDate(customRange.endDate, customRange.endHour, customRange.endMinute)}`
          : '00.00.00 00:00 - 00.00.00 00:00'}
      </button>

      {dropdownOpen && (
        <div className="absolute top-0 left-0 -translate-x-full w-auto bg-white border border-gray-200 rounded-md shadow-md z-10 p-3">

          <DateRange
            ranges={[
              {
                startDate: customRange.startDate || initialStartDate,
                endDate: customRange.endDate || initialEndDate,
                key: 'selection'
              }
            ]}
            onChange={handleCustomRangeChange}
            maxDate={new Date()}
            rangeColors={['#3b82f6']}
          />

          {/* Time inputs */}
          <div className="flex items-center justify-between gap-4 px-2 py-2 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-600 mb-1">Start Time</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={customRange.startHour}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, startHour: e.target.value }))
                  }
                  className="w-14 border rounded px-2 py-1"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customRange.startMinute}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, startMinute: e.target.value }))
                  }
                  className="w-14 border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-600 mb-1">End Time</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={customRange.endHour}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, endHour: e.target.value }))
                  }
                  className="w-14 border rounded px-2 py-1"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customRange.endMinute}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, endMinute: e.target.value }))
                  }
                  className="w-14 border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between px-3 pb-2">
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
