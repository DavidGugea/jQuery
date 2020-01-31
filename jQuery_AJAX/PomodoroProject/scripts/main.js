// Add history pushState | #home | in the beginning where the document loads.
$(document).ready((function (DOM_READY_EVENT) {
	$("section#home").addClass("activate");
	history.pushState("home", "home", "#home");
}));
// Add history pushState | #home | in the beginning where the document loads.

// HISTORY PUSH STATE
$("aside#headerButtons > button").click(function (event) {
	let DATA_TARGET = $(event.target).attr("data-target");
	$(`section#${DATA_TARGET}`).css({
		"display": "block"
	});
	history.pushState(DATA_TARGET, DATA_TARGET, `#${DATA_TARGET.split("_")[0]}`);

	$("section.activate").css({
		"display": "none"
	})
	$("section.activate").removeClass("activate");
	$(`section#${DATA_TARGET}`).addClass("activate");
});
// HISTORY PUSH STATE

// DOCUMENT POPSTATE EVENT //
window.addEventListener(
	"popstate",
	(event) => {
		$("section.activate").css({
			"display": "none"
		});
		$("section.activate").removeClass("activate");
		$(`section#${history.state}`).addClass("activate");
		$('section.activate').css({
			"display": "block"
		})
	},
	false // dispatch event in the bubbling phase not in the capturing phase
)
// DOCUMENT POPSTATE EVENT //

/* POMODORO TIMER */
let lapsCounter_Tracker = 0;

var pomodoroLap_timeEnd_EVENT = new CustomEvent(
	"pomodoroLap_timeEnd_EVENT", {
		detail: {
			whenToDispatch: "Dispatch this event after the pomodoro lap is over.",
			soundPath: "SoundEffects/dingSoundEffect.wav"
		},
		bubbles: false,
		cancelable: false
	}
);
var breaks_timeEnd_EVENT = new CustomEvent(
	"breaks_timeEnd_EVENT", {
		detail: {
			whenToDispatch: "Dispatch this event after the break is over. (all types of break)",
			soundPath: "SoundEffects/boxing_bell.wav"
		},
		bubbles: false,
		cancelable: false
	}
);

// Add the events to the pomodoro start button
document.querySelector("button#start_pomodoroButtons").addEventListener(
	"pomodoroLap_timeEnd_EVENT",
	(event) => {
		let newAudio = new Audio(event.detail.soundPath);
		newAudio.play();
	},
	false // dispatch event in the bubbling phase not in the capturing phase
);
document.querySelector("button#start_pomodoroButtons").addEventListener(
	"breaks_timeEnd_EVENT",
	(event) => {
		let newAudio = new Audio(event.detail.soundPath);
		newAudio.play()
	},
	false // dispatch event in the bubbling phase not in the capturing phase
);

function displayDate_dateType(givenDate) {
	// Get the values
	let hours = givenDate.getHours();
	let minutes = givenDate.getMinutes();

	//console.log("GIVEN DATE");
	//console.log(givenDate);
	//console.log(`Minutes : ${givenDate.getMinutes()} // Seconds : ${givenDate.getSeconds()}`);

	// Check if they are lower than 10, if they are, then add a 0 before the number(or after), otherwise, don't change the number
	let returnString = "";

	if (hours < 10) {
		returnString += `0${hours} : `;
	} else {
		returnString += `${hours} : `;
	};
	if (minutes < 10) {
		returnString += `0${minutes}`;
	} else {
		returnString += minutes.toString();
	}

	//console.log(`Return string : ${returnString}`);

	return returnString;
}

function displayDate(date) {
	date = date.toString();

	if (date.split(":").length === 1) {
		if (eval(date) < 10) {
			return `0${date}:00`;
		} else {
			return `${date}:00`;
		}
	}
	if (date.split(":").length === 2) {
		let minutesNumber = eval(date.split(":")[0]);
		let secondsNumber = eval(date.split(":")[1]);

		if (minutesNumber < 10) {
			minutesNumber = `0${minutesNumber}`
		}
		if (secondsNumber < 10) {
			secondsNumber = `0${secondsNumber}`
		}

		return `${minutesNumber}:${secondsNumber}`;
	}
}

function displayError(display, queryDisplay, querySetNone_1, querySetNone_2) {
	display.text("Wrong input");

	display.css({
		"display": "block"
	})
	$("h1.shortBreakTimerTracker, h1.bigBreakTimerTracker").css({
		"display": "none"
	});

	window.setTimeout(
		() => {
			// Set the displays and the texts to none
			$(`${queryDisplay}, ${querySetNone_1}, ${querySetNone_2}`).text("");
			$(`${queryDisplay}, ${querySetNone_1}, ${querySetNone_2}`).css({
				"display": "none"
			});
		},
		5000
	);
};

