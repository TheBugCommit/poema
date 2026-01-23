import gsap from 'gsap';
import { introAudio, poemAudio, supernovaAudio, loginAudio } from './audio.js';
import { initStarfield } from './starfield.js';

const context = import.meta.webpackContext('../assets/img', {
    recursive: false,
    regExp: /\.(png|jpe?g)$/
});

const PHOTOS = context.keys()
    .filter(fileName => !fileName.includes('fons-galaxia.jpg'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(context);

export function showErrorAnimation() {
    gsap.to("#login-row", { x: 10, duration: 0.1, yoyo: true, repeat: 5 });
    const errorMsg = document.getElementById('error-msg');
    gsap.to(errorMsg, { opacity: 1, duration: 0.5 });
    gsap.to(errorMsg, { opacity: 0, duration: 0.5, delay: 2 });
}

export function startCinematicExperience() {
    const stage = document.getElementById('memories-stage');
    const tl = gsap.timeline();

    const core = document.querySelector(".supernova-core");
    const shockwave = document.querySelector(".supernova-shockwave");
    const flash = document.querySelector(".supernova-flash");

    tl.add("start");

    tl.to(loginAudio, { volume: 0, duration: 1.5, onComplete: () => loginAudio.pause() }, "start");
    tl.to("#login-row", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('login-row').classList.add('d-none');
        }
    }, "start");


    tl.add("supernovaStart", ">"); 
 
     tl.call(() => {
         supernovaAudio.volume = 1;
         supernovaAudio.currentTime = 0;
         supernovaAudio.play().catch(e => console.log(e));
     }, null, "supernovaStart");
 
     tl.fromTo(core,
         { scale: 0, opacity: 0 },
         { scale: 1.5, opacity: 1, duration: 1.5, ease: "power2.out" },
         "supernovaStart"
     );
     tl.to(core, { scale: 0.2, duration: 0.1, ease: "back.in(2)" });
 
 
     tl.add("EXPLOSION"); 

     tl.to(flash, { opacity: 1, duration: 0.3 }, "EXPLOSION")
       .set(core, { opacity: 0 }, "EXPLOSION"); 
 
     tl.fromTo(shockwave,
         { scale: 0, opacity: 1, borderWidth: "50px" },
         { scale: 150, opacity: 0, borderWidth: "0px", duration: 2, ease: "power4.out" },
         "EXPLOSION"
     );
 
     tl.to(flash, { opacity: 0, duration: 3, ease: "power2.inOut" }, "EXPLOSION+=0.1");
 
 
     const newWorldStart = "EXPLOSION+=6"; 
     const finishWaves = "EXPLOSION+=3"; 
 
     tl.call(() => {
         introAudio.volume = 1;
         introAudio.play();
         initStarfield()
     }, null, finishWaves);
 
     let currentDelay = 2.5;
     const maxVisiblePhotos = 3;
     const createdImages = [];
 
     PHOTOS.forEach((photoSrc, index) => {
         const img = document.createElement('img');
         img.src = photoSrc;
         img.classList.add('memory-photo');
         stage.appendChild(img);
         createdImages.push(img);
 
         const randomRotation = (Math.random() * 30) - 15;
         if (index > 0) currentDelay = Math.max(0.5, currentDelay * 0.8);
 
         const positionParam = index === 0 ? newWorldStart : `<+=${currentDelay}`;
         const currentTimeLabel = "photo_" + index;
 
         tl.fromTo(img,
             { opacity: 0, scale: 0.8, rotation: randomRotation - 10, xPercent: -50, yPercent: -50 },
             { opacity: 1, scale: 1, rotation: randomRotation, duration: 1, ease: "power2.out", xPercent: -50, yPercent: -50 },
             positionParam
         ).addLabel(currentTimeLabel);
 
         const indexToRemove = index - maxVisiblePhotos;
         if (indexToRemove >= 0) {
             const imgToRemove = createdImages[indexToRemove];
             tl.to(imgToRemove, { 
                 opacity: 0, rotation: randomRotation, duration: 2, ease: "power2.in", xPercent: -50, yPercent: -50 
             }, currentTimeLabel);
         }
     });
 
     tl.add("endSequence", ">-=0.5");
 
     const remainingImages = createdImages.slice(-maxVisiblePhotos);
     if (remainingImages.length > 0) {
         tl.to(remainingImages, {
             opacity: 0, yPercent: -100, stagger: 0.2, duration: 1.5, ease: "power2.in"
         }, "endSequence");
     }

    tl.add("FinalTransition", "endSequence");

    tl.to(introAudio, { volume: 0, duration: 3, onComplete: () => introAudio.pause(), ease: "power1.out" }, "FinalTransition")
        .call(() => {
            poemAudio.volume = 0;
            poemAudio.play();
            gsap.to(poemAudio, { volume: 1, duration: 3 });
        }, null, "FinalTransition>+=2")
        .call(() => {
            const poemRow = document.getElementById('poem-row');
            poemRow.classList.remove('d-none');
            gsap.to(poemRow, { opacity: 1, duration: 3 });
        }, null, "FinalTransition>+=4");
}