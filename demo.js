function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function updatePoll(vquestion, vanswer) {
    var pollTable = project.getOrCreateDataTable("DemoPollTable");
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

function poll(question) {
    var vtable = project.getOrCreateDataTable("DemoPollTable");
    var testdata = [];
    cursor = vtable.queryRows({
        vars: {'question': question}
    });
    cursor.limit(50);
    while (cursor.hasNext()) {
        var row = cursor.next();
        testdata.push(row.vars.answer);
    }
    var i = 0, x, count, item;
    while (i < testdata.length) {
        count = 1;
        item = testdata[i];
        x = i + 1;
        while (x < testdata.length && (x = testdata.indexOf(item, x)) != -1) {
            count += 1;
            testdata.splice(x, 1);
        }
        testdata[i] = new Array(testdata[i], count);
        ++i;
    }
    return testdata;
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
candidates['R'] = "Sec. Mar Roxas";
candidates['B'] = "VP Jojo Binay";
candidates['P'] = "Sen. Grace Poe";
candidates['D'] = "Mayor Rody Duterte";

var candidates_list = "";
var candidates_key_list = "";
var i = 0;
var l = _.size(candidates);
for (var key in candidates) {
    if (candidates.hasOwnProperty(key)) {
        candidates_list = candidates_list + "'" + key + "' (" + candidates[key] + ")\n";
        i = i + 1;
        candidates_key_list = candidates_key_list + key;
        if (i < (l - 1)) {
            candidates_key_list = candidates_key_list + ", ";
        }
        else if (i == (l - 1)) {
            candidates_key_list = candidates_key_list + " or ";
        }
    }
}

var reasons = {};
reasons['1'] = "Leadership";
reasons['2'] = "Program or Agenda";
reasons['3'] = "Personality";

var reasons_list = "";
var reasons_key_list = "";
var i = 0;
var l = _.size(reasons);
for (var key in reasons) {
    if (reasons.hasOwnProperty(key)) {
        reasons_list = reasons_list + "'" + key + "' (" + reasons[key] + ")\n";
        i = i + 1;
        reasons_key_list = reasons_key_list + key;
        if (i < (l - 1)) {
            reasons_key_list = reasons_key_list + ", ";
        }
        else if (i == (l - 1)) {
            reasons_key_list = reasons_key_list + " or ";
        }
    }
}

var issues = {};
issues['P'] = "Poverty Alleviation";
issues['J'] = "Jobs Creation";
issues['H'] = "Healthcare";

var issues_list = "";
var issues_key_list = "";
var i = 0;
var l = _.size(issues);
for (var key in issues) {
    if (issues.hasOwnProperty(key)) {
        issues_list = issues_list + "'" + key + "' (" + issues[key] + ")\n";
        i = i + 1;
        issues_key_list = issues_key_list + key;
        if (i < (l - 1)) {
            issues_key_list = issues_key_list + ", ";
        }
        else if (i == (l - 1)) {
            issues_key_list = issues_key_list + " or ";
        }
    }
}

if (!state.id) {
    cursor = contact.queryGroups({name: {'eq': "Respondents"}}).limit(1);
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
    else if (word1.toUpperCase().indexOf('POLL') != -1) {
        var question = "q1";
        var ar = candidates;
        switch (remainder1.toUpperCase()) {
            case 'CANDIDATES':
                question = "q1";
                ar = candidates;
                break;
            case 'REASONS':
                question = "q2";
                ar = reasons;
                break;
            case 'ISSUES':
                question = "q3";
                ar = issues;
                break;
        }
        var poll_text = "";
        var attrib = "";
        var results = poll(question);
        results = _.sortBy(results, function(num){ return num[1]*-1; });
        for (var i=0,  tot=results.length; i < tot; i++) {
            console.log(results[i]);
            attrib = ar[results[i][0]];
            poll_text = poll_text + attrib + " = " + results[i][1] + "\n";
        }
        console.log(poll_text);
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
    else {
        sendReply("Bayan o sarili?");
        state.id = null;
    }
}
else if (state.id == 'name') {
    contact.name = toTitleCase(message.content.replace(/[^\w\s]/gi, '')); //clean up name
    sendReply("Hi " + contact.name + ". Who among the following is your best choice for president in 2016? Select a letter only:\n" + candidates_list);
    state.id = 'q1';
}
else if (state.id == 'q1') {
    var letters = _.keys(candidates);
    var choice = letters.indexOf(word1.toUpperCase());
    if (choice != -1) {
        console.log(word1);
        state.vars.candidate = word1;
        candidate_name = candidates[word1.toUpperCase()];
        updatePoll("q1", word1);
        sendReply(contact.name + ", why did you choose " + candidate_name + "? Select a numeral only:\n" + reasons_list);
        state.id = 'q2';
    }
    else
        sendReply("Hi " + contact.name + ", just send " + candidates_key_list + " only. Who among the following is your best choice for Congress in 2016? Select a letter only:\n" + candidates_list);

}
else if (state.id == 'q2') {
    var numerals = _.keys(reasons);
    var choice = numerals.indexOf(word1);
    if (choice != -1) {
        state.vars.why = word1;
        updatePoll("q2", word1);
        sendReply(contact.name + ", what is the most important election issue for you? Select a letter only:\n" + issues_list);
        state.id = 'q3';
    }
    else {
        candidate_name = candidates[word1.toUpperCase()];
        sendReply("Hi " + contact.name + ", just send " + reasons_key_list + " only. Why did you choose " + candidate_name + "? Select a numeral only:\n" + reasons_list);
    }
}
else if (state.id == 'q3') {
    var letters = _.keys(issues);
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
        sendReply("Hi " + contact.name + ", just send " + issues_key_list + " only. What is the most important election issue for you? Select a letter only:\n" + issues_list);
}
else
    console.log('not here');