function increaseTime_On_PomodoroDetailsSection(title, timerType) {
	console.log(`timerType : ${timerType}`);
	// TIMER TYPES : pomodoroLap // shortBreakTime // bigBreakTime // stop

	let DISPLAY = $(`section#pomodoroDetails_Data div.${title}`);

	if (DISPLAY.length !== 0) {
		// console.log(`INCREASE TIME ON POMODORO DETAILS // TIMER TYPE : ${timerType}`);
		// console.log(DISPLAY);

		let TIME_DIV = $(`section#pomodoroDetails_Data div.${title} main p.newDiv_TIME_Paragraph`);

		//console.log("TIME DIV : ");

		let TIME_TEXT = TIME_DIV.text();

		// Make 2 arrays containing the FIRST and the SECOND date, each one containing the first element as the hours, the other one at the seconds
		let FIRST_DATE = [TIME_TEXT.split("-->")[0].trim().split(":")[1].trim(), TIME_TEXT.split("-->")[0].trim().split(":")[2].trim()];
		let SECOND_DATE = [TIME_TEXT.split("-->")[1].trim().split(":")[0].trim(), TIME_TEXT.split("-->")[1].trim().split(":")[1].trim()]

		let firstDate = new Date();
		firstDate.setHours(eval(FIRST_DATE[0]));
		firstDate.setMinutes(eval(FIRST_DATE[1]));

		let secondDate = new Date();
		secondDate.setHours(eval(SECOND_DATE[0]));
		secondDate.setMinutes(eval(SECOND_DATE[1]));

		console.log("ASD");

		if (timerType === "pomodoroLap") {
			// Increase the secondDate by the input of the pomodoro lap
			secondDate = new Date(secondDate.getTime() + eval($("section#pomodoroConfiguration input#pomodoroLapTimeWait").val()) * 60 * 1000);
		} else if (timerType === "shortBreakTime") {
			// Increase the secondDate by the input of the pomodoro lap
			console.log(`SECOND DATE SHORT BREAK TIME INCREASE : ${$("section#pomodoroConfiguration input#shortBreakTimeWait").val() * 60 * 1000} ||| secondDate : ${secondDate.getTime()}`)

			secondDate = new Date(secondDate.getTime() + eval($("section#pomodoroConfiguration input#shortBreakTimeWait").val()) * 60 * 1000);
		} else if (timerType === "bigBreakTime") {
			// Increase the secondDate by the input of the pomodoro lap
			secondDate = new Date(secondDate.getTime() + eval($("section#pomodoroConfiguration input#bigBreakTimeWait").val()) * 60 * 1000);
		} else if (timerType === "stop") {
			console.log("TIMER TYPE IS STOP");

			let time = eval($("section#pomodoroDetailsConfiguration").attr("time"));

			console.log(time);

			let dateNOW = new Date();
			let hours = dateNOW.getHours();
			let minutes = dateNOW.getMinutes();
			let seconds = dateNOW.getSeconds();

			let newDate = new Date();
			newDate.setHours(hours);
			newDate.setMinutes(minutes);
			newDate.setSeconds(seconds);

			secondDate = new Date(secondDate.getTime() + (newDate.getTime() - time));

			// Remove attribute in the end
			$("section#pomodoroDetailsConfiguration").removeAttr("time");
		}

		TIME_TEXT = `Time: ${displayDate_dateType(firstDate)} --> ${displayDate_dateType(secondDate)}`;

		TIME_DIV.text(TIME_TEXT);
	}
}

