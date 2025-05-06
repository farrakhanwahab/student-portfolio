/**
 * Portfolio Filtering System
 * Allows filtering portfolio items by category with smooth animations
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize portfolio filtering
    initPortfolioFilter();
});

/**
 * Initialize portfolio filtering functionality
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter button, .portfolio-filter .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the filter category
                const filterValue = this.getAttribute('data-filter');
                
                // Filter the portfolio items
                filterPortfolioItems(portfolioItems, filterValue);
            });
        });
        
        // Set "All" as active by default
        const allButton = document.querySelector('.portfolio-filter [data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    }
}

/**
 * Filter portfolio items based on category
 * @param {NodeList} items - Portfolio items to filter
 * @param {string} category - Category to filter by
 */
function filterPortfolioItems(items, category) {
    // Create a container for the filtered layout
    const container = document.querySelector('.portfolio-grid, .portfolio-container');
    const itemsArray = Array.from(items);
    
    // Add transition class to container
    if (container) {
        container.classList.add('filtering');
    }
    
    // Hide all items first with staggered timing
    items.forEach((item, index) => {
        // If filtering all items, show everything
        if (category === 'all') {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            }, index * 50);
        } 
        // Otherwise, only hide items that don't match the category
        else if (!item.classList.contains(category)) {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            }, index * 50);
        }
    });
    
    // Wait for hide animation to complete
    setTimeout(() => {
        // Apply display changes
        items.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Rearrange visible items if using a grid
        if (container) {
            // Get only visible items
            const visibleItems = itemsArray.filter(item => 
                category === 'all' || item.classList.contains(category)
            );
            
            // Show items with staggered timing
            visibleItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100);
            });
            
            // Remove filtering class after animation completes
            setTimeout(() => {
                container.classList.remove('filtering');
            }, visibleItems.length * 100 + 300);
        }
    }, items.length * 50 + 300);
}