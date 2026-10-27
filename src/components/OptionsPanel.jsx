import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

const COLORES_SECTORES = [
  '#E28413', '#1F7A74', '#F2B84B', '#5B2A4E',
  '#D64045', '#467599', '#2B9348', '#8338EC',
  '#3A86FF', '#FB5607', '#06D6A0', '#FF006E'
]

export default function OptionsPanel({
  opciones = [],
  onAddOption,
  onRemoveOption,
  onClearOptions
}) {
  const [inputText, setInputText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const textoLimpio = inputText.trim()
    if (textoLimpio.length === 0) {
      alert('Ingrese una opcion valida')
      return
    }
    onAddOption(textoLimpio)
    setInputText('')
  }

  return (
    <section id="panel-opciones" className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Opciones</h2>
          {opciones.length > 0 && (
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
              {opciones.length}
            </span>
          )}
        </div>
        {opciones.length > 0 && onClearOptions && (
          <button
            type="button"
            onClick={onClearOptions}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Borrar todas</span>
          </button>
        )}
      </div>

      <form id="form-opciones" onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          id="input-opcion"
          type="text"
          placeholder="Nueva opción"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 min-w-0 rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder-stone-400 focus:outline-2 focus:outline-primary transition-all"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>Añadir</span>
        </button>
      </form>

      <ul id="lista-opciones" className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
        {opciones.length === 0 ? (
          <li className="text-stone-400 py-2">Aún no hay opciones.</li>
        ) : (
          opciones.map((opcion, index) => {
            const color = COLORES_SECTORES[index % COLORES_SECTORES.length]
            return (
              <li
                key={`${opcion}-${index}`}
                className="flex items-center justify-between rounded-lg bg-background px-3 py-2 group hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium text-stone-700">{opcion}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveOption(index)}
                  className="boton-eliminar text-stone-400 hover:text-red-600 cursor-pointer p-1 transition-colors"
                  data-index={index}
                  aria-label={`Eliminar ${opcion}`}
                >
                  <X size={16} />
                </button>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
