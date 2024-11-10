// UI update in new tab as per user agent type
var iOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var ua = navigator.userAgent.toLowerCase();
var userAgent = navigator.userAgent || navigator.vendor || window.opera;
var macLap = userAgent.match(/Macintosh/i);

var isAndroid = ua.indexOf("android") > -1;
if (isAndroid || iOS) {
  $(".Framer").css("display", "block");
} else {
}

var BookigInnerLoad;
// var SelectedBookingType = 'FULL_PAYTM'
// var SelectedBookingType = 'FULL_RAZORPAY'
var SelectedBookingType = "";

var data = JSON.parse(sessionStorage.getItem("BookingPrefillData"));
// console.log(data);
const cityCodeData = data?.citycode;
const allowedAirports = ["BENG", "CHEN", "DELH", "HYED", "MUM", "PUN"];
const isAirportValid = allowedAirports.includes(cityCodeData);
var RideType = "";
var RentalHour = isAirportValid == true ? 8 : 10;
var UserMobileNumber = "";
var simplRedirectionURL = "";
var simpleligiblityType = "";
var SimplButon = "";
var cityNameFetch;
var defaultCashback = 0;
var discountpercentage = 0;
var cityRideFareModify = false;
var paymentDEfault = "full";
// $(".spinner").css("display", "block");
// $(".spinnerBack").css("display", "block");

var userIp = 0;
let getuserIp = (async) => {
  return new Promise((resolve, reject) => {
    $.getJSON("https://api.ipify.org?format=json", function (data) {
      userIp = data.ip;
      resolve(userIp);
    });
  });
};
$(".closebtn").click(function () {
  $(".modal").modal("hide");
});

var ordernum = "" + Math.floor(10000000000 + Math.random() * 9000000000);

const locateVal = window.location.search;
const urlParams = new URLSearchParams(locateVal);

/////////// check simpl details on pending due callback code start////////////
async function simplgetentry(ordernum) {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        type: "GET",
        // url: `https://preprodapi.mojoboxx.com/preprod/webapi/getBookingData?bookingId=${ordernum}`,
        url: `https://prodapi.mojoboxx.com/spicescreen/webapi/getBookingData?bookingId=${ordernum}`,

        contentType: "application/json",
        dataType: "json",
        success: async function (data) {
          if (data.message == "Booking Not Found in DB") {
            window.location.href = "index.html";
          } else {
            let {
              user_name,
              mobile,
              email,
              total_kilometers,
              pickup_time,
              isDeparture,
              source_name,
              source_city,
              source_latitude,
              source_longitude,
              destination_name,
              destination_city,
              destination_latitude,
              destination_longitude,
              from_city,
              terminalCode,
              user_agent,
            } = data;

            let loadContent = {
              username: user_name,
              usermobile: mobile,
              usermail: email,
              kilometers: total_kilometers,
              pickuptime: pickup_time,
              tripType: "Ride",
              RideType: isDeparture == 1 ? "departure" : "arrival",
              MapPlaceId: "",
              sourcename: source_name,
              sourcecity: source_city,
              sourcelatitude: source_latitude,
              sourcelongitude: source_longitude,
              destinationname: destination_name,
              destinationcity: destination_city,
              destinationlatitude: destination_latitude,
              destinationlongitude: destination_longitude,
              citycode: from_city,
              terminalcode: terminalCode,
              IPaddress: user_agent != "" ? user_agent : await getuserIp(),
            };
            userIp =
              data.user_agent != "" ? data.user_agent : await getuserIp();
            cityNameFetch = data.destination_city;
            // console.log(loadContent)
            sessionStorage.setItem("simplOnloadData", JSON.stringify(data));
            sessionStorage.setItem(
              "BookingPrefillData",
              JSON.stringify(loadContent)
            );
            // simplflowLoad()
            localStorage.setItem("partnercabType", data.cab_type);
            CabBookingType = data.cab_type;
            resolve(loadContent);
          }
        },
        error: function (e) {
          console.log(e);
          return reject(e);
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
}
/////////// check simpl details on pending due callback code end ////////////

///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////
const loadBookingDetails = async (Bookingdetails) => {
  // $(".spinner").css("display", "block");
  // $(".spinnerBack").css("display", "block");
  // Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "C2AConfirmation_Page");
  await loadBookingData(Bookingdetails);
  async function loadBookingData(Bookingdetails) {
    $("#currentmobile").text(Bookingdetails.usermobile)
    // $("#cab_type").text(BookigInnerLoad.cab_type)
    $("#currenttime").html(Bookingdetails.pickuptime.split(" ")[1] + " Hrs");
    $("#currentdate").html(
      moment(Bookingdetails.pickuptime.split(" ")[0], [
        "YYYY-MM-DD",
        "DD-MM-YYYY",
      ]).format("DD-MM-YYYY")
    );
    // $("#mobileauto").val(BookigInnerLoad.mobile)
    
    $("#currentpick").html(Bookingdetails.sourcename);
    $("#currentdrop").html(Bookingdetails.destinationname);

    if (Bookingdetails.tripType == "Rental") {
      $("#currentdrop").css("display", "none");
      $(".imagesline").css("display", "none");
      $(".Rentalcard-deck").css("display", "block");
      $("#partbutton").css("display", "none");
      // $(".paymentoptionnew").css("justify-content", "flex-start")
    }
  }
};
///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////

///////////////////// Load Fare of booking details CODE START ////////////////
const clickFunction = async () => {
  // var amount = BookigInnerLoad.content_id;

  $("#status22").click(function () {
    $("#status22").css("display", "none");
    amount = localStorage["cashAmountFlow"];
    addPaymentType("PAYBYCASH", "", "", "", amount);
  });

  $("#button2").click(function () {
    $(".mobileauto").css("display", "block");
  });

  $("#crossicon").click(function () {
    $(".confirmation_boxCabsimpl").css("display", "none");
    $(".confirmation_boxCabDiv").css("display", "none");
  });

  // $('#fullpaymt').click(function () {
  //     $("#closepayment").css("display", "block");
  //     $("#status22").css("display", "none");
  //     $("#PayNow").css("display", "block");
  //     $("#PayNow2").css("display", "none");
  //     $("#PayNow1").css("display", "none");
  //     $("#PayNowl").css("display", "block");
  //     $("#PayNow2l").css("display", "none");
  //     $("#PayNow1l").css("display", "none");
  // })
  // $('#fullpaymtl').click(function () {
  //     $("#closepayment").css("display", "block");
  //     $("#status22").css("display", "none");
  //     $("#PayNow").css("display", "block");
  //     $("#PayNow2").css("display", "none");
  //     $("#PayNow1").css("display", "none");
  //     $("#PayNowl").css("display", "block");
  //     $("#PayNow2l").css("display", "none");
  //     $("#PayNow1l").css("display", "none");
  // })

  // $('#fullpaymt').click(function () {
  //     // SelectedBookingType = 'FULL_PAYTM'
  //     SelectedBookingType = 'FULL_RAZORPAY'
  //     $("#flush-disable").val('Pay Now')
  // })
  // $('#fullpaymtl').click(function () {
  //     // SelectedBookingType = 'PART_PAYTM'
  //     SelectedBookingType = 'PART_RAZORPAY'
  // })
  $("#simplpaymt").click(function () {
    SelectedBookingType = "SIMPL";
    $("#SimplNow2").css("visibility", "visible");

    // $(".spinner").css("display", "block")
    // $(".spinnerBack").css("display", "block")
    // check_eligibility_fc(UserMobileNumber, localStorage["TotalFare"])
  });

  // $('#razorpay-payment').click(function () {
  //     $("#closepayment").css("display", "block");
  //     $("#status22").css("display", "none");
  //     $("#PayNow").css("display", "block");
  //     $("#PayNowA").css("display", "block");
  //     SelectedBookingType = 'RAZORPAY'
  //     $("#PayNow2").css("display", "none");
  //     $("#PayNow1").css("display", "none");
  //     $("#PayNowl").css("display", "block");
  //     $("#PayNow2l").css("display", "none");
  //     $("#PayNow1l").css("display", "none");
  // })

  $("#fullbutton").click(async function () {
    $(".paymentButton").removeClass("ActiveBtn");
    $(this).addClass("ActiveBtn");
    paymentDEfault = "full";
    $("#laterrow").css("display", "none");
    // SelectedBookingType = 'RAZORPAY'
    // SelectedBookingType = 'FULL_PAYTM'

    $("#flush-disable").val("Pay Now");
    $("#flush-disable").text("Pay Now");

    $("#status22").css("display", "none");
    $("#payline2").css("display", "block");
    $("#payline2l").css("display", "block");
    $("#paytmrow").css("display", "block");
    // $("#PayNow").css("display", "block");
    // $("#PayNow1").css("display", "block");
    $("#PartNow").css("display", "none");
    $("#PartNow2").css("display", "none");
    $(".opener").css("display", "block");
    await loadPaymentMethod("full", sessionStorage["fullPayType"]);

    if (simpleligiblityType == "eligible") {
      $("#simplrow").css("display", "flex");
      $("#payline2").css("display", "block");
      $("#divpay").css("height", "270px");
    }
  });
  $("#partbutton").click(async function () {
    $(".opener").css("display", "block");

    $(".paymentButton").removeClass("ActiveBtn");
    $(this).addClass("ActiveBtn");
    // SelectedBookingType = 'PART_PAYTM'
    // SelectedBookingType = 'PART_RAZORPAY'
    paymentDEfault = "partial";
    // $("#PayNowl").css("display", "block");
    $("#status22").css("display", "none");
    $("#laterrow").css("display", "none");
    $("#flush-disable").val("Pay Now");
    $("#flush-disable").text("Pay Now");

    $("#payline2").css("display", "block");
    $("#payline2l").css("display", "block");
    $("#paytmrow").css("display", "block");
    $("#PartNow").css("display", "none");
    $("#PartNow").css("display", "block");
    $("#PartNow2").css("display", "block");
    // $("#PayNow").css("display", "none");
    await loadPaymentMethod("partial", sessionStorage["partialPayType"]);
  });

  $("#laterbutton").click(function () {
    $(".opener").css("display", "none");

    $(".paymentButton").removeClass("ActiveBtn");
    $(this).addClass("ActiveBtn");
    SelectedBookingType = "PAYBYCASH";

    $("#flush-disable").val("Book Now");
    $("#flush-disable").text("Book Now");

    $("#laterrow").css("display", "block");
    $("#status22").css("display", "block");
    $("#paytmrow").css("display", "none");

    $("#payline2").css("display", "none");
    $("#payline2l").css("display", "block");
    $("#payline3").css("display", "none");
    $(".paymentbtn").css("margin-top", "0rem");
    // $("#PayNow1").css("display", "block");
  });
  ///////new payment add on cash as gozo /////////////////////////
};
///////////////////// Load Fare of booking details CODE END //////////////////

// let Userdetails = JSON.parse(localStorage.getItem("BookingPrefillData"));

// window.onload = async () => {
//     await loadBookingDetails(Userdetails);
//     await clickFunction(Userdetails);
//     await loadMainjs(Userdetails)
// }

async function loadDetails() {
  let Userdetails = JSON.parse(localStorage.getItem("BookingPrefillData"));
  await loadBookingDetails(Userdetails);
  await clickFunction(Userdetails);
  //     await loadMainjs(Userdetails).then(async () => await check_eligibility_onload(UserMobileNumber, localStorage["TotalFare"])).then(async () => {
  //         ////// Code in case of simpl pending dues payment callback .....................
  //         if (String(urlParams).includes("available_credit_in_paise")) {
  //             const successValue = urlParams.get('bookingData') ? JSON.parse(decodeURIComponent(urlParams.get('bookingData'))).success : null;
  //             if (successValue == "true") {
  //                 await simplflowLoad()
  //             }
  //         }
  //     })
  await loadMainjs(Userdetails);
}

window.onload = async () => {

  let travelType = localStorage.getItem("TravelType");
  if (travelType == "International") {
    $(".card_container").hide();
  } else {
    $(".card_container").show();
  }

  if (String(urlParams).includes("bookingid")) {
    let BookID = String(urlParams).split("bookingid")[1];
    if (String(BookID).includes("-")) {
      var BookingId = String(BookID).split("-")[1].split("%")[0];
    }
    if (String(BookID).includes("success")) {
      if (
        JSON.parse(decodeURIComponent(urlParams.get("bookingData"))).success ==
        "true"
      ) {
        $(".pararide").css("display", "none");
        await simplgetentry(BookingId).then(async () => {
          ////// Book cab after succesfull simpl payment///////
          let Userdetails = JSON.parse(
            sessionStorage.getItem("BookingPrefillData")
          );
          await loadBookingDetails(Userdetails);
          await clickFunction(Userdetails);
          // await loadMainjs(Userdetails).then(async () => {
          // await check_eligibility_onload(UserMobileNumber, localStorage["TotalFare"])
          // }).then(async () => {
          SelectedBookingType = "SIMPL";
          let token = JSON.parse(
            decodeURIComponent(urlParams.get("bookingData"))
          ).token;
          await storeSimplToken(token, Userdetails.usermobile).then(
            async () => {
              // $('#flush-disable').click();
              // await BookMycab('SIMPL', "full")

              await BookSimplCab();
            }
          );
          // })
        });
      }
      if (
        JSON.parse(decodeURIComponent(urlParams.get("bookingData"))).success ==
        "false"
      ) {
        await simplgetentry(BookingId).then(async () => {
          $("#toast").modal("show");
          $("#toastBody").empty();
          $("#toastBody").html(
            `The last transaction was unsuccessful.<br> Please retry payment`
          );
          $(".pararide").css("display", "none");

          await loadDetails();
        });
        console.log("false");
      }
    }
  } else {
    loadDetails();
  }
};
// Book simpl cab after otp verifying

async function BookSimplCab() {
  let Userdetails = JSON.parse(sessionStorage.getItem("simplOnloadData"));

  dataJ = {
    clubMember: [
      {
        type: "cabForm",
        name_title: "",
        user_name: Userdetails.user_name,
        last_name: Userdetails.last_name,
        mobile: Userdetails.mobile,
        email: Userdetails.email,
        time: Userdetails.time,
        sendLeadSms: Userdetails.sendLeadSms,
        partnerName: Userdetails.partnerName,
        title: Userdetails.title,
        category: "CAB",
        drop_location: Userdetails.drop_location,
        pickup_time: Userdetails.pickup_time,
        cab_type: Userdetails.cab_type,
        cab_id: Userdetails.cab_id,
        fare_price: Userdetails.fare_price,
        total_kilometers: Userdetails.total_kilometers,
        terminalCode: Userdetails.terminalCode,
        msgUniqueId: Userdetails.msgUniqueId,
        from_city: Userdetails.from_city,
        to_city: Userdetails.to_city,
        source: Userdetails.source,
        destination: Userdetails.destination,
        latitude: Userdetails.latitude,
        longitude: Userdetails.longitude,
        isDeparture: Userdetails.isDeparture,
        pnr: "",
        source_city: Userdetails.source_city,
        source_latitude: Userdetails.source_latitude,
        source_longitude: Userdetails.source_longitude,
        source_name: Userdetails.source_name,
        destination_city: Userdetails.destination_city,
        destination_latitude: Userdetails.destination_latitude,
        destination_longitude: Userdetails.destination_longitude,
        destination_name: Userdetails.destination_name,
        status: "CAB",
        card_type: Userdetails.card_type,
        content_id: Userdetails.content_id,
        refer_Code: Userdetails.refer_Code,
        fixedFareId: Userdetails.fixedFareId,
        mojoPartner: Userdetails.mojoPartner,
        carID: Userdetails.carID,
        token: Userdetails.token,
        website_url: Userdetails.website_url,
        user_agent: Userdetails.user_agent,
        pay_type: "post",
        paymentMethod: "PAYBYCASH",
        service_charge: Userdetails.service_charge,
        state: Userdetails.state,
        order_reference_number: Userdetails.order_reference_number,
        advance_amount: Userdetails.advance_amount,
        discount_type: Userdetails.discount_type,
        discount_amount: Userdetails.discount_amount,
      },
    ],
  };

  localStorage.setItem("departurebookingData", JSON.stringify(dataJ));
  localStorage.setItem("updatedeparturebookingData", JSON.stringify(dataJ));
  localStorage.setItem("cabbookingData", JSON.stringify(dataJ));
  await addPaymentType(
    "SIMPL",
    "",
    "",
    "full_pay",
    dataJ.clubMember[0].content_id
  );
}

// save token in db
async function storeSimplToken(token, mobile) {
  const rawResponse = await fetch(
    "https://prodapi.mojoboxx.com/spicescreen/webapi/updateSimplToken",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, phone_number: mobile }),
    }
  );
  // console.log(rawResponse.body)
  const result = await rawResponse.json();
}

