"use client"
import React, { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { CreatePlayerNoteRequest, GetPlayerNotesResponse, NoteData, NotesType, UpdatePlayerNoteRequest } from "../constants/types"
import { addNote, getPlayerNotesWithPlayerId, removeNote, updateNote } from "../lib/api"
import { formatDateToDDMMYYYYHHMMSS } from "@/utils/utils"
import { showToast } from "@/utils/toastUtil"

const categories: Record<NotesType, string> = {
  [NotesType.Financial]: "Finansal",
  [NotesType.Risk]: "Risk",
  [NotesType.Call]: "Call",
  [NotesType.Chat]: "Chat",
  [NotesType.Ban]: "Ban",
}

const categoryColors: Record<NotesType, string> = {
  [NotesType.Financial]: "bg-blue-100 text-blue-700",
  [NotesType.Risk]: "bg-red-100 text-red-700",
  [NotesType.Call]: "bg-green-100 text-green-700",
  [NotesType.Chat]: "bg-purple-100 text-purple-700",
  [NotesType.Ban]: "bg-gray-300 text-gray-800",
}

type Props = {
  playerId: number
}

const PlayerNotes = ({ playerId }: Props) => {
  const [notes, setNotes] = useState<NoteData[]>([])
  const [expandedNoteIds, setExpandedNoteIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add/Edit modal state
  const [showPopup, setShowPopup] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteData | null>(null)
  const [newCategory, setNewCategory] = useState<NotesType>(NotesType.Financial)
  const [newText, setNewText] = useState("")

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")

  useEffect(() => {
    loadNotes()
  }, [playerId])

  const loadNotes = async () => {
    const res: GetPlayerNotesResponse = await getPlayerNotesWithPlayerId(
      String(playerId)
    )
    if (res.isSuccess) {
      setNotes(res.notes)
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (!newText.trim()) return

    setIsSubmitting(true)

    if (editingNote) {
      // Update existing note
      const req: UpdatePlayerNoteRequest = {
        id: editingNote.id,
        noteType: newCategory,
        note: newText,
      }
      const res = await updateNote(req)
      if (res.isSuccess) {
        await loadNotes()
        setShowPopup(false)
        setEditingNote(null)
        showToast(res.message ? res.message : "Note updated", "success")
      }else{
        showToast(res.message ? res.message : "Error while updating the note", "error")
      }
    } else {
      // Add new note
      const req: CreatePlayerNoteRequest = {
        playerId,
        notesType: newCategory,
        note: newText,
      }
      const res = await addNote(req)
      if (res.isSuccess) {
        await loadNotes()
        setShowPopup(false)
        showToast(res.message ? res.message : "Note added", "success")
      }else{
        showToast(res.message ? res.message : "Error while adding the note", "error")
      }
    }

    setNewText("")
    setIsSubmitting(false)
  }

  const handleDelete = (id: number) => {
    setConfirmMessage("Bu notu silmek istediğinize emin misiniz?")
    setConfirmAction(() => async () => {
      setIsSubmitting(true)
      const res = await removeNote(id)
      if (res.isSuccess) {
        setNotes((prev) => prev.filter((n) => n.id !== id))
        showToast(res.message ? res.message : "Note removed", "success")
      }else{
        showToast(res.message ? res.message : "Error while removing the note", "error")
      }
      setConfirmOpen(false)
      setIsSubmitting(false);
    })
    setConfirmOpen(true)
  }

  const handleEdit = (note: NoteData) => {
    setNewCategory(note.type)
    setNewText(note.note)
    setEditingNote(note)
    setShowPopup(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingNote(null)
            setNewCategory(NotesType.Financial)
            setNewText("")
            setShowPopup(true)
          }}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2"
        >
          + Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => {
          const isExpanded = expandedNoteIds.includes(note.id)
          const isLong = note.note.length > 100
          const displayedText =
            isExpanded || !isLong ? note.note : note.note.slice(0, 100) + "..."

          return (
            <div
              key={note.id}
              className="border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] rounded-lg p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-sm ${
                      categoryColors[note.type]
                    }`}
                  >
                    {categories[note.type]}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {note.writerName}
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
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDateToDDMMYYYYHHMMSS(note.createdAt)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
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

      {/* Add/Edit Note Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              {editingNote ? "Edit Note" : "Add Note"}
            </h2>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(Number(e.target.value) as NotesType)
              }
              className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
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
            <div className="flex justify-end gap-3 mt-4">
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setShowPopup(false)
                  setEditingNote(null)
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-500"
              >
                Cancel
              </button>
              <button
                disabled = {isSubmitting}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {confirmMessage}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Bu aksiyon geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-500"
              >
                Geri
              </button>
              <button
                disabled={isSubmitting}
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-800"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerNotes
