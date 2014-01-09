var D = {goals: [], 
		 dayShowing: ""};
var defaultGoals = {"Exercise": {
									text: "Exercise",
									completed: false
									},
					 "Read": {
					 			text: "Read",
					 			completed: false
					 }};
var defaultColors = ["rgb(105, 177, 240)", "#ed9c28", "#3276b1", "#47a447", "#39b3d7", "#d2322d"]

function toggleGoalCompletion(goal){
	console.log(goal)
	D.goals[D.dayShowing][goal].completed = !D.goals[D.dayShowing][goal].completed;
	saveData();
}

function removeGoal(goal){
	console.log(goal)
	delete D.goals[D.dayShowing][goal];
	clearGoals();
	displayGoals(D.goals[D.dayShowing]);
	saveData();
}


function displayGoal(goal, container, opts){
	goalWrapper = $("<div>");	
	label = $("<label>").addClass("goal").text(goal.text).css("color", opts.textColor).appendTo(goalWrapper);
	$("<input type='checkbox' />").addClass("goalCheck")
								  .appendTo(label)
								  .attr("name", goal.text)
								  .prop("checked", goal.completed)
								  .click(function(e){
								  		toggleGoalCompletion(goal.text);
								  });
	removeButton = $("<button>").attr("name", goal.text)
								.addClass("btn btn-danger btn-lg btn-rm")
								.click(function(e){
									removeGoal(goal.text)
								})
								.appendTo(goalWrapper);					
	$("<span>").addClass("glyphicon glyphicon-remove-sign glyphicon-rm").appendTo(removeButton);
	goalWrapper.appendTo(container);
}

function displayGoals(goals){
	console.log(goals)
	goalContainer = $("#createdGoalsContainer");
	if (Object.keys(goals).length > 0){
		var i = 0;
		for (var goal in goals){
			console.log(goals[goal])
			//Make sure to only try to display goal objects
			if (goals[goal].text){ 
				displayGoal(goals[goal], goalContainer, {textColor: defaultColors[i]});
				i++;
			}	
		}
	}
}

function clearGoals(){
	$("#createdGoalsContainer").empty();
}

$("#addBtn").click(function(){
	goalBox = $("#newGoal");
	goalText = $.trim(goalBox.val());
	console.log(goalText)
	if (goalText.length > 0){
		goal = {text: goalText, completed:false}
		D.goals[D.dayShowing][goalText] = goal;
		clearGoals();
		displayGoals(D.goals[D.dayShowing]);
		goalBox.val('');
		saveData();
	}
});

function saveData(){
	localStorage["goals"] = JSON.stringify(D.goals);
	colorCalendar();
}

function loadData(){
	goals = localStorage["goals"];
	if (goals){
		D.goals = JSON.parse(goals);
	}else {
		D.goals = {};
	}
}

function copyGoals(goals){
	newGoals = {};
	for (goal in goals){
		newGoals[goal] = {"text": goal,
						  "completed": false};
	}
	return newGoals;
}

function daySelected(day){
	if (!D.goals[day]){
		var dates = Object.keys(D.goals);
		if (dates.length == 0){
			D.goals[day] = copyGoals(defaultGoals);
		} else{
			//Carry over the goals from the most recent day before 'day'
			dates = $.map(dates,function(v,i){return parseInt(v);}).filter(function(v,i){ return (v < day);});
			var datesBefore = dates.sort();
			if (datesBefore.length > 0){
				var lastDateBefore = datesBefore[datesBefore.length-1];
				D.goals[day] = copyGoals(D.goals[lastDateBefore]);
			}else{
				D.goals[day] = copyGoals(defaultGoals);
			}
		}
	}
	D.dayShowing = day;
	clearGoals();
	displayGoals(D.goals[D.dayShowing]);
	saveData();
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function colorCalendar(){
	var currMonth = D.cal.getMonth();
	for (date in D.goals){
		var month = parseInt(date.substring(4,6));
		var day = parseInt(date.substring(6,8));
		if (currMonth == month && Object.keys(D.goals[date]).length > 0){
			var cell = $(D.cal.getCell(day));
			var goalCompleted = false;
			var step = 1/Object.keys(D.goals[date]).length*100;
			var goalCss = "";
			var i = 0;
			for (goal in D.goals[date]){
				var color = (D.goals[date][goal].completed) ? defaultColors[i] : "white";
				goalCss += color + " " + i*step + "%, " + color + " " + (i+1)*step + "%,";
				i++;
			}
			goalCss = goalCss.substring(0, goalCss.length-1);

			cell.css("background", "-webkit-linear-gradient(top, " + goalCss + ")");			
			cell.css("background", "-o-linear-gradient(top, " + goalCss + ")");
			cell.css("background", "-moz-linear-gradient(top, " + goalCss + ")");
			cell.css("background", "-ms-linear-gradient(top, " + goalCss + ")");
			cell.css("background", "linear-gradient(to bottom, " + goalCss + ")");
		}
	}
}

function updateMonthYear() {			
	$month = $( '#custom-month' ).html( D.cal.getMonthName() );
	$year = $( '#custom-year' ).html( D.cal.getYear() );	
	$month.html( D.cal.getMonthName() );
	$year.html( D.cal.getYear() );

	colorCalendar();
}

function setupCalendar(){
	$calendar = $( '#calendar' );
	D.cal = $calendar.calendario( {
		onDayClick : function( $el, $contentEl, date ) {
			console.log(date);
			$(".fc-selected").removeClass("fc-selected");
			$el.addClass("fc-selected");
			daySelected(date.year + "" + pad(date.month) + pad(date.day));
		},
		
		displayWeekAbbr : true
	} );
	$month = $( '#custom-month' ).html( D.cal.getMonthName() );
	$year = $( '#custom-year' ).html( D.cal.getYear() );

	$( '#custom-next' ).on( 'click', function() {
		D.cal.gotoNextMonth( updateMonthYear );
	} );
	$( '#custom-prev' ).on( 'click', function() {
		D.cal.gotoPreviousMonth( updateMonthYear );
	} );

	colorCalendar();
}

$("#addForm").submit(function() {$("#addBtn").click()});

function onStartUp(){
	loadData();
	setupCalendar();
	$(".fc-today").click();
}

onStartUp();


//TODO
/*
allow users to add notes when they complete a goal
have color of goal consistent through days
select color that work well with text
*/