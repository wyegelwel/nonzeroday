var D = {};

function toggleGoalCompletion(goal){
	D.goals[D.dayShowing][goal].completed = !D.goals[D.dayShowing][goal].completed;
}

function displayGoal(goal, container){
	goalWrapper = $("<div>");	
	label = $("<label>").addClass("goal").text(goal.text).appendTo(goalWrapper);
	$("<input type='checkbox' />").addClass("goalCheck")
								  .appendTo(label)
								  .attr("name", goal.text)
								  .prop("checked", goal.completed)
								  .click(function(e){
								  		toggleGoalCompletion($(this).attr("name"));
								  });
	goalWrapper.appendTo(container);
}

function displayGoals(goals){
	goalContainer = $("#createdGoalsContainer");
	if (Object.keys(goals).length == 0){
		// $("<div>").text("You should add some goals").appendTo(goalContainer);
	}else{
		for (var goal in goals){
			displayGoal(goals[goal], goalContainer);
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
		goal = {text: goalText, complete:false}
		D.goals[D.dayShowing][goalText] = goal;
		clearGoals();
		displayGoals(D.goals[D.dayShowing]);
		goalBox.val('');
	}
});


function onStartUp(){
	D.goals = {"today":
				{ "Finish App":
					{text: "Finish App",
					 completed: true
					}
				}	
			  };
	D.dayShowing = "today";
	console.log(D.goals[D.dayShowing]);
	displayGoals(D.goals[D.dayShowing]);
}

onStartUp();