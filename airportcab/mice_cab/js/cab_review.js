document.addEventListener('DOMContentLoaded', function () {
    function truncateText(text, limit) {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    }

    const formData = JSON.parse(sessionStorage.getItem('formData'));

    if (formData) {
        const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
        console.log('bookingDetails', bookingDetails)

        if (bookingDetails) {
            const { source, destination, pickup_date, pickup_time, distance } = formData;

            document.querySelector('.source').innerText = truncateText(source, 25);
            document.querySelector('.destination').innerText = truncateText(destination, 25);

            document.querySelector('.one-way').innerText = formData.tripType; // Update trip type (One Way/Round Trip)

            const pickupDateFormatted = new Date(pickup_date + ' ' + pickup_time).toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            document.querySelector('.pickup').innerText = `Pickup: ${pickupDateFormatted}`;

            // Update car details
            document.querySelector('.car-image img').src = bookingDetails.image;
            document.querySelector('.car-info h2').innerText = `${bookingDetails.partnerName}`;
            document.querySelector('.car-info p').innerText = `• ${bookingDetails.cabType} • AC • ${bookingDetails.seats} Seats • ${formData.distance.toFixed(1)} kms included`;
            document.querySelector('.rating strong').innerText = `${bookingDetails.rating}`;
            document.querySelector('.rating-count').innerText = `(${bookingDetails.reviews} ratings)`;
            document.querySelector('#full-payment').innerText = `${bookingDetails.price}`;
            document.querySelector('#total-amount').innerText = `${bookingDetails.price}`;
            document.querySelector('.pay-now-btn').innerText = `PAY ${bookingDetails.price} NOW`;


            document.getElementById('pickup-address').value = source;
            document.getElementById('dropoff-address').value = destination;

            document.querySelector('#list-distance-exclusion').innerText = `${formData.distance.toFixed(1)} kms`;
            document.querySelector('#list-distance-inclusion').innerText = `${formData.distance.toFixed(1)} kms`;

        }
    }
    
    function validateFields() {
        let isValid = true;
        let firstInvalidElement = null;
    
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    
        const nameField = document.getElementById('name');
        if (!nameField.value.trim()) {
            nameField.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-danger';
            errorMessage.textContent = "Name is required.";
            nameField.parentNode.insertBefore(errorMessage, nameField.nextSibling);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = nameField;
            }
        } else {
            nameField.classList.remove('invalid');
        }
    
        const genderChecked = document.querySelector('input[name="gender"]:checked');
        const genderFields = document.querySelectorAll('input[name="gender"]');
        const genderContainer = genderFields[0].closest('.col-md-6');
    
        if (!genderChecked) {
            genderFields.forEach(radio => {
                radio.classList.add('invalid');
            });
    
            const genderErrorMessage = document.createElement('div');
            genderErrorMessage.className = 'error-message text-danger';
            genderErrorMessage.textContent = "Gender is required.";
            genderContainer.appendChild(genderErrorMessage);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = genderContainer;
            }
        } else {
            genderFields.forEach(radio => {
                radio.classList.remove('invalid');
            });
        }
    
        const emailField = document.getElementById('email');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!emailField.value.trim()) {
            emailField.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-danger';
            errorMessage.textContent = "Email Id is required.";
            emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = emailField;
            }
        } else if (!emailPattern.test(emailField.value.trim())) {
            emailField.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-danger';
            errorMessage.textContent = "Please enter a valid email address.";
            emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = emailField;
            }
        } else {
            emailField.classList.remove('invalid');
        }
    
        const contactField = document.getElementById('contact-number');
        const phonePattern = /^\d{10}$/;
    
        if (!contactField.value.trim()) {
            contactField.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-danger';
            errorMessage.textContent = "Contact Number is required.";
            contactField.parentNode.insertBefore(errorMessage, contactField.nextSibling);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = contactField;
            }
        } else if (!phonePattern.test(contactField.value.trim())) {
            contactField.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-danger';
            errorMessage.textContent = "Please enter a valid 10-digit phone number.";
            contactField.parentNode.insertBefore(errorMessage, contactField.nextSibling);
            isValid = false;
    
            if (!firstInvalidElement) {
                firstInvalidElement = contactField;
            }
        } else {
            contactField.classList.remove('invalid');
        }
    
        if (firstInvalidElement) {
            firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    
        return isValid;
    }
    
    document.getElementById('payNowBtn').addEventListener('click', function (event) {
        event.preventDefault();
    
        const isFormValid = validateFields();
        if (isFormValid) {
            const userData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                contactNumber: document.getElementById('contact-number').value.trim(),
                gender: document.querySelector('input[name="gender"]:checked').value
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            // console.log(sessionStorage.getItem('userData'))
            // alert('Form is valid, proceed with payment');window.location.href
            window.location.href = "http://localhost:8963/mice_cab/checkout.html";
            // window.location.href = "https://mice.bookairportcab.com/mice_cab/checkout.html";
        }
    });
    

});


