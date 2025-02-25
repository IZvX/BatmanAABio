// Get all bio-frame containers
const containers = document.querySelectorAll('.bio-frame-container');
const nameFrame = document.getElementById('name-frame');
const nameFrameLabel = document.getElementById('name');

// Add event listeners for hover effects
containers.forEach(container => {
    container.addEventListener('mouseenter', () => {
    });
    container.addEventListener('mouseleave', () => {
        // Hide the name-frame after animation finishes
        // nameFrame.style.opacity = 0;
    });
});
