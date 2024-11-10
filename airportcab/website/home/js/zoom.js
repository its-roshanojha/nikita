
const images = [
  {
    url: "img/Vector (8).svg",
    alt: "Image 1",
    caption: "All",
  },
  {
    url: "img/Vector (1).svg",
    alt: "Image 2",
    caption: "Luxury Car",
  },
  {
    url: "img/Vector (2).svg",
    alt: "Image 3",
    caption: "Road Trip",
  },
  {
    url: "img/Vector (3).svg",
    alt: "Image 4",
    caption: "Automatic",
  },
  {
    url: "img/Vector (4).svg",
    alt: "Image 5",
    caption: "Diesel",
  },
  {
    url: "img/Vector (5).svg",
    alt: "Image 6",
    caption: "Sunroof",
  },
  {
    url: "img/Vector (6).svg",
    alt: "Image 7",
    caption: "Cruise Control",
  },
  {
    url: "img/Vector (7).svg",
    alt: "Image 8",
    caption: "360° Cam",
  },
  {
    url: "img/filter.png",
    alt: "Image 9",
    caption: "",
  },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (8).svg",
  //     alt: "Image 9",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (9).svg",
  //     alt: "Image 10",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (10).svg",
  //     alt: "Image 11",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (11).svg",
  //     alt: "Image 12",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (12).svg",
  //     alt: "Image 13",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (13).svg",
  //     alt: "Image 14",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (14).svg",
  //     alt: "Image 15",
  //   },
  //   {
  //     url: "/airportcab/website/cabs/cab/img/Vector (15).svg",
  //     alt: "Image 16",
  //   }
];

async function getZoomData() {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
   
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: localStorage.getItem('searchAPIPayload'),
    redirect: 'follow'
  };
  document.getElementById("loader").style.display = "block"
   try {
    const response = await fetch(  BaseAPIURL + domain + "/webapi/Searchzoom", requestOptions)
      .then(res => res.json())      
      
      const searchAPIPayload = localStorage.getItem('searchAPIPayload');
      console.log(JSON.parse(searchAPIPayload));
      console.log('ApiResponse', response) 
      

      const result = response.data.sections[0].cards;
      console.log('result', result);
      result.map((item) => {

        const template = `
        <div class="wrapper" onclick="redirectCarDetail(${item?.car_data?.car_id})">
        <div class="card" id="car_card">
          <img
            src="${item?.car_data?.url}"
            style="width: 100%"
            class="card--image"
          />
          <div class="card--details">
            <div class="card--details--rating">
              <span class="card--details--rating--img">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E09F2D" width="16" height="16">
                  <path d="M12 2l3.09 6.31L22 9.34l-5 4.87 1.18 6.88L12 17.77 6.82 21.09 8 14.22 3 9.34l6.91-1.03L12 2zm0 2.77l-2.82 5.75h5.64L12 4.77zM12 12l-2.42 2.36.58-3.38-1.94-1.89 3.38-.49L12 6l1.4 2.61 3.38.49-1.94 1.89.58 3.38L12 12z"/>
                </svg>
              </span>
              <span id="card--details--rating--value">${item?.car_data?.rating_v3?.rating || "NA"}</span>
              <span id="card--details--rating--trips"> (${item?.car_data?.rating_v3?.trips || "NA"})</span>
            </div>
            <p class="card--details--car">${item?.car_data?.brand} ${item?.car_data?.name}</p>
            <div class="card--details--feature">
              <span class="card--details--feature--type">${item?.car_data?.accessories[0]}</span>
              <div class="card--details--feature--dot">•</div>
              <span class="card--details--feature--fuel">${item?.car_data?.accessories[1]}</span>
              <div class="card--details--feature--dot">•</div>
              <span class="card--details--feature--seats">${item?.car_data?.accessories[2]}</span>
            </div>
          </div>
          <div class="card--booking">
            <div class="card--booking--details">
              <!-- <div class="card--booking--details--date">Available from ${item?.availableDate}</div> -->
              <div class="card--booking--details--price">${item?.car_data?.pricing?.payable_amount}</div>
            </div>
            <div class="card--booking--location">
              <div class="card--booking--location--pin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10A310" width="12" height="12">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 2.23 1.32 4.14 3.22 5.03L12 22l3.78-7.97C17.68 13.14 19 11.23 19 9c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
              </div>
              <div class="card--booking--location--city">${item?.car_data?.location?.text}</div>
            </div>
          </div>
          </div>
          </div>`;
  
        $("#car_card").append(template);
        document.getElementById("loader").style.display = "none"
      });
  } catch (error) {
    console.log(error)
  }

}

getZoomData()

function redirectCarDetail(car_id){

  const queryParams = new URLSearchParams();
  queryParams.set('car_id', car_id);

  const currentPageUrl = window.location.href.replace("zoom.html", "carInfo.html");

  const nextPageUrl = currentPageUrl + '?' + queryParams.toString();


  window.location.href = nextPageUrl;
}

const imageContainer = document.getElementById("image-container");
const imageCaption = document.getElementById("image-caption");

for (let i = 0; i < images.length; i++) {
  const image = document.createElement("img");
  const captions = document.createElement("p");
  let imageDiv = document.createElement("div");
  imageDiv.className = "imageDiv2";
  image.src = images[i].url;
  image.alt = images[i].alt;
  captions.innerText = images[i].caption;

  imageContainer.appendChild(imageDiv);
  imageDiv.appendChild(image);
  imageDiv.appendChild(captions);
}
