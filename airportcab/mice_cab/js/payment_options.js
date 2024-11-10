// // PAYMENT INFO -
// function selectPayment(element) {
//     const options = document.querySelectorAll('.payment-option');
//     options.forEach(option => {
//         option.classList.remove('selected');
//     });

//     element.classList.add('selected');

//     changePaymentMethod(element);
// }

// let razor_paydata, rzp1, options;

// function initiateRazorPay() {
//     const formData = JSON.parse(sessionStorage.getItem('formData'));
//     const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
//     const userData = JSON.parse(sessionStorage.getItem('userData'));
//     const amount = Number(bookingDetails.price.replace(/[₹,]/g, '').trim());
//     // const AmountPaidbyusr = amount;
//     const AmountPaidbyusr = 1;


//     const UserName = `${userData.name}`;
//     const userMobile = `${userData.contactNumber}`;
//     const Amount = `${AmountPaidbyusr}`;
//     const RazorpayBookingId = `${formData.mac_address}`;
//     const userEmail = `${userData.email}`;


//     // Prepare the payment data
//     const user_amount = {
//         "bookingId": RazorpayBookingId,
//         "userId": '',
//         "userName": UserName,
//         "mobileNo": userMobile,
//         "email": "${userData.email}",
//         "transAmt": String(Amount).replace(/ /g, '') * 100,
//         "success": true
//     };

//     $.ajax({
//         url: "https://prod.mojoboxx.com/spicescreen/webapi/initiateRazorPayTrans",
//         type: "POST",
//         crossDomain: true,
//         dataType: "json",
//         data: user_amount,
//         success: function (response) {
//             // Store the response data (for example, the order_id)
//             localStorage.setItem("razor_pay", JSON.stringify(response));

//             // Call abc() to configure Razorpay
//             abc(UserName, userMobile, AmountPaidbyusr, userEmail, RazorpayBookingId);
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error("Payment initiation failed:", textStatus, errorThrown);
//             alert("Something went wrong while initiating payment.");
//         }
//     });
// }

// function abc(UserName, userMobile, AmountPaidbyusr, userEmail, RazorpayBookingId) {

//     // Retrieve Razorpay order data
//     razor_paydata = JSON.parse(localStorage.getItem("razor_pay"));
//     sessionStorage.setItem('cabRegistration', 'false');
//     const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
//     options = {
//         "key": "rzp_live_NoKgpIbnNwrUtM",  // Live key
//         "amount": String(AmountPaidbyusr).replace(/ /g, '') * 100,  // Amount in paise
//         "currency": "INR",
//         "name": "MICECAB",
//         "description": "Cab Payment",
//         "image": "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/bacnew/bac.jpg",
//         "order_id": razor_paydata.data.id,
//         "handler": function (response) {
//             localStorage.setItem("ordr_id", response.razorpay_order_id);
//             localStorage.setItem("pymt_id", response.razorpay_payment_id);

//             // Send payment success status to your server
//             const pay_success = {
//                 "bookingId": RazorpayBookingId,
//                 "checkout_logo": "https://cdn.razorpay.com/logo.png",
//                 "custom_branding": "false",
//                 "org_logo": "",
//                 "org_name": "Mobisign Services Private Ltd",
//                 "userName": UserName,
//                 "date": moment().format('DD-MM-YYYY HH:mm'),
//                 "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
//                 "razorpay_order_id": razor_paydata.data.id,
//                 "razorpay_payment_id": response.razorpay_payment_id,
//                 "razorpay_signature": response.razorpay_signature,
//                 "status": "success",
//                 "type": 'RIDEPAYMENT',
//                 "user_mobile": userMobile,
//             };

//             console.log(pay_success);

