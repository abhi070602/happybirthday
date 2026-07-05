// --- RETRO BOLLYWOOD JUKEBOX DATA ---

const trackData = [
    {
        side: "SIDE A — THE DREAMER",
        title: "Pal Pal Dil Ke Paas",
        artist: "Kishore Kumar",
        reason: "Because some songs never leave us.",
        url: "Pal Pal Dil Ke Paas_320(KoshalWorld.Com).mp3"
    },
    {
        side: "SIDE A — THE DREAMER",
        title: "Ek Ladki Ko Dekha To Aisa Laga",
        artist: "Kumar Sanu",
        reason: "For the moments that feel like classic poetry.",
        url: "Ek Ladki Ko Dekha 1942 A Love Story 320 Kbps.mp3"
    },
    {
        side: "SIDE B — THE ROMANTIC",
        title: "Ek Ajnabee Haseena Se",
        artist: "Kishore Kumar",
        reason: "For the beautiful, unexpected encounters in life.",
        url: "Ek Ajnabee Haseena Se (Revival)(KoshalWorld.Com).mp3"
    },
    {
        side: "SIDE C — THE NOSTALGIC SOUL",
        title: "Pehla Pehla Pyar",
        artist: "S.P. Balasubrahmanyam",
        reason: "A timeless echo of innocent, classic emotions.",
        url: "Pehla Pehla Pyar Spbalasubhramaniam Hum Aapke Hain Koun 320 Kbps.mp3"
    }
];

const hindiScenesData = [
    {
        reel: "दृश्य 01",
        location: "कॉलेज का आख़िरी दिन",
        year: "1987",
        bgm: "एक लड़की को देखा तो ऐसा लगा",
        details: "सब लोग अपने-अपने घर लौट गए, लेकिन तुम थोड़ी देर और रुकी रहीं। शायद कुछ जगहें छोड़ने के लिए नहीं, बस याद रखने के लिए होती हैं।"
    },
    {
        reel: "दृश्य 07",
        location: "बारिश वाली शाम",
        year: "1984",
        bgm: "रिमझिम गिरे सावन",
        details: "बारिश रुक चुकी थी, लेकिन तुम्हें घर जाने की कोई जल्दी नहीं थी। कुछ मौसम सिर्फ़ महसूस करने के लिए होते हैं।"
    },
    {
        reel: "दृश्य 14",
        location: "पुराना सिनेमा हॉल",
        year: "1986",
        film: "सिलसिला",
        details: "फिल्म कब ख़त्म हुई, ये तो सबको याद है। लेकिन तुम आख़िरी गाना ख़त्म होने तक अपनी सीट से नहीं उठीं।"
    },
    {
        reel: "दृश्य 22",
        location: "छत पर बिताई गई एक शाम",
        year: "1988",
        bgm: "पल पल दिल के पास",
        details: "कुछ गाने सुनने के लिए नहीं होते। वो बस किसी अपने समय में वापस ले जाने के लिए होते हैं।"
    },
    {
        reel: "दृश्य 31",
        location: "पुरानी तस्वीरों का डिब्बा",
        year: "1985",
        bgm: "",
        details: "कुछ लोग तस्वीरें संभालकर रखते हैं। और कुछ लोग, यादों को।"
    }
];

// --- CORE STATE MANAGEMENT ---

let currentTrackIndex = null;
let isPlaying = false;

// DOM selectors cache
const audio = document.getElementById('audio-element');
const tracklistContainer = document.getElementById('tracklist');
const vinylRecord = document.getElementById('vinyl-record');
const turntableNeedle = document.getElementById('turntable-needle');
const labelTitle = document.getElementById('label-title');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const btnPlayPause = document.getElementById('btn-play-pause');
const playIcon = document.getElementById('play-icon');

// --- JUKEBOX CONTROLLER MODULE ---

