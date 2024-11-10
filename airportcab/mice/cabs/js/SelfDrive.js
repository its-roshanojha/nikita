function SetTimeAndDateOfSlfDrive() {
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var rdte = "";
    currDte = dateOfXDayForSelfDrive(5);
    var dte = currDte.getDate().toString().padStart(2, "0") + " " + mnth[currDte.getMonth()] + " " + currDte.getFullYear();

    rdt = dateOfXDayForSelfDrive(7);
    var rdte = rdt.getDate().toString().padStart(2, "0") + " " + mnth[rdt.getMonth()] + " " + rdt.getFullYear();

    document.getElementById("SlfDrivdatepicker").value = dte;
    document.getElementById("SlfDrivrdatepicker").value = rdte;
    document.getElementById("SlfDrivtime").innerHTML = SetTimeFormat();
    document.getElementById("SlfDrivreturntime").innerHTML = SetTimeFormat();
}

$(document).ready(function() {

    SetTimeAndDateOfSlfDrive();

    $("#SlfDrivtimepicker").click(function(event) {
        event.stopPropagation();
    });

    $("#SlfDrivreturntimepicker").click(function(event) {
        event.stopPropagation();
    });

    $("#SlfDrivshowDest").click(function(event) {
        //$("#SlfDrivshowSource").hide();
        event.stopPropagation();
    });

    $("#SlfDrivshowSource").click(function(event) {
        //  $("#SlfDrivshowDest").hide();
        event.stopPropagation();
    });

    $(".srcShowOfSlfDriv").click(function(event) {
        $("#SlfDrivshowDest").hide();
        event.stopPropagation();
    });

    $(".desShowOfSlfDriv").click(function(event) {
        $("#SlfDrivshowSource").hide();
        event.stopPropagation();
    });


    $('#a_FromSector_showSlfDrive').on('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z0-9 () ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $('#a_ToSector_showSlfDrive').on('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z0-9 () ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $(".srcShowOfSlfDriv").click(function() {
        ShowAutoSuggForSrcSlfDrive();
    });
    $(".desShowOfSlfDriv").click(function() {
        ShowAutoSuggForDesSlfDrive();
    });

    GetCountryList();
})

var getcountrylist = [];

function GetCountryList() {
    var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/getcountrylist";
    $.ajax({
        url: urlType,
        type: "GET",
        dataType: "JSON",
        success: function(res) {
            var data = res.data;
            data.forEach(element => {
                var list = {};
                list.countryCode = element.countryCode;
                list.countryName = element.countryName;
                getcountrylist.push(list);
            })

            $.ajax({
                type: "POST",
                url: urlStart + "CabSeo/ShowCountryList",
                //url: "/Cab/CabSeo/SearchDataForSource",
                data: {
                    "response": getcountrylist
                },
                success: function(data) {
                    $("#LiveIn").html(''),
                        $("#LiveIn").html(data)
                },
                error: function() {
                    $("#LiveIn").html("No Data Found")
                }
            })
        }
    })
}

function stationtimeForSrc() {
    var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/stationtime/" + $("#hdnSrchSrcStnCode").val();
    $.ajax({
        url: urlType,
        type: "GET",
        dataType: "JSON",
        success: function(res) {
            var data = res.openHoursList;
            data.forEach(element => {
                var list = {};
                list.dayNumber = element.dayNumber;
                list.countryName = element.countryName;
                list.timeEnd = element.timeEnd;
                list.validPeriodBegin = element.validPeriodBegin;
                list.validPeriodEnd = element.validPeriodEnd;
                list.afterHours = element.afterHours;
                list.schedType = element.schedType;
                list.afterHoursStatus = element.afterHoursStatus;
                stationtime.push(list);
            })

            $.ajax({
                type: "POST",
                url: urlStart + "CabSeo/ShowCountryList",
                data: {
                    "response": getcountrylist
                },
                success: function(data) {
                    $("#LiveIn").html(''),
                        $("#LiveIn").html(data)
                },
                error: function() {
                    $("#LiveIn").html("No Data Found")
                }
            })
        }
    })
}

function ShowAutoSuggForSrcSlfDrive() {
    document.getElementById('SlfDrivshowSource').style.display = "flex";
    $("#a_FromSector_showSlfDrive").focus();
    $("#SlfDrivtimepicker").hide();
    event.stopPropagation();
}

function ShowAutoSuggForDesSlfDrive() {
    document.getElementById('SlfDrivshowDest').style.display = "flex";
    $("#a_ToSector_showSlfDrive").focus();
    $("#SlfDrivtimepicker").hide();
    event.stopPropagation();
}

var SrcData = [];
var DesData = [];
var urlStart = "/Cabs/"; // /   // /Cab/

if (window.location.href.indexOf("staging") != -1) {
    urlStart = "/Cab/";
} else if (window.location.href.indexOf("localhost") != -1) {
    urlStart = "/";
}

