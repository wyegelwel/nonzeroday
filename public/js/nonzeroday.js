var D = {goals: [], 
		 dayShowing: ""};
var defaultGoals = {"Add goals": {
									text: "Add goals",
									completed: false
									}};

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


function displayGoal(goal, container){
	goalWrapper = $("<div>");	
	label = $("<label>").addClass("goal").text(goal.text).appendTo(goalWrapper);
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
		for (var goal in goals){
			console.log(goals[goal])
			//Make sure to only try to display goal objects
			if (goals[goal].text){ 
				displayGoal(goals[goal], goalContainer);
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
}

function loadData(){
	goals = localStorage["goals"];
	if (goals){
		D.goals = JSON.parse(goals);
	}else {
		D.goals = {};
	}
}

function updateMonthYear() {			
	$month = $( '#custom-month' ).html( D.cal.getMonthName() );
	$year = $( '#custom-year' ).html( D.cal.getYear() );	
	$month.html( D.cal.getMonthName() );
	$year.html( D.cal.getYear() );
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
		dates = Object.keys(D.goals);
		if (dates.length == 0){
			D.goals[day] = copyGoals(defaultGoals);
		} else{
			//Carry over the goals from the most recent day before 'day'
			dates = $.map(dates,function(v,i){return parseInt(v);}).sort();
			datesBefore = dates.filter(function(v,i){ return (v < day);});
			if (datesBefore.length > 0){
				lastDateBefore = datesBefore[datesBefore.length-1];
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
}

function onStartUp(){
	loadData();
	setupCalendar();
	$(".fc-today").click();
}

onStartUp();


//TODO
/*
When enter is clicked, it refreshes page.. fix that
make selected day partially transparent
make items completed reflect in calendar
left align goals
allow users to add notes when they complete a goal
*/