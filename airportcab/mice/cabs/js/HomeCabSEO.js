var check = false;

var sourceIdMapping = "";
var destinationIdMapping = "";

var FromResponseObject = [];
var ToResponseObject = [];

var from = {
    "name": "",
    "lat": "",
    "long": "",
    "countryCode": "",
    "type": "",
    "state": "",
    "city": "",
    "address": ""
};
var to = {
    "name": "",
    "lat": "",
    "long": "",
    "countryCode": "",
    "type": "",
    "state": "",
    "city": "",
    "address": ""
};

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

function Regex(value) {
    var letter = /^[A-Za-z0-9]*$/;
    if (letter.test(value)) {
        document.getElementById("a_FromSector_show").value = document.getElementById("a_FromSector_show").value;
        return true;
    } else {
        document.getElementById("a_FromSector_show").value = "";
        return false;
    }
}

function ValueIfNullOrEmpty(res) {
    return res ? res : "";
}

$(document).ready(function() {
    $(".srcShow").click(function() {
        ShowAutoSuggForSrc();
    });
    $(".destShow").click(function() {
        ShowAutoSuggForDest();
    });
    $(function() {
        var solr = true;
        urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + document.getElementById('sourceName').innerText.toLowerCase() + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        $.ajax({
            url: urlType,
            type: "GET",
            dataType: "json",
            success: function(res) {
                if (res != "1") {
                    var StartCity = [];

                    if (res != null && res.length > 0 && solr == true) {

                        if (solr == true) {

                            var data = res;
                            data.forEach(element => {
                                var Cv = {};
                                var found = false;
                                if (element.type != "undefined" && element.type != null) {
                                    Cv.Type = element.type.toLowerCase();
                                } else {
                                    Cv.Type = "";
                                }
                                Cv.Name = element.name[0];
                                if (Cv.Name.toLowerCase() == document.getElementById('sourceName').innerText.toLowerCase() && !found) {
                                    sourceIdMapping = element.emtCode;
                                    $("#hdnSearchIdForSrc").val(sourceIdMapping);
                                    found = true;
                                    from = {
                                        "name": ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                        "type": ValueIfNullOrEmpty(element.Type),
                                        "state": ValueIfNullOrEmpty(element.state),
                                        "city": ValueIfNullOrEmpty(element.city),
                                        "address": ValueIfNullOrEmpty(element.locationName)
                                    };
                                }
                                if (Cv.Type == "train_station_pro") {
                                    var nm = Cv.Name.split('-');
                                    if (nm.length > 1) {
                                        Cv.Name = nm[1];
                                    }
                                    Cv.code = element.code;
                                }
                                if (element.city != "undefined" && element.city != null) {
                                    Cv.city = element.city.toLowerCase();
                                }
                                if (element.district != "undefined" && element.district != null) {
                                    Cv.district = element.district.toLowerCase();
                                }
                                if (element.state != "undefined" && element.state != null) {
                                    Cv.state = element.state.toLowerCase();
                                }
                                Cv.Name = Cv.Name.toLowerCase();
                                Cv.Id = element.emtCode;

                                if (element.address != "undefined" && element.address != null) {
                                    Cv.Address = element.address[0].toLowerCase();
                                } else {
                                    if (Cv.city != "undefined" && Cv.city != null)
                                        Cv.Address = Cv.city;
                                    if (Cv.district != "undefined" && Cv.district != null) {
                                        if (Cv.Address != "undefined") {
                                            Cv.Address = Cv.Address + "," + Cv.district;
                                        } else {
                                            Cv.Address = Cv.district;
                                        }

                                    }
                                    if (Cv.state != "undefined" && Cv.state != null) {
                                        if (Cv.Address != "undefined") {
                                            Cv.Address = Cv.Address + "," + Cv.state;
                                        } else {
                                            Cv.Address = Cv.state;
                                        }
                                    }
                                }
                                StartCity.push(Cv);
                            });
                        }
                    }
                }

            }
        })

    })

    $(function() {
        var solr = true;
        urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + document.getElementById('destinationName').innerText.toLowerCase() + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        $.ajax({
            url: urlType,
            type: "GET",
            dataType: "json",
            success: function(res) {
                if (res != "1") {
                    var StartCity = [];

                    if (res != null && res.length > 0 && solr == true) {

                        if (solr == true) {

                            var data = res;
                            data.forEach(element => {
                                var Cv = {};
                                var found = false;
                                if (element.type != "undefined" && element.type != null) {
                                    Cv.Type = element.type.toLowerCase();
                                } else {
                                    Cv.Type = "";
                                }
                                Cv.Name = element.name[0];
                                if (Cv.Name.toLowerCase() == document.getElementById('destinationName').innerText.toLowerCase() && !found) {
                                    destinationIdMapping = element.emtCode;
                                    $("#hdnSearchIdForDest").val(destinationIdMapping);
                                    found = true;
                                    to = {
                                        "name": ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                        "type": ValueIfNullOrEmpty(element.Type),
                                        "state": ValueIfNullOrEmpty(element.state),
                                        "city": ValueIfNullOrEmpty(element.city),
                                        "address": ValueIfNullOrEmpty(element.locationName)
                                    };
                                }
                                if (Cv.Type == "train_station_pro") {
                                    var nm = Cv.Name.split('-');
                                    if (nm.length > 1) {
                                        Cv.Name = nm[1];
                                    }
                                    Cv.code = element.code;
                                }
                                if (element.city != "undefined" && element.city != null) {
                                    Cv.city = element.city.toLowerCase();
                                }
                                if (element.district != "undefined" && element.district != null) {
                                    Cv.district = element.district.toLowerCase();
                                }
                                if (element.state != "undefined" && element.state != null) {
                                    Cv.state = element.state.toLowerCase();
                                }
                                Cv.Name = Cv.Name.toLowerCase();
                                Cv.Id = element.emtCode;

                                if (element.address != "undefined" && element.address != null) {
                                    Cv.Address = element.address[0].toLowerCase();
                                } else {
                                    if (Cv.city != "undefined" && Cv.city != null)
                                        Cv.Address = Cv.city;
                                    if (Cv.district != "undefined" && Cv.district != null) {
                                        if (Cv.Address != "undefined") {
                                            Cv.Address = Cv.Address + "," + Cv.district;
                                        } else {
                                            Cv.Address = Cv.district;
                                        }

                                    }
                                    if (Cv.state != "undefined" && Cv.state != null) {
                                        if (Cv.Address != "undefined") {
                                            Cv.Address = Cv.Address + "," + Cv.state;
                                        } else {
                                            Cv.Address = Cv.state;
                                        }
                                    }
                                }
                                StartCity.push(Cv);
                            });
                        }
                    }
                }

            }
        })

    })

    $(function() {
        $("#pickup").datepicker();
        $("#returndate").datepicker();
    });
    $(".accordion__item__header").each(function() {
        $(this).click(function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if ($(this).hasClass("active-tg")) {
                $(this).removeClass("active-tg");
                $(this).next(".accordion__item__content").hide();
            } else {
                $(this).addClass("active-tg");
                $(this).next(".accordion__item__content").show();
            }
        });
    });
    $('#trigger').click(function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $('#drop').toggle();
    });

    var fuelfilter = $("#fuel :input");
    for (var i = 0; i < fuelfilter.length; i++) {
        fuelfilter[i].checked = false;
    }

    var capacity = $("#capacity :input");
    for (var i = 0; i < capacity.length; i++) {
        capacity[i].checked = false;
    }

    var category = $("#drop :input");
    for (var i = 0; i < category.length; i++) {
        category[i].checked = false;
    }

    var luggageCapacity = $("#luggage :input");
    for (var i = 0; i < luggageCapacity.length; i++) {
        luggageCapacity[i].checked = false;
    }

    var toll = $("#toll :input");
    for (var i = 0; i < toll.length; i++) {
        toll[i].checked = false;
    }

    // Hide the div when you click outside
    $(document).click(function() {
        $("#CarCategorydrop").hide();
    });

    // Prevent the click event from propagating to the document
    $("#CarCategorydrop").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#Category").click(function(event) {
        $("#CarCategorydrop").show();
        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        $("#capacity").hide();
    });

    // Prevent the click event from propagating to the document
    $("#capacity").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#Capacity").click(function(event) {
        $("#capacity").show();
        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        $("#fuel").hide();
    });

    // Prevent the click event from propagating to the document
    $("#fuel").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#Fuel").click(function(event) {
        $("#fuel").show();
        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        $("#luggage").hide();
    });

    // Prevent the click event from propagating to the document
    $("#luggage").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#Luggage").click(function(event) {
        $("#luggage").show();
        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        $("#toll").hide();
    });

    // Prevent the click event from propagating to the document
    $("#toll").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#Toll").click(function(event) {
        $("#toll").show();
        event.stopPropagation();
    });

    $('#a_FromSector_show').on('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z0-9 () ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $('#a_ToSector_show').on('keypress', function(event) {
        var regex = new RegExp("^[a-zA-Z0-9 () ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });


    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dt = "";

    if ($("#hiddenSearchForSrc").val() == undefined) { // this case for home and other pages except cab SEO page to show current date
        dt = dateOfXDay(0);
    } else { // this case for cab SEO page to show current date + 1
        dt = dateOfXDay(1)
    }
    var dte = dt.getDate().toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();

    if ($("#hiddenSearchForSrc").val() == undefined) { // this case for home and other pages except cab SEO page to show current date
        dt = dateOfXDay(1);
    } else { // this case for cab SEO page to show current date + 1
        dt = dateOfXDay(2);
    }

    var rdte = dt.getDate().toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();
    document.getElementById("datepicker").value = dte;
    document.getElementById("rdatepicker").value = rdte;

    $("#rdbTravelTypeAirport").prop("checked", true);

    $("#hdnSearchIdForSrc").val('157998');
    $("#hdnSearchIdForDest").val("mapjfbk638121456390828696");

    document.getElementById("sourceName").innerText = "Delhi";
    document.getElementById("sourceAddress").innerText = "Indira Gandhi International Airport, Terminal 3, Delhi";
    document.getElementById("destinationName").innerText = $("#hiddenSearchForDest").val() != undefined ? titleCase($("#hiddenSearchForDest").val()) : "Greater Kailash";
    document.getElementById("destinationAddress").innerText = $("#hiddenSearchForDestAddress").val() != undefined ? titleCase($("#hiddenSearchForDestAddress").val()) : "New Delhi, South East Delhi";

    document.getElementById("time").innerHTML = SetTimeFormat();

    function getCookie(cookieName) {
        let cookies = document.cookie;
        let cookieArray = cookies.split("; ");

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            let [name, value] = cookie.split("=");

            if (name === cookieName) {
                console.log(decodeURIComponent(value));
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    function isMobile() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent) ? "Mobile" : "Desktop";
    }

    var ip = null;
    var visiterId = getCookie("EVisiterID");
    var device = isMobile();
    var trackId = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36); // This generates very unique IDs that are sorted by its generated Date.

    localStorage.setItem("trackId", trackId);

    fetch('https://api.ipify.org?format=json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            ip = data.ip;
            $.ajax({
                url: "https://transferapi.easemytrip.com/api/trackOpen/insertlog",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "pageName": "home",
                    "device": device,
                    "url": window.location.href,
                    "currCode": "INR",
                    "userIP": ip,
                    "visitorId": visiterId,
                    "trackId": trackId
                }),
                success: function(data) {
                    console.log('Successfully Inserted Log');
                },
                error: function(data) {
                    console.log('Error While Inserting Log');
                }
            });
        })
        .catch(function(error) {
            console.log('Error While Inserting Log:', error);
        });

});

var SrcData = [];
var srcinfo = [];
var urlStart = "/Cabs/";

var SrcID = "";
var DesID = "";

if (window.location.href.indexOf("staging") != -1) {
    urlStart = "/Cab/";
} else if (window.location.href.indexOf("localhost") != -1) {
    urlStart = "/";
}

function PropertiesAfterSrcSwap() {
    if (SourceSwapId == 1) {
        document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
        document.getElementById("citiesForAirprtPickup").style.display = "none";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";

    }
    if (SourceSwapId == 2) {
        document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
        document.getElementById("citiesForAirprtPickup").style.display = "none";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
    }
}

function PropertiesAfterDestSwap() {
    if (DestSwapId == 2) {
        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
    }
    if (DestSwapId == 1) {
        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "block";
        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
    }
}

function AutosuggSearch(value, address, PointSelected) {
    var solr = true;
    urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
    if (value.length > 2) {
        $.ajax({
            url: urlType,
            type: "GET",
            dataType: "json",
            success: function(res) {
                if (res != "1") {
                    if (res != null && res.length > 0 && solr == true) {

                        if (solr == true) {

                            var data = res;
                            data.forEach(element => {
                                var Cv = {};
                                var found = false;
                                Cv.Name = element.name[0];
                                if (value.toLowerCase().trim() == "agra fort") {
                                    value = 'agra fort   आगरा का किला   آگرہ قلعہ';
                                }
                                if (Cv.Name.toLowerCase() == value.toLowerCase() && (!element.address || address.toLowerCase().trim().includes(element.address[0].toLowerCase().trim())) && !found) {
                                    sourceIdMapping = element.emtCode;
                                    found = true;
                                    if (PointSelected) {
                                        from = {
                                            "name": ValueIfNullOrEmpty(element.name[0]),
                                            "lat": element.latitude ? element.latitude : 0.0,
                                            "long": element.longitude ? element.longitude : 0.0,
                                            "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                            "type": ValueIfNullOrEmpty(element.Type),
                                            "state": ValueIfNullOrEmpty(element.state),
                                            "city": ValueIfNullOrEmpty(element.city),
                                            "address": ValueIfNullOrEmpty(element.locationName)
                                        };
                                    } else {
                                        to = {
                                            "name": ValueIfNullOrEmpty(element.name[0]),
                                            "lat": element.latitude ? element.latitude : 0.0,
                                            "long": element.longitude ? element.longitude : 0.0,
                                            "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                            "type": ValueIfNullOrEmpty(element.Type),
                                            "state": ValueIfNullOrEmpty(element.state),
                                            "city": ValueIfNullOrEmpty(element.city),
                                            "address": ValueIfNullOrEmpty(element.locationName)
                                        };
                                    }
                                    if ($("#rdbTravelTypeHourly").prop('checked')) {
                                        to = {
                                            "name": ValueIfNullOrEmpty(element.name[0]),
                                            "lat": element.latitude ? element.latitude : 0.0,
                                            "long": element.longitude ? element.longitude : 0.0,
                                            "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                            "type": ValueIfNullOrEmpty(element.Type),
                                            "state": ValueIfNullOrEmpty(element.state),
                                            "city": ValueIfNullOrEmpty(element.city),
                                            "address": ValueIfNullOrEmpty(element.locationName)
                                        };
                                    }
                                }
                            });
                        }
                    }
                }
            }
        })
    }
}

