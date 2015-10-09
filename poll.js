/**
 * Created by lbhurtado on 10/2/15.
 */
const FIRST_ELEMENT = 0;
const NO_ELEMENTS = 0;

_.mixin({
    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },
    titleCase: function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    inSeveralLines: function (choices) {
        var list = "\n";
        for (var key in choices) {
            list = list + "'" + key + "' (" + choices[key] + ")" + ((_.last(choices, key)) ? "\n" : "");
        }

        return list;
    },
    keysInALine: function (choices) {
        var key_list = "";
        var i = 0;
        var l = _.size(choices);
        for (var key in choices) {
            i = i + 1;
            key_list = key_list + key;
            if (i < (l - 1)) {
                key_list = key_list + ", ";
            }
            else if (i == (l - 1)) {
                key_list = key_list + " or ";
            }
        }

        return key_list;
    },
    lookUp: function (choices, key) {

    }
});

function updatePoll(vquestion, vanswer) {
    var table = project.getOrCreateDataTable("DemoPollTable");
    var row = table.createRow({
        contact_id: contact.id,
        vars: {
            question: vquestion.toLowerCase(),
            answer: vanswer.toUpperCase()
        }
    });
    console.log(row);

    return table; //TODO: add update on duplicate
}

function postResponse(vquestion, vanswer) {
    var url = "http://128.199.81.129/txtcmdr/ask4questions/response/store/demo/" + vquestion + "/" + vanswer;
    var response = httpClient.request(url, {
        method: 'POST'
    });
    console.log(url);
}

function sendLoadCredits(amount) {
    var SERVICE_ID = "SVfe986cc377492c69";
    var airtimeService = project.getServiceById(SERVICE_ID);
    airtimeService.invoke({
        context: 'contact',
        contact_id: contact.id
    });
}

function postSurvey() {
    var url = "http://128.199.81.129/txtcmdr/ask4questions/survey/store/demo";
    console.log(url);
    return httpClient.request(url, {
        method: "POST",
        data: {
            description: "demo survey",
            data: survey
        }
    });
}

var dilaab = {
    'default': {
        'id': "default-id",
        'state': null, // null is a catch-all, required!
        'question': "Welcome to Gethsemane Parish",
        'instruction': "Please choose a simulation:",
        'choices': {
            'I': "Info",
            'R': "Reflection",
            'F': "Feedback"
        },
        'goto': {
            'I': "info-id",
            'R': "reflection-id",
            'F': "feedback-id"
        },
        'regex': {
            'pattern': "^(I|R|F|X)$",
            'modifier': "i"
        },
        next: "default-id"
    },
    'info': {
        'id': "info-id",
        'state': "info-state",
        'question': "parish priest: Fr. Mel Diola\ntelephone: 346-9560\naddress:Casuntingan, Mandaue City, Cebu",
        'instruction': "",
        'choices': {
            'R': "Reflection",
            'F': "Feedback"
        },
        'goto': {
            'R': "reflection-id",
            'F': "feedback-id"
        },
        'regex': {
            'pattern': "^(R|F|X)$",
            'modifier': "i"
        },
        next: "default-id",
    },
    'reflection': {
        'id': "reflection-id",
        'state': "reflection-state",
        'question': "",
        'instruction': "gospel: Luke 11:5-13\nponder: Think of a time when your persistence in prayer was rewarded with something far greater than you could imagine. Did God change His mind, or did your heart and will actually change to be more in line with God’s?\npray: Lord Jesus, thank you for teaching us about prayer. Thank you for giving us the words. Thank you for encouraging us to persevere in our relationship with God, so that we may come to pray for His will to be done in our lives. When it is tiring to persist, give us the grace we need to trust that God’s good gifts for our lives are better than we could imagine. Amen.",
        'choices': {
            'I': "Info",
            'F': "Feedback"
        },
        'goto': {
            'I': "info-id",
            'F': "feedback-id"
        },
        'regex': {
            'pattern': "^(I|F|X)$",
            'modifier': "i"
        },
        next: "default-id",
    },
    'feedback': {
        'id': "feedback-id",
        'state': "feedback-state",
        'question': "How was the homily",
        'instruction': "Select a numeral only:",
        'choices': {
            '5': "Excellent",
            '4': "Very Good",
            '3': "Good",
            '2': "Fair",
            '1': "Needs improvement"
        },
        'regex': {
            'pattern': "^(5|4|3|2|1)$"
        },
        process: {
            'choice': "homily",
        },
        next: "default-id"
    },
}