function DISPLAY_DETAILS(type, title, WAIT_TIME_DETAILS) {
	if (type === "pomodoroLap" && title.trim() !== "") {
		//console.log(`DISPLAY_DATE Fuction dispatched. Title used : ${title}`);

		let newTitle = true;

		document.querySelectorAll("section#pomodoroDetails_Data div").forEach((detailsSection) => {
			if (detailsSection.getAttribute("class") === title) {
				newTitle = false;
			}
		});

		if (newTitle) {
			// Create the main div that will be inserted in the details pomodoro section and configure it
			let newDiv = document.createElement("div");
			newDiv.setAttribute("class", title)

			// Create the section details where the TIME paragraph, the TITLE paragraph and the delete button will come
			let SECTION_DETAILS = document.createElement("main");

			// Create the title and configure it
			let newDiv_Title = document.createElement("h1");
			newDiv_Title.textContent = title;


			SECTION_DETAILS.appendChild(newDiv_Title);

			// Create the time label and configure it
			let newDiv_Time = document.createElement("p");
			newDiv_Time.innerHTML = ("Time: ");

			let DATE_NOW = new Date();

			//console.log("WAIT_TIME DETAILS : ");
			//console.log(WAIT_TIME_DETAILS);

			let DATE_AFTER_WAIT = new Date(DATE_NOW.getTime() + WAIT_TIME_DETAILS);

			newDiv_Time.innerHTML += `${displayDate_dateType(DATE_NOW)} <span class="newDiv_TimeArrow"> --> </span> ${displayDate_dateType(DATE_AFTER_WAIT)}`;

			// Set a class to the time paragraph
			newDiv_Time.setAttribute("class", "newDiv_TIME_Paragraph");

			SECTION_DETAILS.appendChild(newDiv_Time);

			// Create the delete button and configure it
			let newDiv_DELETE_BUTTON = document.createElement("button");
			newDiv_DELETE_BUTTON.setAttribute("id", "pomodoroDetails_deleteButton");

			newDiv_DELETE_BUTTON.textContent = "Delete this section";
			newDiv_DELETE_BUTTON.setAttribute("class", "pomodoroDetails_DELETE_BUTTON");

			// Add a "click" event listener for the delete button
			newDiv_DELETE_BUTTON.addEventListener(
				"click",
				(event) => {
					event.preventDefault();

					document.querySelector("section#pomodoroDetails_Data").removeChild(document.querySelector(`section#pomodoroDetails_Data div.${title}`));
				},
				false // dispatch event in the bubbling phase not in the capturing phase
			);

			SECTION_DETAILS.appendChild(newDiv_DELETE_BUTTON);

			// Append the div to the pomodoro details data section
			newDiv.appendChild(SECTION_DETAILS);


			// Styling the SECTION
			newDiv.style.display = "grid";
			newDiv.style.gridTemplateRows = "1fr";
			newDiv.style.borderBottom = "1px solid black";
			newDiv.style.padding = "15px";

			newDiv.style.fontFamily = "Verdana";
			// Styling the SECTION

			// Addding the textarea if neccessary
			if ($("textarea#pomodoroDetailsConfiguration_DETAILS").val().trim()) {
				let TEXTBOX_ELEMENT = document.createElement("div");
				TEXTBOX_ELEMENT.setAttribute("id", "POMODORO_DETAILS_DIV")

				let TEXTBOX_TEXT = $("textarea#pomodoroDetailsConfiguration_DETAILS").val().trim();

				TEXTBOX_TEXT.split(/\r?\n/g).map((paragraph) => {
					let paragraphAdd = document.createElement("p");

					paragraphAdd.textContent = paragraph;
					TEXTBOX_ELEMENT.appendChild(paragraphAdd);
				});

				// Split the columns into 2 parts
				newDiv.style.gridTemplateColumns = "repeat(2, 1fr)";

				// At the textarea to the newDiv
				newDiv.appendChild(TEXTBOX_ELEMENT);
			} else {
				// Set the amount of columns on 1fr
				// Add the textarea, if the input box isn't empty
				let newDiv_TEXTAREA_DETAILS = document.createElement("p");
				newDiv_TEXTAREA_DETAILS.setAttribute("class", "pomodoro_details_textarea");

				// Set the text content to the textarea input
				newDiv_TEXTAREA_DETAILS.textContent = "";

				// At the textarea to the newDiv
				newDiv.appendChild(newDiv_TEXTAREA_DETAILS);

				newDiv.style.gridTemplateColumns = "1fr";
			}

			newDiv.style.textAlign = "center";

			$("section#pomodoroDetails_Data").append(newDiv);
		} else if (newTitle === false) {
			console.log("USED TITLE POMODORO! == > INCREASE TIME ON POMODORO DETAILS SECTION");

			// UPDATE TEXTAREA //
			if ($("textarea#pomodoroDetailsConfiguration_DETAILS").val().trim()) {
				let TEXTBOX_ELEMENT = document.createElement("div");
	
				let TEXTBOX_TEXT = $("textarea#pomodoroDetailsConfiguration_DETAILS").val().trim();
	
				TEXTBOX_TEXT.split(/\r?\n/g).map((paragraph) => {
					let paragraphAdd = document.createElement("p");
	
					paragraphAdd.textContent = paragraph;
					TEXTBOX_ELEMENT.appendChild(paragraphAdd);
				});

					
				var textareaElement = document.querySelector(`div#POMODORO_DETAILS_DIV`);
				textareaElement.innerHTML = TEXTBOX_ELEMENT.innerHTML;
			} else {
				// Set the amount of columns on 1fr
				newDiv.style.gridTemplateColumns = "1fr";
			}
			// UPDATE TEXTAREA //

			increaseTime_On_PomodoroDetailsSection(title, type);
		}
	} else if (type === "shortBreakTime" && title.trim() !== "") {
		console.log(`TITLE USED FOR SHORT BREAK : ${title}`);
		increaseTime_On_PomodoroDetailsSection(title, type);
	} else if (type === "bigBreakTime" && title.trim() !== "") {
		console.log(`TITLE USED FOR BIG BREAK : ${title}`);
		increaseTime_On_PomodoroDetailsSection(title, type);
	} else if (type === "stop" && title.trim() !== "") {
		console.log(`STOPPED TIMER ! TITLE USED : ${title}`);
		increaseTime_On_PomodoroDetailsSection(title, type);
	}
};

var title;

