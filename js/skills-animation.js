// Skills Progress Bar Animation
document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillBars = document.querySelectorAll('.skill-bar');
    
    // Intersection Observer to trigger animation when skills section comes into view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe the skills section (check multiple possible selectors)
    const skillsSection = document.querySelector('.skills') || 
                         document.querySelector('.skills-section') || 
                         document.querySelector('.resume-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Fallback: Trigger animation after a delay if intersection observer doesn't work
    setTimeout(() => {
        if ((progressBars.length > 0 && progressBars[0].style.width === '0px') || 
            (skillBars.length > 0 && !skillBars[0].classList.contains('animated'))) {
            animateProgressBars();
            animateSkillBars();
        }
    }, 2000);

    function animateProgressBars() {
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            if (percentage) {
                bar.style.width = percentage + '%';
            }
        });
    }

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const skillLevel = bar.querySelector('.skill-level');
            if (skillLevel) {
                const percent = skillLevel.getAttribute('data-percent');
                if (percent) {
                    // Add animated class to trigger CSS transition
                    bar.classList.add('animated');
                    // Set CSS custom property for the width
                    skillLevel.style.setProperty('--skill-percent', percent + '%');
                    // Force the animation by setting the width
                    skillLevel.style.width = percent + '%';
                }
            }
        });
    }
});

// Add smooth scroll behavior for project links
document.addEventListener('DOMContentLoaded', function() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // You can add actual navigation logic here
            console.log('Project link clicked:', this.getAttribute('title'));
        });
    });
});

// Add hover effects for skill categories
document.addEventListener('DOMContentLoaded', function() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}); 