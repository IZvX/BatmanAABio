const lines = document.getElementById('lines');
const lineright = lines.querySelector('.linex1');
const lineleft = lines.querySelector('.linex2');
let previousHoveredElement = null;
let previousNeighbors = {}; // Store previous neighbors to reset the background
const nameFrame = document.getElementById('name-frame');

let currentHoveredIndex = null;
const gridItems = document.querySelectorAll('.bio-frame-container');
const totalColumns = 7; // 7 items per row

document.addEventListener("mousemove", (event) => {
    let hoveredElement = document.elementFromPoint(event.clientX, event.clientY);

    // Find closest .bio-frame-container
    while (hoveredElement && !hoveredElement.classList.contains('bio-frame-container')) {
        hoveredElement = hoveredElement.parentElement;
    }

    if (hoveredElement) {
        handleHover(hoveredElement);
    }
});

let cooldown = false;  // Declare cooldown outside the event listener so it persists

document.addEventListener("keydown", (event) => {
    if (cooldown) return;  // Skip if cooldown is active

    const key = event.key;

    // Handle navigation via arrow keys
    let newHoveredIndex = currentHoveredIndex;
    if (key === 'ArrowRight') {
        newHoveredIndex = currentHoveredIndex + 1; // Move right
    } else if (key === 'ArrowLeft') {
        newHoveredIndex = currentHoveredIndex - 1; // Move left
    } else if (key === 'ArrowUp') {
        newHoveredIndex = currentHoveredIndex - totalColumns; // Move up
    } else if (key === 'ArrowDown') {
        newHoveredIndex = currentHoveredIndex + totalColumns; // Move down
    }

    // If Enter is pressed, simulate a click on the hovered element
    else if (key === 'Enter') {
        const hoveredElement = gridItems[currentHoveredIndex];
        if (hoveredElement) {
            hoveredElement.click();  // Trigger the click function
        }
    }

    // If Escape is pressed, close the infopage
    else if (key === 'Escape') {
        closeInfoPage(); // Call a function to close the info page
    }

    // Check if newHoveredIndex is valid
    if (newHoveredIndex >= 0 && newHoveredIndex < gridItems.length) {
        const newHoveredElement = gridItems[newHoveredIndex];
        handleHover(newHoveredElement);

        // Activate cooldown
        cooldown = true;
        setTimeout(() => {
            cooldown = false; // Reset cooldown after 300ms
        }, 210);
    }
});




// Helper function to handle hover state and positioning of lines
function handleHover(hoveredElement) {
    let rect = hoveredElement.getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2;

    // Set lines' position relative to hovered element
    lines.style.position = "absolute";

    if (previousHoveredElement && previousHoveredElement !== hoveredElement) {
        resetElement(previousHoveredElement);
        document.body.appendChild(lines); // Move lines back to body if no longer hovered
    }

    document.getElementById('name').textContent = hoveredElement.getAttribute('name');
    nameFrame.style.animation = "switch .2s linear";

    hoveredElement.appendChild(lines);

    hoveredElement.style.position = "relative";
    hoveredElement.style.zIndex = "100";

    lines.style.zIndex = "5";
    lines.style.rotate = "1.7deg";

    if (!hoveredElement.querySelector('.selected')) {
        const selectedDiv = document.createElement('div');
        selectedDiv.classList.add('selected');
        hoveredElement.appendChild(selectedDiv);
    }

    const bioFrame = hoveredElement.querySelector('.bio-frame');
    if (bioFrame) {
        bioFrame.classList.add('selected-bio');
    }

    currentHoveredIndex = Array.from(gridItems).indexOf(hoveredElement);
    updateLineVisibility();
    previousHoveredElement = hoveredElement;
}

function updateLineVisibility() {
    const neighbors = getNeighbors(currentHoveredIndex);
    if (!neighbors.right) {
        lineright.style.display = 'none';
    } else {
        lineright.style.display = 'block';
    }

    if (!neighbors.left) {
        lineleft.style.display = 'none';
    } else {
        lineleft.style.display = 'block';
    }
}

function getNeighbors(index) {
    return {
        top: index - totalColumns >= 0 ? gridItems[index - totalColumns] : null,
        bottom: index + totalColumns < gridItems.length ? gridItems[index + totalColumns] : null,
        left: index % totalColumns !== 0 ? gridItems[index - 1] : null,
        right: index % totalColumns !== totalColumns - 1 ? gridItems[index + 1] : null,
    };
}

