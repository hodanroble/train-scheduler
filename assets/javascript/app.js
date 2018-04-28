// Initialize Firebase
var config = {
    apiKey: "AIzaSyBs_qtvrbhZYyoCjGMG6dJZyoFY8yVCyf0",
    authDomain: "trainscheduler-642ef.firebaseapp.com",
    databaseURL: "https://trainscheduler-642ef.firebaseio.com",
    projectId: "trainscheduler-642ef",
    storageBucket: "trainscheduler-642ef.appspot.com",
    messagingSenderId: "765775238576"
  };
  firebase.initializeApp(config);
console.log (firebase);
//access firebase via shorten var.
var database = firebase.database();

//get click control to submit the information
$("#iSubmitBtn").on("click", function(event) {
    event.preventDefault();

    //control to get the user's input.
    var trainName = $("#iTrainName").val().trim();
    var trainDestin = $("#iDestin").val().trim();
    //format the below variable with moment.js
    var trainTime = moment($("#iTrainTime").val().trim(), "HH:mm").format();
    //this will be used to alter information in the moment.js later.
    var trainFreq = $("#iFreq").val().trim();

    //variable for firebase to hold the information.
    var newEntry = {
        name: trainName,
        destination: trainDestin,
        time: trainTime,
        frequency: trainFreq
    };

    //update firebase with the variable informaiton:
    database.ref().push(newEntry);

    /*show the information in the console to insure that 
    the information was captured correctly*/
    console.log(newEntry.name);
    console.log(newEntry.destination);
    console.log(newEntry.time);
    console.log(newEntry.frequency);

    //throw an alert to the user to insure it was added.
    alert("New train information added!");

    //clear out the information in the text boxes.
    $("#iTrainName").val("");
    $("#iDestin").val("");
    $("#iTrainTime").val("");
    $("#iFreq").val("");
});

//pull the information out of firebase and apply it to the app.
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    //get the information from the snapshot and stick it in a var.
    var trnName = childSnapshot.val().name;
    var trnDest = childSnapshot.val().destination;
    var trnStart = childSnapshot.val().time;
    var trnFreq = childSnapshot.val().frequency;
    //variable to help figure out timing based on the currnet time from moment.js.
    var now = moment();

    //log out the information pulled
    console.log(trnName);
    console.log(trnDest);
    console.log(trnStart);
    console.log(trnFreq);

    //format the information in the database to something readable
    var adjTimeStart = moment(trnStart, "HH:mm").format();

    //calculate the information needed for the 
    var trnDur = moment.duration(now.diff(adjTimeStart));
    var minDiff = Math.abs(trnDur.get("minutes"));
    var minAway = minDiff % trnFreq;
    var nextArri = moment(now).add(minAway + 1, "minutes").format("HH:mm");
    console.log(nextArri);

    //press the information into the table.
    $(".cTrainTable > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDest + "</td><td>" +
        trnFreq + "</td><td>" + nextArri + "</td><td>" + minAway + "</td></tr>")
});
