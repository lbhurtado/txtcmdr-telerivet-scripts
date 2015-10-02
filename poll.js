/**
 * Created by lbhurtado on 10/2/15.
 */

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
        'question': function () {
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
        isValid: function () {
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
        'question': function () {
            return this.template + " " + this.instruction;
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = message.content;
            contact.vars.candidate_code = code;
            contact.vars.candidate = this.choices[code];
        }
    },
    {
        'state': "q2",
        "template": "[[contact.name]], why did you choose [[contact.vars.candidate]]?",
        'instruction': "Select a numeral only:",
        'choices': {
            '1': "Leadership",
            '2': "Program or Agenda",
            '3': "Personality"
        },
        'regex': /^[123]$/,
        'question': function () {
            return this.template + " " + this.instruction;
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = message.content;
            contact.vars.reason_code = code;
            contact.vars.reason = this.choices[code];
        }
    },
    {
        'state': "q3",
        "template": "[[contact.name]], what is the most important election issue for you?",
        'instruction': "Select a letter only:",
        'choices': {
            'P': "Poverty Alleviation",
            'J': "Jobs Creation",
            'H': "Healthcare"
        },
        'regex': /^[PJH]$/,
        'question': function () {
            return this.template + " " + this.instruction;
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = message.content;
            contact.vars.issue_code = code;
            contact.vars.issue = this.choices[code];
        }
    }
]

var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id;
});

console.log(prompts.length);

var prompt = prompts[0];

if (prompts.length > 0) {
    prompt = _.find(prompts, function (obj) {
        return word1.match(obj.regex);
    });
}

prompt = (prompts.length > 0) ? _.find(prompts, function (obj) {return word1.match(obj.regex);}) : prompts[0];

var question = "";

if (prompt.isValid()) {

    prompt.process();

    var ndx = survey.indexOf(prompt);
    if (ndx + 1 == survey.length)
        ndx = 0;
    else
        ndx = ndx + 1;

    state.id = survey[ndx].state;
    question = survey[ndx].template;
}

console.log(prompt.state);
console.log(question);
/*
 project.sendMessage({
 content: prompts.template,
 to_number: contact.phone_number,
 is_template: true
 });
 */