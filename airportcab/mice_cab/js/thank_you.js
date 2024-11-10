document.addEventListener('DOMContentLoaded', function () {
    function truncateText(text, limit) {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    }

    function formatDate(dateString) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    function formatTime(timeString) {
        let [hours, minutes] = timeString.split(':'); 
        hours = parseInt(hours); 
    
        const ampm = hours >= 12 ? 'PM' : 'AM'; 
        hours = hours % 12 || 12; 
        return `${hours}:${minutes} ${ampm}`; 
    }

    function populateCabDetails() {
        const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
        const formData = JSON.parse(sessionStorage.getItem('formData'));
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const cabRegistration = JSON.parse(sessionStorage.getItem('cabRegistration'));

        const formattedDate = formatDate(formData.pickup_date);
        const formattedTime = formatTime(formData.pickup_time);
        const distance = formData.distance; 
        const averageSpeed = 40; 
        const timeTakenInHours = distance / averageSpeed; 
        const hours = Math.floor(timeTakenInHours);
        const minutes = Math.round((timeTakenInHours - hours) * 60); 

        // Check if bookingDetails is not null
        document.querySelector('#partner_name').innerText = bookingDetails.partnerName;
        document.querySelector('.rating-value').innerText = bookingDetails.rating + "/5";
        document.querySelector('.rating-count').innerText = `(${bookingDetails.reviews} ratings)`;
        document.querySelector('.car-features').innerText = `${bookingDetails.cabType} • AC • ${bookingDetails.seats} Seats • ${formData.distance.toFixed(1)} kms`;
        document.querySelector('.car-image').src = bookingDetails.image;


        document.querySelector('#trip-type').innerText = formData.tripType;
        document.querySelector('#distance').innerText = `${formData.distance.toFixed(1)} kms`;


        document.querySelector('#pickup-address').innerText = truncateText(formData.source, 25);
        document.querySelector('#sub-pickup-address').innerText = formData.source;


        document.querySelector('#sub-dropoff-address').innerText =  truncateText(formData.destination, 25);
        document.querySelector('#dropoff-address').innerText = formData.destination;

        document.querySelector('#time-taken').innerText = `${hours} hrs ${minutes} mins`;

        document.querySelector('#pickup-date').innerText = `${formattedDate}`;
        document.querySelector('#pickup-time').innerText = `${formattedTime}`;

        document.querySelector('#user-name').innerHTML = `${userData.name}`
        document.querySelector('#user-email-header').innerHTML = `'<strong>${userData.email}'</strong>`
        document.querySelector('#user-email').innerHTML = `${userData.email}`
        document.querySelector('#user-phone').innerHTML = '+91 -' + `${userData.contactNumber}`
        document.querySelector('#user-phone-header').innerHTML = '<strong>+91 -' + `${userData.contactNumber}</strong>`

        document.querySelector('#total-fare').innerHTML = `${bookingDetails.price}`
        document.querySelector('#booking_id').innerHTML = `${formData.mac_address}`

        console.log(cabRegistration);


    }

    populateCabDetails();
});