var survey = {
    'default': {
        'id': "default-id",
        'state': null, // null is a catch-all, required!
        'question': "Welcome to the nth POWER demonstration.",
        'instruction': "Please choose a simulation:",
        'choices': {
            'S': "Survey",
            'W': "Poll Watch",
            'Q': "PCOS Quick Count",
            'C': "CCS Quick Count",
            'R': "Results",
        },
        'goto': {
            'S': "survey-opt-in-id",
            'W': "pollwatch-q1-id",
            'Q': "pollwatch-q7-id",
            'C': "pollwatch-q7-id",
            'R': "under-construction-id",
            'X': "exit-id"
        },
        'regex': {
            'pattern': "^(S|W|Q|C|R|X)$",
            'modifier': "i"
        },
        next: "exit-id",
    },
    'under-construction': {
        'id': "under-construction-id",
        'state': "under-construction-state",
        'question': "Under construction. - nth POWER",
        'regex': {
            'pattern': ".*",
            'modifier': "i"
        },
        next: "default-id"
    },
    'exit': {
        'id': "exit-id",
        'state': "exit-state",
        'question': "Thank you for participating. - nth POWER",
        'regex': {
            'pattern': "^(X)$",
            'modifier': "i"
        },
        next: "default-id"
    },
    'survey-opt-in': {
        'id': "survey-opt-in-id",
        'state': "survey-opt-in-state",
        'question': "Get load credits for answering 4 questions. Proceed?",
        'instruction': "Answer 'Y' or 'Yes' to proceed.",
        'choices': {
            'Y': "Yes",
            'N': "No"
        },
        'goto': {
            'Y': "survey-name-id",
            'N': "exit-id"
        },
        'regex': {
            "pattern": "^(Y|N).*?$",
            'modifier': "i"
        },
        'process': {
            'group': "Opted In"
        },
        next: "survey-name-id"
    },
    'survey-name': {
        'id': "survey-name-id",
        'state': "survey-name-state",
        'question': "What is your name?",
        'instruction': "No special characters please.",
        'regex': {
            "pattern": "^(?!\\s)([a-zA-Z0-9\\s]*)+$"
        },
        process: {
            'name': true
        },
        next: "survey-q1-id"
    },
    'survey-q1': {
        'id': "survey-q1-id",
        'state': "survey-q1-state",
        'question': "[[contact.name]], who among the following is your best choice for president in 2016?",
        'instruction': "Select a letter only:",
        'choices': {
            'R': "Sec. Mar Roxas",
            'B': "VP Jojo Binay",
            'P': "Sen. Grace Poe",
            'D': "Mayor Rody Duterte"
        },
        'regex': {
            'pattern': "^(R|B|P|D)$"
        },
        process: {
            'choice': "candidate",
            'database': true,
            'response': true
        },
        'http': {
            'url': "http://128.199.81.129/txtcmdr/ask4questions/response/store/demo/q1/P",
            'method': "POST"
        },
        next: "survey-q2-id"
    },
    'survey-q2': {
        'id': "survey-q2-id",
        'state': "survey-q2-state",
        'question': "[[contact.name]], why did you choose [[contact.vars.candidate]]?",
        'instruction': "Select a numeral only:",
        'choices': {
            '1': "Leadership",
            '2': "Program or Agenda",
            '3': "Personality"
        },
        'regex': {
            'pattern': "^(1|2|3)$"
        },
        process: {
            'choice': "reason",
            'database': true
        },
        next: "survey-q3-id"
    },
    'survey-q3': {
        'id': "survey-q3-id",
        'state': "survey-q3-state",
        'question': "[[contact.name]], what is the most important election issue for you?",
        'instruction': "Select a letter only:",
        'choices': {
            'P': "Poverty Alleviation",
            'J': "Jobs Creation",
            'H': "Healthcare"
        },
        'regex': {
            'pattern': "^(P|J|H)$"
        },
        process: {
            'choice': "issue",
            'database': true,
            'credit': 10
        },
        next: "survey-thank-you-id"
    },
    'survey-thank-you': {
        'id': "survey-thank-you-id",
        'state': "survey-thank-you-state",
        'question': "Thank you for participating in the survey. Please come back. - nth POWER",
        'instruction': "Please choose a simulation:",
        'choices': {
            'S': "Survey",
            'W': "Poll Watch",
            'Q': "PCOS Quick Count",
            'C': "CCS Quick Count",
            'R': "Results",
        },
        'goto': {
            'S': "survey-q1-id",
            'W': "pollwatch-q1-id",
            'Q': "under-construction-id",
            'C': "under-construction-id",
            'R': "under-construction-id",
            'X': "exit-id"
        },
        'regex': {
            'pattern': "^(S|W|Q|C|R|X)$",
            'modifier': "i"
        },
        next: "landing-id"
    },
    'landing': {
        'id': "landing-id",
        'state': "landing-state",
        'question': "[[contact.name]], welcome back to the nth POWER demonstration.",
        'instruction': "Please choose a simulation:",
        'choices': {
            'S': "Survey",
            'W': "Poll Watch",
            'Q': "PCOS Quick Count",
            'C': "CCS Quick Count",
            'R': "Results",
        },
        'goto': {
            'S': "survey-q1-id",
            'W': "pollwatch-q1-id",
            'Q': "under-construction-id",
            'C': "under-construction-id",
            'R': "under-construction-id",
            'X': "exit-id"
        },
        'regex': {
            'pattern': "^(S|W|Q|C|R|X)$",
            'modifier': "i"
        },
        next: "exit-id",
    },
    'pollwatch-q1': {
        'id': "pollwatch-q1-id",
        'state': "pollwatch-q1-state",
        'question': "[[contact.name]], please proceed to Precinct 001A in Mohon Elementary School, Barangay Mohon, Sta. Teresita, Batangas. Are you on your way?",
        'instruction': "Please eat your breakfast and bring your ID, snacks, whistle, pen and paper. Send 'Y' or 'Yes' to proceed.",
        'choices': {
            'Y': "Yes",
            'N': "No",
            'S': "SOS!"
        },
        'goto': {
            'Y': "pollwatch-q2-id",
            'N': "pollwatch-q1-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(Y|N|S).*?$",
            'modifier': "i"
        },
        process: {
            'group': "pollwatch-candidate",
        },
        next: "pollwatch-q2-id"
    },
    'pollwatch-q2': {
        'id': "pollwatch-q2-id",
        'state': "pollwatch-q2-state",
        'question': "[[contact.name]], are you there in the precinct?",
        'instruction': "Send 'H' to proceed.",
        'choices': {
            'H': "Here already",
            'N': "Not yet",
            'I': "More information",
            'S': "SOS!"
        },
        'goto': {
            'H': "pollwatch-q3-id",
            'N': "pollwatch-q2-id",
            'I': "pollwatch-q2-info1-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(H|N|I|S).*?$",
            'modifier': "i"
        },
        process: {
            'group': "pollwatcher",
        },
        next: "pollwatch-q3-id"
    },
    'pollwatch-q2-info1': {
        'id': "pollwatch-q2-info1-id",
        'state': "pollwatch-q2-info1-state",
        'question': "Put info 1 here. Blah, blah, blah... [[contact.name]], are you there in the precinct?",
        'instruction': "Send 'H' to proceed.",
        'choices': {
            'H': "Here already",
            'N': "Not yet",
            'I': "More information",
            'S': "SOS!"
        },
        'goto': {
            'H': "pollwatch-q3-id",
            'N': "pollwatch-q2-id",
            'I': "pollwatch-q2-info2-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(H|N|I|S).*?$",
            'modifier': "i"
        },
        next: "pollwatch-q3-id"
    },
    'pollwatch-q2-info2': {
        'id': "pollwatch-q2-info2-id",
        'state': "pollwatch-q2-info2-state",
        'question': "Put info 2 here. Blah, blah, blah... [[contact.name]], are you there in the precinct?",
        'instruction': "Send 'H' to proceed.",
        'choices': {
            'H': "Here already",
            'N': "Not yet",
            'S': "SOS!"
        },
        'goto': {
            'H': "pollwatch-q3-id",
            'N': "pollwatch-q2-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(H|N|S).*?$",
            'modifier': "i"
        },
        next: "pollwatch-q3-id"
    },
    'pollwatch-q3': {
        'id': "pollwatch-q3-id",
        'state': "pollwatch-q3-state",
        'question': "Good job [[contact.name]]!\nPlease observe the initialization of the PCOS machine.\nMake sure all the votes are zeroed out.\nCast your vote now.",
        'instruction': " Send 'V' to proceed.",
        'choices': {
            'V': "Voted already",
            'N': "Not yet",
            'S': "SOS!"
        },
        'goto': {
            'V': "pollwatch-q4-id",
            'N': "pollwatch-q3-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(V|N|S).*?$",
            'modifier': "i"
        },
        process: {
            'group': "voter",
        },
        next: "pollwatch-q4-id"
    },
    'pollwatch-q4': {
        'id': "pollwatch-q4-id",
        'state': "pollwatch-q4-state",
        'question': "Good job " + contact.name + "! How many have casted their votes so far?",
        'instruction': "Send the total number of voters every hour.",
        'choices': {
            'L': "~ 50",
            'C': "~ 100",
            'CC': "~ 200",
            'CCC': "~ 300",
            'CD': "~ 400",
            'D': "~ 500",
            'DC': "~ 600",
            'DCC': "~ 700",
            'DCCC': "~ 800",
            'CM': "~ 900",
            'M': "~ 1,000",
            'O': "Over.  Casting of votes is finished.",
            'S': "SOS!"
        },
        'goto': {
            'O': "pollwatch-q5-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(L|C|CC|CCC|CD|D|DC|DCC|DCCC|CM|M|O|S)$",
            'modifier': "i"
        },
        next: "pollwatch-q4-id"
    },
    'pollwatch-q5': {
        'id': "pollwatch-q5-id",
        'state': "pollwatch-q5-state",
        'question': "Good job [[contact.name]]!\nPlease observe the finalization of the PCOS machine.\nMake sure all the ballots are accounted for.",
        'instruction': "Send 'F' to proceed.",
        'choices': {
            'F': "Finalized",
            'N': "Not yet",
            'S': "SOS!"
        },
        'goto': {
            'F': "pollwatch-q6-id",
            'N': "pollwatch-q5-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(F|N|S)$",
            'modifier': "i"
        },
        next: "pollwatch-q6-id"
    },
    'pollwatch-q6': {
        'id': "pollwatch-q6-id",
        'state': "pollwatch-q6-state",
        'question': "Good job [[contact.name]]!\nPlease tell us when the PCOS machine starts printing results.\nGet our copy of the election return.",
        'instruction': "Send 'P' to proceed.",
        'choices': {
            'P': "Printing",
            'N': "Not yet",
            'S': "SOS!"
        },
        'goto': {
            'P': "pollwatch-q7-id",
            'N': "pollwatch-q6-id",
            'S': "pollwatch-sos-id"
        },
        'regex': {
            "pattern": "^(P|N|S)$",
            'modifier': "i"
        },
        next: "pollwatch-q6-id"
    },
    'pollwatch-q7': {
        'id': "pollwatch-q7-id",
        'state': "pollwatch-q7-state",
        'question': "[[contact.name]], please send the results of ROXAS. Send 'ROXAS ###' to proceed.\n",
        'instruction': "",
        'regex': {
            "pattern": "^(ROXAS)\\s?(\\d{1,3})$",
            'modifier': "i"
        },
        next: "pollwatch-q8-id"
    },
    'pollwatch-q8': {
        'id': "pollwatch-q8-id",
        'state': "pollwatch-q8-state",
        'question': "[[contact.name]], please send the results of BINAY. Send 'BINAY ###' to proceed.\n",
        'instruction': "",
        'regex': {
            "pattern": "^(BINAY)\\s?(\\d{1,3})$",
            'modifier': "i"
        },
        next: "pollwatch-q9-id"
    },
    'pollwatch-q9': {
        'id': "pollwatch-q9-id",
        'state': "pollwatch-q9-state",
        'question': "[[contact.name]], please send the results of POE. Send 'POE ###' to proceed.\n",
        'instruction': "",
        'regex': {
            "pattern": "^(POE)\\s?(\\d{1,3})$",
            'modifier': "i"
        },
        next: "pollwatch-q10-id"
    },
    'pollwatch-q10': {
        'id': "pollwatch-q10-id",
        'state': "pollwatch-q10-state",
        'question': "[[contact.name]], please send the results of DUTERTE. Send 'DUTERTE ###' to proceed.\n",
        'instruction': "",
        'regex': {
            "pattern": "^(DUTERTE)\\s?(\\d{1,3})$",
            'modifier': "i"
        },
        next: "pollwatch-thank-you-id"
    },
    'pollwatch-thank-you': {
        'id': "pollwatch-thank-you-id",
        'state': "pollwatch-thank-you-state",
        'question': "Thank you for participating in the poll watch. Please come back. - nth POWER",
        'instruction': "Please choose a simulation:",
        'choices': {
            'S': "Survey",
            'W': "Poll Watch",
            'Q': "PCOS Quick Count",
            'C': "CCS Quick Count",
            'R': "Results",
        },
        'goto': {
            'S': "survey-q1-id",
            'W': "pollwatch-q1-id",
            'Q': "under-construction-id",
            'C': "under-construction-id",
            'R': "under-construction-id",
            'X': "exit-id"
        },
        'regex': {
            'pattern': "^(S|W|Q|C|R|X)$",
            'modifier': "i"
        },
        next: "landing-id"
    },
    'pollwatch-sos': {
        'id': "pollwatch-sos-id",
        'state': "pollwatch-sos-state",
        'question': "Put SOS here. Blah, blah, blah... [[contact.name]], HQ will contact you shortly.?",
        'instruction': "Send 'H' to proceed.",
        'choices': {
            'P': "PCOS problem",
            'B': "BEI problem",
            'S': "Security problem",
            'L': "Logistics problem"
        },
        'goto': {
            'P': "under-construction-id",
            'B': "under-construction-id",
            'S': "under-construction-id",
            'L': "under-construction-id"
        },
        'regex': {
            "pattern": "^(P|B|S|L).*?$",
            'modifier': "i"
        },
        next: "landing-id"
    }
}

