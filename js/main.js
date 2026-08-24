/**
 * Apex Legal Counsel - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initPracticeTabs();
    initCaseEstimator();
    initContactForm();
    initStatCounters();
});

/* 1. Theme Switcher (Dark / Light Mode) */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('apex_legal_theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    let currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    setTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '🌙';
            themeBtn.setAttribute('title', 'Switch to Dark Mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeBtn.innerHTML = '☀️';
            themeBtn.setAttribute('title', 'Switch to Light Mode');
        }
        localStorage.setItem('apex_legal_theme', theme);
    }
}

/* 2. Mobile Navigation Drawer */
function initMobileNav() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    if (!menuBtn || !navbar) return;

    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('mobile-active');
        menuBtn.textContent = navbar.classList.contains('mobile-active') ? '✕' : '☰';
    });

    const links = navbar.querySelectorAll('.nav-link');
    links.forEach(l => {
        l.addEventListener('click', () => {
            navbar.classList.remove('mobile-active');
            menuBtn.textContent = '☰';
        });
    });
}

/* 3. Practice Area Filter Tabs */
function initPracticeTabs() {
    const tabBtns = document.querySelectorAll('.practice-tabs .tab-btn');
    const cards = document.querySelectorAll('.practice-card');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* 4. Interactive Case Fee & Settlement Estimator */
function initCaseEstimator() {
    const caseSelect = document.getElementById('calcCaseType');
    const complexitySelect = document.getElementById('calcComplexity');
    const recoveryDisplay = document.getElementById('estimatedRecoveryDisplay');
    const feeDisplay = document.getElementById('estimatedFeeDisplay');

    if (!caseSelect || !recoveryDisplay) return;

    const caseData = {
        corporate: { recovery: "$2,500,000+", feeRate: "Retainer & Hourly" },
        injury: { recovery: "$850,000+", feeRate: "33% Contingency (No Win, No Fee)" },
        criminal: { recovery: "N/A (Dismissal & Defense)", feeRate: "Flat Trial Retainer" },
        realestate: { recovery: "$1,200,000+", feeRate: "Fixed Transaction Fee" }
    };

    function calculateEstimate() {
        const type = caseSelect.value;
        const compMultiplier = parseFloat(complexitySelect ? complexitySelect.value : 1);
        const data = caseData[type] || caseData['corporate'];

        if (type === 'injury') {
            const baseAmount = 850000 * compMultiplier;
            recoveryDisplay.textContent = `$${Math.round(baseAmount).toLocaleString()}+ Est. Recovery`;
        } else if (type === 'corporate') {
            const baseAmount = 2500000 * compMultiplier;
            recoveryDisplay.textContent = `$${Math.round(baseAmount).toLocaleString()}+ Est. Settlement`;
        } else {
            recoveryDisplay.textContent = data.recovery;
        }

        feeDisplay.textContent = `Fee Model: ${data.feeRate}`;
    }

    caseSelect.addEventListener('change', calculateEstimate);
    if (complexitySelect) complexitySelect.addEventListener('change', calculateEstimate);

    calculateEstimate();
}

/* 5. Contact / Case Evaluation Form & Modal */
function initContactForm() {
    const form = document.getElementById('caseEvaluationForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeSuccessBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Submitting Confidential Request...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            form.reset();

            if (modal) modal.classList.add('active');
        }, 1100);
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
}

/* 6. Animated Stat Counters */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(counter => {
                    const targetStr = counter.getAttribute('data-target') || counter.innerText;
                    animateValue(counter, targetStr);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.hero-metrics-bar') || document.querySelector('.accreditations-banner');
    if (statsSection) observer.observe(statsSection);

    function animateValue(element, targetStr) {
        const numericMatch = targetStr.match(/[\d.]+/);
        if (!numericMatch) return;

        const targetNum = parseFloat(numericMatch[0]);
        const prefix = targetStr.split(numericMatch[0])[0];
        const suffix = targetStr.split(numericMatch[0])[1];

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = (start + (targetNum - start) * easeProgress);

            const formattedNum = Number.isInteger(targetNum) 
                ? Math.floor(currentNum) 
                : currentNum.toFixed(1);

            element.innerText = `${prefix}${formattedNum}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.innerText = targetStr;
            }
        }

        requestAnimationFrame(update);
    }
}