function AddautosuggClassForSelfDrvSource() {
    if (document.getElementById("a_FromSector_showSlfDrive").value.length > 2) {
        var solr = true;

        document.getElementById("dynamicSrc").style.display = "block";
        document.getElementById("staticSrc").style.display = "none";
        var value = document.getElementById("a_FromSector_showSlfDrive").value;
        var check = document.getElementById('a_FromSector_showSlfDrive').value.length;
        if (check == 0) {
            document.getElementById("a_FromSector_showSlfDrive").placeholder = "From";
        }
        var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/location/" + value;
        if (check > 2) {
            $.ajax({
                url: urlType,
                type: "GET",
                dataType: "JSON",
                success: function(res) {
                    if (res[0].list.length != 0) {
                        var cityData = [];
                        var StationCode = [];
                        var data = res[0].list;
                        var x = 0;
                        data.forEach(element => {
                            if (x == 30) return;
                            ++x;
                            StationCode.push(element.stationCode);
                        })
                        x = 0;

                        for (var i = 0; i < StationCode.length; i++) {
                            var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/locationdetail/" + StationCode[i];
                            $.ajax({
                                url: urlType,
                                type: "GET",
                                dataType: "JSON",
                                success: function(data) {
                                    var ResponseProperties = {};
                                    ResponseProperties.showName = data.showName;
                                    ResponseProperties.stationCode = data.stationCode;
                                    ResponseProperties.stationName = data.stationName;
                                    ResponseProperties.type = data.type;
                                    ResponseProperties.city = data.city;
                                    ResponseProperties.country = data.country;
                                    ResponseProperties.countryCode = data.countryCode;
                                    ResponseProperties.address1 = data.address1;
                                    ResponseProperties.address2 = data.address2;
                                    ResponseProperties.clientCode = data.clientCode;
                                    ResponseProperties.clientName = data.clientName;
                                    ResponseProperties.distance = data.distance;
                                    ResponseProperties.email = data.email;
                                    ResponseProperties.latitude = data.latitude;
                                    ResponseProperties.longitude = data.longitude;
                                    ResponseProperties.phoneCountryCode = data.phoneCountryCode;
                                    ResponseProperties.phoneWithInternationalDialling = data.phoneWithInternationalDialling;
                                    cityData.push(ResponseProperties);
                                    SrcData = cityData;
                                }
                            })
                        }
                        $(".auto_sugg_tttl").remove();

                        $.ajax({
                            type: "POST",
                            url: urlStart + "CabSeo/ShowSourceOfSelfDriveWeb",
                            //url: "/Cab/CabSeo/SearchDataForSource",
                            data: {
                                "response": SrcData
                            },
                            success: function(data) {

                                $("#dynamicSrc").html(''),
                                    document.getElementById("staticAddressSrc").style.display = "none";
                                document.getElementById("dynamicAddressSrc").style.display = "block";

                                document.getElementById('StartCity').style.display = "block";
                                $("#dynamicSrc").html(data)
                            },
                            error: function() {
                                $("#dynamicSrc").html("No Data Found")
                            }
                        })
                    } else {
                        $("#dynamicSrc").html("No Data Found");
                    }
                }
            })
        }

    } else {
        document.getElementById("staticAddressSrc").style.display = "block";
        document.getElementById("dynamicAddressSrc").style.display = "none";

        document.getElementById("dynamicSrc").style.display = "none";
        document.getElementById("staticSrc").style.display = "block";
    }
}

function GetSelfDriveCabSection(type) {
    switch (type) {
        case '1':
            window.location.href = "https://www.easemytrip.com/cabs/";
        case '2':
            window.location.href = "https://www.easemytrip.com/cabs/";
        case '3':
            window.location.href = "https://www.easemytrip.com/cabs/";
    }
}

var x = "";

function DynamicAddressChange(elementIndex) {
    if (x != "" && x.style.display == "block") {
        {
            x.style.display = "none";
            $("#dynamicSrc").append(x);
        }
    }
    document.getElementById("DynamicAddress" + elementIndex).style.display = "block";
    x = document.getElementById("DynamicAddress" + elementIndex);
    // $("#staticAddress").html(x);


    $("#dynamicAddressSrc").html(x);
}

function DynamicAddressChangeForDes(elementIndex) {
    if (x != "" && x.style.display == "block") {
        {
            x.style.display = "none";
            $("#dynamicDes").append(x);
        }
    }
    document.getElementById("DynamicAddressForDest" + elementIndex).style.display = "block";
    x = document.getElementById("DynamicAddressForDest" + elementIndex);
    // $("#staticAddress").html(x);


    $("#dynamicAddressDest").html(x);
}

function AddautosuggClassForSelfDrvDestination() {
    if (document.getElementById("a_ToSector_showSlfDrive").value.length > 2) {
        var solr = true;

        document.getElementById("dynamicDes").style.display = "block";
        document.getElementById("staticDes").style.display = "none";
        var value = document.getElementById("a_ToSector_showSlfDrive").value;
        var check = document.getElementById('a_ToSector_showSlfDrive').value.length;
        if (check == 0) {
            document.getElementById("a_ToSector_showSlfDrive").placeholder = "To";
        }
        var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/location/" + value;
        if (check > 2) {
            $.ajax({
                url: urlType,
                type: "GET",
                dataType: "JSON",
                success: function(res) {
                    if (res[0].list.length != 0) {
                        var cityData = [];
                        var StationCode = [];
                        var data = res[0].list;
                        var x = 0;
                        data.forEach(element => {
                            if (x == 30) return;
                            ++x;
                            StationCode.push(element.stationCode);
                        })
                        x = 0;

                        for (var i = 0; i < StationCode.length; i++) {
                            var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/locationdetail/" + StationCode[i];
                            $.ajax({
                                url: urlType,
                                type: "GET",
                                dataType: "JSON",
                                success: function(data) {
                                    var ResponseProperties = {};
                                    ResponseProperties.showName = data.showName;
                                    ResponseProperties.stationCode = data.stationCode;
                                    ResponseProperties.stationName = data.stationName;
                                    ResponseProperties.type = data.type;
                                    ResponseProperties.city = data.city;
                                    ResponseProperties.country = data.country;
                                    ResponseProperties.countryCode = data.countryCode;
                                    ResponseProperties.address1 = data.address1;
                                    ResponseProperties.address2 = data.address2;
                                    ResponseProperties.clientCode = data.clientCode;
                                    ResponseProperties.clientName = data.clientName;
                                    ResponseProperties.distance = data.distance;
                                    ResponseProperties.email = data.email;
                                    ResponseProperties.latitude = data.latitude;
                                    ResponseProperties.longitude = data.longitude;
                                    ResponseProperties.phoneCountryCode = data.phoneCountryCode;
                                    ResponseProperties.phoneWithInternationalDialling = data.phoneWithInternationalDialling;
                                    cityData.push(ResponseProperties);
                                    DesData = cityData;
                                }
                            })
                        }
                        //  $(".auto_sugg_tttl").remove();
                        $.ajax({
                            type: "POST",
                            url: urlStart + "CabSeo/ShowDestOfSelfDriveWeb",
                            //url: "/Cab/CabSeo/SearchDataForSource",
                            data: {
                                "response": DesData
                            },
                            success: function(data) {

                                $("#dynamicDes").html(''),
                                    document.getElementById("staticAddressDest").style.display = "none";
                                document.getElementById("dynamicAddressDest").style.display = "block";

                                document.getElementById('EndCity').style.display = "block";
                                $("#dynamicDes").html(data)
                            },
                            error: function() {
                                $("#dynamicDes").html("No Data Found")
                            }
                        })
                    } else {
                        $("#dynamicDes").html("No Data Found");
                    }
                }
            })
        }
    } else {
        document.getElementById("staticAddressDest").style.display = "block";
        document.getElementById("dynamicAddressDest").style.display = "none";

        document.getElementById("dynamicDes").style.display = "none";
        document.getElementById("staticDes").style.display = "block";
    }
}

function titleCase(str) {
    var str = str.toLowerCase().split(',');
    var ans = "";
    for (var i = 0; i < str.length; i++) {
        var st = str[i].toLowerCase().split(' ');
        for (var j = 0; j < st.length; j++) {
            ans += st[j].charAt(0).toUpperCase() + st[j].slice(1);
            if (j != st.length - 1) ans += ' ';
        }
        ans += ',';
    }

    return ans.substring(0, ans.length - 1);
}

