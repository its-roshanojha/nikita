    // Set default sessionStorage values if they don't exist
    // sessionStorage.clear();
    if (!sessionStorage.getItem('is_departure') || !sessionStorage.getItem('is_arrival')) {
        sessionStorage.setItem('is_departure', '1');
        sessionStorage.setItem('is_arrival', '0');
    }

    function checkCookie() {
        var user = getCookie("client_Unique_Id");
        if (user != "" && user != null) {
            return user;
        } else {
            user = "BAC" + Math.floor(100000 + Math.random() * 900000) + new Date().getTime();
            // Limit the generated ID to 11 digits
            user = user.substring(0, 11);
            setCookie("client_Unique_Id", user, 1);
            return user;
        }
    }
    
    var client_unq_mac = checkCookie();
    
    // Handle the case where the value contains a semicolon
    if (client_unq_mac.includes(";")) {
        let splitcookie = client_unq_mac.split(";");
        let splitcookie2 = splitcookie[0];
        let splitcookie3 = splitcookie2.split("=");
        client_unq_mac = splitcookie3[1];
    }
    
    // Ensure final ID is 11 digits
    client_unq_mac = client_unq_mac.substring(0, 11);
    
    //console.log(client_unq_mac);




    // MERU PICKUP POINT
    async function fetchPickupPoints() {
        try {
            const response = await fetch('https://prod.mojoboxx.com/spicescreen/webapi/meruPickupPoint');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data);
            populateDropdown(data);
        } catch (error) {
            console.error('Error fetching pickup points:', error);
        }
    }

    // Populate Dropdown with Arrival and Departure Locations
    function toggleDropdown() {
        const toInput = document.getElementById('to-input');
        const toOptions = document.getElementById('to-options');
    
        const isVisible = toOptions.style.display === 'block';
        
        toOptions.style.display = isVisible ? 'none' : 'block';
        toInput.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            toInput.focus();
        }
    }
    

    function populateDropdown(data) {
        const toInput = document.getElementById('to-input');
        const toOptions = document.getElementById('to-options');
        toOptions.innerHTML = '';

        const isDeparture = sessionStorage.getItem('is_departure');
        const isArrival = sessionStorage.getItem('is_arrival');
        const optionsToShow = [];

        for (const key in data) {
            const pickupPoints = data[key] || [];
            pickupPoints.forEach(point => {
                if ((isArrival && point.is_arrival) || (isDeparture && point.is_departure)) {
                    const option = document.createElement('li');
                    option.className = 'autocomplete-item';
                    option.textContent = `${point.source_name}, ${point.source_city} - (${point.id})`;
                    option.setAttribute('data-city-code', key); // Store the city code here

                    option.onclick = () => {
                        toInput.value = option.textContent;
                        toInput.setAttribute('data-city-code', key); // Store city code in input element
                        toOptions.style.display = 'none'; // Hide options
                        toInput.style.display = 'none'; // Hide the input after selection
                        document.getElementById('to-main').innerText = truncateText(option.textContent, 15);
                        document.getElementById('to-sub').innerText = option.textContent;
                    };
                    optionsToShow.push(option);
                }
            });
        }

        optionsToShow.slice(0, 100).forEach(option => {
            toOptions.appendChild(option);
        });

        if (optionsToShow.length > 0) {
            toInput.addEventListener('click', () => {
                toOptions.style.display = 'block';
            });
        }
    }



    function filterOptions() {
        const input = document.getElementById('to-input').value.toLowerCase();
        const toOptions = document.getElementById('to-options');
        const items = toOptions.getElementsByClassName('autocomplete-item');

        Array.from(items).forEach(item => {
            if (item.textContent.toLowerCase().includes(input)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        let count = 0;
        Array.from(items).forEach(item => {
            if (item.style.display !== 'none' && count < items.length) {
                item.style.display = '';
                count++;
            } else {
                item.style.display = 'none';
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        fetchPickupPoints();
    });



    // UPDATE FORM STRUCTURE
    function updateForm() {
        // console.log('Updating form...');
        const radios = document.querySelectorAll('input[name="trip-type"]');
        radios.forEach(radio => {
            const spanLabel = radio.nextElementSibling;
            if (radio.checked) {
                spanLabel.classList.add('selected');
            } else {
                spanLabel.classList.remove('selected');
            }
        });
    }


    document.addEventListener("DOMContentLoaded", () => {
        const formBoxes = document.querySelectorAll('.form-major-box .form-box');
        const returnDateDiv = document.getElementById('return-datediv');
        const flipdiv = document.getElementById('flip-btn-wrapper');
        const flipbtn = document.getElementById('flip-btn');
        const toLoc = document.getElementById('to-loc');

        function updateColumns() {
            const selectedTrip = document.querySelector('input[name="trip-type"]:checked').id;

            formBoxes.forEach(box => {
                box.classList.remove('col-md-3', 'col-md-4', 'col-md-6');
                box.classList.add('col-md-2');
            });

            if (selectedTrip === 'Airport Transfers' || selectedTrip === 'Outstation One-Way') {
                formBoxes[0].classList.replace('col-md-2', 'col-md-4');
                formBoxes[1].classList.replace('col-md-2', 'col-md-4');
                flipbtn.style.display = 'block';
                flipdiv.style.display = 'block';
                toLoc.style.display = 'block';
                if (!flipbtn.classList.contains('no-margin')) {
                    flipdiv.style.marginLeft = '89px';
                } else {
                    flipdiv.style.marginLeft = '0'; 
                }
            } else if (selectedTrip === 'Outstation Round-Trip') {
                formBoxes[0].classList.replace('col-md-2', 'col-md-3');
                formBoxes[1].classList.replace('col-md-2', 'col-md-3');
                formBoxes[2].classList.replace('col-md-2', 'col-md-2');
                formBoxes[3].classList.replace('col-md-2', 'col-md-2');
                formBoxes[4].classList.replace('col-md-2', 'col-md-2');
                returnDateDiv.style.display = 'block';
                flipbtn.style.display = 'block';
                flipdiv.style.display = 'block';
                flipdiv.style.marginLeft = '0';

            } else if (selectedTrip === 'Hourly Rentals') {
                formBoxes[0].classList.replace('col-md-2', 'col-md-6');
                formBoxes[2].classList.replace('col-md-2', 'col-md-3');
                formBoxes[4].classList.replace('col-md-2', 'col-md-3');
                toLoc.style.display = 'none';
                flipbtn.style.display = 'none';
                flipdiv.style.display = 'none';
                flipdiv.style.marginLeft = '0';
            }

            if (selectedTrip !== 'Outstation Round-Trip') {
                returnDateDiv.style.display = 'none';
            }
        }

        document.querySelectorAll('input[name="trip-type"]').forEach(radio => {
            radio.addEventListener('change', updateColumns);
        });

        // Function to handle dropdown change
        function handleDropdownChange() {
            const selectedValue = document.getElementById('trip-type-select').value;
            document.getElementById(selectedValue).checked = true;
            updateColumns();
        }

        updateColumns();
    });


    // flip button
    document.getElementById('flip-btn').addEventListener('click', function (e) {
        e.preventDefault();

        const isDeparture = sessionStorage.getItem('is_departure');
        const isArrival = sessionStorage.getItem('is_arrival');

        sessionStorage.setItem('is_departure', isArrival);
        sessionStorage.setItem('is_arrival', isDeparture);

        console.log('is_departure:', sessionStorage.getItem('is_departure'));
        console.log('is_arrival:', sessionStorage.getItem('is_arrival'));

        var fromInput = document.getElementById('from-input');
        var toInput = document.getElementById('to-input');

        var fromValue = fromInput.value || fromInput.placeholder;
        var toValue = toInput.value || toInput.placeholder;

        fromInput.value = toValue;
        toInput.value = fromValue;

        var fromMainLabel = document.getElementById('from-main');
        var fromSubLabel = document.getElementById('from-sub');
        var toMainLabel = document.getElementById('to-main');
        var toSubLabel = document.getElementById('to-sub');

        fromMainLabel.innerText = truncateText(fromInput.value, 15);
        toMainLabel.innerText = truncateText(toInput.value, 15);

        fromSubLabel.innerText = fromInput.value ? fromInput.value : '';
        toSubLabel.innerText = toInput.value ? toInput.value : '';
    });

    // Utility: truncate text function
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }


    // Debounce function to limit the number of requests
    function debounce(func, delay) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), delay);
        };
    }



    // Input field event listener for autocompletion
    document.getElementById("from-input").addEventListener("input", debounce(function () {
        let inputField = document.getElementById("from-input");
        let value = inputField.value.trim();
        let autocompleteResults = document.querySelector(".autocomplete-results");

        if (value.length >= 4) {
            let service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions(
                { input: value, componentRestrictions: { country: "in" } },
                function (predictions, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        console.log("Autocomplete failed:", status);
                        return;
                    }

                    let resultsHtml = [];

                    // Add "Use my Current Location" option as the first item in the dropdown
                    resultsHtml.push(
                        `<li id="current-location">
                                <input type="radio" class="hidden-radio" name="location-option" value="current-location">
                                <label for="current-location"><i class="fa-solid fa-location-arrow" style="color: green"></i> Use my Current Location</label>
                            </li>`
                    );

                    // Loop through predictions and append to the dropdown list
                    predictions.forEach(function (prediction) {
                        resultsHtml.push(
                            `<li class="autocomplete-item" data-place-id="${prediction.place_id}">
                                    <input type="radio" class="hidden-radio" name="location-option" value="${prediction.place_id}">
                                    <label class="autocomplete-text">${prediction.description}</label>
                                </li>`
                        );
                    });

                    // Display the dropdown
                    autocompleteResults.innerHTML = resultsHtml.join("");
                    autocompleteResults.style.display = "block";

                    // Attach click event for "Use my Current Location"
                    document.getElementById('current-location').addEventListener('click', function () {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                let geocoder = new google.maps.Geocoder();
                                geocoder.geocode({ location: { lat, lng } }, function (results, status) {
                                    if (status === 'OK') {
                                        let locationName = results[0].formatted_address;
                                        document.getElementById('from-main').innerText = truncateText(locationName, 15);
                                        document.getElementById('from-sub').innerText = locationName;
                                        autocompleteResults.style.display = "none";
                                        inputField.value = locationName;
                                        inputField.style.display = "none";
                                    }
                                });
                            });
                        }
                    });

                    // Attach click events to predicted location items
                    document.querySelectorAll(".autocomplete-item").forEach(function (item) {
                        item.addEventListener("click", function (e) {
                            let placeId = this.getAttribute("data-place-id");
                            // Initializing PlacesService with a dummy map element for place details retrieval
                            let map = new google.maps.Map(document.createElement('div'));
                            let serviceDetails = new google.maps.places.PlacesService(map);

                            serviceDetails.getDetails({ placeId: placeId, fields: ["name", "formatted_address", "geometry"] }, function (place, status) {
                                if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                                    let shortName = place.name;
                                    let fullAddress = place.formatted_address;

                                    document.getElementById('from-main').innerText = truncateText(shortName, 15);
                                    document.getElementById('from-sub').innerText = fullAddress;

                                    autocompleteResults.style.display = "none";
                                    inputField.value = fullAddress;
                                    inputField.style.display = "none";
                                }
                            });
                        });
                    });

                }
            );
        } else {
            autocompleteResults.style.display = "none";
        }
    }, 500));

    // Function to truncate text for display
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    }


    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        let autocompleteResults = document.querySelector(".autocomplete-results");
        let inputField = document.getElementById("from-input");
        if (!inputField.contains(event.target) && !autocompleteResults.contains(event.target)) {
            autocompleteResults.style.display = "none";
        }
    });

    document.getElementById('from-main').addEventListener('click', function () {
        var inputField = document.getElementById("from-input");
        inputField.style.display = "block";
        inputField.focus();  
    });
    
    document.getElementById('from-sub').addEventListener('click', function () {
        var inputField = document.getElementById("from-input");
        inputField.style.display = "block";
        inputField.focus();  
    });
    


    // Utility: debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: truncate text function
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }


    document.getElementById('to-options').addEventListener("click", function(event) {
        if (event.target.classList.contains('autocomplete-item')) {
            const toValue = event.target.textContent;
            document.getElementById('to-main').innerText = truncateText(toValue, 15);
            document.getElementById('to-sub').innerText = toValue;
            
            toggleDropdown(); 
        }
    });
    document.getElementById('to-input').addEventListener('click', function(event) {
        event.stopPropagation(); 
    });

   // Handle form submission and save/update data to sessionStorage
