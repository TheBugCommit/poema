import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

import { setupAudio } from './modules/audio.js';
import { showErrorAnimation, startCinematicExperience } from './modules/animations.js';

const PASSPHRASE = "LA SINGULARITAT DEL CREUAMENT DELS CAMINS";
const normalizeText = (text) => text.replaceAll(/\s/g, '').toUpperCase();

document.addEventListener("DOMContentLoaded", () => {
    setupAudio();

    const enterBtn = document.querySelector('.btn-cosmos');
    const secretInput = document.querySelector('#login-row input');

    const tapHint = document.getElementById('tap-hint');

    const removeHint = () => {
        if (tapHint) {
            tapHint.style.opacity = '0'; 
            tapHint.remove()
        }
    };

    document.body.addEventListener('click', removeHint, { once: true });
    document.body.addEventListener('keydown', removeHint, { once: true });

    const handleAttempt = () => {
        if (normalizeText(secretInput.value) === normalizeText(PASSPHRASE)) {
            secretInput.blur();
            startCinematicExperience();
        } else {
            secretInput.value = '';
            showErrorAnimation();
        }
    };

    if (enterBtn) enterBtn.addEventListener('click', handleAttempt);
    if (secretInput) {
        secretInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAttempt();
        });
    }
});