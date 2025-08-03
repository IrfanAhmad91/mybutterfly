document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const book = document.getElementById('book');
    const cover = document.getElementById('cover');
    const pages = document.getElementById('pages');
    const musicSelection = document.getElementById('musicSelection');
    const bookContainer = document.getElementById('bookContainer');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const songOptions = document.querySelectorAll('.song-option');
    const pageElements = document.querySelectorAll('.page');

    // FINAL OVERLAY Elements
    const finalOverlay = document.getElementById('finalOverlay');
    const yesSound = document.getElementById('yesSound');
    const cuteSound = document.getElementById('cuteSound');

    // State variables
    let currentPage = 1;
    const totalPages = pageElements.length;
    let emojiInterval;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize
    init();

    function init() {
        setupEventListeners();
        if (!reducedMotion) {
            createInitialButterflies();
        }
    }

    function setupEventListeners() {
        // Song selection
        songOptions.forEach(option => {
            option.addEventListener('click', function() {
                const songPath = this.getAttribute('data-song');
                backgroundMusic.src = songPath;
                backgroundMusic.play().then(() => {
                    showBookInterface();
                    if (!reducedMotion) {
                        createInitialAnimations();
                    }
                }).catch(e => {
                    console.log("Autoplay prevented, showing book anyway");
                    showBookInterface();
                });
            });
        });

        // Book interactions
        cover.addEventListener('click', openBook);

        // Page navigation
        document.querySelectorAll('.next-btn').forEach(button => {
            button.addEventListener('click', handlePageNavigation);
        });

        // Music toggle
        musicToggle.addEventListener('click', toggleMusic);

        // Scroll detection for each page
        pageElements.forEach(page => {
            const pageContent = page.querySelector('.page-content');
            pageContent.addEventListener('scroll', function() {
                const scrollThreshold = pageContent.scrollHeight - pageContent.clientHeight - 50;
                if (pageContent.scrollTop >= scrollThreshold) {
                    page.classList.add('show-controls');
                } else {
                    page.classList.remove('show-controls');
                }
            });
        });

        // Click effects
        document.addEventListener('click', createClickEffect);

        // Handle visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // FINAL PAGE trigger
        document.querySelector('.page[data-page="4"] .next-btn').addEventListener('click', () => {
            setTimeout(() => {
                finalOverlay.style.display = 'flex';
                setupFinalOverlayEvents();
            }, 1000);
        });
    }

    function showBookInterface() {
        musicSelection.style.display = 'none';
        bookContainer.style.display = 'block';
        musicToggle.style.display = 'flex';
    }

    function createInitialAnimations() {
        createInitialButterflies();
        createFloatingEmojis();
        createInitialEmojiBurst();
    }

    function createInitialButterflies() {
        if (isMobile) return;

        const colors = ['#ff66b3', '#ff99cc', '#ffb3d9', '#ff80bf'];
        const butterflyCount = 6;

        for (let i = 0; i < butterflyCount; i++) {
            createButterfly(colors);
        }
    }

    function createButterfly(colors) {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = 20 + Math.random() * 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 15;

        butterfly.style.left = `${x}px`;
        butterfly.style.top = `${y}px`;
        butterfly.style.width = `${size}px`;
        butterfly.style.height = `${size}px`;
        butterfly.style.backgroundImage = `radial-gradient(circle at 30% 50%, ${color} 25%, transparent 25%), radial-gradient(circle at 70% 50%, ${color} 25%, transparent 25%)`;
        butterfly.style.animationDelay = `${delay}s`;
        butterfly.style.filter = `hue-rotate(${Math.random() * 60}deg)`;

        document.body.appendChild(butterfly);

        const flutterInterval = setInterval(() => {
            butterfly.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
        }, 200);

        butterfly._flutterInterval = flutterInterval;
    }

    function createFloatingEmojis() {
        if (reducedMotion) return;

        clearInterval(emojiInterval);
        const emojis = ['🌺', '🦋', '🌸', '💖', '🌹', '💐'];
        const intervalTime = isMobile ? 1500 : 800;

        emojiInterval = setInterval(() => {
            if (Math.random() > 0.3) {
                createRandomEmoji(emojis);
            }
        }, intervalTime);
    }

    function createRandomEmoji(emojis) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}vw`;
        emoji.style.top = `${Math.random() * 100}vh`;
        emoji.style.fontSize = `${20 + Math.random() * 30}px`;
        emoji.style.animationDuration = `${3 + Math.random() * 3}s`;
        document.body.appendChild(emoji);

        setTimeout(() => emoji.remove(), 5000);
    }

    function createInitialEmojiBurst() {
        if (reducedMotion) return;

        const emojis = ['🌺', '🦋'];
        const burstCount = isMobile ? 10 : 15;

        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'floating-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = `${50 + (Math.random() * 20 - 10)}vw`;
                emoji.style.top = `${50 + (Math.random() * 20 - 10)}vh`;
                emoji.style.fontSize = `${30 + Math.random() * 40}px`;
                emoji.style.animationDuration = `${4 + Math.random() * 2}s`;
                document.body.appendChild(emoji);

                setTimeout(() => emoji.remove(), 6000);
            }, i * 100);
        }
    }

    function openBook() {
        book.style.transform = 'rotateY(-180deg)';
        createHearts();
    }

    function handlePageNavigation(event) {
        event.preventDefault();
        const page = event.currentTarget.closest('.page');
        const pageNumber = parseInt(page.dataset.page);

        if (pageNumber === totalPages) {
            closeBook();
        } else {
            goToPage(pageNumber + 1);
        }
    }

    function closeBook() {
        book.style.transform = 'rotateY(0deg)';
        currentPage = 1;
        updateActivePage();
        createHearts();
    }

    function goToPage(pageNumber) {
        currentPage = pageNumber;
        updateActivePage();

        const activePage = document.querySelector('.page.active');
        const pageContent = activePage.querySelector('.page-content');
        pageContent.scrollTo({ top: 0, behavior: 'smooth' });
        activePage.classList.remove('show-controls');
    }

    function updateActivePage() {
        pageElements.forEach(page => {
            page.classList.remove('active');
            if (parseInt(page.dataset.page) === currentPage) {
                page.classList.add('active');
            }
        });

        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentPage - 1) {
                dot.classList.add('active');
            }
        });
    }

    function createHearts() {
        if (reducedMotion) return;

        const heartCount = isMobile ? 5 : 10;
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '❤️';
                heart.style.left = `${Math.random() * 100}vw`;
                heart.style.top = `${Math.random() * 100}vh`;
                heart.style.fontSize = `${10 + Math.random() * 20}px`;
                heart.style.animationDuration = `${2 + Math.random() * 3}s`;
                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 4000);
            }, i * 300);
        }
    }

    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = '🔊';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = '🔇';
        }
    }

    function createClickEffect(event) {
        if (event.target === cover || event.target.closest('.next-btn') || event.target.closest('.song-option')) return;

        if (reducedMotion) return;

        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${event.clientX}px`;
        heart.style.top = `${event.clientY}px`;
        heart.style.fontSize = '20px';
        heart.style.animationDuration = '3s';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            backgroundMusic.pause();
            musicToggle.textContent = '🔇';
        }
    }

    function setupFinalOverlayEvents() {
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        yesBtn.addEventListener('click', () => {
            yesSound.play();
            finalOverlay.style.background = 'linear-gradient(135deg, #ffd6e6, #fff0f5)';
            launchRomanticAnimation();
        });

        noBtn.addEventListener('click', () => {
            noBtn.style.display = 'none';
            const iyaaBtn = document.createElement('button');
            iyaaBtn.textContent = 'iyaa 😳';
            iyaaBtn.className = 'iyaa-btn';
            document.querySelector('.buttons').appendChild(iyaaBtn);

            iyaaBtn.addEventListener('click', () => {
                cuteSound.play();
                launchCuteAnimation();
            });
        });
    }

    function launchRomanticAnimation() {
        const emojis = ['💖', '🌹', '💐', '❤️'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'cute-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = Math.random() * 100 + 'vw';
                emoji.style.top = Math.random() * 100 + 'vh';
                document.body.appendChild(emoji);

                setTimeout(() => emoji.remove(), 3000);
            }, i * 100);
        }
    }

    function launchCuteAnimation() {
        const emojis = ['🐥', '🥰', '🐣', '🐤', '💞'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'cute-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = Math.random() * 100 + 'vw';
                emoji.style.top = Math.random() * 100 + 'vh';
                document.body.appendChild(emoji);

                setTimeout(() => emoji.remove(), 3000);
            }, i * 100);
        }
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        clearInterval(emojiInterval);
        document.querySelectorAll('.butterfly').forEach(butterfly => {
            if (butterfly._flutterInterval) {
                clearInterval(butterfly._flutterInterval);
            }
        });
    });
});
