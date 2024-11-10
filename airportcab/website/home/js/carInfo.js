getZoomCarData()
async function getZoomCarData() {

    // alert("worked")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
     
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: localStorage.getItem('searchAPIPayload'),
      redirect: 'follow'
    };

    let result;
    let selectedCarData;
    let selectedCarId;
    document.getElementById("loader").style.display = "block"
    try {
        const response = await fetch(  BaseAPIURL + domain + "/webapi/Searchzoom", requestOptions)
        .then(res => res.json())
        
        
        const searchAPIPayload = localStorage.getItem('searchAPIPayload');
        console.log(JSON.parse(searchAPIPayload));
        console.log('ApiResponse', response) 
        
        const urlParams = new URLSearchParams(window.location.search);
        selectedCarId = urlParams.get('car_id')
        result = response.data.sections[0].cards;
        console.log('result', result);
        
    } catch (error) {
        console.log(error)
    }

  console.log('result', result);
    selectedCarData = result.find((item) => {
        return item.car_data.car_id === parseInt(selectedCarId)
    })

if (selectedCarData) {
    cardReplaceData(selectedCarData)
    console.log(selectedCarData.car_data);
    localStorage.setItem('selectedCarData', JSON.stringify(selectedCarData.car_data))
} else {
  console.log('Selected car not found');
}
const carData = JSON.parse(localStorage.getItem('selectedCarData'))
document.getElementById('start_time').textContent = startTimeString;
document.getElementById('end_time').textContent = endTimeString;
console.log('cardata', carData);
document.getElementById('car_location').textContent = storedData.city;
// document.getElementById('location_distance').textContent = carData.location.text;
}

const storedData = JSON.parse(localStorage.getItem('searchAPIPayload'))
const startsInMilliseconds = storedData.starts_epoch;
    const endsInMilliseconds = storedData.ends_epoch;
    const startTime = new Date(startsInMilliseconds);
    const endTime = new Date(endsInMilliseconds);   

    const startTimeString = startTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
    });

    const endTimeString = endTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
    });


function cardReplaceData(selectedCarData){


   const template = `
   <div class="carImages">
        <div id="carouselContainer" class="carousel">
        </div>
            <p class="card--details--car">${selectedCarData.car_data.brand} ${selectedCarData.car_data.name}</p>
        <div class="card--details--feature">
            <span class="card--details--feature--type">${selectedCarData.car_data.name}</span>
            <div class="card--details--feature--dot">•</div>
            <span class="card--details--feature--type">${selectedCarData.car_data.accessories[0]}</span>
            <div class="card--details--feature--dot">•</div>
            <span class="card--details--feature--fuel">${selectedCarData.car_data.accessories[1]}</span>
            <div class="card--details--feature--dot">•</div>
            <span class="card--details--feature--seats">${selectedCarData.car_data.accessories[2]}</span>
        </div>
        <div class="card--details--rating">
            <span class="card--details--rating--img">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E09F2D" width="16" height="16">
                <path
                    d="M12 2l3.09 6.31L22 9.34l-5 4.87 1.18 6.88L12 17.77 6.82 21.09 8 14.22 3 9.34l6.91-1.03L12 2zm0 2.77l-2.82 5.75h5.64L12 4.77zM12 12l-2.42 2.36.58-3.38-1.94-1.89 3.38-.49L12 6l1.4 2.61 3.38.49-1.94 1.89.58 3.38L12 12z" />
            </svg>
            </span>
            <span id="card--details--rating--value">${selectedCarData.car_data.rating_v2.text}</span> 
            <div class="summary-amount">
            <div class="summary-amount-inner">
                <div class="summary-amount-inner-left">
                    <div class="amount">${selectedCarData.car_data.pricing.fare_header}</div>
                </div>
                <div class="summary-amount-inner-right"></div>
            </div>
                <div>
                    <button  class="flush-disable" onclick="book()">Book Now</button>
                </div>
        </div>
        </div>
    </div>`

    $(".carImages").append(template)
    document.getElementById("loader").style.display = "none"


    for (let carImageUrl of selectedCarData?.car_data?.image_urls) {
        
        const image = document.createElement("img");
        // const imageDiv = document.createElement("div");
        
        // imageDiv.className = "img-wrapper"
        image.src = carImageUrl;
        image.className = "img-wrapper--image"
        
        // imageDiv.appendChild(image);
        $('#carouselContainer').slick('slickAdd', image)
    }
    // $('#carouselContainer').slick()
}


function book() {
    // alert("work")
   window.location.href = window.location.href.replace("carInfo.html", "payNowZoom.html")
}

// async function bookingCnf() {
//     const selectedCarDetail =  localStorage.getItem('selectedCarData')
//     if (selectedCarDetail) {
//         var myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");
         

//         // 1. Destructure needed keys from selectedCarDetail object
//         const {cargroup_id, car_id, pricing, location} = JSON.parse(selectedCarDetail)
 
//         // 2. Fetch the searchAPIPayload object
//         const searchAPIPayload = JSON.parse(localStorage.getItem('searchAPIPayload'));

//         // 3. Make a new object which is a combination of the searchAPIPayload object and the destructured object from selectedCarDetail.
//         const bookingApiPayload = {
//             ...searchAPIPayload, 
//             cargroup_id: cargroup_id,
//             car_id: car_id,
//             pricing_id: pricing.id,
//             search_location_id: location.location_id 
//         }
//         console.log(bookingApiPayload);
//         localStorage.setItem("bookingApiPayLoad", JSON.stringify(bookingApiPayload))
        
//         // 4. Pass the new object as body for the fetching the response from POST API(ZoomBooking).
//         var requestOptions = {
//           method: 'POST',
//           headers: myHeaders,
//           redirect: 'follow',
//           body: localStorage.getItem('bookingApiPayLoad')
//         }

//         try {
//             const response = await fetch(BaseAPIURL + domain + "/webapi/ZoomBooking", requestOptions)
//             .then(res => res.json())
//             console.log(response);
//             localStorage.setItem("zoomBookingData", JSON.stringify(response))
//         } catch (error) {
//             console.log(error);
//         }
//        }
//   }

