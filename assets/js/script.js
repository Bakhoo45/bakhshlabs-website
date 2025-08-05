document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const isLocalStorageAvailable = (() => {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    })();
    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>'"&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        });
    }
    
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !themeIcon) {
        console.warn('Theme toggle elements not found');
        return;
    }
    
    function getStoredTheme() {
        if (!isLocalStorageAvailable) return null;
        try {
            const theme = localStorage.getItem('theme');
            return (theme === 'dark' || theme === 'light') ? theme : null;
        } catch(e) {
            console.warn('Failed to access localStorage:', e);
            return null;
        }
    }
    
    function setStoredTheme(theme) {
        if (!isLocalStorageAvailable) return false;
        try {
            if (theme === 'dark' || theme === 'light') {
                localStorage.setItem('theme', theme);
                return true;
            }
        } catch(e) {
            console.warn('Failed to set theme in localStorage:', e);
        }
        return false;
    }
    
    const savedTheme = getStoredTheme();
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        setStoredTheme(newTheme);
        updateThemeIcon(newTheme);
        
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        const isActive = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive);
        navMenu.setAttribute('aria-hidden', !isActive);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const allSections = document.querySelectorAll('section');
                allSections.forEach(section => {
                    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                });
                
                allSections.forEach(section => {
                    if (section.id !== targetId.substring(1)) {
                        section.style.opacity = '0.3';
                        section.style.transform = 'scale(0.98)';
                    }
                });
                
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    allSections.forEach(section => {
                        section.style.opacity = '1';
                        section.style.transform = 'scale(1)';
                    });
                    
                    setTimeout(() => {
                        allSections.forEach(section => {
                            section.style.transition = '';
                        });
                    }, 600);
                }, 800);
            }
        });
    });
    
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPos = window.scrollY + 120;
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .project-card, .tech-item, .stat').forEach(el => {
        observer.observe(el);
    });
    
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    const heroName = document.querySelector('.hero-title .name');
    const heroBrand = document.querySelector('.hero-title .brand');
    
    if (heroName && heroBrand) {
        setTimeout(() => {
            typeWriter(heroName, 'Muhammed Bakhsh', 80);
            setTimeout(() => {
                typeWriter(heroBrand, 'Bakhsh Labs', 100);
            }, 1500);
        }, 500);
    }
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && scrolled < window.innerHeight) {
            const speed = scrolled * 0.5;
            heroContent.style.transform = `translateY(${speed}px)`;
        }
    });
    
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const symbol = counter.textContent.replace(/[\d]/g, '');
            let count = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.floor(count) + symbol;
                } else {
                    counter.textContent = target + symbol;
                    clearInterval(timer);
                }
            }, 50);
        });
    }
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.complete && img.naturalHeight !== 0) {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                } else {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    setTimeout(() => {
                        if (img.style.opacity === '0') {
                            img.style.opacity = '1';
                        }
                    }, 500);
                }
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    const debouncedScrollHandler = debounce(highlightNavLink, 100);
    window.removeEventListener('scroll', highlightNavLink);
    window.addEventListener('scroll', debouncedScrollHandler);
    
    function initializeContactForm() {
        const form = document.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Contact form submitted');
            });
        }
    }
    
    initializeContactForm();
    
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        document.body.classList.add('loaded');
    });
    
    const failedImages = new Set();
    const MAX_RETRIES = 2;
    
    const securityMonitor = {
        suspiciousActivity: 0,
        maxSuspiciousActions: 10,
        
        logSuspiciousActivity: function(action, details) {
            this.suspiciousActivity++;
            console.warn(`Security Alert: ${action}`, details);
            
            if (this.suspiciousActivity > this.maxSuspiciousActions) {
                console.error('Multiple security alerts detected. Consider reviewing activity.');
            }
        }
    };
    
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const src = this.src;
            
            if (!failedImages.has(src)) {
                failedImages.add(src);
                console.warn(`Failed to load image: ${sanitizeInput(src)}`);
                
                if (src.includes('<script>') || src.includes('javascript:')) {
                    securityMonitor.logSuspiciousActivity('Malicious image src detected', src);
                }
            }
            
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            
            this.classList.add('image-error');
            
            this.alt = 'Image unavailable';
        });
        
        if (img.src && !img.src.startsWith(window.location.origin) && !img.src.startsWith('data:')) {
            console.warn(`External image detected: ${sanitizeInput(img.src)}`);
        }
        
        img.addEventListener('load', function() {
            if (this.naturalWidth === 0 || this.naturalHeight === 0) {
                securityMonitor.logSuspiciousActivity('Suspicious image dimensions', this.src);
            }
        });
    });
    
    document.addEventListener('securitypolicyviolation', function(e) {
        securityMonitor.logSuspiciousActivity('CSP Violation', {
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            originalPolicy: e.originalPolicy
        });
    });
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }, 250);
    });
});
