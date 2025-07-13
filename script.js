document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0;

    // Get specific page elements for direct navigation
    const lastPage = document.getElementById('lastPage');
    const noPath = document.getElementById('noPath');
    const yesPath = document.getElementById('yesPath');

    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    /**
     * Shows a specific page with animation.
     * @param {HTMLElement} targetPageElement The DOM element of the page to show.
     * @param {string} direction 'next' for forward, 'prev' for backward transition.
     */
    function showPage(targetPageElement, direction = 'next') {
        const currentPage = pages[currentPageIndex];
        const newPageIndex = Array.from(pages).indexOf(targetPageElement);

        if (currentPage === targetPageElement) {
            return;
        }

        // Add exit animation class to the current page
        if (direction === 'next') {
            currentPage.classList.add('exit-left');
        } else {
            currentPage.classList.add('exit-right');
        }
        currentPage.classList.remove('active');
        currentPage.style.pointerEvents = 'none';

        // Set up the next page for entry animation
        if (direction === 'next') {
            targetPageElement.classList.add('enter-right');
        } else {
            targetPageElement.classList.add('enter-left');
        }

        setTimeout(() => {
            targetPageElement.classList.remove('exit-left', 'exit-right', 'enter-left', 'enter-right');
            targetPageElement.classList.add('active');
            targetPageElement.style.pointerEvents = 'all';
            currentPageIndex = newPageIndex;

            setTimeout(() => {
                currentPage.classList.remove('exit-left', 'exit-right');
                currentPage.style.transform = '';
            }, parseFloat(getComputedStyle(currentPage).transitionDuration) * 1000);
        }, 50);
    }

    // Initialize: Show the first page on load
    showPage(pages[currentPageIndex]);

    // Attach event listeners for 'Next' buttons
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentActivePage = document.querySelector('.page.active');
            const currentIndex = Array.from(pages).indexOf(currentActivePage);

            if (currentIndex < pages.length - 1) {
                let nextTargetPage = pages[currentIndex + 1];
                if (nextTargetPage && !nextTargetPage.classList.contains('feedback-page')) { // Exclude feedback pages from general next flow
                     showPage(nextTargetPage, 'next');
                } else if (nextTargetPage && nextTargetPage.id === 'lastPage') { // Explicitly go to lastPage
                    showPage(lastPage, 'next');
                } else {
                    console.log("No general 'next' page found or special navigation needed.");
                }
            }
        });
    });

    // Attach event listeners for 'Previous' buttons
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentActivePage = document.querySelector('.page.active');
            const currentIndex = Array.from(pages).indexOf(currentActivePage);

            if (currentIndex > 0) {
                showPage(pages[currentIndex - 1], 'prev');
            }
        });
    });

    // Special navigation for the "Back to Question" buttons on feedback pages
    document.querySelectorAll('.back-to-last-page-btn').forEach(button => {
        button.addEventListener('click', () => {
            showPage(lastPage, 'prev');
            // Clear text areas for good UX if they navigate back
            const noReason = document.querySelector('#noPath textarea');
            const yesReason = document.querySelector('#yesPath textarea');
            if(noReason) noReason.value = '';
            if(yesReason) yesReason.value = '';
        });
    });

    // Handle Yes/No button clicks on the last page
    yesBtn.addEventListener('click', () => {
        showPage(yesPath, 'next');
    });

    noBtn.addEventListener('click', () => {
        showPage(noPath, 'next');
    });
});