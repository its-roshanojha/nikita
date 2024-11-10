
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the stored formData from sessionStorage
    const storedFormData = sessionStorage.getItem('formData');

    if (storedFormData) {
        const formData = JSON.parse(storedFormData);

        // Wrap the setting of values in a setTimeout to ensure elements are rendered
        setTimeout(function () {
            // Set trip type value
            const tripTypeElem = document.getElementById('trip-type');
            if (tripTypeElem) {
                tripTypeElem.value = formData.tripType || '';
            }

            // Set 'from' dropdown value
            const fromDropdown = document.getElementById('from-dropdown');
            if (fromDropdown) {
                fromDropdown.value = formData.source || '';
                // Trigger change event
                fromDropdown.dispatchEvent(new Event('change'));
            }

            // Set 'to' dropdown value
            const toDropdown = document.getElementById('to-dropdown');
            if (toDropdown) {
                toDropdown.value = formData.destination || '';
                // Trigger change event
                toDropdown.dispatchEvent(new Event('change'));
            }

            // Set pickup date
            const pickupDateInput = document.getElementById('pickup-date-input');
            if (pickupDateInput) {
                pickupDateInput.value = formData.pickup_date || '';
            }

            // Set pickup time
            const pickupTimeInput = document.getElementById('pickup-time-input');
            if (pickupTimeInput) {
                pickupTimeInput.value = formData.pickup_time || '';
            }
        }, 200);  // Small delay to ensure DOM is fully loaded
    } else {
        console.log("No form data found in sessionStorage."); // Debugging log
    }
});


function toggleDropdown2(event) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.toggle('show');
}

// Function to update selected trip and close dropdown
function updateForm(selectedTrip) {
    // Update the displayed trip type
    document.getElementById('selected-trip').innerText = selectedTrip;

    // Close the dropdown menu
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.remove('show');
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-label')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
};




function toggleDropdown2(event) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.toggle('show');
    event.stopPropagation();
}

window.onclick = function (event) {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!event.target.closest('.custom-dropdown')) {
        dropdownMenu.classList.remove('show');
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const formBoxes = document.querySelectorAll('.form-major-box .form-box');
    const flipdiv = document.querySelector('.flip-btn-wrapper');
    const flipbtn = document.getElementById('flip-btn');
    const toLoc = document.getElementById('to-loc');
    const tripTypeDropdown = document.getElementById('trip-type');

    const pickupDateInput = document.getElementById('pickup-date-input');
    const displayedDate = document.getElementById('day-part');
    const pickupTimeInput = document.getElementById('pickup-time-input');
    const displayedTime = document.getElementById('displayed-time');

    // Function to get today's date in 'yyyy-mm-dd' format
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to get the current time in 'HH:mm' format
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Display today's date in the UI
    function initializeDateAndTime() {
        // Set the current date in the input and display it
        const today = new Date();
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };

        // Initialize the date input and display the current date
        pickupDateInput.value = getTodayDate();
        displayedDate.textContent = today.toLocaleDateString('en-US', options);

        // Initialize the time input and display the current time
        pickupTimeInput.value = getCurrentTime();
        updateDisplayedTime(getCurrentTime());
    }

    // Update the displayed time in the format 'HH:mm AM/PM'
    function updateDisplayedTime(time) {
        const [hours, minutes] = time.split(':');
        let period = 'AM';
        let hour = parseInt(hours);

        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        if (hour === 0) {
            hour = 12;
        }

        displayedTime.textContent = `${hour}:${minutes} ${period}`;
    }

    // Update the displayed date when the user selects a new date
    pickupDateInput.addEventListener('change', () => {
        if (pickupDateInput.value) {
            const date = new Date(pickupDateInput.value);
            const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
            displayedDate.textContent = date.toLocaleDateString('en-US', options);
        }
    });

    // Update the displayed time when the user selects a new time
    pickupTimeInput.addEventListener('change', () => {
        if (pickupTimeInput.value) {
            updateDisplayedTime(pickupTimeInput.value);
        }
    });

    function safeSetDisplay(element, displayValue) {
        if (element) {
            element.style.display = displayValue;
        }
    }

    function resetFormLayout() {
        formBoxes.forEach(box => {
            box.classList.remove('col-md-3', 'col-md-4', 'col-md-6');
            box.classList.add('col-md-2');
        });

        safeSetDisplay(flipbtn, 'none');
        safeSetDisplay(flipdiv, 'none');
        safeSetDisplay(toLoc, 'none');

        if (flipdiv) {
            flipdiv.style.marginLeft = '0';
        }
    }

    function updateColumns() {
        const selectedTrip = tripTypeDropdown ? tripTypeDropdown.value : null;

        if (!selectedTrip) {
            return;
        }

        resetFormLayout();

        if (selectedTrip === 'Airport Transfers' || selectedTrip === 'Outstation One-way' || selectedTrip === 'City Ride') {
            formBoxes[0].classList.replace('col-md-2', 'col-md-4');
            formBoxes[1].classList.replace('col-md-2', 'col-md-4');
            safeSetDisplay(flipbtn, 'block');
            safeSetDisplay(flipdiv, 'block');
            safeSetDisplay(toLoc, 'block');

            if (flipdiv) {
                flipdiv.style.marginLeft = '0px';
            }
        } else if (selectedTrip === 'Hourly Rentals') {
            formBoxes[0].classList.replace('col-md-2', 'col-md-6');
            formBoxes[2].classList.replace('col-md-2', 'col-md-3');
            formBoxes[4].classList.replace('col-md-2', 'col-md-3');

            safeSetDisplay(toLoc, 'none');
            safeSetDisplay(flipbtn, 'none');
            safeSetDisplay(flipdiv, 'none');
        }
    }

    // Initialize date and time
    initializeDateAndTime();

    // Listen to the dropdown change
    if (tripTypeDropdown) {
        tripTypeDropdown.addEventListener('change', updateColumns);
        updateColumns(); // Initialize with the current value
    }
});



