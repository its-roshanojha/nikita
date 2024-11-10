var BookigInnerLoad;
$(".spinner").css("display", "block")
$(".spinnerBack").css("display", "block")
window.onload = async function () {
    // console.log(BookigInnerLoad.cab_category != "Rental")
    // console.log(BookigInnerLoad.cab_category != "Outstation")
    // console.log(BookigInnerLoad.isDeparture == 1)
    // console.log(BookigInnerLoad.isDeparture == 2)
    if ((BookigInnerLoad.cab_category != "Rental" && BookigInnerLoad.cab_category != "Outstation")) {
        if (sessionStorage["paymentmethod_display"]) {
            $(".confirmation_boxCabDiv").css("display", "block");
            if ((sessionStorage["paymentmethod_display"].toLowerCase() == "full,partial,cash") || (sessionStorage["paymentmethod_display"].toLowerCase() == "full,cash,partial") || (sessionStorage["paymentmethod_display"].toLowerCase() == "partial,full,cash") || (sessionStorage["paymentmethod_display"].toLowerCase() == "partial,cash,full") || (sessionStorage["paymentmethod_display"].toLowerCase() == "cash,full,partial") || (sessionStorage["paymentmethod_display"].toLowerCase() == "cash,partial,full")) {
                // setTimeout(() => {
                    $("#laterbutton").css("display", "block")
                    $(".confirmation_boxCabDiv").css("display", "none");
                // }, 500);
            }
            else if ((sessionStorage["paymentmethod_display"].toLowerCase() == "full,partial") || (sessionStorage["paymentmethod_display"].toLowerCase() == "partial,full")) {
                // setTimeout(() => {
                    $("#laterbutton").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "none");
                // }, 500);
            }
            else if ((sessionStorage["paymentmethod_display"].toLowerCase() == "full,cash") || (sessionStorage["paymentmethod_display"].toLowerCase() == "cash,full")) {
                // setTimeout(() => {
                    $("#partbutton").css("display", "none")
                    $(".confirmation_boxCabDiv").css("display", "none");
                // }, 500);
                // alert("fulcash")
            }
            else if (sessionStorage["paymentmethod_display"].toLowerCase() == "full") {
                // setTimeout(() => {
                    $(".paymentoptionnew").css({ "display": "block", "padding-left": "7px", "margin-bottom": "20px" })
                    $("#partbutton").css("display", "none")
                    $("#laterbutton").css("display", "none")
                    $(".triangle").css({ "display": "block", "margin-left": "12%" })
                    $(".confirmation_boxCabDiv").css("display", "none");
                    document.getElementById("tri1").style.right = "0px";
                // }, 500);
                // alert("fulcash")
            }
            else if (sessionStorage["paymentmethod_display"].toLowerCase() == "partial") {
                // setTimeout(() => {
                    // $("#partbutton").css("display", "none")
                    $("#fullbutton").css("display", "none")
                    $("#laterbutton").css("display", "none")
                    $(".paymentoptionnew").css({ "display": "block", "padding-left": "7px", "margin-bottom": "20px" })
                    $(".triangle").css({ "display": "block", "margin-left": "12%" })
                    $(".confirmation_boxCabDiv").css("display", "none");
                    document.getElementById("tri1").style.right = "0px";
                // }, 500);
                // alert("fulcash")
            }
            else if (sessionStorage["paymentmethod_display"].toLowerCase() == "cash") {
                // setTimeout(() => {
                    $("#partbutton").css("display", "none")
                    $("#fullbutton").css("display", "none")
                    // $("#laterbutton").css("display", "none")
                    $(".paymentoptionnew").css({ "display": "block", "padding-left": "7px", "margin-bottom": "20px" })
                    $(".triangle").css({ "display": "block", "margin-left": "12%" })
                    $(".confirmation_boxCabDiv").css("display", "none");
                    showcashDetails()
                    document.getElementById("tri1").style.display = "block";
                    document.getElementById("tri2").style.display = "none";
                    document.getElementById("tri3").style.display = "none";
                    document.getElementById("tri1").style.right = "0px";
                // }, 500);
                // alert("fulcash")
            }
            else {
                // setTimeout(() => {
                    $("#laterbutton").css("display", "block")
                    $(".confirmation_boxCabDiv").css("display", "none");
                // }, 500);
            }
        }
    }else{
        $('#autofill').css("display", "none")
    }

    $(".spinner").css("display", "block")
    $(".spinnerBack").css("display", "block")

    if (localStorage["PNR_Data"] == "Found") {
        let pnrD = JSON.parse(localStorage["pnrData"]);
        Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "Confirmation_Page");
    } else {
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "C2AConfirmation_Page");
    }
    await loadBookingData();
    //s console.log(loadBookingData());



    ///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////

    //console.log(localStorage["departurebookingData"]);
    async function loadBookingData() {
        var BookingData = JSON.parse(localStorage["departurebookingData"])
        BookigInnerLoad = BookingData.clubMember[0];
        //console.log(BookingData);
        console.log(JSON.parse(localStorage["departurebookingData"]));


        //console.log(BookigInnerLoad.card_type);
        //console.log(BookigInnerLoad.service_charge);

        // if (BookigInnerLoad.card_type == 'mojoFixFare') {
        //     $("#partbutton").css("display", "none")
        // }
        // else {
        //     $("#partbutton").css("display", "block")
        // }
        //alert(BookigInnerLoad.service_charge)
        $("#PayNowl").html("₹" + (Number(BookigInnerLoad.service_charge) + Number(50)))
        $("#PayNow2l").html("₹" + (Number(BookigInnerLoad.service_charge) + Number(50)))
        $("#showpart").html("₹" + (Number(BookigInnerLoad.service_charge) + Number(50)))


        if ((BookigInnerLoad.isDeparture == 2 && BookigInnerLoad.cab_category == "Rental") || (BookigInnerLoad.isDeparture == 1 && BookigInnerLoad.cab_category == "Outstation")) {
            $("#showlater").html("₹" + BookigInnerLoad.content_id)
            $("#PayNow1").html("₹" + BookigInnerLoad.content_id)
            $("#laterbutton").css("display", "none")
        }
        else {
            $("#showlater").html("₹" + localStorage["cashAmountFlow"])
            $("#PayNow1").html("₹" + localStorage["cashAmountFlow"])

        }

        $("#showfull").html("₹" + BookigInnerLoad.content_id)

        $("#pricemoney").html("₹" + BookigInnerLoad.content_id)
        $("#PayNow").html("₹" + BookigInnerLoad.content_id)
        $("#PayNow2").html("₹" + BookigInnerLoad.content_id)

        //localStorage.setItem("MojoboxxFare", MojoFare[0]);
        //console.log( localStorage("MojoboxxFare"));

        //$("#PayNow1").html("₹" + BookigInnerLoad.fare_price)
        $("#currentmobile").text(BookigInnerLoad.mobile)
        $("#cab_type").text(BookigInnerLoad.cab_type)
        $("#currenttime").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#currentdate").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        $("#mobileauto").val(BookigInnerLoad.mobile)
        $("#currentpick").html(BookigInnerLoad.source_name)
        $("#currentdrop").html(BookigInnerLoad.destination_name);

        $("#cabType").html(BookigInnerLoad.cab_type)
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


        var fare = BookigInnerLoad.fare_price
        var splitFare = parseInt(fare) + 50;
        var fareVal = parseInt(fare);

        if (BookigInnerLoad.to_city == "DXB") {
            $("#bfp").html(localStorage["DubaiFare"]);
            $("#tobfp").html(localStorage["DubaiFare"]);
            $("#discount_amount").html("₹" + 0);
        }
        else {
            $("#bfp").html("₹" + splitFare);
            $("#tobfp").html("₹" + fareVal);
            $("#discount_amount").html("₹" + 50);
        }
        $(".spinner").css("display", "none")
        $(".spinnerBack").css("display", "none")

        $("#epr").html(BookigInnerLoad.fare_price);
        $("#eprk").html(BookigInnerLoad.total_kilometers + "Km");
        $("#pickUpLock").html(BookigInnerLoad.source_name)

        if ((BookigInnerLoad.partnerName == "SAVAARI") || (BookigInnerLoad.partnerName == "QUICKRIDE")  || (BookigInnerLoad.partnerName == "BLUSMART") || (BookigInnerLoad.partnerName == "MEGA")) {
            document.getElementById("inclusivetolls").innerHTML = "Inclusive of airport tolls and taxes"
        } else if (BookigInnerLoad.partnerName == 'mojofare') {
            document.getElementById("inclusivetolls").innerHTML = ""
        } else {
            document.getElementById("inclusivetolls").innerHTML = "Exclusive of airport tolls and taxes"
        }

        $("#dropLoc").html(BookigInnerLoad.destination_name);
        $("#picTym").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#picTime").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        // moment(localStorage["currentDate"],["YYYY-MM-DD",'DD-MM-YYYY']).format('DD-MM-YYYY'));
        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }
    }
    if (localStorage["PNR_Data"] == "Found") {
        // await CheckArrivalCity();
        // $("#popupvalue").addClass("show");
        // $("#arrivalBook2").html("Book Now");
        $("#popupvalue").addClass("hide");
        $("#arrivalBook2").html("Okay");
    }
    else {
        departure_Ads(BookigInnerLoad);
        // $("#popupvalue").addClass("show");
        // $("#arrivalBook2").html("Book Now");
        $("#popupvalue").addClass("hide");
        $("#arrivalBook2").html("Okay");
        // $("#referclose2").css("display", "none");
        // $("#reserve").html(" ");
    }
}