function pomodoroTimer(timerTYPE) {
	let WAIT_TIME = new Date();
	let display;
	let check = true;
	let lapStop;

	// Check the timer type and set the values for the specific timer type. For each case check for .val() if it returns a number or not. If there is a problem with the input, change the text to show it, after 5 seconds, set its display to none and text to nothing(""), for each case.
	switch (timerTYPE) {
		case "pomodoroLap":
			display = $("h1.pomodoroTimerTracker");

			try {
				let userInputLapTimeWait_Input = eval($("input#pomodoroLapTimeWait").val()) || 25;

				display.text(displayDate(userInputLapTimeWait_Input));

				display.css({
					"display": "block"
				})
				$("h1.shortBreakTimerTracker, h1.bigBreakTimerTracker").css({
					"display": "none"
				});

				WAIT_TIME.setTime(userInputLapTimeWait_Input * 60 * 1000);


				title = $("input#pomodoroDetailsConfiguration_TITLE").val().trim();
				console.log(`TITLE pomodoroLap start : ${title}`);
				DISPLAY_DETAILS("pomodoroLap", title, WAIT_TIME.getTime());
				console.log("DISPLAY_DETAILS IN POMODORO");

				lapStop = eval($("input#lapsTillBigBreak").val());

				check = true;
			} catch ($ERROR) {
				console.log($ERROR);

				check = false;
				displayError(display, "h1.pomodoroTimerTracker", "h1.shortBreakTimerTracker", "h1.bigBreakTimerTracker");
			}

			break;
		case "shortBreakTime":
			display = $("h1.shortBreakTimerTracker");

			try {
				let userInputShortBreakTimeWait_Input = eval($("input#shortBreakTimeWait").val()) || 5;
				display.text(displayDate(userInputShortBreakTimeWait_Input))

				display.css({
					"display": "block"
				})

				$("h1.pomodoroTimerTracker, h1.bigBreakTimerTracker").css({
					"display": "none"
				});


				WAIT_TIME.setTime(userInputShortBreakTimeWait_Input * 60 * 1000);

				console.log(`TITLE shortBreakTimer start : ${title}`);
				DISPLAY_DETAILS("shortBreakTime", title, WAIT_TIME.getTime());
				console.log("DISPLAY_DETAILS IN SHORT BREAK");

				check = true;
			} catch ($ERROR) {
				console.log($ERROR);
				check = false;
				displayError(display, "h1.shortBreakTimerTracker", "h1.pomodoroTimerTracker", "h1.bigBreakTimerTracker")
			}

			break;
		case "bigBreakTime":
			display = $("h1.bigBreakTimerTracker");

			try {
				let userInputBigBreakTimeWait_INPUT = eval($("input#bigBreakTimeWait").val()) || 15;
				display.text(displayDate(userInputBigBreakTimeWait_INPUT))

				display.css({
					"display": "block"
				})

				$("h1.pomodoroTimerTracker, h1.shortBreakTimer").css({
					"display": "none"
				});


				WAIT_TIME.setTime(userInputBigBreakTimeWait_INPUT * 60 * 1000);

				// console.log(`TITLE bigBreakTimer start : ${title}`);
				DISPLAY_DETAILS("bigBreakTime", title, WAIT_TIME.getTime());
				console.log("DISPLAY DETAILS IN BIG BREAK");

				check = true;
			} catch ($ERROR) {
				console.log($ERROR);
				check = false;
				displayError(display, "h1.bigBreakTimerTracker", "h1.pomodoroTimerTracker", "h1.shortBreakTimerTracker");
			}

			break;
		case "stop":
			display = $("h1[time_stop = 'true']");

			console.log("DISPLAY TRIGGER AFTER START: ");
			console.log(display);

			WAIT_TIME.setTime(eval(display.attr("time")));

			console.log(`TITLE stop type START : ${title}`);
			DISPLAY_DETAILS("stop", title, WAIT_TIME.getTime());

			lapStop = eval($("input#lapsTillBigBreak").val());

			timerTYPE = display.attr("type");

			display.removeAttr("time_stop");
			display.removeAttr("time");
			display.removeAttr("type");

			break;
	}

	display.attr("active", "true");

	console.log("Outside interval.");

	var MAIN_INTERVAL = window.setInterval(() => {
		console.log(`Inside Interval, lap: ${lapsCounter_Tracker}`);
		WAIT_TIME = new Date(WAIT_TIME.getTime() - 1000);
		if (!check) {
			window.clearInterval(MAIN_INTERVAL);
		} else {
			display.text(displayDate(`${WAIT_TIME.getMinutes()}:${WAIT_TIME.getSeconds()}`));
		}

		// Reset button //

		$("button#reset_pomodoroButtons").click((event) => {
			// When the users clicks on the reset button, set the lapsCounter to 0 and set the minutes time to the input one, reset it, and set the seconds to 0. RESET everything. Clear out the details. //

			// Reset laps counter tracker
			lapsCounter_Tracker = 0;

			display.removeAttr("active");

			// Reset dispays
			display = $("h1.pomodoroTimerTracker");
			let userInputLapTimeWait_Input = eval($("input#pomodoroLapTimeWait").val()) || 25;

			display.css({
				"display": "block"
			});
			$("h1.shortBreakTimerTracker,h1.bigBreakTimerTracker").css({
				"display": "none"
			});

			display.attr("active", "true");

			WAIT_TIME.setTime(userInputLapTimeWait_Input * 60 * 1000);

			// Lap Stop
			lapStop = eval($("input#lapsTillBigBreak").val());

			// Change the timer type
			timerTYPE = "pomodoroLap";

			// Stop display
			let stopDisplay = $("h1[time_stop = 'true']");

			stopDisplay.removeAttr("time_stop");
			stopDisplay.removeAttr("time");
			stopDisplay.removeAttr("type");


			// Clear details
			$("section#pomodoroDetails_DATA").text("");
		});

		// Reset button //

		// Stop button //


		$("button#stop_pomodoroButtons").click((event) => {
			let newDate = new Date();
			console.log("NEW DATE pomodoroDetailsConfiguration set : ");
			console.log(newDate, newDate.getTime());
			// Set the time of the new date in the section#pomodoroDetailsConfiguration
			$("section#pomodoroDetailsConfiguration").attr({
				"time": newDate.getTime()
			});
			let newDisplay = $("h1[active='true']");
			//console.log("NEW DISPLAY STOP BUTTON : ");
			//console.log(newDisplay);

			newDisplay.attr({
				"time_stop": "true",
				"time": WAIT_TIME.getTime(),
				"type": timerTYPE
			});

			window.clearInterval(MAIN_INTERVAL);
		});

		// Stop button //

		if (WAIT_TIME.getMinutes() === 0 && WAIT_TIME.getSeconds() === 0) {
			window.clearInterval(MAIN_INTERVAL);
			display.removeAttr("active");

			if (timerTYPE === "pomodoroLap") {
				// If the pomodoro lap is over then :
				// Dispatch the event with the sound.
				// Increase the counter by 1
				// If the laps counter is 4, start after that the big break timer type , otherwise, start the short break timer type

				// Sound //
				document.querySelector("button#start_pomodoroButtons").dispatchEvent(pomodoroLap_timeEnd_EVENT);
				// Sound //

				// Lap tracker //
				//console.log("Laps counter increased.");
				lapsCounter_Tracker++;

				if (lapsCounter_Tracker < lapStop) {
					// Start the short break
					pomodoroTimer("shortBreakTime");
				} else {
					// Start the big break
					//console.log(`WE WILL CHOSE BIG BREAK TIME BECAUSE THE LAP NUMBER IS : | ${lapsCounter_Tracker} | LAP STOP : ${lapStop} |`);
					pomodoroTimer("bigBreakTime");
				}
				// Lap tracker //
			} else if (timerTYPE === "shortBreakTime") {
				// Dispatch the event with the sound
				// Start the pomodoro lap

				// Sound //
				document.querySelector("button#start_pomodoroButtons").dispatchEvent(breaks_timeEnd_EVENT);
				// Sound //

				// Start pomodoro lap //
				pomodoroTimer("pomodoroLap");
				// Start pomodoro lap //
			} else if (timerTYPE === "bigBreakTime") {
				// Dispatch the event with the sound
				// Start the pomodoro lap
				// Set the counter to 0

				// Sound //
				document.querySelector("button#start_pomodoroButtons").dispatchEvent(breaks_timeEnd_EVENT);
				// Sound //

				// Start pomodoro lap //
				pomodoroTimer("pomodoroLap");
				// Start pomodoro lap //

				lapsCounter_Tracker = 0;
			}
		}
	}, 1000)
}

$("button#start_pomodoroButtons").click((event) => {
	//

	if ($("h1.pomodoroTimerTracker").css("display") === "none" && $("h1.shortBreakTimerTracker").css("display") === "none" && $("h1.bigBreakTimerTracker").css("display") === "none") {
		$("h1.shortBreakTimerTracker, h1.bigBreakTimerTracker").css({
			"display": "none"
		});
		$("h1.pomodoroTimerTracker").css({
			"display": "block"
		});

		pomodoroTimer("pomodoroLap");
	} else {
		pomodoroTimer("stop");
	}
})

/* POMODORO TIMER */








/* SCHEDULE */
$(document).ready((event) => {
	let DETAILS_SECTION = document.querySelector("div.basicScheduleDetails");

	// BUILD THE DAY <select></select> tag and add the OPTIONS to it //

	let DETAILS_SELECT_TAG = document.createElement("select");

	// Set attributes for it ( name and id )
	DETAILS_SELECT_TAG.setAttribute("id", "section_detailsSelectDay");
	DETAILS_SELECT_TAG.setAttribute("name", "section_detailsSelectDay");

	// Make an array with objects that contain the value and the id for every <option></option> tag that must be added in the <select></select> element.

	let SELECT_DAYS = [{
			id: "Monday",
			value: "Monday"
		},
		{
			id: "Tuesday",
			value: "Tuesday"
		},
		{
			id: "Wednesday",
			value: "Wednesday"
		},
		{
			id: "Thursday",
			value: "Thursday"
		},
		{
			id: "Friday",
			value: "Friday"
		},
		{
			id: "Saturday",
			value: "Saturday"
		},
		{
			id: "Sunday",
			value: "Sunday"
		}
	];

	// For every object in the array, add it into the <select></select> element
	SELECT_DAYS.map((option_object) => {
		// new Option(text, value, defaultSelected, selected)
		DETAILS_SELECT_TAG.add(new Option(
			option_object.id,
			option_object.value,
			false,
			false
		))
	});

	// Add the <select></select> element with the <option></option> elements in it to the DETAILS_SECTION
	DETAILS_SECTION.appendChild(DETAILS_SELECT_TAG);

	// BUILD THE DAY <select></select> tag and add the OPTIONS to it //

	// Build the button that will add everything to the schedule //

	let INSERT_BUTTON = document.createElement("button");

	// Set attributes for the button
	INSERT_BUTTON.setAttribute("id", "section_details_INSERT_BUTTON");
	INSERT_BUTTON.setAttribute("name", "section_details_INSERT_BUTTON");

	INSERT_BUTTON.addEventListener(
		"click",
		(event) => {
			// Check for the input value, if it is good or not
			let timeStart = $("input#schedule_detailsTimeStart").val().trim();

			let timeEnd = $("input#schedule_detailsTimeEnd").val().trim();

			try {
				let timeStart_Hour = eval(timeStart.split(":")[0]);
				let timeStart_Minute = eval(timeStart.split(":")[1]);

				let timeEnd_Hour = eval(timeEnd.split(":")[0]);
				let timeEnd_Minute = eval(timeEnd.split(":")[1]);

				// If everything worked, use the add function to add everything from the inputs to the section
				if (timeStart_Hour >= 0 && timeStart_Hour <= 24 && timeEnd_Hour >= 0 && timeEnd_Hour <= 24 && timeStart_Minute >= 0 && timeStart_Minute <= 59 && timeEnd_Minute >= 0 && timeEnd_Minute <= 59) {
					SCHEDULE_InsertScheduleTimeDetails_ToMainSection();
				}
			} catch ($ERROR) {
				console.log($ERROR);
			};
		},
		false // dispatch event in the bubbling phase not in the capturing phase
	)

	INSERT_BUTTON.textContent = "Insert in schedule";

	// Add button to the section
	DETAILS_SECTION.appendChild(INSERT_BUTTON);
	// Build the button that will add everything to the schedule //
});