document.addEventListener('DOMContentLoaded', async function () {
    const storedFormData = sessionStorage.getItem('formData');
    if (storedFormData) {
        const formData = JSON.parse(storedFormData);
        const city = formData.cityCode;
        const tripType = "Ride";

        if (city && tripType) {

            document.getElementById("loader").style.display = "block";
            const apiUrl = `https://prodapi.mojoboxx.com/spicescreen/webapi/getMultiplePartner?city=${encodeURIComponent(city)}&category=${encodeURIComponent(tripType)}`;

            try {

                const response = await fetch(apiUrl);
                console.log('Fetch call made. Response received:', response);
                if (response.ok) {
                    const cabData = await response.json();

                    console.log('API response data:', cabData);
                    document.getElementById("loader").style.display = "none";
                    const sedanCheckbox = document.getElementById('sedan');
                    sedanCheckbox.checked = true;

                    renderCabs(cabData, sedanCheckbox.checked);
                    attachFilterListeners(cabData);  // Attaching the listeners after data is fetched


                } else {
                    console.error('API call failed with status:', response.status, response.statusText);
                    document.getElementById("loader").style.display = "none";
                }
            } catch (error) {
                console.error('Error during fetch:', error);

                // If any error happens during fetch, log it
                document.getElementById("loader").style.display = "none";
            }
        } else {
            console.error('Missing city or tripType in formData');
        }
    } else {
        console.error('No formData found in sessionStorage');
    }
});



function getFareByPartner(partnerName, data, callback) {
    let url = "";

    // Decide which API to call based on partnerName
    if (partnerName === "GOZO CABS") {
        url = "https://prodapi.mojoboxx.com/spicescreen/webapi/getGozoFares";
    } else if (partnerName === "BLUSMART") {
        url = "https://prodapi.mojoboxx.com/spicescreen/webapi/getBlusmartFare";
    } else {
        console.error("Unsupported partner:", partnerName);
        return;
    }
    console.log(data);

    // Define settings for the AJAX request
    const settings = {
        "url": url,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Basic M2UwMDA4NTU0NWQ0OWZmMmNjM2MxNjRhMTcyYzE0ZGQ=",  // Your authorization token
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(data)
    };
    console.log(settings);

    // Make the AJAX call
    $.ajax(settings)
        .done(function (response) {
            callback(response); // Send the response to the callback function
        })
        .fail(function (jqXHR, textStatus) {
            console.error("API call failed:", textStatus);
        });
}

