let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()
    startHeartsRain()
    startLoveLetter()

    // Autoplay music
    const music = document.getElementById('bg-music')
    music.volume = 0.3
    music.play().catch(() => { })
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'

    // Periodic firework bursts
    scheduleFireworks()
})

// ========== ENHANCED CONFETTI ==========
function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 8000
    const end = Date.now() + duration

    // Big initial heart burst
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
        ticks: 300
    })

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors,
            shapes: ['circle', 'square'],
            scalar: 1.1,
            ticks: 200
        })

        confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors,
            shapes: ['circle', 'square'],
            scalar: 1.1,
            ticks: 200
        })
    }, 250)
}

// ========== PERIODIC FIREWORK BURSTS ==========
function scheduleFireworks() {
    setInterval(() => {
        const x = 0.2 + Math.random() * 0.6
        const y = 0.2 + Math.random() * 0.4

        confetti({
            particleCount: 80,
            spread: 100,
            origin: { x, y },
            colors: ['#ff69b4', '#ff1493', '#ffdf00', '#fff', '#ff6347', '#9b59b6'],
            shapes: ['circle'],
            scalar: 1.3,
            ticks: 250,
            gravity: 0.8,
            startVelocity: 30
        })
    }, 4000)
}

// ========== FLOATING HEARTS RAIN (CANVAS) ==========
function startHeartsRain() {
    const canvas = document.getElementById('hearts-canvas')
    const ctx = canvas.getContext('2d')
    let fallingHearts = []

    function resize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const emojis = ['💕', '💗', '💖', '💝', '💓', '💞', '🩷', '♥️', '💘']

    function spawnFalling() {
        fallingHearts.push({
            x: Math.random() * canvas.width,
            y: -30,
            speed: 0.5 + Math.random() * 1.5,
            size: 14 + Math.random() * 22,
            opacity: 0.2 + Math.random() * 0.5,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            sway: Math.random() * 1.5 - 0.75,
            swaySpeed: 0.008 + Math.random() * 0.012,
            angle: Math.random() * Math.PI * 2
        })
    }

    // Initial set
    for (let i = 0; i < 15; i++) {
        fallingHearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.5 + Math.random() * 1.5,
            size: 14 + Math.random() * 22,
            opacity: 0.2 + Math.random() * 0.5,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            sway: Math.random() * 1.5 - 0.75,
            swaySpeed: 0.008 + Math.random() * 0.012,
            angle: Math.random() * Math.PI * 2
        })
    }

    setInterval(spawnFalling, 400)

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = fallingHearts.length - 1; i >= 0; i--) {
            const h = fallingHearts[i]
            h.y += h.speed
            h.angle += h.swaySpeed
            h.x += Math.sin(h.angle) * h.sway

            ctx.globalAlpha = h.opacity
            ctx.font = `${h.size}px serif`
            ctx.fillText(h.emoji, h.x, h.y)

            if (h.y > canvas.height + 40) {
                fallingHearts.splice(i, 1)
            }
        }
        ctx.globalAlpha = 1
        requestAnimationFrame(animate)
    }
    animate()
}

// ========== TYPEWRITER LOVE LETTER ==========
function startLoveLetter() {
    const letterText = document.getElementById('love-letter-text')
    const signature = document.getElementById('letter-signature')

    const message = "Every moment with you feels like a dream I never want to wake up from. You make my heart skip a beat, my face light up with the biggest smile, and my world a thousand times brighter. I'm so grateful you said yes! 💕"

    let i = 0
    const cursor = document.createElement('span')
    cursor.className = 'typewriter-cursor'

    // Start after card appears (delay to sync with letterAppear animation)
    setTimeout(() => {
        letterText.appendChild(cursor)

        function typeChar() {
            if (i < message.length) {
                // Insert text before cursor
                letterText.insertBefore(
                    document.createTextNode(message[i]),
                    cursor
                )
                i++
                setTimeout(typeChar, 40)
            } else {
                // Remove cursor and show signature
                setTimeout(() => {
                    cursor.remove()
                    signature.classList.add('visible')
                }, 500)
            }
        }
        typeChar()
    }, 2000) // Wait for letter card animation
}

// ========== MUSIC TOGGLE ==========
function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
