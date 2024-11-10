var app = angular.module("homeapp", []);
app.controller("transferCont", transferCont);
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
var travelType;
var FromResponseObject = [];
var ToResponseObject = [];
var WhichPoint;

app.run(function($rootScope, $location, $anchorScroll, $window) {
    //when the route is changed scroll to the proper element.
    // $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    //   console.log("called routeChangeSuccess");
    //   if ($location.hash()) $anchorScroll();
    // });
    $rootScope.goTo = function(value) {
        $location.hash(value);
    };
    $rootScope.GotoProduct = function(type) {
        var lookup = {
            "dashboard": true,
            "home": true,
            "miscellaneous": true,
            "seo": true
        };
        var url = "";
        try {
            var ckurl = location.pathname.split('/')[1];
            ckurl = ckurl.toLowerCase();
            if (lookup[ckurl] == true) {
                url = $window.location.origin + type;
            } else {
                url = $window.location.origin + "/" + ckurl + type;
            }
            //var url = $window.location.origin + type;
            $window.location.href = url;
        } catch (ex) {}
    };

    $rootScope.Logout = function() {
        try {
            var url = "";
            url = AddedPath();
            document.cookie = "sescookie" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            $window.location.href = $window.location.origin + url; //+ AddedPath();
        } catch (ex) {}
    };

    function AddedPath() {
        var lookup = {
            "dashboard": true,
            "home": true,
            "miscellaneous": true,
            "seo": true
        };
        var url = "";
        var ckurl = location.pathname.split('/')[1];
        ckurl = ckurl.toLowerCase();
        if (lookup[ckurl] == true) {
            url = "";
        } else {
            url = "/" + ckurl;
        }
        return url;
    };
});

