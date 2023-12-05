
let generatedOTP
function sendOTP(event) {
    event.preventDefault();
    const sendOTPLink = document.getElementById('send-otp');
    sendOTPLink.style.display = 'none';

    const phone = document.getElementById('phone').value;
    if (!isValidPhoneNumber(phone)) {
        displayErrorMessage('Please enter a valid phone number.', 'phone-error');
        sendOTPLink.style.display = 'block';  
        return;
    }

    countdown = 60;  
    updateCountdownDisplay();
    countdownInterval = setInterval(updateCountdown, 1000);

    fetch(`/send_otp?phone=${phone}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 409) {
                    showUserExistsMessage();
                }
                throw new Error('Failed to send OTP. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            showNotification(data.message, false);

            // Show the OTP field after sending OTP
            document.getElementById('otp-field').style.display = 'block';

            generatedOTP = data.generatedOTP;
        })
        .catch(error => {
            console.error('Error sending OTP:', error.message);
            showNotification('Failed to send OTP. Please try again.', true);
            clearInterval(countdownInterval);
            sendOTPLink.style.display = 'block';
        });
}


document.addEventListener('DOMContentLoaded', () => {
    const fields = ['name', 'email', 'password', 'phone', 'otp'];

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

function validateForm() {
    // Reset previous error messages
    resetErrorMessages();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const enteredOTP = document.getElementById('otp').value;

    let isValid = true;

    if (name.trim() === '') {
        displayErrorMessage('Please enter your name.', 'name-error');
        isValid = false;
    }

    if (email.trim() === '' || !isValidEmail(email)) {
        displayErrorMessage('Please enter a valid email address.', 'email-error');
        isValid = false;
    }

    if (password.trim() === '' || !isValidPassword(password)) {
        displayErrorMessage('Please enter a valid password.', 'password-error');
        isValid = false;
    }

    if (confirmPassword.trim() === '' || !isValidPassword(confirmPassword)) {
        displayErrorMessage('Please confirm your password.', 'confirmPassword-error');
        isValid = false;
    } else if (confirmPassword !== password) {
        displayErrorMessage('Passwords do not match.', 'confirmPassword-error');
        isValid = false;
    }

    if (phone.trim() === '' || !isValidPhoneNumber(phone)) {
        displayErrorMessage('Please enter a valid phone number.', 'phone-error');
        isValid = false;
    }

    if (enteredOTP.trim() === '' || !isValidOtp(enteredOTP)) {
        displayErrorMessage('Please enter valid OTP.', 'otp-error');
        isValid = false;
    }

    if (generatedOTP === undefined || enteredOTP !== generatedOTP.toString()) {
        displayErrorMessage('Invalid OTP. Please try again.', 'otp-error');
        isValid = false;
    }

    if (isValid) {
        return true;
    } else {
        return false;
    }
}


setTimeout(()=>{
    const marquee = document.getElementById('marquee')
    marquee.innerHTML=''
}, 4000);


function displayErrorMessage(message, targetId) {
    const errorElement = document.getElementById(targetId);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}

function clearErrorMessage(targetId) {
    const errorElement = document.getElementById(targetId);
    errorElement.textContent = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^.{6,}$/;
    return passwordRegex.test(password);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(phone);
}

function isValidOtp(otp) {
    const phoneRegex = /^\d{6}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(otp);
}
function updateCountdown() {
    countdown--;
    updateCountdownDisplay();

    if (countdown === 0) {
        clearInterval(countdownInterval);
        const sendOTPLink = document.getElementById('send-otp');
        sendOTPLink.style.display = 'block';  // Enable the button after the countdown
        const countdownDisplay = document.getElementById('countdown-display');
        countdownDisplay.innerText = ``;
    }
}

function updateCountdownDisplay() {
    const countdownDisplay = document.getElementById('countdown-display');
    countdownDisplay.innerText = `Resend OTP in ${countdown} seconds`;
}

function resetErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.innerText = message;

    // Add appropriate classes based on error status
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }

    // Show the notification
    notification.classList.remove('hidden');
    notification.classList.add('show');

    // Hide the notification after 2 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('show');
    }, 2000);
}