///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////


///////////////////// DISPLAY ADS CODE START ///////////////////////// 
async function departure_Ads(BookigInnerLoad) {
    const ads = await fetch(BaseURL+domain+"/webapi/getDepartureAds")
    const adResponse = await ads.json();
    // console.log(adResponse.length);

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
        $("#cmmsg2").html("For any assistance call 08047094944");
        if (BookigInnerLoad.partnerName == "QUICKRIDE" || BookigInnerLoad.partnerName == "GOZO CABS" || BookigInnerLoad.partnerName == "BLUSMART") {
            $("#cmmsg3").html("Don't forget to take your cashback , after successful payment through payment link sent to your mobile number.For any assistance call 08047094944");
        }
        else {
            $("#cmmsg3").html("For any assistance call 08047094944");
        }
        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        $("#arrVAL").html("Book Now")
    }
    if ($("#popupvalue").hasClass("hide")) {
        $("#cmmsg1").html("Your booking request is submitted successfully.");
        $("#cmmsg2").html("You will receive confirmation details shortly through SMS & Email.");
        if (BookigInnerLoad.partnerName == "QUICKRIDE" || BookigInnerLoad.partnerName == "GOZO CABS" || BookigInnerLoad.partnerName == "BLUSMART") {
            $("#cmmsg3").html("Don't forget to take your cashback , after successful payment through payment link sent to your mobile number. For any assistance call 08047094944");
        }
        else {
            $("#cmmsg3").html("For any assistance call 08047094944");
        }
        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        $("#referclose").css("display", "none");
        $("#arrVAL").html("Okay")
    }
}
///////////////////// DISPLAY ADS CODE END //////////////////////////  


