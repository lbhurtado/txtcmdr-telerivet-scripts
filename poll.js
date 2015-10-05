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

var survey = {
    's1': {
        'id': "index",
        'state': null, // null is a catch-all, required!
        'question': "Bayan o sarili?",
        'instruction': "",
        'regex': {
            'pattern': "^(BAYAN)$",
            'modifier': "i"
        },
        process: {
            'group': "Bayan"
        },
        next: "s2",
    },
    's2': {
        'id': "s2",
        'state': "opt-in",
        'question': "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
        'instruction': "",
        'regex': {
            "pattern": "^YES$",
            'modifier': "i"
        },
        process: {
            'group': "Opted In"
        },
        next: "s3"
    },
    's3': {
        'id': "s3",
        'state': "name",
        'question': "What is your name?",
        'instruction': "No special characters please.",
        'regex': {
            "pattern": "^[a-zA-Z0-9\\s]+$"
        },
        process: {
            'name': true
        },
        next: "s4"
    },
    's4': {
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
            'pattern': "^[RBPD]$"
        },
        process: {
            'choice': "candidate",
            'database': true,
            'response': true
        },
        next: "s5"
    },
    's5': {
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
            'pattern': "^[123]$"
        },
        process: {
            'choice': "reason",
            'database': true
        },
        next: "s6"
    },
    's6': {
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
            'pattern': "^[PJH]$"
        },
        process: {
            'choice': "issue",
            'database': true
        },
        next: "s1"
    }
}

var prompt = _.find(survey, function (obj) {
        var retval = false;
        if (obj.state == state.id) {
            regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
            retval = (regex.exec(message.content) != null);
        }
        return retval;
    }) || null;

if (prompt) {
    var nextPrompt = _.find(survey, function (obj) {
        return obj.next == prompt.next;
    });
    state.id = nextPrompt.state;
    console.log("keyword is valid");
    console.log(nextPrompt.question);
}
else {
    console.log("keyword is NOT valid");
}


