// let images = [];
// let currentImage = null;
// let currentImageId = null;

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// let startX, startY, isDrawing = false;

// // Load project images
// // 1. Create one global image object to hold the "active" image
// let activeImageElement = new Image();

// function loadImage(index) {
//     const imgData = images[index];
//     currentImageId = imgData._id;
//     currentImage = imgData;

//     // Set the source
//     activeImageElement.src = `data:${imgData.type};base64,${imgData.data}`;

//     // Only once the image is ready, set the canvas size and draw
//     activeImageElement.onload = () => {
//         canvas.width = activeImageElement.width;
//         canvas.height = activeImageElement.height;
//         renderAll(); // Use a centralized drawing function
//     };

//     document.getElementById("imageTitle").innerText = imgData.name;
// }

// // 2. Optimized render function (No 'new Image()' inside here!)
// function renderAll() {
//     if (!activeImageElement.src) return;
    
//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // Draw the background image
//     ctx.drawImage(activeImageElement, 0, 0);
//     // Draw all saved boxes
//     currentImage.boxes.forEach(drawSavedBox);
// }

// // 3. Update your MouseMove to use renderAll
// canvas.addEventListener("mousemove", (e) => {
//     if (!isDrawing) return;
    
//     renderAll(); // Redraw image and old boxes
    
//     // Draw the "active" blue box currently being dragged
//     ctx.strokeStyle = "blue";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
// });

// function displayImageList() {
//     const list = document.getElementById("imageList");
//     list.innerHTML = "";

//     images.forEach((img, index) => {
//         const div = document.createElement("div");
//         div.className = "image-item";
//         div.innerText = img.name;

//         div.onclick = () => loadImage(index);

//         list.appendChild(div);
//     });
// }

// function loadImage(index) {
//     const imgData = images[index];
//     currentImageId = imgData._id;

//     const img = new Image();
//     img.src = `data:${imgData.type};base64,${imgData.data}`;

//     currentImage = imgData;

//     img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;

//         ctx.drawImage(img, 0, 0);
//         imgData.boxes.forEach(drawSavedBox);
//     };

//     document.getElementById("imageTitle").innerText = imgData.name;
// }

// function drawSavedBox(box) {
//     ctx.strokeStyle = "red";
//     ctx.strokeRect(box.x, box.y, box.width, box.height);
//     ctx.fillText(box.label, box.x, box.y - 5);
// }

// // Mouse events
// canvas.addEventListener("mousedown", (e) => {
//     startX = e.offsetX;
//     startY = e.offsetY;
//     isDrawing = true;
// });

// canvas.addEventListener("mousemove", (e) => {
//     if (!isDrawing) return;

//     const x = e.offsetX;
//     const y = e.offsetY;

//     redrawCanvas();

//     ctx.strokeStyle = "blue";
//     ctx.strokeRect(startX, startY, x - startX, y - startY);
// });

// canvas.addEventListener("mouseup", (e) => {
//     isDrawing = false;

//     const endX = e.offsetX;
//     const endY = e.offsetY;

//     const box = {
//         x: startX,
//         y: startY,
//         width: endX - startX,
//         height: endY - startY
//     };

//     saveBox(box);
// });

// function redrawCanvas() {
//     const img = new Image();
//     img.src = `data:${currentImage.type};base64,${currentImage.data}`;

//     img.onload = () => {
//         ctx.drawImage(img, 0, 0);
//         currentImage.boxes.forEach(drawSavedBox);
//     };
// }

// async function saveBox(box) {
//     const label = document.getElementById("label").value;

//     if (!label) {
//         alert("Enter label!");
//         return;
//     }

//     box.label = label;

//     await fetch("http://localhost:5000/api/projects/box", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             imageId: currentImageId,
//             box
//         })
//     });

//     currentImage.boxes.push(box);
//     redrawCanvas();
// }

// async function uploadImages() {
//     const input = document.getElementById("imageInput");
//     const files = input.files;
//     const projectId = localStorage.getItem("projectId");

