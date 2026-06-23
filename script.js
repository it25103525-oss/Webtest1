/**
 * ============================================
 * IRUSHA DINUJAYA - PORTFOLIO JAVASCRIPT
 * Network Engineering & Web Development
 * ============================================
 */

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// ============================================
// PARTICLE NETWORK BACKGROUND
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;
let isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

// Reduce particles on mobile for performance
const PARTICLE_COUNT = isTouchDevice ? 25 : 55;
const CONNECTION_DISTANCE = 140;
const MOUSE_DISTANCE = 180;

let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MOUSE_DISTANCE) {
                const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
                this.vx += (dx / distance) * force * 0.015;
                this.vy += (dy / distance) * force * 0.015;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.25;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

// Mouse events for particle interaction
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Initialize particles
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// MOBILE NAVIGATION
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

mobileOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// TYPING ANIMATION
// ============================================
const typingText = document.getElementById('typingText');
const phrases = [
    'Network Engineer',
    'Front-End Developer',
    'Problem Solver',
    'Technology Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500;
    }

    setTimeout(typeEffect, typingDelay);
}

// Start typing animation
typeEffect();

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// SKILL BAR ANIMATION
// ============================================
let skillBarsAnimated = false;

function animateSkillBars() {
    if (skillBarsAnimated) return;
    skillBarsAnimated = true;

    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 200);
    });
}

// Trigger skill bars when skills section is visible
const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
        }
    });
}, { threshold: 0.2 });

skillsObserver.observe(skillsSection);

// ============================================
// COUNTER ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

