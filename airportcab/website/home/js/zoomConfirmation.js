const storedData = JSON.parse(localStorage.getItem('searchAPIPayload'))
console.log('stored_data', storedData);
const userData = JSON.parse(localStorage.getItem('userDetails'))
console.log('userData', userData);
const carData = JSON.parse(localStorage.getItem('selectedCarData'))
console.log('carData', carData);

// let bookingData = storedData.data.booking

const startsInMilliseconds = storedData.starts_epoch;
const endsInMilliseconds = storedData.ends_epoch;
const startTime = new Date(startsInMilliseconds);
const endTime = new Date(endsInMilliseconds);   

const startTimeString = startTime.toLocaleString('en-US', {
weekday: 'short',
month: 'short',
day: 'numeric',
hour: 'numeric',
minute: 'numeric',
hour12: true
});

const endTimeString = endTime.toLocaleString('en-US', {
weekday: 'short',
month: 'short',
day: 'numeric',
hour: 'numeric',
minute: 'numeric',
hour12: true
});

document.getElementById('car_name').textContent = carData.brand+" "+carData.name;
document.getElementById('car_detail').textContent = carData.accessories[0]+ " "+"|"+" "+carData.accessories[1]+ " "+"|"+" "+carData.accessories[2];
document.getElementById('currentmobile').textContent = `Mobile No. - ${userData.usermobile}`;
document.getElementById('start_time').textContent = `Pickup Time - ${startTimeString}`;
document.getElementById('end_time').textContent = `Drop off Time - ${endTimeString}`;
document.getElementById('base_fare').textContent = `Base fare ${carData.pricing.fare_breakup[0].fare_item[0].value}`;
document.getElementById('total_fare').textContent = `Total fare ${carData.pricing.fare_breakup[0].fare_item[0].value}`;


const paymentUpi = async (bookingData) => {
        console.log(bookingData);
    // let zoomUser = JSON.parse(localStorage.zoomBookingData);
    // let userData = JSON.parse(localStorage.userDetails);
       let response = bookingData.clubMember[0];
       console.log('RESPONSE', response);
       response.fare_price = 1
        const dataJ = JSON.stringify({
        "amount": response.fare_price,
        "custId": "CUST_001",
        "mobileNo": response.mobile,
        "email": response.email,
        "bookingId": response.order_reference_number, // random()
        "type": "cab",
        "pnr": response.order_reference_number, // same as bookingId
        "partnerName": "ZoomCar",
        "source_name": response.source,
        "source_city": response.source,
        "source_latitude": response.latitude,
        "source_longitude": response.longitude,
        "destination_name": "",
        "start_time": response.pickup_time,
        "cab_type": "sedan",
        "URL_open": "vistara",
        "fare_price": response.fare_price,
        "total_kilometers": 0
    });
    console.log(dataJ)
    // const rawResponse = await fetch("https://preprod.mojoboxx.com/preprod/webapi/initaiteJSPayment", {
    const rawResponse = await fetch(BaseURL+domain+"/webapi/initaiteJSPayment", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: dataJ
    });
    const content = await rawResponse.json();
    // console.log(content);
    const initaiteJSPayment = { paytmTransId: content.paytmTransId, txnToken: content.data.txnToken, totalAmount: response.fare_price, mobileNum: response.mobile}
    localStorage.setItem('initaiteJSPayment', JSON.stringify(initaiteJSPayment))
    // window.location = "paytm.html?cancelPage=Payment_booking"
    window.location = "paytmZoom.html?cancelPage=index"
}

    const zoomPayment = async () => {
        let carData = JSON.parse(localStorage.selectedCarData);
        let userData = JSON.parse(localStorage.userDetails);
        let bookingData = JSON.parse(localStorage.searchAPIPayload);
        // const final_data = {...carData,...userData}
        // let data = final_data.data.booking
        // console.log('data', data);
        const valueWithSymbol = carData.pricing.fare_breakup[0].fare_item[0].value;
        const valueWithoutSymbol = parseInt(valueWithSymbol.replace(/[^0-9]/g, ""));



       const dataR = {
            "clubMember": [
            {
            "type": "cabForm",
            "name_title": "",
            "user_name": userData.username,
            "last_name": "Customer",
            "mobile": userData.usermobile,
            "email": userData.usermail,
            "time": Date.now(),
            "sendLeadSms": "true",
            "partnerName": "ZoomCar",
            "title": 'ZoomCar',
            "category": "CAB",
            "drop_location": "",
            "pickup_time": bookingData.starts_epoch + "&" + bookingData.ends_epoch,
            "cab_type": "sedan",
            "cab_id": carData.cargroup_id,
            "fare_price": valueWithoutSymbol,
            "total_kilometers": 0,
            "terminalCode": "",
            "msgUniqueId": getRandom(10),
            "from_city": "",
            "to_city": "",
            "source": bookingData.city,
            "destination": "",
            "latitude": bookingData.lat,
            "longitude": bookingData.lng,
            "isDeparture": 1,
            "pnr": "",
            "source_city": bookingData.city,
            "source_latitude": bookingData.lat,
            "source_longitude": bookingData.lng,
            "source_name": bookingData.city,
            "destination_city": "",
            "destination_latitude": "",
            "destination_longitude": "",
            "destination_name": "",
            "status": "CAB",
            "card_type": "PartnerFare",
            "content_id": valueWithoutSymbol,
            "mojoPartner": "Yatra",
            "refer_Code": "0",
            "fixedFareId": carData.pricing.id,
            "patner_bookings": "Yatra booking",
            "carID": carData.car_id,
            "token": carData.location.location_id,
            "website_url": "Zoom_Yatra",
            "user_agent": "Android",
            "pay_type": 'post',
            'paymentMethod': 'PAYBYCASH',
            "service_charge": 0,
            'advance_amount': valueWithoutSymbol,
            "order_reference_number": "BAC" + Math.floor(10000000000 + Math.random() * 9000000000),
            // "state": stateforinvoice,
            // 'discount_type': couponcodeType,
            // 'discount_amount': couponCodeValue,
            'cab_category': "Self Drive"
        }]
    };
        console.log('json',dataR)

        const rawResponse = await fetch(BaseAPIURL + domain +"/webapi/cabRegistration", {
            method: 'POST',
            headers: {
                'Authorization': 'Basic TUAwSjBib1hYODZHIzpWVSYjKFMmI0pEIyRJWA==',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataR)
        });
    const content = await rawResponse.json();
    console.log(content);
    if(content.status == 200){
        paymentUpi(dataR)
    }
    else{
       alert("Booking Failed") 
    }
}


function bookZoom() {
    // alert("it worked");
    zoomPayment()
    
}