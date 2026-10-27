import { useEffect, useRef, useState, useCallback } from 'react'
import { RotateCw } from 'lucide-react'
import { playTickSound } from '../utils/audio'

const COLORES_SECTORES = [
  '#E28413', '#1F7A74', '#F2B84B', '#5B2A4E',
  '#D64045', '#467599', '#2B9348', '#8338EC',
  '#3A86FF', '#FB5607', '#06D6A0', '#FF006E'
]

export default function RouletteWheel({
  opciones = [],
  isSpinning = false,
  soundEnabled = true,
  onSpinStart,
  onSpinEnd
}) {
  const canvasRef = useRef(null)
  const rotationRef = useRef(0)
  const animationFrameRef = useRef(null)
  const [pointerTick, setPointerTick] = useState(false)

  // Dibuja los sectores y textos en el lienzo del canvas
  const drawWheel = useCallback((currentRotation) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = center - 8

    ctx.clearRect(0, 0, size, size)

    const total = opciones.length

    if (total === 0) {
      const sectoresMarcador = 4
      const anguloSector = (2 * Math.PI) / sectoresMarcador
      const coloresMarcador = ['#E28413', '#1F7A74', '#F2B84B', '#5B2A4E']

      for (let i = 0; i < sectoresMarcador; i++) {
        const inicio = currentRotation + i * anguloSector
        const fin = inicio + anguloSector

        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.arc(center, center, radius, inicio, fin)
        ctx.closePath()
        ctx.fillStyle = coloresMarcador[i % coloresMarcador.length]
        ctx.fill()
      }

      dibujarCentro(ctx, center)
      return
    }

    const anguloSector = (2 * Math.PI) / total

    for (let i = 0; i < total; i++) {
      const inicio = currentRotation + i * anguloSector
      const fin = inicio + anguloSector

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, inicio, fin)
      ctx.closePath()
      ctx.fillStyle = COLORES_SECTORES[i % COLORES_SECTORES.length]
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(inicio + anguloSector / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      const fontSize = total > 12 ? 12 : total > 8 ? 14 : 16
      ctx.font = `bold ${fontSize}px sans-serif`

      let etiqueta = opciones[i]
      if (etiqueta.length > 15) {
        etiqueta = etiqueta.slice(0, 13) + '…'
      }

      ctx.fillText(etiqueta, radius - 20, 0)
      ctx.restore()
    }

    dibujarCentro(ctx, center)
  }, [opciones])

  const dibujarCentro = (ctx, center) => {
    ctx.beginPath()
    ctx.arc(center, center, 32, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
    ctx.shadowBlur = 6
    ctx.fill()

    ctx.beginPath()
    ctx.arc(center, center, 20, 0, 2 * Math.PI)
    ctx.fillStyle = '#E28413'
    ctx.shadowBlur = 0
    ctx.fill()

    ctx.beginPath()
    ctx.arc(center, center, 8, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
  }

  useEffect(() => {
    drawWheel(rotationRef.current)
  }, [drawWheel])

  // Inicia la animación de giro con desaceleración y cálculo del ganador
  const spin = () => {
    if (isSpinning) return
    if (opciones.length === 0) {
      alert('Añade al menos una opción para girar la ruleta.')
      return
    }

    onSpinStart?.()

    const rotacionInicial = rotationRef.current
    const duracion = 4000
    const girosCompletos = 5 * 2 * Math.PI
    const anguloAleatorio = Math.random() * 2 * Math.PI
    const rotacionTotal = girosCompletos + anguloAleatorio

    const tiempoInicio = performance.now()
    let ultimoAnguloTick = rotacionInicial

    const animar = (tiempoActual) => {
      const tiempoTranscurrido = tiempoActual - tiempoInicio
      const progreso = Math.min(tiempoTranscurrido / duracion, 1)

      // Desaceleración cúbica (ease-out)
      const factorDesaceleracion = 1 - Math.pow(1 - progreso, 3)
      const rotacionActual = rotacionInicial + rotacionTotal * factorDesaceleracion
      rotationRef.current = rotacionActual

      // Sonido y movimiento del puntero al cruzar cada sector
      const anguloSector = (2 * Math.PI) / (opciones.length || 1)
      if (Math.abs(rotacionActual - ultimoAnguloTick) >= anguloSector) {
        ultimoAnguloTick = rotacionActual
        setPointerTick((prev) => !prev)
        if (soundEnabled) {
          playTickSound()
        }
      }

      drawWheel(rotacionActual)

      if (progreso < 1) {
        animationFrameRef.current = requestAnimationFrame(animar)
      } else {
        // Cálculo del sector ganador alineado con el marcador superior (12 en punto)
        const total = opciones.length
        const anguloNormalizado = rotacionActual % (2 * Math.PI)
        const anguloPuntero = (3 * Math.PI / 2 - anguloNormalizado + 2 * Math.PI) % (2 * Math.PI)
        const indiceGanador = Math.min(
          Math.floor(anguloPuntero / ((2 * Math.PI) / total)),
          total - 1
        )
        const ganador = opciones[indiceGanador]

        onSpinEnd?.(ganador, indiceGanador)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animar)
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <section id="panel-ruleta" className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col items-center shadow-xs">
      <h2 className="text-lg font-bold">Gira la Ruleta</h2>

      <div className="relative mt-6">
        <span
          className={`absolute left-1/2 -top-4 -translate-x-1/2 text-3xl leading-none text-stone-800 z-10 transition-transform duration-75 select-none ${
            isSpinning ? (pointerTick ? '-translate-y-0.5 scale-110' : 'translate-y-0 scale-100') : ''
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
        <canvas
          ref={canvasRef}
          id="ruletaCanvas"
          width="400"
          height="400"
          className="w-full max-w-sm rounded-full border-8 border-stone-800 shadow-md aspect-square"
        />
      </div>

      <button
        id="btn-girar"
        type="button"
        onClick={spin}
        disabled={isSpinning}
        className={`mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-3 text-lg font-bold text-white transition-all shadow-md ${
          isSpinning
            ? 'opacity-60 cursor-not-allowed scale-95'
            : 'hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer'
        }`}
      >
        <RotateCw size={20} className={isSpinning ? 'animate-spin' : ''} />
        <span>{isSpinning ? 'Girando...' : '¡Girar!'}</span>
      </button>
    </section>
  )
}
