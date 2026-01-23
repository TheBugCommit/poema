import introFile from '../assets/audio/intro.mp3';
import poemFile from '../assets/audio/fons.mp3';
import loginFile from '../assets/audio/login_ambient.mp3';
import supernovaFile from '../assets/audio/supernova.mp3';

let introAudio = new Audio(introFile);
let poemAudio = new Audio(poemFile);
let loginAudio = new Audio(loginFile);
let supernovaAudio = new Audio(supernovaFile);

export function setupAudio() {
    loginAudio.loop = true;
    loginAudio.volume = 0.15;
    poemAudio.loop = true;
    supernovaAudio.volume = 1.0;
    
    document.body.addEventListener('click', () => {
        if(loginAudio.paused) loginAudio.play().catch(()=>{});

        [introAudio, poemAudio, supernovaAudio].forEach(snd => {
            snd.volume = 0; 
            snd.play().then(() => {
                snd.pause(); 
                snd.currentTime = 0;
            }).catch(() => {});
        });

        setTimeout(() => { 
            introAudio.volume = 0.8; 
            supernovaAudio.volume = 0.5; 
        }, 100);

    }, { once: true });
}

export { introAudio, poemAudio, supernovaAudio, loginAudio };