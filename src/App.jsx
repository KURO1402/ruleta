import { useState } from 'react'
import Header from './components/Header'
import OptionsPanel from './components/OptionsPanel'
import RouletteWheel from './components/RouletteWheel'
import ResultModal from './components/ResultModal'
import Footer from './components/Footer'
import { useLocalStorage } from './hooks/useLocalStorage'

const OPCIONES_INICIALES = ['Pizza', 'Hamburguesa', 'Tacos', 'Sushi']

function App() {
  const [opciones, setOpciones] = useLocalStorage('ruleta_opciones', OPCIONES_INICIALES)
  const [soundEnabled, setSoundEnabled] = useLocalStorage('ruleta_sonido', true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [winner, setWinner] = useState('')
  const [winnerIndex, setWinnerIndex] = useState(null)

  const handleAddOption = (nuevaOpcion) => {
    setOpciones((prev) => [...prev, nuevaOpcion])
  }

  const handleRemoveOption = (indiceAEliminar) => {
    setOpciones((prev) => prev.filter((_, i) => i !== indiceAEliminar))
  }

  const handleClearOptions = () => {
    if (window.confirm('¿Seguro que deseas borrar todas las opciones?')) {
      setOpciones([])
    }
  }

  const handleSpinStart = () => {
    setIsSpinning(true)
  }

  const handleSpinEnd = (ganadorSeleccionado, indiceGanador) => {
    setIsSpinning(false)
    setWinner(ganadorSeleccionado)
    setWinnerIndex(indiceGanador)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleDeleteWinner = () => {
    if (winnerIndex !== null && winnerIndex >= 0) {
      handleRemoveOption(winnerIndex)
    }
  }

  return (
    <div className="bg-background text-stone-800 flex flex-col min-h-screen">
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 grid gap-6 md:grid-cols-2 items-start">
        <OptionsPanel
          opciones={opciones}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onClearOptions={handleClearOptions}
        />

        <RouletteWheel
          opciones={opciones}
          isSpinning={isSpinning}
          soundEnabled={soundEnabled}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
        />
      </main>

      <Footer />

      <ResultModal
        isOpen={modalOpen}
        winner={winner}
        soundEnabled={soundEnabled}
        onClose={handleCloseModal}
        onDeleteWinner={handleDeleteWinner}
      />
    </div>
  )
}

export default App
