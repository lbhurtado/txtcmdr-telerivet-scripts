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
		state.id = 'q1';
  }
}
else if (state.id == 'q1') {
	contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
	sendReply("Hi " + contact.name + ". Who among the following is your best choice for Congress in 2016? Select a letter only: 'A' (Juan), 'B' (Pedro), 'C' (Maria))");
	state.id = 'q2';
}
else
	console.log('last');