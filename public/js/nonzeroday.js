var D = {};

function displayGoal(goal, container){
	goalWrapper = $("<div>");	
	label = $("<label>").addClass("goal").text(goal.text).appendTo(goalWrapper);
	$("<input type='checkbox' />").addClass("goalCheck").appendTo(label);
	goalWrapper.appendTo(container);
}

function displayGoals(goals){
	goalContainer = $("#createdGoalsContainer");
	if (goals.length == 0){
		// $("<div>").text("You should add some goals").appendTo(goalContainer);
		
	}else{
		$.each(goals, function(i, goal){
			displayGoal(goal, goalContainer);
		});
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
		goal = {text: goalText, complete:false}
		D.goals.push(goal);
		clearGoals();
		displayGoals(D.goals);
		goalBox.val('');
	}
});


function onStartUp(){
	D.goals = [
				{text: "Finish App",
				 complete: false
				}	
				];
	displayGoals(D.goals);
}

onStartUp();