document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const replayButton = document.getElementById('replay-button');
    const pauseButton = document.getElementById('pause-button');
    const musicButton = document.createElement('button');
    const backgroundMusic = document.getElementById('background-music');
    let score = 0;
    let level = 1;
    let lives = 3; // Déclaration du nombre de vies
    const scoreElement = document.getElementById('score');
    let gameInterval;
    let isPaused = false;
    let isMusicPlaying = true;

    // Ajouter le bouton de musique
    musicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    musicButton.style.margin = '0 10px';
    musicButton.style.fontSize = '1.5rem';
    musicButton.style.background = 'none';
    musicButton.style.border = 'none';
    musicButton.style.cursor = 'pointer';
    musicButton.style.color = '#683103';
    document.body.insertBefore(musicButton, gameContainer);

    // Gestion de la musique
    const toggleMusic = () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            backgroundMusic.play();
            musicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    };

    musicButton.addEventListener('click', toggleMusic);

    const gameArea = document.createElement('div');
    gameArea.style.position = 'relative';
    gameArea.style.width = '80%';
    gameArea.style.height = '99%';
    gameArea.style.margin = 'auto';
    gameArea.style.overflow = 'hidden';
    gameContainer.appendChild(gameArea);

    // Affichage des vies
    const livesElement = document.createElement('div');
    livesElement.style.fontSize = '1.8rem';
    livesElement.style.fontWeight = 'bold';
    livesElement.style.color = '#68460E';
    livesElement.textContent = `Vies : ${lives}`;
    document.body.insertBefore(livesElement, gameContainer); // Affichage du nombre de vies

    const updateScore = () => {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        if (score % 10 === 0) {
            level++;
            announceLevelChange();
            clearInterval(gameInterval);
            gameInterval = setInterval(createImage, 2000 / level);
        }
    };

    const announceLevelChange = () => {
        const levelElement = document.createElement('div');
        levelElement.style.position = 'absolute';
        levelElement.style.top = '50%';
        levelElement.style.left = '50%';
        levelElement.style.transform = 'translate(-50%, -50%)';
        levelElement.style.fontSize = '48px';
        levelElement.style.color = '#68460E';
        levelElement.textContent = `Level ${level}`;
        gameContainer.appendChild(levelElement);

        setTimeout(() => {
            gameContainer.removeChild(levelElement);
        }, 2000);
    };

    const createImage = () => {
        if (isPaused) return;

        // Créer un conteneur invisible
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = `${Math.random() * (gameArea.clientWidth - 100)}px`;
        container.style.top = `-${Math.random() * 100}px`;
        container.style.width = '200px';
        container.style.height = '200px';
        container.style.cursor = 'crosshair';
        gameArea.appendChild(container);

        const img = document.createElement('img');
        img.src = './img/biscuit_ninja.png';
        img.style.position = 'absolute';
        img.style.left = '0';
        img.style.top = '0';
        img.style.width = '100px';
        img.style.height = '100px';
        container.appendChild(img);

        // Gestion du clic sur le conteneur
        container.addEventListener('click', () => {
            if (isPaused) return;

            // Récupère et joue le son de clic
            const clickSound = document.getElementById('click-sound');
            clickSound.currentTime = 0; // Réinitialise le son au début
            clickSound.play();

            img.src = './img/broken_biscuit_ninja-.png'; // Change l'image en "cassé"
            updateScore();

            setTimeout(() => {
                container.remove();
            }, 200);
        });

        // Animation de la chute
        const fall = () => {
            if (isPaused) return;

            if (!container.parentElement) return;

            container.style.top = `${parseFloat(container.style.top) + 5}px`;

            if (parseFloat(container.style.top) < gameArea.clientHeight) {
                requestAnimationFrame(fall);
            } else {
                if (container.parentElement) {
                    // Si un biscuit touche le sol, on perd une vie
                    lives--;
                    livesElement.textContent = `Vies : ${lives}`;
                    // Jouer le son de perte de vie
                    const lifeLostSound = document.getElementById('life-lost-sound');
                    lifeLostSound.currentTime = 0; // Réinitialise le son
                    lifeLostSound.play(); // Joue le son de perte de vie
                    if (lives <= 0) {
                        gameOver();
                    }
                }
                container.remove(); // Supprimer le biscuit tombé
            }
        };
        fall();
    };

    const startGame = () => {
        score = 0;
        level = 1;
        lives = 3; // Réinitialiser les vies
        scoreElement.textContent = `Score: ${score}`;
        livesElement.textContent = `Vies : ${lives}`; // Réinitialiser les vies affichées
        gameArea.innerHTML = '';
        isPaused = false;

        const gameOverElement = document.getElementById('game-over');
        if (gameOverElement) {
            gameOverElement.remove();
        }

        gameInterval = setInterval(createImage, 1000);
        backgroundMusic.play(); // Démarrer la musique automatiquement
    };

    const pauseGame = () => {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(gameInterval);
        } else {
            gameInterval = setInterval(createImage, 1000 / level);
        }
    };

    // Initialiser le son de la perte de vie
    const lifeLostSound = document.getElementById('life-lost-sound');

    // Modifie la fonction qui gère la fin du jeu ou la perte de vie
    const gameOver = () => {
        clearInterval(gameInterval);
        isPaused = true;

        // Arrête la musique de fond
        backgroundMusic.pause();

        // Joue le son de fin de jeu
        const gameOverSound = document.getElementById('game-over-sound');
        gameOverSound.currentTime = 0; // Réinitialise le son au début
        gameOverSound.play();

        // Affiche le message de Game Over
        if (!document.getElementById('game-over')) {
            const gameOverElement = document.createElement('div');
            gameOverElement.id = 'game-over';
            gameOverElement.style.position = 'absolute';
            gameOverElement.style.top = '50%';
            gameOverElement.style.left = '50%';
            gameOverElement.style.transform = 'translate(-50%, -50%)';
            gameOverElement.style.fontSize = '48px';
            gameOverElement.style.color = 'red';
            gameOverElement.textContent = 'Game Over';
            gameContainer.appendChild(gameOverElement);
        }

        replayButton.style.display = 'block'; // Afficher le bouton Rejouer
    };

    // Gérer le bouton "Commencer"
    startButton.addEventListener('click', () => {
        welcomeScreen.style.display = 'none'; // Masquer l'écran de bienvenue
        gameContainer.style.display = 'block'; // Afficher le conteneur du jeu
        startGame();
    });

    replayButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
});