function SCHEDULE_InsertScheduleTimeDetails_ToMainSection() {
	// Take in all the inputs and create a new div that will be added in the section#schedule_detailsDAYS in some day.
	let DIV_FOR_SCHEDULE_DAY = document.createElement("div");
	DIV_FOR_SCHEDULE_DAY.setAttribute("id", "DIV_FOR_SCHEDULE_DAY");

	let DAY_TITLE_WITH_CHECKBOX = document.createElement("div");
	DAY_TITLE_WITH_CHECKBOX.setAttribute("id", "DAY_TITLE_WITH_CHECKBOX");

	let DETAILS_WITHOUT_TEXTBOX = document.createElement("div");

	let DAY_TITLE = $("input#schedule_detailsTitle").val().trim(); // Get the day title
	let DAY_TITLE_ELEMENT = document.createElement("h2");
	DAY_TITLE_ELEMENT.textContent = DAY_TITLE;

	let DAY_CHECKBOX = document.createElement("input");
	DAY_CHECKBOX.setAttribute("type", "checkbox");
	DAY_CHECKBOX.setAttribute("class", "SCHEDULE_CHECKBOX");

	DAY_TITLE_WITH_CHECKBOX.appendChild(DAY_TITLE_ELEMENT);
	DAY_TITLE_WITH_CHECKBOX.appendChild(DAY_CHECKBOX);

	// Add the DAY_TITLE_WITH_CHECKBOX section to the main insertion schedule
	DETAILS_WITHOUT_TEXTBOX.appendChild(DAY_TITLE_WITH_CHECKBOX);

	// Get the timers, and split them by ":" into an array with two numbers ( the first number will be the hour number, the second one will be the seconds number)

	let TIME_BEGIN = $("input#schedule_detailsTimeStart").val().trim().split(":"); // make it into an array
	let TIME_END = $("input#schedule_detailsTimeEnd").val().trim().split(":"); // make it into an array

	let TIME_ELEMENT = document.createElement("p");
	TIME_ELEMENT.setAttribute("class", "dayScheduleSection_TimeParagraph");
	TIME_ELEMENT.textContent = `${TIME_BEGIN[0]}:${TIME_BEGIN[1]} / ${TIME_END[0]}:${TIME_END[1]}`;

	// Add the time to the section
	DETAILS_WITHOUT_TEXTBOX.appendChild(TIME_ELEMENT);

	// Add the delete button
	let DELETE_BUTTON = document.createElement("button");
	DELETE_BUTTON.textContent = "Delete";

	DELETE_BUTTON.setAttribute("id", "schedule_DeleteSection_Button");

	DELETE_BUTTON.addEventListener(
		"click",
		(event) => {
			try {
				let title = selectElement.options[selectElement.selectedIndex].value;
				document.querySelector(`section#schedule_detailsDAYS div#${title}Schedule`).removeChild(DIV_FOR_SCHEDULE_DAY);
			} catch ($ERROR) {
				console.log();
			}
		},
		false // dispatch event in the bubbling phase not in the capturing phase
	);

	// Add the button to the details section
	DETAILS_WITHOUT_TEXTBOX.appendChild(DELETE_BUTTON);

	// Add it to the section
	DIV_FOR_SCHEDULE_DAY.appendChild(DETAILS_WITHOUT_TEXTBOX);

	// Add the textbox data if it's given
	if ($("textarea#schedule_textareaDetails").val().trim() !== "") {
		let TEXTBOX_ELEMENT = document.createElement("div");

		let TEXTBOX_TEXT = $("textarea#schedule_textareaDetails").val().trim();
		TEXTBOX_TEXT.split(/\r?\n/g).map((paragraph) => {
			let paragraphAdd = document.createElement("p");

			paragraphAdd.textContent = paragraph;
			TEXTBOX_ELEMENT.appendChild(paragraphAdd);
		});

		DIV_FOR_SCHEDULE_DAY.appendChild(TEXTBOX_ELEMENT);
		DIV_FOR_SCHEDULE_DAY.style.gridTemplateColumns = "repeat(2, 1fr)";
	} else {
		DIV_FOR_SCHEDULE_DAY.style.gridTemplateColumns = "1fr";
	}

	// Get the day, where the new div should be added
	let selectElement = document.querySelector("select#section_detailsSelectDay")
	let DAY_INSERT = selectElement.options[selectElement.selectedIndex].value;


	// INSERT DIV_FOR_SCHEDULE_DAY //

	let daySections = document.querySelectorAll(`div#${DAY_INSERT}Schedule div#DIV_FOR_SCHEDULE_DAY`);

	//dayScheduleSection_TimeParagraph

	let elementFound = false;

	for (let i = 0; i < daySections.length; i++) {
		let timeElement = daySections[i].querySelector("p.dayScheduleSection_TimeParagraph").textContent.split("/")[0].split(":");

		if ((eval(TIME_BEGIN[0]) < eval(timeElement[0])) || (eval(TIME_BEGIN[0]) === eval(timeElement[0]) && eval(TIME_BEGIN[1]) < eval(timeElement[1]))) {
			document.querySelector(`section#schedule_detailsDAYS div#${DAY_INSERT}Schedule`).insertBefore(DIV_FOR_SCHEDULE_DAY, daySections[i]);
			elementFound = true;
			break;
		} else {
			continue;
		}
	}

	if (!elementFound) {
		document.querySelector(`section#schedule_detailsDAYS div#${DAY_INSERT}Schedule`).appendChild(DIV_FOR_SCHEDULE_DAY);
	};

	// INSERT DIV_FOR_SCHEDULE_DAY //
}
/* SCHEDULE */
/* LOGIN */

