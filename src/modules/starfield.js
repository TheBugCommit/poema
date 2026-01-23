let canvas;
let ctx;
let stars = [];
let animationFrameId;

const numStars = 500;
const maxDepth = 1500;
const targetSpeed = 2;

let currentSpeed = 0;
let acceleration = 0.01; 

export function initStarfield() {
    canvas = document.createElement('canvas');
    canvas.id = 'starfield-canvas';
    
    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 3s ease-in-out"; 
    
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);

    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
    }

    setTimeout(() => {
        canvas.style.opacity = 0.6; 
    }, 100);

    animate();
}

function createStar() {
    return {
        x: Math.random() * window.innerWidth - window.innerWidth / 2,
        y: Math.random() * window.innerHeight - window.innerHeight / 2,
        z: Math.random() * maxDepth,
        prevZ: null
    };
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2);
}

function animate() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    if (currentSpeed < targetSpeed) {
        currentSpeed += acceleration;
    }

    const starAlpha = Math.min(1, currentSpeed / 1.5 + 0.3);
    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    ctx.strokeStyle = `rgba(255, 255, 255, ${starAlpha})`;

    stars.forEach(star => {
        star.z -= currentSpeed;

        if (star.z <= 0) {
            star.x = Math.random() * canvas.width - canvas.width / 2;
            star.y = Math.random() * canvas.height - canvas.height / 2;
            star.z = maxDepth;
            star.prevZ = maxDepth;
        }

        const k = 128.0 / star.z;
        const px = star.x * k;
        const py = star.y * k;

        const prevK = 128.0 / (star.z + currentSpeed * 2); 
        const prevPx = star.x * prevK;
        const prevPy = star.y * prevK;

        const size = (1 - star.z / maxDepth) * 2.5;

        if (px >= -canvas.width/2 && px <= canvas.width/2 && py >= -canvas.height/2 && py <= canvas.height/2) {
            
            if (currentSpeed > 0.1) {
                ctx.beginPath();
                ctx.lineWidth = size;
                ctx.moveTo(px, py);
                ctx.lineTo(prevPx, prevPy);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(px, py, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    animationFrameId = requestAnimationFrame(animate);
}