
var TripType;
var MultiplierAmount;
var sessionToken
function loadMainjs() {
    var ArrAirportName;
    var DepAirportName;
    var SourceName;
    var SourceCity;
    var source_latitude;
    var source_longitude;
    var cityCODE;
    var source_city;
    var pickup_lat;
    var pickup_long;
    var KMVal;
    var TerminalCode;
    var KMNum;
    var stateforinvoice = "";

    if (ShowSelfDrive != "yes") {
        $("#ConfirmButton").css("display", "none");
    }

    $('input[type=radio][name=selfTyp]').change(function () {
        if (this.value == 'Airport Round Trip') {
            TripType = 'Airport Round Trip';
            $("#defPickup").html("Select City")
            $("#pickupDiv").css("width", "49%");
            $(".fa-sort-down").css("right", "3%")
            $("#pickupDiv2").css("display", "block");
            $("#notePoint").css("display", "none");
            $("#cr").removeClass("selectedGurny")
            $("#rt").addClass("selectedGurny")
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
            let cab_response = JSON.parse(localStorage["cab_response"]);
            partnerSlider(cab_response, "suv", ArrAirportName, 'Airport Round Trip');

        } else if (this.value == 'City Rental') {
            TripType = 'City Rental';
            $("#defPickup").html("Select City")
            $("#pickupDiv2").css("display", "none");
            $("#pickupDiv").css("width", "96%");
            $(".fa-sort-down").css("right", "0%")
            $("#rt").removeClass("selectedGurny")
            $("#cr").addClass("selectedGurny")
            $("#notePoint").css("display", "none");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
            let cab_response = JSON.parse(localStorage["cab_response"]);
            partnerSlider(cab_response, "suv", ArrAirportName, 'City Rental');
        }
    });




    document.getElementById("mb_number").onchange = async function () {

        // checkMobile();
        // let bookingStatus = await checkBookingStatus()
        // console.log(bookingStatus)
        // if (bookingStatus.success == true && bookingStatus.message == "Dont Do Booking") {
        //     localStorage.setItem("nonpnr", bookingStatus.data)
        //     $("#cmmsg3").html("Cab is already scheduled");
        //     $(".spinner").css("display", "none")
        //     $(".spinnerBack").css("display", "none")
        //     $(".thank_msg i").css("display", "none");
        //     $(".confirmation_boxCabDiv").css("display", "block");
        //     $(".confirmation_boxCab4").css("display", "block");
        //     //    resolve(true)
        //     return true
        // }
        if ($("#mb_number").val().length == 10 && $("#mb_number").val() != undefined) {
            localStorage.setItem("mobileNum", $("#mb_number").val())
            await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
        }
    }

    window.onload = async function () {
        // setTimeout(() => {
        //     if (!localStorage["PageReload"]) {
        //         analyticTracking("1", "Departure_Link_Click", "click");
        //     }
        // }, 1000);
        localStorage.removeItem("CabSHOW");
        // let bookingStatus = await checkBookingStatus()
        // console.log(bookingStatus)
        // if (bookingStatus.success == true && bookingStatus.message == "Dont Do Booking") {
        //     localStorage.setItem("nonpnr", bookingStatus.data)
        //     $("#cmmsg3").html("Cab is already scheduled");
        //     $(".spinner").css("display", "none")
        //     $(".spinnerBack").css("display", "none")
        //     $(".thank_msg i").css("display", "none");
        //     $(".confirmation_boxCabDiv").css("display", "block");
        //     $(".confirmation_boxCab4").css("display", "block");
        //     //    resolve(true)
        //     return true
        // }
    }

    LoadPagedata()
    async function LoadPagedata() {
        var bookingId = localStorage["booking_id"];
        ShowSelfDrive == "yes" ? await loadCity('', 'isSelfDrive') : ''
       
        setTimeout(() => {
            initAutocomplete();
        }, 3000);
        await getPNR(bookingId);
    }

    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch('https://prod.mojoboxx.com/spicescreen/webapi/meruPickupPoint?city=' + CityCode);
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }

    // ////////////Load city data code start ///////////
    async function loadCity(departurecode = '', TripType) {
        $("#cabPickupCity").empty();

        return new Promise(async function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: 'https://prod.mojoboxx.com/spicescreen/webapi/getCityList',
                contentType: "application/json",
                dataType: 'json',
                success: function (data) {
                    let dynamicOption = '';
                    var cityArray = [];
                    // console.log(data);
                    data.forEach(element => {
                        if (element[TripType] == "1") {
                            cityArray.push(element);

                        }
                    })
                    if (TripType == 'isSelfDrive') {
                        dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`

                    } else {
                        dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`
                    }
                    $.each(cityArray, function (i, currProgram) {
                        if (departurecode != '' && currProgram.code == departurecode) {
                            dynamicOption += `<option selected="true" value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                            fillTerminalCodeByCity(departurecode)

                        } else {
                            dynamicOption += `<option value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                        }
                    });
                    $("#cabPickupCity").append(dynamicOption)

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
            source_latitude =  $("#cabPickupTerminal :selected").attr('class').split(",")[1]
            source_longitude = $("#cabPickupTerminal :selected").attr('class').split(",")[2]
            // localStorage.setItem("source_latitude", $("#cabPickupTerminal :selected").attr('class').split(",")[1])
            //localStorage.setItem("source_longitude", $("#cabPickupTerminal :selected").attr('class').split(",")[2])
        }
    })


    // /////////// Fill Terminal code in select field code start /////////////////////
    $('#cabPickupCity').on('change', async function () {

        $('#paymentoptions').css("display", "none");

        if (isNaN(document.getElementById("mb_number").value) || document.getElementById("mb_number").value.indexOf(" ") != -1) {
            // $("#cmmsg").html("Please enter a valid mobile number");
            // $(".thank_msg i").css("display", "none");
            // $(".confirmation_boxCabDiv").css("display", "block");
            // $(".confirmation_boxCab").css("display", "block");
            // $("#continue").val("Confirm pickup")
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter a Valid Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }
        if (document.getElementById("mb_number").value.length == 0) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }
        if (document.getElementById("mb_number").value.length > 10 || document.getElementById("mb_number").value.length < 10) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter a Valid Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }


        await loadMeruPickPoint($(this).find(":selected").val());
        await fillTerminalCodeByCity($(this).find(":selected").val())
        $(".bookBtn").css("display", "none")
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        DepAirportName = $(this).find(":selected").val()
        $("#pac-input").val('');
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

            lastDetails();
        }

        await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, $(this).find(":selected").val(), TerminalCode, $(this).find(":selected").val(), pickup_lat, pickup_long, source_latitude, source_longitude,
            moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
    });

    async function fillTerminalCodeByCity(cityCode = '') {
        return new Promise(async function (resolve, reject) {
            ArrAirportName = cityCode
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';
            const obj = JSON.parse(localStorage["pickupPoint"]);

            let lc = obj;
            let rv;
            rv = lc[cityCode];
            // console.log(rv)
            localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));
            cityCODE = cityCode
           // localStorage.setItem("cityCODE", cityCode);
           source_city = rv[0].source_city
            // localStorage.setItem("source_city", rv[0].source_city)
            if (cityCode == "DEL") {
                source_latitude = rv[2].source_latitude
                source_longitude = rv[2].source_longitude
                // localStorage.setItem("source_latitude", rv[2].source_latitude)
                // localStorage.setItem("source_longitude", rv[2].source_longitude)
            } else {
                source_latitude = rv[0].source_latitude
                source_longitude =  rv[0].source_longitude
                //localStorage.setItem("source_latitude", rv[0].source_latitude)
                // localStorage.setItem("source_longitude", rv[0].source_longitude)
            }
            TerminalCode = rv[0].id
           // localStorage.setItem("TerminalCode", rv[0].id)
           SourceName = rv[0]["source_name"]
            // localStorage.setItem("SourceName", rv[0]["source_name"])
            localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + rv[0]["source_latitude"] + "," + rv[0]["source_longitude"] + "," + rv[0]["source_name"])
            rv != undefined && $.each(rv, function (i, currProgram) {
                if (cityCode == "DEL") {
                    dynamicOption += `<option selected value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name
                        }"> ${currProgram.source_name
                        } </option>`
                } else {
                    dynamicOption += `<option value="${currProgram.id
                        }"> ${currProgram.source_name
                        } </option>`
                }
            });
            $("#cabPickupTerminal").append(dynamicOption);
            resolve(true);
        })
    }

    // /////////// Fill Terminal code in select field code end  /////////////////////


    // async function checkCity() {
    //     localStorage.removeItem("cabFound");
    //     const departure = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getCabPartnerData");
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
    //         $("#pac-input").val("Not Available");
    //         $("#pac-input").prop('disabled', true);
    //         $("#yourInfo").css("filter", "blur(5px)");
    //     }
    // }

    // $("#status2").click(function(){
    //     window.location="https://spicescreen.com/"
    // })

    $("#status4").click(function () {
        $(".thank_msg i").removeClass("fa-times-circle");
        $(".thank_msg i").addClass("fa-check-circle");
        $("#brand-logo").css("filter", "blur(0px)");
        $("#addressBox").css("filter", "blur(0px)");
        $("#mapBox").css("filter", "blur(0px)");
        $("#yourInfo").css("filter", "blur(0px)");
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("display", "none");
        // window.location = "booked.html"
        // window.location = "http://predeparturemodify.spicescreen.co/?bookingId=" + localStorage["nonpnr"]
        window.location = "http://edit.bookairportcab.com/?bookingId=" + localStorage["nonpnr"]
    });

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
        window.location = "http://edit.bookairportcab.com/?bookingId=" + localStorage["BookedId"]
    });
    var x = document.getElementById("demo");

    // //////// Fetch current location on page load code start/////////////////
    var MapPlaceId = ''
    async function getUSERLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successHandler1, errorHandler1, {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        } else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Bac_departurepageLoad");
            console.log("Geolocation is not supported by this browser.");
        }
    }
    var successHandler1 = function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        displaycurrentLocation(lat, lon);
    };
    var errorHandler1 = function (errorObj) {
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Bac_departurepageLoad");
        console.log(errorObj.code + ": " + errorObj.message);
    };
    function displaycurrentLocation(latitude, longitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        localStorage.setItem("myCurrentPickupLat", latitude)
        localStorage.setItem("myCurrentPickupLong", longitude)
        // console.log(geocoder);

        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                    var add = results[0].formatted_address;
                    MapPlaceId = results[0].place_id;
                    var placeAddress = add.split(",");
                    localStorage.setItem("DepartureCityNon-pnr", placeAddress.slice(-3, -1)[0]);
                    localStorage.setItem("DepartureAddressNon-pnr", add);
                    Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", placeAddress.slice(-3, -1)[0] + "%" + add,
                        "Null", "Null", "Null", "NULL", "Bac_departurepageLoad");
                } else {
                    Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Bac_departurepageLoad");
                    console.log("address not found");
                }
            } else {
                Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "C2Apageclick");
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    // //////// Fetch current location on page load code end /////////////////


    // ////////////// Current location fetch code start /////////////////////
    function getLocation() {
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
        // console.log(geocoder);

        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    // console.log(add);
                    document.getElementById("pac-input").innerHTML = add;
                    document.getElementById("pac-input").value = add;
                    var pacInput = document.getElementById("pac-input");
                    $("#pac-input").focus();
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
                        if (source_latitude) {
                            let lat = parseFloat(source_latitude);
                            let lng = parseFloat(source_longitude);

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
                        // $("#ndl1").html("<b>" + $("#pac-input").val() + "</b>");
                        // $("#ndl2").html("Updated location: <b>" + $("#pac-input").val() + "</b>");
                        // $("#upDown").removeClass("fa-chevron-up");
                        // $("#upDown").addClass("fa-chevron-down");
                        // $("#yourInfo").css("height", "2%");
                        // $("#arr").css("top", "0%");
                        // $("#addressBox").css("height", "230px");
                        $("#makeSerIconI").removeClass("fa-map-marker-alt");
                        $("#makeSerIconI").addClass("fa-times");
                        a = results[0].geometry.location.lat();
                        b = results[0].geometry.location.lng();

                        const DropPoint2 = {
                            lat: parseFloat(localStorage["myPickupLat"]),
                            lng: parseFloat(localStorage["myPickupLong"])
                        };

                        pickup_lat = a
                        pickup_long =b
                        //localStorage.setItem("pickup_lat", a);
                       // localStorage.setItem("pickup_long", b);
                        // console.log(pickup_lat);

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

                                Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude, "null", "null")

                                if (!directionsData) {
                                    window.alert('Directions request failed');
                                    return;
                                } else {
                                    $("#msg").fadeIn();
                                    KMVal = directionsData.distance.text;
                                    let ds = (directionsData.distance.value / 1000);
                                    let distanceP = Math.round(ds);
                                    KMNum = distanceP;
                                    $("#conPicLoc").css("display", "block");
                                }

                                if (KMNum > 70) {

                                    $("#cmmsg2").empty()
                                    $("#cmmsg2").html("The distance for your ride is above 70 Km . Book from outstation section for best fares.")
                                    $("#cmmsg2").css("font-size", "18px")
                                    $(".confirmation_boxCabDiv").css("display", "block")
                                    $(".confirmation_boxCabDiv2").css("display", "block")
                                    $(".confirmation_boxCab2").css("display", "block")
                                    $(".thank_msg").css("display", "none")
                                    $("#status2").css("display", "none")
                                    $("#status5").css({ "width": "70px", "font-size": "18px" })
                                    $("#statusOutstation").css("display", "none")
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
                                    //     if ($(".timepicker").val() != "Pick up Time") {
                                    //         clearInterval(CardInterval)
                                    //         lastDetails();
                                    //     }
                                    // }, 1000)

                                }
                            }
                        });
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
                } else {
                    console.log("address not found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    // ////////////// Current location fetch code end /////////////////////

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

    function robodemo() {
        // setTimeout(() => {
        //     document.getElementById("location").style.display = "block";
        //     $(".input_srch").css("position", "relative");
        //     $(".input_srch").css("z-index", "998");
        //     setTimeout(() => {
        //         $("#Terminal").css("display", "block")
        //         $("#location").css("display", "none")
        //         $(".input_srch").css("position", "initial");
        //         $(".input_srch").css("z-index", "998");
        //         $(".drop_div").css("z-index", "998");
        //         setTimeout(() => {
        //             $("#Terminal").css("display", "none")
        //             $("#location").css("display", "none")
        //             $("#tym").css("display", "block")
        //             $(".drop_div").css("z-index", "9");
        //             $("#tym3").css("z-index", "998");
        //             $("#tym2").css("z-index", "998");
        //             setTimeout(() => {
        //                 $("#Terminal").css("display", "none")
        //                 $("#location").css("display", "none")
        //                 $("#tym").css("display", "none")
        //                 $("#tym3").css("z-index", "9");
        //                 $("#tym2").css("z-index", "9");
        //             }, 1000);
        //         }, 1000);
        //     }, 1000);
        // }, 1000);
    }

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
        var sessionToken = new google.maps.places.AutocompleteSessionToken();
    }, 3000);
 
    function initAutocomplete() {
        let PickUpPoint;
        if (source_latitude) {
            let lat = parseFloat(source_latitude);
            let lng = parseFloat(source_longitude);
            // console.log(source_latitude);
            // console.log(source_longitude);
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

        let inputContainer = document.querySelector('pac-input');
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
                Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNRCurrentLocation_click");
                getLocation();
                autocomplete_results.style.display = 'none';
            })
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    SourceCity = placeArr.slice(-3, -1)[0]
                   // localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);

                    stateforinvoice = placeArr.slice(-2, -1)[0];
                    // alert(stateforinvoice);

                    const place_id = this.getAttribute('data-place-id');
                    MapPlaceId = this.getAttribute('data-place-id')
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

                            if (source_latitude) {
                                let lat = parseFloat(source_latitude);
                                let lng = parseFloat(source_longitude);
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
                            $("#makeSerIconI").removeClass("fa-map-marker-alt");
                            $("#makeSerIconI").addClass("fa-times");
                            a = place.geometry.location.lat();
                            b = place.geometry.location.lng();

                            const DropPoint2 = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            };

                            pickup_lat = a;
                            pickup_long = b;
                            //localStorage.setItem("pickup_lat", a);
                           // localStorage.setItem("pickup_long", b);
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
                                        KMVal = directionsData.distance.text;
                                        let ds = (directionsData.distance.value / 1000);
                                        let distanceP = Math.round(ds);
                                        KMNum = distanceP;
                                        $("#conPicLoc").css("display", "block");
                                    }
                                    if (KMNum < 5) {
                                        // alert("hello")
                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("Minimum 5km ride is required.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css("display", "none")
                                        $("#status7").css("display", "block")
                                        $("#statusOutstation").css("display", "none")

                                    }
                                    if (KMNum > 70) {

                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("The distance for your ride is above 70 Km . Book from outstation section for best fares.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css({ "width": "70px", "font-size": "18px" })
                                        $("#statusOutstation").css("display", "none")
                                    }
                                    else {

                                        document.getElementById("datepicker").focus();
                                        document.getElementById("etaDiv").style.marginLeft = "3%";
                                        document.getElementById("etaDiv").style.width = "45%";
                                        // $("#myForm").css("display", "block");
                                        // $("#time-list-wrap").css("display", "block");
                                        // $(".done_btn").css("display", "none");
                                        // $("#slotdiv").css("display", "block");
                                        // // 
                                        // var CardInterval = setInterval(function () {
                                        //     console.log($(".timepicker").val())
                                        //     localStorage.setItem("LoadTIMEUI", true);
                                        //     if ($(".timepicker").val() != "Pick up Time") {
                                        //         clearInterval(CardInterval)
                                        //         lastDetails();
                                        //     }
                                        // }, 1000)
                                    }

                                }
                            });

                        }
                        autocomplete_input.value = selected_text;
                        autocomplete_results.style.display = 'none';
                    });
                    // if(localStorage["PNR_Data"] == "Found"){
                    // }
                })

            }
        };
        let autocomplete_input = document.getElementById('pac-input');
        autocomplete_input.addEventListener('input', debounce(function () {

            if (document.getElementById("mb_number").value.length == 0) {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Mobile Number")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select  City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }



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
    $("#status5").click(function () {
        localStorage.setItem("loadPagevalue", "outstation")
        location.reload()
    });

    async function setLatLong(city) {
        let pl = JSON.parse(localStorage["pickupPoint"]);
        rv[0].source_latitude =  pl[city][0]["source_latitude"]
        source_longitude =  pl[city][0]["source_longitude"]
       // localStorage.setItem("source_latitude", pl[city][0]["source_latitude"]);
        // localStorage.setItem("source_longitude", pl[city][0]["source_longitude"]);
        source_city = pl[city][0]["source_city"]
        //localStorage.setItem("source_city", pl[city][0]["source_city"]);
    }

    // async function departure_Ads() {
    //     // const ads = await fetch("https://preprod.mojoboxx.com/preprod/webapi/getDepartureAds")
    //     const ads = await fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/getDepartureAds")
    //     const adResponse = await ads.json();
    //     // console.log(adResponse);

    //     for (let i = 0; i < adResponse.length; i++) {
    //         // console.log(adResponse[i])
    //         // if (adResponse[i].city_code.includes(DepAirportName)) {
    //         if (adResponse[i]["type"].toLowerCase() == "interstitial" && adResponse[i]["position"] == 1 && adResponse[i]["page_name"] == "departure") {
    //             localStorage.setItem("Ad", "true")
    //             document.getElementById("interstitial_back").style.display = "block";
    //             document.getElementById("interstitial_back").innerHTML = "";
    //             let inter = document.createElement("div");
    //             inter.setAttribute("class", "interstitial");
    //             let interImg = document.createElement("img");
    //             interImg.setAttribute("src", adResponse[i]["thumbnail"])
    //             inter.appendChild(interImg);
    //             interImg.onclick = function () {
    //                 document.getElementById("interstitial_back").style.display = "none";
    //                 robodemo();
    //             }
    //             let cross = document.createElement("i");
    //             cross.setAttribute("class", "fas fa-times-circle");
    //             cross.setAttribute("id", "cross");
    //             inter.appendChild(cross);
    //             cross.onclick = function () {
    //                 document.getElementById("interstitial_back").style.display = "none";
    //                 if (localStorage["PNR_Data"] == "Found") {
    //                     let pnrD = JSON.parse(localStorage["pnrData"]);
    //                     Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Homepage_Cross");
    //                 }
    //                 robodemo();
    //             }
    //             document.getElementById("interstitial_back").appendChild(inter);
    //             var closeTym;
    //             if (adResponse[i]["interstitial_time"] != "" || adResponse[i]["interstitial_time"] != null) {
    //                 closeTym = adResponse[i]["interstitial_time"];
    //             } else {
    //                 closeTym = 7000;
    //             }
    //             setTimeout(() => {
    //                 document.getElementById("interstitial_back").style.display = "none";
    //                 // robodemo();
    //             }, closeTym);
    //         } else if (adResponse[i]["type"].toLowerCase() == "bottom-banner" && adResponse[i]["page_name"] == "departure") {
    //             document.getElementById("bottom_banner").innerHTML = ''
    //             document.getElementById("bottom_banner").style.display = "block";
    //             let interImg = document.createElement("img");
    //             interImg.setAttribute("src", adResponse[i]["thumbnail"])
    //             document.getElementById("bottom_banner").appendChild(interImg);
    //         }
    //         else if (adResponse[i]["type"].toLowerCase() == "top-banner" && adResponse[i]["page_name"] == "departure") {
    //             document.getElementById("top_banner").style.display = "block";
    //             let interTop = document.createElement("img");
    //             interTop.setAttribute("src", adResponse[i]["thumbnail"])
    //             document.getElementById("top_banner").appendChild(interTop);

    //             interTop.onclick = function () {
    //                 localStorage.setItem("Outstation", true)
    //                 localStorage.setItem("loadPagevalue", "outstation")
    //                 location.reload();
    //                 localStorage.setItem("PageReload", true);

    //             }

    //         }
    //         // }
    //     }
    //     // if (!localStorage["Ad"]) {
    //     //     robodemo();
    //     // }
    // }
    const arrival_Airport = '';
    async function getPNR(bookingId) {
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
        if (!localStorage["PageReload"]) {
            getUSERLocation();
        }
        $("#datepicker").val(moment().format('DD-MM-YYYY'))
        $(".pnr_pickup").css("margin", "0 0px 6px 0");
        $(".form_mb").css("margin", "1.5% 0 1% 3%");
        $('.ForNon-pnrLoad').append($('.pnr_pickup'));

        if (localStorage["mobileNum"] != "undefined") {
            $("#mb_number").val(localStorage["mobileNum"]);
        }
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Bac_departurepageLoad");
        //departure_Ads();

        // var TopBanner = document.createElement("img");
        // TopBanner.setAttribute("src", "img/ads/top_banner.jpg")
        // document.getElementById("top_banner").appendChild(TopBanner)

        // var BottomBanner = document.createElement("img");
        // BottomBanner.setAttribute("src", "img/ads/bottom_banner.png")
        // document.getElementById("bottom_banner").appendChild(BottomBanner)

        // $("#top_banner").css("margin-bottom", "2%;");
    }

    function CheckBooking(bookingId) {
        let urlv = "https://prodapi.mojoboxx.com/spicescreen/webapi/getCabdetailsByPNR?pnr=" + bookingId;
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
                        $("#status5").css("display", "none")
                        $("#statusOutstation").css("display", "none")
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
                console.log("Booking check API not working")
            }
        });
    }

    $("#makeSerIconI").click(function () {

        if (document.getElementById("mb_number").value.length == 0) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#pac-input").val("");
            return;
        }
        if ($("#cabPickupCity").val() == "Select  City") {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Select City")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            $("#pac-input").val("");
            return;
        }


        if ($("#makeSerIconI").hasClass("fa-map-marker-alt")) {
            $("#makeSerIconI").removeClass("fa-times");
            $("#makeSerIconI").addClass("fa fa-spinner");
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "null", "null", "null", "null", "NULL", "NULL", "NON-PNRCurrentLocation_click");
            getLocation();
        }
        if ($("#makeSerIconI").hasClass("fa-times")) {
            $("#makeSerIconI").removeClass("fa-times");
            $("#makeSerIconI").removeClass("fa fa-spinner");
            $("#makeSerIconI").addClass("fa-map-marker-alt");
            $("#addressBox").css("height", "230px");
            $("#pac-input").val("");
            $("#ndl1").html("");
            $(".my-button").on("click");
            $(".my-button").removeAttr("disabled", "true");
            $(".my-button").text("Submit");
            initAutocomplete();
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
        SourceCity = locality;

        if (state == "AN") {
            stateforinvoice = "Andaman and Nicobar Islands";
        }
        else if (state == "AP") {
            stateforinvoice = "Andhra Pradesh";
        }
        else if (state == "AR") {
            stateforinvoice = "Arunachal Pradesh";
        }
        else if (state == "AS") {
            stateforinvoice = "Assam";
        }
        else if (state == "BR") {
            stateforinvoice = "Bihar";
        }
        else if (state == "CH") {
            stateforinvoice = "Chandigarh";
        }
        else if (state == "CT") {
            stateforinvoice = "Chhattisgarh";
        }
        else if (state == "DN") {
            stateforinvoice = "Dadra and Nagar Haveli";
        }
        else if (state == "DD") {
            stateforinvoice = "Daman and Diu";
        }
        else if (state == "DL") {
            stateforinvoice = "Delhi";
        }
        else if (state == "GA") {
            stateforinvoice = "Goa";
        }
        else if (state == "GJ") {
            stateforinvoice = "Gujarat";
        }
        else if (state == "HR") {
            stateforinvoice = "Haryana";
        }
        else if (state == "HP") {
            stateforinvoice = "Himachal Pradesh";
        }
        else if (state == "JK") {
            stateforinvoice = "Jammu and Kashmir";
        }
        else if (state == "JH") {
            stateforinvoice = "Jharkhand";
        }
        else if (state == "KA") {
            stateforinvoice = "Karnataka";
        }
        else if (state == "KL") {
            stateforinvoice = "Kerala";
        }
        else if (state == "LD") {
            stateforinvoice = "Lakshadweep";
        }
        else if (state == "MP") {
            stateforinvoice = "Madhya Pradesh";
        }
        else if (state == "MH") {
            stateforinvoice = "Maharashtra";
        }
        else if (state == "MN") {
            stateforinvoice = "Manipur";
        }
        else if (state == "ML") {
            stateforinvoice = "Meghalaya";
        }
        else if (state == "MZ") {
            stateforinvoice = "Mizoram";
        }
        else if (state == "NL") {
            stateforinvoice = "Nagaland";
        }
        else if (state == "OR") {
            stateforinvoice = "Odisha";
        }
        else if (state == "PY") {
            stateforinvoice = "Puducherry";
        }
        else if (state == "PB") {
            stateforinvoice = "Punjab";
        }
        else if (state == "RJ") {
            stateforinvoice = "Rajasthan";
        }
        else if (state == "SK") {
            stateforinvoice = "Sikkim";
        }
        else if (state == "TN") {
            stateforinvoice = "Tamil Nadu";
        }
        else if (state == "TG") {
            stateforinvoice = "Telangana";
        }
        else if (state == "TR") {
            stateforinvoice = "Tripura";
        }
        else if (state == "UP") {
            stateforinvoice = "Uttar Pradesh";
        }
        else if (state == "UT") {
            stateforinvoice = "Uttarakhand";
        }
        else if (state == "WB") {
            stateforinvoice = "West Bengal";
        }

        // alert(stateforinvoice)
    }

    async function loadMojoMultiplier(CityCode) {
         const multiplier = await fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + moment().hour()+ "&travel_type=departure")
        //  const multiplier = await fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + moment().hour() + "&travel_type=departure")
        const multiResponse = await multiplier.json()
        localStorage.setItem('multiResponseData', JSON.stringify(multiResponse))
        // console.log(multiResponseData)  
    }

    async function multiplierFun(partner_Name) {
        // console.log(partner_Name);
        var multiResponseData = JSON.parse(localStorage['multiResponseData'])
          MultiplierAmount = 0;
        if (multiResponseData.data.length > 0) {
            multiResponseData.data.every(element => {
                // console.log(element.partner)
                // console.log(partner_Name)
                    if (element.partner.toLowerCase() == partner_Name.toLowerCase()) {
                        MultiplierAmount = element.amount;
                        console.log(MultiplierAmount);
                        return false;
                        
                    } else {
                        MultiplierAmount = 0;
                        console.log(MultiplierAmount);
                        return true;
                    }
                    console.log(MultiplierAmount)
            });
        }
    }

    async function lastDetails() {

        // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
        //     localStorage.setItem("partnercabType", "sedan");
        //     $(".titleLeft").each(function () {
        //         $(".titleLeft img").removeClass("active_cab");
        //     });
        //     $(".sedan img").addClass("active_cab");
        //     await bookSignatureCab('sedan');
        //     return false
        // }

        document.getElementById("loader").style.display = "block";

        localStorage.removeItem("LoadTIMEUI")
        var cab_response = [];
        // const departure = await fetch("http://bookpreprod.mojoboxx.com//preprod/webapi/getCabPartnerData");
        const departure = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getCabPartnerData?city=" + DepAirportName + "&category=" + BookingTrip_Type)
        // const departure = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/getCabPartnerDataRR?type=AC&city="+cityCODE);
        const cab_res = await departure.json();
        for (let i in cab_res) {
            if (cab_res[i].platform.toLowerCase() != "host") {
                if (ShowSelfDrive == "yes") {
                    if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
                        cab_response.push(cab_res[i]);
                        document.getElementById("loader").style.display = "none";

                    }
                } else {
                    if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
                        if (cab_res[i].is_departure == "1") {
                            cab_response.push(cab_res[i]);
                            document.getElementById("loader").style.display = "none";
                        }
                    }
                }
            }
        }
        // console.log(cab_response);
        localStorage.setItem("cab_response", JSON.stringify(cab_response));
        // localStorage.setItem("URLimg", JSON.stringify(cab_response[0].URL))
        if (ShowSelfDrive == "yes") {
            localStorage.setItem("partnercabType", "suv");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
            await partnerSlider(cab_response, "suv", DepAirportName, TripType);
        } else {
            localStorage.setItem("partnercabType", "sedan");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".sedan img").addClass("active_cab");
            $(".coming_soon").css("display", "block");
            await partnerSlider(cab_response, "sedan", DepAirportName, TripType);
        }
    }


    ///////////////////// Signature cab code start ////////////////////////////////////////
    var MojofareCalculate;
    async function bookSignatureCab(cabTypeName) {
        localStorage["partnerName"] = 'signature'

        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";

        let swiperSlide = document.createElement("div");
        swiperSlide.setAttribute("class", "swiper-slide")
        // swiperSlide.setAttribute("id","sj"+timestamp);

        let partner_card = document.createElement("div");
        partner_card.setAttribute("class", "cab_mid");
        partner_card.setAttribute("id", "signature");

        //............................................................................................................//
        let partner_cardImg = document.createElement("img");
        if (cabTypeName.toLowerCase() == "hatchback") {
            partner_cardImg.setAttribute("src", "img/mini 1-nov.png");
        }
        else if (cabTypeName.toLowerCase() == "sedan") {
            partner_cardImg.setAttribute("src", "img/sedann-1-nov.png");
        }
        else if (cabTypeName.toLowerCase() == "suv") {
            partner_cardImg.setAttribute("src", "img/suv 1-nov.png");
        }
        partner_card.appendChild(partner_cardImg);

        swiperSlide.appendChild(partner_card);
        document.getElementById("swiper-wrapper").appendChild(swiperSlide);

        var footerDiv = document.createElement("div");
        footerDiv.setAttribute("class", "bottomDiv");

        var fare = document.createElement("div");
        fare.setAttribute("id", "fare")
        var Fare_para = document.createElement("span")
        Fare_para.innerHTML = ""
        var Fare_para2 = document.createElement("span")
        Fare_para2.setAttribute("id", "prsignature");
        Fare_para2.innerHTML = "RS. --";

        fare.appendChild(Fare_para);
        fare.appendChild(Fare_para2);
        footerDiv.appendChild(fare);

        partner_card.appendChild(footerDiv);

        var distPara = document.createElement("p");
        distPara.setAttribute("id", "distPara")
        distPara.innerHTML = "Estimated Distance"
        partner_card.appendChild(distPara);
        var distance = document.createElement("div");
        distance.setAttribute("id", "dist")

        var para2 = document.createElement("span")
        para2.setAttribute("id", "kmsignature");
        para2.innerHTML = KMVal + "s";
        distance.appendChild(para2);

        partner_card.appendChild(distance);
        $(".bookBtn").css("display", "flex")
        $('#paymentoptions').css("display", "block")
        $("#radioBox1").css("display", "flex")
        MojofareCalculate = await loadFareFromMojoboxx('signature', 'DEL', KMNum, cabTypeName);
        // console.log(MojofareCalculate)
        $("#fare").css("float", "right");
        document.getElementById('prsignature').innerHTML = "Rs. " + MojofareCalculate

        document.getElementById("PayNow").innerHTML = " ₹ " + MojofareCalculate
        document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojofareCalculate) + Number(100))
    }

    ///////////////////// Signature cab code end ////////////////////////////////////////

    // ////////////////// Create Partner Card UI code start /////////////////////////////
    var scv = [];
    var cabFare = [];
    var MojoFare = [];
    var cab_Type = [];
    var cab_Type2 = [];
    async function partnerSlider(cab_response, cabTypeName, cityType, cabCategory) {
        MojoFare = [];
        localStorage.removeItem('MojoboxxFare')
        var Comingsoon = 'show';
        scv = [];
        $(".coming_soon").css("display", "none");
        await loadMojoMultiplier(DepAirportName)
        var swiper = "";
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        let one = 0;
        MojoFare.length = 0;
        // scv.length = 0;
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
                    cab_Type = cab_response[i].cab_type.split(",");
                    // console.log(cab_Type);
                    let clc = 0;
                    if (cab_Type.length == 1) {
                        clc = 1;
                    } else {
                        clc = cab_Type.length;
                    }

                    var cab_Image;

                    // Create another dynamic html for self drive
                    if (ShowSelfDrive == "yes") {
                        cab_Image = cab_response[i].cab_type_image.split(",");
                        for (let j = 0; j < clc; j++) {
                            if (cab_response[i].cc.includes(cabCategory)) {
                                if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                                    cab_Type2 = cabTypeName
                                    one = 1;
                                    $(".coming_soon").css("display", "none");
                                    let swiperSlide = document.createElement("div");
                                    swiperSlide.setAttribute("class", "swiper-slide")
                                    let partner_card = document.createElement("div");
                                    partner_card.setAttribute("class", "cab_mid");
                                    partner_card.setAttribute("id", cab_response[i].partner_name);
                                    let partner_cardImg = document.createElement("img");
                                    partner_cardImg.setAttribute("src", cab_response[i].cab_type_image);
                                    partner_card.appendChild(partner_cardImg);
                                    scv.push(cab_response[i].partner_name);
                                    localStorage.setItem("partnerName", scv[0]);
                                    swiperSlide.appendChild(partner_card);
                                    document.getElementById("swiper-wrapper").appendChild(swiperSlide);
                                    $("#notePoint").css("display", "block")

                                    $(".auto_btn").addClass("btn_enable");
                                    $("#continue").removeAttr('disabled');
                                    $("#continue").css("color", "white");
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
                    } else {
                        cab_Image = cab_response[i].partner_image.split(",");
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

                                //............................................................................................................//
                                if (cab_response[i].farecard_type == 'mojofare') {
                                    $('#Loading_Img').css('display', 'none')
                                    partner_card.setAttribute("class", "cab_mid fare_cardSize");
                                    let partner_cardImg = document.createElement("img");
                                    partner_cardImg.setAttribute("src", cab_Image[j]);
                                    partner_card.appendChild(partner_cardImg);

                                    swiperSlide.appendChild(partner_card);
                                    document.getElementById("swiper-wrapper").appendChild(swiperSlide);
                                }
                                else {
                                    $('#Loading_Img').css('display', 'none')
                                    let partner_cardImg = document.createElement("img");
                                    if (cab_Type[j].toLowerCase() == "hatchback") {
                                        partner_cardImg.setAttribute("src", "img/mini 1-nov.png");
                                    }
                                    else if (cab_Type[j].toLowerCase() == "sedan") {
                                        partner_cardImg.setAttribute("src", "img/sedann-1-nov.png");
                                    }
                                    else if (cab_Type[j].toLowerCase() == "suv") {
                                        partner_cardImg.setAttribute("src", "img/suv 1-nov.png");
                                    }
                                    partner_card.appendChild(partner_cardImg);

                                    swiperSlide.appendChild(partner_card);
                                    document.getElementById("swiper-wrapper").appendChild(swiperSlide);

                                    var topheading = document.createElement("div");
                                    topheading.setAttribute("class", "partner_title")
                                    var textTitle = document.createElement("p");
                                    textTitle.setAttribute("class", "title_text")
                                    var textMode = document.createTextNode("Powered By")
                                    topheading.appendChild(textTitle)
                                    textTitle.appendChild(textMode)
                                    partner_card.appendChild(topheading)
                                    //logoImg.setAttribute("class","logoImg")

                                    var LogoDiv = document.createElement("div");
                                    LogoDiv.setAttribute("class", "Partner_Logo")
                                    var logoImg = document.createElement("img");
                                    logoImg.setAttribute("class", "logoImg")
                                    logoImg.setAttribute("src", cab_response[i].partner_image_arrival)
                                    LogoDiv.appendChild(logoImg);
                                    partner_card.appendChild(LogoDiv)

                                }

                                scv.push(cab_response[i].partner_name);
                                await myFunction(scv[0])
                                localStorage.setItem("partnerName", scv[0]);

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
                                if(cab_response[i].farecard_type == 'mojofare'){
                                    fare.setAttribute("class", "farePricetext")
                                }
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
                                if (cab_response[i].partner_name == "SAVAARI") {
                                    includeLine.innerHTML = "Inc. of airport tolls and taxes"
                                } else if(cab_response[i].farecard_type == 'mojofare'){
                                    includeLine.innerHTML = ""
                                }else {
                                    includeLine.innerHTML = "Exc. of airport tolls and taxes"
                                } footerDiv.appendChild(includeLine);
                                partner_card.appendChild(footerDiv);

                                var distPara = document.createElement("p");
                                distPara.setAttribute("id", "distPara")
                                if(cab_response[i].farecard_type == 'mojofare'){
                                    distPara.setAttribute("class", "distpara1")
                                }
                                distPara.innerHTML = "Estimated Distance"
                                partner_card.appendChild(distPara);
                                var distance = document.createElement("div");
                                distance.setAttribute("id", "dist")
                                if(cab_response[i].farecard_type == 'mojofare'){
                                    distance.setAttribute("class", "distKm ")
                                   

                                }

                                var para2 = document.createElement("span")
                                para2.setAttribute("id", "km" + cab_response[i].partner_name);
                                para2.innerHTML = "--- Km";
                                distance.appendChild(para2);

                                partner_card.appendChild(distance);
                                localStorage.removeItem("finalFare" + cab_response[i].partner_name);
                                localStorage.removeItem("MojoFare" + cab_response[i].partner_name);
                                await multiplierFun(cab_response[i].partner_name)

                                if (cab_city[jk] == "DXB") {
                                    $(".perdiscount").css("display", "none")
                                    $("#discount").css("display", "none")
                                    await getOptiondubai(cab_response[i].partner_name);
                                } else {
                                    document.getElementById("km" + cab_response[i].partner_name).innerHTML = KMVal + "s";
                                    if (cab_response[i].farecard_type == 'mojofare') {
                                        let FixfareCardDetails = await loadPartnerData();
                                        console.log(MojopartnerReset);
                                        let MojofareCalculate = await loadFareFromMojoboxx(cab_response[i].partner_name, cab_city[jk], KMNum, cab_Type[j].toLowerCase());
                                        MojoFare.push(localStorage["MojoFare" + cab_response[i].partner_name]);
                                        // console.log(MojoFare)
                                        localStorage.setItem("MojoboxxFare", MojoFare[0]);
                                    }
                                    else {
                                        let fareCalculate = await calculatePricePartnerWise(cab_response[i].partner_name, KMNum, cab_Type[j], cab_city[jk]);
                                        cabFare.push(localStorage["finalFare" + cab_response[i].partner_name]);
                                        localStorage.setItem("partnerFare", cabFare[0]);
                                    }
                                }
                                $(".auto_btn").addClass("btn_enable");
                                $("#continue").removeAttr('disabled');
                                $("#continue").css("color", "white");

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

            if (Comingsoon == "notshow" && one == 1) {
                $(".coming_soon").css("display", "none");
                $(".auto_btn").css("display", "block");
                $("#cab_select").css("display", "block");
            } else if (Comingsoon == "show") {
                $(".coming_soon").css("display", "block");
                $(".auto_btn").css("display", "none");
                $("#cab_select").css("display", "none");
            }
            // console.log(scv[0])

            if (ShowSelfDrive != "yes") {
                if ((scv[0] == "QUICKRIDE") || (scv[0] == "BLUSMART") || (scv[0] == "MERU") || (scv[0] == "SAVAARI") || (scv[0] == "MEGA") || (scv[0] == "GOZO CABS")) {
                    // $(".auto_btn").css("display", "none");
                    // $("#ConfirmButton").css("display", "none")
                    $(".bookBtn").css("display", "flex")
                    // $('.agreeBox').css('margin-bottom', '20%')
                    $('#paymentoptions').css("display", "block")

                    $("#ConfirmButton").css("display", "none")
             
                    if (cab_response[i].farecard_type != 'mojofare') {
                        if (cabFare[0] == "undefined" || cabFare[0] == undefined || cabFare[0] == null) {
                            $("#ConfirmButton").css("display", "none")
                            $(".bookBtn").css("display", "none")
                            $('#paymentoptions').css("display", "none")
                            // $('.agreeBox').css('margin-bottom','20%')
                        }
                        // else {
                        //     document.getElementById("fullpay").innerHTML = " ₹ " + cabFare[0]
                        // }
                    }
                }

                else {
                    // $('.agreeBox').css('margin-bottom', '0%')
                    $('.coupon_block').css('margin-top', '15%')
                    $('#paymentoptions').css("display", "none")
                    $("#radioBox1").css("display", "none")
                    $(".auto_btn").css("display", "block");
                    $(".bookBtn").css("display", "none")
                    $("#ConfirmButton").css("display", "block")
                    $("#part").prop("checked", true)

                }
                if (cab_response[i].farecard_type == 'mojofare') {
                    $("#part").prop("checked", true);
                    $("#PayByCash").css("display", "none")
                    $("#PayBypaytm").css("display", "block")
                    $("#radioBox1").css("display", "flex")
                    document.getElementById("radioBox2").style.display = "none";
                    document.getElementById("PayNow").innerHTML = " ₹ " + MojoFare[0]
                    document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojoFare[0]) + Number(100))
                    // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojoFare[0]))
                }
                else {
                    $("#radioBox1").css("display", "flex")
                    $("#radioBox2").css("display", "flex")
                    document.getElementById("PayNow").innerHTML = " ₹ " + cabFare[0]
                    document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[0]) + Number(100))
                    // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[0]))
                }
            }

        }

    }

    ///////////////////// Payment option on changes//////////////////////
    $('input[type=radio][name=paymentoption]').change(function () {
        if (this.value == 'PayLater') {
            $("#PayByCash").css("display", "block")
            $("#PayBypaytm").css("display", "none")

            $(".infoPara").empty()
            $(".referPara i").css("display", "block")
            $(".important").css("display", "block")
            $(".infoPara").append(`To receive cab driver details, Pay via the online payment link received on whatsapp after booking confirmation within 60 mins before the pickup time.`)
            $(".referMain").css("display", "block");
            $(".referBlock").css("display", "block");

        } else if (this.value == 'PayNow') {
            $("#PayBypaytm").css("display", "block")
            $("#PayByCash").css("display", "none")

        }
    });

    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        onSelect: function (dateText) {

            Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")

            if ($(".timepicker").val() == "Pick up Time") {
                $("#myForm").css("display", "block");
                $("#time-list-wrap").css("display", "block");
                $(".done_btn").css("display", "none");
                $("#slotdiv").css("display", "block");

                var CardInterval = setInterval(function () {
                    console.log($(".timepicker").val())
                    localStorage.setItem("LoadTIMEUI", true);
                    if ($(".timepicker").val() != "Pick up Time") {
                        clearInterval(CardInterval)
                        lastDetails();
                    }
                }, 1000)
            }
            else if ($(".timepicker").val() != "Pick up Time") {
                lastDetails()
            }
            updateTime();
        }
    });

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
                let MojoboxxFareslide = MojoFare[swiper.activeIndex]

                // let currentSliderType = cabTypeName[swiper.activeIndex];
                // console.log(currentSliderFare)
                localStorage.setItem("partnerName", currentSliderValue);
                localStorage.setItem("partnerFare", currentSliderFare);
                localStorage.setItem("MojoboxxFare", MojoboxxFareslide);

                localStorage.setItem("partnercabType", cab_Type2);
                await myFunction(currentSliderValue)

                if (ShowSelfDrive != "yes") {
                    if ((currentSliderValue == "QUICKRIDE") || (currentSliderValue == "BLUSMART") || (currentSliderValue == "MERU") || (currentSliderValue == "SAVAARI") || (currentSliderValue == "MEGA") || (currentSliderValue == "GOZO CABS")) {
                        // $("#ConfirmButton").css("display", "none")
                        $(".bookBtn").css("display", "block")
                        // $('.agreeBox').css('margin-bottom', '20%')
                        $('#paymentoptions').css("display", "block")

                        // $('#PayBypaytm').css("display", "none")
                        $('.coupon_block').css('margin-top', '3%')
                        $("#radioBox1").css("display", "flex")
                        $("#radioBox2").css("display", "flex")

                        $("#ConfirmButton").css("display", "none")

                        // if((localStorage.getItem("Pictime").split(":")[0] >=0 )&&(localStorage.getItem("Pictime").split(":")[0] <8 )){
                        //     $('#radioBox2').css("display", "none")  
                        // }

                        // $('#PayByCash').css("display", "block")

                        // document.getElementById("partpay").innerHTML = " ₹ " + "249";
                        // if(($(".timepicker").val().substring(0,2) <= "05") && ($(".timepicker").val().substring(6,8) == "AM") || ($(".timepicker").val().substring(0,2) == "12") && ($(".timepicker").val().substring(6,8) == "AM")){
                        //     document.getElementById("radioBox1").style.display = "none";
                        // }
                        // else{
                        // if(currentSliderValue == "MERU"){
                        //     $("#radioBox1").css("display","none")
                        //      $("#full").prop("checked", true)

                        //  }else{
                        //     $("#radioBox1").css("display","block")
                        // }
                        // $("#radioBox1").css("display","block")
                        // }

                    }
                    else {
                        $("#ConfirmButton").css("display", "block")
                        $(".bookBtn").css("display", "none")
                        $("#radioBox1").css("display", "none")
                        // $('.agreeBox').css('margin-bottom', '0px')
                        $('.coupon_block').css('margin-top', '15%')
                        $('#paymentoptions').css("display", "none")
                        // document.getElementById("partpay").innerHTML = " ₹ " + "...";
                    }

                    document.getElementById("PayNow").innerHTML = " ₹ " + cabFare[swiper.activeIndex]
                    // document.getElementById("PayLater").innerHTML = " ₹ " + cabFare[swiper.activeIndex]
                    document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[swiper.activeIndex]) + Number(100))

                    if (currentSliderFare == "undefined" || currentSliderFare == undefined || currentSliderFare == null) {
                        $("#ConfirmButton").css("display", "none")
                        $(".bookBtn").css("display", "none")
                        $('#paymentoptions').css("display", "none")
                        // $('.agreeBox').css('margin-bottom','20%')
                    }
                }
            }
        }
    });



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
            }
            else if (partnerName == "MEGA") {
                $("#prMEGA").html("Please wait..")
                $("#prMEGA").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let megaResp = await GetFareFromMega(cabTyp);
                resolve(true);
            }
            else if (partnerName == "MERU") {
                // alert()
                $("#prMERU").html("Please wait..")
                $("#prMERU").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let MeruResp = await GetFarefromMeru(cabTyp);
                resolve(true);
            }
            else if (partnerName == "BUDDY CABS") {
                $("#prBUDDY CABS").html("Please wait..")
                $("#prBUDDY CABS").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let BuddyFare = await GetFarefromPartnerBuddy(cabTyp);
                resolve(true);
            } else if (partnerName == "GOZO CABS") {
                let gozofare = await GetFareFromGozoPartner(cabTyp)
                resolve(true);
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
            }
            else if (partnerName == "BLUSMART") {
                $("#pr2BLUSMART").css("display", "none");
                $("#prBLUSMART").html("Please wait..");
                $("#prBLUSMART").css("font-size", "12px");
                $("#fare").css("width", "100%");
                let BLUMSMARTfare = await checkFareBlusmart(cabTyp);
                resolve(true);
            }
            else {
                await loadCityName(cityName)
                $(".bookBtn").css("display", "none")
                var fareData = await loadFareFormDB(partnerName, cityNameFetch, distanceP, cabTyp.toLowerCase());
                resolve(fareData);
            } resolve(true)
        })
    }



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

    $(window).click(function (e) { // e.preventDefault();
        $(".autocomplete-results").css("display", "none");
    })

    // //////////////////// Submit Page form data code start ///////////////////////
    document.getElementById("ctn").onsubmit = function (e) {
        e.preventDefault();
        BookMycab('CASH')
    }
    document.getElementById("PayByCash").onclick = function () {
        BookMycab('CASH')
    }

    // document.getElementById("PayByrazorpay").onclick = function () {
    //     if (document.getElementById("part").checked) {
    //         // BookMycab('RAZORPAY',"part")
    //         BookMycab('PAYTM', "part")
    //     }
    //     else if (document.getElementById("full").checked) {
    //         // BookMycab('RAZORPAY',"full")
    //         BookMycab('PAYTM', "full")
    //     }
    // }

    // document.getElementById("PayBypaytm").onclick = function () {
    //     BookMycab('RAZORPAY',"full")
    // }

    let paymthd1;
    let paymthd2;

    fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/bookAirportCredentialsInfo").then((res)=>res.json())
        .then((d)=>{
            let x = d.data;
            for(let i of x){
                // console.log(i)
                if(i.type == "PAYTM_MID"){
                    localStorage.setItem("PayMID",i.merchant_id)
                }
                if((i.type == "BAC_PAYMENT") && (i.website_url == "BAC")){

                    if(i.Total_btn == 1){
                        $(".border_gap").css("display", "none");
                        document.getElementsByClassName('upi_btn')[0].style.display = "block";
                        $("#dblbtn").css("display", "none");
                        $("#singlebtn").css("display", "block");
                        paymthd1 = i.Pay_btn1;
                    }
                    else if(i.Total_btn == 2){
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
        BookMycab(paymthd2, "full")
        // getpaymethod();
    }
    document.getElementsByClassName('upi_btn')[0].onclick = function () {
        // BookMycab('PAYTM', "full")
        BookMycab(paymthd1, "full")
        // getpaymethod();
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
            if (source_city != "Dubai") {
                if ($("#pac-input").val() == "" || $("#pac-input").val() == undefined || $("#pac-input").val() == "undefined") {
                    $("#cmmsg").html("Please Enter your location ");
                    $(".thank_msg i").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    return false
                }
            }
            if (source_city == "Dubai") {
                if ($("#dubai").val() == "") {
                    $("#cmmsg").html("Please Enter your location ");
                    $(".thank_msg i").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    return false
                }
            }
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
            // if (localStorage["partnerName"] == "MERU") {
            //     var travelTime = moment().add(60, 'minutes').format("YYYY-MM-DD HH:mm");
            //     if (dateValue < travelTime) {
            //         $(".thank_msg").empty()
            //         $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 1 hours later than current time.");
            //         $(".thank_msg i").removeClass("fa-check-circle");
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         $("#continue").val("Confirm Pickup");
            //         return false;
            //     }
            // }
            // if (localStorage["partnerName"] == "MEGA") {
            //     var travelTime = moment().add(120, 'minutes').format("YYYY-MM-DD HH:mm");
            //     if (dateValue < travelTime) {
            //         $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 2 hours later than current time.");
            //         $(".thank_msg i").removeClass("fa-check-circle");
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         $("#continue").val("Confirm Pickup");
            //         return false;
            //     }
            // }
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

            var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];
            if (source_city != "Dubai") {
                var price = String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"];
                // var price = "1";
                var total_km = KMVal.split(" ");
                totalkm = Math.round(total_km[0]);
                localStorage.setItem("kilometer", totalkm)
            }

            $("#continue").val("Please wait..")

            localStorage.setItem("mobileNum", $("#mb_number").val())
            sessionStorage.setItem("MobileNum", $("#mb_number").val())

            var FarePrice;

            if (source_city.toLowerCase() == "dubai") {
                FarePrice = String(dubaiFare).split(" ")[1]
            }
            else if ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) {
                if((localStorage["selectedCab"] == "To N Fro") || (localStorage["selectedCab"] == "BUDDY CABS")){
                    FarePrice = price;
                }
                else{
                    FarePrice = PAYMENT_TYPE == "CASH" ? (Number(price) + Number(100)) : price;
                }
            }
            else {
                localStorage["MojoboxxFare"] = (PAYMENT_TYPE == "CASH") ? (Number(localStorage["MojoboxxFare"]) + Number(100)) : localStorage["MojoboxxFare"];
                localStorage["ptnr"] = ''
                FarePrice = "0"
            }

            if (localStorage["ptnr"] == "QUICKRIDE") //// To check quickride fixfareid random issue
            {
                if (quickrideFareId.toLowerCase().includes(localStorage["partnercabType"].trim().toLowerCase())) {
                    console.log("id correct")
                }
                else {
                    QuickrideFareResponse.forEach((value) => {
                        value.vehicleClass.toLowerCase() == localStorage["partnercabType"].trim().toLowerCase() ? quickrideFareId = value.fixedFareId : quickrideFareId = quickrideFareId
                    })
                }
            }

            // /////////////////// Load data to create JSON for cab booking code end ////////////////////////
            dataJ = {
                "clubMember": [
                    {
                        "type": "cabForm",
                        "name_title": '',
                        "user_name": "Customer",
                        "last_name": "Customer",
                        "mobile": $("#mb_number").val(),
                        "email": "hello@mojoboxx.com",
                        "time": Date.now(),
                        "sendLeadSms": "true",
                        "partnerName": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["ptnr"].trim() : (localStorage["partnercabType"].trim() == 'suv') ? 'QUICKRIDE' : MojoPartnerName,
                        "title": localStorage["ptnr"].trim(),
                        "category": "CAB",
                        "drop_location": $("#cabPickupTerminal :selected").text().trim(),
                        "pickup_time": pickup_time,
                        "cab_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["partnercabType"].trim() : (localStorage["partnercabType"].trim() == 'hatchback') ? 'sedan' : localStorage["partnercabType"].trim(),
                        "cab_id": localStorage["ptnr"] == "GOZO CABS" ? GOZOFareId : 0,
                        "fare_price": localStorage["ptnr"] == "signature" ? MojofareCalculate : FarePrice,
                        "total_kilometers": source_city.toLowerCase() == "dubai" ? parseInt(dubaiDistance) : totalkm,
                        "terminalCode": cityCODE.trim() == "DEL" ? $("#cabPickupTerminal :selected").text().trim().split("-")[1] : TerminalCode,
                        "msgUniqueId": getRandom(10),
                        "from_city": cityCODE.trim(),
                        "to_city": cityCODE.trim(),
                        "source": source_city.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100).trim(),
                        "destination": $("#cabPickupTerminal :selected").text().trim(),
                        "latitude": source_city.toLowerCase() == "dubai" ? dubaiLat : pickup_lat,
                        "longitude": source_city.toLowerCase() == "dubai" ? dubaiLong : pickup_long,
                        "isDeparture": 1,
                        "pnr": localStorage["booking_id"],
                        "source_city": source_city.toLowerCase() == "dubai" ? "Dubai" : SourceCity.trim(),
                        "source_latitude": source_city.toLowerCase() == "dubai" ? dubaiLat : pickup_lat,
                        "source_longitude": source_city.toLowerCase() == "dubai" ? dubaiLong : pickup_long,
                        "source_name": source_city.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100),
                        "destination_city": source_city.trim(),
                        "destination_latitude": source_latitude,
                        "destination_longitude": source_longitude,
                        "destination_name": $("#cabPickupTerminal :selected").text().trim(),
                        "status": "CAB",
                        "card_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? '' : 'mojoFixFare',
                        "content_id": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? '' : localStorage["MojoboxxFare"],
                        "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                        "fixedFareId": localStorage["ptnr"] == "QUICKRIDE" ? quickrideFareId : localStorage["ptnr"] == "MERU" ? localStorage["meruSearchId"] : localStorage["ptnr"] == "MEGA" ? localStorage["megaSearchId"] : "",
                        "patner_bookings": "bookairport website",
                        "mojoPartner": "AirIndia",
                        "carID": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.carID : '',
                        "token": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.token : '',
                        "website_url": "airindia_Departure_url",
                        "user_agent": localStorage["userAgent"],
                        "pay_type": 'post',
                        'paymentMethod': 'PAYBYCASH',
                        "service_charge": ((localStorage["ptnr"] == "QUICKRIDE") || (localStorage["ptnr"] == "GOZO CABS") || (localStorage["ptnr"] == "BLUSMART") || (localStorage["ptnr"] == "MERU") || (localStorage["ptnr"] == "SAVAARI") || (localStorage["ptnr"] == "MEGA")) ? MultiplierAmount : 0,
                        "state": stateforinvoice,
                        "order_reference_number":"BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
                        // "order_reference_number": localStorage["ptnr"] == "GOAMILES"?GoamilesBookingId:'',
                        // "payment_link": localStorage["ptnr"] == "GOAMILES"?GoamilePaymentLink:''
                    }
                ]
            };
        }
        // console.log(dataJ);
        localStorage.setItem("departurebookingData", JSON.stringify(dataJ));

        // $("#mainDetails").css('display', 'block')
        // $('#popup_card').empty()
        console.log(dataJ);

        // if (dataJ.clubMember[0]['cab_type'].toLowerCase() == "hatchback") {
        //     $('#popup_card').append("<img src='img/mini 1-nov.png' />")
        // }
        // else if (dataJ.clubMember[0]['cab_type'].toLowerCase() == "sedan") {
        //     $('#popup_card').append("<img src='img/sedann-1-nov.png' />")
        // }
        // else if (dataJ.clubMember[0]['cab_type'].toLowerCase() == "suv") {
        //     $('#popup_card').append("<img src='img/suv 1-nov.png' />")
        // } else {
        //     $('#popup_card').append("<img src='img/mini 1-nov.png' />")
        // }

        // $('#price_km').text(KMVal)
        // $('#price_fare').text(" ₹ " + dataJ.clubMember[0]['fare_price'])
        // let x = dataJ.clubMember[0]['pickup_time'].split(" ")[0];
        // let d = new Date(x)
        // console.log(d)
        // // console.log(d.getDate())

        // const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // // let name = month[d.getMonth()]


        // $('#pickup_date').text(d.getDate() + month[d.getMonth()] + ", " + $(".timepicker").val())
        // // $('#pickup_date').text(dataJ.clubMember[0]['pickup_time'])
        // $('#user_num').text(dataJ.clubMember[0]['mobile'])
        // $('#source_').text(dataJ.clubMember[0]['destination'])
        // if (dataJ.clubMember[0]['source'].length > 76) {
        //     $('#destination_').text(dataJ.clubMember[0]['source'].substring(0, 76))
        // }
        // else {
        //     $('#destination_').text(dataJ.clubMember[0]['source'])
        // }
        // $('#cabtp').text(localStorage["partnercabType"].substring(0, 1).toUpperCase() + localStorage["partnercabType"].substring(1))

        // $('#doPayment').click(function () {
        fullDetails(PAYMENT_TYPE, paytp, price, dataJ)
        // })
        // $('.close_popup').click(function () {
        //     $('#mainDetails').css('display', 'none')
        //     $('.spinnerBack').css('display', 'none')
        //     $('.spinner').css('display', 'none')
        // })


    }
    // //////////////////// Submit Page form data code end ///////////////////////

    async function fullDetails(PAYMENT_TYPE, paytp, price, dataJ) {
        console.log(dataJ)
        if (PAYMENT_TYPE == "RAZORPAY" && paytp == "full") {

            await addPaymentType('RAZORPAY', '', '', 'full_pay', dataJ.clubMember[0].card_type == "mojoFixFare"?dataJ.clubMember[0].content_id:dataJ.clubMember[0].fare_price);
        }
        else if (PAYMENT_TYPE == "RAZORPAY" && paytp == "part") {
            await addPaymentType('RAZORPAY', '', '', 'partial_pay', dataJ.clubMember[0].card_type == "mojoFixFare"?dataJ.clubMember[0].content_id:dataJ.clubMember[0].far_price);
        }

        else if (PAYMENT_TYPE == "PAYTM" && paytp == "full") {
            await addPaymentType('PAYTM', '', '', 'full_pay', price);
        }
        else if (PAYMENT_TYPE == "PAYTM" && paytp == "part") {
            await addPaymentType('PAYTM', '', '', 'partial_pay', price);
        }

        else {
            $.ajax({
                type: 'POST',
                url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/cabRegistration',
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
                        console.log(dataJ.clubMember[0]['mobile']);
                        console.log(dataJ);
                        $("#continue").prop("disabled", true);
                        // $("#mainDetails").css('display', 'block')
                        location.href = "cab_confirm.html";
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                        // $('#pickup_date').text(dataJ.clubMember[0]['pickup_time'])
                        // $('#user_num').text(dataJ.clubMember[0]['mobile'])
                        // $('#source_').text(dataJ.clubMember[0]['destination'])
                        // $('#destination_').text(dataJ.clubMember[0]['source'])

                        // localStorage.setItem("departurenotify", localStorage["URLimg"]);
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

    async function checkBookingStatus() {
        return new Promise(async function (resolve, reject) {
            // const checkBook = await fetch('https://preprodapi.mojoboxx.com/preprod/webapi/checkUserBooking?mobile='+$("#mb_number").val()+"&today="+ moment(Date.now()).format("YYYY-MM-DD"))
            const checkBook = await fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/checkUserBooking?mobile=' + $("#mb_number").val() + "&today=" + moment(Date.now()).format("YYYY-MM-DD"))

            const bookResp = await checkBook.json()
            console.log(bookResp);
            resolve(bookResp)
        })
    }



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


    // ///////////////// Cab Img click code start ////////////////////////////
    $(".mini").click(async function () {
        if (OutstationShow == "no") {

            localStorage.setItem("partnercabType", "hatchback");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".mini img").addClass("active_cab");
            // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
            //     await bookSignatureCab('hatchback');
            //     return false
            // }
            // else {
            let cab_response = JSON.parse(localStorage["cab_response"]);
            await partnerSlider(cab_response, "hatchback", DepAirportName, TripType);
            // }
        }
    })

    $(".sedan").click(async function () {
        if (OutstationShow == "no") {
            localStorage.setItem("partnercabType", "sedan");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".sedan img").addClass("active_cab");
            // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
            //     await bookSignatureCab('sedan');
            //     return false
            // }
            // else {
            let cab_response = JSON.parse(localStorage["cab_response"]);
            await partnerSlider(cab_response, "sedan", DepAirportName, TripType);
            // }
        }
    })

    $(".suv").click(async function () {
        if (OutstationShow == "no") {
            localStorage.setItem("partnercabType", "suv");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });

            $(".suv img").addClass("active_cab");
            // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
            //     await bookSignatureCab('suv');
            //     return false
            // }
            // else {
            let cab_response = JSON.parse(localStorage["cab_response"]);
            await partnerSlider(cab_response, "suv", DepAirportName, TripType);
            // }
        }
    })
    // ///////////////// Cab Img click code end /////////////////////////////

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
        return new Promise(async function (resolve, reject) { // console.log('https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFare?partner=' + partnerName + '&city='+ cityName +'&km=' +distance +'&cab_type=' + cabType +'&trip_type=Departure')
            fetch('https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFare?partner=' + partnerName + '&city=' + cityName + '&km=' + distance + '&cab_type=' + cabType + '&trip_type=Departure', { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
                desP = json.data;
                // console.log(json)
                if (json.message != "Data not found") { // console.log(json);
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


    // ////////////////// Fetch Cab partner from Mojoboxx fixed fare code start //////////////////
    var MojopartnerReset = 0
    var MojoPartnerName;
    async function loadPartnerData(partnerName, cityName, distance, cabType) {
        return new Promise(async function (resolve, reject) {
            // fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojofixBookingCount', {
            fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/mojofixBookingCount', {
                method: 'GET'
            }).then(response => response.json())
                .then(json => {
                    if (json.data.length >= 1) {
                        // console.log(json);
                        let CountArr = [];
                        for (let k in json.data) {
                            if (json.data[k].travel_type == "departure" && (json.data[k].city == $('#cabPickupCity').find(":selected").val())) {
                                CountArr.push(json.data[k])
                            }
                            // console.log(CountArr)
                        }
                        console.log(CountArr)

                        for (let k in CountArr) {
                            let JSONLength = CountArr.length;
                            if ((CountArr[k].Bcount < CountArr[k].Tcount)) {
                                MojoPartnerName = CountArr[k].partner
                                console.log(MojoPartnerName)
                                resolve(true);
                                return false
                            }
                            else if ((CountArr[JSONLength - 1].Bcount == CountArr[JSONLength - 1].Tcount) || (CountArr[JSONLength - 1].Bcount > CountArr[JSONLength - 1].Tcount)) {
                                MojopartnerReset = 1
                                MojoPartnerName = CountArr[0].partner
                                console.log(CountArr[0].partner)
                                resolve(true);
                                return false
                            }
                        }
                    } else {
                        console.log("fare not found");
                        resolve(true)
                    }
                })
        })
    }
    // ////////////////// Fetch Cab partner from Mojoboxx fixed fare code end  //////////////////

    // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code start //////////////////
    async function loadFareFromMojoboxx(partnerName, cityName, distance, cabType) {
        var desP;
        var hypen_pos;
        var dis;
        var dis2;
        var amt;
        return new Promise(async function (resolve, reject) {
            // fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojoboxxfixfare?cab_type=' + cabType + '&km=' + distance + '&city_code=' + cityName + '&travel_type=departure' + '&isReset=' + MojopartnerReset, { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
            fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/mojoboxxfixfare?cab_type=' + cabType + '&km=' + distance + '&city_code=' + cityName + '&travel_type=departure' + '&isReset=' + MojopartnerReset, { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
                desP = json.data[0].Fare;
                localStorage.setItem("mojoboxxfixfarepartner", json.data[0].partner)
                console.log(json)
                if (json.message != "Data not found") { // console.log(json);
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
                    document.getElementById("pr" + partnerName).innerHTML = " ₹ " +(parseInt(hypen_pos) + parseInt(MultiplierAmount))
                    document.getElementById("pr2" + partnerName).innerHTML = "₹" + (
                        Number(hypen_pos) + Number(50) + Number(MultiplierAmount)
                    )
                    localStorage.setItem("MojoFare" + partnerName, parseInt(desP) + parseInt(MultiplierAmount));
                    resolve(desP);
                } else {
                    console.log("fare not found");
                    resolve(true)
                }
            })
        })
    }
    // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code end  //////////////////

    // //////////////////////// coop getfare code start ////////////////////////////
    async function coop_call(PartnercabType) {
        return new Promise(async (resolve, reject) => {
            var suratCity
            console.log(source_city.trim())
            if (source_city.trim() == "Hazira" || source_city.trim() == "Dumas" || source_city.trim() == "Rundh" || source_city.trim() == "Limla") {
                suratCity = "surat"
                console.log(suratCity, "check 1")

            } else {
                suratCity = source_city.trim()
                console.log(suratCity, "check 2")
            }
            const total_km = KMVal.split(" ");
            const totalkm = Math.round(total_km[0]);


            dataJ = {
                "total_distance": totalkm,
                "source_city": suratCity,
                "destination_city": source_city.trim(),
                "type_of_booking": "City"
            };
            console.log(dataJ);
            $.ajax({
                contentType: 'application/json',
                Accept: 'application/json',
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                data: JSON.stringify(dataJ),
                dataType: 'json',
                beforeSend: function () {
                    $(".my-button").text("Please wait ...");
                },

                success: function (res) {
                    console.log(res);
                    if (res.code == 200 && res.code != 101) { // console.log("eske andr")
                        var CoopResponse = res;
                        localStorage.setItem("CoopResponse", JSON.stringify(CoopResponse))
                        $("#coop_number").val(res.data.order_reference_number);
                        console.log(CoopResponse.data.price)
                        if (CoopResponse.data.price.length != 0) {
                            if (PartnercabType.toLowerCase() == "sedan") {
                                FareResponse = CoopResponse.data.price.sedan;
                            } else if (PartnercabType.toLowerCase() == "hatchback") {
                                FareResponse = CoopResponse.data.price.hatchback
                            } else if (PartnercabType.toLowerCase() == "suv") {
                                FareResponse = CoopResponse.data.price.suv
                            }
                            var FareAmount = FareResponse;
                            let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            $("#pr2COOP").css("display", "block");
                            $("#fare").css("width", "45%");
                            document.getElementById("pr2COOP").style.display = "block";
                            document.getElementById("discountCOOP").innerHTML = splitAmount2 + "% off"
                            document.getElementById("prCOOP").innerHTML = " ₹ " + FareAmount
                            document.getElementById("pr2COOP").innerHTML = "₹" + (
                                Number(FareAmount) + Number(50)
                            )
                            localStorage.setItem("finalFareCOOP", FareAmount);
                            localStorage.setItem("TotalFare", FareAmount);
                            resolve(FareAmount);
                        }

                    } else {
                        console.log("Coop fare not found")
                        reject("Rastey fare not found");
                    }
                    return FareAmount;
                },
                type: 'POST',
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/getCoopPrice'
                url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/getCoopPrice'
            });
        })
    }
    // //////////////////////// coop getfare code end //////////////////////////////

    // /////////////////////// start MEGA /////////////////////////////////////////////////
    const GetFareFromMega = async (PartnercabType) => {
        return new Promise(async (resolve, reject) => { // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");

            let megaSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("megaSearchId", megaSearchId)
            let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var city = SourceCity

            console.log(KMVal)
            let sendquestedData = {
                "destination": {
                    // "place_id": MapPlaceId,
                    "place_id": null,
                    "address": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": source_city.trim(),
                },

                "source": {
                    "place_id": null,
                    "address": $("#pac-input").val().substring(0, 100).trim(),
                    "latitude": pickup_lat,
                    "longitude": pickup_long,
                    "city": SourceCity.trim(),
                    // "city": "Delhi",
                },
                "trip_type": "ONE_WAY",
                "start_time": moment(meruTime).format('YYYY-MM-DDTHH:mm:ss'),
                "end_time": moment(meruTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
                "search_id": megaSearchId,
                "one_way_distance": Math.round(KMVal.split(" ")[0]),
                "package_distance": 0,
                "is_instant_search": false,
            };
            console.log(sendquestedData);
            // const ReferMega = await fetch("https://preprodapi.mojoboxx.com/preprod/webapi/getMegaFare", {
            const ReferMega = await fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/getMegaFare", {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendquestedData)
            });
            const getMega = await ReferMega.json();
            console.log('getMega', getMega.data["estimatedMinFare"])
            // show details on card start
            if (getMega.data.response.car_types.length > 0) {
                for (let i = 0; i < getMega.data.response.car_types.length; i++) {
                    if (getMega.data.response.car_types[i].type.toLowerCase() == PartnercabType.toLowerCase()) {
                        let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total)+parseInt(MultiplierAmount);;
                        // let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total);
                        let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                        if (String(AmountDiscount).includes(".")) {
                            var splitAmount = String(AmountDiscount).split(".")
                            var splitAmount2 = splitAmount[0];
                        } else {
                            splitAmount2 = AmountDiscount;
                        }
                        $("#fare").css("width", "45%");

                        document.getElementById("pr2MEGA").style.display = "block";
                        $("#pr2MEGA").css("font-size", "16px");
                        document.getElementById("discountMEGA").innerHTML = splitAmount2 + "% off"
                        document.getElementById("prMEGA").innerHTML = " ₹ " + amountValue
                        document.getElementById("pr2MEGA").innerHTML = "₹" + (Number(amountValue) + Number(50))
                        localStorage.setItem("finalFareMEGA", amountValue);
                        localStorage.setItem("TotalFare", amountValue);
                        resolve(amountValue)
                    }
                    else {
                        document.getElementById("pr2MEGA").style.display = "none";
                        document.getElementById("prMEGA").innerHTML = "Fare not found"
                        document.getElementById("prMEGA").style.fontSize = "10px";
                        resolve(true)
                    }
                }
            }
            else {
                document.getElementById("pr2MEGA").style.display = "none";
                document.getElementById("prMEGA").innerHTML = "Fare not found"
                document.getElementById("prMEGA").style.fontSize = "10px";
                resolve(true)
            }

        })
    }
    // /////////////////////// end MEGA /////////////////////////////////////////////////

    /////////////////////////get Fare from Blusmart code Start///////////////////////////
    var blusmartFareId;
    async function checkFareBlusmart(partnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2BLUSMART").style.display = "none";

            let total_km = KMVal.split(" ");
            let totalkm = Math.round(total_km[0]);
            let dateandtime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + (moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00")


            var myHeaders = new Headers();
            // myHeaders.append("Authorization", "Basic c3BpY2VqZXQtZGV2OjBuV2FSTDZXaDU1NjEwMmtBc1lW");
            myHeaders.append("Authorization", "Basic NjYzZDJmNDhlOGEwN2I4ZmY1M2E3YWM5YjMzYTk4ZDk6MmJjNTYyMzZlNjk2YThkM2FiNjYyNDU3ZGJhZjdhNjM=");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Access-Control-Allow-Origin", "*");

            var raw = JSON.stringify({
                "source": {
                    "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                    "address": $("#pac-input").val().substring(0, 100).trim(),
                    "latitude": pickup_lat,
                    "longitude": pickup_long,
                    "city": SourceCity.trim(),
                },
                "destination": {
                    "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                    "address": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": source_city.trim(),
                },
                "trip_type": "ONE_WAY",
                "search_id": Math.random().toString(14).slice(2),
                //   start_time: moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(),["h:mm A"]).format("HH:mm")+":00",
                //   "start_time": moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                "start_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",

                "end_time": moment(dateandtime).add(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                "vendor_id": "PARTNER_CODE",
                "partner_name": "SPICEJET",
                "search_tags": [
                    "EPASS"
                ],
                "one_way_distance": totalkm
            });

            //  console.log(raw)

            console.log(moment(dateandtime).add(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'))

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://fusion.tracking.blucgn.com/api/v1/booking/search", requestOptions)

                // fetch("https://fusion.tracking.uat.blucgn.com/api/v1/booking/search", requestOptions)
                //   .then(response => console.log(response))
                .then(response => response.text())
                .then(result => {
                    var newResult = JSON.parse(result)
                    // console.log(newResult)

                    let amountValue = parseInt(newResult.response.car_types[0].fare_details.base_fare)+parseInt(MultiplierAmount);
                    console.log(newResult.response.car_types[0].fare_details.base_fare)
                    document.getElementById("prBLUSMART").innerHTML = "₹" + (
                        newResult.response.car_types[0].fare_details.base_fare
                    )
                    let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                    if (String(AmountDiscount).includes(".")) {
                        var splitAmount = String(AmountDiscount).split(".")
                        var splitAmount2 = splitAmount[0];
                    } else {
                        splitAmount2 = AmountDiscount;
                    }
                    $("#fare").css("width", "45%");

                    document.getElementById("pr2BLUSMART").style.display = "block";
                    $("#prBLUSMART").css("font-size", "16px");
                    document.getElementById("discountBLUSMART").innerHTML = splitAmount2 + "% off"
                    document.getElementById("prBLUSMART").innerHTML = " ₹ " + amountValue
                    document.getElementById("pr2BLUSMART").innerHTML = "₹" + (
                        Number(amountValue) + Number(50)
                    )
                    localStorage.setItem("finalFareBLUSMART", amountValue);
                    localStorage.setItem("TotalFare", amountValue);

                    resolve(amountValue)
                    return
                }
                )
                .catch(error => {



                    console.log('error', error)
                    $("#prBLUSMART").html("Slot not available, choose diff time");
                    $("#prBLUSMART").css({ "font-size": "8px", "width": "100%" });
                    $("#fare").css("width", "100%");
                    //   $(".include").html("please choose diff time");
                    //   $(".include").css({"font-size":"9px","width":"100%"});
                    resolve(true)
                }


                );
        })
    }



    // /////////////////////// start savvari /////////////////////////////////////////////////
    const GetFareFromSavvariPartner = async (PartnercabType) => {
        return new Promise(async (resolve, reject) => { // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            var travelTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00";
            let sendquestedData = {
                "cityCode": ArrAirportName,
                "startTime": travelTime,
                "source_latitude": pickup_lat,
                "source_longitude": pickup_long
            };
            console.log(sendquestedData);
            // const ReferSavvari = await fetch("https://preprodapi.mojoboxx.com/preprod/webapi/getSavaariFare", {
            const ReferSavvari = await fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/getSavaariFare", {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendquestedData)
            });
            const getSavvari = await ReferSavvari.json();
            console.log('getSavvari', getSavvari)
            // show details on card start
            if (getSavvari.length > 0) {


                for (let i = 0; i < getSavvari.length; i++) { // console.log(fareResponse[i].taxiType)
                    console.log()
                    if (getSavvari[i].carType.toLowerCase() == PartnercabType.toLowerCase()) {
                        var savaariFare = parseInt(getSavvari[i].amount)+parseInt(MultiplierAmount);

                        let AmountDiscount = ((50 / (savaariFare + Number(50)) * 100));
                        if (String(AmountDiscount).includes(".")) {
                            var splitAmount = String(AmountDiscount).split(".")
                            var splitAmount2 = splitAmount[0];
                        } else {
                            splitAmount2 = AmountDiscount;
                        }
                        $("#fare").css("width", "45%");
                        $("#pr2SAVAARI").css("display", "block");
                        document.getElementById("pr2SAVAARI").style.display = "block";
                        document.getElementById("discountSAVAARI").innerHTML = splitAmount2 + "% off"
                        document.getElementById("prSAVAARI").innerHTML = " ₹ " + savaariFare
                        document.getElementById("pr2SAVAARI").innerHTML = "₹" + (
                            Number(savaariFare) + Number(50)
                        )
                        localStorage.setItem("finalFareSAVAARI", savaariFare);
                        localStorage.setItem("TotalFare", savaariFare);
                        sessionStorage.setItem("carID", getSavvari[i].carId);
                        sessionStorage.setItem("token", getSavvari[i].token);
                        resolve(savaariFare)
                    } else {
                        resolve(true)
                    }
                }

            } else {
                resolve(true)
            }
        })
    }
    // /////////////////////// end savvari /////////////////////////////////////////////////

    async function GetFarefromMeru(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2MERU").style.display = "none";
            let meruSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("meruSearchId", meruSearchId)
            // var meruTime = moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm")
            let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            console.log(meruTime)
            var city = SourceCity
            // var hardCodeCity =
            console.log(city)

            var datasend = {
                "source": {
                    "place_id": MapPlaceId,
                    "address": $("#pac-input").val().substring(0, 100).trim(),
                    "latitude": pickup_lat,
                    "longitude": pickup_long,
                    "city": SourceCity.trim(),
                    // "city": "Delhi",

                },
                "destination": {
                    "place_id": null,
                    "address": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": source_city.trim(),

                },
                "trip_type": "ONE_WAY",
                "start_time": moment(meruTime).format('YYYY-MM-DDTHH:mm:ss'),
                "end_time": moment(meruTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
                "search_id": meruSearchId,
                "one_way_distance": KMVal.includes(".") ? KMVal.split(".")[0] : KMVal,
                "package_distance": 0,
                "is_instant_search": false,
            }
            console.log(datasend)
            $("#fare").css("width", "45%");
            fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/getMeruFarePrice',
                // fetch('https://preprodapi.mojoboxx.com/preprod/webapi/getMeruFarePrice',
                {
                    method: 'POST',
                    body: JSON.stringify(datasend),
                    "headers": {
                        "Content-type": "Application/json"
                    }
                })
                .then(response => response.text())
                .then(result => {
                    var newResult = JSON.parse(result)
                    console.log(newResult.data.response.car_types)
                    // let fare = newResult.data.car_types[0].fare_details.base_fare
                    // console.log(newResult.data)
                    // document.getElementById("prMERU").innerHTML = " ₹ " + fare
                    // // $("#prMERU").html(fare)
                    // console.log(json)
                    var fare
                    newResult.data.response.car_types.forEach((elem) => {
                        console.log(elem)
                        if (elem.type.toLowerCase() == PartnercabType.toLowerCase()) {
                            fare = elem.fare_details.base_fare + elem.fare_details.extra_charges.toll_charges["amount"] + elem.fare_details.extra_charges.parking_charges["amount"]

                        }

                    })

                    var FareAmount = parseInt(fare)+parseInt(MultiplierAmount);
                    let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                    if (String(AmountDiscount).includes(".")) {
                        var splitAmount = String(AmountDiscount).split(".")
                        var splitAmount2 = splitAmount[0];
                    } else {
                        splitAmount2 = AmountDiscount;
                    }
                    $("#fare").css("width", "45%");

                    document.getElementById("pr2MERU").style.display = "block";
                    $("#prMERU").css("font-size", "16px");
                    document.getElementById("discountMERU").innerHTML = splitAmount2 + "% off"
                    document.getElementById("prMERU").innerHTML = " ₹ " + fare
                    document.getElementById("pr2MERU").innerHTML = "₹" + (
                        Number(fare) + Number(50)
                    )
                    localStorage.setItem("finalFareMERU", fare);
                    localStorage.setItem("TotalFare", fare);
                    resolve(fare)
                    return true
                    // }
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                    resolve(true)
                    // reject(true)
                });
        })
    }

    // //////////////////////get fare from Meru code end ///////////////////////////

    // ///////////////////////Get fare from Quickride API code start////////////////////////
    var quickrideFareId;
    var QuickrideFareResponse;

    async function GetFarefromPartner(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2QUICKRIDE").style.display = "none";
            var fetchResponse;
            // console.log(moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))
            var datasend = {
                key: "MojoBox-Klm9.45j",
                vendor_id: "MOJO_BOXX_ZORY",
                destination_name: $("#cabPickupTerminal :selected").text().trim(),
                destination_city: source_city.trim(),
                destination_latitude: source_latitude,
                destination_longitude: source_longitude,
                source_name: $("#pac-input").val().substring(0, 100).trim(),
                source_city: SourceCity.trim(),
                source_latitude: pickup_lat,
                source_longitude: pickup_long,
                // start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                start_time: moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                end_time: "",
                tripType: "Local"
            }
            console.log(datasend)
            $("#fare").css("width", "45%");
            // fetch('https://qtds.getquickride.com:443/taxidemandserver/rest/mojobox/taxi/booking/search', {
            fetch('https://prodapi.mojoboxx.com/spicescreen/webapi/getQuickRideFare', {
                method: 'POST',
                body: JSON.stringify(datasend),
                "headers": {
                    "Authorization": "Basic eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MyIsImlzcyI6IlF1aWNrUmlkZSIsImlhdCI6MTYzOTU0MTgyMH0.6H0Dt2Hqhlj7RxcMcybV2bgkr29pCtm6ni8qfZFpv6qLtJtqy4-BbL-kTnz2zYiDZGDeGGj8Gr_GBC2FZFRkdg",
                    "Content-type": "Application/json"
                }
            }).then(response => response.json()).then(json => { // console.log(json);
                var fareAmountInteger;
                fetchResponse = json;
                for (let a = 0; a < fetchResponse.fareForTaxis.length; a++) {
                    let TaxiType = fetchResponse.fareForTaxis[a].taxiType;
                    if (TaxiType == "Car") {
                        var fareResponse = fetchResponse.fareForTaxis[a].fares;
                        QuickrideFareResponse = fetchResponse.fareForTaxis[a].fares;
                        // console.log(fareResponse);
                        if (fareResponse.length >= 1) {
                            for (let i = 0; i < fareResponse.length; i++) { // console.log(fareResponse[i].taxiType)
                                if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                    quickrideFareId = fareResponse[i].fixedFareId;
                                    // console.log(quickrideFareId);
                                    // fareAmountInteger = parseInt(fareResponse[i].maxTotalFare);
                                    fareAmountInteger = (parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount));
                                    // console.log(fareAmountInteger)
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
            }).catch((error) => { // console.error('Error:', error);
                resolve(true)
                // reject(true)
            });
        })
    }

    // //////////////////////get fare from quickride code end ///////////////////////////


    // //////////////////// Get fare from BuddyCab code start ///////////////////////////

    var buddyFareId;
    async function GetFarefromPartnerBuddy(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2BUDDY CABS").style.display = "none";
            var fetchResponse;
            let total_km = KMVal.split(" ");
            let totalkm = Math.round(total_km[0]);
            var sourceCity
            if (source_city.trim() == "Bangalore") {
                sourceCity = Bengaluru
            } else {
                sourceCity = source_city.trim()
            }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "destination_name": $("#cabPickupTerminal :selected").text().trim(),
                "destination_city": source_city.trim(),
                "destination_latitude": source_latitude,
                "destination_longitude": source_longitude,
                "source_name": $("#pac-input").val(),
                "source_city": sourceCity,
                "source_latitude": pickup_lat,
                "source_longitude": pickup_long,
                "tripType": "Local",
                "distance": totalkm
            });
            // console.log(raw);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("https://api.buddy-cabs.com/SpiceJet/GetCabFare", requestOptions).then(response => response.json()).then(json => {

                let fareAmountInteger;
                fetchResponse = json;
                // console.log(fetchResponse)
                let TaxiType = fetchResponse.resultData.fareForTaxis.taxiType;
                if (TaxiType == "Car") {
                    let fareResponse = fetchResponse.resultData.fareForTaxis.fares;
                    if (fareResponse.length >= 1) {
                        for (let i = 0; i < fareResponse.length; i++) {
                            if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                fareAmountInteger = parseInt(fareResponse[i].totalCharge);
                                let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                                if (String(AmountDiscount).includes(".")) {
                                    var splitAmount = String(AmountDiscount).split(".")
                                    var splitAmount2 = splitAmount[0];
                                } else {
                                    splitAmount2 = AmountDiscount;
                                }
                                $("#fare").css("width", "45%");

                                document.getElementById("pr2BUDDY CABS").style.display = "block";
                                $("#prBUDDY CABS").css("font-size", "16px");
                                document.getElementById("discountBUDDY CABS").innerHTML = splitAmount2 + "% off"
                                document.getElementById("prBUDDY CABS").innerHTML = " ₹ " + fareAmountInteger
                                document.getElementById("pr2BUDDY CABS").innerHTML = "₹" + (
                                    Number(fareAmountInteger) + Number(50)
                                )
                                localStorage.setItem("finalFareBUDDY CABS", fareAmountInteger);
                                localStorage.setItem("TotalFare", fareAmountInteger);
                                resolve(fareAmountInteger);
                            }
                        }
                    }
                }

            }).catch(error => {
                reject(error);
                console.log('error', error)
            });
        })
    }

    // //////////////////// Get fare from BuddyCab code end  ////////////////////////////

    // /////////////////////// start Gozo /////////////////////////////////////////////////
    var GOZOFareId;
    const GetFareFromGozoPartner = async (CabType) => {

        return new Promise(async function (resolve, reject) { // ////////////////Current date & time code start/////////////////
            // var tym_date = moment(new Date()).add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss')
            var tym_date = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + "T" + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var Currenttym = tym_date.split("T")[1]
            var Currentdate = tym_date.split("T")[0]
            // ////////////////Current date & time code end /////////////////

            var settings = {
                // "url": "https://preprodapi.mojoboxx.com/preprod/webapi/getGozoFares",
                "url": "https://prodapi.mojoboxx.com/spicescreen/webapi/getGozoFares",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": "Basic M2UwMDA4NTU0NWQ0OWZmMmNjM2MxNjRhMTcyYzE0ZGQ=",
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(
                    {
                        "startDate": Currentdate,
                        // "startDate": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"),
                        // "startTime": moment($(".timepicker").val(),["h:mm A"]).format("HH:mm:ss"),
                        "startTime": Currenttym,
                        "cab_type": CabType,
                        "mobile": document.getElementById("mb_number").value,
                        "source_address": $("#pac-input").val(),
                        "source_latitude": pickup_lat,
                        "source_longitude": pickup_long,
                        "destination_address": $("#cabPickupTerminal :selected").text().trim(),
                        "destination_latitude": source_latitude,
                        "destination_longitude": source_longitude
                    }
                )
            };
            // console.log(settings.data);

            $.ajax(settings).done(function (gozores) { // console.log(gozores);
                if (gozores.success != "false" && gozores.code == 200) {
                    var gozofare = gozores["data"]["cabRate"]
                    var GozoResponse = gozores.result;
                    localStorage.setItem("GozoResponse", JSON.stringify(GozoResponse))
                    for (let a = 0; a < gozofare.length; a++) {
                        CabType == "Hatchback" ? CabType = "Compact" : CabType;
                        if (gozofare[a]["cab"]["category"].toLowerCase() == CabType.toLowerCase()) {
                            GOZOFareId = gozores["data"]["cabRate"][0]["cab"]["id"]
                            var FareAmount =parseInt(gozofare[a]["fare"]["totalAmount"])+parseInt(MultiplierAmount);
                            // console.log(FareAmount)
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

    $("#dubai").on('change', function () {
        lastDetails();
    })
    // ///////////////////// Dubai cab code start///////////////////////////////////////////
    var dubaiCity;
    var dubaiDistance;
    var dubaiLat;
    var dubaiLong;
    var dubaiFare;
    async function getOptiondubai(cab_response) { // await lastDetails();
        var selectedval = document.getElementById("dubai").value;
        var cityName = selectedval.split(",")[0]
        dubaiCity = cityName.split("-")[1]

        var cityLat = selectedval.split(",")[1]
        dubaiLat = cityLat.split("-")[1]

        var cityLong = selectedval.split(",")[2]
        dubaiLong = cityLong.split("-")[1]

        var cityKM = selectedval.split(",")[3]
        dubaiDistance = cityKM.split("-")[1]

        var cityFare = selectedval.split(",")[4]
        dubaiFare = cityFare.split("-")[1]

        document.getElementById("km" + cab_response).innerHTML = dubaiDistance + " Km"
        $("#fare").css("float", "right");
        $(".include").css("font-size", "6px");
        localStorage.setItem("DubaiFare", dubaiFare);
        document.getElementById("pr" + cab_response).innerHTML = dubaiFare;
        // console.log(dubaiCity, dubaiLat, dubaiLong, dubaiDistance)
    }

    // ///////////////////// Dubai cab code end ///////////////////////////////////////////



    // //////////////// Book self drive cab code start /////////////////////////////
    function BookSelfDriveCab() {
        localStorage["selfD"] = true;
        // console.log(TerminalCode)
        // console.log(TerminalCode.split("-")[1])

        dataJ = {
            "clubMember": [
                {
                    "type": "cabForm",
                    "name_title": '',
                    "user_name": "Customer",
                    "last_name": "Customer",
                    "mobile": $("#mb_number").val(),
                    "email": "hello@mojoboxx.com",
                    "time": Date.now(),
                    "sendLeadSms": "true",
                    "partnerName": localStorage["partnerName"],
                    "title": localStorage["partnerName"],
                    "category": "CAB",
                    "trip_type": TripType,
                    "pickup_time": moment().format('YYYY-DD-MM HH:mm'),
                    "cab_type": localStorage["partnercabType"],
                    "cab_category": localStorage["rideType"],
                    "terminalCode": (cityCODE == "DEL" && TripType == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().split("-")[1].trim() : TerminalCode.trim(),
                    "msgUniqueId": getRandom(10),
                    "hostId": "Website",
                    "from_city": cityCODE,
                    "to_city": cityCODE,
                    "source": (cityCODE == "DEL" && TripType == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().trim() : SourceName,
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "isDeparture": 1,
                    "mojoPartner": "AirIndia",
                    "pnr": "",
                    "source_city": source_city,
                    "source_latitude": source_latitude,
                    "source_longitude": source_longitude,
                    "source_name": (cityCODE == "DEL" && TripType == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().trim() : SourceName,
                    "status": "CAB",
                    "website_url": "airindia_selfdrive",
                    "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                    "user_agent": localStorage["userAgent"]
                }
            ]
        };

        // console.log(dataJ)
        $.ajax({
            type: 'POST',
            // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/cabRegistration',
            url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/cabRegistration',
            contentType: 'application/json',
            Accept: 'application/json',
            data: JSON.stringify(dataJ),
            dataType: 'json',
            success: function (response) {
                document.getElementById("confirmation_boxGeneral").style.display = "block";
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".main_div").addClass("blur");
                $('body').css('overflow', 'hidden');
                $("#continue").val("CONFIRM PICKUP");
                let linkTo_open = '';
                if (localStorage["partnerName"] == "Zoom Car") {
                    linkTo_open = "https://www.zoomcar.com/"
                }
                else if (localStorage["partnerName"] == "QUICK LEASE CAR RENTALS") {
                    linkTo_open = "https://bit.ly/3OaRIlQ"
                }
                else {
                    linkTo_open = ""
                }
                document.getElementById("selfdrive_url").setAttribute("href", linkTo_open)
            },
            error: function (res) {
                console.log(res);
                console.log("Cab booking failed");
                $("#cmmsg").html("Booking failed");
                $(".confirmation_boxCabDiv").css("display", "block");
                $("#yourInfo").css("filter", "blur(5px)");
                $(".confirmation_boxCab").css("display", "block");
            }
        });
    }


    document.getElementById("bookedstatusGeneral").onclick = function () {
        document.getElementById("confirmation_boxGeneral").style.display = "none";
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".main_div").removeClass("blur");
        $('body').css('overflow', 'scroll');
        // window.location= "https://bit.ly/3OaRIlQ"
        // window.location = "https://www.zoomcar.com/"
    }
    // //////////////// Book self drive cab code end  /////////////////////////////


    // ///////////////////// Goa miles fare API code start /////////////////////////////
    var Goamilesfareid = '';
    var GoamilesvehicleTyp = '';
    var Goamilesamount = '';
    var GoamilesVehiclename = '';
    var GoamilesBookingId = "SPJ" + Math.floor(10000000000 + Math.random() * 9000000000);

    async function checkFareGoamiles(cabTyp) {
        return new Promise(async function (resolve, reject) {
            if ($("#mb_number").val() == "") {
                $("#cmmsg").html("Enter mobile number");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $("#pac-input").val('')
                $("#makeSerIconI").removeClass("fa-times");
                $("#makeSerIconI").addClass("fa-map-marker-alt");
                return false;
            }

            dataJ = {
                "passenger_mobile": $("#mb_number").val(),
                "passenger_email": "",
                "pickup_latlng": pickup_lat + "," + pickup_long,
                "pickup_address": $("#pac-input").val(),
                "bookingId": GoamilesBookingId,
                "pickup_time": moment().format('YYYY-MM-DD HH:mm:ss'),
                "drop_latlng": source_latitude + "," + source_longitude,
                "drop_address": $("#cabPickupTerminal :selected").text().trim(),
                "trip_type": "D"
            }
            // console.log(dataJ);
            $.ajax({
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    if (res.data.response_code != null && res.data.response_code == 101) {
                        Goamilesfareid = res.data.data.request_id;
                        var Farelist = res.data.data.fare_list;
                        Farelist.forEach(element => {
                            if (element.vehicle_type_name.toLowerCase() == cabTyp.toLowerCase()) { // console.log(element.vehicle_type_name);
                                let amountValue = parseInt(element.booking_amount)
                                let AmountDiscount = ((50 / (amountValue + Number(50)) * 100));
                                if (String(AmountDiscount).includes(".")) {
                                    var splitAmount = String(AmountDiscount).split(".")
                                    var splitAmount2 = splitAmount[0];
                                } else {
                                    splitAmount2 = AmountDiscount;
                                }
                                $("#fare").css("width", "45%");
                                document.getElementById("pr2GOAMILES").style.display = "block";
                                document.getElementById("discountGOAMILES").innerHTML = splitAmount2 + "% off"
                                document.getElementById("prGOAMILES").innerHTML = " ₹ " + amountValue
                                document.getElementById("pr2GOAMILES").innerHTML = "₹" + (
                                    Number(amountValue) + Number(50)
                                )
                                localStorage.setItem("finalFareGOAMILES", amountValue);
                                localStorage.setItem("TotalFare", amountValue);
                                GoamilesvehicleTyp = element.vehicle_type;
                                Goamilesamount = element.booking_amount;
                                GoamilesVehiclename = element.vehicle_type_name;
                                resolve(amountValue)
                            }
                        })
                    } else {
                        $("#cmmsg").html(res.data.response_message);
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".thank_msg i").addClass("fa-times-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        reject(true)
                    }
                },
                error: function (xhr) {
                    if (xhr.statusText == "error" || xhr.statusText == "Bad Request") {
                        document.getElementById("loader").style.display = "none";
                        $("#pac-input").val("Server temporarily unavailable");
                        $("#cmmsg").html("Server temporarily unavailable");
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".thank_msg i").addClass("fa-times-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        reject(true)
                    }
                },
                type: 'POST',
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/updateBookingLatLongGoa'
                url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/getFareGoaDeparture'
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/getFareGoaDeparture'
            });
        })
    }
    // ///////////////////// Goa miles fare API code end /////////////////////////////

    // /////////////////// Goa miles booking cab code start ///////////////////
    var GoamilePaymentLink = ''
    async function generateBookingGoa() {
        return new Promise(async function (resolve, reject) {

            dataJ = {
                "request_id": Goamilesfareid,
                "order_id": GoamilesBookingId,
                "veh_type": GoamilesvehicleTyp,
                "veh_type_name": GoamilesVehiclename,
                "booking_amount": Goamilesamount,
                "trip_type": "D"
            }
            $.ajax({
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (res) { // console.log(res);
                    if (res.data.response_code != "117") {
                        document.getElementById("loader").style.display = "none";
                        GoamilePaymentLink = res.data.data.offline_payement_link
                        resolve(GoamilePaymentLink)
                        // window.location = res.data.data.offline_payement_link;
                    } else {
                        $("#cmmsg").html(res.data.response_message);
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".thank_msg i").addClass("fa-times-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        resolve(true)
                    }
                },
                error: function (xhr) {
                    if (xhr.statusText == "error" || xhr.statusText == "Bad Request") {
                        document.getElementById("loader").style.display = "none";
                        $("#cmmsg").html("Server temporarily unavailable");
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".thank_msg i").addClass("fa-times-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                    }
                },
                type: 'POST',
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/generateBookingGoa'
                url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/generateBookingGoa'
            });
        })
    }
    // /////////////////// Goa miles booking cab code end  ///////////////////

    $("#status3").click(function () {
        $(".confirmation_boxCab3").css("display", "none");
        $(".confirmation_boxCabDiv3").css("display", "none");
        location.href = "payendBooking.html?payMethod=RAZORPAY"
    })

    ////////////////////// Ride Time UI Code start /////////////////////////////////////
    if (localStorage["loadPagevalue"] == "ride" || localStorage["loadPagevalue"] == "undefined" || localStorage["loadPagevalue"] == undefined) {
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

            if (document.getElementById("mb_number").value.length == 0) {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Mobile Number")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select  City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#pac-input").val() == "") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Pickup Location")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }



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
            }, 2000);

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
                        // return
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
            var ZeroHour = timeToday + 2 + ":" + getMin;

            let todayDate = new Date().toISOString().slice(0, 10)

            var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");

            Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), Timevalue)

            if ((todayDate == localStorage["STDdate"]) || (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))) {
                if (Timevalue < moment().add(60, 'minutes').format('HH:mm')) {
                    $("#cmmsg").html("You are advised to select a time, 1 hour later than current time.");
                    $(".thank_msg i").css("display", "none");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $(".timepicker").val("Pick up Time");
                }


            }


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

            var dateValue = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime;
            // alert(dateValue)
            var currentTime = moment().add(8, 'hours').format("YYYY-MM-DD HH:MM");


            // alert(currentTime)
            // alert(dateValue)


            if (currentTime > dateValue) {
                // alert("dfdf")
                localStorage.setItem("removecash", "yes")
            }
            else {
                localStorage.setItem("removecash", "no")
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
            console.log($(".timepicker").val())
            if (!localStorage["LoadTIMEUI"]) {

                if (ShowSelfDrive != "yes") {
                    if (($("#cabPickupCity").val() != null) && ($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                        console.log("load details")
                        lastDetails()

                    }
                }

            }
        }
    }

    ////////////////////// Ride Time UI Code end  //////////////////////////////////////
    /////////////////////PopUp-for payment//////////////////////////////////////////////////
    //   $('.close_popup').click(function(){
    //     //alert("hello")
    //     $('#mainDetails').css('display', 'none')
    //   })

    //   $('.bookBtn').click(function(){
    //     alert("hello")
    //     $("#mainDetails").css('display', 'block')
    //   })

    ////////////////////////Pop up -from end//////////////////////////////////////
}

