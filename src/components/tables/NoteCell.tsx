import { useState, useRef, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { showToast } from "@/utils/toastUtil"

function NoteCell({ note }: { note?: string }) {
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // reposition when opening
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      setAlignRight(rect.left + 300 > viewportWidth) // 300 ~ popover width
    }
  }, [open])

  if (!note) return <span>-</span>

  const handleCopy = () => {
    navigator.clipboard.writeText(note!)
    setCopied(true)
    showToast("Note copied", "info")

    setTimeout(() => {
      setCopied(false)
    }, 2000) // revert after 2s
  }

  return (
    <div ref={ref} className="relative inline-block">
      {/* truncated note */}
      <button
        onClick={() => setOpen(!open)}
        className="max-w-[170px] truncate text-left text-blue-600 hover:underline"
      >
        {note}
      </button>

      {/* Popover */}
      {open && (
        <div
          className={`absolute top-full mt-2 w-72 z-20 animate-fadeIn ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {/* Arrow */}
          <div
            className={`absolute -top-2 ${
              alignRight ? "right-6" : "left-6"
            } w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-700`}
          ></div>

          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-3 text-sm">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 max-h-40 overflow-auto">
              {note}
            </div>
            <button
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteCell
