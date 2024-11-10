document.addEventListener('DOMContentLoaded', () => {
    const offersContainer = document.getElementById('offers-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const offerCards = document.querySelectorAll('.offer-card');

    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = offerCards[0].offsetWidth + 10; // Card width + gap
        offersContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Disable buttons if at the ends
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= Math.ceil(offerCards.length / 3) - 1; // Adjust based on visible cards
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < Math.ceil(offerCards.length / 3) - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Initial setup
    updateSlider();
});
