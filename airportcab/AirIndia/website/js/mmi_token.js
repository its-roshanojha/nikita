window.onload = function(){
    $.ajax({
        type: 'GET',
    url: 'https://prod.mojoboxx.com/spicescreen/webapi/getMapMyIndaToken',
    contentType: 'application/json',
    Accept: 'application/json',
    dataType: 'json',
    success: function (response) {
        // console.log(response);
        // localStorage.setItem("token", response.access_token)

        ScriptFunc(response.access_token);
        
    },
    error: function (res) {
        console.log("Token Not Generated");
    }
});
}

async function ScriptFunc(tokenNo) {
    let myCoolCode = document.createElement("script");
    // console.log(localStorage["token"])
    myCoolCode.setAttribute("src", "https://apis.mapmyindia.com/advancedmaps/v1/" + tokenNo + "/map_load?v=1.3");
    myCoolCode.async=true
    myCoolCode.defer=true
    document.head.appendChild(myCoolCode);
    var myCoolCode2;

    myCoolCode2 = document.createElement("script");
    myCoolCode2.setAttribute("src", "https://apis.mapmyindia.com/advancedmaps/api/" + tokenNo + "/map_sdk_plugins");

    myCoolCode2.async=true
    myCoolCode2.defer=true
    // myCoolCode.onload = callback;
    // myCoolCode2.onload = callback;

    document.head.appendChild(myCoolCode2);


    // myCoolCode.addEventListener("load", async function (event) {
        // console.log(myCoolCode)
        myCoolCode2.addEventListener("load", async function (event) {
            // console.log(myCoolCode2)
            // setTimeout(function(){
                setTimeout(async ()=> {
                    await loadMain();
                }, 1000);


        });
    // });
}

async function loadMain() {
    let myCoolCode3 = document.createElement("script");
    myCoolCode3.setAttribute("src", "js/mmi_main.js");
    //myCoolCode3.onload = callback;
    document.head.appendChild(myCoolCode3);
    // myCoolCode3.addEventListener("load", function (event) {
        // console.log("main loaded :)");
    // });
}