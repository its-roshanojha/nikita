
document.getElementById("mb_number").onchange = function () {
    checkMobile();
}
LoadFirst();

// $("#to_airport").click(function () {
//     window.location = "to_airport.html"
// })
setInterval(() => {
    console.clear();
}, 1000);
// window.onload = async function () {
async function LoadFirst() {
    $('.timepicker').mdtimepicker();
    // document.getElementById("location").style.display = "block";
    // $(".input_srch").css("position","relative");
    // $(".input_srch").css("z-index","998");
    // $(".input_srch").css("z-index","9999");
    setTimeout(() => {
        analyticTracking("1", "Departure_Link_Click", "click");
    }, 1000);
    localStorage.removeItem("CabSHOW");
    var bookingId = localStorage["booking_id"];
    await loadMeruPickPoint();
    // initAutocomplete();
    await getPNR(bookingId);

    async function loadMeruPickPoint() {
        const meruPickupPoint = await fetch('https://prod.mojoboxx.com/spicescreen/webapi/meruPickupPoint');
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        // console.log(srcLocationResult)
        // console.log(meruPickupPoint1)
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }

}
async function checkCity() {
    const departure = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getCabPartnerData");
    const cab_response = await departure.json();
    console.log(cab_response);
    for (let i = 0; i < cab_response.length; i++) {
        console.log(cab_response[i]["city_code"])
        console.log(localStorage["ArrivalStation"]);
        if ((cab_response[i]["city_code"].includes(localStorage["ArrivalStation"])) || (cab_response[i]["city_code"] == (localStorage["ArrivalStation"]))) {
            console.log("yes")
            localStorage.setItem("cabFound", true);
        }
    }
    if (!localStorage["cabFound"]) {
        setInterval(() => {
            $("#continue").val("Not Available");
            $("#continue").prop('disabled', true);
        }, 1000);
        $(".confirmation_boxCabDiv").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        $("#cmmsg2").html("SpiceJet Departure Cab Booking Service is coming soon to your city.");
        $("#brand-logo").css("filter", "blur(5px)");
        $("#addressBox").css("filter", "blur(5px)");
        $("#mapBox").css("filter", "blur(5px)");
        $("#status").css("width", "100%");
        $("#status").html("Okay");
        $("#pac-input").val("Not Available");
        $("#pac-input").prop('disabled', true);
        $("#yourInfo").css("filter", "blur(5px)");
    }
}

// $("#status2").click(function () {
//     window.location = "https://spicescreen.com/"
// })
$("#status2").click(function () {
    $(".thank_msg i").removeClass("fa-times-circle");
    $(".thank_msg i").addClass("fa-check-circle");
    $("#brand-logo").css("filter", "blur(0px)");
    $("#addressBox").css("filter", "blur(0px)");
    $("#mapBox").css("filter", "blur(0px)");
    $("#yourInfo").css("filter", "blur(0px)");
    $(".confirmation_boxCabDiv").css("display", "none");
    $(".confirmation_boxCab").css("display", "none");
    // window.location = "booked.html"
    window.location = "http://edittrip.spicescreen.co/?bookingId=" + localStorage["BookedId"]
});

var a,
    b;

var x = document.getElementById("mmLoc");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
var optional_config = {
    location: [29.554659, 77.090695]
}
function showPosition(position) {
    console.log(position.coords.latitude)
    console.log(position.coords.longitude)
    localStorage.setItem("CurrentLat", position.coords.latitude)
    localStorage.setItem("CurrentLong", position.coords.longitude)

    optional_config = {
        location: [position.coords.latitude, position.coords.longitude]
    }
    console.log(optional_config);
    try {
        new MapmyIndia.search(true, optional_config, callback);
    } catch (error) {
        console.log(error);
    }
    // x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}


new MapmyIndia.search(document.getElementById("pac-input"), optional_config, callback);

var map = new MapmyIndia.Map('map', {
    center: [29.554659, 77.090695],
    zoom: 5,
    search: false
});
var marker;
function callback(data) {
    if (data) {
        if (data.error) {
            if (data.error.indexOf('responsecode:401') !== -1) { /*TOKEN EXPIRED, set new Token ie. 
                * MapmyIndia.setToken(newToken);
                   */
            }
            console.warn(data.error);
        } else {
            var dt = data[0];
            if (! dt) 
                return false;
            
            var eloc = dt.eLoc;
            var lat = dt.latitude,
                lng = dt.longitude;
            console.log(dt)
            // console.log(lat)
            // console.log(lng)

            console.log(eloc);
            localStorage.setItem("elocVal", eloc);
            var place = dt.placeName + (dt.placeAddress ? ", " + dt.placeAddress : "");
            console.log(place)
            document.getElementById("pac-input").innerHTML = place;
            document.getElementById("pac-input").value = place;
           
            if (place == "Current Location") {
                let elocVal = eloc.split(",");
                var Latval = elocVal[0]
                var Longval = elocVal[1]
                // var map = new MapmyIndia.Map('map', { center: [29.554659, 77.090695], zoom: 15, search: false});
                console.log(Latval)
                console.log(Longval)
                // var options = {
                //     // map: map,
                //     // location: {
                //     //     lat: Latval,
                //     //     lng: Longval
                //     // },
                //     // callback: callback_method
                //     location: [Latval,Longval]
                // };
                // console.log(options);
                // var picker = new MapmyIndia.placePicker(options);
                // console.log(picker)
                // try {
                //     new MapmyIndia.search(true, options, callback_method);
                // } catch (error) {
                //     console.log(error);
                // }
                // function callback_method(data) {
                //     console.log(data);
                //     console.log(JSON.stringify(data));
                // }
                console.log("current location");
                var obj=MapmyIndia.placePicker({location:{lat:Latval,lng:Longval}});
                    console.log(obj);
                    document.getElementById("pac-input").innerHTML = obj.formatted_address
                    document.getElementById("pac-input").value = obj.formatted_address
                    localStorage.setItem("sourceCity", obj.city);
                    localStorage.setItem("pickup_lat", obj.lat);
                    localStorage.setItem("pickup_long", obj.lng);
            } else {
                var placeArr = place.split(",");
                console.log(placeArr.slice(-3, -1)[0]);
                localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);
            }
            // fillInAddress2(dt);
            // console.log( document.getElementById("pac-input"))
            // document.getElementById("pac-input").innerHTML = "";
            // document.getElementById("pac-input").innerHTML = place;
            // document.getElementById("pac-input").value = place;
            // $("#pac-input").val() = place;
            // $("#pac-input").html(place);
            // $("#pac-input").html("place");
            /*Use elocMarker Plugin to add marker*/
            if (marker) 
                marker.remove();

            if (eloc) 
                marker = new MapmyIndia.elocMarker({
                    map: map,
                    eloc: lat ? lat + "," + lng : eloc,
                    popupHtml: place,
                    popupOptions: {
                        openPopup: true
                    }
                }).fitbounds();
            
            if (eloc) {
                var elocObj = MapmyIndia.getEloc({
                    map: map,
                    eloc: String(localStorage["elocVal"]),
                    callback: elocData
                });
                // console.log(elocObj);
                function elocData(data) {
                    console.log(data);
                    localStorage.setItem("pickup_lat", data.latitude);
                    localStorage.setItem("pickup_long", data.longitude);
                    // var obj=MapmyIndia.placePicker({location:{lat:data.latitude,lng:data.longitude}});
                    // console.log(obj);
                    // document.getElementById("pac-input").innerHTML = obj.formatted_address
                }
            }
        }
    }
    loadDrop_Loc();
    console.log(localStorage["source_latitude"])
    console.log(localStorage["source_longitude"])
    $("#makeSerIconI").removeClass("fa-crosshairs");
    $("#makeSerIconI").addClass("fa-times");
    calculateDistance();
    // console.log(MapmyIndia.getEloc({ map: map, eloc: String(localStorage["elocVal"]), callback: elocData }))

}
// }

// }

async function calculateDistance() {
    MapmyIndia.getDistance({ // coordinates: "TVOKHJ;29.554659,77.090695"
        coordinates: String(localStorage["elocVal"] + ";" + localStorage["source_latitude"] + "," + localStorage["source_longitude"])
    }, function (data) {
        var Response = JSON.stringify(data).replace(/{/g, '<br>{<br>').replace(/}/g, '<br>}<br>').replace(/","/g, '",<br>"');
        // console.log(data);
        // console.log(data.results.distances[0][1]);
        // console.log(data.results.durations[0][1]);
        // console.log(Response);
        var km = (data.results.distances[0][1]) / 1000;
        console.log(km.toFixed(1) + " km");
        var Km_val = km.toFixed(1) + " km"

        function secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " min, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " sec") : "";
            return hDisplay + mDisplay + sDisplay;
        }
        console.log(secondsToHms(data.results.durations[0][1]))
        localStorage["KMVal"] = Km_val
        var distanc = km.toFixed(1);
        localStorage["KMNum"] = Math.round(distanc)
        lastDetails();
        partnerSlider(JSON.parse(localStorage["cab_response"]), "sedan", localStorage["ArrivalStation"]);
    });
}

function showdate() {

    $("#datepicker").datepicker({
        startDate: '-0m'
        // endDate: '+2d');
    });
}

var pageLoadHeight = window.innerHeight;

