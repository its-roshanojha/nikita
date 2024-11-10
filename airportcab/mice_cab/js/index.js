// $(document).ready(function () { // $('.timepicker').mdtimepicker(); // Initializes the time picker

//     $("#datepicker").datepicker({ // dateFormat: "yy-mm-dd",
//         dateFormat: "dd-mm-yy",
//         startDate: '-0m'
//     });

// });
// function showdate() {
//     $("#datepicker").datepicker({
//         startDate: '-0m', dateFormat: "dd-mm-yy",
//     });
// }


function init() {
    localStorage.setItem("PageReload", true);
    localStorage.setItem("loadPagevalue", "ride")
    
    // document.getElementById("ctn").reset();
    location.reload();
    
}
function initRental() {
    localStorage.setItem("loadPagevalue", "rental")
    location.reload();
    localStorage.setItem("PageReload", true);
}
function initoutstation() {
    localStorage.setItem("loadPagevalue", "outstation")
    location.reload();
    localStorage.setItem("PageReload", true);
}

function initselfdrive() {
    localStorage.setItem("loadPagevalue", "selfdrive")
    location.reload();
    localStorage.setItem("PageReload", true);
}

// init()
loadRidehtml()
function loadRidehtml() {
    $(".RideTypeBox").css("display", "block")
    $("#outstationBox").empty();
    $("#BydefaultShow").empty();
    $("#BydefaultShow").append(`<div style="width: 100%; margin: 1.5% 0; float: left; margin-bottom: 0.8%;" class="pnr_pickup">
                            <div id="makeSerIcon">
                                <label class="full-field">
                                    <input id="pac-input" name="pac-input" class="input_srch" autocomplete="off"
                                        placeholder="Enter Pickup location (Min 7 Char)" />
                                    <i class="Locationbox fas fa-map-marker-alt " aria-hidden="true"
                                        id="makeSerIconI"></i>
                                </label>
                            </div>
                            <ul class="autocomplete-results">
                            </ul>
                        </div>


                        <div class="drop_div" id="pickupDiv" style="display:none">
            
                            <select class="drop_ui" id="cabPickupCity" style="margin-left: 11px;">
                            <option value="Select  City">Select City</option>
                           
                            
                                </select>
                        </div>

                        <div class="drop_div" id="pickupDiv2">
                            <select class="drop_ui" id="cabPickupTerminal" style="margin-left:0px">
                                <option selected disabled>Select Terminal</option>
                                </select>
                        </div>

                        <div class="ForNon-pnrLoad"> </div>

                        <div class="manualoption" style="display: none;">
                            <i class="fas fa-solid fa-caret-down dubaiArrow"></i>
                            <select id="dubai">
                                <option value="" selected disabled>Update your pickup location</option>
                                <option value='city-Deira Dubai,lat-25.2619148,lng-55.3237382,km-6.5,fare-AED 129'>Deira
                                    Dubai
                                </option>
                                <option value='city-Bur Dubai,lat-25.230251,lng-55.3001516,km-10.7,fare-AED 129'>Bur
                                    Dubai
                                </option>
                                <option value='city-Down Town,lat-25.1949684,lng-55.208373,km-15.3,fare-AED 151'>Down
                                    Town
                                </option>
                                <option
                                    value='city-Business bay area,lat-25.1833077,lng-55.2956728,km-14.6,fare-AED 151'>
                                    Business Bay Area</option>
                                <option value='city-Jumeirah Area,lat-25.1902019,lng-55.2736875,km-20.7,fare-AED 168'>
                                    Jumeirah
                                    Area</option>
                                <option value='city-Wasi Road Dubai,lat-25.1820391,lng-55.2274986,km-19.4,fare-AED 168'>
                                    Wasi
                                    Road Dubai</option>
                                <option value='city-Dubai Marina,lat-25.1382241,lng-55.1880705,km-33.7,fare-AED 179'>
                                    Dubai
                                    Marina</option>
                                <option
                                    value='city-Jumeirah Lakes Towers (JLT),lat-25.1312797,lng-55.1888216,km-36.1,fare-AED 179'>
                                    Jumeirah Lakes Towers (JLT)</option>
                                <option
                                    value='city-Jumeirah Beach Residence (JBR),lat-25.1142279,lng-55.1947476,km-34.7,fare-AED 179'>
                                    Jumeirah Beach Residence (JBR)</option>
                                <option
                                    value='city-Palm Jumeirah Area,lat-25.1469351,lng-55.1828981,km-36.4,fare-AED 179'>
                                    Palm
                                    Jumeirah Area</option>
                                    <option value='city-Jebel Ali Area,lat-25.0738061,lng-55.0714537,km-56,fare-AED 224'>
                                    Jebel
                                    Ali
                                    Area</option>
                                <option value='city-Expo 2020 Area,lat-25.0778153,lng-55.125162,km-44.2,fare-AED 258'>
                                    Expo
                                    2020
                                    Area </option>
                                <option value='city-Sharjah Dubai,lat-25.2648919,lng-55.2521497,km-26.7,fare-AED 157'>
                                    Sharjah
                                    Dubai</option>
                                    <option value='city-Ajman Dubai,lat-25.2932274,lng-55.2852001,km-36.7,fare-AED 224'>
                                        Ajman
                                        Dubai
                                </option>
                                <option value='city-Ras AI Khaimah,lat-25.4817929,lng-55.3968385,km-104,fare-AED 336'>
                                    Ras AI
                                    Khaimah</option>
                                <option value='city-AbuDhabi,lat-24.8434935,lng-54.3250396,km-151,fare-AED 560'>AbuDhabi
                                </option>
                                <option value='city-Fujairah,lat-25.0717978,lng-55.5704785,km-110,fare-AED 560'>Fujairah
                                </option>
                                <option value='city-AI Ain,lat-24.6562271,lng-5.0284898,km-142,fare-AED 560'>AI Ain
                                </option>
                            </select>
                        </div> `);
}