var Library = {
    getKeyFromState: function (object, state, input) {
        var firstKeyFound = null;
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                console.log(key);
                if (object[key].state == state) {
                    firstKeyFound = key;
                    console.log("firstKeyFound: " + firstKeyFound);
                    regex = new RegExp(object[key].regex.pattern, object[key].regex.modifier);
                    execResult = regex.exec(input);
                    console.log("execResult: " + execResult);
                    if (execResult != null) {
                        return key;
                    }
                }
            }
        }
        return firstKeyFound;
    }
};

var key = Library.getKeyFromState(survey, state.id, message.content);

console.log("Key is " + key);

var response = function (input) {

};

var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id; // get all survey elements with specified state.id
});

var execResult = null;

var prompt = _.find(prompts, function (obj) {
        regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
        //execResult = regex.exec(word1);

        execResult = regex.exec(message.content);
        return (execResult != null);
    }) || null;

var nextPrompt = null;

if (prompt) {
    console.log("keyword is valid.");
    console.log(Object.keys(prompt));

    _.each(prompt.process, function (value, key) {
        console.log(key + ": " + value);
        switch (key) {
            case 'group':
                var group = project.getOrCreateGroup(value);
                contact.addToGroup(group);
                break;
            case 'name':
                var name = message.content;
                contact.name = _(name.replace(/[^\w\s]/gi, '')).titleCase();
                break;
            case 'choice':
                var code = word1;
                contact.vars[value + "_code"] = code;
                contact.vars[value] = prompt.choices[code];
                break;
            case 'database':
                var code = word1;
                updatePoll(prompt.state, code);
                break;
            case 'response':
                var code = word1;
                postResponse(prompt.state, code);
                break;
            case 'credit':
                var amount = parseInt(value, 10);
                sendLoadCredits(amount);
                break;
        }
    });

    var nextId = prompt.next;
    nextPrompt = _.find(survey, function (obj) {
        if (prompt.goto) {
            console.log(execResult);
            nextId = prompt.goto[execResult[1].toUpperCase()] || nextId;
            console.log("nextId: " + nextId);
        }
        return obj.id == nextId;
    });

    if (nextPrompt)
        console.log("nextPrompt.id:" + nextPrompt.id);
    else
        console.log("nextPrompt is null. " + prompt.next);
}
else {
    console.log("keyword is NOT valid!");
    nextPrompt = _.find(prompts, function (obj) {
            return ((obj.id).toUpperCase().indexOf("DEFAULT") != -1);
        }) || prompts[FIRST_ELEMENT];
}

console.log("type of nextPrompt: " + typeof nextPrompt);
state.id = nextPrompt.state;

var question_array = [];
if (nextPrompt.state)
    question_array.push(_(nextPrompt.state).capitalize() + ": ");
question_array.push(nextPrompt.question);

if (nextPrompt.choices) {
    question_array.push(nextPrompt.instruction + "\n" + _(nextPrompt.choices).inSeveralLines());
}
var question = question_array.join(" ");

console.log(question);


project.sendMessage({
    content: question,
    to_number: contact.phone_number,
    is_template: true
});