//             $.ajax({
//                 url: "https://prod.mojoboxx.com/spicescreen/webapi/razorPayTransStatus",
//                 type: "POST",
//                 contentType: "application/json",
//                 dataType: "json",
//                 data: JSON.stringify(pay_success),
//                 success: function (response) {
//                     console.log("Payment successful!", response);
//                     // After successful payment, make the cab registration API call
//                     const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
//                     const formData = JSON.parse(sessionStorage.getItem('formData'));
//                     let pickup_date = formData.pickup_date;  
//                     let pickup_time = formData.pickup_time;  
//                     let combinedPickupTime = pickup_date + " " + pickup_time;
//                     const fare_price = bookingDetails.price.replace("₹", "").trim();
//                     const match = formData.destination.match(/-\s*\((.*?)\)/);
//                     const extractedData = match ? match[1] : "";
//                     console.log(extractedData);
//                     const cabApiPayload = {
//                         "clubMember": [
//                           {
//                             "type": "cabForm",
//                             "name_title": "",
//                             "user_name": UserName,
//                             "last_name": "Customer",
//                             "mobile": userMobile,
//                             "email": userEmail,
//                             "time": new Date().getTime(),
//                             "sendLeadSms": "true",
//                             "partnerName": bookingDetails.partnerName,
//                             "title": bookingDetails.partnerName,
//                             "category": "CAB",
//                             "cab_category": "City Ride",
//                             "drop_location": formData.destination,  // From form data
//                             "pickup_time": combinedPickupTime,  // Pickup time from form data
//                             "cab_type": bookingDetails.cabType,  // From booking details
//                             "cab_id": 0,
//                             "fare_price":  fare_price,
//                             "total_kilometers": Math.round(formData.distance).toString(),
//                             "terminalCode": extractedData,
//                             "msgUniqueId": 2654853924,
//                             "from_city": formData.cityCode,  // Source city from form data
//                             "to_city": formData.cityCode,  // Destination city from form data
//                             "source": formData.source,  // Source location from form data
//                             "destination": formData.destination,  // Destination location from form data
//                             "latitude": formData.source_lat,  // Source latitude from form data
//                             "longitude": formData.source_long,  // Source longitude from form data
//                             "isDeparture": formData.is_departure ? 1 : 0,  // From dynamic variable
//                             "pnr": "",
//                             "source_city": formData.source,  // Source city from form data
//                             "source_latitude": formData.source_lat,  // Source latitude from form data
//                             "source_longitude": formData.source_long,  // Source longitude from form data
//                             "source_name": formData.source,  // Source name from form data
//                             "destination_city": formData.destination,  // Destination city from form data
//                             "destination_latitude": formData.destination_lat,  // Destination latitude from form data
//                             "destination_longitude": formData.destination_long,  // Destination longitude from form data
//                             "destination_name": formData.destination,  // Destination name from form data
//                             "status": "CAB",
//                             "card_type": "",
//                             "content_id": "799",
//                             "refer_Code": "",
//                             "fixedFareId": "",
//                             "mojoPartner": "SPICEJET",
//                             "carID": "",
//                             "token": "",
//                             "website_url": "SPICEJET_Departure_url",
//                             "user_agent": "",
//                             "pay_type": "full_razor",
//                             "paymentMethod": "RAZORPAY",
//                             "service_charge": 0,
//                             "state": "Delhi",
//                             "order_reference_number": formData.mac_address,
//                             "advance_amount":  fare_price,
//                             "discount_type": "discount",
//                             "discount_amount": 0
//                           }
//                         ]
//                       };
//                     console.log(cabApiPayload);
//                     $.ajax({
//                         url: "https://prodapi.mojoboxx.com/spicescreen/webapi/cabRegistration",
//                         type: "POST",
//                         contentType: "application/json",
//                         headers: {
//                             'Authorization': 'Basic TUAwSjBib1hYODZHIzpWVSYjKFMmI0pEIyRJWA==',
//                             'Accept': 'application/json'
//                         },
//                         data: JSON.stringify(cabApiPayload),
//                         success: function (cabResponse) {
//                             console.log("Cab registration successful!", cabResponse);
//                             sessionStorage.setItem('cabRegistration', 'true');
//                             // window.location.href = "http://localhost:8963/mice_cab/thank_you.html";
//                             // window.location.href = "https://mice.bookairportcab.com/mice_cab/thank_you.html";
//                         },
//                         error: function (jqXHR, textStatus, errorThrown) {
//                             console.error("Cab registration failed:", textStatus, errorThrown);
//                             alert("Cab registration failed. Please contact support.");
//                         }
//                     });
//                 },
//                 error: function (jqXHR, textStatus, errorThrown) {
//                     console.error("Failed to update payment status:", jqXHR.responseText, textStatus, errorThrown);
//                 }
//             });
//         },
//         "prefill": {
//             "name": UserName,
//             "email": userEmail,
//             "contact": userMobile
//         },
//         "theme": {
//             "color": "#3399cc"
//         }
//     };

//     // Initialize Razorpay and open the payment gateway
//     rzp1 = new Razorpay(options);
//     rzp1.open();

