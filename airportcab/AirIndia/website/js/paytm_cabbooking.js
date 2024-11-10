const addPaymentType = (payType, orderId, order_reference_number, payment_Typ, AmountPaidbyusr) => {
    return new Promise(async function (resolve, reject) {

        var order_reference_number = order_reference_number;
        // console.log(order_reference_number)
        if(order_reference_number == undefined || order_reference_number.length < 1 || order_reference_number.length == '')
        {
          order_reference_number = "BAC" + Math.floor(10000000000 + Math.random() * 9000000000);
        }
        if(payType == "RAZORPAY" )
        {
            RazorpayBookingId = "BAC" + Math.floor(10000000000 + Math.random() * 9000000000);
            order_reference_number = RazorpayBookingId
        }
        // let registerClubMember = JSON.parse(localStorage.departurebookingData);
        // // set order_reference_number in registerClubMember
        // registerClubMember.clubMember[0].order_reference_number = order_reference_number;
        // const RegisterClubMember = registerClubMember;

        // console.log(JSON.parse(localStorage["BookingDatafromMain"]));
        // console.log(JSON.parse(localStorage["PNRDatafromMain"]));
        // console.log(JSON.parse(localStorage["departurebookingData"]));

        // console.log(payType)
        // console.log(orderId)
        // console.log(order_reference_number)
        const final_data = JSON.parse(localStorage["departurebookingData"])
        // console.log(localStorage["BookingDatafromMain"]);
        // const final_data = registerClubMember.clubMember
        // console.log(final_data);
        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }


        if ((final_data.clubMember[0].fare_price).includes("-")) {
            final_data.clubMember[0].fare_price = (final_data.clubMember[0].fare_price).split("-")[1];
        }
        if (final_data.clubMember[0].from_city == "Z_Demo") {
            final_data.clubMember[0].from_city = "DEL"
            final_data.clubMember[0].to_city = "DEL"
        }
        if(payType == "PAYTM")
        {
            final_data.clubMember[0].msgUniqueId = getRandom(10)
        }
        final_data.clubMember[0].fare_price = String(AmountPaidbyusr).replace(/ /g, '');
        final_data.clubMember[0]["paymentMethod"] = payType;
        final_data.clubMember[0]["order_reference_number"] = order_reference_number != undefined ? order_reference_number : '';
        if (payType == "PAYTM" && payment_Typ == "partial_pay") {
            final_data.clubMember[0]["pay_type"] = "partial_paytm";
        } else if (payType == "PAYTM" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_paytm";
        } else if (payType == "SIMPL" && payment_Typ == "partial_pay") {
            final_data.clubMember[0]["pay_type"] = "partial_simpl";
        } else if (payType == "SIMPL" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_simpl";
        } else if(payType == "RAZORPAY" && payment_Typ == "partial_pay"){
            final_data.clubMember[0]["pay_type"] = "partial_razor";
        } else if(payType == "RAZORPAY" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_razor";
        } else {
            final_data.clubMember[0]["pay_type"] = "post";
        }

        var UserName = final_data.clubMember[0]["user_name"] 
        localStorage.setItem("TripEND", JSON.stringify(final_data));
        // console.log(final_data.us)
        var dataJ = final_data;
        // console.log(dataJ);

        return $.ajax({
            contentType: 'application/json',
            Accept: 'application/json',
            data: JSON.stringify(dataJ),
            dataType: 'json',
            success: function (response) {
                // console.log(response);
                resolve(response);
                if (payType == "PAYTM") {
                    $(".spinner").css("display", "none")
                    $(".spinnerBack").css("display", "none")
                    paymentUpi('PAYTMPAY', payment_Typ, AmountPaidbyusr , order_reference_number != undefined ? order_reference_number : '');
                }
                if(payType == "RAZORPAY"){
                    check_razorpay(sessionStorage["MobileNum"],UserName,AmountPaidbyusr, payment_Typ);
                }
                return JSON.stringify(response);
            },
            error: function (err) {
                console.log(err)
                reject(err);
            },
            type: 'POST',
            // url: 'https://preprodapi.mojoboxx.com/preprod/webapi/cabRegistration',
            url: 'https://prodapi.mojoboxx.com/spicescreen/webapi/cabRegistration'
        });
    })

}


       /////////////RazorPay code start ///////////////////////////

       var razor_paydata,
       user_data,
       options,
       rzp1;

   function check_razorpay(userMobile, UserName,AmountPaidbyusr, payment_Typ) {

    if(payment_Typ == 'partial_pay'){
        AmountPaidbyusr = "249";
    }

       console.log(RazorpayBookingId)
       console.log(userMobile) // document.getElementById("loader").style.display = "block";
       // var response_data = JSON.parse(localStorage["order_data"]);
       // console.log(response_data);

       var user_amount = {
           "bookingId": RazorpayBookingId,
           // "bookingId": "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
           // "userId": response_data[0].id,
           "userId": '',
           "userName": UserName,
           "mobileNo": userMobile,
           "email": "hello@mojoboxx.com",
           "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
        //    "transAmt": 100,
           "success": true
       }
       console.log(user_amount);
       $.ajax({
           url: "https://prod.mojoboxx.com/spicescreen/webapi/initiateRazorPayTrans",
        //    url: "https://preprod.mojoboxx.com/preprod/webapi/initiateRazorPayTrans",
           type: "POST",
           crossDomain: true,
           dataType: "json",
           data: user_amount,
           success: function (response, textStatus, jqXHR) {
               console.log(response);
               console.log(response.data["booking_id"]);
               localStorage.setItem("razor_pay", JSON.stringify(response));
               // RazorpayBookingId = response.data["booking_id"];
               abc(UserName,userMobile,AmountPaidbyusr,RazorpayBookingId);
           },
           error: function (jqXHR, textStatus, errorThrown) {
               console.log(jqXHR);

               $("#cmmsg").html("Something went wrong");
               $(".confirmation_boxCabDiv").css("display", "block");
               $(".confirmation_boxCab").css("display", "block");
               $(".spinner").css("display", "none")
               $(".spinnerBack").css("display", "none")
               // console.log(textStatus);
               // console.log(errorThrown);
           }
       });

   }

   function abc(UserName,userMobile,AmountPaidbyusr,RazorpayBookingId) {
       $("#methodPayment").val('RAZORPAY')
       razor_paydata = JSON.parse(localStorage["razor_pay"]);
    //    console.log(razor_paydata);
       // var response_data = JSON.parse(localStorage["order_data"]);

       options = {
           "key": "rzp_live_NoKgpIbnNwrUtM",
        //    "key": "rzp_test_gXdgSAtNWQ0uLk", // Enter the Key ID generated from the Dashboard
           "amount": String(AmountPaidbyusr).replace(/ /g, '') * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
           "currency": "INR",
           "name": "BookAirportCab",
           "description": "Cab Payment",
            "image": "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/bacnew/bac.jpg",
           "order_id": razor_paydata["data"]["id"],
           "handler": function (response) {
               // console.log(response);
               localStorage.setItem("ordr_id", response.razorpay_order_id)
               localStorage.setItem("pymt_id", response.razorpay_payment_id)

              
               // console.log(RazorpayBookingId)
               var pay_success = {
                   "bookingId": RazorpayBookingId,
                   "checkout_logo": "https://cdn.razorpay.com/logo.png",
                   "custom_branding": false,
                   "org_logo": "",
                   "org_name": "Mobisign Services Private Ltd",
                   "userName": UserName,
                   // "date": "25-05-2022 12:30",
                   "date": moment().format('DD-MM-YYYY HH:mm'),
                   "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
                //    "transAmt": 100,
                   "razorpay_order_id": response.razorpay_order_id,
                   "razorpay_payment_id": response.razorpay_payment_id,
                   "razorpay_signature": response.razorpay_signature,
                   "status": "success",
                //    "type": 'CAB',
                   "type": 'RIDEPAYMENT',
                   "user_mobile": userMobile,
                   "cab_patner_name": localStorage["ptnr"]
               }
               // console.log(pay_success);
               $.ajax({
                //    url: "https://preprod.mojoboxx.com/preprod/webapi/razorPayTransStatus",
                   url: "https://prod.mojoboxx.com/spicescreen/webapi/razorPayTransStatus",
                   type: "POST",
                   dataType: "json",
                   data: pay_success,
                   success: function (response, textStatus, jqXHR) {
                       // console.log(response);
                       $(".spinner").css("display", "none")
                       $(".spinnerBack").css("display", "none")

                       var BookingDetails = JSON.parse(localStorage["TripEND"])
                       console.log(BookingDetails.clubMember[0].isDeparture)
                       console.log(BookingDetails.clubMember[0].category)

                       location.href = "payendBooking.html?payMethod=RAZORPAY"
                        // if((BookingDetails.clubMember[0].isDeparture == 1) && (BookingDetails.clubMember[0].category == "CAB"))
                        // {
                        //     $(".confirmation_boxCabDiv5").css("display", "block");
                        //     $(".confirmation_boxCab5").css("display", "block");
                        // }
                        // else{
                        //     $(".confirmation_boxCabDiv3").css("display", "block");
                        //     $(".confirmation_boxCab3").css("display", "block");
                        // }

                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                       console.log(jqXHR);
                       $(".spinner").css("display", "none")
                       $(".spinnerBack").css("display", "none")
                       $("#cmmsg").html("Payment Failed :" + textStatus);
                       $(".confirmation_boxCabDiv").css("display", "block");
                       $(".confirmation_boxCab").css("display", "block");
                   }
               });
           },
           "modal": {
               "ondismiss": function () {
                   window.location = "index.html"
               }
           },
           "prefill": {
               "name": UserName,
               "email": "hello@mojoboxx.com",
               "contact": userMobile
           },
           "notes": {
               "address": "Mobisign service Pvt Ltd"
           },
           "theme": {
               "color": "#3399cc"
           }
       };
       rzp1 = new Razorpay(options);
       rzp1.open();
       rzp1.on('payment.failed', function (response) {
           console.log(response)
           localStorage.setItem("error_reason", JSON.stringify(response));
           $("#cmmsg").html(response.error.reason);
           $(".confirmation_boxCabDiv").css("display", "block");
           $(".confirmation_boxCab").css("display", "block");

           var pay_fail = {
               "bookingId": RazorpayBookingId,
               "userName": UserName,
               "date": moment().format('DD-MM-YYYY HH:mm'),
               "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
            //    "transAmt": 100,
               "razorpay_order_id": razor_paydata["data"]["id"],
               "razorpay_payment_id": response.error.metadata["payment_id"],
               "status": "fail",
            //    "type": 'CAB',
               "type": 'RIDEPAYMENT',
               "user_mobile": userMobile,
               "cab_patner_name": localStorage["ptnr"]
           }
           console.log(pay_fail);
           $.ajax({
               url: "https://prod.mojoboxx.com/spicescreen/webapi/razorPayTransStatus",
               // url: "https://preprod.mojoboxx.com/preprod/webapi/razorPayTransStatus",
               type: "POST",
               dataType: "json",
               data: pay_fail,
               success: function (response, textStatus, jqXHR) {
                   // console.log(response);
                   var fail_reason = JSON.parse(localStorage["error_reason"])
                   // console.log(fail_reason);
                   $(".spinner").css("display", "none")
                   $(".spinnerBack").css("display", "none")
                   $("#cmmsg").html("Payment Failed");
                   $(".confirmation_boxCabDiv").css("display", "block");
                   $(".confirmation_boxCab").css("display", "block");
               },
               error: function (jqXHR, textStatus, errorThrown) {
                   console.log(jqXHR);
                   // console.log(textStatus);
                   // console.log(errorThrown);
                   $(".spinner").css("display", "none")
                   $(".spinnerBack").css("display", "none")
                   $("#cmmsg").html("Payment Failed :" + textStatus);
                   $(".confirmation_boxCabDiv").css("display", "block");
                   $(".confirmation_boxCab").css("display", "block");
               }
           });
       });
   }

   /////////////RazorPay code end  ///////////////////////////

   const paymentUpi = async (UPI_PAYMNET_TYPE, payment_Typ, amountfare, order_reference_number) => {
    let registerClubMember = JSON.parse(localStorage.departurebookingData);
    // console.log(registerClubMember,"here 1")
    const RegisterClubMember = registerClubMember;
    console.log(RegisterClubMember,"here 2")
    const final_data = registerClubMember.clubMember
    // console.log(final_data[0].fare_price)

    if(payment_Typ == 'partial_pay'){
        amountfare = "249";
    }

    final_data[0].fare_price = amountfare;

    // let fare_price = registerClubMember.clubMember[0].fare_price.split('-');
    // let getStementPrice = fare_price.length > 1 ? fare_price[1] : fare_price[0];
    // const totalAmount = ((10 / 100) * getStementPrice).toFixed();

    const dataR = JSON.stringify({
        // "amount": 1,
        // "amount": localStorage["TotalFare"],
        "amount": final_data[0].card_type == "mojoFixFare"?final_data[0].content_id:final_data[0].fare_price,
        "custId": "CUST_001",
        "mobileNo": final_data[0].mobile,
        "email": final_data[0].email,
        "bookingId": order_reference_number, // random()
        "type": "cab",
        "pnr": order_reference_number, // same as bookingId
        "partnerName": final_data[0].partnerName,
        "source_name": final_data[0].isDeparture == 0 ? final_data[0].source_name + ', ' + final_data[0].source_city : final_data[0].destination_name,
        "source_city": localStorage["SourceCity"],
        "source_latitude": final_data[0].isDeparture == 0 ? final_data[0].source_latitude : final_data[0].latitude,
        "source_longitude": final_data[0].isDeparture == 0 ? final_data[0].source_longitude : final_data[0].longitude,
        "destination_name": final_data[0].isDeparture == 1 ? final_data[0].source_name + ', ' + registerClubMember.clubMember[0].source_city : final_data[0].destination_name,
        "start_time": final_data[0].pickup_time,
        "cab_type": localStorage["partnercabType"],
        "URL_open": "bookairportcab_departure",
        "fare_price": final_data[0].fare_price,
        "total_kilometers": final_data[0].total_kilometers
    });
    // console.log(dataR)
    // const rawResponse = await fetch("https://preprod.mojoboxx.com/preprod/webapi/initaiteJSPayment", {
    const rawResponse = await fetch("https://prod.mojoboxx.com/spicescreen/webapi/initaiteJSPayment", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: dataR
    });
    const content = await rawResponse.json();
    // console.log(content);
    const initaiteJSPayment = { paytmTransId: content.paytmTransId, txnToken: content.data.txnToken,  totalAmount: final_data[0].card_type == "mojoFixFare"?final_data[0].content_id:final_data[0].fare_price }
    localStorage.setItem('initaiteJSPayment', JSON.stringify(initaiteJSPayment))
    // window.location = "paytm.html?cancelPage=Payment_booking"
    window.location = "paytm.html?cancelPage=index"
}

/////////////////////////// UPI payment method end ///////////////////////////////

///////////////////////////// Status Show after payment start ////////////////////////

const ShowStatus = (statusCode) => {

    if (statusCode == 101) {
        $("#reserve4").html("Something went wrong, Please choose another method");
        $(".confirmation_boxCabDiv4").css("display", "block");
        $(".confirmation_boxCab4").css("display", "block");
    }

    if (statusCode == 200) {
        $("#methodPayment").val('Cash')
        $(".confirmation_boxCabDiv3").css("display", "block");
        $(".confirmation_boxCab3").css("display", "block");
    }
}

///////////////////////////// Status Show after payment end ////////////////////////
