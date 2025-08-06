document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
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
    
    const floatingNavbar = document.querySelector('.floating-navbar');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!floatingNavbar) {
        console.warn('Floating navbar not found');
        return;
    }
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    document.addEventListener('click', function(e) {
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
    
    const sections = document.querySelectorAll('section[id]');
    const floatingNav = document.querySelector('.floating-navbar');
    let isScrolling = false;
    
    function setInitialNavbarBackground() {
        if (floatingNav) {
            console.log('Floating navbar initialized');
        }
    }
    
    
    setInitialNavbarBackground();
    
    function handleScroll() {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (floatingNav) {
                    if (scrollTop > 100) {
                        floatingNav.classList.add('scrolled');
                    } else {
                        floatingNav.classList.remove('scrolled');
                    }
                }
                
                const hero = document.querySelector('.hero');
                const heroContent = document.querySelector('.hero-content');
                
                if (hero && heroContent && scrollTop < window.innerHeight) {
                    const speed = scrollTop * 0.5;
                    heroContent.style.transform = `translate3d(0, ${speed}px, 0)`;
                }
                
                updateActiveNavLink();
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    }
    
    function updateActiveNavLink() {
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
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${activeSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        setInitialNavbarBackground();
        handleScroll();
    });
    
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .project-card, .tech-item, .stat').forEach(el => {
        fadeInObserver.observe(el);
    });
    
    function typeWriter(element, text, speed = 80) {
        if (!element || !text) return;
        
        let i = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    const heroName = document.querySelector('.hero-title .name');
    const heroBrand = document.querySelector('.hero-title .brand');
    
    if (heroName && heroBrand) {
        requestAnimationFrame(() => {
            setTimeout(() => {
                typeWriter(heroName, 'Muhammed Bakhsh', 80);
                setTimeout(() => {
                    typeWriter(heroBrand, 'Bakhsh Labs', 100);
                }, 1500);
            }, 300);
        });
    }
    
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const symbol = counter.textContent.replace(/[\d]/g, '');
            let count = 0;
            const increment = target / 30;
            
            const timer = setInterval(() => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.floor(count) + symbol;
                } else {
                    counter.textContent = target + symbol;
                    clearInterval(timer);
                }
            }, 40);
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
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.style.transition = 'opacity 0.3s ease';
                    
                    if (img.complete && img.naturalHeight !== 0) {
                        img.style.opacity = '1';
                    } else {
                        img.style.opacity = '0';
                        
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        }, { once: true });
                        
                        setTimeout(() => {
                            if (img.style.opacity === '0') {
                                img.style.opacity = '1';
                            }
                        }, 300);
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.blur();
            });
        }
    });
    
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
            console.log('Window resized - floating navbar adjusted');
        }, 250);
    });
    
    updateActiveNavLink();
});
