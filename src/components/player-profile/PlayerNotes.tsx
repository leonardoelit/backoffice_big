"use client"
import React, { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

type Note = {
  id: number
  category: string
  text: string
  author: string
  CreatedAt: string
}

const categories = ["Finansal", "Risk", "Call", "Chat", "Ban"]

// 🎨 Category colors
const categoryColors: Record<string, string> = {
  Finansal: "bg-blue-100 text-blue-700",
  Risk: "bg-red-100 text-red-700",
  Call: "bg-green-100 text-green-700",
  Chat: "bg-purple-100 text-purple-700",
  Ban: "bg-gray-300 text-gray-800",
}

const PlayerNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      category: "Finansal",
      text: "Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.",
      author: "BuzzAdmin",
      CreatedAt: "2025-06-20 14:30",
    },
    {
      id: 2,
      category: "Call",
      text: "Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.Oyuncu ile yapılan telefon görüşmesinden not alındı.",
      author: "Admin Teknik",
      CreatedAt: "2025-06-20 14:30",
    },
    {
        id: 3,
        category: "Risk",
        text: "Oyuncu ile yapılan telefon görüşmesinden not alındı.",
        author: "Admin Teknik",
        CreatedAt: "2025-06-20 14:30",
      },
      {
        id: 4,
        category: "Chat",
        text: "Oyuncu ile yapılan telefon görüşmesinden not alındı.",
        author: "Admin Teknik",
        CreatedAt: "2025-06-20 14:30",
      },
      {
        id: 5,
        category: "Ban",
        text: "Test note id 5 category Ban.",
        author: "Admin Teknik",
        CreatedAt: "2025-06-20 14:30",
      },
  ])

  const [expandedNoteIds, setExpandedNoteIds] = useState<number[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [newCategory, setNewCategory] = useState(categories[0])
  const [newText, setNewText] = useState("")
  const [newAuthor, setNewAuthor] = useState("")

  const toggleExpand = (id: number) => {
    setExpandedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  const handleAddNote = () => {
    if (!newText.trim() || !newAuthor.trim()) return
    const newNote: Note = {
      id: Date.now(),
      category: newCategory,
      text: newText,
      author: newAuthor,
    }
    setNotes([newNote, ...notes])
    setShowPopup(false)
    setNewText("")
    setNewAuthor("")
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((n) => n.id !== id))
    }
  }

  const handleEdit = (id: number) => {
    if (confirm("Are you sure you want to edit this note?")) {
      alert("Edit flow will be added later 🚀") // placeholder
    }
  }

  return (
    <div className="space-y-4">
      {/* Top-right Add Note Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Add Note
        </button>
      </div>

      {/* Notes Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {notes.map((note) => {
    const isExpanded = expandedNoteIds.includes(note.id)
    const isLong = note.text.length > 100
    const displayedText =
      isExpanded || !isLong ? note.text : note.text.slice(0, 100) + "..."

    return (
      <div
        key={note.id}
        className="border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] rounded-lg p-4 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-sm ${
                categoryColors[note.category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {note.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {note.author}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {displayedText}
          </p>

          {isLong && (
            <button
              onClick={() => toggleExpand(note.id)}
              className="text-xs text-blue-600 bg-[#1549e521] rounded-sm px-2 py-1 hover:underline mt-1"
            >
              {isExpanded ? "Daha az ↑" : "Devamını Oku ↓"}
            </button>
          )}
        </div>

        {/* Bottom: CreatedAt and Buttons */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400 dark:text-gray-500">
          {note.CreatedAt || "Tarih Yok"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(note.id)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => handleDelete(note.id)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    )
  })}
</div>


      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Add Note
            </h2>

            {/* Category Selector */}
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Note Input */}
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Note
            </label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={4}
              className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerNotes
