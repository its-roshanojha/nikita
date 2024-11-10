if (localStorage["PNR_Data"] == "Found") {
    let pnrD = JSON.parse(localStorage["pnrData"]);
    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PNR_SelfDriveClick");
    } else {
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNR_SelfDriveClick");
    }

    $("#rt").on("click", function () {
        localStorage.setItem("trip_type", 'Airport Round Trip');
        $("#defPickup").html("Pickup location")
        $("#pickupDiv").css("width", "50%");
        $(".fa-sort-down").css("right", "3%")
        $("#TerminalBox").css("display", "block");
        $("#notePoint").css("display", "none");
        $("#cr").removeClass("selectedGurny")
        $("#rt").addClass("selectedGurny")
              if(localStorage["cityCODE"] != undefined)
        {
            loadCityDetails();
        }
    });
    $("#cr").on("click", function () {
        localStorage.setItem("trip_type", 'City Rental');
        $("#defPickup").html("Select City")
        $("#TerminalBox").css("display", "none");
        $("#pickupDiv").css("width", "92%");
        $(".fa-sort-down").css("right", "0%")
        $("#rt").removeClass("selectedGurny")
        $("#cr").addClass("selectedGurny")
        $("#notePoint").css("display", "none");
        if(localStorage["cityCODE"] != undefined)
        {
            loadCityDetails();
        }
    });
    
    
    $("#pac-input").removeAttr("required");
    var timerA = setInterval(async function () { // console.log($("#customerPickupTime").val());

        if ($("#mb_number").val() != "") { // if ($("#timepicker").val() != "" && $("#pac-input").val() != ""&& $("#timepicker").val() != "Pickup Time") {

            localStorage.setItem("CabSHOW", "true");

            $(".auto_btn").addClass("btn_enable");
            $("#continue").removeAttr('disabled');
            $("#continue").css("color", "white");
            //         clearInterval(interval2)
            clearInterval(timerA);

        }
    }, 1000)

    async function loadCityDetails(){
        
    let cab_response = [];
    // var departureNew = await fetch("https://preprod.mojoboxx.com/preprod/webapi/getCabPartnerData");
    var departureNew = await fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/getCabPartnerData");
    var cab_resNew = await departureNew.json();
    for (let i in cab_resNew) {
        if (cab_resNew[i].isArrival == "1") {
            cab_response.push(cab_resNew[i]);
        }
    }
    // console.log(cab_response);
    localStorage.setItem("cab_response", JSON.stringify(cab_response));
    $(".titleLeft").each(function () {
        $(".titleLeft img").removeClass("active_cab");
    });
    $(".suv img").addClass("active_cab");
    $(".coming_soon").css("display", "block");
    await partnerSlider(cab_response, "suv", localStorage["cityCODE"], localStorage["rideType"],localStorage["trip_type"]);
}

    let scv = [];
    let cabFare = [];
    // let cab_Type2 = [];
    localStorage.setItem("partnercabType", "SUV");


    async function partnerSlider(cab_response, cabTypeName, cabCity, cabCat,TripType) {

        $(".coming_soon").css("display", "none");
        var swiper = "";
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        // console.log(cabTypeName);
        let one = 0;
        scv.length = 0;
        cabFare.length = 0;

        for (let i = 0; i < cab_response.length; i++) {
            if (cab_response[i].platform.toLowerCase() == "both" || cab_response[i].platform.toLowerCase() == "web") {
                if (cab_response[i].city_code.includes(cabCity)) {
                    if (cab_response[i].cab_category.includes(cabCat)) {
                        if(cab_response[i].cc.includes(TripType)){
                            if (cab_response[i].cab_type.toLowerCase().includes(cabTypeName)) {
                            one = 1;
                            // console.log(cab_response[i].partner_name)
                            $(".coming_soon").css("display", "none");

                            let swiperSlide = document.createElement("div");
                            swiperSlide.setAttribute("class", "swiper-slide")

                            let partner_card = document.createElement("div");
                            partner_card.setAttribute("class", "cab_mid");
                            partner_card.setAttribute("id", cab_response[i].partner_name);

                            let partner_cardImg = document.createElement("img");
                            partner_cardImg.setAttribute("src", cab_response[i].cab_type_image);
                            partner_card.appendChild(partner_cardImg);

                            scv.push(cab_response[i]);
                            // console.log(scv)

                            localStorage.setItem("partnerName", scv[0]["partner_name"]);
                            localStorage.setItem("partnerId", scv[0]["id"]);
                            localStorage.setItem("partnerSms", scv[0]["sendLeadSms"]);
                            localStorage.setItem("MissedCallNumber", scv[0]["provide_contact"]);

                            // let fareButtonDiv = document.createElement("div");
                            // fareButtonDiv.setAttribute("class", "fare");
                            // let fareButtonP = document.createElement("p");
                            // fareButtonP.innerHTML = "Feature";

                            // fareButtonDiv.appendChild(fareButtonP);
                            // partner_card.appendChild(fareButtonDiv)

                            // partner_card.onclick = function () {

                            //     let fareImg = cab_response[i].fare_image;

                            //     let fareImgType = fareImg.split(',');
                            //     console.log(fareImgType)
                             
                            //     if (fareImgType.length == 1) {
                            //         document.getElementById("fareDiv").style.display = "block";
                            //         document.getElementById("fareDiv2").style.display = "none";
                            //         document.getElementById("fareDivSrc").style.display = "block";
                            //         document.getElementById("fareDivSrc").setAttribute("src", fareImgType[0]);
                            //         document.getElementById("fareDivSrc").style.width = "100%";
                            //         document.getElementById("fareDivSrc").setAttribute("class", "singleImg")
                            //         $(".cabModal_box").css("display", "block");


                            //     } else {
                            //         document.getElementById("fareDiv2").style.display = "block";
                            //         document.getElementById("fareDiv").style.display = "none";
                            //         document.getElementById("fareDivSrc").style.display = "none";
                            //         document.getElementById("fareDiv2").innerHTML = "";
                            //         let mySwiperCabfare = document.createElement("div");
                            //         mySwiperCabfare.setAttribute("class", "swiper mySwiperCabfare");
                            //         document.getElementById("fareDiv2").appendChild(mySwiperCabfare);

                            //         let slideFareCab = document.createElement("div");
                            //         slideFareCab.setAttribute("class", "swiper-wrapper");
                            //         slideFareCab.setAttribute("id", "slideFareCab");
                            //         mySwiperCabfare.appendChild(slideFareCab);
                            //         $(".cabModal_boxFareClose").css("right", "5%");

                            //         for (let c = 0; c < fareImgType.length; c++) {
                            //             let swiper_slide = document.createElement("div");
                            //             swiper_slide.setAttribute("class", "swiper-slide");
                            //             let carousel_thumbnail = document.createElement("img");
                            //             carousel_thumbnail.setAttribute("class", "carousel-thumbnail");
                            //             carousel_thumbnail.setAttribute("src", fareImgType[c]);
                            //             // document.getElementById('cabModal_boxFare').style.backgroundColor = "transparent";
                            //             document.getElementById('cabModal_boxFare').setAttribute("style", "background-color: transparent; width: 100%; left: 0px;");

                            //             swiper_slide.appendChild(carousel_thumbnail);
                            //             slideFareCab.appendChild(swiper_slide);
                            //             // document.getElementById("fareDivSrc").setAttribute("src", fareImgType[c]);
                            //         }
                            //         let swiper_pagination = document.createElement("div");
                            //         swiper_pagination.setAttribute("class", "swiper-pagination");
                            //         mySwiperCabfare.appendChild(swiper_pagination);

                            //         const swiperCabfare = new Swiper(".mySwiperCabfare", {
                            //             effect: "coverflow",
                            //             observer: true,
                            //             observeParents: true,
                            //             grabCursor: true,
                            //             centeredSlides: true,
                            //             slidesPerView: "auto",
                            //             coverflowEffect: {
                            //                 rotate: 50,
                            //                 stretch: 0,
                            //                 depth: 300,
                            //                 modifier: 1,
                            //                 slideShadows: true
                            //             },
                            //             pagination: {
                            //                 el: ".swiper-pagination"
                            //             }
                            //         });
                            //         $(".cabModal_box").css("display", "block");
                            //     }
                            //     $(".cabModal_boxFareClose").on("click", function () {
                            //         $("#fareDiv2").html("")
                            //         $(".cabModal_box").css("display", "none");
                            //     })
                            // }
                            swiperSlide.appendChild(partner_card);

                            document.getElementById("swiper-wrapper").appendChild(swiperSlide);
                            $("#notePoint").css("display", "block")


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
                console.clear();
                // console.log(currentSliderValue)
                let currentSliderFare = cabFare[swiper.activeIndex];
                // console.log(currentSliderFare)
                // let currentSliderType = cabTypeName[swiper.activeIndex];
                // alert(currentSliderType);
                localStorage.setItem("partnerName", currentSliderValue["partner_name"]);
                localStorage.setItem("partnerId", currentSliderValue["id"]);
                localStorage["MissedCallNumber"] = currentSliderValue["provide_contact"]
                localStorage.setItem("partnerSms", currentSliderValue["sendLeadSms"]);
                localStorage.setItem("partnerFare", currentSliderFare);
                // await myFunction(currentSliderValue)
            }
        }
    });

    $(".mini").click(async function () {
        let cab_response = JSON.parse(localStorage["cab_response"]);
        // partnerSlider(cab_response, "hatchback", "MAA");
        // await lastDetails()
        await partnerSlider(cab_response, "hatchback", localStorage["ArrivalStation"], localStorage["rideType"],localStorage["trip_type"]);
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
        await partnerSlider(cab_response, "sedan", localStorage["ArrivalStation"], localStorage["rideType"],localStorage["trip_type"]);
        // partnerSlider(cab_response, "sedan", "MAA");
        localStorage.setItem("partnercabType", "sedan");
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".sedan img").addClass("active_cab");
    })

    $(".suv").click(async function () {
        let cab_response = JSON.parse(localStorage["cab_response"]);
        // console.log(cab_response)
        // partnerSlider(cab_response, "suv", "MAA");
        // await lastDetails()
        await partnerSlider(cab_response, "suv", localStorage["ArrivalStation"], localStorage["rideType"],localStorage["trip_type"]);
        localStorage.setItem("partnercabType", "suv");
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".suv img").addClass("active_cab");
    })

    document.getElementById("ctn").onsubmit = function (e) { // localStorage.removeItem("showConfirmbutton")
        e.preventDefault();
        localStorage["selfD"] = true;

        var pick_time;
        var time = localStorage["currentTime"]
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
            localStorage.setItem("Pictime", statusTime)

        } else { // pick_time = $("#datepicker").val() + " " + $("#timepicker").val()
            localStorage.setItem("Pictime", localStorage["currentTime"])
        }

        let date = new Date()
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let fullDate = `${year}-${month}-${day}`;
        let fullTime = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        // console.log(fullDate, fullTime);
        function formatDate(date) {
            var d = new Date(date),
                month = "" + (
                    d.getMonth() + 1
                ),
                day = "" + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) 
                month = "0" + month;
            
            if (day.length < 2) 
                day = "0" + day;
            
            return [year, month, day].join("-");
        }

        localStorage.setItem("currentDate", formatDate(fullDate));
        // localStorage["cabPickupTime"] = $("#cabPickupTime").val();
        localStorage["cabPickupTime"] = localStorage["LocationVal"]
        localStorage["pacInput"] = $("#pac-input").val();

        localStorage.setItem("customerPickupTime", pick_time);
        // localStorage.setItem("pickup_time", $("#datepicker").val());
        localStorage.setItem("pickup_time", localStorage["Date_value"]);

        var input_loc = $("#pac-input").val();
        // console.log(input_loc);
        localStorage.setItem("user_input_loc", input_loc);
        // localStorage["cabPickupTime"] = $("#cabPickupTime").val();
        localStorage.setItem("ptnr", localStorage["partnerName"]);
        // localStorage.setItem("showConfirmbutton", true);
        // console.log(cabFare)
        if (localStorage["ptnr"] != "COOP") {
            localStorage.setItem("TotalFare", localStorage["partnerFare"]);
        }
        // var final_data = JSON.parse(localStorage["pnrData"])
        // console.log(final_data);
        var customerFName = '';
        var title = '';
        // alert(title);
        // console.log(final_data[0].passenger_name);
        var customerNumber = $("#mb_number").val();
        var customerEmail = '';
        var source_ci = localStorage["user_input_loc"];
        // alert(source_ci);
        var dest_city = $("#pac-input").val();
        sessionStorage.setItem("dropLoc", $("#pac-input").val())

        let lat,
            long,
            textV,
            textV2,
            dropLoc;
        // textV = localStorage["cabPickupTime"];
        textV = localStorage["LocationVal"]
        // textV2 = textV.split(",");
        // dropLoc = textV2[0];
        // lat = textV2[1];
        // long = textV2[2];
        var dropLocation = dropLoc;

        var pickuplocation = localStorage["user_input_loc"];
        // alert(pickuplocation);


        // var newdate = localStorage["pickup_time"].split("-").reverse().join("-");
        // var pickup_time = newdate + " " + localStorage["Pictime"];
        var pickup_time = localStorage["Date_value"];
        var fare_prc = localStorage["distanceP"];
        var distance = localStorage["KMNum"];

        // var flight_number = final_data[0].FlightNumber;

        // console.log(pickup_time);
        // console.log(fare_prc);

        var price = localStorage["TotalFare"];

        var success_lat = (localStorage["pickup_lat"]);
        var success_long = (localStorage["pickup_long"]);
        var success_date = (localStorage["customerPickupTime"]);
        var start_date = success_date.replace('/', '-');
        var start_date2 = start_date.replace('/', '-');

        var new_time = new Date(start_date2);
        new_time.setHours(new_time.getHours() + 2);

        // console.log(success_long);
        // alert(success_date);
        date = success_date;
        var time = date.split(" ")[0];
        var justDate = time.slice(0, 10);
        // console.log(justDate);

        var time = date.split(" ")[0];
        var justtime = time.substr(10, 10);
        // console.log(justtime);

        dataJ = {
            "clubMember": [
                {
                    "type": "cabForm",
                    "name_title": title,
                    "user_name": "Customer",
                    "last_name": "Customer",
                    "mobile": $("#mb_number").val(),
                    "country_code": $("#countryCode").val(),
                    "email": "hello@mojoboxx.com",
                    "time": Date.now(),
                    "sendLeadSms": "true",
                    "partnerName": localStorage["ptnr"],
                    "title": localStorage["ptnr"],
                    "category": "CAB",
                    "trip_type": localStorage["trip_type"],
                    "drop_location": $("#pac-input").val(),
                    "pickup_time": localStorage["currentDate"] + " " + localStorage["Pictime"],
                    "cab_type": localStorage["partnercabType"],
                    "cab_category": localStorage["rideType"],
                    "fare_price": price,
                    "total_kilometers": "",
                    "terminalCode": localStorage["TerminalCode"],
                    "msgUniqueId": getRandom(10),
                    "hostId": "Website",
                    "from_city": localStorage["cityCODE"],
                    "to_city": localStorage["cityCODE"],
                    "source": localStorage["sourceterminal"],
                    "destination": pickuplocation.substring(0, 100),
                    "latitude": localStorage["source_latitude"],
                    "longitude": localStorage["source_longitude"],
                    "isDeparture": 1,
                    "pnr": "",
                    "source_city": localStorage["source_city"],
                    "source_latitude": localStorage["source_latitude"],
                    "source_longitude": localStorage["source_longitude"],
                    "source_name": localStorage["sourceterminal"],
                    "destination_city": localStorage["SourceCity"],
                    "destination_latitude": localStorage["pickup_lat"],
                    "destination_longitude": localStorage["pickup_long"],
                    "destination_name": $("#pac-input").val(),
                    "status": "CAB",
                    "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : ''
                }
            ]
        };
        // console.log(dataJ);
        localStorage.setItem("registerClubMember", JSON.stringify(dataJ))

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
                $(".main_div").addClass("blur");
                
                $('body').css('overflow', 'hidden');
                $("#continue").val("CONFIRM PICKUP");
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
