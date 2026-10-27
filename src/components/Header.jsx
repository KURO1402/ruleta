import { Dices, Volume2, VolumeX } from 'lucide-react'

export default function Header({ soundEnabled = true, onToggleSound }) {
  return (
    <header className="border-b border-stone-200 bg-white shadow-xs">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Dices className="w-6 h-6 text-primary" />
          <span>Mi Ruleta</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider bg-stone-100 px-2.5 py-1 rounded-full">
            Aleatoria
          </span>
        </div>
      </div>
    </header>
  )
}
