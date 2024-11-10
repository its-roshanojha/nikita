window.onload = async function () {

    var MultiplierAmount;

    // $(".spinner").css("display", "block")
    // $(".spinnerBack").css("display", "block")

    document.getElementById("arrivalpageopen").addEventListener("click", () => {
        location.href = "arrival.html";
    })

    if (localStorage["PNR_Data"] == "Found") {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Confirmation_Page");
    } else {
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "C2AConfirmation_Page");
    }
    await loadBookingData();



    ///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////
    var BookigInnerLoad;
    async function loadBookingData() {

        var BookingData = JSON.parse(localStorage["cabbookingData"])
        BookigInnerLoad = BookingData.clubMember[0];
        console.log(BookigInnerLoad);

        localStorage.setItem("arrival_Airport", BookigInnerLoad.from_city);
        localStorage.setItem("terminalCode", BookigInnerLoad.terminalCode);
        localStorage.setItem("KMNum", BookigInnerLoad.total_kilometers);

        localStorage.setItem("destination_name", BookigInnerLoad.source_name);
        localStorage.setItem("destination_city", BookigInnerLoad.source_city);
        localStorage.setItem("destination_latitude", BookigInnerLoad.source_latitude);
        localStorage.setItem("destination_longitude", BookigInnerLoad.source_longitude);
        localStorage.setItem("source_name", BookigInnerLoad.destination_name);
        localStorage.setItem("source_city", BookigInnerLoad.from_city);
        localStorage.setItem("source_latitude", BookigInnerLoad.destination_latitude);
        localStorage.setItem("source_longitude", BookigInnerLoad.destination_longitude);

        if (BookigInnerLoad.email != "" && BookigInnerLoad.email != "undefined") {

            sendEmail(BookigInnerLoad.email, BookigInnerLoad.order_reference_number, BookigInnerLoad.mobile, "BAC_box")
        }

        $("#cabType").html(BookigInnerLoad.cab_type);
        if (BookigInnerLoad.cab_type.toLowerCase() == "sedan") {
            $("#typImg img").prop("src", "img/sedan2.png")
        }
        else if (BookigInnerLoad.cab_type.toLowerCase() == "suv") {
            $("#typImg img").prop("src", "img/suv2.png")
        }
        else {
            $("#typImg img").prop("src", "img/mini2.png")
            $("#cabType").html("mini");
        }
        // if (BookigInnerLoad["pay_type"] == "full_simpl" && BookigInnerLoad["paymentMethod"] == "SIMPL"){
        //     if (BookigInnerLoad.refer_Code === '25%OFF') {
        //         $("#fareTitle").html("Discounted Fare")
        //         $("#discountText").css("display", "block")
        //         $("#discountTextVal").css("display", "block")
        //     }
        // }

        var fare = BookigInnerLoad.content_id

        var splitFare = parseInt(fare);
        var fareVal = parseInt(fare);

        if (BookigInnerLoad.to_city == "DXB") {
            $("#bfp").html(localStorage["DubaiFare"]);
            $("#tobfp").html(localStorage["DubaiFare"]);
            $("#discount_amount").html("₹" + 0);
        }
        else {
            if (BookigInnerLoad.discount_type == "discount") {
                fareVal = (Number(BookigInnerLoad["content_id"]) + Number(BookigInnerLoad["discount_amount"]))
                $("#bfp").html("₹" + fareVal);
                $("#tobfp").html("₹" + BookigInnerLoad["content_id"]);
                $("#discount_amount").html("- ₹" + Number(BookigInnerLoad["discount_amount"]))
            }
            else if (BookigInnerLoad.discount_type == "discount%") {
                fareVal = (Number(BookigInnerLoad["content_id"]) + Number(BookigInnerLoad["discount_amount"]))
                $("#bfp").html("₹" + fareVal);
                $("#tobfp").html("₹" + BookigInnerLoad["content_id"]);
                $("#discount_amount").html("- ₹" + Number(BookigInnerLoad["discount_amount"]))
            }
            else{
                $("#bfp").html("₹" + splitFare);
                $("#tobfp").html("₹" + fareVal);
                $("#discount_amount").html("₹ 0");
                // $("#discount_amount").html("₹" + 50);
            }
        }

        $(".spinner").css("display", "none")
        $(".spinnerBack").css("display", "none")

        $("#epr").html(BookigInnerLoad.fare_price);
        // $("#cabPartner").html(BookigInnerLoad.partnerName);
        $("#eprk").html(BookigInnerLoad.total_kilometers + "Km");
        $("#pickUpLock").html(BookigInnerLoad.source_name)
        if (BookigInnerLoad.source_name.length > 30) {
            $("#tolocation").html(BookigInnerLoad.source_name.substring(0, 27) + "...")
        }
        else {
            $("#tolocation").html(BookigInnerLoad.source_name)
        }
        $("#dropLoc").html(BookigInnerLoad.destination_name);
        $("#fromlocation").html(BookigInnerLoad.destination_name);
        $("#MobileNo").html(BookigInnerLoad.mobile);
        $("#mobile").html(BookigInnerLoad.mobile);
        $("#picTym").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#picTime").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }
    }
    $("#cmmsg1").html("Your booking request is submitted successfully.");
    $("#cmmsg2").append(`You will receive confirmation details shortly through SMS & Email.<br>For any assistance, call 08046800969.`);

    // if (BookigInnerLoad.isDeparture == 1 && BookigInnerLoad.cab_category != "Outstation") {
    //     // $("#cmmsg3").append(`Don't forget to take your cashback ,after successful payment through payment link. <br><br>Now Skip the queue and pre- book your arrival cab. `);
    //     // $("#arrVAL").html("Book Now")
    //     // $(".confirmation_boxCabDiv2").css("display", "none");
    //     // $(".confirmation_boxCab2").css("display", "none");
    //     fetch(BaseAPIURL+domain+"/webapi/getCouponCode").then((res) => {
    //         return res.json();
    //     }).then((data) => {
    //         console.log(data)
    //         for (let k in data.data) {
    //             if (data.data[k].confirm_page == 1) {
    //                 document.getElementById("couponapi").innerText = data.data[k].coupon_code;
    //                 document.getElementById("coupounamt").innerText = data.data[k].amount;
    //                 $("#confirmation_boxCab5").css("display", "block")
    //                 // $("#confirmation_boxCab6").css("display", "block")
    //                 $("#confirmation_boxCabDiv5").css("display", "block")
    //             }
    //         }
    //     })

    // }
    // else {
    //     $(".confirmation_boxCabDiv2").css("display", "block");
    //     $(".confirmation_boxCab2").css("display", "block");
    //     // $("#cmmsg3").append(`Don't forget to take your cashback ,after successful payment through payment link.`);
    //     $("#arrVAL").html("Okay")

    // }
    $("#confirmation_boxCab5").css("display", "block")
    // $("#confirmation_boxCab6").css("display", "block")
    $("#confirmation_boxCabDiv5").css("display", "block")
    $("#referclose").css("display", "block");
    $("#popupvalue").addClass("hide");
    $("#arrivalBook2").html("Okay");
}
///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////


