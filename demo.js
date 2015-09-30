function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function updatePoll(vquestion, vanswer) {
	var pollTable = project.getOrCreateDataTable("DemoPollTable");
	console.log(vquestion);
	console.log(vanswer);
    var pollRow = pollTable.createRow({
    	contact_id: contact.id,
    	vars: {
    		question: vquestion.toLowerCase(),
    		answer: vanswer.toString()
    	}
    });
    console.log(pollRow);
    return pollTable;
}

function sendLoadCredits() {
    var SERVICE_ID = "SVfe986cc377492c69";
    var airtimeService = project.getServiceById(SERVICE_ID);
    airtimeService.invoke({
        context: 'contact',
        contact_id: contact.id
    });
}

    var candidates = {}; 
    myVars['R'] = "Sec. Mar Roxas";
    myVars['B'] = "Vice-President Jejomar Binay";
    myVars['P'] = "Senator Grace Poe-LLamanzares";
    myVars['D'] = "Mayor Rodrigo Duterte";

if (!state.id) {


    console.log(_.keys(myVars));

    cursor = contact.queryGroups({name: {'eq': "Respondents"}}).limit(1);
    //cursor.limit(1);
    if (cursor.hasNext()) {
        sendReply("Hi " + contact.name + ". Your inputs are very much appreciated. We will invite you again on the next survey. Thank you.");
    }
	else if (word1.toUpperCase().indexOf('BAYAN') != -1) {
    	var groupBayan = project.getOrCreateGroup('Bayan');
    	contact.addToGroup(groupBayan);
    	sendReply("Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 5 questions. Reply with 'yes' to proceed.");
    	state.id = 'bayan';
  	}
  	else if (word1.toUpperCase().indexOf('SARILI') != -1)
  		sendReply("Cowardice rightly understood begins with selfishness and ends with shame. - Jose Rizal");
  	else
  		sendReply("Bayan o sarili?");
}
else if (state.id == 'bayan') {
	if (word1.toUpperCase().indexOf('YES') != -1) {
		var groupOptIn = project.getOrCreateGroup('OptIn');
		contact.addToGroup(groupOptIn);
		sendReply("Thank you. Please text your name.");
		state.id = 'name';
	}
	else {
		sendReply("Bayan o sarili?");
		state.id = null;
	}
}
else if (state.id == 'name') {
	contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
	sendReply("Hi " + contact.name + ". Who among the following is your best choice for president in 2016? Select a letter only: 'R' (Roxas), 'B' (Binay), 'P' (Poe), 'D' (Duterte)");
	state.id = 'q1';
}
else if (state.id == 'q1') {
	//var letters = ["A", "B", "C"];
    var letters = _.keys(candidates);
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
    	console.log(word1);
        state.vars.candidate = word1;
    	updatePoll("q1", word1);
		sendReply(contact.name + ", why did you choose this candidate? Select a numeral only: '1' (leadership), '2' (program or agenda), '3' (personality)");
		state.id = 'q2';    	
    }
    else
    	sendReply("Hi " + contact.name + ", just the letter 'A', 'B' or 'C' only. Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");

}
else if (state.id == 'q2') {
	var numerals = ["1", "2", "3"];
    var choice = numerals.indexOf(word1);
    if (choice != -1) {
        state.vars.why = word1;
    	updatePoll("q2", word1);
		sendReply(contact.name + ", what is the most important election issue for you? Select a letter only: 'A' (poverty alleviation), 'B' (jobs creation), 'C' (healthcare)");
		state.id = 'q3';
	}
	else
    	sendReply("Hi " + contact.name + ", just the numeral '1', '2' or '3' only. Why did you choose this candidate? Select a numeral only: '1' (leadership), '2' (program or agenda), '3' (personality)");
}
else if (state.id == 'q3') {
	var letters = ["A", "B", "C"];
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
        state.vars.issue = word1;
    	updatePoll("q3", word1);
		sendReply(contact.name + ", thank you for joining the survey. Load credits will be sent to you shortly.");
		state.id = "done";
        var groupRespondents = project.getOrCreateGroup('Respondents');
        contact.addToGroup(groupRespondents);
        sendLoadCredits();
	}
	else
    	sendReply("Hi " + contact.name + ", just the letter 'A', 'B' or 'C' only. What is the most important election issue for you? Select a letter only: 'A' (poverty alleviation), 'B' (jobs creation), 'C' (healthcare)");
}
else
	console.log('not here');