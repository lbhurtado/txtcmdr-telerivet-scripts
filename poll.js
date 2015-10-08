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
            'W': "under-construction-id",
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
        'question': "Thank you for participating in the survey. - nth POWER",
        'regex': {
            'pattern': ".*",
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
            'W': "under-construction-id",
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
}


var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id; // get all survey elements with specified state.id
});

var execResult = null;

var prompt = _.find(prompts, function (obj) {
        regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
        execResult = regex.exec(word1);
        return (execResult != null);
    }) || null;

var nextPrompt = null;

if (prompt) {
    console.log("keyword is valid.");
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

    nextPrompt = _.find(survey, function (obj) {
        var nextId = prompt.next;
        if (prompt.goto) {
            nextId = prompt.goto[execResult[1].toUpperCase()];
        }
        return obj.id == nextId;
    });
    console.log("nextPrompt.id:" + nextPrompt.id);
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
    question_array.push(nextPrompt.instruction + _(nextPrompt.choices).inSeveralLines());
}
var question = question_array.join(" ");

console.log(question);

/*
 project.sendMessage({
 content: question,
 to_number: contact.phone_number,
 is_template: true
 });
 */