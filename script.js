// 1. Lógica da Chuva Matrix no Fundo
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho para o ecrã todo
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Caracteres utilizados no efeito
const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for(let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Variáveis para controlar os frames e reduzir o lag da animação
let lastDrawTime = 0;
const fps = 24; // 24 frames por segundo mantém o efeito Matrix fluido mas poupa muita CPU
const interval = 1000 / fps;

function drawMatrix(timestamp) {
    // requestAnimationFrame é muito mais otimizado que o setInterval
    requestAnimationFrame(drawMatrix); 

    const deltaTime = timestamp - lastDrawTime;
    
    // Só desenha se tiver passado tempo suficiente no ecrã
    if (deltaTime > interval) {
        // Fundo semi-transparente para dar efeito de rastro
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00e676'; // Verde característico
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < drops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset da gota de forma aleatória quando passa do ecrã
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        lastDrawTime = timestamp - (deltaTime % interval);
    }
}

// Inicia a animação otimizada
requestAnimationFrame(drawMatrix);

// Ajusta o canvas se a janela for redimensionada
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// ----------------------------------------------------
// 2. Lógica Anterior (Máquina de escrever e Modal de Vídeo)
const texts = [
    "Estudante de Engenharia Informática", 
    "Code. Learn. Build. Repeat.", 
    "Desenvolvedor em formação",
    "Software • Networking • Problem Solving"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

function type() {
    if (count === texts.length) { count = 0; }
    currentText = texts[count];
    
    if (isDeleting) { 
        letter = currentText.slice(0, --index); 
    } else { 
        letter = currentText.slice(0, ++index); 
    }

    const typeTextElement = document.getElementById("type-text");
    if (typeTextElement) { 
        typeTextElement.textContent = letter; 
    }

    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; // Pausa no final da palavra
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500; // Pausa antes de escrever a próxima
    }
    
    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, 1000);
});

// Lógica do modal
const modal = document.getElementById("videoModal");
const btn = document.getElementById("openVideoBtn");
const span = document.getElementById("closeVideoBtn");
const video = document.getElementById("myVideo");

if (btn) { 
    btn.onclick = function() { 
        modal.style.display = "flex"; 
    } 
}

if (span) { 
    span.onclick = function() { 
        modal.style.display = "none"; 
        video.pause(); 
    } 
}

window.onclick = function(event) {
    if (event.target == modal) { 
        modal.style.display = "none"; 
        video.pause(); 
    }
}