function loadRentalhtml() {
    $(".RideTypeBox").css("display", "none")
    $("#BydefaultShow").empty();
    $("#outstationBox").empty();
    // $(".mobile_box").empty()
    $(".selfType").empty()
     $(".mobile_box").empty()
    $("#Rental").empty();
    $("#Rental").append(`
    <div class="container">
        <div class="rentalHour">
            
            <div class="time selectedItem" id="six">
                <label for="eightHours" class="color" id="10hour">8Hrs</label>
                <input type="radio" name="time" id="eightHours">
            </div>
            <div class="time" id="twelve">
                <label for="twelveHours" class="color" id="11hour">12Hrs</label>
                <input type="radio" name="time" id="twelveHours">
            </div>
        </div>
        <div class="mobileCheck">
            <input type="tel" name="" class="inputBox" id = "mb_number" placeholder="Enter your mobile number">
            <i class="bi bi-pencil">

            </i>
        </div>
        <div class="drop_div" id="pickupDiv" style="width:100%";>
                           
                            <select class="drop_ui" id="cabPickupCity" style="margin-left: 11px;">
                            <option value="Select City">Select City</option>
                            <option value="AGR">Agra(AGR)</option>
                            <option value="AMD">Ahmedabad(AMD)</option>
                            <option value="ATQ">Amritsar(ATQ)</option>
                            <option value="BEK">Bareilly(BEK)</option>
                            <option value="IXB">Bagdogra(IXB)</option>
                            <option value="IXG">Belgum(IXG)</option>
                            <option value="BLR">Bengaluru(BLR)</option>
                            <option value="BHO">Bhopal(BHO)</option>
                            <option value="BBI">Bhubaneshwar(BBI)</option>
                            <option value="IXC">Chandigarh(IXC)</option>
                            <option value="MAA">Chennai (MAA)</option>
                            <option value="COK">Cochin(COK)</option>
                            <option value="CJB">Coimbatore(CJB)</option>
                            <option value="DBR">Darbhanga(DBR)</option>
                             <option value="DED">Dehradun(DED)</option>
                            <option value="DEL">Delhi(DEL)</option>
                            <option value="RDP">Durgapur(RDP)</option>
                            <option value="GAY">Gaya(GAY)</option>
                            <option value="GOI">Goa(GOI)</option>
                            <option value="GOP">Gorakhpur(GOP)</option>
                            <option value="GAU">Guwahati(GAU)</option>
                            <option value="GWL">Gwalior(GWL)</option>
                            <option value="HYD">Hyderabad(HYD)</option>
                            <option value="IDR">Indore(IDR)</option>
                            <option value="JLR">Jabalpur(JLR)</option>
                            <option value="JAI">Jaipur (JAI)</option>
                            <option value="IXJ">Jammu(IXJ)</option>
                            <option value="JSA">Jaisalmer(JSA)</option>
                            <option value="IXJ">Jammu(IXJ)</option>
                            <option value="JDH">Jodhpur(JDH)</option>
                            <option value="DHM">Kangra(DHM)</option>
                            <option value="KNU">Kanpur(KNU)</option>
                            <option value="KQH">Kishangarh(KQH)</option>
                            <option value="COK">Kochi(COK)</option>
                            <option value="CCU">Kolkata(CCU)</option>
                            <option value="CCJ">Kozhikode(CCJ)</option>
                            <option value="LKO">Lucknow(LKO)</option>
                            <option value="IXM">Madurai(IXM)</option>
                            <option value="IXE">Mangaluru(IXE)</option>
                            <option value="BOM">Mumbai(BOM)</option>
                            <option value="MYQ">Mysore(MYQ)</option>
                            <option value="NAG">Nagpur(NAG)</option>
                            <option value="ISK">Nashik(ISK)</option>
                            <option value="PGH">Pantnagar(PGH)</option>
                            <option value="PAT">Patna(PAT)</option>
                            <option value="IXD">Prayagraj(IXD)</option>
                            <option value="PNY">Puducherry(PNY)</option>
                            <option value="PNQ">Pune(PNQ)</option>
                            <option value="RPR">Raipur(RPR)</option>
                            <option value="IXR">Ranchi(IXR)</option>
                            <option value="RAJ">Rajkot(RAJ)</option>
                            <option value="SAG">Shirdi(SAG)</option>
                            <option value="SXR">Srinagar(SXR)</option>
                            <option value="STV">Surat(STV)</option>
                            <option value="TIR">Tirupathi(TIR)</option>
                            <option value="TRZ">Trichy(TRZ)</option>
                            <option value="TRV">Trivandrum(TRV)</option>
                            <option value="UDR">Udaipur(UDR)</option>
                            <option value="BDQ">Vadodara(BDQ)</option>
                            <option value="VNS">Varanasi(VNS)</option>
                            <option value="VGA">Vijaywada(VGA)</option>
                            <option value="VTZ">Vizag(VTZ)</option>
                            
                                </select>
                        </div>
        <div class="pickupLocation" >
            <input autocomplete="off" type="text" name="" id="pac-inputOutstation" class="inputBox" placeholder="Pickup location (Min 7 Char)" >
            <i class="fas fa-map-marker-alt" aria-hidden="true" id="searchI"></i>



            
            <p id="ValidateMsg"></p>
                            <ul class="autocomplete-results" >
                            </ul>
        </div>
        
        
    </div>
    `);
    $("#paymentoptions").empty();
    $("#paymentoptions").append(` <h3>Payment options</h3>
        
        <div class="radioBox" style="margin-top: 4%; display:block">
            <input id="full" type="radio" style="display: inline;" name="paymentoption" checked />
            <label for="full">
                <p style="display: inline;margin-top: 0%; 
                font-family: 'NetflixSansMedium';">Make full payment now <span style="margin-left: 28.5%; font-size: 15px;
                font-family: 'NetflixSansMedium';" id="fullpay">₹... </span></p>
            </label>
        </div>`)
}


