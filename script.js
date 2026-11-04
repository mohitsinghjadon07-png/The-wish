
'use strict';

/* =================================
   CONFIGURATION
================================= */

const CONFIG = {
    password: "aurora",
    girlfriendName: "Bannisa",
    anniversaryYears: 2
};

/* =================================
   GLOBAL STATE
================================= */

let currentChapter = 1;
const totalChapters = 9;

let audioCtx = null;
let masterGain = null;
let melodyOscillator = null;
let melodyTimer = null;
let melodyIndex = 0;
let isPlayingMusic = false;

let starCanvas = null;
let starContext = null;
let stars = [];
let starAnimationId = null;

/* =================================
   DOM ELEMENTS
================================= */

const $ = (id) => document.getElementById(id);

const entranceScreen = $('entrance-screen');
const mainApp = $('main-app');

const passwordForm = $('password-form');
const passwordInput = $('password-input');
const errorMsg = $('error-msg');

const progressBar = $('progress-bar');
const progressText = $('progress-text');

const musicToggle = $('music-toggle');
const musicText = $('music-text');
const volumeSlider = $('volume-slider');

/* =================================
   PASSWORD AUTHENTICATION
================================= */

if (passwordForm) {

    passwordForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const entered = passwordInput.value
            .trim()
            .toLowerCase();

        if (entered === CONFIG.password.toLowerCase()) {

            errorMsg.style.opacity = '0';

            passwordInput.classList.remove(
                'shake',
                'border-rose-500'
            );

            entranceScreen.style.opacity = '0';

            setTimeout(() => {

                entranceScreen.classList.add('hidden');

                mainApp.classList.remove('hidden');

                requestAnimationFrame(() => {

                    mainApp.style.opacity = '1';

                    initStarfield();

                });

            }, 700);

        } else {

            errorMsg.style.opacity = '1';

            passwordInput.classList.add(
                'border-rose-500',
                'shake'
            );

            passwordInput.select();

            setTimeout(() => {

                passwordInput.classList.remove('shake');

            }, 450);

        }

    });

}

/* =================================
   CHAPTER NAVIGATION
================================= */