//     rzp1.on('payment.failed', function (response) {
//         console.error("Payment failed:", response);
//         alert("Payment failed, please try again.");

//         // Handle payment failure
//         const pay_fail = {
//             "bookingId": RazorpayBookingId,
//             "checkout_logo": "https://cdn.razorpay.com/logo.png",
//             "custom_branding": "false",
//             "org_logo": "",
//             "org_name": "Mobisign Services Private Ltd",
//             "userName": UserName,
//             "date": moment().format('DD-MM-YYYY HH:mm'),
//             "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
//             "razorpay_order_id": razor_paydata.data.id,
//             "razorpay_payment_id": response.razorpay_payment_id,
//             "razorpay_signature": response.razorpay_signature,
//             "status": "fail",
//             "type": 'RIDEPAYMENT',
//             "user_mobile": userMobile,
//         };

//         $.ajax({
//             url: "https://prod.mojoboxx.com/spicescreen/webapi/razorPayTransStatus",
//             type: "POST",
//             dataType: "json",
//             data: pay_fail,
//             success: function (response) {
//                 console.log("Payment failure logged", response);
//             },
//             error: function (jqXHR, textStatus, errorThrown) {
//                 console.error("Failed to log payment failure:", textStatus, errorThrown);
//             }
//         });
//     });
// }


// function changePaymentMethod(selectedOption) {
//     const paymentText = selectedOption.querySelector('.payment-text').childNodes[0].textContent.trim();
//     const paymentDetailsDiv = document.getElementById('payment-details');

//     paymentDetailsDiv.innerHTML = '';

//     let razorpayButton = `<button onclick="initiateRazorPay()" class="payment-btn">Proceed to Pay</button>`;

//     switch (paymentText) {
//         case 'Book Now Pay Later':
//             paymentDetailsDiv.innerHTML = `<h2>Why Use Book Now Pay Later?</h2>
//                     <ul>
//                         <li>Starts at 0% Interest</li>
//                     </ul>`+ razorpayButton;
//             break;

//         case 'Credit/Debit/ATM Card':
//             paymentDetailsDiv.innerHTML = `
//                     <h4>Credit/Debit/ATM Card Details</h4>
//                     <p>Please enter your card details to proceed with the payment.</p>
//                 `+ razorpayButton;
//             break;
//         case 'UPI Options':
//             paymentDetailsDiv.innerHTML = `
//                     <h4>UPI Payment</h4>
//                     <p>Pay directly from your bank account using UPI.</p>
//                 `+ razorpayButton;
//             break;
//         case 'Net Banking':
//             paymentDetailsDiv.innerHTML = `
//                     <h4>Net Banking</h4>
//                     <p>Select your bank and log in to proceed with the payment.</p>
//                 `+ razorpayButton;
//             break;
//         case 'Gift Cards & e-wallets':
//             paymentDetailsDiv.innerHTML = `
//                     <h4>Gift Cards & e-wallets</h4>
//                     <p>Use your gift card or e-wallet for payment.</p>
//                 `+ razorpayButton;
//             break;
//         case 'GooglePay':
//             paymentDetailsDiv.innerHTML = `
//                     <h4>GooglePay</h4>
//                     <p>Pay using GooglePay.</p>
//                 `+ razorpayButton;
//             break;
//         default:
//             paymentDetailsDiv.innerHTML = `<p>Invalid Payment Option</p>`;
//             break;
//     }
// }

// function selectFirstPaymentOption() {
//     const firstOption = document.querySelector('.payment-option');
//     if (firstOption) {
//         firstOption.classList.add('selected');
//         changePaymentMethod(firstOption);
//     }
// }

// document.addEventListener('DOMContentLoaded', (event) => {
//     selectFirstPaymentOption();
// });

// -------------------------------**************************-----------------------------------------------

// PAYMENT INFO -


function selectPayment(element) {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    changePaymentMethod(element);
}

let razor_paydata, rzp1, options;

