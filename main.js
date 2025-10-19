document.addEventListener('DOMContentLoaded', function () {
    const sidePanel = document.getElementById('side-panel');
    const overlay = document.getElementById('side-panel-overlay');
    const closeBtn = document.getElementById('close-side-panel');
    const panelTitle = document.getElementById('side-panel-title');
    const panelContent = document.getElementById('side-panel-content');
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        item.addEventListener('click', function () {
            const day = this.dataset.day;
            const details = document.getElementById(`day-${day}-details`);
            const title = this.querySelector('h5').textContent;

            if (details) {
                panelTitle.textContent = title;
                panelContent.innerHTML = details.innerHTML;
                sidePanel.classList.add('side-panel-open');
                overlay.classList.remove('hidden');
            }
        });
    });

    function closePanel() {
        sidePanel.classList.remove('side-panel-open');
        overlay.classList.add('hidden');
    }

    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // Auto-scroll to current day during trip period
    const tripDates = {
        '11-14': 1,
        '11-15': 2,
        '11-16': 3,
        '11-17': 4,
        '11-18': 5,
        '11-19': 6,
        '11-20': 7,
        '11-21': 8,
        '11-22': 9
    };

    const today = new Date();
    const currentYear = today.getFullYear();

    if (currentYear === 2025) {
        const currentMonth = today.getMonth() + 1;
        const currentDate = today.getDate();
        const formattedDate = `${currentMonth}-${currentDate}`;
        const tripDay = tripDates[formattedDate];

        if (tripDay) {
            const targetElement = document.querySelector(`[data-day="${tripDay}"]`);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetElement.style.transition = 'background-color 0.5s ease';
                    targetElement.style.backgroundColor = '#FEF2F2';
                    setTimeout(() => {
                        targetElement.style.backgroundColor = '';
                    }, 2000);
                }, 500);
            }
        }
    }
});