async function loadMainjs(Userdetails) {
  var ArrAirportName;
  var AirportCode;
  var SourceName;
  var SourceCity;
  var destination_latitude;
  var destination_longitude;
  var cityCODE;
  var Destination_city;
  var pickup_lat;
  var pickup_long;
  var TerminalCode;
  var KMNum;
  var stateforinvoice = "";
  var PaymentMethod = "payment";

  var TripType;
  var MultiplierAmount;
  var BookingTrip_Type = "City Ride";
  var couponCodeValue = 0;
  var couponcodeType = "";
  var content_id = 0;
  var fare_price = 0;
  var couponcodePayType = "";
  var CabBookingType = "sedan";
  var paymentoptionDisplay = "none";

  var pickupDate = "";
  var pickupTime = "";
  var source_Name = "";
  var MainCabPartnerName = "";
  var Destination_Name = "";
  var UserName = "";
  var userEmail = "";
  var MapPlaceId = "";

  ////////// Common details to fetch from last page JSON /////////
  pickup_lat = Userdetails.sourcelatitude;
  pickup_long = Userdetails.sourcelongitude;
  AirportCode = Userdetails.citycode;
  pickupDate = Userdetails.pickuptime.split(" ")[0];
  pickupTime = Userdetails.pickuptime.split(" ")[1];
  SourceCity = Userdetails.sourcecity;
  source_Name = Userdetails.sourcename;
  // UserMobileNumber = Userdetails.usermobile;
  UserName = Userdetails.username;
  userEmail = Userdetails.usermail;
  MapPlaceId = Userdetails.MapPlaceId;
  KMNum = sessionStorage["intlDistance"];

  if (Userdetails.tripType == "Rental") {
    destination_latitude = Userdetails.sourcelatitude;
    destination_longitude = Userdetails.sourcelongitude;
    Destination_city = Userdetails.sourcecity;
    Destination_Name = Userdetails.sourcename;
    TerminalCode = Userdetails.terminalcode;
    RideType = "departure";
    BookingTrip_Type = Userdetails.tripType;
  } else if (Userdetails.tripType == "Outstation") {
    RideType = "departure";
    BookingTrip_Type = Userdetails.tripType;
    destination_latitude = Userdetails.destinationlatitude;
    destination_longitude = Userdetails.destinationlongitude;
    Destination_city = Userdetails.destinationcity;
    Destination_Name = Userdetails.destinationname;
    TerminalCode = Userdetails.terminalcode;
    RideType = Userdetails.RideType;
  } else {
    cityRideFareModify = true;
    destination_latitude = Userdetails.destinationlatitude;
    destination_longitude = Userdetails.destinationlongitude;
    Destination_city = Userdetails.destinationcity;
    Destination_Name = Userdetails.destinationname;
    TerminalCode = Userdetails.terminalcode;
    RideType = Userdetails.RideType;
  }

  if (RideType == "arrival") {
    $(".miniCard").css("display", "none");
  }

  await paymentoptionLoad();

  $(".RentalHour").click(function () {
    console.log(MainCabPartnerName);
    $(".RentalHour").removeClass("ActiveHour");
    $(this).addClass("ActiveHour");
    let typ = parseInt($(this).text().match(/\d+/)[0]);
    if (MainCabPartnerName !== "GOZO CABS") {
      typ == 8
        ? (RentalHour = 8)
        : typ == 4
        ? (RentalHour = 4)
        : (RentalHour = 12);
    } else {
      typ == 8
        ? (RentalHour = 10)
        : typ == 4
        ? (RentalHour = 10)
        : (RentalHour = 11);
    }
    lastDetails(PaymentMethod);
    if (CabBookingType == "hatchback") {
      $("#sedanFare")
        .empty()
        .html("Click for Fare")
        .removeClass("active-title");
      $("#suvFare").empty().html("Click for Fare").removeClass("active-title");
    } else if (CabBookingType == "suv") {
      $("#sedanFare")
        .empty()
        .html("Click for Fare")
        .removeClass("active-title");
      $("#miniFare").empty().html("Click for Fare").removeClass("active-title");
    } else {
      $("#suvFare").empty().html("Click for Fare").removeClass("active-title");
      $("#miniFare").empty().html("Click for Fare").removeClass("active-title");
    }
  });

  // if (Userdetails.tripType !== "Rental") {
  //   document.getElementById("DistanceKm").innerHTML = KMNum + " Kms";
  // } else {
  //   document.getElementById("DistanceKm").innerHTML = "-" + " Kms";
  // }

  async function loadMojoMultiplier(CityCode, Cabtype, kilometer) {
    var timeUpdate = moment().hour();
    if (timeUpdate >= "0" && timeUpdate <= "9") {
      timeUpdate = "0" + timeUpdate;
    }
    const multiplier = await fetch(
      BaseAPIURL +
        domain +
        "/webapi/mojoboxxMultiplier/?city=" +
        CityCode +
        "&time=" +
        timeUpdate +
        "&travel_type=" +
        RideType +
        "&platform=Yatra"
    );
    // const multiplier = await fetch('https://preprodapi.mojoboxx.com/preprod/webapi/mojoboxxMultiplier/?city=' + CityCode + '&time=' + timeUpdate + "&travel_type=departure&platform=Yatra")
    const multiResponse = await multiplier.json();
    localStorage.setItem("multiResponseData", JSON.stringify(multiResponse));
    // console.log(multiResponseData)
  }

  async function multiplierFun(partner_Name, Cabtype, kilometer) {
    var multiResponseData = JSON.parse(localStorage["multiResponseData"]);
    localStorage.setItem("multiplier" + partner_Name, 0);

    MultiplierAmount = 0;
    if (multiResponseData.data.length > 0) {
      multiResponseData.data.every((element) => {
        if (
          element.partner.toLowerCase() == partner_Name.toLowerCase() &&
          element.cab_type.toLowerCase() == Cabtype.toLowerCase()
        ) {
          // console.log(kilometer)
          MultiplierAmount = Number(
            Number(kilometer) * Number(element.amount_perKM)
          );
          // console.log(MultiplierAmount);
          localStorage.setItem("multiplier" + partner_Name, MultiplierAmount);
          return false;
        } else {
          MultiplierAmount = 0;
          localStorage.setItem("multiplier" + partner_Name, MultiplierAmount);
          return true;
        }
      });
    }
  }

  function interLastDetails() {
    let discount_amount = Math.round(defaultCashback).toFixed(0);
    let amount = String(document.getElementById("interPrice").innerHTML);
    amtValue = amount.includes("$")
      ? amount.split("$")[1].trim()
      : amount.trim();
    amtValue = parseInt(amtValue);

    let newAmtValue = amtValue - discount_amount;
    document.getElementById("interPrice").innerHTML = `$ ${newAmtValue}`;
    localStorage.setItem("TotalFare", newAmtValue);
  }

  async function lastDetails(paymentMethod) {
    var cab_response = [];
    console.log(AirportCode, BookingTrip_Type);
    const departure = await fetch(
      BaseURL +
        domain +
        "/webapi/getCabPartnerData?city=" +
        AirportCode +
        "&category=" +
        BookingTrip_Type
    );
    const cab_res = await departure.json();
    console.log(cab_res);
    for (let i in cab_res) {
      if (cab_res[i].platform.toLowerCase() != "host") {
        console.log(cab_res[i]);
        if (cab_res[i].website_name.toLowerCase().includes("bac")) {
          if (
            BookingTrip_Type == "Rental" ||
            BookingTrip_Type == "Outstation"
          ) {
            if (cab_res[i].cab_category.includes(BookingTrip_Type)) {
              cab_response.push(cab_res[i]);
            }
          } else {
            if (RideType == "departure") {
              if (
                cab_res[i].cab_category.includes(BookingTrip_Type) &&
                cab_res[i].is_departure == "1"
              ) {
                cab_response.push(cab_res[i]);
              }
            } else {
              if (
                cab_res[i].cab_category.includes(BookingTrip_Type) &&
                cab_res[i].isArrival == "1"
              ) {
                cab_response.push(cab_res[i]);
              }
            }
          }
        }
      }
    }
    localStorage.setItem("partnercabType", CabBookingType);
    await partnerSlider(
      cab_response,
      CabBookingType,
      Userdetails.citycode,
      paymentMethod
    );

    getstate(pickup_lat, pickup_long);
    function getstate(lat, long) {
      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          lat +
          "," +
          long +
          "&key=" +
          localStorage["mapKey"]
      )
        .then((response) => response.json())
        .then((responseJson) => {
          var state =
            responseJson.results[responseJson.results.length - 2]
              .formatted_address;
          if (String(state).includes(",")) {
            state = String(state).split(",")[0];
          }
          stateforinvoice = state;
        });
    }
  }

  $(".card").click(async function () {
    $(".card").removeClass("active-card");
    $(this).addClass("active-card");

    $(".spinner").css("display", "block");
    $(".spinnerBack").css("display", "block");

    if ($(this).text().includes("Mini")) {
      localStorage.setItem("partnercabType", "hatchback");
      CabBookingType = "hatchback";
      $("#people_count").html("1-3 pax");
      $("#begs_count").html("2 bags");
      lastDetails(PaymentMethod);
    } else if ($(this).text().includes("SUV")) {
      localStorage.setItem("partnercabType", "suv");
      CabBookingType = "suv";
      $("#people_count").html("1-6 pax");
      $("#begs_count").html("4 bags");
      lastDetails(PaymentMethod);
    } else {
      localStorage.setItem("partnercabType", "sedan");
      CabBookingType = "sedan";
      $("#people_count").html("1-4 pax");
      $("#begs_count").html("3 bags");
      lastDetails(PaymentMethod);
    }
  });

  ////////////////////////////// Load CashbackAmt code start //////////////////////////
  var CashbackAmt = "";
  const loadCashbackAmt = async (partnerName, citycode) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${BaseURL}${domain}/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=${RideType}&mojoPartner=Yatra`
      )
        // fetch(`https://preprod.mojoboxx.com/preprod/webapi/cityPartnerCashback?partner=${partnerName}&city=${citycode}&travel_type=${RideType}&mojoPartner=Yatra`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success == true && result.data.length > 0) {
            for (let element of result.data) {
              if (
                element.partner_name.toLowerCase() ==
                  partnerName.toLowerCase() &&
                element.type.toLowerCase() == "cashback"
              ) {
                CashbackAmt = element.amount;
                couponcodeType = "cashback";
              }
              if (
                element.partner_name.toLowerCase() ==
                  partnerName.toLowerCase() &&
                element.type.toLowerCase() == "discount"
              ) {
                defaultCashback = element.amount;
                couponcodeType = "discount";
              }
            }
            resolve(true);
            return true;
          } else {
            CashbackAmt = 0;
            defaultCashback = 0;
            resolve(true);
          }
        });
    });
  };
  ////////////////////////////// Load CashbackAmt code end  //////////////////////////

  // ////////////////// Create Partner Card UI code start /////////////////////////////
  async function partnerSlider(cab_response, cabTypeName, cityType, pmthd) {
    var scv = [];
    var cabFare = [];
    var MojoFare = [];
    var actualAmount = [];
    var cab_Type = [];
    var loadcashcab;

    loadcashcab = false;
    let cab_BookingType = cabTypeName;
    couponcodePayType == "cashback"
      ? (couponcodeType = couponcodePayType)
      : (couponcodeType = couponcodeType);
    MojoFare = [];
    PaymentMethod = "payment";
    localStorage.removeItem("MojoboxxFare");
    scv = [];
    await loadMojoMultiplier(AirportCode, cabTypeName, KMNum);
    let one = 0;
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
        if (cab_city[jk].toLowerCase() == cityType.toLowerCase()) {
          cab_Type = cab_response[i].cab_type.split(",");
          let clc = 0;
          if (cab_Type.length == 1) {
            clc = 1;
          } else {
            clc = cab_Type.length;
          }
          for (let j = 0; j < clc; j++) {
            if (cab_Type[j].toLowerCase() == cabTypeName.toLowerCase()) {
              loadcashcab = true;
              one = 1;
              PaymentMethod = "payment";

              let cabpartnername;
              // if ((BookingTrip_Type == 'Rental')) {
              //     if (AirportCode == 'DEL') {
              //         cabpartnername = 'SIGNATURE';
              //     } else {
              //         cabpartnername = cab_response[i].partner_name;
              //     }
              // }
              if (BookingTrip_Type == "Rental") {
                cabpartnername = cab_response[i].partner_name;
              } else if (BookingTrip_Type == "Outstation") {
                cabpartnername = cab_response[i].partner_name;
              } else {
                if (cab_response[i].card_load == "multiple_card") {
                  cabpartnername = cab_response[i].partner_name;
                } else if (
                  (cabTypeName == "sedan" && pmthd == "payment") ||
                  (cabTypeName == "sedan" &&
                    cab_response[i].card_load == "BOTH")
                ) {
                  const Partnr = await loadPartnerData(cab_city[jk]);
                  cabpartnername = Partnr;
                } else {
                  cabpartnername = cab_response[i].partner_name;
                }
                // if (cityRideFareModify == true) {
                //     cabpartnername = 'SIGNATURE';
                // }
              }

              await multiplierFun(cabpartnername, cabTypeName, KMNum);
              if (defaultCashback == 0) {
                const cashback = await loadCashbackAmt(
                  cabpartnername,
                  cityType
                );
              }
              // if (couponCodeValue == 0 || couponcodeType == 'cashback' || couponcodeType == 'discount') {
              //     couponCodeValue = defaultCashback
              //     couponcodeType = 'discount'
              // }
              if (cab_response[i].farecard_type == "mojofare") {
                let MojofareCalculate = await loadFareFromMojoboxx(
                  cabpartnername,
                  cab_city[jk],
                  KMNum,
                  cab_Type[j].toLowerCase()
                );
                MojoFare.push(localStorage["MojoFare" + cabpartnername]);
                actualAmount.push(localStorage["MojoFare" + cabpartnername]);
                localStorage.setItem("MojoboxxFare", parseInt(MojoFare[0]));
              } else {
                if (cabpartnername) {
                  let fareCalculate = await calculatePricePartnerWise(
                    cabpartnername,
                    KMNum,
                    cab_Type[j],
                    cab_city[jk]
                  );
                  cabFare.push(localStorage["finalFare" + cabpartnername]);
                  localStorage.setItem("partnerFare", parseInt(cabFare[0]));
                }
              }
              // document.getElementById("km" + cabpartnername).innerHTML = KMVal + "s";
              MainCabPartnerName = cabpartnername;

              if (
                cabpartnername == "QUICKRIDE" ||
                cabpartnername == "BLUSMART" ||
                cabpartnername == "MERU" ||
                cabpartnername == "SAVAARI" ||
                cabpartnername == "MEGA" ||
                cabpartnername == "GOZO CABS" ||
                cabpartnername == "TAXIBAZAAR" ||
                cabpartnername == "BUDDY CABS" ||
                cabpartnername == "EEE TAXI" ||
                cabpartnername == "GOAMILES"
              ) {
                $(".bookBtn").css("display", "flex");
                $("#greyedbtn").css("display", "none");
                $("#ConfirmButton").css("display", "none");

                if (cab_response[i].farecard_type != "mojofare") {
                  if (
                    cabFare[0] == "undefined" ||
                    cabFare[0] == undefined ||
                    cabFare[0] == null
                  ) {
                    $("#ConfirmButton").css("display", "none");
                    $(".bookBtn").css("display", "none");
                    $("#paymentoptions").css("display", "none");
                  }
                }
              }
              // if(cabpartnername == "QUICKRIDE")
              // {
              //     $(".paymentoptionnew").css("display", "none")
              //     $(".triangle").css("display", "none");
              //     $(".opener").css("display", "none");
              //     SelectedBookingType = 'PAYBYCASH';
              //     $("#flush-disable").val('Book Now')
              //     $("#laterrow").css("display", "block");
              //     $("#status22").css("display", "block");
              //     $("#divpay").css({"height":"92","margin-top":"2%"})
              //     $("#paytmrow").css("display", "none");
              //     $("#payline2").css("display", "none");
              //     $("#payline2l").css("display", "block");
              //     $("#payline3").css("display", "none");
              //     $("#laterrow").css("margin-top", "25px");
              //     $("#PayNow1").css("display", "block");

              // }
            }
          }
        }
      }
    }
    // if (loadcashcab) {
    //     await paymentoptionLoad(cab_BookingType)
    // }
  }
  ///////////////////// Payment option on changes//////////////////////

  async function calculatePricePartnerWise(
    partnerName,
    KMNum,
    cabTyp,
    cityName,
    PaymentMethod = "payment"
  ) {
    return new Promise(async function (resolve, reject) {
      if (partnerName == "QUICKRIDE") {
        let quickrideResp = await GetFarefromPartner(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "MEGA") {
        let megaResp = await GetFareFromMega(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "MERU") {
        let MeruResp = await GetFarefromMeru(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "BUDDY CABS") {
        let BuddyFare = await GetFarefromPartnerBuddy(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "TAXIBAZAAR") {
        let TaxiBazaarResp = await GetFarefromTaxiBazaar(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "GOZO CABS") {
        let gozofare = await GetFareFromGozoPartner(cabTyp, PaymentMethod);

        resolve(true);
      } else if (partnerName == "COOP") {
        let coopFare = await coop_call(cabTyp, PaymentMethod);
        resolve(true);
      } else if (partnerName == "GOAMILES") {
        let GOAMILESFare = await checkFareGoamiles(cabTyp);
        resolve(true);
      } else if (partnerName == "SAVAARI") {
        let savaariFare = await GetFareFromSavvariPartner(
          cabTyp,
          PaymentMethod
        );
        resolve(true);
      } else if (partnerName == "BLUSMART") {
        let BLUMSMARTfare = await checkFareBlusmart(cabTyp, PaymentMethod);
        resolve(true);
      } else {
        await loadCityName(cityName);
        var fareData = await loadFareFormDB(
          partnerName,
          cityNameFetch,
          KMNum,
          cabTyp.toLowerCase(),
          PaymentMethod
        );
        resolve(fareData);
        console.log("fareData", fareData);
      }
      resolve(true);
    });
  }
  

  // //////////////////// Submit Page form data code start ///////////////////////

  document.getElementById("flush-disable").onclick = async function () {
    // console.log(SelectedBookingType)
    // $("#exampleModal").modal("show");
    BookMycab("RAZORPAY", "full");
  };

  // document.getElementById("nameform").onsubmit = async function (e) {
  // e.preventDefault();
  // if (SelectedBookingType == "FULL_PAYTM") {
  //   BookMycab("PAYTM", "full");
  // } else if (SelectedBookingType == "PART_PAYTM") {
  //   BookMycab("PAYTM", "part");
  // } else if (SelectedBookingType == "FULL_RAZORPAY") {
  //   BookMycab("RAZORPAY", "full");
  // } else if (SelectedBookingType == "PART_RAZORPAY") {
  //   BookMycab("RAZORPAY", "part");
  // } else if (SelectedBookingType == "FULL_SIMPL") {
  //   $(".spinner").css("display", "block");
  //   $(".spinnerBack").css("display", "block");
  //   const eligible = await check_eligibility_fc(
  //     $("#mb_number").val(),
  //     localStorage["TotalFare"]
  //   );
  //   if (eligible == "YES") {
  //     if (SimplButon == "Redirect") {
  //       if (simplRedirectionURL.includes("accountlinked")) {
  //         BookMycab("SIMPL_eligibility", "full");
  //       } else {
  //         window.location.href = simplRedirectionURL;
  //       }
  //     } else {
  //       BookMycab("SIMPL", "full");
  //     }
  //   }
  // } else {
  //   BookMycab("CASH");
  // }
  // };

    const getInternationalFare = async (id) => {
      let userFormData = await JSON.parse(
        localStorage.getItem("interUserDetails")
      );

      let { firstName, lastName, userEmail, countryCode, userMobile } =
        userFormData;
      let mb_number = countryCode + userMobile;
      let languageCode = localStorage["languageCode"];
      let flightNumber = localStorage["flightText"];

      let fareParams = {
        email: userEmail,
        quoteId: id,
        tfirstName: firstName,
        tlastName: lastName,
        temail: userEmail,
        tphone: mb_number,
        driverComments: "",
        tlanguageIsoCode: languageCode,
        residenceCountryCode: languageCode,
        flightNumber: flightNumber,
        travelIntent: "BUSINESS",
      };

      const response = await fetch(
        "https://prodapi.mojoboxx.com/spicescreen/webapi/create_fare",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(fareParams),
        }
      );

      let resData = await response.json();
      sessionStorage.setItem("partnerReference", resData.partnerReference);
      sessionStorage.setItem("intlDistance", resData.journeys[0].approxDurationAndDistance.distance);
      sessionStorage.setItem("intlDistanceUnit", resData.journeys[0].approxDurationAndDistance.distanceUnit);
      return resData;
    };

    const fetchFareData = async (quoteId) => {
      try {
        let data = await getInternationalFare(quoteId);
        let price = data.journeys[0].priceSummary.price;
        let bookingId = data.id;
        localStorage.setItem("TotalFare", price);
        localStorage.setItem("BookingId", bookingId);
      } catch (error) {
        console.error(
          `Error fetching data for quoteId ${quoteId}: ${error.message}`
        );
      }
    };

  async function BookMycab(PAYMENT_TYPE, paytp) {
    $(".spinner").css("display", "block");
    $(".spinnerBack").css("display", "block");
    await fetchFareData(sessionStorage["cardId"]);


    // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
    var pickup_time = pickupDate + " " + pickupTime;

    var price = parseInt(
      String(localStorage["TotalFare"]).includes("-")
        ? String(localStorage["TotalFare"]).split("-")[1]
        : localStorage["TotalFare"]
    );
    // console.log('fare', price);
    // if (String(document.getElementById("PayNow").innerHTML).includes("₹")) {
    //     content_id = (String(document.getElementById("PayNow").innerHTML).split("₹")[1].trim())
    //     fare_price = content_id
    // }
    // else {
    //     content_id = (String(document.getElementById("PayNow").innerHTML).trim())
    //     fare_price = content_id
    // }

    fare_price = localStorage["TotalFare"];
    content_id = localStorage["TotalFare"];

    /////////////////////////////////////////////////////////////////////////////
    // try {
    //   let currencyRatesResponse = await fetch(
    //     `https://open.er-api.com/v6/latest/USD`
    //   );

    //   // Check if the API request was successful (status code 2xx)
    //   if (currencyRatesResponse.ok) {
    //     let currencyRates = await currencyRatesResponse.json();
    //     let one = currencyRates.rates["INR"];
    //     convertedTransAmount = (content_id * Math.round(one)).toFixed(0);
    //     localStorage.setItem("converted_content_id", convertedTransAmount);
    //   } else {
    //     console.error(
    //       `Error fetching currency rates: ${currencyRatesResponse.statusText}`
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error fetching currency rates:", error);
    // }
    //////////////////////////////////////////////////////////////////////////////

    if (MainCabPartnerName == "QUICKRIDE") {
      //// To check quickride fixfareid random issue
      if (
        quickrideFareId
          .toLowerCase()
          .includes(localStorage["partnercabType"].trim().toLowerCase())
      ) {
      } else {
        QuickrideFareResponse.forEach((value) => {
          value.vehicleClass.toLowerCase() ==
          localStorage["partnercabType"].trim().toLowerCase()
            ? (quickrideFareId = value.fixedFareId)
            : (quickrideFareId = quickrideFareId);
        });
      }
    }
    let serviceCharge =
      MainCabPartnerName == "QUICKRIDE" ||
      MainCabPartnerName == "GOZO CABS" ||
      MainCabPartnerName == "BLUSMART" ||
      MainCabPartnerName == "MERU" ||
      MainCabPartnerName == "SAVAARI" ||
      MainCabPartnerName == "MEGA" ||
      MainCabPartnerName == "BUDDY CABS" ||
      MainCabPartnerName == "TAXIBAZAAR" ||
      MainCabPartnerName == "EEE TAXI" ||
      MainCabPartnerName == "GOAMILES"
        ? localStorage["multiplier" + MainCabPartnerName]
        : 0;
    let advanceAmount = "";
    if (
      SelectedBookingType == "PART_PAYTM" ||
      SelectedBookingType == "PART_RAZORPAY"
    ) {
      content_id = sessionStorage["partialAMount"];
      advanceAmount = sessionStorage["partialAMount"];
    } else {
      advanceAmount =
        Number(localStorage["TotalFare"]) -
        Number(serviceCharge) +
        Number(defaultCashback);
    }
    // /////////////////// Load data to create JSON for cab booking code end ////////////////////////

    var amt = Number(defaultCashback) + Number(fare_price);
    var advanceamt = advanceAmount + Number(defaultCashback);
    let userDetails = JSON.parse(localStorage.getItem("interUserDetails"));
    let originAddressesdata = JSON.parse(localStorage.getItem("bookingOrigin"))
    let destinationAddressesdata = JSON.parse(localStorage.getItem("bookingDestinantion"))
    console.log(originAddressesdata, destinationAddressesdata);
    let selectedVehicle = localStorage["selectedVehicle"];
    dataJ = {
      clubMember: [
        {
          type: "cabForm",
          name_title: "",
          // "user_name": UserName,
          user_name: userDetails.firstName,
          last_name: userDetails.lastName,
          // "mobile": UserMobileNumber,
          // "email": userEmail,
          mobile: userDetails.countryCode + userDetails.userMobile,
          email: userDetails.userEmail,
          time: Date.now(),
          sendLeadSms: "true",
          partnerName: "TRANSFERZ",
          title: MainCabPartnerName,
          category: "CAB",
          cab_category: BookingTrip_Type,
          drop_location: Destination_Name,
          pickup_time: pickup_time,
          cab_type: selectedVehicle,
          fare_price: defaultCashback == 0 ? fare_price : amt,
          total_kilometers: sessionStorage["intlDistance"] + " " + sessionStorage["intlDistanceUnit"],
          terminalCode: TerminalCode,
          msgUniqueId: getRandom(10),
          from_city: AirportCode.trim(),
          to_city: AirportCode.trim(),
          source: source_Name.substring(0, 100).trim(),
          destination: Destination_Name,
          latitude: originAddressesdata.latitude,
          longitude: originAddressesdata.longitude,
          isDeparture: RideType == "departure" ? 1 : 2,
          pnr: "",
          source_city:
            AirportCode == "IXC" && MainCabPartnerName == "BUDDY CABS"
              ? "Chandigarh"
              : SourceCity.trim(),
          source_latitude: originAddressesdata.latitude,
          source_longitude: originAddressesdata.longitude,
          source_name: source_Name.substring(0, 100),
          destination_city: Destination_city.trim(),
          destination_latitude: destinationAddressesdata.latitude,
          destination_longitude: destinationAddressesdata.longitude,
          destination_name: Destination_Name,
          status: "CAB",
          card_type:
            localStorage["MojoboxxFare"] == undefined ||
            localStorage["MojoboxxFare"] == "undefined" ||
            localStorage["MojoboxxFare"] == null ||
            localStorage["MojoboxxFare"] == "null"
              ? ""
              : "mojoFixFare",
          content_id: content_id,
          refer_Code:
            localStorage.CouponCode != undefined ? localStorage.CouponCode : "",
          fixedFareId:
            MainCabPartnerName == "QUICKRIDE"
              ? quickrideFareId
              : MainCabPartnerName == "MERU"
              ? localStorage["meruSearchId"]
              : MainCabPartnerName == "MEGA"
              ? localStorage["megaSearchId"]
              : MainCabPartnerName == "GOAMILES"
              ? Goamilesfareid
              : sessionStorage["partnerReference"],
          mojoPartner:
            localStorage["MojoboxxURL_booking"] == "Mojoboxx"
              ? "Mojoboxx"
              : "Yatra",
          carID: MainCabPartnerName == "SAVAARI" ? localStorage.carID : "",
          token: MainCabPartnerName == "SAVAARI" ? localStorage.token : "",
          website_url:
            localStorage["MojoboxxURL_booking"] == "Facebook"
              ? "Facebook"
              : localStorage["MojoboxxURL_booking"] == "MojoboxxI"
              ? "bookairportcab.com/MI"
              : localStorage["MojoboxxURL_booking"] == "MojoboxxR"
              ? "bookairportcab.com/ER"
              : sessionStorage["AirportRideType"] == "arrival"
              ? "Yatra_International_Arrival_url"
              : "Yatra_International_Departure_url",
          user_agent: "",
          pay_type: "post",
          paymentMethod: "PAYBYCASH",
          service_charge: serviceCharge,
          state: stateforinvoice,
          order_reference_number:
            "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
          advance_amount: defaultCashback == 0 ? advanceAmount : advanceamt,
          discount_type: couponcodeType,
          discount_amount:
            couponcodeType === "cashback" ? CashbackAmt : defaultCashback,
            luggage_type: userDetails.luggage,
            car_name: localStorage["flightText"]
        },
      ],
    };

    if (BookingTrip_Type == "Rental") {
      dataJ.clubMember[0]["trip_type"] =
        RentalHour == 12 ? "PKG_12_120" : "PKG_8_80";
      dataJ.clubMember[0]["fare_price"] = advanceAmount;
      dataJ.clubMember[0]["content_id"] = price + defaultCashback;
    }
    if (BookingTrip_Type == "Outstation") {
      dataJ.clubMember[0]["trip_type"] = "OneWay";
      dataJ.clubMember[0]["fare_price"] = advanceAmount;
      dataJ.clubMember[0]["content_id"] = price + defaultCashback;
    }
    console.log(dataJ);
    localStorage.setItem("departurebookingData", JSON.stringify(dataJ));
    localStorage.setItem("updatedeparturebookingData", JSON.stringify(dataJ));
    localStorage.setItem("cabbookingData", JSON.stringify(dataJ));
    if (PAYMENT_TYPE == "SIMPL_eligibility") {
      simplentry(dataJ);
    } else {
      if (dataJ.card_type != "mojoFixFare" && MojopartnerReset == 1) {
        fetch(
          `${BaseAPIURL}${domain}/webapi/partnerBookingCountReset?isReset=1&cityCode=${localStorage["cityCODE"]}&travelType=${RideType}`
        );
      }
      fullDetails(PAYMENT_TYPE, paytp, price, dataJ);
    }
  }

  // //////////////////// Submit Page form data code end ///////////////////////

  async function fullDetails(PAYMENT_TYPE, paytp, price, dataJ) {
    if (PAYMENT_TYPE == "RAZORPAY" && paytp == "full") {
      await addPaymentType(
        "RAZORPAY",
        "",
        "",
        "full_pay",
        dataJ.clubMember[0].content_id
      );
    } else if (PAYMENT_TYPE == "RAZORPAY" && paytp == "part") {
      await addPaymentType(
        "RAZORPAY",
        "",
        "",
        "partial_pay",
        dataJ.clubMember[0].content_id
      );
    } else if (PAYMENT_TYPE == "PAYTM" && paytp == "full") {
      await addPaymentType(
        "PAYTM",
        "",
        "",
        "full_pay",
        dataJ.clubMember[0].content_id
      );
    } else if (PAYMENT_TYPE == "PAYTM" && paytp == "part") {
      await addPaymentType(
        "PAYTM",
        "",
        "",
        "partial_pay",
        dataJ.clubMember[0].content_id
      );
    } else if (PAYMENT_TYPE == "SIMPL" && paytp == "full") {
      await addPaymentType(
        "SIMPL",
        "",
        "",
        "full_pay",
        dataJ.clubMember[0].content_id
      );
    } else {
      $.ajax({
        type: "POST",
        url: BaseAPIURL + domain + "/webapi/cabRegistration",
        contentType: "application/json",
        Accept: "application/json",
        data: JSON.stringify(dataJ),
        dataType: "json",
        success: function (response) {
          // console.log(response);
          if (response.status == 200) {
            location.href = "cab_confirm.html";
            $(".spinner").css("display", "none");
            $(".spinnerBack").css("display", "none");
          } else {
            alert("Booking Failed!");
          }
        },
        error: function (res) {
          alert("Booking Failed!");
        },
      });
    }
  }

  // /////////////// Fetch city name from city code - CODE START ///////////////
  var cityNameFetch;
  async function loadCityName(citycode) {
    var cityData = JSON.parse(localStorage["pickupPoint"]);
    cityNameFetch = cityData[citycode][0]["source_city"];
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
    let actualFareURL = "";
    if (BookingTrip_Type == "Rental") {
      actualFareURL =
        "https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFareMotoGp?partner=" +
        partnerName +
        "&city=" +
        cityName +
        "&km=" +
        "0" +
        "&cab_type=" +
        cabType +
        "&trip_type=" +
        "Rental" +
        "&package=" +
        RentalHour;
    } else {
      actualFareURL =
        "https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFare?partner=" +
        partnerName +
        "&city=" +
        cityName +
        "&km=" +
        distance +
        "&cab_type=" +
        cabType +
        "&trip_type=" +
        RideType;
    }
    return new Promise(async function (resolve, reject) {
      // console.log('https://prodcaroma.mojoboxx.com/api/v1/prod/thirdparty/getActualFare?partner=' + partnerName + '&city='+ cityName +'&km=' +distance +'&cab_type=' + cabType +'&trip_type=Departure')
      fetch(actualFareURL, { method: "GET" })
        .then((response) => response.json())
        .then((json) => {
          // console.log(json)
          desP = json.data;
          console.log(desP);
          if (json.message != "Data not found") {
            if (String(desP).includes("-")) {
              hypen_pos = desP.split("-")[1];
            } else {
              hypen_pos = desP;
            }
            amt = (50 / (Number(hypen_pos) + Number(50))) * 100;
            if (String(amt).includes(".")) {
              dis = String(amt).split(".");
              dis2 = dis[0];
            } else {
              dis2 = (50 / (Number(hypen_pos) + Number(50))) * 100;
            }

            let finalAmount = parseInt(hypen_pos) + parseInt(MultiplierAmount);

            filldetailsInCard(partnerName, parseInt(finalAmount));
            resolve(desP);
          } else {
            console.log("fare not found");
            resolve(true);
          }
        });
    });
  }
  // ////////////////// Fetch Cab partners Fare chart code end  //////////////////

  // ////////////////// Fetch Cab partner from Mojoboxx fixed fare code start //////////////////
  var MojopartnerReset = 0;
  var MojoPartnerName;
  async function loadPartnerData(cityName) {
    try {
      return new Promise(async function (resolve, reject) {
        fetch(
          `${BaseAPIURL}${domain}/webapi/mojofixBookingCount?city=${cityName}&type=${RideType}`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((json) => {
            // console.log(json);
            if (json.data.length >= 1) {
              let CountArr = [];
              for (let k in json.data) {
                if (
                  json.data[k].travel_type == RideType &&
                  json.data[k].city == cityCODE
                ) {
                  CountArr.push(json.data[k]);
                }
              }

              for (let k in CountArr) {
                let JSONLength = CountArr.length;
                if (CountArr[k].Bcount < CountArr[k].Tcount) {
                  MojoPartnerName = CountArr[k].partner;
                  // console.log(MojoPartnerName)
                  resolve(MojoPartnerName);
                  return false;
                } else if (
                  CountArr[JSONLength - 1].Bcount ==
                    CountArr[JSONLength - 1].Tcount ||
                  CountArr[JSONLength - 1].Bcount >
                    CountArr[JSONLength - 1].Tcount
                ) {
                  MojopartnerReset = 1;
                  MojoPartnerName = CountArr[0].partner;
                  // console.log(CountArr[0].partner)
                  resolve(MojoPartnerName);
                  return false;
                }
              }
            } else {
              console.log("fare not found");
              resolve(true);
            }
          });
      });
    } catch (error) {
      return true;
    }
  }
  // ////////////////// Fetch Cab partner from Mojoboxx fixed fare code end  //////////////////

  // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code start //////////////////
  async function loadFareFromMojoboxx(
    partnerName,
    cityName,
    distance,
    cabType
  ) {
    if (String(distance).includes(" ")) {
      distance = String(distance.split(" ")[0]);
    }
    var desP;
    var hypen_pos;
    var dis;
    var dis2;
    var amt;
    return new Promise(async function (resolve, reject) {
      fetch(
        BaseAPIURL +
          domain +
          "/webapi/mojoboxxfixfare?cab_type=" +
          cabType +
          "&km=" +
          distance +
          "&city_code=" +
          cityName +
          "&travel_type=" +
          RideType +
          "&isReset=" +
          MojopartnerReset,
        { method: "GET" }
      )
        .then((response) => response.json())
        .then((json) => {
          // console.log(json)
          desP = json.data[0].Fare;
          localStorage.setItem("mojoboxxfixfarepartner", json.data[0].partner);
          // console.log(json)
          if (json.message != "Data not found") {
            if (String(desP).includes("-")) {
              hypen_pos = desP.split("-")[1];
            } else {
              hypen_pos = desP;
            }
            amt = (50 / (Number(hypen_pos) + Number(50))) * 100;
            if (String(amt).includes(".")) {
              dis = String(amt).split(".");
              dis2 = dis[0];
            } else {
              dis2 = (50 / (Number(hypen_pos) + Number(50))) * 100;
            }
            if (PaymentMethod == "cash") {
              let finalAmount;
              if (couponCodeValue != 0 && couponcodeType == "discount") {
                finalAmount =
                  parseInt(hypen_pos) +
                  parseInt(MultiplierAmount) -
                  Number(couponCodeValue);
                localStorage.setItem("cashMojoFare", finalAmount);
              } else {
                finalAmount = parseInt(hypen_pos) + parseInt(MultiplierAmount);
                localStorage.setItem("cashMojoFare", finalAmount);
              }
              localStorage.setItem("TotalFare", finalAmount);
              resolve(finalAmount);
            } else {
              let finalAmount;
              // if (couponCodeValue != 0 && couponcodeType == 'discount') {
              //     finalAmount = ((parseInt(hypen_pos) + parseInt(MultiplierAmount)) - Number(couponCodeValue))
              //     localStorage.setItem("MojoFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount)) - Number(couponCodeValue)))
              // }
              // else {
              finalAmount = parseInt(hypen_pos) + parseInt(MultiplierAmount);
              localStorage.setItem(
                "MojoFare" + partnerName,
                parseInt(desP) + parseInt(MultiplierAmount)
              );
              // }
              filldetailsInCard(partnerName, parseInt(finalAmount));

              localStorage.setItem("TotalFare", finalAmount);
              // localStorage.setItem("MojoFare" + partnerName, ((parseInt(desP) + parseInt(MultiplierAmount))))
              resolve(desP);
            }
          } else {
            console.log("fare not found");
            resolve(true);
          }
        });
    });
  }
  // ////////////////// Fetch Cab Fare from Mojoboxx fixed fare code end  //////////////////

  // //////////////////////// coop getfare code start ////////////////////////////
  async function coop_call(PartnercabType) {
    return new Promise(async (resolve, reject) => {
      var suratCity;
      if (
        Destination_city.trim() == "Hazira" ||
        Destination_city.trim() == "Dumas" ||
        Destination_city.trim() == "Rundh" ||
        Destination_city.trim() == "Limla"
      ) {
        suratCity = "surat";
      } else {
        suratCity = Destination_city.trim();
      }
      const totalkm = Math.round(KMNum);

      dataJ = {
        total_distance: totalkm,
        source_city: suratCity,
        destination_city: Destination_city.trim(),
        type_of_booking: "City",
      };
      $.ajax({
        contentType: "application/json",
        Accept: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        data: JSON.stringify(dataJ),
        dataType: "json",
        beforeSend: function () {
          $(".my-button").text("Please wait ...");
        },

        success: function (res) {
          if (res.code == 200 && res.code != 101) {
            // console.log("eske andr")
            var CoopResponse = res;
            localStorage.setItem("CoopResponse", JSON.stringify(CoopResponse));
            $("#coop_number").val(res.data.order_reference_number);
            if (CoopResponse.data.price.length != 0) {
              if (PartnercabType.toLowerCase() == "sedan") {
                FareResponse = CoopResponse.data.price.sedan;
              } else if (PartnercabType.toLowerCase() == "hatchback") {
                FareResponse = CoopResponse.data.price.hatchback;
              } else if (PartnercabType.toLowerCase() == "suv") {
                FareResponse = CoopResponse.data.price.suv;
              }
              var FareAmount = FareResponse;
              let AmountDiscount =
                (50 / (Number(FareAmount) + Number(50))) * 100;
              if (String(AmountDiscount).includes(".")) {
                var splitAmount = String(AmountDiscount).split(".");
                var splitAmount2 = splitAmount[0];
              } else {
                splitAmount2 = AmountDiscount;
              }

              filldetailsInCard("COOP", parseInt(FareAmount));

              resolve(FareAmount);
            }
          } else {
            console.log("Coop fare not found");
            reject("Rastey fare not found");
          }
          return FareAmount;
        },
        type: "POST",
        url: BaseAPIURL + domain + "/webapi/getCoopPrice",
      });
    });
  }
  // //////////////////////// coop getfare code end //////////////////////////////

  // /////////////////////// start MEGA /////////////////////////////////////////////////
  const GetFareFromMega = async (PartnercabType) => {
    return new Promise(async (resolve, reject) => {
      // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
      // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");

      let megaSearchId = Math.random().toString(16).slice(2);
      localStorage.setItem("megaSearchId", megaSearchId);
      let meruTime = pickupDate + " " + pickupTime + ":00";
      var city = SourceCity;

      let sendquestedData = {
        destination: {
          // "place_id": MapPlaceId,
          place_id: null,
          address: Destination_Name,
          latitude: destination_latitude,
          longitude: destination_longitude,
          city: Destination_city.trim(),
        },

        source: {
          place_id: null,
          address: source_Name.substring(0, 100).trim(),
          latitude: pickup_lat,
          longitude: pickup_long,
          city: SourceCity.trim(),
          // "city": "Delhi",
        },
        trip_type: "ONE_WAY",
        start_time: moment(meruTime).format("YYYY-MM-DDTHH:mm:ss"),
        end_time: moment(meruTime)
          .add(1, "hours")
          .format("YYYY-MM-DDTHH:mm:ss"),
        search_id: megaSearchId,
        one_way_distance: Math.round(KMNum),
        package_distance: 0,
        is_instant_search: false,
      };
      const ReferMega = await fetch(
        BaseAPIURL + domain + "/webapi/getMegaFare",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendquestedData),
        }
      );
      const getMega = await ReferMega.json();
      // show details on card start
      if (getMega.data.response.car_types.length > 0) {
        KMNum = getMega.data.response.distance_booked;

        for (let i = 0; i < getMega.data.response.car_types.length; i++) {
          if (
            getMega.data.response.car_types[i].type.toLowerCase() ==
            PartnercabType.toLowerCase()
          ) {
            let amountValue =
              parseInt(
                getMega.data.response.car_types[i].fare_details.grand_total
              ) + parseInt(MultiplierAmount);
            // let amountValue = parseInt(getMega.data.response.car_types[i].fare_details.grand_total);
            let AmountDiscount =
              (50 / (parseInt(amountValue) + Number(50))) * 100;
            if (String(AmountDiscount).includes(".")) {
              var splitAmount = String(AmountDiscount).split(".");
              var splitAmount2 = splitAmount[0];
            } else {
              splitAmount2 = AmountDiscount;
            }
            await filldetailsInCard("MEGA", parseInt(amountValue));
            resolve(amountValue);
          } else {
            resolve(true);
          }
        }
      } else {
        resolve(true);
      }
    });
  };
  // /////////////////////// end MEGA /////////////////////////////////////////////////

  /////////////////////////get Fare from Blusmart code Start///////////////////////////
  async function checkFareBlusmart(partnercabType) {
    return new Promise(async function (resolve, reject) {
      // document.getElementById("pr2BLUSMART").style.display = "none";

      let totalkm = Math.round(KMNum);
      let dateandtime = pickupDate + " " + pickupTime + ":00";

      var myHeaders = new Headers();
      // myHeaders.append("Authorization", "Basic c3BpY2VqZXQtZGV2OjBuV2FSTDZXaDU1NjEwMmtBc1lW");
      myHeaders.append(
        "Authorization",
        "Basic NjYzZDJmNDhlOGEwN2I4ZmY1M2E3YWM5YjMzYTk4ZDk6MmJjNTYyMzZlNjk2YThkM2FiNjYyNDU3ZGJhZjdhNjM="
      );
      myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Access-Control-Allow-Origin", "*");

      var raw = JSON.stringify({
        place_id: "ChIJv01jvzAZDTkReNbfdLygyf8",
        src_address: source_Name.substring(0, 100).trim(),
        src_latitude: pickup_lat,
        src_longitude: pickup_long,
        src_city: SourceCity.trim(),
        dest_address: Destination_Name,
        dest_latitude: destination_latitude,
        dest_longitude: destination_longitude,
        dest_city: Destination_city.trim(),
        trip_type: "ONE_WAY",
        search_id: Math.random().toString(14).slice(2),
        start_time: pickupDate + " " + pickupTime + ":00",
        end_time: moment(dateandtime)
          .add(60, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
        one_way_distance: totalkm,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(BaseAPIURL + domain + "/webapi/getBlusmartFare", requestOptions)
        // fetch("https://fusion.tracking.blucgn.com/api/v1/booking/search", requestOptions)

        .then((response) => response.text())
        .then((result) => {
          var newResult = JSON.parse(result);

          let amountValue =
            parseInt(newResult.response.car_types[0].fare_details.base_fare) +
            parseInt(MultiplierAmount);

          let AmountDiscount =
            (50 / (parseInt(amountValue) + Number(50))) * 100;
          if (String(AmountDiscount).includes(".")) {
            var splitAmount = String(AmountDiscount).split(".");
            var splitAmount2 = splitAmount[0];
          } else {
            splitAmount2 = AmountDiscount;
          }
          filldetailsInCard("BLUSMART", parseInt(amountValue));

          resolve(amountValue);
          return;
        })
        .catch((error) => {
          console.log("error", error);
          resolve(true);
        });
    });
  }

  // /////////////////////// start savvari /////////////////////////////////////////////////
  const GetFareFromSavvariPartner = async (PartnercabType) => {
    return new Promise(async (resolve, reject) => {
      // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
      // var travelTime = moment().add(5, 'hours').format("DD-MM-YYYY HH:MM");
      var travelTime = pickupDate + " " + pickupTime + ":00";
      let sendquestedData = {
        cityCode: ArrAirportName,
        startTime: travelTime,
        source_latitude: pickup_lat,
        source_longitude: pickup_long,
      };
      const ReferSavvari = await fetch(
        BaseAPIURL + domain + "/webapi/getSavaariFare",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendquestedData),
        }
      );
      const getSavvari = await ReferSavvari.json();
      // show details on card start
      if (getSavvari.length > 0) {
        for (let i = 0; i < getSavvari.length; i++) {
          if (
            getSavvari[i].carType.toLowerCase() == PartnercabType.toLowerCase()
          ) {
            var savaariFare =
              parseInt(getSavvari[i].amount) + parseInt(MultiplierAmount);

            let AmountDiscount = (50 / (savaariFare + Number(50))) * 100;
            if (String(AmountDiscount).includes(".")) {
              var splitAmount = String(AmountDiscount).split(".");
              var splitAmount2 = splitAmount[0];
            } else {
              splitAmount2 = AmountDiscount;
            }
            filldetailsInCard("SAVAARI", parseInt(savaariFare));

            localStorage.setItem("carID", getSavvari[i].carId);
            localStorage.setItem("token", getSavvari[i].token);
            resolve(savaariFare);
          } else {
            resolve(true);
          }
        }
      } else {
        resolve(true);
      }
    });
  };
  // /////////////////////// end savvari /////////////////////////////////////////////////

  async function GetFarefromMeru(PartnercabType) {
    return new Promise(async function (resolve, reject) {
      let meruSearchId = Math.random().toString(16).slice(2);
      localStorage.setItem("meruSearchId", meruSearchId);
      // var meruTime = moment($(".timepicker").val(), ["h:mm A"]).format("HH:mm")
      let meruTime = pickupDate + " " + pickupTime + ":00";
      var city = SourceCity;
      // var hardCodeCity =

      var datasend = {
        source: {
          place_id: MapPlaceId,
          address: source_Name.substring(0, 100).trim(),
          latitude: pickup_lat,
          longitude: pickup_long,
          city: SourceCity.trim(),
          // "city": "Delhi",
        },
        destination: {
          place_id: null,
          address: Destination_Name,
          latitude: destination_latitude,
          longitude: destination_longitude,
          city: Destination_city.trim(),
        },
        trip_type: "ONE_WAY",
        start_time: moment(meruTime).format("YYYY-MM-DDTHH:mm:ss"),
        end_time: moment(meruTime)
          .add(1, "hours")
          .format("YYYY-MM-DDTHH:mm:ss"),
        search_id: meruSearchId,
        one_way_distance: Math.round(KMNum),
        package_distance: 0,
        is_instant_search: false,
      };
      fetch(BaseAPIURL + domain + "/webapi/getMeruFarePrice", {
        method: "POST",
        body: JSON.stringify(datasend),
        headers: {
          "Content-type": "Application/json",
        },
      })
        .then((response) => response.text())
        .then((result) => {
          var newResult = JSON.parse(result);
          var fare;
          newResult.data.response.car_types.forEach((elem) => {
            if (elem.type.toLowerCase() == PartnercabType.toLowerCase()) {
              fare =
                elem.fare_details.base_fare +
                elem.fare_details.extra_charges.toll_charges["amount"] +
                elem.fare_details.extra_charges.parking_charges["amount"];
            }
          });
          var FareAmount = parseInt(fare) + parseInt(MultiplierAmount);
          let AmountDiscount = (50 / (Number(FareAmount) + Number(50))) * 100;
          if (String(AmountDiscount).includes(".")) {
            var splitAmount = String(AmountDiscount).split(".");
            var splitAmount2 = splitAmount[0];
          } else {
            splitAmount2 = AmountDiscount;
          }
          filldetailsInCard("MERU", parseInt(FareAmount));
          resolve(fare);
          return true;
        })
        .catch((error) => {
          console.error("Error:", error);
          resolve(true);
          // reject(true)
        });
    });
  }
  // ///////////////////////Get fare from Quickride API code start////////////////////////
  var quickrideFareId;
  var QuickrideFareResponse;
  async function GetFarefromPartner(PartnercabType) {
    return new Promise(async function (resolve, reject) {
      var fetchResponse;
      var datasend = {
        key: "MojoBox-Klm9.45j",
        vendor_id: "MOJO_BOXX_ZORY",
        destination_name: Destination_Name,
        destination_city: Destination_city.trim(),
        destination_latitude: destination_latitude,
        destination_longitude: destination_longitude,
        source_name: source_Name.substring(0, 100).trim(),
        source_city: SourceCity.trim(),
        source_latitude: pickup_lat,
        source_longitude: pickup_long,
        // start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        start_time: pickupDate + " " + pickupTime + ":00",
        end_time: "",
        tripType: "Local",
      };

      if (BookingTrip_Type == "Rental") {
        (datasend.tripType = "Rental"),
          (datasend["packageId"] =
            RentalHour == 12
              ? "PKG_12_120"
              : RentalHour == 8
              ? "PKG_8_80"
              : "PKG_4_40");
      }
      if (BookingTrip_Type == "Outstation") {
        (datasend.tripType = "Outstation"), (datasend.journeyType = "OneWay");
      }

      fetch(BaseAPIURL + domain + "/webapi/getQuickRideFare", {
        method: "POST",
        body: JSON.stringify(datasend),
        headers: {
          Authorization:
            "Basic eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MyIsImlzcyI6IlF1aWNrUmlkZSIsImlhdCI6MTYzOTU0MTgyMH0.6H0Dt2Hqhlj7RxcMcybV2bgkr29pCtm6ni8qfZFpv6qLtJtqy4-BbL-kTnz2zYiDZGDeGGj8Gr_GBC2FZFRkdg",
          "Content-type": "Application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          var fareAmountInteger;
          fetchResponse = json;
          for (let a = 0; a < fetchResponse.fareForTaxis.length; a++) {
            let TaxiType = fetchResponse.fareForTaxis[a].taxiType;
            if (TaxiType == "Car") {
              var fareResponse = fetchResponse.fareForTaxis[a].fares;
              QuickrideFareResponse = fetchResponse.fareForTaxis[a].fares;
              if (fareResponse.length >= 1) {
                for (let i = 0; i < fareResponse.length; i++) {
                  if (
                    fareResponse[i].taxiType == "Car" &&
                    fareResponse[i].vehicleClass.toLowerCase() ==
                      PartnercabType.toLowerCase()
                  ) {
                    // console.log(fareResponse[i].taxiType);
                    quickrideFareId = fareResponse[i].fixedFareId;
                    if (BookingTrip_Type == "City Ride") {
                      KMNum = Math.round(KMNum);
                    }
                    fareAmountInteger =
                      parseInt(fareResponse[i].maxTotalFare) +
                      parseInt(MultiplierAmount);
                    let AmountDiscount =
                      (50 / (fareAmountInteger + Number(50))) * 100;
                    if (String(AmountDiscount).includes(".")) {
                      var splitAmount = String(AmountDiscount).split(".");
                      var splitAmount2 = splitAmount[0];
                    } else {
                      splitAmount2 = AmountDiscount;
                    }
                    filldetailsInCard("QUICKRIDE", parseInt(fareAmountInteger));
                    resolve(fareAmountInteger);
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          // console.error('Error:', error);
          resolve(true);
          // reject(true)
        });
    });
  }
  // //////////////////////get fare from quickride code end ///////////////////////////

  ///////////////////////////////////////get fare from taxibazaar////////////////////
  async function GetFarefromTaxiBazaar(PartnercabType) {
    return new Promise(async function (resolve, reject) {
      let taxibazaarSearchId = Math.random().toString(16).slice(2);
      localStorage.setItem("taxibazaarSearchId", taxibazaarSearchId);
      let taxibazaarTime = pickupDate;
      // let taxibazaarTime = pickupDate + " " + pickupTime + ":00"

      var city = localStorage["SourceCity"];

      var datasend = {
        type: sessionStorage["AirportRideType"] == "arrival" ? 5 : 6,
        fromCity: Userdetails.sourcecity,
        fromState: Userdetails.sourcecity,
        toCity: Userdetails.destinationcity,
        toState: Userdetails.destinationcity,
        startDate: moment(taxibazaarTime).format("YYYY-MM-DD"),
        returnDate: moment(taxibazaarTime).format("YYYY-MM-DD"),
        // "startDate": moment(taxibazaarTime).format('YYYY-MM-DDTHH:mm:ss'),
        // "returnDate": moment(taxibazaarTime).add(1, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
        toLat: destination_latitude,
        toLon: destination_longitude,
        fromLat: pickup_lat.toString(),
        fromLon: pickup_long.toString(),
        distance: Math.round(KMNum),
        iataCode: Userdetails.citycode,
      };

      fetch(BaseAPIURL + domain + "/webapi/getTaxiBazaarFare", {
        method: "POST",
        body: JSON.stringify(datasend),
        headers: {
          "Content-type": "Application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success == true) {
            let TaxibazaarFare = 0;
            if (PartnercabType == "Sedan") {
              TaxibazaarFare = result.data.totalPriceSedan;
            } else if (PartnercabType == "SUV") {
              TaxibazaarFare = result.data.totalPriceSuv;
            } else if (PartnercabType == "Hatchback") {
              TaxibazaarFare = result.data.totalPriceHatchback;
            }

            let TaxiAmount =
              parseInt(TaxibazaarFare) + parseInt(MultiplierAmount);
            filldetailsInCard("TAXIBAZAAR", parseInt(TaxiAmount));
            // localStorage.setItem("TotalFare", result.data.totalPriceSedan);
            resolve(TaxiAmount);
            return true;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          resolve(true);
          reject(true);
        });
    });
  }
  ///////////////////////////////////////////////end fare taxibazaar//////////////////////

  // //////////////////// Get fare from BuddyCab code start ///////////////////////////
  var buddyFareId;
  async function GetFarefromPartnerBuddy(PartnercabType) {
    return new Promise(async function (resolve, reject) {
      var fetchResponse;
      let totalkm = Math.round(KMNum);
      var sourceCity;
      if (Destination_city.trim() == "Bangalore") {
        sourceCity = Bengaluru;
      } else {
        sourceCity = Destination_city.trim();
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        destination_name: Destination_Name,
        destination_city: Destination_city.trim(),
        destination_latitude: destination_latitude,
        destination_longitude: destination_longitude,
        source_name: source_Name,
        source_city:
          localStorage["cityCODE"] == "IXC" ? "Chandigarh" : sourceCity,
        source_latitude: pickup_lat,
        source_longitude: pickup_long,
        tripType: "Local",
        distance: totalkm,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch(
        "https://api.buddy-cabs.com/SpiceJet/GetCabFare",
        requestOptions
      )
        .then((response) => response.json())
        .then((json) => {
          let fareAmountInteger;
          fetchResponse = json;
          let TaxiType = fetchResponse.resultData.fareForTaxis.taxiType;
          if (TaxiType == "Car") {
            let fareResponse = fetchResponse.resultData.fareForTaxis.fares;
            if (fareResponse.length >= 1) {
              for (let i = 0; i < fareResponse.length; i++) {
                if (
                  fareResponse[i].taxiType == "Car" &&
                  fareResponse[i].vehicleClass.toLowerCase() ==
                    PartnercabType.toLowerCase()
                ) {
                  // console.log(fareResponse[i].taxiType);

                  fareAmountInteger = parseInt(fareResponse[i].totalCharge);
                  let AmountDiscount =
                    (50 / (fareAmountInteger + Number(50))) * 100;
                  if (String(AmountDiscount).includes(".")) {
                    var splitAmount = String(AmountDiscount).split(".");
                    var splitAmount2 = splitAmount[0];
                  } else {
                    splitAmount2 = AmountDiscount;
                  }
                  filldetailsInCard("BUDDY CABS", parseInt(fareAmountInteger));
                  resolve(fareAmountInteger);
                }
              }
            }
          }
        })
        .catch((error) => {
          reject(error);
          console.log("error", error);
        });
    });
  }
  // //////////////////// Get fare from BuddyCab code end  ////////////////////////////

  // /////////////////////// start Gozo /////////////////////////////////////////////////
  var GOZOFareId;
  const GetFareFromGozoPartner = async (CabType) => {
    return new Promise(async function (resolve, reject) {
      // ////////////////Current date & time code start/////////////////
      // var tym_date = moment(new Date()).add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss')
      var tym_date = pickupDate + "T" + pickupTime + ":00";
      var Currenttym = tym_date.split("T")[1];
      var Currentdate = tym_date.split("T")[0];
      // ////////////////Current date & time code end /////////////////

      var settings = {
        // "url": "https://preprodapi.mojoboxx.com/preprod/webapi/getGozoFares",
        url: BaseAPIURL + domain + "/webapi/getGozoFares",
        method: "POST",
        timeout: 0,
        headers: {
          Authorization: "Basic M2UwMDA4NTU0NWQ0OWZmMmNjM2MxNjRhMTcyYzE0ZGQ=",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          startDate: Currentdate,
          startTime: Currenttym,
          cab_type: CabType,
          // "mobile": UserMobileNumber,
          mobile: "",
          source_address: source_Name,
          source_latitude: pickup_lat,
          source_longitude: pickup_long,
          destination_address: Destination_Name,
          destination_latitude: destination_latitude,
          destination_longitude: destination_longitude,
          tripType: BookingTrip_Type == "Rental" ? RentalHour : "",
        }),
      };
      $.ajax(settings).done(function (gozores) {
        if (gozores.success != "false" && gozores.code == 200) {
          var gozofare = gozores["data"]["cabRate"];
          var GozoResponse = gozores.result;
          localStorage.setItem("GozoResponse", JSON.stringify(GozoResponse));
          if (BookingTrip_Type == "City Ride") {
            KMNum = gozores["data"]["quotedDistance"];
          }
          for (let a = 0; a < gozofare.length; a++) {
            CabType == "Hatchback" ? (CabType = "Compact") : CabType;
            if (
              gozofare[a]["cab"]["category"].toLowerCase() ==
              CabType.toLowerCase()
            ) {
              GOZOFareId = gozores["data"]["cabRate"][0]["cab"]["id"];
              var FareAmount =
                parseInt(gozofare[a]["fare"]["totalAmount"]) +
                parseInt(MultiplierAmount);
              var FareAmount =
                parseInt(gozofare[a]["fare"]["totalAmount"]) +
                parseInt(MultiplierAmount);
              let AmountDiscount = (50 / (FareAmount + Number(50))) * 100;
              if (String(AmountDiscount).includes(".")) {
                var splitAmount = String(AmountDiscount).split(".");
                var splitAmount2 = splitAmount[0];
              } else {
                splitAmount2 = AmountDiscount;
              }
              filldetailsInCard("GOZO CABS", parseInt(FareAmount));
              resolve(FareAmount);
            } else {
              resolve(true);
            }
          }
        } else {
          reject("Gozo fare not Found");
        }
      });
    });
  };
  // /////////////////////// end Gozo /////////////////////////////////////////////////

  // ///////////////////// Goa miles fare API code start /////////////////////////////
  var Goamilesfareid = "";
  var GoamilesvehicleTyp = "";

  async function checkFareGoamiles(cabTyp) {
    if (cabTyp == "suv") {
      cabTyp = "MUV";
    }
    return new Promise(async function (resolve, reject) {
      dataJ = {
        passenger_mobile: "9650379456",
        passenger_name: "",
        drop_latlng: destination_latitude + "," + destination_longitude,
        pickup_time: pickupDate + " " + pickupTime + ":00",
        pickup_counter_id: "",
        Pickup_LatLng: pickup_lat + "," + pickup_long,
        pickup_address: source_Name,
        drop_address: Destination_Name,
        passenger_email_id: "",
        booking_type: "",
        trip_type: "D",
        mode_of_payment: "",
      };
      // console.log(dataJ);
      $.ajax({
        contentType: "application/json",
        Accept: "application/json",
        data: JSON.stringify(dataJ),
        dataType: "json",
        success: function (res) {
          if (res.data.response_code != null && res.data.response_code == 101) {
            Goamilesfareid = res.data.data.request_id;
            var Farelist = res.data.data.fare_list;
            Farelist.forEach((element) => {
              if (
                element.vehicle_type_name.toLowerCase() == cabTyp.toLowerCase()
              ) {
                // console.log(element.vehicle_type_name);

                let amountValue =
                  Number(element.booking_amount) +
                  Number(parseInt(MultiplierAmount));
                let AmountDiscount = (50 / (amountValue + Number(50))) * 100;
                if (String(AmountDiscount).includes(".")) {
                  var splitAmount = String(AmountDiscount).split(".");
                  var splitAmount2 = splitAmount[0];
                } else {
                  splitAmount2 = AmountDiscount;
                }
                filldetailsInCard("GOAMILES", Math.round(amountValue));

                GoamilesvehicleTyp = element.vehicle_type;
                Goamilesamount = element.booking_amount;
                GoamilesVehiclename = element.vehicle_type_name;
                resolve(amountValue);
              }
            });
          } else {
            reject(true);
          }
        },
        error: function (xhr) {
          if (xhr.statusText == "error" || xhr.statusText == "Bad Request") {
            reject(true);
          }
        },
        type: "POST",
        url: BaseAPIURL + domain + "/webapi/getGoamilesQuote",
      });
    });
  }
  // ///////////////////// Goa miles fare API code end /////////////////////////////

  ///////////////////  fill amount in card code start /////////////////////////
  async function filldetailsInCard(partnerName, amount) {
    let updatedAmount = 0;
    if (couponcodeType == "discount%") {
      let discountpercent = parseInt((amount * couponCodeValue) / 100);
      defaultCashback = discountpercent;
    }
    let discounted_amount = Number(amount) - Number(defaultCashback);
    // if (cityRideFareModify == true) {
    //     updatedAmount = parseInt(KMNum * 25);
    //     localStorage.setItem('customFare', updatedAmount);
    //     console.log(KMNum + " " + updatedAmount, 'UA');
    // }

    if (CabBookingType == "hatchback") {
      $("#miniFare").empty();
      // cityRideFareModify == true ? $('#miniFare').html("₹ " + updatedAmount) :
      $("#miniFare").html("₹ " + discounted_amount);
      $("#miniFare").addClass("active-title");
    } else if (CabBookingType == "sedan") {
      $("#sedanFare").empty();
      // cityRideFareModify == true ? $('#sedanFare').html("₹ " + updatedAmount) :
      $("#sedanFare").html("₹ " + discounted_amount);
      $("#sedanFare").addClass("active-title");
    } else {
      $("#suvFare").empty();
      // cityRideFareModify == true ? $('#suvFare').html("₹ " + updatedAmount) :
      $("#suvFare").html("₹ " + discounted_amount);
      $("#suvFare").addClass("active-title");
    }
    // cityRideFareModify == true ? document.getElementById("PayNow").innerHTML = "₹ " + updatedAmount :
    if (paymentDEfault == "partial") {
      document.getElementById("PayNow").innerHTML =
        "₹ " + sessionStorage["partialAMount"];
      document.getElementById("RazorPayAmount").innerHTML =
        "₹ " + sessionStorage["partialAMount"];
      document.getElementById("SimplAmount").innerHTML =
        "₹ " + sessionStorage["partialAMount"];
    } else {
      document.getElementById("PayNow").innerHTML = "₹ " + discounted_amount;
      document.getElementById("RazorPayAmount").innerHTML =
        "₹ " + discounted_amount;
      document.getElementById("SimplAmount").innerHTML =
        "₹ " + discounted_amount;
    }
    document.getElementById("PayNow1").innerHTML = "₹ " + discounted_amount;

    $("#flush-disable").removeAttr("disabled").addClass("activeBookbtn");

    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");

    if (couponCodeValue != 0 && couponcodeType == "discount") {
      defaultCashback = couponCodeValue;
    }

    // if (couponcodeType.toLowerCase() == 'discount') {
    localStorage.setItem(
      "finalFare" + partnerName,
      Number(discounted_amount) - Number(defaultCashback)
    );
    // if (cityRideFareModify == true) {
    //     localStorage.setItem("TotalFare", updatedAmount);
    // } else {
    localStorage.setItem(
      "TotalFare",
      Number(discounted_amount) - Number(defaultCashback)
    );
    // }
    // }
    // else {
    // localStorage.setItem("finalFare" + partnerName, amount);
    // localStorage.setItem("TotalFare", amount);
    // }
  }
  ///////////////////  fill amount in card code end ///////////////////////////

  //////////////////// Payment option display code start////////////////
  async function paymentoptionLoad(cab_BookingType) {
    return new Promise(function (resolve, reject) {
      let userDetails = JSON.parse(localStorage.getItem("interUserDetails"));
      var pickup_time = pickupDate + " " + pickupTime;
      Track_LoadAnalytics(userDetails.countryCode + userDetails.userMobile, sessionStorage["AirportRideType"], Userdetails.tripType, userDetails.firstName, SourceCity.trim(), AirportCode.trim(), TerminalCode,
      Destination_Name, pickup_lat, pickup_long, destination_latitude, destination_longitude,pickup_time.split(" ")[0], pickup_time.split(" ")[1], localStorage.CouponCode != undefined ? localStorage.CouponCode : '', userDetails.userEmail, "MOJO_PAGE",sessionStorage["intlDistance"], '$'+ localStorage["TotalFare"])
      // fetch("https://preprodapi.mojoboxx.com/preprod/webapi/bookAirportCredentialsInfo").then((res) => res.json())
      fetch(BaseAPIURL + domain + "/webapi/bookAirportCredentialsInfo")
        .then((res) => res.json())
        .then((d) => {
          let x = d.data;
          let z = 0;
          for (let i of x) {
            if (i.type == "PAYTM_MID") {
              localStorage.setItem("PayMID", i.merchant_id);
            }
            let pageType = BookingTrip_Type;
            pageType = pageType == "City Ride" ? "ride" : pageType;
            if (String(i.payment_method).includes(pageType.toLowerCase())) {
              if ((i.type == "YATRA_PAYMENT") && (i.website_url == "YATRA")) { 
                if (i.city_code.includes(AirportCode)) {
                  localStorage.setItem(
                    "paymentmethod_display",
                    i.payment_options
                  );
                  paymentoptionDisplay = i.payment_options;
                  displayPayment(
                    i.payment_options,
                    i.Pay_btn1,
                    i.Pay_btn2,
                    i.payment_method,
                    i.partial_amount
                  );
                  z = 1;
                }
              }
            }
          }

          if (z == 0) {
            for (let i of x) {
              let pageType = BookingTrip_Type;
              pageType = pageType == "City Ride" ? "ride" : pageType;
              if (String(i.payment_method).includes(pageType.toLowerCase())) {
                if ((i.type == "YATRA_PAYMENT") && (i.website_url == "YATRA")) {
                  if (i.city_code.toLowerCase() == "all") {
                    localStorage.setItem(
                      "paymentmethod_display",
                      i.payment_options
                    );
                    paymentoptionDisplay = i.payment_options;
                    displayPayment(
                      i.payment_options,
                      i.Pay_btn1,
                      i.Pay_btn2,
                      i.payment_method,
                      i.partial_amount
                    );
                  }
                }
              }
            }
          }
          resolve(true);
        });
    });
  }

  async function displayPayment(
    paymentType,
    FullType,
    PartialType,
    RideType,
    partialAmount
  ) {
    console.log(paymentType, FullType, PartialType, RideType, partialAmount);
    let pageType = BookingTrip_Type;
    if (RideType == "") {
      RideType = "ride,rental,outstation";
    }
    pageType = pageType == "City Ride" ? "ride" : pageType;

    if (RideType.toLowerCase().includes(pageType.toLowerCase())) {
      if (
        paymentType.toLowerCase() == "cash,partial" ||
        paymentType.toLowerCase() == "partial,cash"
      ) {
        $("#fullbutton").css("display", "none");
        $("#laterbutton").css("display", "block");
        $("#partbutton").css("display", "block");
        $(".paymentoptionnew").css("justify-content", "space-around");
        sessionStorage.setItem("partialPayType", PartialType);
        sessionStorage.setItem("partialAMount", partialAmount);
        await loadPaymentMethod("partial", PartialType);
        paymentDEfault = "partial";
        $("#partbutton").click();
      }
      if (
        paymentType.toLowerCase() == "full,partial" ||
        paymentType.toLowerCase() == "partial,full"
      ) {
        $("#fullbutton").css("display", "block");
        $("#partbutton").css("display", "block");
        $(".paymentoptionnew").css("justify-content", "space-around");
        sessionStorage.setItem("fullPayType", FullType);
        sessionStorage.setItem("partialPayType", PartialType);
        sessionStorage.setItem("partialAMount", partialAmount);
        paymentDEfault = "full";
        await loadPaymentMethod("full", FullType);
        $("#fullbutton").click();
      }
      if (paymentType.toLowerCase() == "full") {
        $("#fullbutton").css("display", "block");
        $("#laterbutton").css("display", "none");
        $("#partbutton").css("display", "none");
        sessionStorage.setItem("fullPayType", FullType);
        paymentDEfault = "full";
        await loadPaymentMethod("full", FullType);
        $("#fullbutton").click();
      }
      if (paymentType.toLowerCase() == "partial") {
        $("#fullbutton").css("display", "none");
        $("#laterbutton").css("display", "none");
        $("#partbutton").css("display", "block");
        sessionStorage.setItem("partialPayType", PartialType);
        sessionStorage.setItem("partialAMount", partialAmount);
        await loadPaymentMethod("partial", PartialType);
        paymentDEfault = "partial";
        $("#partbutton").click();
      }

      if (
        paymentType.toLowerCase() == "full,cash,partial" ||
        paymentType.toLowerCase() == "full,partial,cash" ||
        paymentType.toLowerCase() == "cash,full,partial" ||
        paymentType.toLowerCase() == "cash,partial,full" ||
        paymentType.toLowerCase() == "partial,full,cash" ||
        paymentType.toLowerCase() == "partial,cash,full"
      ) {
        $("#fullbutton").css("display", "block");
        $("#laterbutton").css("display", "block");
        $("#partbutton").css("display", "block");
        $(".paymentoptionnew").css("justify-content", "space-around");
        sessionStorage.setItem("fullPayType", FullType);
        sessionStorage.setItem("partialPayType", PartialType);
        sessionStorage.setItem("partialAMount", partialAmount);
        paymentDEfault = "full";
        await loadPaymentMethod("full", FullType);
        $("#fullbutton").click();
      }
      if (
        paymentType.toLowerCase() == "full,cash" ||
        paymentType.toLowerCase() == "cash,full"
      ) {
        $("#fullbutton").css("display", "block");
        $("#laterbutton").css("display", "block");
        $(".paymentoptionnew").css("justify-content", "space-around");
        sessionStorage.setItem("fullPayType", FullType);
        paymentDEfault = "full";
        await loadPaymentMethod("full", FullType);
        $("#fullbutton").click();
      }

      if (paymentType.toLowerCase() == "cash-only") {
        $(".paymentoptionnew").css("justify-content", "flex-start");
        $("#fullbutton").css("display", "none");
        $("#laterbutton").css("display", "block");
        $("#laterrow").css("marginTop", "0px !important");
        $("#laterbutton").click();
        $("#flush-disable").text("Book Now");
      }
    }
  }

  //   await lastDetails("payment");

  document.getElementById("applyCoupon").onclick = function () {
    let selectedCountry = localStorage.getItem("SourceCountry");
    if (selectedCountry == "Mauritius") {
      applyCoupon();
    }
  };

  async function applyCoupon() {
    let couponapplied = false;

    if ($("#coupon").val() != "") {
      let cv = $("#coupon").val();
      // fetch(`${BaseAPIURL}${domain}/webapi/getCouponCode`).then((res) => {
      fetch(`${BaseAPIURL}${domain}/webapi/getCouponCode?coupon_code=${cv}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if ($("#coupon").val() != "") {
            if (data.success === true) {
              for (let element in data.data) {
                if (
                  $("#coupon").val().toLowerCase() ==
                  data.data[element].coupon_code.toLowerCase()
                ) {
                  couponapplied = true;
                  console.log(data);
                  Track_LoadAnalytics(
                    localStorage["mobileNum"],
                    "couponcodeapplydeparture",
                    "BAC",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    "null",
                    data.data[element].coupon_code
                  );

                  $("#CouponCode").val($("#coupon").val());
                  // console.log($("#CouponCode").val($("#coupon").val()));
                  localStorage.setItem("CouponCode", $("#coupon").val());
                  $(".popupDiv").css("display", "block");
                  $(".popupBox").css("display", "block");
                  couponCodeValue = data.data[element].amount;
                  couponcodeType = data.data[element].pay_type;
                  couponDiscountAmt = data.data[element].amount;
                  couponcodePayType = data.data[element].pay_type;
                  if (couponcodeType == "cashback") {
                    $("#coupon").val(
                      "Congrats! you'll get a cashback link on trip start"
                    );
                    $(".redeem")
                      .html(`Redeem your <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span>cashback through
                                                <br>Cashback link on trip start.`);
                    $(".redeem1").css("display", "block");
                  } else if (couponcodeType == "discount%") {
                    discountpercentage = couponCodeValue;
                    let amt = String(
                      document.getElementById("interPrice").innerHTML
                    );
                    amt = amt.includes("$")
                      ? amt.split("$")[1].trim()
                      : amt.trim();
                    let discountpercent = (amt * couponCodeValue) / 100;
                    defaultCashback = discountpercent;
                    console.log("discountpercent", discountpercent);
                    $("#coupon").val(
                      `Congrats!  ${couponCodeValue}% instant discount applied`
                    );
                    $(".redeem1").css("display", "none");
                    $(".redeem").html(
                      `Your coupon code for instant discount of <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`
                    );
                    document.getElementById("cpndiscnt").innerText =
                      couponCodeValue + "%";
                    if (CabBookingType == "hatchback") {
                      $("#sedanFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                      $("#suvFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                    } else if (CabBookingType == "suv") {
                      $("#sedanFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                      $("#miniFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                    } else {
                      $("#suvFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                      $("#miniFare")
                        .empty()
                        .html("Click for Fare")
                        .removeClass("active-title");
                    }

                    console.log("PaymentMethod", PaymentMethod);
                    lastDetails(PaymentMethod);
                    // interLastDetails();
                  } else {
                    defaultCashback = couponCodeValue;
                    $("#coupon").val(
                      `Congrats! ₹ ${couponCodeValue} instant discount applied`
                    );
                    $(".redeem1").css("display", "none");
                    $(".redeem").html(
                      `Your coupon code for instant discount <span id="cpndiscnt" style="color: #000; font-weight: bold;"></span> applied successfully.`
                    );
                    document.getElementById("cpndiscnt").innerText =
                      " Rs. " + data.data[element].amount;
                    lastDetails(PaymentMethod);
                  }
                  $("#coupon")
                    .attr("disabled", "true")
                    .css({ width: "95%", color: "#828282" });
                  $("#applyCoupon").css("display", "none");
                  $(".infoBox").css("display", "none");
                  $("#couponSuccessMsg").css("display", "none");
                }
              }
              if (couponapplied == false) {
                $("#couponSuccessMsg")
                  .css("color", "red")
                  .html("Please enter valid coupon code");

                setTimeout(() => {
                  $("#couponSuccessMsg").empty();
                }, 5000);
              }
            } else {
              $("#couponSuccessMsg")
                .css("color", "red")
                .html("Please enter valid coupon code");

              setTimeout(() => {
                $("#couponSuccessMsg").empty();
              }, 5000);
            }
          } else {
            $("#couponSuccessMsg")
              .css("color", "red")
              .html("Please enter coupon code");
          }
        });
    }
  }
}

async function loadPaymentMethod(paytype, paymentMethod) {
  $("#paytmrow").css("display", "none");
  $("#razorpayrow").css("display", "none");
  $("#simplrow").css("display", "none");

  let firstname = String(paymentMethod).includes(",")
    ? paymentMethod.split(",")[0]
    : paymentMethod;
  if (paymentMethod.toLowerCase().includes("paytm")) {
    // if (SelectedBookingType == '' || paytypeclick == true ) {
    if (firstname.toUpperCase() == "PAYTM") {
      await selectradioOnload(paytype, "PAYTM");
    }
    $("#paytmrow").css("display", "block");
  }
  if (paymentMethod.toLowerCase().includes("razorpay")) {
    // if (SelectedBookingType == '' || paytypeclick == true) {
    if (firstname.toUpperCase() == "RAZORPAY") {
      // console.log(paytypeclick, SelectedBookingType)
      await selectradioOnload(paytype, "RAZORPAY");
    }
    $("#razorpayrow").css("display", "block");
  }
  if (paymentMethod.toLowerCase().includes("simpl")) {
    // if (SelectedBookingType == '' || paytypeclick == true) {
    if (firstname.toUpperCase() == "SIMPL") {
      // console.log(paytypeclick, SelectedBookingType)
      await selectradioOnload(paytype, "SIMPL");
    }
    $("#simplrow").css("display", "block");
  }

  //   if (paytype == "full") {
  //     document.getElementById("PayNow").innerHTML =
  //       "₹ " + localStorage["TotalFare"];
  //     document.getElementById("RazorPayAmount").innerHTML =
  //       "₹ " + localStorage["TotalFare"];
  //     document.getElementById("SimplAmount").innerHTML =
  //       "₹ " + localStorage["TotalFare"];
  //     let val = $("input[name='fav_language']:checked").val().toUpperCase();
  //     SelectedBookingType = `FULL_${val}`;
  //   }
  if (paytype == "partial") {
    document.getElementById("PayNow").innerHTML =
      "₹ " + sessionStorage["partialAMount"];
    document.getElementById("RazorPayAmount").innerHTML =
      "₹ " + sessionStorage["partialAMount"];
    document.getElementById("SimplAmount").innerHTML =
      "₹ " + sessionStorage["partialAMount"];
    let val = $("input[name='fav_language']:checked").val().toUpperCase();
    SelectedBookingType = `PART_${val}`;
  }
}

async function selectradioOnload(paytype, paymentMethod) {
  switch (paymentMethod) {
    case "PAYTM": {
      $("#fullpaymt").prop("checked", true);
      if (paytype == "full") {
        SelectedBookingType = "FULL_PAYTM";
      }
      if (paytype == "partial") {
        SelectedBookingType = "PART_PAYTM";
      }
      break;
    }
    case "RAZORPAY": {
      $("#razorpayment").prop("checked", true);
      if (paytype == "full") {
        SelectedBookingType = "FULL_RAZORPAY";
      }
      if (paytype == "partial") {
        SelectedBookingType = "PART_RAZORPAY";
      }
      break;
    }
    case "SIMPL": {
      $("#simplpaymt").prop("checked", true);
      if (paytype == "full") {
        SelectedBookingType = "FULL_SIMPL";
      }
      if (paytype == "partial") {
        SelectedBookingType = "PART_SIMPL";
      }
      break;
    }
  }
}

$("input[type=radio][name=fav_language]").change(function () {
  let val = $(this).val().toUpperCase();
  if (paymentDEfault == "full") {
    SelectedBookingType = `FULL_${val}`;
  }
  if (paymentDEfault == "partial") {
    SelectedBookingType = `PART_${val}`;
  }
});

$("#okay").click(function () {
  $(".popupDiv").css("display", "none");
});
// ///////////////////////Apply coupon code end ///////////////////////////////////

/////////// Get device model code start //////////////
function getDeviceInformation() {
  const userAgent = navigator.userAgent;

  let manufacturer = "Unknown";
  let model = "Unknown";

  if (userAgent.includes("Android")) {
    const androidInfo = userAgent.match(/Android\s([^\s;]+)/);
    if (androidInfo && androidInfo.length > 1) {
      model = androidInfo[1];
      manufacturer = "Android";
    }
  } else if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("iPod")
  ) {
    const iOSInfo = userAgent.match(/\(([^)]+)\)/);
    if (iOSInfo && iOSInfo.length > 1) {
      const info = iOSInfo[1];
      const parts = info.split(";");
      for (const part of parts) {
        if (
          part.includes("iPhone") ||
          part.includes("iPad") ||
          part.includes("iPod")
        ) {
          model = part.trim();
          manufacturer = "Apple";
          break;
        }
      }
    }
  } else if (
    userAgent.includes("Windows") ||
    userAgent.includes("Macintosh") ||
    userAgent.includes("Linux")
  ) {
    manufacturer = "Web";
    model = "Web";
  }

  return {
    manufacturer: manufacturer,
    model: model,
  };
}

//////////////////// Get device model code end////////////////

/////////////// Simpl eligibility check Onload code start ///////////////////////////////////
const check_eligibility_onload = async (userMobile, FareAMOUNT) => {
  const deviceInfo = getDeviceInformation();

  const payload = {
    phone_number: userMobile,
    amount: FareAMOUNT * 100,
    manufacturer: deviceInfo.manufacturer,
    model: deviceInfo.model,
    id: "10.10.101.1",
    user_ip: userIp == 0 ? await getuserIp() : userIp,
    cabBook: true,
  };

  const key = "SPICE%SCREEN%BAC#SECERET%$#&)";
  const iv = "SPICE$MOJO$BOXX$BAC**$#";
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
    iv,
  }).toString();

  const rawResponse = await fetch(
    // "https://preprod.mojoboxx.com/preprod/webapi/check_eligibility",
    "https://prod.mojoboxx.com/spicescreen/webapi/check_eligibility",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestBody: encrypted,
      }),
    }
  );
  // console.log(rawResponse.body)
  const content = await rawResponse.json();
  $(".spinner").css("display", "none");
  $(".spinnerBack").css("display", "none");

  if (content.data.data.error_code == "pending_dues") {
    // $("#simplrow").css("display", "none");
    // $("#payline2").css("display", "none");
    simpleligiblityType = "not_eligible";
    $("#exampleModal").modal("hide");
  } else if (content.data.data.error_code == "insufficient_credit") {
    // $("#simplrow").css("display", "none");
    // $("#payline2").css("display", "none");
    simpleligiblityType = "not_eligible";
    $("#exampleModal").modal("hide");
  } else if (content.data.data.status == "not_eligible") {
    // $("#simplrow").css("display", "none");
    // $("#payline2").css("display", "none");
    simpleligiblityType = "not_eligible";
    $("#exampleModal").modal("hide");
  } else if (
    content.data.data.status == "eligible" &&
    content.data.data.error_code == null &&
    content.data.data.redirection_url == null
  ) {
    // $("#simplrow").css("display", "flex");
    // $("#payline2").css("display", "block");
    simpleligiblityType = "eligible";
  } else if (
    content.data.data.status == "eligible" &&
    content.data.data.error_code == "linking_required"
  ) {
    // $("#simplrow").css("display", "flex");
    // $("#payline2").css("display", "block");
    simpleligiblityType = "eligible";
  } else {
    // $("#simplrow").css("display", "none");
    // $("#payline2").css("display", "none");
    simpleligiblityType = "not_eligible";
    $("#exampleModal").modal("hide");
  }
};
/////////////// Simpl eligibility check Onload code end /////////////////////////////////////

/////////////// Simpl eligibility check code start ///////////////////////////////////
const check_eligibility_fc = async (userMobile, FareAMOUNT) => {
  const deviceInfo = getDeviceInformation();

  const payload = {
    phone_number: userMobile,
    amount: FareAMOUNT * 100,
    manufacturer: deviceInfo.manufacturer,
    model: deviceInfo.model,
    id: "10.10.101.1",
    user_ip: userIp == 0 ? await getuserIp() : userIp,
    cabBook: true,
  };

  const key = "SPICE%SCREEN%BAC#SECERET%$#&)";
  const iv = "SPICE$MOJO$BOXX$BAC**$#";
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
    iv,
  }).toString();

  const rawResponse = await fetch(
    // "https://preprod.mojoboxx.com/preprod/webapi/check_eligibility",
    "https://prod.mojoboxx.com/spicescreen/webapi/check_eligibility",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestBody: encrypted,
      }),
    }
  );

  // console.log(rawResponse.body)
  const content = await rawResponse.json();

  if (content.data.data.error_code == "pending_dues") {
    $(".simplStatus")
      .html(
        `Pending Bill Rs. ${
          content.data.data.metadata.pending_due_in_paise / 100
        }`
      )
      .css("display", "block");
    $("#flush-disable").val("Pay Now");
    SimplButon = "Redirect";
    $("#exampleModal").modal("hide");
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(
      `You have Pending dues Rs. ${
        content.data.data.metadata.pending_due_in_paise / 100
      }`
    );
    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");
    simplRedirectionURL = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-pending_dues-${userMobile}-${content.data.data.metadata.pending_due_in_paise}-amount-${FareAMOUNT}`;
    return "NO";
  } else if (content.data.data.error_code == "insufficient_credit") {
    $(".simplStatus")
      .html(
        `Insufficient Credit Rs. ${
          content.data.data.metadata.pending_due_in_paise / 100
        }`
      )
      .css("display", "block");
    $("#flush-disable").val("Pay Now");
    SimplButon = "Redirect";
    $("#exampleModal").modal("hide");
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(
      `Insufficient Credit Rs. ${
        content.data.data.metadata.pending_due_in_paise / 100
      }`
    );
    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");
    simplRedirectionURL = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-pending_dues-${userMobile}-${content.data.data.available_credit_in_paise}-amount-${FareAMOUNT}`;
    return "NO";
  } else if (
    content.data.data.status == "eligible" &&
    content.data.data.error_code == "linking_required" &&
    content.data.data.redirection_url != ""
  ) {
    $(".simplStatus").html("You are eligible").css("display", "block");
    // $(".simplStatus").html("Link your simpl account").css("display", "block")

    // $("#flush-disable").val('Link Now')
    $("#flush-disable").val("Pay Now");
    SimplButon = "Redirect";
    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");
    simplRedirectionURL = `${content.data.data.redirection_url}&merchant_payload=BOOKAIRPORTCAB-000-linking_required-${userMobile}-000-accountlinked=true-bookingid-${ordernum}-amount-${FareAMOUNT}-callbackURL-https://mb.bookairportcab.com/website/home/payNow.html`;
    return "YES";
  } else if (
    content.data.data.status == "eligible" &&
    content.data.data.error_code == null &&
    content.data.data.redirection_url == null
  ) {
    REDIRECTION_URL = "";
    SimplButon = "PayNow";
    $("#flush-disable").val("Pay Now");
    $(".simplStatus")
      .html(
        `Your credit limit is Rs. ${
          content.data.data.available_credit_in_paise / 100
        }`
      )
      .css("display", "block");
    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");
    return "YES";
  } else {
    $("#exampleModal").modal("hide");
    $("#toast").modal("show");
    $("#toastBody").empty();
    $("#toastBody").html(`You are not eligible for simpl`);
    $(".spinner").css("display", "none");
    $(".spinnerBack").css("display", "none");
    return "NO";
  }
};
/////////////// Simpl eligibility check code end /////////////////////////////////////

//////////// INsert data at link account case in simpl code start /////////////////////////////////////
async function simplentry(Data) {
  let final_data = Data.clubMember[0];
  // console.log(final_data)
  final_data.order_reference_number = ordernum != undefined ? ordernum : "";

  const updateentry = await fetch(
    // "https://preprodapi.mojoboxx.com/preprod/webapi/insertion_simpl_data",
    "https://prodapi.mojoboxx.com/spicescreen/webapi/insertion_simpl_data",

    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(final_data),
    }
  );
  let response = await updateentry.json();
  // console.log(response)
  $(".spinner").css("display", "none");
  $(".spinnerBack").css("display", "none");

  if (response.code === 200 && response.success == true) {
    setTimeout(() => {
      window.location.href = simplRedirectionURL;
    }, 1000);
  }
}
///////////// INsert data at link account case in simpl code end  //////////////////////////////////

//////////// Simpl autoselect on load code start//////////////////////////////////
async function simplflowLoad() {
  $("#simplpaymt").prop("checked", true);
  SelectedBookingType = "SIMPL";
  $(".spinner").css("display", "block");
  $(".spinnerBack").css("display", "block");
  // check_eligibility_fc(UserMobileNumber, localStorage["TotalFare"])
}
////////// simpl autoselect on load code end  //////////////////////////////////
