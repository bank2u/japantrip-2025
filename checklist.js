const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

// Function to update the style of the checkbox label
const updateLabelStyle = (checkbox) => {
    if (checkbox.checked) {
        checkbox.nextElementSibling.classList.add('line-through', 'text-gray-500');
    } else {
        checkbox.nextElementSibling.classList.remove('line-through', 'text-gray-500');
    }
};

// Load saved state from localStorage
checkboxes.forEach(checkbox => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState === 'checked') {
        checkbox.checked = true;
    }
    updateLabelStyle(checkbox);
});

// Save state to localStorage on change
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem(this.id, 'checked');
        } else {
            localStorage.removeItem(this.id);
        }
        updateLabelStyle(this);
    });
});

// Handle click on the whole item to toggle checkbox
document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', function(event) {
        // Only toggle if the click wasn't directly on the checkbox
        if (event.target.tagName !== 'INPUT') {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            // Trigger change event manually to save state and update style
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});