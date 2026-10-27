let audioCtx = null

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Reproduce sonido de clic al pasar cada opción
export function playTickSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.045)
  } catch {
    // Silencia errores si el navegador restringe el audio
  }
}

// Reproduce fanfarria cuando se detiene en el ganador
export function playWinSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const notas = [523.25, 659.25, 783.99, 1046.50]
    notas.forEach((frecuencia, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const tiempoInicio = ctx.currentTime + i * 0.1

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frecuencia, tiempoInicio)

      gain.gain.setValueAtTime(0.18, tiempoInicio)
      gain.gain.exponentialRampToValueAtTime(0.001, tiempoInicio + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(tiempoInicio)
      osc.stop(tiempoInicio + 0.5)
    })
  } catch {
    // Silencia errores si el navegador restringe el audio
  }
}
