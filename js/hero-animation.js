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
    const numStars = 150;

    // Planets - simple wireframe style with slower, more elegant speeds
    const planets = [
        { orbitRadius: 80, size: 3, speed: 0.0012, angle: Math.random() * Math.PI * 2 },
        { orbitRadius: 120, size: 4, speed: 0.0009, angle: Math.random() * Math.PI * 2 },
        { orbitRadius: 170, size: 5, speed: 0.0006, angle: Math.random() * Math.PI * 2 },
        { orbitRadius: 230, size: 4, speed: 0.00045, angle: Math.random() * Math.PI * 2 },
        { orbitRadius: 300, size: 8, speed: 0.0003, angle: Math.random() * Math.PI * 2, hasRing: true },
        { orbitRadius: 380, size: 6, speed: 0.00022, angle: Math.random() * Math.PI * 2 },
    ];

    // 3D rotation - gentle floating motion
    const tiltX = 0.55; // Tilt angle for 3D effect
    let rotationY = 0;
    const rotationSpeed = 0.00008; // Very slow rotation for elegance

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
    }

    function project3D(x, y, z) {
        // Apply 3D rotation around Y axis
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const rotatedX = x * cosY - z * sinY;
        const rotatedZ = x * sinY + z * cosY;
        
        // Apply tilt (rotation around X axis)
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const finalY = y * cosX - rotatedZ * sinX;
        const finalZ = y * sinX + rotatedZ * cosX;
        
        // Simple perspective
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
        const segments = 80;
        
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
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawSun() {
        const projected = project3D(0, 0, 0);
        const scale = Math.min(width, height) / 900;
        const sunRadius = 15 * scale * projected.scale;

        // Subtle glow
        const gradient = ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, sunRadius * 3
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, sunRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Sun core - simple white circle
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }

    function drawPlanet(planet) {
        const x = Math.cos(planet.angle) * planet.orbitRadius;
        const z = Math.sin(planet.angle) * planet.orbitRadius;
        const projected = project3D(x, 0, z);
        
        const scale = Math.min(width, height) / 900;
        const planetRadius = planet.size * scale * projected.scale;

        // Depth-based opacity (further = dimmer)
        const depthFactor = (projected.z + 400) / 800;
        const opacity = Math.max(0.3, Math.min(1, 0.9 - depthFactor * 0.4));

        // Ring for saturn-like planet
        if (planet.hasRing) {
            ctx.beginPath();
            ctx.ellipse(
                projected.x, projected.y,
                planetRadius * 2.5, planetRadius * 0.8,
                0.3, 0, Math.PI * 2
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
            ctx.lineWidth = 1.5 * projected.scale;
            ctx.stroke();
        }

        // Planet body - simple circle with subtle gradient
        const gradient = ctx.createRadialGradient(
            projected.x - planetRadius * 0.3,
            projected.y - planetRadius * 0.3,
            0,
            projected.x,
            projected.y,
            planetRadius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(200, 200, 200, ${opacity * 0.6})`);

        ctx.beginPath();
        ctx.arc(projected.x, projected.y, planetRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return { z: projected.z, draw: null }; // For depth sorting
    }

    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgb(10, 10, 12)';
        ctx.fillRect(0, 0, width, height);

        // Draw stars
        drawStars();

        // Rotate the system slowly
        rotationY += rotationSpeed;

        // Draw orbits
        planets.forEach(planet => {
            drawOrbit(planet.orbitRadius);
        });

        // Update planet positions and collect for depth sorting
        const renderList = [];
        
        planets.forEach(planet => {
            planet.angle += planet.speed;
            const x = Math.cos(planet.angle) * planet.orbitRadius;
            const z = Math.sin(planet.angle) * planet.orbitRadius;
            const projected = project3D(x, 0, z);
            renderList.push({ planet, z: projected.z });
        });

        // Add sun to render list
        const sunProjected = project3D(0, 0, 0);
        renderList.push({ isSun: true, z: sunProjected.z });

        // Sort by depth (far to near)
        renderList.sort((a, b) => b.z - a.z);

        // Render in order
        renderList.forEach(item => {
            if (item.isSun) {
                drawSun();
            } else {
                drawPlanet(item.planet);
            }
        });

        requestAnimationFrame(animate);
    }

    resize();
    initStars();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            initStars();
        }, 250);
    });
});