function DisplayNonForSrc() {
    document.getElementById("staticAddressSrc").style.display = "block";
    document.getElementById("dynamicAddressSrc").style.display = "none";
    $("#a_FromSector_showSlfDrive").val("");
    $("#dynamicSrc").hide();
    $("#staticSrc").show();
    $("#SlfDrivshowSource").hide();
}

function DisplayNonForDes() {
    document.getElementById("staticAddressDest").style.display = "block";
    document.getElementById("dynamicAddressDest").style.display = "none";
    $("#a_ToSector_showSlfDrive").val("");
    $("#dynamicDes").hide();
    $("#staticDes").show();
    $("#SlfDrivshowDest").hide();
}

function ChooseLocation(index, country, countryCode, stationCode) {
    var id = "DynamicAddress" + index;
    document.getElementById("SlfDrivsourceName").innerHTML = document.getElementById(id).querySelector(".map_hdr").innerText;
    document.getElementById("SlfDrivdestinationName").innerHTML = document.getElementById(id).querySelector(".map_hdr").innerText;
    var query = document.getElementById(id).querySelector(".mid_box").querySelectorAll(".txthdr");
    var address1 = query[0].innerText;
    var address2 = query[1].innerText;
    var country = query[2].innerText;
    var address = (address1 != "" ? (address1 + ",") : "") + (address2 != "" ? (address2 + ",") : "") + (country != "" ? (country) : "");
    document.getElementById("SlfDrivsourceAddress").innerText = titleCase(address);
    document.getElementById("SlfDrivdestinationAddress").innerText = titleCase(address);

    $("#hdnSrchSrcCntry").val(country.toUpperCase());
    $("#hdnSrchDesCntry").val(country.toUpperCase());

    $("#hdnSrchSrcCntryCode").val(countryCode.toUpperCase());
    $("#hdnSrchDesCntryCode").val(countryCode.toUpperCase());
    DisplayNonForSrc();
}

function ChooseLocationForDest(index, country, countryCode, stationCode) {
    var id = "DynamicAddressForDest" + index;
    document.getElementById("SlfDrivdestinationName").innerHTML = document.getElementById(id).querySelector(".map_hdr").innerText;
    var query = document.getElementById(id).querySelector(".mid_box").querySelectorAll(".txthdr");
    var address1 = query[0].innerText;
    var address2 = query[1].innerText;
    var country = query[2].innerText;
    var address = (address1 != "" ? (address1 + ",") : "") + (address2 != "" ? (address2 + ",") : "") + (country != "" ? (country) : "");
    document.getElementById("SlfDrivdestinationAddress").innerText = titleCase(address);
    $("#hdnSrchDesCntry").val(country.toUpperCase());
    $("#hdnSrchDesCntryCode").val(countryCode.toUpperCase());
    DisplayNonForDes();
}

function ChooseSourceName(index, country, countryCode, stationCode) {
    var id = "dynamicName" + index;
    document.getElementById("SlfDrivsourceName").innerText = titleCase(document.getElementById(id).querySelectorAll(".auto_sugg_tttl")[0].innerText).trim();
    document.getElementById("SlfDrivdestinationName").innerText = titleCase(document.getElementById(id).querySelectorAll(".auto_sugg_tttl")[0].innerText).trim();
    id = "DynamicAddress" + index;
    var query = document.getElementById(id).querySelector(".mid_box").querySelectorAll(".txthdr");
    var address1 = query[0].innerText;
    var address2 = query[1].innerText;
    var country = query[2].innerText;
    var address = (address1 != "" ? (address1 + ",") : "") + (address2 != "" ? (address2 + ",") : "") + (country != "" ? (country) : "");

    document.getElementById("SlfDrivsourceAddress").innerText = titleCase(address);
    document.getElementById("SlfDrivdestinationAddress").innerText = titleCase(address);
    document.getElementById("staticAddressSrc").style.display = "block";
    document.getElementById("dynamicAddressSrc").style.display = "none";

    $("#hdnSrchSrcCntry").val(country.toUpperCase());
    $("#hdnSrchDesCntry").val(country.toUpperCase());

    $("#hdnSrchSrcCntryCode").val(countryCode.toUpperCase());
    $("#hdnSrchDesCntryCode").val(countryCode.toUpperCase());

    $("#hdnSrchDesStnCode").val(stationCode);
    $("#hdnSrchSrcStnCode").val(stationCode);

    DisplayNonForSrc();
}

function ChooseDestName(index, country, countryCode, stationCode) {
    var id = "dynamicNameForDes" + index;
    document.getElementById("SlfDrivdestinationName").innerText = titleCase(document.getElementById(id).querySelectorAll(".auto_sugg_tttl")[0].innerText).trim();

    id = "DynamicAddressForDest" + index;
    var query = document.getElementById(id).querySelector(".mid_box").querySelectorAll(".txthdr");
    var address1 = query[0].innerText;
    var address2 = query[1].innerText;
    var country = query[2].innerText;
    var address = (address1 != "" ? (address1 + ",") : "") + (address2 != "" ? (address2 + ",") : "") + (country != "" ? (country) : "");

    document.getElementById("SlfDrivdestinationAddress").innerText = titleCase(address);
    document.getElementById("staticAddressDest").style.display = "block";
    document.getElementById("dynamicAddressDest").style.display = "none";

    $("#hdnSrchDesCntry").val(country.toUpperCase());
    $("#hdnSrchDesCntryCode").val(countryCode.toUpperCase());
    $("#hdnSrchDesStnCode").val(stationCode);
    DisplayNonForDes();
}

function RedirectionOfPopularCabs(from, fromcode, country, countrycode) {
    let isOk = true;
    var currentdate = new Date();
    currentdate.setDate(currentdate.getDate() + 1);
    var traveldate = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentdate.getDate()).slice(-2) + "T08:00:00";
    currentdate.setDate(currentdate.getDate() + 1);
    var rdates = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentdate.getDate()).slice(-2) + "T08:00:00";
    var urls = "https://transfer.easemytrip.com/drivelist?psc=" + fromcode + "&dsc=" + fromcode + "&pdt=" + traveldate + "&ddt=" + rdates + "&age=" + 26 + "&pcn=" + country + "&pcc=" + countrycode + "&dcn=" + country + "&dcc=" + countrycode + "&residence=" + 'IN';

    if (isOk) {
        window.location.href = urls;
    } else {
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.errList = [];
            });
        }, 3000);

    }

}

