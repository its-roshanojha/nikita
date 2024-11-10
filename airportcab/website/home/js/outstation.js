
async function loadOutstationData() {
    var sessionToken
    var MultiplierAmount;
    var stateforinvoice;


    ShowSelfDrive = "no";
    $("#pickupDiv").css("width", "97%")
    $("#pickupDiv2").css("display", "none")
    $(".fa-sort-down").css("right", "1%")
    $("#OutstationLoad").css("display", "block")
    localStorage.removeItem("source_latitude")
    localStorage.removeItem("source_longitude")

    $("#ctn").css("display", "block")
    $(".selfType").css("display", "none")
    $(".coming_soon2").css("display", "none")

    $("#ConfirmButton").css("display", "none")
    $(".ForNon-pnrLoad").css("display", "block")
    $(".pnr_pickup").css("display", "block")
    $("#etaDiv").css("display", "block")
    $("#tym2").css("display", "block")

    // loadCityOutstation('', 'is_departure');
    $("#cabPickupTerminal").empty();
    $("#pac-inputOutstation").val('');
    $(".Locationbox").addClass("fa-map-marker-alt");
    $(".Locationbox").removeClass("fa-times");
    // var firstP = document.getElementById("makeSerIconI");
    // firstP.setAttribute("class", "Locationbox fas fa-map-marker-alt");
    // $("#makeSerIconI").removeAttr('id')

    document.getElementsByClassName("swiper-slide").innerHTML = "";
    document.getElementById("swiper-wrapper").innerHTML = "";
    BookingTrip_Type = "Outstation"
    localStorage["rideType"] = "Outstation"
    $("#notePoint").css("display", "none")
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".sedan img").addClass("active_cab");

    // $(".auto_btn").removeClass("btn_enable");
    // $("#continue").removeAttr('enabled');
    // $("#continue").css("color", "#828282");
    localStorage.removeItem("cab_response")

    localStorage.removeItem("CabSHOW");
    var bookingId = localStorage["booking_id"];
    // await loadCityOutstation('', 'is_arrival');

    setTimeout(() => {
        initAutocomplete();
        LoadDropLocationMap()
    }, 3000);
    // LoadDropLocationMap()
    await getPNR(bookingId);
    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch(BaseURL+domain+'/webapi/meruPickupPoint?city=' + CityCode);
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }

    // ////////////Load city data code start ///////////
    async function loadCityOutstation(ArrivalCode = '', TripType) {
        // alert("load outstation city")
        $("#outstationCity").empty();
        return new Promise(async function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: BaseURL+domain+'/webapi/getCityList',
                contentType: "application/json",
                dataType: 'json',
                success: function (data) {
                    let dynamicOption = '';
                    var cityArray = [];
                    console.log(data);
                    data.forEach(element => {
                        if (element[TripType] == "1") {
                            cityArray.push(element);
                        }
                    })
                    if (TripType == 'isSelfDrive') {
                        dynamicOption += `<option selected="true" value="Select City">Select City</option>`
                    } else {
                        dynamicOption += `<option selected="true" value="Select City">Select Pickup City</option>`
                    }
                    $.each(cityArray, function (i, currProgram) {
                        if (ArrivalCode != '' && currProgram.code == ArrivalCode) {
                            dynamicOption += `<option selected="true" value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                            fillTerminalCodeByCity(ArrivalCode)
                        } else {
                            dynamicOption += `<option value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                        }
                    });
                    $("#outstationCity").append(dynamicOption)
                    resolve(true);
                },
                error: function (e) {
                    console.log(e)
                    reject("City list not found");
                }
            });
        })

    }
    // ////////////Load city data code end  ///////////

    $("#cabPickupTerminal").on('change', function () {
        var AirportName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]
        if (AirportName.trim() == $("#cabPickupTerminal :selected").text().trim()) {
            localStorage.setItem("source_latitudeValue", $("#cabPickupTerminal :selected").attr('class').split(",")[1])
            localStorage.setItem("source_longitudeValue", $("#cabPickupTerminal :selected").attr('class').split(",")[2])
        }
    })


    // /////////// Fill Terminal code in select field code start /////////////////////
    $('#outstationCity').on('change', async function () {
        await loadMeruPickPoint($(this).find(":selected").val());
        await fillTerminalCodeByCity($(this).find(":selected").val())
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        localStorage["arrival_Airport"] = $(this).find(":selected").val()
        $("#pac-inputOutstation").val('');
        $("#Drop-input").val('');
        $(".Locationbox").removeClass("fa-times");
        $(".Locationbox").addClass("fa-map-marker-alt");
        $("#makeSerIconDropI").removeClass("fa-times");
        $("#makeSerIconDropI").addClass("fa-search");
        if ($(this).find(":selected").val() == "DXB") {
            $(".manualoption").css("display", "block")
            $("#makeSerIcon").css("display", "none")
            $(".pnr_pickup").css("display", "none")
        } else {
            $(".manualoption").css("display", "none")
            $("#makeSerIcon").css("display", "block")
            $(".pnr_pickup").css("display", "block")
        }
        if (ShowSelfDrive == "yes") {
            $(".pnr_pickup").css("display", "none")
            lastDetailsOutstation();
        }
    });

    async function fillTerminalCodeByCity(cityCode = '') {
        return new Promise(async function (resolve, reject) {

            localStorage.setItem('ArrivalStation', cityCode)
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';

            const obj = JSON.parse(localStorage["pickupPoint"]);
            let lc = obj;
            let rv;
            rv = lc[cityCode];
            console.log(rv)
            localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));
            localStorage.setItem("cityCODE", cityCode);
            localStorage.setItem("source_city", rv[0].source_city)
            // if (cityCode == "DEL") {
            //     localStorage.setItem("source_latitudeValue", rv[2].source_latitude)
            //     localStorage.setItem("source_longitudeValue", rv[2].source_longitude)
            // } else {
            //     localStorage.setItem("source_latitudeValue", rv[0].source_latitude)
            //     localStorage.setItem("source_longitudeValue", rv[0].source_longitude)
            // }

            localStorage.setItem("TerminalCode", rv[0].id)
            // localStorage.setItem("SourceName", rv[0]["source_name"])
            // localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + rv[0]["source_latitude"] + "," + rv[0]["source_longitude"] + "," + rv[0]["source_name"])
            // rv != undefined && $.each(rv, function (i, currProgram) {
            //     if (cityCode == "DEL") {
            //         dynamicOption += `<option selected value="${
            //             currProgram.id
            //         }" class="${
            //             cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name
            //         }"> ${
            //             currProgram.source_name
            //         } </option>`
            //     } else {
            //         dynamicOption += `<option value="${
            //             currProgram.id
            //         }"> ${
            //             currProgram.source_name
            //         } </option>`
            //     }
            // });
            // $("#cabPickupTerminal").append(dynamicOption);
            resolve(true);
        })
    }

    // /////////// Fill Terminal code in select field code end  /////////////////////


    // async function checkCity() {
    //     localStorage.removeItem("cabFound");
    //     const departure = await fetch(BaseURL+domain+"/webapi/getCabPartnerData");
    //     const cab_response = await departure.json();
    //     console.log(cab_response);
    //     var cabLength;
    //     var cabSplit
    //     var cabArr = [];
    //     for (let i = 0; i < cab_response.length; i++) {

    //         if(cab_response[i]["city_code"].length == 1)
    //         {
    //             cabLength = 1
    //             cabArr.push(cab_response[i]["city_code"])
    //         }
    //         else{
    //             cabLength = cab_response[i]["city_code"].length
    //             cabSplit = cab_response[i]["city_code"].split(",")
    //             cabArr.push(cabSplit);
    //         }
    //         for (let j = 0; j < cabLength; j++) {
    //         // console.log(cabArr)
    //         if (cabArr[j] == (localStorage["ArrivalStation"])) {
    //             console.log("yes")
    //             localStorage.setItem("cabFound", true);
    //         }
    //     }
    //     }
    //     if (!localStorage["cabFound"]) {
    //         setInterval(() => {
    //             $("#continue").val("Not Available");
    //             $("#continue").prop('disabled', true);
    //         }, 1000);
    //         $("#cmmsg2").html("SpiceJet Departure Cab Booking Service is coming soon to your city.");
    //         $(".confirmation_boxCabDiv").css("display", "block");
    //         $(".confirmation_boxCab2").css("display", "block");
    //         $("#brand-logo").css("filter", "blur(5px)");
    //         $("#addressBox").css("filter", "blur(5px)");
    //         $("#mapBox").css("filter", "blur(5px)");
    //         $("#status").css("width", "100%");
    //         $("#status").html("Okay");
    //         $("#pac-inputOutstation").val("Not Available");
    //         $("#pac-inputOutstation").prop('disabled', true);
    //         $("#yourInfo").css("filter", "blur(5px)");
    //     }
    // }

    // $("#status2").click(function(){
    //     window.location="https://spicescreen.com/"
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
        // window.location = "http://edittrip.spicescreen.co/?bookingId=" + localStorage["BookedId"]
        window.location = "http://edit.bookairportcab.com/?bookingId=" + localStorage["BookedId"]
    });
    var x = document.getElementById("demo");


    // ////////////// Current location fetch code start /////////////////////
    function getLocation() {
        if ($("#outstationCity :selected").text() == "Select Pickup City") {
            $("#ValidateCityMsg").css("display", "block");
            setTimeout(() => {
                $("#ValidateCityMsg").css("display", "none");
            }, 2000);
            document.getElementById('ValidateCityMsg').innerHTML = "First Select City"
            return false;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        } else {
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
    };


    var service;
    function displayLocation(latitude, longitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        localStorage.setItem("myPickupLat", latitude)
        localStorage.setItem("myPickupLong", longitude)
        localStorage["source_latitudeValue"] = latitude;
        localStorage["source_longitudeValue"] = longitude;
        // console.log(geocoder);

        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    // console.log(add);
                    document.getElementById("pac-inputOutstation").innerHTML = add;
                    document.getElementById("pac-inputOutstation").value = add;
                    var pacInput = document.getElementById("pac-inputOutstation");
                    $("#pac-inputOutstation").focus();
                    const pyrmont = {
                        lat: latitude,
                        lng: longitude
                    };
                    // var autocomplete = new google.maps.places.Autocomplete(pacInput);
                    const service = new google.maps.places.PlacesService(pacInput);
                    let getNextPage;
                    getDistancePrice()
                    // Perform a nearby search.


                    function getDistancePrice() {
                        if (localStorage["source_latitudeValue"]) {
                            let lat = parseFloat(localStorage["source_latitudeValue"]);
                            let lng = parseFloat(localStorage["source_longitudeValue"]);

                            PickUpPoint = {
                                lat: lat,
                                lng: lng
                            };
                        } else {
                            PickUpPoint = {
                                lat: 28.554659,
                                lng: 77.090695
                            };
                        } fillInAddress2(results[0]);
                        // $("#ndl1").css("display", "block");
                        // $("#ndl1").html("<b>" + $("#pac-inputOutstation").val() + "</b>");
                        // $("#ndl2").html("Updated location: <b>" + $("#pac-inputOutstation").val() + "</b>");
                        // $("#upDown").removeClass("fa-chevron-up");
                        // $("#upDown").addClass("fa-chevron-down");
                        // $("#yourInfo").css("height", "2%");
                        // $("#arr").css("top", "0%");
                        // $("#addressBox").css("height", "230px");
                        $(".Locationbox").removeClass("fa-map-marker-alt");
                        $(".Locationbox").addClass("fa-times");
                        a = results[0].geometry.location.lat();
                        b = results[0].geometry.location.lng();

                        const DropPoint2 = {
                            lat: parseFloat(localStorage["myPickupLat"]),
                            lng: parseFloat(localStorage["myPickupLong"])
                        };

                        localStorage["source_latitudeValue"] = a;
                        localStorage["source_longitudeValue"] = b;
                        // console.log(localStorage["DropLatitude"]);

                        let mapp = new google.maps.Map(document.getElementById("map"), {
                            center: PickUpPoint,
                            zoom: 13,
                            mapTypeId: "terrain",
                            mapTypeControl: false,
                            zoomControl: false,
                            streetViewControl: false,
                            fullScreenControl: false
                        });
                        let mk2 = new google.maps.Marker({ position: DropPoint2, map: mapp, title: "Drop Point" });
                        let mk1 = new google.maps.Marker({ position: PickUpPoint, map: mapp, title: "pickup Point" });
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
                            travelMode: 'DRIVING'
                        }

                        directionsService.route(route, function (response, status) { // anonymous function to capture directions
                            if (status !== 'OK') {
                                window.alert('Directions request failed due to ' + status);
                                return;
                            } else {
                                directionsRenderer.setDirections(response); // Add route to the map
                                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                                if (!directionsData) {
                                    window.alert('Directions request failed');
                                    return;
                                } else {
                                    $("#msg").fadeIn();
                                    localStorage["KMVal"] = directionsData.distance.text;
                                    let ds = (directionsData.distance.value / 1000);
                                    let distanceP = Math.round(ds);
                                    localStorage["KMNum"] = distanceP;
                                    console.log(localStorage["KMNum"])
                                    $("#conPicLoc").css("display", "block");
                                    if (localStorage["KMNum"] > 300) {
                                        alert("jayda hai be")
                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("Outstation ride is allowed for 50 Km to 300Km.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css("display", "none")
                                        $("#statusOutstation").css("display", "none")
                                        $("#statusOutstation").css({ "width": "70px", "font-size": "18px" })
                                    }
                                    else {
                                        // $("#myForm").css("display", "block");
                                        // $("#time-list-wrap").css("display", "block");
                                        // $(".done_btn").css("display", "none");
                                        // $("#slotdiv").css("display", "block");
                                        // var CardInterval = setInterval(function () {
                                        //     localStorage.setItem("LoadTIMEUI", true);
                                        //     console.log($(".timepicker").val())
                                        //     if ($(".timepicker").val() != "Pick up Time") {
                                        //         clearInterval(CardInterval)
                                        //         lastDetailsOutstation();
                                        //     }
                                        // }, 1000)
                                    }



                                    // if(localStorage["PNR_Data"] == "Found"){
                                    // lastDetailsOutstation();
                                    // }
                                }
                            }
                        });
                    }

                    if ($("#pac-inputOutstation").val() != "") {
                        $("#pac-inputOutstation").trigger("places_changed");
                    }
                    $(".Locationbox").removeClass("fa-map-marker-alt");
                    $(".Locationbox").addClass("fa-times");
                    // initAutocomplete()
                    var value = add.split(",");
                    count = value.length;
                    country = value[count - 1];
                    state = value[count - 2];
                    city = value[count - 3];
                } else {
                    console.log("address not found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    // ////////////// Current location fetch code end /////////////////////

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
                if (!immediate)
                    func.apply(context, args);



            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);



        };
    }

    setTimeout(() => {
        sessionToken = new google.maps.places.AutocompleteSessionToken();
    }, 3000);

    function initAutocomplete() {
        let PickUpPoint;
        if (localStorage["source_latitudeValue"]) {
            let lat = parseFloat(localStorage["source_latitudeValue"]);
            let lng = parseFloat(localStorage["source_longitudeValue"]);
            // console.log(localStorage["source_latitudeValue"]);
            // console.log(localStorage["source_longitudeValue"]);
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

        const map = new google.maps.Map(document.getElementById("map"), {
            center: PickUpPoint,
            zoom: 13,
            mapTypeId: "terrain",
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            fullScreenControl: false
        });

        let inputContainer = document.querySelector('pac-inputOutstation');
        let autocomplete_results = document.querySelector('.autocomplete-results');
        // let service = new google.maps.places.AutocompleteService();
        let serviceDetails = new google.maps.places.PlacesService(map);

        // Create a new session token.
        // var sessionToken = new google.maps.places.AutocompleteSessionToken();
        var countryRestrict = {
            'country': 'in'
        };
        // Pass the token to the autocomplete service.
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ // input: 'pizza near Syd',
            componentRestrictions: countryRestrict,
            sessionToken: sessionToken
        }, displaySuggestions);
        let marker = new google.maps.Marker({ map: map });
        var displaySuggestions = function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log("Try again. Please refresh the page");
                return;
            }
            let results_html = [];
            results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')

            predictions.forEach(function (prediction) { // <li id="current_location">Get Current location </li>
                results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id
                    }><span class="autocomplete-icon icon-localities"></span> 
                <span class="autocomplete-text">${prediction.description
                    }</span></li>`);
            });
            autocomplete_results.innerHTML = results_html.join("");
            autocomplete_results.style.display = 'block';
            let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
            document.getElementById("current_location").addEventListener('click', function () {
                if (localStorage["PNR_Data"] == "Found") {
                    let pnrD = JSON.parse(localStorage["pnrData"]);
                    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PNRCurrentLocation_click");
                } else {
                    Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNRCurrentLocation_click");
                } getLocation();
                autocomplete_results.style.display = 'none';
            })
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    $("#Drop-input").val('')
                    $("#makeSerIconDropI").addClass("fa-search");
                    $("#makeSerIconDropI").removeClass("fa-times");

                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);


                    const place_id = this.getAttribute('data-place-id');
                    let request = {
                        placeId: place_id,
                        fields: ['name', 'geometry']
                    };


                    serviceDetails.getDetails(request, function (place, status) { // console.log(place)
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }
                            var bounds = new google.maps.LatLngBounds();

                            localStorage["source_latitudeValue"] = place.geometry.location.lat();
                            localStorage["source_longitudeValue"] = place.geometry.location.lng();
                            console.log("Source Lat" + localStorage["source_latitudeValue"])
                            console.log("Source Long" + localStorage["source_longitudeValue"])
                        }
                        $(".Locationbox").removeClass("fa-map-marker-alt");
                        $(".Locationbox").addClass("fa-times");

                        autocomplete_input.value = selected_text;
                        autocomplete_results.style.display = 'none';
                    });
                    // if(localStorage["PNR_Data"] == "Found"){
                    // }
                })

            }
        };
        let autocomplete_input = document.getElementById('pac-inputOutstation');
        autocomplete_input.addEventListener('input', debounce(function () {
            let value = this.value;
            value.replace('"', '\\"').replace(/^\s+|\s+$/g, '');
            if (value !== "" && value.length >= 7) {
                service.getPlacePredictions({
                    input: value,
                    componentRestrictions: {
                        country: 'in'
                    }
                }, displaySuggestions);
            } else if (value !== "") {
                autocomplete_results.style.display = 'block';
                let results_html = [];
                results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')
                autocomplete_results.innerHTML = results_html.join("");

                document.getElementById("current_location").addEventListener('click', function () {
                    getLocation();
                    autocomplete_results.style.display = 'none';
                })
            }
            else {
                autocomplete_results.innerHTML = '';
                autocomplete_results.style.display = 'none';
            }
        }, 500));
    }

    $(window).click(function (e) {
        // e.preventDefault();
        $(".autocomplete-results").css("display", "none");
        $(".autocomplete-resultsDrop").css("display", "none");
    })

    $("#Drop-input").click(function () {
        console.log(localStorage["source_latitudeValue"])
        if (!localStorage["source_latitudeValue"]) {
            $("#ValidateMsg").css("display", "block");
            setTimeout(() => {
                $("#ValidateMsg").css("display", "none");
            }, 2000);

            document.getElementById('ValidateMsg').innerHTML = "First Enter Pickup location"
            document.getElementById("pac-inputOutstation").click();
        }
    })

    $("#pac-inputOutstation").click(function () {
        if ($("#outstationCity :selected").text() == "Select Pickup City") {
            $("#ValidateCityMsg").css("display", "block");
            setTimeout(() => {
                $("#ValidateCityMsg").css("display", "none");
            }, 2000);

            document.getElementById('ValidateCityMsg').innerHTML = "First Select City"
            document.getElementById("outstationCity").click();
            // document.getElementById("pac-inputOutstation").click();
        }
    })
    setTimeout(() => {
        LoadDropLocationMap()
    }, 3000);
    function LoadDropLocationMap() {

        let PickUpPoint
        // console.log(localStorage["source_latitudeValue"]);

        if (localStorage["source_latitudeValue"]) {
            let lat = parseFloat(localStorage["source_latitudeValue"]);
            let lng = parseFloat(localStorage["source_longitudeValue"]);
            // console.log(localStorage["source_latitudeValue"]);
            // console.log(localStorage["source_longitudeValue"]);
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

        let inputContainer = document.querySelector('Drop-input');
        let autocomplete_results = document.querySelector('.autocomplete-resultsDrop');
        // let service = new google.maps.places.AutocompleteService();
        let serviceDetails = new google.maps.places.PlacesService(map);

        // Create a new session token.
        // var sessionToken = new google.maps.places.AutocompleteSessionToken();
        var countryRestrict = {
            'country': 'in'
        };
        // Pass the token to the autocomplete service.
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ // input: 'pizza near Syd',
            componentRestrictions: countryRestrict,
            sessionToken: sessionToken
        }, displaySuggestions);
        let marker = new google.maps.Marker({ map: map });
        var displaySuggestions = function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log("Try again. Please refresh the page");
                return;
            }
            let results_html = [];
            // results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')

            predictions.forEach(function (prediction) { // <li id="current_location">Get Current location </li>
                results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id
                    }><span class="autocomplete-icon icon-localities"></span> 
                    <span class="autocomplete-text">${prediction.description
                    }</span></li>`);
            });
            autocomplete_results.innerHTML = results_html.join("");
            autocomplete_results.style.display = 'block';
            let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
            // document.getElementById("current_location").addEventListener('click', function () {
            //     if (localStorage["PNR_Data"] == "Found") {
            //         let pnrD = JSON.parse(localStorage["pnrData"]);
            //         Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PNRCurrentLocation_click");
            //     } else {
            //         Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNRCurrentLocation_click");
            //     } getLocation();
            //     autocomplete_results.style.display = 'none';
            // })
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    console.log(selected_text)
                    localStorage.setItem("DropLocationAddress", selected_text)
                    localStorage.setItem("DropLocationCity", placeArr.slice(-3, -1)[0]);
                    const place_id = this.getAttribute('data-place-id');
                    let request = {
                        placeId: place_id,
                        fields: ['name', 'geometry']
                    };

                    serviceDetails.getDetails(request, function (place, status) { // console.log(place)
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }
                            var bounds = new google.maps.LatLngBounds();

                            if (localStorage["source_latitudeValue"]) {
                                let lat = parseFloat(localStorage["source_latitudeValue"]);
                                let lng = parseFloat(localStorage["source_longitudeValue"]);
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
                            $("#makeSerIconDropI").removeClass("fa-search");
                            $("#makeSerIconDropI").addClass("fa-times");

                            a = place.geometry.location.lat();
                            b = place.geometry.location.lng();

                            const DropPoint2 = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            };


                            localStorage.setItem("DropLatitude", a);
                            localStorage.setItem("DropLongitude", b);
                            var mk2 = new google.maps.Marker({ position: DropPoint2, map: map, title: "Drop Point" });
                            // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
                            var distance = haversine_distance(mk1, mk2);

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
                                    if (!directionsData) {
                                        window.alert('Directions request failed');
                                        return;
                                    } else {
                                        $("#msg").fadeIn();
                                        localStorage["KMVal"] = directionsData.distance.text;
                                        console.log(localStorage["KMVal"])
                                        let ds = (directionsData.distance.value / 1000);
                                        let distanceP = Math.round(ds);
                                        localStorage["KMNum"] = distanceP;
                                        $("#conPicLoc").css("display", "block");
                                    }
                                    if (localStorage["KMNum"] > 300) {
                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("Outstation ride is allowed for 50 Km to 300Km.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css("display", "none")
                                        $("#statusOutstation").css("display", "block")
                                        $("#statusOutstation").css({ "width": "70px", "font-size": "18px" })
                                    }
                                    else {
                                        document.getElementById("datepicker").focus();
                                        document.getElementById("etaDiv").style.marginLeft = "3%";
                                        document.getElementById("etaDiv").style.width = "45%";
                                        // $("#myForm").css("display", "block");
                                        // $("#time-list-wrap").css("display", "block");
                                        // $(".done_btn").css("display", "none");
                                        // $("#slotdiv").css("display", "block");
                                        // var CardInterval = setInterval(function () {
                                        //     localStorage.setItem("LoadTIMEUI", true);
                                        //     console.log($(".timepicker").val())
                                        //     if ($(".timepicker").val() != "Pick up Time") {
                                        //         clearInterval(CardInterval)
                                        //         lastDetailsOutstation();
                                        //     }
                                        // }, 1000)
                                    }


                                    // lastDetailsOutstation();
                                }
                            });

                        }
                        autocomplete_input.value = selected_text;
                        autocomplete_results.style.display = 'none';
                    });
                })

            }
        };

        let autocomplete_input = document.getElementById('Drop-input');
        autocomplete_input.addEventListener('input', debounce(function () {
            let value = this.value;
            value.replace('"', '\\"').replace(/^\s+|\s+$/g, '');
            if (value !== "" && value.length >= 7) {
                service.getPlacePredictions({
                    input: value,
                    componentRestrictions: {
                        country: 'in'
                    }
                }, displaySuggestions);
            } else {
                autocomplete_results.innerHTML = '';
                autocomplete_results.style.display = 'none';
            }
        }, 150));
    }

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
        localStorage.setItem("source_latitudeValue", pl[city][0]["source_latitude"]);
        localStorage.setItem("source_longitudeValue", pl[city][0]["source_longitude"]);
        localStorage.setItem("source_city", pl[city][0]["source_city"]);
    }

    // async function departure_Ads() {
    //     const ads = await fetch(BaseAPIURL+domain+"/webapi/getDepartureAds")
    //     const adResponse = await ads.json();
    //     // console.log(adResponse);

    //     for (let i = 0; i < adResponse.length; i++) {
    //             if (adResponse[i]["type"].toLowerCase() == "interstitial" && adResponse[i]["position"] == 1 && adResponse[i]["page_name"] == "arrival_outstation") {
    //                 localStorage.setItem("Ad", "true")
    //                 document.getElementById("interstitial_back").style.display = "block";
    //                 document.getElementById("interstitial_back").innerHTML = "";
    //                 let inter = document.createElement("div");
    //                 inter.setAttribute("class", "interstitial");
    //                 let interImg = document.createElement("img");
    //                 interImg.setAttribute("src", adResponse[i]["thumbnail"])
    //                 inter.appendChild(interImg);
    //                 interImg.onclick = function () {
    //                     document.getElementById("interstitial_back").style.display = "none";
    //                     robodemo();
    //                 }
    //                 let cross = document.createElement("i");
    //                 cross.setAttribute("class", "fas fa-times-circle");
    //                 cross.setAttribute("id", "cross");
    //                 inter.appendChild(cross);
    //                 cross.onclick = function () {
    //                     document.getElementById("interstitial_back").style.display = "none";
    //                     if (localStorage["PNR_Data"] == "Found") {
    //                         let pnrD = JSON.parse(localStorage["pnrData"]);
    //                         Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Homepage_Cross");
    //                     }
    //                     robodemo();
    //                 }
    //                 document.getElementById("interstitial_back").appendChild(inter);
    //                 var closeTym;
    //                 if (adResponse[i]["interstitial_time"] != "" || adResponse[i]["interstitial_time"] != null) {
    //                     closeTym = adResponse[i]["interstitial_time"];
    //                 } else {
    //                     closeTym = 7000;
    //                 }
    //                 setTimeout(() => {
    //                     document.getElementById("interstitial_back").style.display = "none";
    //                     // robodemo();
    //                 }, closeTym);
    //             }else if (adResponse[i]["type"].toLowerCase() == "bottom-banner" && adResponse[i]["page_name"] == "arrival_outstation") {
    //                 document.getElementById("bottom_banner").innerHTML = ''
    //                 document.getElementById("bottom_banner").style.display = "block";
    //                 let interImg = document.createElement("img");
    //                 interImg.setAttribute("src", adResponse[i]["thumbnail"])
    //                 document.getElementById("bottom_banner").appendChild(interImg);
    //             }
    //             else if (adResponse[i]["type"].toLowerCase() == "top-banner" && adResponse[i]["page_name"] == "arrival_outstation") {
    //                 document.getElementById("top_banner").style.display = "block";
    //                 let interTop = document.createElement("img");
    //                 interTop.setAttribute("src", adResponse[i]["thumbnail"])
    //                 document.getElementById("top_banner").appendChild(interTop);
    //             }
    //     }
    //     // if (!localStorage["Ad"]) {
    //     //     robodemo();
    //     // }
    // }
    var arrival_Airport = '';
    async function getPNR(bookingId) {

        document.getElementById("loader").style.display = "block"
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
        localStorage.setItem("PNR_Data", "Not-Found")
        PnrdataNotFound();
    }

    async function PnrdataNotFound() {
        //departure_Ads();
        $("#datepicker").val(moment().format('DD-MM-YYYY'))
        // $( "#datepicker" ).datepicker({ minDate: 0});
        $(".journeyInfo").css("display", "none");
        $("#passenger_name").css("display", "none");
        $(".pnr_pickup").css("margin", "4px 0px 6px 0");
        $(".form_mb").css("margin", "1.5% 0 1% 3%");
        // $(".non_pnr").css("display","block");
        $('.ForNon-pnrLoad').append($('.pnr_pickup'));

        if (localStorage["mobileNum"] != "undefined" && localStorage["mobileNum"] != null && localStorage["mobileNum"] != "null" && localStorage["mobileNum"] != " ") {
            $("#mb_number").val(localStorage["mobileNum"]);
        }

        // var TopBanner = document.createElement("img");
        // TopBanner.setAttribute("src", "img/ads/top_banner.jpg")
        // document.getElementById("top_banner").appendChild(TopBanner)

        // var BottomBanner = document.createElement("img");
        // BottomBanner.setAttribute("src", "img/ads/bottom_banner.png")
        // document.getElementById("bottom_banner").appendChild(BottomBanner)

        // $("#top_banner").css("margin-bottom", "2%;");
    }

    function CheckBooking(bookingId) {
        let urlv = BaseAPIURL+domain+"/webapi/getCabdetailsByPNR?pnr=" + bookingId;
        // console.log(urlv)
        $.ajax({
            type: "GET",
            // dataType: "json",
            url: urlv,
            success: function (data) {
                // console.log(data);
                // console.log(data.length);
                if (data.length >= 1) {
                    if (data[0].cancelled_by == "null" || data[0].cancelled_by == "" || data[0].cancelled_by == null) {
                        $("#cmmsg2").html("Your cab is scheduled ");
                        $(".thank_msg i").addClass("fa-check-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab2").css("display", "block");
                        setInterval(() => {
                            $(".auto_btn").addClass("btn_disable");
                            $("#pac-inputOutstation").prop('disabled', true);
                            $("#continue").val("Cab is already booked");
                            $("#continue").prop('disabled', true);
                        }, 1000);
                        localStorage.setItem("BookedId", data[0].order_reference_number)
                    }
                }
            },
            error: function (xhr) {
                console.log("Booking check API not working")
            }
        });
    }

    $(".Locationbox").click(function () {
        if ($(".Locationbox").hasClass("fa-map-marker-alt")) {
            if (localStorage["PNR_Data"] == "Found") {
                let pnrD = JSON.parse(localStorage["pnrData"]);
                Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PNRCurrentLocation_click");
            } else {
                Track_analytics(localStorage["booking_id"], "C2ACustomer", "null", "null", "null", "null", "NULL", "NULL", "NON-PNRCurrentLocation_click");
            } getLocation();
        }
        if ($(".Locationbox").hasClass("fa-times")) {
            $(".Locationbox").removeClass("fa-times");
            $(".Locationbox").addClass("fa-map-marker-alt");
            $("#addressBox").css("height", "230px");
            $("#pac-inputOutstation").val("");
            $("#ndl1").html("");
            $(".my-button").on("click");
            $(".my-button").removeAttr("disabled", "true");
            $(".my-button").text("Submit");
            // initAutocomplete();
        }
    });
    $("#makeSerIconDropI").click(function () {
        if ($("#makeSerIconDropI").hasClass("fa-times")) {
            $("#makeSerIconDropI").removeClass("fa-times");
            $("#makeSerIconDropI").addClass("fa-search");
            // $("#addressBox").css("height", "230px");
            $("#Drop-input").val("");
            $("#ndl1").html("");
            // $(".my-button").on("click");
            // $(".my-button").removeAttr("disabled", "true");
            // $(".my-button").text("Submit");
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
        // console.log(place.address_components);
        for (const component of place.address_components) {
            const componentType = component.types[0];
            // console.log(componentType);
            switch (componentType) {
                case "street_number":
                    {
                        address1 = `${component.long_name
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
                        postcode = `${component.long_name
                            }${postcode}`;
                        break;
                    }

                case "postal_code_suffix":
                    {
                        postcode = `${postcode}-${component.long_name
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

    async function lastDetailsOutstation() {
        localStorage.removeItem("LoadTIMEUI")
        var cab_response = [];
        const departure = await fetch(BaseURL+domain+"/webapi/getCabPartnerData?city=" + localStorage["ArrivalStation"] + "&category=" + BookingTrip_Type)
        // const departure = await fetch(BaseURL+domain+"/webapi/getCabPartnerDataRR?type=AC&city="+localStorage["cityCODE"]);
        const cab_res = await departure.json();
        // console.log(cab_res);
        for (let i in cab_res) {
            if (cab_res[i].platform.toLowerCase() != "host") {
                if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
                    // if (cab_res[i].isArrival == "1") {
                    cab_response.push(cab_res[i]);
                    // }
                }
            }
        }
        console.log(cab_response);
        localStorage.setItem("cab_response", JSON.stringify(cab_response));
        localStorage.setItem("URLimg", JSON.stringify(cab_response[0].URL))
        if (ShowSelfDrive == "yes") {
            localStorage.setItem("partnercabType", "suv");
            await partnerSliderOutstation(cab_response, "suv", localStorage["ArrivalStation"]);
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
        } else {
            localStorage.setItem("partnercabType", "sedan");
            $(".coming_soon").css("display", "block");
            await partnerSliderOutstation(cab_response, "sedan", localStorage["ArrivalStation"]);
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".sedan img").addClass("active_cab");
        }

        getstate(localStorage["source_latitudeValue"], localStorage["source_longitudeValue"]);
        function getstate(lat, long) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + localStorage["mapKey"])
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    // streetAddress: responseJson.results[0].address_components[1].long_name,
                    // city: responseJson.results[0].address_components[4].long_name,
                    // document.getElementById("destinationstate").innerHTML = responseJson.results[0].address_components[6].long_name;
                    var state = responseJson.results[responseJson.results.length - 2].formatted_address;
                    if (String(state).includes(",")) {
                        state = String(state).split(",")[0];
                    }
                    stateforinvoice = state;
                })
        }
    }

    ////////////////////////////// Load CashbackAmt code start //////////////////////////
    var CashbackAmt = ''
    const loadCashbackAmt = async (partnerName, citycode) => {
        return new Promise((resolve, reject) => {
            // fetch(`https://preprod.mojoboxx.com/preprod/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=departure&mojoPartner=SPICEJET`)
            fetch(`${BaseURL}${domain}/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=departure&mojoPartner=BAC`)
                .then((res) => res.json()).then((result) => {
                    if (result.success == true && result.data.length > 0) {
                        console.log(result.data)
                        for (let element of result.data) {
                            if ((element.partner_name.toLowerCase() == partnerName.toLowerCase()) && (element.type.toLowerCase() == 'cashback')) {
                                CashbackAmt = element.amount
                            }
                            if ((element.partner_name.toLowerCase() == partnerName.toLowerCase()) && (element.type.toLowerCase() == 'discount')) {
                                defaultCashback = element.amount
                                console.log(defaultCashback)
                            }
                        }
                        resolve(true)
                        return true
                    }
                    else {
                        CashbackAmt = 0
                        defaultCashback = 0
                        resolve(true)
                    }
                })
        })
    }
    ////////////////////////////// Load CashbackAmt code end  //////////////////////////


    // ////////////////// Create Partner Card UI code start /////////////////////////////
    var scv = [];
    var cabFare = [];
    var cab_Type = [];
    var cab_Type2 = [];
    async function partnerSliderOutstation(cab_response, cabTypeName, cityType) {
        // console.log(cab_response)
        var Comingsoon = 'show';
        $(".coming_soon").css("display", "none");
        $('#Loading_Img').css('display', 'none')
        var swiper = "";
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        await loadMojoMultiplier(localStorage["ArrivalStation"])

        $("#swiperDiv").addClass("activeSwiper")
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

                if (cab_city[jk].toLowerCase() == cityType.toLowerCase()) {
                    Comingsoon = "notshow"
                    cab_Type = cab_response[i].cab_type_arrival.split(",");
                    // console.log(cab_Type);
                    let clc = 0;
                    if (cab_Type.length == 1) {
                        clc = 1;
                    } else {
                        clc = cab_Type.length;
                    }

                    var cab_Image;

                    cab_Image = cab_response[i].partner_image_arrival.split(",");
                    for (let j = 0; j < clc; j++) {
                        if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                            console.log("Outstation cab")
                            console.log(cab_response[i])
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

                            $('#Loading_Img').css('display', 'none')
                            let partner_cardImg = document.createElement("img");
                            if (cabTypeName.toLowerCase() == "hatchback") {
                                partner_cardImg.setAttribute("src", "img/mini_card.png");
                            }
                            else if (cabTypeName.toLowerCase() == "sedan") {
                                partner_cardImg.setAttribute("src", "img/sedan_card.png");
                            }
                            else if (cabTypeName.toLowerCase() == "suv") {
                                partner_cardImg.setAttribute("src", "img/muv_card.png");
                            }
                            partner_card.appendChild(partner_cardImg);


                            scv.push(cab_response[i].partner_name);
                            await myFunction(scv[0])
                            localStorage.setItem("partnerName", scv[0]);

                            swiperSlide.appendChild(partner_card);
                            document.getElementById("swiper-wrapper").appendChild(swiperSlide);

                            // var topheading = document.createElement("div");
                            //     topheading.setAttribute("class","partner_title")
                            //     var textTitle = document.createElement("p");
                            //     textTitle.setAttribute("class", "title_text")
                            //      var textMode = document.createTextNode("Powered By")
                            //      topheading.appendChild(textTitle)
                            //      textTitle.appendChild(textMode)
                            //  partner_card.appendChild(topheading)
                            //logoImg.setAttribute("class","logoImg")

                            // var LogoDiv = document.createElement("div");
                            // LogoDiv.setAttribute("class","Partner_Logo")
                            // var logoImg = document.createElement("img");
                            // logoImg.setAttribute("class","logoImg")
                            // logoImg.setAttribute("src",cab_response[i].partner_image_arrival)
                            // LogoDiv.appendChild(logoImg);
                            // partner_card.appendChild(LogoDiv)

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
                            if ((cab_response[i].partner_name == "SAVAARI") || (cab_response[i].partner_name == "QUICKRIDE")  || (cab_response[i].partner_name == "BLUSMART") || (cab_response[i].partner_name == "MEGA")) {
                                includeLine.innerHTML = "Inclusive of airport tolls and taxes"
                            } else {
                                includeLine.innerHTML = "Exclusive of airport tolls and taxes"
                            } footerDiv.appendChild(includeLine);
                            partner_card.appendChild(footerDiv);

                            var distPara = document.createElement("p");
                            distPara.setAttribute("id", "distPara")
                            distPara.innerHTML = "Estimated Distance"
                            partner_card.appendChild(distPara);
                            var distance = document.createElement("div");
                            distance.setAttribute("id", "dist")

                            var para2 = document.createElement("span")
                            para2.setAttribute("id", "km" + cab_response[i].partner_name);
                            para2.innerHTML = "--- Km";
                            distance.appendChild(para2);

                            partner_card.appendChild(distance);
                            localStorage.removeItem("finalFare" + cab_response[i].partner_name);
                            await multiplierFun(cab_response[i].partner_name)
                            if (cab_city[jk] == "DXB") {
                                $(".perdiscount").css("display", "none")
                                $("#discount").css("display", "none")
                                await getOptiondubai(cab_response[i].partner_name);
                            } else {
                                document.getElementById("km" + cab_response[i].partner_name).innerHTML = localStorage["KMVal"] + "s";
                                let fareCalculate = await calculatePricePartnerWise(cab_response[i].partner_name, localStorage["KMNum"], cab_Type[j], cab_city[jk]);
                                cabFare.push(localStorage["finalFare" + cab_response[i].partner_name]);
                                localStorage.setItem("partnerFare", cabFare[0]);
                            }
                            $(".auto_btn").addClass("btn_enable");
                            $("#continue").removeAttr('disabled');
                            $("#continue").css("color", "white");
                            $(".bookBtn").css("display", "none")
                            // $(".bookBtn").css("display", "flex")
                            $("#ConfirmButton").css("display", "block")
                            // document.getElementById("partpay").innerHTML = " ₹ " + "249";
                            document.getElementById("fullpay").innerHTML = " ₹ " + localStorage["partnerFare"]
                        }
                        if (one == 0) {
                            $(".coming_soon").css("display", "block");
                            $(".auto_btn").css("display", "none");
                            $("#cab_select").css("display", "none");
                        } else {
                            $(".coming_soon").css("display", "none");
                            // $(".auto_btn").css("display", "block");
                            $("#cab_select").css("display", "block");
                        }
                    }
                }
            }
        }
        if (Comingsoon == "notshow" && one == 1) {
            $(".coming_soon").css("display", "none");
            // $(".auto_btn").css("display", "block");
            $("#cab_select").css("display", "block");
        } else if (Comingsoon == "show") {
            $(".coming_soon").css("display", "block");
            $(".auto_btn").css("display", "none");
            $("#cab_select").css("display", "none");
        }
        if (ShowSelfDrive != "yes") {
            if ((scv[0] == "GOZO CABS") || (scv[0] == "QUICKRIDE")) {
                $(".auto_btn").css("display", "none");
                $("#ConfirmButton").css("display", "none")
                $(".bookBtn").css("display", "flex")
                $("#greyedbtn").css("display", "none")
                $('.agreeBox').css('margin-bottom', '20%')
                // $('#paymentoptions').css("display", "block")
                $('#PayByCash').css("display", "none")
                $('#PayBypaytm').css("display", "block")
                $('#PayByrazorpay').css("display", "block")
                // document.getElementById("partpay").innerHTML = " ₹ " + "249";
                document.getElementById("fullpay").innerHTML = " ₹ " + cabFare[0]
            }
            else {
                $('.agreeBox').css('margin-bottom', '0%')
                $('#paymentoptions').css("display", "none")
            }

            const cashback = await loadCashbackAmt(scv[0], cityType)
            const allWithClass = Array.from(
                document.querySelectorAll('.cashbackAMt')
            );
            allWithClass.forEach(element => {
                element.innerHTML = CashbackAmt
            });

        }
    }

    ////////////////// mojoboxx multiplier code - service charge code start //////////////
    async function loadMojoMultiplier(CityCode) {
        var timeUpdate = moment().hour();
        if (timeUpdate >= "0" && timeUpdate <= "9") {
            timeUpdate = "0" + timeUpdate
        }
        const multiplier = await fetch(BaseAPIURL+domain+'/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=outstation&platform=Yatra")
        const multiResponse = await multiplier.json()
        localStorage.setItem('multiResponseData', JSON.stringify(multiResponse))
        // console.log(multiResponseData)  
    }

    async function multiplierFun(partner_Name) {
        var multiResponseData = JSON.parse(localStorage['multiResponseData'])
        localStorage.setItem("multiplier" + partner_Name, 0)

        MultiplierAmount = 0;
        if (multiResponseData.data.length > 0) {
            multiResponseData.data.every(element => {
                if (element.partner.toLowerCase() == partner_Name.toLowerCase()) {
                    MultiplierAmount = element.amount;
                    console.log(MultiplierAmount);
                    localStorage.setItem("multiplier" + partner_Name, MultiplierAmount)
                    return false;
                } else {
                    MultiplierAmount = 0;
                    localStorage.setItem("multiplier" + partner_Name, MultiplierAmount)
                    return true;
                }
            });
        }
    }

    ////////////////// mojoboxx multiplier code - service charge code end //////////////


    async function calculatePricePartnerWise(partnerName, KMNum, cabTyp, cityName) {
        return new Promise(async function (resolve, reject) {
            var desP;
            var distanceP = KMNum;
            var hypenVal;
            var hypen_pos;
            var dis;
            var dis2;
            var amt;
            // $("#fare").css("width", "45%");
            if (partnerName == "QUICKRIDE") {
                $("#prQUICKRIDE").html("Please wait..")
                $("#prQUICKRIDE").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let quickrideResp = await GetFarefromPartner(cabTyp);
                resolve(true);
            } else if (partnerName == "BUDDY CABS") {
                $("#prBUDDY CABS").html("Please wait..")
                $("#prBUDDY CABS").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let BuddyFare = await GetFarefromPartnerBuddy(cabTyp);
                resolve(true);
            } else if (partnerName == "GOZO CABS") {

                if ($(".timepicker").val() == "Pick up Time") {
                    $("#myForm").css("display", "block");
                    $("#time-list-wrap").css("display", "block");
                    $("#choosetimegrid").css("display", "block");
                    $(".outstationMSG").css("display", "block");
                    $("#donetime").css("display", "none");

                    let timeInterval = setInterval(async () => {
                        if ($(".timepicker").val() != "Pick up Time") {
                            clearInterval(timeInterval);
                            let gozofare = await GetFareFromGozoPartner(cabTyp)
                            resolve(true);
                        }

                    }, 1000);
                }
                else {
                    let gozofare = await GetFareFromGozoPartner(cabTyp)
                    resolve(true);
                }
            } else if (partnerName == "COOP") {
                $("#pr2COOP").css("display", "none");
                $("#prCOOP").html("Please wait..");
                $("#prCOOP").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let coopFare = await coop_call(cabTyp);
                resolve(true);
            } else if (partnerName == "SAVAARI") {
                $("#pr2SAVAARI").css("display", "none");
                $("#prSAVAARI").html("Please wait..")
                $("#prSAVAARI").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let savaariFare = await GetFareFromSavvariPartner(cabTyp)
                resolve(true)
            } else {
                await loadCityName(cityName)
                var fareData = await loadFareFormDB(partnerName, cityNameFetch, distanceP, cabTyp.toLowerCase());
                resolve(fareData);
            } resolve(true)
        })
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
        on: {
            slideChange: async function () {
                // let index_currentSlide = swiper.activeIndex,
                // currentSlide = swiper.slides[index_currentSlide]
                // clearTimeout(mfv);
                let currentSliderValue = scv[swiper.activeIndex];
                let currentSliderFare = cabFare[swiper.activeIndex];
                // let currentSliderType = cabTypeName[swiper.activeIndex];
                localStorage.setItem("partnerName", currentSliderValue);
                console.log(localStorage["partnerName"])
                localStorage.setItem("partnerFare", currentSliderFare);
                console.log(currentSliderFare)
                localStorage.setItem("partnercabType", cab_Type2);
                console.log(localStorage["partnercabType"])
                await myFunction(currentSliderValue)
                if (ShowSelfDrive != "yes") {
                    if ((currentSliderValue == "QUICKRIDE") || (currentSliderValue == "GOZO CABS")) {
                        console.log("currentslidervalue", currentSliderValue)
                        $("#ConfirmButton").css("display", "block")
                        // $(".bookBtn").css("display", "flex")
                        $(".bookBtn").css("display", "none")
                        $('.agreeBox').css('margin-bottom', '20%')
                        // $('#paymentoptions').css("display", "block")
                        // document.getElementById("partpay").innerHTML = " ₹ " + "249";
                        document.getElementById("fullpay").innerHTML = " ₹ " + cabFare[swiper.activeIndex]
                        if (currentSliderFare == "undefined" || currentSliderFare == undefined || currentSliderFare == null) {
                            $("#ConfirmButton").css("display", "none")
                            $(".bookBtn").css("display", "none")
                            $('#paymentoptions').css("display", "none")

                            // $('.agreeBox').css('margin-bottom','20%')
                        }
                    }
                    else {
                        $("#ConfirmButton").css("display", "block")
                        $(".bookBtn").css("display", "none")
                        $('.agreeBox').css('margin-bottom', '0px')
                        $('#paymentoptions').css("display", "none")
                        document.getElementById("partpay").innerHTML = " ₹ " + "...";
                        document.getElementById("fullpay").innerHTML = " ₹ " + "..."
                    }

                    const cashback = await loadCashbackAmt(currentSliderValue, localStorage["ArrivalStation"])
                    const allWithClass = Array.from(
                        document.querySelectorAll('.cashbackAMt')
                    );
                    allWithClass.forEach(element => {
                        element.innerHTML = CashbackAmt
                    });

                }
            }
        }
    });

    async function checkMobile() {
        var y = document.getElementById("mb_number").value;

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
    }

    document.getElementById("ctn").onsubmit = function (e) {
        e.preventDefault();
        BookMycab('CASH')
    }

    let paymthd1;
    let paymthd2;

    fetch(BaseAPIURL+domain+"/webapi/bookAirportCredentialsInfo").then((res) => res.json())
        .then((d) => {
            let x = d.data;
            for (let i of x) {
                // console.log(i)
                if (i.type == "PAYTM_MID") {
                    localStorage.setItem("PayMID", i.merchant_id)
                }
                if (i.type == "OUTSTATION") {

                    if (i.Total_btn == 1) {
                        $(".border_gap").css("display", "none");
                        document.getElementsByClassName('upi_btn')[0].style.display = "block";
                        $("#dblbtn").css("display", "none");
                        $("#singlebtn").css("display", "block");
                        paymthd1 = i.Pay_btn1;
                    }
                    else if (i.Total_btn == 2) {
                        $(".border_gap").css("display", "block");
                        document.getElementsByClassName('upi_btn')[0].style.display = "block";
                        document.getElementsByClassName('credit_btn')[0].style.display = "block";
                        $("#dblbtn").css("display", "block");
                        $("#singlebtn").css("display", "none");
                        paymthd1 = i.Pay_btn1;
                        paymthd2 = i.Pay_btn2;
                    }
                }
            }
        })

    document.getElementsByClassName('credit_btn')[0].onclick = function () {
        // BookMycab('PAYTM', "full")
        //BookMycab('RAZORPAY', "part")
        // alert(paymthd2)
        BookMycab(paymthd2, "full")
        // getpaymethod();
    }
    document.getElementsByClassName('upi_btn')[0].onclick = function () {
        // BookMycab('PAYTM', "full")
        // alert(paymthd1)
        BookMycab(paymthd1, "full")
        // getpaymethod();
    }

    // document.getElementById("paynowapprov").onclick = function () {
    //     BookMycab('PAYTM', "full")
    // }
    document.getElementById("paynowapprov").onclick = function () {
        BookMycab('NewPayment')
    }


    async function BookMycab(PAYMENT_TYPE, paytp) {

        if ($('#terms_condition').is(":checked")) {
        }
        else {
            $("#cmmsg").html("Please agree to the terms & conditions");
            $(".thank_msg i").removeClass("fa-check-circle");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }
        if ($("#email_id").val() == '' || $("#email_id").val() == undefined) {
            $("#cmmsg").html("Enter your email id");
            $(".thank_msg i").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            return false;
        }
        
        if ($("#mb_number").val() == '' || $("#mb_number").val() == undefined) {
            $("#cmmsg").html("Enter Mobile Number");
            $(".thank_msg i").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            return false;
        }

        if (isNaN($("#mb_number").val()) || $("#mb_number").val().indexOf(" ") != -1) {
            $("#cmmsg").html("Please enter a valid mobile number");
            // $("#cmmsg").html("Mobile number should be numeric");
            $(".thank_msg i").css("display", "none");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }
        if ($("#mb_number").val().length > 10 || $("#mb_number").val().length < 10 || $("#mb_number").val().includes(".")) {
            $("#cmmsg").html("Please enter a valid mobile number");
            // $("#cmmsg").html("Mobile number should have 10 digits");
            $(".thank_msg i").css("display", "none");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }

        if ($("#pac-inputOutstation").val() == '') {
            $("#cmmsg").html("Enter pickup location");
            $(".thank_msg").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            return false;
        }
        if ($("#Drop-input").val() == '') {
            $("#cmmsg").html("Enter Drop location");
            $(".thank_msg").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            return false;
        }
        if (ShowSelfDrive == "yes") {
            BookSelfDriveCab();
        } else {
            if ($(".timepicker").val() == "Pick up Time") {
                $("#cmmsg").html("Choose Pickup Date & Time");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }
            // if (localStorage["source_city"] != "Dubai") {
            //     if ($("#pac-input").val() == "" || $("#pac-input").val() == undefined || $("#pac-input").val() == "undefined"){
            //         $("#cmmsg").html("Please Enter your location ");
            //         $(".thank_msg i").css("display","none")
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         return false
            //     }
            // }
            // if (localStorage["source_city"] == "Dubai") {
            //     if ($("#dubai").val() == ""){
            //         $("#cmmsg").html("Please Enter your location ");
            //         $(".thank_msg i").css("display","none")
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         return false
            //     }
            // }
            // if (localStorage["partnerName"] == "GOAMILES") {
            //     await loadGoamile();
            //    async function loadGoamile(){
            //         return new Promise(async function(resolve, reject) {
            //             //  generateBookingGoa()
            //             let Goamilesresponse = await generateBookingGoa()
            //             // console.log(Goamilesresponse)
            //             resolve(Goamilesresponse)
            //         })
            //     }
            // }

            var pick_time;

            // //////////////// Convert time format form AM / PM to 24 hour format code start ////////////////////
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



                var statusTime = sHours + ":" + sMinutes;
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
                localStorage.setItem("Pictime", statusTime)
            } else {
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + $(".timepicker").val()
                localStorage.setItem("Pictime", $(".timepicker").val())
            }
            // //////////////// Convert time format form AM / PM to 24 hour format code end ////////////////////

            var dateValue = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
            var currentTime = moment().format('YYYY-MM-DD HH:mm')
            if (currentTime > dateValue) {
                $("#cmmsg").html("You have selected an invalid pickup time.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $("#continue").val("Confirm Pickup");
                return false;
            }
            if (localStorage["partnerName"] == "GOZO CABS") {
                var travelTime = moment().add(180, 'minutes').format("YYYY-MM-DD HH:mm");
                if (dateValue < travelTime) {
                    $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 3 hours later than current time.");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $("#continue").val("Confirm Pickup");
                    return false;
                }
            }
            if (localStorage["partnerName"] == "SAVAARI") {
                var travelTime = moment().add(240, 'minutes').format("YYYY-MM-DD HH:mm");
                if (dateValue < travelTime) {
                    $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 4 hours later than current time.");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $("#continue").val("Confirm Pickup");
                    return false;
                }
            }
            $(".spinner").css("display", "block")
            $(".spinnerBack").css("display", "block")
            // if (localStorage["partnerName"] == "QUICKRIDE") {
            //     var travelTime = moment().add(40, 'minutes').format("YYYY-MM-DD HH:mm");
            //     if (dateValue < travelTime) {
            //         $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 40 min later than current time.");
            //         $(".thank_msg i").removeClass("fa-check-circle");
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         $("#continue").val("Confirm Pickup");
            //         return false;
            //     }
            // }

            // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
            localStorage.setItem("ptnr", localStorage["partnerName"]);
            // if (localStorage["ptnr"] != "QUICKRIDE") {
            localStorage.setItem("TotalFare", localStorage["partnerFare"]);
            // }

            if (localStorage["PNR_Data"] == "Found") {
                var final_data = JSON.parse(localStorage["pnrData"])
                var customerFName = final_data[0].FirstName;
                var customerLName = final_data[0].LastName;
                var title = final_data[0].Title;
            }

            var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];
            if (localStorage["source_city"] != "Dubai") {
                var price = String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"];
                var total_km = localStorage["KMVal"].split(" ");
                totalkm = Math.round(total_km[0]);
                localStorage.setItem("kilometer", totalkm)
            }

            $("#continue").val("Please wait..")

            localStorage.setItem("mobileNum", $("#mb_number").val())
            sessionStorage.setItem("MobileNum", $("#mb_number").val())
            let serviceCharge = (localStorage["ptnr"] == "QUICKRIDE") || (localStorage["ptnr"] == "GOZO CABS") ? localStorage["multiplier" + localStorage["ptnr"]] : 0

            // /////////////////// Load data to create JSON for cab booking code end ////////////////////////
            dataJ = {
                "clubMember": [
                    {
                        "type": "cabForm",
                        "name_title": localStorage["PNR_Data"] == "Found" ? title : '',
                        "user_name": "Customer",
                        "last_name": "Customer",
                        "mobile": $("#mb_number").val(),
                        "email": $("#email_id").val(),
                        "time": Date.now(),
                        "sendLeadSms": "true",
                        "partnerName": localStorage["ptnr"].trim(),
                        "title": localStorage["ptnr"].trim(),
                        "category": "CAB",
                        "drop_location": localStorage["DropLocationAddress"].trim(),
                        "pickup_time": pickup_time,
                        'cab_category': 'Outstation',
                        "cab_type": localStorage["partnercabType"].trim(),
                        "cab_id": localStorage["ptnr"] == "GOZO CABS" ? GOZOFareId : 0,
                        "fare_price": price,
                        "content_id": price,
                        "total_kilometers": localStorage["source_city"].toLowerCase() == "dubai" ? parseInt(dubaiDistance) : totalkm,
                        "terminalCode": localStorage["cityCODE"].trim() == "DEL" ? "T3" : localStorage["TerminalCode"],
                        // "terminalCode": localStorage["cityCODE"].trim() == "DEL" ? $("#cabPickupTerminal :selected").text().trim().split("-")[1] : localStorage["TerminalCode"],
                        "msgUniqueId": getRandom(10),
                        "from_city": localStorage["cityCODE"].trim(),
                        "to_city": localStorage["cityCODE"].trim(),
                        "source": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiCity : $("#pac-inputOutstation").val().substring(0, 100).trim(),
                        "destination": localStorage["DropLocationAddress"].trim(),
                        "latitude": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiLat : localStorage["source_latitudeValue"],
                        "longitude": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiLong : localStorage["source_longitudeValue"],
                        "isDeparture": 1,
                        "pnr": localStorage["booking_id"],
                        "source_city": localStorage["source_city"].toLowerCase() == "dubai" ? "Dubai" : localStorage["SourceCity"].trim(),
                        "source_latitude": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiLat : localStorage["source_latitudeValue"],
                        "source_longitude": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiLong : localStorage["source_longitudeValue"],
                        "source_name": localStorage["source_city"].toLowerCase() == "dubai" ? dubaiCity : $("#pac-inputOutstation").val().substring(0, 100),
                        "destination_city": localStorage["DropLocationCity"].trim(),
                        "destination_latitude": localStorage["DropLatitude"],
                        "destination_longitude": localStorage["DropLongitude"],
                        "destination_name": localStorage["DropLocationAddress"].trim(),
                        "status": "CAB",
                        "mojoPartner": sessionStorage["MojoboxxURL_booking"] == "Mojoboxx" ? "Mojoboxx" : "Yatra",
                        "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                        "fixedFareId": localStorage["ptnr"] == "QUICKRIDE" ? quickrideFareId : ' ',
                        "carID": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.carID : '',
                        "token": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.token : '',
                        "pay_type": 'post',
                        'paymentMethod': 'PAYBYCASH',
                        "service_charge": serviceCharge,
                        "website_url": sessionStorage["MojoboxxURL_booking"] == "Facebook" ? "Facebook" : "yatra_departure_outstation_url",
                        "trip_type": "OneWay",
                        "state": stateforinvoice,
                    }
                ]
            };
        }
        // console.log(dataJ);
        localStorage.setItem("departurebookingData", JSON.stringify(dataJ));

        // if(PAYMENT_TYPE =="RAZORPAY")
        // {
        //     await addPaymentType('RAZORPAY', '', '', 'full_pay', price);

        // }
        // else if(PAYMENT_TYPE =="PAYTM")
        // {
        //     await addPaymentType('PAYTM', '', '', 'full_pay', price);

        // }
        if (PAYMENT_TYPE == "RAZORPAY" && paytp == "full") {
            await addPaymentType('RAZORPAY', '', '', 'full_pay', price);
        }
        else if (PAYMENT_TYPE == "RAZORPAY" && paytp == "part") {
            await addPaymentType('RAZORPAY', '', '', 'partial_pay', price);
        }

        else if (PAYMENT_TYPE == "PAYTM" && paytp == "full") {
            await addPaymentType('PAYTM', '', '', 'full_pay', price);
        }
        else if (PAYMENT_TYPE == "PAYTM" && paytp == "part") {
            await addPaymentType('PAYTM', '', '', 'partial_pay', price);
        }
        else if (PAYMENT_TYPE == "NewPayment") {
            $(".spinner").css("display", "none")
            $(".spinnerBack").css("display", "none")
            window.location.href = 'payment.html'
        }
        else {
            $.ajax({
                type: 'POST',
                url: BaseAPIURL+domain+'/webapi/cabRegistration',
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/cabRegistration',
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (response) { // console.log(response);
                    if (response.status == 200) {
                        // if (localStorage["partnerName"] == "GOAMILES") {
                        //     window.location = GoamilePaymentLink;
                        //     return false;
                        // }


                        $("#continue").prop("disabled", true);
                        location.href = "cab_confirm.html";
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                        localStorage.setItem("departurenotify", localStorage["URLimg"]);
                    } else {
                        $("#continue").val("Confirm Pickup")
                        $("#cmmsg").html("Booking failed");
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                    }

                },
                error: function (res) {
                    console.log("Cab booking failed");
                    $(".spinner").css("display", "none")
                    $(".spinnerBack").css("display", "none")
                    $("#cmmsg").html("Booking failed");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                }
            });
        }

    }


    // //////////////////// Submit Page form data code end ///////////////////////








    async function myFunction(pname) {
        let mfv = "";
        // console.log(pname);
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


    // /////////////// Fetch city name from city code - CODE START ///////////////
    var cityNameFetch;
    async function loadCityName(citycode) {

        var cityData = JSON.parse(localStorage["pickupPoint"])
        // console.log(cityData);
        // console.log(cityData[citycode][0]["source_city"])
        cityNameFetch = cityData[citycode][0]["source_city"]
        return cityNameFetch;
    }
    // /////////////// Fetch city name from city code - CODE END  ///////////////



    // ////////////////// Fetch Cab partners Fare chart code start //////////////////
    async function loadFareFormDB(partnerName, cityName, distance, cabType) {
        var desP;
        var hypen_pos;
        var dis;
        var dis2;
        var amt;
        return new Promise(async function (resolve, reject) {
            fetch('https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFare?partner=' + partnerName + '&city=' + cityName + '&km=' + distance + '&cab_type=' + cabType + '&trip_type=Arrival', { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
                desP = json.data;
                if (json.message != "Data not found") {
                    if (String(desP).includes("-")) {
                        hypen_pos = desP.split("-")[1]
                    } else {
                        hypen_pos = desP
                    } amt = ((50 / (Number(hypen_pos) + Number(50))) * 100)
                    if (String(amt).includes(".")) {
                        dis = String(amt).split(".")
                        dis2 = dis[0];
                    } else {
                        dis2 = ((50 / (Number(hypen_pos) + Number(50))) * 100);
                    }
                    document.getElementById("discount" + partnerName).innerHTML = dis2 + "% off"
                    document.getElementById("pr" + partnerName).innerHTML = " ₹ " + hypen_pos
                    document.getElementById("pr2" + partnerName).innerHTML = "₹" + (
                        Number(hypen_pos) + Number(50)
                    )
                    localStorage.setItem("finalFare" + partnerName, desP);
                    resolve(desP);
                } else {
                    console.log("fare not found");
                    resolve(true)
                }
            })
        })
    }
    // ////////////////// Fetch Cab partners Fare chart code end  //////////////////

    // ///////////////////////Get fare from Quickride API code start////////////////////////
    var quickrideFareId;
    async function GetFarefromPartner(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2QUICKRIDE").style.display = "none";
            var fetchResponse;

            var datasend = {
                key: "MojoBox-Klm9.45j",
                vendor_id: "MOJO_BOXX_ZORY",
                destination_name: $("#Drop-input").val(),
                destination_city: localStorage["DropLocationCity"].trim(),
                destination_latitude: localStorage["DropLatitude"],
                destination_longitude: localStorage["DropLongitude"],
                source_name: $("#pac-inputOutstation").val(),
                source_city: localStorage["SourceCity"].trim(),
                source_latitude: localStorage["source_latitudeValue"],
                source_longitude: localStorage["source_longitudeValue"],
                start_time: moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                end_time: "",
                tripType: "Outstation",
                journeyType: "OneWay",
            }
            $("#fare").css("width", "45%");
            fetch(BaseAPIURL+domain+'/webapi/getQuickRideFare', {
                method: 'POST',
                body: JSON.stringify(datasend),
                "headers": {
                    "Authorization": "Basic eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MyIsImlzcyI6IlF1aWNrUmlkZSIsImlhdCI6MTYzOTU0MTgyMH0.6H0Dt2Hqhlj7RxcMcybV2bgkr29pCtm6ni8qfZFpv6qLtJtqy4-BbL-kTnz2zYiDZGDeGGj8Gr_GBC2FZFRkdg",
                    "Content-type": "Application/json"
                }
            }).then(response => response.json()).then(json => {
                var fareAmountInteger;
                fetchResponse = json;
                for (let a = 0; a < fetchResponse.fareForTaxis.length; a++) {
                    let TaxiType = fetchResponse.fareForTaxis[a].taxiType;
                    if (TaxiType == "Car") {
                        var fareResponse = fetchResponse.fareForTaxis[a].fares;
                        // console.log(fareResponse);
                        if (fareResponse.length >= 1) {
                            for (let i = 0; i < fareResponse.length; i++) {
                                if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                    quickrideFareId = fareResponse[i].fixedFareId;
                                    fareAmountInteger = Number(parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount));
                                    let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                                    if (String(AmountDiscount).includes(".")) {
                                        var splitAmount = String(AmountDiscount).split(".")
                                        var splitAmount2 = splitAmount[0];
                                    } else {
                                        splitAmount2 = AmountDiscount;
                                    }
                                    $("#fare").css("width", "45%");

                                    document.getElementById("pr2QUICKRIDE").style.display = "block";
                                    $("#prQUICKRIDE").css("font-size", "16px");
                                    document.getElementById("discountQUICKRIDE").innerHTML = splitAmount2 + "% off"
                                    document.getElementById("prQUICKRIDE").innerHTML = " ₹ " + fareAmountInteger
                                    document.getElementById("pr2QUICKRIDE").innerHTML = "₹" + (
                                        Number(fareAmountInteger) + Number(50)
                                    )
                                    localStorage.setItem("finalFareQUICKRIDE", fareAmountInteger);
                                    localStorage.setItem("TotalFare", fareAmountInteger);
                                    resolve(fareAmountInteger)
                                }

                            }
                        }
                    }
                }
            }).catch((error) => {
                resolve(true)
            });
        })
    }
    // //////////////////////get fare from quickride code end ///////////////////////////


    // /////////////////////// start Gozo /////////////////////////////////////////////////
    var GOZOFareId;
    const GetFareFromGozoPartner = async (CabType) => {

        return new Promise(async function (resolve, reject) {

            //////////////////Current date & time code start/////////////////
            // var tym_date = moment(new Date()).add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss')
            var tym_date = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + "T" + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var Currenttym = tym_date.split("T")[1]
            var Currentdate = tym_date.split("T")[0]
            //////////////////Current date & time code end /////////////////

            var settings = {
                // "url": "https://preprodapi.mojoboxx.com/preprod/webapi/getGozoFares",
                "url": BaseAPIURL+domain+"/webapi/getGozoFares",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": "Basic M2UwMDA4NTU0NWQ0OWZmMmNjM2MxNjRhMTcyYzE0ZGQ=",
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(
                    {
                        "startDate": Currentdate,
                        "startTime": Currenttym,
                        "cab_type": CabType,
                        "mobile": document.getElementById("mb_number").value,
                        "source_address": $("#pac-inputOutstation").val(),
                        "source_latitude": localStorage["source_latitudeValue"],
                        "source_longitude": localStorage["source_longitudeValue"],
                        "destination_address": $("#Drop-input").val(),
                        "destination_latitude": localStorage["DropLatitude"],
                        "destination_longitude": localStorage["DropLongitude"],
                    }
                )
            };
            // console.log(settings);   
            // console.log(settings.data);

            $.ajax(settings).done(function (gozores) {
                // console.log(gozores);
                if (gozores.success != "false" && gozores.code == 200) {
                    var gozofare = gozores["data"]["cabRate"]
                    var GozoResponse = gozores.result;
                    localStorage.setItem("GozoResponse", JSON.stringify(GozoResponse))
                    for (let a = 0; a < gozofare.length; a++) {
                        CabType == "Hatchback" ? CabType = "Compact" : CabType;
                        if (gozofare[a]["cab"]["category"].toLowerCase() == CabType.toLowerCase()) {
                            // console.log(gozores["data"]["cabRate"][0]["cab"]["category"]);
                            GOZOFareId = gozores["data"]["cabRate"][0]["cab"]["id"]
                            var FareAmount = Number(parseInt(gozofare[a]["fare"]["totalAmount"]) + parseInt(MultiplierAmount));
                            let AmountDiscount = ((50 / (FareAmount + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            document.getElementById("pr2GOZO CABS").style.display = "block";
                            document.getElementById("discountGOZO CABS").innerHTML = splitAmount2 + "% off"
                            document.getElementById("prGOZO CABS").innerHTML = " ₹ " + FareAmount
                            document.getElementById("pr2GOZO CABS").innerHTML = "₹" + (
                                Number(FareAmount) + Number(50)
                            )
                            localStorage.setItem("finalFareGOZO CABS", FareAmount);
                            localStorage.setItem("TotalFare", FareAmount);
                            resolve(FareAmount)
                        } else {
                            resolve(true)
                        }
                    }
                } else {
                    console.log("GOZO CABS fare not found")
                    reject("Gozo fare not Found")
                }
                // console.log("resolve it")
            });
        })
    }
    // /////////////////////// end Gozo /////////////////////////////////////////////////



    ////////////////////// Outstation Time UI Code start /////////////////////////////////////
    if (localStorage["loadPagevalue"] == "outstation") {
        let st = 15;
        let times = [];
        let tt = 60;
        let ap = ["", ""];
        let hour_arr = [];
        let min_arr = [];

        for (let i = 0; tt < 13 * 60; i++) {
            let hh = Math.floor(tt / 60);
            let mm = tt % 60;
            times[i] = ("0" + (
                hh % 12
            )).slice(-2) + ":" + (
                "0" + mm
            ).slice(-2) + ap[Math.floor(hh / 12)];
            tt = tt + st;
        }
        // console.log(times)


        for (k = 0; k <= times.length; k++) {
            if (times[k] != undefined) {
                let timeslot_div = document.createElement("div");
                timeslot_div.setAttribute("class", "time-slot");
                timeslot_div_span = document.createElement("span");
                timeslot_div_span.setAttribute("class", "dispTime");
                timeslot_div_span.setAttribute("id", "time_index" + k);
                var slotTime;
                switch (times[k]) {
                    case "00:00":
                        timeslot_div_span.innerHTML = "12:00";
                        break;
                    case "00:15":
                        timeslot_div_span.innerHTML = "12:15";
                        break;
                    case "00:30":
                        timeslot_div_span.innerHTML = "12:30";
                        break;
                    case "00:45":
                        timeslot_div_span.innerHTML = "12:45";
                        break;
                    default:
                        timeslot_div_span.innerHTML = times[k];
                }
                // timeslot_div_span.innerHTML = times[k];

                timeslot_div.appendChild(timeslot_div_span);
                document.getElementById("time-list-wrap").appendChild(timeslot_div);
            }
        }

        if ($(".dispTime").html() == undefined) {
            $(".dispTime").css("display", "none");
        };

        $(".timepicker").click(() => {
            $("#myForm").css("display", "block");
            $("#choosetimegrid").css("display", "block");
            $("#time-list-wrap").css("display", "block");
            $("#timeam").removeClass("activeClass");
            $("#timepm").removeClass("activeClass");
            $("#donetime").css("display", "none");
            $(".dispTime").removeClass("activeClass");
        })
        $(".dispTime").click(function () {
            var x = document.getElementById("timemsg");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", " ");
            }, 1000);
            $(".dispTime").removeClass("activeClass");
            $("#timeam").removeClass("activeClass");
            $("#timepm").removeClass("activeClass");

            $(this).addClass("activeClass");
            localStorage.setItem("depttime", $(this).text());
        });
        var TimeFormat;
        var numberValue;
        $("#timeam").click(() => {
            $("#timeam").addClass("activeClass");
            $("#timepm").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {
                TimeFormat = localStorage["depttime"] + " " + $("#timeam").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timeam").html(), ["h:mm A"]).format("HH:mm");
                if (localStorage["loadPagevalue"] == "outstation") {
                    if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
                        $("#cmmsg").html("Do not select a time between 10pm to 6am");
                        $(".thank_msg i").css("display", "none");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        $("#myForm").css("display", "none")
                        return
                    }
                    else {
                        updateTime()
                    }
                }
                else {
                    updateTime()
                }
            }

        })
        $("#timepm").click(() => {
            $("#timepm").addClass("activeClass");
            $("#timeam").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {
                TimeFormat = localStorage["depttime"] + " " + $("#timepm").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timepm").html(), ["h:mm A"]).format("HH:mm");

                if (localStorage["loadPagevalue"] == "outstation") {
                    if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
                        $("#cmmsg").html("Do not select a time between 10pm to 6am");
                        $(".thank_msg i").css("display", "none");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        $("#myForm").css("display", "none")
                        return
                    }
                    else {
                        updateTime()
                    }
                }
                else {
                    updateTime()
                }
            }

        })
        $(".back_icon, .back_text").click(() => {
            $("#myForm").css("display", "none");
        })

        function updateTime() {
            if (String(TimeFormat).includes("undefined")) {
                return false;
            }
            $(".timepicker").html(TimeFormat)
            $(".timepicker").val(TimeFormat)
            $("#myForm").css("display", "none");

            var today = new Date();
            var timeToday = today.getHours();
            var getMin = today.getMinutes();
            if (String(timeToday).length == 1) {
                timeToday = "0" + timeToday
            }
            if (String(getMin).length == 1) {
                getMin = "0" + getMin;
            }
            var ZeroHour = timeToday + 3 + ":" + getMin;
            let todayDate = new Date().toISOString().slice(0, 10)

            var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");

            if ((todayDate == localStorage["STDdate"]) || (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))) {
                if (Timevalue < ZeroHour) {
                    // $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours prior to your departure.");
                    $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours later then current Time.");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $(".timepicker").val("Pick up Time");
                }
            }
            if (Timevalue > localStorage["STDtime"]) {
                $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours prior to your departure.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }
            if (moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") < todayDate) {
                $("#cmmsg").html("You have selected an invalid pickup Date. You are advised to select a time, 3 hours prior to your departure.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }
        }
    }

    ////////////////////// Outstation Time UI Code end  //////////////////////////////////////








    // ///////////////// Cab Img click code start ////////////////////////////
    $(".hatchback").click(async function () {
        console.log("outstation k hatchback")
        localStorage.setItem("partnercabType", "hatchback");
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".hatchback img").addClass("active_cab");
        let cab_response = JSON.parse(localStorage["cab_response"]);
        if (OutstationShow == "yes") {
            await partnerSliderOutstation(cab_response, "hatchback", localStorage["ArrivalStation"]);
        }
    })

    $(".sedan").click(async function () {
        console.log("outstation k sedan")
        localStorage.setItem("partnercabType", "sedan");
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".sedan img").addClass("active_cab");
        let cab_response = JSON.parse(localStorage["cab_response"]);
        if (OutstationShow == "yes") {
            await partnerSliderOutstation(cab_response, "sedan", localStorage["ArrivalStation"]);
        }

    })

    $(".suv").click(async function () {
        console.log("outstation k suv")
        localStorage.setItem("partnercabType", "suv");
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".suv img").addClass("active_cab");
        let cab_response = JSON.parse(localStorage["cab_response"]);
        if (OutstationShow == "yes") {
            await partnerSliderOutstation(cab_response, "suv", localStorage["ArrivalStation"]);
        }
    })
    // ///////////////// Cab Img click code end /////////////////////////////



    $("#statusOutstation").click(function () {
        location.reload()
    });

    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: 0,
        onSelect: function (dateText) {
            if ($(".timepicker").val() == "Pick up Time") {
                $("#myForm").css("display", "block");
                $("#time-list-wrap").css("display", "block");
                $(".done_btn").css("display", "none");
                $("#slotdiv").css("display", "block");
                // $( "#datepicker" ).datepicker({ minDate: 0});

                var CardInterval = setInterval(function () {
                    console.log($(".timepicker").val())
                    localStorage.setItem("LoadTIMEUI", true);
                    if ($(".timepicker").val() != "Pick up Time") {
                        clearInterval(CardInterval)
                        lastDetailsOutstation();
                    }
                }, 1000)
            }
            else if ($(".timepicker").val() != "Pick up Time") {
                lastDetailsOutstation()
            }
        }
    });

    $("#status3").click(function () {
        $(".confirmation_boxCab3").css("display", "none");
        $(".confirmation_boxCabDiv3").css("display", "none");
        location.href = "payendBooking.html?payMethod=RAZORPAY"
    })

    $(".radioBox label").css("width", "100%")
    $(".radioBox label").css("margin", "4px")
    $(".radioBox label").css("float", "left")
    $(".radioBox label").css("margin-top", "-46px")
    $(".radioBox label").css("margin-left", "28px")

    // ///////////////////////Apply coupon code start //////////////////////////////////

    if ((localStorage['couponPara_val'] != null) && (localStorage['couponPara_val'] != "null") && (localStorage['couponPara_val'] != "")) {
        $("#coupon").val(localStorage['couponPara_val']);
        if (localStorage['fullData'] != 'FullData') {
            applyCoupon()
        } else {

            fetch(BaseAPIURL+domain+"/webapi/getCouponCode").then((res) => {
                return res.json()
            })
                .then((data) => {
                    console.log($("#coupon").val())
                    if ($("#coupon").val() != '') {
                        for (let element in data.data) {
                            if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {
                                // couponCodeValue = data.data[element].amount
                                // couponcodeType = data.data[element].pay_type
                                // couponDiscountAmt = data.data[element].amount

                                $("#CouponCode").val($("#coupon").val());
                                localStorage.setItem("CouponCode", $("#coupon").val());
                                // if (couponcodeType == 'cashback') {
                                    $("#coupon").val("Congrats! you'll get a cashback link on trip start")
                                    $(".redeem").html(`Redeem your <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span>cashback through
                                    <br>Cashback link on trip start.`)
                                    $(".redeem1").css("display", "block")
                                // }
                                // else {
                                //     $("#coupon").val(`Congrats! ₹ ${couponCodeValue} instant discount applied`)
                                //     $(".redeem1").css("display", "none")
                                //     $(".redeem").html(`Your coupon code for instant discount <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`)
                                // }
                                document.getElementById("cpndiscnt").innerText = " Rs. " + data.data[element].amount;
                                $("#coupon").attr("disabled", "true").css({ "width": "95%", "color": "#828282" });
                                $("#applyCoupon").css("display", "none")
                                $(".infoBox").css("display", "none")
                                $("#couponSuccessMsg").css("display", "none")
                            }
                        }
                    }
                })
        }
    }

    document.getElementById("applyCoupon").onclick = function () {
        applyCoupon()
    }

    async function applyCoupon() {
        let couponapplied = false;
        document.getElementById("spinner").style.display = "block";

        if ($("#coupon").val() != '') {
            let cv = $("#coupon").val();
            fetch(`${BaseAPIURL}${domain}/webapi/getCouponCode`).then((res) => {
            // fetch(`${BaseAPIURL}${domain}/webapi/getCouponCode?coupon_code=${cv}`).then((res) => {

                return res.json()
            })
                .then((data) => {
                    document.getElementById("spinner").style.display = "none";
                    if ($("#coupon").val() != '') {
                        if (data.success === true) {
                            for (let element in data.data) {
                                console.log(data.data[element])
                                if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {
                                    couponapplied = true;

                                    Track_LoadAnalytics(localStorage["mobileNum"], "couponcodeapplydeparture", "Cleartrip", "null", "null", "null", "null",
                                        "null", "null", "null", "null", "null",
                                        "null", "null", data.data[element].coupon_code)

                                    $("#CouponCode").val($("#coupon").val());
                                    localStorage.setItem("CouponCode", $("#coupon").val());
                                    $(".popupDiv").css("display", "block")
                                    $(".popupBox").css("display", "block")
                                    // couponCodeValue = data.data[element].amount
                                    // couponcodeType = data.data[element].pay_type
                                    // couponDiscountAmt = data.data[element].amount
                                    // if (couponcodeType == 'cashback') {
                                        $("#coupon").val("Congrats! you'll get a cashback link on trip start")
                                        $(".redeem").html(`Redeem your <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span>cashback through
                                                    <br>Cashback link on trip start.`)
                                        $(".redeem1").css("display", "block")
                                    // }
                                    // else {
                                    //     $("#coupon").val(`Congrats! ₹ ${couponCodeValue} instant discount applied`)
                                    //     $(".redeem1").css("display", "none")
                                    //     $(".redeem").html(`Your coupon code for instant discount <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`)
                                    // }
                                    document.getElementById("cpndiscnt").innerText = " Rs. " + data.data[element].amount;
                                    $("#coupon").attr("disabled", "true").css({ "width": "95%", "color": "#828282" });
                                    $("#applyCoupon").css("display", "none")
                                    $(".infoBox").css("display", "none")
                                    $("#couponSuccessMsg").css("display", "none")

                                }
                            }
                            if(couponapplied == false)
                            {
                                $("#cmmsg").append(`Dear Customer<br>This coupon code is not available. Kindly Use <b>CAB75</b> to get Rs 75 cashback.`);
                                $(".thank_msg i").css("display", "none");
                                $(".confirmation_boxCabDiv").css("display", "block");
                                $(".confirmation_boxCab").css("display", "block");
                            }
                        }
                        if(couponapplied == false)
                        {
                            $("#cmmsg").empty();
                            $("#cmmsg").append(`Dear Customer<br>This coupon code is not available. Kindly Use <b>CAB75</b> to get Rs 75 cashback.`);
                            $(".thank_msg i").css("display", "none");
                            $(".confirmation_boxCabDiv").css("display", "block");
                            $(".confirmation_boxCab").css("display", "block");
                        }
                    } else {
                        $("#couponSuccessMsg").css("color", "red").html('Please enter coupon code');
                    }
                })
        }
    }
    // ///////////////////////Apply coupon code end ///////////////////////////////////

}
