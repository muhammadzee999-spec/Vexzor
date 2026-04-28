// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navCenter = document.querySelector('.nav-center');
    
    if (menuBtn && navCenter) {
        menuBtn.addEventListener('click', () => {
            navCenter.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navCenter.contains(e.target)) {
                navCenter.classList.remove('active');
            }
        });
    }

    // 2. Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Update Cart Count on Load
    updateGlobalCartCount();

    // 4. Custom Smooth Cursor Logic
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Immediate position for dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Smooth lag effect for outline using animate
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .spc-cart-btn, .view-btn, #hero-img-trigger');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(193, 154, 107, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }
});

// Function to update cart count globally
window.updateGlobalCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('vexzor_cart')) || [];
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    cartCounts.forEach(el => el.innerText = totalItems);
};