function GetAmPm() {
    let date = "";

    if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked")) {
        date = new Date(Date.now() + 2 * (60 * 60 * 1000));
    }
    if ($("#rdbTravelTypeAirport").prop("checked")) {
        date = new Date(Date.now() + (45 * 60 * 1000));
    }
    // It will give 6 hr additional time than curr time
    var hr = Number(date.toTimeString().split(':')[0]) % 12;
    var min = Number(date.toTimeString().split(':')[1]);
    min = (min <= 9 ? ('0' + min) : min);
    hr = hr ? (hr <= 9 ? ('0' + hr) : hr) : 12;
    var ap = date.getHours() < 12 ? 'AM' : 'PM';
    return ap;
}

function SetTimeFormat() {
    var date = "";
    if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked") || $("#rdbTravelTypeSelf").prop("checked")) {
        date = new Date(Date.now() + 2 * (60 * 60 * 1000) + (15 * 60 * 1000));
    }
    if ($("#rdbTravelTypeAirport").prop("checked")) {
        date = new Date(Date.now() + (45 * 60 * 1000));
    }
    // It will give 6 hr additional time than curr time
    var hr = Number(date.getHours()) % 12;
    var min = Number(date.getMinutes());
    min = (min <= 9 ? ('0' + min) : min);
    hr = hr ? (hr <= 9 ? ('0' + hr) : hr) : 12;
    var ap = date.getHours() < 12 ? 'AM' : 'PM';
    var time = hr + ":" + min + " " + ap;
    return time;
}

function SlfDrvDone() {
    const ul = document.getElementById("SlfDrivhr").querySelectorAll('ul li');
    var hr = "";
    var min = "";
    var meridiem = "";
    var flaghr = true;
    var flagmin = true;
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            hr = Number(ul[i].innerHTML.split(" ")[0]);
            if (hr <= 9) {
                hr = "0" + hr;
            }
        }
    }

    const ulMin = document.getElementById("SlfDrivmin").querySelectorAll('ul li');
    for (var i = 0; i < ulMin.length; i++) {
        if (ulMin[i].classList.contains("actvtab")) {
            min = ulMin[i].innerHTML.split(" ")[0];

        }
    }

    // Nitin Buddy this line is for reference to know how you did this 
    //const ul = document.getElementsByClassName("radio-toolbar"); ul[0].childNodes;

    //const ul = document.getElementsByClassName("radio-toolbar");

    if (document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").checked) {
        meridiem = document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").value;
    } else {
        // ul[0].childNodes[3].querySelector("input").checked;  else if
        meridiem = document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").value;
    }

    // Nitin Buddy this is the alternative easy method to check
    //const cb = document.querySelector('#am');
    //console.log(cb.checked);


    var time = hr + ":" + min + " " + meridiem;
    if (hr != "" && min != "") {
        document.getElementById("SlfDrivtime").innerHTML = time;
        document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML = hr + ":" + min + " ";
    }
    $("#SlfDrivtimepicker").hide();
    event.stopPropagation();
}

function SlfDrvReturnDone() {
    const ul = document.getElementById("SlfDrivrhr").querySelectorAll('ul li');
    var hr = "";
    var min = "";
    var meridiem = "";
    var flaghr = true;
    var flagmin = true;
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            hr = Number(ul[i].innerHTML.split(" ")[0]);
            if (hr <= 9) {
                hr = "0" + hr;
            }
        }
    }

    const ulMin = document.getElementById("SlfDrivrmin").querySelectorAll('ul li');
    for (var i = 0; i < ulMin.length; i++) {
        if (ulMin[i].classList.contains("actvtab")) {
            min = ulMin[i].innerHTML.split(" ")[0];

        }
    }

    // Nitin Buddy this line is for reference to know how you did this 
    //const ul = document.getElementsByClassName("radio-toolbar"); ul[0].childNodes;

    //const ul = document.getElementsByClassName("radio-toolbar");

    if (document.querySelector("#SlfDrivReturnrap").childNodes[1].querySelector("input").checked) {
        meridiem = document.querySelector("#SlfDrivReturnrap").childNodes[1].querySelector("input").value;
    } else {
        // ul[0].childNodes[3].querySelector("input").checked;  else if
        meridiem = document.querySelector("#SlfDrivReturnrap").childNodes[3].querySelector("input").value;
    }

    // Nitin Buddy this is the alternative easy method to check
    //const cb = document.querySelector('#am');
    //console.log(cb.checked);


    var time = hr + ":" + min + " " + meridiem;
    if (hr != "" && min != "") {
        document.getElementById("SlfDrivreturntime").innerHTML = time;
        document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML = hr + ":" + min + " ";
    }
    $("#SlfDrivreturntimepicker").hide();
    event.stopPropagation();
}

var dateOfXDayForSelfDrive = (xDay) => {
    var currDateSelected = new Date();
    var currDte = new Date(currDateSelected.getFullYear(), currDateSelected.getMonth(), currDateSelected.getDate());
    currDte.setDate(currDte.getDate() + xDay);
    return currDte;
};

var IsReturn = false;
var SourceSwapId = 1;
var DestSwapId = 2;

function SwapSelfDrive() {
    var x = SourceSwapId;
    var y = DestSwapId;
    SourceSwapId = y;
    DestSwapId = x;
    var src = document.getElementById("SlfDrivsourceName").innerText;
    var des = document.getElementById("SlfDrivdestinationName").innerText;
    var sourceAddress = document.getElementById("SlfDrivsourceAddress").innerText;
    var destinationAddress = document.getElementById("SlfDrivdestinationAddress").innerText;
    var srcIdForMapping = $("#hdnSearchIdForSrc").val();
    var destIdForMapping = $("#hdnSearchIdForDest").val();
    $("#hdnSearchIdForSrc").val(destIdForMapping);
    $("#hdnSearchIdForDest").val(srcIdForMapping);
    document.getElementById("SlfDrivsourceName").innerText = des;
    document.getElementById("SlfDrivsourceAddress").innerText = destinationAddress;
    document.getElementById("SlfDrivdestinationName").innerText = src;
    document.getElementById("SlfDrivdestinationAddress").innerText = sourceAddress;
}