var OutstationShow = "no";
function loadOutstationhtml() {

    // $(".custom-model-main").addClass('model-open');
    
    $(".RideTypeBox").css("display", "none")
    $("#BydefaultShow").empty();
    $("#outstationBox").empty();
    $("#outstationBox").append(`
                        <div class="drop_div" id="pickupDiv"  style="margin:3px 0px 4px 0px;">
                           
                            <select class="drop_ui" id="outstationCity" style="margin-left: 11px;">
                            <option value="Select City">Select City</option>
                            <option value="AGR">Agra(AGR)</option>
                            <option value="AMD">Ahmedabad(AMD)</option>
                            <option value="ATQ">Amritsar(ATQ)</option>
                            <option value="BEK">Bareilly(BEK)</option>
                            <option value="IXB">Bagdogra(IXB)</option>
                            <option value="IXG">Belgum(IXG)</option>
                            <option value="BLR">Bengaluru(BLR)</option>
                            <option value="BHO">Bhopal(BHO)</option>
                            <option value="BBI">Bhubaneshwar(BBI)</option>
                            <option value="IXC">Chandigarh(IXC)</option>
                            <option value="MAA">Chennai (MAA)</option>
                            <option value="COK">Cochin(COK)</option>
                            <option value="CJB">Coimbatore(CJB)</option>
                            <option value="DBR">Darbhanga(DBR)</option>
                             <option value="DED">Dehradun(DED)</option>
                            <option value="DEL">Delhi(DEL)</option>
                            <option value="RDP">Durgapur(RDP)</option>
                            <option value="GAY">Gaya(GAY)</option>
                            <option value="GOI">Goa(GOI)</option>
                            <option value="GOP">Gorakhpur(GOP)</option>
                            <option value="GAU">Guwahati(GAU)</option>
                            <option value="GWL">Gwalior(GWL)</option>
                            <option value="HYD">Hyderabad(HYD)</option>
                            <option value="IDR">Indore(IDR)</option>
                            <option value="JLR">Jabalpur(JLR)</option>
                            <option value="JAI">Jaipur (JAI)</option>
                            <option value="IXJ">Jammu(IXJ)</option>
                            <option value="JSA">Jaisalmer(JSA)</option>
                            <option value="IXJ">Jammu(IXJ)</option>
                            <option value="JDH">Jodhpur(JDH)</option>
                            <option value="DHM">Kangra(DHM)</option>
                            <option value="KNU">Kanpur(KNU)</option>
                            <option value="KQH">Kishangarh(KQH)</option>
                            <option value="COK">Kochi(COK)</option>
                            <option value="CCU">Kolkata(CCU)</option>
                            <option value="CCJ">Kozhikode(CCJ)</option>
                            <option value="LKO">Lucknow(LKO)</option>
                            <option value="IXM">Madurai(IXM)</option>
                            <option value="IXE">Mangaluru(IXE)</option>
                            <option value="BOM">Mumbai(BOM)</option>
                            <option value="MYQ">Mysore(MYQ)</option>
                            <option value="NAG">Nagpur(NAG)</option>
                            <option value="ISK">Nashik(ISK)</option>
                            <option value="PGH">Pantnagar(PGH)</option>
                            <option value="PAT">Patna(PAT)</option>
                            <option value="IXD">Prayagraj(IXD)</option>
                            <option value="PNY">Puducherry(PNY)</option>
                            <option value="PNQ">Pune(PNQ)</option>
                            <option value="RPR">Raipur(RPR)</option>
                            <option value="IXR">Ranchi(IXR)</option>
                            <option value="RAJ">Rajkot(RAJ)</option>
                            <option value="SAG">Shirdi(SAG)</option>
                            <option value="SXR">Srinagar(SXR)</option>
                            <option value="STV">Surat(STV)</option>
                            <option value="TIR">Tirupathi(TIR)</option>
                            <option value="TRZ">Trichy(TRZ)</option>
                            <option value="TRV">Trivandrum(TRV)</option>
                            <option value="UDR">Udaipur(UDR)</option>
                            <option value="BDQ">Vadodara(BDQ)</option>
                            <option value="VNS">Varanasi(VNS)</option>
                            <option value="VGA">Vijaywada(VGA)</option>
                            <option value="VTZ">Vizag(VTZ)</option>
                            
                                </select>
                        </div>
                        <p id="ValidateCityMsg"></p>


                        <div class="ForNon-pnrLoad"> </div>

                        <div style="width: 100%; margin: 1% 0px 2% 0%; float: left;" class="pnr_pickup">
                            <div id="makeSerIcon">
                                <label class="full-field">
                                    <input id="pac-inputOutstation" name="pac-inputOutstation" class="input_srch" autocomplete="off"
                                        placeholder="Enter Pickup location (Min 7 Char)" />
                                    <i class="Locationbox fas fa-map-marker-alt " aria-hidden="true"
                                        id="makeSerIconI"></i>
                                </label>
                            </div>
                            <p id="ValidateMsg"></p>
                            <ul class="autocomplete-results">
                            </ul>
                        </div>

                        <div id="OutstationLoad">
                            <div id="makeSerIconDrop">
                                <label class="full-field">
                                    <input id="Drop-input" name="Drop-input" class="Drop_srch" autocomplete="off"
                                        placeholder="Enter Drop location (Min 7 Char)" />
                                    <i class="fas fa-search" aria-hidden="true" id="makeSerIconDropI"></i>
                                </label>
                            </div>
                            <ul class="autocomplete-resultsDrop">
                            </ul>
                            </div>
                        `);
                        $("#paymentoptions").empty();
                        $("#paymentoptions").append(` <h3>Payment options</h3>
                            
                                            <div class="radioBox" style="margin-top: 4%; display:block">
                                                <input id="full" type="radio" style="display: inline;" name="paymentoption" checked />
                                                <label for="full">
                                                    <p style="display: inline;margin-top: 0%; 
                                                    font-family: 'NetflixSansMedium';">Make full payment now <span style="margin-left: 28.5%; font-size: 15px;
                                                    font-family: 'NetflixSansMedium';" id="fullpay">₹... </span></p>
                                                </label>
                                            </div>`)
}

