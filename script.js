// ==========================================
// 1. Efeito Linterna: Matrix Dinâmico Base
// ==========================================
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for(let x = 0; x < columns; x++) { drops[x] = 1; }

    let mouseX = -1000; let mouseY = -1000;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('mouseout', () => { mouseX = -1000; mouseY = -1000; });

    let lastDrawTime = 0;
    const fps = 24; const interval = 1000 / fps;

    function drawMatrix(timestamp) {
        requestAnimationFrame(drawMatrix); 
        
        const deltaTime = timestamp - lastDrawTime;
        if (deltaTime > interval) {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px monospace';

            for(let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                const charX = i * fontSize;
                const charY = drops[i] * fontSize;
                const dist = Math.hypot(mouseX - charX, mouseY - charY);
                
                if (dist < 120) {
                    ctx.fillStyle = '#ffffff'; 
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00e676';
                } else {
                    ctx.fillStyle = '#00e676'; 
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(text, charX, charY);
                if(charY > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
                drops[i]++;
            }
            lastDrawTime = timestamp - (deltaTime % interval);
        }
    }
    requestAnimationFrame(drawMatrix);
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}
// ==========================================
// 2. Lógicas de Scroll: Progresso e Back to Top
// ==========================================
const scrollProgress = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${(totalScroll / windowHeight) * 100}%`;
    if(scrollProgress) scrollProgress.style.width = scroll;

    if (backToTopBtn) {
        if (totalScroll > 400) backToTopBtn.style.display = "flex";
        else backToTopBtn.style.display = "none";
    }
});

if(backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 3. Máquina de Escrever do Título (Hero)
// ==========================================
const i18nTypewriter = {
    pt: ["Estudante de Engenharia Informática", "Code. Learn. Build. Repeat.", "Desenvolvedor em formação", "Software • Networking • Problem Solving"],
    es: ["Estudiante de Ingeniería Informática", "Code. Learn. Build. Repeat.", "Desarrollador en formación", "Software • Networking • Problem Solving"],
    en: ["Computer Engineering Student", "Code. Learn. Build. Repeat.", "Developer in training", "Software • Networking • Problem Solving"]
};

let count = 0; 
let index = 0; 
let currentText = ""; 
let letter = ""; 
let isDeleting = false;
let typewriterTimeout;

// Función auxiliar para saber el idioma actual
function getCurrentLang() {
    return document.querySelector('.lang-btn.active')?.getAttribute('data-lang') || 'pt';
}

function type() {
    const lang = getCurrentLang();
    const texts = i18nTypewriter[lang]; // Carga las frases del idioma actual

    if (count >= texts.length) { count = 0; }
    currentText = texts[count];
    
    // Seguro por si se cambia de idioma a mitad de palabra
    if (!currentText) { count = 0; currentText = texts[0]; }

    if (isDeleting) { letter = currentText.slice(0, --index); } else { letter = currentText.slice(0, ++index); }

    const typeTextElement = document.getElementById("type-text");
    if (typeTextElement) { typeTextElement.textContent = letter; }

    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false; count++; typeSpeed = 500; 
    }
    typewriterTimeout = setTimeout(type, typeSpeed);
}
document.addEventListener("DOMContentLoaded", function() { typewriterTimeout = setTimeout(type, 1000); });

// ==========================================
// 4. Controlo do Modal de Vídeo & Bio
// ==========================================
const openVideoBtn = document.getElementById('openVideoBtn');
const videoModal = document.getElementById('videoModal');
const closeVideoBtn = document.getElementById('closeVideoBtn');
const myVideo = document.getElementById('myVideo');
if (myVideo && !myVideo.paused) {
    myVideo.pause();
}
if (openVideoBtn && videoModal && closeVideoBtn && myVideo) {
    openVideoBtn.addEventListener('click', () => {
        videoModal.style.display = "flex";
        if(canvas) canvas.style.display = "none"; // Eliminado matrixActive
        myVideo.play();
    });

    const closeModal = () => {
        videoModal.style.display = "none";
        if(canvas) canvas.style.display = "block"; // Eliminado matrixActive
        if (!myVideo.paused) {
            myVideo.pause();
            myVideo.currentTime = 0; 
        }
    };
    closeVideoBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === videoModal) closeModal();
    });
}

const i18nBio = {
    pt: "Futuro engenheiro de software focado em aprender, construir e melhorar todos os dias...",
    es: "Futuro ingeniero de software enfocado en aprender, construir y mejorar cada día...",
    en: "Future software engineer focused on learning, building and improving every day..."
};

const bioModal = document.getElementById("bioModal");
const bioTextElement = document.getElementById("bio-text");
let bioTyping = false; let bioCharIndex = 0;

function typeBioText() {
    const lang = getCurrentLang(); // Usamos la misma función de arriba
    const currentBioString = i18nBio[lang];

    if (bioCharIndex < currentBioString.length && bioTyping && bioTextElement) {
        bioTextElement.innerHTML += currentBioString.charAt(bioCharIndex);
        bioCharIndex++;
        setTimeout(typeBioText, 25);
    }
}

function openBioModal() {
    if (bioModal) {
        bioModal.style.display = "flex";
        if (!bioTyping) {
            bioTyping = true; bioCharIndex = 0; if (bioTextElement) bioTextElement.innerHTML = ""; typeBioText();
        }
    }
}

function closeBioModal() {
    if (bioModal) {
        bioModal.style.display = "none";
        bioTyping = false; 
    }
}

if (bioModal) {
    window.addEventListener('click', (event) => {
        if (event.target === bioModal) closeBioModal();
    });
}

// ==========================================
// 5. Navegação SPA Suave
// ==========================================
const navLinks = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const scrollBar = document.getElementById('scroll-progress');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        const targetId = link.getAttribute('href').substring(1);
        const targetSec = document.getElementById(targetId);
        
        if (targetSec) {
            sections.forEach(sec => sec.classList.remove('active'));
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            targetSec.classList.add('active');
            link.classList.add('active');
            
            // Si vamos a Inicio, ocultamos la barra. Si no, la mostramos.
            if (targetId === 'inicio') {
                if (scrollBar) scrollBar.style.display = 'none';
            } else {
                if (scrollBar) scrollBar.style.display = 'block';
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// ==========================================
// 6. Conquista Xbox (Download CV)
// ==========================================
const downloadCVBtn = document.getElementById('downloadCVBtn');
const xboxAchievement = document.getElementById('xbox-achievement');
let achievTimeout;

if (downloadCVBtn && xboxAchievement) {
    downloadCVBtn.addEventListener('click', () => {
        xboxAchievement.classList.add('show');
        clearTimeout(achievTimeout);
        achievTimeout = setTimeout(() => xboxAchievement.classList.remove('show'), 4000);
    });
}

// ==========================================
// 7. EASTER EGGS (SUDO, KONAMI)
// ==========================================

// Sudo Mode (Triple click profile pic)
const profileImg = document.getElementById('profileImg');
let clickCount = 0; let clickTimer;
if (profileImg) {
    profileImg.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        if (clickCount === 3) {
            document.body.classList.toggle('sudo-mode');
            const ticker = document.getElementById('ticker-content');
            if(ticker) {
                if(document.body.classList.contains('sudo-mode')) {
                    // Repetimos 10 veces para asegurar que cubre el 100% de la pantalla y el -50% del bucle
                    ticker.innerHTML = '<div class="ticker-item"><span class="accent">>></span> SYSTEM.OVERRIDE... ROOT ACCESS GRANTED</div>'.repeat(10);
                } else {
                    // Restauramos los dos grupos exactos
                    const baseTicker = '<div class="ticker-item"><span class="accent">>_</span> SYSTEM.STATUS: <span style="color: #c9d1d9;">ONLINE</span></div><div class="ticker-item"><span class="accent">>_</span> LEARNING.CURVE: <span style="color: #c9d1d9;">EXPONENTIAL</span></div><div class="ticker-item"><span class="accent">>_</span> BUSCANDO_NOVA_OPORTUNIDADE</div><div class="ticker-item"><span class="accent">>_</span> GITHUB.COMMITS: <span style="color: #c9d1d9;">++</span></div><div class="ticker-item"><span class="accent">>_</span> DEPLOYING_NEW_MODULES...</div><div class="ticker-item"><span class="accent">>_</span> CAFEINA_LEVEL: <span style="color: #c9d1d9;">99%</span></div>';
                    ticker.innerHTML = baseTicker + baseTicker;
                }
            }
            clickCount = 0;
        } else {
            clickTimer = setTimeout(() => { clickCount = 0; }, 400);
        }
    });
}

// Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
window.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.classList.toggle('konami-mode');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});


// ==========================================
// 8. INTERACTIVE TERMINAL (Multi-idioma + Form)
// ==========================================
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');
let currentTermLang = document.querySelector('.lang-btn.active')?.getAttribute('data-lang') || 'pt';

if (termInput && termOutput) {
    // 1. Respuestas de la consola actualizadas
    const termResponses = {
        pt: { help: "Comandos disponíveis:\n - help\n - cat skills.txt\n - clear\n - sudo hire juan\n", notFound: "command not found", hire: "[+] Excelente escolha. A preparar módulo de contacto seguro...\n", skills: ">> Skills: Java, Python, SQL, Git, Linux, Trabalho sob pressão, Adaptabilidade.\n" },
        es: { help: "Comandos disponibles:\n - help\n - cat skills.txt\n - clear\n - sudo hire juan\n", notFound: "command not found", hire: "[+] Excelente elección. Preparando módulo de contacto seguro...\n", skills: ">> Skills: Java, Python, SQL, Git, Linux, Trabajo bajo presión, Adaptabilidad.\n" },
        en: { help: "Available commands:\n - help\n - cat skills.txt\n - clear\n - sudo hire juan\n", notFound: "command not found", hire: "[+] Excellent choice. Preparing secure contact module...\n", skills: ">> Skills: Java, Python, SQL, Git, Linux, Work under pressure, Adaptability.\n" }
    };

    // Escuchar cambios de idioma para la terminal
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentTermLang = e.target.getAttribute('data-lang');
        });
    });

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            termInput.value = '';
            
            termOutput.innerHTML += `\n<span style="color: var(--accent-green);">juan@portfolio:~$</span> ${cmd}\n`;
            
            if (cmd === 'help') {
                termOutput.innerHTML += termResponses[currentTermLang].help;
            } else if (cmd === 'clear') {
                termOutput.innerHTML = '';
            } else if (cmd === 'cat skills.txt') {
                termOutput.innerHTML += termResponses[currentTermLang].skills;
            } else if (cmd.startsWith('sudo hire')) { 
                termOutput.innerHTML += `<span style="color: #00e676;">${termResponses[currentTermLang].hire}</span>\n`;
                
                // Mostrar formulario en lugar de abrir email
                setTimeout(() => {
                    const formContainer = document.getElementById('terminal-contact-form');
                    if (formContainer) {
                        formContainer.style.display = "block";
                        document.getElementById('senderEmail').focus();
                        // Hacemos scroll suave hacia abajo para ver el formulario completo
                        document.getElementById('interactive-terminal').scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }, 600);

            } else if (cmd !== '') {
                termOutput.innerHTML += `bash: ${cmd}: ${termResponses[currentTermLang].notFound}\n`;
            }
            
            termOutput.scrollTop = termOutput.scrollHeight;
        }
    });

    // 2. Lógica de Envío y Cancelación del Formulario
    const consoleForm = document.getElementById('consoleForm');
    const cancelConsoleForm = document.getElementById('cancelConsoleForm');
    const formContainer = document.getElementById('terminal-contact-form');

    if (consoleForm && formContainer) {
        // Enviar Formulario
        consoleForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita recargar la página
            
            // Textos de éxito
            const successMsg = {
                pt: "\n[+] Pacote TCP [100% transmitido]. Mensagem entregue ao servidor com sucesso!\n",
                es: "\n[+] Paquete TCP [100% transmitido]. ¡Mensaje entregado al servidor con éxito!\n",
                en: "\n[+] TCP packet [100% transmitted]. Message successfully delivered to server!\n"
            };

            termOutput.innerHTML += `<span style="color: var(--accent-color);">${successMsg[currentTermLang]}</span>`;
            termOutput.scrollTop = termOutput.scrollHeight;
            
            // Limpiar y ocultar
            formContainer.style.display = "none";
            consoleForm.reset();
            termInput.focus();
        });

        // Cancelar Formulario
        if(cancelConsoleForm) {
            cancelConsoleForm.addEventListener('click', () => {
                const cancelMsg = {
                    pt: "\n[-] Operação cancelada pelo utilizador (SIGINT).\n",
                    es: "\n[-] Operación cancelada por el usuario (SIGINT).\n",
                    en: "\n[-] Operation cancelled by user (SIGINT).\n"
                };
                termOutput.innerHTML += `<span style="color: #ff5555;">${cancelMsg[currentTermLang]}</span>`;
                termOutput.scrollTop = termOutput.scrollHeight;
                formContainer.style.display = "none";
                consoleForm.reset();
                termInput.focus();
            });
        }
    }
}  
// ==========================================
// 9. MOBILE OPTIMIZATION (Touchstart Hover)
// ==========================================
document.querySelectorAll('.hobby-images img, .exp-images img').forEach(img => {
    img.addEventListener('touchstart', function(e) {
        document.querySelectorAll('.touch-hover').forEach(el => el.classList.remove('touch-hover'));
        this.classList.add('touch-hover');
    }, {passive: true});
});

document.addEventListener('touchstart', (e) => {
    if(!e.target.closest('.hobby-images img') && !e.target.closest('.exp-images img')) {
        document.querySelectorAll('.touch-hover').forEach(el => el.classList.remove('touch-hover'));
    }
}, {passive: true});

// ==========================================
// 10. IDIOMAS (Full i18n support)
// ==========================================
const langBtns = document.querySelectorAll('.lang-btn');
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        
        // 1. Traduce todos los elementos estándar
        document.querySelectorAll('[data-' + lang + ']').forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = el.getAttribute('data-' + lang);
            } else {
                el.textContent = el.getAttribute('data-' + lang);
            }
        });

        // 2. Cambia el texto del título estático (tu nombre/subtítulo)
        const typeTextElement = document.getElementById("type-text");
        if (typeTextElement) {
            if (lang === 'pt') {
                typeTextElement.textContent = "Estudante de Engenharia Informática";
            } else if (lang === 'es') {
                typeTextElement.textContent = "Estudiante de Ingeniería Informática";
            } else {
                typeTextElement.textContent = "Computer Engineering Student";
            }
        }

        // 3. 🔥 Traducir los popups (tooltips) de los botones 🔥
        const soundBtnEl = document.getElementById('soundToggle');
        if (soundBtnEl) {
            if (lang === 'pt') soundBtnEl.title = "Ativar/Desativar som";
            else if (lang === 'es') soundBtnEl.title = "Activar/Desactivar sonido";
            else soundBtnEl.title = "Enable/Disable sound";
        }

        const backToTopBtnEl = document.getElementById('backToTop');
        if (backToTopBtnEl) {
            if (lang === 'pt') backToTopBtnEl.title = "Voltar ao início";
            else if (lang === 'es') backToTopBtnEl.title = "Volver al inicio";
            else backToTopBtnEl.title = "Back to top";
        }
    });
});

// ==========================================
// 11. Mensagem "Easter Egg" na Consola 🥚
// ==========================================
console.log(
    "%c¡Hola! Si estás inspeccionando esto, es porque te gusta ver cómo funcionan las cosas por debajo. Escribe 'sudo hire juan' en la terminal de la página o háblame a: juancarlosgds@gmail.com", 
    "color: #00e676; font-size: 1.2rem; font-weight: bold; background: #0d1117; padding: 10px; border-radius: 5px; border: 1px solid #00e676;"
); 