// REGISTER //
class POST_REQUESTS {
	constructor(url) {
		this.url = url;
	}
	normalPostRequest(requestSendObject, requestHeader) {
		this.request = new XMLHttpRequest();

		this.requestSendObject = requestSendObject;
		this.requestHeader = requestHeader;

		var self = this;

		this.request.addEventListener(
			"load",
			(event) => {
				if (self.request.readyState === 4 && self.request.status === 200) {
					console.log("Request sent with the normal post request.");
					console.log(typeof self.request.response === "object" ? self.request.response : JSON.parse(self.request.response));
				}
			},
			false // dispatch event in the bubbling phase not in the capturing phase
		)

		this.request.open("POST", this.url);
		this.request.setRequestHeader("Content-Type", this.requestHeader);
		this.request.send(this.requestSendObject);
	}
	fetchAPI_Post_Request(requestSendObject, requestHeaders) {
		this.requestSendObject = requestSendObject;
		this.requestHeaders = requestHeaders;

		var self = this;

		fetch(this.url, {
				method: "POST",
				headers: self.requestHeaders,
				body: self.requestSendObject
			}).then((response) => {
				console.log(response.json())
			}).then((data) => {
				console.log("Request sent using the fetch API.");
			})
			.catch((jqXHR, errorMessage, error) => {
				console.log(jqXHR);
				console.log(errorMessage);
				console.log(error);
			});
	}
	jQueryAPI_Post_Request(requestSendObject, requestHeaders) {
		this.requestSendObject = requestSendObject;
		this.requestHeaders = requestHeaders;

		var self = this;

		$.ajax({
			url: self.url,
			dataType: "json",
			data: self.requestSendObject,
			headers: self.requestHeaders
		}).done((response) => {
			console.log("Request sent using the jQuery API");
			console.log(typeof response === "object" ? response : JSON.parse(response));
		}).catch((jqXHR, errorMessage, error) => {
			console.log(jqXHR);
			console.log(errorMessage);
			console.log(error);
		});
	}
}
$("button#register_BUTTON").click(function (event) {
	let username = $("input#username").val().trim();
	let password = $("input#password").val().trim();

	// Create the send object that will be used for the post request. The first key is the  // login // and it will have the value of the // username // and for the // node_id // we will assign the // password // value to it
	let sendObject = {
		login: username,
		node_id: password
	};

	// normalPostRequest(requestSendObject, requestHeader)
	// fetchAPI_Post_Request(requestSendObject, requestHeaders)
	// jQueryAPI_Post_Request(requestSendObject, requestHeaders)
	let POST_REQUEST_CLASS = new POST_REQUESTS("scripts/users.json");

	// POST_REQUEST_CLASS.normalPostRequest(sendObject, "application/json");
	/*
	POST_REQUEST_CLASS.fetchAPI_Post_Request(sendObject, {
		"Accept" : "text/json",
		"Content-Type" : "application/json"
	});
	*/
	POST_REQUEST_CLASS.jQueryAPI_Post_Request(sendObject, {
		"Accept": "text/json",
		"Content-Type": "application/json"
	});
});
// REGISTER //

// LOGIN //