///////////////////// DISPLAY ADS CODE START ///////////////////////// 
async function departure_Ads(BookigInnerLoad) {

    for (let i = 0; i < adResponse.length; i++) {
        if (adResponse[i]["type"].toLowerCase() == "interstitial" && adResponse[i]["position"] == 2 && adResponse[i]["page_name"] == "departure") {
            document.getElementById("interstitial_back").style.display = "block";
            document.getElementById("interstitial_back").innerHTML = "";
            let inter = document.createElement("div");
            inter.setAttribute("class", "interstitial");
            let interImg = document.createElement("img");
            interImg.setAttribute("src", adResponse[i]["thumbnail"])
            inter.appendChild(interImg);
            localStorage.setItem("popupshow", true)
            interImg.onclick = function () {
                document.getElementById("interstitial_back").style.display = "none";
                // document.getElementById("Terminal").style.display = "block";
            }
            let cross = document.createElement("i");
            cross.setAttribute("class", "fas fa-times-circle");
            cross.setAttribute("id", "cross");
            inter.appendChild(cross);
            cross.onclick = function () {
                document.getElementById("interstitial_back").style.display = "none";
                if (localStorage["PNR_Data"] == "Found") {
                    let pnrD = JSON.parse(localStorage["pnrData"]);
                    Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Confirmation_Cross");
                }
                else {
                    Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "Confirmation_CrossNon-Pnr");
                }
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
            }, closeTym);
        }
        else if (adResponse[i]["type"].toLowerCase() == "bottom-banner" && adResponse[i]["page_name"] == "departure") {
            console.log(adResponse[i]["type"].toLowerCase())
            document.getElementById("bottom_banner").innerHTML = ''
            document.getElementById("bottom_banner").style.display = "block";
            let interImg = document.createElement("img");
            interImg.setAttribute("src", adResponse[i]["thumbnail"])
            document.getElementById("bottom_banner").appendChild(interImg);
        }
    }
    if ($("#popupvalue").hasClass("show")) {
        $("#thnkmsg").css("display", "block")
        $("#cmmsg1").html("Your booking request is submitted successfully.");
        $("#cmmsg2").html("For any assistance call 08046800969");
        if (BookigInnerLoad.partnerName == "QUICKRIDE" || BookigInnerLoad.partnerName == "GOZO CABS" || BookigInnerLoad.partnerName == "BLUSMART") {
            // $("#cmmsg3").html("Don't forget to take your cashback , after successful payment through payment link sent to your mobile number.For any assistance call 08046800969");
        }
        else {
            $("#cmmsg3").html("For any assistance call 08046800969");
        }
        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        $("#arrVAL").html("Book Now")
    }
    if ($("#popupvalue").hasClass("hide")) {
        $("#cmmsg1").html("Your booking request is submitted successfully.");
        $("#cmmsg2").html("You will receive confirmation details shortly through SMS & Email.For any assistance call 08046800969");
        if (BookigInnerLoad.partnerName == "QUICKRIDE" || BookigInnerLoad.partnerName == "GOZO CABS" || BookigInnerLoad.partnerName == "BLUSMART") {
            // $("#cmmsg3").html("Don't forget to take your cashback , after successful payment through payment link sent to your mobile number. For any assistance call 08046800969");
        }
        else {
            $("#cmmsg3").html("For any assistance call 08046800969");
        }
        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        $("#referclose").css("display", "none");
        $("#arrVAL").html("Okay")
    }
}
///////////////////// DISPLAY ADS CODE END //////////////////////////  


////////////////////PDF DOWNLOAD CODE START ///////////////////////////////  
$('#cmcb').on('click', function (e) {
    e.preventDefault();
    $('#cmcb').css('display', 'none')
    // setTimeout(pdfFun, 3000);
    setTimeout(() => {
        pdfFun()
    }, 1000);
})


function pdfFun() {
    localStorage.setItem("moveHere", true)
    e.preventDefault();
    var x, y;
    if (sessionStorage["delivery"]) {
        var a = 500;
        y = 270 + a;
    } else {
        var a = 300;
        y = 350 + a;
    }

    var HTML_Width = $("#cabForm ").width();
    var HTML_Height = $("#cabForm ").height() + 300;
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = HTML_Height;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    var body = document.body,
        html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    html2canvas($("body ")[0], {
        // allowTaint: true,
        useCORS: true
    }).then(function (canvas) {
        canvas.getContext('2d');

        // console.log(canvas.height + " " + canvas.width);

        var imgData = canvas.toDataURL("image/jpeg ", 1.0);

        // window.location.href = imgData;

        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height + a]);
        pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.setFillColor(0, 0, 0);

        var textX, textY;
        // if (coupon_card == " " || coupon_card == "null ") {
        textX = 225, textY = 530;

        if (localStorage["PNR_Data"] == "Found") {
            let pnrD = JSON.parse(localStorage["pnrData"]);
            Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PDF DOWNLOAD");
        }
        else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "NULL", "NULL", "PDF DOWNLOAD Non-PNR");
        }
        pdf.save("cabConfirmationInfo.pdf");

        setTimeout(function () {
            //$(".confirmation_box ").fadeIn(1000);
            $(".confirmation_boxCabDiv").fadeIn(1000);
            $(".confirmation_boxCab").fadeIn(1000);
            // localStorage.setItem("PDF_download",true);
        }, 2000);

        myFunction();
    });
    function myFunction() {
        var x = document.getElementById("snackbarCab");
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", " ");
        }, 5000);
    }

    $('#cmcb').css('display', 'block')

};

function searchRandom(length) {
    return "sch" + Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}
var random_serchNum = searchRandom(18);
////////////////////PDF DOWNLOAD CODE END /////////////////////////////// 

/////////////////////////Refer & win code start //////////////////////////

// function refernow() {
//     $(".referMain").css("display", "block");
//     $(".referBlock").css("bottom", "-1px");
//     $("#refernow").css("display", "block");
//     $("#passenger_name").addClass("Adrefer")
//     Getcode();
// }

