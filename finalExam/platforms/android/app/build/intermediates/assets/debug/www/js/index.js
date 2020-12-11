document.addEventListener("deviceready", onDeviceReady, false);

var db;

function onDeviceReady() { 
    createEventHandlers(); 
    //showCurrentGeolocation();
    // Network API Usage
    document.addEventListener("online", networkIsOnline, false);
    document.addEventListener("offline", networkIsOffline, false);
    db = window.openDatabase('myExampleDB', '1.0', 'ExampleDB', 2 * 1024 * 1024);
}

function networkIsOffline(){
alert("Tadjiev: Network is offline!");
}
function networkIsOnline(){
alert("Tadjiev: Network is online!");
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

    xAxisText.innerHTML = event.acceleration.x; // 'X VALUE' should be replaced with DeviceMotion x axis value
    yAxisText.innerHTML = event.acceleration.y; // 'Y VALUE' should be replaced with DeviceMotion y axis value
    zAxisText.innerHTML = event.acceleration.z; // 'Z VALUE' should be replaced with DeviceMotion z axis value
}


function displayDeviceOrientationToScreen(event) {
    var alphaValueText = document.getElementById("device-orientation-alpha");
    var betaValueText = document.getElementById("device-orientation-beta");
    var gammaValueText = document.getElementById("device-orientation-gamma");

    alphaValueText.innerHTML = event.alpha; // 'ALPHA VALUE' should be replaced with DeviceOrientation alpha value
    betaValueText.innerHTML = event.beta; // 'BETA VALUE' should be replaced with DeviceOrientation beta value
    gammaValueText.innerHTML = event.gamma; // 'GAMMA VALUE' should be replaced with DeviceOrientation gamma value
}

function showCurrentGeolocation() {
    // get current lat and long from geolocation (getCurrentPosition)
    var getGeolocationButton = document.getElementById("show-geolocation-button");
    getGeolocationButton.addEventListener("click", getglocation, false);

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    function getglocation() {
        var options = { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
    


    var onSuccess = function(position) {

       var latitude = position.coords.latitude;
       var longitude = position.coords.longitude;

       navigator.notification.alert(
        `Tadjiev: Latitude is ${latitude} and longitude is ${longitude}`,
        null,
        'My Location!', 
        'Done'
    );
        
    };




    
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
    var storage = window.localStorage;
    var getdata = storage.getItem('text');
    var dataFromLocalStorage = 'Data from Local Storage text = '+ getdata;

    navigator.notification.alert(
        `Tadjiev: Local Storage Data: ${dataFromLocalStorage}`,
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
            var len = results.row.length, i;
            var data = '';
            
            for (i = 0; i < len; i++) { 
                data += 'Entry #' + (i + 1) + '\n';
                data += results.rows.item(i).text;
                data += '</br>';
            } 
            
            document.getElementById("print").value = data;
            navigator.notification.alert(
                `h_patel90660: ${data}`,
                null,
                'Loaded From DB!',
                'Done'
            );

        }, function(tx,error){
            console.error("Error: " + error.message);
        }); 
     });
}