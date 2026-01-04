document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.anime-background');
    if (!container) return;

    // Create canvas for 3D solar system
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    
    // Stars background
    const stars = [];
    const numStars = 200;

    // Realistic Planets
    const planets = [
        { name: 'Mercury', orbitRadius: 80, size: 2.5, speed: 0.0015, angle: Math.random() * Math.PI * 2, color: '#A5A5A5' },
        { name: 'Venus', orbitRadius: 120, size: 4.5, speed: 0.0011, angle: Math.random() * Math.PI * 2, color: '#E3BB76' },
        { name: 'Earth', orbitRadius: 170, size: 5, speed: 0.0008, angle: Math.random() * Math.PI * 2, color: '#2271B3' },
        { name: 'Mars', orbitRadius: 220, size: 3.5, speed: 0.0006, angle: Math.random() * Math.PI * 2, color: '#E27B58' },
        { name: 'Jupiter', orbitRadius: 320, size: 12, speed: 0.0004, angle: Math.random() * Math.PI * 2, color: '#D39C7E', hasStripes: true },
        { name: 'Saturn', orbitRadius: 420, size: 10, speed: 0.0003, angle: Math.random() * Math.PI * 2, color: '#C5AB6E', hasRing: true },
        { name: 'Uranus', orbitRadius: 500, size: 7, speed: 0.0002, angle: Math.random() * Math.PI * 2, color: '#BBE1E4' },
        { name: 'Neptune', orbitRadius: 580, size: 7, speed: 0.00015, angle: Math.random() * Math.PI * 2, color: '#6081FF' },
    ];

    // 3D rotation - gentle floating motion
    const tiltX = 0.55; // Tilt angle for 3D effect
    let rotationY = 0;
    const rotationSpeed = 0.00008; // Very slow rotation for elegance

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Shift to the right of the hero text
        centerX = width > 768 ? width * 0.75 : width / 2;
        centerY = height / 2;
    }

    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.2 + 0.3,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initStars() {
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push(createStar());
        }
    }

    function drawStars() {
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
    }

    function project3D(x, y, z) {
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const rotatedX = x * cosY - z * sinY;
        const rotatedZ = x * sinY + z * cosY;
        
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const finalY = y * cosX - rotatedZ * sinX;
        const finalZ = y * sinX + rotatedZ * cosX;
        
        const scale = Math.min(width, height) / 900;
        const perspective = 800;
        const factor = perspective / (perspective + finalZ);
        
        return {
            x: centerX + rotatedX * factor * scale,
            y: centerY + finalY * factor * scale,
            z: finalZ,
            scale: factor
        };
    }

    function drawOrbit(radius) {
        const points = [];
        const segments = 100;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const projected = project3D(x, 0, z);
            points.push(projected);
        }

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawSun() {
        const projected = project3D(0, 0, 0);
        const scale = Math.min(width, height) / 900;
        const sunRadius = 25 * scale * projected.scale;

        // Sun Glow
        const gradient = ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, sunRadius * 4
        );
        gradient.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
        gradient.addColorStop(0.4, 'rgba(255, 100, 0, 0.1)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, sunRadius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Sun Core
        const coreGradient = ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, sunRadius
        );
        coreGradient.addColorStop(0, '#FFF');
        coreGradient.addColorStop(0.5, '#FFD700');
        coreGradient.addColorStop(1, '#FF8C00');

        ctx.beginPath();
        ctx.arc(projected.x, projected.y, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
    }

    function drawPlanet(planet) {
        const x = Math.cos(planet.angle) * planet.orbitRadius;
        const z = Math.sin(planet.angle) * planet.orbitRadius;
        const projected = project3D(x, 0, z);
        
        const scale = Math.min(width, height) / 900;
        const planetRadius = planet.size * scale * projected.scale;

        const depthFactor = (projected.z + 400) / 800;
        const opacity = Math.max(0.4, Math.min(1, 1 - depthFactor * 0.5));

        // Saturn's Rings
        if (planet.hasRing) {
            ctx.beginPath();
            ctx.ellipse(
                projected.x, projected.y,
                planetRadius * 2.8, planetRadius * 0.9,
                0.3, 0, Math.PI * 2
            );
            ctx.strokeStyle = `rgba(197, 171, 110, ${opacity * 0.6})`;
            ctx.lineWidth = 3 * projected.scale;
            ctx.stroke();
        }

        // Planet Body
        const gradient = ctx.createRadialGradient(
            projected.x - planetRadius * 0.3,
            projected.y - planetRadius * 0.3,
            0,
            projected.x,
            projected.y,
            planetRadius
        );
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0.8)');

        ctx.beginPath();
        ctx.arc(projected.x, projected.y, planetRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Jupiter's Stripes
        if (planet.hasStripes) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, planetRadius, 0, Math.PI * 2);
            ctx.clip();
            
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2 * projected.scale;
            for(let i = -planetRadius; i < planetRadius; i += 4 * projected.scale) {
                ctx.beginPath();
                ctx.moveTo(projected.x - planetRadius, projected.y + i);
                ctx.lineTo(projected.x + planetRadius, projected.y + i);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    let animationId;
    function animate() {
        ctx.fillStyle = 'rgb(10, 10, 12)';
        ctx.fillRect(0, 0, width, height);

        drawStars();
        rotationY += rotationSpeed;

        planets.forEach(planet => drawOrbit(planet.orbitRadius));

        const renderList = [];
        planets.forEach(planet => {
            planet.angle += planet.speed;
            const x = Math.cos(planet.angle) * planet.orbitRadius;
            const z = Math.sin(planet.angle) * planet.orbitRadius;
            const projected = project3D(x, 0, z);
            renderList.push({ planet, z: projected.z });
        });

        const sunProjected = project3D(0, 0, 0);
        renderList.push({ isSun: true, z: sunProjected.z });

        renderList.sort((a, b) => b.z - a.z);

        renderList.forEach(item => {
            if (item.isSun) drawSun();
            else drawPlanet(item.planet);
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start solar system immediately
    resize();
    initStars();
    animate();

    // Wait for preloader to finish to show the rest of the hero content
    window.addEventListener('preloaderFinished', () => {
        // Trigger hero text animation
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.classList.add('glitch-in');
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            initStars();
        }, 250);
    });
});
