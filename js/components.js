// Component Loader
class ComponentLoader {
    constructor() {
        this.components = {};
    }

    // Load a component from file
    async loadComponent(name, selector) {
        try {
            const response = await fetch(`components/${name}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${name} component`);
            }
            const html = await response.text();
            this.components[name] = html;
            this.insertComponent(name, selector);
            return true;
        } catch (error) {
            console.error(`Error loading ${name} component:`, error);
            return false;
        }
    }

    // Insert component into DOM
    insertComponent(name, selector) {
        const element = document.querySelector(selector);
        if (element && this.components[name]) {
            element.innerHTML = this.components[name];
            this.initializeComponent(name);
        }
    }

    // Initialize component-specific functionality
    initializeComponent(name) {
        switch (name) {
            case 'header':
                this.initializeHeader();
                break;
            case 'footer':
                this.initializeFooter();
                break;
        }
    }

    // Initialize header functionality
    initializeHeader() {
        // Set active navigation link
        this.setActiveNavLink();
        
        // Initialize mobile menu
        this.initializeMobileMenu();
        
        // Initialize theme toggle
        this.initializeThemeToggle();
    }

    // Set active navigation link based on current page
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Initialize mobile menu functionality
    initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const mobileLinks = navLinks.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    }

    // Initialize theme toggle functionality
    initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.className = savedTheme === 'dark' ? 'dark-mode' : 'light-mode';
            
            // Update toggle icon
            this.updateThemeIcon(savedTheme);
            
            // Add click event
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.body.className = newTheme === 'dark' ? 'dark-mode' : 'light-mode';
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    }

    // Update theme toggle icon
    updateThemeIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }

    // Initialize footer functionality
    initializeFooter() {
        // Initialize newsletter form
        this.initializeNewsletterForm();
        
        // Initialize social links
        this.initializeSocialLinks();
    }

    // Initialize newsletter form
    initializeNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('.newsletter-input').value;
                
                // Here you would typically send the email to your backend
                console.log('Newsletter subscription:', email);
                
                // Show success message
                this.showNotification('Thank you for subscribing!', 'success');
                newsletterForm.reset();
            });
        }
    }

    // Initialize social links
    initializeSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add tracking or analytics here if needed
                console.log('Social link clicked:', link.href);
            });
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#17a2b8';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
    
    // Load header and footer components
    if (document.querySelector('#header-placeholder')) {
        componentLoader.loadComponent('header', '#header-placeholder');
    }
    
    if (document.querySelector('#footer-placeholder')) {
        componentLoader.loadComponent('footer', '#footer-placeholder');
    }
}); 