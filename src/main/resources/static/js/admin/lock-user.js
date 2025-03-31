import { showMessage, showError, hideError, clearErrors } from "/js/shared.js";

document.addEventListener("DOMContentLoaded", () => {
    const lockUserForm = document.querySelector("#lockUserForm");

    lockUserForm.addEventListener("submit", (event) => handleLockUser(event));
});

async function handleLockUser(event) {
    event.preventDefault();
    const lockUserForm = document.querySelector("#lockUserForm");
    const emailInput = document.querySelector("#email");
    const lockButton = document.querySelector("#lockButton");
    const globalError = document.querySelector("#responseMessage");

    lockButton.disabled = true;
    clearErrors();

    const email = emailInput.value.trim();
    if (!email) {
        showError(emailInput.parentElement.querySelector(".form-text"), "Email is required.");
        lockButton.disabled = false;
        return;
    }

    const payload = { email: email };

    console.log("Locking user with email:", email);

    try {
        const response = await fetch(lockUserForm.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [document.querySelector("meta[name='_csrf_header']").content]:
                document.querySelector("meta[name='_csrf']").content,
            },
            body: JSON.stringify(payload),
        });
        console.log("response:", response);
        const data = await response.json();
        if (response.ok) {
            showMessage(globalError, data.message, "alert-success");
        } else {
            const errorMessage = data.messages?.join(" ") || "Failed to lock user.";
            showMessage(globalError, errorMessage, "alert-danger");
        }
    } catch (error) {
        console.error("Request failed:", error);
        showMessage(globalError, "An unexpected error occurred. Please try again later.", "alert-danger");
    } finally {
        lockButton.disabled = false;
    }
}
