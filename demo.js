function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

if (!state.id) {
	if (word1.toUpperCase().indexOf('BAYAN') != -1) {
    	var groupBayan = project.getOrCreateGroup('Bayan');
    	contact.addToGroup(groupBayan);
    	sendReply("Welcome to the mock survey for congressional elections. Get a P10 load for answering 5 questions. Reply with “yes” to proceed.");
    	state.id = 'bayan';
  	}
  	elseif (word1.toUpperCase().indexOf('SARILI') != -1)
  		sendReply("To each his own.");
  	else
  		sendReply("Bayan o sarili?");
}
elseif (state.id == 'bayan') {
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
elseif (state.id == 'name') {
	contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
	sendReply("Hi " + contact.name + ". Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");
	state.id = 'q1';
}
elseif (state.id == 'q1') {
	var letters = ["A", "B", "C"];
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
		sendReply(contact.name + ", why did you choose this candidate? Select a numeral only: '1' (leadership), '2' (program or agenda), '3' (personality)");
		state.id = 'q2';    	
    }
    else
    	sendReply("Hi " + contact.name + ", just the letter 'A', 'B' or 'C' only. Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");

}
elseif (state.id == 'q2') {
	var numerals = ["1", "2", "3"];
    var choice = numerals.indexOf(word1);
    if (choice != -1) {
		sendReply(contact.name + ", what is the most important election issue for you? Select a letter only: 'A' (poverty alleviation), 'B' (jobs creation), 'C' (healthcare)");
		state.id = 'q3';
	}
	else
    	sendReply("Hi " + contact.name + ", just the numeral '1', '2' or '3' only. Why did you choose this candidate? Select a numeral only: '1' (leadership), '2' (program or agenda), '3' (personality)");
}
elseif (state.id == 'q3') {
	var letters = ["A", "B", "C"];
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
		sendReply(contact.name + ", thank you for joining the survey. A P10 load will be sent to you shortly.");
		state.id = null;
	}
	else
    	sendReply("Hi " + contact.name + ", just the letter 'A', 'B' or 'C' only. What is the most important election issue for you? Select a letter only: 'A' (poverty alleviation), 'B' (jobs creation), 'C' (healthcare)");
}
else
	console.log('not here');