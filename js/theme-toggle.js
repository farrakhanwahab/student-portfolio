// Professional Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Get theme toggle button and body element
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme) {
        // Apply saved theme
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        }
        updateThemeIcon(savedTheme === 'dark');
    } else {
        // Check system preference if no saved theme
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        }
        updateThemeIcon(prefersDarkMode);
    }

    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle dark mode class
            body.classList.toggle('dark-mode');
            body.classList.toggle('light-mode');
            
            const isDarkMode = body.classList.contains('dark-mode');
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Update the icon
            updateThemeIcon(isDarkMode);
            
            // Animate the toggle button
            themeToggle.classList.add('clicked');
            setTimeout(() => {
                themeToggle.classList.remove('clicked');
            }, 500);
        });
    }

    // Function to update theme toggle icon
    function updateThemeIcon(isDarkMode) {
        if (themeToggle) {
            // Clear existing content
            themeToggle.innerHTML = '';
            
            // Add appropriate icon based on current theme
            if (isDarkMode) {
                // In dark mode, show sun icon (to switch to light)
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                // In light mode, show moon icon (to switch to dark)
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }
    
    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.classList.toggle('dark-mode', e.matches);
            body.classList.toggle('light-mode', !e.matches);
            updateThemeIcon(e.matches);
        }
    });
    
    // Apply animation classes to theme-related elements
    document.querySelectorAll('[class*="dark-"], [class*="light-"]').forEach(element => {
        element.style.transition = 'all var(--transition-medium) var(--easing-smooth)';
    });
});