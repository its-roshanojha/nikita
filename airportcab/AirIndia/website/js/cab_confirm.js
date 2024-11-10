window.onload = async function () {

    $(".spinner").css("display", "block")
    $(".spinnerBack").css("display", "block")

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
        var BookingData = JSON.parse(localStorage["departurebookingData"])
        BookigInnerLoad = BookingData.clubMember[0];
        console.log(BookigInnerLoad);

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

        if (BookigInnerLoad.card_type == "mojoFixFare") {
            var fare = BookigInnerLoad.content_id
        }
        else {
            var fare = BookigInnerLoad.fare_price
        }
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
        // $("#cabPartner").html(BookigInnerLoad.partnerName);
        $("#eprk").html(BookigInnerLoad.total_kilometers + "Km");
        $("#pickUpLock").html(BookigInnerLoad.source_name)
        $("#dropLoc").html(BookigInnerLoad.destination_name);
        $("#MobileNo").html(BookigInnerLoad.mobile);
        $("#picTym").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#picTime").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }
    }
    $("#cmmsg1").html("Your booking request is submitted successfully.");
    $("#cmmsg2").append(`You will receive confirmation details shortly through SMS & Whatsapp.<br>For any assistance, call 08047094944.`);

    if (BookigInnerLoad.isDeparture == 1 && BookigInnerLoad.cab_category != "Outstation") {
        // $("#cmmsg3").append(`Don't forget to take your cashback ,after successful payment through payment link. <br><br>Now Skip the queue and pre- book your arrival cab. `);
        // $("#arrVAL").html("Book Now")
        // $(".confirmation_boxCabDiv2").css("display", "none");
        // $(".confirmation_boxCab2").css("display", "none");
        fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/getCouponCode").then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data)
            for(let k in data.data)
            {
                if(data.data[k].confirm_page == 1)
                {
                    document.getElementById("couponapi").innerText = data.data[k].coupon_code;
                    document.getElementById("coupounamt").innerText = data.data[k].amount;
                    $("#confirmation_boxCab5").css("display", "block")
                    $("#confirmation_boxCabDiv5").css("display", "block")
                }
            }
        })

    }
    else {
        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        // $("#cmmsg3").append(`Don't forget to take your cashback ,after successful payment through payment link.`);
        $("#arrVAL").html("Okay")

    }
    // $(".confirmation_boxCabDiv2").css("display", "block");
    // $(".confirmation_boxCab2").css("display", "block");
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
        $("#cmmsg2").html("You will receive confirmation details shortly through SMS & Whatsapp.For any assistance call 08046800969");
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
    const Refercode = await fetch("https://prodapi.mojoboxx.com/spicescreen/webapi/get_DetailsOfReferalCode", {
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
        url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/getCityList',
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