////////////////////PDF DOWNLOAD CODE START ///////////////////////////////  
$('#cabForm').on("submit", async function (e) {
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


});

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
    const Refercode = await fetch(BaseURL+domain+"/webapi/get_DetailsOfReferalCode", {
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
        var message = "Hey! " + "\n" + "I had an amazing experience with SpiceJet Airport Cabs." + "\n" + "Book your cab using this code " + sessionStorage["codevalue"] + " and we will both get a confirmed cashback." + "\n" + "Book Now! https://spicescreen.com/cabs"
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

// document.getElementById("arrivalBook").onclick = function () {
//     if ($("#arrVAL").text() == "Book Now") {
//         location.href = "reactspicejetserver/index.html";
//     }
//     else {
//         $(".confirmation_boxCabDiv2").css("display", "none");
//         $(".confirmation_boxCab2").css("display", "none");
//     }
// }
// document.getElementById("arrivalBook2").onclick = function () {
//     if ($("#arrivalBook2").text() == "Book Now") {
//         location.href = "reactspicejetserver/index.html";
//     }
//     else {
//         $(".confirmation_boxCabDiv").css("display", "none");
//         $(".confirmation_boxCab").css("visibility", "hidden");
//     }
// }
///////////////////////Book arrival cab code end /////////////////////////////

/////////////////////Check Arrival cab availability code start //////////////
async function CheckArrivalCity() {
    $.ajax({
        type: 'GET',
        url: BaseURL+domain+'/webapi/getCityList',
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



///////Simpl Code Start Here/////////////////////////////////
$("#simple_div").click(function () {
    $(".confirmation_boxCabDiv").css("display", "block");
    $(".confirmation_boxCabsimpl").css("display", "block");
})



$("#button1").click(function () {
    // var BookingData = JSON.parse(localStorage["departurebookingData"])
    // BookigInnerLoad = BookingData.clubMember[0];
    // console.log(BookigInnerLoad.mobile);

    var userMobile = $('#mobileauto').val()
    console.log(userMobile);
    var REDIRECTION_URL = '';
    var PolicyShow = '';
    //var userMobile = BookigInnerLoad.mobile

    const check_eligibility_fc = async (userMobile) => {
        const registerClubMember = JSON.parse(localStorage.departurebookingData);
        const final_data = registerClubMember.clubMember;
        const rawResponse = await fetch(
            // "https://preprod.mojoboxx.com/preprod/webapi/check_eligibility",
            BaseURL+domain+"/webapi/check_eligibility",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone_number: userMobile,
                    amount: 2000 * 100,
                    manufacturer: "apple",
                    model: "iphone",
                    id: "10.10.101.1",
                }),
            }
        );
        // console.log(rawResponse.body)
        const content = await rawResponse.json();
        // console.log(content);

        if (content.data.data.status == "not_eligible") {
            // $("#checkEligibilityMessage").html(`your are not eligible`);
            // $(".confirm_btn").css("display", "none");
            // alert("you are not eligible")
            $("#cmmsg").html("You are not eligible");
            $(".thank_msg i").css("display", "none");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $('#status').click(function () {
                $(".confirmation_boxCabDiv").css("display", "none");
                $(".confirmation_boxCab").css("display", "none");

                $(".confirmation_boxCabsimpl").css("display", "none");
            })
            $('#cross.').click(function () {
                $(".confirmation_boxCabDiv").css("display", "none");
                $(".confirmation_boxCab").css("display", "none");
            })
            $('#button1.').click(function () {
                $(".confirmation_boxCabDiv").css("display", "none");
                $(".confirmation_boxCab").css("display", "block");
            })
        }

        if (content.data.data.error_code == "pending_dues") {
            $("#checkEligibilityMessage").html(
                //             $("#cmmsg").html("Please enter a valid mobile number");
                // $(".thank_msg i").css("display", "none");
                // $(".confirmation_boxCabDiv").css("display", "block");
                // $(".confirmation_boxCab").css("display", "block");
                //             `payment over due Rs. ${content.data.data.metadata.pending_due_in_paise / 100}`
            );
            $(".confirm_btn").css("display", "block");
            $(".confirm_btn").prop("disabled", false);
            $("#confirmTxt").html("Pay Now");
            REDIRECTION_URL = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-pending_dues-${userMobile}-${content.data.data.metadata.pending_due_in_paise}`;
        }

        if (content.data.data.error_code == "insufficient_credit") {
            // $("#checkEligibilityMessage").html(`pending dues`);
            // $(".confirm_btn").css("display", "block");
            // $(".confirm_btn").prop("disabled", false);
            // $("#confirmTxt").html("Pay Now");
            OK
            REDIRECTION_URL = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-pending_dues-${userMobile}-${content.data.data.available_credit_in_paise}`;
        }

        if (
            content.data.data.status == "eligible" &&
            content.data.data.error_code == "linking_required" &&
            content.data.data.redirection_url != ""
        ) {
            $(".confirm_btn").css("display", "block");
            $(".confirm_btn").prop("disabled", false);
            $("#confirmTxt").html("Link your simpl account");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab3").css("display", "block");
            // if (REDIRECTION_URL != '') {
            //     window.location = `${REDIRECTION_URL}`
            // }
            $("#status3").click(function () {
                window.location = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-linking_required-${userMobile}-000`;
            })
            $('#cross3').click(function () {
                $(".confirmation_boxCabDiv").css("display", "none");
                $(".confirmation_boxCab3").css("display", "none");
            })

        }

        if (
            content.data.data.status == "eligible" &&
            content.data.data.error_code == null &&
            content.data.data.redirection_url == null
        ) {
            REDIRECTION_URL = "";
            $("#payLater").prop("disabled", false);
            // $("#cmmsg2").html("You are eligible");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab2").css("display", "block");
            $("#checkEligibilityMessage").css("margin-top", "0px");
            $("#checkEligibilityMessage").html(
                `Your credit limit Rs. ${content.data.data.available_credit_in_paise / 100
                }`



            );


            // $("#status2").click(function () {
            //     $("#status3").css("display", "none");


            //     bookCabPayment()
            //     window.location = 'cab_confirm.html';
            // })

            $('#cross').click(function () {

                $(".confirmation_boxCab2").css("display", "none");
            })



        }
    }


    check_eligibility_fc(userMobile)
    async function bookCabPayment() {
        var BookingData = JSON.parse(localStorage["departurebookingData"])
        BookigInnerLoad = BookingData.clubMember[0];
        var Amount = BookigInnerLoad.fare_price;
        const responseData = await addPaymentType('SIMPL', '', '', "full_pay", Amount);
        if (responseData.status == 101) {
            $("#reserve4").html("Something went wrong, Please choose another method");
            $(".confirmation_boxCabDiv4").css("display", "block");
            $(".confirmation_boxCab4").css("display", "block");
        }

        if (responseData.status == 200) {
            $("#methodPayment").val('SIMPL')
            $(".confirmation_boxCabDiv3").css("display", "block");
            $(".confirmation_boxCab3").css("display", "block");
            // window.location='cab_confirm.html'

        }
    }

})
//console.log(JSON.parse(localStorage["departurebookingData"]));
var BookingData = JSON.parse(localStorage["departurebookingData"])
console.log(BookingData);
BookigInnerLoad = BookingData.clubMember[0];


var amount = BookigInnerLoad.content_id;

$("#flush-headingOne").click(function () {
    $("#flush-headingOne").css("display", "none");
    $("#flush-disable").css("display", "block");
    addPaymentType('PAYTM', '', '', 'full_pay', amount);
});

$("#flush-headingTwo").click(function () {
    $("#flush-headingTwo").css("display", "none");
    $("#flush-disable").css("display", "block");
    addPaymentType('RAZORPAY', '', '', 'full_pay', amount);
});

$("#ParsePay_Now").click(function () {
    $("#ParsePay_Now").css("display", "none");
    $("#flush-disable").css("display", "block");
    addPaymentType('PAYTM', '', '', 'partial_pay', (Number(BookigInnerLoad.service_charge) + Number(50)));
});

$("#ParsePay_Now2").click(function () {
    $("#ParsePay_Now2").css("display", "none");
    $("#flush-disable").css("display", "block");
    addPaymentType('RAZORPAY', '', '', 'partial_pay', (Number(BookigInnerLoad.service_charge) + Number(50)));
});


$("#status22").click(function () {
    $("#status22").css("display", "none");
    $("#flush-disablecash").css("display", "block");
    amount = localStorage["cashAmountFlow"]
    addPaymentType('PAYBYCASH', '', '', '', amount);
    // lastDetails('PAYBYCASH')

});


$("#button2").click(function () {
    $(".mobileauto").css("display", "block");
})

$('#crossicon').click(function () {
    $(".confirmation_boxCabsimpl").css("display", "none");
    $(".confirmation_boxCabDiv").css("display", "none");
})

$('#partpaymt').click(function () {
    $("#closepayment").css("display", "block");
    $("#flush-headingFour").css("display", "none");
    $("#flush-headingOne").css("display", "none");
    $("#flush-headingTwo").css("display", "block ");
    $("#razar_paybtn").css("display", "block ");
    $("#status22").css("display", "none");
    $("#PayNow2").css("display", "block");
    $("#PayNow").css("display", "none");
    $("#PayNow1").css("display", "none");
    $("#PayNow2l").css("display", "block");
    $("#PayNowl").css("display", "none");
    $("#PayNow1l").css("display", "none");
    $("#PartNow").css("display", "none");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");
})
$('#partpaymtl').click(function () {
    $("#ParsePay_Now").css("display", "none");
    $("#ParsePay_Now2").css("display", "block");
    $("#closepayment").css("display", "block");
    $("#flush-headingFour").css("display", "none");
    $("#flush-headingOne").css("display", "none");
    $("#flush-headingTwo").css("display", "block ");
    $("#razar_paybtn").css("display", "block ");
    $("#status22").css("display", "none");
    $("#PayNow2").css("display", "block");
    $("#PayNow").css("display", "none");
    $("#PayNow1").css("display", "none");
    $("#PayNow2l").css("display", "block");
    $("#PayNowl").css("display", "none");
    $("#PayNow1l").css("display", "none");
    $("#PartNow").css("display", "none");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");
})


$('#fullpaymt').click(function () {
    $("#flush-headingFour").css("display", "none");
    $("#closepayment").css("display", "block");
    $("#status22").css("display", "none");
    $("#flush-headingTwo").css("display", "none");
    $("#flush-headingOne").css("display", "block");
    $("#PayNow").css("display", "block");
    $("#PayNow2").css("display", "none");
    $("#PayNow1").css("display", "none");
    $("#PayNowl").css("display", "block");
    $("#PayNow2l").css("display", "none");
    $("#PayNow1l").css("display", "none");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");
})
$('#fullpaymtl').click(function () {
    $("#ParsePay_Now").css("display", "block");
    $("#ParsePay_Now2").css("display", "none");
    $("#flush-headingFour").css("display", "none");
    $("#closepayment").css("display", "block");
    $("#status22").css("display", "none");
    $("#flush-headingTwo").css("display", "none");
    $("#flush-headingOne").css("display", "block");
    $("#PayNow").css("display", "block");
    $("#PayNow2").css("display", "none");
    $("#PayNow1").css("display", "none");
    $("#PayNowl").css("display", "block");
    $("#PayNow2l").css("display", "none");
    $("#PayNow1l").css("display", "none");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");


    // $("#PayNow2").css("display","none");

})

// $("#status22").click(function () {
//     console.log("abhay");
//     //console.log(dataJ);
//     bookCabPayment()
//     // window.location = 'cab_confirm.html';

// })
$('#fullbutton').click(function () {

    $("#tri1").css("display", "block");
    $("#tri3").css("display", "none");
    $("#tri2").css("display", "none");
    $("#fullbutton").css("color", "#fff");
    $("#fullbutton").css("background-color", "#2389E8");
    $("#fullbutton").css("font-family", "'NetflixSansMedium'");
    $("#fullbutton").css("border", "none");

    $("#partbutton").css("color", "#000");
    $("#partbutton").css("background-color", "#F3F7F8");
    $("#partbutton").css("font-family", "'NetflixSansMedium'");
    $("#partbutton").css("border", "none");

    $("#laterbutton").css("color", "#000");
    $("#laterbutton").css("background-color", "#F3F7F8");
    $("#laterbutton").css("font-family", "'NetflixSansMedium'");
    $("#laterbutton").css("border", "none");

    $("#flush-headingOne").css("display", "block");
    $("#laterrow").css("display", "none");
    $("#divpay").css("height", "120px")
    $("#razorrow").css("display", "block");
    $("#razorrowl").css("display", "block");
    $("#status22").css("display", "none");
    $("#payline2").css("display", "block");
    $("#payline2l").css("display", "block");
    $("#paytmrow").css("display", "block");
    $("#paytmrowl").css("display", "block");
    $("#PayNow").css("display", "block");
    $("#PayNow1").css("display", "block");
    $("#PartNow").css("display", "none");
    $("#PartNow2").css("display", "none");
    $(".showpartpay").css("display", "none");
    $(".opener").css("display", "block");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");

})
$('#partbutton').click(function () {

    $("#tri1").css("display", "none");
    $("#tri3").css("display", "none");
    $("#tri2").css("display", "block");

    $("#partbutton").css("color", "#fff");
    $("#partbutton").css("background-color", "#2389E8");
    $("#partbutton").css("font-family", "'NetflixSansMedium'");
    $("#partbutton").css("border", "none");

    $("#fullbutton").css("color", "#000");
    $("#fullbutton").css("background-color", "#F3F7F8");
    $("#fullbutton").css("font-family", "'NetflixSansMedium'");
    $("#fullbutton").css("border", "none");

    $("#laterbutton").css("color", "#000");
    $("#laterbutton").css("background-color", "#F3F7F8");
    $("#laterbutton").css("font-family", "'NetflixSansMedium'");
    $("#laterbutton").css("border", "none");

    $("#ParsePay_Now").css("display", "block");
    $("#PayNowl").css("display", "block");
    $("#status22").css("display", "none");
    $("#laterrow").css("display", "none");
    $("#divpay").css("height", "120px")
    $("#razorrow").css("display", "block");
    $("#razorrowl").css("display", "block");
    $("#payline2").css("display", "block");
    $("#payline2l").css("display", "block");
    $("#paytmrow").css("display", "block");
    $("#paytmrowl").css("display", "block");
    $("#PartNow").css("display", "none");
    $("#PartNow").css("display", "block");
    $("#PartNow2").css("display", "block");
    $("#PayNow").css("display", "none");

    $(".showpartpay").css("display", "block");
    $(".opener").css("display", "none");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");

})

$('#laterbutton').click(function () {
    showcashDetails()
})

function showcashDetails() {
    $("#tri1").css("display", "none");
    $(".opener").css("display", "none");
    $("#tri3").css("display", "block");
    $("#tri2").css("display", "none");
    $("#laterbutton").css("color", "#fff");
    $("#laterbutton").css("background-color", "#2389E8");
    $("#laterbutton").css("font-family", "'NetflixSansMedium'");
    $("#laterbutton").css("border", "none");

    $("#partbutton").css("color", "#000");
    $("#partbutton").css("background-color", "#F3F7F8");
    $("#partbutton").css("font-family", "'NetflixSansMedium'");
    $("#partbutton").css("border", "none");

    $("#fullbutton").css("color", "#000");
    $("#fullbutton").css("background-color", "#F3F7F8");
    $("#fullbutton").css("font-family", "'NetflixSansMedium'");
    $("#fullbutton").css("border", "none");

    $("#flush-headingTwo").css("display", "none");
    $("#flush-headingOne").css("display", "none");
    $("#ParsePay_Now").css("display", "none");
    $("#ParsePay_Now2").css("display", "none");
    $("#laterrow").css("display", "block");
    $("#status22").css("display", "block");
    $("#divpay").css("height", "92")
    $("#razorrow").css("display", "none");
    $("#razorrowl").css("display", "block");
    $("#paytmrow").css("display", "none");
    $("#paytmrowl").css("display", "none");
    $("#payline2").css("display", "none");
    $("#payline2l").css("display", "block");
    $("#payline3").css("display", "none");
    $("#laterrow").css("margin-top", "25px");
    $(".showpartpay").css("display", "none");
    $("#PayNow1").css("display", "block");
    $("#flush-disable").css("display", "none");
    $("#flush-disablecash").css("display", "none");
}
///////new payment add on cash as gozo /////////////////////////

$("#autofill").click(function () {
    console.log(JSON.parse(localStorage["departurebookingData"])["clubMember"][0]["website_url"]);
    if (JSON.parse(localStorage["departurebookingData"])["clubMember"][0]["website_url"] == "yatra_Departure_url") {
        window.location.href = "index.html"
    }
    else if(JSON.parse(localStorage["departurebookingData"])["clubMember"][0]["website_url"] == "yatra_arrival_url") {
        window.location.href = "arrival.html"
    }

    //window.location.href= "index.html"
})






//console.log(lastDetails(PaymentMethod)); 