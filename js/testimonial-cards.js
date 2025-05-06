/**
 * Testimonial Cards System
 * Creates swipeable testimonial cards with expandable details
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize testimonial cards
    initTestimonialCards();
});

/**
 * Initialize testimonial cards functionality
 */
function initTestimonialCards() {
    const testimonialContainer = document.querySelector('.testimonial-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialContainer || testimonialCards.length === 0) return;
    
    // Set up click event for each testimonial card
    testimonialCards.forEach(card => {
        card.addEventListener('click', function() {
            openTestimonialModal(this);
        });
    });
    
    // Initialize touch swiping for mobile
    initSwipeGesture(testimonialContainer);
    
    // Set up navigation buttons if they exist
    const prevButton = document.querySelector('.testimonial-nav-prev');
    const nextButton = document.querySelector('.testimonial-nav-next');
    
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollTestimonials('prev');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollTestimonials('next');
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTestimonialModal();
        }
    });
    
    // Create modal container if it doesn't exist
    if (!document.querySelector('.testimonial-modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'testimonial-modal-container';
        modalContainer.innerHTML = `
            <div class="testimonial-modal">
                <button class="testimonial-modal-close">&times;</button>
                <div class="testimonial-modal-content"></div>
            </div>
            <div class="testimonial-modal-overlay"></div>
        `;
        document.body.appendChild(modalContainer);
        
        // Set up close button and overlay click
        const closeButton = document.querySelector('.testimonial-modal-close');
        const overlay = document.querySelector('.testimonial-modal-overlay');
        
        if (closeButton) {
            closeButton.addEventListener('click', closeTestimonialModal);
        }
        
        if (overlay) {
            overlay.addEventListener('click', closeTestimonialModal);
        }
    }
}

/**
 * Open testimonial modal with full content
 * @param {HTMLElement} card - The testimonial card that was clicked
 */
function openTestimonialModal(card) {
    const modalContainer = document.querySelector('.testimonial-modal-container');
    const modalContent = document.querySelector('.testimonial-modal-content');
    
    if (!modalContainer || !modalContent) return;
    
    // Get full content from data attribute or hidden element
    const fullContent = card.getAttribute('data-full-content') || 
                        card.querySelector('.testimonial-full-content')?.innerHTML || 
                        card.innerHTML;
    
    // Get person details
    const personName = card.querySelector('.testimonial-name')?.textContent || '';
    const personTitle = card.querySelector('.testimonial-title')?.textContent || '';
    const personDate = card.querySelector('.testimonial-date')?.textContent || '';
    const personImage = card.querySelector('.testimonial-image')?.src || '';
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="testimonial-modal-header">
            ${personImage ? `<img src="${personImage}" alt="${personName}" class="testimonial-modal-image">` : ''}
            <div class="testimonial-modal-person">
                <h3 class="testimonial-modal-name">${personName}</h3>
                <p class="testimonial-modal-date">${personDate}</p>
                ${personTitle ? `<p class="testimonial-modal-title">${personTitle}</p>` : ''}
            </div>
        </div>
        <div class="testimonial-modal-quote">
            <span class="testimonial-quote-icon">&#8220;</span>
            <div class="testimonial-modal-text">${fullContent}</div>
        </div>
    `;
    
    // Show modal with animation
    modalContainer.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Animate modal entrance
    setTimeout(() => {
        document.querySelector('.testimonial-modal').classList.add('active');
    }, 10);
}

/**
 * Close testimonial modal
 */
function closeTestimonialModal() {
    const modalContainer = document.querySelector('.testimonial-modal-container');
    const modal = document.querySelector('.testimonial-modal');
    
    if (!modalContainer || !modal) return;
    
    // Animate modal exit
    modal.classList.remove('active');
    
    // Remove modal after animation completes
    setTimeout(() => {
        modalContainer.classList.remove('active');
        document.body.classList.remove('modal-open');
    }, 300);
}

/**
 * Scroll testimonials horizontally
 * @param {string} direction - Direction to scroll ('prev' or 'next')
 */
function scrollTestimonials(direction) {
    const container = document.querySelector('.testimonial-slider');
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    const currentScroll = container.scrollLeft;
    
    if (direction === 'prev') {
        container.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

/**
 * Initialize swipe gesture for mobile devices
 * @param {HTMLElement} element - The element to add swipe functionality to
 */
function initSwipeGesture(element) {
    let startX, startY, distX, distY;
    let startTime;
    let threshold = 150; // Minimum distance for swipe
    let restraint = 100; // Maximum perpendicular distance
    let allowedTime = 300; // Maximum time allowed for swipe
    
    element.addEventListener('touchstart', function(e) {
        const touchObj = e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
    }, { passive: true });
    
    element.addEventListener('touchend', function(e) {
        const touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        const elapsedTime = new Date().getTime() - startTime;
        
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                // Horizontal swipe detected
                if (distX > 0) {
                    // Swipe right
                    scrollTestimonials('prev');
                } else {
                    // Swipe left
                    scrollTestimonials('next');
                }
            }
        }
    }, { passive: true });
}