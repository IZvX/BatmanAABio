const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.style.width = '100%';
canvas.style.height = '100%';
// === Control Variables ===
const settings = {
    totalPoints: 64,      // Number of points in the visualizer
    movementSpeed: 5,   // How fast the line moves
    maxJitter: 9,        // Maximum pixel movement per frame
    maxHeight: 30,
    smoothness: 0.9,      // Blends new movement for smoothness
    lineWidth: 3,       // Line thickness
    lineColor: "#FFF", // Line color
};

// === Initialize Points at Midline ===
const points = new Array(settings.totalPoints).fill(canvas.height / 2);

// === Update Randomized Points ===
function update() {
    for (let i = 0; i < points.length; i++) {
        let randomShift
        if (!audio.paused) {
            randomShift = (Math.random() - 0.5) * settings.maxJitter * settings.maxHeight;
        } else {
            randomShift = (Math.random() - 0.5) * settings.maxJitter * 0;

        }
        points[i] = points[i] * settings.smoothness + (canvas.height / 2 + randomShift) * (1 - settings.smoothness);
    }
}

// === Draw Function ===
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, points[0]);

    for (let i = 1; i < points.length; i++) {
        let x = (i / (settings.totalPoints - 1)) * canvas.width;
        ctx.lineTo(x, points[i]);
    }

    ctx.strokeStyle = settings.lineColor;
    ctx.lineWidth = settings.lineWidth;
    ctx.stroke();
}

// === Animation Loop ===
function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

// === Modal for Live Controls ===
function createModal() {
    const modal = document.createElement("div");
    modal.style = `
position: fixed;
top: 20px; right: 20px;
background: rgba(0, 0, 0, 0.85);
padding: 15px;
border-radius: 10px;
z-index: 1000;
color: white;
font-family: Arial;
width: 220px;
`;

    const controls = [
        { label: "Speed", prop: "movementSpeed", min: 0.1, max: 5, step: 0.1 },
        { label: "Max Jitter", prop: "maxJitter", min: 1, max: 30, step: 1 },
        { label: "Max Height", prop: "maxHeight", min: 1, max: 30, step: 1 },
        { label: "Smoothness", prop: "smoothness", min: 0.1, max: 0.9, step: 0.05 },
        { label: "Line Width", prop: "lineWidth", min: 1, max: 10, step: 0.5 }
    ];

    controls.forEach(({ label, prop, min, max, step }) => {
        const wrapper = document.createElement("div");
        wrapper.style = "margin-bottom: 10px;";

        const text = document.createElement("span");
        text.innerText = `${label}: ${settings[prop]}`;

        const range = document.createElement("input");
        range.type = "range";
        range.min = min;
        range.max = max;
        range.step = step;
        range.value = settings[prop];

        // **Live Update**
        range.oninput = () => {
            settings[prop] = parseFloat(range.value);
            text.innerText = `${label}: ${settings[prop]}`;
        };

        wrapper.appendChild(text);
        wrapper.appendChild(document.createElement("br"));
        wrapper.appendChild(range);
        modal.appendChild(wrapper);
    });

    document.body.appendChild(modal);
}


// === Initialize ===
// createModal();
animate();

const tapes = document.querySelectorAll('.tape');

tapes.forEach(tape => {
    tape.addEventListener('click', (e) => {
        // Prevent any parent click handlers
        e.stopPropagation();

        // Get the audio element
        const audio = document.getElementById('audio');
        const audioSource = tape.getAttribute('tapepath');
        const audioName = tape.getAttribute('tapename');

        // Check if this tape is already playing
        if (tape.classList.contains('playing')) {
            // Pause the audio and remove the 'playing' class
            audio.pause();
            tape.classList.remove('playing');
            return; // Stop further execution
        }

        // Remove the 'playing' class from all tapes
        tapes.forEach(t => {
            t.classList.remove('playing');
        });

        // Add the 'playing' class to the clicked tape
        tape.classList.add('playing');

        // Set the audio source and play the audio
        audio.src = audioSource;
        audio.load();
        audio.play();
    });
});