function transferCont($scope, $window, $http, $sce) {
    var lookup = {
        "dashboard": true
    };

    function BuildPath(path) {
        var url = "";
        var ckurl = location.pathname.split('/')[1];
        ckurl = ckurl.toLowerCase();
        if (lookup[ckurl] == true || ckurl == '') {
            url = location.origin + path;
        } else {
            url = location.origin + "/" + ckurl + path;
        }
        return url;
    };

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };
    $scope.SolarCount = 2;
    $scope.StartCityOpen = false;
    $scope.StartCityOpenForSelfDrive = false;
    $scope.hdnSrchSrcStnCode = "";
    $scope.hdnSrchDesStnCode = "";
    $scope.age = "";
    $scope.hdnSrchSrcCntry = "";
    $scope.hdnSrchDesCntry = "";
    $scope.hdnSrchSrcCntryCode = "";
    $scope.hdnSrchDesCntryCode = "";
    $scope.LiveIn = "";
    $scope.EndCityOpen = false;
    $scope.EndCityOpenForSelfDrive = false;
    $scope.SearchDetail = {};
    $scope.SearchDetail.Occupancy = {};
    $scope.SearchDetail.From = {};
    $scope.SearchDetail.To = {};
    $scope.SearchDetail.TravelType = "other";
    $scope.SearchDetail.Occupancy.Adults = "4";
    $scope.SearchDetail.Occupancy.Children = "0";
    $scope.SearchDetail.Occupancy.Infants = "0";
    $scope.SearchDetail.Departure = {};
    $scope.SearchDetail.ComeBack = {};
    $scope.SearchDetail.TripType = "pickup";
    $scope.paxdetails = "";
    $scope.ValidsrCity = "";
    $scope.ShowPaxDetail = $scope.SearchDetail.Occupancy.Adults + " adt," + $scope.SearchDetail.Occupancy.Children + " chd," + $scope.SearchDetail.Occupancy.Infants + " inf";
    $scope.paxdetails = $scope.SearchDetail.Occupancy.Adults + "/" + $scope.SearchDetail.Occupancy.Children + "/" + $scope.SearchDetail.Occupancy.Infants + "/";
    //$scope.urllist = "http://stagingtransfer.easemytrip.com";
    //$scope.urlautosearch = "http://stagingtransferapi.easemytrip.com";
    $scope.urllist = "https://transfer.easemytrip.com";
    $scope.urlautosearch = "https://transferapi.easemytrip.com";
    $scope.isoffer = false;
    $scope.LoadInitial = function() {
        //  $scope.SearchDetail.TravelType = "other";
        //   $scope.returndiv="open";
        var ip = null;
        var visiterId = $scope.getCookie("EVisiterID");
        var device = $scope.isMobile();
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

        var data = sessionStorage.getItem("key");
        if (data != undefined && data != null) {
            var value = JSON.parse(data);
            $scope.SearchDetail = value;
            from = $scope.SearchDetail.From;
            to = $scope.SearchDetail.To;
            if ($scope.SearchDetail.TravelType == "hourly" || $scope.SearchDetail.TravelType == "airport" || $scope.SearchDetail.TravelType == "airportpickup" || $scope.SearchDetail.TravelType == "airportdrop") {
                document.getElementById('dvReturnDate').style.display = "none";
                $scope.returndiv = "close"; //close
                /* if($scope.SearchDetail.TravelType=="hourly")
                {
                    $scope.SearchDetail.TripType = "4";
                }
                else{
                     $scope.SearchDetail.TripType = "pickup";
                } */
            } else {
                $scope.SearchDetail.TravelType = "other";
                $scope.returndiv = "open";
                document.getElementById('dvReturnDate').style.display = "block";
                $scope.SearchDetail.TripType = "pickup";
                if ($scope.SearchDetail.ComeBack != undefined && $scope.SearchDetail.ComeBack != null && $scope.SearchDetail.ComeBack != "" && $scope.SearchDetail.ComeBack.Date != "" && $scope.SearchDetail.ComeBack.Time != "") {
                    $scope.IsReturn = true;
                }
            }
            sessionStorage.clear();
            //$sessionStorage.reset();
        } else {
            $scope.SearchDetail.TravelType = "other";
            $scope.SearchDetail.TripType = "pickup";
            $scope.returndiv = "open";
        }


        $scope.OfferLoad();
    };
    $scope.OfferList = [];
    $scope.OfferLoad = function() {
        var url = $scope.urlautosearch + "/api/offer/offerlist/home";
        $http({
            method: "GET",
            url: url,
        }).then(function(response) {
            $scope.isoffer = false;
            if (response.data != null && response.data != "" && response.data.offers != null) {
                $scope.isoffer = true;
                $scope.OfferList = response.data.offers[0].List;
            }
        });
    }

    function EncryptionV1(number) {
        console.log(number);
        var key = CryptoJS.enc.Utf8.parse(decKey);
        var iv = CryptoJS.enc.Utf8.parse(decKey);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(number), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var encKey = "EDMEMT1234";
    var decKey = "TMTOO1vDhT9aWsV1";

    function decryptV1(message) {
        var key = CryptoJS.enc.Utf8.parse(decKey);
        var iv = CryptoJS.enc.Utf8.parse(decKey);
        var decrypted = CryptoJS.AES.decrypt(message, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    var UserIp = getCookie('UserIP');
    $scope.SearchDetail.Name = "";

    var sourceSelected = false;
    var destSelected = false;

    $scope.getCookie = function(cookieName) {
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

    $scope.isMobile = function() {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent) ? "Mobile" : "Desktop";
    }

    $scope.ValueIfNullOrEmpty = function(res) {
        return res ? res : "";
    }

    $scope.AutosuggSearch = function(value, WhichPoint) {
        var solr = true;
        FromResponseObject = [];
        ToResponseObject = [];
        urlType = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA==";
        if (value.length > 2) {
            $http({
                url: urlType,
                method: "GET",
                dataType: "json"
            }).then(function(res) {
                if (res.data != "1") {
                    if (res.data != null && res.data.length > 0 && solr == true) {

                        if (solr == true) {

                            var data = res.data;
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
                                if (WhichPoint) {
                                    from = {
                                        "name": $scope.ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": $scope.ValueIfNullOrEmpty(element.countryIso2),
                                        "type": $scope.ValueIfNullOrEmpty(element.Type),
                                        "state": $scope.ValueIfNullOrEmpty(element.state),
                                        "city": $scope.ValueIfNullOrEmpty(element.city),
                                        "address": $scope.ValueIfNullOrEmpty(element.locationName)
                                    };
                                    FromResponseObject.push(from);
                                } else {
                                    to = {
                                        "name": $scope.ValueIfNullOrEmpty(element.name[0]),
                                        "lat": element.latitude ? element.latitude : 0.0,
                                        "long": element.longitude ? element.longitude : 0.0,
                                        "countryCode": $scope.ValueIfNullOrEmpty(element.countryIso2),
                                        "type": $scope.ValueIfNullOrEmpty(element.Type),
                                        "state": $scope.ValueIfNullOrEmpty(element.state),
                                        "city": $scope.ValueIfNullOrEmpty(element.city),
                                        "address": $scope.ValueIfNullOrEmpty(element.locationName)
                                    };
                                    ToResponseObject.push(to);
                                }

                            });
                        }
                    }
                } else {
                    if (res.data != null && res.data.CityList.length > 0 && solr == true) {
                        if (solr == true) {
                            let r = Object.entries(res.data)[2];
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
                                    if (WhichPoint) {
                                        from = {
                                            "name": $scope.ValueIfNullOrEmpty(element.Name),
                                            "lat": element.latitude ? element.latitude : 0.0,
                                            "long": element.longitude ? element.longitude : 0.0,
                                            "countryCode": $scope.ValueIfNullOrEmpty(element.countryCode),
                                            "type": $scope.ValueIfNullOrEmpty(element.Type),
                                            "state": $scope.ValueIfNullOrEmpty(element.state),
                                            "city": $scope.ValueIfNullOrEmpty(element.city),
                                            "address": $scope.ValueIfNullOrEmpty(element.Address)
                                        };
                                        FromResponseObject.push(from);
                                    } else {
                                        to = {
                                            "name": $scope.ValueIfNullOrEmpty(element.name[0]),
                                            "lat": element.latitude ? element.latitude : 0.0,
                                            "long": element.longitude ? element.longitude : 0.0,
                                            "countryCode": $scope.ValueIfNullOrEmpty(element.countryIso2),
                                            "type": $scope.ValueIfNullOrEmpty(element.Type),
                                            "state": $scope.ValueIfNullOrEmpty(element.state),
                                            "city": $scope.ValueIfNullOrEmpty(element.city),
                                            "address": $scope.ValueIfNullOrEmpty(element.locationName)
                                        };
                                        ToResponseObject.push(to);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    $scope.AutosuggSearchAirport = function(value, address) {
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

    $scope.SearchStartCity = function() {
        let change = false;
        let solr = true;
        $scope.ValidsrCity = "";
        var value = $scope.SearchDetail.StartCity.Name;
        if (value != undefined && value != null && value.length > 2) {
            //var url = $scope.urlautosearch + "/api/autosearch/city/city/" + value
            var url = "https://solr.easemytrip.com/v1/api/auto/GetCabAutoSuggest/" + value;
            //var url = "https://demo10.easemytrip.com/api/auto/GetCabAutoSuggest/" + value;
            if ($scope.SearchDetail.TravelType == 'airport' && $scope.SearchDetail.TripType == "pickup") {
                url = $scope.urlautosearch + "/api/autosearch/city/" + $scope.SearchDetail.TravelType + "/" + value;
                change = true;


                $http({
                    method: "GET",
                    params: $scope.SearchDetail,
                    url: url

                }).then(function(response) {
                    if (change) {
                        $scope.StartCityOpen = true;
                        $scope.StartCity = response.data.CityList;
                    } else {
                        $scope.StartCityOpen = false;
                        $scope.ValidsrCity = "Source City Not found";
                        document.getElementById('dvautosearchstart').style.display = "block";
                    }
                });
            } else {

                if ($scope.SolarCount == 2 && $scope.SearchDetail.TravelType == "selfdrive") {
                    $scope.SolarStartAutoForSelfDrive();
                } else if ($scope.SolarCount == 2 && $scope.SearchDetail.TravelType != "selfdrive") {
                    $scope.SolarStartAutoNew();
                } else {
                    $scope.SolarStartAuto();
                }
                /* $scope.SolarStartAuto(); */
            }
        }
        //else{
        //	$scope.StartCityOpen = false;
        //    $scope.ValidsrCity = "Enter Source City";
        //}
    }

    $scope.SolarStartAuto = function() {
        $scope.StartCityOpen = true;
        let solr = true;
        var url = "https://solr.easemytrip.com/v1/api/auto/GetCabAutoSuggestUI";
        var value = $scope.SearchDetail.StartCity.Name;
        var req = {
            Prefix: value,
            _type: 'CAB'
        };
        var RQ = {};
        RQ.request = EncryptionV1(JSON.stringify(req));

        $.ajax({
            type: "Post",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            url: url,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('useridentity', EncryptionV1("EMTUSER|" + UserIp));
            },
            data: JSON.stringify(RQ)

        }).then(function(response) {
            response = decryptV1(response);
            //console.log(response);
            response = JSON.parse(response);
            if (response != null && response.length > 0 && solr == true) {
                $scope.StartCity = [];
                if (solr == true) {
                    response.forEach(element => {
                        $scope.Cv = {};
                        $scope.Cv.Name = element.name;
                        $scope.Cv.Id = element.emtCommonId;
                        $scope.StartCity.push($scope.Cv);
                    });
                    //$scope.StartCityOpen = true;
                }
            } else {
                $scope.StartCityOpen = false;
                $scope.ValidsrCity = "Source City Not found";
                document.getElementById('dvautosearchstart').style.display = "block";
            }
            $scope.$apply()
        });

    }

    $scope.SolarStartAutoNew = function() {
        $scope.StartCityOpen = true;
        FromResponseObject = [];
        ToResponseObject = [];
        let solr = true;
        var value = $scope.SearchDetail.StartCity.Name;
        var url = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA=="

        $http({
            method: "GET",
            url: url

        }).then(function(response) {

            if (response != null && response.data != null && response.data.length > 0 && solr == true) {

                if (solr == true) {
                    $scope.StartCity = [];
                    $scope.data = response.data;
                    $scope.data.forEach(element => {
                        $scope.Cv = {};
                        if (element.type != undefined && element.type != null) {
                            $scope.Cv.Type = element.type.toLowerCase();
                        } else {
                            $scope.Cv.Type = "";
                        }
                        $scope.Cv.Name = element.name[0];
                        if ($scope.Cv.Type == "train_station_pro") {
                            var nm = $scope.Cv.Name.split('-');
                            if (nm.length > 1) {
                                $scope.Cv.Name = nm[1];
                            }
                            $scope.Cv.code = element.code;
                        }

                        if (element.city != undefined && element.city != null) {
                            //$scope.Cv.Name = element.name[0] +","+element.city;
                            $scope.Cv.city = element.city.toLowerCase();
                        }


                        if (element.state != undefined && element.state != null) {
                            //$scope.Cv.Name = $scope.Cv.Name +","+ element.state;
                            $scope.Cv.state = element.state.toLowerCase();
                        }
                        if (element.district != undefined && element.district != null) {
                            //$scope.Cv.Name = $scope.Cv.Name +","+ element.state;
                            $scope.Cv.district = element.district.toLowerCase();
                        }
                        $scope.Cv.Name = $scope.Cv.Name.toLowerCase();
                        $scope.Cv.Id = element.emtCode;

                        if (element.address != undefined && element.address != null) {
                            $scope.Cv.Address = element.address[0].toLowerCase();
                        } else {
                            if ($scope.Cv.city != undefined && $scope.Cv.city != null)
                                $scope.Cv.Address = $scope.Cv.city;
                            if ($scope.Cv.district != undefined && $scope.Cv.district != null) {
                                if ($scope.Cv.Address != undefined) {
                                    $scope.Cv.Address = $scope.Cv.Address + "," + $scope.Cv.district;
                                } else {
                                    $scope.Cv.Address = $scope.Cv.district;
                                }

                            }
                            if ($scope.Cv.state != undefined && $scope.Cv.state != null) {
                                if ($scope.Cv.Address != undefined) {
                                    $scope.Cv.Address = $scope.Cv.Address + "," + $scope.Cv.state;
                                } else {
                                    $scope.Cv.Address = $scope.Cv.state;
                                }
                            }

                        }

                        $scope.StartCity.push($scope.Cv);
                        var FromData = {};
                        FromData = {
                            "id": element.emtCode,
                            "name": $scope.ValueIfNullOrEmpty(element.name[0]),
                            "lat": element.latitude ? element.latitude : 0.0,
                            "long": element.longitude ? element.longitude : 0.0,
                            "countryCode": $scope.ValueIfNullOrEmpty(element.countryIso2),
                            "type": $scope.ValueIfNullOrEmpty(element.Type),
                            "state": $scope.ValueIfNullOrEmpty(element.state),
                            "city": $scope.ValueIfNullOrEmpty(element.city),
                            "address": $scope.ValueIfNullOrEmpty(element.locationName)
                        };
                        FromResponseObject.push(FromData);
                    });
                    $scope.StartCityOpen = true;
                }

            } else {
                $scope.StartCity = [];
                $scope.StartCityOpen = false;
                $scope.ValidsrCity = "Source City Not found";
            }
            $scope.$apply()
        });

    }

    $scope.SrcData = [];
    $scope.DesData = [];

    $scope.SolarStartAutoForSelfDrive = function() {
        $scope.StartCityOpen = false;
        $scope.StartCityOpenForSelfDrive = true;
        let solr = true;
        var value = $scope.SearchDetail.StartCity.Name;
        var url = "https://transferapi.easemytrip.com/api/selfautosearch/location/" + value;

        $http({
            method: "GET",
            url: url

        }).then(function(response) {
            if (response.data[0].list.length != 0) {
                var cityData = [];
                var StationCode = [];
                var data = response.data[0].list;
                var x = 0;
                data.forEach(element => {
                    if (x == 30) return;
                    ++x;
                    StationCode.push(element.stationCode);
                })
                x = 0;

                for (var i = 0; i < StationCode.length; i++) {
                    var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/locationdetail/" + StationCode[i];

                    $http({
                        method: "GET",
                        url: urlType

                    }).then(function(element) {
                        $scope.ResponseProperties = {};
                        $scope.ResponseProperties.showName = element.data.showName;
                        $scope.ResponseProperties.stationCode = element.data.stationCode;
                        $scope.ResponseProperties.stationName = element.data.stationName;
                        $scope.ResponseProperties.type = element.data.type;
                        $scope.ResponseProperties.city = element.data.city;
                        $scope.ResponseProperties.country = element.data.country;
                        $scope.ResponseProperties.countryCode = element.data.countryCode;
                        $scope.ResponseProperties.address1 = element.data.address1;
                        $scope.ResponseProperties.address2 = element.data.address2;
                        $scope.ResponseProperties.clientCode = element.data.clientCode;
                        $scope.ResponseProperties.clientName = element.data.clientName;
                        $scope.ResponseProperties.distance = element.data.distance;
                        $scope.ResponseProperties.email = element.data.email;
                        $scope.ResponseProperties.latitude = element.data.latitude;
                        $scope.ResponseProperties.longitude = element.data.longitude;
                        $scope.ResponseProperties.phoneCountryCode = element.data.phoneCountryCode;
                        $scope.ResponseProperties.phoneWithInternationalDialling = element.data.phoneWithInternationalDialling;
                        cityData.push($scope.ResponseProperties);
                        $scope.SrcData = cityData;
                    });
                }
            } else {
                $scope.SrcData = [];
                $scope.StartCityOpenForSelfDrive = false;
                $scope.ValidsrCity = "Source City Not found";
            }
            $scope.$apply()
        });

    }

    $scope.Searchtype = "";
    $scope.startcity = function() {
        WhichPoint = true;
        document.getElementById('dvautosearchstart').style.display = "block";
        document.getElementById('dvsearch').style.display = "none";
        document.getElementById('topid').style.display = "none";
        $scope.Searchtype = "SourceCity";
        document.getElementById("ddlSource").focus();
    };
    $scope.DestinationCityOn = function() {
        WhichPoint = false;
        document.getElementById('dvautosearchend').style.display = "block";
        document.getElementById('dvsearch').style.display = "none";
        document.getElementById('topid').style.display = "none";
        $scope.Searchtype = "EndCity";
        //$scope.SearchDetail.Name = "";
        document.getElementById("ddlDestination").focus();
    };
    $scope.startcityOff = function() {
        document.getElementById('dvautosearchstart').style.display = "none";
        document.getElementById('dvsearch').style.display = "block";
        document.getElementById('topid').style.display = "block";
        $scope.Searchtype = "";
    };
    $scope.DestinationCityOff = function() {
        document.getElementById('dvautosearchend').style.display = "none";
        document.getElementById('dvsearch').style.display = "block";
        document.getElementById('topid').style.display = "block";
        $scope.Searchtype = "";
    };
    $scope.SearchEndCity = function() {
        $scope.ValidedCity = "";
        let change = false;
        let solr = true;
        var value = $scope.SearchDetail.EndCity.Name;
        if (value != undefined && value != null && value.length > 2) {
            var url = "https://solr.easemytrip.com/v1/api/auto/GetCabAutoSuggest/" + value
            //var url = $scope.urlautosearch + "/api/autosearch/city/city/" + value
            //var url = "https://demo10.easemytrip.com/api/auto/GetCabAutoSuggest/"+ value
            if ($scope.SearchDetail.TravelType == 'airport' && $scope.SearchDetail.TripType == "drop") {
                url = $scope.urlautosearch + "/api/autosearch/city/" + $scope.SearchDetail.TravelType + "/" + value;
                change = true;

                $http({
                    method: "GET",
                    params: $scope.SearchDetail,
                    url: url

                }).then(function(response) {
                    if (change) {
                        $scope.EndCityOpen = true;
                        $scope.EndCity = response.data.CityList;
                    } else {
                        $scope.EndCityOpen = false;
                        $scope.ValidedCity = " Destination City Not Found";
                    }
                    /* else {
                        if (response.data.status != "ZERO_RESULTS" && response.data.predictions != null && response.data.predictions != undefined) {
    	
                            $scope.ValidedCity = "";
                            $scope.EndCity = [];
                            $scope.data = response;
                            response.data.predictions.forEach(element => {
                                $scope.Cv = {};
                                //cv.Name= element.description;
                                $scope.Cv.Name = element.structured_formatting.main_text;
                                $scope.Cv.Address = element.structured_formatting.secondary_text;
                                $scope.Cv.Id = element.place_id;
                                $scope.EndCity.push($scope.Cv);
                            });
                            $scope.EndCityOpen = true;
                        }
                        else if(response.data.Status && response.data.CityList!=undefined && response.data.CityList!=null && response.data.CityList.length>0){
                            $scope.EndCityOpen = true;
                            $scope.EndCity = response.data.CityList;
                        }
                        else if(response.status == 200 && solr==true)
                        {
                            $scope.EndCity = [];
                            if(solr == true)
                            {
                            response.data.forEach(element => {
                                $scope.Cv = {};
                                $scope.Cv.Name = element.name;
                                $scope.Cv.Id = element.emtCommonId;
                                $scope.EndCity.push($scope.Cv);
                            });	
                            $scope.EndCityOpen = true;
                            }
                        }
                        else {
                            $scope.EndCityOpen = false;
                            $scope.ValidedCity = " Destination City Not Found";
                        }
                    } */
                });
            } else {
                if ($scope.SolarCount == 2 && $scope.SearchDetail.TravelType == "selfdrive") {
                    $scope.SolarEndAutoForSelfDrive();
                } else if ($scope.SolarCount == 2 && $scope.SearchDetail.TravelType != "selfdrive") {
                    $scope.SolarEndAutoNew();
                } else {
                    $scope.SolarEndAuto();
                }
                /* $scope.SolarEndAuto(); */
            }
        }
        //else{
        //	$scope.EndCityOpen = false;
        //            $scope.ValidedCity = "Enter Destination City";
        //}
    }

    $scope.SolarEndAuto = function() {
        $scope.EndCityOpen = true;
        let solr = true;
        var url = "https://solr.easemytrip.com/v1/api/auto/GetCabAutoSuggestUI";
        var value = $scope.SearchDetail.EndCity.Name;
        var req = {
            Prefix: value,
            _type: 'CAB'
        };
        var RQ = {};
        RQ.request = EncryptionV1(JSON.stringify(req));

        $.ajax({
            type: "Post",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            url: url,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('useridentity', EncryptionV1("EMTUSER|" + UserIp));
            },
            data: JSON.stringify(RQ)

        }).then(function(response) {
            response = decryptV1(response);
            //console.log(response);
            response = JSON.parse(response);
            if (response != null && response.length > 0 && solr == true) {
                $scope.EndCity = [];
                if (solr == true) {
                    response.forEach(element => {
                        $scope.Cv = {};
                        $scope.Cv.Name = element.name;
                        $scope.Cv.Id = element.emtCommonId;
                        $scope.EndCity.push($scope.Cv);
                    });
                    //$scope.StartCityOpen = true;
                }
            } else {
                $scope.EndCityOpen = false;
                $scope.ValidedCity = " Destination City Not Found";
            }
            $scope.$apply()
        });

    }

    $scope.SolarEndAutoNew = function() {
        $scope.EndCityOpen = true;
        FromResponseObject = [];
        ToResponseObject = [];
        let solr = true;
        var value = $scope.SearchDetail.EndCity.Name;
        var url = "https://solr.easemytrip.com/v1/api/autocomplete/common?search=" + value + "&key=jNUYK0Yj5ibO6ZVIkfTiFA=="

        $http({
            method: "GET",
            url: url

        }).then(function(response) {
            if (response != null && response.data.length > 0 && solr == true) {

                if (solr == true) {
                    $scope.EndCity = [];
                    $scope.data = response.data;
                    $scope.data.forEach(element => {
                        $scope.Cv = {};
                        if (element.type != undefined && element.type != null) {
                            $scope.Cv.Type = element.type.toLowerCase();
                        } else {
                            $scope.Cv.Type = "";
                        }
                        $scope.Cv.Name = element.name[0];
                        if ($scope.Cv.Type == "train_station_pro") {
                            var nm = $scope.Cv.Name.split('-');
                            if (nm.length > 1) {
                                $scope.Cv.Name = nm[1];
                            }
                            $scope.Cv.code = element.code;
                        }

                        if (element.city != undefined && element.city != null) {
                            //$scope.Cv.Name = element.name[0] +","+element.city;
                            $scope.Cv.city = element.city.toLowerCase();
                        }
                        if (element.district != undefined && element.district != null) {
                            //$scope.Cv.Name = $scope.Cv.Name +","+ element.state;
                            $scope.Cv.district = element.district.toLowerCase();
                        }

                        if (element.state != undefined && element.state != null) {
                            //$scope.Cv.Name = $scope.Cv.Name +","+ element.state;
                            $scope.Cv.state = element.state.toLowerCase();
                        }
                        $scope.Cv.Name = $scope.Cv.Name.toLowerCase();
                        $scope.Cv.Id = element.emtCode;

                        if (element.address != undefined && element.address != null) {
                            $scope.Cv.Address = element.address[0].toLowerCase();
                        } else {
                            if ($scope.Cv.city != undefined && $scope.Cv.city != null)
                                $scope.Cv.Address = $scope.Cv.city;
                            if ($scope.Cv.district != undefined && $scope.Cv.district != null) {
                                if ($scope.Cv.Address != undefined) {
                                    $scope.Cv.Address = $scope.Cv.Address + "," + $scope.Cv.district;
                                } else {
                                    $scope.Cv.Address = $scope.Cv.district;
                                }

                            }
                            if ($scope.Cv.state != undefined && $scope.Cv.state != null) {
                                if ($scope.Cv.Address != undefined) {
                                    $scope.Cv.Address = $scope.Cv.Address + "," + $scope.Cv.state;
                                } else {
                                    $scope.Cv.Address = $scope.Cv.state;
                                }
                            }
                        }
                        $scope.EndCity.push($scope.Cv);
                        var ToData = {};
                        ToData = {
                            "id": element.emtCode,
                            "name": $scope.ValueIfNullOrEmpty(element.name[0]),
                            "lat": element.latitude ? element.latitude : 0.0,
                            "long": element.longitude ? element.longitude : 0.0,
                            "countryCode": $scope.ValueIfNullOrEmpty(element.countryIso2),
                            "type": $scope.ValueIfNullOrEmpty(element.Type),
                            "state": $scope.ValueIfNullOrEmpty(element.state),
                            "city": $scope.ValueIfNullOrEmpty(element.city),
                            "address": $scope.ValueIfNullOrEmpty(element.locationName)
                        };
                        ToResponseObject.push(ToData);
                    });
                    $scope.EndCityOpen = true;
                }
            } else {
                $scope.EndCityOpen = false;
                $scope.ValidedCity = " Destination City Not Found";
            }
            $scope.$apply()
        });

    }

    $scope.SolarEndAutoForSelfDrive = function() {
        $scope.EndCityOpen = false;
        $scope.EndCityOpenForSelfDrive = true;
        let solr = true;
        var value = $scope.SearchDetail.EndCity.Name;
        var url = "https://transferapi.easemytrip.com/api/selfautosearch/location/" + value;

        $http({
            method: "GET",
            url: url

        }).then(function(response) {
            if (response.data[0].list.length != 0) {
                var cityData = [];
                var StationCode = [];
                var data = response.data[0].list;
                var x = 0;
                data.forEach(element => {
                    if (x == 30) return;
                    ++x;
                    StationCode.push(element.stationCode);
                })
                x = 0;

                for (var i = 0; i < StationCode.length; i++) {
                    var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/locationdetail/" + StationCode[i];

                    $http({
                        method: "GET",
                        url: urlType

                    }).then(function(element) {
                        $scope.ResponseProperties = {};
                        $scope.ResponseProperties.showName = element.data.showName;
                        $scope.ResponseProperties.stationCode = element.data.stationCode;
                        $scope.ResponseProperties.stationName = element.data.stationName;
                        $scope.ResponseProperties.type = element.data.type;
                        $scope.ResponseProperties.city = element.data.city;
                        $scope.ResponseProperties.country = element.data.country;
                        $scope.ResponseProperties.countryCode = element.data.countryCode;
                        $scope.ResponseProperties.address1 = element.data.address1;
                        $scope.ResponseProperties.address2 = element.data.address2;
                        $scope.ResponseProperties.clientCode = element.data.clientCode;
                        $scope.ResponseProperties.clientName = element.data.clientName;
                        $scope.ResponseProperties.distance = element.data.distance;
                        $scope.ResponseProperties.email = element.data.email;
                        $scope.ResponseProperties.latitude = element.data.latitude;
                        $scope.ResponseProperties.longitude = element.data.longitude;
                        $scope.ResponseProperties.phoneCountryCode = element.data.phoneCountryCode;
                        $scope.ResponseProperties.phoneWithInternationalDialling = element.data.phoneWithInternationalDialling;
                        cityData.push($scope.ResponseProperties);
                        $scope.DesData = cityData;
                    });
                }
            } else {
                $scope.DesData = [];
                $scope.EndCityOpenForSelfDrive = false;
                $scope.ValidsrCity = "Source City Not found";
            }
            $scope.$apply()
        });

    }

    $scope.titleCase = function(str) {
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

    $scope.SetValue = function(Data) {
        if ($scope.Searchtype == "SourceCity") {
            $scope.SetSource(Data);
        } else if ($scope.Searchtype == "EndCity") {
            $scope.SetDestination(Data);
        }
    }

    $scope.PopularGoto = function(from, to, type) {
        var isOk = true;
        var urls = "https://www.easemytrip.com/cabs/" + from + "-to-" + to + "-cab-booking/";
        if (isOk) {
            $window.location.href = urls;
        } else {
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.errList = [];
                });
            }, 3000);

        }

    }

    $scope.SetSource = function(Data) {
        if ($scope.SearchDetail.TravelType == "selfdrive") {
            $scope.SearchDetail.StartCity.Name = $scope.titleCase(Data.showName);
            $scope.SearchDetail.StartCity.Address = Data.address1;
            $scope.hdnSrchSrcStnCode = Data.stationCode;
            $scope.hdnSrchSrcCntry = Data.country;
            $scope.hdnSrchSrcCntryCode = Data.countryCode;

            $scope.SearchDetail.EndCity = [];

            $scope.SearchDetail.EndCity.Name = $scope.titleCase(Data.showName);
            $scope.SearchDetail.EndCity.Address = Data.address1;
            $scope.hdnSrchDesStnCode = Data.stationCode;
            $scope.hdnSrchDesCntry = Data.country;
            $scope.hdnSrchDesCntryCode = Data.countryCode;

        } else {
            for (var lst of FromResponseObject) {
                if (lst.id.toLowerCase().trim() == Data.Id.toLowerCase().trim()) {
                    from.name = $scope.ValueIfNullOrEmpty(lst.name);
                    from.lat = $scope.ValueIfNullOrEmpty(lst.lat);
                    from.long = $scope.ValueIfNullOrEmpty(lst.long);
                    from.countryCode = $scope.ValueIfNullOrEmpty(lst.countryCode);
                    from.type = $scope.ValueIfNullOrEmpty(lst.type);
                    from.state = $scope.ValueIfNullOrEmpty(lst.state);
                    from.city = $scope.ValueIfNullOrEmpty(lst.city);
                    from.address = $scope.ValueIfNullOrEmpty(lst.address);
                }
            }
            if (travelType == "hourly") {
                to = from;
            }
            if (travelType == "airport" && $("#radiopickup").prop('checked')) {
                from = {};
            }
            $scope.SearchDetail.StartCity.Name = Data.Name;
            $scope.SearchDetail.StartCity.Address = Data.Address;
            $scope.SearchDetail.StartCity.Id = Data.Id;
        }
        $scope.StartCityOpen = false;
        document.getElementById('dvautosearchstart').style.display = "none";
        document.getElementById('dvsearch').style.display = "block";
        document.getElementById('topid').style.display = "block";
    }
    $scope.SetDestination = function(Data) {
        if ($scope.SearchDetail.TravelType == "selfdrive") {
            $scope.SearchDetail.EndCity.Name = $scope.titleCase(Data.showName);
            $scope.SearchDetail.EndCity.Address = Data.address1;
            $scope.hdnSrchDesStnCode = Data.stationCode;
            $scope.hdnSrchDesCntry = Data.country;
            $scope.hdnSrchDesCntryCode = Data.countryCode;

        } else {
            for (var lst of ToResponseObject) {
                if (lst.id.toLowerCase().trim() == Data.Id.toLowerCase().trim()) {
                    to.name = $scope.ValueIfNullOrEmpty(lst.name);
                    to.lat = $scope.ValueIfNullOrEmpty(lst.lat);
                    to.long = $scope.ValueIfNullOrEmpty(lst.long);
                    to.countryCode = $scope.ValueIfNullOrEmpty(lst.countryCode);
                    to.type = $scope.ValueIfNullOrEmpty(lst.type);
                    to.state = $scope.ValueIfNullOrEmpty(lst.state);
                    to.city = $scope.ValueIfNullOrEmpty(lst.city);
                    to.address = $scope.ValueIfNullOrEmpty(lst.address);
                }
            }

            if (travelType == "airport" && $("#radiodrop").prop('checked')) {
                to = {};
            }
            $scope.SearchDetail.EndCity.Name = Data.Name;
            $scope.SearchDetail.EndCity.Address = Data.Address;
            $scope.SearchDetail.EndCity.Id = Data.Id;
        }
        $scope.EndCityOpen = false;
        document.getElementById('dvautosearchend').style.display = "none";
        document.getElementById('dvsearch').style.display = "block";
        document.getElementById('topid').style.display = "block";
    }

    $scope.TogglePax = function() {
        if ($scope.PaxOpenClose == false) {
            $scope.PaxOpenClose = true;
        } else {
            $scope.PaxOpenClose = false;
            $scope.ShowPaxDetail = $scope.SearchDetail.Occupancy.Adults + " adt," + $scope.SearchDetail.Occupancy.Children + " chd," + $scope.SearchDetail.Occupancy.Infants + " inf";
            $scope.paxdetails = $scope.SearchDetail.Occupancy.Adults + "/" + $scope.SearchDetail.Occupancy.Children + "/" + $scope.SearchDetail.Occupancy.Infants + "/";
        }
    }
    $scope.SearchDetail.ComeBack.Date = "";
    $scope.SearchDetail.Departure.dt = "";
    $scope.SearchDetail.Departure.dropOffDate = "";
    console.log($scope.SearchDetail.Departure.dt);

    var getcountrylist = [];

    $scope.ReNewSearchDetail = function(type) {
        travelType = type;
        getcountrylist = [];
        if (document.getElementById('traveladvisory'))
            document.getElementById('traveladvisory').style.display = "none";
        if (document.getElementById('Commontraveladvisory'))
            document.getElementById('Commontraveladvisory').style.display = "block";
        if (document.getElementById('SelfDrivestaticContent'))
            document.getElementById('SelfDrivestaticContent').style.display = "none";
        if (document.getElementById('CommonFAQcontentOfSelfDrive'))
            document.getElementById('CommonFAQcontentOfSelfDrive').style.display = "none";
        if (document.getElementById('offer'))
            document.getElementById('offer').style.display = "block";
        if (document.getElementById('travelsafety'))
            document.getElementById('travelsafety').style.display = "block";
        if (document.getElementById('CommonFAQcontent'))
            document.getElementById('CommonFAQcontent').style.display = "block";
        if (document.getElementById('CommonstaticContent'))
            document.getElementById('CommonstaticContent').style.display = "block";
        document.getElementById('DropDate').style.display = "none";
        if ($scope.SearchDetail.StartCity != undefined && $scope.SearchDetail.StartCity != null) {
            $scope.SearchDetail.StartCity.Id = "";
            $scope.SearchDetail.StartCity.Name = "";
        }
        if ($scope.SearchDetail.EndCity != undefined && $scope.SearchDetail.EndCity != null) {
            $scope.SearchDetail.EndCity.Id = "";
            $scope.SearchDetail.EndCity.Name = "";
        }

        if (document.getElementById('fdate') != null && document.getElementById('fdate').value != undefined && document.getElementById('fdate').value != null) {
            document.getElementById('fdate').value = "";
        }
        if (document.getElementById('tdate') != null && document.getElementById('tdate').value != undefined && document.getElementById('tdate').value != null) {
            document.getElementById('tdate').value = "";
        }
        if ($scope.SearchDetail.Departure != undefined && $scope.SearchDetail.Departure != null) {
            $scope.SearchDetail.Departure.Date = "";
        }
        if ($scope.SearchDetail.ComeBack != undefined && $scope.SearchDetail.ComeBack != null) {
            $scope.SearchDetail.ComeBack.Date = "";
        }


        if (type == "hourly" || type == "airport" || type == "airportpickup" || type == "airportdrop" || type == "selfdrive") {
            $scope.StartCityOpenForSelfDrive = false;
            $scope.EndCityOpenForSelfDrive = false;
            document.getElementById('dvReturnDate').style.display = "none";

            $scope.returndiv = "close"; //close
            $scope.IsReturn = false;
            if (type == "hourly") {
                $scope.SearchDetail.TripType = "sl";
            }
            if (type == "airportpickup") {
                $scope.SearchDetail.TripType = "pickup";
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
            } else if (type == "airportdrop") {
                $scope.SearchDetail.TripType = "drop";
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
                to = {};
            } else if (type == "airport") {
                $scope.SearchDetail.TripType = "pickup";
            } else if (type == "selfdrive") {
                $scope.SearchDetail.TripType = "selfdrive";
                $scope.LiveInList();
                if (document.getElementById('Commontraveladvisory'))
                    document.getElementById('Commontraveladvisory').style.display = "none";
                if (document.getElementById('DropDate'))
                    document.getElementById('DropDate').style.display = "block";
                if (document.getElementById('offer'))
                    document.getElementById('offer').style.display = "none";
                if (document.getElementById('travelsafety'))
                    document.getElementById('travelsafety').style.display = "none";
                if (document.getElementById('traveladvisory'))
                    document.getElementById('traveladvisory').style.display = "block";
                if (document.getElementById('CommonFAQcontent'))
                    document.getElementById('CommonFAQcontent').style.display = "none";
                if (document.getElementById('CommonstaticContent'))
                    document.getElementById('CommonstaticContent').style.display = "none";
                if (document.getElementById('SelfDrivestaticContent'))
                    document.getElementById('SelfDrivestaticContent').style.display = "block";
                if (document.getElementById('CommonFAQcontentOfSelfDrive'))
                    document.getElementById('CommonFAQcontentOfSelfDrive').style.display = "block";
            }
        } else {
            $scope.returndiv = "open";
            document.getElementById('dvReturnDate').style.display = "block";
        }
    }
    $scope.errList = [];
    $scope.GoToList = function() {
        let isOk = true;
        var url = "";
        var departuredate = "";
        $scope.SearchDetail.From = from;
        $scope.SearchDetail.To = to;
        if (document.getElementById('fdate') == null || document.getElementById('fdate').value == undefined || document.getElementById('fdate').value == null || document.getElementById('fdate').value == "") {
            isOk = false;
            $scope.errList.push("Enter PickUpDate");
        } else {
            departuredate = document.getElementById('fdate').value;
            $scope.SearchDetail.Departure.dt = departuredate;
        }
        //if (document.getElementById('dropdate') == null || document.getElementById('dropdate').value == undefined || document.getElementById('dropdate').value == null || document.getElementById('dropdate').value == "") {
        //    isOk = false;
        //    $scope.errList.push("Enter DropOffDate");
        //}
        //else {
        //    dropOffdate = document.getElementById('dropdate').value;
        //    $scope.SearchDetail.Departure.dropOffDate = departuredate;
        //}
        if ($scope.SearchDetail.Occupancy.Adults < 1) {
            isOk = false;
            $scope.errList.push("Adult can't be Zero");
        }
        if ($scope.SearchDetail.StartCity == undefined || $scope.SearchDetail.StartCity == null || $scope.SearchDetail.StartCity.Id == undefined || $scope.SearchDetail.StartCity.Id == null || $scope.SearchDetail.StartCity.Id == "") {
            isOk = false;
            $scope.errList.push("Please choose pick up location");
        }
        if (isOk) {
            var date = departuredate.split(' ');
            var date1 = date[0].replace('/', '-');
            var date2 = date1.replace('/', '-');
            var time = date[1] + ":00";
            var dates = date2 + "T" + time;
            if ($scope.SearchDetail.TravelType == "hourly") {
                if ($scope.SearchDetail.TripType == undefined || $scope.SearchDetail.TripType == null || $scope.SearchDetail.TripType == "pickup" || $scope.SearchDetail.TripType == "drop" || $scope.SearchDetail.TripType == "sl") {
                    isOk = false;
                    $scope.errList.push("Please choose Rent For");
                }
                if (isOk) {
                    url = $scope.urllist + "/list/" + $scope.SearchDetail.StartCity.Id + "/" + $scope.SearchDetail.StartCity.Id + "/" + dates + "/" + $scope.paxdetails + $scope.SearchDetail.TravelType + "/" + $scope.SearchDetail.TripType + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(from);
                }
            } else {
                if ($scope.IsReturn) {
                    if ($scope.SearchDetail.EndCity == undefined || $scope.SearchDetail.EndCity == null || $scope.SearchDetail.EndCity.Id == undefined || $scope.SearchDetail.EndCity.Id == null || $scope.SearchDetail.EndCity.Id == "") {
                        isOk = false;
                        $scope.errList.push("Please choose drop location");
                    }
                    if (document.getElementById('tdate').value == undefined || document.getElementById('tdate').value == null || document.getElementById('tdate').value == "") {
                        isOk = false;
                        $scope.errList.push("enter return date time");
                    }
                    var CBtime = document.getElementById('tdate').value;;
                    var newDate = new Date(departuredate);
                    var dedDate = new Date(CBtime);
                    newDate.setHours(newDate.getHours() + 4);
                    if (newDate >= dedDate) {
                        isOk = false;
                        $scope.errList.push("Return date time can't be less than pickup time");
                        $scope.Validdropupdate = "Return Date time can't be less than pickup Date time.";

                    }


                    if (isOk) {
                        var ComeBackdate = document.getElementById('tdate').value;
                        var cdate = ComeBackdate.split(' ');
                        var cdate1 = cdate[0].replace('/', '-');
                        var cdate2 = cdate1.replace('/', '-');
                        var ctime = cdate[1] + ":00";
                        var cdates = cdate2 + "T" + ctime;
                        url = $scope.urllist + "/list/" + $scope.SearchDetail.StartCity.Id + "/" + $scope.SearchDetail.EndCity.Id + "/" + dates + "/" + $scope.paxdetails + cdates + "/" + $scope.SearchDetail.TravelType + "/" + $scope.SearchDetail.TripType + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(to);
                    }
                } else {
                    if ($scope.SearchDetail.EndCity == undefined || $scope.SearchDetail.EndCity == null || $scope.SearchDetail.EndCity.Id == undefined || $scope.SearchDetail.EndCity.Id == null || $scope.SearchDetail.EndCity.Id == "") {
                        isOk = false;
                        $scope.errList.push("Please choose drop location");
                    }
                    if (isOk) {
                        url = $scope.urllist + "/list/" + $scope.SearchDetail.StartCity.Id + "/" + $scope.SearchDetail.EndCity.Id + "/" + dates + "/" + $scope.paxdetails + $scope.SearchDetail.TravelType + "/" + $scope.SearchDetail.TripType + "?pick=" + JSON.stringify(from) + "&drop=" + JSON.stringify(to);
                    }
                }
            }
        }
        if (isOk) {
            sessionStorage.setItem("key", JSON.stringify($scope.SearchDetail));
            //Add for GTM
            var tripType = 'OneWay';
            if ($scope.SearchDetail.ComeBack.Date) {
                tripType = 'TwoWay'
            }
            dataLayer.push({
                event: "search",
                ecommerce: {
                    search_term: "Cab",
                    items: [{
                        item_brand: "Cab",
                        item_category: tripType,
                        item_category2: $scope.SearchDetail.Departure.Date,
                        item_category3: "",
                        item_category4: !$scope.SearchDetail.StartCity ? "" : $scope.SearchDetail.StartCity.Name,
                        item_category5: !$scope.SearchDetail.EndCity ? "" : $scope.SearchDetail.EndCity.Name,
                        item_list_id: "Cab",
                        item_list_name: "Cab",
                        item_variant: "Mob Cab"
                    }]
                }
            });
            //End for GTM
            $window.location.href = url;
        } else {
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.errList = [];
                });

            }, 3000);

        }


    }

    $scope.SelfDriveSearch = function() {
        let isOk = true;
        var PickUpdate = "";
        var dropOffdate = "";

        // ----------- Error Handling Starts Here --------------//

        if (document.getElementById('fdate') == null || document.getElementById('fdate').value == undefined || document.getElementById('fdate').value == null || document.getElementById('fdate').value == "") {
            isOk = false;
            $scope.errList.push("Enter PickUpDate");
        } else {
            PickUpdate = document.getElementById('fdate').value;
            $scope.SearchDetail.Departure.dt = PickUpdate;
        }
        if (document.getElementById('dropdate') == null || document.getElementById('dropdate').value == undefined || document.getElementById('dropdate').value == null || document.getElementById('dropdate').value == "") {
            isOk = false;
            $scope.errList.push("Enter DropOffDate");
        } else {
            dropOffdate = document.getElementById('dropdate').value;
            $scope.SearchDetail.Departure.dropOffDate = dropOffdate;
        }

        var date = PickUpdate.split(' ');
        var date1 = date[0].replace('/', '-');
        var date2 = date1.replace('/', '-');
        var time = date[1] + ":00";
        var dates = date2 + "T" + time;


        var rdate = dropOffdate.split(' ');
        var rdate1 = rdate[0].replace('/', '-');
        var rdate2 = rdate1.replace('/', '-');
        var rtime = rdate[1] + ":00";
        var rdates = rdate2 + "T" + rtime;


        // var age = $('#age :selected').text().split(" ")[0];
        var SrcStnCode = $scope.hdnSrchSrcStnCode;
        var DesStnCode = $scope.hdnSrchDesStnCode;
        var age = $("#age").val();
        var SrcCntry = $scope.hdnSrchSrcCntry;
        var DesCntry = $scope.hdnSrchDesCntry;
        var SrcCntryCode = $scope.hdnSrchSrcStnCode;
        var DesCntryCode = $scope.hdnSrchDesStnCode;
        var ResidenceCntryCode = $("#LiveInMob").val();


        // ----------- Error Handling End Here -----------------//

        if (isOk) {
            var url = window.location.href.indexOf("uat") == -1 ? (window.location.href.indexOf("csc") == -1 ? "https://transfer.easemytrip.com/drivelist?psc=" : "https://csctransfer.easemytrip.com/drivelist?psc=") + SrcStnCode + "&dsc=" + DesStnCode + "&pdt=" + dates + "&ddt=" + rdates + "&age=" + age + "&pcn=" + SrcCntry + "&pcc=" + SrcCntryCode + "&dcn=" + DesCntry + "&dcc=" + DesCntryCode + "&residence=" + ResidenceCntryCode :
                "https://uat-transfer.easemytrip.com/drivelist?psc=" + SrcStnCode + "&dsc=" + DesStnCode + "&pdt=" + dates + "&ddt=" + rdates + "&age=" + age + "&pcn=" + SrcCntry + "&pcc=" + SrcCntryCode + "&dcn=" + DesCntry + "&dcc=" + DesCntryCode + "&residence=" + ResidenceCntryCode;
            window.location.href = url;
        } else {
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.errList = [];
                });

            }, 3000);
        }
    }

    $scope.IsReturn = false;
    $scope.AddReturnTransfer = function() {
        if ($scope.IsReturn == false) {
            $scope.IsReturn = true;
            var fd = document.getElementById('fdate').value;
            if (fd != undefined && fd != null && fd != "") {
                var d = new Date(document.getElementById('fdate').value);
                d.setDate(d.getDate() + 1);
                var datestring = d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) +
                    " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                document.getElementById('tdate').value = datestring;
                $scope.SearchDetail.ComeBack.Date = datestring;
            }
        } else {
            $scope.IsReturn = false;
            document.getElementById('tdate').value = "";
            $scope.SearchDetail.ComeBack.Date = "";
        }


    };

    var urlStart = "/Cabs/"; // /   // /Cab/

    if (window.location.href.indexOf("staging") != -1) {
        urlStart = "/Cab/";
    } else if (window.location.href.indexOf("localhost") != -1) {
        urlStart = "/";
    }


    $scope.LiveInList = function() {
        var urlType = "https://transferapi.easemytrip.com/api/selfautosearch/getcountrylist";
        var data = "";
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
                });

                $.ajax({
                    type: "POST",
                    url: urlStart + "CabSeo/ShowCountryList",
                    //url: "/Cab/CabSeo/SearchDataForSource",
                    data: {
                        "response": getcountrylist
                    },
                    success: function(data) {
                        $("#LiveInMob").html(''),
                            $("#LiveInMob").html(data),
                            $("#LiveInMob").val('IN');
                    },
                    error: function() {
                        $("#LiveInMob").html("No Data Found")
                    }
                });
            },
            error: function() {
                $("#LiveInMob").html("No Data Found")
            }

        })
    }

    $scope.SelectCountry = function(id) {
        if (id != "Select") {
            var val = document.getElementById("LiveInMob")[Number(id)].value;
            $("#ResidenceCntryCode").val(val);
        } else {
            $("#ResidenceCntryCode").val("");
        }
    }

    $scope.PaxSetterold = function(type, action) {
        if (type == "adt") {
            if (action == "add") {
                $scope.SearchDetail.Occupancy.Adults = $scope.SearchDetail.Occupancy.Adults + 1;
            } else if (action == "rem") {
                $scope.SearchDetail.Occupancy.Adults = $scope.SearchDetail.Occupancy.Adults - 1;
            }

        }
        if (type == "chd") {
            if (action == "add") {
                $scope.SearchDetail.Occupancy.Children = $scope.SearchDetail.Occupancy.Children + 1;
            } else if (action == "rem") {
                $scope.SearchDetail.Occupancy.Children = $scope.SearchDetail.Occupancy.Children - 1;
            }
        }
        if (type == "inf") {
            if (action == "add") {
                $scope.SearchDetail.Occupancy.Infants = $scope.SearchDetail.Occupancy.Infants + 1;
            } else if (action == "rem") {
                $scope.SearchDetail.Occupancy.Infants = $scope.SearchDetail.Occupancy.Infants - 1;
            }
        }
    };
    $scope.PaxSetter = function(type, action) {
        var seats = parseInt($scope.SearchDetail.Occupancy.Adults) + parseInt($scope.SearchDetail.Occupancy.Children); /* +parseInt($scope.SearchDetail.Occupancy.Infants); */

        if (type == "adt") {
            if (action == "add") {
                var vl;
                if (seats > 6) {
                    alert("Total Number of passenger can not be exceed than 6");
                    if (parseInt($scope.SearchDetail.Occupancy.Adults) > 0) {
                        vl = 6 - (parseInt($scope.SearchDetail.Occupancy.Children));
                        //vl = (parseInt($scope.SearchDetail.Occupancy.Adults)-1);
                    }
                    $scope.SearchDetail.Occupancy.Adults = String(vl);
                } else {
                    $scope.SearchDetail.Occupancy.Adults = $scope.SearchDetail.Occupancy.Adults;
                }

            }

        }
        if (type == "chd") {
            if (action == "add") {
                var val = 0;
                if (seats > 6) {
                    alert("Total Number of passenger can not be exceed than 6");
                    if (parseInt($scope.SearchDetail.Occupancy.Children) > 0) {
                        /* val = (parseInt($scope.SearchDetail.Occupancy.Children)-1); */
                        val = 6 - (parseInt($scope.SearchDetail.Occupancy.Adults));
                    }
                    $scope.SearchDetail.Occupancy.Children = String(val);
                } else {
                    $scope.SearchDetail.Occupancy.Children = $scope.SearchDetail.Occupancy.Children;
                }

            }

            $scope.ShowPaxDetail = $scope.SearchDetail.Occupancy.Adults + " adt," + $scope.SearchDetail.Occupancy.Children + " chd," + $scope.SearchDetail.Occupancy.Infants + " inf";
        }
        if (type == "inf") {
            if (action == "add") {
                var value = 0;
                /* if(seats > 6)
                {
                    alert("Total Number of seats can not be exceed than 6");
                    if(parseInt($scope.SearchDetail.Occupancy.Infants)>0)
                    {
    
                        var value = (parseInt($scope.SearchDetail.Occupancy.Infants)-1)
                    	
                    }
                $scope.SearchDetail.Occupancy.Infants = String(value);
                 
                }
                else{
                $scope.SearchDetail.Occupancy.Infants = $scope.SearchDetail.Occupancy.Infants;
                } */
                $scope.SearchDetail.Occupancy.Infants = $scope.SearchDetail.Occupancy.Infants;
            }

            $scope.ShowPaxDetail = $scope.SearchDetail.Occupancy.Adults + " adt," + $scope.SearchDetail.Occupancy.Children + " chd," + $scope.SearchDetail.Occupancy.Infants + " inf";
        }
    };
    $scope.SwapLocation = function() {
        var sswwp = $scope.SearchDetail.StartCity;
        $scope.SearchDetail.StartCity = $scope.SearchDetail.EndCity;
        $scope.SearchDetail.EndCity = sswwp;
        var ssst = $scope.SearchDetail.TripType;
        if (ssst == "pickup") {
            $scope.SearchDetail.TripType = "drop";
        } else {
            $scope.SearchDetail.TripType = "pickup";
        }
        var x = from;
        var y = to;
        from = y;
        to = x;
    }
}