function initiateCabRegistration() {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    const bookingDetails = JSON.parse(sessionStorage.getItem('cabBookingDetails'));
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    const UserName = `${userData.name}`;
    const userMobile = `${userData.contactNumber}`;
    const userEmail = `${userData.email}`;
    const RazorpayBookingId = `${formData.mac_address}`;
    const fare_price = bookingDetails.price.replace("₹", "").trim();
    const match = formData.destination.match(/-\s*\((.*?)\)/);
    const extractedData = match ? match[1] : "";
    let pickup_date = formData.pickup_date;
    let pickup_time = formData.pickup_time;
    let combinedPickupTime = pickup_date + " " + pickup_time;
    const cabApiPayload = {
        "clubMember": [
            {
                // "type": "cabForm",
                // "user_name": UserName,
                // "last_name": "Customer",
                // "mobile": userMobile,
                // "email": userEmail,
                // "time": new Date().getTime(),
                // "partnerName": bookingDetails.partnerName,
                // "title": bookingDetails.partnerName,
                // "cab_category": "City Ride",
                // "drop_location": formData.destination,
                // "pickup_time": `${formData.pickup_date} ${formData.pickup_time}`,
                // "cab_type": bookingDetails.cabType,
                // "fare_price": fare_price,
                // "total_kilometers": Math.round(formData.distance).toString(),
                // "terminalCode": extractedData,
                // "from_city": formData.cityCode,
                // "to_city": formData.cityCode,
                // "source": formData.source,
                // "destination": formData.destination,
                // "latitude": formData.source_lat,
                // "longitude": formData.source_long,
                // "state": "Delhi",
                // "order_reference_number": RazorpayBookingId,
                // "advance_amount": fare_price,
                // "discount_amount": 0

                "type": "cabForm",
                "name_title": "",
                "user_name": UserName,
                "last_name": "Customer",
                "mobile": userMobile,
                "email": userEmail,
                "time": new Date().getTime(),
                "sendLeadSms": "true",
                "partnerName": bookingDetails.partnerName,
                "title": bookingDetails.partnerName,
                "category": "CAB",
                "cab_category": "City Ride",
                "drop_location": formData.destination,  // From form data
                "pickup_time": combinedPickupTime,  // Pickup time from form data
                "cab_type": bookingDetails.cabType,  // From booking details
                "cab_id": 0,
                "fare_price": fare_price,
                "total_kilometers": Math.round(formData.distance).toString(),
                "terminalCode": extractedData,
                "msgUniqueId": getRandom(10),
                "from_city": formData.cityCode,  // Source city from form data
                "to_city": formData.cityCode,  // Destination city from form data
                "source": formData.source,  // Source location from form data
                "destination": formData.destination,  // Destination location from form data
                "latitude": formData.source_lat,  // Source latitude from form data
                "longitude": formData.source_long,  // Source longitude from form data
                "isDeparture": formData.is_departure ? 1 : 2,  // From dynamic variable
                "pnr": "",
                "source_city": formData.source,  // Source city from form data
                "source_latitude": formData.source_lat,  // Source latitude from form data
                "source_longitude": formData.source_long,  // Source longitude from form data
                "source_name": formData.source,  // Source name from form data
                "destination_city": formData.destination,  // Destination city from form data
                "destination_latitude": formData.destination_lat,  // Destination latitude from form data
                "destination_longitude": formData.destination_long,  // Destination longitude from form data
                "destination_name": formData.destination,  // Destination name from form data
                "status": "CAB",
                "card_type": "",
                "content_id": fare_price,
                "refer_Code": "",
                "fixedFareId": "",
                "mojoPartner": "SPICEJET",
                "carID": "",
                "token": "",
                "website_url": formData.is_departure ? "MICE_Departure_url" : "MICE_Arrival_url",
                "user_agent": "",
                "pay_type": "full_razor",
                "paymentMethod": "RAZORPAY",
                "service_charge": 0,
                "state": "Delhi",
                "order_reference_number": formData.mac_address,
                "advance_amount": fare_price,
                "discount_type": "discount",
                "discount_amount": 0
            }
        ]
    };

    $.ajax({
        url: "https://prodapi.mojoboxx.com/spicescreen/webapi/cabRegistration",
        type: "POST",
        contentType: "application/json",
        headers: {
            'Authorization': 'Basic TUAwSjBib1hYODZHIzpWVSYjKFMmI0pEIyRJWA==',
            'Accept': 'application/json'
        },
        data: JSON.stringify(cabApiPayload),
        success: function (cabResponse) {
            console.log("Cab registration successful!", cabResponse);
            sessionStorage.setItem('cabRegistration', 'true');
            initiateRazorPay(UserName, userMobile, userEmail, RazorpayBookingId, fare_price);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Cab registration failed:", textStatus, errorThrown);
            alert("Cab registration failed. Please contact support.");
        }
    });
}

