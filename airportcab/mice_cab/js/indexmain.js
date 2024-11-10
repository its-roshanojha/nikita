var ArrAirportName;
var DepAirportName;
var AirportName;
var SourceCity;
var Airport_Latitude;
var Airport_Longitude;
var cityCODE;
var AirportCity;
var source_lat;
var source_long;
var KMVal;
var TerminalCode;
var KMNum;
var sessionToken;
var tripType = "Ride";
var AirportType = sessionStorage["AirportRideType"];
var OutstationDropLat = "";
var OutstationDropLong = "";
var outstationDropCity = "";
var defaulttime = 'startTime'
let invalidTime = false;
// loadTimeUI()
$(".spinner").css("display", "block")
$(".spinnerBack").css("display", "block")

$(document).ready(function () {
  localStorage.setItem("TravelType", "Domestic");

  $("#travelTypeSelect").change(function () {
    let selectedValue = $(this).val();
    console.log(selectedValue);
    localStorage["TravelType"] = selectedValue;
    if (sessionStorage["AirportRideType"] == "departure") {
      Track_analytics("Null", "", "Null", "Null", "Null", "Null", "Null", "NULL", "Yatra_International_Departurepageload")
    } else {
      Track_analytics("Null", "", "Null", "Null", "Null", "Null", "Null", "NULL", "Yatra_International_Arrivalpageload")
    }
    initAutocomplete();
    loadMeruPickPoint();
  });
});
// $("#pac-input").change(function () {
//   alert("The text has been changed.");
// });

$(".TripOption").click(async function () {
  $(".TripOption").removeClass("selectedTrip");
  $(this).addClass("selectedTrip");
  tripType = $(this).text();

  if (tripType == "Rental") {
    // if (tripType == 'Rental' || tripType == 'Self Drive') {
    loadTimeUI("Rental")
    $(".travelType").hide();
    $("#switch").css("display", "none");
    $("#switch-btn").css("display", "none");
    $(".tolocation").css("display", "none");
    $(".ToLable").css("display", "none");
    $(".endGroup").css("display", "none");
    $("#rentalcitylist").css("display", "block");
    $(".RentalCity").css("display", "block");
    $("#ConfirmButton").css("display", "block");
    $("#SelfDriveBtn").css("display", "none");
    $("#book--btn").css("display", "block");
    $("#zoom--btn").css("display", "none");
    $(".outstationLable").css("display", "none");
    $("#outstationDroploc").css("display", "none");
    $(".ZoomCity").css("display", "none");
    $("#pac-input:text").attr(
      "placeholder",
      "Enter Pickup Location (Min 7 Character)"
    );
  } else if (tripType == "Outstation") {
    OutstationDroMapLoad();
    sessionToken = new google.maps.places.AutocompleteSessionToken();
    loadTimeUI("Outstation");
    $("#switch-btn").css("display", "none");
    $(".travelType").css("display", "none");
    $(".tolocation").css("display", "none");
    $(".ToLable").css("display", "none");
    $(".ZoomCity").css("display", "none");
    $("#rentalcitylist").css("display", "block");
    $(".RentalCity").css("display", "block");
    $("#BydefaultShow").css("display", "block");
    $("#ConfirmButton").css("display", "block");
    $("#SelfDriveBtn").css("display", "none");
    $("#StartDate").text("Select Pickup Date & Time");
    $(".endGroup").css("display", "none");
    $(".cvpoint").css("display", "flex");
    $("#book--btn").css("display", "block");
    $("#zoom--btn").css("display", "none");
    $(".outstationLable").css("display", "block");
    $("#outstationDroploc").css("display", "block");
    $("#pac-input:text").attr(
      "placeholder",
      "Enter Pickup Location (Min 7 Character)"
    );
  }
  else if (tripType == 'Self Drive') {
    loadTimeUI("Self Drive")
    $(".travelType").hide();
    $(".ZoomCity").css("display", "block");
    $(".endGroup").css("display", "block");
    $("#outstationDroploc").css("display", "none");
    $(".RentalCity").css("display", "none");
    $("#ConfirmButton").css("display", "none");
    $("#SelfDriveBtn").css("display", "block");
    $(".tolocation").css("display", "none");
    $("#book--btn").css("display", "none");
    $("#zoom--btn").css("display", "block");
    $("#rentalcitylist").css("display", "block");
    $("#BydefaultShow").css("display", "block");
    $(".outstationLable").css("display", "none");
    $("#outstationDroploc").css("display", "none");
    $("#switch-btn").css("display", "none");

    // $("#interstitial_back").css("display", "block");
    // $(".interstitial").css("display", "block");

    // setTimeout(() => {
    //   $("#interstitial_back").css("display", "none");
    //   $(".interstital").css("display", "none");
    // }, 5000);

    // $("#Interstitialclose").click(() => {
    //   $("#interstitial_back").css("display", "none");
    //   $(".interstitial").css("display", "none");
    // })

    Track_analytics("Null", "selfdrive", "Null", "Null", "Null", "Null", "Null", "NULL", "Yatra");
    selfDriveCity();
  }
  else {
    loadTimeUI()
    $(".travelType").show();
    $("#switch").css("display", "block");
    $("#switch-btn").css("display", "block");
    $(".tolocation").css("display", "block");
    $(".ZoomCity").css("display", "none");
    $(".endGroup").css("display", "none");
    $(".outstationlocationBox").css("display", "none");
    $(".ToLable").css("display", "block");
    $("#ConfirmButton").css("display", "block");
    $("#SelfDriveBtn").css("display", "none");
    $("#book--btn").css("display", "block");
    $("#rentalcitylist").css("display", "none");
    $("#BydefaultShow").css("padding-top", "0%");
    $("#outstationDroploc").css("display", "none");
    $("#zoom--btn").css("display", "none");
    $(".outstationLable").css("display", "none");
    sessionStorage["AirportRideType"] == "departure"
      ? $("#pac-input:text").attr(
        "placeholder",
        "Enter Pickup Location (Min 7 Character)"
      )
      : $("#pac-input:text").attr(
        "placeholder",
        "Enter Drop Location (Min 7 Character)"
      );
  }
});

$("#exampleModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data("whatever"); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  modal.find(".modal-title").text("New message to " + recipient);
  modal.find(".modal-body input").val(recipient);
});

// if (sessionStorage["AirportRideType"] == "arrival") {
//   $("#BydefaultShow").css("display", "none");
//   $("#switchcontent").css("display", "block");
//   $("#switchcontent").append(`
//   <div class="travelType">
//   <div class="travel_div" id="travelTypeDiv">
//        <select class="travel_ui" id="travelTypeSelect"
//              style="margin-left:0px; ">
//                  <option value="Domestic">Domestic Transfers</option>
//                  <option value="International">International Transfers</option>
//        </select>
//  </div>
// </div>
//             <div class="tolocation">
//                 <div class="drop_div" id="pickupDiv2" style="margin-bottom : 2%">
//                     <select class="drop_ui" id="cabPickupTerminal"
//                         style=" margin-left : 0px" >
//                         <option selected disabled>Select Airport and Terminal</option>
//                     </select>
//                     <i style="position: absolute; right : 7%; display: none;" class="Locationbox fas fa-angle-down"></i>
//                 </div>
//                 <span id= "select-span" class="validation-span">Please select airport</span>
//             </div>
//             <button class = "switch-icon-button" id="switch-btn" style="margin-top : 6%">&#8651;</button>
//             <div class="fromlocation">
//                 <div style="width: 100%; margin: 0px 10px 6px; float: left;" class="pnr_pickup"
//                     id="locationBox">
//                     <div id="makeSerIcon">
//                         <label class="full-field">
//                             <input id="pac-input" name="pac-input" class="input_srch" autocomplete="off"
//                                 placeholder="Enter Drop Location (Min 7 Character)" style="background-color:#F1F1F1;"
//                                  />
//                             <i style="display : none;" class="Locationbox fas fa-map-marker-alt " aria-hidden="true"
//                                 id="makeSerIconI" style="background-color:#ffffff;"></i>
//                                 <svg id = "cross-icon" class="cross_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <g id="basil:cross-outline">
//                                 <path id="Vector" d="M8.46399 15.535L15.536 8.465M8.46399 8.465L15.536 15.535" stroke="#ED1C24" stroke-width="1.5" stroke-linecap="round"/>
//                                 </g>
//                                 </svg>
//                         </label><br>
//                     </div>
//                     <ul class="autocomplete-results">
//                     </ul>
//                 </div>
//             </div>`);
// } else {
//   $("#BydefaultShow").css("display", "block");
//   $("#switchcontent").css("display", "none");
//   $("#BydefaultShow").append(`
//   <div class="travelType">
//   <div class="travel_div" id="travelTypeDiv">
//     <select class="travel_ui" id="travelTypeSelect"
//            style="margin-left:0px; ">
//        <option selected="true" value="Domestic">Domestic Transfers</option>
//        <option value="International">International Transfers</option>
//     </select>
//   </div>
// </div>
//         <div style="width: 100%; margin: 0px 10px 2%; float: left;" class="pnr_pickup"
//             id="locationBox">
//             <div id="makeSerIcon">
//                 <label class="full-field">
//                     <input id="pac-input" name="pac-input" class="input_srch" autocomplete="off"
//                         placeholder="Enter Pickup Location (Min 7 Character)" style="background-color:#F1F1F1;"
//                         />
//                         <i style="display : none" class="Locationbox fas fa-map-marker-alt" aria-hidden="true" id="makeSerIconI" style="background-color:#ffffff;"></i>
//                         <svg id = "cross-icon" class="cross_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <g id="basil:cross-outline">
// <path id="Vector" d="M8.46399 15.535L15.536 8.465M8.46399 8.465L15.536 15.535" stroke="#ED1C24" stroke-width="1.5" stroke-linecap="round"/>
// </g>
// </svg>
//                 </label>
//             </div>
//             <ul class="autocomplete-results">
//             </ul>
//         </div>
//     </div>
//     <button class = "switch-icon-button" id="switch-btn">&#8651;</button>
//     <div style="margin-bottom : 3%" class="tolocation">
//         <div class="drop_div" id="pickupDiv2">
//             <select class="drop_ui" id="cabPickupTerminal"
//                 style="margin-left:0px;background-color:#ffffff;">
//                 <option selected disabled>Select Airport and Terminal</option>
//             </select>
//             <i style="position: absolute; right : 7%; display : none;" class="Locationbox fas fa-angle-down"></i>
//         </div>
//         <span id= "select-span" class="validation-span">Please select airport</span>
//     </div>
//     `);
// }