$("#referclose").click(function () {
    $(".confirmation_boxCabDiv2").css("display", "none");
    $(".confirmation_boxCab2").css("display", "none");
    if (localStorage["PNR_Data"] == "Found") {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ConfirmBox_D2A_closeClick");
    }
})
$("#close5").click(function () {
    $("#confirmation_boxCabDiv5").css("display", "none");
    $("#confirmation_boxCab5").css("display", "none");
    if (localStorage["PNR_Data"] == "Found") {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ConfirmBox_D2A_closeClick");
    }
})
$("#close6").click(function () {
    $("#confirmation_boxCabDiv5").css("display", "none");
    $("#confirmation_boxCab5").css("display", "none");
    // if (localStorage["PNR_Data"] == "Found") {
    //     let pnrD = JSON.parse(localStorage["pnrData"]);
    //     Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ConfirmBox_D2A_closeClick");
    // }
})
$("#referclose2").click(function () {
    $(".confirmation_boxCabDiv").css("display", "none");
    $(".confirmation_boxCab").css("display", "none");
    if (localStorage["PNR_Data"] == "Found") {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PDF_D2A_closeClick");
    }
})
$("#referDivClose").click(function () {
    $("#passenger_name").removeClass("Adrefer")
    $(".referBlock").css("bottom", "-150%");
    $(".referMain").css("display", "none");
})

function refernow() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "block");
    $("#passenger_name").addClass("Adrefer")
    Getcode();
}

async function Getcode() {
    const Refercode = await fetch(BaseAPIURL+domain+"/webapi/get_DetailsOfReferalCode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { "mobile": localStorage["mobileNum"] }
        )
    });
    const ReferResponse = await Refercode.json();
    // $("#codevalue").val(ReferResponse.data.Coupon_Code);
    sessionStorage.setItem("codevalue", ReferResponse.data.Coupon_Code);
    // await refercode();
}

async function refercode() {
    if (sessionStorage["codevalue"] != '') {
        if (localStorage["PNR_Data"] == "Found") {
            let pnrD = JSON.parse(localStorage["pnrData"]);
            Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ShareReferCodePNR");
        } else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "ShareRefercode_Non-pnr");
        }
        var message = "Hey! " + "\n" + "I had an amazing experience with Airport Cabs." + "\n" + "Book your cab using this code " + sessionStorage["codevalue"] + " and we will both get a confirmed cashback." + "\n" + "Book Now! https://bookairportcab.com/website/index.html"
        window.open("whatsapp://send?text=" + message, '_blank');
    } else {

        alert("Oops! Refer code not found")
    }
}

function infoBox() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "none");

}
// ///////////////////////Refer & win code end //////////////////////////////////

///////////////////////Book arrival cab code start ///////////////////////////

// document.getElementById("datepicker").addEventListener("click", ()=>{
//     alert("dsfjsdf")
// })