// Reset hover styles for an element
function resetElement(element) {
    element.style.zIndex = "5";
    element.style.backgroundColor = "";
    element.querySelector('.selected').remove();
    Object.values(previousNeighbors).forEach(neighbor => {
        if (neighbor) {
            neighbor.style.backgroundColor = "";
        }
    });

    const prevBioFrame = element.querySelector('.bio-frame');
    if (prevBioFrame) {
        prevBioFrame.classList.remove('selected-bio');
    }
}

nameFrame.addEventListener('animationend', () => {
    nameFrame.style = '';

})

// Get the JSON data from the script tag
let characterData = null;

// Add event listeners to bio-frame-container elements
document.querySelectorAll('.bio-frame-container').forEach(item => {
    item.addEventListener('click', function () {
        characterData = JSON.parse(document.getElementById('characterData').textContent);
        const infoId = this.getAttribute('info_id'); // Get info_id from clicked element
        logCharacterData(infoId); // Display the corresponding bio data
    });
});

function logCharacterData(info_id) {
    document.getElementById('infopage').style.display = 'block'; // Show the info page

    const character = characterData[info_id];
    if (character) {
        // Set character info
        document.getElementById('info-name').textContent = character.info.name;
        document.getElementById('info-imgpath').src = `imgs/bioCharacters/bio_${info_id}.png`; // Image path

        // Set Story
        document.getElementById('info-story').textContent = character.story;

        // Set Attributes
        const attributesContainer = document.querySelector('.attribute-list');
        attributesContainer.innerHTML = ''; // Clear the existing list before adding new items
        character.attributes.forEach(attribute => {
            const attributeDiv = document.createElement('div');
            attributeDiv.classList.add('attribute');
            attributeDiv.innerHTML = `<img src="imgs/Arrow.png" alt=""> ${attribute}`;
            attributesContainer.appendChild(attributeDiv);
        });

        // Set Facts
        const factsContainer = document.querySelector('.fact-list');
        factsContainer.innerHTML = ''; // Clear the existing facts before adding new ones
        Object.entries(character.facts).forEach(([label, value]) => {
            const factDiv = document.createElement('div');
            factDiv.classList.add('attribute');
            factDiv.innerHTML = `<div class="label">${label}</div> ${value}`;
            factsContainer.appendChild(factDiv);
        });

        // Log character info
        console.log('Character Info:', character.info);
        console.log('Attributes:', character.attributes);
        console.log('Story:', character.story);
        console.log('Facts:', character.facts);


        // Check and log tapes data if available
        if (character.tapes && character.tapes.length > 0) {
            const tapesPanel = document.getElementById('tape-name').parentElement;
            tapesPanel.innerHTML = `
            <div class="title">Patient Interviews</div>
                <div class="attribute-list">
                    <div class="attribute" id="tape-name"></div>
                    <div class="tapes">
                        <div class="attribute" id="tape-name">${character.tapes[0].name}</div>
                        <div class="tapes">
                            <div class="tape playing" id="tape" tapename="${character.tapes[0].name}"
                                tapepath="audio/patientInterview/Joker-1.mp3">
                                <div class="frame-1"></div>
                                <div class="frame-2"></div>
                            </div>
                            <div class="tape" id="tape" tapename="${character.tapes[1].name}"
                                tapepath="audio/patientInterview/Joker-1.mp3">
                                <div class="frame-1"></div>
                                <div class="frame-2"></div>
                            </div>
                            <div class="tape" id="tape" tapename="${character.tapes[2].name}"
                                tapepath="audio/patientInterview/Joker-1.mp3">
                                <div class="frame-1"></div>
                                <div class="frame-2"></div>
                            </div>
                            <div class="tape" id="tape" tapename="${character.tapes[3].name}"
                                tapepath="audio/patientInterview/Joker-1.mp3">
                                <div class="frame-1"></div>
                                <div class="frame-2"></div>
                            </div>
                            <div class="tape" id="tape" tapename="${character.tapes[4].name}"
                                tapepath="audio/patientInterview/Joker-1.mp3">
                                <div class="frame-1"></div>
                                <div class="frame-2"></div>
                            </div>
                        </div>

                        <div class="voice-grid">
                            <canvas id="visualizer"></canvas>
                            <audio id="audio">
                            </audio>
                            <div class="subs" id="subs"></div>
                        </div>
                    </div>
                </div>
            `;
            console.log('Tapes:', character.tapes);
        } else {
            console.log('No tapes available.');
        }
    } else {
        console.log('Character not found.');
    }
}

// Function to close the info page
function closeInfoPage() {
    const infoPage = document.getElementById('infopage');
    if (infoPage) {
        infoPage.style.display = 'none';  // Hide the info page
    }
}