function ReturnDate() {
    document.getElementById("rtag").style.display = "none";
    document.getElementById("SlfDrivreturndateTime").style.display = "block";
    document.getElementById("rclandr").style.display = "none";
    document.getElementById("round").style.display = "block";

    var today = new Date();
    var todayDate = today.getDate();

    var currDateSelected = $("#SlfDrivdatepicker").val().split(" ");
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mnthIndx = 0;
    for (var i = 0; i < i < mnth.length; i++) {
        if (mnth[i] == currDateSelected[1]) {
            mnthIndx = i;
            break;
        }
    }
    var currDte = new Date(currDateSelected[2], mnthIndx, currDateSelected[0]);
    currDte.setDate((currDte.getDate() - todayDate) + 1);
    var rdte = currDte.getDate().toString().padStart(2, "0") + " " + mnth[currDte.getMonth()] + " " + currDte.getFullYear();
    document.getElementById("SlfDrivrdatepicker").value = rdte;
    IsReturn = true;
}

function SetTimeVaidationForReturn() {

    const ul = document.getElementById("SlfDrivrhr").querySelectorAll('ul li');

    //--------  From here the case start for current date for which we have to disable hr less than current hr -----------//
    var validMinHr = $("#StartTime").val().split(":")[0];
    validMinHr = validMinHr ? (Number(validMinHr) <= 9 ? ('0' + Number(validMinHr)) : validMinHr) : 12;
    var MinHrAP = Number(startTime.split(":")[0]) >= 12 ? "PM" : "AM";

    var validMaxHr = Number($("#EndTime").val().split(":")[0]); // This is the max hr we are getting from API for selected route
    validMaxHr = validMaxHr ? (Number(validMaxHr) <= 9 ? ('0' + Number(validMaxHr)) : validMaxHr) : 12;
    var MaxHrAP = Number(endTime.split(":")[0]) >= 12 ? "PM" : "AM";

    var checkedMeredian = "";
    if (document.querySelector("#SlfDrivReturnrap").childNodes[3].querySelector("input").checked) {
        checkedMeredian = document.querySelector("#SlfDrivReturnrap").childNodes[3].querySelector("input").value;
    } else {
        checkedMeredian = document.querySelector("#SlfDrivReturnrap").childNodes[1].querySelector("input").value;
    }

    // In This iteration we are first removing blur effect if it is added
    for (var i = 0; i < ul.length; i++) {
        ul[i].classList.remove("blurHr");
    }

    var flag = false; // This is to check if no hr is selected or marked blue 
    for (var i = 0; i < ul.length; i++) {
        if (Number(document.getElementById("SlfDrivrhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) < Number(validMinHr) && checkedMeredian == MinHrAP) {
            ul[i].classList.add("blurHr");
            if (ul[i].classList.contains("actvtab")) flag = true;
            ul[i].classList.remove("actvtab");
        }
        if (Number(document.getElementById("SlfDrivrhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) > Number(validMaxHr) && checkedMeredian == MinHrAP) {
            ul[i].classList.add("blurHr");
            if (ul[i].classList.contains("actvtab")) flag = true;
            ul[i].classList.remove("actvtab");
        }
    }

    if (flag) { // if no hr is selected or marked blue then we will show the valid hr which is in between given minimum and max hr on respective meredian

        const ulMin = document.getElementById("SlfDrivrmin").querySelectorAll('ul li');
        var min = "";
        for (var i = 0; i < ulMin.length; i++) {
            if (ulMin[i].classList.contains("actvtab")) {
                min = ulMin[i].innerText.split(" ")[0];
                break;
            }
        }

        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("blurHr") == false) {
                ul[i].classList.add("actvtab");
                var hr = Number(ul[i].innerText.split(" ")[0]);
                hr = Number(ul[i].innerText.split(" ")[0]) <= 9 ? '0' + hr : hr;
                $("#SlfDrivrtimec").children("span").text(hr + ":" + min);
                break;
            }
        }
    }

    //--------  From here the case end for current date for which we have to disable hr less than current hr -----------//
}

function ReturnHour(id) {

    if ($("#rdbTravelTypeSelf").prop("checked")) {
        const ul = document.getElementById("SlfDrivrhr").querySelectorAll('ul li');
        var hr = "";
        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("actvtab")) {
                ul[i].classList.remove("actvtab");
            }
        }
        ul[id - 1].classList.add("actvtab");
        hr = ul[id - 1].innerHTML.split(" ")[0];
        var time = $("#SlfDrivrtimec").children("span").text().split(":");

        if (Number(hr) <= 9) {
            hr = '0' + hr;
        }
        $("#SlfDrivrtimec").children("span").text(hr + ":" + time[1]);

    } else {
        const ul = document.getElementById("rhr").querySelectorAll('ul li');
        var hr = "";
        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("actvtab")) {
                ul[i].classList.remove("actvtab");
            }
        }
        ul[id - 1].classList.add("actvtab");
        hr = ul[id - 1].innerHTML.split(" ")[0];
        var time = $("#rtimec").children("span").text().split(":");

        if (Number(hr) <= 9) {
            hr = '0' + hr;
        }
        $("#rtimec").children("span").text(hr + ":" + time[1]);
    }
    event.stopPropagation();
}

function Returnmin(id) {
    if ($("#rdbTravelTypeSelf").prop("checked")) {
        const ul = document.getElementById("SlfDrivrmin").querySelectorAll('ul li');
        var min = "";
        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("actvtab"))
                ul[i].classList.remove("actvtab");
        }
        ul[id - 1].classList.add("actvtab");

        min = ul[id - 1].innerHTML.split(" ")[0];
        var time = $("#SlfDrivrtimec").children("span").text().split(":");
        $("#SlfDrivrtimec").children("span").text(time[0] + ":" + min);
    } else {
        const ul = document.getElementById("rmin").querySelectorAll('ul li');
        var min = "";
        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("actvtab"))
                ul[i].classList.remove("actvtab");
        }
        ul[id - 1].classList.add("actvtab");

        min = ul[id - 1].innerHTML.split(" ")[0];
        var time = $("#rtimec").children("span").text().split(":");
        $("#rtimec").children("span").text(time[0] + ":" + min);
    }
    event.stopPropagation();
}

function CheckIfSourceIsCurrDte() {
    var userDate = $("#SlfDrivdatepicker").val().split(" ");
    var i = 0;
    var mnthIndex = 0;
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    mnth.forEach((x) => {
        if (x == userDate[1]) {
            mnthIndex = i;
        }
        i++;
    });
    var userDt = new Date(userDate[2], mnthIndex, userDate[0]);
    var currDte = new Date();
    return (userDate[2] == currDte.getFullYear() && userDate[0] == currDte.getDate() && mnthIndex == currDte.getMonth()) ? true : false;
}

function SelfDriveAm() {

    document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").checked = true;
    document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked = false;
    if (CheckIfSourceIsCurrDte()) {
        SelectedDateIsCurrentDte();
    } else {
        SetTimeValidationForPick();
    }
    event.stopPropagation();
}