$("#datepicker").datepicker({
    dateFormat: 'dd-mm-yy',
    startDate: '-0m',
    onSelect: function (dateText) {

        // Track_LoadAnalytics(localStorage["mobileNum"], "departure", "bookairportcab", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
        //     moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")

        // alert($(".timepicker").val())
        if ($(".timepicker").val() == "") {
            $("#myForm").css("display", "block");
            $("#time-list-wrap").css("display", "block");
            $(".done_btn").css("display", "none");
            $("#slotdiv").css("display", "block");

            var CardInterval = setInterval(function () {
                console.log($(".timepicker").val())
                localStorage.setItem("LoadTIMEUI", true);
                if ($(".timepicker").val() != "") {
                    clearInterval(CardInterval)
                    lastDetails();
                }
            }, 1000)
        }
        else if ($(".timepicker").val() != "") {
            lastDetails()
        }
        updateTime();
    }
});



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

        if ($("#datepicker").val() != "") {

            document.getElementById("paymentbtn").style.backgroundColor = "#8d97a1";
            localStorage.setItem("LoadTIMEUI", true);

            $(".timepicker").empty();

            // alert($(".timepicker").val());

            $("#myForm").css("display", "block");
            $("#time-list-wrap").css("display", "block");
            $(".done_btn").css("display", "none");
            $("#slotdiv").css("display", "block");

            // var CardInterval = setInterval(function () {
            //     console.log($(".timepicker").val())
            //     localStorage.setItem("LoadTIMEUI", true);
            //     if ($(".timepicker").val() != "") {
            //         clearInterval(CardInterval)
            //         lastDetails();
            //     }
            // }, 5000)

        }

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
        $("#confirmation_boxCab5").css("display", "block")
    })

    function updateTime() {

        if (String(TimeFormat).includes("undefined")) {
            return false;
        }
        $(".timepicker").html(TimeFormat)
        $(".timepicker").val(TimeFormat)
        $("#myForm").css("display", "none");

        var today = new Date();
        // var city_code = $("#cabPickupCity").val()
        // console.log(city_code);
        // if (city_code == "DEL") {

        //     today = new Date(today.getTime() + (10 * 60 * 1000));
        //     console.log(city_code);
        // }

        // else if (city_code == "CCU") {
        //     today = new Date(today.getTime() + (60 * 60 * 1000));
        // }
        // else {
        today = new Date(today.getTime() + (60 * 60 * 1000));
        // }


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

        if (moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") < todayDate) {
            $("#cmmsg").html("You have selected an invalid pickup Date & Time.");
            $(".thank_msg i").removeClass("fa-check-circle");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $(".timepicker").val("Pickup Time");
        }
        // console.log(todayDate)
        // console.log(moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))
        if (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD")) {
            // console.log(Timevalue)
            // console.log(ZeroHour)
            if (Timevalue < ZeroHour) {

                // if (city_code == "DEL") {
                //     $("#cmmsg").html("You are advised to select a time, 10 minutes later than current Time.");
                // }
                // else if (city_code == "CCU") {
                //     $("#cmmsg").html("You are advised to select a time, 1 hour later than current Time.");
                // }
                // else {
                $("#cmmsg").html("You are advised to select a time, 1 hour later than current Time.");
                // }

                $(".thank_msg i").css("display", "none");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pickup Time");
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
        if (currentTime > dateValue) {
            // localStorage.setItem("removecash", "yes")
            localStorage.setItem("removecash", "no")
        }
        else {
            localStorage.setItem("removecash", "no")
        }
        lastDetails();
    }

}


async function lastDetails() {
    var BookingTrip_Type = "City Ride";
    localStorage.setItem("trip_type", 'City Rental');

    $("#updatedatetimeline").css("display", "none");
    $("#img1").css("display", "block");

    // document.getElementById("loader").style.display = "block";
    localStorage.removeItem("LoadTIMEUI")
    // document.getElementById("Loading_Img").style.display = "none";

    var cab_response = [];
    $.ajax({
        type: 'GET',
        url: BaseURL+domain+'/webapi/getCabPartnerData?city=' + localStorage["arrival_Airport"] + "&category=" + BookingTrip_Type,
        // url: 'https://preprod.mojoboxx.com/preprod/webapi/getCabPartnerData?city=' + localStorage["arrival_Airport"] + "&category=" + BookingTrip_Type,
        contentType: "application/json",
        dataType: 'json',
        success: function (cab_res) {
            // console.log(cab_res);
            // console.log(cab_res);
            for (let i in cab_res) {
                if (cab_res[i].platform.toLowerCase() != "host") {
                    if (cab_res[i].cab_category.includes(BookingTrip_Type) && (cab_res[i].pay_type.includes("payment"))) {
                        let dterminal = localStorage["terminalCode"];
                        if (localStorage["arrival_Airport"].toLowerCase() == "del") {
                            // if ((cab_res[i].isArrival == "1") && (cab_res[i].t_code == dterminal)) {
                            if ((cab_res[i].isArrival == "1") && (cab_res[i].t_code.includes(dterminal))) {
                                cab_response.push(cab_res[i]);
                                // document.getElementById("loader").style.display = "none";
                            }
                        }
                        else if (cab_res[i].isArrival == "1") {
                            cab_response.push(cab_res[i]);
                            // document.getElementById("loader").style.display = "none";
                        }
                    }
                }
            }
            localStorage.setItem("cab_response", JSON.stringify(cab_response));

            partnerSlider(cab_response, "sedan", localStorage["arrival_Airport"], localStorage["trip_type"]);


            // getstate(localStorage["pickup_lat"], localStorage["pickup_long"]);
            // function getstate(lat, long) {
            //     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + localStorage["mapKey"])
            //         .then((response) => response.json())
            //         .then((responseJson) => { var state = responseJson.results[responseJson.results.length - 2].formatted_address;
            //             if (String(state).includes(",")) {
            //                 state = String(state).split(",")[0];
            //             }
            //             stateforinvoice = state;
            //         })
            // }
        },
        error: function (e) {
            lastDetails();
            console.log(e)
        }
    });
}

var scv = [];
var cabFare = [];
var cab_Type = [];
var MojoFare = [];
var cab_Type2 = [];
async function partnerSlider(cab_response, cabTypeName, cityType, cabCategory) {
    localStorage.removeItem('MojoboxxFare')
    var Comingsoon = 'show';
    // $(".coming_soon").css("display", "none");
    await loadMojoMultiplier(localStorage["arrival_Airport"])
    var swiper = "";
    // document.getElementsByClassName("swiper-slide").innerHTML = "";
    // document.getElementById("swiper-wrapper").innerHTML = "";
    let one = 0;
    scv.length = 0;
    MojoFare.length = 0;
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
            // console.log(cab_city[jk]);

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

                let cab_Image = cab_response[i].partner_image.split(",");
                for (let j = 0; j < clc; j++) {
                    if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
                        cab_Type2 = cabTypeName
                        one = 1;
                        // var timestamp = new Date().getUTCMilliseconds();
                        // $(".coming_soon").css("display", "none");

                        const Partnr = await loadPartnerData();

                        let cabpartnername;

                        if (cabTypeName == "sedan") {
                            cabpartnername = Partnr;
                        }

                        localStorage.setItem("ptnr", cabpartnername);

                        await multiplierFun(cabpartnername);

                        scv.push(cabpartnername);
                        // await myFunction(scv[0])
                        localStorage.setItem("partnerName", scv[0]);


                        let fareCalculate = await calculatePricePartnerWise(cabpartnername, localStorage["KMNum"], cab_Type[j], cab_city[jk]);
                        // cabFare.push(localStorage["finalFare" + cabpartnername]);
                        // localStorage.setItem("partnerFare", parseInt(cabFare[0]));

                        // document.getElementById("fullamt").innerText = "₹" + parseInt(cabFare[0]);
                        // alert(parseInt(cabFare[0]));
                    }

                }
            }
        }

        if (scv[0] != undefined) {
            if ((scv[0] == "QUICKRIDE") || (scv[0] == "BLUSMART") || (scv[0] == "MERU") || (scv[0] == "MEGA") || (scv[0] == "GOZO CABS")) {


                $("#paymentbtn").css("background-color", "black");
                document.getElementById("fullamt").innerText = "₹" + localStorage["partnerFare"];
                document.getElementById("finalamt").innerText = "₹" + (localStorage["partnerFare"] - 75);


            }
        }
    }
}

