document.addEventListener('DOMContentLoaded', () => {
    const fields = ['email', 'password'];

    fields.forEach(field => {
        const inputField = document.getElementById(field);
        const errorField = document.getElementById(`${field}-error`);

        inputField.addEventListener('input', () => {
            if (inputField.value.trim() === '') {
                displayErrorMessage(`Please enter your ${field === 'email' ? 'email address' : field}.`, `${field}-error`);
            } else {
                clearErrorMessage(`${field}-error`);
            }
        });
    });
});
function loginValidate(){
    resetErrorMessages();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let isValid = true;
    if (email.trim() === '' || !isValidEmail(email)) {
        displayErrorMessage('Please enter a valid email address.', 'email-error');
        isValid = false;
    }
    if (password.trim() === '' || !isValidPassword(password)) {
        displayErrorMessage('Please enter a valid password.', 'password-error');
        isValid = false;
    }
    if (isValid) return true
    else return false
}
function displayErrorMessage(message, targetId) {
    const errorElement = document.getElementById(targetId);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function resetErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}
function clearErrorMessage(targetId) {
    const errorElement = document.getElementById(targetId);
    errorElement.textContent = '';
}
function isValidPassword(password) {
    const passwordRegex =/^.{6,}$/;
    return passwordRegex.test(password);
}
setTimeout(()=>{
    const marquee = document.getElementById('marquee')
    marquee.innerHTML=''
}, 4000);