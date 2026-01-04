/**
 * Particle Network Animation
 * A subtle constellation-style particle effect for page backgrounds
 */

class ParticleNetwork {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.mouse = { x: null, y: null };
        
        // Configuration - Subtle & Appealing
        this.config = {
            particleCount: window.innerWidth < 768 ? 30 : 60,
            connectionDistance: 180,
            mouseDistance: 250,
            baseSpeed: 0.3, // Slower for less distraction
            color: '150, 100%, 45%', // Primary color (Green)
            secondaryColor: '260, 50%, 55%' // Secondary color (Purple)
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.config.particleCount = window.innerWidth < 768 ? 30 : 60;
        // Re-create particles only if count changes significantly or empty
        if (this.particles.length === 0) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.baseSpeed,
                vy: (Math.random() - 0.5) * this.config.baseSpeed,
                size: Math.random() * 2 + 0.5,
                color: Math.random() > 0.5 ? this.config.color : this.config.secondaryColor,
                alpha: Math.random() * 0.5 + 0.1 // Varying initial opacity
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    // Use a gradient or mix for lines? Keep it simple for performance.
                    // Very subtle lines
                    this.ctx.strokeStyle = `hsla(${this.particles[i].color}, ${opacity * 0.15})`; 
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }

            // Mouse connections - slightly brighter
            if (this.mouse.x != null) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.mouseDistance) {
                    const opacity = 1 - (distance / this.config.mouseDistance);
                    this.ctx.strokeStyle = `hsla(${this.config.color}, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                    
                    // Gentle attraction
                    if (distance > 50) {
                        this.particles[i].x -= dx * 0.005;
                        this.particles[i].y -= dy * 0.005;
                    }
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges for continuous flow
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Pulse size slightly
            p.alpha = 0.3 + Math.sin(Date.now() * 0.001 + p.x) * 0.2;
        });
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.fillStyle = `hsla(${p.color}, ${p.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawLines();
        this.drawParticles();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.canvas.remove();
    }
}

// Global init function
window.initParticles = function() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    // Clear existing canvas if any
    container.innerHTML = '';
    
    new ParticleNetwork(container);
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initParticles);
} else {
    window.initParticles();
}

