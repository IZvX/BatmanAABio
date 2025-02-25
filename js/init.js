// Variables to control the randomization range
const rotationRange = { min: -1.7, max: 1.7 }; // Rotation range in degrees
const scaleRange = { min: .95, max: 1.1 }; // Scale range (0.5 to 2)

// Function to randomize rotation and scale
function randomizeBioFrames() {
    // Select all elements with the class 'bio-frame'
    const bioFrames = document.querySelectorAll('.bio-frame');
    
    bioFrames.forEach(bioFrame => {
        // Generate random rotation within the specified range
        const randomRotation = Math.floor(Math.random() * (rotationRange.max - rotationRange.min + 1)) + rotationRange.min;
        
        // Generate random scale within the specified range
        const randomScale = (Math.random() * (scaleRange.max - scaleRange.min)) + scaleRange.min;

        // Apply the random rotation and scale
        bioFrame.style.transform = `rotate(${randomRotation}deg) scale(${randomScale})`;
    });
}

// Function to randomize background image for bio-frames
function randomizeBackground() {
    // Select all elements with the class 'bio-frame'
    const bioFrames = document.querySelectorAll('.bio-frame');
    
    bioFrames.forEach(bioFrame => {
        // Create an array of possible background images
        const backgrounds = [
            'imgs/FrameBioAngle=1.7deg.png',
            'imgs/FrameBio2.png',
            'imgs/FrameBio3.png'
        ];

        // Randomly select one of the backgrounds from the array
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        // Apply the random background image
        bioFrame.style.backgroundImage = `url(${randomBackground})`;
    });
}


window.onload = function () {
    randomizeBioFrames();
    randomizeBackground();

    const frames = Array.from(document.querySelectorAll('.frame-scroll .frame'));
    const initialZindex = 55;

    function updateFrames() {
        frames.forEach((frame, index) => {
            // Set z-index with a smooth transition effect
            requestAnimationFrame(() => {
                frame.style.zIndex = initialZindex - index;
            });

            const brightnessValue = 1 - (index * 0.2); // Reduce brightness progressively
            frame.style.transition = 'transform 0.7s ease, filter 0.7s ease';

            // Apply transform based on new order
            frame.style.transform = `translateY(calc(-${index * 50}px + 50%)) translateX(${index * 25}px)`;
            frame.style.filter = `brightness(${brightnessValue})`;

            // Enable click only for the front card
            if (index === 0) {
                frame.style.pointerEvents = 'auto';
                frame.style.userSelect = 'none';
            } else {
                frame.style.pointerEvents = 'none';
                frame.style.userSelect = 'none';
            }
        });
    }

    updateFrames();

    frames.forEach((frame) => {
        frame.addEventListener('click', function () {
            const clickedIndex = frames.indexOf(frame);

            // Move clicked frame to the right with animation
            frame.style.transition = 'transform 0.4s ease-in-out';
            frame.style.transform += ` translateX(200px)`;

            // Shift other frames forward **while** the clicked frame is moving
            frames.forEach((otherFrame, i) => {
                if (i !== clickedIndex) {
                    otherFrame.style.transition = 'transform 0.6s ease-in-out';
                    otherFrame.style.transform = `translateY(calc(-${(i - 1) * 50}px + 50%)) translateX(${(i - 1) * 25}px)`;
                }
            });

            setTimeout(() => {
                // Move clicked frame to the back of the stack
                frames.splice(clickedIndex, 1);
                frames.push(frame);

                // Reset position before reordering
                frame.style.transition = 'none';
                updateFrames(); // Reapply transformations smoothly

            }, 400); // Wait for the rightward animation before reordering
        });
    });
};
