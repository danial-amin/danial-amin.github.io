/**
 * Particles.js init - CJ-CV style background (floating dots + connecting lines).
 * Uses theme color from CSS so it matches light/dark mode.
 */
(function () {
    function getParticlesColor() {
        var style = getComputedStyle(document.documentElement);
        var color = style.getPropertyValue('--bg-object-color').trim() || style.getPropertyValue('--text-primary').trim();
        if (!color) return '#6b7280';
        return color;
    }

    function initParticles() {
        if (typeof particlesJS === 'undefined') return;
        var color = getParticlesColor();
        particlesJS('particles-js', {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 800 } },
                color: { value: color },
                shape: { type: 'circle' },
                opacity: { value: 0.35, random: true },
                size: { value: 3, random: { enable: true, minimumValue: 1 } },
                line_linked: {
                    enable: true,
                    distance: 140,
                    color: color,
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: false }
                },
                modes: {
                    grab: { distance: 120, line_linked: { opacity: 0.4 } }
                }
            },
            retina_detect: true
        });
    }

    function loadParticlesLib(callback) {
        if (window.particlesJS) {
            callback();
            return;
        }
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadParticlesLib(function () {
            initParticles();
        });
    });

    // On theme change, particles keep current color until next load (optional: re-init here)
    window.addEventListener('themeChange', function () {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            document.getElementById('particles-js').innerHTML = '';
            initParticles();
        }
    });
})();
