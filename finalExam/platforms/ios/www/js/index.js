document.addEventListener("deviceready", onDeviceReady, false);

var db;

function onDeviceReady() { 
    createEventHandlers(); 
    db = window.openDatabase('myExampleDB', '1.0', 'ExampleDB', 2 * 1024 * 1024);
}

function createEventHandlers() {
    if (!!window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", displayDeviceMotionToScreen, true);
        self.supported = true;
    }
    
    if (!!window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", displayDeviceOrientationToScreen, true);
        self.supported = true;
    }

    var showGeolocationButton = document.getElementById("show-geolocation-button");
    showGeolocationButton.addEventListener("click", showCurrentGeolocation, false);

    var saveToLocalStorageButton = document.getElementById("save-to-local-storage-button");
    saveToLocalStorageButton.addEventListener("click", saveToLocalStorage, false);

    var retrieveFromLocalStorageButton = document.getElementById("load-from-local-storage-button");
    retrieveFromLocalStorageButton.addEventListener("click", retrieveFromLocalStorage, false);

    var saveToDBButton = document.getElementById("save-to-db-button");
    saveToDBButton.addEventListener("click", saveToDB, false);

    var retrieveFromDBButton = document.getElementById("load-from-db-button");
    retrieveFromDBButton.addEventListener("click", retrieveFromDB, false);
}

function displayDeviceMotionToScreen(event) {
    var xAxisText = document.getElementById("device-motion-x");
    var yAxisText = document.getElementById("device-motion-y");
    var zAxisText = document.getElementById("device-motion-z");

    xAxisText.innerHTML = 'X VALUE'; // 'X VALUE' should be replaced with DeviceMotion x axis value
    yAxisText.innerHTML = 'Y VALUE'; // 'Y VALUE' should be replaced with DeviceMotion y axis value
    zAxisText.innerHTML = 'Z VALUE'; // 'Z VALUE' should be replaced with DeviceMotion z axis value
}

function displayDeviceOrientationToScreen(event) {
    var alphaValueText = document.getElementById("device-orientation-alpha");
    var betaValueText = document.getElementById("device-orientation-beta");
    var gammaValueText = document.getElementById("device-orientation-gamma");

    alphaValueText.innerHTML = 'ALPHA VALUE'; // 'ALPHA VALUE' should be replaced with DeviceOrientation alpha value
    betaValueText.innerHTML = 'BETA VALUE'; // 'BETA VALUE' should be replaced with DeviceOrientation beta value
    gammaValueText.innerHTML = 'GAMMA VALUE'; // 'GAMMA VALUE' should be replaced with DeviceOrientation gamma value
}

function showCurrentGeolocation() {
    // get current lat and long from geolocation (getCurrentPosition)

    var latitude = "LATITUDE HERE";
    var longitude = "LONGITUDE HERE";

    navigator.notification.alert(
        `FOL_USERNAME: Latitude is ${latitude} and longitude is ${longitude}`,
        null,
        'My Location!', 
        'Done'
    );
}

function saveToLocalStorage() {
    var inputValue = document.getElementById("local-storage-input").value;

    var storage = window.localStorage;
    storage.setItem('text', inputValue);

    navigator.notification.alert(
        `${inputValue} saved to Local Storage!`,
        null,
        'Saved To Local Storage!',
        'Done'
    );
}

function retrieveFromLocalStorage() {
    var dataFromLocalStorage = 'Data from Local Storage text = "this is some test data"';

    navigator.notification.alert(
        `FOL_USERNAME: Local Storage Data: ${dataFromLocalStorage}`,
        null,
        'Loaded From Local Storage!',
        'Done'
    );
}

function saveToDB() {
    var dataForDB = document.getElementById("input-for-db").value;

    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS ExampleData (text)', 
            null, 
            null,
            function(_tx,error){ console.error("Error: " + error.message); }
        ); 
        tx.executeSql(`INSERT INTO ExampleData (text) VALUES ("${dataForDB}")`,
            null, 
            function(_) { navigator.notification.alert('db data inserted successfully!')},
            function(_tx,error){ console.error("Error: " + error.message); }
        ); 
     }); 
}

function retrieveFromDB() {
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM ExampleData', [], function (tx, results) { 
            // PRINT OUT ENTRIES FROM ExampleData table. 
            // NOTE: data is saved above in 'text' field

            navigator.notification.alert(
                'FOL_USERNAME: DB DATA HERE!',
                null,
                'Loaded From DB!',
                'Done'
            );

        }, function(tx,error){
            console.error("Error: " + error.message);
        }); 
     });
}