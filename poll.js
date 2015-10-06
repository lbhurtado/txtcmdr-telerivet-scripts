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

function postSurvey(){
    var url = "http://128.199.81.129/txtcmdr/ask4questions/survey/store/demo";
    return httpClient.request(url, {
        method: "POST",
        data: {
            description: "demo survey",
            data: survey
        }
    });
}

var survey = {
    's1': {
        'id': "default",
        'state': null, // null is a catch-all, required!
        'question': "Welcome to the mock survey for the 2016 national and local elections. Please choose:",
        'instruction': "",
        'choices': {
            'P': "Poll",
            'R': "Results",
            'I': "Info",
            'A': "About"
        },
        'goto': {
            'P': "s2",
            'R': "default",
            'I': "default",
            'A': "default",
            'N': "init"
        },
        'regex': {
            'pattern': "^(P|R|I|A|N)$",
            'modifier': "i"
        },
        'process': {
            'group': "Bayan"
        },
        next: "s2",
    },
    'init': {
        'id': "init",
        'question': "Init done. Check the database.",
        'choices': {
            'Y': "Yes",
            'N': "No",
        },
        'regex': {
            "pattern": "^(Y|N).*?$",
            'modifier': "i"
        },
        'process': {
            function: "postSurvey",
        },
        next: "default",
    },
    'bayan-opt-in': {
        'id': "s2",
        'state': "opt-in",
        'question': "Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
        'instruction': "",
        'choices': {
            'Y': "Yes",
            'N': "No",
        },
        'goto': {
            'Y': "s3",
            'N': "default",
        },
        'regex': {
            "pattern": "^(Y|N).*?$",
            'modifier': "i"
        },
        'process': {
            'group': "Opted In"
        },
        next: "s3"
    },
    'name': {
        'id': "s3",
        'state': "name",
        'question': "What is your name?",
        'instruction': "No special characters please.",
        'regex': {
            "pattern": "^(?!\\s)([a-zA-Z0-9\\s]*)+$"
        },
        process: {
            'name': true
        },
        next: "s4"
    },
    'bayan-q1': {
        'id': "s4",
        'state': "q1",
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
        next: "s5"
    },
    'bayan-q2': {
        'id': "s5",
        'state': "q2",
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
        next: "s6"
    },
    'bayan-q3': {
        'id': "s6",
        'state': "q3",
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
        next: "default"
    }
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

console.log(execResult);

var nextPrompt = null;

if (prompt) {
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
                var amount = parseInt(value,10);
                sendLoadCredits(amount);
                break;
            case 'function':
                var fx = "function";
                prompt.process[fx]();
                break;
        }
    });
    nextPrompt = _.find(survey, function (obj) {
        //return obj.id == prompt.next;
        var nextId = prompt.next;
        if (prompt.goto)
            nextId = prompt.goto[execResult[1]];
        return obj.id == nextId;
    });
}
else {
    console.log("keyword is NOT valid");
    nextPrompt = _.find(prompts, function (obj) {
            return ((obj.id).toUpperCase().indexOf("DEFAULT") != -1);
        }) || prompts[FIRST_ELEMENT];
}

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

project.sendMessage({
    content: question,
    to_number: contact.phone_number,
    is_template: true
});