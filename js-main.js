// --- Main Tab Switching (Home, About, Products, Contact) ---
document.addEventListener('DOMContentLoaded', function() {
    // Main nav tab switching
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const tabId = this.getAttribute('data-tab');
            const category = this.getAttribute('data-category');
            if (tabId) {
                e.preventDefault();
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                // Show the selected tab content
                document.getElementById(tabId).classList.add('active');
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.add('hidden');
                // If this is a View Collection link with a category, activate the correct product tab
                if (tabId === 'products' && category) {
                    setTimeout(() => {
                        const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
                        if (categoryTab) {
                            categoryTab.click();
                        }
                    }, 100);
                }
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Category tabs functionality ---
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active category tab
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('border-amber-500', 'text-amber-600');
            });
            this.classList.add('border-amber-500', 'text-amber-600');
            
            // Show/hide products based on category
            document.querySelectorAll('.product-card').forEach(product => {
                if (category === 'all' || product.getAttribute('data-category') === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // --- Currency, Weight, Packaging, and Category Interactivity ---
    
    const currencyData = {
        us: { symbol: '$', rate: 1, code: 'USD' },
        ke: { symbol: 'Ksh', rate: 130, code: 'KES' },
        eu: { symbol: '€', rate: 0.92, code: 'EUR' },
        uk: { symbol: '£', rate: 0.78, code: 'GBP' }
    };

    function detectRegion() {
        try {
            const region = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
            if (region.includes('nairobi') || region.includes('africa')) return 'ke';
            if (region.includes('london') || region.includes('europe')) return 'uk';
            if (region.includes('paris') || region.includes('berlin') || region.includes('europe')) return 'eu';
            return 'us';
        } catch { return 'us'; }
    }

    // Function to update product price based on all factors
    function updateProductPrice(card) {
        const basePrices = JSON.parse(card.getAttribute('data-base-prices'));
        const weightValue = card.querySelector('.quantity-select').value;
        const packaging = card.querySelector('.packaging-option:checked').value;
        const quantity = parseInt(card.querySelector('.quantity-input').value, 10);
        const region = document.getElementById('region').value;
        
        // Get base price for selected weight
        let basePrice = basePrices[weightValue];
        
        // Add glass jar cost if selected
        if (packaging === 'glass') {
            basePrice += 1.50;
        }
        
        // Multiply by quantity
        let totalPrice = basePrice * quantity;
        
        // Convert to selected currency
        const rate = currencyData[region].rate;
        const symbol = currencyData[region].symbol;
        const convertedPrice = (totalPrice * rate).toFixed(2);
        
        // Update price display
        card.querySelector('.text-lg.font-bold').textContent = symbol + convertedPrice;
    }

    // Update price when quantity weight changes
    document.querySelectorAll('.quantity-select').forEach(select => {
        select.addEventListener('change', function() {
            const card = this.closest('.product-card');
            updateProductPrice(card);
        });
    });
    
    // Update price when packaging changes
    document.querySelectorAll('.packaging-option').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.product-card');
            updateProductPrice(card);
        });
    });

    // Increment quantity
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const input = card.querySelector('.quantity-input');
            const currentValue = parseInt(input.value, 10);
            input.value = currentValue + 1;
            updateProductPrice(card);
        });
    });

    // Decrement quantity
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const input = card.querySelector('.quantity-input');
            const currentValue = parseInt(input.value, 10);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateProductPrice(card);
            }
        });
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const weightQty = productCard.querySelector('.quantity-select').value;
            const packaging = productCard.querySelector('.packaging-option:checked').value;
            const orderQuantity = productCard.querySelector('.quantity-input').value;
            
            // In a real implementation, you would add the item to the cart
            alert(`Added ${orderQuantity} × ${weightQty} of ${productName} (${packaging} packaging) to cart!`);
            
            // Update cart count
            const cartCount = document.querySelector('.fa-shopping-cart').nextElementSibling;
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = parseInt(count) + parseInt(orderQuantity);
        });
    });
    // Search functionality
    document.querySelector('.fa-search').addEventListener('click', function(e) {
        e.preventDefault();
        const searchTerm = prompt("Enter search term:");
        if (searchTerm) {
            // Switch to products tab
            document.querySelector('.tab-link[data-tab="products"]').click();
            
            // Filter products
            setTimeout(() => {
                document.querySelector('.category-tab[data-category="all"]').click();
                
                document.querySelectorAll('.product-card').forEach(product => {
                    const productName = product.querySelector('h3').textContent.toLowerCase();
                    const productDesc = product.querySelector('p').textContent.toLowerCase();
                    if (productName.includes(searchTerm.toLowerCase()) || 
                        productDesc.includes(searchTerm.toLowerCase())) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }, 100);
        }
    });

    

    // Region change handler
    const regionSelect = document.getElementById('region');
    regionSelect.addEventListener('change', function() {
        // Update all product prices
        document.querySelectorAll('.product-card').forEach(card => {
            updateProductPrice(card);
        });
    });

    // Initialize all product cards on page load
    function initializeProducts() {
        document.querySelectorAll('.product-card').forEach(card => {
            updateProductPrice(card);
        });
    }

    // On page load, detect region and update prices
    const detected = detectRegion();
    regionSelect.value = detected;
    
    // Initialize products after DOM is fully loaded
    initializeProducts();
});