function renderTracks() {
    if (!tracklistContainer) return;
    tracklistContainer.innerHTML = trackData.map((track, idx) => {
        const isCurrent = idx === currentTrackIndex;
        const activeClass = isCurrent 
            ? 'border-vintage-orange bg-vintage-creamDark/60' 
            : 'border-vintage-charcoal/5 bg-vintage-creamDark/25 hover:bg-vintage-creamDark/50';
        
        return `
            <div onclick="selectTrack(${idx})" class="track-item p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${activeClass}">
                <div class="space-y-0.5 flex-grow pr-4 text-left">
                    <h4 class="text-xs font-semibold text-vintage-charcoal group-hover:text-vintage-orange transition-colors">${track.title}</h4>
                    <p class="text-[10px] text-vintage-charcoal/60 leading-relaxed font-light">${track.reason}</p>
                </div>
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <span class="text-[9px] font-mono text-vintage-charcoal/50 uppercase">${track.artist}</span>
                    <i class="fas ${isCurrent && isPlaying ? 'fa-waveform text-vintage-orange animate-pulse' : 'fa-circle-play text-vintage-charcoal/30 group-hover:text-vintage-orange'} text-xs"></i>
                </div>
            </div>
        `;
    }).join('');
}

window.selectTrack = function(idx) {
    if (idx < 0 || idx >= trackData.length) return;
    
    currentTrackIndex = idx;
    const track = trackData[idx];
    
    audio.src = track.url;
    labelTitle.textContent = track.title;
    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    
    renderTracks();
    playAudio();
};

function playAudio() {
    // If Doordarshan background audio is active, pause it during Jukebox play
    if (window.tvAudio) {
        window.tvAudio.pause();
        const speakerIcon = document.getElementById('tv-speaker-icon');
        if (speakerIcon) speakerIcon.classList.add('hidden');
    }
    // If archives background audio is active, pause it during Jukebox play
    if (window.archivesAudio) {
        window.archivesAudio.pause();
    }

    audio.play().then(() => {
        isPlaying = true;
        playIcon.className = "fas fa-pause";
        vinylRecord.classList.add('animate-vinyl-spin');
        turntableNeedle.classList.add('active');
    }).catch(err => {
        console.warn("Playback blocked by browser autoplay rules. Tap Play.", err);
    });
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playIcon.className = "fas fa-play ml-0.5";
    vinylRecord.classList.remove('animate-vinyl-spin');
    turntableNeedle.classList.remove('active');
}

if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
        if (currentTrackIndex === null) {
            window.selectTrack(0);
        } else if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
        playRetroSynthHit();
    });
}

document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentTrackIndex !== null) window.selectTrack(currentTrackIndex - 1);
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (currentTrackIndex !== null) window.selectTrack(currentTrackIndex + 1);
});

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    
    // Formatting presentation timing
    let curMins = Math.floor(audio.currentTime / 60);
    let curSecs = Math.floor(audio.currentTime % 60);
    let durMins = Math.floor(audio.duration / 60);
    let durSecs = Math.floor(audio.duration % 60);
    
    if (curSecs < 10) curSecs = `0${curSecs}`;
    if (durSecs < 10) durSecs = `0${durSecs}`;
    
    timeCurrent.textContent = `${curMins}:${curSecs}`;
    timeTotal.textContent = `${durMins}:${durSecs}`;
});

progressBar.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// --- INTERACTIVE CASTING WHEEL ---

const castingDirectors = [
    {
        name: "Yash Chopra Heroine",
        subtext: "You belong in a white chiffon saree against the snow-capped Swiss Alps, embodying a romance that is poetic, lingering, and absolutely timeless."
    },
    {
        name: "Hrishikesh Mukherjee Character",
        subtext: "Your magic lies in your simplicity, finding humor in daily middle-class drama and radiating deep warmth in simple, honest family bonds."
    },
    {
        name: "Basu Chatterjee Protagonist",
        subtext: "You capture the realistic, everyday beauty of Bombay monsoons, smiling under a shared umbrella and finding music in quiet train rides."
    },
    {
        name: "Parallel Cinema Lead",
        subtext: "You carry a quiet emotional intensity, conveying volumes through silence and choosing artistic depth over commercial cliches."
    }
];

let isCasting = false;

window.spinCastingWheel = function() {
    if (isCasting) return;
    isCasting = true;
    
    const resultText = document.getElementById('casting-result');
    const subText = document.getElementById('casting-subtext');
    subText.classList.add('hidden');
    
    playRetroSynthHit();
    
    let counter = 0;
    const interval = setInterval(() => {
        const temp = castingDirectors[counter % castingDirectors.length];
        resultText.textContent = temp.name;
        counter++;
    }, 100);
    
    setTimeout(() => {
        clearInterval(interval);
        const finalOutcome = castingDirectors[Math.floor(Math.random() * castingDirectors.length)];
        resultText.textContent = finalOutcome.name;
        subText.textContent = finalOutcome.subtext;
        subText.classList.remove('hidden');
        isCasting = false;
        
        confetti({
            particleCount: 35,
            spread: 45,
            origin: { y: 0.75 },
            colors: ['#9a3412', '#c2410c', '#eae0d5']
        });
    }, 1500);
};

