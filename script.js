document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Send form data to the API
    fetch('https://hook.us1.make.com/um8bvzhfnhd3v1ynrfv7rf2teb08aes7', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            document.getElementById('responseMessage').innerText = 'Thank you for your message!';
        })
        .catch(error => {
            // Handle any errors
            document.getElementById('responseMessage').innerText = 'Thank you for your message!';
            console.error('Error:', error);
        });
});
