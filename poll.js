/**
 * Created by lbhurtado on 10/2/15.
 */

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

var survey =
{
    'config': {},
    'prompts': {
        'Challenge': {
            'state': null,
            'question': "Bayan o sarili?",
            'instruction': "",
            'regex': /^BAYAN$/i,
            saveto: function (text) {
                if (text.match(this.regex)) {
                    var group = project.getOrCreateGroup('Bayan');
                    contact.addToGroup(group);
                    state.id = 'opt-in';
                }
            },
        },
        'Opt-in': {
            'state': "opt-in",
            'question': "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
            'instruction': "",
            'regex': /^YES$/i,
            saveto: function (text) {
                if (text.match(this.regex)) {
                    var group = project.getOrCreateGroup('Opted In');
                    contact.addToGroup(group);
                    state.id = 'name';
                }
            }
        },
        'Name': {
            'state': "name",
            'question': "What is your name?",
            'instruction': "No special characters please.",
            'regex': /^[a-zA-Z0-9\s]+$/,
            saveto: function (text) {
                if (text.match(this.regex)) {
                    var name = message.content;
                    contact.name = toTitleCase(name.replace(/[^\w\s]/gi, ''));
                    state.id = 'q1';
                }
            }
        },
        'Candidates': {
            'state': "q1",
            'question': "[[contact.name]], who among the following is your best choice for president in 2016?",
            'instruction': "Select a letter only:",
            'choices': {
                'R': "Sec. Mar Roxas",
                'B': "VP Jojo Binay",
                'P': "Sen. Grace Poe",
                'D': "Mayor Rody Duterte"
            },
            'regex': /^[RBPB]$/,
            saveto: function (text) {
                var code = message.content;
                contact.vars.candidate_code = code;
                contact.vars.candidate = this.choices[code];
                state.id = 'q2';
            }
        },
        'Reasons': {
            'state': "q2",
            'question': "[[contact.name]], why did you choose contact.vars.candidate?",
            'instruction': "Select a numeral only:",
            'choices': {
                '1': "Leadership",
                '2': "Program or Agenda",
                '3': "Personality"
            },
            'regex': /^[123]$/,
            saveto: function () {
                var code = message.content;
                contact.vars.reason_code = code;
                contact.vars.reason = this.choices[code];
                state.id = 'q3';
            }
        }
        ,
        'Issues': {
            'state': "q3",
            'question': "[[contact.name]], what is the most important election issue for you?",
            'instruction': "Select a letter only:",
            'choices': {
                'P': "Poverty Alleviation",
                'J': "Jobs Creation",
                'H': "Healthcare"
            },
            'regex': /^[PJH]$/,
            saveto: function () {
                var code = message.content;
                contact.vars.issue_code = code;
                contact.vars.issue = this.choices[code];
                state.id = 'done';
            }
        }
    }
}

var prompts = [
    {
        'state': null,
        'question': "Bayan o sarili?",
        'instruction': "",
        'regex': /^(BAYAN)$/i,
        pass: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var group = project.getOrCreateGroup('Bayan');
            contact.addToGroup(group);
        },
    },
    {
        'state': "opt-in",
        'question': "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
        'instruction': "",
        'regex': /^YES$/i,
        pass: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var group = project.getOrCreateGroup('Opted In');
            contact.addToGroup(group);
        }
    },
    {
        'state': "name",
        'question': "What is your name?",
        'instruction': "No special characters please.",
        'regex': /^[a-zA-Z0-9\s]+$/,
        pass: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var name = message.content;
            contact.name = toTitleCase(name.replace(/[^\w\s]/gi, ''));
        }
    },
    {
        'state': "q1",
        'question': "[[contact.name]], who among the following is your best choice for president in 2016?",
        'instruction': "Select a letter only:",
        'choices': {
            'R': "Sec. Mar Roxas",
            'B': "VP Jojo Binay",
            'P': "Sen. Grace Poe",
            'D': "Mayor Rody Duterte"
        },
        'regex': /^[RBPB]$/,
        pass: function () {
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
        'question': "[[contact.name]], why did you choose [[contact.vars.candidate]]?",
        'instruction': "Select a numeral only:",
        'choices': {
            '1': "Leadership",
            '2': "Program or Agenda",
            '3': "Personality"
        },
        'regex': /^[123]$/,
        pass: function () {
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
        'question': "[[contact.name]], what is the most important election issue for you?",
        'instruction': "Select a letter only:",
        'choices': {
            'P': "Poverty Alleviation",
            'J': "Jobs Creation",
            'H': "Healthcare"
        },
        'regex': /^[PJH]$/,
        pass: function () {
            return word1.match(this.regex);
        },
        process: function () {
            var code = message.content;
            contact.vars.issue_code = code;
            contact.vars.issue = this.choices[code];
        }
    }
]

var prompt = _.find(prompts, function (obj) {
    return obj.state == state.id;
});

if (prompt.pass()) {
    prompt.process();
    state.id = prompts[prompts.indexOf(prompt) + 1].state;
    prompt.question = prompts[prompts.indexOf(prompt) + 1].question;
}

project.sendMessage({
    content: prompt.question,
    to_number: contact.phone_number,
    is_template: true
});