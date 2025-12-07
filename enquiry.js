document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        formStatus.textContent = '';
        clearErrors();

        if (validateForm()) {
            const formData = new FormData(form);
            
            // Show a "loading" message
            formStatus.style.color = 'gray';
            formStatus.textContent = 'Sending message...';

            try {
                // Send the form data asynchronously to the PHP script
                const response = await fetch('submit.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json(); // PHP returns a JSON response

                if (result.success) {
                    formStatus.style.color = 'green';
                    formStatus.textContent = result.message;
                    form.reset(); // Clear form on success
                } else {
                    formStatus.style.color = 'red';
                    formStatus.textContent = result.message || 'An unknown error occurred.';
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formStatus.style.color = 'red';
                formStatus.textContent = 'Network error. Could not connect to the server.';
            }
        } else {
            formStatus.style.color = 'red';
            formStatus.textContent = 'Please correct the errors and try again.';
        }
    });

    // --- Validation Functions (Same as before) ---

    function clearErrors() {
        // ... (function body remains the same as previous script.js)
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('subjectError').textContent = '';
        document.getElementById('messageError').textContent = '';
    }

    function isValidEmail(email) {
        // Basic regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name.length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters.';
            isValid = false;
        }
        if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        }
        if (subject.length < 5) {
            document.getElementById('subjectError').textContent = 'Subject must be at least 5 characters.';
            isValid = false;
        }
        if (message.length < 10) {
            document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
            isValid = false;
        }
        return isValid;
    }
});