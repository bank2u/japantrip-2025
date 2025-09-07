document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML content into a placeholder
    function loadHTML(url, elementId, callback) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const placeholder = document.getElementById(elementId);
                if (elementId === 'header-placeholder') {
                    const headerElement = document.createElement('header');
                    headerElement.className = "bg-sky-600 text-white sticky top-0 z-50 transition-all duration-300";
                    headerElement.innerHTML = html;
                    placeholder.appendChild(headerElement);
                    if (callback) {
                        callback(placeholder, headerElement); // Pass the newly created header element
                    }
                } else {
                    placeholder.innerHTML = html;
                    if (callback) {
                        callback(placeholder);
                    }
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    }

    // Load header
    loadHTML('header.html', 'header-placeholder', function(headerPlaceholder, headerElement) {
        const h1Content = headerPlaceholder.dataset.h1;
        const h2Content = headerPlaceholder.dataset.h2;

        if (h1Content) {
            const h1Element = headerElement.querySelector('.header-full-content h1');
            if (h1Element) {
                h1Element.textContent = h1Content;
            }
        }
        if (h2Content) {
            const h2Element = headerElement.querySelector('.header-full-content h2');
            if (h2Element) {
                h2Element.textContent = h2Content;
            }
        }

        // Add scroll event listener for sticky header
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Adjust this value as needed
                headerElement.classList.add('header-minimized');
            } else {
                headerElement.classList.remove('header-minimized');
            }
        });
    });

    // Load footer
    loadHTML('footer.html', 'footer-placeholder');
});