window.addEventListener("resize", (e) => {
    let pageResizedHeight = window.innerHeight;
    if (pageResizedHeight < pageLoadHeight) {
        $(".below_field").css({ // "height": "89%",
            "position": "absolute",
            "bottom": "13%",
            // "left": "5%",
        })
    } else {
        $(".modal").css({
            "position": "absolute",
            // "bottom":"1%",
            // "left": "0"
        })
    }
});

if (localStorage["cabSuccess"]) {
    $("#continue").val("Cab is already booked");
    $("#continue").prop('disabled', true);
    $("#cmmsg").html("View your Cab Booking Confirmation in the notification tab (bell icon).");
    $(".confirmation_boxCabDiv").css("display", "block");
    $("#brand-logo").css("filter", "blur(5px)");
    $("#addressBox").css("filter", "blur(5px)");
    $("#mapBox").css("filter", "blur(5px)");
    $("#yourInfo").css("filter", "blur(5px)");
    $(".confirmation_boxCab").css("display", "block");
}
var timerA = setInterval(async function () { // console.log($("#customerPickupTime").val());
    if ($(".timepicker").val() == "" && $(".timepicker").val() == "00:00" && $("#pac-input").val() == "" && $(".timepicker").val() == "Pickup Time" && $("#datepicker").val() == "" && $("#datepicker").val() == "Pickup Date" && $("#cabPickupTime").val() == "" && $("#cabPickupTime").val() == "Drop Location") {
        $("#continue").prop('disabled', true);
    }
    if ($(".timepicker").val() != "" && $("#pac-input").val() != "" && $(".timepicker").val() != "Pickup Time" && $("#cabPickupTime").val() !== "") { // if ($(".timepicker").val() != "" && $("#pac-input").val() != ""&& $(".timepicker").val() != "Pickup Time") {
        if (localStorage["cabSuccess"]) {
            $("#continue").val("Cab is already booked");
            $("#continue").prop('disabled', true);
        } else {
            await lastDetails();
            // if(localStorage["ArrivalStation"] != "DEL" && localStorage["ArrivalStation"] != "KQH")
            // {
            // alert();
            loadDrop_Loc();
            // }
            await partnerSlider(JSON.parse(localStorage["cab_response"]), "sedan", localStorage["ArrivalStation"]);
            localStorage.setItem("CabSHOW", "true");
            // document.getElementById("pac-input").setAttribute("onChange",;
            clearInterval(timerA);
            var interval2 = setInterval(() => {

                if ($(".timepicker").val() != "00:00") {
                    $(".auto_btn").addClass("btn_enable");
                    $("#continue").removeAttr('disabled');
                    $("#continue").css("color", "white");
                    clearInterval(interval2)
                }
            }, 1000);
            // document.getElementById("pac-input").setAttribute("onChange","partnerSlider(JSON.parse(localStorage["cab_response"])", "sedan", "MAA"));
            // document.getElementById("pac-input").setAttribute("onChange","lastDetails()");
        }
    }
}, 1000)
function robodemo() {
    setTimeout(() => {
        document.getElementById("location").style.display = "block";
        $(".input_srch").css("position", "relative");
        $(".input_srch").css("z-index", "998");
        setTimeout(() => {
            $("#Terminal").css("display", "block")
            $("#location").css("display", "none")
            $(".input_srch").css("position", "initial");
            $(".input_srch").css("z-index", "998");
            $(".drop_div").css("z-index", "998");
            setTimeout(() => {
                $("#Terminal").css("display", "none")
                $("#location").css("display", "none")
                $("#tym").css("display", "block")
                $(".drop_div").css("z-index", "9");
                $("#tym3").css("z-index", "998");
                $("#tym2").css("z-index", "998");
                setTimeout(() => {
                    $("#Terminal").css("display", "none")
                    $("#location").css("display", "none")
                    $("#tym").css("display", "none")
                    $("#tym3").css("z-index", "9");
                    $("#tym2").css("z-index", "9");
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// $("#Terminal").click(function(){


// })
// $("#tym").click(function(){

// })
// $("#location").click(function(){


// })
$(".readonly").keydown(function (e) {
    e.preventDefault();
});

function loadDrop_Loc() {
    let lat,
        long,
        textV,
        textV2;
    textV = localStorage["LocationVal"];
    console.log(textV)
    textV2 = textV.split(",");
    lat = textV2[1];
    long = textV2[2];
    localStorage.setItem("source_latitude", lat);
    localStorage.setItem("source_longitude", long);
    localStorage.setItem("source_nameSele", textV2[3]);
}
// $(".terminalcode").click(function(){
// $("#pickupDiv").on('click', '.terminalcode', function () {
$(document).on('click', '.terminalcode', async function () {
    // var changeLoc;
    // changeLoc.addListener("changeLoc", () => {
    // console.log(localStorage["LocationVal"])
    $(".terminalcode").removeClass("activeTerminal")
    $(this).addClass("activeTerminal")
    // })

    // $("#cabPickupTime").change(function () {
    let lat,
        long,
        textV,
        textV2;
    // textV = $(this).val();
    textV = localStorage["LocationVal"];
    console.log(textV)
    textV2 = textV.split(",");
    lat = textV2[1];
    long = textV2[2];
    localStorage.setItem("source_latitude", lat);
    localStorage.setItem("source_longitude", long);
    localStorage.setItem("source_nameSele", textV2[3]);
    if (localStorage["CabSHOW"]) {
        await lastDetails()
        await partnerSlider(JSON.parse(localStorage["cab_response"]), "sedan", localStorage["ArrivalStation"]);
    }
    if ($("#pac-input").val() != "") {
        $("#pac-input").trigger("places_changed");
    }
    // });
})


var a,
    b;

function haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
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


function initAutocomplete() {
    let PickUpPoint;
    if (localStorage["source_latitude"]) {
        let lat = parseFloat(localStorage["source_latitude"]);
        let lng = parseFloat(localStorage["source_longitude"]);
        // alert(localStorage["source_latitude"]);
        PickUpPoint = {
            lat: lat,
            lng: lng
        };
    } else {
        PickUpPoint = {
            lat: 29.554659,
            lng: 77.090695
        };
    }
    // console.log(PickUpPoint);
    // const DropPoint = {lat: 40.771209, lng: -73.9673991};
    // roadmap, satellite, hybrid and terrain
    const map = new google.maps.Map(document.getElementById("map"), {
        center: PickUpPoint,
        zoom: 13,
        mapTypeId: "terrain",
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullScreenControl: false
    });
    var mk1 = new google.maps.Marker({ position: PickUpPoint, map: map, title: "Drop Point" });

    //    var interval2 = setInterval(() => {
    //         if(document.getElementById("pac-input").value.length >= 3)
    //         {
    // clearInterval(interval2);



    let inputContainer = document.querySelector('pac-input');
    let autocomplete_results = document.querySelector('.autocomplete-results');
    // let service = new google.maps.places.AutocompleteService();
    let serviceDetails = new google.maps.places.PlacesService(map);

    // Create a new session token.
    var sessionToken = new google.maps.places.AutocompleteSessionToken();
    var countryRestrict = { 'country': 'in' };
    // Pass the token to the autocomplete service.
    var service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({
        //input: 'pizza near Syd',
        componentRestrictions: countryRestrict,
        sessionToken: sessionToken
    },
        displaySuggestions);
    let marker = new google.maps.Marker({
        map: map
    });
    var displaySuggestions = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
        }
        let results_html = [];
        predictions.forEach(function (prediction) {
            results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id}><span class="autocomplete-icon icon-localities"></span>      			    <span class="autocomplete-text">${prediction.description}</span></li>`);
        });
        autocomplete_results.innerHTML = results_html.join("");
        autocomplete_results.style.display = 'block';
        let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
        for (let autocomplete_item of autocomplete_items) {
            autocomplete_item.addEventListener('click', function () {
                let prediction = {};
                const selected_text = this.querySelector('.autocomplete-text').textContent;
                var placeArr = selected_text.split(",");
                console.log(placeArr.slice(-3, -1)[0]);
                localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);
                const place_id = this.getAttribute('data-place-id');
                let request = {
                    placeId: place_id,
                    fields: ['name', 'geometry']
                };

                serviceDetails.getDetails(request, function (place, status) {
                    console.log(place)
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                        }
                        var bounds = new google.maps.LatLngBounds();
                        
                        if (localStorage["source_latitude"]) {
                            let lat = parseFloat(localStorage["source_latitude"]);
                            let lng = parseFloat(localStorage["source_longitude"]);
                            // alert(localStorage["source_latitude"])
                            PickUpPoint = {
                                lat: lat,
                                lng: lng
                            };
                        } else {
                            PickUpPoint = {
                                lat: 28.554659,
                                lng: 77.090695
                            };
                        } 
                        // fillInAddress2(place);
                        // $("#ndl1").css("display", "block");
                        // $("#ndl1").html("<b>" + $("#pac-input").val() + "</b>");
                        // $("#ndl2").html("Updated location: <b>" + $("#pac-input").val() + "</b>");
                        $("#upDown").removeClass("fa-chevron-up");
                        $("#upDown").addClass("fa-chevron-down");
                        $("#yourInfo").css("height", "2%");
                        $("#arr").css("top", "0%");
                        $("#addressBox").css("height", "230px");
                        $("#makeSerIconI").removeClass("fa-crosshairs");
                        $("#makeSerIconI").addClass("fa-times");
                        a = place.geometry.location.lat();
                        b = place.geometry.location.lng();
                
                        const DropPoint2 = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };
                
                
                        localStorage.setItem("pickup_lat", a);
                        localStorage.setItem("pickup_long", b);
                        // console.log(localStorage["pickup_lat"]);
                        var mk2 = new google.maps.Marker({position: DropPoint2, map: map, title: "Drop Point"});
                        // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
                        var distance = haversine_distance(mk1, mk2);
                
                        console.log(distance)
                        // document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " mi.";
                
                        console.log(a);
                        console.log(b);
                        if (place.length == 0) {
                            return;
                        }
                        let directionsService = new google.maps.DirectionsService();
                        let directionsRenderer = new google.maps.DirectionsRenderer();
                        directionsRenderer.setMap(map);
                        // Existing map object displays directions
                        // Create route from existing points used for markers
                        const route = {
                            origin: PickUpPoint,
                            destination: DropPoint2,
                            travelMode: 'DRIVING'
                        }
                
                        directionsService.route(route, function (response, status) { // anonymous function to capture directions
                            if (status !== 'OK') {
                                window.alert('Directions request failed due to ' + status);
                                return;
                            } else {
                                directionsRenderer.setDirections(response); // Add route to the map
                                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                                if (! directionsData) {
                                    window.alert('Directions request failed');
                                    return;
                                } else {
                                    $("#msg").fadeIn();
                                    // document.getElementById('km').innerHTML = directionsData.distance.text + " (" + directionsData.duration.text + ")";
                                    // document.getElementById('km').innerHTML = directionsData.distance.text;
                                    localStorage["KMVal"] = directionsData.distance.text;
                                    console.log(localStorage["KMVal"])
                                    let ds = (directionsData.distance.value / 1000);
                                    let distanceP = Math.round(ds);
                                    localStorage["KMNum"] = distanceP;
                                    if (localStorage["CabSHOW"] == "true") { // lastDetails();
                                        partnerSlider(JSON.parse(localStorage["cab_response"]), "sedan", localStorage["ArrivalStation"]);
                                    }
                                    $("#conPicLoc").css("display", "block");
                                }
                            }
                        });
                        // marker.setPosition(place.geometry.location);
                        // if (place.geometry.viewport) {
                        //     bounds.union(place.geometry.viewport);
                        // } else {
                        //     bounds.extend(place.geometry.location);
                        // }
                        // map.fitBounds(bounds);
                    }
                    autocomplete_input.value = selected_text;
                    autocomplete_results.style.display = 'none';
                });
            })
        }
    };
    let autocomplete_input = document.getElementById('pac-input');
    autocomplete_input.addEventListener('input', debounce(function () {
        let value = this.value;
        value.replace('"', '\\"').replace(/^\s+|\s+$/g, '');
        if (value !== "") {
            service.getPlacePredictions({
                input: value,
                componentRestrictions: { country: 'in' }
            }, displaySuggestions);
        } else {
            autocomplete_results.innerHTML = '';
            autocomplete_results.style.display = 'none';
        }
    }, 150));



}
// }, 500);
// }

var iOS = navigator.platform && /iPad|iPhone|Mac|iPod/.test(navigator.platform);

if (iOS) {
    $(".input_srch").css("padding", "0.9em 1.4em .6em .8em");
    $(".client_dtl").css("padding", ".79em 1.4em .6em .8em;");
    $(".depart_ui").css("width", "100%");
    $(".back_depart").css("width", "100%");
}

$("#status").click(function () {
    $(".thank_msg i").removeClass("fa-times-circle");
    $(".thank_msg i").addClass("fa-check-circle");
    $("#brand-logo").css("filter", "blur(0px)");
    $("#addressBox").css("filter", "blur(0px)");
    $("#mapBox").css("filter", "blur(0px)");
    $("#yourInfo").css("filter", "blur(0px)");
    $(".confirmation_boxCabDiv").css("display", "none");
    $(".confirmation_boxCab").css("display", "none");
});


async function setLatLong(city) {
    let pl = JSON.parse(localStorage["pickupPoint"]);
    // console.log(pl[city]);
    // console.log(pl[city][0]["source_latitude"]);
    localStorage.setItem("source_latitude", pl[city][0]["source_latitude"]);
    localStorage.setItem("source_longitude", pl[city][0]["source_longitude"]);
    localStorage.setItem("source_city", pl[city][0]["source_city"]);
}
async function fillBoxcabPickup(city) { // console.log(localStorage["pickupPoint"]);
    let pl = JSON.parse(localStorage["pickupPoint"]);
    // console.log(pl);
    document.getElementById("cabPickupTime").innerHTML = "";
    let op1 = document.createElement("option");
    op1.setAttribute("selected", "true");
    // if (city != "DEL") {
    op1.setAttribute("value", "Drop Location");
    // op1.setAttribute("disabled", true);
    // op1.innerHTML = "Drop Location";
    // }
    document.getElementById("cabPickupTime").appendChild(op1);
    // console.log(city);
    // console.log(pl);

    for (let i = 0; i < pl[city].length; i++) {
        if (city == "DEL") {
            let airportName = pl[city][i]["source_name"].split("-")
            op1.innerHTML = airportName[0]
            if (i == 0) {
                var Terminal = document.createElement("div")
                Terminal.setAttribute("class", "terminalcode")
                Terminal.innerHTML = pl[city][i]["id"]
                Terminal.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
                Terminal.setAttribute("id", "T1")
                document.getElementById("pickupDiv").appendChild(Terminal)
                Terminal.onclick = function () {
                    localStorage.setItem("LocationVal", Terminal.getAttribute("value"));
                    // $(".terminalcode").trigger("changeLoc");
                }
            }
            if (i == 1) {
                var Terminal2 = document.createElement("div")
                Terminal2.setAttribute("class", "terminalcode")
                Terminal2.innerHTML = pl[city][i]["id"];
                Terminal2.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
                Terminal2.setAttribute("id", "T2")
                document.getElementById("pickupDiv").appendChild(Terminal2)
                Terminal2.onclick = function () {
                    localStorage.setItem("LocationVal", Terminal2.getAttribute("value"));
                    // $(".terminalcode").trigger("changeLoc");
                }
            }
            if (i == 2) {
                var Terminal3 = document.createElement("div")
                Terminal3.setAttribute("class", "terminalcode + activeTerminal")
                Terminal3.setAttribute("selected", "true");
                Terminal3.innerHTML = pl[city][i]["id"];
                Terminal3.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
                Terminal3.setAttribute("id", "T3")
                localStorage.setItem("LocationVal", Terminal3.getAttribute("value"));
                document.getElementById("pickupDiv").appendChild(Terminal3)
                Terminal3.onclick = function () {
                    localStorage.setItem("LocationVal", Terminal3.getAttribute("value"));
                    // $(".terminalcode").trigger("changeLoc");
                }
            }
            document.getElementById("cabPickupTime").appendChild(op1);
        } else if (city == "KQH") {
            op1.innerHTML = pl[city][i]["source_name"]
            if (i == 0) {
                var Terminal_KQH1 = document.createElement("div")
                Terminal_KQH1.setAttribute("class", "terminalcode")
                Terminal_KQH1.innerHTML = pl[city][i]["id"]
                Terminal_KQH1.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
                Terminal_KQH1.setAttribute("id", "KQH1")
                document.getElementById("pickupDiv").appendChild(Terminal_KQH1)
                Terminal_KQH1.onclick = function () {
                    localStorage.setItem("LocationVal", Terminal_KQH1.getAttribute("value"));
                    // $(".terminalcode").trigger("changeLoc");
                }
            }
            if (i == 1) {
                var Terminal_KQH2 = document.createElement("div")
                Terminal_KQH2.setAttribute("class", "terminalcode + activeTerminal")
                Terminal_KQH2.innerHTML = pl[city][i]["id"];
                Terminal_KQH2.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
                Terminal_KQH2.setAttribute("id", "KQH2")
                Terminal_KQH2.setAttribute("selected", "true");
                document.getElementById("pickupDiv").appendChild(Terminal_KQH2)
                localStorage.setItem("LocationVal", Terminal_KQH2.getAttribute("value"));
                Terminal_KQH2.onclick = function () {
                    localStorage.setItem("LocationVal", Terminal_KQH2.getAttribute("value"));
                    // $(".terminalcode").trigger("changeLoc");
                }
            }
            document.getElementById("cabPickupTime").appendChild(op1);
        } else {
            $(".fa-sort-down").css("display", "block")
            op1.innerHTML = pl[city][i]["source_name"]
            // op1.setAttribute("value", pl[city][i]["id"]);
            // let op2 = document.createElement("option");
            op1.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
            localStorage.setItem("LocationVal", op1.getAttribute("value"));
            // op2.innerHTML = pl[city][i]["source_name"];
            document.getElementById("cabPickupTime").appendChild(op1);
            // var Terminal_else = document.createElement("div")
            // Terminal_else.setAttribute("class", "terminalcode + activeTerminal")
            // Terminal_else.setAttribute("selected", "true");
            // Terminal_else.innerHTML = pl[city][i]["id"];
            // Terminal_else.setAttribute("value", city + "-" + pl[city][i]["id"] + "," + pl[city][i]["source_latitude"] + "," + pl[city][i]["source_longitude"] + "," + pl[city][i]["source_name"]);
            // // Terminal_else.setAttribute("id", "T3")
            // localStorage.setItem("LocationVal",Terminal_else.getAttribute("value"));
            // document.getElementById("pickupDiv").appendChild(Terminal_else)
            // Terminal_else.onclick = function () {
            // localStorage.setItem("LocationVal",Terminal_else.getAttribute("value"));
            //     // $(".terminalcode").trigger("changeLoc");
            // }
        }
    }
}


async function departure_Ads() {
    const ads = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getDepartureAds")
    const adResponse = await ads.json();
    console.log(adResponse);

    for (let i = 0; i < adResponse.length; i++) {
        // console.log(adResponse[i].city_code)
        // console.log(localStorage["ArrivalStation"])
        if (adResponse[i].city_code.includes(localStorage["ArrivalStation"])) {
            if (adResponse[i]["type"].toLowerCase() == "interstitial" && adResponse[i]["position"] == 1) {
                localStorage.setItem("Ad", "true")
                document.getElementById("interstitial_back").style.display = "block";
                document.getElementById("interstitial_back").innerHTML = "";
                let inter = document.createElement("div");
                inter.setAttribute("class", "interstitial");
                let interImg = document.createElement("img");
                interImg.setAttribute("src", adResponse[i]["thumbnail"])
                inter.appendChild(interImg);
                interImg.onclick = function () {
                    document.getElementById("interstitial_back").style.display = "none";
                    robodemo();
                    // document.getElementById("Terminal").style.display = "block";
                }
                let cross = document.createElement("i");
                cross.setAttribute("class", "fas fa-times-circle");
                cross.setAttribute("id", "cross");
                inter.appendChild(cross);
                cross.onclick = function () {
                    document.getElementById("interstitial_back").style.display = "none";
                    let pnrD = JSON.parse(localStorage["pnrData"]);
                    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Homepage_Cross");
                    robodemo();
                    // document.getElementById("Terminal").style.display = "block";
                }
                document.getElementById("interstitial_back").appendChild(inter);
                var closeTym;
                if (adResponse[i]["interstitial_time"] != "" || adResponse[i]["interstitial_time"] != null) {
                    closeTym = adResponse[i]["interstitial_time"];
                } else {
                    closeTym = 7000;
                }
                setTimeout(() => {
                    document.getElementById("interstitial_back").style.display = "none";
                    // robodemo();
                    // document.getElementById("Terminal").style.display = "block";
                }, closeTym);
            } else if (adResponse[i]["type"].toLowerCase() == "bottom-banner") {
                document.getElementById("bottom_banner").style.display = "block";
                let interImg = document.createElement("img");
                interImg.setAttribute("src", adResponse[i]["thumbnail"])
                document.getElementById("bottom_banner").appendChild(interImg);
            } else if (adResponse[i]["type"].toLowerCase() == "top-banner") {
                document.getElementById("top_banner").style.display = "block";
                let interTop = document.createElement("img");
                interTop.setAttribute("src", adResponse[i]["thumbnail"])
                document.getElementById("top_banner").appendChild(interTop);
            }
            // else {
            //     return false;
            // }
        }
    }
    // await checkCity();
    if (!localStorage["Ad"]) {
        robodemo();
    }
}

async function getPNR(bookingId) {
    document.getElementById("loader").style.display = "block"
    if (bookingId == null || bookingId == "" || bookingId == "null") {
        document.getElementById("loader").style.display = "none"
        $("#cmmsg").html("PNR Missing");
        $(".thank_msg i").removeClass("fa-check-circle");
        $(".thank_msg i").addClass("fa-times-circle");
        $(".confirmation_boxCabDiv").css("display", "block");
        $("#brand-logo").css("filter", "blur(5px)");
        $("#addressBox").css("filter", "blur(5px)");
        $("#mapBox").css("filter", "blur(5px)");
        $("#yourInfo").css("filter", "blur(5px)");
        $(".confirmation_boxCab").css("display", "block");
        $("#continue").off("click");
        $("#continue").attr("disabled", "true");
        return 0;
    }

    // alert(bookingId);
    // let urlv = "https://preprod.mojoboxx.com/preprod/webapi/getUserDummyData?BookingID=" + bookingId;
    let urlv = "https://prod.mojoboxx.com/spicescreen/webapi/getSpicejetuserData?booking_id=" + bookingId;
    // console.log(urlv);
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: urlv,
        success: function (data) {
            document.getElementById("loader").style.display = "none"
            // console.log(data);
            // alert(localStorage["ArrivalStation"]);
            console.log(data);
            if (data.status == "101" && data.length == null) {
                window.location = "to_airport.html"
            }
            fillBoxcabPickup(data[0].DepartureStation);
            if (data.length < 1) {
                document.getElementById("loader").style.display = "none"
                $("#cmmsg").html("PNR is Missing !");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".thank_msg i").addClass("fa-times-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $("#brand-logo").css("filter", "blur(5px)");
                $("#addressBox").css("filter", "blur(5px)");
                $("#mapBox").css("filter", "blur(5px)");
                $("#yourInfo").css("filter", "blur(5px)");
                $(".confirmation_boxCab").css("display", "block");
                return 0;
            } else {
                localStorage.setItem("pnrData", JSON.stringify(data));
                // console.log(data[0].STD);
                // var fdate = moment(data[0].STD).subtract(300, 'minutes').toDate();
                // console.log(fdate);
                var date = data[0].STD;
                var time = date.split("T")[0];
                var justDate = time.slice(0, 10);

                var STD_D = data[0].STD;
                var time_m = STD_D.split("T")[1];
                var justSTD = time_m.slice(0, 5);
                // alert(STD_D.split("T")[0])

                var STA_A = data[0].STA;
                var time_A = STA_A.split("T")[1];
                var just_T = time_A.slice(0, 5);

                const d = new Date(data[0].STD);
                const zone = d.toGMTString();
                const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d)
                const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d)
                const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d)

                const right_date = da + '-' + mo + '-' + ye;
                setLatLong(data[0].DepartureStation);
                localStorage.setItem("ArrivalStation", data[0].DepartureStation);
                $("#passenger_name").html(data[0].FirstName);
                $("#passenger_source").html(data[0].DepartureStation);
                $("#passenger_to").html(data[0].ArrivalStation);
                $("#datep").html(right_date);
                $("#depart_time").html(justSTD + " hrs");

                var today = new Date();
                // var timeToday = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                // var timeToday = today.getHours() + ":" + today.getMinutes();
                var timeToday = today.getHours();
                // console.log(timeToday);
                // console.log(String(timeToday).length);
                var getMin = today.getMinutes();
                // console.log(getMin);
                // console.log(String(getMin).length);
                if (String(timeToday).length == 1) {
                    timeToday = "0" + timeToday
                }
                if (String(getMin).length == 1) {
                    getMin = "0" + getMin;
                }
                var ZeroHour = timeToday + ":" + getMin;
                // console.log(ZeroHour);

                let todayDate = new Date().toISOString().slice(0, 10)

                $('.timepicker').mdtimepicker().on('timechanged', function (e) {
                    // console.log(e.value);
                    // console.log(e.time);
                    // console.log(e.time.substring(0, 5));
                    // console.log(todayDate);
                    // console.log(justDate);
                    // console.log(ZeroHour);
                    // console.log(justSTD);

                    if (todayDate == justDate) { // console.log("date equal");
                        if (e.time.substring(0, 5) < ZeroHour) {
                            // console.log("if k andr")
                            // $("#cmmsg").html("Pickup time should be greater than current time");
                            $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours prior to your departure.");
                            $(".thank_msg i").removeClass("fa-check-circle");
                            $(".confirmation_boxCabDiv").css("display", "block");
                            $(".confirmation_boxCab").css("display", "block");
                            $(".timepicker").val("00:00");
                        }
                    }
                    if (e.time > justSTD) { // $("#cmmsg").html("Pickup time should be less than departure time");
                        $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours prior to your departure.");
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        $(".timepicker").val("00:00");
                    }
                });


                function formatDate(date) {
                    var d = new Date(date),
                        month = '' + (
                            d.getMonth() + 1
                        ),
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) 
                        month = '0' + month;
                    


                    if (day.length < 2) 
                        day = '0' + day;
                    


                    return [year, month, day].join('-');
                }

                localStorage.setItem("Date_value", formatDate(right_date))

                var twoHoursBefore = new Date(STD_D);
                var showddd = twoHoursBefore.setHours(twoHoursBefore.getHours() - 3);
                var timestamp = showddd;
                var showDate = new Date(timestamp);
                console.log(showDate)
                var time_m2 = showDate.toString().split(" ")[4]
                var tym = time_m2.slice(0, 5);
                // $(".timepicker").val(tym);
                $(".timepicker").val("00:00");

                $("#arrival_time").html(just_T + " hrs");
                $("#to_loc").val(data[0].ArrivalStation);
                $("#form_loc").val(data[0].DepartureStation);
                $("#book_date").val(right_date);
                localStorage.setItem("mobile_num", data[0].PassengerNumber);
                $("#client_name").val(data[0].FirstName);
                $("#client_last").val(data[0].LastName);
                $("#mb_number").val(data[0].PassengerNumber);
                $("#email_add").val(data[0].passenger_email);

                $("#toast_msg").css("display", "block");
                setTimeout(() => {
                    $("#toast_msg").css("display", "none");
                }, 3000);
                $("#datepicker").datepicker({ // dateFormat: "yy-mm-dd",
                    dateFormat: "dd-mm-yy",
                    startDate: '-0m'
                    // endDate: '+2d'
                });
                console.log(right_date)
                $("#datepicker").datepicker("setDate", showDate);

                // $("#datepicker").val() = right_date;

                let pnrD = JSON.parse(localStorage["pnrData"]);
                setTimeout(() => {
                    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Location_Update");
                }, 2000);
                // CheckBooking(bookingId);
                // lastDetails();
                departure_Ads();
                CheckBooking(bookingId);

            }
        },
        error: function (xhr) {
            console.log(xhr);
            $(".my-button").css("background-color", "#666");
            $("#pac-input").off("click");
            $("#pac-input").attr("disabled", "true");
            $("#makeSerIconI").off("click");

            $(".my-button").off("click");
            $(".my-button").attr("disabled", "true");
            $("#upDown").off("click");
            $("#upDown").attr("disabled", "true");

            if (xhr.statusText == "error") {
                $("#pac-input").val("Server temporarily unavailable");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".thank_msg i").addClass("fa-times-circle");
                $("#cmmsg").html("Server temporarily unavailable");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".thank_msg i").addClass("fa-times-circle");
                $("#brand-logo").css("filter", "blur(5px)");
                $("#addressBox").css("filter", "blur(5px)");
                $("#mapBox").css("filter", "blur(5px)");
                $("#yourInfo").css("filter", "blur(5px)");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                // alert("Server temporarily unavailable");
            } else if (xhr.statusText == "Bad Request") { // $("#pac-input").val("Booking ID not found.");
                $("#cmmsg").html("PNR not found.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".thank_msg i").addClass("fa-times-circle");
                $("#brand-logo").css("filter", "blur(5px)");
                $("#addressBox").css("filter", "blur(5px)");
                $("#mapBox").css("filter", "blur(5px)");
                $("#yourInfo").css("filter", "blur(5px)");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                // alert("Booking ID not found. Your address will be updated by your cab driver on boarding the cab.");
            }

        }
    });
}

function CheckBooking(bookingId) {
    let urlv = "https://prodapi.mojoboxx.com/spicescreen/webapi/getCabdetailsByPNR?pnr=" + bookingId;
    // console.log(urlv)
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: urlv,
        success: function (data) {
            console.log(data);
            console.log(data.length);
            if (data.length >= 1) {
                if (data[0].cancelled_by == "null" || data[0].cancelled_by == "" || data[0].cancelled_by == null) {
                    $("#cmmsg2").html("Your cab is scheduled");
                    $(".thank_msg i").addClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab2").css("display", "block");
                    setInterval(() => {
                        $(".auto_btn").addClass("btn_disable");
                        $("#pac-input").prop('disabled', true);
                        $("#continue").val("Cab is already booked");
                        $("#continue").prop('disabled', true);
                    }, 1000);
                    localStorage.setItem("BookedId", data[0].order_reference_number)
                }
            }
        },
        error: function (xhr) {
            Console.log("Booking check API not working")
        }
    });
}
$("#makeSerIconI").click(function () {
    if ($("#makeSerIconI").hasClass("fa-crosshairs")) {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "CurrentLocation_click");
        getLocation();
    }
    if ($("#makeSerIconI").hasClass("fa-times")) {
        $("#makeSerIconI").removeClass("fa-times");
        $("#makeSerIconI").addClass("fa-crosshairs");
        $("#addressBox").css("height", "230px");
        $("#pac-input").val("");
        $("#ndl1").html("");
        $(".my-button").on("click");
        $(".my-button").removeAttr("disabled", "true");
        $(".my-button").text("Submit");
        // initAutocomplete();
    }
});

function fillInAddress2(placeVal) { // Get the place details from the autocomplete object.
    const place = placeVal;
    let autocomplete;
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

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    console.log(place.address_components);
    for (const component of place.address_components) {
        const componentType = component.types[0];
        console.log(componentType);
        switch (componentType) {
            case "street_number":
                {
                    address1 = `${
                        component.long_name
                    } ${address1}` + ", ";
                    break;
                }

            case "route":
                {
                    address1 += component.short_name;
                    break;
                }

            case "postal_code":
                {
                    postcode = `${
                        component.long_name
                    }${postcode}`;
                    break;
                }

            case "postal_code_suffix":
                {
                    postcode = `${postcode}-${
                        component.long_name
                    }`;
                    break;
                }
            case "locality": locality = component.long_name;
                break;
            case "sublocality_level_1": sublocality1 = component.long_name + ", ";
                break;
            case "sublocality_level_2": sublocality2 = component.long_name + ", ";
                break;
            case "sublocality_level_3": sublocality3 = component.long_name + ", ";
                break;
            case "neighborhood": neighborhood = component.long_name;
                break;

            case "administrative_area_level_1":
                {
                    state = component.short_name;
                    break;
                }
            case "country": country = component.long_name;
                break;
        }
        // if(place.name != "") { placeName = place.name }
        clientAdd = place.name + " " + address1 + " " + neighborhood + " " + sublocality3 + "" + sublocality2 + "" + sublocality1;
    }
    localStorage["SourceCity"] = locality;
}

async function lastDetails() {
    // alert("eske andr")
    // $("#pac-input").trigger("places_changed");

    // window.onload = async function () {
    // localStorage.removeItem("showConfirmbutton")
    // localStorage.removeItem("cabSuccess")
    // alert(localStorage["KMVal"]);
    const departure = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getCabPartnerData");
    const cab_response = await departure.json();
    console.log(cab_response);
    localStorage.setItem("cab_response", JSON.stringify(cab_response));
    localStorage.setItem("URLimg", JSON.stringify(cab_response[0].URL))
    localStorage.setItem("partnercabType", "sedan");
    // await partnerSlider(cab_response, "sedan", "MAA");
    await partnerSlider(cab_response, "sedan", localStorage["ArrivalStation"]);
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".sedan img").addClass("active_cab");
    let pnrD = JSON.parse(localStorage["pnrData"]);
    // await Track_analytics(pnrD[0]["BookingID"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Select_Cab");
}

var scv = [];
var cabFare = [];
var cab_Type = [];
var cab_Type2 = [];
async function partnerSlider(cab_response, cabTypeName, cityType) {
    $(".coming_soon").css("display", "none");
    var swiper = "";
    document.getElementsByClassName("swiper-slide").innerHTML = "";
    document.getElementById("swiper-wrapper").innerHTML = "";
    // console.log(cabTypeName);
    let one = 0;
    scv.length = 0;
    cabFare.length = 0;
    for (let i = 0; i < cab_response.length; i++) {
        let cab_city = cab_response[i].city_code.split(",");
        let CabCITY = 0;
        // console.log(cab_city);
        if (cab_city.length == 1) {
            CabCITY = 1;
        } else {
            CabCITY = cab_city.length;
        }
        for (let jk = 0; jk < CabCITY; jk++) {
            // console.log(cab_city[jk]);
            // console.log(cityType);
            if (cab_city[jk].toLowerCase() == cityType.toLowerCase()) { // console.log(cab_city[jk]);

                cab_Type = cab_response[i].cab_type.split(",");
                console.log(cab_Type);
                let clc = 0;
                if (cab_Type.length == 1) {
                    clc = 1;
                } else {
                    clc = cab_Type.length;
                }
                let cab_Image = cab_response[i].partner_image.split(",");
                for (let j = 0; j < clc; j++) {
                    if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                        cab_Type2 = cabTypeName
                        one = 1;
                        // var timestamp = new Date().getUTCMilliseconds();
                        $(".coming_soon").css("display", "none");

                        let swiperSlide = document.createElement("div");
                        swiperSlide.setAttribute("class", "swiper-slide")
                        // swiperSlide.setAttribute("id","sj"+timestamp);

                        let partner_card = document.createElement("div");
                        partner_card.setAttribute("class", "cab_mid");
                        partner_card.setAttribute("id", cab_response[i].partner_name);

                        let partner_cardImg = document.createElement("img");
                        partner_cardImg.setAttribute("src", cab_Image[j]);
                        partner_card.appendChild(partner_cardImg);

                        // swiperSlide.onclick = function()
                        // {
                        //     console.log(cab_response[i]);
                        //     calculatePricePartnerWise(cab_response[i].partner_name,localStorage["KMNum"]);
                        // }
                        scv.push(cab_response[i].partner_name);
                        console.log(scv)
                        console.log(scv.length)
                        console.log(scv[0])
                        // let pName = cab_response[0].partner_name;
                        await myFunction(scv[0])
                        localStorage.setItem("partnerName", scv[0]);

                        swiperSlide.appendChild(partner_card);
                        document.getElementById("swiper-wrapper").appendChild(swiperSlide);

                        // if (cab_response[j].is_footer == "true") {
                        // Bootom Code here
                        // var sideDiv = document.createElement("div");
                        // sideDiv.setAttribute("class", "sideDetails");
                        // var fromPara = document.createElement("p")
                        // fromPara.setAttribute("class", "FromPara");
                        // var fromSpan = document.createElement("span")
                        // fromSpan.innerHTML = "From : "
                        // fromPara.appendChild(fromSpan);
                        // var fromLoc = document.createElement("span")
                        // fromLoc.setAttribute("id", "yPickupLocText");

                        // fromLoc.innerHTML = $("#pac-input").val().substring(0, 50);
                        // fromPara.appendChild(fromLoc);
                        // sideDiv.appendChild(fromPara)

                        // var ToPara = document.createElement("p")
                        // ToPara.setAttribute("class", "ToPara");
                        // var ToSpan = document.createElement("span")
                        // ToSpan.innerHTML = "To : "
                        // ToPara.appendChild(ToSpan);
                        // var ToLoc = document.createElement("span")
                        // ToLoc.setAttribute("id", "yDropLocText");


                        // textV = localStorage["LocationVal"]
                        // textV2 = textV.split(",");

                        // ToLoc.innerHTML = textV2[3]
                        // ToPara.appendChild(ToLoc);
                        // sideDiv.appendChild(ToPara)

                        // partner_card.appendChild(sideDiv)

                        var footerDiv = document.createElement("div");
                        footerDiv.setAttribute("class", "bottomDiv");

                        var percent = document.createElement("p")
                        percent.setAttribute("class", "perdiscount")
                        percent.setAttribute("id", "discount" + cab_response[i].partner_name)
                        percent.innerHTML = "15% off"
                        footerDiv.appendChild(percent);

                        var discount = document.createElement("div");
                        discount.setAttribute("id", "discount")
                        var disSpan = document.createElement("span")
                        disSpan.innerHTML = ""
                        var disSpan2 = document.createElement("span")
                        disSpan2.setAttribute("id", "pr2" + cab_response[i].partner_name);
                        disSpan2.innerHTML = "Rs. --";

                        discount.appendChild(disSpan);
                        discount.appendChild(disSpan2);
                        footerDiv.appendChild(discount);


                        // var discountPer = document.createElement("div");
                        // discountPer.setAttribute("id", "discountPer")
                        // var discountSpan = document.createElement("span")
                        // discountSpan.innerHTML = ""
                        // var discountSpan2 = document.createElement("span")
                        // // alert("pr2" + cab_response[i].partner_name.value);
                        // // discountSpan2.setAttribute("id", "pr2" + cab_response[i].partner_name);
                        // discountSpan2.innerHTML = "15% off";

                        // discountPer.appendChild(discountSpan);
                        // discountPer.appendChild(discountSpan2);
                        // partner_card.appendChild(discountPer);


                        var fare = document.createElement("div");
                        fare.setAttribute("id", "fare")
                        var Fare_para = document.createElement("span")
                        Fare_para.innerHTML = ""
                        var Fare_para2 = document.createElement("span")
                        Fare_para2.setAttribute("id", "pr" + cab_response[i].partner_name);
                        Fare_para2.innerHTML = "RS. --";

                        fare.appendChild(Fare_para);
                        fare.appendChild(Fare_para2);
                        footerDiv.appendChild(fare);
                        var includeLine = document.createElement("p")
                        includeLine.setAttribute("class", "include")
                        includeLine.innerHTML = "Exact fare will be calculated basis total distance and trip time"
                        footerDiv.appendChild(includeLine);
                        partner_card.appendChild(footerDiv);

                        var distPara = document.createElement("p");
                        distPara.setAttribute("id", "distPara")
                        distPara.innerHTML = "Estimated Distance"
                        partner_card.appendChild(distPara);
                        var distance = document.createElement("div");
                        distance.setAttribute("id", "dist")
                        // var para = document.createElement("span")
                        // para.innerHTML = "Estimated Distance :"
                        // distance.appendChild(para);

                        var para2 = document.createElement("span")
                        para2.setAttribute("id", "km" + cab_response[i].partner_name);
                        para2.innerHTML = "--- Km";
                        distance.appendChild(para2);


                        partner_card.appendChild(distance);

                        document.getElementById("km" + cab_response[i].partner_name).innerHTML = localStorage["KMVal"] + "s";
                        calculatePricePartnerWise(cab_response[i].partner_name, localStorage["KMNum"], cab_Type[j], cab_city[jk]);

                        cabFare.push(localStorage["finalFare" + cab_response[i].partner_name]);
                        // console.log(cabFare)
                        localStorage.setItem("partnerFare", cabFare[0]);
                        // }


                        async function calculatePricePartnerWise(partnerName, KMNum, cabTyp, cityName) {
                            // alert(partnerName);
                            // alert(KMNum)

                            if (partnerName == "QUICKRIDE") {
                                $("#prQUICKRIDE").html("Please wait..")
                                $("#fare").css("width", "100%"); // console.log("QUICKRIDE hai");
                                await GetFarefromPartner(cabTyp);
                            } else {
                                await CalculateFareStatic();
                            }

                            async function CalculateFareStatic() {
                                var hypenVal;
                                var hypen_pos;
                                var dis;
                                var dis2;
                                var amt;
                                if (partnerName == "BLUSMART") { // alert(partnerName);
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 10) {
                                        desP = "269 - 299";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "359";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "429";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "519";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "569";
                                    } else if (distanceP >= 31) {
                                        k = "" + (
                                            569 + ((distanceP - 30) * 12)
                                        );
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "BROCABS" && cabTyp.toLowerCase() == "sedan" && cityName == "DEL") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 10) {
                                        desP = "410";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "425 - 480";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "490 - 550";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "565 - 615";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "625 - 685";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "700 - 760";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "760 - 840";
                                    } else if (distanceP >= 41 && distanceP <= 45) {
                                        desP = "940 - 1080";
                                    } else if (distanceP >= 46) {
                                        k = (1080 + ((distanceP - 45) * 24));
                                        desP = k;
                                    }
                                    // if(String(desP).includes("-"))
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "BROCABS" && cabTyp.toLowerCase() == "suv" && cityName == "DEL") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 10) {
                                        desP = "500";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "550";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "650";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "750";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "850";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "1000";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "1150";
                                    } else if (distanceP >= 41 && distanceP <= 45) {
                                        desP = "1400";
                                    } else if (distanceP >= 46 && distanceP <= 50) {
                                        desP = "1800";
                                    } else if (distanceP >= 51) {
                                        k = (1800 + ((distanceP - 50) * 36));
                                        desP = k;
                                    }

                                    // if(String(desP).includes("-"))
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "TAXIBAZAAR" && cabTyp.toLowerCase() == "sedan" && cityName == "ATQ") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 5) {
                                        desP = "549";
                                    } else if (distanceP >= 06 && distanceP <= 10) {
                                        desP = "649";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "749";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "849";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "949";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "1049";
                                    } else if (distanceP >= 31) {
                                        k = (1049 + ((distanceP - 30) * 18));
                                        desP = k;
                                    }
                                    // if(String(desP).includes("-"))
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "SAI SHRADDHA CABS" && cabTyp.toLowerCase() == "sedan" && cityName == "SAG") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 15) {
                                        desP = "600";
                                    } else if (distanceP >= 16) {
                                        k = (600 + ((distanceP - 15) * 10));
                                        desP = k;
                                    }

                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "SAI SHRADDHA CABS" && cabTyp.toLowerCase() == "suv" && cityName == "SAG") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 15) {
                                        desP = "1200";
                                    } else if (distanceP >= 16) {
                                        k = (1200 + ((distanceP - 15) * 16));
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "TAXIBAZAAR" && cabTyp.toLowerCase() == "suv" && cityName == "ATQ") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 5) {
                                        desP = "659";
                                    } else if (distanceP >= 06 && distanceP <= 10) {
                                        desP = "879";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "989";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "1099";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "1264";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "1407";
                                    } else if (distanceP >= 31) {
                                        k = (1407 + ((distanceP - 30) * 24));
                                        desP = k;
                                    }
                                    // if(String(desP).includes("-"))
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "WTI") { // alert(partnerName);
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 10) {
                                        desP = "269 - 299";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "359";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "429";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "519";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "569";
                                    } else if (distanceP >= 31) {
                                        k = "" + (
                                            569 + ((distanceP - 30) * 12)
                                        );
                                        desP = k;
                                    }
                                    // if(String(desP).includes("-"))
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "HELIOS" && cabTyp.toLowerCase() == "hatchback" && cityName == "BOM") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 5) {
                                        desP = "156 - 203";
                                    } else if (distanceP >= 6 && distanceP <= 10) {
                                        desP = "226 - 318";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "341 - 434";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "457 - 549";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "572 - 665";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "688 - 780";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "803 - 896";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "919 - 1011";
                                    } else if (distanceP >= 41) {
                                        k = (1011 + ((distanceP - 40) * 14));
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "HELIOS" && cabTyp.toLowerCase() == "sedan" && cityName == "BOM") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 5) {
                                        desP = "184 - 233";
                                    } else if (distanceP >= 6 && distanceP <= 10) {
                                        desP = "259 - 364";
                                    } else if (distanceP >= 11 && distanceP <= 15) {
                                        desP = "391 - 496";
                                    } else if (distanceP >= 16 && distanceP <= 20) {
                                        desP = "522 - 627";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "653 - 758";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "784 - 889";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "916 - 1021";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "1047 - 1152";
                                    } else if (distanceP >= 41) {
                                        k = (1152 + ((distanceP - 40) * 16));
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "EMS") {

                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 30) {
                                        desP = "799";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "839 - 915";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "934 - 1010";
                                    } else if (distanceP >= 41 && distanceP <= 45) {
                                        desP = "1029 - 1105";
                                    } else if (distanceP >= 46 && distanceP <= 50) {
                                        desP = "1124 - 1200";
                                    } else if (distanceP >= 51) {
                                        k = "" + (
                                            1200 + ((distanceP - 50) * 21)
                                        );
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "GOSAFE") {

                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 10) {
                                        desP = "350";
                                    } else if (distanceP >= 11 && distanceP <= 20) {
                                        desP = "550";
                                    } else if (distanceP >= 21 && distanceP <= 30) {
                                        desP = "850";
                                    } else if (distanceP >= 31 && distanceP <= 40) {
                                        desP = "1150";
                                    } else if (distanceP >= 41 && distanceP <= 50) {
                                        desP = "1450";
                                    } else if (distanceP >= 51) {
                                        k = "" + (
                                            1450 + ((distanceP - 50) * 29)
                                        );
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "CREDENCE MOBILITY" && cabTyp.toLowerCase() == "sedan" && cityName == "CCU") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 20) {
                                        desP = "840";
                                    } else if (distanceP >= 21 && distanceP <= 25) {
                                        desP = "1050";
                                    } else if (distanceP >= 26 && distanceP <= 30) {
                                        desP = "1208";
                                    } else if (distanceP >= 31 && distanceP <= 35) {
                                        desP = "1418";
                                    } else if (distanceP >= 36 && distanceP <= 40) {
                                        desP = "1575";
                                    } else if (distanceP >= 41) {
                                        k = "" + (
                                            1575 + ((distanceP - 40) * 41)
                                        );
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                } else if (partnerName == "CREDENCE MOBILITY" && cabTyp.toLowerCase() == "suv" && cityName == "CCU") {
                                    let distanceP = KMNum;
                                    let desP = "";
                                    if (distanceP <= 20) {
                                        desP = "1260";
                                    } else if (distanceP >= 20 && distanceP <= 30) {
                                        desP = "1680";
                                    } else if (distanceP >= 31 && distanceP <= 40) {
                                        desP = "2100";
                                    } else if (distanceP >= 41) {
                                        k = "" + (
                                            2100 + ((distanceP - 40) * 53)
                                        );
                                        desP = k;
                                    }
                                    if (String(desP).includes("-")) {
                                        hypenVal = desP.split("-")
                                        hypen_pos = hypenVal[1]
                                    } else {
                                        hypen_pos = desP
                                    } hypen_pos = hypen_pos - 75;
                                    amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                                    if (String(amt).includes(".")) {
                                        dis = String(amt).split(".")
                                        dis2 = dis[0];
                                        console.log(dis2)
                                    } else {
                                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                                    }
                                    document.getElementById("discount" + cab_response[i].partner_name).innerHTML = dis2 + "% off"
                                    document.getElementById("pr" + cab_response[i].partner_name).innerHTML = " ₹ " + hypen_pos
                                    document.getElementById("pr2" + cab_response[i].partner_name).innerHTML = "₹" + (
                                        Number(hypen_pos) + Number(50)
                                    )
                                    localStorage.setItem("finalFare" + cab_response[i].partner_name, hypen_pos);
                                    return desP;
                                }
                               
                            }
                        }
                    }
                    if (one == 0) {
                        $(".coming_soon").css("display", "block");
                        $(".auto_btn").css("display", "none");
                        $("#cab_select").css("display", "none");
                    } else {
                        $(".coming_soon").css("display", "none");
                        $(".auto_btn").css("display", "block");
                        $("#cab_select").css("display", "block");
                    }
                }
            }
        }
    }
}
swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    observer: true,
    observeParents: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 300,
        modifier: 1,
        slideShadows: true
    },
    // pagination: {
    //     el: ".swiper-pagination",
    // },
    on: {
        slideChange: async function () {
            // let index_currentSlide = swiper.activeIndex,
            // currentSlide = swiper.slides[index_currentSlide]
            // clearTimeout(mfv);
            let currentSliderValue = scv[swiper.activeIndex];
            let currentSliderFare = cabFare[swiper.activeIndex];
            // let currentSliderType = cabTypeName[swiper.activeIndex];
            // alert(currentSliderType);
            localStorage.setItem("partnerName", currentSliderValue);
            localStorage.setItem("partnerFare", currentSliderFare);
            localStorage.setItem("partnercabType", cab_Type2);
            await myFunction(currentSliderValue)
        }
    }
});

async function checkMobile() {
    var y = document.getElementById("mb_number").value;
    // console.log(y);

    if (isNaN(y) || y.indexOf(" ") != -1) {
        $("#cmmsg").html("Please enter a valid mobile number");
        // $("#cmmsg").html("Mobile number should be numeric");
        $(".thank_msg i").removeClass("fa-check-circle");
        $(".confirmation_boxCabDiv").css("display", "block");
        $(".confirmation_boxCab").css("display", "block");
        $("#continue").val("Confirm pickup")
        return false;
    }
    if (y.length > 10 || y.length < 10) {
        $("#cmmsg").html("Please enter a valid mobile number");
        // $("#cmmsg").html("Mobile number should have 10 digits");
        $(".thank_msg i").removeClass("fa-check-circle");
        $(".confirmation_boxCabDiv").css("display", "block");
        $(".confirmation_boxCab").css("display", "block");
        $("#continue").val("Confirm pickup")
        return false;
    }
    //    location.href = "cab_confirm.html";
}

// swiperSlide.onclick = function () {
// $("#continue").submit(async function (e) {
document.getElementById("ctn").onsubmit = function (e) { // localStorage.removeItem("showConfirmbutton")
    e.preventDefault();
    $("#continue").val("Please wait..")
    // await checkMobile();
    var pick_time;
    var time = $(".timepicker").val();
    var status = time.includes("M")
    if (status) {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) 
            hours = hours + 12;
        


        if (AMPM == "AM" && hours == 12) 
            hours = hours - 12;
        


        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) 
            sHours = "0" + sHours;
        


        if (minutes < 10) 
            sMinutes = "0" + sMinutes;
        


        // alert(sHours + ":" + sMinutes);
        let statusTime = sHours + ":" + sMinutes;
        // pick_time = $("#datepicker").val() + " " + statusTime
        pick_time = localStorage["Date_value"] + " " + statusTime
        localStorage.setItem("Pictime", statusTime)
    } else { // pick_time = $("#datepicker").val() + " " + $(".timepicker").val()
        pick_time = localStorage["Date_value"] + " " + $(".timepicker").val()
        localStorage.setItem("Pictime", $(".timepicker").val())
    }

    // localStorage["cabPickupTime"] = $("#cabPickupTime").val();
    localStorage["cabPickupTime"] = localStorage["LocationVal"]
    localStorage["pacInput"] = $("#pac-input").val();

    localStorage.setItem("customerPickupTime", pick_time);
    // localStorage.setItem("pickup_time", $("#datepicker").val());
    localStorage.setItem("pickup_time", localStorage["Date_value"]);

    var input_loc = $("#pac-input").val();
    localStorage.setItem("user_input_loc", input_loc);
    // localStorage["cabPickupTime"] = $("#cabPickupTime").val();
    localStorage.setItem("ptnr", localStorage["partnerName"]);
    // localStorage.setItem("showConfirmbutton", true);
    // console.log(cabFare)
    if (localStorage["ptnr"] != "QUICKRIDE") {
        localStorage.setItem("TotalFare", localStorage["partnerFare"]);
    }

    var final_data = JSON.parse(localStorage["pnrData"])
    console.log(final_data);
    var customerFName = final_data[0].FirstName;
    var title = final_data[0].Title;
    // alert(title);
    // console.log(final_data[0].passenger_name);
    var customerNumber = final_data[0].PassengerNumber;
    var customerEmail = final_data[0].passenger_email;
    var source_ci = localStorage["user_input_loc"];
    // alert(source_ci);
    var dest_city = final_data[0].DepartureStation;

    let lat,
        long,
        textV,
        textV2,
        dropLoc;
    // textV = localStorage["cabPickupTime"];
    textV = localStorage["LocationVal"]
    textV2 = textV.split(",");
    dropLoc = textV2[0];
    lat = textV2[1];
    long = textV2[2];
    var dropLocation = dropLoc;

    var pickuplocation = localStorage["user_input_loc"];
    // alert(pickuplocation);


    // var newdate = localStorage["pickup_time"].split("-").reverse().join("-");
    // var pickup_time = newdate + " " + localStorage["Pictime"];
    var pickup_time = localStorage["Date_value"] + " " + localStorage["Pictime"];
    var fare_prc = localStorage["distanceP"];
    var distance = localStorage["KMNum"];

    var flight_number = final_data[0].FlightNumber;

    console.log(pickup_time);
    // console.log(fare_prc);

    var price = localStorage["TotalFare"];

    var success_lat = (localStorage["pickup_lat"]);
    var success_long = (localStorage["pickup_long"]);
    var success_date = (localStorage["customerPickupTime"]);
    var start_date = success_date.replace('/', '-');
    var start_date2 = start_date.replace('/', '-');

    var new_time = new Date(start_date2);
    new_time.setHours(new_time.getHours() + 2);

    console.log(success_long);
    // alert(success_date);
    var date = success_date;
    var time = date.split(" ")[0];
    var justDate = time.slice(0, 10);
    console.log(justDate);

    var time = date.split(" ")[0];
    var justtime = time.substr(10, 10);
    console.log(justtime);

    var total_km = localStorage["KMVal"].split(" ");
    totalkm = Math.round(total_km[0]);
    // $("#continue").val("Please wait..")
    dataJ = {
        "clubMember": [
            {
                "type": "cabForm",
                "name_title": title,
                "user_name": customerFName,
                "last_name": "SpiceJet Customer",
                "mobile": $("#mb_number").val(),
                "email": "hello@mojoboxx.com",
                "time": Date.now(),
                "sendLeadSms": "true",
                "partnerName": localStorage["ptnr"],
                "title": localStorage["ptnr"],
                "category": "CAB",
                "drop_location": localStorage["source_nameSele"],
                "pickup_time": pickup_time,
                "cab_type": localStorage["partnercabType"],
                "fare_price": price,
                "total_kilometers": totalkm,
                "terminalCode": dropLocation,
                "msgUniqueId": getRandom(10),
                "from_city": dropLocation.substring(0, 3),
                "to_city": dropLocation.substring(0, 3),
                "source": pickuplocation.substring(0, 100),
                "destination": localStorage["source_nameSele"],
                "latitude": localStorage["pickup_lat"],
                "longitude": localStorage["pickup_long"],
                "isDeparture": 1,
                "pnr": localStorage["booking_id"],
                "source_city": localStorage["SourceCity"],
                "source_latitude": localStorage["pickup_lat"],
                "source_longitude": localStorage["pickup_long"],
                "source_name": pickuplocation.substring(0, 100),
                "destination_city": localStorage["source_city"],
                "destination_latitude": localStorage["source_latitude"],
                "destination_longitude": localStorage["source_longitude"],
                "destination_name": localStorage["source_nameSele"],
                "status": "CAB"
            }
        ]
    };
    console.log(dataJ);

    $.ajax({
        type: 'POST',
        url: 'https://prod.mojoboxx.com/spicescreen/webapi/vuscreen/registerClubMember',
        contentType: 'application/json',
        Accept: 'application/json',
        data: JSON.stringify(dataJ),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            // console.log(dataJ);
            location.href = "cab_confirm.html";
            localStorage.setItem("departurenotify", localStorage["URLimg"]);
            // $("#cmmsg").html("Your cab booking has been confirmed! Click the bell icon on top right to check the booking details. Details will also be sent to your registered mobile number.");
            // $(".confirmation_boxCabDiv").css("display", "block");
            // $("#brand-logo").css("filter", "blur(5px)");
            // $("#addressBox").css("filter", "blur(5px)");
            // $("#mapBox").css("filter", "blur(5px)");
            // $("#yourInfo").css("filter", "blur(5px)");
            // $(".confirmation_boxCab").css("display", "block");
        },
        error: function (res) {
            console.log(res);
            console.log("Cab booking failed");
            $("#cmmsg").html("Booking failed");
            $(".confirmation_boxCabDiv").css("display", "block");
            $("#brand-logo").css("filter", "blur(5px)");
            $("#addressBox").css("filter", "blur(5px)");
            $("#mapBox").css("filter", "blur(5px)");
            $("#yourInfo").css("filter", "blur(5px)");
            $(".confirmation_boxCab").css("display", "block");
        }
    });

}

// }


function myFunction(pname) {
    let mfv = "";
    console.log(pname);
    localStorage.setItem("selectedCab", pname)
    // var x = document.getElementById("snackbar");
    // x.innerHTML = pname + " CAB IS SELECTED";
    // document.getElementById("continue").value = "";
    // document.getElementById("continue").value = "RIDE WITH " + pname;
    // x.className = "show";
    // mfv = setTimeout(function () {
    //     x.className = x.className.replace("show", "");
    // }, 3000);
}

$(".mini").click(async function () {
    let cab_response = JSON.parse(localStorage["cab_response"]);
    // partnerSlider(cab_response, "hatchback", "MAA");
    // await lastDetails()
    await partnerSlider(cab_response, "hatchback", localStorage["ArrivalStation"]);
    localStorage.setItem("partnercabType", "hatchback");
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".mini img").addClass("active_cab");
})

$(".sedan").click(async function () {
    let cab_response = JSON.parse(localStorage["cab_response"]);
    // console.log(cab_response);
    // await lastDetails()
    await partnerSlider(cab_response, "sedan", localStorage["ArrivalStation"]);
    // partnerSlider(cab_response, "sedan", "MAA");
    localStorage.setItem("partnercabType", "sedan");
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".sedan img").addClass("active_cab");
})

$(".suv").click(async function () {
    let cab_response = JSON.parse(localStorage["cab_response"]);
    // partnerSlider(cab_response, "suv", "MAA");
    // await lastDetails()
    await partnerSlider(cab_response, "suv", localStorage["ArrivalStation"]);
    localStorage.setItem("partnercabType", "suv");
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".suv img").addClass("active_cab");
})

// ///////////////////////Get fare from Quickride API code start////////////////////////

async function GetFarefromPartner(PartnercabType) {
    document.getElementById("pr2QUICKRIDE").style.display = "none";
    var GetCurrentTime = new Date().getTime();
    // console.log(GetCurrentTime);
    const fetchData = await fetch("https://qtds.getquickride.com:443/taxidemandserver/rest/b2bPartner/fare?startLat=" + localStorage["pickup_lat"] + "&startLng=" + localStorage["pickup_long"] + "&endLat=" + localStorage["source_latitude"] + "&endLng=" + localStorage["source_longitude"] + "&startTime=" + GetCurrentTime + "&b2bPartnerCode=MOJO_BOXX_ZORY&token=MojoBox-Klm9.45j&userId=64", { // const fetchData = await fetch("http://testre.getquickride.com:8080/taxidemandserver/rest/b2bPartner/fare?startLat=" + localStorage["pickup_lat"] + "&startLng=" + localStorage["pickup_long"] + "&endLat=" + localStorage["source_latitude"] + "&endLng=" + localStorage["source_longitude"] + "&startTime=" + GetCurrentTime + "&b2bPartnerCode=MOJO_BOXX_ZORY&token=MojoBox-Klm9.45j&userId=64", {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NCIsImlzcyI6IlF1aWNrUmlkZSIsImlhdCI6MTYzNzgzNzMwNX0.lWa_3B-tzutgOsnERuCENBMZ4mxwy3ZqKmrX5j45FHxE8ssBjDHYZjJ-vDhIOr7Uk6_2oHz1zbXv9A-DP-l0NQ'
        }
    })
    // console.log("https://qtds.getquickride.com:443/taxidemandserver/rest/b2bPartner/fare?startLat=" + localStorage["pickup_lat"] + "&startLng=" + localStorage["pickup_long"] + "&endLat=" + localStorage["source_latitude"] + "&endLng=" + localStorage["source_longitude"] + "&startTime=" + GetCurrentTime + "&b2bPartnerCode=MOJO_BOXX_ZORY&token=MojoBox-Klm9.45j&userId=64");
    const fetchResponse = await fetchData.json();
    console.log(fetchResponse);
    if (fetchResponse.result == "FAILURE") {
        console.log("Quickride Fare API failed")
    }
    if (fetchResponse.result == "SUCCESS") {

        for (let a = 0; a < fetchResponse.resultData.fareForTaxis.length; a++) {
            let TaxiType = fetchResponse.resultData.fareForTaxis[a].taxiType;
            // console.log(fetchResponse.resultData.fareForTaxis[0].fares)
            // console.log(fetchResponse.resultData.fareForTaxis[0].fares.length)
            if (TaxiType == "Car") {
                var fareResponse = fetchResponse.resultData.fareForTaxis[a].fares;
                // console.log(fareResponse);
                if (fareResponse.length >= 1) {
                    for (let i = 0; i < fareResponse.length; i++) { // console.log(fareResponse[i].taxiType)
                        if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) {
                            console.log(fareResponse[i].taxiType);
                            let AmountDiscount = ((50 / (fareResponse[i].maxTotalFare + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            $("#fare").css("width","45%");
                            document.getElementById("pr2QUICKRIDE").style.display = "block";
                            document.getElementById("discountQUICKRIDE").innerHTML = splitAmount2 + "% off"
                            document.getElementById("prQUICKRIDE").innerHTML = " ₹ " + fareResponse[i].maxTotalFare
                            document.getElementById("pr2QUICKRIDE").innerHTML = "₹" + (
                                Number(fareResponse[i].maxTotalFare) + Number(50)
                            )
                            localStorage.setItem("finalFare" + PartnercabType, fareResponse[i].maxTotalFare);
                            localStorage.setItem("TotalFare", fareResponse[i].maxTotalFare);
                        }
                    }
                }
            }
        }
    }
}

// //////////////////////get fare from quickride code end ///////////////////////////
