
var MultiplierAmount;
var sessionToken
function loadMainjs() {
    var SourceCityName;
    var stateforinvoice;
    var couponDiscountAmt = 0
    let paymthd1;
    let paymthd2;
    var source_latitude;
    var cityCODE;
    var source_longitude;
    var SourceCity;
    var pickup_lat;
    var pickup_long;
    var TerminalCode;
    var arrivalAirport;
    var ArrivalStation;
    var SourceName;
    var KMVal;
    var KMNum;
    var PaymentMethod = 'payment'
    var PaymentAmt = ''
    var PaymentLater = ''
    var couponCodeValue = 0
    var couponcodeType = 'cashback'
    var couponcodePayType = ''
    var content_id = 0;
    var fare_price = 0;
    var CabBookingType = 'sedan'
    var defaultCashback = 0

    document.getElementById("coupon").value = localStorage.getItem("discount");


    if (ShowSelfDrive != "yes") {
        $("#ConfirmButton").css("display", "none");
    }

    document.getElementById("mb_number").onchange = function () {
        // checkMobile();
        if ($("#mb_number").val().length == 10 && $("#mb_number").val() != undefined) {
            localStorage.setItem("mobileNum", $("#mb_number").val())
            checkVIP($("#mb_number").val())
            Track_LoadAnalytics($("#mb_number").val(), "arrival", "bookairportcab", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
        }
    }

    // document.getElementById("interstitial_back").style.display = "block";
    // document.getElementById("interstitial_back").innerHTML = "";
    // let inter = document.createElement("div");
    // inter.setAttribute("class", "interstitial");
    // let interImg = document.createElement("img");
    // interImg.setAttribute("src", 'img/Yatra.jpg')
    // inter.appendChild(interImg);
    // interImg.onclick = function () {
    //     document.getElementById("interstitial_back").style.display = "none";
    // }
    // let cross = document.createElement("i");
    // cross.setAttribute("class", "fas fa-times-circle");
    // cross.setAttribute("id", "cross");
    // inter.appendChild(cross);
    // cross.onclick = function () {
    //     document.getElementById("interstitial_back").style.display = "none";
    // }
    // // setTimeout(function () { document.getElementById("interstitial_back").style.display = "none" }, 4000)
    // document.getElementById("interstitial_back").appendChild(inter);



    /////////////VIP alert code start////////////////////////////////
    const checkVIP = async (mobile) => {
        var vipbody = { "travel_type": "arrival", "phoneNo": mobile }
        const vip = await fetch(BaseAPIURL + domain + "/webapi/vip_check", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(vipbody)
        });
        const vipResponse = await vip.json();
        console.log(vipResponse);

        // if (vipResponse.status == 200) {
        // console.log(vipResponse.data[0].category)
        // if(vipResponse.data[0].category.toLowerCase() == "silver")
        // {   
        //     $(".confirmation_boxCabDiv").css("display", "block");
        //     $(".confirmationVIP").css("display", "block");
        //     $("#viptext").attr("data-apply","silver");
        //     $("#vipMSG").empty();
        //     $("#vipMSG").append(`Hello again, <br> We're glad you've chosen to book a cab with us again.<br>Apply code <b>"WELCOMEBACK"</b> & enjoy a Rs.131 discount on your current booking.<br>We hope to serve you again soon!`)
        // }
        // else if(vipResponse.data[0].category.toLowerCase() == "gold")
        // {   
        //     $(".confirmation_boxCabDiv").css("display", "block");
        //     $(".confirmationVIP").css("display", "block");
        //     $("#viptext").attr("data-apply","gold");
        //     $("#vipMSG").empty();
        //     $("#vipMSG").append(`Hello there, <br> Thanks for choosing to book a cab with us!<br>As a special offer, we'd like to give you a discount of Rs.151 on your current booking. Apply code <b>"DISCOUNT151"</b> below to redeem this offer.<br>We hope you enjoy your ride.`)
        // }
        // else if(vipResponse.data[0].category.toLowerCase() == "platinum")
        // {   
        //     $(".confirmation_boxCabDiv").css("display", "block");
        //     $(".confirmationVIP").css("display", "block");
        //     $("#viptext").attr("data-apply","platinum");
        //     $("#vipMSG").empty();
        //     $("#vipMSG").append(`Hello there, <br> Thanks for choosing to book a ride with us!.<br>We're excited to offer you the option to upgrade to a rental at the same fare. Want to have the car for an extended period of time?<b>"WELCOMEBACK"</b> & enjoy a RS.131 discount on your current booking.<br>We hope to serve you again soon!`)
        // }
    }
    /////////////VIP alert code end////////////////////////////////

    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: 0,
        onSelect: function (dateText) {

            Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "bookairportcab", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")

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
                        // if (($("#cabPickupCity").val() == 'GOI')) {
                        //     if ($("#user_name").val() == '') {
                        //         var type_timer;
                        //         var finished_writing_interval = 3000;
                        //         var my_input = document.getElementById("user_name");

                        //         //Start timeout when user start typing
                        //         my_input.addEventListener('keyup', function () {
                        //             clearTimeout(type_timer);
                        //             type_timer = setTimeout(finished_typing, finished_writing_interval);
                        //         });

                        //         //Clear timeout on key down event
                        //         my_input.addEventListener('keydown', function () {
                        //             clearTimeout(type_timer);
                        //         });

                        //         //This function runs when user has finished writing in input
                        //         function finished_typing() {
                        //             if ($("#user_name").val() != '') {
                        //                 // console.log("User finished typing");
                        //                 lastDetails(PaymentMethod)
                        //             }
                        //         }
                        //     }
                        //     else {
                        //         lastDetails(PaymentMethod)
                        //     }
                        // }
                        // else {
                            lastDetails(PaymentMethod)
                        // }
                    }
                }, 1000)
            }
            else if ($(".timepicker").val() != "Pick up Time") {
                lastDetails(PaymentMethod)
            }
        }
    });

    window.onload = async function () {
        localStorage.removeItem("CabSHOW");
    }

    LoadPagedata()
    async function LoadPagedata() {
        var bookingId = localStorage["booking_id"];
        ShowSelfDrive == "yes" ? loadCity('', 'isSelfDrive') : ''

        if(localStorage["prefillcity"] != undefined && localStorage["prefillcity"] != null && localStorage["prefillcity"] != "null" && localStorage["prefillcity"] != "undefined")
        {
            await loadMeruPickPoint(localStorage["prefillcity"]);
            await loadCity(localStorage["prefillcity"], 'is_arrival');
            await fillTerminalCodeByCity(localStorage["prefillcity"]);
        }
        setTimeout(() => {
            initAutocomplete();
        }, 3000);
        await getPNR(bookingId);
    }

    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch(BaseURL + domain + '/webapi/meruPickupPoint?city=' + CityCode);
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }

    $('input[type=radio][name=selfTyp]').change(function () {
        if (this.value == 'Airport Round Trip') {
            localStorage.setItem("trip_type", 'Airport Round Trip');
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
            partnerSlider(cab_response, "suv", ArrivalStation, 'Airport Round Trip');

        } else if (this.value == 'City Rental') {
            localStorage.setItem("trip_type", 'City Rental');
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
            partnerSlider(cab_response, "suv", ArrivalStation, 'City Rental');
        }
    });

    // ////////////Load city data code start ///////////
    async function loadCity(ArrivalCode = '', TripType) {
        $("#cabPickupCity").empty();
        return new Promise(async function (resolve, reject) {
            $.ajax({
                type: 'GET',
                //url: BaseAPIURL+domain+'/webapi/getCityList',
                url: BaseURL + domain + '/webapi/getCityList',
                contentType: "application/json",
                dataType: 'json',
                success: function (data) {
                    let dynamicOption = '';
                    var cityArray = [];
                    // data.forEach(element => {
                    //     if (element.is_arrival == "1") {
                    //         cityArray.push(element);
                    //     }
                    // })
                    data.forEach(element => {
                        if (element[TripType] == "1") {
                            cityArray.push(element);
                        }
                    })
                    if (TripType == 'isSelfDrive') {
                        dynamicOption += `<option selected="true" value="Select City">Select City</option>`
                    } else {
                        dynamicOption += `<option selected="true" value="Select City">Select City</option>`
                    }
                    $.each(cityArray, function (i, currProgram) {
                        if (ArrivalCode != '' && currProgram.code == ArrivalCode) {
                            dynamicOption += `<option selected="true" value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                            fillTerminalCodeByCity(ArrivalCode)
                        }
                        else {
                            dynamicOption += `<option value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                        }
                    });
                    $("#cabPickupCity").append(dynamicOption)
                    resolve(true);
                },
                error: function (e) {
                    reject("City list not found");
                }
            });
        })

    }
    // ////////////Load city data code end  ///////////////////

    $("#cabPickupTerminal").on('change', function () {
        var AirportName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]
        if (AirportName.trim() == $("#cabPickupTerminal :selected").text().trim()) {
            TerminalCode = $("#cabPickupTerminal :selected").val()
            SourceName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]

            source_latitude = $("#cabPickupTerminal :selected").attr('class').split(",")[1]
            source_longitude = $("#cabPickupTerminal :selected").attr('class').split(",")[2]
        }
        if ($("#pac-input").val() != "") {
            lastDetails(PaymentMethod);
        }
    })



    // /////////// Fill Terminal code in select field code start /////////////////////
    $('#cabPickupCity').on('change', async function () {
        defaultCashback = 0
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
        arrivalAirport = $(this).find(":selected").val()
        $("#pac-input").val('');

        if ($(this).find(":selected").val() == "DXB") {
            $(".manualoption").css("display", "block")
            $("#makeSerIcon").css("display", "none")
            $(".pnr_pickup").css("display", "none")
        }
        else {
            $(".manualoption").css("display", "none")
            $("#makeSerIcon").css("display", "block")
            $(".pnr_pickup").css("display", "block")
        }
        if (ShowSelfDrive == "yes") {
            $(".pnr_pickup").css("display", "none")
            lastDetails(PaymentMethod);
        }

        await Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "bookairportcab", "null", "null", $(this).find(":selected").val(), "null", $(this).find(":selected").val(), "null", "null", "null", "null", "null", "null")


    });

    async function fillTerminalCodeByCity(cityCode = '') {
        return new Promise(async function (resolve, reject) {
            if (cityCode == 'GOI') {
                $(".email").css("display", "none")
                $(".user_name").css("display", "block")
            }
            else {
                $(".email").css("display", "block")
                $(".user_name").css("display", "none")
            }
            ArrivalStation = cityCode
            //  localStorage.setItem('ArrivalStation', cityCode)
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';

            const obj = JSON.parse(localStorage["pickupPoint"]);
            let lc = obj;
            let rv;
            rv = lc[cityCode];

            localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));
            cityCODE = cityCode
            // localStorage.setItem("cityCODE", cityCode);
            SourceCityName = rv[0].source_city;
            if (cityCode == "DEL") {
                source_latitude = rv[2].source_latitude
                //  localStorage.setItem("source_latitude", rv[2].source_latitude)
                source_longitude = rv[2].source_longitude
                //  localStorage.setItem("source_longitude", rv[2].source_longitude)
            }
            else {
                source_latitude = rv[0].source_latitude
                source_longitude = rv[0].source_longitude
                //   localStorage.setItem("source_latitude", rv[0].source_latitude)
                //localStorage.setItem("source_longitude", rv[0].source_longitude)
            }
            TerminalCode = rv[0].id
            //localStorage.setItem("TerminalCode", rv[0].id)
            SourceName = rv[0]["source_name"]
            //  localStorage.setItem("SourceName", rv[0]["source_name"])
            localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + source_latitude + "," + source_longitude + "," + rv[0]["source_name"])
            rv != undefined && $.each(rv, function (i, currProgram) {
                if (cityCode == "DEL") {
                    dynamicOption += `<option selected value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name}"> ${currProgram.source_name
                        } </option>`
                        arrivalAirport = 'DEL'
                } else {
                    dynamicOption += `<option value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name}"> ${currProgram.source_name
                        }  </option>`
                        arrivalAirport = cityCode
                      
                }
            });
            $("#cabPickupTerminal").append(dynamicOption);
            resolve(true);
        })
    }

    // /////////// Fill Terminal code in select field code end  /////////////////////

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
        console.log("fix robodemo");
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
        sessionToken = new google.maps.places.AutocompleteSessionToken();
        initAutocomplete()
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

            predictions.forEach(function (prediction) { // <li id="current_location">Get Current location </li>
                results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id
                    }><span class="autocomplete-icon icon-localities"></span> 
                    <span class="autocomplete-text">${prediction.description
                    }</span></li>`);
            });
            autocomplete_results.innerHTML = results_html.join("");
            autocomplete_results.style.display = 'block';
            let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    SourceCity = placeArr.slice(-3, -1)[0];
                    // localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);
                    // localStorage.setItem("stateforinvoice", placeArr.slice(-2, -1)[0]);


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

                            pickup_lat = a
                            pickup_long = b
                            //localStorage.setItem("pickup_lat", a);
                            //localStorage.setItem("pickup_long", b);
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

                                    Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "bookairportcab", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long, "null", "null")


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
                                    if (KMNum < 2) {
                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("Minimum 2km ride is required.")
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
                                        // var CardInterval = setInterval(function () {
                                        //     localStorage.setItem("LoadTIMEUI", true);
                                        //     console.log($(".timepicker").val())
                                        //     if ($(".timepicker").val() != "Pick up Time") {
                                        //         clearInterval(CardInterval)
                                        //         lastDetails(PaymentMethod);
                                        //     }
                                        // }, 1000)
                                    }
                                    // lastDetails(PaymentMethod);
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
            if ($("#cabPickupCity").val() == "Select City") {
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
            } else {
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
    $('#status7').click(function () {
        $('.confirmation_boxCab2').css('display', 'none')
        $('.confirmation_boxCabDiv').css('display', 'none')
        $('#pac-input').val('')
        //location.reload()
    });

    async function setLatLong(city) {
        let pl = JSON.parse(localStorage["pickupPoint"]);
        source_latitude = pl[city][0]["source_latitude"]
        // localStorage.setItem("source_latitude", pl[city][0]["source_latitude"]);
        source_longitude = pl[city][0]["source_longitude"]
        // localStorage.setItem("source_longitude", pl[city][0]["source_longitude"]);
        SourceCityName = pl[city][0]["source_city"]
    }

    const arrival_Airport = '';
    async function getPNR(bookingId) {

        document.getElementById("loader").style.display = "block"
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
        localStorage.setItem("PNR_Data", "Not-Found")
        PnrdataNotFound();
    }
    async function PnrdataNotFound() {
        // departure_Ads()
        $("#datepicker").val(moment().format('DD-MM-YYYY'))
        // $( "#datepicker" ).datepicker({ minDate: 0});
        //$(".journeyInfo").css("display", "none");
        $("#passenger_name").css("display", "none");
        $(".pnr_pickup").css("margin", "0 0px 6px 0");
        $(".form_mb").css("margin", "1.5% 0 1% 3%");

        if (localStorage["mobileNum"] != "undefined" && localStorage["mobileNum"] != undefined && localStorage["mobileNum"] != "null" && localStorage["mobileNum"] != null) {
            $("#mb_number").val(localStorage["mobileNum"]);
            checkVIP($("#mb_number").val())
        }

        Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Bac_ArrivalpageLoad");
    }

    function CheckBooking(bookingId) {
        let urlv = BaseAPIURL + domain + "/webapi/getCabdetailsByPNR?pnr=" + bookingId;
        // console.log(urlv)
        $.ajax({
            type: "GET",
            // dataType: "json",
            url: urlv,
            success: function (data) {
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
                Console.log("Booking check API not working")
            }
        });
    }

    $("#makeSerIconI").click(function () {
        if ($("#makeSerIconI").hasClass("fa-map-marker-alt")) {

            Track_analytics(localStorage["booking_id"], "C2ACustomer", "null", "null", "null", "null", "NULL", "NULL", "NON-PNRCurrentLocation_click");
        }
        if ($("#makeSerIconI").hasClass("fa-times")) {
            $("#makeSerIconI").removeClass("fa-times");
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
    }

    async function loadMojoMultiplier(CityCode) {
        var timeUpdate = moment().hour();
        if (timeUpdate >= "0" && timeUpdate <= "9") {
            timeUpdate = "0" + timeUpdate
        }
        const multiplier = await fetch(BaseAPIURL + domain + '/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=arrival&platform=BAC")
        const multiResponse = await multiplier.json()
        localStorage.setItem('multiResponseData', JSON.stringify(multiResponse))
        // console.log(multiResponseData)


    }


    async function multiplierFun(partner_Name, Cabtype, kilometer) {
        // console.log(partner_Name);
        var multiResponseData = JSON.parse(localStorage['multiResponseData'])
        MultiplierAmount = 0;
        if (multiResponseData.data.length > 0) {
            multiResponseData.data.every(element => {
                // console.log(element.partner)
                console.log(partner_Name)
                if ((element.partner.toLowerCase() == partner_Name.toLowerCase()) && (element.cab_type.toLowerCase() == Cabtype.toLowerCase())) {
                    MultiplierAmount = Number(Number(kilometer) * Number(element.amount_perKM));
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


    async function lastDetails(paymentMethod) {
        PaymentMethod = 'payment'
        document.getElementById("loader").style.display = "block";
        localStorage.removeItem("LoadTIMEUI")
        var cab_response = [];
        const departure = await fetch(BaseURL + domain + "/webapi/getCabPartnerData?city=" + arrivalAirport + "&category=" + BookingTrip_Type)
        // const departure = await fetch("https://preprod.mojoboxx.com/preprod/webapi/getCabPartnerData?city=" + arrivalAirport + "&category=" + BookingTrip_Type)
        const cab_res = await departure.json();
        // console.log(cab_res);
        for (let i in cab_res) {
            if (cab_res[i].platform.toLowerCase() != "host") {
                if (ShowSelfDrive == "yes") {
                    if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
                        cab_response.push(cab_res[i]);
                        document.getElementById("loader").style.display = "none";

                    }
                } else {
                    if ((cab_res[i].cab_category.includes(BookingTrip_Type)) && (cab_res[i].isArrival == "1") && (cab_res[i].pay_type.includes(PaymentMethod))) {
                        cab_response.push(cab_res[i]);
                        document.getElementById("loader").style.display = "none";
                    }
                }
            }
        }
        localStorage.setItem("cab_response", JSON.stringify(cab_response));
        // URLimg = JSON.stringify(cab_response[0].URL)
        //  localStorage.setItem("URLimg", JSON.stringify(cab_response[0].URL))
        if (ShowSelfDrive == "yes") {
            console.log(cab_response)
            console.log(localStorage["trip_type"])
            localStorage.setItem("partnercabType", "suv");
            await partnerSlider(cab_response, "suv", arrivalAirport, localStorage["trip_type"], paymentMethod);
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
        } else {
            localStorage.setItem("partnercabType", CabBookingType);
            $(".coming_soon").css("display", "block");
            // $(".titleLeft").each(function () {
            //     $(".titleLeft img").removeClass("active_cab");
            // });
            // $("." + CabBookingType + " img").addClass("active_cab");
            await partnerSlider(cab_response, CabBookingType, arrivalAirport, localStorage["trip_type"], paymentMethod);
        }

        getstate(pickup_lat, pickup_long);
        function getstate(lat, long) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + localStorage["mapKey"])
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log(responseJson)
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


    //////////////////////////// Advertising code start /////////////////////////////

    // async function departure_Ads() {
    //     // const ads = await fetch("https://preprod.mojoboxx.com/preprod/webapi/getDepartureAds")
    //     const ads = await fetch(BaseAPIURL+domain+"/webapi/getDepartureAds")
    //     const adResponse = await ads.json();
    //     // console.log(adResponse);

    //     for (let i = 0; i < adResponse.length; i++) {
    //             if (adResponse[i]["type"].toLowerCase() == "interstitial" && adResponse[i]["position"] == 1 && adResponse[i]["page_name"] == "arrival") {
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
    //                 }, closeTym);
    //             } else if (adResponse[i]["type"].toLowerCase() == "bottom-banner" && adResponse[i]["page_name"] == "arrival") {
    //                 document.getElementById("bottom_banner").innerHTML = ''
    //                 document.getElementById("bottom_banner").style.display = "block";
    //                 let interImg = document.createElement("img");
    //                 interImg.setAttribute("src", adResponse[i]["thumbnail"])
    //                 document.getElementById("bottom_banner").appendChild(interImg);
    //             }
    //             else if (adResponse[i]["type"].toLowerCase() == "top-banner" && adResponse[i]["page_name"] == "arrival") {
    //                 document.getElementById("top_banner").style.display = "block";
    //                 let interTop = document.createElement("img");
    //                 interTop.setAttribute("src", adResponse[i]["thumbnail"])
    //                 document.getElementById("top_banner").appendChild(interTop);


    //                 interTop.onclick = function(){
    //                     localStorage.setItem("Outstation", true)
    //                     localStorage.setItem("loadPagevalue", "outstation")
    //                     location.reload();
    //                     localStorage.setItem("PageReload", true);
    //                 }

    //             }
    //         // }
    //     }
    // }

    //////////////////////////// Advertising code end ///////////////////////////////

    ////////////////////////////// Load CashbackAmt code start //////////////////////////
    var CashbackAmt = ''
    const loadCashbackAmt = async (partnerName, citycode) => {
        return new Promise((resolve, reject) => {
            // fetch(`https://preprod.mojoboxx.com/preprod/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=departure&mojoPartner=SPICEJET`)
            fetch(`${BaseURL}${domain}/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=c2c&mojoPartner=Yatra`)
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
    var MojoFare = [];
    var cab_Type2 = [];
    let loadcashcab ;
    async function partnerSlider(cab_response, cabTypeName, cityType, cabCategory, pmthd) {
        let cab_BookingType = cabTypeName
        loadcashcab = false
        couponcodePayType == 'cashback' ? couponcodeType = couponcodePayType : couponcodeType = couponcodeType
        MojoFare = [];
        localStorage.removeItem('MojoboxxFare')
        var Comingsoon = 'show';
        scv = [];
        $(".coming_soon").css("display", "none");
        await loadMojoMultiplier(arrivalAirport)
        var swiper = "";
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        let one = 0;
        MojoFare.length = 0;
        $("#swiperDiv").addClass("activeSwiper")
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
                    cab_Type = cab_response[i].cab_type_arrival.split(",");
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
                        cab_Image = cab_response[i].partner_image_arrival.split(",");
                        for (let j = 0; j < clc; j++) {
                            if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                                PaymentMethod = 'payment';
                                loadcashcab = true
                                cab_Type2 = cabTypeName
                                one = 1;
                                // var timestamp = new Date().getUTCMilliseconds();
                                $(".coming_soon").css("display", "none");


                                let cabpartnername;
                                if(cab_response[i].card_load  == "multiple_card")
                                {
                                    cabpartnername = cab_response[i].partner_name;
                                }  
                                else if (((cabTypeName == "sedan") && (pmthd == "payment")) || ((cabTypeName == "sedan") && (cab_response[i].card_load == "BOTH"))) {
                                    const Partnr = await loadPartnerData(cab_city[jk]);
                                    cabpartnername = Partnr;
                                }
                                else {
                                    cabpartnername = cab_response[i].partner_name;
                                }

                                let swiperSlide = document.createElement("div");
                                swiperSlide.setAttribute("class", "swiper-slide")
                                // swiperSlide.setAttribute("id","sj"+timestamp);

                                let partner_card = document.createElement("div");
                                partner_card.setAttribute("class", "cab_mid");
                                partner_card.setAttribute("id", cabpartnername);

                                $('#Loading_Img').css('display', 'none')
                                //............................................................................................................//
                                if (cab_response[i].farecard_type == 'mojofare') {
                                    // partner_card.setAttribute("class", "cab_mid fare_cardSize");
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

                                    swiperSlide.appendChild(partner_card);
                                    document.getElementById("swiper-wrapper").appendChild(swiperSlide);
                                }
                                else {
                                    $('#Loading_Img').css('display', 'none')
                                    let partner_cardImg = document.createElement("img");
                                    if (cabTypeName.toLowerCase() == "hatchback") {
                                        partner_cardImg.setAttribute("src", cab_Image[j]);
                                    }
                                    else if (cabTypeName.toLowerCase() == "sedan") {
                                        partner_cardImg.setAttribute("src", cab_Image[j]);
                                    }
                                    else if (cabTypeName.toLowerCase() == "suv") {
                                        partner_cardImg.setAttribute("src", cab_Image[j]);
                                    }
                                    partner_card.appendChild(partner_cardImg);

                                    swiperSlide.appendChild(partner_card);
                                    document.getElementById("swiper-wrapper").appendChild(swiperSlide);

                                    // var topheading = document.createElement("div");
                                    // topheading.setAttribute("class", "partner_title")
                                    // var textTitle = document.createElement("p");
                                    // textTitle.setAttribute("class", "title_text")
                                    // var textMode = document.createTextNode("Powered By")
                                    // topheading.appendChild(textTitle)
                                    // textTitle.appendChild(textMode)
                                    // partner_card.appendChild(topheading)
                                    // logoImg.setAttribute("class","logoImg")

                                    // var LogoDiv = document.createElement("div");
                                    // LogoDiv.setAttribute("class", "Partner_Logo")
                                    // var logoImg = document.createElement("img");
                                    // logoImg.setAttribute("class", "logoImg")
                                    // logoImg.setAttribute("src", cab_response[i].partner_image_arrival)
                                    // LogoDiv.appendChild(logoImg);
                                    // partner_card.appendChild(LogoDiv)

                                }

                                scv.push(cabpartnername);
                                await myFunction(scv[0])
                                localStorage.setItem("partnerName", scv[0]);

                                var footerDiv = document.createElement("div");
                                footerDiv.setAttribute("class", "bottomDiv");

                                var percent = document.createElement("p")
                                percent.setAttribute("class", "perdiscount")
                                percent.setAttribute("id", "discount" + cabpartnername)
                                percent.innerHTML = "15% off"
                                footerDiv.appendChild(percent);

                                var discount = document.createElement("div");
                                discount.setAttribute("id", "discount")
                                var disSpan = document.createElement("span")
                                disSpan.innerHTML = ""
                                var disSpan2 = document.createElement("span")
                                disSpan2.setAttribute("id", "pr2" + cabpartnername);
                                disSpan2.innerHTML = "Rs. --";

                                discount.appendChild(disSpan);
                                discount.appendChild(disSpan2);
                                footerDiv.appendChild(discount);

                                var fare = document.createElement("div");
                                fare.setAttribute("id", "fare")
                                // if (cab_response[i].farecard_type == 'mojofare') {
                                //     fare.setAttribute("class", "farePricetext")
                                // }
                                var Fare_para = document.createElement("span")
                                Fare_para.innerHTML = ""
                                var Fare_para2 = document.createElement("span")
                                Fare_para2.setAttribute("id", "pr" + cabpartnername);
                                Fare_para2.innerHTML = "RS. --";

                                fare.appendChild(Fare_para);
                                fare.appendChild(Fare_para2);
                                footerDiv.appendChild(fare);
                                var includeLine = document.createElement("p")
                                includeLine.setAttribute("class", "include")
                                if ((cabpartnername == "SAVAARI") || (cabpartnername == "QUICKRIDE") || (cabpartnername == "BLUSMART") || (cabpartnername == "MEGA")) {
                                    includeLine.innerHTML = "Inclusive of airport tolls and taxes"
                                } else if (cab_response[i].farecard_type == 'mojofare') {
                                    includeLine.innerHTML = ""
                                } else {
                                    includeLine.innerHTML = "Exclusive of airport tolls and taxes"
                                } footerDiv.appendChild(includeLine);
                                partner_card.appendChild(footerDiv);

                                var distPara = document.createElement("p");
                                distPara.setAttribute("id", "distPara")
                                // if (cab_response[i].farecard_type == 'mojofare') {
                                //     distPara.setAttribute("class", "distpara1")
                                // }
                                distPara.innerHTML = "Estimated Distance"
                                partner_card.appendChild(distPara);
                                var distance = document.createElement("div");
                                distance.setAttribute("id", "dist")
                                // if (cab_response[i].farecard_type == 'mojofare') {
                                //     distance.setAttribute("class", "distKm ")


                                // }

                                var para2 = document.createElement("span")
                                para2.setAttribute("id", "km" + cabpartnername);
                                para2.innerHTML = "--- Km";
                                distance.appendChild(para2);

                                partner_card.appendChild(distance);
                                localStorage.removeItem("finalFare" + cabpartnername);
                                localStorage.removeItem("MojoFare" + cabpartnername);
                                await multiplierFun(cabpartnername, cabTypeName, KMNum)

                                if (cab_city[jk] == "DXB") {
                                    $(".perdiscount").css("display", "none")
                                    $("#discount").css("display", "none")
                                    await getOptiondubai(cabpartnername);
                                } else {
                                    const cashback = await loadCashbackAmt(scv[0], cityType)

                                    // if (couponCodeValue == 0 || couponcodeType == 'cashback' || couponcodeType == 'discount') {
                                    //     couponCodeValue = defaultCashback
                                    //     couponcodeType = 'discount'
                                    // }
                                    if (couponCodeValue == 0 || couponcodeType == 'cashback' || couponcodeType == 'discount') {
                                        if (couponDiscountAmt != 0 && couponcodeType == 'discount') {
                                            couponCodeValue = couponDiscountAmt
                                        }
                                        else {
                                            couponCodeValue = defaultCashback
                                        }
                                        couponcodeType = 'discount'
                                    }
                                    // alert(cab_response[i].farecard_type)
                                    if (cab_response[i].farecard_type == 'mojofare') {
                                        // let FixfareCardDetails = await loadPartnerData();
                                        // console.log(MojopartnerReset);
                                        let MojofareCalculate = await loadFareFromMojoboxx(cabpartnername, cab_city[jk], KMNum, cab_Type[j].toLowerCase());
                                        MojoFare.push(localStorage["MojoFare" + cabpartnername]);
                                        // console.log(MojoFare)
                                        //actualAmount.push(localStorage["MojoFare" + cabpartnername])
                                        localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]));
                                    }
                                    else {
                                        if (cabpartnername) {
                                            let fareCalculate = await calculatePricePartnerWise(cabpartnername, KMNum, cab_Type[j], cab_city[jk]);
                                            cabFare.push(localStorage["finalFare" + cabpartnername]);
                                            localStorage.setItem("partnerFare", parseInt(cabFare[0]));
                                        }
                                    }
                                    document.getElementById("km" + cabpartnername).innerHTML = KMVal + "s";
                                }

                                if (ShowSelfDrive != "yes") {
                                    if ((scv[0] == "QUICKRIDE") || (scv[0] == "BLUSMART") || (scv[0] == "MERU") || (scv[0] == "SAVAARI") || (scv[0] == "MEGA") || (scv[0] == "GOZO CABS" || (scv[0] == "BUDDY CABS") || (scv[0] == "GOAMILES") || (scv[0] == "EEE TAXI"))) {
                                        $(".bookBtn").css("display", "flex")
                                        $("#greyedbtn").css("display", "none")

                                        // $('.agreeBox').css('margin-bottom', '20%')
                                        // $('#paymentoptions').css("display", "block")
                                        $("#ConfirmButton").css("display", "none")

                                        if (cab_response[i].farecard_type != 'mojofare') {
                                            if (cabFare[0] == "undefined" || cabFare[0] == undefined || cabFare[0] == null) {
                                                $("#ConfirmButton").css("display", "none")
                                                $(".bookBtn").css("display", "none")
                                                $('#paymentoptions').css("display", "none")
                                            }
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
                                        // $("#part").prop("checked", true)

                                    }

                                    if (cab_response[i].farecard_type == 'mojofare') {
                                        // $("#part").prop("checked", true);
                                        $("#PayByCash").css("display", "none")
                                        $("#PayBypaytm").css("display", "block")
                                        $("#radioBox1").css("display", "block")
                                        document.getElementById("radioBox2").style.display = "none";

                                        PaymentAmt = MojoFare[0]
                                        PaymentLater = MojoFare[0]

                                        await updateOptionsAmount()

                                        // document.getElementById("PayNow").innerHTML = " ₹ " + MojoFare[0]
                                        // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojoFare[0]) + Number(100))
                                        // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojoFare[0]))
                                    }
                                    else {
                                        $("#radioBox1").css("display", "block")
                                        $("#radioBox2").css("display", "flex")

                                        PaymentAmt = cabFare[0]
                                        PaymentLater = cabFare[0]

                                        await updateOptionsAmount()

                                        // document.getElementById("PayNow").innerHTML = " ₹ " + cabFare[0]
                                        // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[0]) + Number(100))
                                        // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[0]))
                                    }

                                    if (localStorage["removecash"] == "yes") {
                                        $("#radioBox2").css("display", "none")
                                    }
                                    else if (localStorage["removecash"] == "no") {
                                        $("#radioBox2").css("display", "flex")
                                    }

                                    // const cashback = await loadCashbackAmt(scv[0], cityType)
                                    const allWithClass = Array.from(
                                        document.querySelectorAll('.cashbackAMt')
                                    );
                                    allWithClass.forEach(element => {
                                        if (CashbackAmt == 0) {
                                            $(".discountSpan").css("display", "none")
                                        }
                                        else {
                                            element.innerHTML = CashbackAmt
                                        }
                                    });
                                }
                                // $(".auto_btn").addClass("btn_enable");
                                // $("#continue").removeAttr('disabled');
                                // $("#continue").css("color", "white");

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
        }
        if(loadcashcab)
        {
            await paymentoptionLoad(cab_BookingType)
        }
    }




    async function calculatePricePartnerWise(partnerName, KMNum, cabTyp, cityName, PaymentMethod = 'payment') {

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
                // $("#prQUICKRIDE").html("Please wait..")
                $("#prQUICKRIDE").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let quickrideResp = await GetFarefromPartner(cabTyp, PaymentMethod);
                resolve(true);
            }
            else if (partnerName == "MEGA") {
                // $("#prMEGA").html("Please wait..")
                $("#prMEGA").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let megaResp = await GetFareFromMega(cabTyp, PaymentMethod);
                resolve(true);
            }
            else if (partnerName == "MERU") {
                // alert()
                // $("#prMERU").html("Please wait..")
                $("#prMERU").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let MeruResp = await GetFarefromMeru(cabTyp, PaymentMethod);
                resolve(true);
            }
            else if (partnerName == "BUDDY CABS") {
                // $("#prBUDDY CABS").html("Please wait..")
                $("#prBUDDY CABS").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let BuddyFare = await GetFarefromPartnerBuddy(cabTyp, PaymentMethod);
                resolve(true);
            } else if (partnerName == "GOZO CABS") {
                let gozofare = await GetFareFromGozoPartner(cabTyp, PaymentMethod)

                resolve(true);
            } else if (partnerName == "COOP") {
                $("#pr2COOP").css("display", "none");
                // $("#prCOOP").html("Please wait..");
                $("#prCOOP").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let coopFare = await coop_call(cabTyp, PaymentMethod);
                resolve(true);
            } else if (partnerName == "GOAMILES") {
                $("#pr2GOAMILES").css("display", "none");
                // $("#prCOOP").html("Please wait..");
                $("#prGOAMILES").css("font-size", "12px !impotant");
                $("#fare").css("width", "100%");
                let GOAMILESFare = await checkFareGoamiles(cabTyp);
                resolve(true);
            } else if (partnerName == "SAVAARI") {
                $("#pr2SAVAARI").css("display", "none");
                // $("#prSAVAARI").html("Please wait..")
                $("#prSAVAARI").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let savaariFare = await GetFareFromSavvariPartner(cabTyp, PaymentMethod)
                resolve(true)
            }
            else if (partnerName == "BLUSMART") {
                $("#pr2BLUSMART").css("display", "none");
                // $("#prBLUSMART").html("Please wait..");
                $("#prBLUSMART").css("font-size", "12px !important");
                $("#fare").css("width", "100%");
                let BLUMSMARTfare = await checkFareBlusmart(cabTyp, PaymentMethod);
                resolve(true);
            }
            else {
                await loadCityName(cityName)
                $(".bookBtn").css("display", "none")
                var fareData = await loadFareFormDB(partnerName, cityNameFetch, distanceP, cabTyp.toLowerCase(), PaymentMethod);
                resolve(fareData);
            } resolve(true)
        })
    }
    ///////////////////// Payment option on changes//////////////////////

    ///////////////////// Payment option on changes//////////////////////


    const updateOptionsAmount = (async () => {

        // console.log(couponCodeValue)
        // console.log(PaymentAmt)
        //console.log((parseInt(PaymentAmt) + parseInt(couponCodeValue)));
        var amountinpaid = (parseInt(PaymentAmt) + parseInt(couponCodeValue))
        // console.log(amountinpaid);
        if (couponCodeValue != 0 && couponcodeType == 'discount') {
            document.getElementsByClassName("DiscountDiv")[0].style.display = "block"
            document.getElementById("cabDiscount").innerHTML = couponCodeValue
            document.getElementById("DiscountAmt").style.display = "block"
            $(".cashbackSpan").css("display", "none")
            document.getElementById("DiscountAmt").innerHTML = "₹" + (parseInt(PaymentAmt) + parseInt(couponCodeValue))
        }
        else {
            $(".cashbackSpan").css("display", "block")
            document.getElementsByClassName("DiscountDiv")[0].style.display = "none"
            document.getElementById("DiscountAmt").style.display = "none"
        }
        // if (couponCodeValue != 0 && couponcodeType == 'discount') {
        //     document.getElementsByClassName("DiscountDiv")[0].style.display = "block"
        //     document.getElementById("cabDiscount").innerHTML = couponCodeValue
        //     document.getElementById("DiscountAmt").style.display = "block"
        //     $(".cashbackSpan").css("display", "block")
        //     document.getElementById("DiscountAmt").innerHTML = "₹" + (parseInt(PaymentAmt) + parseInt(couponCodeValue))
        // }
        // document.getElementById("PayNow").innerHTML = ''
        //document.getElementById("PayNow").innerHTML = " ₹ " + parseInt(finalAmount) + Number(50)
        document.getElementById("PayNow").innerHTML = " ₹ " + PaymentAmt
        // document.getElementById("PayLater").innerHTML = " ₹ " + PaymentLater
        $(".cashbackSpan").css("display", "block")
        // if (document.querySelector('input[name="paymentoption"]:checked').value == "PayLater") {
        //     document.getElementById("PayNow").innerHTML = ''
        //     document.getElementById("PayLater").innerHTML = " ₹ " + PaymentLater
        //     $(".cashbackSpan").css("display", "block")

        // }
        // if (document.querySelector('input[name="paymentoption"]:checked').value == "PayNow") {
        //     if (couponCodeValue != 0 && couponcodeType == 'discount') {
        //         document.getElementsByClassName("DiscountDiv")[0].style.display = "block"
        //         document.getElementById("cabDiscount").innerHTML = couponCodeValue
        //         document.getElementById("DiscountAmt").style.display = "block"
        //         $(".cashbackSpan").css("display", "none")
        //         document.getElementById("DiscountAmt").innerHTML = "₹" + (parseInt(PaymentAmt) + parseInt(couponCodeValue))
        //     }
        //     else {
        //         console.log("else")
        //         $(".cashbackSpan").css("display", "block")
        //         document.getElementsByClassName("DiscountDiv")[0].style.display = "none"
        //         document.getElementById("DiscountAmt").style.display = "none"
        //     }
        //     document.getElementById("PayNow").innerHTML = " ₹ " + PaymentAmt
        //     document.getElementById("PayLater").innerHTML = ''
        // }
    })

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
                let currentSliderValue = scv[swiper.activeIndex];
                let currentSliderFare = cabFare[swiper.activeIndex];

                // let currentSliderType = cabTypeName[swiper.activeIndex];
                localStorage.setItem("partnerName", currentSliderValue);
                localStorage.setItem("partnerFare", parseInt(currentSliderFare) + parseInt(couponCodeValue));
                localStorage.setItem("partnercabType", cab_Type2);
                await myFunction(currentSliderValue)

                if (ShowSelfDrive != "yes") {
                    if ((currentSliderValue == "QUICKRIDE") || (currentSliderValue == "BLUSMART") || (currentSliderValue == "MERU") || (currentSliderValue == "EEE TAXI") || (currentSliderValue == "MEGA") || (currentSliderValue == "GOZO CABS") || (currentSliderValue == "BUDDY CABS"))
                    // else if((currentSliderValue == "BLUSMART") || (currentSliderValue == "MERU") || (currentSliderValue == "MEGA"))
                    {
                        // $("#ConfirmButton").css("display", "none")
                        $("#radioBox1").css("display", "block")
                        // $("#PayBycash").css("display", "block")
                        // $("#PayBypaytm").css("display", "none")
                        $(".bookBtn").css("display", "flex")
                        $("#greyedbtn").css("display", "none")
                        // $('.agreeBox').css('margin-bottom', '20%')
                        // $('#paymentoptions').css("display", "block")


                        // if((localStorage.getItem("Pictime").split(":")[0] >=0 )&&(localStorage.getItem("Pictime").split(":")[0] <8 )){
                        //     $('#radioBox2').css("display", "none")  
                        // }

                        const cashback = await loadCashbackAmt(currentSliderValue, arrivalAirport)
                        const allWithClass = Array.from(
                            document.querySelectorAll('.cashbackAMt')
                        );
                        allWithClass.forEach(element => {
                            if (CashbackAmt == 0) {
                                $(".discountSpan").css("display", "none")
                            }
                            else {
                                element.innerHTML = CashbackAmt
                            }
                        });

                        PaymentAmt = cabFare[swiper.activeIndex]
                        PaymentLater = cabFare[swiper.activeIndex]

                        await updateOptionsAmount()


                        if (currentSliderFare == "undefined" || currentSliderFare == undefined || currentSliderFare == null) {
                            $("#ConfirmButton").css("display", "none")
                            $(".bookBtn").css("display", "none")
                            $('#paymentoptions').css("display", "none")

                            // $('.agreeBox').css('margin-bottom','20%')
                        }
                        $("#ConfirmButton").css("display", "none")
                    }
                    else {

                        $("#ConfirmButton").css("display", "block")
                        $(".bookBtn").css("display", "none")
                        $("#radioBox1").css("display", "none")
                        // $('.agreeBox').css('margin-bottom', '0px')
                        $('.coupon_block').css('margin-top', '15%')
                        $('#paymentoptions').css("display", "none")
                    }
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
    //     if(document.getElementById("part").checked){
    //         // BookMycab('RAZORPAY',"part")
    //         BookMycab('PAYTM', "part")
    //     }
    //     else if(document.getElementById("full").checked){
    //         // BookMycab('RAZORPAY',"full")
    //         BookMycab('PAYTM', "full")
    //     }
    // }
    // document.getElementById("PayBypaytm").onclick = function () {
    //     BookMycab('RAZORPAY',"full")
    // }





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
    document.getElementById("paynowapprov").onclick = function () {
        BookMycab('NewPayment')
    }


    async function BookMycab(PAYMENT_TYPE, paytp) {
        if ($('#terms_condition').is(":checked")) {
        }
        else {
            $("#cmmsg").html("Please agree to the terms & conditions");
            $(".thank_msg i").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            // $("#continue").val("Confirm pickup")
            return false;
        }

        if (cityCODE.trim() != "GOI") {
            if ($("#email_id").val() == '' || $("#email_id").val() == undefined) {
                $("#cmmsg").html("Enter your email id");
                $(".thank_msg i").css("display", "none")
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }
        }
        if (cityCODE.trim() == "GOI") {
            if ($("#user_name").val() == '' || $("#user_name").val() == undefined) {
                $("#cmmsg").html("Enter your name");
                $(".thank_msg i").css("display", "none")
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }
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
        }
        else {
            if ($(".timepicker").val() == "Pick up Time") {
                $("#cmmsg").html("Choose Pickup Date & Time");
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
            if (SourceCityName != "Dubai") {
                if ($("#pac-input").val() == "" || $("#pac-input").val() == undefined || $("#pac-input").val() == "undefined") {
                    $("#cmmsg").html("Please Enter your location ");
                    $(".thank_msg i").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    return false
                }
            }
            if (SourceCityName == "Dubai") {
                if ($("#dubai").val() == "") {
                    $("#cmmsg").html("Please Enter your location ");
                    $(".thank_msg i").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    return false
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

            var dateValue = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
            var currentTime = moment().format('YYYY-MM-DD HH:mm')
            if (currentTime > dateValue) {
                $("#cmmsg").html("You have selected an invalid pickup time.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }

            if (localStorage["partnerName"] == "SAVAARI") {
                var travelTime = moment().add(240, 'minutes').format("YYYY-MM-DD HH:mm");
                if (dateValue < travelTime) {
                    $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 4 hours later than current time.");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    return false;
                }
            }

            // if (localStorage["partnerName"] == "GOZO CABS") {
            //     var travelTime = moment().add(190, 'minutes').format("YYYY-MM-DD HH:mm");
            //     if (dateValue < travelTime) {
            //         $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 3 hours later than current time.");
            //         $(".thank_msg i").removeClass("fa-check-circle");
            //         $(".confirmation_boxCabDiv").css("display", "block");
            //         $(".confirmation_boxCab").css("display", "block");
            //         return false;
            //     }
            // }


            // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
            localStorage.setItem("ptnr", localStorage["partnerName"]);


            if (localStorage["PNR_Data"] == "Found") {
                var final_data = JSON.parse(localStorage["pnrData"])
                var customerFName = final_data[0].FirstName;
                var customerLName = final_data[0].LastName;
                var title = final_data[0].Title;
            }
            $(".spinner").css("display", "block")
            $(".spinnerBack").css("display", "block")

            var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];
            if (SourceCityName != "Dubai") {
                var price = parseInt(String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"]);
                // var price = "1";
                var total_km = KMVal.split(" ");
                totalkm = total_km[0];
            }

            $("#continue").val("Please wait..")

            localStorage.setItem("mobileNum", $("#mb_number").val())
            sessionStorage.setItem("MobileNum", $("#mb_number").val())

            var FarePrice;

            // if (SourceCityName.toLowerCase() == "dubai") {
            //     FarePrice = String(dubaiFare).split(" ")[1]
            // }




            if (String(document.getElementById("PayNow").innerHTML).includes("₹")) {
                content_id = (String(document.getElementById("PayNow").innerHTML).split("₹")[1].trim())
            }
            else {
                content_id = (String(document.getElementById("PayNow").innerHTML).trim())
            }
            ///////
            if (couponCodeValue == 0) {
                fare_price = content_id
            }
            else {
                if (String(document.getElementById("DiscountAmt").innerHTML).includes("₹")) {
                    fare_price = (String(document.getElementById("DiscountAmt").innerHTML).split("₹")[1].trim())
                }
                else {
                    fare_price = (String(document.getElementById("DiscountAmt").innerHTML).trim())
                }
            }

            if ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) {
                localStorage["ptnr"] = localStorage["ptnr"]
            }
            else {
                localStorage["ptnr"] = ''
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
            let Partner_nm = ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["ptnr"].trim() : (localStorage["partnercabType"].trim() == 'suv') ? 'QUICKRIDE' : MojoPartnerName
            let serviceCharge = ((localStorage["ptnr"] == "QUICKRIDE") || (localStorage["ptnr"] == "GOZO CABS") || (localStorage["ptnr"] == "BLUSMART") || (localStorage["ptnr"] == "MERU") || (localStorage["ptnr"] == "SAVAARI") || (localStorage["ptnr"] == "MEGA") || (localStorage["ptnr"] == "BUDDY CABS")  || (localStorage["ptnr"] == "EEE TAXI") || (localStorage["ptnr"] == "GOAMILES")) ? localStorage["multiplier" + Partner_nm] : 0
            // /////////////////// Load data to create JSON for cab booking code end ////////////////////////
            dataJ = {
                "clubMember": [
                    {
                        "type": "cabForm",
                        "name_title": localStorage["PNR_Data"] == "Found" ? title : '',
                        "user_name": cityCODE.trim() == "GOI"?($("#user_name").val()):"Customer",                       
                        "last_name": "Customer",
                        "mobile": $("#mb_number").val(),
                        "email": $("#email_id").val(),
                        "time": Date.now(),
                        "sendLeadSms": "true",
                        "partnerName": Partner_nm,
                        "title": localStorage["ptnr"].trim(),
                        "category": "CAB",
                        "drop_location": SourceCityName.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100),
                        "pickup_time": pickup_time,
                        "cab_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["partnercabType"] : (localStorage["partnercabType"] == 'hatchback') ? 'sedan' : localStorage["partnercabType"],
                        "cab_id": localStorage["ptnr"] == "GOZO CABS" ? GOZOFareId : (localStorage["ptnr"] == "GOAMILES") ? GoamilesvehicleTyp : 0,
                        "fare_price": fare_price,
                        "total_kilometers": SourceCityName.toLowerCase() == "dubai" ? parseInt(dubaiDistance) : totalkm,
                        "terminalCode": cityCODE.trim() == "DEL" ? $("#cabPickupTerminal :selected").text().trim().split("-")[1] : TerminalCode,
                        "msgUniqueId": getRandom(10),
                        "host_id": "Website",
                        "from_city": cityCODE.trim(),
                        "to_city": cityCODE.trim(),
                        "source": $("#cabPickupTerminal :selected").text().trim(),
                        "destination": SourceCityName.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100).trim(),
                        "latitude": source_latitude,
                        "longitude": source_longitude,
                        "isDeparture": 2,
                        "pnr": localStorage["booking_id"],
                        "source_city": SourceCityName.trim(),
                        "source_latitude": source_latitude,
                        "source_longitude": source_longitude,
                        "source_name": $("#cabPickupTerminal :selected").text().trim(),
                        "destination_city": SourceCityName.toLowerCase() == "dubai" ? "Dubai" : SourceCity.trim(),
                        "destination_latitude": SourceCityName.toLowerCase() == "dubai" ? dubaiLat : pickup_lat,
                        "destination_longitude": SourceCityName.toLowerCase() == "dubai" ? dubaiLong : pickup_long,
                        "destination_name": SourceCityName.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100),
                        "status": "CAB",
                        "card_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? '' : 'mojoFixFare',
                        "content_id": content_id,
                        "mojoPartner": sessionStorage["MojoboxxURL_booking"] == "Mojoboxx" ? "Mojoboxx" : "Yatra",
                        "order_reference_number": "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
                        "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                        "fixedFareId": localStorage["ptnr"] == "QUICKRIDE" ? quickrideFareId : localStorage["ptnr"] == "MERU" ? localStorage["meruSearchId"] : localStorage["ptnr"] == "MEGA" ? localStorage["megaSearchId"] : localStorage["ptnr"] == "GOAMILES" ? Goamilesfareid : "",
                        "website_url": sessionStorage["MojoboxxURL_booking"] == "Facebook" ? "Facebook" : "yatra_arrival_url",
                        "user_agent": localStorage["userAgent"],
                        "service_charge": serviceCharge,
                        "pay_type": 'post',
                        'paymentMethod': 'PAYBYCASH',
                        'state': stateforinvoice,
                        'advance_amount': ((Number(localStorage["TotalFare"]) - Number(serviceCharge)) + (Number(couponCodeValue))),
                        'discount_type': couponcodeType,
                        'discount_amount': couponCodeValue
                        //     'discount_type': document.querySelector('input[name="paymentoption"]:checked').value == "PayNow" ? couponcodeType : 'cashback',
                        //     'discount_amount': document.querySelector('input[name="paymentoption"]:checked').value == "PayNow" ? couponCodeValue : 0
                        // }
                    }]
            };
            localStorage.setItem("departurebookingData", JSON.stringify(dataJ));
            localStorage.setItem("arrivalbookingData", JSON.stringify(dataJ));


            if ((dataJ.card_type != 'mojoFixFare') && (MojopartnerReset == 1)) {
                fetch(`${BaseAPIURL}${domain}/webapi/partnerBookingCountReset?isReset=1&cityCode=${localStorage["cityCODE"]}&travelType=arrival`)
            }

            // $("#mainDetails").css('display', 'block')
            // $('#popup_card').empty()

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

            // $('#price_km').text(localStorage["KMVal"])
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
            // if (dataJ.clubMember[0]['destination'].length > 76) {
            //     $('#source_').text(dataJ.clubMember[0]['destination'].substring(0, 75))
            // }
            // else {
            //     $('#source_').text(dataJ.clubMember[0]['destination'])
            // }

            // if (dataJ.clubMember[0]['source'].length > 76) {
            //     $('#destination_').text(dataJ.clubMember[0]['source'].substring(0, 75))
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
    }
    // //////////////////// Submit Page form data code end ///////////////////////


    async function fullDetails(PAYMENT_TYPE, paytp, price, dataJ) {
        if (PAYMENT_TYPE == "RAZORPAY" && paytp == "full") {
            await addPaymentType('RAZORPAY', '', '', 'full_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "RAZORPAY" && paytp == "part") {
            await addPaymentType('RAZORPAY', '', '', 'partial_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "PAYTM" && paytp == "full") {
            await addPaymentType('PAYTM', '', '', 'full_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "PAYTM" && paytp == "part") {

            await addPaymentType('PAYTM', '', '', 'partial_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "NewPayment") {
            $(".spinner").css("display", "none")
            $(".spinnerBack").css("display", "none")
            window.location.href = 'payment.html'
        }
        else {
            $.ajax({
                type: 'POST',
                url: BaseAPIURL + domain + '/webapi/cabRegistration',
                // url: 'https://preprodapi.mojoboxx.com/spicescreen/webapi/cabRegistration',
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (response) { // console.log(response);
                    if (response.status == 200) {

                        $("#continue").prop("disabled", true);
                        location.href = "cab_confirm.html";
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                        //localStorage.setItem("departurenotify", URLimg);
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
                    $("#cmmsg").html("Booking failed");
                    $(".spinner").css("display", "none")
                    $(".spinnerBack").css("display", "none")
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                }
            });
        }
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
    $(".hatchback").click(async function () {
        if (OutstationShow == "no") {
            if (localStorage["cityCODE"] == "DEL" && MojoPartnerName == "BLUSMART") {
                localStorage.setItem("partnercabType", "sedan");
                CabBookingType = 'sedan'
                $(".titleLeft").each(function () {
                    $(".titleLeft img").removeClass("active_cab");
                });
                $(".hatchback img").addClass("active_cab");
                lastDetails(PaymentMethod);
            }
            else {
                localStorage.setItem("partnercabType", "hatchback");
                CabBookingType = 'hatchback'
                $(".titleLeft").each(function () {
                    $(".titleLeft img").removeClass("active_cab");
                });
                $(".hatchback img").addClass("active_cab");
                lastDetails(PaymentMethod);
            }
        }
    })

    $(".sedan").click(async function () {
        if (OutstationShow == "no") {
            localStorage.setItem("partnercabType", "sedan");
            CabBookingType = 'sedan'
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".sedan img").addClass("active_cab");
            let cab_response = JSON.parse(localStorage["cab_response"]);
            lastDetails(PaymentMethod);
            // await partnerSlider(cab_response, "sedan", arrivalAirport, localStorage["trip_type"]);
        }
    })

    $(".suv").click(async function () {
        if (OutstationShow == "no") {
            localStorage.setItem("partnercabType", "suv");
            CabBookingType = 'suv'
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
            let cab_response = JSON.parse(localStorage["cab_response"]);
            lastDetails(PaymentMethod);
            // await partnerSlider(cab_response, "suv", arrivalAirport, localStorage["trip_type"]);
        }
    })
    // ///////////////// Cab Img click code end /////////////////////////////

    // /////////////// Fetch city name from city code - CODE START ///////////////
    var cityNameFetch;
    async function loadCityName(citycode) {

        var cityData = JSON.parse(localStorage["pickupPoint"])
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
                    if (PaymentMethod == 'cash') {
                        let finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
                        localStorage.setItem("cashMojoFare", finalAmount)
                        localStorage.setItem("cashfinalFare"+partnerName, finalAmount);
                        localStorage.setItem("TotalFare", finalAmount);
                        resolve(finalAmount)
                    }
                    else {
                        let finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
                        document.getElementById("discount" + partnerName).innerHTML = dis2 + "% off"
                        document.getElementById("pr" + partnerName).innerHTML = " ₹ " + (parseInt(finalAmount))
                        document.getElementById("pr2" + partnerName).innerHTML = "₹" + (
                            Number(finalAmount) + Number(50)
                        )
                        localStorage.setItem("finalFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount)) - Number(couponCodeValue)))
                        resolve(desP);
                    }
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
    async function loadPartnerData(cityName) {
        return new Promise(async function (resolve, reject) {
            fetch(`${BaseAPIURL}${domain}/webapi/mojofixBookingCount?city=${cityName}&type=arrival`, {
                // fetch(`https://preprodapi.mojoboxx.com/preprod/webapi/mojofixBookingCount?city=${cityName}&type=arrival`, {
                method: 'GET'
            }).then(response => response.json())
                .then(json => {
                    if (json.data.length >= 1) {
                        // console.log(json);
                        let CountArr = [];
                        for (let k in json.data) {
                            if (json.data[k].travel_type == "arrival" && (json.data[k].city == $('#cabPickupCity').find(":selected").val())) {
                                CountArr.push(json.data[k])
                            }
                        }
                        // console.log(CountArr)

                        for (let k in CountArr) {
                            let JSONLength = CountArr.length;
                            if ((CountArr[k].Bcount < CountArr[k].Tcount)) {
                                MojoPartnerName = CountArr[k].partner
                                resolve(MojoPartnerName);
                                return false
                            }
                            else if ((CountArr[JSONLength - 1].Bcount == CountArr[JSONLength - 1].Tcount) || (CountArr[JSONLength - 1].Bcount > CountArr[JSONLength - 1].Tcount)) {
                                MojopartnerReset = 1
                                MojoPartnerName = CountArr[0].partner
                                // console.log(CountArr[0].partner)
                                resolve(MojoPartnerName);
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
        console.log(distance)
        if(String(distance).includes(" "))
        {
            distance = String((distance).split(" ")[0])
            
        }
        var desP;
        var hypen_pos;
        var dis;
        var dis2;
        var amt;
        return new Promise(async function (resolve, reject) {
            fetch(BaseAPIURL + domain + '/webapi/mojoboxxfixfare?cab_type=' + cabType + '&km=' + distance + '&city_code=' + cityName + '&travel_type=arrival&isReset=' + MojopartnerReset, { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
                desP = json.data[0].Fare;
                localStorage.setItem("mojoboxxfixfarepartner", json.data[0].partner)
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
                    if (PaymentMethod == 'cash') {
                        let finalAmount;
                        if (couponCodeValue != 0 && couponcodeType == 'discount') {
                            finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
                            localStorage.setItem("cashMojoFare" + partnerName,finalAmount)
                        }
                        else {
                                finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)))
                                localStorage.setItem("cashMojoFare" + partnerName,finalAmount)
                        }
                        localStorage.setItem("TotalFare", finalAmount);
                        resolve(finalAmount)
                    }
                    else {
                        let finalAmount;
                        if (couponCodeValue != 0 && couponcodeType == 'discount') {
                            finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
                            localStorage.setItem("MojoFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount)) - Number(couponCodeValue)))
                        }
                        else {
                            finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)))
                            localStorage.setItem("MojoFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount))))
                        }
                        document.getElementById("pr" + partnerName).innerHTML = " ₹ " + (parseInt(finalAmount))
                        document.getElementById("pr2" + partnerName).innerHTML = "₹" + (
                            parseInt(finalAmount) + Number(50)
                        )
                        localStorage.setItem("TotalFare", finalAmount);
                        resolve(desP);
                    }
                } else {
                    console.log("fare not found");
                    resolve(true)
                }
            })
        })
    }
    // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code end  //////////////////

    // ///////////////////////Get fare from Quickride API code start////////////////////////
    var quickrideFareId;
    var QuickrideFareResponse;
    async function GetFarefromPartner(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2QUICKRIDE").style.display = "none";
            var fetchResponse;

            var datasend = {
                key: "MojoBox-Klm9.45j",
                vendor_id: "MOJO_BOXX_ZORY",
                destination_name: $("#pac-input").val().substring(0, 100).trim(),
                destination_city: SourceCity.trim(),
                destination_latitude: pickup_lat,
                destination_longitude: pickup_long,
                source_name: $("#cabPickupTerminal :selected").text().trim(),
                source_city: SourceCityName.trim(),
                source_latitude: source_latitude,
                source_longitude: source_longitude,
                // start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                start_time: moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                end_time: "",
                tripType: "Local"
            }
            $("#fare").css("width", "45%");
            // fetch('https://qtds.getquickride.com:443/taxidemandserver/rest/mojobox/taxi/booking/search', {
            fetch(BaseAPIURL + domain + '/webapi/getQuickRideFare', {
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
                        QuickrideFareResponse = fetchResponse.fareForTaxis[a].fares;
                        // console.log(fareResponse);
                        if (fareResponse.length >= 1) {
                            for (let i = 0; i < fareResponse.length; i++) {
                                if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                    quickrideFareId = fareResponse[i].fixedFareId;
                                    KMVal = (fareResponse[i].distance) + " Km"

                                    if (PaymentMethod == 'cash') {
                                        fareAmountInteger = parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount);
                                        localStorage.setItem("cashfinalFareQUICKRIDE", fareAmountInteger);
                                        //localStorage.setItem("cashpartnerFare", amount);

                                        resolve(fareAmountInteger)
                                    }
                                    else {
                                        fareAmountInteger = parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount)
                                        let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                                        if (String(AmountDiscount).includes(".")) {
                                            var splitAmount = String(AmountDiscount).split(".")
                                            var splitAmount2 = splitAmount[0];
                                        } else {
                                            splitAmount2 = AmountDiscount;
                                        }
                                        $("#fare").css("width", "45%");

                                        filldetailsInCard('QUICKRIDE', parseInt(fareAmountInteger))

                                        document.getElementById("pr2QUICKRIDE").style.display = "block";
                                        $("#prQUICKRIDE").css("font-size", "16px");
                                        document.getElementById("discountQUICKRIDE").innerHTML = splitAmount2 + "% off"
                                        // document.getElementById("prQUICKRIDE").innerHTML = " ₹ " + fareAmountInteger
                                        // document.getElementById("pr2QUICKRIDE").innerHTML = "₹" + (
                                        //     Number(fareAmountInteger) + Number(50)
                                        // )
                                        // localStorage.setItem("finalFareQUICKRIDE", fareAmountInteger);
                                        // localStorage.setItem("TotalFare", fareAmountInteger);
                                        resolve(fareAmountInteger)
                                    }

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



    async function GetFarefromMeru(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2MERU").style.display = "none";
            let meruSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("meruSearchId", meruSearchId)
            let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var city = SourceCity
            // var hardCodeCity =
            console.log(city)

            var datasend = {
                "source": {
                    "place_id": MapPlaceId,
                    "address": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": SourceCityName.trim(),
                },
                "destination": {
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
                "search_id": meruSearchId,
                "one_way_distance": KMVal.includes(".") ? KMVal.split(".")[0] : Math.round(KMVal.split(" ")[0]),
                "package_distance": 0,
                "is_instant_search": false,
            }
            $("#fare").css("width", "45%");
            fetch(BaseAPIURL + domain + '/webapi/getMeruFarePrice',
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
                    var fare
                    newResult.data.response.car_types.forEach((elem) => {
                        if (elem.type.toLowerCase() == PartnercabType.toLowerCase()) {
                            fare = elem.fare_details.base_fare + elem.fare_details.extra_charges.toll_charges["amount"] + elem.fare_details.extra_charges.parking_charges["amount"]
                        }

                    })
                    if (PaymentMethod == 'cash') {
                        var FareAmount = parseInt(fare) + parseInt(MultiplierAmount);
                        localStorage.setItem("cashfinalFareMERU", FareAmount);
                        //localStorage.setItem("cashpartnerFare", amount);

                        resolve(FareAmount)
                    }
                    else {
                        var FareAmount = parseInt(fare) + parseInt(MultiplierAmount);
                        let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                        if (String(AmountDiscount).includes(".")) {
                            var splitAmount = String(AmountDiscount).split(".")
                            var splitAmount2 = splitAmount[0];
                        } else {
                            splitAmount2 = AmountDiscount;
                        }
                        $("#fare").css("width", "45%");
                        filldetailsInCard('MERU', parseInt(FareAmount))

                        document.getElementById("pr2MERU").style.display = "block";
                        $("#prMERU").css("font-size", "16px");
                        document.getElementById("discountMERU").innerHTML = splitAmount2 + "% off"
                        // document.getElementById("prMERU").innerHTML = " ₹ " + fare
                        // document.getElementById("pr2MERU").innerHTML = "₹" + (
                        //     Number(fare) + Number(50)
                        // )
                        // localStorage.setItem("finalFareMERU", fare);
                        // localStorage.setItem("TotalFare", fare);
                        resolve(fare)
                        return true
                    }

                    // }
                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                    resolve(true)
                });
        })
    }

    // //////////////////////get fare from Meru code end ///////////////////////////


    // //////////////////// Get fare from BuddyCab code start ///////////////////////////

    var buddyFareId;
    async function GetFarefromPartnerBuddy(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2BUDDY CABS").style.display = "none";
            var fetchResponse;

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "destination_name": $("#pac-input").val(),
                "destination_city": SourceCity.trim(),
                "destination_latitude": pickup_lat,
                "destination_longitude": pickup_long,
                "source_name": $("#cabPickupTerminal :selected").text().trim(),
                "source_city": SourceCityName.trim(),
                "source_latitude": source_latitude,
                "source_longitude": source_longitude,
                "tripType": "Local"
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("https://api.buddy-cabs.com/SpiceJet/GetCabFare", requestOptions).then(response => response.json()).then(json => {

                let fareAmountInteger;
                fetchResponse = json;
                let TaxiType = fetchResponse.resultData.fareForTaxis.taxiType;
                if (TaxiType == "Car") {
                    let fareResponse = fetchResponse.resultData.fareForTaxis.fares;
                    if (fareResponse.length >= 1) {
                        for (let i = 0; i < fareResponse.length; i++) {
                            if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                if (PaymentMethod == 'cash') {
                                    fareAmountInteger = parseInt(fareResponse[i].totalCharge);
                                    localStorage.setItem("cashfinalFareBUDDY CABS", fareAmountInteger);
                                    //localStorage.setItem("cashpartnerFare", amount);

                                    resolve(fareAmountInteger)
                                }
                                else {
                                    fareAmountInteger = parseInt(fareResponse[i].totalCharge);
                                    let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                                    if (String(AmountDiscount).includes(".")) {
                                        var splitAmount = String(AmountDiscount).split(".")
                                        var splitAmount2 = splitAmount[0];
                                    } else {
                                        splitAmount2 = AmountDiscount;
                                    }
                                    $("#fare").css("width", "45%");

                                    filldetailsInCard('BUDDY CABS', parseInt(fareAmountInteger))

                                    document.getElementById("pr2BUDDY CABS").style.display = "block";
                                    $("#prBUDDY CABS").css("font-size", "16px");
                                    document.getElementById("discountBUDDY CABS").innerHTML = splitAmount2 + "% off"
                                    // document.getElementById("prBUDDY CABS").innerHTML = " ₹ " + fareAmountInteger
                                    // document.getElementById("pr2BUDDY CABS").innerHTML = "₹" + (
                                    //     Number(fareAmountInteger) + Number(50)
                                    // )
                                    // localStorage.setItem("finalFareBUDDY CABS", fareAmountInteger);
                                    // localStorage.setItem("TotalFare", fareAmountInteger);
                                    resolve(fareAmountInteger);
                                }


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



    // /////////////////////// start MEGA /////////////////////////////////////////////////
    const GetFareFromMega = async (PartnercabType) => {
        return new Promise(async (resolve, reject) => { // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            console.log(KMVal);
            let megaSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("megaSearchId", megaSearchId)
            let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var city = SourceCity

            let sendquestedData = {

                "destination": {
                    "place_id": null,
                    "address": $("#pac-input").val().substring(0, 100).trim(),
                    "latitude": pickup_lat,
                    "longitude": pickup_long,
                    "city": SourceCity.trim(),
                },

                "source": {
                    // "place_id": MapPlaceId,
                    "place_id": null,
                    "address": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": SourceCityName.trim(),
                },
                "trip_type": "ONE_WAY",
                "start_time": moment(meruTime).format('YYYY-MM-DDTHH:mm:ss'),
                "end_time": moment(meruTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
                "search_id": megaSearchId,
                "one_way_distance": Math.round(KMVal.split(" ")[0]),
                "package_distance": 0,
                "is_instant_search": false,
            };
            // const ReferMega = await fetch("https://preprodapi.mojoboxx.com/preprod/webapi/getMegaFare", {
            const ReferMega = await fetch(BaseAPIURL + domain + "/webapi/getMegaFare", {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendquestedData)
            });
            const getMega = await ReferMega.json();
            // show details on card start
            if (getMega.data.response.car_types.length > 0) {
                KMVal = (getMega.data.response.distance_booked) + " Km"

                for (let i = 0; i < getMega.data.response.car_types.length; i++) {
                    if (getMega.data.response.car_types[i].type.toLowerCase() == PartnercabType.toLowerCase()) {
                        if (PaymentMethod == 'cash') {
                            let amountValue = getMega.data.response.car_types[i].fare_details.grand_total + parseInt(MultiplierAmount);
                            localStorage.setItem("cashfinalFareMEGA", amountValue);
                            //localStorage.setItem("cashpartnerFare", amount);

                            resolve(amountValue)
                        }
                        else {
                            let amountValue = getMega.data.response.car_types[i].fare_details.grand_total + parseInt(MultiplierAmount);
                            let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            $("#fare").css("width", "45%");
                            filldetailsInCard('MEGA', parseInt(amountValue))

                            document.getElementById("pr2MEGA").style.display = "block";
                            $("#pr2MEGA").css("font-size", "16px");
                            document.getElementById("discountMEGA").innerHTML = splitAmount2 + "% off"
                            // document.getElementById("prMEGA").innerHTML = " ₹ " + amountValue
                            // document.getElementById("pr2MEGA").innerHTML = "₹" + (Number(amountValue) + Number(50))
                            // localStorage.setItem("finalFareMEGA", amountValue);
                            // localStorage.setItem("TotalFare", amountValue);
                            resolve(amountValue)
                        }
                        let amountValue = getMega.data.response.car_types[i].fare_details.grand_total + parseInt(MultiplierAmount);
                        let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                        if (String(AmountDiscount).includes(".")) {
                            var splitAmount = String(AmountDiscount).split(".")
                            var splitAmount2 = splitAmount[0];
                        } else {
                            splitAmount2 = AmountDiscount;
                        }
                        $("#fare").css("width", "45%");
                        filldetailsInCard('MEGA', parseInt(amountValue))

                        document.getElementById("pr2MEGA").style.display = "block";
                        $("#pr2MEGA").css("font-size", "16px");
                        document.getElementById("discountMEGA").innerHTML = splitAmount2 + "% off"
                        // document.getElementById("prMEGA").innerHTML = " ₹ " + amountValue
                        // document.getElementById("pr2MEGA").innerHTML = "₹" + (Number(amountValue) + Number(50))
                        // localStorage.setItem("finalFareMEGA", amountValue);
                        // localStorage.setItem("TotalFare", amountValue);
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
            console.log(partnercabType);
            document.getElementById("pr2BLUSMART").style.display = "none";
            let total_km = KMVal.split(" ");
            let totalkm = Math.round(total_km[0]);
            let dateandtime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + (moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00");

            var myHeaders = new Headers();
            // myHeaders.append("Authorization", "Basic c3BpY2VqZXQtZGV2OjBuV2FSTDZXaDU1NjEwMmtBc1lW");
            myHeaders.append("Authorization", "Basic NjYzZDJmNDhlOGEwN2I4ZmY1M2E3YWM5YjMzYTk4ZDk6MmJjNTYyMzZlNjk2YThkM2FiNjYyNDU3ZGJhZjdhNjM=");

            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Access-Control-Allow-Origin", "*");

            var raw = JSON.stringify({
                "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                "src_address": $("#cabPickupTerminal :selected").text().trim(),
                "src_latitude": source_latitude,
                "src_longitude": source_longitude,
                "src_city": SourceCityName.trim(),
                "dest_address": $("#pac-input").val().substring(0, 100).trim(),
                "dest_latitude": pickup_lat,
                "dest_longitude": pickup_long,
                "dest_city": SourceCity.trim(),
                "trip_type": "ONE_WAY",
                "search_id": Math.random().toString(14).slice(2),
                "start_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                "end_time": moment(dateandtime).add(50, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                "one_way_distance": totalkm
            });

            //console.log(raw)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            // fetch("https://fusion.tracking.uat.blucgn.com/api/v1/booking/search", requestOptions)   
            fetch(BaseAPIURL + domain + "/webapi/getBlusmartFare", requestOptions)

                .then(response => response.text())
                .then(result => {
                    var newResult = JSON.parse(result)

                    if (PaymentMethod == 'cash') {
                        let amountValue = newResult.response.car_types[0].fare_details.base_fare + parseInt(MultiplierAmount)
                        localStorage.setItem("cashfinalFareBLUSMART", amountValue);
                        //localStorage.setItem("cashpartnerFare", amount);

                        resolve(amountValue)
                    }
                    let amountValue = newResult.response.car_types[0].fare_details.base_fare + parseInt(MultiplierAmount)
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
                    filldetailsInCard('BLUSMART', parseInt(amountValue))

                    document.getElementById("pr2BLUSMART").style.display = "block";
                    $("#pr2BLUSMART").css("font-size", "16px");
                    document.getElementById("discountBLUSMART").innerHTML = splitAmount2 + "% off"
                    // document.getElementById("prBLUSMART").innerHTML = " ₹ " + amountValue
                    // document.getElementById("pr2BLUSMART").innerHTML = "₹" + (
                    //     Number(amountValue) + Number(50)
                    // )
                    // localStorage.setItem("finalFareBLUSMART", amountValue);
                    // localStorage.setItem("TotalFare", amountValue);
                    resolve(amountValue)
                    return
                }
                )
                .catch(error => {
                    // console.log('error', error)
                    $("#prBLUSMART").html("Slot not available, choose diff time");
                    $("#prBLUSMART").css({ "font-size": "8px", "width": "100%" });
                    $("#fare").css("width", "100%");
                    //   $(".include").html("please choose diff time");
                    //   $(".include").css({"font-size":"9px","width":"100%"});
                    resolve(true)
                }
                )

        })
    }





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
                "url": BaseAPIURL + domain + "/webapi/getGozoFares",
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
                        "source_address": $("#cabPickupTerminal :selected").text().trim(),
                        "source_latitude": source_latitude,
                        "source_longitude": source_longitude,
                        "destination_address": $("#pac-input").val(),
                        "destination_latitude": pickup_lat,
                        "destination_longitude": pickup_long,
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
                    KMVal = (gozores["data"]["quotedDistance"]) + " Km"
                    for (let a = 0; a < gozofare.length; a++) {
                        CabType == "Hatchback" ? CabType = "Compact" : CabType;
                        if (gozofare[a]["cab"]["category"].toLowerCase() == CabType.toLowerCase()) {
                            // console.log(gozores["data"]["cabRate"][0]["cab"]["category"]);
                            GOZOFareId = gozores["data"]["cabRate"][0]["cab"]["id"]


                            if (PaymentMethod == 'cash') {
                                var FareAmount = gozofare[a]["fare"]["totalAmount"] + parseInt(MultiplierAmount);
                                localStorage.setItem("cashfinalFareGOZO CABS", FareAmount);
                                //localStorage.setItem("cashpartnerFare", amount);

                                resolve(FareAmount)
                            }

                            else {
                                var FareAmount = gozofare[a]["fare"]["totalAmount"] + parseInt(MultiplierAmount);
                                // console.log(FareAmount)
                                let AmountDiscount = ((50 / (FareAmount + Number(50)) * 100));
                                if (String(AmountDiscount).includes(".")) {
                                    var splitAmount = String(AmountDiscount).split(".")
                                    var splitAmount2 = splitAmount[0];
                                } else {
                                    splitAmount2 = AmountDiscount;
                                }
                                filldetailsInCard('GOZO CABS', parseInt(FareAmount))

                                document.getElementById("pr2GOZO CABS").style.display = "block";
                                document.getElementById("discountGOZO CABS").innerHTML = splitAmount2 + "% off"
                                // document.getElementById("prGOZO CABS").innerHTML = " ₹ " + FareAmount
                                // document.getElementById("pr2GOZO CABS").innerHTML = "₹" + (
                                //     Number(FareAmount) + Number(50)
                                // )
                                // localStorage.setItem("finalFareGOZO CABS", FareAmount);
                                // localStorage.setItem("TotalFare", FareAmount);
                                resolve(FareAmount)
                            }

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

    // //////////////////////// coop getfare code start ////////////////////////////
    async function coop_call(PartnercabType) {
        return new Promise(async (resolve, reject) => {
            const total_km = KMVal.split(" ");
            const totalkm = Math.round(total_km[0]);

            dataJ = {
                "total_distance": totalkm,
                "source_city": SourceCityName.trim(),
                "destination_city": SourceCityName.trim(),
                "type_of_booking": "City"
            };
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
                    if (res.code == 200 && res.code != 101) { // console.log("eske andr")
                        var CoopResponse = res;
                        localStorage.setItem("CoopResponse", JSON.stringify(CoopResponse))
                        $("#coop_number").val(res.data.order_reference_number);
                        if (CoopResponse.data.price.length != 0) {
                            if (PartnercabType.toLowerCase() == "sedan") {
                                FareResponse = CoopResponse.data.price.sedan;
                            }
                            else if (PartnercabType.toLowerCase() == "hatchback") {
                                FareResponse = CoopResponse.data.price.hatchback
                            }
                            else if (PartnercabType.toLowerCase() == "suv") {
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
                            filldetailsInCard('COOP', parseInt(FareAmount))

                            document.getElementById("pr2COOP").style.display = "block";
                            document.getElementById("discountCOOP").innerHTML = splitAmount2 + "% off"
                            // document.getElementById("prCOOP").innerHTML = " ₹ " + FareAmount
                            // document.getElementById("pr2COOP").innerHTML = "₹" + (
                            //     Number(FareAmount) + Number(50)
                            // )
                            // localStorage.setItem("finalFareCOOP", FareAmount);
                            // localStorage.setItem("TotalFare", FareAmount);
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
                url: BaseAPIURL + domain + '/webapi/getCoopPrice'
            });
        })
    }

    // //////////////////////// coop getfare code end /////////////////////////////////////

    /////////////////////// Dubai cab code start///////////////////////////////////////////

    $("#dubai").on('change', function () {
        lastDetails(PaymentMethod);
    })

    var dubaiCity;
    var dubaiDistance;
    var dubaiLat;
    var dubaiLong;
    var dubaiFare;
    async function getOptiondubai(cab_response) {
        // await lastDetails(PaymentMethod);
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
    }

    /////////////////////// Dubai cab code end ///////////////////////////////////////////


    // ///////////////////// Goa miles fare API code start /////////////////////////////
    var Goamilesfareid = '';
    var GoamilesvehicleTyp = '';
    var Goamilesamount = '';
    var GoamilesVehiclename = '';

    async function checkFareGoamiles(cabTyp) {
        if (cabTyp == 'SUV') {
            cabTyp = 'MUV'
        }
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
                // "passenger_name": $("#user_name").val(),
                "passenger_name": 'customer',
                "drop_latlng": pickup_lat + "," + pickup_long,
                "pickup_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                "pickup_address": $("#cabPickupTerminal :selected").text().trim(),
                "drop_address": $("#pac-input").val(),
                "pickup_counter_id": "",
                "passenger_email_id": "",
                "Pickup_LatLng": source_latitude + "," + source_longitude,
                "booking_type": "",
                "trip_type": "A",
                "mode_of_payment": ""

            }
            // console.log(dataJ);
            $.ajax({
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (res) {
                    if (res.data.response_code != null && res.data.response_code == 101) {
                        Goamilesfareid = res.data.data.request_id;
                        var Farelist = res.data.data.fare_list;
                        Farelist.forEach(element => {
                            console.log(cabTyp)
                            console.log(element.vehicle_type_name)
                            if (element.vehicle_type_name.toLowerCase() == cabTyp.toLowerCase()) {
                                // console.log(element.vehicle_type_name);

                                if (PaymentMethod == 'cash') {
                                    let amountValue = (element.booking_amount)
                                    localStorage.setItem("cashfinalFareGOAMILES", amountValue);
                                    //localStorage.setItem("cashpartnerFare", amount);

                                    resolve(amountValue)
                                }
                                else {
                                    let amountValue = Number(element.booking_amount) + Number(parseInt(MultiplierAmount));
                                    // console.log(FareAmount)
                                    let AmountDiscount = ((50 / (amountValue + Number(50)) * 100));
                                    if (String(AmountDiscount).includes(".")) {
                                        var splitAmount = String(AmountDiscount).split(".")
                                        var splitAmount2 = splitAmount[0];
                                    } else {
                                        splitAmount2 = AmountDiscount;
                                    }
                                    filldetailsInCard('GOAMILES', (amountValue))

                                    document.getElementById("pr2GOAMILES").style.display = "block";
                                    document.getElementById("discountGOAMILES").innerHTML = splitAmount2 + "% off"
                                    GoamilesvehicleTyp = element.vehicle_type;
                                    Goamilesamount = element.booking_amount;
                                    GoamilesVehiclename = element.vehicle_type_name;
                                    resolve(amountValue)
                                }
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
                url: BaseAPIURL + domain + '/webapi/getGoamilesQuote'
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/updateBookingLatLongAllM    iles'
            });
        })
    }
    // ///////////////////// Goa miles fare API code end /////////////////////////////

    ///////////////////// Goa miles booking cab code start ///////////////////
    var GoamilePaymentLink = ''
    async function generateBookingGoa() {
        dataJ = {
            "request_id": Goamilesfareid,
            "order_id": "SPJ" + Math.floor(10000000000 + Math.random() * 9000000000),
            "veh_type": GoamilesvehicleTyp,
            "veh_type_name": GoamilesVehiclename,
            "booking_amount": Goamilesamount
        }
        $.ajax({
            contentType: 'application/json',
            Accept: 'application/json',
            data: JSON.stringify(dataJ),
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                if (res.data.response_code != "117") {
                    document.getElementById("loader").style.display = "none";
                    GoamilePaymentLink = res.data.data.offline_payement_link
                    window.location = res.data.data.offline_payement_link;
                } else {
                    $("#cmmsg").html(res.data.response_message);
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".thank_msg i").addClass("fa-times-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
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
            url: BaseAPIURL + domain + '/webapi/generateBookingGoa'
        });
    }
    ///////////////////// Goa miles booking cab code end  ///////////////////


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
                    "trip_type": localStorage["trip_type"],
                    "pickup_time": moment().format('YYYY-DD-MM HH:mm'),
                    "cab_type": localStorage["partnercabType"],
                    "cab_category": localStorage["rideType"],
                    "terminalCode": (cityCODE == "DEL" && localStorage["trip_type"] == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().split("-")[1].trim() : TerminalCode.trim(),
                    "msgUniqueId": getRandom(10),
                    "hostId": "Website",
                    "from_city": cityCODE,
                    "to_city": cityCODE,
                    "source": (cityCODE == "DEL" && localStorage["trip_type"] == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().trim() : SourceName,
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "isDeparture": 2,
                    "mojoPartner": "Yatra",
                    "pnr": "",
                    "source_city": SourceCityName,
                    "source_latitude": source_latitude,
                    "source_longitude": source_longitude,
                    "source_name": (cityCODE == "DEL" && localStorage["trip_type"] == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().trim() : SourceName,
                    "status": "CAB",
                    "website_url": "yatra_arrival_selfdrive",
                    "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                    "user_agent": localStorage["userAgent"]
                }
            ]
        };

        // console.log(dataJ)
        $.ajax({
            type: 'POST',
            // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/cabRegistration',
            url: BaseAPIURL + domain + '/webapi/cabRegistration',
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


    // document.getElementById("bookedstatusGeneral").onclick = function () {
    //     document.getElementById("confirmation_boxGeneral").style.display = "none";
    //     $(".confirmation_boxCabDiv").css("display", "none");
    //     $(".main_div").removeClass("blur");
    //     $('body').css('overflow', 'scroll');
    // }
    // //////////////// Book self drive cab code end  /////////////////////////////

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
            if ($("#cabPickupCity").val() == "Select City") {
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
                $("#mandatory").html("* Please Enter Drop Location")
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
                updateTime()
            }

        })
        $("#timepm").click(() => {
            $("#timepm").addClass("activeClass");
            $("#timeam").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {
                TimeFormat = localStorage["depttime"] + " " + $("#timepm").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timepm").html(), ["h:mm A"]).format("HH:mm");
                updateTime()
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
            var city_code = $("#cabPickupCity").val()
            //   console.log(city_code);
            if (city_code == "DEL") {

                today = new Date(today.getTime() + (45 * 60 * 1000));
                console.log(city_code);
            }

            else if (city_code == "CCU") {
                today = new Date(today.getTime() + (60 * 60 * 1000));
            }
            else {
                today = new Date(today.getTime() + (60 * 60 * 1000));
            }

            var timeToday = today.getHours();
            var getMin = today.getMinutes();
            if (String(timeToday).length == 1) {
                timeToday = "0" + timeToday
            }
            if (String(getMin).length == 1) {
                getMin = "0" + getMin;
            }
            var ZeroHour = timeToday + ":" + getMin;
            let todayDate = new Date().toISOString().slice(0, 10)

            var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");

            Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "bookairportcab", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long, moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), Timevalue)

            if (moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") < todayDate) {
                $("#cmmsg").html("You have selected an invalid pickup Date & Time.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }
            // console.log(todayDate)
            // console.log(moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))

            if (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD")) {
                // console.log(Timevalue)
                // console.log(ZeroHour)
                if (Timevalue < ZeroHour) {
                    if (city_code == "DEL") {
                        $("#cmmsg").html("You are advised to select a time, 45 minutes later than current Time.");
                    }
                    else if (city_code == "CCU") {
                        $("#cmmsg").html("You are advised to select a time, 30 minutes later than current Time.");
                    }
                    else {
                        $("#cmmsg").html("You are advised to select a time, 30 minutes later than current Time.");
                    }

                    $(".thank_msg i").css("display", "none");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $(".timepicker").val("Pick up Time");
                }

            }




            if (!localStorage["LoadTIMEUI"]) {
                if (ShowSelfDrive != "yes") {
                    if (($("#cabPickupCity").val() != null) && ($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                        lastDetails(PaymentMethod)
                    }
                }
            }
        }
    }

    var MapPlaceId = ''
    async function getUSERLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successHandler1, errorHandler1, {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        } else {
            if (localStorage["PNR_Data"] == "Found") {
                let pnrD = JSON.parse(localStorage["pnrData"]);
                Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Location_Update");
            } else {
                Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "C2Apageclick");
            }
            console.log("Geolocation is not supported by this browser.");
        }
    }
    var successHandler1 = function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        displaycurrentLocation(lat, lon);
    };
    var errorHandler1 = function (errorObj) {
        if (localStorage["PNR_Data"] == "Found") {
            let pnrD = JSON.parse(localStorage["pnrData"]);
            Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Location_Update");
        } else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "C2Apageclick");
        }
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
                    if (localStorage["PNR_Data"] == "Found") {
                        let pnrD = JSON.parse(localStorage["pnrData"]);
                        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], add, "Location_Update", localStorage["myCurrentPickupLat"], localStorage["myCurrentPickupLong"], source_latitude, source_longitude);
                    } else {
                        Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", placeAddress.slice(-3, -1)[0] + "%" + add,
                            "Null", "Null", "Null", "NULL", "C2Apageclick");
                    }
                } else {
                    if (localStorage["PNR_Data"] == "Found") {
                        let pnrD = JSON.parse(localStorage["pnrData"]);
                        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Location_Update");
                    } else {
                        Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "C2Apageclick");
                    }
                    console.log("address not found");
                }
            } else {
                if (localStorage["PNR_Data"] == "Found") {
                    let pnrD = JSON.parse(localStorage["pnrData"]);
                    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Location_Update");
                } else {
                    Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "C2Apageclick");
                }
                console.log("Geocoder failed due to: " + status);
            }
        });
    }

    ///////////////////  fill amount in card code start /////////////////////////
    async function filldetailsInCard(partnerName, amount) {
        if (couponcodeType.toLowerCase() == 'discount') {
            document.getElementById("pr" + partnerName).innerHTML = " ₹ " + (Number(amount) - Number(couponCodeValue))
            document.getElementById("pr2" + partnerName).innerHTML = "₹" + ((Number(amount) - Number(couponCodeValue)) + Number(50))
            localStorage.setItem("finalFare" + partnerName, (Number(amount) - Number(couponCodeValue)));
            localStorage.setItem("TotalFare", (Number(amount) - Number(couponCodeValue)));
        }
        else {
            document.getElementById("pr" + partnerName).innerHTML = " ₹ " + amount
            document.getElementById("pr2" + partnerName).innerHTML = "₹" + (Number(amount) + Number(50))
            localStorage.setItem("finalFare" + partnerName, amount);
            localStorage.setItem("TotalFare", amount);
        }
    }
    ///////////////////  fill amount in card code end ///////////////////////////


    // ///////////////////////Apply coupon code start //////////////////////////////////

    // console.log(localStorage['couponPara_val']);
    if ((localStorage['couponPara_val'] != null) && (localStorage['couponPara_val'] != "null") && (localStorage['couponPara_val'] != "")) {
        $("#coupon").val(localStorage['couponPara_val']);
        if (localStorage['fullData'] != 'FullData') {
            applyCoupon()
        } else {

            fetch(BaseAPIURL + domain + "/webapi/getCouponCode").then((res) => {
                return res.json()
            })
                .then((data) => {
                    console.log($("#coupon").val())
                    if ($("#coupon").val() != '') {
                        for (let element in data.data) {
                            if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {
                                couponCodeValue = data.data[element].amount
                                couponcodeType = data.data[element].pay_type
                                couponDiscountAmt = data.data[element].amount
                                couponcodePayType = data.data[element].pay_type

                                $("#CouponCode").val($("#coupon").val());
                                localStorage.setItem("CouponCode", $("#coupon").val());
                                if (couponcodeType == 'cashback') {
                                    $("#coupon").val("Congrats! you'll get a cashback link on trip start")
                                    $(".redeem").html(`Redeem your <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span>cashback through
                                    <br>Cashback link on trip start.`)
                                    $(".redeem1").css("display", "block")
                                }
                                else {
                                    $("#coupon").val(`Congrats! ₹ ${couponCodeValue} instant discount applied`)
                                    $(".redeem1").css("display", "none")
                                    $(".redeem").html(`Your coupon code for instant discount <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`)
                                }
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
    function applyCoupon() {
        let couponapplied = false;

        document.getElementById("spinner").style.display = "block";

        fetch(BaseAPIURL + domain + "/webapi/getCouponCode").then((res) => {
            // fetch("https://preprodapi.mojoboxx.com/preprod/webapi/getCouponCode").then((res) => {
            return res.json()
        })
            .then((data) => {
                document.getElementById("spinner").style.display = "none";
                if ($("#coupon").val() != '') {
                    for (let element in data.data) {
                        if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {
                            couponapplied = true;

                            Track_LoadAnalytics(localStorage["mobileNum"], "couponcodeapplyarrival", "bookairportcab", "null", "null", "null", "null",
                                "null", "null", "null", "null", "null",
                                "null", "null", data.data[element].coupon_code)

                            $("#CouponCode").val($("#coupon").val());
                            localStorage.setItem("CouponCode", $("#coupon").val());
                            $(".popupDiv").css("display", "block")
                            $(".popupBox").css("display", "block")
                            couponCodeValue = data.data[element].amount
                            couponcodeType = data.data[element].pay_type
                            couponDiscountAmt = data.data[element].amount
                            couponcodePayType = data.data[element].pay_type
                            if (couponcodeType == 'cashback') {
                                $("#coupon").val("Congrats! you'll get a cashback link on trip start")
                                $(".redeem").html(`Redeem your <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span>cashback through
                                    <br>Cashback link on trip start.`)
                                $(".redeem1").css("display", "block")
                            }
                            else {
                                $("#coupon").val(`Congrats! ₹ ${couponCodeValue} instant discount applied`)
                                $(".redeem1").css("display", "none")
                                $(".redeem").html(`Your coupon code for instant discount <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`)
                            }
                            document.getElementById("cpndiscnt").innerText = " Rs. " + data.data[element].amount;
                            $("#coupon").attr("disabled", "true").css({ "width": "95%", "color": "#828282" });
                            $("#applyCoupon").css("display", "none")
                            $(".infoBox").css("display", "none")
                            $("#couponSuccessMsg").css("display", "none")
                            if (($("#cabPickupCity").val() != null) && ($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                                lastDetails(PaymentMethod);
                            }
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
    // ///////////////////////Apply coupon code end /////////////////////////////////// 
    async function loadcashDetails(cityType) {

        PaymentMethod = 'cash'
        var cab_response = [];
        $.ajax({
            type: 'GET',
            url: BaseURL + domain + '/webapi/getCabPartnerData?city=' + arrivalAirport + "&category=" + BookingTrip_Type,
            // url: 'https://preprod.mojoboxx.com/preprod/webapi/getCabPartnerData?city=' + arrivalAirport + "&category=" + BookingTrip_Type,
            contentType: "application/json",
            dataType: 'json',
            success: function (cab_res) {
                // console.log(cab_res);
                for (let i in cab_res) {
                    if (cab_res[i].platform.toLowerCase() != "host") {
                        if ((cab_res[i].cab_category.includes(BookingTrip_Type)) && (cab_res[i].isArrival == "1") && (cab_res[i].pay_type.includes('cash'))) {
                            cab_response.push(cab_res[i]);
                        }
                    }
                }
                // console.log(cab_response);
                localStorage.setItem("cash_response", JSON.stringify(cab_response));

                cashSlider(cab_response, cityType, arrivalAirport, localStorage["trip_type"]);




            },
            error: function (e) {

                console.log(e)
            }
        });
    }

    async function cashSlider(cab_response, cabTypeName, cityType, cabCategory) {
        let scv = [];
        let cabFare = [];
        let cab_Type = [];
        let MojoFare = [];
        let cab_Type2 = [];
        localStorage.removeItem('MojoboxxFare')

        scv = [];
        MojoFare.length = 0;

        // await loadMojoMultiplier(localStorage["departureAirport"])
        var swiper = "";

        let one = 0;
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

                    cab_Image = cab_response[i].partner_image.split(",");
                    for (let j = 0; j < clc; j++) {
                        if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                            cab_Type2 = cabTypeName
                            one = 1;

                            let cabpartnername;
                            console.log(cab_response[i].card_load)
                            if (((cabTypeName == "sedan") && (cab_response[i].card_load == "BOTH"))) {
                                const Partnr = await loadPartnerData(cab_city[jk]);
                                cabpartnername = Partnr;
                            }
                            else {
                                cabpartnername = cab_response[i].partner_name;
                            }

                            scv.push(cabpartnername);
                            localStorage.setItem("cashpartnerName", scv[0]);

                            localStorage.removeItem("cashfinalFare" + cabpartnername);
                            if (cab_response[i].farecard_type == 'mojofare') {
                                let FixfareCardDetails = await loadPartnerData(cab_city[jk]);
                                let MojofareCalculate = await loadFareFromMojoboxx(cabpartnername, cab_city[jk], KMNum, cab_Type[j].toLowerCase());
                                MojoFare.push(localStorage["cashMojoFare" + cabpartnername]);
                                // MojoFare.push(localStorage["cashMojoFare" + cabpartnername]);
                                localStorage.setItem("cashMojoboxxFare", MojoFare[0]);
                                localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]) + parseInt(couponCodeValue));
                                // $("#PayLater").html("₹ " + (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                                localStorage.setItem("cashAmountFlow",  MojoFare[0])
                            }
                            else {
                                let fareCalculate = await calculatePricePartnerWise(cabpartnername, KMNum, cab_Type[j], cab_city[jk], 'cash');
                                cabFare.push(localStorage["cashfinalFare" + cabpartnername]);
                                localStorage.setItem("cashpartnerFare", parseInt(cabFare[0]));
                                $("#PayLater").html("₹ " + (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                                localStorage.setItem("cashAmountFlow", (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                            }
                        }
                    }
                }
            }
        }
    }

    async function paymentoptionLoad(cab_BookingType) {
        return new Promise(function (resolve, reject) {
            fetch(BaseAPIURL + domain + "/webapi/bookAirportCredentialsInfo").then((res) => res.json())
                // fetch("https://preprodapi.mojoboxx.com/preprod/webapi/bookAirportCredentialsInfo").then((res) => res.json())
                .then((d) => {
                    let x = d.data;
                    let z = 0;
                    for (let i of x) {
                        if (i.type == "PAYTM_MID") {
                            localStorage.setItem("PayMID", i.merchant_id)
                        }
                        if ((i.type == "BAC_PAYMENT") && (i.website_url == "BAC")) {
                            // alert(cityCODE);
                            if (i.city_code.includes(cityCODE)) {
                                // alert(i.payment_options)
                                sessionStorage.setItem("paymentmethod_display", i.payment_options)
                                if (i.payment_options.includes("cash")) {
                                    loadcashDetails(cab_BookingType)
                                }
                                z = 1;
                                // if (i.payment_options == "cash,payment" || i.payment_options == "payment,cash") {
                                //     $("#radioBox1").css("display", "block")
                                //     $("#radioBox2").css("display", "block")
                                //     $(".payLine").css("display", "block")
                                //     loadcashDetails(cab_BookingType)
                                // }
                                // else if (i.payment_options == "payment") {
                                //     $("#radioBox1").css("display", "block")
                                //     $("#radioBox2").css("display", "none")
                                //     $(".payLine").css("display", "none")
                                // }
                                // else if (i.payment_options == "cash") {
                                //     $("#radioBox1").css("display", "none")
                                //     $("#radioBox2").css("display", "block")
                                //     $(".payLine").css("display", "none")
                                //     loadcashDetails(cab_BookingType)
                                // }
                                // if (i.Total_btn == 1) {
                                //     $(".border_gap").css("display", "none");
                                //     document.getElementsByClassName('upi_btn')[0].style.display = "block";
                                //     $("#dblbtn").css("display", "none");
                                //     $("#singlebtn").css("display", "block");
                                //     paymthd1 = i.Pay_btn1;
                                // }
                                // else if (i.Total_btn == 2) {
                                //     $(".border_gap").css("display", "block");
                                //     document.getElementsByClassName('upi_btn')[0].style.display = "block";
                                //     document.getElementsByClassName('credit_btn')[0].style.display = "block";
                                //     $("#dblbtn").css("display", "block");
                                //     $("#singlebtn").css("display", "none");
                                //     paymthd1 = i.Pay_btn1;
                                //     paymthd2 = i.Pay_btn2;
                                // }
                                // resolve(true)
                                // return;
                            }


                        }
                    }

                    if (z == 0) {
                        // alert("sdfksdf")
                        for (let i of x) {
                            if ((i.type == "BAC_PAYMENT") && (i.website_url == "BAC")) {
                                if (i.city_code.toLowerCase() == "all") {

                                    sessionStorage.setItem("paymentmethod_display", i.payment_options)
                                    if (i.payment_options.includes("cash")) {
                                        loadcashDetails(cab_BookingType)
                                    }
                                    // resolve(true)
                                    // return;
                                }
                            }
                        }
                    }
                    // for (let i of x) {
                    //     if (i.type == "PAYTM_MID") {
                    //         localStorage.setItem("PayMID", i.merchant_id)
                    //     }

                    //     if ((i.type == "BAC_PAYMENT") && (i.website_url == "BAC")) {
                    //         sessionStorage.setItem("paymentmethod_display",i.payment_options)
                    //         if (i.payment_options == "cash,payment" || i.payment_options == "payment,cash") {
                    //             $("#radioBox1").css("display", "block")
                    //             $("#radioBox2").css("display", "block")
                    //             $(".payLine").css("display", "block")
                    //             loadcashDetails(cab_BookingType)
                    //         }
                    //         else if (i.payment_options == "payment") {
                    //             $("#radioBox1").css("display", "block")
                    //             $("#radioBox2").css("display", "none")
                    //             $(".payLine").css("display", "none")
                    //         }
                    //         else if (i.payment_options == "cash") {
                    //             $("#radioBox1").css("display", "none")
                    //             $("#radioBox2").css("display", "block")
                    //             $(".payLine").css("display", "none")
                    //             loadcashDetails(cab_BookingType)
                    //         }
                    //         if (i.Total_btn == 1) {
                    //             $(".border_gap").css("display", "none");
                    //             document.getElementsByClassName('upi_btn')[0].style.display = "block";
                    //             $("#dblbtn").css("display", "none");
                    //             $("#singlebtn").css("display", "block");
                    //             paymthd1 = i.Pay_btn1;
                    //         }
                    //         else if (i.Total_btn == 2) {
                    //             $(".border_gap").css("display", "block");
                    //             document.getElementsByClassName('upi_btn')[0].style.display = "block";
                    //             document.getElementsByClassName('credit_btn')[0].style.display = "block";
                    //             $("#dblbtn").css("display", "block");
                    //             $("#singlebtn").css("display", "none");
                    //             paymthd1 = i.Pay_btn1;
                    //             paymthd2 = i.Pay_btn2;
                    //         }
                    //         resolve(true)
                    //     }
                    // }
                })
        })


    }
    if (localStorage["arrivalbookingData"] != null && localStorage["arrivalbookingData"] != "null") {
        document.getElementById("loader").style.display = "none";
        response = JSON.parse(localStorage["arrivalbookingData"])["clubMember"]
        console.log(response);
        console.log(response[0]["total_kilometers"]);
        response_city = response[0]["to_city"]
        response_payment = response[0]["paymentMethod"]
        response_km = response[0]["total_kilometers"]
        response_sourcecity = response[0]["destination_city"]
        response_sourcelat = response[0]["destination_latitude"]
        response_sourcelong = response[0]["destination_longitude"]

        let time = response[0]["pickup_time"].split(" ")[1];
        let convertedTime = moment(time, ["HH:mm"]).format("h:mm A");
        const originalDate = response[0]["pickup_time"].split(" ")[0];
        const formatdate = moment(originalDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");

        FillDetails(response_city)
        document.getElementById("mb_number").value = response[0]["mobile"]
        document.getElementById("cabPickupCity").value = response[0]["destination_city"]
        document.getElementById("cabPickupTerminal").value = response[0]["terminalCode"];
        document.getElementById("pac-input").value = response[0]["drop_location"];
        document.getElementById("datepicker").value = formatdate;
        $(".timepicker").val(convertedTime)


        async function FillDetails(response_city) {
            await loadMeruPickPoint(response_city);
            await loadCity(response_city, 'is_arrival');
            await fillTerminalCodeByCity(response_city);
            pickup_lat = response_sourcelat
            pickup_long = response_sourcelong
            SourceCity = response_sourcecity
            KMNum = response_km
            KMVal = (`${response_km} km`)
            arrivalAirport = response[0]["to_city"]
            lastDetails(response_payment, arrivalAirport)

        }

    }
}

