import { useEffect, useRef } from 'react'
import { Trophy, Trash2, X } from 'lucide-react'
import { playWinSound } from '../utils/audio'

export default function ResultModal({
  isOpen = false,
  winner = '',
  soundEnabled = true,
  onClose,
  onDeleteWinner
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
        if (soundEnabled) {
          playWinSound()
        }
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen, soundEnabled])

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose?.()
    }
  }

  const handleDelete = () => {
    onDeleteWinner?.()
    onClose?.()
  }

  return (
    <dialog
      ref={dialogRef}
      id="modal-resultado"
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault()
        onClose?.()
      }}
      className="m-auto w-80 rounded-2xl p-6 text-center backdrop:bg-black/50 shadow-2xl transition-all"
    >
      <div className="flex flex-col items-center">
        <div className="p-3 bg-amber-50 rounded-full mb-2">
          <Trophy size={36} className="text-primary" />
        </div>
        <p className="text-stone-500 font-medium">La ruleta eligió</p>
        <p
          id="modal-texto"
          className="mt-2 text-3xl font-extrabold text-primary break-words max-w-full"
        >
          {winner || '—'}
        </p>

        <div className="mt-6 flex flex-col gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-sm"
          >
            <X size={18} />
            <span>Cerrar</span>
          </button>
          <button
            id="btn-eliminar"
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-red-300 py-2.5 font-semibold text-red-600 hover:bg-red-50 active:scale-98 transition-all cursor-pointer"
          >
            <Trash2 size={18} />
            <span>Eliminar esta opción</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
