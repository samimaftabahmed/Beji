window.onload = function () {
    getState();
    getDistrict(1);
};

function myOK() {
    console.log("myOK ", new Date());
    let today = moment().format('DD-MM-YYYY');
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=49&date=" + today;
    let url2 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=50&date=" + today;

    makeRequest(url, 4);
    makeRequest(url2, 4);
}

function pass() {
    let pass = document.getElementById("pass");
    if (pass.text === "zang") {
        let hiddenDiv = document.getElementById("hidden-div");
        let showDiv = document.getElementById("show-div");
        hiddenDiv.setAttribute("display", "block");
        showDiv.setAttribute("display", "none")

    }
}

function my(response) {
    console.log("Processing response myOK:")
    for (let center of response.data.centers) {
        for (let session of center.sessions) {
            if (session.available_capacity > 0) {
                // && session.min_age_limit < 45
                console.log("vaccine available", session);
            }
        }
    }
}


function choiceResponse(response, choice) {
    switch (choice) {
        case 1:
            processState(response);
            break;
        case 2:
            processDistrict(response);
            break;
        case 3:
            processMain(response);
            break;
        case 4:
            my(response);
            break;
    }
}

function processState(response) {
    let stateSelect = document.getElementById("state");
    console.log(response);
    for (let eachState of response.data.states) {
        addOptions(stateSelect, eachState.state_name, eachState.state_id);
    }
}

function processDistrict(response) {
    let districtSelect = document.getElementById("district");
    console.log(response);
    districtSelect.children = null;
    for (let district of response.data.districts) {
        addOptions(districtSelect, district.district_name, district.district_id);
    }
}

function processMain(response) {

}

function getState() {
    console.log("From state:");
    let url = "resources/state.json";
    makeRequest(url, 1);
}

function getDistrict(choice) {
    console.log("From district:");
    if (choice === 1) {
        let url = "resources/districts.json";
        console.log("url: ", url);
        makeRequest(url, 2);

    } else if (choice === 2) {
        let stateSelect = document.getElementById("state");
        let url = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + stateSelect.value;
        console.log("url: ", url);
        makeRequest(url, 2);
    }
}

function getMain() {
    console.log("From main:");
    let url = "resources/state.json";

    setInterval(function () {
        makeRequest(url, 3);
    }, 1000);
}

function addOptions(element, text, value) {
    let option = document.createElement("option");
    option.text = text;
    option.value = value;
    element.add(option);
}

/*
Choices:
1 - state
2 - district
3 - main
*/
function makeRequest(url, choice) {
    let myheaders = {
        "accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
    }
    axios.get(url, {headers: myheaders})
        .then(function (response) {
            console.log("request success");
            choiceResponse(response, choice);
        })
        .catch(function (error) {
            console.log("request failed", error);
        });
}