window.onload = function () {
  // $(".travelType").css("display", "none")
  setTimeout(() => {
    if (localStorage["mapKey"]) {
      initAutocomplete();
      sessionToken = new google.maps.places.AutocompleteSessionToken();
      // getLocation();
    } else {
      setTimeout(() => {
        initAutocomplete();
        sessionToken = new google.maps.places.AutocompleteSessionToken();
        // getLocation();
      }, 2000);
    }
  }, 3000);

  $(".spinner").css("display", "none")
  $(".spinnerBack").css("display", "none")

  $("#datepicker").val(moment().format("DD-MM-YYYY"));
  $("#datepicker2").val(moment().format("DD-MM-YYYY"));

  if (sessionStorage["PrefillcustomerData"]) {
    let parseData = JSON.parse(sessionStorage["PrefillcustomerData"]);
    console.log(parseData);
    let citycode = "";
    let timezone = "";
    if (parseData.city.includes("-")) {
      sessionStorage["AirportRideType"] == "departure"
        ? (citycode = String(parseData.city).split("-")[0])
        : (citycode = String(parseData.city).split("-")[1]);
    }
    sessionStorage["AirportRideType"] == "departure"
      ? (timezone = parseData.STD.split("T")[0])
      : (timezone = parseData.STA.split("T")[0]);

    loadprefillurldata(
      citycode,
      parseData.Terminal,
      timezone,
      sessionStorage["AirportRideType"]
    );
    $("#userName").text(parseData.name);
    $("#mb_number").text(parseData.phone);
    $("#userEmail").text(parseData.email);

    setTimeout(() => {
      if (sessionStorage["AirportRideType"] == "departure") {
        Track_analytics(
          localStorage["booking_id"],
          "C2ACustomer",
          "Null",
          "Null",
          "Null",
          "Null",
          "Null",
          "NULL",
          "Yatra_departurepageLoad"
        );
      } else {
        Track_analytics(
          localStorage["booking_id"],
          "C2ACustomer",
          "Null",
          "Null",
          "Null",
          "Null",
          "Null",
          "NULL",
          "Yatra_ArrivalpageLoad"
        );
      }
    }, 2000);
  } else {
    setTimeout(() => {
      if (sessionStorage["AirportRideType"] == "departure") {
        Track_analytics(
          localStorage["booking_id"],
          "C2ACustomer",
          "Null",
          "Null",
          "Null",
          "Null",
          "Null",
          "NULL",
          "Yatra_departurepageLoad"
        );
      } else {
        Track_analytics(
          localStorage["booking_id"],
          "C2ACustomer",
          "Null",
          "Null",
          "Null",
          "Null",
          "Null",
          "NULL",
          "Yatra_ArrivalpageLoad"
        );
      }
    }, 2000);

    loadMeruPickPoint();
  }

  $("#switch-btn").click(() => {
    $("#switch").css("background", "red");
    setTimeout(() => {
      $("#switch").css("background", "white");
    }, 1000);
    if (sessionStorage["AirportRideType"] == "arrival") {
      sessionStorage["AirportRideType"] = "departure";
      window.location.reload();
    } else {
      sessionStorage["AirportRideType"] = "arrival";
      window.location.reload();
    }
  });
};

///////////////// MAP icon click code start //////////////////////////////////
$("#makeSerIconI").click(function () {
  if ($("#makeSerIconI").hasClass("fa-map-marker-alt")) {
    $("#makeSerIconI").removeClass("fa-times");
    $("#makeSerIconI").addClass("fa fa-spinner");
    Track_analytics(
      localStorage["booking_id"],
      "Departure Customer",
      localStorage["ArrivalCityCode"],
      localStorage["UrlCityCode"],
      localStorage["STA_Time"],
      localStorage["STD_Time"],
      localStorage["mobileNum"],
      "NULL",
      "Yatra_CurrentLocation_click",
      localStorage["Title"],
      localStorage["nterminal"]
    );
    getLocation();
    $("#pac-input:text").attr("placeholder", "Fetching location.....");
  }
  if ($("#makeSerIconI").hasClass("fa-times")) {
    $("#makeSerIconI").removeClass("fa-times");
    $("#makeSerIconI").removeClass("fa fa-spinner");
    $("#makeSerIconI").addClass("fa-map-marker-alt");
    $("#pac-input").val("");
    sessionStorage["AirportRideType"] == "departure"
      ? $("#pac-input:text").attr(
        "placeholder",
        "Enter Pickup Location (Min 7 Character)"
      )
      : $("#pac-input:text").attr(
        "placeholder",
        "Enter Drop Location (Min 7 Character)"
      );
    initAutocomplete();
  }
});

// code for international
// document.getElementById("userForm").onclick = function (event) {
//   event.preventDefault();

//   let firstName = $("#firstName").val();
//   let lastName = $("#lastName").val();
//   let userMobile = $("#mb_number").val();
//   let userEmail = $("#userEmail").val();
//   let countryCode = $("#countrySelect").val();
//   let passenger = $("#passenger_counter").text();
//   let luggage = $("#luggage_counter").text();

//   if (
//     firstName &&
//     lastName &&
//     userMobile &&
//     userEmail &&
//     countryCode &&
//     passenger &&
//     luggage
//   ) {
//     let user = {
//       firstName,
//       lastName,
//       userEmail,
//       userMobile,
//       countryCode,
//       passenger,
//       luggage,
//     };
//     console.log(user);
//     localStorage.setItem("interUserDetails", JSON.stringify(user));

//     $("#exampleModal").modal("hide");
//   } else {
//     alert("Please fill in all required fields.");
//     return;
//   }
// };

// code for counter on international form starts
// let passenger_plus = document.getElementById("passenger_plus");
// let passenger_minus = document.getElementById("passenger_minus");
// let luggage_plus = document.getElementById("luggage_plus");
// let luggage_minus = document.getElementById("luggage_minus");
// let passenger_counter = document.getElementById("passenger_counter");
// let luggage_counter = document.getElementById("luggage_counter");

// passenger_plus.addEventListener("click", () => {
//   let count = Number(passenger_counter.textContent);
//   if (count < 10) {
//       passenger_counter.innerHTML = count + 1;
//   }
// });

// passenger_minus.addEventListener("click", () => {
//   let count = Number(passenger_counter.textContent);
//   if (count > 0) {
//       passenger_counter.innerHTML = count - 1;
//   }
// });

// luggage_plus.addEventListener("click", () => {
//   let count = Number(luggage_counter.textContent);
//   if (count < 10) {
//       luggage_counter.innerHTML = count + 1;
//   }
// });

// luggage_minus.addEventListener("click", () => {
//   let count = Number(luggage_counter.textContent);
//   if (count > 0) {
//       luggage_counter.innerHTML = count - 1;
//   }
// });

// code for counter on international form ends

$("#outstationDropIcon").click(function () {
  if ($("#outstationDropIcon").hasClass("fa-times")) {
    $("#outstationDropIcon").removeClass("fa-times");
    $("#outstationDropIcon").addClass("fa-pencil-alt pen");
    $("#outstation-input").val("");
  }
});

////////////////////////////////Map Icon Click Code end //////////////////////////////////


////////Self drive city list code start/////////

async function selfDriveCity() {
  const cityList = $("#choosecity--zoomcar");
  const defaultOption = `<option value="Choose City Name Zoom">Pickup City Name</option>`;
  try {
    const selfDrive = await fetch(
      BaseAPIURL + domain + "/webapi/ZoomListCities"
    ).then((res) => res.json());
    const responseCities = selfDrive.data.cities;

    cityList.empty();
    cityList.append(defaultOption);
    let sortedList = sortCityList(responseCities)
    sortedList?.map?.((city) => {
      const listItem = `<option value=${city?.name}>${city.name}</option>`;
      cityList.append(listItem);
    });
  } catch (error) {
    console.error(error);
  }

  // const srcLocationResult = JSON.parse(JSON.stringify(response));
  // localStorage.setItem("pickupPoint", JSON.stringify(response));
  // await loadCity('', 'is_departure');
  // await fillTerminalCodeByCity()
}

function sortCityList(cityList) {

  let dummyCities = [...cityList];

  dummyCities.sort((firstItem, secondItem) => {
    const nameA = firstItem.name.toLowerCase();
    const nameB = secondItem.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  })



  return dummyCities
}

//////Self drive city list code end//////////

$('#cross-icon').click(function () {
  if ($('#pac-input').val() != "") {
    $('#pac-input').val("");
  }
});

async function loadMeruPickPoint(CityCode) {
  let travelType = localStorage.getItem("TravelType");
  let meruPickupPoint;
  if (travelType == "International") {
    meruPickupPoint = await fetch(
      BaseURL + domain + "/webapi/InternationalPickupPoint"
    );
  } else {
    meruPickupPoint = await fetch(BaseURL + domain + "/webapi/meruPickupPoint");
  }
  const meruPickupPoint1 = await meruPickupPoint.json();
  const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
  localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
  await loadCity("", "is_departure");
  await fillTerminalCodeByCity();
}

async function loadprefillurldata(
  citycode,
  terminal,
  timezone,
  type = "departure"
) {
  const meruPickupPoint = await fetch(
    BaseURL + domain + "/webapi/meruPickupPoint"
  );
  const meruPickupPoint1 = await meruPickupPoint.json();
  const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
  localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));

  type == "departure"
    ? await loadCity(citycode, "is_departure")
    : await loadCity(citycode, "is_arrival");
  await fillTerminalCodeByCity(citycode, terminal != "" ? terminal : "");
  $("#datepicker").val(timezone);
}

async function loadCity(departurecode = "", TripType) {
  let travelType = localStorage.getItem("TravelType");
  let url;
  if (travelType == "International") {
    url = BaseURL + domain + "/webapi/InternationalCityList";
  } else {
    url = BaseURL + domain + "/webapi/getCityList";
  }
  $("#cabPickupCity").empty();
  return new Promise(async function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: url,
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        let dynamicOption = "";
        var cityArray = [];
        data.forEach((element) => {
          if (element[TripType] == "1") {
            cityArray.push(element);
          }
        });
        localStorage.setItem("cityListdata", JSON.stringify(cityArray));

        resolve(true);
      },
      error: function (e) {
        console.log(e);
        reject("City list not found");
      },
    });
  });
}

