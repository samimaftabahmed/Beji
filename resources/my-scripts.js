let myTAble = document.getElementById("mybody");
let audioPlayer = document.getElementById("myAudio");
let successStatuses = document.getElementById("successStatuses");
let cachedStatuses = document.getElementById("cachedStatuses");
let errorStatuses = document.getElementById("errorStatuses");
let totalRequestCount = document.getElementById("totalRequestCount");
let ageCode = 0;

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

function myOK(ageCodeFromButton) {

    ageCode = parseInt(ageCodeFromButton);
    afterBtnClickOperations();
    let started = document.getElementById("started");
    started.style.cssText = "background-color: #444444; color: lightgreen; display: block; text-align: center; "
    // console.log("myOK ", new Date());
    let today = moment().format('DD-MM-YYYY');

    // Cached urls
    // let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=49&date=" + today;
    // let url2 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=50&date=" + today;

    // Uncached urls
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=49&date=" + today;
    // let url2 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=50&date=" + today;

    // let url = "resources/test-response.json"; // test-json

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
        let hiddenSelectCol = document.getElementById("hidden-select-column");
        let hiddenInfoCol = document.getElementById("hidden-info-column");
        let hiddenButtonCol = document.getElementById("hidden-button-column");
        let passphraseDiv = document.getElementById("passphrase-div");

        hiddenSelectCol.style.cssText = "display: block;";
        hiddenInfoCol.style.cssText = "display: block; font-size: larger;";
        hiddenButtonCol.style.cssText = "display: block;";
        passphraseDiv.style.cssText = "display: none;";
    }
}

function my(response) {

    for (let center of response.data.centers) {
        for (let session of center.sessions) {

            let age = parseInt(session.min_age_limit);

            if (session.available_capacity > 0) {
                // if (true) {
                playAudio();
                if (ageCode === 0 && age === 18) {
                    rowCreator(center, session);
                } else if (ageCode === 1 && age === 45) {
                    rowCreator(center, session);
                } else if (ageCode === 2) {
                    rowCreator(center, session);
                }
            }
        }
    }
}

function rowCreator(center, session) {
    let htmlTableRowElement = document.createElement("tr");
    let name = document.createElement("td");
    let address = document.createElement("td");
    let feeType = document.createElement("td");
    let age = document.createElement("td");
    let vaccine = document.createElement("td");
    let quantity = document.createElement("td");
    let onDate = document.createElement("td");

    name.textContent = center.name;
    address.textContent = center.address;
    feeType.textContent = center.fee_type;
    age.textContent = session.min_age_limit + "+";
    vaccine.textContent = session.vaccine;
    quantity.textContent = session.available_capacity;
    quantity.className = "quantity-highlight";
    onDate.textContent = session.date;

    htmlTableRowElement.appendChild(name);
    htmlTableRowElement.appendChild(address);
    htmlTableRowElement.appendChild(quantity);
    htmlTableRowElement.appendChild(vaccine);
    htmlTableRowElement.appendChild(age);
    htmlTableRowElement.appendChild(onDate);
    htmlTableRowElement.appendChild(feeType);
    myTAble.appendChild(htmlTableRowElement);
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
    // console.log(response);
    for (let eachState of response.data.states) {
        addOptions(stateSelect, eachState.state_name, eachState.state_id);
    }
}

function processDistrict(response) {
    let districtSelect = document.getElementById("district");
    // console.log(response);
    districtSelect.children = null;
    for (let district of response.data.districts) {
        addOptions(districtSelect, district.district_name, district.district_id);
    }
}

function processMain(response) {

}

function getState() {
    let url = "resources/state.json";
    makeRequest(url, 1);
}

function getDistrict(choice) {
    if (choice === 1) {
        let url = "resources/districts.json";
        // console.log("url: ", url);
        makeRequest(url, 2);

    } else if (choice === 2) {
        let stateSelect = document.getElementById("state");
        let url = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + stateSelect.value;
        // console.log("url: ", url);
        makeRequest(url, 2);
    }
}

function getMain() {
    // console.log("From main:");
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
    let text = totalRequestCount.textContent;
    text = parseInt(text) + 1;
    totalRequestCount.textContent = text;
}

function setStatusCount(code) {

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
    // console.log(url);
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

function afterBtnClickOperations() {
    let btn1 = document.getElementById("btn-1");
    let btn2 = document.getElementById("btn-2");
    let btn3 = document.getElementById("btn-3");
    let btn4 = document.getElementById("btn-4");
    let btn5 = document.getElementById("btn-5");
    let btn6 = document.getElementById("btn-6");
    let stateSelect = document.getElementById("state");
    let districtSelect = document.getElementById("district");
    let hiddenBtnCol = document.getElementById("hidden-button-column");
    let ageGroupSelected = document.getElementById("age_group_selected");

    // disable buttons and select
    btn1.disabled = true;
    btn2.disabled = true;
    btn3.disabled = true;
    btn4.disabled = true;
    btn5.disabled = true;
    btn6.disabled = true;
    hiddenBtnCol.style.cssText = "display: block; background-color: #eeeeee;"
    stateSelect.disabled = true;
    districtSelect.disabled = true;

    console.log("agecode from disabled ", ageCode);
    // view the age group
    switch (ageCode) {
        case 0:
            ageGroupSelected.textContent = "18+";
            break;
        case 1:
            ageGroupSelected.textContent = "45+";
            break;
        case 2:
            ageGroupSelected.textContent = "18 - 45";
            break;
    }
}

