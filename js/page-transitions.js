/**
 * Enhanced Professional Animation System
 * Provides smooth, sophisticated animations throughout the website
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Create animation elements
    setupAnimationElements();
    
    // Initialize animations
    initializeAnimations();
    
    // Setup enhanced page transitions
    setupEnhancedPageTransitions();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup interaction animations
    setupInteractionAnimations();
});

/**
 * Create and append animation elements to the DOM
 */
function setupAnimationElements() {
    // Create page transition container and overlay
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition-container';
    
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    
    transitionContainer.appendChild(transitionOverlay);
    document.body.appendChild(transitionContainer);
    
    // Create scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // Create transition progress indicator
    const transitionProgress = document.createElement('div');
    transitionProgress.className = 'transition-progress';
    document.body.appendChild(transitionProgress);
    
    // Wrap main content for enhanced transitions
    const main = document.querySelector('main');
    if (main && !main.parentElement.classList.contains('page-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-wrapper';
        main.parentNode.insertBefore(wrapper, main);
        wrapper.appendChild(main);
    }
    
    // Add content container for staggered animations
    const main2 = document.querySelector('main');
    if (main2) {
        if (!document.querySelector('.content-container')) {
            const contentElements = Array.from(main2.children);
            const contentContainer = document.createElement('div');
            contentContainer.className = 'content-container';
            
            contentElements.forEach(element => {
                contentContainer.appendChild(element);
            });
            
            main2.appendChild(contentContainer);
        }
    }
}

/**
 * Initialize animations when the page loads
 */
function initializeAnimations() {
    // Add fade-in animation to the main content
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('page');
        
        // Check if this is a page load or navigation
        const isNavigation = sessionStorage.getItem('isNavigating') === 'true';
        
        if (isNavigation) {
            // Handle navigation animation
            main.classList.add('slide-in');
            
            // Delay to ensure DOM is ready
            setTimeout(() => {
                main.classList.remove('slide-in');
                main.classList.add('active');
                
                // Reveal content elements with staggered timing
                revealContentElements();
                
                // Reset navigation flag
                sessionStorage.removeItem('isNavigating');
            }, 50);
        } else {
            // Handle initial page load animation
            setTimeout(() => {
                main.classList.add('active');
                
                // Reveal content elements with staggered timing
                revealContentElements();
            }, 100);
        }
    }
    
    // Initialize skill bars if on a page with skills
    initializeSkillBars();
    
    // Initialize image reveal animations
    initializeImageReveal();
    
    // Add hover-lift class to cards and portfolio items
    document.querySelectorAll('.project-card, .service-card, .blog-card, .testimonial-card, .portfolio-item')
        .forEach(card => {
            card.classList.add('hover-lift');
        });
    
    // Add animation classes to existing elements
    addAnimationClasses();
}

/**
 * Add animation classes to existing elements
 */
function addAnimationClasses() {
    // Add content-reveal to section titles
    document.querySelectorAll('.section-title').forEach(title => {
        if (!title.classList.contains('content-reveal')) {
            title.classList.add('content-reveal');
        }
    });
    
    // Add image-reveal to image containers
    document.querySelectorAll('.hero-image, .about-image, .project-img, .blog-img').forEach(imgContainer => {
        if (!imgContainer.classList.contains('image-reveal')) {
            imgContainer.classList.add('image-reveal');
        }
    });
    
    // Add card-hover to card elements
    document.querySelectorAll('.skill-card, .service-card, .project-card, .blog-card, .testimonial-card').forEach(card => {
        if (!card.classList.contains('card-hover')) {
            card.classList.add('card-hover');
        }
    });
}

/**
 * Reveal content elements with staggered timing
 */
function revealContentElements() {
    // Find all content reveal elements
    const revealElements = document.querySelectorAll('.content-reveal, .animate-text, .animate-fade-in');
    
    // Set up Intersection Observer to reveal elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('content-reveal')) {
                    entry.target.classList.add('revealed');
                } else if (entry.target.classList.contains('animate-text') || 
                           entry.target.classList.contains('animate-fade-in')) {
                    entry.target.classList.add('animated');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each element
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize skill bars animation
 */
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get width from data attribute or from style
                    const targetWidth = entry.target.getAttribute('data-width') || 
                                       entry.target.style.width || 
                                       getComputedStyle(entry.target).width;
                    
                    // Apply width with animation
                    entry.target.style.width = targetWidth;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

/**
 * Initialize image reveal animations - MODIFIED TO REMOVE PURPLE OVERLAY
 */
function initializeImageReveal() {
    const imageRevealElements = document.querySelectorAll('.image-reveal');
    
    if (imageRevealElements.length > 0) {
        // Make all images visible immediately
        imageRevealElements.forEach(element => {
            element.classList.add('revealed');
        });
        
        // Set up observer for subtle scale animation only
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Just ensure the revealed class is added
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe each element
        imageRevealElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Set up enhanced page transitions with smooth sliding effect
 */
function setupEnhancedPageTransitions() {
    const main = document.querySelector('main');
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    const transitionProgress = document.querySelector('.transition-progress');
    
    // Handle link clicks for page transitions
    document.addEventListener('click', function(e) {
        // Find closest anchor element
        const anchor = e.target.closest('a');
        
        if (anchor) {
            const href = anchor.getAttribute('href');
            
            // Only handle internal links that aren't hash links
            if (href && 
                href.indexOf('#') !== 0 && 
                href.indexOf('http') !== 0 && 
                !anchor.hasAttribute('download') && 
                !anchor.hasAttribute('target')) {
                
                e.preventDefault();
                
                // Start transition animation
                if (main) {
                    main.classList.add('slide-out');
                    main.classList.remove('active');
                }
                
                // Show transition overlay with gradient effect
                if (transitionOverlay) {
                    transitionOverlay.classList.add('active');
                }
                
                // Show transition progress
                if (transitionProgress) {
                    transitionProgress.classList.add('active');
                }
                
                // Set navigation flag for the next page
                sessionStorage.setItem('isNavigating', 'true');
                
                // Store the current scroll position
                sessionStorage.setItem('scrollPosition', window.scrollY);
                
                // Wait for animation to complete before navigating
                setTimeout(() => {
                    window.location.href = href;
                }, 800); // Match this to your page transition duration
            }
        }
    });
    
    // Handle page load transition
    window.addEventListener('pageshow', function(event) {
        // Reset transition elements
        if (transitionOverlay) {
            transitionOverlay.classList.remove('active');
        }
        
        if (transitionProgress) {
            transitionProgress.classList.remove('active');
        }
        
        // Restore scroll position if navigating
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
            sessionStorage.removeItem('scrollPosition');
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        // Set navigation flag for the next page
        sessionStorage.setItem('isNavigating', 'true');
        
        if (main) {
            // Start slide out animation
            main.classList.add('slide-out');
            main.classList.remove('active');
            
            // Show transition overlay
            if (transitionOverlay) {
                transitionOverlay.classList.add('active');
            }
            
            // Show transition progress
            if (transitionProgress) {
                transitionProgress.classList.add('active');
            }
        }
    });
}

/**
 * Set up scroll-based animations
 */
function setupScrollAnimations() {
    // Update scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        // Update scroll indicator width
        if (scrollIndicator) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        }
        
        // Parallax effect for elements with .parallax class
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.2;
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Animate elements on scroll
        revealContentElements();
    });
}

/**
 * Set up animations for user interactions
 */
function setupInteractionAnimations() {
    // Hamburger menu animation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Add hover animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
        });
    });
}