async function fillTerminalCodeByCity(prefillcityCode = "", terminalCode = "") {
  return new Promise(async function (resolve, reject) {
    ArrAirportName = prefillcityCode;
    $("#cabPickupTerminal").empty();
    let dynamicOption = "";
    console.log(prefillcityCode);
    console.log(terminalCode);

    let citylist = JSON.parse(localStorage["cityListdata"]);
    const obj = JSON.parse(localStorage["pickupPoint"]);
    dynamicOption += `<option selected="true" disabled value="Select Airport and Terminal">Select Airport and Terminal</option>`;
    citylist.forEach((elements) => {
      cityCode = elements.code;

      let lc = obj;
      let rv;
      rv = lc[cityCode];
      localStorage.setItem(
        "cityValue",
        cityCode +
        "-" +
        rv[0]["id"] +
        "," +
        rv[0]["source_latitude"] +
        "," +
        rv[0]["source_longitude"] +
        "," +
        rv[0]["source_name"]
      );
      rv != undefined &&
        $.each(rv, function (i, currProgram) {
          if (cityCode == "DEL") {
            if (prefillcityCode == cityCode && terminalCode == currProgram.id) {
              dynamicOption += `<option selected value="${currProgram.id
                }" class="${cityCode +
                "-" +
                currProgram.id +
                "," +
                currProgram.source_latitude +
                "," +
                currProgram.source_longitude +
                "," +
                currProgram.source_name +
                "," +
                currProgram.source_city
                }"> ${currProgram.source_city + " - " + currProgram.source_name
                } </option>`;

              Airport_Latitude = currProgram.source_latitude;
              Airport_Longitude = currProgram.source_longitude;
              cityCODE = cityCode;
              AirportCity = currProgram.source_city;
              TerminalCode = currProgram.id;
              AirportName = currProgram.source_name;
              DepAirportName = cityCode;
            } else {
              dynamicOption += `<option value="${currProgram.id}" class="${cityCode +
                "-" +
                currProgram.id +
                "," +
                currProgram.source_latitude +
                "," +
                currProgram.source_longitude +
                "," +
                currProgram.source_name +
                "," +
                currProgram.source_city
                }"> ${currProgram.source_city + " - " + currProgram.source_name
                }  </option>`;
            }
          } else if (cityCode != "DEL") {
            if (prefillcityCode == cityCode) {
              dynamicOption += `<option selected value="${currProgram.id
                }" class="${cityCode +
                "-" +
                currProgram.id +
                "," +
                currProgram.source_latitude +
                "," +
                currProgram.source_longitude +
                "," +
                currProgram.source_name +
                "," +
                currProgram.source_city
                }"> ${currProgram.source_city + " - " + currProgram.source_name
                } </option>`;

              Airport_Latitude = currProgram.source_latitude;
              Airport_Longitude = currProgram.source_longitude;
              cityCODE = cityCode;
              AirportCity = currProgram.source_city;
              TerminalCode = currProgram.id;
              AirportName = currProgram.source_name;
              DepAirportName = cityCode;
            } else {
              dynamicOption += `<option value="${currProgram.id}" class="${cityCode +
                "-" +
                currProgram.id +
                "," +
                currProgram.source_latitude +
                "," +
                currProgram.source_longitude +
                "," +
                currProgram.source_name +
                "," +
                currProgram.source_city
                }"> ${currProgram.source_city + " - " + currProgram.source_name
                } </option>`;
            }
          } else {
            dynamicOption += `<option value="${currProgram.id}" class="${cityCode +
              "-" +
              currProgram.id +
              "," +
              currProgram.source_latitude +
              "," +
              currProgram.source_longitude +
              "," +
              currProgram.source_name +
              "," +
              currProgram.source_city
              }"> ${currProgram.source_city + " - " + currProgram.source_name
              }  </option>`;
          }
        });
    });
    $("#cabPickupTerminal").append(dynamicOption);
    resolve(true);

    $("#cabPickupTerminal").on("change", async function () {
      console.log($(this).find(":selected").attr("class"));
      Airport_Latitude = String($(this).find(":selected").attr("class")).split(
        ","
      )[1];
      Airport_Longitude = String($(this).find(":selected").attr("class")).split(
        ","
      )[2];
      let citycode = String($(this).find(":selected").attr("class"))
        .split(",")[0]
        .split("-")[0];
      cityCODE = citycode;
      AirportCity = String($(this).find(":selected").attr("class")).split(
        ","
      )[4];
      TerminalCode = $(this).find(":selected").val();
      AirportName = String($(this).find(":selected").attr("class")).split(
        ","
      )[3];
      DepAirportName = citycode;
      // if (citycode == "DXB" || citycode == "BKK" || citycode == "JED") {
      //   window.location.href =
      //     "https://www.jayride.com/?utm_source=Mojoboxx&utm_medium=affiliates&utm_campaign=Mojoboxx";
      // }

      // sessionStorage["AirportRideType"] == 'departure'?document.getElementById("datepicker").focus():null
    });
  });
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var a, b;

function haversine_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(rlat1) *
        Math.cos(rlat2) *
        Math.sin(difflon / 2) *
        Math.sin(difflon / 2)
      )
    );
  return d;
}

function initAutocomplete() {
  let travelType = localStorage.getItem("TravelType");
  let PickUpPoint;

  if (Airport_Latitude) {
    let lat = parseFloat(Airport_Latitude);
    let lng = parseFloat(Airport_Longitude);
    PickUpPoint = {
      lat: lat,
      lng: lng,
    };
  } else {
    PickUpPoint = {
      lat: 29.554659,
      lng: 77.090695,
    };
  }

  // calculateKilometer()

  const map = new google.maps.Map(document.getElementById("map"), {
    center: PickUpPoint,
    zoom: 13,
    mapTypeId: "terrain",
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullScreenControl: false,
  });
  var mk1 = new google.maps.Marker({
    position: PickUpPoint,
    map: map,
    title: "Drop Point",
  });

  let inputContainer = document.querySelector("pac-input");
  let autocomplete_results = document.querySelector(".autocomplete-results");
  console.log("autocomplete",autocomplete_results)
  // let service = new google.maps.places.AutocompleteService();
  let serviceDetails = new google.maps.places.PlacesService(map);

  // Create a new session token.
  // var sessionToken = new google.maps.places.AutocompleteSessionToken();
  var countryRestrict = {
    country: travelType == "International" ? "ae" : "in",
  };
  // Pass the token to the autocomplete service.
  var service = new google.maps.places.AutocompleteService();
  service.getPlacePredictions(
    {
      // input: 'pizza near Syd',
      componentRestrictions: countryRestrict,
      sessionToken: sessionToken,
    },
    displaySuggestions
  );
  let marker = new google.maps.Marker({ map: map });
  var displaySuggestions = function (predictions, status) {
    console.log("display suggestion called",predictions,status)
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.log("Try again. Please refresh the page");
      return;
    }
    let results_html = [];
    results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')


    if (predictions.length > 3) {
      while (predictions.length > 3) {
        predictions.pop();
      }
    }
    predictions.forEach(function (prediction) {
      console.log(autocomplete_results)
      // <li id="current_location">Get Current location </li>
      results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id}><span class="autocomplete-icon icon-localities"></span> 
            <span class="autocomplete-text">${prediction.description}</span></li>`);
    });
    autocomplete_results.innerHTML = results_html.join("");
    autocomplete_results.style.display = "block";
    let autocomplete_items =
      autocomplete_results.querySelectorAll(".autocomplete-item");
    document
      .getElementById("current_location")
      .addEventListener("click", function () {
        Track_analytics(
          localStorage["booking_id"],
          "Departure Customer",
          localStorage["ArrivalCityCode"],
          localStorage["UrlCityCode"],
          localStorage["STA_Time"],
          localStorage["STD_Time"],
          localStorage["mobileNum"],
          "NULL",
          "Yatra_CurrentLocation_click",
          localStorage["Title"],
          localStorage["nterminal"]
        );
        getLocation();

        autocomplete_results.style.display = "none";
      });
    for (let autocomplete_item of autocomplete_items) {
      autocomplete_item.addEventListener("click", function () {
        let prediction = {};
        const selected_text =
          this.querySelector(".autocomplete-text").textContent;
        /////////////////////////////////////////////////////////////////////////
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: selected_text }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            const addressComponents = results[0].address_components;

            const cityComponent = addressComponents.find(
              (component) =>
                component.types.includes("locality") ||
                component.types.includes("administrative_area_level_1")
            );

            const countryComponent = addressComponents.find((component) =>
              component.types.includes("country")
            );

            if (cityComponent) {
              const cityName = cityComponent.long_name;
              localStorage.setItem("SourceCity", cityName);
              console.log("SourceCity :", cityName);
            } else {
              console.error("City not found in address components");
            }

            if (countryComponent) {
              const countryName = countryComponent.long_name;
              localStorage.setItem("SourceCountry", countryName);
              console.log("SourceCountry:", countryName);
            } else {
              console.error("Country not found in address components");
            }
          } else {
            console.error("Geocoding failed:", status);
          }
        });
        /////////////////////////////////////////////////////////////////////////

        const place_id = this.getAttribute("data-place-id");
        MapPlaceId = this.getAttribute("data-place-id");
        let request = {
          placeId: place_id,
          fields: ["name", "geometry"],
        };

        serviceDetails.getDetails(request, function (place, status) {
          // console.log(place)
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            $("#makeSerIconI").removeClass("fa-map-marker-alt");
            $("#makeSerIconI").addClass("fa-times");
            a = place.geometry.location.lat();
            b = place.geometry.location.lng();

            const DropPoint2 = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            source_lat = a;
            source_long = b;

            // sessionStorage["AirportRideType"] == 'arrival'?document.getElementById("datepicker").focus():null
            // var mk2 = new google.maps.Marker({ position: DropPoint2, map: map, title: "Drop Point" });
            // // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
            // var distance = haversine_distance(mk1, mk2);

            // if (place.length == 0) {
            //     return;
            // }
            // let directionsService = new google.maps.DirectionsService();
            // let directionsRenderer = new google.maps.DirectionsRenderer();
            // directionsRenderer.setMap(map);
            // // Existing map object displays directions
            // // Create route from existing points used for markers
            // const route = {
            //     origin: PickUpPoint,
            //     destination: DropPoint2,
            //     travelMode: 'DRIVING'
            // }

            // directionsService.route(route, function (response, status) { // anonymous function to capture directions
            //     if (status !== 'OK') {
            //         window.alert('Directions request failed due to ' + status);
            //         return;
            //     } else {
            //         directionsRenderer.setDirections(response); // Add route to the map
            //         var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
            //         if (!directionsData) {
            //             window.alert('Directions request failed');
            //             return;
            //         } else {
            //             $("#msg").fadeIn();
            //             localStorage["KMVal"] = directionsData.distance.text;
            //             let ds = (directionsData.distance.value / 1000);
            //             let distanceP = Math.round(ds);
            //             KMNum = distanceP;

            //             document.getElementById("datepicker").focus();
            //         }
            //         Track_LoadAnalytics($("#mb_number").val(), "departure", "spicejet", "null", localStorage["SourceCity"], localStorage["cityCODE"], localStorage["TerminalCode"], localStorage["source_city"], source_lat, source_long, source_latitude, source_longitude,
            //             moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), ($(".timepicker").val() != "Pick up Time") ? $(".timepicker").val() : 'null')
            //     }
            // });
          }
          autocomplete_input.value = selected_text;
          autocomplete_results.style.display = "none";
        });
      });
    }
  };
  let autocomplete_input = document.getElementById("pac-input");
  autocomplete_input.addEventListener(
    "input",
    debounce(function () {
      let currentTravelType = localStorage.getItem("TravelType");
      let country = currentTravelType == "International" ? null : "in";
      console.log($("#cabPickupTerminal").val());
      // if (($("#cabPickupTerminal").val() == null)) {
      //     alert('Please select airport');
      //     $("#pac-input").val("");
      //     initAutocomplete();
      //     return false;
      // }
      let value = this.value;
      value.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
      console.log("getting this value",value)
      if (value !== "" && value.length >= 7) {
        service.getPlacePredictions(
          {
            input: value,
            componentRestrictions: {
              country: country,
            },
          },
          displaySuggestions
        );
      } else if (value !== "") {
        autocomplete_results.style.display = "block";
        let results_html = [];
        results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')

        autocomplete_results.innerHTML = results_html.join("");

        document
          .getElementById("current_location")
          .addEventListener("click", function () {
            getLocation();
            autocomplete_results.style.display = "none";
          });
      } else {
        autocomplete_results.innerHTML = "";
        autocomplete_results.style.display = "none";
      }
    }, 500)
  );
}

if (localStorage["TravelType"] != "International") {
  function calculateKilometer(sourLat, sourLong, destLat, destLong) {
    var origin1 = new google.maps.LatLng(sourLat, Math.abs(sourLong));
    // var origin2 = 'Greenwich, England';
    // var destinationA = 'Stockholm, Sweden';
    var destinationB = new google.maps.LatLng(destLat, destLong);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: "DRIVING",
      },
      callback
    );

    function callback(response, status) {
      if (status == "OK") {
        var origins = response.originAddresses;
        // var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var distance = element.distance.text;
            // var duration = element.duration.text;
            // var from = origins[i];
            // var to = destinations[j];
            console.log(distance);
            KMNum = distance;
          }
        }
      }
    }

    // sessionStorage["AirportRideType"] == 'arrival'?document.getElementById("datepicker").focus():null
    // var mk2 = new google.maps.Marker({ position: DropPoint2, map: map, title: "Drop Point" });
    // // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
    // var distance = haversine_distance(mk1, mk2);

    // if (place.length == 0) {
    //     return;
    // }
    // let directionsService = new google.maps.DirectionsService();
    // let directionsRenderer = new google.maps.DirectionsRenderer();
    // directionsRenderer.setMap(map);
    // // Existing map object displays directions
    // // Create route from existing points used for markers
    // const route = {
    //     origin: PickUpPoint,
    //     destination: DropPoint2,
    //     travelMode: 'DRIVING'
    // }

    // directionsService.route(route, function (response, status) { // anonymous function to capture directions
    //     if (status !== 'OK') {
    //         window.alert('Directions request failed due to ' + status);
    //         return;
    //     } else {
    //         directionsRenderer.setDirections(response); // Add route to the map
    //         var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
    //         if (!directionsData) {
    //             window.alert('Directions request failed');
    //             return;
    //         } else {
    //             $("#msg").fadeIn();
    //             localStorage["KMVal"] = directionsData.distance.text;
    //             let ds = (directionsData.distance.value / 1000);
    //             let distanceP = Math.round(ds);
    //             KMNum = distanceP;

    //             document.getElementById("datepicker").focus();
    //         }
    //         Track_LoadAnalytics($("#mb_number").val(), "departure", "spicejet", "null", localStorage["SourceCity"], localStorage["cityCODE"], localStorage["TerminalCode"], localStorage["source_city"], source_lat, source_long, source_latitude, source_longitude,
    //             moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), ($(".timepicker").val() != "Pick up Time") ? $(".timepicker").val() : 'null')
    //     }
    // });
  }
}

// ////////////// Current location fetch code start /////////////////////
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      maximumAge: 10000,
    });
  } else {
    sessionStorage["AirportRideType"] == "departure"
      ? $("#pac-input:text").attr(
        "placeholder",
        "Enter Pickup Location (Min 7 Character)"
      )
      : $("#pac-input:text").attr(
        "placeholder",
        "Enter Drop Location (Min 7 Character)"
      );

    console.log("Geolocation is not supported by this browser.");
  }
}

var successHandler = function (position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  displayLocation(lat, lon);
};

var errorHandler = function (errorObj) {
  console.log(errorObj.code + ": " + errorObj.message);
  sessionStorage["AirportRideType"] == "departure"
    ? $("#pac-input:text").attr(
      "placeholder",
      "Enter Pickup Location (Min 7 Character)"
    )
    : $("#pac-input:text").attr(
      "placeholder",
      "Enter Drop Location (Min 7 Character)"
    );
};

var service;
function displayLocation(latitude, longitude) {
  var geocoder;
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(latitude, longitude);
  localStorage.setItem("myPickupLat", latitude);
  localStorage.setItem("myPickupLong", longitude);
  // console.log(geocoder);

  geocoder.geocode(
    {
      latLng: latlng,
    },
    function (results, status) {
      sessionStorage["AirportRideType"] == "departure"
        ? $("#pac-input:text").attr(
          "placeholder",
          "Enter Pickup Location (Min 7 Character)"
        )
        : $("#pac-input:text").attr(
          "placeholder",
          "Enter Drop Location (Min 7 Character)"
        );

      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log(results[0]);
          var add = results[0].formatted_address;
          // console.log(add);
          document.getElementById("pac-input").innerHTML = add;
          document.getElementById("pac-input").value = add;
          var pacInput = document.getElementById("pac-input");
          $("#pac-input").focus();
          const pyrmont = {
            lat: latitude,
            lng: longitude,
          };
          // var autocomplete = new google.maps.places.Autocomplete(pacInput);
          const service = new google.maps.places.PlacesService(pacInput);
          let getNextPage;
          getDistancePrice();
          // Perform a nearby search.

          function getDistancePrice() {
            if (Airport_Latitude) {
              let lat = parseFloat(Airport_Latitude);
              let lng = parseFloat(Airport_Longitude);

              PickUpPoint = {
                lat: lat,
                lng: lng,
              };
            } else {
              PickUpPoint = {
                lat: 28.554659,
                lng: 77.090695,
              };
            }
            fillInAddress2(results[0]);

            $("#makeSerIconI").removeClass("fa-map-marker-alt");
            $("#makeSerIconI").addClass("fa-times");
            a = results[0].geometry.location.lat();
            b = results[0].geometry.location.lng();

            const DropPoint2 = {
              lat: parseFloat(localStorage["myPickupLat"]),
              lng: parseFloat(localStorage["myPickupLong"]),
            };

            source_lat = a;
            source_long = b;
            // console.log(localStorage["source_lat"]);

            let mapp = new google.maps.Map(document.getElementById("map"), {
              center: PickUpPoint,
              zoom: 13,
              mapTypeId: "terrain",
              mapTypeControl: false,
              zoomControl: false,
              streetViewControl: false,
              fullScreenControl: false,
            });
            let mk2 = new google.maps.Marker({
              position: DropPoint2,
              map: mapp,
              title: "Drop Point",
            });
            let mk1 = new google.maps.Marker({
              position: PickUpPoint,
              map: mapp,
              title: "pickup Point",
            });
            // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
            var distance = haversine_distance(mk1, mk2);

            if (results.length == 0) {
              return;
            }
            let directionsService = new google.maps.DirectionsService();
            let directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(mapp);
            // Existing map object displays directions
            // Create route from existing points used for markers
            const route = {
              origin: PickUpPoint,
              destination: DropPoint2,
              travelMode: "DRIVING",
            };
          }

          if ($("#pac-input").val() != "") {
            $("#pac-input").trigger("places_changed");
          }
          $("#makeSerIconI").removeClass("fa-map-marker-alt");
          $("#makeSerIconI").addClass("fa-times");
          // initAutocomplete()
          var value = add.split(",");
          count = value.length;
          country = value[count - 1];
          state = value[count - 2];
          city = value[count - 3];
          MapPlaceId = results[0].place_id;
        } else {
          console.log("address not found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    }
  );
}
// ////////////// Current location fetch code end /////////////////////

////////////////// Load city from map location code start///////////////
// Get the place details from the autocomplete object.
function fillInAddress2(placeVal) {
  const place = placeVal;
  let address1 = "";
  let postcode = "";
  let locality = "";
  let state = "";
  let country = "";
  let clientAdd = "";
  let neighborhood = "";
  let sublocality2 = "";
  let sublocality1 = "";
  let sublocality3 = "";

  for (const component of place.address_components) {
    const componentType = component.types[0];
    // console.log(componentType);
    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}` + ", ";
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        locality = component.long_name;
        break;
      case "sublocality_level_1":
        sublocality1 = component.long_name + ", ";
        break;
      case "sublocality_level_2":
        sublocality2 = component.long_name + ", ";
        break;
      case "sublocality_level_3":
        sublocality3 = component.long_name + ", ";
        break;
      case "neighborhood":
        neighborhood = component.long_name;
        break;

      case "administrative_area_level_1": {
        state = component.short_name;
        break;
      }
      case "country":
        country = component.long_name;
        break;
    }
    // if(place.name != "") { placeName = place.name }
    clientAdd =
      place.name +
      " " +
      address1 +
      " " +
      neighborhood +
      " " +
      sublocality3 +
      "" +
      sublocality2 +
      "" +
      sublocality1;
  }
  localStorage["SourceCity"] = locality;
}
////////////////// Load city from map location code end  ///////////////

