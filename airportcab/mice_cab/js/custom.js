if (sessionStorage["AirportRideType"] == undefined || sessionStorage["AirportRideType"] == "undefined") {
    sessionStorage.setItem("AirportRideType", 'departure');
}

var mapKey;
const storedFormData = sessionStorage.getItem('formData');
const formData = storedFormData ? JSON.parse(storedFormData) : {};

// Always use production API key for the map
let fetchRes = fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/bookAirportCredentialsInfo");
fetchRes.then(res => res.json()).then(dataT => {
    var detaResponse = dataT.data;
    for (let i = 0; i < detaResponse.length; i++) {
        if (detaResponse[i].type == "spicejet_map_key") {
            // Assign the key directly for now
            mapKey = "AIzaSyDiyB1OBSrYIByNY8RlYONEgD_7vIJfDK4";
            localStorage["mapKey"] = mapKey;

            loadJS("https://maps.googleapis.com/maps/api/js?v=3&key=" + mapKey + "&libraries=places&v=weekly", true);
            break;
        }
    }
});


// Function to dynamically load JS files
function loadJS(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);
    document.head.appendChild(scriptEle);

    // Load event listener
    scriptEle.addEventListener("load", () => {
        // console.log("File loaded: " + FILE_URL);
    });

    // Error event listener
    scriptEle.addEventListener("error", (ev) => {
        console.error("Error loading file", ev);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // Function to format day, month, year, and get the weekday name
    function formatDay(date) {
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
    }

    function formatMonthYear(date) {
        const formattedDate = new Intl.DateTimeFormat('en-GB', { year: '2-digit', month: 'short' }).format(date);
        const parts = formattedDate.split(' ');
        return parts[0] + "'" + parts[1];
    }

    function getDayName(date) {
        const options = { weekday: 'long' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    // Format date for input element
    function formatDateToInputValue(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to update the departure date UI
    function updateDepartureDate() {
        const departureDateInput = document.getElementById('hidden-date-input');
        if (!departureDateInput.value) return;
        const selectedDate = new Date(departureDateInput.value);

        document.getElementById('day-part').innerText = formatDay(selectedDate);
        document.getElementById('month-year-part').innerText = formatMonthYear(selectedDate);
        document.getElementById('day-text').innerText = getDayName(selectedDate);

        // Update the return date's minimum to avoid selecting a return date earlier than the departure date
        document.getElementById('hidden-date-input1').min = formatDateToInputValue(selectedDate);
    }

    // Function to update the return date UI
    function updateReturnDate() {
        const returnDateInput = document.getElementById('hidden-date-input1');
        if (!returnDateInput.value) return;
        const selectedDate = new Date(returnDateInput.value);

        document.getElementById('day-part1').innerText = formatDay(selectedDate);
        document.getElementById('month-year-part1').innerText = formatMonthYear(selectedDate);
        document.getElementById('day-text1').innerText = getDayName(selectedDate);

        // Update the departure date's maximum to avoid selecting a departure date later than the return date
        document.getElementById('hidden-date-input').max = formatDateToInputValue(selectedDate);
    }

    // Initialize today's and tomorrow's dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Initialize elements for departure date
    const dayPartElement = document.getElementById('day-part');
    const monthYearPartElement = document.getElementById('month-year-part');
    const dayTextElement = document.getElementById('day-text');
    const hiddenDateInput = document.getElementById('hidden-date-input');


    // Initialize elements for return date
    const dayPartElement1 = document.getElementById('day-part1');
    const monthYearPartElement1 = document.getElementById('month-year-part1');
    const dayTextElement1 = document.getElementById('day-text1');
    const hiddenDateInput1 = document.getElementById('hidden-date-input1');

    // Set today's date as the default for the departure date
    if (dayPartElement && monthYearPartElement && dayTextElement && hiddenDateInput) {
        const sessionformData = JSON.parse(sessionStorage.getItem('formData')); 
        const startDate = sessionformData && sessionformData.pickup_date ? new Date(sessionformData.pickup_date) : today;

        dayPartElement.innerText = formatDay(startDate);
        monthYearPartElement.innerText = formatMonthYear(startDate);
        dayTextElement.innerText = getDayName(startDate);

        hiddenDateInput.valueAsDate = startDate;
        hiddenDateInput.min = formatDateToInputValue(today); // Set the minimum selectable date to today

        hiddenDateInput.addEventListener('change', updateDepartureDate);
    }

    // Set tomorrow's date as the default for the return date
    if (dayPartElement1 && monthYearPartElement1 && dayTextElement1 && hiddenDateInput1) {
        dayPartElement1.innerText = formatDay(tomorrow);
        monthYearPartElement1.innerText = formatMonthYear(tomorrow);
        dayTextElement1.innerText = getDayName(tomorrow);

        hiddenDateInput1.valueAsDate = tomorrow;
        hiddenDateInput1.min = formatDateToInputValue(tomorrow); // Set the minimum selectable date to tomorrow

        hiddenDateInput1.addEventListener('change', updateReturnDate);
    }

});



// Handle time input and display in 12-hour format
document.addEventListener("DOMContentLoaded", function () {
    const timeContainer = document.querySelector('.time-container');
    const timeInput = document.getElementById('pickup-time');
    const timeDisplay = document.getElementById('displayed-time');

    // Function to format time to 12-hour format
    function formatTimeTo12Hour(time) {
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert to 12-hour format
        return { hour, minutes, ampm };
    }

    // Function to get current time
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Get time from session storage if available, otherwise use the current time
    const sessionformData = JSON.parse(sessionStorage.getItem('formData'));
    const storedTime = sessionformData && sessionformData.pickup_time ? sessionformData.pickup_time : getCurrentTime();

    // console.log('time from session storage:', sessionformData ? sessionformData.pickup_time : null, 'current time:', storedTime);

    // Set the input and display the formatted time
    timeInput.value = storedTime;
    const { hour, minutes, ampm } = formatTimeTo12Hour(storedTime);
    timeDisplay.innerHTML = `${hour}:${minutes} <span id="am-pm">${ampm}</span>`;

    timeInput.addEventListener('input', function () {
        const timeValue = timeInput.value;
        if (timeValue) {
            const { hour, minutes, ampm } = formatTimeTo12Hour(timeValue);
            timeDisplay.innerHTML = `${hour}:${minutes} <span id="am-pm">${ampm}</span>`;
        }
    });

    timeContainer.addEventListener('click', function () {
        timeInput.showPicker(); 
    });
});