function SelfDrivePm() {
    document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").checked = false;
    document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked = true;
    if (CheckIfSourceIsCurrDte()) {
        SelectedDateIsCurrentDte();
    } else {
        SetTimeValidationForPick();
    }
    event.stopPropagation();
}

function SetreturnAm() {
    if ($("#rdbTravelTypeOther").prop("checked")) {
        document.querySelector("#rap").childNodes[1].querySelector("input").checked = true;
        document.querySelector("#rap").childNodes[3].querySelector("input").checked = false;
        if (document.querySelector("#rap").childNodes[1].querySelector("label").classList.contains("_gry")) { // it will be mark selected only if it is not blur
            document.querySelector("#rap").childNodes[1].querySelector("input").checked = false;
            document.querySelector("#rap").childNodes[3].querySelector("input").checked = true;
        }
        event.stopPropagation();
    } else {
        document.querySelector("#SlfDrivReturnrap").childNodes[1].querySelector("input").checked = true;
        document.querySelector("#SlfDrivReturnrap").childNodes[3].querySelector("input").checked = false;
        SetTimeVaidationForReturn();
    }
    event.stopPropagation();
}

function SetreturnPm() {
    if ($("#rdbTravelTypeOther").prop("checked")) {
        document.querySelector("#rap").childNodes[1].querySelector("input").checked = false;
        document.querySelector("#rap").childNodes[3].querySelector("input").checked = true;
    } else {
        document.querySelector("#SlfDrivReturnrap").childNodes[1].querySelector("input").checked = false;
        document.querySelector("#SlfDrivReturnrap").childNodes[3].querySelector("input").checked = true;
        SetTimeVaidationForReturn();
    }
    event.stopPropagation();
}

function ReturnDate() {
    document.getElementById("rtag").style.display = "none";
    document.getElementById("SlfDrivreturndateTime").style.display = "block";
    document.getElementById("rclandr").style.display = "none";
    document.getElementById("round").style.display = "block";
    var currDateSelected = $("#SlfDrivdatepicker").val().split(" ");
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mnthIndx = 0;
    for (var i = 0; i < i < mnth.length; i++) {
        if (mnth[i] == currDateSelected[1]) {
            mnthIndx = i;
            break;
        }
    }
    var currDte = new Date(currDateSelected[2], mnthIndx, currDateSelected[0]);
    currDte.setDate(currDte.getDate() + 1);
    var rdte = currDte.getDate().toString().padStart(2, "0") + " " + mnth[currDte.getMonth()] + " " + currDte.getFullYear();
    document.getElementById("SlfDrivrdatepicker").value = rdte;
    IsReturn = true;
    event.stopPropagation();
}

function RentFor(id) {
    const ul = document.getElementById("addclsForRent").querySelectorAll('ul li');
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            ul[i].classList.remove("actvtab");
        }
    }
    ul[id].classList.add("actvtab");
    document.getElementById("guestroom").innerHTML = (Number(ul[id].innerText.split(" ")[0]) <= 9 ? ('0' + ul[id].innerText.split(" ")[0]) : (ul[id].innerText.split(" ")[0]));
    $("#hrforRent").toggle();
}

function SelfDriveSearch() {
    var isOk = true;
    var PickUpdate = document.getElementById("SlfDrivdatepicker").value;
    var PickUptime = document.getElementById("SlfDrivtime").innerHTML;

    var ftime = "";
    var time = PickUptime.split(' ');
    if (time[1] == "AM") {
        var t = time[0].split(':');
        if (time[1] == "AM" && t[0] == "12") {
            ftime = "00:" + t[1] + ":00";
        } else {
            ftime = time[0] + ":00";
        }

    } else {
        var t1 = time[0].split(':');
        if (t1[0] == "12") {
            ftime = time[0] + ":00";
        } else {
            var ft = parseInt(t1[0]) + 12;
            ftime = ft + ":" + t1[1] + ":00";
        }

    }

    var fdate = "";
    var date1 = PickUpdate.split(" ");

    var selectedDateArray = PickUpdate.split(" ");
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var indexOfmonth = 0;
    for (var x of mnth) {
        if (x == selectedDateArray[1]) {
            selectedDateArray[1] = (indexOfmonth <= 9 ? ('0' + indexOfmonth) : indexOfmonth);
            break;
        }
        indexOfmonth++;
    }
    indexOfmonth++;

    date1[1] = (indexOfmonth <= 9 ? ('0' + indexOfmonth) : indexOfmonth);
    var y = date1[2];
    var m = date1[1];
    var d = date1[0];
    fdate = y + "-" + m + "-" + d;
    var dates = fdate + "T" + ftime;

    var ComeBackdate = document.getElementById('SlfDrivrdatepicker').value;
    var ComeBacktime = document.getElementById('SlfDrivreturntime').innerHTML;

    var ttime = "";
    var ctime = ComeBacktime.split(' ');
    if (ctime[1] == "AM") {
        var ct = ctime[0].split(':');
        if (ctime[1] == "AM" && ct[0] == "12") {
            ttime = "00:" + ct[1] + ":00";
        } else {
            ttime = ctime[0] + ":00";
        }

    } else {
        var ct1 = ctime[0].split(':');
        if (ct1[0] == "12") {
            ttime = ctime[0] + ":00";
        } else {
            var cbt = parseInt(ct1[0]) + 12;
            ttime = cbt + ":" + ct1[1] + ":00";
        }

    }

    var cdate = "";
    var cdate1 = ComeBackdate.split(' ');

    var mnt = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var indexOfrmonth = 0;
    for (var x of mnt) {
        if (x == cdate1[1]) {
            cdate1[1] = (indexOfrmonth <= 9 ? ('0' + indexOfrmonth) : indexOfrmonth);
            break;
        }
        indexOfrmonth++;
    }
    indexOfrmonth++;
    indexOfrmonth = (indexOfrmonth <= 9 ? ('0' + indexOfrmonth) : indexOfrmonth);
    cdate1[1] = indexOfrmonth;
    var y1 = cdate1[2];
    var m1 = cdate1[1];
    var d1 = cdate1[0];
    cdate = y1 + "-" + m1 + "-" + d1;
    var cdates = cdate + "T" + ttime;
    // var age = $('#age :selected').text().split(" ")[0];
    var SrcStnCode = $("#hdnSrchSrcStnCode").val();
    var DesStnCode = $("#hdnSrchDesStnCode").val();
    var age = $("#age").val();
    var SrcCntry = $("#hdnSrchSrcCntry").val();
    var DesCntry = $("#hdnSrchDesCntry").val();
    var SrcCntryCode = $("#hdnSrchSrcCntryCode").val();
    var DesCntryCode = $("#hdnSrchDesCntryCode").val();
    var ResidenceCntryCode = $("#LiveIn").val();

    // ----------- Error Handling Starts Here --------------//

    if ($("#LiveIn").val() == "Select") {
        isOk = false;
        document.getElementById("LiveInErrBx").style.display = "block";
        document.getElementById("LiveInErrBxMessge").innerHTML = "Select Live In Country";
    }

    // ----------- Error Handling End Here -----------------//

    if (isOk) {
        var url = window.location.href.indexOf("uat") == -1 ? (window.location.href.indexOf("csc") == -1 ? "https://transfer.easemytrip.com/drivelist?psc=" : "https://csctransfer.easemytrip.com/drivelist?psc=") + SrcStnCode + "&dsc=" + DesStnCode + "&pdt=" + dates + "&ddt=" + cdates + "&age=" + age + "&pcn=" + SrcCntry + "&pcc=" + SrcCntryCode + "&dcn=" + DesCntry + "&dcc=" + DesCntryCode + "&residence=" + ResidenceCntryCode :
            "https://uat-transfer.easemytrip.com/drivelist?psc=" + SrcStnCode + "&dsc=" + DesStnCode + "&pdt=" + dates + "&ddt=" + cdates + "&age=" + age + "&pcn=" + SrcCntry + "&pcc=" + SrcCntryCode + "&dcn=" + DesCntry + "&dcc=" + DesCntryCode + "&residence=" + ResidenceCntryCode;
        window.location.href = url;
    } else {
        setTimeout(() => {
            var error = document.getElementsByClassName("errorboxForSlfDrv");
            for (var i = 0; i < error.length; i++) {
                error[i].style.display = 'none';
                document.getElementsByClassName("errorboxForSlfDrv")[0].childNodes[1].innerHTML = "";
            }
        }, 3000);
    }
}