//////////////////////////////////pay now button code start///////////////////////
document.getElementById("paymentbtn").addEventListener("click", () => {
    if (document.getElementById("paymentbtn").style.backgroundColor == "rgb(0, 0, 0)") {

        let FarePrice = parseInt(localStorage["partnerFare"]);

        dataJ = {
            "clubMember": [
                {
                    "type": "cabForm",
                    "name_title": localStorage["PNR_Data"] == "Found" ? title : '',
                    "user_name": localStorage["PNR_Data"] == "Found" ? customerFName : "Spicejet Customer",
                    "last_name": localStorage["PNR_Data"] == "Found" ? customerLName : "Spicejet Customer",
                    "mobile": localStorage["mobileNum"],
                    "email": "",
                    "time": Date.now(),
                    "sendLeadSms": "true",
                    "partnerName": MojoPartnerName,
                    "title": localStorage["ptnr"].trim(),
                    "category": "CAB",
                    "drop_location": localStorage["destination_name"],
                    "pickup_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
                    "cab_type": 'sedan',
                    "cab_id": localStorage["ptnr"] == "GOZO CABS" ? GOZOFareId : 0,
                    // "fare_price": localStorage["source_city"].toLowerCase() == "dubai" ? String(dubaiFare).split(" ")[1] : price,
                    "fare_price": FarePrice,
                    "total_kilometers": localStorage["KMNum"],
                    "terminalCode": localStorage["terminalCode"],
                    "msgUniqueId": getRandom(10),
                    "host_id": "Website",
                    "from_city": localStorage["source_city"],
                    "to_city": localStorage["source_city"],
                    "source": localStorage["source_name"],
                    "destination": localStorage["destination_name"],
                    "latitude": localStorage["source_latitude"],
                    "longitude": localStorage["source_longitude"],
                    "isDeparture": 2,
                    "pnr": localStorage["booking_id"],
                    "source_city": localStorage["source_city"].trim(),
                    "source_latitude": localStorage["source_latitude"],
                    "source_longitude": localStorage["source_longitude"],
                    "source_name": localStorage["source_name"],
                    "destination_city": localStorage["destination_city"],
                    "destination_latitude": localStorage["destination_latitude"],
                    "destination_longitude": localStorage["destination_longitude"],
                    "destination_name": localStorage["destination_name"],
                    "status": "CAB",
                    "card_type": '',
                    "content_id": (FarePrice - 75),
                    // "refer_Code": localStorage.CouponCode != undefined ? localStorage.CouponCode : '',
                    "refer_Code": '0',
                    "fixedFareId": localStorage["ptnr"] == "QUICKRIDE" ? quickrideFareId : localStorage["ptnr"] == "MERU" ? localStorage["meruSearchId"] : localStorage["ptnr"] == "MEGA" ? localStorage["megaSearchId"] : "",
                    "carID": localStorage["ptnr"] == "SAVAARI" ? sessionStorage.carID : '',
                    "website_url": "Yatra_ReturnRide",
                    "user_agent": localStorage["userAgent"],
                    "mojoPartner": "Yatra",
                    // "service_charge": localStorage["ptnr"] == "QUICKRIDE" ? 100 : 0 || localStorage["ptnr"] == "GOZO" ? 100: 0 || localStorage["ptnr"] == "MERU" ? 100: 0 ,
                    // "service_charge": ((localStorage["ptnr"] == "QUICKRIDE") || (localStorage["ptnr"] == "GOZO CABS") || (localStorage["ptnr"] == "BLUSMART") || (localStorage["ptnr"] == "MERU") || (localStorage["ptnr"] == "SAVAARI") || (localStorage["ptnr"] == "MEGA")) ? MultiplierAmount : 0,
                    "pay_type": 'post',
                    'paymentMethod': 'PAYBYCASH',
                    "order_reference_number": "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
                    'state': "",
                    "service_charge": parseInt(MultiplierAmount),
                    'advance_amount': (FarePrice - parseInt(MultiplierAmount)),
                    'discount_type': "discount",
                    'discount_amount': 75,
                }
            ]
        };
        console.log(dataJ);

        if ((dataJ.cab_type != 'mojoFixFare') && (MojopartnerReset == 1)) {
            console.log("updatereset");
            fetch(`https://preprodapi.mojoboxx.com/preprod/webapi/partnerBookingCountReset?isReset=1&cityCode=${localStorage["cityCODE"]}&travelType=arrival`)
        }

        localStorage.setItem("cabbookingData", JSON.stringify(dataJ));

        addPaymentType('PAYTM', '', '', 'full_pay', dataJ.clubMember[0].content_id);

    }
})
//////////////////////////////////pay now button code end///////////////////////

