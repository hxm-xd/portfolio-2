document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.anime-background');
    if (!container) return;

    function createGrid() {
        container.innerHTML = '';
        const width = window.innerWidth;
        const height = window.innerHeight;
        const size = 40; // Size of element + margin
        const columns = Math.ceil(width / size);
        const rows = Math.ceil(height / size);
        const total = columns * rows;

        for (let i = 0; i < total; i++) {
            const el = document.createElement('div');
            el.classList.add('anime-el');
            container.appendChild(el);
        }

        anime({
            targets: '.anime-el',
            scale: [
                {value: 0.1, easing: 'easeOutSine', duration: 500},
                {value: 1, easing: 'easeInOutQuad', duration: 1200}
            ],
            opacity: [
                {value: 0, easing: 'linear', duration: 500},
                {value: 0.5, easing: 'linear', duration: 1200}
            ],
            delay: anime.stagger(100, {grid: [columns, rows], from: 'center'}),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }

    createGrid();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(createGrid, 250);
    });
});