function AutosuggSearchAirport(value, address, PointSelected) {
    var solr = true;
    urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack={%22Date%22:%22%22,%22Time%22:%22%22}&Departure={%22Date%22:%22%22,%22Time%22:%22%22}&Occupancy={%22Adults%22:4,%22Children%22:0,%22Infants%22:0}&StartCity={%22Name%22:%22delh%22}&TravelType=airport&TripType=pickup";
    if (value.length > 2) {
        $.ajax({
            url: urlType,
            type: "GET",
            dataType: "json",
            success: function(res) {
                if (res != "1") {
                    if (res != null && res.CityList.length > 0 && solr == true) {
                        if (solr == true) {
                            let r = Object.entries(res)[2];
                            var data = r[1];
                            var check = false;
                            data.forEach(element => {
                                if (element.Type == "IATA") {
                                    var Cv = {};
                                    var found = false;
                                    Cv.Name = element.name;
                                    if (!check && element.Name != "undefined" && element.Name != null && element.Name != "" && element.Name.toLowerCase() == value.toLowerCase() && !found) {
                                        check = true;
                                        if (sourceSelected) {
                                            from = {
                                                "name": ValueIfNullOrEmpty(element.Name),
                                                "lat": element.latitude ? element.latitude : 0.0,
                                                "long": element.longitude ? element.longitude : 0.0,
                                                "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                                "type": ValueIfNullOrEmpty(element.Type),
                                                "state": ValueIfNullOrEmpty(element.state),
                                                "city": ValueIfNullOrEmpty(element.city),
                                                "address": ValueIfNullOrEmpty(element.locationName)
                                            };
                                        } else {
                                            to = {
                                                "name": ValueIfNullOrEmpty(element.Name),
                                                "lat": element.latitude ? element.latitude : 0.0,
                                                "long": element.longitude ? element.longitude : 0.0,
                                                "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                                "type": ValueIfNullOrEmpty(element.Type),
                                                "state": ValueIfNullOrEmpty(element.state),
                                                "city": ValueIfNullOrEmpty(element.city),
                                                "address": ValueIfNullOrEmpty(element.locationName)
                                            };
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        })
    }
}

function AddautosuggClassFor() {
    if (document.getElementById('StartCity').style.display == "none") {
        document.getElementById('srcCity').placeholder = "Enter airport, hotel, address..";
        document.getElementById('srcCity').value = "";
        $("#srcCity").keydown(function() {
            var solr = true;
            var urlType = "";
            document.getElementById('srcCity').placeholder = "";
            var value = document.getElementById("srcCity").value;
            var check = document.getElementById('srcCity').value.length;
            if (check == 0 || check == 1) {
                document.getElementById("srcCity").placeholder = "Enter airport, hotel, address..";
                document.getElementById("StartCity").style.display = "none";
            }

            if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked") || $("#radio4").prop("checked")) {
                urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
            } else {
                var dtTime = JSON.stringify({
                    "Date": "",
                    "Time": ""
                });
                var capacity = JSON.stringify({
                    "Adults": 4,
                    "Children": 0,
                    "Infants": 0
                });
                var citystart = JSON.stringify({
                    "Name": value
                });

                //urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack=" + dtTime + "&Departure=" + dtTime + "&Occupancy=" + capacity + "&StartCity=" + citystart + "&TravelType=airport&TripType=pickup";
                urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack={%22Date%22:%22%22,%22Time%22:%22%22}&Departure={%22Date%22:%22%22,%22Time%22:%22%22}&Occupancy={%22Adults%22:4,%22Children%22:0,%22Infants%22:0}&StartCity={%22Name%22:%22delh%22}&TravelType=airport&TripType=pickup";
            }
            if (value.length > 2) {
                $.ajax({
                    url: urlType,
                    type: "GET",
                    dataType: "json",
                    success: function(res) {
                        if (res != "1") {
                            var StartCity = [];

                            if (res != null && res.length > 0 && solr == true) {

                                if (solr == true) {

                                    var data = res;
                                    data.forEach(element => {
                                        var Cv = {};
                                        if (element.type != "undefined" && element.type != null) {
                                            Cv.Type = element.type.toLowerCase();
                                        } else {
                                            Cv.Type = "";
                                        }
                                        Cv.Name = element.name[0];
                                        if (Cv.Type == "train_station_pro") {
                                            var nm = Cv.Name.split('-');
                                            if (nm.length > 1) {
                                                Cv.Name = nm[1];
                                            }
                                            Cv.code = element.code;
                                        }
                                        if (element.city != "undefined" && element.city != null) {
                                            Cv.city = element.city.toLowerCase();
                                            if (element.city.toLowerCase() == value.toLowerCase()) {
                                                $("#hdnSearchIdForSrc").val(element.id);
                                            }
                                        }
                                        if (element.district != "undefined" && element.district != null) {
                                            Cv.district = element.district.toLowerCase();
                                        }
                                        if (element.state != "undefined" && element.state != null) {
                                            Cv.state = element.state.toLowerCase();
                                        }
                                        Cv.Name = Cv.Name.toLowerCase();
                                        Cv.Id = element.emtCode;

                                        if (element.address != "undefined" && element.address != null) {
                                            Cv.Address = element.address[0].toLowerCase();
                                        } else {
                                            if (Cv.city != "undefined" && Cv.city != null)
                                                Cv.Address = Cv.city;
                                            if (Cv.district != "undefined" && Cv.district != null) {
                                                if (Cv.Address != "undefined") {
                                                    Cv.Address = Cv.Address + "," + Cv.district;
                                                } else {
                                                    Cv.Address = Cv.district;
                                                }

                                            }
                                            if (Cv.state != "undefined" && Cv.state != null) {
                                                if (Cv.Address != "undefined") {
                                                    Cv.Address = Cv.Address + "," + Cv.state;
                                                } else {
                                                    Cv.Address = Cv.state;
                                                }
                                            }
                                        }
                                        StartCity.push(Cv);
                                    });
                                }
                            } else {
                                if (res != null && res.CityList.length > 0 && solr == true) {
                                    //if (res.CityList.length != 0 && $("#radio3").prop("checked")) {
                                    if (solr == true) {
                                        //var data = res.CityList;
                                        //let r = Object.assign({}, res);
                                        let r = Object.entries(res)[2];
                                        var data = r[1];
                                        data.forEach(element => {
                                            if (element.Type == "IATA") {
                                                var Cv = {};
                                                if (element.Code != "undefined" && element.Code != null && element.Code != "") {
                                                    Cv.Code = element.Code;
                                                }
                                                Cv.Name = element.name;
                                                if (element.Id != "undefined" && element.Id != null && element.Id != "") {
                                                    Cv.Id = element.Id;
                                                }
                                                if (element.Name != "undefined" && element.Name != null && element.Name != "") {
                                                    Cv.Name = element.Name;
                                                }
                                                if (element.ShowType != "undefined" && element.ShowType != null && element.ShowType != "") {
                                                    Cv.ShowType = element.ShowType;
                                                }
                                                if (element.Type != "undefined" && element.Type != null && element.Type != "") {
                                                    Cv.Type = element.Type;
                                                }
                                                if (element.City != "undefined" && element.City != null && element.City != "") {
                                                    Cv.City = element.City;
                                                }
                                                if (element.countryCode != "undefined" && element.countryCode != null && element.countryCode != "") {
                                                    Cv.countryCode = element.countryCode;
                                                }
                                                StartCity.push(Cv);
                                            }
                                        });
                                    }
                                }
                            }

                            SrcData = StartCity;
                            $(".auto_sugg_tttl").remove();
                        }
                        $.ajax({
                            type: "POST",
                            url: urlStart + "CabSeo/SearchDataForSource",
                            //url: "/Cab/CabSeo/SearchDataForSource",
                            data: {
                                "obj": StartCity
                            },
                            success: function(data) {
                                $("#StartCity").html(''),
                                    $("#StartCity").html(data)
                                document.getElementById('StartCity').style.display = "block";
                            },
                            error: function() {
                                $("#StartCity").html("No Data Found")
                            }
                        })
                    },
                    error: function(data) {
                        $("#StartCity").html("No Data Found")
                    }
                })
            }
        })
    }
}

function AddautosuggClassForSource() {
    if (document.getElementById("a_FromSector_show").value.length > 2) {
        var solr = true;
        var urlType = "";
        document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
        document.getElementById("citiesForAirprtPickup").style.display = "none";

        if (document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display == "block") {
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
        }

        document.getElementById("StartCity").style.display = "block";

        document.getElementById('a_FromSector_show').placeholder = "";
        var value = document.getElementById("a_FromSector_show").value;
        var check = document.getElementById('a_FromSector_show').value.length;
        if (check == 0 || check == 1) {
            document.getElementById("a_FromSector_show").placeholder = "From";
            /*document.getElementById("StartCity").style.display = "none";*/
        }

        if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked") || $("#drop").hasClass("actv_air")) {
            urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        } else {
            urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack={%22Date%22:%22%22,%22Time%22:%22%22}&Departure={%22Date%22:%22%22,%22Time%22:%22%22}&Occupancy={%22Adults%22:4,%22Children%22:0,%22Infants%22:0}&StartCity={%22Name%22:%22delh%22}&TravelType=airport&TripType=pickup";
        }
        if (value.length > 2) {
            $.ajax({
                url: urlType,
                type: "GET",
                dataType: "json",
                success: function(res) {
                    if (res != "1") {
                        var StartCity = [];

                        if (res != null && res.length > 0 && solr == true) {

                            if (solr == true) {

                                var data = res;
                                data.forEach(element => {
                                    var Cv = {};
                                    if (element.type != "undefined" && element.type != null) {
                                        Cv.Type = element.type.toLowerCase();
                                    } else {
                                        Cv.Type = "";
                                    }
                                    Cv.Name = element.name[0];
                                    if (Cv.Type == "train_station_pro") {
                                        var nm = Cv.Name.split('-');
                                        if (nm.length > 1) {
                                            Cv.Name = nm[1];
                                        }
                                        Cv.code = element.code;
                                    }
                                    if (element.city != "undefined" && element.city != null) {
                                        Cv.city = element.city.toLowerCase();
                                    }
                                    if (element.district != "undefined" && element.district != null) {
                                        Cv.district = element.district.toLowerCase();
                                    }
                                    if (element.state != "undefined" && element.state != null) {
                                        Cv.state = element.state.toLowerCase();
                                    }
                                    Cv.Name = Cv.Name.toLowerCase();
                                    Cv.Id = element.emtCode;

                                    if (element.address != "undefined" && element.address != null) {
                                        Cv.Address = element.address[0].toLowerCase();
                                    } else {
                                        if (Cv.city != "undefined" && Cv.city != null)
                                            Cv.Address = Cv.city;
                                        if (Cv.district != "undefined" && Cv.district != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.district;
                                            } else {
                                                Cv.Address = Cv.district;
                                            }

                                        }
                                        if (Cv.state != "undefined" && Cv.state != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.state;
                                            } else {
                                                Cv.Address = Cv.state;
                                            }
                                        }
                                    }
                                    StartCity.push(Cv);
                                    var FromData = {};
                                    FromData = {
                                        "id": element.emtCode,
                                        "name": ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                        "type": ValueIfNullOrEmpty(element.Type),
                                        "state": ValueIfNullOrEmpty(element.state),
                                        "city": ValueIfNullOrEmpty(element.city),
                                        "address": ValueIfNullOrEmpty(element.locationName)
                                    };
                                    FromResponseObject.push(FromData);
                                });
                            }
                        } else {
                            if (res != null && res.CityList.length > 0 && solr == true) {
                                //if (res.CityList.length != 0 && $("#radio3").prop("checked")) {
                                if (solr == true) {
                                    //var data = res.CityList;
                                    //let r = Object.assign({}, res);
                                    let r = Object.entries(res)[2];
                                    var data = r[1];
                                    data.forEach(element => {
                                        if (element.Type == "IATA") {
                                            var Cv = {};
                                            if (element.Code != "undefined" && element.Code != null && element.Code != "") {
                                                Cv.Code = element.Code;
                                            }
                                            Cv.Name = element.name;
                                            if (element.Id != "undefined" && element.Id != null && element.Id != "") {
                                                Cv.Id = element.Id;
                                            }
                                            if (element.Name != "undefined" && element.Name != null && element.Name != "") {
                                                Cv.Name = element.Name;
                                            }
                                            if (element.ShowType != "undefined" && element.ShowType != null && element.ShowType != "") {
                                                Cv.ShowType = element.ShowType;
                                            }
                                            if (element.Type != "undefined" && element.Type != null && element.Type != "") {
                                                Cv.Type = element.Type;
                                            }
                                            if (element.City != "undefined" && element.City != null && element.City != "") {
                                                Cv.City = element.City;
                                            }
                                            if (element.countryCode != "undefined" && element.countryCode != null && element.countryCode != "") {
                                                Cv.countryCode = element.countryCode;
                                            }
                                            StartCity.push(Cv);
                                            var FromData = {};
                                            FromData = {
                                                "name": ValueIfNullOrEmpty(element.Name),
                                                "lat": element.latitude ? element.latitude : 0.0,
                                                "long": element.longitude ? element.longitude : 0.0,
                                                "countryCode": ValueIfNullOrEmpty(element.countryCode),
                                                "type": ValueIfNullOrEmpty(element.Type),
                                                "state": ValueIfNullOrEmpty(element.state),
                                                "city": ValueIfNullOrEmpty(element.city),
                                                "address": ValueIfNullOrEmpty(element.Address)
                                            };
                                            FromResponseObject.push(FromData);
                                        }
                                    });
                                }
                            }
                        }

                        SrcData = StartCity;
                        $(".auto_sugg_tttl").remove();
                    }
                    $.ajax({
                        type: "POST",
                        url: urlStart + "CabSeo/SearchDataForSource",
                        //url: "/Cab/CabSeo/SearchDataForSource",
                        data: {
                            "obj": StartCity
                        },
                        success: function(data) {

                            $("#StartCity").html(''),
                                document.getElementById('StartCity').style.display = "block";
                            $("#StartCity").html(data)
                        },
                        error: function() {
                            $("#StartCity").html("No Data Found")
                        }
                    })
                },
                error: function(data) {
                    $("#StartCity").html("No Data Found")
                }
            })
        }
    } else {
        document.getElementById("StartCity").style.display = "none";
        if (document.getElementById("a_FromSector_show").value.length == 0) {
            if ($("#rdbTravelTypeAirport").is(':checked')) {
                if ($("#pickup").hasClass("actv_air")) {
                    document.getElementById("citiesForAirprtPickup").style.display = "block";
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";

                } else { // This is The case of drop
                    if (SourceSwapId == 1) {
                        document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
                        document.getElementById("citiesForAirprtPickup").style.display = "block";
                        document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
                        document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";

                    } else {
                        document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
                        document.getElementById("citiesForAirprtPickup").style.display = "none";
                        document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
                        document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                    }
                }
            } else {
                document.getElementById("a_FromSector_show").placeholder = "From";
                document.getElementById("StartCity").style.display = "none";
                $(".auto_sugg_tttl").remove();
                var lissrc = document.querySelectorAll('#StartCity li');
                for (var i = 0; li = lissrc[i]; i++) {
                    li.parentNode.removeChild(li);
                }

                if (document.getElementById("citiesWhenKeyIsLessForSrc").style.display == "none") {
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
                    //  document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                } else {
                    document.getElementById("citiesForAirprtPickup").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
                    document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
                }
                if ($("#rdbTravelTypeOther").is(':checked')) {
                    //document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
                    //document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
                    //document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                    //document.getElementById("citiesForAirprtPickup").style.display = "none";
                    PropertiesAfterSrcSwap();

                }
            }
        } else {
            if ($("#rdbTravelTypeAirport").is(':checked')) {
                if ($("#pickup").hasClass("actv_air")) {
                    document.getElementById("citiesForAirprtPickup").style.display = "block";
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
                } else {
                    if (document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display == "block") {
                        document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                    }
                    if (document.getElementById("citiesWhenKeyIsLessForSrc").style.display == "none") { // This is the case when src will be agra after swap
                        document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";

                    }
                }
            } else {
                if (document.getElementById("citiesWhenKeyIsLessForSrc").style.display == "none") {
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
                } else {
                    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
                    document.getElementById("citiesForAirprtPickup").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";

                }
                if ($("#rdbTravelTypeOther").is(':checked')) {
                    //document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
                    //document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
                    //document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                    //document.getElementById("citiesForAirprtPickup").style.display = "none";
                    PropertiesAfterSrcSwap();

                }
                if ($("#rdbTravelTypeHourly").is(':checked')) {
                    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
                    document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
                    document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
                    document.getElementById("citiesForAirprtPickup").style.display = "none";

                }
            }
        }
    }
}

var DestData = [];
var destinfo = [];

function AddautosuggClassForDest() {
    if (document.getElementById("a_ToSector_show").value.length > 2) {
        var solr = true;
        var urlType = "";
        document.getElementById("citiesWhenKeyIsLess").style.display = "none";
        document.getElementById("StartCity").style.display = "block";

        document.getElementById('a_FromSector_show').placeholder = "";
        var value = document.getElementById("a_ToSector_show").value;
        var check = document.getElementById('a_ToSector_show').value.length;
        if (check == 0 || check == 1) {
            document.getElementById("a_ToSector_show").placeholder = "From";
            /*document.getElementById("StartCity").style.display = "none";*/
        }

        if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked") || $("#radio4").prop("checked")) {
            urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        } else {
            urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack={%22Date%22:%22%22,%22Time%22:%22%22}&Departure={%22Date%22:%22%22,%22Time%22:%22%22}&Occupancy={%22Adults%22:4,%22Children%22:0,%22Infants%22:0}&StartCity={%22Name%22:%22delh%22}&TravelType=airport&TripType=pickup";
        }
        if (value.length > 2) {
            $.ajax({
                url: urlType,
                type: "GET",
                dataType: "json",
                success: function(res) {
                    if (res != "1") {
                        var StartCity = [];

                        if (res != null && res.length > 0 && solr == true) {

                            if (solr == true) {

                                var data = res;
                                data.forEach(element => {
                                    var Cv = {};
                                    if (element.type != "undefined" && element.type != null) {
                                        Cv.Type = element.type.toLowerCase();
                                    } else {
                                        Cv.Type = "";
                                    }
                                    Cv.Name = element.name[0];
                                    if (Cv.Type == "train_station_pro") {
                                        var nm = Cv.Name.split('-');
                                        if (nm.length > 1) {
                                            Cv.Name = nm[1];
                                        }
                                        Cv.code = element.code;
                                    }
                                    if (element.city != "undefined" && element.city != null) {
                                        Cv.city = element.city.toLowerCase();
                                        if (element.city.toLowerCase() == value.toLowerCase()) {
                                            $("#hdnSearchIdForSrc").val(element.id);
                                        }
                                    }
                                    if (element.district != "undefined" && element.district != null) {
                                        Cv.district = element.district.toLowerCase();
                                    }
                                    if (element.state != "undefined" && element.state != null) {
                                        Cv.state = element.state.toLowerCase();
                                    }
                                    Cv.Name = Cv.Name.toLowerCase();
                                    Cv.Id = element.emtCode;

                                    if (element.address != "undefined" && element.address != null) {
                                        Cv.Address = element.address[0].toLowerCase();
                                    } else {
                                        if (Cv.city != "undefined" && Cv.city != null)
                                            Cv.Address = Cv.city;
                                        if (Cv.district != "undefined" && Cv.district != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.district;
                                            } else {
                                                Cv.Address = Cv.district;
                                            }

                                        }
                                        if (Cv.state != "undefined" && Cv.state != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.state;
                                            } else {
                                                Cv.Address = Cv.state;
                                            }
                                        }
                                    }
                                    StartCity.push(Cv);
                                    to = {
                                        "name": ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                        "type": ValueIfNullOrEmpty(element.Type),
                                        "state": ValueIfNullOrEmpty(element.state),
                                        "city": ValueIfNullOrEmpty(element.city),
                                        "address": ValueIfNullOrEmpty(element.locationName)
                                    };
                                    ToResponseObject.push(to);
                                });
                            }
                        } else {
                            if (res != null && res.CityList.length > 0 && solr == true) {
                                //if (res.CityList.length != 0 && $("#radio3").prop("checked")) {
                                if (solr == true) {
                                    //var data = res.CityList;
                                    //let r = Object.assign({}, res);
                                    let r = Object.entries(res)[2];
                                    var data = r[1];
                                    data.forEach(element => {
                                        if (element.Type == "IATA") {
                                            var Cv = {};
                                            if (element.Code != "undefined" && element.Code != null && element.Code != "") {
                                                Cv.Code = element.Code;
                                            }
                                            Cv.Name = element.name;
                                            if (element.Id != "undefined" && element.Id != null && element.Id != "") {
                                                Cv.Id = element.Id;
                                            }
                                            if (element.Name != "undefined" && element.Name != null && element.Name != "") {
                                                Cv.Name = element.Name;
                                            }
                                            if (element.ShowType != "undefined" && element.ShowType != null && element.ShowType != "") {
                                                Cv.ShowType = element.ShowType;
                                            }
                                            if (element.Type != "undefined" && element.Type != null && element.Type != "") {
                                                Cv.Type = element.Type;
                                            }
                                            if (element.City != "undefined" && element.City != null && element.City != "") {
                                                Cv.City = element.City;
                                            }
                                            if (element.countryCode != "undefined" && element.countryCode != null && element.countryCode != "") {
                                                Cv.countryCode = element.countryCode;
                                            }
                                            StartCity.push(Cv);
                                            to = {
                                                "name": ValueIfNullOrEmpty(element.name[0]),
                                                "lat": element.latitude ? element.latitude : 0.0,
                                                "long": element.longitude ? element.longitude : 0.0,
                                                "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                                "type": ValueIfNullOrEmpty(element.Type),
                                                "state": ValueIfNullOrEmpty(element.state),
                                                "city": ValueIfNullOrEmpty(element.city),
                                                "address": ValueIfNullOrEmpty(element.locationName)
                                            };
                                            ToResponseObject.push(to);
                                        }
                                    });
                                }
                            }
                        }

                        SrcData = StartCity;
                        $(".auto_sugg_tttl").remove();
                    }
                    $.ajax({
                        type: "POST",
                        url: urlStart + "CabSeo/SearchDataForSource",
                        //url: "/Cab/CabSeo/SearchDataForSource",
                        data: {
                            "obj": StartCity
                        },
                        success: function(data) {

                            $("#StartCity").html(''),
                                document.getElementById('StartCity').style.display = "block";
                            $("#StartCity").html(data)
                        },
                        error: function() {
                            $("#StartCity").html("No Data Found")
                        }
                    })
                },
                error: function(data) {
                    $("#StartCity").html("No Data Found")
                }
            })
        }
    } else {
        if (document.getElementById("a_ToSector_show").value.length == 0) {
            document.getElementById("a_ToSector_show").placeholder = "From";
            document.getElementById("StartCity").style.display = "none";
            $(".auto_sugg_tttl").remove();
            var lissrc = document.querySelectorAll('#StartCity li');
            for (var i = 0; li = lissrc[i]; i++) {
                li.parentNode.removeChild(li);
            }
            document.getElementById("citiesWhenKeyIsLess").style.display = "block";

        } else {
            document.getElementById("StartCity").style.display = "none";
            document.getElementById("citiesWhenKeyIsLess").style.display = "block";
        }
    }
}

function AddautosuggClassForDestination() {
    if (document.getElementById("a_ToSector_show").value.length > 2) {
        var solr = true;
        var urlType = "";
        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";


        document.getElementById("EndCity").style.display = "block";

        document.getElementById('a_FromSector_show').placeholder = "";
        var value = document.getElementById("a_ToSector_show").value;
        var check = document.getElementById('a_ToSector_show').value.length;
        if (check == 0 || check == 1) {
            document.getElementById("a_ToSector_show").placeholder = "To";
            /*document.getElementById("StartCity").style.display = "none";*/
        }

        if ($("#rdbTravelTypeOther").prop("checked") || $("#rdbTravelTypeHourly").prop("checked") || $("#pickup").hasClass("actv_air")) {
            urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        } else {
            urlType = "https://transferapi.easemytrip.com/api/autosearch/city/airport/" + value.toLowerCase() + "?ComeBack={%22Date%22:%22%22,%22Time%22:%22%22}&Departure={%22Date%22:%22%22,%22Time%22:%22%22}&Occupancy={%22Adults%22:4,%22Children%22:0,%22Infants%22:0}&StartCity={%22Name%22:%22delh%22}&TravelType=airport&TripType=pickup";
        }
        if (value.length > 2) {
            $.ajax({
                url: urlType,
                type: "GET",
                dataType: "json",
                success: function(res) {
                    if (res != "1") {
                        var StartCity = [];

                        if (res != null && res.length > 0 && solr == true) {

                            if (solr == true) {

                                var data = res;
                                data.forEach(element => {
                                    var Cv = {};
                                    if (element.type != "undefined" && element.type != null) {
                                        Cv.Type = element.type.toLowerCase();
                                    } else {
                                        Cv.Type = "";
                                    }
                                    Cv.Name = element.name[0];
                                    if (Cv.Type == "train_station_pro") {
                                        var nm = Cv.Name.split('-');
                                        if (nm.length > 1) {
                                            Cv.Name = nm[1];
                                        }
                                        Cv.code = element.code;
                                    }
                                    if (element.city != "undefined" && element.city != null) {
                                        Cv.city = element.city.toLowerCase();
                                    }
                                    if (element.district != "undefined" && element.district != null) {
                                        Cv.district = element.district.toLowerCase();
                                    }
                                    if (element.state != "undefined" && element.state != null) {
                                        Cv.state = element.state.toLowerCase();
                                    }
                                    Cv.Name = Cv.Name.toLowerCase();
                                    Cv.Id = element.emtCode;

                                    if (element.address != "undefined" && element.address != null) {
                                        Cv.Address = element.address[0].toLowerCase();
                                    } else {
                                        if (Cv.city != "undefined" && Cv.city != null)
                                            Cv.Address = Cv.city;
                                        if (Cv.district != "undefined" && Cv.district != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.district;
                                            } else {
                                                Cv.Address = Cv.district;
                                            }

                                        }
                                        if (Cv.state != "undefined" && Cv.state != null) {
                                            if (Cv.Address != "undefined") {
                                                Cv.Address = Cv.Address + "," + Cv.state;
                                            } else {
                                                Cv.Address = Cv.state;
                                            }
                                        }
                                    }
                                    StartCity.push(Cv);
                                    var ToData = {};
                                    ToData = {
                                        "id": element.emtCode,
                                        "name": ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                        "type": ValueIfNullOrEmpty(element.Type),
                                        "state": ValueIfNullOrEmpty(element.state),
                                        "city": ValueIfNullOrEmpty(element.city),
                                        "address": ValueIfNullOrEmpty(element.locationName)
                                    };
                                    ToResponseObject.push(ToData);
                                });
                            }
                        } else {
                            if (res != null && res.CityList.length > 0 && solr == true) {
                                //if (res.CityList.length != 0 && $("#radio3").prop("checked")) {
                                if (solr == true) {
                                    //var data = res.CityList;
                                    //let r = Object.assign({}, res);
                                    let r = Object.entries(res)[2];
                                    var data = r[1];
                                    data.forEach(element => {
                                        if (element.Type == "IATA") {
                                            var Cv = {};
                                            if (element.Code != "undefined" && element.Code != null && element.Code != "") {
                                                Cv.Code = element.Code;
                                            }
                                            Cv.Name = element.name;
                                            if (element.Id != "undefined" && element.Id != null && element.Id != "") {
                                                Cv.Id = element.Id;
                                            }
                                            if (element.Name != "undefined" && element.Name != null && element.Name != "") {
                                                Cv.Name = element.Name;
                                            }
                                            if (element.ShowType != "undefined" && element.ShowType != null && element.ShowType != "") {
                                                Cv.ShowType = element.ShowType;
                                            }
                                            if (element.Type != "undefined" && element.Type != null && element.Type != "") {
                                                Cv.Type = element.Type;
                                            }
                                            if (element.City != "undefined" && element.City != null && element.City != "") {
                                                Cv.City = element.City;
                                            }
                                            if (element.countryCode != "undefined" && element.countryCode != null && element.countryCode != "") {
                                                Cv.countryCode = element.countryCode;
                                            }
                                            StartCity.push(Cv);
                                            to = {
                                                "name": ValueIfNullOrEmpty(element.Name),
                                                "lat": element.latitude ? element.latitude : 0.0,
                                                "long": element.longitude ? element.longitude : 0.0,
                                                "countryCode": ValueIfNullOrEmpty(element.countryIso2),
                                                "type": ValueIfNullOrEmpty(element.Type),
                                                "state": ValueIfNullOrEmpty(element.state),
                                                "city": ValueIfNullOrEmpty(element.city),
                                                "address": ValueIfNullOrEmpty(element.locationName)
                                            };
                                            ToResponseObject.push(to);
                                        }
                                    });
                                }
                            }
                        }

                        SrcData = StartCity;
                        $(".auto_sugg_tttl").remove();
                    }
                    $.ajax({
                        type: "POST",
                        url: urlStart + "CabSeo/SearchDataForDest",
                        //url: "/Cab/CabSeo/SearchDataForSource",
                        data: {
                            "obj": StartCity
                        },
                        success: function(data) {

                            $("#EndCity").html(''),
                                document.getElementById('EndCity').style.display = "block";
                            $("#EndCity").html(data)
                        },
                        error: function() {
                            $("#EndCity").html("No Data Found")
                        }
                    })
                },
                error: function(data) {
                    $("#EndCity").html("No Data Found")
                }
            })
        }
    } else {

        document.getElementById("EndCity").style.display = "none";

        if (document.getElementById("a_ToSector_show").value.length == 0) {

            if ($("#rdbTravelTypeAirport").is(':checked')) {
                if ($("#drop").hasClass("actv_air")) {
                    if (document.getElementById("destinationName").innerText.toLowerCase() == "delhi") {
                        document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";

                        document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
                        document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "block";

                    } else {
                        document.getElementById("citiesForAirprtPickDrop").style.display = "block";
                        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                    }
                } else {
                    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                }
            } else {
                document.getElementById("a_ToSector_show").placeholder = "To";
                document.getElementById("EndCity").style.display = "none";
                $(".auto_sugg_tttl").remove();
                var lissrc = document.querySelectorAll('#EndCity li');
                for (var i = 0; li = lissrc[i]; i++) {
                    li.parentNode.removeChild(li);
                }

                //if (document.getElementById("citiesWhenKeyIsLessForDest").style.display == "none") {
                //    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                //    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "block";
                //}
                //else {
                //    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                //    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
                //    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";

                //}
                PropertiesAfterDestSwap();
            }
        } else {

            if ($("#rdbTravelTypeAirport").is(':checked')) {
                if ($("#drop").hasClass("actv_air")) {
                    // if (document.getElementById("destinationName").innerText.toLowerCase() == "delhi") {
                    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
                    document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "block";
                    // }
                    //    document.getElementById("citiesForAirprtPickDrop").style.display = "block";
                    //    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                } else {
                    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                    if ($("#pickup").hasClass("actv_air")) {
                        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";

                    }
                }
            } else {
                // document.getElementById("EndCity").style.display = "none";
                if (document.getElementById("citiesWhenKeyIsLessForDest").style.display == "none") {
                    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "block";
                } else {
                    document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
                    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
                }
            }
            if ($("#rdbTravelTypeOther").is(':checked')) {
                PropertiesAfterDestSwap();
            }
        }
    }
}

function ViewInfo(id) {
    if (document.getElementById(id).style.display == "block") {
        document.getElementById(id).style.display = "none";
    } else {
        document.getElementById(id).style.display = "block";
    }
}

function showhide() {
    IsReturn = true;
    var div = document.getElementById("pickme");
    var ret = document.getElementById("return");
    if (div.style.display !== "none") {
        div.style.display = "none";
    } else {
        div.style.display = "block";
        ret.style.display = "none";
        if (document.getElementById("pickup").value != "") {
            var r = document.getElementById("pickup").value.split('/');
            var dte = "";
            if (Number(r[1]) <= 8) {
                dte = '0' + (Number(r[1]) + 1).toString();
            } else dte = (Number(r[1]) + 1).toString();
            var dt = r[0] + '/' + dte + '/' + r[2];
            document.getElementById("returndate").value = dt;
        }
    }
}

function closeit() {
    IsReturn = false;
    var div = document.getElementById("pickme");
    var ret = document.getElementById("return");
    if (ret.style.display !== "none") {
        ret.style.display = "none";
    } else {
        ret.style.display = "block";
        div.style.display = "none";
    }
}

function GetCabSection(type) {
    switch (type) {
        case "1":
            ""
            $("#rdbTravelTypeAirport").attr('checked', true);
            $("#rdbTravelTypeOther").removeAttr('checked', true);
            $("#rdbTravelTypeHourly").removeAttr('checked', true);


            $("#li1").addClass('nitin');
            $("#li2").removeClass('nitin');
            $("#li3").removeClass('nitin');
            if (document.getElementById('rdbTravelTypeHourly') != null) {
                document.getElementById('srccitysection').style.display = "block";
                document.getElementById('airportRadios').style.display = "block";
                $("#radio3").prop("checked", true);
                document.getElementById('dvdest').style.display = "block";
                document.getElementById('pickUpDate').style.display = "block";
                document.getElementById('dvReturnDate').style.display = "none";
                document.getElementById('rdbTravelTypeHourly').style.display = "none";
                document.getElementById('rentfor').style.display = "none";
                document.getElementById("pickloction").style.display = "none";
                document.getElementById("dropLoction").style.display = "none";
                document.getElementById("dteTime").style.display = "none";
                document.getElementById("swap").style.display = "block";
                document.getElementById("dTime").style.display = "none";
                document.getElementById("Time").style.display = "none";
                document.getElementById("srcCity").placeholder = "Enter airport, hotel, address...";
                document.getElementById("srcCity").value = "";
                document.getElementById("Destination").placeholder = "Enter airport, hotel, address...";
                document.getElementById("Destination").value = "";
                document.getElementById("pickup").value = "";
                document.getElementById("timepicker1").value = "";
                document.getElementById('returndate').value = "";
                document.getElementById('timepicker2').value = "";
                if (document.getElementById('return').style.display == "none") {
                    document.getElementById('return').style.display = "block";
                    document.getElementById('pickme').style.display = "none";
                }

            }
            break;
        case "2":
            ""
            $("#rdbTravelTypeOther").attr('checked', true);
            $("#rdbTravelTypeAirport").removeAttr('checked', true);
            $("#rdbTravelTypeHourly").removeAttr('checked', true);

            $("#li2").addClass('nitin');
            $("#li1").removeClass('nitin');
            $("#li3").removeClass('nitin');
            if (document.getElementById('srccitysection') != null) {
                document.getElementById('srccitysection').style.display = "block";
                document.getElementById('dvdest').style.display = "block";
                document.getElementById("swap").style.display = "block";
                document.getElementById('pickUpDate').style.display = "block";
                document.getElementById('dvReturnDate').style.display = "block";
                document.getElementById('rentfor').style.display = "none";
                document.getElementById("pickloction").style.display = "none";
                document.getElementById("dropLoction").style.display = "none";
                document.getElementById("dteTime").style.display = "none";
                document.getElementById("dTime").style.display = "none";
                document.getElementById("Time").style.display = "none";
                document.getElementById("srcCity").placeholder = "Enter airport, hotel, address...";
                document.getElementById("srcCity").value = "";
                document.getElementById("Destination").placeholder = "Enter airport, hotel, address...";
                document.getElementById("Destination").value = "";
                document.getElementById("pickup").value = "";
                document.getElementById("timepicker1").value = "";
                document.getElementById('airportRadios').style.display = "none";
                if ($("#radio3").prop("checked", true))
                    $("#radio3").prop("checked", false);
                if ($("#radio4").prop("checked", true))
                    $("#radio4").prop("checked", false);
            }
            break;
        case "3":
            ""
            $("#rdbTravelTypeHourly").attr('checked', true);
            $("#rdbTravelTypeAirport").removeAttr('checked', true);
            $("#rdbTravelTypeOther").removeAttr('checked', true);

            $("#li3").addClass('nitin');
            $("#li2").removeClass('nitin');
            $("#li1").removeClass('nitin');

            document.getElementById('srccitysection').style.display = "block";
            document.getElementById('pickUpDate').style.display = "block";
            document.getElementById('dvReturnDate').style.display = "none";
            document.getElementById('dvdest').style.display = "none";
            document.getElementById('rentfor').style.display = "block";
            document.getElementById("pickloction").style.display = "none";
            document.getElementById("dropLoction").style.display = "none";
            document.getElementById("dteTime").style.display = "none";
            document.getElementById("dTime").style.display = "none";
            document.getElementById("swap").style.display = "none";
            document.getElementById("Time").style.display = "none";
            document.getElementById("srcCity").placeholder = "Enter airport, hotel, address...";
            document.getElementById("srcCity").value = "";
            document.getElementById("Destination").placeholder = "Enter airport, hotel, address...";
            document.getElementById("Destination").value = "";
            document.getElementById("pickup").value = "";
            document.getElementById("timepicker1").value = "";
            document.getElementById('returndate').value = "";
            document.getElementById('timepicker2').value = "";
            if (document.getElementById('return').style.display == "none") {
                document.getElementById('return').style.display = "block";
                document.getElementById('pickme').style.display = "none";
            }
            document.getElementById('airportRadios').style.display = "none";
            if ($("#radio3").prop("checked", true))
                $("#radio3").prop("checked", false);
            if ($("#radio4").prop("checked", true))
                $("#radio4").prop("checked", false);
            break;
    }
}

function CurrentDate() {
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dt = new Date();
    var dte = date.toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();
    return dte;
}

function CurrentDatePlusOne() {
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dt = new Date($("#datepicker").val());
    dt.setDate(dt.getDate() + 1);
    var rdte = dt.getDate().toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();
    return rdte;
}

function DisableRentFor() {
    const ul = document.getElementById("addclsForRent").querySelectorAll('ul li');
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            ul[i].classList.remove("actvtab");
        }
    }
    ul[1].classList.add("actvtab");
    document.getElementById("guestroom").innerHTML = "04";
}