function getCabsFromHTML() {
}
function renderCabs(cabs, filterBySedan = false) {
    const cabListContainer = document.querySelector('.cab-listings');
    cabListContainer.innerHTML = '';
    const filteredCabs = filterBySedan ? cabs.filter(cab => cab.cab_type === "Sedan") : cabs;
    cabs.forEach((cab, index) => {
        const cabTypeToSend = cab.cab_type.split(',')[0].toLowerCase();

        cabListContainer.innerHTML += `
    <div class="cancellation-banner">
        <i class="fas fa-check-circle"></i>
        Free cancellation is available, and time details will be provided after booking, ensuring minimum rates.
    </div>
    <div class="cab-listing-item">
        <div class="car-details">
            <img src=" ${cab.Logo_URL || './img/car.webp'}" alt="Car Image" class="car-image" />
            <div class="car-info">
                <h5>
                    ${cab.partner_name || 'N/A'}
                    
                    <span class="rating">
                        <span class="rating-value">${cab.Rating}/5</span>
                        <span class="rating-count">(${cab.Review} reviews)</span>
                    </span>
                </h5>
                <p class="car-features">• ${cab.cab_type} &nbsp;• AC &nbsp;• ${cab.seats || '4'} Seats </p>
                <p class="spacious"></p>
                <p class="extra-km-fare"><i class="fas fa-route"></i> Extra km fare: Extra charges may apply after a certain distance</p>
                <p class="fuel-type"><i class="fas fa-gas-pump"></i> Fuel Type: Fuel type not specified</p>
                <p class="cancellation"><i class="fas fa-times-circle"></i> Cancellation: Free cancellation available until a specified time before departure</p>
            </div>
        </div>
        <div class="price-details">
            <p class="discounted-price" id="baseFare-${index}">₹${cab.originalPrice}</p>
            <p class="taxes">+ Taxes & Charges</p>
            <button class="submit-btn book-btn"><i class="fas fa-shopping-cart"></i> Book Now</button>
        </div>
    </div>
`;

        // Add the "Why Book with Us?" section after the first cab
        if (index === 0) {
            cabListContainer.innerHTML += `
        <div class="why-book container">
            <h2>Why book with us?</h2>
            <div class="features">
                <div class="feature-card">
                    <img src="./img/oneway.png" alt="One Way fares">
                    <div>
                        <h3>One Way fares</h3>
                        <p>Special one-way fares to just get dropped off to your destination</p>
                    </div>
                </div>
                <div class="feature-card">
                    <img src="./img/fivestar.png" alt="Highly-rated drivers">
                    <div>
                        <h3>Highly-rated drivers</h3>
                        <p>Experienced and polite drivers with well-serviced, comfortable cabs</p>
                    </div>
                </div>
                <div class="feature-card">
                    <img src="./img/Bestprice.png" alt="All inclusive pricing">
                    <div>
                        <h3>All inclusive pricing</h3>
                        <p>Prices inclusive of GST, state taxes and tolls on majority of the routes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
        }
        const storedFormData = sessionStorage.getItem('formData');

        const formData = JSON.parse(storedFormData);
        const city = formData.cityCode;
        var pickupTimeFormatted = moment(formData.pickup_time, "HH:mm").format("HH:mm:ss");

        const apiData = {
            "startDate": formData.pickup_date,
            "startTime": pickupTimeFormatted,
            "cab_type": cabTypeToSend,
            "mobile": "",
            "source_address": formData.source,
            "source_latitude": formData.source_lat,
            "source_longitude": formData.source_long,
            "destination_address": formData.destination,
            "destination_latitude": formData.destination_lat,
            "destination_longitude": formData.destination_long,
            "tripType": ""

        };

        // Fetch fare for each cab
        console.log(cab.partner_name);
        getFareByPartner(cab.partner_name, apiData, function (response) {

            const baseFare = response.data.cabRate[0].fare.baseFare;
            console.log(response.baseFare);
            const fareElement = document.getElementById(`baseFare-${index}`);
            if (fareElement) {
                fareElement.innerHTML = `₹${baseFare}`;
            }
        });
    });
    const updatedCabDetails = {
        partnerName: cab.partner_name || 'N/A',
        cabType: cab.cab_type || 'N/A',
        fare: baseFare,
        image: cab.Logo_URL || './img/car.webp'
    };

    // Update formData with the new cab details
    formData.cabDetails = updatedCabDetails;
    sessionStorage.setItem('formData', JSON.stringify(formData));

    console.log('Updated formData with cab details including fare:', formData);
}
function attachFilterListeners(cabData) {
    const cabTypeCheckboxes = document.querySelectorAll('input[name="cabType"]');
    const fuelTypeCheckboxes = document.querySelectorAll('input[name="fuelType"]');
    const cabModelCheckboxes = document.querySelectorAll('input[name="cabModel"]');

    // Add event listener for cab type filters
    cabTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => applyFilters(cabData));
    });

    // Add event listener for fuel type filters
    fuelTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => applyFilters(cabData));
    });

    // Add event listener for cab model filters
    cabModelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => applyFilters(cabData));
    });
}

function filterCabs() {
    let selectedCabTypes = Array.from(document.querySelectorAll('input[name="cabType"]:checked')).map(el => el.value);
    let selectedFuelTypes = Array.from(document.querySelectorAll('input[name="fuelType"]:checked')).map(el => el.value);
    let selectedCabModels = Array.from(document.querySelectorAll('input[name="cabModel"]:checked')).map(el => el.value);

    let cabs = getCabsFromHTML();

    if (selectedCabTypes.length === 0 && selectedFuelTypes.length === 0 && selectedCabModels.length === 0) {
        renderCabs(cabs);
        return;
    }

    let filteredCabs = cabs.filter(cab => {
        let cabTypeMatch = selectedCabTypes.length === 0 || selectedCabTypes.includes(cab.type);
        let fuelTypeMatch = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(cab.fuel);
        let cabModelMatch = selectedCabModels.length === 0 || selectedCabModels.includes(cab.model);

        return cabTypeMatch && fuelTypeMatch && cabModelMatch;
    });

    renderCabs(filteredCabs);
}

function resetFilters() {
    let cabs = getCabsFromHTML();
    renderCabs(cabs);
}



window.onload = function () {
    resetFilters();
    attachFilterListeners();
};



document.addEventListener("DOMContentLoaded", function () {
    function applyFilters(cabData) {
        let selectedCabTypes = Array.from(document.querySelectorAll('input[name="cabType"]:checked'))
            .map(el => el.value.replace(/\s*\d+$/, '')); // Remove number and space from the end
        let selectedFuelTypes = Array.from(document.querySelectorAll('input[name="fuelType"]:checked'))
            .map(el => el.value);
        let selectedCabModels = Array.from(document.querySelectorAll('input[name="cabModel"]:checked'))
            .map(el => el.value);

        let filteredCabs = cabData.filter(cab => {
            let matchesCabType = selectedCabTypes.length === 0 || selectedCabTypes.includes(cab.cab_type.replace(/\s*\d+$/, ''));
            let matchesFuelType = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(cab.fuel_type);
            let matchesCabModel = selectedCabModels.length === 0 || selectedCabModels.includes(cab.model);

            return matchesCabType && matchesFuelType && matchesCabModel;
        });

        renderCabs(filteredCabs);
    }
    // Example function that handles filtering cabs (replace with actual filtering logic)
    function filterCabs(filters) {
        // Placeholder: Logic to filter your cab listings based on active filters
        // This is where you'd interact with your main dataset and display filtered results
        console.log("Filtered cabs based on:", filters);
        // You can display the filtered cab listings in the .cab-listings section
        // document.querySelector('.cab-listings').innerHTML = "Filtered Cabs: ...";
    }

    // Function to update selected filters with remove functionality
    function updateSelectedFilters() {
        const selectedFiltersContainer = document.getElementById("selected-filters");
        const appliedFiltersContainer = document.getElementById("applied-filters-container");
        const clearButton = document.getElementById("clear-all");
        const checkboxes = document.querySelectorAll("#filter-form input[type='checkbox']");

        // Clear the previous selected filters display
        selectedFiltersContainer.innerHTML = '';

        let selectedFilters = [];

        // Collect selected checkboxes
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFilters.push({
                    id: checkbox.id,
                    label: checkbox.nextElementSibling.textContent
                });
            }
        });

        // Display selected filters with a cross (×) to remove each
        if (selectedFilters.length > 0) {
            appliedFiltersContainer.style.display = "block";  // Show applied filters container
            clearButton.style.display = "block";  // Show clear all button

            selectedFilters.forEach(filter => {
                const filterElement = document.createElement("div");
                filterElement.classList.add("filter-item");
                filterElement.innerHTML = `
            ${filter.label} 
            <span class="remove-filter" data-id="${filter.id}" style="cursor: pointer; color: red; margin: auto; ">&times;</span>
        `;
                selectedFiltersContainer.appendChild(filterElement);
            });
        } else {
            appliedFiltersContainer.style.display = "none";  // Hide applied filters container if no filters are selected
            clearButton.style.display = "none";  // Hide clear all button if no filters are selected
        }

        // Apply the filters to update the main cab listings
        applyFilters();
    }

    // Function to remove individual filter
    function removeFilter(filterId) {
        const checkbox = document.getElementById(filterId);
        if (checkbox) {
            checkbox.checked = false;  // Uncheck the checkbox
        }
        updateSelectedFilters();  // Update the selected filters display and apply filters
    }

    // Function to clear all selected filters
    function clearAllFilters() {
        const checkboxes = document.querySelectorAll("#filter-form input[type='checkbox']");

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;  // Uncheck all checkboxes
        });

        updateSelectedFilters();  // Update the selected filters display and apply filters
    }

    // Add event listeners to all checkboxes
    document.querySelectorAll("#filter-form input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedFilters);  // Update selected filters on change
    });

    // Event delegation for dynamically created remove-filter buttons
    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("remove-filter")) {
            const filterId = e.target.getAttribute("data-id");
            removeFilter(filterId);  // Remove individual filter
        }
    });

    // Event listener for the clear all button
    document.getElementById("clear-all").addEventListener("click", function () {
        clearAllFilters();  // Clear all filters
    });
});

