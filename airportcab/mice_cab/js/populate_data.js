function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function calculateTime(distance, averageSpeed) {
    return (distance / averageSpeed).toFixed(1);
}


function truncateString(str, maxLength = 25) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
    }
    return str;
}


function updateDate() {
    const dateInput = document.getElementById('hidden-date-input').value;
    if (!dateInput) {
        console.error("Date input is empty");
        return;
    }
    
    const dateObj = new Date(dateInput);
    if (isNaN(dateObj)) {
        console.error("Invalid date format: ", dateInput);
        return;
    }

    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: '2-digit'
    });

    document.getElementById('day-part').innerText = formattedDate;
    // console.log("Date updated to: ", formattedDate);
}

// Update the time display
function updateTime() {
    const timeInput = document.getElementById('pickup-time').value;
    const timeParts = timeInput.split(':');
    const date = new Date();
    date.setHours(timeParts[0], timeParts[1]);

    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    document.getElementById('displayed-time').innerText = formattedTime;
    // console.log("Time updated to: ", formattedTime);
}

function populateForm() {
    const storedFormData = sessionStorage.getItem('formData');
    // console.log('populate data', storedFormData);

    if (storedFormData) {
        const formData = JSON.parse(storedFormData);
        if (formData.pickup_date) {
            document.getElementById('hidden-date-input').value = formData.pickup_date;
            updateDate(); 
        }
        
        if (formData.pickup_time) {
            document.getElementById('pickup-time').value = formData.pickup_time;
            updateTime();  
        }
        
        const tripTypeRadios = document.getElementsByName('trip-type');
        tripTypeRadios.forEach(radio => {
            if (radio.id === formData.tripType) {
                radio.checked = true;
                updateForm(formData.tripType);
                document.getElementById('selected-trip').innerText = formData.tripType;
            }
        });

        document.getElementById('from-main').innerText = formData.source;
        document.getElementById('to-main').innerText = formData.destination;

        const distance = calculateDistance(formData.source_lat, formData.source_long, formData.destination_lat, formData.destination_long);
        const averageSpeed = 40;
        const time = calculateTime(distance, averageSpeed);

        const existingData = sessionStorage.getItem('formData');
        if (existingData) {
            const previousData = JSON.parse(existingData);
            const distance = calculateDistance(formData.source_lat, formData.source_long, formData.destination_lat, formData.destination_long);
            const updatedData = { ...previousData, ...formData, distance };
            
            sessionStorage.setItem('formData', JSON.stringify(updatedData));
            // console.log('Form data updated with distance:', updatedData);
        }

        const city = formData.cityCode;
        const tripType = "Ride";
        const apiUrl = `https://prodapi.mojoboxx.com/spicescreen/webapi/getMultiplePartner?city=${encodeURIComponent(city)}&category=${encodeURIComponent(tripType)}`;
        let cab_count = null;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
             cab_count = data.length; 

            })
            .catch(error => {
                console.error('Error fetching cab data:', error);
                document.getElementById('route-info').innerText = 
                    `Error fetching cab data. Please try again later.`;
            });


            document.getElementById('route-info').innerHTML = 
            `Showing ${cab_count} out of 8 cabs from <strong>${truncateString(formData.source)}</strong> to <strong>${truncateString(formData.destination)}</strong> ( Distance for selected route is ${distance.toFixed(1)} km | Approx ${time} hr(s) )`;
        
        if (formData.pickup_date) {
            const dateObj = new Date(formData.pickup_date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
                weekday: 'long'
            });
            document.getElementById('day-part').innerText = formattedDate;
            document.getElementById('hidden-date-input').value = formData.pickup_date;
        }

        if (formData.pickup_time) {
            const timeParts = formData.pickup_time.split(':');
            const date = new Date();
            date.setHours(timeParts[0], timeParts[1]);
            const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            document.getElementById('displayed-time').innerText = formattedTime;
            document.getElementById('pickup-time').value = formData.pickup_time;
        }

        if (formData.returnDate) {
            const returnDateObj = new Date(formData.returnDate);
            const formattedReturnDate = returnDateObj.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
                weekday: 'long'
            });
            document.getElementById('day-part1').innerText = formattedReturnDate;
            document.getElementById('hidden-date-input1').value = formData.returnDate;
            document.getElementById('hidden-date-input1').disabled = false;
        }
    }
}


window.onload = populateForm();
