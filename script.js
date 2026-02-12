document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links (if not supported natively)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
        observer.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Pagination Logic
    function initPagination() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        const products = Array.from(productGrid.querySelectorAll('.product-card'));
        const itemsPerPage = 6;
        const totalPages = Math.ceil(products.length / itemsPerPage);

        // If we have 6 or fewer items, no need for pagination
        if (totalPages <= 1) return;

        // Create pagination controls container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-controls';
        productGrid.parentNode.insertBefore(paginationContainer, productGrid.nextSibling);

        let currentPage = 1;

        function showPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            products.forEach((product, index) => {
                if (index >= start && index < end) {
                    product.style.display = 'flex'; // Ensure flex for product cards
                    // Trigger animation reflow if needed, or simply let CSS handle it
                    setTimeout(() => product.classList.add('is-visible'), 100);
                } else {
                    product.style.display = 'none';
                    product.classList.remove('is-visible');
                }
            });

            updateButtons();

            // Scroll to top of grid when changing page
            const container = document.querySelector('.section-padding');
            if (container) {
                const headerOffset = 100;
                const elementPosition = container.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }

        function updateButtons() {
            paginationContainer.innerHTML = '';

            // Prev Button
            if (currentPage > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.innerText = 'Anterior';
                prevBtn.className = 'btn-pagination';
                prevBtn.onclick = () => {
                    currentPage--;
                    showPage(currentPage);
                };
                paginationContainer.appendChild(prevBtn);
            }

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.innerText = i;
                pageBtn.className = `btn-pagination ${i === currentPage ? 'active' : ''}`;
                pageBtn.onclick = () => {
                    currentPage = i;
                    showPage(currentPage);
                };
                paginationContainer.appendChild(pageBtn);
            }

            // Next Button
            if (currentPage < totalPages) {
                const nextBtn = document.createElement('button');
                nextBtn.innerText = 'Siguiente';
                nextBtn.className = 'btn-pagination';
                nextBtn.onclick = () => {
                    currentPage++;
                    showPage(currentPage);
                };
                paginationContainer.appendChild(nextBtn);
            }
        }

        // Initialize
        showPage(1);
    }

    initPagination();
});