async function storeFormData() {
    const tripType = document.querySelector('input[name="trip-type"]:checked')?.id || ''; 
    const fromLocation = document.getElementById('from-input')?.value || '';
    const toLocation = document.getElementById('to-input')?.value || '';
    const cityCode = document.getElementById('to-input').getAttribute('data-city-code') || 'DEL'; // Retrieve the hidden city code
    const departureDate = document.getElementById('hidden-date-input')?.value || '';
    const returnDate = document.getElementById('hidden-date-input1')?.value || '';
    const pickupTime = document.getElementById('pickup-time')?.value || '';

    const formData = {
        tripType: tripType,
        is_arrival: sessionStorage.getItem('is_arrival') === '1',
        is_departure: sessionStorage.getItem('is_departure') === '1',
        cityCode: cityCode,
        source: fromLocation,
        source_lat: null,         
        source_long: null,        
        destination: toLocation,
        destination_lat: null,    
        destination_long: null,  
        mac_address: client_unq_mac,
        pickup_date: departureDate,
        pickup_time: pickupTime || null, 
        returnDate: returnDate || null,
        returnTime: null
    };
    
    // Validate input before geocoding
    if (!validateFormData(fromLocation, toLocation)) {
        return; 
    }

    // Get lat/long for 'from' and 'to' locations using Google Maps Geocoder
    const geocoder = new google.maps.Geocoder();
    try {
        const sourceLatLng = await geocodeLocation(geocoder, fromLocation);
        formData.source_lat = sourceLatLng.lat();
        formData.source_long = sourceLatLng.lng();

        // Geocode the 'to' location
        const destLatLng = await geocodeLocation(geocoder, toLocation);
        formData.destination_lat = destLatLng.lat();
        formData.destination_long = destLatLng.lng();

        // Check if formData already exists in sessionStorage
        const existingData = sessionStorage.getItem('formData');
        if (existingData) {
            const previousData = JSON.parse(existingData);
            const updatedData = { ...previousData, ...formData };
            sessionStorage.setItem('formData', JSON.stringify(updatedData));
            console.log('Form data updated:', updatedData);
        } else {
            // Save the form data to sessionStorage
            sessionStorage.setItem('formData', JSON.stringify(formData));
            console.log('Form data saved:', formData);
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
}

// Function to geocode a location and return a promise
function geocodeLocation(geocoder, address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location);
            } else {
                reject("Geocoding failed for " + address + ": " + status);
            }
        });
    });
}

