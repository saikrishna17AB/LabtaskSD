let images = [];
let currentImage = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Upload images
async function uploadImages() {
    const input = document.getElementById("imageInput");
    const files = input.files;

    const formData = new FormData();

    for (let file of files) {
        formData.append("images", file);
    }

    const res = await fetch("http://localhost:5000/api/project/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    images = data.images;

    displayImageList();
}

// Show images in sidebar
function displayImageList() {
    const list = document.getElementById("imageList");
    list.innerHTML = "";

    images.forEach((img, index) => {
        const div = document.createElement("div");
        div.className = "image-item";
        div.innerText = img.name;

        div.onclick = () => loadImage(index);

        list.appendChild(div);
    });
}

// Load selected image
function loadImage(index) {
    const imgData = images[index];

    const img = new Image();
    img.src = `data:${imgData.type};base64,${imgData.data}`;

    currentImage = imgData;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
    };

    document.getElementById("imageTitle").innerText = imgData.name;
}

// Placeholder (next step)
function saveBox() {
    alert("Bounding box saving coming next 🔥");
}

// Download CSV
function downloadCSV() {
    window.open("http://localhost:5000/api/project/download");
}