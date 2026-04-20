document.addEventListener("DOMContentLoaded", function () {

    const saveBtn = document.getElementById("saveBtn");

    
    function updateInitials() {
        const first = document.getElementById("firstName").value.charAt(0) || "";
        const last = document.getElementById("lastName").value.charAt(0) || "";
        document.getElementById("profileCircle").innerText = (first + last).toUpperCase();
    }

    document.getElementById("firstName").addEventListener("input", updateInitials);
    document.getElementById("lastName").addEventListener("input", updateInitials);

    saveBtn.addEventListener("click", function () {

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const unit = document.getElementById("unit").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        if (!firstName || !lastName || !email || !phone || !unit) {
            message.innerText = "Please fill in all fields!";
            message.style.color = "red";
            return;
        }

        if (password.length < 6) {
            message.innerText = "Password must be at least 6 characters!";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.innerText = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        message.innerText = "Changes saved successfully!";
        message.style.color = "green";
    });

});