var IsReturn = false;
var SourceSwapId = 1;
var DestSwapId = 2;

function GetNewCabSection(type) {
    switch (type) {
        case "1":
            ""
            if (document.getElementById("CommonSearchContent")) {
                document.getElementById("CommonSearchContent").style.display = "block";
            }
            document.getElementById("SelfDriveSearchContent").style.display = "none";
            $("#rdbTravelTypeAirport").attr('checked', true);
            $("#rdbTravelTypeOther").removeAttr('checked', true);
            $("#rdbTravelTypeHourly").removeAttr('checked', true);
            $("#rdbTravelTypeSelf").removeAttr('checked', true);
            $("#hrlysrc").removeClass("bx50P_add");
            $("#returnDate").addClass("disabl");
            $("#returnDate").css("pointer-events", "none");
            $("#returnDate").css("outline", "none");
            document.getElementById("rdatepicker").value = "";
            document.getElementById("returntime").innerText = "Select Time";
            document.getElementById("rtag").style.display = "block";
            document.getElementById("returndateTime").style.display = "none";

            $("#li1").addClass('nitin');
            $("#li2").removeClass('nitin');
            $("#li3").removeClass('nitin');

            FromResponseObject = [];
            ToResponseObject = [];
            from = {};
            to = {
                "name": "",
                "lat": "",
                "long": "",
                "countryCode": "",
                "type": "",
                "state": "",
                "city": "",
                "address": ""
            };

            SourceSwapId = 1;
            DestSwapId = 2;
            IsReturn = false;
            $("#hdnSearchIdForSrc").val('157998');
            $("#hdnSearchIdForDest").val("mapjfbk638121456390828696");
            document.getElementById("returnDate").style.display = "none";

            document.getElementById('to').style.display = "block";
            document.getElementById('airportdiv').style.display = "block";
            document.getElementById('citiesForAirprtPickup').style.display = "block";
            document.getElementById('citiesWhenKeyIsLessForSrc').style.display = "none";
            document.getElementById('timePicker').style.display = "none";
            document.getElementById('returnDate').style.display = "block";
            $("#rdbTravelTypeAirport").prop("checked", true);
            document.getElementById('time').innerText = SetTimeFormat();
            DisableActiveTabOfTime();
            document.getElementById("shwpickoptn").innerText = "Pick Up";
            document.getElementById("datepicker").value = CurrentDate();
            document.getElementById("rdatepicker").value = CurrentDate();
            document.getElementById("sourceName").innerText = "Delhi";
            document.getElementById("sourceAddress").innerText = "Indira Gandhi International Airport, Terminal 3, Delhi";

            document.getElementById("destinationName").innerText = $("#hiddenSearchForDest").val() != undefined ? titleCase($("#hiddenSearchForDest").val()) : "Greater Kailash";
            document.getElementById("destinationAddress").innerText = $("#hiddenSearchForDestAddress").val() != undefined ? titleCase($("#hiddenSearchForDestAddress").val()) : "New Delhi, South East Delhi";
            sourceSelected = false;
            destSelected = true;
            AutosuggSearch("Greater Kailash", "New Delhi", sourceSelected);

            $("#pickup").addClass("actv_air");
            $("#drop").removeClass("actv_air");
            $("#CommonSearch").show();
            $("#SelfDriveSearch").hide();
            $("#para").hide();
            DisableRentFor();

            break;
        case "2":
            ""
            if (document.getElementById("CommonSearchContent")) {
                document.getElementById("CommonSearchContent").style.display = "block";
            }
            document.getElementById("SelfDriveSearchContent").style.display = "none";
            $("#rdbTravelTypeOther").attr('checked', true);
            $("#rdbTravelTypeAirport").removeAttr('checked', true);
            $("#rdbTravelTypeHourly").removeAttr('checked', true);
            $("#rdbTravelTypeSelf").removeAttr('checked', true);

            $("#hrlysrc").removeClass("bx50P_add");
            $("#returnDate").removeClass("disabl");
            $("#returnDate").removeProp("pointer-events", "none");
            document.getElementById("returnDate").style.removeProperty("pointer-events");
            document.getElementById("returnDate").style.removeProperty("outline");

            FromResponseObject = [];
            ToResponseObject = [];
            from = {
                "name": "",
                "lat": "",
                "long": "",
                "countryCode": "",
                "type": "",
                "state": "",
                "city": "",
                "address": ""
            };
            to = {
                "name": "",
                "lat": "",
                "long": "",
                "countryCode": "",
                "type": "",
                "state": "",
                "city": "",
                "address": ""
            };

            SourceSwapId = 1;
            DestSwapId = 2;
            $("#hdnSearchIdForSrc").val('mapwwks638120779189632490');
            $("#hdnSearchIdForDest").val('map7hwc638120779579580998');
            document.getElementById('to').style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
            document.getElementById("citiesForAirprtPickup").style.display = "none";
            document.getElementById("citiesForAirprtPickDrop").style.display = "none";
            document.getElementById('airportdiv').style.display = "none";
            document.getElementById('timePicker').style.display = "none";
            document.getElementById('returnDate').style.display = "block";
            $("#rdbTravelTypeOther").prop("checked", true);
            document.getElementById('time').innerText = SetTimeFormat();
            DisableActiveTabOfTime();
            document.getElementById("shwpickoptn").innerText = "Pick Up";

            document.getElementById("returntime").innerText = "Select Time";
            document.getElementById("rtag").style.display = "block";
            document.getElementById("returndateTime").style.display = "none";

            document.getElementById("datepicker").value = CurrentDate();
            document.getElementById("rdatepicker").value = CurrentDatePlusOne();
            document.getElementById("sourceName").innerText = $("#hiddenSearchForSrc").val() != undefined ? titleCase($("#hiddenSearchForSrc").val()) : "Delhi";
            document.getElementById("sourceAddress").innerText = $("#hiddenSearchForSrcAddress").val() != undefined ? titleCase($("#hiddenSearchForSrcAddress").val()) : "Delhi";
            sourceSelected = true;
            destSelected = false;
            AutosuggSearch("Delhi", "", sourceSelected);

            document.getElementById("destinationName").innerText = $("#hiddenSearchForDest").val() != undefined ? titleCase($("#hiddenSearchForDest").val()) : "Agra";
            document.getElementById("destinationAddress").innerText = $("#hiddenSearchForDestAddress").val() != undefined ? titleCase($("#hiddenSearchForDestAddress").val()) : "Agra,Uttar Pradesh";
            destSelected = true;
            sourceSelected = false;
            AutosuggSearch("Agra", "Agra", sourceSelected);

            $("#pickup").addClass("actv_air");
            $("#drop").removeClass("actv_air");
            $("#CommonSearch").show();
            $("#SelfDriveSearch").hide();
            $("#para").hide();
            DisableRentFor();
            return false;

            break;
        case "3":
            ""
            if (document.getElementById("CommonSearchContent")) {
                document.getElementById("CommonSearchContent").style.display = "block";
            }
            document.getElementById("SelfDriveSearchContent").style.display = "none";
            $("#rdbTravelTypeHourly").attr('checked', true);
            $("#rdbTravelTypeAirport").removeAttr('checked', true);
            $("#rdbTravelTypeOther").removeAttr('checked', true);
            $("#rdbTravelTypeSelf").removeAttr('checked', true);
            $("#returnDate").addClass("disabl");
            $("#returnDate").css("pointer-events", "none");
            $("#returnDate").css("outline", "none");

            $("#li3").addClass('nitin');
            $("#li2").removeClass('nitin');
            $("#li1").removeClass('nitin');

            FromResponseObject = [];
            ToResponseObject = [];
            from = {
                "name": "",
                "lat": "",
                "long": "",
                "countryCode": "",
                "type": "",
                "state": "",
                "city": "",
                "address": ""
            };
            to = {
                "name": "",
                "lat": "",
                "long": "",
                "countryCode": "",
                "type": "",
                "state": "",
                "city": "",
                "address": ""
            };

            SourceSwapId = 1;
            DestSwapId = 2;
            $("#hdnSearchIdForSrc").val('mapwwks638120779189632490');
            $("#hdnSearchIdForDest").val('map7hwc638120779579580998');
            document.getElementById("returnDate").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
            document.getElementById("citiesForAirprtPickup").style.display = "none";
            $("#hrlysrc").addClass("bx50P_add");
            document.getElementById('airportdiv').style.display = "none";
            document.getElementById('to').style.display = "none";
            document.getElementById('timePicker').style.display = "block";
            document.getElementById('returnDate').style.display = "block";
            $("#rdbTravelTypeHourly").prop("checked", true);
            document.getElementById('time').innerText = SetTimeFormat();
            DisableActiveTabOfTime();
            document.getElementById("shwpickoptn").innerText = "Pick Up";
            document.getElementById("datepicker").value = CurrentDate();
            document.getElementById("rdatepicker").value = CurrentDate();
            document.getElementById("sourceName").innerText = $("#hiddenSearchForSrc").val() != undefined ? titleCase($("#hiddenSearchForSrc").val()) : "Delhi";
            document.getElementById("sourceAddress").innerText = $("#hiddenSearchForSrcAddress").val() != undefined ? titleCase($("#hiddenSearchForSrcAddress").val()) : "Delhi";
            sourceSelected = true;
            destSelected = false;
            AutosuggSearch("Delhi", "", sourceSelected);

            document.getElementById("destinationName").innerText = $("#hiddenSearchForDest").val() != undefined ? titleCase($("#hiddenSearchForDest").val()) : "Agra";
            document.getElementById("destinationAddress").innerText = $("#hiddenSearchForDestAddress").val() != undefined ? titleCase($("#hiddenSearchForDestAddress").val()) : "Agra,Uttar Pradesh";
            document.getElementById("rdatepicker").value = "";
            document.getElementById("returntime").innerText = "Select Time";
            document.getElementById("rtag").style.display = "block";
            document.getElementById("returndateTime").style.display = "none";
            $("#pickup").addClass("actv_air");
            $("#drop").removeClass("actv_air");
            $("#CommonSearch").show();
            $("#SelfDriveSearch").hide();
            $("#para").hide();
            DisableRentFor();

            break;
        case "4":
            $("#rdbTravelTypeSelf").attr('checked', true);
            $("#rdbTravelTypeOther").removeAttr('checked', true);
            $("#rdbTravelTypeAirport").removeAttr('checked', true);
            $("#rdbTravelTypeHourly").removeAttr('checked', true);
            $("#CommonSearch").hide();
            $("#SelfDriveSearch").show();
            document.getElementById("SlfDrivsourceName").innerHTML = "Paris Roissy CDG Airport T1";
            document.getElementById("SlfDrivdestinationName").innerHTML = "Paris Roissy CDG Airport T1";
            document.getElementById("SlfDrivsourceAddress").innerText = 'Charles De Gaulle Apt Terminal 1, Niveau Arrivee Porte 26, France';
            document.getElementById("SlfDrivdestinationAddress").innerText = 'Charles De Gaulle Apt Terminal 1, Niveau Arrivee Porte 26, France';
            if (document.getElementById("CommonSearchContent")) {
                document.getElementById("CommonSearchContent").style.display = "none";
            }
            if (!window.location.href.includes("offers"))
                document.getElementById("SelfDriveSearchContent").style.display = "block";

            $("#hdnSrchSrcStnCode").val("FRCDGT01");
            $("#hdnSrchDesStnCode").val("FRCDGT01");
            $("#hdnSrchSrcCntry").val("France");
            $("#hdnSrchDesCntry").val("France");
            $("#hdnSrchSrcCntryCode").val("FR");
            $("#hdnSrchDesCntryCode").val("FR");
            $("#age").val("18Years");
            $("#LiveIn").val("IN");
            $("#para").show();

            SetTimeAndDateOfSlfDrive();
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

function SearchSourceValue(id) {
    var city = document.getElementsByClassName("auto_sugg_tttl")[Number(id) - 1].innerText.trim();
    var flag = false;
    if ($("#StartCity").hasClass('auto_sugg')) {
        srcinfo = SrcData[Number(id) - 1];
        for (var lst of FromResponseObject) {
            if (lst.id && (lst.id.toLowerCase().trim() == srcinfo.Id.toLowerCase().trim())) {
                from.name = ValueIfNullOrEmpty(lst.name);
                from.lat = ValueIfNullOrEmpty(lst.lat);
                from.long = ValueIfNullOrEmpty(lst.long);
                from.countryCode = ValueIfNullOrEmpty(lst.countryCode);
                from.type = ValueIfNullOrEmpty(lst.type);
                from.state = ValueIfNullOrEmpty(lst.state);
                from.city = ValueIfNullOrEmpty(lst.city);
                from.address = ValueIfNullOrEmpty(lst.address);
                break;
            } else {
                if (!lst.id && (lst.name.toLowerCase().trim() == srcinfo.Name.toLowerCase().trim())) {
                    from.name = ValueIfNullOrEmpty(lst.name);
                    from.lat = ValueIfNullOrEmpty(lst.lat);
                    from.long = ValueIfNullOrEmpty(lst.long);
                    from.countryCode = ValueIfNullOrEmpty(lst.countryCode);
                    from.type = ValueIfNullOrEmpty(lst.type);
                    from.state = ValueIfNullOrEmpty(lst.state);
                    from.city = ValueIfNullOrEmpty(lst.city);
                    from.address = ValueIfNullOrEmpty(lst.address);
                }
            }
        }
    }

    if ($("#pickup").hasClass("actv_air") && $("#rdbTravelTypeAirport").prop('checked')) {
        from = {};
    }

    document.getElementById('sourceName').innerText = "";
    document.getElementById('sourceAddress').innerText = "";

    if (srcinfo.Name != "" && srcinfo.Name != undefined) {
        document.getElementById('sourceName').innerText = titleCase(srcinfo.Name);
    }
    if (srcinfo.Address != "" && srcinfo.Address != undefined) {
        document.getElementById('sourceAddress').innerText = titleCase(srcinfo.Address.replace("undefined,", ""));
    }
    $("#hdnSearchIdForSrc").val(srcinfo.Id);
    $(".auto_sugg_tttl").remove();
    document.getElementById('StartCity').style.display = "none";
    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
    document.getElementById('a_FromSector_show').placeholder = "From";
    document.getElementById('a_FromSector_show').value = "";
    document.getElementById("showSource").style.display = "none";
    event.stopPropagation();
    //if (r == document.getElementById('Destination').value.toLowerCase().trim()) {
    //    document.getElementById("pickloctn").innerHTML = "Pick Up and Drop Location can't be same";
    //    document.getElementById("pickloction").style.display = "block";
    //    flag = true;
    //}
    //else {
    //    document.getElementById("pickloction").style.display = "none";
    //    document.getElementById("pickloctn").innerHTML = "";
    //}

}

function SearchDestValue(id) {
    var city = document.getElementsByClassName("auto_sugg_tttl")[Number(id) - 1].innerText.trim();
    var flag = false;
    if ($("#EndCity").hasClass('auto_sugg')) {
        srcinfo = SrcData[Number(id) - 1];
        for (var lst of ToResponseObject) {
            if (lst.id && (lst.id.toLowerCase().trim() == srcinfo.Id.toLowerCase().trim())) {
                to.name = ValueIfNullOrEmpty(lst.name);
                to.lat = ValueIfNullOrEmpty(lst.lat);
                to.long = ValueIfNullOrEmpty(lst.long);
                to.countryCode = ValueIfNullOrEmpty(lst.countryCode);
                to.type = ValueIfNullOrEmpty(lst.type);
                to.state = ValueIfNullOrEmpty(lst.state);
                to.city = ValueIfNullOrEmpty(lst.city);
                to.address = ValueIfNullOrEmpty(lst.address);
                break;
            } else {
                if (!lst.id && (lst.name.toLowerCase().trim() == srcinfo.Name.toLowerCase().trim())) {
                    to.name = ValueIfNullOrEmpty(lst.name);
                    to.lat = ValueIfNullOrEmpty(lst.lat);
                    to.long = ValueIfNullOrEmpty(lst.long);
                    to.countryCode = ValueIfNullOrEmpty(lst.countryCode);
                    to.type = ValueIfNullOrEmpty(lst.type);
                    to.state = ValueIfNullOrEmpty(lst.state);
                    to.city = ValueIfNullOrEmpty(lst.city);
                    to.address = ValueIfNullOrEmpty(lst.address);
                }
            }
        }

        if ($("#drop").hasClass("actv_air") && $("#rdbTravelTypeAirport").prop('checked')) {
            to = {};
        }

        document.getElementById('destinationName').innerText = "";
        document.getElementById('destinationAddress').innerText = "";
        if (srcinfo.Name != "" && srcinfo.Name != undefined) {
            document.getElementById('destinationName').innerText = titleCase(srcinfo.Name);
        }
        if (srcinfo.Address != "" && srcinfo.Address != undefined) {
            document.getElementById('destinationAddress').innerText = titleCase(srcinfo.Address.replace("undefined,", ""));
        }
        $("#hdnSearchIdForDest").val(srcinfo.Id);
        $(".auto_sugg_tttl").remove();
        document.getElementById('EndCity').style.display = "none";
        document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
        document.getElementById('showDestination').style.display = "none";
        document.getElementById('a_ToSector_show').placeholder = "From";
        document.getElementById('a_ToSector_show').value = "";
        event.stopPropagation();
    }
}

function GetList() {
    var isOk = true;
    var url = "";
    var urllist = window.location.href.indexOf("uat") == -1 ? (window.location.href.indexOf("csc") == -1 ? "https://transfer.easemytrip.com" : "https://csctransfer.easemytrip.com") + "/list/" : "https://uat-transfer.easemytrip.com" + "/list/";

    var departuredate = "";
    var source = "";
    var flag = false;
    source = document.getElementById('sourceName').innerText;

    if (document.getElementById('time').innerText == "Select Time") {
        isOk = false;
        document.getElementById("picktime").innerHTML = "Enter Pick Up Time";
        document.getElementById("pickTime").style.display = "block";
    }

    var destination = "";
    destination = document.getElementById('destinationName').innerText;

    if ($("#rdbTravelTypeAirport").prop("checked") || $("#rdbTravelTypeOther").prop("checked")) {
        if (document.getElementById("sourceAddress").innerText == "Indira Gandhi International Airport, Terminal 3, Delhi") {
            $("#hdnSearchIdForSrc").val('157998');
        }
        if ($("#hdnSearchIdForSrc").val() == $("#hdnSearchIdForDest").val()) {
            isOk = false;
            document.getElementById("srcErrMxMessge").innerHTML = "Source and Destination Can't Be Same";
            document.getElementById("srcErrBx").style.display = "block";
        }
    }
    var departuretime = "";

    var checktime = getMinimumTime();
    var time = document.getElementById('time').innerHTML.split(" ")[0];
    var selectedDateArray = document.getElementById("datepicker").value.split(" ");
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

    if ($("#rdbTravelTypeOther").prop("checked")) {
        if (isDateTimeSmallerThanCurrentPlusMinimum(selectedDateArray[2] + "-" + selectedDateArray[0] + "-" + selectedDateArray[1], time)) {
            isOk = false;
            var h = Math.floor(checktime[3] / 60);
            var m = checktime[3] % 60;
            if (checktime[3] >= 60) {
                document.getElementById("dtime").innerHTML = "PickUp time must greater than atleast " + h + " hours and " + m + " minutes then current time.";
                document.getElementById("Time").style.display = "block";
            } else {
                document.getElementById("dtime").innerHTML = "PickUp time must greater than atleast " + h + " hours and " + m + " minutes then current time.";
                document.getElementById("Time").style.display = "block";
            }
        }
        if (IsReturn) {
            if (document.getElementById('returntime').innerText == "Select Time") {
                isOk = false;
                document.getElementById("rtime").innerHTML = "Enter Return Time";
                document.getElementById("rTime").style.display = "block";
            }
            var dtime = document.getElementById('time').innerText;
            var CBtime = document.getElementById('returntime').innerText;

            var newDate = new Date(document.getElementById('datepicker').value + " " + dtime);
            var dedDate = new Date(document.getElementById('rdatepicker').value + " " + CBtime);
            if (newDate > dedDate) {
                isOk = false;
                document.getElementById("returndatetime").innerHTML = "Return date time can't be less than pickup time";
                document.getElementById("returndTime").style.display = "block";
            }
            newDate.setHours(newDate.getHours() + 4);
            if (newDate > dedDate) {
                isOk = false;
                document.getElementById("returndatetime").innerHTML = "Return time must greater than atleast 4 hours of pickup time";
                document.getElementById("returndTime").style.display = "block";
            }

        }
    }
    if (isOk) {
        var ftime = "";
        var time = document.getElementById("time").innerHTML.split(' ');
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
        var date1 = document.getElementById('datepicker').value.split(" ");
        date1[1] = (indexOfmonth <= 9 ? ('0' + indexOfmonth) : indexOfmonth);
        var y = date1[2];
        var m = date1[1];
        var d = date1[0];
        fdate = y + "-" + m + "-" + d;
        var dates = fdate + "T" + ftime;
        if ($("#rdbTravelTypeHourly").prop("checked")) // Travel type is hourly
        {
            var rentForValue = document.getElementById("guestroom").innerHTML;
            if (rentForValue == '') {

                isOk = false;
                document.getElementById("rentforerror").innerHTML = "Please choose Rent For";
                document.getElementById("rentfor").style.display = "block";

            }
            if (isOk) {
                var traveltype = "hourly";
                to = {
                    "name": "",
                    "lat": "",
                    "long": "",
                    "countryCode": "",
                    "type": "",
                    "state": "",
                    "city": "",
                    "address": ""
                };
                url = urllist + $("#hdnSearchIdForSrc").val() + "/" + $("#hdnSearchIdForSrc").val() + "/" + dates + "/" + "4/0/0" + "/" + traveltype + "/" + rentForValue.replace("0", "") + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(from);

            }
        } else {
            if (IsReturn) {
                if (isOk) {
                    var ComeBackdate = document.getElementById('rdatepicker').value;
                    var ComeBacktime = document.getElementById('returntime').innerText;

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
                    url = urllist + $("#hdnSearchIdForSrc").val() + '/' + $("#hdnSearchIdForDest").val() + "/" + dates + "/" + "4/0/0" + "/" + cdates + "/" + "other" + "/" + "pickup" + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(to);
                }
            } else {
                if (isOk) {
                    var passangers = "4/0/0";
                    var travelType = $("#rdbTravelTypeAirport").prop("checked") ? "airport" : "other";
                    var type = $("#shwpickoptn").text().toLowerCase() == "pick up" ? "pickup" : "drop";
                    var url = urllist + $("#hdnSearchIdForSrc").val() + '/' + $("#hdnSearchIdForDest").val() + '/' + dates + '/' + passangers + '/' + travelType + '/' + type + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(to);
                }
            }
        }
    }

    if (isOk)
        window.location.href = url;
    else {
        setTimeout(function() {
            var error = document.getElementsByClassName("errorbox");
            for (var i = 0; i < error.length; i++) {
                error[i].style.display = 'none';
                document.getElementsByClassName("errorbox")[0].childNodes[1].innerHTML = "";
            }
        }, 3000);

    }
}

function FormatValidationOfPickUpDate() {
    var selectedDateArray = document.getElementById("datepicker").value.split(" ");
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
    var date1 = document.getElementById('datepicker').value.split(" ");
    date1[1] = (indexOfmonth <= 9 ? ('0' + indexOfmonth) : indexOfmonth);
    var y = date1[2];
    var m = date1[1];
    var d = date1[0];
    fdate = y + "-" + m + "-" + d;

    var ftime = "";
    var time = FormateValidationOfPickUpTime().split(" ");
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

    var dates = fdate + "T" + ftime;
    return dates;
}

function FormateValidationOfPickUpTime() {
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
    var time = hr + ":" + min + " " + ap;
    return time;
}

function BookNow() {
    var url = "";
    var urllist = "https://transfer.easemytrip.com" + "/list/";
    if (document.getElementById('returntime').innerText != "Select Time") {
        var ComeBackdate = document.getElementById('rdatepicker').value;
        var ComeBacktime = document.getElementById('returntime').innerText;

        var ftime = "";
        // var time = document.getElementById('time').value.split(' ');
        var time = FormateValidationOfPickUpTime().split(" ");

        if (time != "") {
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
        }

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

        var dates = FormatValidationOfPickUpDate();

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
        url = urllist + $("#hdnSearchIdForSrc").val() + '/' + $("#hdnSearchIdForDest").val() + "/" + dates + "/" + "4/0/0" + "/" + cdates + "/" + "other" + "/" + "pickup" + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(to);
    } else {
        var ftime = "";
        var time = FormateValidationOfPickUpTime().split(" ");
        if (time != "") {
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
        } else {
            var currentTime = new Date().getTime();
            var updatedTIme = new Date(currentTime + 2 * 60 * 60 * 1000);
            var hour = updatedTIme.getHours().toString();
            var minute = "";
            if (updatedTIme.getMinutes() <= 9) {
                minute = '0' + updatedTIme.getMinutes().toString();
            } else {
                minute = updatedTIme.getMinutes().toString();
            }
            if (hour == "12") {
                ftime = hour + ":00";
            } else {
                var ft = parseInt(hour);
                ftime = ft + ":" + minute + ":00";
            }
        }

        var fdate = "";
        var date1 = document.getElementById('datepicker').value.split(' ');
        if (date1 != "") {
            var dates = FormatValidationOfPickUpDate();
        } else {
            var year = new Date().getFullYear().toString();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var date = tomorrow.getDate().toString();
            var month = new Date().getMonth();
            if (month <= 8) {
                month = '0' + (month + 1).toString();
            } else if (month == 9) month = (month + 1).toString();

            fdate = year + "-" + month.toString() + "-" + date;
            var dates = fdate + "T" + ftime;
        }
    }

    if (url == "") {
        url = urllist + $("#hdnSearchIdForSrc").val() + "/" + $("#hdnSearchIdForDest").val() + "/" + dates + "/" + "4/0/0" + "/" + "other" + '/' + "pickup";
    }
    if (url != "") {
        window.location.href = url;
    }
}

function isDateTimeSmallerThanCurrentPlusMinimum(dateString, timeString) {
    // Validate dateString and timeString
    if (!dateString || !timeString || dateString.indexOf("undefined") > 0 || timeString.indexOf("undefined") > 0) {
        return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i;
    if (!dateRegex.test(dateString) || !timeRegex.test(timeString)) {
        return false;
    }

    let minutesToAdd = 0;
    if ($("#rdbTravelTypeAirport").prop("checked"))
        minutesToAdd = 44;
    else if ($("#rdbTravelTypeOther").prop("checked"))
        minutesToAdd = 134;
    else if ($("#rdbTravelTypeHourly").prop("checked"))
        minutesToAdd = 134;

    const now = new Date();
    const futureTime = new Date(now.getTime() + minutesToAdd * 60000);

    const [timeValue, ampm] = timeString.split(' ');
    const [hours, minutes] = timeValue.split(':').map(Number);

    const inputDateTime = new Date(dateString);
    inputDateTime.setHours(ampm.toLowerCase() === 'am' ? (hours % 12) : (hours % 12) + 12);
    inputDateTime.setMinutes(minutes);

    return inputDateTime < futureTime;
}

function getMinimumTime() {
    let minutesToAdd = 0;
    if ($("#rdbTravelTypeAirport").prop("checked"))
        minutesToAdd = 45;
    else if ($("#rdbTravelTypeOther").prop("checked"))
        minutesToAdd = 135;
    else if ($("#rdbTravelTypeHourly").prop("checked"))
        minutesToAdd = 135;

    const now = new Date();
    const newTime = new Date(now.getTime() + minutesToAdd * 60000);
    let hours = newTime.getHours();
    let minutes = newTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = [hours, minutes, ampm, minutesToAdd];
    return formattedTime;
}

function pick() {
    //document.getElementById("sourceName").innerText = "Delhi";
    //document.getElementById("sourceAddress").innerText = "Indira Gandhi Internal Airport, Delhi";
    //document.getElementById("destinationName").innerText = "Agra";
    //document.getElementById("destinationAddress").innerText = "Agra,Uttar Pradesh";
    //$("#hdnSearchIdForSrc").val('321');
    //$("#hdnSearchIdForDest").val('map7hwc638120779579580998');
    if (SourceSwapId != 1 && DestSwapId != 2) {
        SwapSrcAndDes();
    }
    document.getElementById("shwpickoptn").innerText = "Pick Up";
    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
    document.getElementById("citiesForAirprtPickup").style.display = "block";
    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
    $("#pickup").addClass("actv_air");
    $("#drop").removeClass("actv_air");
    $("#airportpickdrop").toggle();
}

function drop() {
    //document.getElementById("sourceName").innerText = "Agra";
    //document.getElementById("sourceAddress").innerText = "Agra,Uttar Pradesh";
    //document.getElementById("destinationName").innerText = "Delhi";
    //document.getElementById("destinationAddress").innerText = "Indira Gandhi Internal Airport, Delhi";
    //$("#hdnSearchIdForSrc").val('map7hwc638120779579580998');
    //$("#hdnSearchIdForDest").val('321');
    if (SourceSwapId == 1 && DestSwapId == 2) {
        SwapSrcAndDes();
    }
    document.getElementById("shwpickoptn").innerText = "Drop";
    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
    document.getElementById("citiesForAirprtPickup").style.display = "none";
    document.getElementById("citiesForAirprtPickDrop").style.display = "block";
    $("#drop").addClass("actv_air");
    $("#pickup").removeClass("actv_air");
    $("#airportpickdrop").toggle();
}

function Toll() {
    var Toll = $("#toll :input");
    for (var i = 0; i < Toll.length; i++) {
        selectedTollType.add(Toll[i].value);
    }
    if (document.getElementById("toll").style.display == 'none') {
        document.getElementById("toll").style.display = 'block';
    } else {
        document.getElementById("toll").style.display = 'none';
    }
}

function fuel() {
    var fuelfilter = $("#fuel :input");
    for (var i = 0; i < fuelfilter.length; i++) {
        selectedFuelType.add(fuelfilter[i].value);
    }
    if (document.getElementById("fuel").style.display == 'none') {
        document.getElementById("fuel").style.display = 'block';
    } else {
        document.getElementById("fuel").style.display = 'none';
    }
}

function capacity() {
    var capacity = $("#capacity :input");
    for (var i = 0; i < capacity.length; i++) {
        selectedPaxCapacity.add(capacity[i].value);
    }
    if (document.getElementById("capacity").style.display == 'none') {
        document.getElementById("capacity").style.display = 'block';
    } else {
        document.getElementById("capacity").style.display = 'none';
    }
}

function category() {
    var category = $("#CarCategorydrop :input");
    for (var i = 0; i < category.length; i++) {
        selectedCarCategories.add(category[i].value);
    }
    if (document.getElementById("CarCategorydrop").style.display == 'none') {
        document.getElementById("CarCategorydrop").style.display = 'block';
    } else {
        document.getElementById("CarCategorydrop").style.display = 'none';
    }
}

function luggage() {
    var luggageCapacity = $("#luggage :input");
    for (var i = 0; i < luggageCapacity.length; i++) {
        selectedLuggageCapacity.add(luggageCapacity[i].value);
    }
    if (document.getElementById("luggage").style.display == 'none') {
        document.getElementById("luggage").style.display = 'block';
    } else {
        document.getElementById("luggage").style.display = 'none';
    }
}

function sendSelectedCarCategories(categories) {
    var url = document.getElementById("sourceName").innerText.toLowerCase() + "-to-" + document.getElementById("destinationName").innerText.toLowerCase() + "-cab-booking/";
    $.ajax({
        type: "POST",
        url: urlStart + "CabSeo/ShowCategory",
        //url: "/Cab/CabSeo/ShowCategory",
        data: {
            "CarCategory": categories,
            "url": url
        },
        success: function(data) {
            $("#ContentListing").empty(),
                $("#ContentListing").html(data)
        },
        error: function(error) {
            console.log("Error:" + error);
            $("#ContentListing").html("No Data Found")
        }
    })
}

var selectedCarCategories = new Set();
var CarCategoriesSelectedByUser = new Set();
var selectedPaxCapacity = new Set();
var PaxCapacitySelectedByUser = new Set();
var selectedLuggageCapacity = new Set();
var LuggageCapacitySelectedByUser = new Set();
var selectedFuelType = new Set();
var FuelTypeSelectedByUser = new Set();
var selectedTollType = new Set();
var TollSelectedByUser = new Set();

function handleCheckboxChange(checkbox) {
    if (checkbox.checked) {
        CarCategoriesSelectedByUser.add(checkbox.value);
    } else {
        CarCategoriesSelectedByUser.delete(checkbox.value);
    }
    if (Array.from(CarCategoriesSelectedByUser).length == 0) {
        CarCategoriesSelectedByUser = new Set();
        sendSelectedCarCategories(Array.from(selectedCarCategories));
    } else
        sendSelectedCarCategories(Array.from(CarCategoriesSelectedByUser));
}

function handleCheckboxChangeForPaxCapacity(checkbox) {
    if (checkbox.checked) {
        PaxCapacitySelectedByUser.add(checkbox.value);
    } else {
        PaxCapacitySelectedByUser.delete(checkbox.value);
    }

    if (Array.from(PaxCapacitySelectedByUser).length == 0) {
        PaxCapacitySelectedByUser = new Set();
        PaxCapacity(Array.from(selectedPaxCapacity));
    } else
        PaxCapacity(Array.from(PaxCapacitySelectedByUser));
}

function handleCheckboxChangeForLuggageCapacity(checkbox) {
    if (checkbox.checked) {
        LuggageCapacitySelectedByUser.add(checkbox.value);
    } else {
        LuggageCapacitySelectedByUser.delete(checkbox.value);
    }
    if (Array.from(LuggageCapacitySelectedByUser).length == 0) {
        LuggageCapacitySelectedByUser = new Set();
        LuggageCapacity(Array.from(selectedLuggageCapacity));
    } else
        LuggageCapacity(Array.from(LuggageCapacitySelectedByUser));
}

function handleCheckboxChangeForFuelType(checkbox) {
    if (checkbox.checked) {
        FuelTypeSelectedByUser.add(checkbox.value);
    } else {
        FuelTypeSelectedByUser.delete(checkbox.value);
    }
    if (Array.from(FuelTypeSelectedByUser).length == 0) {
        FuelTypeSelectedByUser = new Set();
        FuelType(Array.from(selectedFuelType));
    } else
        FuelType(Array.from(FuelTypeSelectedByUser));
}

function handleCheckboxChangeForToll(checkbox) {
    if (checkbox.checked) {
        TollSelectedByUser.add(checkbox.value);
    } else {
        TollSelectedByUser.delete(checkbox.value);
    }
    if (Array.from(TollSelectedByUser).length == 0) {
        TollSelectedByUser = new Set();
        TollType(Array.from(selectedTollType));
    } else
        TollType(Array.from(TollSelectedByUser));
}

function PaxCapacity(capacity) {
    var url = document.getElementById("sourceName").innerText.toLowerCase() + "-to-" + document.getElementById("destinationName").innerText.toLowerCase() + "-cab-booking/";
    $.ajax({
        type: "POST",
        url: urlStart + "CabSeo/Capacity",
        //url: "/Cab/CabSeo/Capacity",
        data: {
            "MaxPaxCapacity": capacity,
            "Url": url
        },
        success: function(data) {
            $("#ContentListing").empty(),
                $("#ContentListing").html(data)
        },
        error: function() {
            $("#ContentListing").html("No Data Found")
        }
    })
}

function LuggageCapacity(luggagecapacity) {
    var url = document.getElementById("sourceName").innerText.toLowerCase() + "-to-" + document.getElementById("destinationName").innerText.toLowerCase() + "-cab-booking/";
    $.ajax({
        type: "POST",
        url: urlStart + "CabSeo/LuggageCapacity",
        //url: "/Cab/CabSeo/LuggageCapacity",
        data: {
            "LuggageCapacity": luggagecapacity,
            "Url": url
        },
        success: function(data) {
            $("#ContentListing").empty(),
                $("#ContentListing").html(data)
        },
        error: function() {
            $("#ContentListing").html("No Data Found")
        }
    })
}

function FuelType(fueltype) {
    var url = document.getElementById("sourceName").innerText.toLowerCase() + "-to-" + document.getElementById("destinationName").innerText.toLowerCase() + "-cab-booking/";
    $.ajax({
        type: "POST",
        url: urlStart + "CabSeo/FuelType",
        //url: "/Cab/CabSeo/FuelType",
        data: {
            "FuelType": fueltype,
            "Url": url
        },
        success: function(data) {
            $("#ContentListing").empty(),
                $("#ContentListing").html(data)
        },
        error: function() {
            $("#ContentListing").html("No Data Found")
        }
    })
}

function TollType(tolltype) {
    var url = document.getElementById("sourceName").innerText.toLowerCase() + "-to-" + document.getElementById("destinationName").innerText.toLowerCase() + "-cab-booking/";
    $.ajax({
        type: "POST",
        url: urlStart + "CabSeo/TollType",
        //url: "/Cab/CabSeo/TollType",
        data: {
            "Toll": tolltype,
            "Url": url
        },
        success: function(data) {
            $("#ContentListing").empty(),
                $("#ContentListing").html(data)
        },
        error: function() {
            $("#ContentListing").html("No Data Found")
        }
    })
}

function selects() {
    var ele = document.getElementById('#CarCategorydrop');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox')
            ele[i].checked = false;
    }
}

function SwapSrcAndDes() {
    var x = SourceSwapId;
    var y = DestSwapId;
    SourceSwapId = y;
    DestSwapId = x;

    var f = from;
    var t = to;
    from = t;
    to = f;

    var srcId = $("#hdnSearchIdForSrc").val();
    var desId = $("#hdnSearchIdForDest").val();
    sourceIdMapping = desId;
    destinationIdMapping = srcId;
    $("#hdnSearchIdForSrc").val(desId);
    $("#hdnSearchIdForDest").val(srcId);
    var src = document.getElementById("sourceName").innerText;
    var des = document.getElementById("destinationName").innerText;
    var sourceAddress = document.getElementById("sourceAddress").innerText;
    var destinationAddress = document.getElementById("destinationAddress").innerText;
    document.getElementById("sourceName").innerText = des;
    document.getElementById("sourceAddress").innerText = destinationAddress;
    document.getElementById("destinationName").innerText = src;
    document.getElementById("destinationAddress").innerText = sourceAddress;
}

function swap() {

    SwapSrcAndDes();

    if ($("#rdbTravelTypeAirport").is(':checked')) {
        if ($("#drop").hasClass("actv_air")) {
            $("#drop").removeClass("actv_air");
            $("#pickup").addClass("actv_air");
            document.getElementById("shwpickoptn").innerText = "Pick Up";
            document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
            document.getElementById("citiesForAirprtPickDrop").style.display = "none";
            document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "block";
        } else if ($("#pickup").hasClass("actv_air")) {
            $("#pickup").removeClass("actv_air");
            $("#drop").addClass("actv_air");
            document.getElementById("shwpickoptn").innerText = "Drop";
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
            document.getElementById("citiesForAirprtPickup").style.display = "none";
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "block";
        }
    }
    if ($("#rdbTravelTypeOther").is(':checked')) {
        if (document.getElementById("citiesWhenKeyIsLessForSrc").style.display == "block") {
            check = true;
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "block";
        } else {
            check = false;
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
        }
    }
}

function PartialPayment(id) {
    if (document.getElementById(id).style.display == "none") {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}

function ShowAutoSuggForSrc() {
    $("#showDestination").hide();
    $("#timepicker").hide();
    $("#hrforRent").hide();
    $("#airportpickdrop").hide();
    document.getElementById('showSource').style.display = "block";
    if ($("#pickup").hasClass("actv_air")) {
        document.getElementById('citiesForAirprtPickup').style.display = "block";
        document.getElementById('citiesWhenKeyIsLessForSrc').style.display = "none";
    } else {
        document.getElementById('citiesWhenKeyIsLessForSrc').style.display = "block";
        document.getElementById('citiesForAirprtPickup').style.display = "none";
    }
    document.getElementById('SlfDrivshowSource').style.display = "none";
    $("#a_FromSector_show").focus();
    event.stopPropagation();
}

function ShowAutoSuggForDest() {
    $("#showSource").hide();
    $("#timepicker").hide();
    $("#airportpickdrop").hide();
    document.getElementById('citiesWhenKeyIsLessForDestAfterSwap').style.display = "none";
    document.getElementById('showDestination').style.display = "block";
    $("#a_ToSector_show").focus();
    event.stopPropagation();
}

function ShowStaticAutoSuggForSrc(id) {
    sourceSelected = true;
    destSelected = false;
    AutosuggSearch($(".auto_sugg_tttl_nw")[Number(id) - 1].innerText, $(".auto_sugg_add_nw")[Number(id) - 1].innerText, sourceSelected);
    var IdMapping = ["map2z5f638120779189635599", "mapa97y638120779189637432", "mapqry1638120779189640069", "map7jtx638120779189641674", "mapqeu8638120779189643143", "mapz7tp638120779189644637", "mapvie1638120779189646171"];
    document.getElementById('sourceName').innerText = titleCase($(".auto_sugg_tttl_nw")[Number(id) - 1].innerText);
    document.getElementById('sourceAddress').innerText = titleCase($(".auto_sugg_add_nw")[Number(id) - 1].innerText);
    $("#hdnSearchIdForSrc").val(IdMapping[Number(id) - 1]);
    document.getElementById("showSource").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForDest(src, dest, id) {
    destSelected = true;
    sourceSelected = false;
    AutosuggSearch(src, dest, sourceSelected);
    var IdMapping = ["map7b69638120779579582161", "map10tc638120779579582474", "mapwqfl638120779579582722", "map3moj638120779579582956", "mapcij3638120779579583169", "map03un638120779579583369", "CTAR35", "CTAR69", "CTAR70", "CTAR479"];
    // document.getElementById('destinationName').innerText = titleCase(document.getElementById("citiesWhenKeyIsLessForDest").querySelectorAll('ul li')[Number(id)-1].childNodes[2].nextElementSibling.innerText);
    document.getElementById('destinationName').innerText = titleCase(src);
    document.getElementById('destinationAddress').innerText = titleCase(dest);
    $("#hdnSearchIdForDest").val(IdMapping[Number(id) - 1]);
    document.getElementById("showDestination").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForSwapSrc(src, dest, id) {
    sourceSelected = true;
    destSelected = false;
    AutosuggSearch(src, dest, sourceSelected);
    var IdMapping = ["map7b69638120779579582161", "map10tc638120779579582474", "mapwqfl638120779579582722", "map3moj638120779579582956", "mapcij3638120779579583169", "map03un638120779579583369", "CTAR35", "CTAR69", "CTAR70", "CTAR479"];
    // document.getElementById('destinationName').innerText = titleCase(document.getElementById("citiesWhenKeyIsLessForDest").querySelectorAll('ul li')[Number(id)-1].childNodes[2].nextElementSibling.innerText);
    document.getElementById('sourceName').innerText = titleCase(src);
    document.getElementById('sourceAddress').innerText = titleCase(dest);
    $("#hdnSearchIdForSrc").val(IdMapping[Number(id) - 1]);
    document.getElementById("showSource").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForSwapDest(id) {
    destSelected = true;
    sourceSelected = false;
    AutosuggSearch($(".auto_sugg_tttl_nw")[Number(id) - 1].innerText.trim(), $(".auto_sugg_add_nw")[Number(id) - 1].innerText, sourceSelected);
    var IdMapping = ["map2z5f638120779189635599", "mapa97y638120779189637432", "mapqry1638120779189640069", "map7jtx638120779189641674", "mapqeu8638120779189643143", "mapz7tp638120779189644637", "mapvie1638120779189646171"];
    document.getElementById('destinationName').innerText = titleCase($(".auto_sugg_tttl_nw")[Number(id) - 1].innerText);
    document.getElementById('destinationAddress').innerText = titleCase($(".auto_sugg_add_nw")[Number(id) - 1].innerText);
    $("#hdnSearchIdForDest").val(IdMapping[Number(id) - 1]);
    document.getElementById("showDestination").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForAirprtUpSrc(src, id) {
    sourceSelected = true;
    destSelected = false;
    AutosuggSearchAirport(src, '', sourceSelected);
    var IdMapping = ["321", "157997", "157998"];
    document.getElementById('sourceName').innerText = titleCase(src);
    document.getElementById('sourceAddress').innerText = "";
    $("#hdnSearchIdForSrc").val(IdMapping[Number(id) - 1]);
    document.getElementById("showSource").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForAirprtpickUpDest(src, dest, id) {
    destSelected = true;
    sourceSelected = false;
    AutosuggSearch(src, dest, sourceSelected);
    var IdMapping = ["29", "267"];
    document.getElementById('destinationName').innerText = titleCase(src);
    document.getElementById('destinationAddress').innerText = titleCase(dest);
    $("#hdnSearchIdForDest").val(IdMapping[Number(id) - 1]);
    document.getElementById("showDestination").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForAirprtpickUpSwapSrc(src, dest, id) {
    sourceSelected = true;
    destSelected = false;
    AutosuggSearch(src, dest, sourceSelected);
    var IdMapping = ["29", "267"];
    document.getElementById('sourceName').innerText = titleCase(src);
    document.getElementById('sourceAddress').innerText = titleCase(dest);
    $("#hdnSearchIdForSrc").val(IdMapping[Number(id) - 1]);
    document.getElementById("showSource").style.display = "none";
    event.stopPropagation();
}

function ShowStaticAutoSuggForAirprtDropSwapDest(dest, id) {
    destSelected = true;
    sourceSelected = false;
    AutosuggSearchAirport(dest, '', sourceSelected);
    var IdMapping = ["321", "157997", "157998"];
    document.getElementById('destinationName').innerText = titleCase(dest);
    document.getElementById('destinationAddress').innerText = "";
    $("#hdnSearchIdForDest").val(IdMapping[Number(id) - 1]);
    document.getElementById("showDestination").style.display = "none";
    event.stopPropagation();
}

function CurrentDate() {
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dt = new Date();
    var date = dt.getDate();
    if (dt.getDate() <= 9) {
        date = '0' + date;
    }
    var frmtdte = date + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();
    return frmtdte;
}

var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function UserDateIsCurrDate(userSelecteddate) {
    var dt = new Date();
    var frmtdte = dt.getDate().toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear();
    if (userSelecteddate == frmtdte) return true;
    return false;
    event.stopPropagation();

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

function Hour(id) {
    const ul = document.getElementById("hr").querySelectorAll('ul li');
    var hr = "";
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            ul[i].classList.remove("actvtab");
        }
    }
    ul[id - 1].classList.add("actvtab");
    hr = ul[id - 1].innerHTML.split(" ")[0];
    var time = document.getElementsByClassName("timec")[0].childNodes[1].innerHTML.split(":");

    if (Number(hr) <= 9) {
        hr = '0' + hr;
    }
    document.getElementsByClassName("timec")[0].childNodes[1].innerHTML = hr + ":" + time[1];

    //--------  From here the case start for current date for which we have to disable hr less than current hr -----------//

    var validHr = (SetTimeFormat()).split(":")[0]; // This is for the reference to get hr from selected time format
    var ap = GetAmPm();
    // In This iteration we are first removing blur effect if it is added
    //for (var i = 0; i < ul.length; i++) {
    //    ul[i].classList.remove("actvtab");
    //    ul[i].classList.remove("blurHr");
    //}
    var userSelectedDate = document.getElementById("datepicker").value;

    // In this case buddy we are checking case if selected date of pick up is equals to curr date in that case we are adding blur
    if ($("#datepicker").val() == CurrentDate() && ap == "AM") {
        // ul[i].classList.remove("actvtab");
        if (UserDateIsCurrDate(userSelectedDate) && Number(id) < Number(validHr)) {
            // var currTime = new Date(new Date().getTime()).toLocaleTimeString().split(" ")[1];
            var currHr = new Date(new Date().getTime()).getHours();
            var userSelectedHr = Number(document.getElementById("hr").querySelectorAll('ul li')[Number(id) - 1].innerText.split(" ")[0]);
            if (userSelectedHr < Number(hr) || (userSelectedHr > currHr)) {
                document.querySelector("#ap").childNodes[1].querySelector("label").classList.add("_gry");
                document.querySelector("#ap").childNodes[1].querySelector("input").disabled = true;
                document.querySelector("#ap").childNodes[1].querySelector("input").checked = false;
                document.querySelector("#ap").childNodes[3].querySelector("input").checked = true;
            }
        } else {
            document.querySelector("#ap").childNodes[1].querySelector("label").classList.remove("_gry");
            document.querySelector("#ap").childNodes[1].querySelector("input").disabled = false;
        }
    }
    ul[Number(hr) - 1].classList.add("actvtab");

    //--------  From here the case end for current date for which we have to disable hr less than current hr -----------//

    event.stopPropagation();
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

function min(id) {
    const ul = document.getElementById("min").querySelectorAll('ul li');
    var min = "";
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab"))
            ul[i].classList.remove("actvtab");
    }
    ul[id - 1].classList.add("actvtab");

    min = ul[id - 1].innerHTML.split(" ")[0];
    var time = document.getElementsByClassName("timec")[0].childNodes[1].innerHTML.split(":");
    document.getElementsByClassName("timec")[0].childNodes[1].innerHTML = time[0] + ":" + min;
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

function CheckDteIsCurrDteInCommonSearch() {
    var userDate = $("#datepicker").val().split(" ");
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

    if (userDate[2] == currDte.getFullYear() && userDate[0] == currDte.getDate() && mnthIndex == currDte.getMonth()) {
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

        const ul = document.getElementById("hr").querySelectorAll('ul li');

        if (document.querySelector("#ap").childNodes[3].querySelector("input").checked && ap == 'AM') {

            for (var i = 0; i < ul.length; i++) {
                ul[i].classList.remove("blurHr");
            }
        } else {
            for (var i = 0; i < ul.length; i++) {
                ul[i].classList.remove("blurHr");
                if (Number(document.getElementById("hr").querySelectorAll('ul li')[i].innerText.split(" ")[0]) < Number(hr) && hr != 12) {
                    ul[i].classList.add("blurHr");
                }
            }
        }

        document.getElementsByClassName("timec")[0].childNodes[1].innerHTML = hr + ":" + min;
        ul[Number(hr) - 1].classList.add("actvtab");

    }

}

function CommonAm() {
    if (document.querySelector("#ap").childNodes[1].querySelector("input").disabled) return;
    document.querySelector("#ap").childNodes[1].querySelector("input").checked = true;
    document.querySelector("#ap").childNodes[3].querySelector("input").checked = false;
    CheckDteIsCurrDteInCommonSearch();
    event.stopPropagation();
}

function CommonPm() {
    document.querySelector("#ap").childNodes[1].querySelector("input").checked = false;
    document.querySelector("#ap").childNodes[3].querySelector("input").checked = true;
    CheckDteIsCurrDteInCommonSearch();
    event.stopPropagation();
}

function DisableActiveTabOfTime() {
    // here we are disabling active tab for both return and pick up time
    const ul = document.getElementById("hr").querySelectorAll('ul li');
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            ul[i].classList.remove("actvtab");
        }
    }

    const ulMin = document.getElementById("min").querySelectorAll('ul li');
    for (var i = 0; i < ulMin.length; i++) {
        if (ulMin[i].classList.contains("actvtab")) {
            ulMin[i].classList.contains("actvtab");
        }
    }

}

function Done() {
    const ul = document.getElementById("hr").querySelectorAll('ul li');
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

    const ulMin = document.getElementById("min").querySelectorAll('ul li');
    for (var i = 0; i < ulMin.length; i++) {
        if (ulMin[i].classList.contains("actvtab")) {
            min = ulMin[i].innerHTML.split(" ")[0];

        }
    }

    // Nitin Buddy this line is for reference to know how you did this 
    //const ul = document.getElementsByClassName("radio-toolbar"); ul[0].childNodes;

    //const ul = document.getElementsByClassName("radio-toolbar");

    if (document.getElementsByClassName("radio-toolbar")[0].childNodes[1].querySelector("input").checked) {
        meridiem = document.getElementsByClassName("radio-toolbar")[0].childNodes[1].querySelector("input").value;
    } else {
        // ul[0].childNodes[3].querySelector("input").checked;  else if
        meridiem = document.getElementsByClassName("radio-toolbar")[0].childNodes[3].querySelector("input").value;
    }

    // Nitin Buddy this is the alternative easy method to check
    //const cb = document.querySelector('#am');
    //console.log(cb.checked);


    var time = hr + ":" + min + " " + meridiem;
    if (hr != "" && min != "") {
        document.getElementById("time").innerHTML = time;
        document.getElementsByClassName("timec")[0].childNodes[1].innerHTML = hr + ":" + min + " ";
    }
    $("#timepicker").toggle();
    event.stopPropagation();
}

function rDone() {
    const ul = document.getElementById("rhr").querySelectorAll('ul li');
    var hr = "";
    var min = "";
    var meridiem = "";
    for (var i = 0; i < ul.length; i++) {
        if (ul[i].classList.contains("actvtab")) {
            hr = Number(ul[i].innerHTML.split(" ")[0]);
            if (hr <= 9) {
                hr = "0" + hr;
            }
        }
    }

    const ulMin = document.getElementById("rmin").querySelectorAll('ul li');
    for (var i = 0; i < ulMin.length; i++) {
        if (ulMin[i].classList.contains("actvtab")) {
            min = ulMin[i].innerHTML.split(" ")[0];

        }
    }

    // Nitin Buddy this line is for reference to know how you did this 
    //const ul = document.getElementsByClassName("radio-toolbar"); ul[0].childNodes;

    //const ul = document.getElementsByClassName("radio-toolbar");

    if (document.querySelector("#rap").childNodes[1].querySelector("input").checked) {
        meridiem = document.querySelector("#rap").childNodes[1].querySelector("input").value;
    } else {
        // ul[0].childNodes[3].querySelector("input").checked;  else if
        meridiem = document.querySelector("#rap").childNodes[3].querySelector("input").value;
    }

    // Nitin Buddy this is the alternative easy method to check
    //const cb = document.querySelector('#am');
    //console.log(cb.checked);


    var time = hr + ":" + min + " " + meridiem;
    if (hr != "" && min != "") {
        document.getElementById("returntime").innerHTML = time;
        document.querySelector("#rtimec").childNodes[1].innerHTML = hr + ":" + min + " ";
    }
    $("#returntimepicker").toggle();
    event.stopPropagation();
}

function ReturnDate() {
    document.getElementById("rtag").style.display = "none";
    document.getElementById("returndateTime").style.display = "block";
    document.getElementById("rclandr").style.display = "none";
    document.getElementById("round").style.display = "block";
    var dt = "";
    var today = new Date();
    var todayDate = today.getDate();
    var todayplusOne = today.getDate() + 1;

    if ($("#hiddenSearchForSrc").val() == undefined) { // this case for home and other pages except cab SEO page to show current date
        dt = dateOfXDay(Number(($("#datepicker").val().split(" ")[0]) - todayDate) + 1);
    } else { // this case for cab SEO page to show current date + 1
        dt = dateOfXDay(Number(($("#datepicker").val().split(" ")[0]) - todayplusOne) + 2);
    }
    var mnth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var rdte = dt.getDate().toString().padStart(2, "0") + " " + mnth[dt.getMonth()] + " " + dt.getFullYear()
    document.getElementById("rdatepicker").value = rdte;
    IsReturn = true;
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

function HideReturn() {
    document.getElementById("rdatepicker").value = CurrentDatePlusOne();
    document.getElementById("returntime").innerText = "Select Time";
    document.getElementById("rtag").style.display = "block";
    document.getElementById("rclandr").style.display = "block";
    document.getElementById("returndateTime").style.display = "none";
    document.getElementById("round").style.display = "none";
    IsReturn = false;
}

$(document).on("click", function(event) {
    // Hide the div when you click outside
    $(document).click(function() {
        document.getElementById('a_FromSector_show').value = "";
        document.getElementById('a_FromSector_show').placeholder = "From";
        $("#showSource").hide();
    });
    Done();
    rDone();
    $("#timepicker").hide();

    $("#airportdiv").click(function(event) {
        $("#timepicker").hide();
        event.stopPropagation();
    });

    // This is the case of hourly 
    $("#timePicker").click(function(event) {
        event.stopPropagation();
    });

    $("#showreturnTime").click(function(event) {

        event.stopPropagation();
    });

    $(document).click(function() {
        $("#hrforRent").hide();
        event.stopPropagation();
    })

    $("#timePicker").click(function(event) {
        $("#hrforRent").show();
        event.stopPropagation();
    });
    // This is the case of hourly end

    $(".wtsk").click(function(event) {
        event.stopPropagation();
    });

    $(".timec").click(function(event) {
        event.stopPropagation();
    });

    $("#returntimepicker").hide();
    // rDone();
    $("#hrmin").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#showSource").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    //  $("#sourceName").click(function (event) {}
    $(".srcShow").click(function(event) {

        if (document.getElementById("StartCity").style.display == "block") {
            const ul = document.getElementById("StartCity").querySelectorAll('ul li');
            for (var i = 0; i < ul.length; i++) {
                ul[i].remove();
            }
            document.getElementById("StartCity").style.display == "none";
        }

        if ($("#pickup").hasClass("actv_air")) {
            document.getElementById("citiesForAirprtPickup").style.display = "block";
            //  if (document.getElementById("sourceName").innerText.toLowerCase() == "delhi") {
            document.getElementById("citiesForAirprtPickup").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";

            // }
        }

        if ($("#drop").hasClass("actv_air")) {
            //if (document.getElementById("citiesForAirprtPickUpAfterSwap").style.display != "block") {
            //    document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
            //}
            //if (document.getElementById("citiesForAirprtPickUpAfterSwap").style.display != "block") {
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "none";
            document.getElementById("citiesWhenKeyIsLessForSrcAfterSwap").style.display = "block";
            //}
        }

        if ($("#rdbTravelTypeHourly").is(':checked')) {
            document.getElementById("citiesWhenKeyIsLessForSrc").style.display = "block";
            document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
            document.getElementById("citiesForAirprtPickup").style.display = "none";
            document.getElementById("citiesForAirprtPickDrop").style.display = "none";


        }

        if ($("#rdbTravelTypeOther").is(':checked')) {
            document.getElementById("citiesForAirprtPickUpAfterSwap").style.display = "none";
            document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
            PropertiesAfterSrcSwap();
        }

        $("#showSource").show();

        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        document.getElementById('a_ToSector_show').value = "";
        document.getElementById('a_ToSector_show').placeholder = "To";
        $("#showDestination").hide();
    });

    // Prevent the click event from propagating to the document
    $("#showDestination").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $(".destShow").click(function(event) {
        if (document.getElementById("EndCity").style.display == "block") {
            const ul = document.getElementById("EndCity").querySelectorAll('ul li');
            for (var i = 0; i < ul.length; i++) {
                ul[i].remove();
            }
            document.getElementById("EndCity").style.display == "none";

        }

        if ($("#rdbTravelTypeAirport").is(':checked')) {
            if ($("#pickup").hasClass("actv_air")) {
                // if (document.getElementById("destinationName").innerText.toLowerCase() == "agra") {
                // document.getElementById("citiesForAirprtPickup").style.display = "block";
                document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
                document.getElementById("citiesWhenKeyIsLessForDest").style.display = "block";
                //}
            }
            if ($("#drop").hasClass("actv_air")) {
                document.getElementById("citiesForAirprtPickDrop").style.display = "block";
                if (document.getElementById("citiesForAirprtPickUpAfterSwap").style.display == "block") {
                    document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                    document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                    document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "none";
                }
                //if (document.getElementById("destinationName").innerText.toLowerCase() == "delhi") {
                document.getElementById("citiesForAirprtPickDrop").style.display = "none";
                document.getElementById("citiesWhenKeyIsLessForDest").style.display = "none";
                document.getElementById("citiesWhenKeyIsLessForDestAfterSwap").style.display = "none";
                document.getElementById("citiesForAirprtPickDropAfterSwap").style.display = "block";
                //}
            }
        }

        if ($("#rdbTravelTypeOther").is(':checked')) {
            PropertiesAfterDestSwap();
        }

        $("#showDestination").show();

        event.stopPropagation();
    });

    // Hide the div when you click outside
    $(document).click(function() {
        $("#airportpickdrop").hide();
    });

    // Prevent the click event from propagating to the document
    $("#airport").click(function(event) {
        event.stopPropagation();
    });

    // Prevent the click event from propagating to the document
    $("#airport").click(function(event) {
        $("#airportpickdrop").show();
        event.stopPropagation();
    });

    $("#airprtdrpdwn").click(function(event) {
        $("#airportpickdrop").show();
        event.stopPropagation();
    });

    $("#shwpickoptn").click(function(event) {
        $("#airportpickdrop").show();
        event.stopPropagation();
    });

});

//caches.open('LastTwoRecentSearch').then(cache => {
//});

//caches.open('LastTwoRecentSearch').then(cache => {
//    cache.add(url).then(() => {
//        console.log("Data cached");
//    });
//});