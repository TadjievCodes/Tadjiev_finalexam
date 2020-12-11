// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

var db;

// device APIs are available
function onDeviceReady() {  
    var saveLocalButton = document.getElementById("save-input-local-button");
    saveLocalButton.addEventListener("click", saveToLocalStorage, false);

    var saveDBButton = document.getElementById("save-input-db-button");
    saveDBButton.addEventListener("click", saveToDBStorage, false);

    var loadLocalButton = document.getElementById("load-input-local-button");
    loadLocalButton.addEventListener("click", showLocalStorageAlert, false);

    var loadDBButton = document.getElementById("load-input-db-button");
    loadDBButton.addEventListener("click", showDatabaseAlert, false);

    db = window.openDatabase('myExampleDB', '1.0', 'ExampleDB', 2 * 1024 * 1024);
}

function saveToLocalStorage() {
    var firstName = document.getElementById("first-name-input").value;
    var lastName = document.getElementById("last-name-input").value;
    var mobilePhone = document.getElementById("mobile-phone-input").value;

    var storage = window.localStorage;
    storage.setItem('firstName', firstName);
    storage.setItem('lastName', lastName);
    storage.setItem('mobilePhone', mobilePhone);
}

function saveToDBStorage() {
    var firstName = document.getElementById("first-name-input").value;
    var lastName = document.getElementById("last-name-input").value;
    var mobilePhone = document.getElementById("mobile-phone-input").value;

    // db.transaction(function (tx) { 
    //     tx.executeSql('DROP TABLE Users', 
    //         null, 
    //         null,
    //         function(tx,error){
    //             console.error("Error: " + error.message);
    //         }
    //     ); 
    //  }); 

    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users (firstName, lastName, mobilePhone)', 
            null, 
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
        tx.executeSql(`INSERT INTO Users (firstName, lastName, mobilePhone) VALUES ("${firstName}", "${lastName}", "${mobilePhone}")`,
            null, 
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
     }); 
}

function showLocalStorageAlert() {
    var storage = window.localStorage;
    var data = storage.getItem('firstName') + '\n' +
               storage.getItem('lastName') + '\n' +
               storage.getItem('mobilePhone') + '\n';

    navigator.notification.alert(
        data,  // message
        null,         // callback
        'Loaded From Local Storage!',   // title
        'Done'                  // buttonName
    );
}

function showDatabaseAlert() {
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM Users', [], function (tx, results) { 
            var data = '';
            var len = results.rows.length, i; 
            data = 'Found rows: ' + len + '\n'; 
       
            for (i = 0; i < len; i++) { 
                data += 'Entry #' + (i + 1) + '\n';
                data += results.rows.item(i).firstName + '\n'; 
                data += results.rows.item(i).lastName + '\n'; 
                data += results.rows.item(i).mobilePhone + '\n'; 
            } 

            navigator.notification.alert(
                data,  // message
                null,         // callback
                'Loaded From DB!',   // title
                'Done'                  // buttonName
            );
        }, function(tx,error){
            console.error("Error: " + error.message);
        }); 
     });
}