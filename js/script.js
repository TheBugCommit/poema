document.addEventListener("DOMContentLoaded", main);

const PASSPHRASE = "La singularitat del creuament dels camins";
let secretInput;

const normalizeText = (text) => text.replaceAll(/\s/g, '').toUpperCase();

const showError = () => {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.opacity = '1';
    secretInput.value = '';
    secretInput.focus();

    setTimeout(() => {
        errorMsg.style.opacity = '0';
    }, 2000);
}

const revealUniverse = () => {
    const loginRow = document.getElementById('login-row');
    const poemRow = document.getElementById('poem-row');
    const music = document.getElementById('bg-music');

    if (music) {
        music.volume = 0.4;
        music.play().catch(e => console.log("Autoplay bloquejat"));
    }

    loginRow.style.opacity = '0';

    setTimeout(() => {
        loginRow.classList.add('d-none');
        poemRow.classList.remove('d-none');

        setTimeout(() => {
            poemRow.style.opacity = '1';
        }, 100);

    }, 1500);
}

const attemptEntry = () => {
    if (normalizeText(secretInput.value) === normalizeText(PASSPHRASE)) {
        secretInput.blur();
        revealUniverse();
    } else {
        showError();
    }
}

function main() {
    secretInput = document.getElementById('secretInput');
    if (!secretInput) return;

    secretInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') attemptEntry();
    });
}