//////////////// Datepicker code start //////////////

// $("#datepicker").datepicker({
//   dateFormat: 'dd-mm-yy',
//   minDate: 0,

//   onSelect: function (dateText) {
//     defaulttime = 'startTime'
//     if ($(".timepicker").val() == "") {
//       $("#myForm").css("display", "block");
//       $("#time-list-wrap").css("display", "block");
//       $(".done_btn").css("display", "none");
//       $("#slotdiv").css("display", "block");
//     }
//   }
// });
// $("#datepicker2").datepicker({
//   dateFormat: "dd-mm-yy",
//   minDate: 0,

//   onSelect: function (dateText) {
//     defaulttime = 'endTime'

//     if ($(".timepicker2").val() == "") {
//       $("#myForm").css("display", "block");
//       $("#time-list-wrap").css("display", "block");
//       $(".done_btn").css("display", "none");
//       $("#slotdiv").css("display", "block");
//     }
//   },
// });

/////////////// Datepicker code end //////////////

////////////////////// Ride Time UI Code start /////////////////////////////////////
const checkvalidation = (() => {
  var startDateStr = $("#datepicker").val() + ' ' + $("#start-time").val();
  var endDateStr = $("#datepicker2").val() + ' ' + $("#end-time").val();

  let startDate = moment(startDateStr, ["DD-MM-YYYY hh:mm A"]).format("DD-MM-YYYY HH:mm");
  let endDate = moment(endDateStr, ["DD-MM-YYYY hh:mm A"]).format("DD-MM-YYYY HH:mm");

  const moment1 = moment(startDate, 'DD-MM-YYYY HH:mm');
  const moment2 = moment(endDate, 'DD-MM-YYYY HH:mm');

  // difference in hours between the start and end dates

  let diffInHrs = moment2.diff(moment1, 'hours');
  if (diffInHrs < 8) {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(
      "Minimum Booking Duration Time Should Be 8 Hrs."
    );
    return "failed"
  }
  return "passed"

})
// function loadTimeUI(tripType = 'Ride') {
//   document.getElementById("time-list-wrap").innerHTML = ''
//   var st = (tripType == 'Self Drive') ? 60 : 15
//   let times = [];
//   let tt = 60;
//   let ap = ["", ""];
//   let hour_arr = [];
//   let min_arr = [];

//   for (let i = 0; tt < 13 * 60; i++) {
//     let hh = Math.floor(tt / 60);
//     let mm = tt % 60;
//     times[i] =
//       ("0" + (hh % 12)).slice(-2) +
//       ":" +
//       ("0" + mm).slice(-2) +
//       ap[Math.floor(hh / 12)];
//     tt = tt + st;
//   }

//   for (k = 0; k <= times.length; k++) {
//     if (times[k] != undefined) {
//       let timeslot_div = document.createElement("div");
//       timeslot_div.setAttribute("class", "time-slot");
//       timeslot_div_span = document.createElement("span");
//       timeslot_div_span.setAttribute("class", "dispTime");
//       timeslot_div_span.setAttribute("id", "time_index" + k);
//       var slotTime;
//       switch (times[k]) {
//         case "00:00":
//           timeslot_div_span.innerHTML = "12:00";
//           break;
//         case "00:15":
//           timeslot_div_span.innerHTML = "12:15";
//           break;
//         case "00:30":
//           timeslot_div_span.innerHTML = "12:30";
//           break;
//         case "00:45":
//           timeslot_div_span.innerHTML = "12:45";
//           break;
//         default:
//           timeslot_div_span.innerHTML = times[k];
//       }
//       // timeslot_div_span.innerHTML = times[k];

//       timeslot_div.appendChild(timeslot_div_span);
//       document.getElementById("time-list-wrap").appendChild(timeslot_div);
//     }
//   }

//   if ($(".dispTime").html() == undefined) {
//     $(".dispTime").css("display", "none");
//   }

