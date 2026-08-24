/**
 * Apex Legal Counsel - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form Submission Handling
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Submitting Request...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your case consultation request has been received. Our senior attorneys will reach out within 2 hours.');
                form.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 800);
        });
    }

    // Active Navigation Link Scroll Highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