var BookingTrip_Type = "City Ride"
var ShowSelfDrive = "no";
$(".TripOption").click(async function () {
    $(".TripOption").removeClass("selectedTrip")
    $(this).addClass('selectedTrip');
    if ($(this).text() == "Rental") {
        // ShowSelfDrive = "no";
        // OutstationShow = "no";
        // $("#ctn").css("display", "none")
        // $(".coming_soon2").css("display", "block")
        // $(".selfType").css("display", "none")

        // uncomment this 
        ShowSelfDrive = "no";
        OutstationShow = "no";
        $("#BydefaultShow").empty()
        $("#outstationBox").empty()
        $(".journeyInfo").css("display", "none")
        initRental()
    }
    else if ($(this).text() == "Outstation") {
        localStorage.setItem("Outstation", true)

        initoutstation()

    } else if ($(this).text() == "Self Drive") {
        initselfdrive()

    } else {
        init()
        
        loadRidehtml()
        loadMainjs();
        OutstationShow = "no";
        ShowSelfDrive = "no";
        $("#ctn").css("display", "block")
        $(".selfType").css("display", "none")
        $(".coming_soon2").css("display", "none")
        $(".ForNon-pnrLoad").css("display", "block")
        $(".pnr_pickup").css("display", "block")
        $("#etaDiv").css("display", "block")
        $("#tym2").css("display", "block")
        $("#pickupDiv").css("width", "49%");
        // $(".fa-sort-down").css("right", "3%")
        $("#pickupDiv2").css("display", "block");
        $("#OutstationLoad").css("display", "none")

        $("#cabPickupTerminal").empty();

        let optionCreate = document.createElement("option")
        optionCreate.setAttribute("selected", true)
        optionCreate.setAttribute("disabled", true)
        optionCreate.innerHTML = "Select Terminal"
        document.getElementById("cabPickupTerminal").appendChild(optionCreate)

        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        BookingTrip_Type = "City Ride"
        localStorage["rideType"] = "City"
        $("#notePoint").css("display", "none")
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".sedan img").addClass("active_cab");

        $(".auto_btn").removeClass("btn_enable");
        $("#continue").removeAttr('enabled');
        $("#continue").css("color", "#828282");
        localStorage.removeItem("cab_response")
        $("#pac-input").val('');
        $("#makeSerIconI").addClass("fas fa-map-marker-alt");
        $("#makeSerIconI").removeClass("fa-times");
    }
})