const statsSection = document.querySelector('.stats-grid');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
        }
    });
}, { threshold: 0.3 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');

    if (isLight) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// ============================================
// NETWORK TOOLS - SUBNET CALCULATOR
// ============================================
function calculateSubnet() {
    const ipInput = document.getElementById('subnetIp').value.trim();
    const cidr = parseInt(document.getElementById('subnetCidr').value);
    const results = document.getElementById('subnetResults');

    // Validate IP
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipInput.match(ipRegex);

    if (!match) {
        results.innerHTML = '<p class="invalid"><i class="fas fa-times-circle"></i> Invalid IP address format</p>';
        results.classList.add('active');
        return;
    }

    const octets = match.slice(1).map(Number);
    if (octets.some(o => o < 0 || o > 255)) {
        results.innerHTML = '<p class="invalid"><i class="fas fa-times-circle"></i> IP octets must be between 0-255</p>';
        results.classList.add('active');
        return;
    }

    // Calculate subnet
    const ipBinary = octets.map(o => o.toString(2).padStart(8, '0')).join('');
    const networkBits = cidr;
    const hostBits = 32 - cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2;

    // Subnet mask
    const maskBinary = '1'.repeat(networkBits) + '0'.repeat(hostBits);
    const maskOctets = [
        parseInt(maskBinary.slice(0, 8), 2),
        parseInt(maskBinary.slice(8, 16), 2),
        parseInt(maskBinary.slice(16, 24), 2),
        parseInt(maskBinary.slice(24, 32), 2)
    ];
    const subnetMask = maskOctets.join('.');

    // Network address
    const networkBinary = ipBinary.slice(0, networkBits) + '0'.repeat(hostBits);
    const networkOctets = [
        parseInt(networkBinary.slice(0, 8), 2),
        parseInt(networkBinary.slice(8, 16), 2),
        parseInt(networkBinary.slice(16, 24), 2),
        parseInt(networkBinary.slice(24, 32), 2)
    ];
    const networkAddress = networkOctets.join('.');

    // Broadcast address
    const broadcastBinary = ipBinary.slice(0, networkBits) + '1'.repeat(hostBits);
    const broadcastOctets = [
        parseInt(broadcastBinary.slice(0, 8), 2),
        parseInt(broadcastBinary.slice(8, 16), 2),
        parseInt(broadcastBinary.slice(16, 24), 2),
        parseInt(broadcastBinary.slice(24, 32), 2)
    ];
    const broadcastAddress = broadcastOctets.join('.');

    // First & last usable
    const firstUsable = [...networkOctets];
    const lastUsable = [...broadcastOctets];
    if (usableHosts > 0) {
        firstUsable[3] += 1;
        lastUsable[3] -= 1;
    }

    results.innerHTML = `
        <p><strong>IP Address:</strong> ${ipInput}/${cidr}</p>
        <p><strong>Subnet Mask:</strong> ${subnetMask}</p>
        <p><strong>Network Address:</strong> ${networkAddress}</p>
        <p><strong>Broadcast Address:</strong> ${broadcastAddress}</p>
        <p><strong>First Usable:</strong> ${usableHosts > 0 ? firstUsable.join('.') : 'N/A'}</p>
        <p><strong>Last Usable:</strong> ${usableHosts > 0 ? lastUsable.join('.') : 'N/A'}</p>
        <p><strong>Total Hosts:</strong> ${totalHosts.toLocaleString()}</p>
        <p><strong>Usable Hosts:</strong> ${usableHosts > 0 ? usableHosts.toLocaleString() : 'N/A'}</p>
    `;
    results.classList.add('active');
}

// ============================================
// NETWORK TOOLS - IP VALIDATOR
// ============================================
function validateIp() {
    const ipInput = document.getElementById('validateIp').value.trim();
    const results = document.getElementById('validateResults');

    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipInput.match(ipRegex);

    if (!match) {
        results.innerHTML = `
            <p class="invalid"><i class="fas fa-times-circle"></i> <strong>Invalid IP Address</strong></p>
            <p>Format must be: xxx.xxx.xxx.xxx (e.g., 192.168.1.1)</p>
        `;
        results.classList.add('active');
        return;
    }

    const octets = match.slice(1).map(Number);
    const validOctets = octets.every(o => o >= 0 && o <= 255);

    if (!validOctets) {
        results.innerHTML = `
            <p class="invalid"><i class="fas fa-times-circle"></i> <strong>Invalid IP Address</strong></p>
            <p>Each octet must be between 0 and 255</p>
        `;
        results.classList.add('active');
        return;
    }

    // Determine IP class
    const firstOctet = octets[0];
    let ipClass = '';
    let ipType = '';

    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Experimental)';

    // Check for private IP
    if (
        (firstOctet === 10) ||
        (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (firstOctet === 192 && octets[1] === 168)
    ) {
        ipType = 'Private (RFC 1918)';
    } else if (firstOctet === 127) {
        ipType = 'Loopback';
    } else if (firstOctet === 0 || firstOctet === 255) {
        ipType = 'Reserved';
    } else {
        ipType = 'Public';
    }

    // Binary representation
    const binary = octets.map(o => o.toString(2).padStart(8, '0')).join('.');

    results.innerHTML = `
        <p class="valid"><i class="fas fa-check-circle"></i> <strong>Valid IPv4 Address</strong></p>
        <p><strong>IP Address:</strong> ${ipInput}</p>
        <p><strong>Class:</strong> ${ipClass}</p>
        <p><strong>Type:</strong> ${ipType}</p>
        <p><strong>Binary:</strong> ${binary}</p>
    `;
    results.classList.add('active');
}

// ============================================
// NETWORK TOOLS - BINARY CONVERTER
// ============================================
function convertToBinary() {
    const input = document.getElementById('binaryInput').value.trim();
    const results = document.getElementById('binaryResults');

    if (input === '' || isNaN(input)) {
        results.innerHTML = '<p class="invalid"><i class="fas fa-times-circle"></i> Please enter a valid number</p>';
        results.classList.add('active');
        return;
    }

    const num = parseInt(input);
    if (num < 0 || num > 255) {
        results.innerHTML = '<p class="invalid"><i class="fas fa-times-circle"></i> Please enter a number between 0 and 255</p>';
        results.classList.add('active');
        return;
    }

    const binary = num.toString(2).padStart(8, '0');
    const hex = num.toString(16).toUpperCase().padStart(2, '0');

    results.innerHTML = `
        <p class="valid"><i class="fas fa-check-circle"></i> <strong>Conversion Result</strong></p>
        <p><strong>Decimal:</strong> ${num}</p>
        <p><strong>Binary:</strong> ${binary}</p>
        <p><strong>Hexadecimal:</strong> 0x${hex}</p>
        <p><strong>Octal:</strong> ${num.toString(8)}</p>
    `;
    results.classList.add('active');
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        document.getElementById('contactForm').reset();
    }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// KEYBOARD NAVIGATION SUPPORT
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// PERFORMANCE: PAUSE ANIMATIONS WHEN TAB HIDDEN
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateParticles();
    }
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c Welcome to Irusha Dinujaya\'s Portfolio ', 'background: linear-gradient(135deg, #00d4ff, #38bdf8); color: #fff; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 10px; font-family: monospace;');
console.log('%c Network Engineering Undergraduate | Web Developer ', 'color: #00d4ff; font-size: 12px; font-family: monospace;');
console.log('%c Feel free to explore the code and connect! ', 'color: #94a3b8; font-size: 11px; font-family: monospace;');
