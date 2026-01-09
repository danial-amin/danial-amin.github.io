class Portfolio {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.animatedElements = [];
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupFormHandling();
        this.setupIntersectionObserver();
        this.addScrollEffects();
    }
    
    setupMobileMenu() {
        this.hamburger?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu?.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setupSmoothScrolling() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                this.closeMobileMenu();
            });
        });
    }
    
    setupScrollAnimations() {
        // Add scroll-based animations
        const animateOnScrollElements = document.querySelectorAll(
            '.project-card, .expertise-item, .floating-card, .contact-item'
        );
        
        animateOnScrollElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Add stagger animation for grid items
                    if (entry.target.parentElement.classList.contains('projects-grid') ||
                        entry.target.parentElement.classList.contains('expertise-grid')) {
                        this.staggerAnimation(entry.target.parentElement.children);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Observe sections for navigation highlighting
        this.setupNavigationHighlighting();
    }
    
    staggerAnimation(elements) {
        Array.from(elements).forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 100);
        });
    }
    
    setupNavigationHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current nav link
                    const currentNavLink = document.querySelector(`.nav-link[href="#${currentId}"]`) ||
                                         document.querySelector(`.nav-link[href="index.html"]`);
                    if (currentNavLink) {
                        currentNavLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupFormHandling() {
        // Initialize EmailJS
        // To set up EmailJS:
        // 1. Sign up at https://www.emailjs.com/
        // 2. Create an email service (Gmail, Outlook, etc.)
        // 3. Create an email template
        // 4. Get your Public Key, Service ID, and Template ID
        // 5. Replace the placeholders below with your actual values
        if (typeof emailjs !== 'undefined') {
            emailjs.init('DIh2VNKuBFAmL3ZDB'); // Replace with your EmailJS public key from dashboard
        }
        
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
        
        // Setup tab switching
        this.setupContactTabs();
    }
    
    setupContactTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    handleFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageDiv = document.getElementById('form-message');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <div class="loading-spinner">⟳</div>
        `;
        submitBtn.disabled = true;
        if (messageDiv) {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }
        
        // Get form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };
        
        // Try to send via EmailJS if available
        if (typeof emailjs !== 'undefined') {
            // Replace these with your EmailJS service ID and template ID from your dashboard
            const serviceId = 'service_p29x5hq'; // e.g., 'service_xxxxx'
            const templateId = 'template_htom6ke'; // e.g., 'template_xxxxx'
            
            emailjs.send(serviceId, templateId, {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_email: 'writetodanialamin@gmail.com'
            })
            .then(() => {
                this.showFormSuccess(submitBtn, form, originalText, messageDiv);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                // Fallback to mailto if EmailJS fails
                this.fallbackToMailto(formData, submitBtn, originalText, messageDiv);
            });
        } else {
            // Fallback to mailto if EmailJS is not configured
            this.fallbackToMailto(formData, submitBtn, originalText, messageDiv);
        }
    }
    
    showFormSuccess(submitBtn, form, originalText, messageDiv) {
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <span>✓</span>
        `;
        submitBtn.classList.add('success');
        
        if (messageDiv) {
            messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
            messageDiv.className = 'form-message success';
        }
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
            if (messageDiv) {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }
        }, 5000);
    }
    
    fallbackToMailto(formData, submitBtn, originalText, messageDiv) {
        // Create mailto link as fallback
        const subject = encodeURIComponent(formData.subject);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        const mailtoLink = `mailto:writetodanialamin@gmail.com?subject=${subject}&body=${body}`;
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Show info message
        if (messageDiv) {
            messageDiv.textContent = 'Opening your email client... If it doesn\'t open, please email writetodanialamin@gmail.com directly.';
            messageDiv.className = 'form-message info';
        }
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            if (messageDiv) {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }
        }, 3000);
    }
    
    addScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for floating cards
            const floatingCards = document.querySelectorAll('.floating-card');
            floatingCards.forEach((card, index) => {
                const speed = 0.5 + (index * 0.2);
                card.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
            });
            
            // Navbar background opacity
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const opacity = Math.min(scrolled / 100, 1);
                navbar.style.backgroundColor = navbar.style.backgroundColor.replace(/[\d.]+\)$/g, `${opacity * 0.9})`);
            }
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    // Utility methods
    addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Performance optimization
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize portfolio functionality
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect (simplified version)
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.project-card, .floating-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            const portfolio = new Portfolio();
            portfolio.closeMobileMenu();
        }
    });
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}