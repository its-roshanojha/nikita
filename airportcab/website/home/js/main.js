
function loadMainjs() {
    var ArrAirportName;
    let paymthd1;
    let paymthd2;
    var couponDiscountAmt = 0
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
    var PaymentMethod = 'payment'
    var PaymentAmt = ''
    var PaymentLater = ''
    var TripType;
    var MultiplierAmount;
    var sessionToken;
    var couponCodeValue = 0
    var couponcodeType = 'cashback'
    var content_id = 0;
    var fare_price = 0;
    var couponcodePayType = ''
    var CabBookingType = 'sedan'
    var defaultCashback = 0
    var paymentoptionDisplay = "none"

    if (ShowSelfDrive != "yes") {
        $("#ConfirmButton").css("display", "none");
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
            checkVIP($("#mb_number").val())

            await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
        }
    }

    const checkVIP = async (mobile) => {
        var vipbody = { "travel_type": "departure", "phoneNo": mobile }
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
        // ShowSelfDrive == "yes" ? await loadCity('', 'isSelfDrive') : ''
    


        // ShowSelfDrive == "yes" ? await loadCity('', 'isSelfDrive') : await loadCity('', 'is_departure');



        setTimeout(() => {
            initAutocomplete();
        }, 3000);
        await getPNR(bookingId);
        if(localStorage["prefillcity"] != undefined && localStorage["prefillcity"] != null && localStorage["prefillcity"] != "undefined")
        {
            await loadMeruPickPoint(localStorage["prefillcity"]);
            await loadCity(localStorage["prefillcity"], 'is_departure');
            await fillTerminalCodeByCity(localStorage["prefillcity"]);
        }
        else{
            await loadCity('', 'is_departure');
            await loadMeruPickPoint();
            await fillTerminalCodeByCity();
        }
      
        ////////////////////////////Edit Storage////////////////////////////////////////
        if (localStorage["updatedeparturebookingData"] != null && localStorage["updatedeparturebookingData"] != "null") {
            // document.getElementById("loader").style.display = "none"
            response = JSON.parse(localStorage["updatedeparturebookingData"])["clubMember"]
            document.getElementById("loader").style.display = "none";
            response_city = response[0]["from_city"]
            response_payment = response[0]["paymentMethod"]
            response_km = response[0]["total_kilometers"]
            // alert(JSON.parse(localStorage["updatedeparturebookingData"])["clubMember"][0]["total_kilometers"])
            response_sourcecity = response[0]["source_city"]
            response_sourcelat = response[0]["source_latitude"]
            response_sourcelong = response[0]["source_longitude"]

            let time = response[0]["pickup_time"].split(" ")[1];
            let convertedTime = moment(time, ["HH:mm"]).format("h:mm A");
            const originalDate = response[0]["pickup_time"].split(" ")[0];
            const formatdate = moment(originalDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");

            FillDetails(response_city)
            document.getElementById("mb_number").value = response[0]["mobile"]
            document.getElementById("cabPickupCity").value = response[0]["destination_city"]
            document.getElementById("cabPickupTerminal").value = response[0]["terminalCode"];
            document.getElementById("pac-input").value = response[0]["source_name"];
            document.getElementById("datepicker").value = formatdate;
            console.log(convertedTime)
            $(".timepicker").val(convertedTime)

            async function FillDetails(response_city) {
                await loadMeruPickPoint(response_city);
                await loadCity(response_city, 'is_departure');
                await fillTerminalCodeByCity(response_city, response[0]["terminalCode"]);
                pickup_lat = response_sourcelat
                pickup_long = response_sourcelong
                SourceCity = response_sourcecity
                KMNum = response_km
                KMVal = (`${response_km} km`)
                departureAirport = response[0]["from_city"]
                DepAirportName = response[0]["from_city"]

                lastDetails(response_payment, departureAirport)

            }
        }
    }

    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch(BaseURL + domain + '/webapi/meruPickupPoint');
        // const meruPickupPoint = await fetch(BaseURL + domain + '/webapi/meruPickupPoint?city=' + CityCode);

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
                url: BaseURL + domain + '/webapi/getCityList',
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
                    // if (TripType == 'isSelfDrive') {
                    //     dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`

                    // } else {
                    //     dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`
                    // }
                    sessionStorage.setItem('cityListdata', JSON.stringify(cityArray));
                    // $.each(cityArray, function (i, currProgram) {
                    //     if (departurecode != '' && currProgram.code == departurecode) {
                    //         dynamicOption += `<option selected="true" value="${currProgram.code
                    //             }"> ${currProgram.name
                    //             } </option>`
                    //         fillTerminalCodeByCity(departurecode)

                    //     } else {
                    //         dynamicOption += `<option value="${currProgram.code
                    //             }"> ${currProgram.name
                    //             } </option>`
                    //     }
                    // });
                    // $("#cabPickupCity").append(dynamicOption)

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

    // $("#cabPickupTerminal").on('change', function () {
    //     var AirportName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]
    //     if (AirportName.trim() == SourceName) {
    //         source_latitude = $("#cabPickupTerminal :selected").attr('class').split(",")[1]
    //         source_longitude = $("#cabPickupTerminal :selected").attr('class').split(",")[2]
    //         // localStorage.setItem("source_latitude", $("#cabPickupTerminal :selected").attr('class').split(",")[1])
    //         //localStorage.setItem("source_longitude", $("#cabPickupTerminal :selected").attr('class').split(",")[2])
    //     }
    // })


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

            lastDetails(PaymentMethod);
        }

        await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, $(this).find(":selected").val(), TerminalCode, $(this).find(":selected").val(), pickup_lat, pickup_long, source_latitude, source_longitude,
            moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
    });

    async function fillTerminalCodeByCity(prefillcityCode = '', terminalCode = 'T3') {
        return new Promise(async function (resolve, reject) {
            ArrAirportName = prefillcityCode
            console.log(prefillcityCode)
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';

            let citylist = JSON.parse(sessionStorage["cityListdata"])
            const obj = JSON.parse(localStorage["pickupPoint"]);
            dynamicOption += `<option selected="true" disabled value="Select your Airport">Select your Airport</option>`
            citylist.forEach(elements => {
                cityCode = elements.code;

                let lc = obj;
                let rv;
                rv = lc[cityCode];

                // localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));

                // cityCODE = cityCode
                // source_city = rv[0].source_city
                // if (cityCode == "DEL") {
                //     source_latitude = rv[2].source_latitude
                //     source_longitude = rv[2].source_longitude
                // } else {
                // source_latitude = rv[0].source_latitude
                // source_longitude = rv[0].source_longitude
                // }
                // TerminalCode = rv[0].id
                // SourceName = rv[0]["source_name"]
                localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + rv[0]["source_latitude"] + "," + rv[0]["source_longitude"] + "," + rv[0]["source_name"])
                rv != undefined && $.each(rv, function (i, currProgram) {
                    // console.log(currProgram)
                 
                    if (prefillcityCode == cityCode) {
                        dynamicOption += `<option selected value="${currProgram.id
                            }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name
                            }"> ${currProgram.source_city + " - " + currProgram.source_name
                            } </option>`
    
                        source_latitude = currProgram.source_latitude;
                        source_longitude = currProgram.source_longitude;
                        cityCODE = cityCode;
                        source_city = currProgram.source_city;
                        TerminalCode = currProgram.id;
                        SourceName = currProgram.source_name;
                        DepAirportName = cityCode;
    
                    }
                else {
                    dynamicOption += `<option value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name + "," + currProgram.source_city}"> ${currProgram.source_city + " - " + currProgram.source_name
                        }  </option>`
                }
                });
            })
            $("#cabPickupTerminal").append(dynamicOption);
            resolve(true);
        })
    }

    $('#cabPickupTerminal').on('change', async function () {
        source_latitude = String($(this).find(":selected").attr('class')).split(",")[1]
        source_longitude = String($(this).find(":selected").attr('class')).split(",")[2]
        let citycode = String($(this).find(":selected").attr('class')).split(",")[0].split("-")[0]
        cityCODE = citycode
        source_city = String($(this).find(":selected").attr('class')).split(",")[4]
        TerminalCode = $(this).find(":selected").val()
        SourceName = String($(this).find(":selected").attr('class')).split(",")[3]
        DepAirportName = citycode
    })

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
                        pickup_long = b
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
                                    if (KMNum < 2) {
                                        // alert("hello")
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
            // if ($("#cabPickupCity").val() == "Select  City") {
            //     $("#mandatory").css("display", "block")
            //     $("#mandatory").html("* Please Select City")
            //     setTimeout(() => {
            //         $("#mandatory").css("display", "none")
            //     }, 2000);
            //     // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            //     $("#pac-input").val("");
            //     return;
            // }



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
    $('#status7').click(function () {
        $('.confirmation_boxCab2').css('display', 'none')
        $('.confirmation_boxCabDiv').css('display', 'none')
        $('#pac-input').val('')
        //location.reload()
    });

    async function setLatLong(city) {
        let pl = JSON.parse(localStorage["pickupPoint"]);
        rv[0].source_latitude = pl[city][0]["source_latitude"]
        source_longitude = pl[city][0]["source_longitude"]
        // localStorage.setItem("source_latitude", pl[city][0]["source_latitude"]);
        // localStorage.setItem("source_longitude", pl[city][0]["source_longitude"]);
        source_city = pl[city][0]["source_city"]
        //localStorage.setItem("source_city", pl[city][0]["source_city"]);
    }


    const arrival_Airport = '';
    async function getPNR(bookingId) {
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
        if (!localStorage["PageReload"]) {
            getUSERLocation();
        }
        $("#datepicker").val(moment().format('DD-MM-YYYY'))

        $(".journeyInfo").css("display", "none");
        $(".pnr_pickup").css("margin", "0 0px 6px 0");
        $(".form_mb").css("margin", "1.5% 0 1% 3%");
        $('.ForNon-pnrLoad').append($('.pnr_pickup'));

        if (localStorage["mobileNum"] != "undefined" && localStorage["mobileNum"] != null && localStorage["mobileNum"] != "null" && localStorage["mobileNum"] != " ") {
            $("#mb_number").val(localStorage["mobileNum"]);
            checkVIP($("#mb_number").val())
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
        let urlv = BaseAPIURL + domain + "/webapi/getCabdetailsByPNR?pnr=" + bookingId;
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
        // if ($("#cabPickupCity").val() == "Select  City") {
        //     $("#mandatory").css("display", "block")
        //     $("#mandatory").html("* Please Select City")
        //     setTimeout(() => {
        //         $("#mandatory").css("display", "none")
        //     }, 2000);
        //     // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
        //     $("#pac-input").val("");
        //     return;
        // }


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


    }

    async function loadMojoMultiplier(CityCode, Cabtype, kilometer) {
        var timeUpdate = moment().hour();
        if (timeUpdate >= "0" && timeUpdate <= "9") {
            timeUpdate = "0" + timeUpdate
        }
        const multiplier = await fetch(BaseAPIURL + domain + '/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=departure&platform=BAC")
        // const multiplier = await fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=departure&platform=Yatra")
        const multiResponse = await multiplier.json()
        localStorage.setItem('multiResponseData', JSON.stringify(multiResponse))
        // console.log(multiResponseData)  
    }

    async function multiplierFun(partner_Name, Cabtype, kilometer) {
        var multiResponseData = JSON.parse(localStorage['multiResponseData'])
        localStorage.setItem("multiplier" + partner_Name, 0)

        MultiplierAmount = 0;
        if (multiResponseData.data.length > 0) {
            multiResponseData.data.every(element => {
                if ((element.partner.toLowerCase() == partner_Name.toLowerCase()) && (element.cab_type.toLowerCase() == Cabtype.toLowerCase())) {
                    // console.log(kilometer)
                    MultiplierAmount = Number(Number(kilometer) * Number(element.amount_perKM));
                    // console.log(MultiplierAmount);
                    localStorage.setItem("multiplier" + partner_Name, MultiplierAmount)
                    return false;
                } else {
                    console.log(kilometer)
                    MultiplierAmount = 0;
                    localStorage.setItem("multiplier" + partner_Name, MultiplierAmount)
                    return true;
                }
            });
        }
    }

    async function lastDetails(paymentMethod) {

        document.getElementById("loader").style.display = "block";
        localStorage.removeItem("LoadTIMEUI")
        var cab_response = [];
        // const departure = await fetch("https://preprod.mojoboxx.com/preprod/webapi/getCabPartnerData?city=" + DepAirportName + "&category=" + BookingTrip_Type)
        const departure = await fetch(BaseURL + domain + "/webapi/getCabPartnerData?city=" + DepAirportName + "&category=" + BookingTrip_Type)
        const cab_res = await departure.json();
        for (let i in cab_res) {
            if (cab_res[i].platform.toLowerCase() != "host") {
                if (ShowSelfDrive == "yes") {
                    if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
                        cab_response.push(cab_res[i]);
                        document.getElementById("loader").style.display = "none";

                    }
                } else {
                    if ((cab_res[i].cab_category.includes(BookingTrip_Type)) && (cab_res[i].is_departure == "1") && (cab_res[i].pay_type.includes('payment'))) {
                        // console.log(cab_res[i]);
                        cab_response.push(cab_res[i]);
                        document.getElementById("loader").style.display = "none";
                    }
                }
            }
        }
        localStorage.setItem("cab_response", JSON.stringify(cab_response));
        // localStorage.setItem("URLimg", JSON.stringify(cab_response[0].URL))
        if (ShowSelfDrive == "yes") {
            localStorage.setItem("partnercabType", "suv");
            $(".titleLeft").each(function () {
                $(".titleLeft img").removeClass("active_cab");
            });
            $(".suv img").addClass("active_cab");
            await partnerSlider(cab_response, "suv", DepAirportName, TripType, paymentMethod);
        } else {
            localStorage.setItem("partnercabType", CabBookingType);
            // $(".titleLeft").each(function () {
            //     $(".titleLeft img").removeClass("active_cab");
            // });
            // $("." + CabBookingType + " img").addClass("active_cab");
            $(".coming_soon").css("display", "block");
            await partnerSlider(cab_response, CabBookingType, DepAirportName, TripType, paymentMethod);
        }

        getstate(pickup_lat, pickup_long);
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
        $("#greyedbtn").css("display", "none")

        // $('#paymentoptions').css("display", "block")
        $("#radioBox1").css("display", "block")
        MojofareCalculate = await loadFareFromMojoboxx('signature', 'DEL', KMNum, cabTypeName);
        // console.log(MojofareCalculate)
        $("#fare").css("float", "right");
        document.getElementById('prsignature').innerHTML = "Rs. " + MojofareCalculate

        document.getElementById("PayNow").innerHTML = " ₹ " + MojofareCalculate
        // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(MojofareCalculate) + Number(100))
        document.getElementById("PayLater").innerHTML = " ₹ " + (MojofareCalculate)
    }

    ///////////////////// Signature cab code end ////////////////////////////////////////

    // ////////////////// Create Partner Card UI code start /////////////////////////////
    var scv = [];
    var cabFare = [];
    var MojoFare = [];
    var actualAmount = [];
    var cab_Type = [];
    var cab_Type2 = [];
    let loadcashcab;
    async function partnerSlider(cab_response, cabTypeName, cityType, cabCategory, pmthd) {
        loadcashcab = false;
        let cab_BookingType = cabTypeName
        couponcodePayType == 'cashback' ? couponcodeType = couponcodePayType : couponcodeType = couponcodeType
        MojoFare = [];
        PaymentMethod = 'payment'
        localStorage.removeItem('MojoboxxFare')
        var Comingsoon = 'show';
        scv = [];
        $(".coming_soon").css("display", "none");
        await loadMojoMultiplier(DepAirportName, cabTypeName, KMNum)
        var swiper = "";
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        $("#swiperDiv").addClass("activeSwiper")
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
                                loadcashcab = true
                                one = 1;
                                PaymentMethod = 'payment';

                                // var timestamp = new Date().getUTCMilliseconds();
                                $(".coming_soon").css("display", "none");


                                let cabpartnername;
                                if(cab_response[i].card_load  == "multiple_card")
                                {
                                    cabpartnername = cab_response[i].partner_name;
                                }  
                                else if(((cabTypeName == "sedan") && (pmthd == "payment")) || ((cabTypeName == "sedan") && (cab_response[i].card_load == "BOTH"))) {
                                    const Partnr = await loadPartnerData(cab_city[jk]);
                                    cabpartnername = Partnr;
                                }
                                else {
                                    cabpartnername = cab_response[i].partner_name;
                                    // alert(cabpartnername)
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
                                    //     console.log(couponCodeValue)
                                    //     console.log(defaultCashback)
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
                                        console.log(MojoFare)
                                        actualAmount.push(localStorage["MojoFare" + cabpartnername])
                                        localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]));
                                    }
                                    else {
                                        if (cabpartnername) {
                                            let fareCalculate = await calculatePricePartnerWise(cabpartnername, KMNum, cab_Type[j], cab_city[jk]);
                                            cabFare.push(localStorage["finalFare" + cabpartnername]);
                                            console.log(cabFare)
                                            localStorage.setItem("partnerFare", parseInt(cabFare[0]));
                                        }
                                    }
                                    document.getElementById("km" + cabpartnername).innerHTML = KMVal + "s";
                                }



                                if (ShowSelfDrive != "yes") {
                                    if ((scv[0] == "QUICKRIDE") || (scv[0] == "BLUSMART") || (scv[0] == "MERU") || (scv[0] == "SAVAARI") || (scv[0] == "MEGA") || (scv[0] == "GOZO CABS") || (scv[0] == "TAXIBAZAAR") || (scv[0] == "BUDDY CABS") || (scv[0] == "EEE TAXI") || (scv[0] == "GOAMILES")) {
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
                                        // $('.coupon_block').css('margin-top', '15%')
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
                                        console.log(MojoFare[0])
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
                                        console.log(cabFare[0])
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




    ///////////////////// Payment option on changes//////////////////////


    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: 0,
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
                        lastDetails(PaymentMethod);
                    }
                }, 1000)
            }
            else if ($(".timepicker").val() != "Pick up Time") {
                lastDetails(PaymentMethod);
            }
            // updateTime();
        }
    });


    const updateOptionsAmount = (async () => {

        var amountinpaid = (parseInt(PaymentAmt) + parseInt(couponCodeValue))
        if (couponCodeValue != 0 && couponcodeType == 'discount') {
            document.getElementsByClassName("DiscountDiv")[0].style.display = "block"
            document.getElementById("cabDiscount").innerHTML = couponCodeValue
            document.getElementById("DiscountAmt").style.display = "block"
            $(".cashbackSpan").css("display", "none")
            document.getElementById("DiscountAmt").innerHTML = "₹ " + (parseInt(PaymentAmt) + parseInt(couponCodeValue))
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
                let MojoboxxFareslide = MojoFare[swiper.activeIndex]

                // let currentSliderType = cabTypeName[swiper.activeIndex];
                // console.log(currentSliderFare)
                localStorage.setItem("partnerName", currentSliderValue);
                localStorage.setItem("partnerFare", parseInt(currentSliderFare) + parseInt(couponCodeValue));
                localStorage.setItem("MojoboxxFare", MojoboxxFareslide);

                localStorage.setItem("partnercabType", cab_Type2);
                await myFunction(currentSliderValue)

                if (ShowSelfDrive != "yes") {
                    if ((currentSliderValue == "QUICKRIDE") || (currentSliderValue == "BLUSMART") || (currentSliderValue == "MERU") || (currentSliderValue == "SAVAARI") || (currentSliderValue == "EEE TAXI") || (currentSliderValue == "MEGA") || (currentSliderValue == "GOZO CABS") || (currentSliderValue == "TAXIBAZAAR") || (currentSliderValue == "BUDDY CABS")) {
                        // $("#ConfirmButton").css("display", "none")
                        $(".bookBtn").css("display", "block")
                        $("#greyedbtn").css("display", "none")
                        // $('.agreeBox').css('margin-bottom', '20%')
                        // $('#paymentoptions').css("display", "block")

                        // $('#PayBypaytm').css("display", "none")
                        $('.coupon_block').css('margin-top', '3%')
                        $("#radioBox1").css("display", "block")
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

                        const cashback = await loadCashbackAmt(currentSliderValue, DepAirportName)
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
                    else {
                        $("#ConfirmButton").css("display", "block")
                        $(".bookBtn").css("display", "none")
                        $("#radioBox1").css("display", "none")
                        // $('.agreeBox').css('margin-bottom', '0px')
                        // $('.coupon_block').css('margin-top', '15%')
                        $('#paymentoptions').css("display", "none")
                        // document.getElementById("partpay").innerHTML = " ₹ " + "...";
                    }

                    // document.getElementById("PayNow").innerHTML = " ₹ " + cabFare[swiper.activeIndex]
                    // document.getElementById("PayLater").innerHTML = " ₹ " + cabFare[swiper.activeIndex]

                    PaymentAmt = cabFare[swiper.activeIndex]
                    PaymentLater = cabFare[swiper.activeIndex]

                    await updateOptionsAmount()
                    // document.getElementById("PayLater").innerHTML = " ₹ " + (Number(cabFare[swiper.activeIndex]) + Number(100))

                    if (localStorage["removecash"] == "yes") {
                        $("#radioBox2").css("display", "none")
                    }
                    else if (localStorage["removecash"] == "no") {
                        $("#radioBox2").css("display", "flex")
                    }

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
            console.log(partnerName)
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
            }
            else if (partnerName == "TAXIBAZAAR") {
                // $("#prTAXIBAZAAR").html("Please wait..")
                $("#prTAXIBAZAAR").css("font-size", "12px !impotant");
                $("#fare").css("width", "100%");
                let TaxiBazaarResp = await GetFarefromTaxiBazaar(cabTyp, PaymentMethod);
                resolve(true);
            }


            else if (partnerName == "GOZO CABS") {
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
            }
            else if (partnerName == "SAVAARI") {
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
                // $(".bookBtn").css("display", "none")
                var fareData = await loadFareFormDB(partnerName, cityNameFetch, KMNum, cabTyp.toLowerCase(), PaymentMethod);
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





    document.getElementsByClassName('credit_btn')[0].onclick = function () {
        BookMycab('PAYTM', "full")
        //BookMycab('RAZORPAY', "part")
        // BookMycab(paymthd2, "full")
        // getpaymethod();
    }
    document.getElementsByClassName('upi_btn')[0].onclick = function () {
        BookMycab('PAYTM', "full")
        //BookMycab(paymthd1, "full")
        // getpaymethod();
    }
    document.getElementById("paynowapprov").onclick = function () {
        // alert("ndskchsdkchc")
        BookMycab('NewPayment')
        //  console.log( BookMycab('NewPayment'));
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
                var travelTime = moment().add(120, 'minutes').format("YYYY-MM-DD HH:mm");
                if (dateValue < travelTime) {
                    $("#cmmsg").html("You have selected an invalid pickup time. Please select a time 2 hours later than current time.");
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

            // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
            localStorage.setItem("ptnr", localStorage["partnerName"]);
            var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];

            if (localStorage["source_city"] != "Dubai") {
                console.log(localStorage["TotalFare"]);
                var price = parseInt(String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"]);
                console.log(price);
                // var price = "1";
                var total_km = KMVal.split(" ");
                totalkm = total_km[0];
                // totalkm = Math.round(total_km[0]);
                localStorage.setItem("kilometer", totalkm)
            }

            $("#continue").val("Please wait..")

            localStorage.setItem("mobileNum", $("#mb_number").val())
            sessionStorage.setItem("MobileNum", $("#mb_number").val())

            var FarePrice;

            // if (source_city.toLowerCase() == "dubai") {
            //     FarePrice = String(dubaiFare).split(" ")[1]
            // }
            // else {


            if (String(document.getElementById("PayNow").innerHTML).includes("₹")) {
                content_id = (String(document.getElementById("PayNow").innerHTML).split("₹")[1].trim())
            }
            else {
                content_id = (String(document.getElementById("PayNow").innerHTML).trim())
            }
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
        }


        if ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) {
            localStorage["ptnr"] = localStorage["ptnr"]
        }
        else {
            localStorage["ptnr"] = ''
        }

        // /////////////////// Load data to create JSON for cab booking code end ////////////////////////


        if (localStorage["ptnr"] == "QUICKRIDE") //// To check quickride fixfareid random issue
        {
            if (quickrideFareId.toLowerCase().includes(localStorage["partnercabType"].trim().toLowerCase())) {
            }
            else {
                QuickrideFareResponse.forEach((value) => {
                    value.vehicleClass.toLowerCase() == localStorage["partnercabType"].trim().toLowerCase() ? quickrideFareId = value.fixedFareId : quickrideFareId = quickrideFareId
                })
            }
        }
        let Partner_nm = ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["ptnr"].trim() : (localStorage["partnercabType"].trim() == 'suv') ? 'QUICKRIDE' : MojoPartnerName
        let serviceCharge = ((localStorage["ptnr"] == "QUICKRIDE") || (localStorage["ptnr"] == "GOZO CABS") || (localStorage["ptnr"] == "BLUSMART") || (localStorage["ptnr"] == "MERU") || (localStorage["ptnr"] == "SAVAARI") || (localStorage["ptnr"] == "MEGA") || (localStorage["ptnr"] == "BUDDY CABS") || (localStorage["ptnr"] == "TAXIBAZAAR")  || (localStorage["ptnr"] == "EEE TAXI") || (localStorage["ptnr"] == "GOAMILES")) ? localStorage["multiplier" + Partner_nm] : 0
        // /////////////////// Load data to create JSON for cab booking code end ////////////////////////
        dataJ = {
            "clubMember": [
                {
                    "type": "cabForm",
                    "name_title": '',
                    "user_name": "Customer",
                    "last_name": "Customer",
                    "mobile": $("#mb_number").val(),
                    "email": $('#email_id').val(),
                    "time": Date.now(),
                    "sendLeadSms": "true",
                    "partnerName": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["ptnr"] : (localStorage["partnercabType"] == 'suv') ? 'QUICKRIDE' : MojoPartnerName,
                    "title": localStorage["ptnr"],
                    "category": "CAB",
                    "drop_location": SourceName,
                    "pickup_time": pickup_time,
                    "cab_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? localStorage["partnercabType"] : (localStorage["partnercabType"] == 'hatchback') ? 'sedan' : localStorage["partnercabType"],
                    "cab_id": localStorage["ptnr"] == "GOZO CABS" ? GOZOFareId : (localStorage["ptnr"] == "GOAMILES") ? GoamilesvehicleTyp : 0,
                    "fare_price": fare_price,
                    "total_kilometers": source_city.toLowerCase() == "dubai" ? parseInt(dubaiDistance) : totalkm,
                    "terminalCode": TerminalCode,
                    "msgUniqueId": getRandom(10),
                    "from_city": cityCODE.trim(),
                    "to_city": cityCODE.trim(),
                    "source": source_city.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100).trim(),
                    "destination": SourceName,
                    "latitude": source_city.toLowerCase() == "dubai" ? dubaiLat : pickup_lat,
                    "longitude": source_city.toLowerCase() == "dubai" ? dubaiLong : pickup_long,
                    "isDeparture": 1,
                    "pnr": localStorage["booking_id"],
                    "source_city": source_city.toLowerCase() == "dubai" ? "Dubai" : ((localStorage["cityCODE"] == 'IXC') && (localStorage["ptnr"] == "BUDDY CABS")) ? 'Chandigarh' : SourceCity.trim(),
                    "source_latitude": source_city.toLowerCase() == "dubai" ? dubaiLat : pickup_lat,
                    "source_longitude": source_city.toLowerCase() == "dubai" ? dubaiLong : pickup_long,
                    "source_name": source_city.toLowerCase() == "dubai" ? dubaiCity : $("#pac-input").val().substring(0, 100),
                    "destination_city": source_city.trim(),
                    "destination_latitude": source_latitude,
                    "destination_longitude": source_longitude,
                    "destination_name": SourceName,
                    "status": "CAB",
                    "card_type": ((localStorage["MojoboxxFare"] == undefined) || (localStorage["MojoboxxFare"] == "undefined") || (localStorage["MojoboxxFare"] == null) || (localStorage["MojoboxxFare"] == "null")) ? '' : 'mojoFixFare',
                    "content_id": content_id,
                    "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                    "fixedFareId": localStorage["ptnr"] == "QUICKRIDE" ? quickrideFareId : localStorage["ptnr"] == "MERU" ? localStorage["meruSearchId"] : localStorage["ptnr"] == "MEGA" ? localStorage["megaSearchId"] : localStorage["ptnr"] == "GOAMILES" ? Goamilesfareid : "",
                    "mojoPartner": sessionStorage["MojoboxxURL_booking"] == "Mojoboxx" ? "Mojoboxx" : "Yatra",
                    "carID": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.carID : '',
                    "token": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.token : '',
                    "website_url": sessionStorage["MojoboxxURL_booking"] == "Facebook" ? "Facebook" : "yatra_Departure_url",
                    "user_agent": localStorage["userAgent"],
                    "pay_type": 'post',
                    'paymentMethod': 'PAYBYCASH',
                    "service_charge": serviceCharge,
                    "state": stateforinvoice,
                    "order_reference_number": "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
                    'advance_amount': ((Number(localStorage["TotalFare"]) - Number(serviceCharge)) + (Number(couponCodeValue))),
                    'discount_type': couponcodeType,
                    'discount_amount': couponCodeValue
                }
            ]
        };

        // console.log(dataJ);
        localStorage.setItem("departurebookingData", JSON.stringify(dataJ));
        localStorage.setItem("updatedeparturebookingData", JSON.stringify(dataJ));

        if ((dataJ.card_type != 'mojoFixFare') && (MojopartnerReset == 1)) {
            console.log("updatereset");
            fetch(`${BaseAPIURL}${domain}/webapi/partnerBookingCountReset?isReset=1&cityCode=${localStorage["cityCODE"]}&travelType=departure`)
        }

        fullDetails(PAYMENT_TYPE, paytp, price, dataJ)
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
            // console.log(dataJ);
            $(".spinner").css("display", "none")
            $(".spinnerBack").css("display", "none")

            window.location.href = 'payment.html'
        }
        else {
            $.ajax({
                type: 'POST',
                url: BaseAPIURL + domain + '/webapi/cabRegistration',
                // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/cabRegistration',
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (response) {
                    // console.log(response);
                    if (response.status == 200) {
                        // if (localStorage["partnerName"] == "GOAMILES") {
                        //     window.location = GoamilePaymentLink;
                        //     return false;
                        // }

                        $("#continue").prop("disabled", true);
                        // $("#mainDetails").css('display', 'block')
                        location.href = "cab_confirm.html";
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
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
            const checkBook = await fetch(BaseAPIURL + domain + '/webapi/checkUserBooking?mobile=' + $("#mb_number").val() + "&today=" + moment(Date.now()).format("YYYY-MM-DD"))

            const bookResp = await checkBook.json()
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
            // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
            //     await bookSignatureCab('sedan');
            //     return false
            // }
            // else {
            let cab_response = JSON.parse(localStorage["cab_response"]);
            lastDetails(PaymentMethod);
            // await partnerSlider(cab_response, "sedan", DepAirportName, TripType);
            // }
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
            // if (String($("#pac-input").val().toLowerCase()).includes('dwarka') && cityCODE == 'DEL') {
            //     await bookSignatureCab('suv');
            //     return false
            // }
            // else {
            let cab_response = JSON.parse(localStorage["cab_response"]);
            lastDetails(PaymentMethod);
            // await partnerSlider(cab_response, "suv", DepAirportName, TripType);
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
        try {
            return new Promise(async function (resolve, reject) {
                fetch(`${BaseAPIURL}${domain}/webapi/mojofixBookingCount?city=${cityName}&type=departure`, {
                    method: 'GET'
                }).then(response => response.json())
                    .then(json => {
                        // console.log(json);
                        if (json.data.length >= 1) {
                            let CountArr = [];
                            for (let k in json.data) {
                                if (json.data[k].travel_type == "departure" && (json.data[k].city == cityCODE)) {
                                    CountArr.push(json.data[k])
                                }
                            }

                            for (let k in CountArr) {
                                let JSONLength = CountArr.length;
                                if ((CountArr[k].Bcount < CountArr[k].Tcount)) {
                                    MojoPartnerName = CountArr[k].partner
                                    // console.log(MojoPartnerName)
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
        } catch (error) {
            return true
        }

    }
    // ////////////////// Fetch Cab partner from Mojoboxx fixed fare code end  //////////////////

    // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code start //////////////////
    async function loadFareFromMojoboxx(partnerName, cityName, distance, cabType) {
        if (String(distance).includes(" ")) {
            distance = String((distance).split(" ")[0])

        }
        var desP;
        var hypen_pos;
        var dis;
        var dis2;
        var amt;
        return new Promise(async function (resolve, reject) {
            fetch(BaseAPIURL + domain + '/webapi/mojoboxxfixfare?cab_type=' + cabType + '&km=' + distance + '&city_code=' + cityName + '&travel_type=departure' + '&isReset=' + MojopartnerReset, { method: 'GET' }).then(response => response.json()).then(json => { // console.log(json)
                desP = json.data[0].Fare;
                localStorage.setItem("mojoboxxfixfarepartner", json.data[0].partner)
                // console.log(json)
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
                        let finalAmount;
                        if (couponCodeValue != 0 && couponcodeType == 'discount') {
                            finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
                            localStorage.setItem("cashMojoFare", finalAmount)
                        }
                        else {
                            finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)))
                            localStorage.setItem("cashMojoFare", finalAmount)
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
                        // localStorage.setItem("MojoFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount))))
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

    // //////////////////////// coop getfare code start ////////////////////////////
    async function coop_call(PartnercabType) {
        return new Promise(async (resolve, reject) => {
            var suratCity
            if (source_city.trim() == "Hazira" || source_city.trim() == "Dumas" || source_city.trim() == "Rundh" || source_city.trim() == "Limla") {
                suratCity = "surat"

            } else {
                suratCity = source_city.trim()
            }
            const total_km = KMVal.split(" ");
            const totalkm = Math.round(total_km[0]);

            dataJ = {
                "total_distance": totalkm,
                "source_city": suratCity,
                "destination_city": source_city.trim(),
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
                            } else if (PartnercabType.toLowerCase() == "hatchback") {
                                FareResponse = CoopResponse.data.price.hatchback
                            } else if (PartnercabType.toLowerCase() == "suv") {
                                FareResponse = CoopResponse.data.price.suv
                            }
                            if (PaymentMethod == 'cash') {
                                var FareAmount = FareResponse;
                                localStorage.setItem("cashfinalFareMEGA", FareAmount);
                                resolve(FareAmount)
                            }
                            else {
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
                                resolve(FareAmount);
                            }
                        }

                    } else {
                        console.log("Coop fare not found")
                        reject("Rastey fare not found");
                    }
                    return FareAmount;
                },
                type: 'POST',
                url: BaseAPIURL + domain + '/webapi/getCoopPrice'
            });
        })
    }
    // //////////////////////// coop getfare code end //////////////////////////////

    // /////////////////////// start MEGA /////////////////////////////////////////////////
    const GetFareFromMega = async (PartnercabType) => {
        return new Promise(async (resolve, reject) => {
            // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
            // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");

            let megaSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("megaSearchId", megaSearchId)
            let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var city = SourceCity

            let sendquestedData = {
                "destination": {
                    // "place_id": MapPlaceId,
                    "place_id": null,
                    "address": SourceName,
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
                            let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total) + parseInt(MultiplierAmount);
                            localStorage.setItem("cashfinalFareMEGA", amountValue);
                            //localStorage.setItem("cashpartnerFare", amount);

                            resolve(amountValue)
                        }
                        else {
                            let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total) + parseInt(MultiplierAmount);;
                            // let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total);
                            let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            $("#fare").css("width", "45%");
                            await filldetailsInCard('MEGA', parseInt(amountValue))

                            document.getElementById("pr2MEGA").style.display = "block";
                            $("#pr2MEGA").css("font-size", "16px");
                            document.getElementById("discountMEGA").innerHTML = splitAmount2 + "% off"
                            // document.getElementById("prMEGA").innerHTML = " ₹ " + amountValue
                            // document.getElementById("pr2MEGA").innerHTML = "₹" + (Number(amountValue) + Number(50))
                            // localStorage.setItem("finalFareMEGA", amountValue);
                            // localStorage.setItem("TotalFare", amountValue);
                            resolve(amountValue)
                        }


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
            // document.getElementById("pr2BLUSMART").style.display = "none";

            let total_km = KMVal.split(" ");
            let totalkm = Math.round(total_km[0]);
            let dateandtime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + (moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00")

            var myHeaders = new Headers();
            // myHeaders.append("Authorization", "Basic c3BpY2VqZXQtZGV2OjBuV2FSTDZXaDU1NjEwMmtBc1lW");
            myHeaders.append("Authorization", "Basic NjYzZDJmNDhlOGEwN2I4ZmY1M2E3YWM5YjMzYTk4ZDk6MmJjNTYyMzZlNjk2YThkM2FiNjYyNDU3ZGJhZjdhNjM=");
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Access-Control-Allow-Origin", "*");

            var raw = JSON.stringify({
                "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                "src_address": $("#pac-input").val().substring(0, 100).trim(),
                "src_latitude": pickup_lat,
                "src_longitude": pickup_long,
                "src_city": SourceCity.trim(),
                "dest_address": SourceName,
                "dest_latitude": source_latitude,
                "dest_longitude": source_longitude,
                "dest_city": source_city.trim(),
                "trip_type": "ONE_WAY",
                "search_id": Math.random().toString(14).slice(2),
                "start_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                "end_time": moment(dateandtime).add(60, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                "one_way_distance": totalkm
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch(BaseAPIURL + domain + "/webapi/getBlusmartFare", requestOptions)

                // fetch("https://fusion.tracking.blucgn.com/api/v1/booking/search", requestOptions)

                .then(response => response.text())
                .then(result => {
                    var newResult = JSON.parse(result)
                    if (PaymentMethod == 'cash') {
                        let amountValue = parseInt(newResult.response.car_types[0].fare_details.base_fare) + parseInt(MultiplierAmount);
                        localStorage.setItem("cashfinalFareBLUSMART", amountValue);

                        resolve(amountValue)
                    }
                    else {
                        let amountValue = parseInt(newResult.response.car_types[0].fare_details.base_fare) + parseInt(MultiplierAmount);
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
                        $("#prBLUSMART").css("font-size", "16px");
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
            const ReferSavvari = await fetch(BaseAPIURL + domain + "/webapi/getSavaariFare", {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendquestedData)
            });
            const getSavvari = await ReferSavvari.json();
            // show details on card start
            if (getSavvari.length > 0) {
                for (let i = 0; i < getSavvari.length; i++) {
                    if (getSavvari[i].carType.toLowerCase() == PartnercabType.toLowerCase()) {
                        if (PaymentMethod == 'cash') {
                            var savaariFare = parseInt(getSavvari[i].amount) + parseInt(MultiplierAmount);
                            localStorage.setItem("cashfinalFareSAVAARI", savaariFare);
                            resolve(savaariFare)
                        }
                        else {
                            var savaariFare = parseInt(getSavvari[i].amount) + parseInt(MultiplierAmount);

                            let AmountDiscount = ((50 / (savaariFare + Number(50)) * 100));
                            if (String(AmountDiscount).includes(".")) {
                                var splitAmount = String(AmountDiscount).split(".")
                                var splitAmount2 = splitAmount[0];
                            } else {
                                splitAmount2 = AmountDiscount;
                            }
                            $("#fare").css("width", "45%");
                            $("#pr2SAVAARI").css("display", "block");
                            filldetailsInCard('SAVAARI', parseInt(savaariFare))

                            document.getElementById("pr2SAVAARI").style.display = "block";
                            document.getElementById("discountSAVAARI").innerHTML = splitAmount2 + "% off"
                            // document.getElementById("prSAVAARI").innerHTML = " ₹ " + savaariFare
                            // document.getElementById("pr2SAVAARI").innerHTML = "₹" + (
                            //     Number(savaariFare) + Number(50)
                            // )
                            // localStorage.setItem("finalFareSAVAARI", savaariFare);
                            // localStorage.setItem("TotalFare", savaariFare);
                            sessionStorage.setItem("carID", getSavvari[i].carId);
                            sessionStorage.setItem("token", getSavvari[i].token);
                            resolve(savaariFare)
                        }

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
            var city = SourceCity
            // var hardCodeCity =

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
                    "address": SourceName,
                    "latitude": source_latitude,
                    "longitude": source_longitude,
                    "city": source_city.trim(),

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
            var datasend = {
                key: "MojoBox-Klm9.45j",
                vendor_id: "MOJO_BOXX_ZORY",
                destination_name: SourceName,
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
            $("#fare").css("width", "45%");
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
                        if (fareResponse.length >= 1) {
                            for (let i = 0; i < fareResponse.length; i++) {
                                if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                    quickrideFareId = fareResponse[i].fixedFareId;
                                    KMVal = (fareResponse[i].distance) + " Km"
                                    // fareAmountInteger = parseInt(fareResponse[i].maxTotalFare);
                                    if (PaymentMethod == 'cash') {
                                        fareAmountInteger = (parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount));
                                        localStorage.setItem("cashfinalFareQUICKRIDE", fareAmountInteger);
                                        //localStorage.setItem("cashpartnerFare", amount);
                                        resolve(fareAmountInteger)
                                    }
                                    else {
                                        fareAmountInteger = (parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount));
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
            }).catch((error) => { // console.error('Error:', error);
                resolve(true)
                // reject(true)
            });
        })
    }

    // //////////////////////get fare from quickride code end ///////////////////////////
    ///////////////////////////////////////get fare from taxibazaar////////////////////

    async function GetFarefromTaxiBazaar(PartnercabType) {
        return new Promise(async function (resolve, reject) {
            document.getElementById("pr2TAXIBAZAAR").style.display = "none";
            let taxibazaarSearchId = Math.random().toString(16).slice(2)
            localStorage.setItem("taxibazaarSearchId", taxibazaarSearchId)
            let taxibazaarTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
            var city = localStorage["SourceCity"]

            // alert( pickup_lat.toString())
            var datasend = {
                "type": 5,
                "fromCity": $("#pac-input").val().substring(0, 100).trim().split(",").reverse()[2],
                "fromState": $("#pac-input").val().substring(0, 100).trim().split(",").reverse()[1],
                "toCity": $("#pac-input").val().substring(0, 100).trim().split(",").reverse()[2],
                "toState": $("#pac-input").val().substring(0, 100).trim().split(",").reverse()[1],
                "startDate": moment(taxibazaarTime).format('YYYY-MM-DDTHH:mm:ss'),
                "returnDate": moment(taxibazaarTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
                "toLat": source_latitude,
                "toLon": source_longitude,
                "fromLat": pickup_lat.toString(),
                "fromLon": pickup_long.toString(),
                "distance": KMVal.includes(".") ? KMVal.split(".")[0] : KMVal,
                "iataCode": cityCODE,

            }
            $("#fare").css("width", "45%");
            fetch(BaseAPIURL + domain + '/webapi/getTaxiBazaarFare',
                {
                    method: 'POST',
                    body: JSON.stringify(datasend),
                    "headers": {
                        "Content-type": "Application/json"
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success == true) {
                        $("#fare").css("width", "45%");
                        document.getElementById("pr2TAXIBAZAAR").style.display = "block";
                        $("#prTAXIBAZAAR").css("font-size", "16px");
                        // document.getElementById("discountTAXIBAZAAR").innerHTML = splitAmount2 + "% off"

                        let TaxibazaarFare = 0;
                        if (PartnercabType == "Sedan") {
                            TaxibazaarFare = result.data.totalPriceSedan;
                        }
                        else if (PartnercabType == "SUV") {
                            TaxibazaarFare = result.data.totalPriceSuv;
                        }
                        else if (PartnercabType == "Hatchback") {
                            TaxibazaarFare = result.data.totalPriceHatchback;
                        }

                        let TaxiAmount = (parseInt(TaxibazaarFare) + parseInt(MultiplierAmount));

                        if (PaymentMethod == 'cash') {
                            localStorage.setItem("cashfinalFareTAXIBAZAAR", TaxiAmount);
                            resolve(TaxiAmount)
                        }
                        else {
                            filldetailsInCard('TAXIBAZAAR', parseInt(TaxiAmount))
                            // localStorage.setItem("TotalFare", result.data.totalPriceSedan);
                            resolve(TaxiAmount)
                            return true
                        }
                    }
                    // var FareAmount = parseInt(fare)
                    // let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                    // if (String(AmountDiscount).includes(".")) {
                    //     var splitAmount = String(AmountDiscount).split(".")
                    //     var splitAmount2 = splitAmount[0];
                    // } else {
                    //     splitAmount2 = AmountDiscount;
                    // }

                }
                )
                .catch((error) => {
                    console.error('Error:', error);
                    resolve(true)
                    reject(true)
                });
        })
    }
    ///////////////////////////////////////////////end fare taxibazaar//////////////////////

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
                "destination_name": SourceName,
                "destination_city": source_city.trim(),
                "destination_latitude": source_latitude,
                "destination_longitude": source_longitude,
                "source_name": $("#pac-input").val(),
                "source_city": (localStorage["cityCODE"] == 'IXC') ? 'Chandigarh' : sourceCity,
                "source_latitude": pickup_lat,
                "source_longitude": pickup_long,
                "tripType": "Local",
                "distance": totalkm
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
                        // "startDate": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"),
                        // "startTime": moment($(".timepicker").val(),["h:mm A"]).format("HH:mm:ss"),
                        "startTime": Currenttym,
                        "cab_type": CabType,
                        "mobile": document.getElementById("mb_number").value,
                        "source_address": $("#pac-input").val(),
                        "source_latitude": pickup_lat,
                        "source_longitude": pickup_long,
                        "destination_address": SourceName,
                        "destination_latitude": source_latitude,
                        "destination_longitude": source_longitude
                    }
                )
            };
            $.ajax(settings).done(function (gozores) {
                if (gozores.success != "false" && gozores.code == 200) {
                    var gozofare = gozores["data"]["cabRate"]
                    var GozoResponse = gozores.result;
                    localStorage.setItem("GozoResponse", JSON.stringify(GozoResponse))
                    KMVal = (gozores["data"]["quotedDistance"]) + " Km"
                    for (let a = 0; a < gozofare.length; a++) {
                        CabType == "Hatchback" ? CabType = "Compact" : CabType;
                        if (gozofare[a]["cab"]["category"].toLowerCase() == CabType.toLowerCase()) {
                            GOZOFareId = gozores["data"]["cabRate"][0]["cab"]["id"]
                            var FareAmount = parseInt(gozofare[a]["fare"]["totalAmount"]) + parseInt(MultiplierAmount);
                            // alert(PaymentMethod)
                            if (PaymentMethod == 'cash') {
                                var FareAmount = parseInt(gozofare[a]["fare"]["totalAmount"]) + parseInt(MultiplierAmount);
                                localStorage.setItem("cashfinalFareGOZO CABS", FareAmount);
                                //localStorage.setItem("cashpartnerFare", amount);
                                resolve(FareAmount)
                            }
                            else {
                                var FareAmount = parseInt(gozofare[a]["fare"]["totalAmount"]) + parseInt(MultiplierAmount);
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
                                resolve(FareAmount)
                            }
                        } else {
                            resolve(true)
                        }
                    }
                } else {
                    reject("Gozo fare not Found")
                }
            });
        })
    }
    // /////////////////////// end Gozo /////////////////////////////////////////////////

    $("#dubai").on('change', function () {
        lastDetails(PaymentMethod);
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
    }

    // ///////////////////// Dubai cab code end ///////////////////////////////////////////



    // //////////////// Book self drive cab code start /////////////////////////////
    function BookSelfDriveCab() {
        localStorage["selfD"] = true;

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
                    "mojoPartner": "Yatra",
                    "pnr": "",
                    "source_city": source_city,
                    "source_latitude": source_latitude,
                    "source_longitude": source_longitude,
                    "source_name": (cityCODE == "DEL" && TripType == "Airport Round Trip") ? $("#cabPickupTerminal").find(":selected").text().trim() : SourceName,
                    "status": "CAB",
                    "website_url": "yatra_selfdrive",
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
        if (cabTyp == 'suv') {
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
                "passenger_name": "",
                "drop_latlng": source_latitude + "," + source_longitude,
                "pickup_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                "pickup_counter_id": "",
                "Pickup_LatLng": pickup_lat + "," + pickup_long,
                "pickup_address": $("#pac-input").val(),
                "drop_address": SourceName,
                "passenger_email_id": "",
                "booking_type": "",
                "trip_type": "D",
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
                            if (element.vehicle_type_name.toLowerCase() == cabTyp.toLowerCase()) { // console.log(element.vehicle_type_name);
                                if (PaymentMethod == 'cash') {
                                    let amountValue = (element.booking_amount)
                                    localStorage.setItem("cashfinalFareGOAMILES", amountValue);
                                    //localStorage.setItem("cashpartnerFare", amount);

                                    resolve(amountValue)
                                }
                                else {
                                    let amountValue = Number(element.booking_amount) + Number(parseInt(MultiplierAmount));
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
                url: BaseAPIURL + domain + '/webapi/getGoamilesQuote'
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
                success: function (res) {
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
                url: BaseAPIURL + domain + '/webapi/generateBookingGoa'
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
                $("#pac-input").val("");
                return;
            }
            // if ($("#cabPickupCity").val() == "Select  City") {
            //     $("#mandatory").css("display", "block")
            //     $("#mandatory").html("* Please Select City")
            //     setTimeout(() => {
            //         $("#mandatory").css("display", "none")
            //     }, 2000);
            //     $("#pac-input").val("");
            //     return;
            // }
            if ($("#pac-input").val() == "") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Pickup Location")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
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
                if (Timevalue < moment().add(120, 'minutes').format('HH:mm')) {
                    $("#cmmsg").html("You are advised to select a time, 2 hour later than current time.");
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
            var currentTime = moment().add(8, 'hours').format("YYYY-MM-DD HH:MM");

            let x = $(".timepicker").val().split(" ")[0].split(":")[0];

            // if((parseInt(x) >= 2 && parseInt(x) <= 5) && ($(".timepicker").val().split(" ")[1] == "AM")){
            //     localStorage.setItem("removecash", "yes")
            //     $("#part").prop("checked", true)
            //     $("#PayBypaytm").css("display", "block")
            //     $("#PayByCash").css("display", "none")
            // }
            // else{
            //     localStorage.setItem("removecash", "no")
            // }
            localStorage.setItem("removecash", "no")


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
            if (!localStorage["LoadTIMEUI"]) {

                if (ShowSelfDrive != "yes") {
                    if (($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                        lastDetails(PaymentMethod);

                    }
                }

            }
        }
    }

    ////////////////////// Ride Time UI Code end  //////////////////////////////////////


    ///////////////////  fill amount in card code start /////////////////////////
    async function filldetailsInCard(partnerName, amount) {
        if (couponcodeType.toLowerCase() == 'discount') {
            // document.getElementById("pr" + partnerName).innerHTML = " ₹ " + amount
            // document.getElementById("pr2" + partnerName).innerHTML = "₹" + (Number(amount) + Number(50))
            // localStorage.setItem("finalFare" + partnerName, amount);
            // localStorage.setItem("TotalFare", amount);
            document.getElementById("pr" + partnerName).innerHTML = " ₹ " + (Number(amount) - Number(couponCodeValue))
            document.getElementById("pr2" + partnerName).innerHTML = "₹" + ((Number(amount) - Number(couponCodeValue)) + Number(50))
            localStorage.setItem("finalFare" + partnerName, (Number(amount) - Number(couponCodeValue)));
            localStorage.setItem("TotalFare", (Number(amount) - Number(couponCodeValue)));
            // if (document.querySelector('input[name="paymentoption"]:checked').value == "PayLater") {
            //     document.getElementById("pr" + partnerName).innerHTML = " ₹ " + amount
            //     document.getElementById("pr2" + partnerName).innerHTML = "₹" + (Number(amount) + Number(50))
            //     localStorage.setItem("finalFare" + partnerName, amount);
            //     localStorage.setItem("TotalFare", amount);
            // }
            // else {
            //     document.getElementById("pr" + partnerName).innerHTML = " ₹ " + (Number(amount) - Number(couponCodeValue))
            //     document.getElementById("pr2" + partnerName).innerHTML = "₹" + ((Number(amount) - Number(couponCodeValue)) + Number(50))
            //     localStorage.setItem("finalFare" + partnerName, (Number(amount) - Number(couponCodeValue)));
            //     localStorage.setItem("TotalFare", (Number(amount) - Number(couponCodeValue)));
            // }
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

    if ((localStorage['couponPara_val'] != null) && (localStorage['couponPara_val'] != "null") && (localStorage['couponPara_val'] != "")) {
        $("#coupon").val(localStorage['couponPara_val']);
        if (localStorage['fullData'] != 'FullData') {
            applyCoupon()
        } else {

            fetch(BaseAPIURL + domain + "/webapi/getCouponCode").then((res) => {
                return res.json()
            })
                .then((data) => {
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
        // if (($("#coupon").val() != '')) {
        //     let cpn = $("#coupon").val()
        //     function containsOnlyNumbers(str) {
        //         return /^\d+$/.test(str);
        //     }
        //     if ((cpn.length > 0 && cpn.length == 10) && (containsOnlyNumbers(cpn) == true)) {
        //         console.log("mobil num " + cpn);
        //         localStorage.setItem("CouponCode", cpn);
        //     }
        //     else {
                applyCoupon()
            // }
        // }
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
                                if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {
                                    couponapplied = true;

                                    Track_LoadAnalytics(localStorage["mobileNum"], "couponcodeapplydeparture", "Cleartrip", "null", "null", "null", "null",
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
                                    if (($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                                        lastDetails(PaymentMethod);
                                    }
                                }
                            }
                            if (couponapplied == false) {
                                $("#cmmsg").empty();
                                $("#cmmsg").append(`Dear Customer<br>This coupon code is not available. Kindly Use <b>CAB75</b> to get Rs 75 cashback.`);
                                $(".thank_msg i").css("display", "none");
                                $(".confirmation_boxCabDiv").css("display", "block");
                                $(".confirmation_boxCab").css("display", "block");
                            }
                        }
                    } else {
                        $("#couponSuccessMsg").css("color", "red").html('Please enter coupon code');
                    }
                })
        }
    }
    // ///////////////////////Apply coupon code end ///////////////////////////////////
    async function loadcashDetails(cityType) {

        PaymentMethod = 'cash'
        var cab_response = [];
        $.ajax({
            type: 'GET',
            url: BaseURL + domain + '/webapi/getCabPartnerData?city=' + DepAirportName + "&category=" + BookingTrip_Type,
            contentType: "application/json",
            dataType: 'json',
            success: function (cab_res) {
                for (let i in cab_res) {
                    if (cab_res[i].platform.toLowerCase() != "host") {
                        if ((cab_res[i].cab_category.includes(BookingTrip_Type)) && (cab_res[i].is_departure == "1") && (cab_res[i].pay_type.includes('cash'))) {
                            cab_response.push(cab_res[i]);
                        }
                    }
                }
                localStorage.setItem("cash_response", JSON.stringify(cab_response));

                cashSlider(cab_response, cityType, DepAirportName, localStorage["trip_type"]);
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
            if (cab_city.length == 1) {
                CabCITY = 1;
            } else {
                CabCITY = cab_city.length;
            }
            for (let jk = 0; jk < CabCITY; jk++) {

                if (cab_city[jk].toLowerCase() == cityType.toLowerCase()) {

                    cab_Type = cab_response[i].cab_type.split(",");
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
                            // var timestamp = new Date().getUTCMilliseconds();

                            let cabpartnername;
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
                            // await multiplierFun(cabpartnername)
                            // cab_BookingType = cab_Type[j];
                            //alert(cabpartnername)
                            if (cab_response[i].farecard_type == 'mojofare') {
                                let FixfareCardDetails = await loadPartnerData(cab_city[jk]);
                                let MojofareCalculate = await loadFareFromMojoboxx(cabpartnername, cab_city[jk], localStorage["KMNum"], cab_Type[j].toLowerCase());
                                MojoFare.push(localStorage["cashMojoFare" + cabpartnername]);
                                // MojoFare.push(localStorage["cashMojoFare" + cabpartnername]);
                                localStorage.setItem("cashMojoboxxFare", MojoFare[0]);
                                localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]) + parseInt(couponCodeValue));
                                // $("#PayLater").html("₹ " + (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                                localStorage.setItem("cashAmountFlow", MojoFare[0])

                                // localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]) + parseInt(couponCodeValue));
                            }
                            else {
                                let fareCalculate = await calculatePricePartnerWise(cabpartnername, KMNum, cab_Type[j], cab_city[jk], 'cash');
                                cabFare.push(localStorage["cashfinalFare" + cabpartnername]);
                                localStorage.setItem("cashpartnerFare", parseInt(cabFare[0]));
                                $("#PayLater").html("₹ " + (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                                localStorage.setItem("cashAmountFlow", (parseInt(localStorage["cashfinalFare" + cabpartnername])))
                            }
                            if (paymentoptionDisplay == "cash") {
                                document.getElementById("pr" + cabpartnername).innerHTML = " ₹ " + (localStorage["cashAmountFlow"])
                            }
                        }
                    }
                }
            }
        }
    }



    //////////////////// Payment option display code start////////////////
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
                                paymentoptionDisplay = i.payment_options
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
                                    paymentoptionDisplay = i.payment_options
                                    if (i.payment_options.includes("cash")) {
                                        loadcashDetails(cab_BookingType)
                                    }
                                    // resolve(true)
                                    // return;
                                }
                            }
                        }
                    }

                })
        })
    }

}

