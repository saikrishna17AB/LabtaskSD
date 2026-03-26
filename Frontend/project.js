const API = "http://localhost:5000/api/projects";

async function loadProjects() {
    const res = await fetch(API);
    const projects = await res.json();

    const list = document.getElementById("projectList");
    list.innerHTML = "";

    projects.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.description || "No description"}</p>

            <button onclick="openProject('${p._id}')">Open</button>
            <button class="delete" onclick="deleteProject('${p._id}')">Delete</button>
        `;

        list.appendChild(div);
    });
}

function openProject(id) {
    localStorage.setItem("projectId", id);
    window.location.href = "dashboard.html";
}

async function createProject() {
    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDesc").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    });

    closeModal();
    loadProjects();
}

async function deleteProject(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadProjects();
}

function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function logout() {
    window.location.href = "login.html";
}

// Replace the loose function calls at the bottom with this:
window.onload = () => {
    // Only run project list logic if we are on the Projects page
    if (document.getElementById("projectList")) {
        loadProjects();
    }

    // Only run image/canvas logic if we are on the Dashboard page
    if (document.getElementById("canvas")) {
        loadImages();
    }
};


async function saveImage() {
    if (!currentImageId) return alert("No image selected!");

    const payload = {
        imageId: currentImageId,
        boxes: currentImage.boxes // This contains all boxes drawn on the current image
    };

    try {
        const response = await fetch("http://localhost:5000/api/projects/save-annotations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Annotations saved successfully to database!");
        } else {
            alert("Error saving annotations.");
        }
    } catch (error) {
        console.error("Save Error:", error);
    }
}


async function downloadCSV() {
    const projectId = localStorage.getItem("projectId");
    
    if (!projectId) {
        return alert("No project selected!");
    }

    // Instead of a fetch, we use window.location.href to trigger a browser download
    // This works because the backend will send a file with 'Content-Disposition: attachment'
    window.location.href = `http://localhost:5000/api/projects/export/${projectId}`;
}

// Add this to your dashboard.html UI
// <button onclick="saveImage()" class="save-btn">Save Annotations</button>