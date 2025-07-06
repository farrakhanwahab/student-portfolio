/**
 * Enhanced Professional Animation System
 * Provides smooth, sophisticated animations throughout the website
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize animations
    initializeAnimations();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup interaction animations
    setupInteractionAnimations();
});



/**
 * Initialize animations when the page loads
 */
function initializeAnimations() {
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
 * Set up scroll-based animations
 */
function setupScrollAnimations() {
    window.addEventListener('scroll', function() {
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
 * Reveal content elements on scroll
 */
function revealContentElements() {
    const elements = document.querySelectorAll('.content-reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

/**
 * Add animation classes to existing elements
 */
function addAnimationClasses() {
    // Add animation classes to elements that should animate on load
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.classList.add('content-reveal');
    });
}

/**
 * Set up animations for user interactions
 */
function setupInteractionAnimations() {
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