class GET_REQUESTS {
	constructor(url) {
		this.url = url;
	}
	normalXHR_GET_REQUEST(requestHeader) {
		this.request = new XMLHttpRequest();

		this.requestHeader = requestHeader;
		var self = this;

		this.request.addEventListener(
			"load",
			(event) => {
				if (self.request.readyState === 4 && self.request.status === 200) {
					console.log("GET REQUEST loaded. | Normal XHR Request |");
					console.log(typeof self.request.response === "object" ? self.request.response : JSON.parse(self.request.response));
				}
			},
			false // dispatch event in the bubbling phase not in the capturing phase
		)

		this.request.open("GET", this.url);
		this.request.setRequestHeader("Accept", this.requestHeader);
		this.request.send();
	}
	fetchAPI_XHR_GET_REQUEST() {
		var self = this;

		fetch(this.url).then((response) => response.json()).then((data) => {
			console.log("GET REQUEST loaded. | Fetch API XHR Request |")
			console.log(data);
		}).catch((jqXHR, errorMessage, error) => {
			console.log(jqXHR);
			console.log(errorMessage);
			console.log(error);
		})
	}
	jQueryAPI_XHR_GET_REQUEST() {
		$.ajax({
			url: this.url,
			dataType: "json",
			method: "GET"
		}).done((data) => {
			console.log("GET REQUEST loaded. | jQuery API XHR Get Request | ");
			console.log(data);

			LOGIN(data);
		}).fail((jqXHR, errorMessage, error) => {
			console.log(jqXHR);
			console.log(errorMessage);
			console.log(error);
		})
	}
}

$("button#logIn_BUTTON").click((event) => {
	let REQUEST = new GET_REQUESTS("https://api.github.com/users");

	//REQUEST.normalXHR_GET_REQUEST();
	//REQUEST.fetchAPI_XHR_GET_REQUEST();
	REQUEST.jQueryAPI_XHR_GET_REQUEST();
})

function LOGIN(users) {
	let username = $("input#username").val().trim();
	let password = $("input#password").val().trim();

	let USER = [];
	for (let i = 0; i < users.length; i++) {
		if (users[i].login === username && users[i].node_id === password) {
			USER = users[i]
			break;
		}
	};

	console.log(USER.length);
	console.log(USER.length === 0);

	if (USER.length === 0) {
		let errorLogIn_Label = document.createElement("p");
		errorLogIn_Label.textContent = "The username or the password is wrong";

		errorLogIn_Label.setAttribute("class", "error_LogIn");
		$("loginSection").css({
			"grid-template-rows": "repeat(5, 1fr);"
		});

		$("section#loginSection").append(errorLogIn_Label);

		// After 5 seconds, delete the error message and empty out the username and password boxes
		window.setTimeout(
			() => {
				// Delete the error message from the <loginSection>
				document.querySelector("section#loginSection").removeChild(errorLogIn_Label);
				document.querySelector("section#loginSection").style.gridTemplateRows = "repeat(4, 1fr)"

				// Empty out input boxes
				document.querySelector("input#username").textContent = "";
				document.querySelector("input#password").textContent = "";
			},
			5000
		)
	} else {
		createUserDisplay(USER);
	}
}

function createUserDisplay(USER) {
	$("section#loginSection").css({
		"display": "none"
	});

	// Create the main login section
	let USER_DISPLAY = document.createElement("section");
	USER_DISPLAY.setAttribute("id", "userDisplay");

	USER_DISPLAY.style.textAlign = "center";
	USER_DISPLAY.style.width = "80%";
	USER_DISPLAY.style.margin = "auto";
	USER_DISPLAY.style.marginTop = "50px";
	USER_DISPLAY.style.padding = "10px";

	let userImage = document.createElement("img");
	userImage.setAttribute("src", USER.avatar_url);
	userImage.style.width = "300px";
	userImage.style.height = "300px";

	let userDetails = document.createElement("div");
	Object.entries(USER).map((USER_ENTRY) => {
		if (USER_ENTRY[0] !== "avatar_url") {
			// If it is not the picture , add it to a paragraph. Afterwards add the paragraph to the section
			let userDetailParagraph = document.createElement("p");
			userDetailParagraph.textContent = `${USER_ENTRY[0]} : ${USER_ENTRY[1]}`;

			userDetails.appendChild(userDetailParagraph);
		}
	});

	// Create the logout button

	let logoutButton = document.createElement("button");
	logoutButton.textContent = "Logout";
	logoutButton.setAttribute("class", "loginSection_logoutButton");

	logoutButton.style.backgroundColor = "#333";
	logoutButton.style.color = "#f4f4f4";
	logoutButton.style.border = "0";
	logoutButton.style.padding = "15px";
	logoutButton.style.borderRadius = "20px";

	logoutButton.addEventListener(
		"click",
		(event) => {
			$("section#loginSection").css({
				"display": "grid"
			});
			document.querySelector("section#login_mainSection").removeChild(USER_DISPLAY);
		},
		false // dispatch event in the bubbling phase not in the capturing phase
	)

	// Add everything to the user display
	USER_DISPLAY.appendChild(userImage);
	USER_DISPLAY.appendChild(userDetails);
	USER_DISPLAY.appendChild(logoutButton);

	// Add the user display to the login main section
	$("section#login_mainSection").append(USER_DISPLAY);
}
// LOGIN //

/* LOGIN */