//     if (files.length === 0) {
//         alert("Please select a directory first.");
//         return;
//     }

//     const formData = new FormData();
    
//     // Filter to only upload images (jpg, png, etc.)
//     for (let file of files) {
//         if (file.type.startsWith('image/')) {
//             formData.append("images", file);
//         }
//     }

//     formData.append("projectId", projectId);

//     try {
//         const response = await fetch("http://localhost:5000/api/projects/upload", {
//             method: "POST",
//             body: formData // Note: Do NOT set Content-Type header; the browser does it for FormData
//         });

//         if (response.ok) {
//             alert("Upload successful!");
//             loadImages(); // Refresh the list
//         } else {
//             alert("Upload failed.");
//         }
//     } catch (err) {
//         console.error("Upload Error:", err);
//     }
// }

// // INIT ONLY FOR DASHBOARD
// loadImages();





let images = [];
let currentImage = null;
let currentImageId = null;
let activeImageElement = new Image();
let isDrawing = false;
let startX, startY;

const canvas = document.getElementById("canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// --- SHARED LOGIC ---
window.onload = () => {
    if (document.getElementById("projectList")) loadProjects();
    if (document.getElementById("canvas")) loadImages();
};

// --- PROJECT LIST PAGE ---
async function loadProjects() {
    const res = await fetch("http://localhost:5000/api/projects");
    const data = await res.json();
    const list = document.getElementById("projectList");
    list.innerHTML = data.map(p => `
        <div class="card">
            <h3>${p.name}</h3>
            <button onclick="openProject('${p._id}')">Open</button>
        </div>
    `).join('');
}

function openProject(id) {
    localStorage.setItem("projectId", id);
    window.location.href = "dashboard.html";
}

// --- DASHBOARD PAGE ---
async function loadImages() {
    const projectId = localStorage.getItem("projectId");
    const res = await fetch(`http://localhost:5000/api/projects/images/${projectId}`);
    images = await res.json();
    
    const list = document.getElementById("imageList");
    list.innerHTML = images.map((img, i) => `
        <div class="image-item" onclick="loadImage(${i})">${img.name}</div>
    `).join('');

    if (images.length > 0 && !currentImage) loadImage(0);
}

function loadImage(index) {
    currentImage = images[index];
    currentImageId = currentImage._id;
    activeImageElement.src = `data:${currentImage.type};base64,${currentImage.data}`;
    activeImageElement.onload = () => {
        canvas.width = activeImageElement.width;
        canvas.height = activeImageElement.height;
        renderAll();
    };
    document.getElementById("imageTitle").innerText = currentImage.name;
}

function renderAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(activeImageElement, 0, 0);
    currentImage.boxes.forEach(box => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = "red";
        ctx.fillText(box.label, box.x, box.y - 5);
    });
}

// Drawing Events
if (canvas) {
    canvas.onmousedown = (e) => {
        startX = e.offsetX;
        startY = e.offsetY;
        isDrawing = true;
    };

    canvas.onmousemove = (e) => {
        if (!isDrawing) return;
        renderAll();
        ctx.strokeStyle = "blue";
        ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    };

    canvas.onmouseup = (e) => {
        isDrawing = false;
        const label = document.getElementById("label").value;
        if (!label) return alert("Enter a label first!");
        
        const box = {
            label,
            x: startX,
            y: startY,
            width: e.offsetX - startX,
            height: e.offsetY - startY
        };
        saveBox(box);
    };
}

async function saveBox(box) {
    await fetch("http://localhost:5000/api/projects/box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: currentImageId, box })
    });
    currentImage.boxes.push(box);
    renderAll();
}

async function uploadImages() {
    const input = document.getElementById("imageInput");
    const formData = new FormData();
    for (let file of input.files) {
        if (file.type.startsWith('image/')) formData.append("images", file);
    }
    formData.append("projectId", localStorage.getItem("projectId"));

    const res = await fetch("http://localhost:5000/api/projects/upload", {
        method: "POST",
        body: formData
    });
    if (res.ok) loadImages();
}