function SelectedDateIsCurrentDte() {

    // This is the case of when date selected is current date 

    var validMinHr = Number(startTime.split(":")[0]) % 12; // This is the minimum hr we are getting from API for selected route
    validMinHr = validMinHr ? (validMinHr <= 9 ? ('0' + validMinHr) : validMinHr) : 12;
    var min = (Number(startTime.split(":")[1]) <= 9 ? ('0' + Number(startTime.split(":")[1])) : Number(startTime.split(":")[1])); // This is the minimum min we are getting from API for selected route
    var ap = Number(validMinHr) < 12 ? 'AM' : 'PM';
    var APIMinTime = validMinHr + ":" + min;

    var validMaxHr = Number($("#EndTime").val().split(":")[0]); // This is the max hr we are getting from API for selected route
    validMaxHr = validMaxHr ? (Number(validMaxHr) <= 9 ? ('0' + Number(validMaxHr)) : validMaxHr) : 12;
    var MaxHrAP = Number(endTime.split(":")[0]) >= 12 ? "PM" : "AM";

    const ul = document.getElementById("SlfDrivhr").querySelectorAll('ul li');

    if ($("#SlfDrivdatepicker").val() == CurrentDate() && CheckTimeValidityForCurrDate(APIMinTime)) {
        date = new Date(Date.now()); // here is the case we are disabling hr less then curr hr
        var hr = Number(date.toTimeString().split(':')[0]);
        var min = Number(date.toTimeString().split(':')[1]);
        min = (min <= 9 ? ('0' + min) : min);
        var Minhr = hr <= 9 ? ('0' + hr) : (hr % 12 == 0 ? 12 : hr % 12); // here we got hour
        var ap = date.getHours() < 12 ? 'AM' : 'PM';

        //if (ap == 'AM') {
        //    document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").checked = true;
        //    document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked = false;
        //}
        //else {
        //    document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").checked = false;
        //    document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked = true;
        //}

        if (document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked && ap == 'AM') {

            const ul = document.getElementById("SlfDrivhr").querySelectorAll('ul li');

            for (var i = 0; i < ul.length; i++) {
                ul[i].classList.remove("blurHr");
            }
        } else {
            for (var i = 0; i < ul.length; i++) {
                ul[i].classList.remove("actvtab");
                if (Minhr != "" && Number(document.getElementById("SlfDrivhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) < Number(Minhr)) {
                    ul[i].classList.add("blurHr");
                }
                if (Number(document.getElementById("SlfDrivhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) > Number(validMaxHr)) {
                    ul[i].classList.add("blurHr");
                }
            }
        }

        document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML = Minhr + ":" + min;
        ul[Number(Minhr) - 1].classList.add("actvtab");
    }



}

function SetTimeValidationForPick() {

    const ul = document.getElementById("SlfDrivhr").querySelectorAll('ul li');

    //--------  From here the case start for current date for which we have to disable hr less than current hr -----------//
    var validMinHr = $("#StartTime").val().split(":")[0];
    validMinHr = validMinHr ? (Number(validMinHr) <= 9 ? ('0' + Number(validMinHr)) : validMinHr) : 12;
    var MinHrAP = Number(startTime.split(":")[0]) >= 12 ? "PM" : "AM";

    var validMaxHr = Number($("#EndTime").val().split(":")[0]); // This is the max hr we are getting from API for selected route
    validMaxHr = validMaxHr ? (Number(validMaxHr) <= 9 ? ('0' + Number(validMaxHr)) : validMaxHr) : 12;
    var MaxHrAP = Number(endTime.split(":")[0]) >= 12 ? "PM" : "AM";

    var checkedMeredian = "";
    if (document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").checked) {
        checkedMeredian = document.querySelector("#SlfDrivap").childNodes[3].querySelector("input").value;
    } else {
        checkedMeredian = document.querySelector("#SlfDrivap").childNodes[1].querySelector("input").value;
    }

    // In This iteration we are first removing blur effect if it is added
    for (var i = 0; i < ul.length; i++) {
        ul[i].classList.remove("blurHr");
    }

    var flag = false; // This is to check if no hr is selected or marked blue 

    for (var i = 0; i < ul.length; i++) {
        if (Number(document.getElementById("SlfDrivhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) < Number(validMinHr) && checkedMeredian == MinHrAP) {
            ul[i].classList.add("blurHr");
            if (ul[i].classList.contains("actvtab")) flag = true;
            ul[i].classList.remove("actvtab");
        }
        if (Number(document.getElementById("SlfDrivhr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) > Number(validMaxHr) && checkedMeredian == MinHrAP) {
            ul[i].classList.add("blurHr");
            if (ul[i].classList.contains("actvtab")) flag = true;
            ul[i].classList.remove("actvtab");
        }
    }

    if (flag) { // if no hr is selected or marked blue then we will show the valid hr which is in between given minimum and max hr on respective meredian

        const ulMin = document.getElementById("SlfDrivmin").querySelectorAll('ul li');
        var min = "";
        for (var i = 0; i < ulMin.length; i++) {
            if (ulMin[i].classList.contains("actvtab")) {
                min = ulMin[i].innerText.split(" ")[0];
                break;
            }
        }

        for (var i = 0; i < ul.length; i++) {
            if (ul[i].classList.contains("blurHr") == false) {
                ul[i].classList.add("actvtab");
                var hr = Number(ul[i].innerText.split(" ")[0]);
                hr = Number(ul[i].innerText.split(" ")[0]) <= 9 ? '0' + hr : hr;
                $("#SlfDrivtimec").children("span").text(hr + ":" + min);
                break;
            }
        }
    }

    //--------  From here the case end for current date for which we have to disable hr less than current hr -----------//

}

function SelfHour(id) {
    const ul = document.getElementById("SlfDrivhr").querySelectorAll('ul li');
    var hr = "";
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            ul[i].classList.remove("actvtab");
        }
    }
    ul[id - 1].classList.add("actvtab");
    hr = ul[id - 1].innerHTML.split(" ")[0];
    var time = document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML.split(":");

    if (Number(hr) <= 9) {
        hr = '0' + hr;
    }
    document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML = hr + ":" + time[1];

    // SetTimeValidationForPick(id);

    event.stopPropagation();
}

function Selfmin(id) {
    const ul = document.getElementById("SlfDrivmin").querySelectorAll('ul li');
    var min = "";
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab"))
            ul[i].classList.remove("actvtab");
    }
    ul[id - 1].classList.add("actvtab");

    min = ul[id - 1].innerHTML.split(" ")[0];
    var time = document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML.split(":");
    document.getElementsByClassName("SlfDrivtimec")[0].childNodes[1].innerHTML = time[0] + ":" + min;
    event.stopPropagation();
}

function SelectCountry(id) {
    if (id != "Select") {
        var val = document.getElementById("LiveIn")[Number(id)].value;
        $("#ResidenceCntryCode").val(val);
        document.getElementById("LiveInErrBx").style.display = "none";
    } else {
        $("#ResidenceCntryCode").val("");
    }
}

function Select() {
    if ($("#LiveIn").val() != "Select") {
        document.getElementById("LiveInErrBx").style.display = "none";
    }

}

function CloseSelfDriveSearch() {
    DisplayNonForSrc();
    DisplayNonForDes();
}

function SelectStaticSrcOfSlfDrive() {
    $("#hdnSrchSrcStnCode").val("FRCDGT01");
    $("#hdnSrchDesStnCode").val("FRCDGT01");
    document.getElementById('SlfDrivsourceName').innerText = 'Paris Roissy CDG Airport T1';
    document.getElementById('SlfDrivdestinationName').innerText = 'Paris Roissy CDG Airport T1';
    document.getElementById('SlfDrivsourceAddress').innerText = 'Charles De Gaulle Apt Terminal 1, Niveau Arrivee Porte 26, France';
    document.getElementById('SlfDrivdestinationAddress').innerText = 'Charles De Gaulle Apt Terminal 1, Niveau Arrivee Porte 26, France';
    DisplayNonForSrc();
    DisplayNonForDes();
}

function SelectStaticDesOfSlfDrive() {
    $("#hdnSrchSrcStnCode").val("FRCDGT01");
    document.getElementById('SlfDrivdestinationName').innerText = 'Paris Roissy CDG Airport T1';
    document.getElementById('SlfDrivdestinationAddress').innerText = 'Charles De Gaulle Apt Terminal 1, Niveau Arrivee Porte 26, France';
    DisplayNonForDes();
}

$(document).on("click", function(event) {
    SlfDrvDone();
    SlfDrvReturnDone();

    $("#SlfDrivtimepicker").hide();

    $("#SlfDrivtimePicker").click(function(event) {
        event.stopPropagation();
    });


    $("#SlfDrivreturntimepicker").hide();

    $("#SlfDrivshowtime").click(function(event) {

        event.stopPropagation();
    });

    $("#SlfDrivshowreturnTime").click(function(event) {

        event.stopPropagation();
    });

    $("#SlfDrivshowSource").hide();
    DisplayNonForSrc();

    $("#SlfDrivshowDest").hide();
    DisplayNonForDes();
    //$("#rdatepicker").datepicker({

    //    minDate: GetMinimumDate(),
    //    dateFormat: 'dd M yy',
    //    // minDate: new Date('06-01-2023'),
    //    beforeShowDay: function (date) {
    //        $("#ui-datepicker-div").show();
    //        GetdatesBeforePickDate();
    //        // ff();
    //        //$(".ui-datepicker-prev").addClass("ui-state-disabled");
    //        var string = jQuery.datepicker.formatDate('dd M yy', date);
    //        return [dates.indexOf(string) == -1]
    //    },
    //    onSelect: function (dates, event) {
    //        //ff();
    //        $("#rdatepicker").datepicker();
    //        SetReturnTime(dates);

    //    }
    //});

    /*var MinMonthStart = "";*/

    // minDate: new Date(MinMonthStart),
    //function GetMinimumDate() {
    //    var dropUpDate = document.getElementById("datepicker").value.split(' ');
    //    var d = dropUpDate[0]; var m = dropUpDate[1]; var yr = dropUpDate[2];
    //    var currMnthIndex = 0;
    //    for (var j = 0; j < mnth.length; j++) {
    //        if (mnth[j] == m)
    //            currMnthIndex = ((j + 1) <= 9 ? '0' + (j + 1) : (j + 1));
    //    }
    //    var dtefrmt = currMnthIndex + "-" + d + "-" + yr;
    //    var dt = new Date(dtefrmt);
    //    dt.setDate(dt.getDate());

    //    //var MinMonthStart = new Date(dt.getFullYear(), dt.getMonth(), 1); // here we are getting first day '07-01-2023'
    //    var MinMonthStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    //    //let date = new Date();
    //    //let y = date.getFullYear();
    //    //let m = date.getMonth();
    //    //let d = date.getDate() + 5;
    //    //var x = new Date(y, m, d);
    //    //return new Date(y, m, d);
    //    return MinMonthStart;
    //}

})