// Function to handle the Search button click
async function handleSearchClick(event) {
    event.preventDefault(); // Prevent default form submission behavior

    if (formSubmitted) {
        console.log('Form already submitted, updating data instead.');
        await storeFormData(); // Update session storage data
        // Redirect to the next page
        window.location.href = 'http://localhost:8963/mice_cab/cab_listing.html';
        // window.location.href = 'https://mice.bookairportcab.com/mice_cab/cab_listing.html';
        return;
    }

    if (validateFormData(document.getElementById('from-input').value, document.getElementById('to-input').value)) {
        formSubmitted = true;
        await storeFormData();
        // Redirect to the next page
        window.location.href = 'http://localhost:8963/mice_cab/cab_listing.html';
        // window.location.href = 'https://mice.bookairportcab.com/mice_cab/cab_listing.html';

    }
}

let formSubmitted = false;

// FORM VALIDATION
function validateFormData(fromLocation, toLocation) {
    const searchBtn = document.getElementById('submit-btn');
    
    if (fromLocation === "" || toLocation === "") {
        alert("Both 'From' and 'To' locations must be filled out.");
        return false;
    }
    const pickupDateInput = document.getElementById('hidden-date-input').value;
    const pickupTimeInput = document.getElementById('pickup-time').value;
    
    if (!pickupDateInput) {
        alert("Please select a pickup date.");
        return false;
    }
    
    if (!pickupTimeInput) {
        alert("Please select a pickup time.");
        return false;
    }

    const currentTime = new Date();
    
    const selectedPickupDate = new Date(pickupDateInput);
    const [hours, minutes] = pickupTimeInput.split(':');
    selectedPickupDate.setHours(hours);
    selectedPickupDate.setMinutes(minutes);

    const isToday = selectedPickupDate.toDateString() === currentTime.toDateString();

    if (isToday) {
        const fourHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

        if (selectedPickupDate < fourHoursLater) {
            alert("Pickup time must be at least 2 hours from the current time if the date is today.");
            return false;
        }
    }

    return true;
}



document.getElementById('submit-btn').addEventListener('click', handleSearchClick);


// Analytic before moving not the next page need to so this on the next page.