loadData()

function loadData() {
    if (localStorage["loadPagevalue"] == "outstation") {
        $(".TripOption").removeClass("selectedTrip")
        $(".outstationtxt").addClass('selectedTrip');
        OutstationShow = "yes";
        loadOutstationhtml()
        loadOutstationData()
    }else if (localStorage["loadPagevalue"] == "rental") {
        // alert()
        $(".TripOption").removeClass("selectedTrip")
        $(".rentaltxt").addClass('selectedTrip');
        OutstationShow = "no";
        rentalShow = "yes";
        loadRentalhtml()
        loadRentalData()
    }  
    else if (localStorage["loadPagevalue"] == "selfdrive") {
        ShowSelfDrive = "yes";
        OutstationShow = "no";
        loadRidehtml()
        loadMainjs();

        $(".TripOption").removeClass("selectedTrip")
        $(".selfdrivetxt").addClass('selectedTrip');

        $("#ctn").css("display", "block")
        $(".coming_soon2").css("display", "none")
        $(".RideTypeBox").css("display", "none")
        $(".selfType").css("display", "flex")
        $(".ForNon-pnrLoad").css("display", "none")
        $(".pnr_pickup").css("display", "none")
        $("#OutstationLoad").css("display", "none")
        $("#etaDiv").css("display", "none")
        $("#tym2").css("display", "none")
        TripType = 'Airport Round Trip';
        BookingTrip_Type = "SELF_DRIVE"
        localStorage["rideType"] = "SELF_DRIVE"
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";

        let optionCreate = document.createElement("option")
        optionCreate.setAttribute("selected", true)
        optionCreate.setAttribute("disabled", true)
        optionCreate.innerHTML = "Select Terminal"
        document.getElementById("cabPickupTerminal").appendChild(optionCreate)

        $(".auto_btn").removeClass("btn_enable");
        $("#continue").removeAttr('enabled');
        $("#continue").css("color", "#828282");
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNR_SelfDriveClick");
    } else {
        loadMainjs();
    }
}


