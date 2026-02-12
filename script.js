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

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animation
    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        })
    }

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });

    // Initial check
    handleScrollAnimation();

    // --- Product Modal Logic ---
    function initProductModal() {
        // Check if modal already exists
        if (document.getElementById('product-modal')) return;

        // Create Modal HTML
        const modalHTML = `
            <div id="product-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-close">&times;</div>
                    <div class="modal-img-container">
                        <img id="modal-img" src="" alt="Product Image">
                    </div>
                    <div class="modal-info">
                        <h2 id="modal-title" class="modal-title">Product Title</h2>
                        <div id="modal-price" class="modal-price">S/0.00</div>
                        <p id="modal-desc" class="modal-desc">Product description goes here.</p>
                        <a id="modal-btn" href="#" class="btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('product-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalPrice = document.getElementById('modal-price');
        const modalDesc = document.getElementById('modal-desc');
        const modalBtn = document.getElementById('modal-btn');

        // Close Modal Function
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scroll
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add Click Event to Products
        // We use delegation because of pagination (items might be hidden/shown)
        // But pagination just toggles display, elements exist.
        // However, for duplicated items, we might need to be careful.

        // Better to attach to a parent or re-attach on pagination?
        // Actually, since elements are not destroyed, just hidden, standard delegation on .product-grid works perfectly.

        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');

                // Prevent opening if clicking on the buy button directly (optional, but good UX)
                // If user clicks "Comprar", maybe they just want to go to WhatsApp immediately.
                // Let's decide: if they click the button, let it go. If they click card/img/title, open modal.
                if (e.target.closest('.btn-whatsapp')) return;

                if (card) {
                    // Extract Data
                    const img = card.querySelector('.product-img img').src;
                    const title = card.querySelector('.product-title').innerText;
                    const price = card.querySelector('.product-price').innerText;
                    const desc = card.querySelector('.product-desc').innerText;
                    const link = card.querySelector('.btn-whatsapp').href;

                    // Populate Modal
                    modalImg.src = img;
                    modalTitle.innerText = title;
                    modalPrice.innerText = price;
                    modalDesc.innerText = desc;
                    modalBtn.href = link;

                    // Open Modal
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Disable scroll
                }
            });
        }
    }


    // --- Pagination Logic ---
    function initPagination() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        const products = Array.from(productGrid.querySelectorAll('.product-card'));
        const itemsPerPage = 6;
        const totalPages = Math.ceil(products.length / itemsPerPage);

        if (totalPages <= 1) return;

        // Check if controls already exist (to avoid duplicates if re-run)
        let paginationContainer = document.querySelector('.pagination-controls');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-controls';
            productGrid.parentNode.insertBefore(paginationContainer, productGrid.nextSibling);
        }

        let currentPage = 1;

        function showPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            products.forEach((product, index) => {
                if (index >= start && index < end) {
                    product.style.display = 'flex';
                    // Trigger animation reflow
                    product.classList.remove('is-visible');
                    void product.offsetWidth;
                    product.classList.add('is-visible');
                } else {
                    product.style.display = 'none';
                }
            });

            updateButtons();

            // Scroll to top of grid
            const container = document.querySelector('.section-padding');
            if (container && page !== 1) { // Only scroll if not initial load
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
                prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
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
                nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
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

        // Initialize
        showPage(1);
    }

    // Run on load
    initPagination();
    initProductModal(); // Initialize separately to ensure it runs even if pagination is skipped
});
