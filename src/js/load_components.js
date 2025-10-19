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
    loadHTML('src/html/header.html', 'header-placeholder', function(headerPlaceholder, headerElement) {
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

        // Get the initial height of the header
        const headerHeight = headerElement.offsetHeight;
        let spacer = document.createElement('div');
        spacer.style.height = headerHeight + 'px';
        spacer.style.display = 'none'; // Initially hidden
        headerPlaceholder.parentNode.insertBefore(spacer, headerPlaceholder.nextSibling);


        // Add scroll event listener for sticky header
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Adjust this value as needed for when it becomes fixed
                headerElement.classList.add('header-minimized'); // Keep existing minimized class
                headerElement.style.position = 'fixed';
                headerElement.style.top = '0';
                headerElement.style.width = '100%'; // Ensure it spans full width
                headerElement.style.zIndex = '50'; // Ensure it's above other content
                spacer.style.display = 'block'; // Show spacer to prevent content jump
            } else {
                headerElement.classList.remove('header-minimized');
                headerElement.style.position = 'static'; // Or 'relative' depending on original flow
                headerElement.style.top = '';
                headerElement.style.width = '';
                headerElement.style.zIndex = '';
                spacer.style.display = 'none'; // Hide spacer
            }
        });
    });

    // Load footer
    loadHTML('src/html/footer.html', 'footer-placeholder');
});