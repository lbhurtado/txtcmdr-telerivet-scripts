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