//   $(".timepicker").click(() => {
//     defaulttime = 'startTime'
//     $("#myForm").css("display", "block");
//     $("#choosetimegrid").css("display", "block");
//     $("#time-list-wrap").css("display", "block");
//     $("#timeam").removeClass("activeClass");
//     $("#timepm").removeClass("activeClass");
//     $("#donetime").css("display", "none");
//     $(".dispTime").removeClass("activeClass");
//   });
//   $(".timepicker2").click(() => {
//     defaulttime = 'endTime'
//     $("#myForm").css("display", "block");
//     $("#choosetimegrid").css("display", "block");
//     $("#time-list-wrap").css("display", "block");
//     $("#timeam").removeClass("activeClass");
//     $("#timepm").removeClass("activeClass");
//     $("#donetime").css("display", "none");
//     $(".dispTime").removeClass("activeClass");
//   });
//   $(".dispTime").click(function () {
//     var x = document.getElementById("timemsg");
//     x.className = "show";
//     setTimeout(function () {
//       x.className = x.className.replace("show", " ");
//     }, 2000);

//     $(".dispTime").removeClass("activeClass");
//     // $("#timeam").removeClass("activeClass");
//     // $("#timepm").removeClass("activeClass");

//     $(this).addClass("activeClass");
//     localStorage.setItem("depttime", $(this).text());
//     if ($("#timeam").hasClass("activeClass")) {
//       $("#timeam").click();
//     }
//     if ($("#timepm").hasClass("activeClass")) {
//       $("#timepm").click();
//     }
//   });
//   var TimeFormat;
//   var numberValue;
//   $("#timeam").click(() => {
//     $("#timeam").addClass("activeClass");
//     $("#timepm").removeClass("activeClass");
//     if ($(".dispTime").hasClass("activeClass")) {
//       TimeFormat = localStorage["depttime"] + " " + $("#timeam").html();
//       numberValue = moment(localStorage["depttime"] + " " + $("#timeam").html(), [
//         "h:mm A",
//       ]).format("HH:mm");


//       if (localStorage["loadPagevalue"] == "outstation") {
//         if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
//           $("#cmmsg").html("Do not select a time between 10pm to 6am");
//           $(".thank_msg i").css("display", "none");
//           $(".confirmation_boxCabDiv").css("display", "block");
//           $(".confirmation_boxCab").css("display", "block");
//           // return
//         } else {
//           updateTime();
//         }
//       } else {
//         updateTime();
//       }
//     }
//   });
//   $("#timepm").click(() => {
//     $("#timepm").addClass("activeClass");
//     $("#timeam").removeClass("activeClass");
//     if ($(".dispTime").hasClass("activeClass")) {
//       TimeFormat = localStorage["depttime"] + " " + $("#timepm").html();
//       numberValue = moment(localStorage["depttime"] + " " + $("#timepm").html(), [
//         "h:mm A",
//       ]).format("HH:mm");

//       if (localStorage["loadPagevalue"] == "outstation") {
//         if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
//           $("#cmmsg").html("Do not select a time between 10pm to 6am");
//           $(".thank_msg i").css("display", "none");
//           $(".confirmation_boxCabDiv").css("display", "block");
//           $(".confirmation_boxCab").css("display", "block");
//           return;
//         } else {
//           updateTime();
//         }
//       } else {
//         updateTime();
//       }
//     }
//   });
//   $(".back_icon, .back_text").click(() => {
//     $("#myForm").css("display", "none");
//   });

//   function updateTime() {
//     invalidTime = false;
//     if (String(TimeFormat).includes("undefined")) {
//       return false;
//     }
//     if (defaulttime == 'endTime') {
//       $(".timepicker2").html(TimeFormat);
//       $(".timepicker2").val(TimeFormat);
//     }
//     else {
//       $(".timepicker").html(TimeFormat);
//       $(".timepicker").val(TimeFormat);
//     }

//     $("#myForm").css("display", "none");

//     let todayDate = new Date().toISOString().slice(0, 10);

//     var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");
//     var airportCode = cityCODE;
//     const getMinimumBookingTime = (airportCode) => {
//       const airportBookingWindows = {
//         'DXB': 3,  
//         'LHR': 6,   
//         'CAN': 48,  
//         'SIN': 24, 
//         'BKK': 6,  
//         'SFO': 8,   
//         'MEL': 24,  
//         'BHX': 24, 
//         'YTZ': 12,  
//         'JFK': 24   
//       };

//       return airportBookingWindows[airportCode] || 0;
//     };

//     const timeCheck = (() => {
//       var selectedDateStr = $("#datepicker").val();
//       var selectedTimeStr = $("#start-time").val();    
//       var selectedDateTimeStr = selectedDateStr + ' ' + selectedTimeStr;

//       let selectedDateTime = moment(selectedDateTimeStr, ["DD-MM-YYYY hh:mm A"]);

//       const currentTime = moment();
//       const minBookingTime = getMinimumBookingTime(airportCode);

//       let diffInHrs = selectedDateTime.diff(currentTime, 'hours');

//       if (diffInHrs < minBookingTime) {
//         $("#toast").modal("show");
//         $("#toastBody").empty();
//         $("#toastBody").html(
//           "You are advised to select a time, " + minBookingTime + " Hr later than the current time."
//         );
//         return "failed";
//       }

//       return "passed";
//     });
//     if (localStorage["TravelType"] == "International") {
//       timeCheck()
//     }
//     if (
//       defaulttime == 'startTime' &&
//       todayDate ==
//       moment($("#datepicker").val(), [
//         "DD-MM-YYYY",
//         "YYYY-MM-DD",
//         "DD/MM/YYYY",
//       ]).format("YYYY-MM-DD")
//     ) {
//       if (tripType == "Ride") {
//         if (sessionStorage["AirportRideType"] == "arrival" && localStorage["TravelType"] != "International") {
//           if (Timevalue < moment().add(30, "minutes").format("HH:mm")) {
//             $(".timepicker").val("Pick up Time");
//             $("#toast").modal("show");
//             $("#toastBody").empty();
//             $("#toastBody").html('Please select a pickup time at least 30 minutes later than the current time');
//             invalidTime = true;
//             return false;
//           } else {
//             invalidTime = false;
//           }
//         } else if (localStorage["TravelType"] != "International"){
//           if (Timevalue < moment().add(120, "minutes").format("HH:mm")) {
//             $(".timepicker").val("Pick up Time");
//             $("#toast").modal("show");
//             $("#toastBody").empty();
//             $("#toastBody").html('Please select a pickup time at least 2 hours later than the current time.');
//             invalidTime = true;
//             return false;
//           } else {
//             invalidTime = false;
//           }
//         }
//       }
//       if (tripType == "Rental") {
//         if (Timevalue < moment().add(180, "minutes").format("HH:mm")) {
//           $(".timepicker").val("Pick up Time");
//           $("#toast").modal("show");
//           $("#toastBody").empty();
//           $("#toastBody").html('Please select a pickup time at least 3 hours later than the current time');
//           invalidTime = true;
//           return false;
//         } else {
//           invalidTime = false;
//         }
//       }

//     }


//     if (tripType == "Self Drive" && defaulttime == 'startTime') {
//       if ($("#end-time").val() != '') {
//         checkvalidation()
//       }
//     }


//     if (tripType == "Self Drive" && defaulttime == 'endTime') {
//       checkvalidation()
//     }

//     var pick_time;
//     var time;
//     var localStoragekey;
//     var datepickerSelector;

//     switch (defaulttime) {
//       case 'endTime':
//         // alert("end time")
//         time = $(".timepicker2").val();
//         localStoragekey = 'Droptime'
//         datepickerSelector = '#datepicker2'
//         break;
//       case 'startTime':
//       default:
//         // alert('startTime')
//         time = $(".timepicker").val();
//         localStoragekey = 'Pictime'
//         datepickerSelector = '#datepicker'
//         break;
//     }

//     // //////////////// Convert time format form AM / PM to 24 hour format code start ////////////////////
//     // var time = $(".timepicker").val();
//     var status = time.includes("M");
//     if (status) {
//       var hours = Number(time.match(/^(\d+)/)[1]);
//       var minutes = Number(time.match(/:(\d+)/)[1]);
//       var AMPM = time.match(/\s(.*)$/)[1];
//       if (AMPM == "PM" && hours < 12) hours = hours + 12;

//       if (AMPM == "AM" && hours == 12) hours = hours - 12;

//       var sHours = hours.toString();
//       var sMinutes = minutes.toString();
//       if (hours < 10) sHours = "0" + sHours;

//       if (minutes < 10) sMinutes = "0" + sMinutes;

//       var statusTime = sHours + ":" + sMinutes;
//       pick_time =
//         moment($(datepickerSelector).val(), [
//           "DD-MM-YYYY",
//           "YYYY-MM-DD",
//           "DD/MM/YYYY",
//         ]).format("YYYY-MM-DD") +
//         " " +
//         statusTime;
//       localStorage.setItem(localStoragekey, statusTime);
//     } else {
//       pick_time =
//         moment($(datepickerSelector).val(), [
//           "DD-MM-YYYY",
//           "YYYY-MM-DD",
//           "DD/MM/YYYY",
//         ]).format("YYYY-MM-DD") +
//         " " +
//         $(".timepicker").val();
//       localStorage.setItem(localStoragekey, time);
//     }
//     // //////////////// Convert time format form AM / PM to 24 hour format code end ////////////////////

//     let x = $(".timepicker").val().split(" ")[0].split(":")[0];

//     localStorage.setItem("removecash", "no");

//     if (Timevalue > localStorage["STDtime"]) {
//       $("#toast").modal("show");
//       $("#toastBody").empty();
//       $(".timepicker").val("Pick up Time");
//       $("#toastBody").html(
//         "You are advised to select a time, later than current time."
//       );
//       return false;
//     }
//     if (
//       moment($("#datepicker").val(), [
//         "DD-MM-YYYY",
//         "YYYY-MM-DD",
//         "DD/MM/YYYY",
//       ]).format("YYYY-MM-DD") < todayDate
//     ) {
//       $("#toast").modal("show");
//       $("#toastBody").empty();
//       $(".timepicker").val("Pick up Time");
//       $("#toastBody").html(
//         "You are advised to select a time, later than current time."
//       );
//       return false;
//     }
//     $("#continue").removeAttr("disabled");
//     $("#ConfirmButton").removeClass("btn_disable");
//     $("#SelfDriveBtn").removeClass("btn_disable");
//     $("#continue").css("color", "white");
//   }

// }

/////////// Zoom Car Code Start //////////////
async function submitForm() {
  if ($("#choosecity--zoomcar").val() == "Choose City Name Zoom") {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html("Please Select City");
    $("#choosecity--zoomcar").css('border', '1px solid #ed1c24');
    $("#city-span").css('display', 'block');
    return false;
  }
  else {
    $("#choosecity--zoomcar").css('border', '1px solid #cfd0d0');
    $("#city-span").css('display', 'none');
  }
  if ($("#pac-input").val() == "") {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html("Please enter pickup location");
    return false;
  }

  if ($("#datepicker").val() == "") {
    return false;
  }
  if ($("#datepicker2").val() == "") {
    return false;
  }
  if ($("#start-time").val() == "") {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(
      "You are advised to select a start time."
    );
    return false;
  }
  if ($("#end-time").val() == "") {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(
      "You are advised to select an end time."
    );
    return false;
  }
  if ($("#checkbox").is(":checked")) {
    $("#checkbox").css('border', '');
  }
  else {
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html("Please agree to the terms and conditions");
    $("#checkbox").css('border', '1px solid #ed1c24');
    return false;
  }
  let validate = 'passed';
  if (tripType == "Self Drive") {
    validate = checkvalidation()
  }
  if (validate == 'passed') {
    await zoomDetails();
    $("#exampleModal").modal("show");
  }
}

async function getCityDetails(cityName) {
  const apiResponse = await fetch(BaseAPIURL + domain + "/webapi/ZoomCityDetail?city=" + encodeURIComponent(cityName)).then(res => res.json())
  const data = apiResponse?.data?.city

  return data
}