function initiateRazorPay(UserName, userMobile, userEmail, RazorpayBookingId, AmountPaidbyusr) {
    const user_amount = {
        "bookingId": RazorpayBookingId,
        "userId": '',
        "userName": UserName,
        "mobileNo": userMobile,
        "email": userEmail,
        // "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
        "transAmt": 1 * 100,
        "success": true
    };

    $.ajax({
        url: "https://prod.mojoboxx.com/spicescreen/webapi/initiateRazorPayTrans",
        type: "POST",
        crossDomain: true,
        dataType: "json",
        data: user_amount,
        success: function (response) {
            localStorage.setItem("razor_pay", JSON.stringify(response));
            abc(UserName, userMobile, AmountPaidbyusr, userEmail, RazorpayBookingId);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Payment initiation failed:", textStatus, errorThrown);
            alert("Something went wrong while initiating payment.");
        }
    });
}

function abc(UserName, userMobile, AmountPaidbyusr, userEmail, RazorpayBookingId) {
    razor_paydata = JSON.parse(localStorage.getItem("razor_pay"));
    options = {
        "key": "rzp_live_NoKgpIbnNwrUtM",
        "amount": String(AmountPaidbyusr).replace(/ /g, '') * 100,
        "currency": "INR",
        "name": "MICECAB",
        "description": "Cab Payment",
        "image": "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/bacnew/bac.jpg",
        "order_id": razor_paydata.data.id,
        "handler": function (response) {
            localStorage.setItem("ordr_id", response.razorpay_order_id);
            localStorage.setItem("pymt_id", response.razorpay_payment_id);

            const pay_success = {
                "bookingId": RazorpayBookingId,
                "checkout_logo": "https://cdn.razorpay.com/logo.png",
                "userName": UserName,
                "date": moment().format('DD-MM-YYYY HH:mm'),
                "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
                "razorpay_order_id": razor_paydata.data.id,
                "razorpay_payment_id": response.razorpay_payment_id,
                "razorpay_signature": response.razorpay_signature,
                "status": "success",
                "type": 'RIDEPAYMENT',
                "user_mobile": userMobile,
            };

            $.ajax({
                url: "https://prod.mojoboxx.com/spicescreen/webapi/razorPayTransStatus",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(pay_success),
                success: function (response) {
                    console.log("Payment successful!", response);
                    // Redirect or display a success message
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Failed to update payment status:", jqXHR.responseText, textStatus, errorThrown);
                }
            });
        },
        "prefill": {
            "name": UserName,
            "email": userEmail,
            "contact": userMobile
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    rzp1 = new Razorpay(options);
    rzp1.open();
}

function changePaymentMethod(selectedOption) {
    const paymentText = selectedOption.querySelector('.payment-text').childNodes[0].textContent.trim();
    const paymentDetailsDiv = document.getElementById('payment-details');
    paymentDetailsDiv.innerHTML = '';

    let razorpayButton = `<button onclick="initiateCabRegistration()" class="payment-btn">Proceed to Pay</button>`;
    switch (paymentText) {
        case 'Book Now Pay Later':
            paymentDetailsDiv.innerHTML = `<h2>Why Use Book Now Pay Later?</h2><ul><li>Starts at 0% Interest</li></ul>` + razorpayButton;
            break;
        case 'Credit/Debit/ATM Card':
            paymentDetailsDiv.innerHTML = `<h4>Credit/Debit/ATM Card Details</h4><p>Please enter your card details to proceed with the payment.</p>` + razorpayButton;
            break;
        case 'UPI Options':
            paymentDetailsDiv.innerHTML = `<h4>UPI Payment</h4><p>Pay directly from your bank account using UPI.</p>` + razorpayButton;
            break;
        case 'Net Banking':
            paymentDetailsDiv.innerHTML = `<h4>Net Banking</h4><p>Select your bank and log in to proceed with the payment.</p>` + razorpayButton;
            break;
        case 'Gift Cards & e-wallets':
            paymentDetailsDiv.innerHTML = `<h4>Gift Cards & e-wallets</h4><p>Use your gift card or e-wallet for payment.</p>` + razorpayButton;
            break;
    }
}

function selectFirstPaymentOption() {
    const firstOption = document.querySelector('.payment-option');
    if (firstOption) {
        firstOption.classList.add('selected');
        changePaymentMethod(firstOption);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    selectFirstPaymentOption();
});