// --- RETRO TRIVIA QUIZ MODULE ---

const quizData = [
    {
        question: "Which legendary singer originally performed the timeless song 'Lag Jaa Gale' in the 1964 film 'Woh Kaun Thi'?",
        options: ["Asha Bhosle", "Lata Mangeshkar", "Geeta Dutt", "Sharda"],
        answer: 1
    },
    {
        question: "What famous dialogue from the movie 'Anand' (1971) emphasizes living life to the fullest?",
        options: [
            "Rishte mein toh hum tumhare baap lagte hain",
            "Mogambo khush hua",
            "Zindagi badi honi chahiye, lambi nahi",
            "Babumoshai, hum toh rangmanch ki kathputliyan hain"
        ],
        answer: 2
    },
    {
        question: "Who composed the iconic music for films like 'Yaadon Ki Baaraat' (1973) and 'Sholay' (1975)?",
        options: ["S.D. Burman", "Laxmikant-Pyarelal", "R.D. Burman", "Kalyanji-Anandji"],
        answer: 2
    },
    {
        question: "In the 1976 classic film 'Kabhi Kabhie', which actor recited the famous title poetry?",
        options: ["Amitabh Bachchan", "Shashi Kapoor", "Rajesh Khanna", "Rishi Kapoor"],
        answer: 0
    }
];

let currentQuestionIdx = 0;
let userScore = 0;

window.renderQuizQuestion = function() {
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) return;

    if (currentQuestionIdx >= quizData.length) {
        window.renderQuizResults();
        return;
    }

    const currentQuestion = quizData[currentQuestionIdx];
    quizContent.innerHTML = `
        <div class="space-y-6 text-left">
            <div class="flex justify-between items-center text-[10px] text-vintage-charcoal/60 uppercase tracking-widest border-b border-vintage-charcoal/10 pb-3 font-mono">
                <span>Question ${currentQuestionIdx + 1} of ${quizData.length}</span>
                <span>Score: ${userScore}</span>
            </div>
            
            <h3 class="font-serif text-xl md:text-2xl text-vintage-charcoal leading-relaxed">
                ${currentQuestion.question}
            </h3>

            <div class="grid grid-cols-1 gap-3 mt-6">
                ${currentQuestion.options.map((option, idx) => `
                    <button onclick="checkQuizAnswer(${idx})" class="w-full text-left p-4 rounded-xl border border-vintage-charcoal/10 bg-vintage-cream/40 hover:bg-vintage-creamDark/40 hover:border-vintage-orange transition-all duration-200 text-sm font-light text-vintage-charcoal cursor-pointer focus:outline-none">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
};

window.checkQuizAnswer = function(selectedIdx) {
    const currentQuestion = quizData[currentQuestionIdx];
    if (selectedIdx === currentQuestion.answer) {
        userScore++;
    }

    currentQuestionIdx++;
    window.renderQuizQuestion();
};

window.renderQuizResults = function() {
    const quizBox = document.getElementById('quiz-box');
    const quizContent = document.getElementById('quiz-content');
    const awardCert = document.getElementById('award-certificate');
    if (!quizBox || !quizContent || !awardCert) return;

    let praiseNote = "";
    if (userScore === quizData.length) {
        praiseNote = "Unbelievable! You are a true retro cinema encyclopedia. Lataji and Kishoreda would be proud of your stellar knowledge!";
    } else if (userScore >= quizData.length / 2) {
        praiseNote = "Spectacular! You have a deep connection with the classics. R.D. Burman's rhythms flow perfectly in your veins!";
    } else {
        praiseNote = "A commendable effort! The golden era has many layers, and you're well on your way to becoming a superstar critic.";
    }

    // Step 1: Cinema blackout transition
    quizContent.style.opacity = '0';
    quizBox.classList.add('cinema-blackout');

    // Step 2: Trigger projector sound effect
    playProjectorFanfare();

    // Step 3: Transition to certificate reveal after a dramatic delay
    setTimeout(() => {
        quizContent.classList.add('hidden');
        quizBox.classList.remove('cinema-blackout');
        
        // Update certificate texts
        document.getElementById('certificate-score').textContent = `Final Score: ${userScore} / ${quizData.length}`;
        document.getElementById('certificate-praise').textContent = praiseNote;
        
        awardCert.classList.remove('hidden');
        // Tick for smooth CSS transition un-hiding
        setTimeout(() => {
            awardCert.classList.remove('opacity-0', 'scale-95');
            awardCert.classList.add('opacity-100', 'scale-100');
        }, 50);

        // Explode award ceremony confetti!
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.75 },
            colors: ['#9a3412', '#c2410c', '#d97706']
        });
    }, 1500);
};