// /////////////////////////// New time Ui slot code Start //////////


// /////////////////////////// New time Ui slot code End //////////

// ///////////////////////Refer & win code start //////////////////////////////////

$("#okay").click(function () {
    localStorage.setItem('fullData', "FullData")
    $(".popupDiv").css("display", "none")
    $(".popupBox").css("display", "none")
})
// localStorage.clear('fullData', "FullData")

function refernow() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "block");
    $("#passenger_name").addClass("Adrefer")
    Getcode();
}

$("#referclose").click(function () {
    $("#passenger_name").removeClass("Adrefer")
    // $(".referBlock").css("bottom", "-150%");
    $(".referMain").css("display", "none");
    $(".referBlock").css("display", "none");
})
function infoBox(payType) {
    $(".infoPara").empty()
    console.log(payType)
    payType == "prepaid"?$(".infoPara").append(`To provide you a 100% confirmed cab, in case of any change in fare, we pay the difference.`):$(".infoPara").append(`To receive cab driver details, Pay via the online payment link received on whatsapp after booking confirmation within 60 mins before the pickup time.`)
    $(".referMain").css("display", "block");
    $(".referPara i").css("display","block")
    $(".important").css("display","block")
    $(".referBlock").css("display", "block");
}
$("#closePay").click(()=>{
    $(".referMain").css("display", "none");
    $(".referBlock").css("display", "none");

})


