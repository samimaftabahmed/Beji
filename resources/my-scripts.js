window.onload = function () {
    getState();
    getDistrict(1);
};

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

    if (choice === 1) {
        axios.get(url, {headers: {'Access-Control-Allow-Origin': '*'}})
            .then(function (response) {
                console.log("request success");
                choiceResponse(response, choice);
            })
            .catch(function (error) {
                console.log("request failed", error);
            });
    } else {
        /*
        "Access-Control-Allow-Origin": "*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "if-none-match": 'W/"599a-aA5u7qInJS1ww78mZ2ARvwiHM5A"',
            "origin": "https://www.cowin.gov.in",
            "referer": "https://www.cowin.gov.in/",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
        */
        /*
        "Host":"cdn-api.co-vin.in",

        */

        let myheaders = {
            "Accept-Language": "en_US",
            "accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
        axios.get(url, {headers: myheaders})
            .then(function (response) {
                console.log("request success");
                choiceResponse(response, choice);
            })
            .catch(function (error) {
                console.log("request failed", error);
            });

        axios.get(url, {headers: myheaders})
            .then(function (response) {
                console.log("request success", response);
            })
            .catch(function (error) {
                console.log("request failed", error);
            });
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
    }
}

