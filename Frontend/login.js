let isLogin = true;
function toggleMode() {
    isLogin = !isLogin;

    const title = document.getElementById("title");
    const button = document.querySelector("button");
    const toggleText = document.getElementById("toggleText");

    if (isLogin) {
        title.innerText = "Login";
        button.innerText = "Login";
        toggleText.innerHTML = `Don't have an account? 
            <span id="toggleLink">Register</span>`;
    } else {
        title.innerText = "Register";
        button.innerText = "Register";
        toggleText.innerHTML = `Already have an account? 
            <span id="toggleLink">Login</span>`;
    }

    // 🔥 Re-attach click event AFTER updating HTML
    document.getElementById("toggleLink").addEventListener("click", toggleMode);
}
async function handleAuth() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const endpoint = isLogin ? "login" : "register";

    try {
        const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            if (isLogin) {
                alert("Login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert("Registered successfully! Now login.");
                toggleMode();
            }
        } else {
            alert(data.message || "Error occurred");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}