/**
 * Created by lbhurtado on 10/2/15.
 */

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function presentChoices(choices) {
    var list = "\n";
    for (var key in choices) {
        list = list + "'" + key + "' (" + choices[key] + ")" + ((_.last(choices, key)) ? "\n" : "");
    }
    return list;
}

function presentChoiceKeys(choices) {
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

var survey = [
    {
        'state': null,
        "template": "Bayan o sarili?",
        'instruction': "",
        'regex': /^(BAYAN)$/i,
        'question': function () {
            return this.template + " " + this.instruction;
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var group = project.getOrCreateGroup('Bayan');
            contact.addToGroup(group);
        },
    },
    {
        'state': "opt-in",
        "template": "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
        'instruction': "",
        'regex': /^YES$/i,
        'question': function (tries) {
            return this.template + " " + this.instruction;
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var group = project.getOrCreateGroup('Opted In');
            contact.addToGroup(group);
        }
    },
    {
        'state': "name",
        "template": "What is your name?",
        'instruction': "No special characters please.",
        'regex': /^[a-zA-Z0-9\s]+$/,
        'question': function () {
            return this.template + " " + this.instruction;
        },
        isValid: function (tries) {
            return word1.match(this.regex);
        },
        process: function () {
            var name = message.content;
            contact.name = toTitleCase(name.replace(/[^\w\s]/gi, ''));
        }
    },
    {
        'state': "q1",
        "template": "[[contact.name]], who among the following is your best choice for president in 2016?",
        'instruction': "Select a letter only:",
        'choices': {
            'R': "Sec. Mar Roxas",
            'B': "VP Jojo Binay",
            'P': "Sen. Grace Poe",
            'D': "Mayor Rody Duterte"
        },
        'regex': /^[RBPB]$/,
        'question': function (tries) {
            switch (tries) {
                case 0:
                    return this.template + " " + this.instruction + presentChoices(this.choices);
                default:
                    return this.template + " " + presentChoices(this.choices) + presentChoiceKeys(this.choices);
            }
            /*
            if (tries == 0)
                return this.template + " " + this.instruction + presentChoices(this.choices);
            else {
                return this.template + " " + presentChoices(this.choices) + presentChoiceKeys(this.choices);
            }
            */
        },
        isValid: function () {
            var valid = this.regex.test(word1);
            if (!valid) {

                contact.vars.tries = contact.vars.tries + 1;
            }
            else
                contact.vars.tries = 0;
            console.log(contact.vars.tries);
            return valid;
        },
        process: function () {
            var code = word1;
            contact.vars.candidate_code = code;
            contact.vars.candidate = this.choices[code];
            updatePoll(this.state, code);
        }
    },
    {
        'state': "q2",
        'template': "[[contact.name]], why did you choose [[contact.vars.candidate]]?",
        'instruction': "Select a numeral only:",
        'choices': {
            '1': "Leadership",
            '2': "Program or Agenda",
            '3': "Personality"
        },
        'regex': /^[123]$/,
        'question': function (tries) {
            return this.template + " " + this.instruction + presentChoices(this.choices);
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = word1;
            contact.vars.reason_code = code;
            contact.vars.reason = this.choices[code];
            updatePoll(this.state, code);
        }
    },
    {
        'state': "q3",
        'template': "[[contact.name]], what is the most important election issue for you?",
        'instruction': "Select a letter only:",
        'choices': {
            'P': "Poverty Alleviation",
            'J': "Jobs Creation",
            'H': "Healthcare"
        },
        'regex': /^[PJH]$/,
        'question': function () {
            return this.template + " " + this.instruction + presentChoices(this.choices);
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = word1;
            contact.vars.issue_code = code;
            contact.vars.issue = this.choices[code];
            updatePoll(this.state, code);
        }
    }
]

var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id;
});

var prompt = prompts[0]; //default to first prompt if there are many prompts with same state.id

if (prompts.length > 0) {
    var _prompt = _.find(prompts, function (obj) {
        return word1.match(obj.regex);
    });
    if (_prompt)
        prompt = _prompt;
}

var ndx = survey.indexOf(prompt);

contact.vars.tries = typeof contact.vars.tries !== 'undefined' ? contact.vars.tries : 0;

if (prompt.isValid()) {
    prompt.process();
    ndx = (ndx + 1) % survey.length;
    contact.vars.tries = 0;
}
else {
    contact.vars.tries = contact.vars.tries + 1;
}

state.id = survey[ndx].state;
var question = survey[ndx].question(contact.vars.tries);

console.log(prompt.state);
console.log(question);


/*
 project.sendMessage({
 content: prompts.template,
 to_number: contact.phone_number,
 is_template: true
 });
 */