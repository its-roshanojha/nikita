document.addEventListener('DOMContentLoaded', function () {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (formData && bookingDetails && userData) {
        // Update the car type
        document.querySelector('.details-section .fa-car + span').textContent = bookingDetails.cabType; 
        document.querySelector('#tripType').textContent = 'Trip Type: '+formData.tripType ; 

        // Update the pickup date and time
        document.querySelector('.date-time span:nth-child(2)').textContent = formData.pickup_date;
        document.querySelector('.date-time span:nth-child(4)').textContent = formData.pickup_time;

        // Update pickup and dropoff locations
        document.querySelector('.pickup-dropoff-section .summary-item:nth-child(1) span:nth-child(3)').textContent = formData.source;
        document.querySelector('.pickup-dropoff-section .summary-item:nth-child(2) span:nth-child(3)').textContent = formData.destination;

        // Update traveler information
        document.querySelector('.details-section .fa-user + span').textContent = userData.name;
        document.querySelector('.details-section .traveler-contact span:nth-child(1)').textContent = userData.email;
        document.querySelector('.details-section .traveler-contact span:nth-child(3)').textContent = '+91-'+userData.contactNumber;

        // Fare details
        document.querySelector('#total-fare').textContent = bookingDetails.price; 
        document.querySelector('#final-fare').textContent = bookingDetails.price; 

    }
});