function getDateTimeEpoch(dateString, timeString) {
  console.log(timeString)
  const dateParts = dateString.split("-");
  const reformattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  //  alert(timeString)
  const timeParts = timeString.split(" ");
  const hourMinute = timeParts[0].split(":");
  const hours = parseInt(hourMinute[0]);
  const minutes = parseInt(hourMinute[1]);

  let convertedHours = hours;
  if (timeParts[1] === "PM" && hours < 12) {
    convertedHours += 12;
  } else if (timeParts[1] === "AM" && hours === 12) {
    convertedHours = 0;
  }

  const reformattedTime = `${convertedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

  const timeStamp = reformattedDate + " " + reformattedTime;
  const epoch = new Date(timeStamp).getTime();

  return epoch;
}

async function zoomDetails() {
  const city = $("#choosecity--zoomcar option:selected").val();

  // TODO CITY DETAIL API CALL
  const cityDetails = await getCityDetails(city)
  const { lat, lng } = cityDetails


  const start_date = $("#datepicker").val();
  const end_date = $("#datepicker2").val();
  const start_time = $("#start-time").val();
  const end_time = $("#end-time").val();

  const Selfdrivesourcename = $("#pac-input").val().substring(0, 100).trim()
  const selfsourcecity = localStorage["SourceCity"]
  const selfLatitude = source_lat
  const selfLongitude = source_long

  // TODO EPOCH FUNCTION VERIFY
  const starts_epoch = getDateTimeEpoch(start_date, start_time)
  const ends_epoch = getDateTimeEpoch(end_date, end_time)

  const searchApiPayload = {
    lat, lng, city, starts_epoch, ends_epoch, Selfdrivesourcename, selfsourcecity, selfLatitude, selfLongitude
  }

  localStorage.setItem('searchAPIPayload', JSON.stringify(searchApiPayload))

}

////////////////////// Ride Time UI Code end  //////////////////////////////////////

$(".closebtn").click(function () {
  $(".modal").modal("hide");
});


///////////////////////// Submit Button click //////////////////////////
document.getElementById("ctn").onsubmit = async function (e) {
  e.preventDefault();
  let travelType = localStorage.getItem("TravelType");

  if (travelType == "International") {
    if (travelType == "International") {
      if ($("#cabPickupTerminal").val() == null) {
        $("#toast").modal("show");
        $("#toastBody").empty();
        $("#toastBody").html("Please Select Airport");
        return false;
      }
      if ($("#flight_input").val() == "") {
        $("#toast").modal("show");
        $("#toastBody").empty();
        $("#toastBody").html(
          "Please enter flight number."
        );
        return false;
      }
    }

    var time = $(".timepicker").val();
    let timeVal = time.split(" ")[0];
    console.log(time);

    $("#exampleModal").modal("show");

    $("#exampleModal").on("hidden.bs.modal", async function () {
      console.log($("#checkbox").is(":checked"));
      if ($("#checkbox").is(":checked")) {
      } else {
        $("#toast").modal("show");
        $("#toastBody").empty();
        $("#toastBody").html("Please agree to the terms and conditions");
        return false;
      }
      // if ($(".timepicker").val() == "") {
      //   $("#toast").modal("show");
      //   $("#toastBody").empty();
      //   $("#toastBody").html("Please select pickup time");
      //   return false;
      // }
      // if (travelType == "International") {
      //   if ($("#cabPickupTerminal").val() == null) {
      //     $("#toast").modal("show");
      //     $("#toastBody").empty();
      //     $("#toastBody").html("Please Select Airport");
      //     return false;
      //   }
      // }
      if (tripType == "Rental" || tripType == "Outstation") {
        if ($("#choosecitycode").val() == "Choose City Name") {
          $("#toast").modal("show");
          $("#toastBody").empty();
          $("#toastBody").html("Please Select City");
          return false;
        } else {
          console.log($("#choosecitycode").val().split("-")[1]);
          cityCODE = $("#choosecitycode").val().split("-")[0];
          TerminalCode = $("#choosecitycode").val().split("-")[1];
        }
      }
      let timeval;
      var time = $(".timepicker").val();
      var status = time.includes("M");
      if (status) {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;

        if (AMPM == "AM" && hours == 12) hours = hours - 12;

        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;

        if (minutes < 10) sMinutes = "0" + sMinutes;

        var statusTime = sHours + ":" + sMinutes;
        timeval = statusTime;
      } else {
        timeval = $(".timepicker").val();
      }

      let pickup_time =
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD") +
        " " +
        timeval;
      // console.log(tripType)
      // console.log(sessionStorage["AirportRideType"])

      let basedetails = {};
      basedetails = {
        pickuptime: pickup_time,
        tripType: tripType,
        RideType: AirportType,
        MapPlaceId: MapPlaceId,
      };
      if (tripType == "Rental") {
        // if (tripType == 'Rental' || tripType == 'Self Drive') {
        (basedetails["sourcename"] = $("#pac-input")
          .val()
          .substring(0, 100)
          .trim()),
          (basedetails["sourcecity"] = localStorage["SourceCity"]),
          (basedetails["sourcelatitude"] = source_lat),
          (basedetails["sourcelongitude"] = source_long),
          (basedetails["citycode"] = cityCODE);
        basedetails["terminalcode"] = TerminalCode;

        Track_LoadAnalytics(
          "",
          sessionStorage["AirportRideType"],
          tripType,
          "",
          basedetails["sourcecity"],
          "",
          "",
          "",
          basedetails["sourcelatitude"],
          basedetails["sourcelongitude"],
          "",
          "",
          moment($("#datepicker").val(), [
            "DD-MM-YYYY",
            "YYYY-MM-DD",
            "DD/MM/YYYY",
          ]).format("YYYY-MM-DD"),
          $(".timepicker").val() != "Pick up Time"
            ? $(".timepicker").val()
            : "null"
        );
      } else if (tripType == "Outstation") {
        (basedetails["sourcename"] = $("#pac-input")
          .val()
          .substring(0, 100)
          .trim()),
          (basedetails["sourcecity"] = localStorage["SourceCity"]),
          (basedetails["sourcelatitude"] = source_lat),
          (basedetails["sourcelongitude"] = source_long),
          (basedetails["destinationname"] = $("#outstation-input")
            .val()
            .substring(0, 100)
            .trim()),
          (basedetails["destinationcity"] = outstationDropCity),
          (basedetails["destinationlatitude"] = OutstationDropLat),
          (basedetails["destinationlongitude"] = OutstationDropLong);
        basedetails["citycode"] = cityCODE;
        basedetails["terminalcode"] = TerminalCode;

        Track_LoadAnalytics(
          "",
          sessionStorage["AirportRideType"],
          tripType,
          "",
          basedetails["sourcecity"],
          "",
          "",
          basedetails["destinationcity"],
          basedetails["sourcelatitude"],
          basedetails["sourcelongitude"],
          basedetails["destinationlatitude"],
          basedetails["destinationlongitude"],
          moment($("#datepicker").val(), [
            "DD-MM-YYYY",
            "YYYY-MM-DD",
            "DD/MM/YYYY",
          ]).format("YYYY-MM-DD"),
          $(".timepicker").val() != "Pick up Time"
            ? $(".timepicker").val()
            : "null"
        );
      } else {
        basedetails["sourcename"] =
          sessionStorage["AirportRideType"] == "departure"
            ? $("#pac-input").val().substring(0, 100).trim()
            : AirportName;
        (basedetails["sourcecity"] =
          sessionStorage["AirportRideType"] == "departure"
            ? localStorage["SourceCity"]
            : AirportCity),
          (basedetails["sourcelatitude"] =
            sessionStorage["AirportRideType"] == "departure"
              ? source_lat
              : Airport_Latitude);
        basedetails["sourcelongitude"] =
          sessionStorage["AirportRideType"] == "departure"
            ? Math.abs(source_long)
            : Airport_Longitude;
        (basedetails["destinationname"] =
          sessionStorage["AirportRideType"] == "departure"
            ? AirportName
            : $("#pac-input").val().substring(0, 100).trim()),
          (basedetails["destinationcity"] =
            sessionStorage["AirportRideType"] == "departure"
              ? AirportCity
              : localStorage["SourceCity"]),
          (basedetails["destinationlatitude"] =
            sessionStorage["AirportRideType"] == "departure"
              ? Airport_Latitude
              : source_lat);
        (basedetails["destinationlongitude"] =
          sessionStorage["AirportRideType"] == "departure"
            ? Airport_Longitude
            : Math.abs(source_long)),
          (basedetails["citycode"] = cityCODE),
          (basedetails["terminalcode"] = TerminalCode);

        Track_LoadAnalytics(
          "",
          sessionStorage["AirportRideType"],
          tripType,
          "",
          basedetails["sourcecity"],
          basedetails["citycode"],
          basedetails["terminalcode"],
          basedetails["destinationcity"],
          basedetails["sourcelatitude"],
          basedetails["sourcelongitude"],
          basedetails["destinationlatitude"],
          basedetails["destinationlongitude"],
          moment($("#datepicker").val(), [
            "DD-MM-YYYY",
            "YYYY-MM-DD",
            "DD/MM/YYYY",
          ]).format("YYYY-MM-DD"),
          $(".timepicker").val() != "Pick up Time"
            ? $(".timepicker").val()
            : "null"
        );
      }
      if (tripType != "Rental" && localStorage["TravelType"] != "International") {
        await calculateKilometer(
          basedetails["sourcelatitude"],
          basedetails["sourcelongitude"],
          basedetails["destinationlatitude"],
          basedetails["destinationlongitude"]
        );
      }

      console.log(basedetails);

      if (tripType == "Self Drive") {
        $("#exampleModal").modal("show");
      }

      // exampleModal
      localStorage.setItem("BookingPrefillData", JSON.stringify(basedetails));
      $("#partnerFetching").modal("show");

      //////////////////////////////////////////////////////////
      let currentTravelType = localStorage.getItem("TravelType");
      console.log(currentTravelType);
      if (currentTravelType == "International") {
        let userData = JSON.parse(localStorage.getItem("interUserDetails"));

        let BookingPrefillData = JSON.parse(
          localStorage.getItem("BookingPrefillData")
        );

        BookingPrefillData["username"] = userData.firstName;
        BookingPrefillData["usermail"] = userData.userEmail;
        BookingPrefillData["usermobile"] =
          userData.countryCode + userData.userMobile;

        localStorage.setItem(
          "BookingPrefillData",
          JSON.stringify(BookingPrefillData)
        );
        if (localStorage["TravelType"] === "International") {
          window.location.href = "interPayNow.html";
        }
      }
      //////////////////////////////////////////////////////////

      if (tripType == "Rental") {
        nameMobileSubmit();
      } else if (localStorage["TravelType"] != "International") {
        setTimeout(() => {
          console.log(KMNum);
          if (KMNum) {
            if (
              (String(KMNum).includes(" ") ? KMNum.split(" ")[0] : KMNum) >
              70 &&
              tripType === "Ride"
            ) {
              $("#partnerFetching").modal("hide");
              $("#toast").modal("show");
              $("#toastBody").empty();
              $("#toastBody").html(
                "The distance for your ride is above 70 Km. Book from outstation section for best fares."
              );
            } else {
              nameMobileSubmit();
            }
          }
        }, 4000);
      }

      // window.location.href = 'https://www.gozocabs.com/booking/airport?apikey=3e00085545d49ff2cc3c164a172c14dd&triptype=DEPARTURE';
      // $("#ctn").css("display", "none");
      // $("#Secondform").css("display", "block");

      // window.location.href = (sessionStorage["AirportRideType"] == 'arrival')?'./arrival.html':'./departure.html';
    });
  } else {
    console.log($("#checkbox").is(":checked"));
    if ($("#checkbox").is(":checked")) {
    } else {
      $("#toast").modal("show");
      $("#toastBody").empty();
      $("#toastBody").html("Please agree to the terms and conditions");
      return false;
    }
    if ($(".timepicker").val() == "") {
      $("#toast").modal("show");
      $("#toastBody").empty();
      $("#toastBody").html("Please select pickup time");
      return false;
    }
    if (tripType == "Ride") {
      if ($("#cabPickupTerminal").val() == null) {
        $("#toast").modal("show");
        $("#toastBody").empty();
        $("#toastBody").html("Please Select Airport");
        return false;
      }
    }
    if (tripType == "Rental" || tripType == "Outstation") {
      if ($("#choosecitycode").val() == "Choose City Name") {
        $("#toast").modal("show");
        $("#toastBody").empty();
        $("#toastBody").html("Please Select City");
        return false;
      } else {
        console.log($("#choosecitycode").val().split("-")[1]);
        cityCODE = $("#choosecitycode").val().split("-")[0];
        TerminalCode = $("#choosecitycode").val().split("-")[1];
      }
    }
    let timeval;
    var time = $(".timepicker").val();
    var status = time.includes("M");
    if (status) {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM == "PM" && hours < 12) hours = hours + 12;

      if (AMPM == "AM" && hours == 12) hours = hours - 12;

      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if (hours < 10) sHours = "0" + sHours;

      if (minutes < 10) sMinutes = "0" + sMinutes;

      var statusTime = sHours + ":" + sMinutes;
      timeval = statusTime;
    } else {
      timeval = $(".timepicker").val();
    }

    let pickup_time =
      moment($("#datepicker").val(), [
        "DD-MM-YYYY",
        "YYYY-MM-DD",
        "DD/MM/YYYY",
      ]).format("YYYY-MM-DD") +
      " " +
      timeval;
    // console.log(tripType)
    // console.log(sessionStorage["AirportRideType"])

    let basedetails = {};
    basedetails = {
      pickuptime: pickup_time,
      tripType: tripType,
      RideType: AirportType,
      MapPlaceId: MapPlaceId,
    };
    if (tripType == "Rental") {
      // if (tripType == 'Rental' || tripType == 'Self Drive') {
      (basedetails["sourcename"] = $("#pac-input")
        .val()
        .substring(0, 100)
        .trim()),
        (basedetails["sourcecity"] = localStorage["SourceCity"]),
        (basedetails["sourcelatitude"] = source_lat),
        (basedetails["sourcelongitude"] = source_long),
        (basedetails["citycode"] = cityCODE);
      basedetails["terminalcode"] = TerminalCode;

      Track_LoadAnalytics(
        "",
        sessionStorage["AirportRideType"],
        tripType,
        "",
        basedetails["sourcecity"],
        "",
        "",
        "",
        basedetails["sourcelatitude"],
        basedetails["sourcelongitude"],
        "",
        "",
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null"
      );
    } else if (tripType == "Outstation") {
      (basedetails["sourcename"] = $("#pac-input")
        .val()
        .substring(0, 100)
        .trim()),
        (basedetails["sourcecity"] = localStorage["SourceCity"]),
        (basedetails["sourcelatitude"] = source_lat),
        (basedetails["sourcelongitude"] = source_long),
        (basedetails["destinationname"] = $("#outstation-input")
          .val()
          .substring(0, 100)
          .trim()),
        (basedetails["destinationcity"] = outstationDropCity),
        (basedetails["destinationlatitude"] = OutstationDropLat),
        (basedetails["destinationlongitude"] = OutstationDropLong);
      basedetails["citycode"] = cityCODE;
      basedetails["terminalcode"] = TerminalCode;

      Track_LoadAnalytics(
        "",
        sessionStorage["AirportRideType"],
        tripType,
        "",
        basedetails["sourcecity"],
        "",
        "",
        basedetails["destinationcity"],
        basedetails["sourcelatitude"],
        basedetails["sourcelongitude"],
        basedetails["destinationlatitude"],
        basedetails["destinationlongitude"],
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null"
      );
    } else {
      basedetails["sourcename"] =
        sessionStorage["AirportRideType"] == "departure"
          ? $("#pac-input").val().substring(0, 100).trim()
          : AirportName;
      (basedetails["sourcecity"] =
        sessionStorage["AirportRideType"] == "departure"
          ? localStorage["SourceCity"]
          : AirportCity),
        (basedetails["sourcelatitude"] =
          sessionStorage["AirportRideType"] == "departure"
            ? source_lat
            : Airport_Latitude);
      basedetails["sourcelongitude"] =
        sessionStorage["AirportRideType"] == "departure"
          ? source_long
          : Airport_Longitude;
      (basedetails["destinationname"] =
        sessionStorage["AirportRideType"] == "departure"
          ? AirportName
          : $("#pac-input").val().substring(0, 100).trim()),
        (basedetails["destinationcity"] =
          sessionStorage["AirportRideType"] == "departure"
            ? AirportCity
            : localStorage["SourceCity"]),
        (basedetails["destinationlatitude"] =
          sessionStorage["AirportRideType"] == "departure"
            ? Airport_Latitude
            : source_lat);
      (basedetails["destinationlongitude"] =
        sessionStorage["AirportRideType"] == "departure"
          ? Airport_Longitude
          : source_long),
        (basedetails["citycode"] = cityCODE),
        (basedetails["terminalcode"] = TerminalCode);

      Track_LoadAnalytics(
        "",
        sessionStorage["AirportRideType"],
        tripType,
        "",
        basedetails["sourcecity"],
        basedetails["citycode"],
        basedetails["terminalcode"],
        basedetails["destinationcity"],
        basedetails["sourcelatitude"],
        basedetails["sourcelongitude"],
        basedetails["destinationlatitude"],
        basedetails["destinationlongitude"],
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null"
      );
    }
    if (tripType != "Rental" && localStorage["TravelType"] != "International") {
      await calculateKilometer(
        basedetails["sourcelatitude"],
        basedetails["sourcelongitude"],
        basedetails["destinationlatitude"],
        basedetails["destinationlongitude"]
      );
    }

    console.log(basedetails);

    if (tripType == "Self Drive") {
      $("#exampleModal").modal("show");
    }

    // exampleModal
    localStorage.setItem("BookingPrefillData", JSON.stringify(basedetails));
    $("#partnerFetching").modal("show");

    //////////////////////////////////////////////////////////
    let currentTravelType = localStorage.getItem("TravelType");
    console.log(currentTravelType);
    if (currentTravelType == "International") {
      let userData = JSON.parse(localStorage.getItem("interUserDetails"));

      let BookingPrefillData = JSON.parse(
        localStorage.getItem("BookingPrefillData")
      );

      BookingPrefillData["username"] = userData.firstName;
      BookingPrefillData["usermail"] = userData.userEmail;
      BookingPrefillData["usermobile"] =
        userData.countryCode + userData.userMobile;

      localStorage.setItem(
        "BookingPrefillData",
        JSON.stringify(BookingPrefillData)
      );
    }
    //////////////////////////////////////////////////////////

    if (tripType == "Rental") {
      nameMobileSubmit();
    } else if (localStorage["TravelType"] != "International") {
      setTimeout(() => {
        console.log(KMNum);
        if (KMNum) {
          if (
            (String(KMNum).includes(" ") ? KMNum.split(" ")[0] : KMNum) > 70 &&
            tripType === "Ride"
          ) {
            $("#partnerFetching").modal("hide");
            $("#toast").modal("show");
            $("#toastBody").empty();
            $("#toastBody").html(
              "The distance for your ride is above 70 Km. Book from outstation section for best fares."
            );
          } else {
            nameMobileSubmit();
          }
        }
      }, 4000);
    }

    // window.location.href = 'https://www.gozocabs.com/booking/airport?apikey=3e00085545d49ff2cc3c164a172c14dd&triptype=DEPARTURE';
    // $("#ctn").css("display", "none");
    // $("#Secondform").css("display", "block");

    // window.location.href = (sessionStorage["AirportRideType"] == 'arrival')?'./arrival.html':'./departure.html';
  }
};


$("#exampleModal").on("shown.bs.modal", function () {
  if (sessionStorage["PrefillcustomerData"]) {
    let parseData = JSON.parse(sessionStorage["PrefillcustomerData"]);
    parseData.name.includes("/")
      ? $("#userName").val(parseData.name.replace("/", " "))
      : $("#userName").val(parseData.name);
    $("#mb_number").val(parseData.phone);
    $("#userEmail").val(parseData.email);
  }
});

function userDetails() {

  const username = $("#userName").val();
  const usermobile = $("#mb_number").val();
  const usermail = $("#userEmail").val();
  console.log('userInfo', username, usermobile, usermail);

  const userInfo = {
    username, usermobile, usermail
  }

  localStorage.setItem('userDetails', JSON.stringify(userInfo))
}

function zoomSubmit() {
  //   alert("worked");
  if (
    !validateInput($('#userName'), $('#user-name-span'), namePattern) ||
    !validateInput($('#mb_number'), $('#mb_number-span')) ||
    !validateInput($('#userEmail'), $('#user-email-span'), emailPattern)
  ) {
    return false;
  }
  userDetails()
  const zoomData = JSON.parse(localStorage.getItem('userDetails'))
  const searchData = JSON.parse(localStorage.getItem('searchAPIPayload'))

  const {
    usermail,
    usermobile,
    username
  } = zoomData

  const {
    city,
    starts_epoch,
    ends_epoch
  } = searchData

  Track_LoadAnalytics(
    usermobile,
    sessionStorage["AirportRideType"],
    tripType,
    username,
    localStorage["SourceCity"],
    city,
    terminalcode = null,
    destinationcity = null,
    localStorage["myPickupLat"],
    localStorage["myPickupLong"],
    destinationlatitude = null,
    destinationlongitude = null,
    starts_epoch,
    ends_epoch,
    "",
    usermail,
    "Yatra_ZoomCar"
  )
  if ($("#userName").val() == "") {
    return false;
  }
  if ($("#mb_number").val() == "") {
    return false;
  }
  if ($("#userEmail").val() == "") {
    return false;
  }
  // alert('check')
  window.location.href = "zoom.html";
}

function validateInput(inputElement, errorElement, regex) {
  const value = inputElement.val().trim();
  if (value === "") {
    errorElement.css('display', 'block');
    inputElement.css('border', '1px solid #ed1c24');
    return false;
  } else if (regex && !regex.test(value)) {
    errorElement.css('display', 'block');
    inputElement.css('border', '1px solid #ed1c24');
    errorElement.text('Please enter a valid input');
    return false;
  } else {
    errorElement.css('display', 'none');
    inputElement.css('border', '1px solid #cfd0d0');
    return true;
  }
}

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const namePattern = /^[A-Za-z\s]+$/;




async function nameMobileSubmit() {
  // if (
  //   !validateInput($('#userName'), $('#user-name-span'), namePattern) ||
  //   !validateInput($('#mb_number'), $('#mb_number-span')) ||
  //   !validateInput($('#userEmail'), $('#user-email-span'), emailPattern)
  // ) {
  //   return false;
  // }

  let previousdata = JSON.parse(localStorage.getItem("BookingPrefillData"));
  let kmval = "";
  console.log(previousdata);
  if (previousdata["tripType"] != "Rental") {
    kmval = String(KMNum.split(" ")[0]);
  }
  // previousdata["username"] = $("#userName").val();
  // previousdata["usermobile"] = $("#mb_number").val();
  // previousdata["usermail"] = $("#userEmail").val();
  previousdata["kilometers"] = Math.round(kmval) + " km";

  localStorage.setItem("BookingPrefillData", JSON.stringify(previousdata));

  // $("#partnerFetching").modal("show");
  // $("#exampleModal").modal("hide");
  // console.log(previousdata)

  let platformName = await LoadMBXpartner(cityCODE, previousdata["RideType"], previousdata["tripType"])

  const {
    sourcename,
    sourcecity,
    sourcelatitude,
    sourcelongitude,
    destinationname,
    destinationcity,
    destinationlatitude,
    destinationlongitude,
    citycode,
    terminalcode,
    kilometers,
    pickuptime,
    tripType,
    RideType,
    username,
    usermobile,
    usermail,
  } = previousdata;

  setTimeout(() => {
    if (tripType == "Self Drive") {
      // window.location.href = 'https://zoomcar.onelink.me/5bGD/1klrrdil'
      window.location.href =
        "https://www.zoomcar.com/?utm_medium=mojoboxx&utm_source=mojoboxx2&utm_campaign=mojoboxx3";

      Track_LoadAnalytics(
        usermobile,
        sessionStorage["AirportRideType"],
        tripType,
        username,
        sourcecity,
        citycode,
        terminalcode,
        destinationcity,
        sourcelatitude,
        sourcelongitude,
        destinationlatitude,
        destinationlongitude,
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null",
        "",
        usermail,
        "ZoomCar"
      );
    }
    if (platformName == 'QUICKRIDE') {
      Track_LoadAnalytics(
        usermobile,
        sessionStorage["AirportRideType"],
        tripType,
        username,
        sourcecity,
        citycode,
        terminalcode,
        destinationcity,
        sourcelatitude,
        sourcelongitude,
        destinationlatitude,
        destinationlongitude,
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null",
        "",
        usermail,
        "QUICKRIDE"
      );

      window.location.href =
        sessionStorage["AirportRideType"] == "arrival"
          ? `
              https://pwa.getquickride.com/#/mojoBox/booking?name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickloc=${sourcename}&pickupcity=${sourcecity}&Droplatlong=${destinationlatitude},${destinationlongitude}&Droploc=${destinationname}&Dropcity=${destinationcity}&pickuptime=${pickuptime}&category=${tripType}`
          : `https://pwa.getquickride.com/#/mojoBox/booking?name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickloc=${sourcename}&pickupcity=${sourcecity}&Droplatlong=${destinationlatitude},${destinationlongitude}&Droploc=${destinationname}&Dropcity=${destinationcity}&pickuptime=${pickuptime}&category=${tripType}`;
    }
    // else if (platformName.toLowerCase() == 'rideally') {
    //   Track_LoadAnalytics(usermobile, sessionStorage["AirportRideType"], tripType, username, sourcecity, citycode, terminalcode,
    //     destinationcity, sourcelatitude, sourcelongitude, destinationlatitude, destinationlongitude, moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY",]).format("YYYY-MM-DD"),
    //     $(".timepicker").val() != "Pick up Time" ? $(".timepicker").val() : "null", "", usermail, "RideAlly");

    //   if (sessionStorage['AirportRideType'] == "arrival") {
    //     window.location.href = `http://rideally.com/mojobox?name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickupcity=${sourcecity}&pickloc=${sourcename},(${citycode})&Droplatlong=${destinationlatitude},${destinationlongitude}&Dropcity=${destinationcity}&Droploc=${destinationname}&pickuptime=${pickuptime}&category=${tripType}`
    //   }
    //   else if (sessionStorage['AirportRideType'] == "departure"){
    //     window.location.href = `http://rideally.com/mojobox?name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickupcity=${sourcecity}&pickloc=${sourcename}&Droplatlong=${destinationlatitude},${destinationlongitude}&Dropcity=${destinationcity}&Droploc=${destinationname},(${citycode})&pickuptime=${pickuptime}&category=${tripType}`
    //   }
    // }
    else if (citycode == 'BLR' || citycode == 'MAA' || citycode == 'HYD') {
      Track_LoadAnalytics(
        usermobile,
        sessionStorage["AirportRideType"],
        tripType,
        username,
        sourcecity,
        citycode,
        terminalcode,
        destinationcity,
        sourcelatitude,
        sourcelongitude,
        destinationlatitude,
        destinationlongitude,
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null",
        "",
        usermail,
        "MOJO_PAGE"
      );
      window.location.href = 'payNow.html';
    }
    else if (platformName == 'MBX_PAYMENT') {
      Track_LoadAnalytics(
        usermobile,
        sessionStorage["AirportRideType"],
        tripType,
        username,
        sourcecity,
        citycode,
        terminalcode,
        destinationcity,
        sourcelatitude,
        sourcelongitude,
        destinationlatitude,
        destinationlongitude,
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null",
        "",
        usermail,
        "MOJO_PAGE"
      );
      window.location.href = "payNow.html";

    }
    else {
      Track_LoadAnalytics(
        usermobile,
        sessionStorage["AirportRideType"],
        tripType,
        username,
        sourcecity,
        citycode,
        terminalcode,
        destinationcity,
        sourcelatitude,
        sourcelongitude,
        destinationlatitude,
        destinationlongitude,
        moment($("#datepicker").val(), [
          "DD-MM-YYYY",
          "YYYY-MM-DD",
          "DD/MM/YYYY",
        ]).format("YYYY-MM-DD"),
        $(".timepicker").val() != "Pick up Time"
          ? $(".timepicker").val()
          : "null",
        "",
        usermail,
        "GOZO CABS"
      );
      window.location.href = sessionStorage["AirportRideType"] == "arrival"
        ? `
              https://www.gozocabs.com/booking/airport?apikey=3e00085545d49ff2cc3c164a172c14dd&triptype=ARRIVAL&name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickloc=${sourcename}&pickupcity=${sourcecity}&Droplatlong=${destinationlatitude},${destinationlongitude}&droploc=${destinationname}&Dropcity=${destinationcity}&pickuptime=${pickuptime}&category=${tripType}`
        : `https://www.gozocabs.com/booking/airport?apikey=3e00085545d49ff2cc3c164a172c14dd&triptype=DEPARTURE&name=${username}&ph=${usermobile}&email=${usermail}&pickuplatlong=${sourcelatitude},${sourcelongitude}&pickloc=${sourcename}&pickupcity=${sourcecity}&Droplatlong=${destinationlatitude},${destinationlongitude}&droploc=${destinationname}&Dropcity=${destinationcity}&pickuptime=${pickuptime}&category=${tripType}`;
    }


  }, 3000);
};

