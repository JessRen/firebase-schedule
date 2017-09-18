// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDIAobMcB5AZRTReMk1loH_arPUIJzFUP4",
    authDomain: "fir-schedule-92589.firebaseapp.com",
    databaseURL: "https://fir-schedule-92589.firebaseio.com",
    projectId: "fir-schedule-92589",
    storageBucket: "fir-schedule-92589.appspot.com",
    messagingSenderId: "124142055897"
  };
  firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();

// Trains Object starts with 7 trains with their own schedules

// I first hard-coded the existing schedule, in the html table, with IDs for fields that need ongoing updates: Next Arrival and Minutes Away 

/* I since commented out the hard-code of a prelim 'static' assumed page. Return to this so I can convert static page input to realtime updated via momentjs, drawing upon the info already there. 

  "#trenton-next" 
  "#trenton-mins-away"

  "#salem-next"
  "#salem-mins-away"

  "#phil-next"
  "#phil-mins-away"

  "#atlanta-next"
  "#atlanta-mins-away"

  "#boston-next"
  "#boston-mins-away"

  "#sanfran-next"
  "#sanfran-mins-away"

  "#orlando-next"
  "#orlando-mins-away"
  */



// Admin Panel for Adding to Train Schedule
$("#add-train").on("click", function(event) {
  event.preventDefault();
    console.log("working");
  // Grabbing the user inputs via the ids assigned to each field
  var trainAdd = $("#add-train-name").val().trim();
  var placeAdd = $("#add-train-place").val().trim();
  var timeAdd = moment($("#add-train-time").val().trim(), "HH:mm").format("HH:mm");
  var freqAdd = $("#add-train-freq").val().trim();


  // Inputs new properties in the newTrain object
  var newTrain = {
    name: trainAdd,
    place: placeAdd,
    time: timeAdd,
    freq: freqAdd
  };
    console.log(newTrain);
  // Upload to the database
  database.ref().push(newTrain);

  // Log to console
  console.log(newTrain.name);
  console.log(newTrain.place);
  console.log(newTrain.time);
  console.log(newTrain.freq);

  // Alert
  alert("Train added to schedule");

  // Clear the textboxes
  $("#add-train-name").val(" ");
  $("#add-train-place").val(" ");
  $("#add-train-time").val(" ");
  $("#add-train-freq").val(" ");

  });

  // Creating Firebase event for adding employee to database
  // and adding row in the html when admin adds train to schedule

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store into a variable
    var trainAdd = childSnapshot.val().name;
    var placeAdd = childSnapshot.val().place;
    var timeAdd = childSnapshot.val().time;
    var freqAdd = childSnapshot.val().freq;
  
    // Train Info
    console.log(trainAdd);
    console.log(placeAdd);
    console.log(timeAdd);
    console.log(freqAdd);

    /// Cleaning Up Added Train's First Arrival Time - applying momentjs to timeAdd
    var timeAddMoment = moment(timeAdd, "hh:mm").subtract(1, "years");
    console.log(timeAddMoment);
    // Current time into a variable
    var currentTime = moment().format("hh:mm A");
    console.log("Current Time: " + currentTime);


    // Difference in time storing in variable
    var timeDifference = moment().diff(moment(timeAddMoment), "minutes");
      console.log("Difference in Time: " + timeDifference);

    var timeApart = timeDifference % freqAdd;
      console.log(timeApart);

    var timeUntil = freqAdd - timeApart;
      console.log("Minutes Until Next Train: " + timeUntil);

    var trainNext = moment().add(timeUntil, "minutes");
      console.log("Arrival Time: " + moment(trainNext).format("hh:mm A"));

    //Cleaning up Added Train's Next Arrival Time - applying momentjs to trainNext
    var trainNextClean = moment(trainNext).format("hh:mm A");


    // ****** Handled the time calculations and moment conversions ******

   // Bonus: If you want to add clock display on Front End, go ahead

   // Setting our clock for all the time updates
   
   function displayTime() {
      var time = moment().format("hh:mm:ss A");
      $("#clock").html(time);
   } 

   $(document).ready(function() {
      displayTime();
   });


    // Adding from Admin form to the Train Schedule table

    $("#train-table tbody").append("<tr><td>" + trainAdd + "</td><td>" + placeAdd + "</td><td>" + freqAdd + "</td><td>" + trainNextClean + "</td><td>" + timeUntil + "mins" + "</td></tr>");
      });