async function Getcode() {
    const Refercode = await fetch(BaseAPIURL+domain+"/webapi/get_DetailsOfReferalCode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {"mobile": document.getElementById("mb_number").value}
        )
    });
    const ReferResponse = await Refercode.json();
    // console.log(ReferResponse);
    $("#codevalue").val(ReferResponse.data.Coupon_Code);
}

function refercode() {
    if ($("#codevalue").val() != '') {
        var message = "Hey! " + "\n" + "I had an amazing experience with SpiceJet Airport Cabs." + "\n" + "Book your cab using this code " + $("#codevalue").val() + " and we will both get a confirmed cashback." + "\n" + "Book Now! https://bookairportcab.com/website/index.html"
        window.open("whatsapp://send?text=" + message, '_blank');
    } else {
        alert("Oops! Refer code not found")
    }
}

setInterval(() => {
    if ($("#coupon").val() != '') {
        $("#applyCoupon").css("color", "blue");
    } else {
        $("#applyCoupon").css("color", "grey");
    }
}, 500);

// ///////////////////////Refer & win code end //////////////////////////////////

// // ///////////////////////Apply coupon code start //////////////////////////////////

// async function applyCoupon(){
// // var showOnce = true;
//     document.getElementById("spinner").style.display = "block";
//         // Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", 
//         // "NULL", "NULL", $("#mb_number").val(), "NULL", "ArrivalcouponcodeApply_non-pnr");

//     fetch(BaseAPIURL+domain+"/webapi/getCouponCode").then((res) => {
//         return res.json()
//     })
//         .then((data) => {
//             document.getElementById("spinner").style.display = "none";

//             if ($("#coupon").val() != '') {
             
        
//                 for (let element in data.data) {
//                     if ($("#coupon").val().toLowerCase() == data.data[element].coupon_code.toLowerCase()) {

//                         Track_LoadAnalytics(localStorage["mobileNum"], "couponcodeapplydeparture", "bookairportcab", "null", "null", "null", "null",
//                          "null", "null", "null", "null", "null",
//                "null", "null", data.data[element].coupon_code)

//                         document.getElementById("cpndiscnt").innerText = " Rs. " + data.data[element].amount + " Cashback ";
//                         $("#CouponCode").val($("#coupon").val());
//                         localStorage.setItem("CouponCode", $("#coupon").val());
//                         $(".popupDiv").css("display", "block")
//                        $(".popupBox").css("display", "block")
//                         $("#coupon").val("Congrats! you'll get a cashback link on trip start")
//                         $("#coupon").attr("disabled", "true").css({ "width": "95%", "color": "#828282" });
//                         $("#applyCoupon").css("display", "none")
//                         $(".infoBox").css("display", "none")
//                         $("#couponSuccessMsg").css("display", "none")
                        
//                     }
//                     else {
//                         $("#couponSuccessMsg").css("color", "red").html('Invalid coupon code');
//                     }
//                 }
//             } else {
//                 $("#couponSuccessMsg").css("color", "red").html('Please enter coupon code');
//             }
//         })

   
// }
//localStorage.setItem('show',true);
//window.location.reload();
// ///////////////////////Apply coupon code end ///////////////////////////////////




//////////////////// Open Page on option choose code start ////////////////////////

