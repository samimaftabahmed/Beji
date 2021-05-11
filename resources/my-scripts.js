let myTAble = document.getElementById("mybody");
let audioPlayer = document.getElementById("myAudio");
let successStatuses = document.getElementById("successStatuses");
let cachedStatuses = document.getElementById("cachedStatuses");
let errorStatuses = document.getElementById("errorStatuses");
let totalRequestCount = document.getElementById("totalRequestCount");


function playAudio() {
    audioPlayer.play();
}

function pauseAudio() {
    audioPlayer.pause();
}

window.onload = function () {
    getState();
    getDistrict(1);
};

function myOK() {
    let started = document.getElementById("started");
    started.style.cssText = "background-color: greenyellow; color: black; display: block;"

    console.log("myOK ", new Date());
    let today = moment().format('DD-MM-YYYY');
    // let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=49&date=" + today;
    // let url2 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=50&date=" + today;
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=49&date=" + today;
    let url2 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=50&date=" + today;

    makeRequest(url, 4);
//    makeRequest(url2, 4);

    let timeout = (0.5 * 60 * 1000) + 1; // minutes * seconds * milli + milli
    setInterval(function () {
        makeRequest(url, 4);
//        makeRequest(url2, 4);
    }, timeout);
}

function pass() {
    let pass = document.getElementById("pass");
    if (pass.value === "zang") {
        let hiddenDiv = document.getElementById("hidden-div");
        let showDiv = document.getElementById("show-div");
        hiddenDiv.style.cssText = "display: block;";
        showDiv.style.cssText = "display: none;";
    }
}

function my(response) {
    console.log("Processing response myOK:")

    console.log("Started: ", Date.now());

    for (let center of response.data.centers) {

        let htmlTableRowElement = document.createElement("tr");

        for (let session of center.sessions) {
            // if (session.available_capacity > 0 && session.min_age_limit < 45) {
            if (true) {
                playAudio();

                let name = document.createElement("td");
                let address = document.createElement("td");
                let feeType = document.createElement("td");
                name.textContent = center.name;
                address.textContent = center.address;
                feeType.textContent = center.fee_type;
                htmlTableRowElement.appendChild(name);
                htmlTableRowElement.appendChild(address);
                htmlTableRowElement.appendChild(feeType);

                let age = document.createElement("td");
                let vaccine = document.createElement("td");
                let quantity = document.createElement("td");
                let onDate = document.createElement("td");
                age.textContent = session.min_age_limit + "+";
                vaccine.textContent = session.vaccine;
                quantity.textContent = session.available_capacity;
                onDate.textContent = session.date;
                htmlTableRowElement.appendChild(age);
                htmlTableRowElement.appendChild(vaccine);
                htmlTableRowElement.appendChild(quantity);
                htmlTableRowElement.appendChild(onDate);
            }
        }
        myTAble.appendChild(htmlTableRowElement);
    }

    console.log("Ended: ", Date.now());
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

function setTotalRequestCount() {
    console.log("Total Count set");
    let text = totalRequestCount.textContent;
    text = parseInt(text) + 1;
    totalRequestCount.textContent = text;
}

function setStatusCount(code) {

    console.log("Parsed Status: " + code);
    code = parseInt(code);

    if (code >= 200 && code < 300) {
        let text = successStatuses.textContent;
        text = parseInt(text) + 1;
        successStatuses.textContent = text;
    } else if (code >= 300 && code < 400) {
        let text = cachedStatuses.textContent;
        text = parseInt(text) + 1;
        cachedStatuses.textContent = text;
    } else {
        let text = errorStatuses.textContent;
        text = parseInt(text) + 1;
        errorStatuses.textContent = text;
    }
}

/*
Choices:
1 - state
2 - district
3 - main
*/
function makeRequest(url, choice) {
    console.log(url);
    let myheaders = {
        "accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
    }
    axios.get(url, {headers: myheaders})
        .then(function (response) {
            console.log("request success");
            setStatusCount(response.status);
            choiceResponse(response, choice);
        })
        .catch(function (error) {
            setStatusCount(error.response.status);
            console.log("request failed: ", error.response);
        })
        .finally(function () {
            setTotalRequestCount();
        });
}

