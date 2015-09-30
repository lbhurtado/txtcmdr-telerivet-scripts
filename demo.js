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
}
else if (state.id == 'name') {
	contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
	sendReply("Hi " + contact.name + ". Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");
	state.id = 'q1';
}
else if (state.id == 'q1') {
	var letters = ["A", "B", "C"];
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
		sendReply(contact.name + ", why did you choose this candidate? Select a numeral only: '1' (leadership), '2' (program or agenda), '3' (personality)");
		state.id = 'q2';    	
    }
    else
    	sendReply("Hi " + contact.name + ", just the letters 'A', 'B' or 'C' only. Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");

}
else if (state.id == 'q2') {
	sendReply(contact.name + ", what is the most important election issue for you? Select a letter only: 'A' (poverty alleviation), 'B' (jobs creation), 'C' (healthcare)");
	state.id = 'q3';
}
else if (state.id == 'q3') {
	sendReply(contact.name + ", thank you for joining the survey. A P10 load will be sent to you shortly.");
	state.id = null;
}
else
	console.log('not here');