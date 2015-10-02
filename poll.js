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
    'application': {
        'Challenge': {
            'code': null,
            'question': "Bayan o sarili?",
            'instruction': "",
            'regex': /^BAYAN$/i,
            saveto: function () {
                if (word1.match(this.regex)) {
                    var group = project.getOrCreateGroup('Bayan');
                    contact.addToGroup(group);
                    state.id = 'opt-in';
                }
            },
        },
        'Opt-in': {
            'code': "opt-in",
            'question': "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
            'instruction': "",
            'regex': /^YES$/i,
            saveto: function () {
                if (word1.match(this.regex)) {
                    var group = project.getOrCreateGroup('Opted In');
                    contact.addToGroup(group);
                    state.id = 'name';
                }
            }
        },
    },
    'profile': {
        'Name': {
            'code': "name",
            'question': "What is your name?",
            'instruction': "No special characters please.",
            'regex': /^[a-zA-Z0-9\s]+$/,
            saveto: function () {
                if (word1.match(this.regex)) {
                    var name = message.content;
                    contact.name = toTitleCase(name.replace(/[^\w\s]/gi, ''));
                    state.id = 'q1';
                }
            }
        }
    },
    'main': {
        'Candidates': {
            'code': "q1",
            'question': "[[contact.name]], who among the following is your best choice for president in 2016?",
            'instruction': "Select a letter only:",
            'choices': {
                'R': "Sec. Mar Roxas",
                'B': "VP Jojo Binay",
                'P': "Sen. Grace Poe",
                'D': "Mayor Rody Duterte"
            },
            'regex': /^[RBPB]$/,
            saveto: function () {
                var code = message.content;
                contact.vars.candidate_code = code;
                contact.vars.candidate = this.choices[code];
                state.id = 'q2';
            }
        }
        ,
        'Reasons': {
            'code': "q2",
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
            'code': "q3",
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

var reply = "";

for (var level1 in survey) {
    for (var level2 in survey[level1]) {
        console.log(survey[level1][level2].code);
        if (survey[level1][level2].code == state.id) {
            reply = survey[level1][level2].question;
        }
    }
}

if (reply)
    sendReply(reply);

/*
 if (false) {

 for (var level1 in survey) {
 console.log(level1);
 for (var level2 in survey[level1]) {
 console.log(survey[level1][level2].code);
 if (state.id == survey[level1][level2].code) {
 sendReply(survey[level1][level2].question);
 var myArray = message.content.match(survey[level1][level2].regex);
 console.log(myArray);
 if (myArray) {
 survey[level1][level2].saveto();
 break;
 }
 }

 }
 }
 }
 */