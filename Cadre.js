function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var staff_function = ['PERSONNEL', 'INTEL', 'OPERATIONS', 'LOGISTICS', 'PLANS', 'SIGNAL', 'TRAINING', 'FINANCE'];

if (!state.id) {
  if (word1.toUpperCase().indexOf('LEAD') != -1)  
    state.id = '-lead-';
  else if (word1.toUpperCase().indexOf('ASSIST') != -1)
    state.id = '-assist-';
  if (state.id) {
  	var groupCampaign = project.getOrCreateGroup('CAMPAIGN');
  	contact.addToGroup(groupCampaign);
  	sendReply("What is your function? [PERSONNEL, INTEL, OPERATIONS, LOGISTICS, PLANS, SIGNAL, TRAINING, FINANCE]");
  }
  else {
  	if (contact.vars.command) {
      if (word1.toUpperCase().indexOf('BROADCAST') != -1) {
      	var group = project.getOrCreateGroup("VOLUNTEER");
      	project.sendMessages({
    		content: "[[contact.name]], " + remainder1 + " - " + contact.vars.command, 
    		group_id: group.id,
    		is_template: true
    	});
    	console.log("BROADCAST");
      }
      if (word1.toUpperCase().indexOf('POLL') != -1) {
      	var pollTable = project.getOrCreateDataTable("poll");
		cursor = pollTable.queryRows({});
		cursor.limit(50);
		var candidates = [];
		var votes = [];
		var i = 0;
		while (cursor.hasNext()) {
    	  var row = cursor.next();
    	
    		//console.log(row);
    	  if (candidates.indexOf(row.vars.candidate) == -1)
    	    candidates[i++] = row.vars.candidate;
    	  if (votes[candidates.indexOf(row.vars.candidate)])
    	  	votes[candidates.indexOf(row.vars.candidate)] = votes[candidates.indexOf(row.vars.candidate)] + parseInt(row.vars.votes,10);
    	  else
    	  	votes[candidates.indexOf(row.vars.candidate)] = parseInt(row.vars.votes,10);
		}
		var pollText = '';
		var index, len;
		for (index = 0, len = candidates.length; index < len; ++index) {
    	  pollText = pollText + candidates[index] + " = " + votes[index] + "\n";
		}
		console.log(candidates);
		console.log(votes);
		sendReply(pollText);
      }
	}
  	console.log("not LEAD nor ASSIST");
  }  	
}
else if (state.id == '-lead-') {
  if (staff_function.indexOf(word1.toUpperCase()) != -1) {
  	var groupLeader = project.getOrCreateGroup('LEADER');
  	contact.addToGroup(groupLeader);
  	contact.vars.command = word1.toUpperCase();
  	sendReply("What is your name?");
  	state.id = '-name-';
  }
}
else if (state.id == '-assist-') {
  if (staff_function.indexOf(word1.toUpperCase())) {
  	var groupStaff = project.getOrCreateGroup('STAFF');
  	contact.addToGroup(groupStaff);
  	contact.vars.command = word1.toUpperCase();
  	sendReply("What is your name?");
  	state.id = '-name-';
  }
}
else if (state.id == '-name-') {
  contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
  sendReply("Hi " + contact.name + ", you are now registered as a part of " + contact.vars.command + ".");
  state.id = null;
}