$('input[type=radio][name=RideType]').change(function () {
    if (this.value == 'Departure') {
        console.log(' ')        
    } else if (this.value == 'Arrival') {
        // location.href="arrival/cab/index.html"
        location.href="arrival.html"
        // location.href="arrival.html?pnr="+localStorage["booking_id"] != null ?localStorage["booking_id"]:'null'
    }
});


//////////////////// Open Page on option choose code end  /////////////////////////

$("#close5").click(function(){
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "payendBooking.html?payMethod=RAZORPAY"
})

$("#status6").click(function(){
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "arrival.html"
})



// Ride city list 
{/* <option value="AGR">Agra(AGR)</option>
<option value="AMD">Ahmedabad(AMD)</option>
<option value="ATQ">Amritsar(ATQ)</option>
<option value="BEK">Bareilly(BEK)</option>
<option value="IXB">Bagdogra(IXB)</option>
<option value="IXG">Belgum(IXG)</option>
<option value="BLR">Bengaluru(BLR)</option>
<option value="BHO">Bhopal(BHO)</option>
<option value="BBI">Bhubaneshwar(BBI)</option>
<option value="IXC">Chandigarh(IXC)</option>
<option value="MAA">Chennai (MAA)</option>
<option value="COK">Cochin(COK)</option>
<option value="CJB">Coimbatore(CJB)</option>
<option value="DBR">Darbhanga(DBR)</option>
 <option value="DED">Dehradun(DED)</option>
<option value="DEL">Delhi(DEL)</option>
<option value="RDP">Durgapur(RDP)</option>
<option value="GAY">Gaya(GAY)</option>
<option value="GOI">Goa(GOI)</option>
<option value="GOP">Gorakhpur(GOP)</option>
<option value="GAU">Guwahati(GAU)</option>
<option value="GWL">Gwalior(GWL)</option>
<option value="HYD">Hyderabad(HYD)</option>
<option value="IDR">Indore(IDR)</option>
<option value="JLR">Jabalpur(JLR)</option>
<option value="JAI">Jaipur (JAI)</option>
<option value="IXJ">Jammu(IXJ)</option>
<option value="JSA">Jaisalmer(JSA)</option>
<option value="IXJ">Jammu(IXJ)</option>
<option value="JDH">Jodhpur(JDH)</option>
<option value="DHM">Kangra(DHM)</option>
<option value="KNU">Kanpur(KNU)</option>
<option value="KQH">Kishangarh(KQH)</option>
<option value="COK">Kochi(COK)</option>
<option value="CCU">Kolkata(CCU)</option>
<option value="CCJ">Kozhikode(CCJ)</option>
<option value="LKO">Lucknow(LKO)</option>
<option value="IXM">Madurai(IXM)</option>
<option value="IXE">Mangaluru(IXE)</option>
<option value="BOM">Mumbai(BOM)</option>
<option value="MYQ">Mysore(MYQ)</option>
<option value="NAG">Nagpur(NAG)</option>
<option value="ISK">Nashik(ISK)</option>
<option value="PGH">Pantnagar(PGH)</option>
<option value="PAT">Patna(PAT)</option>
<option value="IXD">Prayagraj(IXD)</option>
<option value="PNY">Puducherry(PNY)</option>
<option value="PNQ">Pune(PNQ)</option>
<option value="RPR">Raipur(RPR)</option>
<option value="IXR">Ranchi(IXR)</option>
<option value="RAJ">Rajkot(RAJ)</option>
<option value="SAG">Shirdi(SAG)</option>
<option value="SXR">Srinagar(SXR)</option>
<option value="STV">Surat(STV)</option>
<option value="TIR">Tirupathi(TIR)</option>
<option value="TRZ">Trichy(TRZ)</option>
<option value="TRV">Trivandrum(TRV)</option>
<option value="UDR">Udaipur(UDR)</option>
<option value="BDQ">Vadodara(BDQ)</option>
<option value="VNS">Varanasi(VNS)</option>
<option value="VGA">Vijaywada(VGA)</option>
<option value="VTZ">Vizag(VTZ)</option> */}