window.resetQuiz = function() {
    const quizContent = document.getElementById('quiz-content');
    const awardCert = document.getElementById('award-certificate');
    if (!quizContent || !awardCert) return;

    currentQuestionIdx = 0;
    userScore = 0;
    
    // Hide certificate
    awardCert.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        awardCert.classList.add('hidden');
        quizContent.classList.remove('hidden');
        quizContent.style.opacity = '1';
        window.renderQuizQuestion();
    }, 500);
};

// --- WEB AUDIO AUDIO EFFECTS & SYNTHESIZER ---

function playProjectorFanfare() {
    // 1. Play real audio sound effect
    try {
        const applause = new Audio('https://www.soundjay.com/human/sounds/applause-1.mp3');
        applause.volume = 0.5;
        applause.play();
    } catch (e) {
        console.warn("Autoplay block / sound load error:", e);
    }

    // 2. Synthesize clicking 16mm projector + vintage fanfare sweep
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;

        // Projector click pulses (0s to 1.3s)
        for (let i = 0; i < 15; i++) {
            const clickTime = now + (i * 0.09);
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(90, clickTime);
            osc.frequency.exponentialRampToValueAtTime(10, clickTime + 0.02);
            
            gain.gain.setValueAtTime(0.06, clickTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.02);
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(clickTime);
            osc.stop(clickTime + 0.03);
        }

        // Fanfare chord sweep (starts at 1.3s)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C Major Chord Sweep
        notes.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + 1.3 + (index * 0.06));
            
            gain.gain.setValueAtTime(0, now + 1.3);
            gain.gain.linearRampToValueAtTime(0.05, now + 1.3 + (index * 0.06) + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, now + 1.3);
            filter.frequency.exponentialRampToValueAtTime(1200, now + 1.7);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start(now + 1.3);
            osc.stop(now + 3.4);
        });
    } catch (e) {
        console.warn("Synth fanfare error:", e);
    }
}

// --- WEB AUDIO SYNTHESIZER ---

let audioContext = null;

function playRetroSynthHit() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C Major chord
        
        notes.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = index % 2 === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.detune.setValueAtTime((index - 1.5) * 10, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
            
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.setValueAtTime(4, now);
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
            filter.frequency.exponentialRampToValueAtTime(450, now + 0.8);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start(now);
            osc.stop(now + 1.1);
        });
    } catch (e) {
        console.warn("AudioContext block/error:", e);
    }
}

// --- CERTIFICATE EXPORT UTILITY ---

window.downloadAward = function() {
    const certificate = document.querySelector('.certificate-frame');
    if (!certificate) return;
    
    // Select the download button to show loading feedback
    const btn = document.querySelector('button[onclick="downloadAward()"]');
    let origContent = "Download Award";
    if (btn) {
        origContent = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin mr-1"></i> <span>Generating...</span>`;
        btn.disabled = true;
    }

    // Capture outer certificate frame with scale 3 for a crisp print resolution
    html2canvas(certificate, {
        scale: 3,
        backgroundColor: '#fdfbf7',
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Snehal_Filmfare_Award_1987.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore button state
        if (btn) {
            btn.innerHTML = origContent;
            btn.disabled = false;
        }
        
        // Celebration confetti triggers
        confetti({
            particleCount: 25,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
        });
        confetti({
            particleCount: 25,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
        });
    }).catch(err => {
        console.error("Certificate capture failed:", err);
        if (btn) {
            btn.innerHTML = origContent;
            btn.disabled = false;
        }
    });
};

