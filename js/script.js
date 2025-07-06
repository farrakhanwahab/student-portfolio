// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';


    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (hamburger && navLinks && navOverlay) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            navOverlay.classList.toggle('active');
        });
        navOverlay.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !hamburger.contains(event.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    const smoothScroll = function(target, duration) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    };
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            const target = this.getAttribute('href');
            smoothScroll(target, 1000);
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll, .animate-text, .animate-fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for animations
    animateOnScroll();
    
    // Form validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Reset previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully!';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }
    
    // Helper function to show error messages
    function showError(input, message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        input.parentNode.appendChild(errorMessage);
        input.classList.add('error');
        
        // Remove error styling when input changes
        input.addEventListener('input', function() {
            input.classList.remove('error');
            const error = input.parentNode.querySelector('.error-message');
            if (error) error.remove();
        });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Portfolio filter functionality
    const portfolioFilters = document.querySelectorAll('.portfolio-filter li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioFilters.length && portfolioItems.length) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                portfolioFilters.forEach(item => item.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide portfolio items based on filter
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        const prevBtn = testimonialSlider.querySelector('.prev-btn');
        const nextBtn = testimonialSlider.querySelector('.next-btn');
        let currentIndex = 0;
        
        // Function to show testimonial at specific index
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.transform = `translateX(${100 * (i - index)}%)`;
            });
        }
        
        // Initialize slider
        showTestimonial(currentIndex);
        
        // Previous button click handler
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
                showTestimonial(currentIndex);
            });
        }
        
        // Next button click handler
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
                showTestimonial(currentIndex);
            });
        }
        
        // Auto slide every 5 seconds
        setInterval(function() {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        }, 5000);
    }
    
    // Skills progress animation
    const skillsSection = document.querySelector('.skills-section');
    
    if (skillsSection) {
        const progressBars = skillsSection.querySelectorAll('.progress-bar');
        
        function animateSkills() {
            const sectionPosition = skillsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionPosition < windowHeight - 100) {
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress') + '%';
                    bar.style.width = targetWidth;
                });
                // Remove scroll listener once animated
                window.removeEventListener('scroll', animateSkills);
            }
        }
        
        // Check on scroll
        window.addEventListener('scroll', animateSkills);
        // Initial check
        animateSkills();
    }
    
    // Blog post filter
    const blogFilters = document.querySelectorAll('.blog-filter li');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (blogFilters.length && blogPosts.length) {
        blogFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                blogFilters.forEach(item => item.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-category');
                
                // Show/hide blog posts based on filter
                blogPosts.forEach(post => {
                    if (filterValue === 'all' || post.getAttribute('data-category') === filterValue) {
                        post.style.display = 'block';
                        setTimeout(() => {
                            post.style.opacity = '1';
                        }, 50);
                    } else {
                        post.style.opacity = '0';
                        setTimeout(() => {
                            post.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize AOS (Animate On Scroll) if available
    let AOS; // Declare AOS variable
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Add this script to your existing JavaScript files or create a new one
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ question elements
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Add click event listener to each question
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Get the parent faq-item
            const faqItem = question.parentElement;
            
            // Toggle active class on the clicked faq-item
            faqItem.classList.toggle('active');
            
            // Optional: Close other FAQs when opening a new one
            // Uncomment this code if you want only one FAQ open at a time
            /*
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            */
        });
    });
});