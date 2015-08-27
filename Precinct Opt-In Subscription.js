function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

if (!state.id) {
  if (word1.toUpperCase().indexOf('VOLUNTEER') != -1) {
    var groupCampaign = project.getOrCreateGroup('CAMPAIGN');
    contact.addToGroup(groupCampaign);
    sendReply("What is your precinct number? [0007A, 0008A, 0009A, 0010A, 0011A, 0011B, 0012A, 0013A]");
    state.id = 'precinct';
  }
}
else if (state.id == 'precinct') {
  var precinct_id = String('00000' + message.content.replace(/\W/g, '').toUpperCase()).slice(-5); //clean up and format to 0001A
  if (contact.vars.poptable_id)
    var popTable = project.initDataTableById(contact.vars.poptable_id);  
  else
    var popTable = project.getOrCreateDataTable("pop");
  tableCursor = popTable.queryRows({
    vars: {'precinct_id': precinct_id} //compare word1 to precinct_id column
  });
  tableCursor.limit(1);
  if (tableCursor.hasNext()) {
    var popRow = tableCursor.next();
    if (popRow.id) { //keyword for precinct_id exists in pop table
      contact.vars.poptable_id = popTable.id;
      contact.vars.poprow_id = popRow.id; //update contact reference to pop table
      contact.vars.precinct = precinct_id;
      contact.vars.cluster = popRow.vars.cluster_id;
      var groupVolunteer = project.getOrCreateGroup('VOLUNTEER');
      contact.addToGroup(groupVolunteer);
      state.id = 'name';
      sendReply("What is your name?");
    }
  }
  else
    sendReply("Please check your entry, what is your precinct number? [0007A, 0008A, 0009A, 0010A, 0011A, 0011B, 0012A, 0013A]");
}
else if (state.id == 'name') {
  contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
  var popTable = project.initDataTableById(contact.vars.poptable_id); 
  var popRow = popTable.getRowById(contact.vars.poprow_id);
  sendReply("Hi " + contact.name + ", you are now registered as a volunteer watcher of precinct " + popRow.vars.precinct_id + ". Please report to " + toTitleCase(popRow.vars.polling_place) + " on election day."); 
  
  var SERVICE_ID = "SV3145710a9a61d107";
  var airtimeService = project.getServiceById(SERVICE_ID);
  airtimeService.invoke({
    context: 'contact',
    contact_id: contact.id
  });

  state.id = null;
}