// --- DOORDARSHAN AUDIO TRIGGER ---

window.tvAudio = null;

function setupDoordarshanAudio() {
    window.tvAudio = new Audio('radio.mp3');
    window.tvAudio.loop = true;
    window.tvAudio.volume = 0.45; // Soft vintage whirring/news theme volume

    const tvSection = document.getElementById('doordarshan-section');
    const speakerIcon = document.getElementById('tv-speaker-icon');
    if (!tvSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play TV audio from start and pause Jukebox
                window.tvAudio.currentTime = 0;
                window.tvAudio.play().then(() => {
                    if (speakerIcon) speakerIcon.classList.remove('hidden');
                }).catch(err => {
                    console.warn("TV Audio autoplay blocked, waiting for user click.", err);
                });
                
                // Pause archives background audio if playing
                if (window.archivesAudio) {
                    window.archivesAudio.pause();
                }
                
                // Pause main jukebox if it is playing
                if (isPlaying) {
                    pauseAudio();
                }
            } else {
                // Pause TV audio when scrolled out of view
                window.tvAudio.pause();
                if (speakerIcon) speakerIcon.classList.add('hidden');
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the TV screen is visible
    });

    observer.observe(tvSection);
}

// --- HINDI SCENES RENDERER ---

function renderHindiScenes() {
    const container = document.getElementById('scenes-container');
    if (!container) return;

    container.innerHTML = hindiScenesData.map(scene => {
        let metaHtml = `स्थान: ${scene.location} | साल: ${scene.year}`;
        if (scene.bgm) {
            metaHtml += ` <br> पृष्ठभूमि संगीत: "${scene.bgm}"`;
        } else if (scene.film) {
            metaHtml += ` <br> फिल्म: "${scene.film}"`;
        }

        return `
            <div class="bg-vintage-creamDark/20 border border-vintage-charcoal/10 p-6 rounded-xl flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform relative font-sans text-xs text-vintage-charcoal/90 shadow-xs">
                <span class="absolute top-4 right-4 text-[9px] font-mono font-bold text-vintage-orange/60 uppercase tracking-widest">${scene.reel}</span>
                <div class="border-b border-vintage-charcoal/10 pb-3">
                    <span class="font-serif font-bold text-vintage-orange text-sm uppercase block">${scene.reel}</span>
                    <span class="text-[10px] text-vintage-charcoal/60 block mt-1 leading-relaxed">${metaHtml}</span>
                </div>
                <div class="space-y-2 flex-grow">
                    <p class="leading-relaxed font-light text-vintage-charcoal/80">
                        <span class="font-semibold text-vintage-charcoal">विवरण:</span> ${scene.details}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// --- ARCHIVES SECTION AUDIO CONTROLLER ---

function setupArchivesAudio() {
    window.archivesAudio = new Audio('meribahon.mp3');
    window.archivesAudio.loop = true;
    window.archivesAudio.volume = 0.45;

    const archivesSection = document.getElementById('archives-section');
    if (!archivesSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play archives music, pause Jukebox & Doordarshan TV
                window.archivesAudio.play().catch(err => {
                    console.warn("Archives audio autoplay blocked.", err);
                });

                if (window.tvAudio) {
                    window.tvAudio.pause();
                    const speakerIcon = document.getElementById('tv-speaker-icon');
                    if (speakerIcon) speakerIcon.classList.add('hidden');
                }

                if (isPlaying) {
                    pauseAudio();
                }
            } else {
                // Pause when scrolled away
                window.archivesAudio.pause();
            }
        });
    }, {
        threshold: 0.15
    });

    observer.observe(archivesSection);
}

// --- CORE APP INVOCATION ---
window.addEventListener('DOMContentLoaded', () => {
    renderTracks();
    window.renderQuizQuestion();
    setupDoordarshanAudio();
    setupArchivesAudio();
    renderHindiScenes();
});

// --- LIGHTBOX ---

window.openLightbox = function(imgEl) {
    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    overlay.classList.remove('hidden');
    // Trigger fade-in on next frame
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    const overlay = document.getElementById('lightbox-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('hidden');
        document.getElementById('lightbox-img').src = '';
        document.body.style.overflow = '';
    }, 300);
};

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});