import { useState, useRef } from 'react'

function App() {
  const [opciones, setOpciones] = useState([])
  const [inputOpcion, setInputOpcion] = useState('')
  const modalRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const valorInput = inputOpcion
    if (valorInput.trim().length === 0) {
      alert('Ingrese una opcion valida')
    } else {
      setOpciones((prev) => [...prev, valorInput])
    }
    setInputOpcion('')
  }

  const handleEliminar = (index) => {
    setOpciones((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGirar = () => {
    modalRef.current?.showModal()
  }

  return (
    <div className="bg-background text-stone-800 flex flex-col min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <h1 className="max-w-5xl mx-auto px-6 py-4 text-xl font-bold text-primary">Mi Ruleta</h1>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 grid gap-6 md:grid-cols-2 items-start">
        <section id="panel-opciones" className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-lg font-bold">Opciones</h2>

          <form id="form-opciones" onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              id="input-opcion"
              type="text"
              placeholder="Nueva opción"
              value={inputOpcion}
              onChange={(e) => setInputOpcion(e.target.value)}
              className="flex-1 min-w-0 rounded-lg border border-stone-300 px-3 py-2 focus:outline-2 focus:outline-primary"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Añadir
            </button>
          </form>

          <ul id="lista-opciones" className="mt-4 space-y-2">
            {opciones.length === 0 ? (
              <li className="text-stone-400">Aún no hay opciones.</li>
            ) : (
              opciones.map((opcion, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                >
                  {opcion}
                  <button
                    type="button"
                    onClick={() => handleEliminar(index)}
                    className="boton-eliminar text-stone-400 hover:text-red-600"
                    data-index={index}
                  >
                    &times;
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section id="panel-ruleta" className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold">Gira la Ruleta</h2>

          <div className="relative mt-6">
            <span className="absolute left-1/2 -top-4 -translate-x-1/2 text-3xl leading-none text-stone-800">▼</span>
            <canvas
              id="ruletaCanvas"
              width="400"
              height="400"
              className="w-full max-w-sm rounded-full border-8 border-stone-800"
              style={{ background: 'conic-gradient(#E28413 0 25%, #1F7A74 0 50%, #F2B84B 0 75%, #5B2A4E 0)' }}
            ></canvas>
          </div>

          <button
            id="btn-girar"
            type="button"
            onClick={handleGirar}
            className="mt-6 rounded-full bg-primary px-10 py-3 text-lg font-bold text-white hover:opacity-90"
          >
            ¡Girar!
          </button>
        </section>
      </main>

      <footer className="py-4 text-center text-sm text-stone-500">
        <p>&copy; 2026 Mi Ruleta - Todos los derechos reservados</p>
      </footer>

      <dialog
        ref={modalRef}
        id="modal-resultado"
        className="m-auto w-80 rounded-2xl p-6 text-center backdrop:bg-black/50"
      >
        <p className="text-stone-500">La ruleta eligió</p>
        <p id="modal-texto" className="mt-1 text-3xl font-bold text-primary">Pizza</p>

        <form method="dialog" className="mt-6 flex flex-col gap-2">
          <button type="submit" className="rounded-lg bg-primary py-2 font-semibold text-white hover:opacity-90">
            Cerrar
          </button>
          <button
            id="btn-eliminar"
            type="submit"
            value="eliminar"
            className="rounded-lg border border-red-300 py-2 font-semibold text-red-600 hover:bg-red-50"
          >
            Eliminar esta opción
          </button>
        </form>
      </dialog>
    </div>
  )
}

export default App