function updateChapters() {

    for (let i = 1; i <= totalChapters; i++) {

        const section = $(`chapter-${i}`);

        if (!section) continue;

        if (i === currentChapter) {

            section.classList.remove('hidden');

            section.style.animation = 'none';

            void section.offsetWidth;

            section.style.animation = '';

        } else {

            section.classList.add('hidden');

        }

    }

    const percent = (currentChapter / totalChapters) * 100;

    if (progressBar) {

        progressBar.style.width = `${percent}%`;

    }

    if (progressText) {

        progressText.innerText =
            `Chapter ${currentChapter} of ${totalChapters}`;

    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

function nextChapter() {

    if (currentChapter < totalChapters) {

        currentChapter++;

        updateChapters();

        triggerAnyaReaction('excited');

    }

}

/* =================================
   THEME SWITCHER
================================= */

function setTheme(theme) {

    const allowedThemes = [
        'golden',
        'rose',
        'silver'
    ];

    if (!allowedThemes.includes(theme)) return;

    document.body.classList.remove(
        'theme-golden',
        'theme-rose',
        'theme-silver'
    );

    document.body.classList.add(`theme-${theme}`);

    triggerAnyaReaction('smiling');

}

/* =================================
   MYSTERY PARCELS
================================= */

function openParcel(num) {

    const texts = {

        1: "✨ Parcel I: A promise of a thousand sunsets shared together.",

        2: "💌 Parcel II: Every laugh we share echoes in my heart forever.",

        3: "🌸 Parcel III: You are my greatest adventure and sweetest peace."

    };

    if (!texts[num]) return;

    const text = $(`parcel-text-${num}`);

    const parcel = $(`parcel-${num}`);

    if (text) {

        text.innerText = texts[num];

    }

    if (parcel) {

        parcel.classList.add(
            'border-marigold',
            'bg-marigold/10'
        );

    }

    triggerAnyaReaction('excited');

}

/* =================================
   WISHING WALL
================================= */

function revealWish(num) {

    const wishes = {

        1: "✨ May your smile never fade and your dreams touch the stars.",

        2: "💖 May our love grow stronger with every passing sunrise.",

        3: "🌟 May all your wishes come true today and always, Bannisa."

    };

    const target = $(`wish-${num}`);

    if (target && wishes[num]) {

        target.innerText = wishes[num];

    }

}

/* =================================
   GRAND GIFT BOX
================================= */

function openGrandGift() {

    const message = $('grand-gift-message');

    const icon = $('gift-icon');

    if (message) {

        message.classList.remove('hidden');

    }

    if (icon) {

        icon.innerText = '💖';

    }

    triggerAnyaReaction('celebrate');

}

/* =================================
   BIRTHDAY CANDLES
================================= */

function extinguishCandle(num) {

    const flame = $(`flame-${num}`);

    if (!flame) return;

    flame.style.opacity = '0';

    flame.style.pointerEvents = 'none';

    flame.classList.remove('animate-bounce');

}

function extinguishAllCandles() {

    for (let i = 1; i <= 3; i++) {

        extinguishCandle(i);

    }

    const message = $('cake-wish-msg');

    if (message) {

        message.style.opacity = '1';

    }

    triggerAnyaReaction('celebrate');

}

/* =================================
   RESTART EXPERIENCE
================================= */

function restartExperience() {

    stopAmbientMelody();

    currentChapter = 1;

    document.body.classList.remove(
        'theme-golden',
        'theme-rose',
        'theme-silver'
    );

    // Reset mystery parcels

    for (let i = 1; i <= 3; i++) {

        const parcelText = $(`parcel-text-${i}`);

        const parcel = $(`parcel-${i}`);

        const wish = $(`wish-${i}`);

        const flame = $(`flame-${i}`);

        if (parcelText) {

            parcelText.innerText = 'Click to unwrap secret';

        }

        if (parcel) {

            parcel.classList.remove(
                'border-marigold',
                'bg-marigold/10'
            );

        }

        if (wish) {

            wish.innerText = `Click to read wish #${i}`;

        }

        if (flame) {

            flame.style.opacity = '1';

            flame.style.pointerEvents = '';

            flame.classList.add('animate-bounce');

        }

    }

    // Reset gift

    const giftMessage = $('grand-gift-message');

    const giftIcon = $('gift-icon');

    if (giftMessage) {

        giftMessage.classList.add('hidden');

    }

    if (giftIcon) {

        giftIcon.innerText = '🎁';

    }

    // Reset birthday wish

    const cakeMessage = $('cake-wish-msg');

    if (cakeMessage) {

        cakeMessage.style.opacity = '0';

    }

    updateChapters();

}

/* =================================
   ANYA COMPANION REACTIONS
================================= */

function triggerAnyaReaction(mood) {

    const speech = $('anya-speech');

    if (!speech) return;

    const messages = {

        excited: "Waku Waku! This is so amazing! ✨",

        smiling: "Hehe! Bannisa is the best! 💕",

        celebrate: "Hip hip hooray! Happy Birthday! 🎉"

    };

    speech.innerText = messages[mood] || messages.excited;

    speech.style.opacity = '1';

    if (speech._hideTimer) {

        clearTimeout(speech._hideTimer);

    }

    speech._hideTimer = setTimeout(() => {

        speech.style.opacity = '0';

    }, 3000);

}

/* =================================
   STARFIELD BACKGROUND
================================= */

function resizeStarfield() {

    if (!starCanvas || !starContext) return;

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    const width = window.innerWidth;

    const height = window.innerHeight;

    starCanvas.width = width * dpr;

    starCanvas.height = height * dpr;

    starCanvas.style.width = `${width}px`;

    starCanvas.style.height = `${height}px`;

    starContext.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    const count = Math.max(
        70,
        Math.min(160, Math.floor(width * height / 9000))
    );

    stars = Array.from({ length: count }, () => ({

        x: Math.random() * width,

        y: Math.random() * height,

        radius: Math.random() * 1.35 + 0.25,

        alpha: Math.random(),

        speed: Math.random() * 0.006 + 0.002

    }));

}

function animateStarfield() {

    if (!starCanvas || !starContext) return;

    const width = window.innerWidth;

    const height = window.innerHeight;

    starContext.clearRect(
        0,
        0,
        width,
        height
    );

    starContext.fillStyle = '#FFFFFF';

    stars.forEach(star => {

        star.alpha += star.speed;

        if (star.alpha >= 1 || star.alpha <= 0.12) {

            star.speed *= -1;

        }

        starContext.globalAlpha = Math.max(
            0.12,
            Math.min(1, star.alpha)
        );

        starContext.beginPath();

        starContext.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        starContext.fill();

    });

    starContext.globalAlpha = 1;

    starAnimationId = requestAnimationFrame(
        animateStarfield
    );

}

function initStarfield() {

    starCanvas = $('starfield');

    if (!starCanvas) return;

    starContext = starCanvas.getContext('2d');

    if (!starContext) return;

    if (starAnimationId) {

        cancelAnimationFrame(starAnimationId);

    }

    resizeStarfield();

    animateStarfield();

    window.removeEventListener(
        'resize',
        resizeStarfield
    );

    window.addEventListener(
        'resize',
        resizeStarfield
    );

}

/* =================================
   AMBIENT MELODY
================================= */

// Original generated melody.
// Browsers require a user interaction before audio starts.

const melody = [

    261.63, 329.63, 392.00, 329.63,

    293.66, 349.23, 440.00, 392.00,

    261.63, 329.63, 392.00, 523.25,

    440.00, 392.00, 349.23, 329.63

];

async function startAmbientMelody() {

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {

        if (musicText) {

            musicText.innerText = 'Audio unavailable';

        }

        return;

    }

    try {

        audioCtx = new AudioContextClass();

        if (audioCtx.state === 'suspended') {

            await audioCtx.resume();

        }

        masterGain = audioCtx.createGain();

        masterGain.gain.value =
            Number(volumeSlider?.value ?? 0.25) * 0.12;

        masterGain.connect(audioCtx.destination);

        melodyOscillator = audioCtx.createOscillator();

        melodyOscillator.type = 'sine';

        melodyOscillator.frequency.value = melody[0];

        melodyOscillator.connect(masterGain);

        melodyOscillator.start();

        melodyIndex = 0;

        melodyTimer = setInterval(() => {

            if (!audioCtx || !melodyOscillator) return;

            melodyIndex =
                (melodyIndex + 1) % melody.length;

            const now = audioCtx.currentTime;

            melodyOscillator.frequency.setTargetAtTime(
                melody[melodyIndex],
                now,
                0.08
            );

        }, 650);

        isPlayingMusic = true;

        if (musicText) {

            musicText.innerText = 'Pause Melody';

        }

        musicToggle?.classList.add('text-marigold');

    } catch (error) {

        console.error('Audio error:', error);

        stopAmbientMelody();

    }

}

function stopAmbientMelody() {

    if (melodyTimer) {

        clearInterval(melodyTimer);

        melodyTimer = null;

    }

    if (melodyOscillator) {

        try {

            melodyOscillator.stop();

        } catch (error) {}

        melodyOscillator.disconnect();

        melodyOscillator = null;

    }

    if (audioCtx) {

        audioCtx.close().catch(() => {});

        audioCtx = null;

    }

    masterGain = null;

    isPlayingMusic = false;

    if (musicText) {

        musicText.innerText = 'Play Melody';

    }

    musicToggle?.classList.remove('text-marigold');

}

function toggleMusic() {

    if (isPlayingMusic) {

        stopAmbientMelody();

    } else {

        startAmbientMelody();

    }

}

/* =================================
   MUSIC PLAYER EVENTS
================================= */

if (musicToggle) {

    musicToggle.addEventListener(
        'click',
        toggleMusic
    );

}

if (volumeSlider) {

    volumeSlider.addEventListener('input', (e) => {

        if (masterGain && audioCtx) {

            const volume =
                Number(e.target.value) * 0.12;

            masterGain.gain.setTargetAtTime(
                volume,
                audioCtx.currentTime,
                0.04
            );

        }

    });

}

/* =================================
   INITIALIZATION
================================= */

updateChapters();