// ////////////////// Fetch Cab partner from Mojoboxx fixed fare code start //////////////////
var MojopartnerReset = 0
var MojoPartnerName;
async function loadPartnerData(partnerName, cityName, distance, cabType) {
    return new Promise(async function (resolve, reject) {
        //    fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojofixBookingCount',{
        fetch(BaseAPIURL+domain+'/webapi/mojofixBookingCount', {
            method: 'GET'
        }).then(response => response.json())
            .then(json => {
                if (json.data.length >= 1) {
                    // console.log(json);
                    let CountArr = [];
                    for (let k in json.data) {
                        if (json.data[k].travel_type == "arrival" && (json.data[k].city == localStorage["arrival_Airport"])) {
                            CountArr.push(json.data[k])
                        }
                    }
                    console.log(CountArr)

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
async function loadMojoMultiplier(CityCode) {
    var timeUpdate = moment().hour();
    if (timeUpdate >= "0" && timeUpdate <= "9") {
        timeUpdate = "0" + timeUpdate
    }
    const multiplier = await fetch(BaseAPIURL+domain+'/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=arrival&platform=BAC")
    //   const multiplier = await fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + moment().hour() + "&travel_type=arrival&platform=Yatra")
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

async function calculatePricePartnerWise(partnerName, KMNum, cabTyp, cityName) {
    return new Promise(async function (resolve, reject) {
        var desP;
        var distanceP = KMNum;
        var hypenVal;
        var hypen_pos;
        var dis;
        var dis2;
        var amt;
        if (partnerName == "QUICKRIDE") {
            // $("#prQUICKRIDE").html("Please wait..")
            // $("#prQUICKRIDE").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let quickrideResp = await GetFarefromPartner(cabTyp);
            resolve(true);
        }
        else if (partnerName == "MEGA") {
            // $("#prMEGA").html("Please wait..")
            // $("#prMEGA").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let megaResp = await GetFareFromMega(cabTyp);
            resolve(true);
        }
        else if (partnerName == "BUDDY CABS") {
            // $("#prBUDDY CABS").html("Please wait..")
            // $("#prBUDDY CABS").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let BuddyFare = await GetFarefromPartnerBuddy(cabTyp);
            resolve(true);
        }
        else if (partnerName == "MERU") {
            // $("#prMERU").html("Please wait..")
            // $("#prMERU").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let MeruResp = await GetFarefromMeru(cabTyp);
            resolve(true);
        }
        else if (partnerName == "GOZO CABS") {
            let gozofare = await GetFareFromGozoPartner(cabTyp)
            resolve(true);
        } else if (partnerName == "COOP") {
            // $("#pr2COOP").css("display", "none");
            // $("#prCOOP").html("Please wait..");
            // $("#prCOOP").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let coopFare = await coop_call(cabTyp);
            resolve(true);
        }
        else if (partnerName == "BLUSMART") {
            // $("#pr2BLUSMART").css("display", "none");
            // $("#prBLUSMART").html("Please wait..");
            // $("#prBLUSMART").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let BLUMSMARTfare = await checkFareBlusmart(cabTyp);
            resolve(true);
        }

        else if (partnerName == "GOAMILES") {
            // $("#pr2COOP").css("display", "none");
            // $("#prCOOP").html("Please wait..");
            // $("#prCOOP").css("font-size", "16px");
            // $("#fare").css("width", "100%");
            let GOAMILESFare = await checkFareGoamiles(cabTyp);
            resolve(true);
        }
        else {
            await loadCityName(cityName)
            $(".bookBtn").css("display", "none")
            var fareData = await loadFareFormDB(partnerName, cityNameFetch, distanceP, cabTyp.toLowerCase());
            resolve(fareData);
        }
        resolve(true)
    })
}

// ///////////////////////Get fare from Quickride API code start////////////////////////
var quickrideFareId;
var QuickrideFareResponse;
async function GetFarefromPartner(PartnercabType) {
    return new Promise(async function (resolve, reject) {
        // document.getElementById("pr2QUICKRIDE").style.display = "none";
        var fetchResponse;

        var datasend = {
            key: "MojoBox-Klm9.45j",
            vendor_id: "MOJO_BOXX_ZORY",
            destination_name: localStorage["destination_name"],
            destination_city: localStorage["destination_city"],
            destination_latitude: localStorage["destination_latitude"],
            destination_longitude: localStorage["destination_longitude"],
            source_name: localStorage["source_name"],
            source_city: localStorage["source_city"],
            source_latitude: localStorage["source_latitude"],
            source_longitude: localStorage["source_longitude"],
            start_time: moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
            end_time: "",
            tripType: "Local"
        }
        $("#fare").css("width", "45%");
        // fetch('https://qtds.getquickride.com:443/taxidemandserver/rest/mojobox/taxi/booking/search', {
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
                    QuickrideFareResponse = fetchResponse.fareForTaxis[a].fares;
                    // console.log(fareResponse);
                    if (fareResponse.length >= 1) {
                        for (let i = 0; i < fareResponse.length; i++) {
                            if (fareResponse[i].taxiType == "Car" && fareResponse[i].vehicleClass.toLowerCase() == PartnercabType.toLowerCase()) { // console.log(fareResponse[i].taxiType);
                                quickrideFareId = fareResponse[i].fixedFareId;
                                fareAmountInteger = parseInt(fareResponse[i].maxTotalFare) + parseInt(MultiplierAmount)
                                console.log("quickride" + MultiplierAmount);
                                // let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                                // if (String(AmountDiscount).includes(".")) {
                                //     var splitAmount = String(AmountDiscount).split(".")
                                //     var splitAmount2 = splitAmount[0];
                                // } else {
                                //     splitAmount2 = AmountDiscount;
                                // }
                                // $("#fare").css("width", "45%");
                                localStorage.setItem("partnerFare", parseInt(fareAmountInteger));
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
async function GetFarefromMeru(PartnercabType) {
    return new Promise(async function (resolve, reject) {
        // document.getElementById("pr2MERU").style.display = "none";
        let meruSearchId = Math.random().toString(16).slice(2)
        localStorage.setItem("meruSearchId", meruSearchId)
        let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
        var city = localStorage["source_city"]
        // var hardCodeCity =
        console.log(city)

        var datasend = {
            "source": {
                "place_id": localStorage["MAPPLACEID"],
                "address": localStorage["source_name"],
                // "address": localStorage["terminalCode"],
                "latitude": localStorage["source_latitude"],
                "longitude": localStorage["source_longitude"],
                "city": localStorage["source_city"],
            },
            "destination": {
                "place_id": null,
                "address": localStorage["destination_name"],
                "latitude": localStorage["destination_latitude"],
                "longitude": localStorage["destination_longitude"],
                "city": localStorage["destination_city"],
                // "city": "Delhi",
            },
            "trip_type": "ONE_WAY",
            "start_time": moment(meruTime).add(3, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
            "end_time": moment(meruTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
            "search_id": meruSearchId,
            // "one_way_distance": localStorage["KMVal"].includes(".") ? localStorage["KMVal"].split(".")[0] : localStorage["KMVal"],
            "one_way_distance": localStorage["KMNum"].includes(".") ? localStorage["KMNum"].split(".")[0] : localStorage["KMNum"],
            "package_distance": 0,
            "is_instant_search": false,
        }
        console.log(datasend)
        // $("#fare").css("width", "45%");
        fetch(BaseAPIURL+domain+'/webapi/getMeruFarePrice',
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
                var fare
                newResult.data.response.car_types.forEach((elem) => {
                    console.log(elem)
                    if (elem.type.toLowerCase() == PartnercabType.toLowerCase()) {
                        fare = elem.fare_details.base_fare + elem.fare_details.extra_charges.toll_charges["amount"] + elem.fare_details.extra_charges.parking_charges["amount"]
                    }

                })

                var FareAmount = fare + parseInt(MultiplierAmount);
                // console.log("Meru"+ parseInt(MultiplierAmount));
                // let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                // if (String(AmountDiscount).includes(".")) {
                //     var splitAmount = String(AmountDiscount).split(".")
                //     var splitAmount2 = splitAmount[0];
                // } else {
                //     splitAmount2 = AmountDiscount;
                // }
                // $("#fare").css("width", "45%");

                // filldetailsInCard('MERU', parseInt(FareAmount))
                localStorage.setItem("partnerFare", parseInt(FareAmount));
                resolve(parseInt(FareAmount))
                // return true
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
        // document.getElementById("pr2BUDDY CABS").style.display = "none";
        var fetchResponse;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "destination_name": localStorage["destination_name"],
            "destination_city": localStorage["destination_city"],
            "destination_latitude": localStorage["destination_latitude"],
            "destination_longitude": localStorage["destination_longitude"],
            "source_name": localStorage["source_name"],
            "source_city": localStorage["source_city"],
            "source_latitude": localStorage["source_latitude"],
            "source_longitude": localStorage["source_longitude"],
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
                            fareAmountInteger = parseInt(fareResponse[i].totalCharge);
                            // let AmountDiscount = ((50 / (fareAmountInteger + Number(50)) * 100));
                            // if (String(AmountDiscount).includes(".")) {
                            //     var splitAmount = String(AmountDiscount).split(".")
                            //     var splitAmount2 = splitAmount[0];
                            // } else {
                            //     splitAmount2 = AmountDiscount;
                            // }
                            // $("#fare").css("width", "45%");


                            // filldetailsInCard('BUDDY CABS', parseInt(fareAmountInteger))

                            // document.getElementById("pr2BUDDY CABS").style.display = "block";
                            // $("#prBUDDY CABS").css("font-size", "16px");
                            // document.getElementById("discountBUDDY CABS").innerHTML = splitAmount2 + "% off"
                            // document.getElementById("prBUDDY CABS").innerHTML = " ₹ " + fareAmountInteger
                            // document.getElementById("pr2BUDDY CABS").innerHTML = "₹" + (
                            //     Number(fareAmountInteger) + Number(50)
                            // )
                            // localStorage.setItem("finalFareBUDDY CABS", fareAmountInteger);
                            // localStorage.setItem("TotalFare", fareAmountInteger);
                            localStorage.setItem("partnerFare", parseInt(fareAmountInteger));
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

// /////////////////////// start MEGA /////////////////////////////////////////////////
const GetFareFromMega = async (PartnercabType) => {
    return new Promise(async (resolve, reject) => { // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
        // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");

        let megaSearchId = Math.random().toString(16).slice(2)
        localStorage.setItem("megaSearchId", megaSearchId)
        let meruTime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00"
        var city = localStorage["source_city"]

        let sendquestedData = {

            "destination": {
                "place_id": null,
                "address": localStorage["destination_name"],
                "latitude": localStorage["destination_latitude"],
                "longitude": localStorage["destination_longitude"],
                "city": localStorage["destination_city"],
            },

            "source": {
                // "place_id": MapPlaceId,
                "place_id": null,
                "address": localStorage["source_name"],
                "latitude": localStorage["source_latitude"],
                "longitude": localStorage["source_longitude"],
                "city": localStorage["source_city"].trim(),
            },
            "trip_type": "ONE_WAY",
            "start_time": moment(meruTime).add(3, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
            "end_time": moment(meruTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
            "search_id": megaSearchId,
            "one_way_distance": localStorage["KMNum"].includes(".") ? localStorage["KMNum"].split(".")[0] : localStorage["KMNum"],
            "package_distance": 0,
            "is_instant_search": false,
        };
        console.log(sendquestedData);
        // const ReferMega = await fetch("https://preprodapi.mojoboxx.com/preprod/webapi/getMegaFare", {
        const ReferMega = await fetch(BaseAPIURL+domain+"/webapi/getMegaFare", {

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
                    let amountValue = getMega.data.response.car_types[i].fare_details.grand_total + parseInt(MultiplierAmount);
                    console.log("mega" + parseInt(MultiplierAmount));
                    // let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                    // if (String(AmountDiscount).includes(".")) {
                    //     var splitAmount = String(AmountDiscount).split(".")
                    //     var splitAmount2 = splitAmount[0];
                    // } else {
                    //     splitAmount2 = AmountDiscount;
                    // }
                    // $("#fare").css("width", "45%");

                    //   filldetailsInCard('MEGA', parseInt(amountValue))

                    // document.getElementById("pr2MEGA").style.display = "block";
                    // $("#pr2MEGA").css("font-size", "16px");
                    // document.getElementById("discountMEGA").innerHTML = splitAmount2 + "% off"
                    // document.getElementById("prMEGA").innerHTML = " ₹ " + amountValue
                    // document.getElementById("pr2MEGA").innerHTML = "₹" + (Number(amountValue) + Number(50))
                    // localStorage.setItem("finalFareMEGA", amountValue);
                    // localStorage.setItem("TotalFare", amountValue);
                    localStorage.setItem("partnerFare", parseInt(amountValue));
                    resolve(amountValue)
                }
                else {
                    // document.getElementById("pr2MEGA").style.display = "none";
                    // document.getElementById("prMEGA").innerHTML = "Fare not found"
                    // document.getElementById("prMEGA").style.fontSize = "10px";
                    resolve(true)
                }
            }
        }
        else {
            // document.getElementById("pr2MEGA").style.display = "none";
            // document.getElementById("prMEGA").innerHTML = "Fare not found"
            // document.getElementById("prMEGA").style.fontSize = "10px";
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
        let total_km = localStorage["KMNum"].includes(".") ? localStorage["KMNum"].split(".")[0] : localStorage["KMNum"];
        let totalkm = Math.round(total_km[0]);
        let dateandtime = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + (moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00");
        console.log(dateandtime)

        var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Basic c3BpY2VqZXQtZGV2OjBuV2FSTDZXaDU1NjEwMmtBc1lW");
        myHeaders.append("Authorization", "Basic NjYzZDJmNDhlOGEwN2I4ZmY1M2E3YWM5YjMzYTk4ZDk6MmJjNTYyMzZlNjk2YThkM2FiNjYyNDU3ZGJhZjdhNjM=");

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "*");

        var raw = JSON.stringify({
            "source": {
                "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                "address": localStorage["source_name"].trim(),
                "latitude": localStorage["source_latitude"],
                "longitude": localStorage["source_longitude"],
                "city": localStorage["source_city"].trim(),
            },
            "destination": {
                "place_id": "ChIJv01jvzAZDTkReNbfdLygyf8",
                "address": localStorage["destination_name"].trim(),
                "latitude": localStorage["destination_latitude"],
                "longitude": localStorage["destination_longitude"],
                "city": localStorage["destination_city"].trim(),
            },
            "trip_type": "ONE_WAY",
            "search_id": Math.random().toString(14).slice(2),
            "start_time": moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm") + ":00",
            "end_time": moment(dateandtime).add(50, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            "vendor_id": "PARTNER_CODE",
            "partner_name": "SPICEJET",
            "search_tags": [
                "EPASS"
            ],
            "one_way_distance": totalkm
        });

        console.log(raw)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // fetch("https://fusion.tracking.uat.blucgn.com/api/v1/booking/search", requestOptions)
        fetch("https://fusion.tracking.blucgn.com/api/v1/booking/search", requestOptions)

            .then(response => response.text())
            .then(result => {
                var newResult = JSON.parse(result)
                let amountValue = newResult.response.car_types[0].fare_details.base_fare + parseInt(MultiplierAmount)
                console.log("Blusmart" + parseInt(MultiplierAmount));
                console.log(newResult.response.car_types[0].fare_details.base_fare)
                // document.getElementById("prBLUSMART").innerHTML = "₹" + (
                //     newResult.response.car_types[0].fare_details.base_fare
                // )
                // let AmountDiscount = ((50 / (parseInt(amountValue) + Number(50)) * 100));
                // if (String(AmountDiscount).includes(".")) {
                //     var splitAmount = String(AmountDiscount).split(".")
                //     var splitAmount2 = splitAmount[0];
                // } else {
                //     splitAmount2 = AmountDiscount;
                // }
                // localStorage.setItem("finalFareBLUSMART", amountValue);
                // localStorage.setItem("TotalFare", amountValue);
                localStorage.setItem("partnerFare", parseInt(amountValue));
                resolve(amountValue)
                return
            }
            )
            .catch(error => {
                // console.log('error', error)
                // $("#prBLUSMART").html("Slot not available, choose diff time");
                // $("#prBLUSMART").css({ "font-size": "8px", "width": "100%" });
                // $("#fare").css("width", "100%");
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
        var tym_date = moment(new Date()).add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss')
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
                    "mobile": document.getElementById("mobile").innerText,
                    "source_address": localStorage["source_name"],
                    "source_latitude": localStorage["source_latitude"],
                    "source_longitude": localStorage["source_longitude"],
                    "destination_address": localStorage["destination_name"],
                    "destination_latitude": localStorage["destination_latitude"],
                    "destination_longitude": localStorage["destination_longitude"],
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
                        var FareAmount = gozofare[a]["fare"]["totalAmount"] + parseInt(MultiplierAmount);
                        console.log("GozoFare" + parseInt(MultiplierAmount))
                        // console.log(FareAmount)
                        localStorage.setItem("partnerFare", parseInt(FareAmount));
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

// //////////////////////// coop getfare code start ////////////////////////////
async function coop_call(PartnercabType) {
    return new Promise(async (resolve, reject) => {
        const total_km = localStorage["KMNum"].includes(".") ? localStorage["KMNum"].split(".")[0] : localStorage["KMNum"];
        const totalkm = Math.round(total_km[0]);

        dataJ = {
            "total_distance": totalkm,
            "source_city": localStorage["source_city"].trim(),
            "destination_city": localStorage["destination_city"].trim(),
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
                        // let AmountDiscount = ((50 / (Number(FareAmount) + Number(50)) * 100));
                        // if (String(AmountDiscount).includes(".")) {
                        //     var splitAmount = String(AmountDiscount).split(".")
                        //     var splitAmount2 = splitAmount[0];
                        // } else {
                        //     splitAmount2 = AmountDiscount;
                        // }
                        // $("#pr2COOP").css("display", "block");
                        // $("#fare").css("width", "45%");
                        //  filldetailsInCard('COOP', parseInt(FareAmount))

                        // document.getElementById("pr2COOP").style.display = "block";
                        // document.getElementById("discountCOOP").innerHTML = splitAmount2 + "% off"
                        // document.getElementById("prCOOP").innerHTML = " ₹ " + FareAmount
                        // document.getElementById("pr2COOP").innerHTML = "₹" + (
                        //     Number(FareAmount) + Number(50)
                        // )
                        // localStorage.setItem("finalFareCOOP", FareAmount);
                        // localStorage.setItem("TotalFare", FareAmount);
                        localStorage.setItem("partnerFare", parseInt(FareAmount));
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
            url: BaseAPIURL+domain+'/webapi/getCoopPrice'
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
            "pickup_latlng": localStorage["source_latitude"] + "," + localStorage["source_longitude"],
            "pickup_address": $("#cabPickupTerminal :selected").text().trim(),
            "bookingId": '',
            "pickup_time": moment().format('YYYY-MM-DD HH:mm:ss'),
            "drop_latlng": localStorage["pickup_lat"] + "," + localStorage["pickup_long"],
            "drop_address": $("#pac-input").val()

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
                        if (element.vehicle_type_name.toLowerCase() == cabTyp.toLowerCase()) {
                            // console.log(element.vehicle_type_name);
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
            url: BaseAPIURL+domain+'/webapi/updateBookingLatLongGoa'
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
        url: BaseAPIURL+domain+'/webapi/generateBookingGoa'
    });
}
///////////////////// Goa miles booking cab code end  ///////////////////


///////////////////////////////////////////code for return ride popup end////////////////////


$("#status6").click(function () {
    // localStorage.setItem("discount", document.getElementById("couponapi").innerText);
    $("#confirmation_boxCabDiv5").css("display", "none");
    $("#confirmation_boxCab5").css("display", "none");
    window.location.href = "https://yatra.bookairportcab.com/arrival.html";
})

$('#returnArrival').click(function () {
    location.href = "arrival.html?loadData";
})

document.getElementById("arrivalBook").onclick = function () {
    if ($("#arrVAL").text() == "Book Now") {
        location.href = "arrival.html";
    }
    else {
        $(".confirmation_boxCabDiv2").css("display", "none");
        $(".confirmation_boxCab2").css("display", "none");
    }
}
document.getElementById("arrivalBook2").onclick = function () {
    if ($("#arrivalBook2").text() == "Book Now") {
        location.href = "reactspicejetserver/index.html";
    }
    else {
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("visibility", "hidden");
    }
}
///////////////////////Book arrival cab code end /////////////////////////////

///////////////////////Book arrival cab code start ///////////////////////////
$("#status6").click(function () {
    localStorage.setItem("discount", document.getElementById("couponapi").innerText);
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "arrival.html";
})

document.getElementById("arrivalBook").onclick = function () {
    if ($("#arrVAL").text() == "Book Now") {
        location.href = "arrival.html";
    }
    else {
        $(".confirmation_boxCabDiv2").css("display", "none");
        $(".confirmation_boxCab2").css("display", "none");
    }
}
document.getElementById("arrivalBook2").onclick = function () {
    if ($("#arrivalBook2").text() == "Book Now") {
        location.href = "reactspicejetserver/index.html";
    }
    else {
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("visibility", "hidden");
    }
}
///////////////////////Book arrival cab code end /////////////////////////////

/////////////////////Check Arrival cab availability code start //////////////
async function CheckArrivalCity() {
    $.ajax({
        type: 'GET',
        url: BaseAPIURL+domain+'/webapi/getCityList',
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            console.log(data)
            let dynamicOption = '';
            var cityArray = [];
            data.forEach(element => {
                if (element.is_arrival == "1") {
                    cityArray.push(element);
                }
            })
            // console.log(cityArray);
            var arrItem = cityArray.filter(item => {
                if (item.code == localStorage["arrival_Airport"]) {
                    return item;
                }
            })
            // console.log(arrItem)
            if (arrItem.length >= 1) {
                $("#popupvalue").addClass("show");
                $("#arrivalBook2").html("Book Now");
            }
            else {
                $("#popupvalue").addClass("hide");
                $("#arrivalBook2").html("Okay");
                $("#referclose2").css("display", "none");
                $("#reserve").html(" ");

                let pnrD = JSON.parse(localStorage["pnrData"]);
                Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ArrivalStation_notAvail");

            }
            departure_Ads();
        },
        error: function (e) {
            console.log(e)
        }
    });


}

/////////////////////Check Arrival cab availability code end ///////////////

////////////////////////////////////////email button/////////////////////////////////////////////
var BookingData = JSON.parse(localStorage["cabbookingData"])
var BookigInnerLoad;
BookigInnerLoad = BookingData.clubMember[0];
$("#icon").click(function () {

    var emailVal = $("#typemail").val()
    if (emailVal == "") {
        alert("Please enter your email id")
        return false
    }
    else {
        $('#cmcb').css('display', 'block')
        $('#icon').css('display', 'none')
        $('#typemail').css('display', 'none')
        $('#line').css('display', 'none')
        $('#sentmail').css('display', 'block')
        console.log(BookigInnerLoad);
        sendEmail($("#typemail").val(), BookigInnerLoad.order_reference_number, BookigInnerLoad.mobile, "BAC")

    }

})




//////////////////////////////////Send Email///////////////////////////////

function sendEmail(email, bookingId, phoneNumber, name) {
    // console.log("hey");
    // console.log(email, bookingId, phoneNumber);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "email": email,
        "name": name,
        "bookingId": bookingId,
        "urlType": "CAB",
        "phoneNumber": phoneNumber,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(BaseAPIURL+domain+"/webapi/sendEmailOfInvoice", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
