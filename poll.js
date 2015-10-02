/**
 * Created by lbhurtado on 10/2/15.
 */

var survey =
{
    'config': {},
    'application': {
        'Challenge': {
            'code': "bayan",
            'question': "Bayan o sarili?",
            'instruction': "",
            'regex': /^BAYAN$/i,
            saveto: function () {
                var group = project.getOrCreateGroup('Bayan');
                contact.addToGroup(group);
            }
        },
        'Opt-in': {
            'code': "opt-in",
            'question': "Welcome to the mock survey for the 2016 national and local elections. Get load credits for answering 4 questions. Reply with 'yes' to proceed.",
            'instruction': "",
            'regex': /^YES$/i,
            saveto: function () {
                var group = project.getOrCreateGroup('Opted In');
                contact.addToGroup(group);
            }
        },
    },
    'profile': {
        'Name': {
            'code': "name",
            'question': "What is your name?",
            'instruction': "No special characters please.",
            'regex': /^[a-zA-Z0-9\s]+$/,
            saveto: function (name) {
                contact.name = toTitleCase(name.replace(/[^\w\s]/gi, ''));
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
            saveto: function (code) {
                contact.vars.candidate_code = code;
                contact.vars.candidate = this.choices[code];
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
            saveto: function (code) {
                contact.vars.reason_code = code;
                contact.vars.reason = this.choices[code];
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
            saveto: function (code) {
                contact.vars.issue_code = code;
                contact.vars.issue = this.choices[code];
            }
        }
    }
}

    for (var level1 in survey) {
        console.log(level1);
        for (var level2 in survey[level1]) {
            console.log(level2);
            for (var level3 in survey[level2]) {
                console.log(level3);
            }
        }
    }
    sendReply("Yes yes!");