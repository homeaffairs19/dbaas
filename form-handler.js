document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registration-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent form from submitting the traditional way

        let formData = new FormData(form);
        let data = {};

        // Convert FormData to plain JavaScript object
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send the form data to the backend
        fetch('http://localhost:5000/register', {  // Correct backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registration successful!');
                form.reset();  // Reset form after success
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error in registration');
        });
        
    });
});
