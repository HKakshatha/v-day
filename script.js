// ========== GIF & MESSAGE DATA ==========
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const container = document.getElementById('main-container')

// ========== MUSIC AUTOPLAY ==========
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

// ========== FLOATING HEARTS CANVAS ==========
const heartsCanvas = document.getElementById('hearts-canvas')
const hCtx = heartsCanvas.getContext('2d')
let hearts = []

function resizeHeartsCanvas() {
    heartsCanvas.width = window.innerWidth
    heartsCanvas.height = window.innerHeight
}
resizeHeartsCanvas()
window.addEventListener('resize', resizeHeartsCanvas)

const heartEmojis = ['💕', '💗', '💖', '💝', '💓', '💞', '🩷', '♥️']

function spawnHeart() {
    hearts.push({
        x: Math.random() * heartsCanvas.width,
        y: heartsCanvas.height + 30,
        speed: 0.4 + Math.random() * 1.2,
        size: 12 + Math.random() * 20,
        opacity: 0.15 + Math.random() * 0.35,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        sway: Math.random() * 2 - 1,
        swaySpeed: 0.005 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2
    })
}

function updateHearts() {
    hCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height)

    for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]
        h.y -= h.speed
        h.angle += h.swaySpeed
        h.x += Math.sin(h.angle) * h.sway

        hCtx.globalAlpha = h.opacity
        hCtx.font = `${h.size}px serif`
        hCtx.fillText(h.emoji, h.x, h.y)

        if (h.y < -40) {
            hearts.splice(i, 1)
        }
    }
    hCtx.globalAlpha = 1
    requestAnimationFrame(updateHearts)
}

// Spawn hearts periodically
setInterval(spawnHeart, 600)
// Initial batch
for (let i = 0; i < 12; i++) {
    const h = {
        x: Math.random() * heartsCanvas.width,
        y: Math.random() * heartsCanvas.height,
        speed: 0.4 + Math.random() * 1.2,
        size: 12 + Math.random() * 20,
        opacity: 0.15 + Math.random() * 0.35,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        sway: Math.random() * 2 - 1,
        swaySpeed: 0.005 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2
    }
    hearts.push(h)
}
updateHearts()

// ========== SPARKLE MOUSE TRAIL ==========
const sparkleContainer = document.getElementById('sparkle-container')
const sparkles = ['✨', '💖', '⭐', '💗', '🌟']

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.35) return // throttle sparkles

    const sparkle = document.createElement('span')
    sparkle.className = 'sparkle'
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)]
    sparkle.style.left = `${e.clientX + (Math.random() * 20 - 10)}px`
    sparkle.style.top = `${e.clientY + (Math.random() * 20 - 10)}px`
    sparkle.style.fontSize = `${10 + Math.random() * 10}px`
    sparkleContainer.appendChild(sparkle)

    setTimeout(() => sparkle.remove(), 800)
})

// ========== YES BUTTON HANDLER (TEASE) ==========
function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

// ========== TYPEWRITER TEASE MESSAGE ==========
let typewriterTimeout = null

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')

    // Clear previous
    clearTimeout(toast._timer)
    clearTimeout(typewriterTimeout)
    toast.textContent = ''
    toast.classList.add('show')

    // Typewriter effect
    let i = 0
    function typeChar() {
        if (i < msg.length) {
            toast.textContent = msg.substring(0, i + 1)
            i++
            typewriterTimeout = setTimeout(typeChar, 35)
        } else {
            // Add blinking cursor then auto-hide
            const cursor = document.createElement('span')
            cursor.className = 'typewriter-cursor'
            toast.appendChild(cursor)
            toast._timer = setTimeout(() => {
                toast.classList.remove('show')
            }, 2500)
        }
    }
    typeChar()
}

// ========== NO BUTTON HANDLER ==========
function handleNoClick() {
    noClickCount++

    // Screen shake
    container.classList.remove('shake')
    void container.offsetWidth // force reflow
    container.classList.add('shake')

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Intensify heartbeat glow based on no clicks
    const glowIntensity = Math.min(0.45 + noClickCount * 0.1, 1)
    yesBtn.style.setProperty('--glow', glowIntensity)

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

// ========== RUNAWAY NO BUTTON ==========
function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'

    // Spin animation
    noBtn.classList.remove('spinning')
    void noBtn.offsetWidth
    noBtn.classList.add('spinning')
}
