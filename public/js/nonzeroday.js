var D = {goals: [], 
		 dayShowing: -1};

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
		D.goals = [{date: "today", 
					"Add goals": {
									text: "Add goals",
									completed: false
					}}];
	}
	D.dayShowing = D.goals.length - 1; //goals pushed to end of list for each day 
}

function updateMonthYear() {			
	$month = $( '#custom-month' ).html( cal.getMonthName() );
	$year = $( '#custom-year' ).html( cal.getYear() );	
	$month.html( cal.getMonthName() );
	$year.html( cal.getYear() );
}

function setupCalendar(){
	$calendar = $( '#calendar' );
	cal = $calendar.calendario( {
		onDayClick : function( $el, $contentEl, dateProperties ) {
			console.log(dateProperties);
		},
		
		displayWeekAbbr : true
	} );
	$month = $( '#custom-month' ).html( cal.getMonthName() );
	$year = $( '#custom-year' ).html( cal.getYear() );

	$( '#custom-next' ).on( 'click', function() {
		cal.gotoNextMonth( updateMonthYear );
	} );
	$( '#custom-prev' ).on( 'click', function() {
		cal.gotoPreviousMonth( updateMonthYear );
	} );
}

function onStartUp(){
	loadData();
	setupCalendar();
	console.log(D.goals[D.dayShowing]);
	displayGoals(D.goals[D.dayShowing]);

}

onStartUp();