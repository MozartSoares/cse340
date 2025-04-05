function initializePasswordToggle() {
  const showPasswordButton = document.getElementById("show-password");
  if (!showPasswordButton) return;

  showPasswordButton.addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPasswordButton.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      showPasswordButton.textContent = "Show Password";
    }
  });
}
