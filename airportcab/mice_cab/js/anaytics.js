function getRandom(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

function sendPostRequest(url, data) {
    $.ajax({
        contentType: 'application/json',
        Accept: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(response) {
            console.log("Data sent successfully", response);
        },
        error: function() {
            console.log("Data sending failed");
        },
        type: 'POST',
        url: url
    });
}

function updateAndSendAnalytics(params) {
    const analyticsData = {
        "mobile": params.contactNumber,
        "category": "cab",
        "pagename": params.pagename,
        "title": params.title,
        "type": params.type,
        "user_name": params.name,
        "last_name":  params.name,
        "source_city": '',
        "city_code": params.city_code,
        "terminal": params.terminal,
        "destination_city": params.destination_city,
        "source_lat": params.source_lat,
        "source_long": params.source_long,
        "destination_lat": params.destination_lat,
        "destination_long": params.destination_long,
        "pickup_date": params.pickup_date,
        "pickup_time": params.pickup_time,
        "cabcard_show": params.cabcard_show,
        "msgUniqueId": getRandom(10),
        "mac_address": client_unq_mac,
        "sendLeadSms": params.sendLeadSms,
        "coupon_code": params.coupon_code,
        "email_Id": params.email_Id,
        "partnername": params.partnername,
        "cabfare": params.cabfare,
        "cabtype": params.cabtype,
        "pickloc": params.pickloc
    };

    sendPostRequest('https://prodapi.mojoboxx.com/spicescreen/webapi/cab_analyticsApi', analyticsData);
}
