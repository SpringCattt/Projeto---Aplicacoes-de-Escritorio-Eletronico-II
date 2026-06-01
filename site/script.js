// 1. Lógica da Chuva Matrix no Fundo
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

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

let lastDrawTime = 0;
const fps = 24; 
const interval = 1000 / fps;

function drawMatrix(timestamp) {
    requestAnimationFrame(drawMatrix); 
    const deltaTime = timestamp - lastDrawTime;
    
    if (deltaTime > interval) {
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00e676'; 
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < drops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
            drops[i]++;
        }
        lastDrawTime = timestamp - (deltaTime % interval);
    }
}

requestAnimationFrame(drawMatrix);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });


// 2. Máquina de Escrever do Título (Hero)
const texts = [
    "Estudante de Engenharia Informática", 
    "Code. Learn. Build. Repeat.", 
    "Desenvolvedor em formação",
    "Software • Networking • Problem Solving"
];
let count = 0; let index = 0; let currentText = ""; let letter = ""; let isDeleting = false;

function type() {
    if (count === texts.length) { count = 0; }
    currentText = texts[count];
    if (isDeleting) { letter = currentText.slice(0, --index); } else { letter = currentText.slice(0, ++index); }

    const typeTextElement = document.getElementById("type-text");
    if (typeTextElement) { typeTextElement.textContent = letter; }

    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false; count++; typeSpeed = 500; 
    }
    setTimeout(type, typeSpeed);
}
document.addEventListener("DOMContentLoaded", function() { setTimeout(type, 1000); });


// ==========================================
// CONTROLO DO MODAL DE VÍDEO (OTIMIZADO)
// ==========================================
const openVideoBtn = document.getElementById('openVideoBtn');
const videoModal = document.getElementById('videoModal');
const closeVideoBtn = document.getElementById('closeVideoBtn');
const myVideo = document.getElementById('myVideo');
const matrixCanvas = document.getElementById('matrix-canvas'); // Referencia al fondo pesado

// Abrir modal e reproduzir o vídeo
openVideoBtn.addEventListener('click', () => {
    videoModal.style.display = "flex";
    if (matrixCanvas) matrixCanvas.style.display = "none"; // DESLIGA O MATRIX
    myVideo.play();
});

// Função para fechar e limpar
const closeModal = () => {
    videoModal.style.display = "none";
    if (matrixCanvas) matrixCanvas.style.display = "block"; // LIGA O MATRIX DE VOLTA
    myVideo.pause();
    myVideo.currentTime = 0; 
};

// Fechar modal no X
closeVideoBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora do vídeo
window.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        closeModal();
    }
});


// 4. Lógica de Escrita Animada no Modal da Biografia
const bioModal = document.getElementById("bioModal");
const bioTextElement = document.getElementById("bio-text");
const bioTextString = "Future software developer focused on learning, building and improving every day...";
let bioTyping = false;
let bioCharIndex = 0;

function typeBioText() {
    if (bioCharIndex < bioTextString.length && bioTyping) {
        bioTextElement.innerHTML += bioTextString.charAt(bioCharIndex);
        bioCharIndex++;
        setTimeout(typeBioText, 25); // Velocidade da digitação da Bio
    }
}

function openBioModal() {
    bioModal.style.display = "flex";
    if (!bioTyping) {
        bioTyping = true;
        bioCharIndex = 0;
        bioTextElement.innerHTML = ""; // Limpa para escrever do zero
        typeBioText();
    }
}

function closeBioModal() {
    bioModal.style.display = "none";
    bioTyping = false; // Interrompe a animação se for fechado
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    if (event.target == videoModal) { videoModal.style.display = "none"; video.pause(); }
    if (event.target == bioModal) { closeBioModal(); }
}