//////////////// Outstation drop Location fetch code start ////////////////////

function OutstationDroMapLoad() {
  let autocomplete_results = document.querySelector(
    ".outstationautocomplete-results"
  );
  // let service = new google.maps.places.AutocompleteService();
  let serviceDetails = new google.maps.places.PlacesService(map);

  // Create a new session token.
  // var sessionToken = new google.maps.places.AutocompleteSessionToken();
  var countryRestrict = {
    country: "in",
  };
  // Pass the token to the autocomplete service.
  var service = new google.maps.places.AutocompleteService();
  service.getPlacePredictions(
    {
      // input: 'pizza near Syd',
      componentRestrictions: countryRestrict,
      sessionToken: sessionToken,
    },
    displaySuggestions
  );
  let marker = new google.maps.Marker({ map: map });
  var displaySuggestions = function (predictions, status) {
    console.log("coming in this")
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.log("Try again. Please refresh the page");
      return;
    }
    let results_html = [];
    // results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')

    if (predictions.length > 3) {
      while (predictions.length > 3) {
        predictions.pop();
      }
    }
    predictions.forEach(function (prediction) {
      // <li id="current_location">Get Current location </li>
      results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id}><span class="autocomplete-icon icon-localities"></span> 
            <span class="autocomplete-text">${prediction.description}</span></li>`);
    });
    autocomplete_results.innerHTML = results_html.join("");
    autocomplete_results.style.display = "block";
    let autocomplete_items =
      autocomplete_results.querySelectorAll(".autocomplete-item");
    for (let autocomplete_item of autocomplete_items) {
      autocomplete_item.addEventListener("click", function () {
        let prediction = {};
        const selected_text =
          this.querySelector(".autocomplete-text").textContent;
        var placeArr = selected_text.split(",");
        localStorage.setItem("outstationDropCity", placeArr.slice(-3, -1)[0]);

        const place_id = this.getAttribute("data-place-id");
        MapPlaceId = this.getAttribute("data-place-id");
        let request = {
          placeId: place_id,
          fields: ["name", "geometry"],
        };

        serviceDetails.getDetails(request, function (place, status) {
          // console.log(place)
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }

            $("#outstationDropIcon").removeClass("fa-pencil-alt pen");
            $("#outstationDropIcon").addClass("fa-times");
            a = place.geometry.location.lat();
            b = place.geometry.location.lng();

            const DropPoint2 = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            OutstationDropLat = a;
            OutstationDropLong = b;
            console.log(a, b);
          }
          autocomplete_input.value = selected_text;
          autocomplete_results.style.display = "none";
        });
      });
    }
  };
  let autocomplete_input = document.getElementById("outstation-input");
  autocomplete_input.addEventListener(
    "input",
    debounce(function () {
      console.log("hello");
      let value = this.value;
      value.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
      if (value !== "" && value.length >= 7) {
        service.getPlacePredictions(
          {
            input: value,
            componentRestrictions: {
              country: "in",
            },
          },
          displaySuggestions
        );
      } else if (value !== "") {
        autocomplete_results.style.display = "block";
        let results_html = [];
        results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')
        autocomplete_results.innerHTML = results_html.join("");
      } else {
        autocomplete_results.innerHTML = "";
        autocomplete_results.style.display = "none";
      }
    }, 500)
  );
}

//////////////// Outstation drop Location fetch code end  /////////////////////


///////////// Load MBX Booking flow partner code start //////////////////
async function LoadMBXpartner(citycode, traveltype, RideType) {
  let redirectPartner = 'MBX_PAYMENT'
  // if((RideType == 'Rental') || (RideType == 'Outstation'))
  // {
  //     redirectPartner = 'GOZO CABS'
  // }
  return new Promise(function (resolve, reject) {
    try {
      fetch(BaseAPIURL + domain + `/webapi/MBXmojofixBookingCount?isReset=0&travelType=${traveltype}&RideType=${RideType}&platfrom=Yatra`)
        .then((response) => response.json()).then((data) => {
          if (data.success == true && data.code == 200) {
            if (data.data.length > 0) {
              for (let index = 0; index < data.data.length; index++) {
                let item = data.data[index];
                if (item.city.includes(citycode)) {
                  redirectPartner = item.partner;
                  break;
                }
                if (item.city == 'ALL') {
                  redirectPartner = item.partner
                }
              }
            }
            else {
              resolve(redirectPartner);
            }
          }
          else {
            resolve(redirectPartner);
          }
          resolve(redirectPartner);
          // return data;

        })
        .catch((err) => {
          reject(err);
          console.error(err);
        })

    } catch (error) {
      console.error(error);
    }
  })
}
///////////// Load MBX Booking flow partner code end //////////////////

