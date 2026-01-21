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
        
        if (!tabButtons.length || !tabContents.length) {
            console.warn('Contact tabs not found');
            return;
        }
        
        // Set up Calendly button handler ONCE, not every time tab is clicked
        this.setupCalendlyButton();
        
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
    
    setupCalendlyButton() {
        // Use global setup function to ensure it only runs once
        if (window.setupCalendlyButtonGlobal) {
            return; // Already set up globally
        }
        
        window.setupCalendlyButtonGlobal = true;
        
                        // Wait for Calendly script to load if needed
                        const initCalendly = () => {
            try {
                if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
                    // Set up the popup button handler - only once globally
                    const popupButton = document.getElementById('calendly-popup-button');
                    if (popupButton && !popupButton.dataset.calendlyListenerAdded) {
                        popupButton.dataset.calendlyListenerAdded = 'true';
                        
                        // Remove ALL existing click listeners by cloning the button
                        const newButton = popupButton.cloneNode(true);
                        popupButton.parentNode.replaceChild(newButton, popupButton);
                        
                        // Add single listener to the new button
                        newButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Prevent multiple simultaneous clicks
                            if (window.calendlyPopupInitializing) {
                                console.log('Popup already initializing, ignoring click');
                                return;
                            }
                            
                            // Check if a popup already exists - if so, don't create another
                            const existingPopup = document.querySelector('.calendly-overlay, [data-calendly-popup], .calendly-popup');
                            if (existingPopup) {
                                console.log('Calendly popup already exists, not creating another');
                                return;
                            }
                            
                            window.calendlyPopupInitializing = true;
                            
                            // Close any existing Calendly popups first (aggressive cleanup)
                            const removedCount = this.closeExistingCalendlyPopups();
                            console.log(`Removed ${removedCount} existing Calendly popups`);
                            
                            // Wait a moment to ensure cleanup is complete
                            setTimeout(() => {
                                try {
                                    // Double-check no popup exists after cleanup
                                    const stillExists = document.querySelector('.calendly-overlay, [data-calendly-popup], .calendly-popup');
                                    if (stillExists) {
                                        console.log('Popup still exists after cleanup, aborting');
                                        window.calendlyPopupInitializing = false;
                                        return;
                                    }
                                    
                                    console.log('Initializing Calendly popup widget...');
                                    
                                    // Set up observer to remove unwanted Calendly divs and add close functionality
                                    if (!window.calendlyCleanupObserver) {
                                        window.calendlyCleanupObserver = new MutationObserver((mutations) => {
                                            mutations.forEach((mutation) => {
                                                mutation.addedNodes.forEach((node) => {
                                                    if (node.nodeType === 1) { // Element node
                                                        // Remove calendly-close-overlay and calendly-popup-close
                                                        if (node.classList && (
                                                            node.classList.contains('calendly-close-overlay') ||
                                                            node.classList.contains('calendly-popup-close')
                                                        )) {
                                                            console.log('Removing unwanted Calendly element:', node.className);
                                                            node.remove();
                                                        }
                                                        
                                                        // Also check children in case they're nested
                                                        if (node.querySelector) {
                                                            const closeOverlay = node.querySelector('.calendly-close-overlay');
                                                            const popupClose = node.querySelector('.calendly-popup-close');
                                                            if (closeOverlay) {
                                                                console.log('Removing nested calendly-close-overlay');
                                                                closeOverlay.remove();
                                                            }
                                                            if (popupClose && !popupClose.closest('.calendly-popup')) {
                                                                console.log('Removing nested calendly-popup-close');
                                                                popupClose.remove();
                                                            }
                                                        }
                                                        
                                                        // When calendly-popup is created, add close functionality
                                                        if (node.classList && node.classList.contains('calendly-popup')) {
                                                            setTimeout(() => {
                                                                addCloseButtonToPopup(node);
                                                                addClickOutsideToClose(node);
                                                            }, 100);
                                                        }
                                                        
                                                        // Also check if node contains calendly-popup
                                                        const popup = node.querySelector && node.querySelector('.calendly-popup');
                                                        if (popup && !popup.dataset.closeButtonAdded) {
                                                            setTimeout(() => {
                                                                addCloseButtonToPopup(popup);
                                                                addClickOutsideToClose(popup);
                                                            }, 100);
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                        
                                        window.calendlyCleanupObserver.observe(document.body, {
                                            childList: true,
                                            subtree: true
                                        });
                                        
                                        // Stop after 10 seconds
                                        setTimeout(() => {
                                            if (window.calendlyCleanupObserver) {
                                                window.calendlyCleanupObserver.disconnect();
                                                window.calendlyCleanupObserver = null;
                                            }
                                        }, 10000);
                                    }
                                    
                                    // Function to add close button to popup
                                    function addCloseButtonToPopup(popup) {
                                        if (popup.dataset.closeButtonAdded) return;
                                        popup.dataset.closeButtonAdded = 'true';
                                        
                                        // Create close button
                                        const closeButton = document.createElement('button');
                                        closeButton.className = 'calendly-custom-close';
                                        closeButton.innerHTML = '×';
                                        closeButton.setAttribute('aria-label', 'Close');
                                        closeButton.style.cssText = `
                                            position: absolute;
                                            top: 10px;
                                            right: 10px;
                                            width: 32px;
                                            height: 32px;
                                            border: none;
                                            background: rgba(0, 0, 0, 0.5);
                                            color: white;
                                            font-size: 24px;
                                            line-height: 1;
                                            cursor: pointer;
                                            border-radius: 50%;
                                            z-index: 1000002;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            transition: background 0.2s;
                                        `;
                                        
                                        closeButton.addEventListener('mouseenter', () => {
                                            closeButton.style.background = 'rgba(0, 0, 0, 0.8)';
                                        });
                                        
                                        closeButton.addEventListener('mouseleave', () => {
                                            closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
                                        });
                                        
                                        closeButton.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            closeCalendlyPopup();
                                        });
                                        
                                        // Find the popup content container to add button to
                                        const popupContent = popup.querySelector('div:first-child') || popup;
                                        if (popupContent) {
                                            popupContent.style.position = 'relative';
                                            popupContent.appendChild(closeButton);
                                        }
                                    }
                                    
                                    // Function to add click-outside-to-close
                                    function addClickOutsideToClose(popup) {
                                        if (popup.dataset.clickOutsideAdded) return;
                                        popup.dataset.clickOutsideAdded = 'true';
                                        
                                        // Find the overlay (parent of popup)
                                        const overlay = popup.closest('.calendly-overlay') || popup.parentElement;
                                        if (overlay) {
                                            overlay.addEventListener('click', (e) => {
                                                // Only close if clicking on the overlay itself, not the popup content
                                                if (e.target === overlay || e.target.classList.contains('calendly-overlay')) {
                                                    closeCalendlyPopup();
                                                }
                                            });
                                        }
                                    }
                                    
                                    // Function to close Calendly popup
                                    function closeCalendlyPopup() {
                                        console.log('Closing Calendly popup...');
                                        
                                        // First try Calendly's close method if available
                                        if (typeof Calendly !== 'undefined') {
                                            if (Calendly.closePopupWidget) {
                                                try {
                                                    Calendly.closePopupWidget();
                                                    console.log('Called Calendly.closePopupWidget()');
                                                } catch (e) {
                                                    console.log('Calendly.closePopupWidget() error:', e);
                                                }
                                            }
                                            
                                            // Also try to destroy/close any internal state
                                            if (Calendly.destroyBadgeWidget) {
                                                try {
                                                    Calendly.destroyBadgeWidget();
                                                } catch (e) {
                                                    // Ignore
                                                }
                                            }
                                        }
                                        
                                        // Remove all Calendly-related elements
                                        const selectors = [
                                            '.calendly-popup',
                                            '.calendly-overlay',
                                            '[data-calendly-popup]',
                                            '.calendly-close-overlay',
                                            '.calendly-popup-close'
                                        ];
                                        
                                        let removedCount = 0;
                                        selectors.forEach(selector => {
                                            document.querySelectorAll(selector).forEach(el => {
                                                if (!el.closest('.calendly-container') && !el.closest('.calendly-button-content')) {
                                                    el.remove();
                                                    removedCount++;
                                                }
                                            });
                                        });
                                        
                                        // Also check body children for any Calendly elements
                                        Array.from(document.body.children).forEach(child => {
                                            if (child.classList && (
                                                child.classList.contains('calendly-popup') ||
                                                child.classList.contains('calendly-overlay') ||
                                                (child.id && child.id.toLowerCase().includes('calendly'))
                                            )) {
                                                child.remove();
                                                removedCount++;
                                            }
                                        });
                                        
                                        console.log(`Removed ${removedCount} Calendly elements`);
                                        
                                        // Reset ALL flags and counters immediately
                                        window.calendlyInitCallCount = 0;
                                        window.calendlyInitInProgress = false;
                                        
                                        // Also clear any Calendly internal state if possible
                                        if (window.Calendly && window.Calendly._popupWidget) {
                                            try {
                                                delete window.Calendly._popupWidget;
                                            } catch (e) {
                                                // Ignore
                                            }
                                        }
                                        
                                        console.log('Popup closed - all counters and state reset, ready for next open');
                                    }
                                    
                                    // Make close function globally available
                                    window.closeCalendlyPopup = closeCalendlyPopup;
                                    
                                    // Add ESC key support to close popup
                                    document.addEventListener('keydown', (e) => {
                                        if (e.key === 'Escape') {
                                            const popup = document.querySelector('.calendly-popup');
                                            if (popup) {
                                                closeCalendlyPopup();
                                            }
                                        }
                                    });
                                    
                                    // Replace Calendly.initPopupWidget DIRECTLY to prevent ANY multiple calls
                                    if (!window.calendlyOriginalInit) {
                                        // Store the original function
                                        window.calendlyOriginalInit = Calendly.initPopupWidget;
                                        window.calendlyInitCallCount = 0;
                                        
                                        // Replace it immediately - this will catch ALL calls, even from Calendly's internal code
                                        Calendly.initPopupWidget = function(options) {
                                            console.log('[initPopupWidget] Called, checking state...');
                                            
                                            // Check if popup already exists - if so, close it first
                                            const existing = document.querySelector('.calendly-popup, .calendly-overlay');
                                            if (existing) {
                                                console.log(`[CLEANUP] - removing existing popup before opening new one`);
                                                closeCalendlyPopup();
                                                // Wait a moment for cleanup
                                                setTimeout(() => {
                                                    if (window.calendlyInitInProgress) {
                                                        console.log('[BLOCKED] - still initializing after cleanup');
                                                        return;
                                                    }
                                                    window.calendlyInitInProgress = true;
                                                    console.log(`[ALLOWED] - initializing popup after cleanup`);
                                                    try {
                                                        window.calendlyOriginalInit.call(Calendly, options);
                                                        setTimeout(() => {
                                                            window.calendlyInitInProgress = false;
                                                        }, 1500);
                                                    } catch (e) {
                                                        console.error('Error calling original init:', e);
                                                        window.calendlyInitInProgress = false;
                                                    }
                                                }, 200);
                                                return;
                                            }
                                            
                                            // Check if already initializing
                                            if (window.calendlyInitInProgress) {
                                                console.log(`[BLOCKED] - already initializing`);
                                                return;
                                            }
                                            
                                            window.calendlyInitInProgress = true;
                                            console.log(`[ALLOWED] - initializing popup`);
                                            
                                            try {
                                                // Call the original function
                                                const result = window.calendlyOriginalInit.call(Calendly, options);
                                                
                                                // Reset flag after popup creation (longer delay to ensure popup is created)
                                                setTimeout(() => {
                                                    window.calendlyInitInProgress = false;
                                                    console.log('[initPopupWidget] Reset flag - ready for next call');
                                                }, 2000);
                                                
                                                return result;
                                            } catch (e) {
                                                console.error('Error in initPopupWidget:', e);
                                                window.calendlyInitInProgress = false;
                                                throw e;
                                            }
                                        };
                                    }
                                    
                                    // Initialize Calendly popup widget - this will go through our interceptor
                                    Calendly.initPopupWidget({
                                        url: 'https://calendly.com/writetodanialamin'
                                    });
                                    
                                    // Ensure popup overlay has proper positioning after initialization
                                    // Calendly creates the overlay dynamically, so we need to wait for it
                                    const fixPopupPosition = () => {
                                        // Find Calendly popup elements that are direct children of body
                                        const bodyChildren = Array.from(document.body.children);
                                                    
                                                    bodyChildren.forEach(element => {
                                                        // Check if this is a Calendly popup element
                                                        const isCalendlyPopup = 
                                                            element.classList.contains('calendly-overlay') ||
                                                            element.classList.contains('calendly-popup') ||
                                                            element.classList.contains('calendly-badge-widget') ||
                                                            element.hasAttribute('data-calendly-popup') ||
                                                            (element.id && element.id.includes('calendly')) ||
                                                            (element.className && element.className.includes('calendly') && 
                                                             !element.closest('.calendly-container') && 
                                                             !element.closest('.calendly-button-content'));
                                                        
                                                        if (isCalendlyPopup) {
                                                            // This is the overlay - fix its positioning
                                                            element.style.cssText = `
                                                                position: fixed !important;
                                                                top: 0 !important;
                                                                left: 0 !important;
                                                                right: 0 !important;
                                                                bottom: 0 !important;
                                                                z-index: 999999 !important;
                                                                display: flex !important;
                                                                align-items: center !important;
                                                                justify-content: center !important;
                                                                background: rgba(0, 0, 0, 0.6) !important;
                                                                margin: 0 !important;
                                                                padding: 0 !important;
                                                            `;
                                                            
                                                            // Fix the popup content container (first direct child div)
                                                            const contentDiv = element.querySelector(':scope > div');
                                                            if (contentDiv) {
                                                                contentDiv.style.cssText = `
                                                                    position: relative !important;
                                                                    z-index: 1000000 !important;
                                                                    max-width: 90vw !important;
                                                                    max-height: 90vh !important;
                                                                    width: 100% !important;
                                                                    min-height: 600px !important;
                                                                    background: white !important;
                                                                    border-radius: 12px !important;
                                                                    overflow: hidden !important;
                                                                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
                                                                    margin: 20px !important;
                                                                `;
                                                            }
                                                            
                                                            // Fix iframe inside
                                                            const iframe = element.querySelector('iframe');
                                                            if (iframe) {
                                                                iframe.style.cssText = `
                                                                    position: relative !important;
                                                                    z-index: 1000001 !important;
                                                                    width: 100% !important;
                                                                    height: 100% !important;
                                                                    min-height: 600px !important;
                                                                    border: none !important;
                                                                    display: block !important;
                                                                `;
                                                            }
                                                        }
                                                    });
                                                    
                                                    // Also hide any inline widgets that appear in wrong places
                                                    document.querySelectorAll('.calendly-inline-widget').forEach(widget => {
                                                        if (!widget.closest('.calendly-container')) {
                                                            widget.style.display = 'none';
                                                        }
                                                    });
                                                };
                                                
                                    // Try to fix position immediately and after delays
                                    fixPopupPosition();
                                    setTimeout(fixPopupPosition, 100);
                                    setTimeout(fixPopupPosition, 300);
                                    setTimeout(fixPopupPosition, 500);
                                    setTimeout(fixPopupPosition, 1000);
                                    
                                    // Use MutationObserver to catch when Calendly adds the overlay
                                    const observer = new MutationObserver((mutations) => {
                                    let shouldFix = false;
                                    mutations.forEach((mutation) => {
                                        mutation.addedNodes.forEach((node) => {
                                            if (node.nodeType === 1) { // Element node
                                                const isCalendly = 
                                                    node.classList?.contains('calendly-overlay') ||
                                                    node.classList?.contains('calendly-popup') ||
                                                    node.classList?.contains('calendly-badge-widget') ||
                                                    node.hasAttribute?.('data-calendly-popup') ||
                                                    (node.id && node.id.includes('calendly')) ||
                                                    (node.className && typeof node.className === 'string' && 
                                                     node.className.includes('calendly') && 
                                                     !node.closest?.('.calendly-container') && 
                                                     !node.closest?.('.calendly-button-content'));
                                                
                                                if (isCalendly) {
                                                    shouldFix = true;
                                                }
                                            }
                                        });
                                    });
                                    
                                    if (shouldFix) {
                                        fixPopupPosition();
                                        // Also fix after a short delay to ensure styles are applied
                                        setTimeout(fixPopupPosition, 50);
                                        setTimeout(fixPopupPosition, 200);
                                    }
                                });
                                
                                    observer.observe(document.body, {
                                        childList: true,
                                        subtree: false // Only watch direct children of body for performance
                                    });
                                    
                                    // Stop observing after 10 seconds (popup should be loaded by then)
                                    setTimeout(() => observer.disconnect(), 10000);
                                    
                                    // Reset flag after a delay
                                    setTimeout(() => {
                                        window.calendlyPopupInitializing = false;
                                    }, 2000);
                                    
                                } catch (error) {
                                    // Suppress errors from browser extensions
                                    // These errors are harmless and don't affect Calendly functionality
                                    console.warn('Note: Browser extension conflicts may appear in console but won\'t affect scheduling.');
                                    window.calendlyPopupInitializing = false;
                                }
                            }, 100);
                        });
                                }
                            } else {
                                // Retry after a short delay if Calendly hasn't loaded yet
                                setTimeout(initCalendly, 200);
                }
            } catch (error) {
                // Suppress errors from browser extensions interfering with Calendly
                // These are harmless and don't affect functionality
                console.warn('Calendly initialization note: Some browser extension errors may appear in console but won\'t affect scheduling functionality.');
                            }
                        };
                        initCalendly();
    }
    
    closeExistingCalendlyPopups() {
        // Find and remove any existing Calendly popup overlays
        const selectors = [
            '.calendly-overlay',
            '[data-calendly-popup]',
            '.calendly-popup',
            '.calendly-badge-widget',
            'div[id*="calendly"]',
            'div[class*="calendly-overlay"]'
        ];
        
        let removedCount = 0;
        
        selectors.forEach(selector => {
            try {
                const existingPopups = document.querySelectorAll(selector);
                existingPopups.forEach(popup => {
                    // Skip if it's part of our button container
                    if (popup.closest && (popup.closest('.calendly-container') || popup.closest('.calendly-button-content'))) {
                        return;
                    }
                    
                    // Try to close it properly if Calendly has a close method
                    const closeButton = popup.querySelector ? popup.querySelector('.calendly-popup-close') : null;
                    if (closeButton) {
                        try {
                            closeButton.click();
                        } catch (e) {
                            // Ignore click errors
                        }
                    }
                    
                    // Remove it from DOM
                    if (popup.parentNode) {
                        popup.remove();
                        removedCount++;
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        // Also check for any divs with calendly in id or class that are direct children of body
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {
            if (child && child.nodeType === 1) { // Element node
                const hasCalendlyClass = child.classList && (
                    child.classList.contains('calendly-overlay') ||
                    child.classList.contains('calendly-popup') ||
                    child.classList.contains('calendly-badge-widget')
                );
                
                const hasCalendlyId = child.id && child.id.toLowerCase().includes('calendly');
                
                const hasCalendlyInClassName = child.className && typeof child.className === 'string' && 
                    child.className.toLowerCase().includes('calendly') && 
                    !child.closest('.calendly-container') && 
                    !child.closest('.calendly-button-content');
                
                if (hasCalendlyClass || hasCalendlyId || hasCalendlyInClassName) {
                    try {
                        child.remove();
                        removedCount++;
                    } catch (e) {
                        // Ignore removal errors
                    }
                    }
                }
            });
        
        // Also remove any iframes that might be orphaned Calendly popups
        document.querySelectorAll('iframe[src*="calendly.com"]').forEach(iframe => {
            const parent = iframe.parentElement;
            if (parent && !parent.closest('.calendly-container') && !parent.closest('.calendly-button-content')) {
                // Check if this iframe is part of a popup overlay
                if (parent.classList && (
                    parent.classList.contains('calendly-overlay') ||
                    parent.classList.contains('calendly-popup') ||
                    parent.id && parent.id.includes('calendly')
                )) {
                    try {
                        parent.remove();
                        removedCount++;
                    } catch (e) {
                        // Ignore
                    }
                }
            }
        });
        
        return removedCount;
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

// Suppress harmless browser extension errors and Calendly warnings in main page context
// Note: Errors from Calendly iframe cannot be suppressed from main page
// Browser extensions (Zotero, SingleFile, etc.) inject scripts into iframes
// causing duplicate declaration errors that don't affect functionality
if (typeof window !== 'undefined') {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Only suppress errors in main page context (not iframe)
    if (window.self === window.top) {
        console.error = function(...args) {
            const errorMessage = args.join(' ');
            // Filter out known browser extension errors and Calendly warnings that don't affect functionality
            const extensionErrorPatterns = [
                /Identifier '.*' has already been declared/,
                /Cannot read properties of undefined.*reading '.*'/,
                /Blocked script execution in 'about:blank'/,
                /violates the following Content Security policy/,
                /Compiling or instantiating a WebAssembly module/,
                /Content Security policy directive/
            ];
            
            const isExtensionError = extensionErrorPatterns.some(pattern => pattern.test(errorMessage));
            
            if (!isExtensionError) {
                originalError.apply(console, args);
            }
            // Silently ignore extension errors in main context
        };
        
        // Also suppress Calendly/Datadog warnings
        console.warn = function(...args) {
            const warningMessage = args.join(' ');
            // Filter out known harmless warnings
            const warningPatterns = [
                /Datadog Browser SDK/,
                /No storage available for session/,
                /Blocked script execution in 'about:blank'/,
                /Content Security policy.*report-only/
            ];
            
            const isHarmlessWarning = warningPatterns.some(pattern => pattern.test(warningMessage));
            
            if (!isHarmlessWarning) {
                originalWarn.apply(console, args);
            }
            // Silently ignore harmless warnings
        };
    }
}

// Initialize portfolio functionality - only once
if (!window.portfolioInitialized) {
    window.portfolioInitialized = true;
document.addEventListener('DOMContentLoaded', () => {
    try {
            window.portfolioInstance = new Portfolio();
    } catch (error) {
        console.error('Error initializing Portfolio:', error);
        // Ensure page still functions even if Portfolio fails
    }
    
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
                if (window.portfolioInstance) {
                    window.portfolioInstance.closeMobileMenu();
                }
        }
    });
});
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}