function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function updatePoll(vcontact, vcandidate, vvotes) {
  if (vcontact.vars.polltable_id) {
    var pollTable = project.initDataTableById(vcontact.vars.polltable_id);
    cursor = pollTable.queryRows({
      vars: {
        'cluster_id': vcontact.vars.cluster, 
        'candidate': vcandidate
      }
    });
    cursor.limit(1);
    if (cursor.hasNext()) {
      var pollRow = cursor.next();
      pollRow.vars.votes = vvotes;
      pollRow.save();
    }
    else 
      var pollRow = pollTable.createRow({
        contact_id: contact.id, 
        vars: {
          'poprow_id': vcontact.vars.poprow_id,
          'cluster_id': vcontact.vars.cluster,
          'candidate': vcandidate.toUpperCase(),
          'votes': vvotes
        }
      });  
  }
  else { 
    var pollTable = project.getOrCreateDataTable("poll");
    var pollRow = pollTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': vcontact.vars.poprow_id,
        'cluster_id': vcontact.vars.cluster,
        'candidate': vcandidate.toUpperCase(),
        'votes': vvotes
      }
    });
    vcontact.vars.polltable_id = pollTable.id;
  }
  return pollTable;
}

if (!state.id) {
  if (contact.vars.poprow_id) {
    if (word1.toUpperCase().indexOf('START') != -1) {
      var pollwatchTable = project.getOrCreateDataTable("pollwatch");
      var pollwatchRow = pollwatchTable.createRow({
        contact_id: contact.id, 
        vars: {
          'poprow_id': contact.vars.poprow_id, 
          'event': "START",
          'remarks': remainder1
        }
      });
      contact.vars.pollwatchtable_id = pollwatchTable.id;
      var popTable = project.initDataTableById(contact.vars.poptable_id); 
      var popRow = popTable.getRowById(contact.vars.poprow_id);
      sendReply(contact.name + ", please proceed to " + toTitleCase(popRow.vars.polling_place) + " precinct " + popRow.vars.precinct_id + ". Please eat your breakfast and bring your ID, snacks, whistle, pen and paper. Send 'HERE <remarks if any>' when you get there.");
      state.id = '-here-';
    }
  }
  else // add check membership to groups of contact
    if (!contact.vars.command)
      sendReply("Please volunteer your services by sending 'VOLUNTEER' to this number.");
}
else if (state.id == '-here-') {
  if (word1.toUpperCase().indexOf('HERE') != -1) {
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "HERE",
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! Please observe the initialization of the PCOS machine. Make sure all the votes are zeroed out. Cast your vote and send 'VOTE <remarks if any>'.");
    state.id = '-init-';
  }
}
else if (state.id == '-init-') {
  if (word1.toUpperCase().indexOf('VOTE') != -1) {
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "INITIALIZATION",
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! Please count and send the total number of voters every hour <# of voters> <remarks>'.");
    state.id = '-hourly-';
  }
}
else if (state.id == '-hourly-') {
  if (parseInt(word1,10) == word1) {
    console.log(word1);
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "HOURLY",
        'count': word1,
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! We got your latest head count - " + word1 + ". If the casting of votes is over please send 'OVER'. Otherwise, please count and send the total number of voters every hour <# of voters> <remarks>'.");
  }
  else if (word1.toUpperCase().indexOf('OVER') != -1) {
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "OVER",
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! Please observe the finalization of the PCOS machine. Send 'FINAL' when done.");
    state.id = '-over-'; 
  }
  else
    sendReply(message.content + " is not a valid entry. If the casting of votes is over please send 'OVER'. Otherwise, please count and send the total number of voters every hour <# of voters> <remarks>'.");
}
else if (state.id == '-over-') {
  if (word1.toUpperCase().indexOf('FINAL') != -1) {
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "FINALIZATION",
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! Please tell us when the printing of results has started. Send 'PRINT' and get our copy of the election return.");
    state.id = '-printing-';
  }
}
else if (state.id == '-printing-') {
  if (word1.toUpperCase().indexOf('PRINT') != -1) {
    var pollwatchTable = project.initDataTableById(contact.vars.pollwatchtable_id); 
    var pollwatchRow = pollwatchTable.createRow({
      contact_id: contact.id, 
      vars: {
        'poprow_id': contact.vars.poprow_id, 
        'event': "PRINTING",
        'remarks': remainder1
      }
    });
    sendReply("Good job " + contact.name + "! Now send the votes of Bong-bong Marcos. Please follow the syntax 'MARCOS <votes>'.");
    state.id = 'CANDIDATE1';
  }
}
else if (state.id == 'CANDIDATE1') {
  if (word1.toUpperCase().indexOf('MARCOS') != -1) {
    if (parseInt(remainder1,10) == remainder1) {
      updatePoll(contact, 'MARCOS', remainder1);
      sendReply("Good job " + contact.name + "! We got your report - " + word1.toUpperCase() + "\n" + remainder1 + ". Now send the votes of Grace Poe. Please follow the syntax 'POE <votes>'.");
      state.id = 'CANDIDATE2';
    }
    else
      sendReply("Please follow the syntax 'MARCOS <votes>'.");
  }
  else
    sendReply("Please follow the syntax 'MARCOS <votes>'.");
}
else if (state.id == 'CANDIDATE2') {
  if (word1.toUpperCase().indexOf('POE') != -1) {
    if (parseInt(remainder1,10) == remainder1) {
      updatePoll(contact, 'POE', remainder1);
      sendReply("Good job " + contact.name + "! We got your report - " + word1.toUpperCase() + "\n" + remainder1 + ". Now send the votes of Mar Roxas. Please follow the syntax 'ROXAS <votes>'.");
      state.id = 'CANDIDATE3';
    }
    else
      sendReply("Please follow the syntax 'POE <votes>'.");
  }
  else
    sendReply("Please follow the syntax 'POE <votes>'.");
}
else if (state.id == 'CANDIDATE3') {
  if (word1.toUpperCase().indexOf('ROXAS') != -1) {
    if (parseInt(remainder1,10) == remainder1) {
      updatePoll(contact, 'ROXAS', remainder1);
      sendReply("Good job " + contact.name + "! We got your report - " + word1.toUpperCase() + "\n" + remainder1 + ". Now send the votes of Jejomar Binay. Please follow the syntax 'BINAY <votes>'.");
      state.id = "CANDIDATE4";
    }
    else
      sendReply("Please follow the syntax 'ROXAS <votes>'.");
  }
  else
    sendReply("Please follow the syntax 'ROXAS <votes>'.");
}
else if (state.id == 'CANDIDATE4') {
  if (word1.toUpperCase().indexOf('BINAY') != -1) {
    if (parseInt(remainder1,10) == remainder1) {
      var pollTable = updatePoll(contact, 'BINAY', remainder1);
      sendReply("Good job " + contact.name + "! We got your report - " + word1.toUpperCase() + "\n" + remainder1 + ". Please submit the Election Return to the headquarters. Thank you for your support.");
      cursor = pollTable.queryRows({
        contact_id: contact.id
      });
      cursor.limit(4);
      var pollText = '';
      while (cursor.hasNext()) {
        var row = cursor.next();
        pollText = pollText + row.vars.candidate + " = " + row.vars.votes + "\n";
        console.log(row.vars.candidate + " = " + row.vars.votes);
      }
      sendReply(pollText);
      state.id = null;
    }
    else
      sendReply("Please follow the syntax 'BINAY <votes>'.");
  }
  else
    sendReply("Please follow the syntax 'BINAY <votes>'.");
}