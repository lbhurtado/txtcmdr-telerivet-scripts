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
    keyPattern: function (choices, includeTrailingCharacters) {
        var pattern = "^(";
        var i = 0;
        var l = _.size(choices);
        for (var key in choices) {
            i = i + 1;
            pattern = pattern + key;
            if (i <= (l - 1)) {
                pattern = pattern + "|";
            }
        }
        pattern = pattern + ")";
        //pattern = includeTrailingCharacters ? pattern + "(.*)" : pattern;
        pattern = pattern + "(.*)";
        pattern = pattern + "$";

        return pattern;
    }
});

function implode(glue, pieces) {
    //  discuss at: http://phpjs.org/functions/implode/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Waldo Malqui Silva
    // improved by: Itsacon (http://www.itsacon.net/)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
    //   returns 2: 'Kevin van Zonneveld'

    var i = '',
        retVal = '',
        tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }
    return pieces;
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

function postResponse(vquestion, vanswer) {
    var url = "http://128.199.81.129/txtcmdr/ask4questions/response/store/demo/" + vquestion + "/" + vanswer;
    var response = httpClient.request(url, {
        method: 'POST'
    });
    console.log(url);
}

function postChallenge(vorigin, vmobile) {
    var url = "http://128.199.81.129/txtcmdr/challenge/" + vorigin + "/" + vmobile;
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

var applester = {
    info: {
        category: "information",
        message: {
            1: "Applester Dev't. Corporation",
            2: "Computing Division"
        },
        options: {
            address: {
                help: "address and contact info",
                message: {
                    1: "add: 8 W. Maya Drive, Brgy. Philam, Quezon City 1104",
                    2: "tel: +63 (2) 952-5603",
                    3: "email: info@applester.co"
                }
            },
            schedule: {
                help: "office hours",
                message: {
                    1: "MWF: 9:00 AM - 5:00 PM",
                    2: "Saturday: 1700-1800, 1830-1930, 2000-2100",
                    3: "Sunday: 0730-0830, 0900-1000, 1030-1130"
                }
            }
        }
    },
    profile: {
        category: "profile",
        message: {
            1: "username: %username%",
            2: "birthdate: %birthdate%",
            3: "email adress: %email%"
        },
        options: {
            name: {
                help: "update username",
                message: "Please enter your name."
            },
            birthdate: {
                help: "update birthdate",
                message: "Please enter your birth date."
            },
            email: {
                help: "update email address",
                message: "Please enter your email address."
            }
        }
    },
    feedback: {
        category: "survey",
        options: {
            time: {
                help: "on time feedback",
                message: "Were your order/s delivered on time?",
                choices: {
                    Y: "Yes",
                    N: "No"
                }
            },
            quality: {
                help: "quality feedback",
                message: "How would you rate the quality of your order/s?",
                choices: {
                    1: "Excellent",
                    2: "Very Good",
                    3: "Good",
                    4: "Fair",
                    5: "Need Improvement"
                }
            },
            favorite: {
                help: "favorite feedback",
                message: "What is your favorite color?"
            }
        }
    }
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

var smallbiz = {
    main: {
        messages: {
            1: "Welcome to Small Biz",
            2: "The quick brown fox jumps over the lazy dog."
        },
        choices: {
            'I': "Info",
            'L': "Location",
            'D': "Schedule",
            'S': "Subscribe",
            'P': "Profile Update"
        },
        goto: {
            'I': "info",
            'L': "location",
            'D': "schedule",
            'S': "subscribe",
            'P': "profile.name",
            'X': "special"
        }
    },
    info: {
        messages: {
            1: "Info",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    location: {
        messages: {
            1: "Location",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    schedule: {
        messages: {
            1: "Schedule",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    subscribe: {
        messages: {
            1: "Subscribe",
            2: "Please choose a subscription:"
        },
        choices: {
            'N': "News",
            'C': "Circulars",
            'E': "Emergencies",
            'A': "All of the above."
        },
        goto: {
            'N': "news",
            'C': "circulars",
            'E': "emergencies",
            'A': "all_subscriptions"
        }
    },
    news: {
        messages: {
            1: "Thank you for subscribing to NEWS.",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    circulars: {
        messages: {
            1: "Thank you for subscribing to CIRCULARS.",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    emergencies: {
        messages: {
            1: "Thank you for subscribing to EMERGENCIES.",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    all_subscriptions: {
        messages: {
            1: "Thank you for subscribing to ALL.",
            2: "Si Vis Pacem Para Bellum"
        }
    },
    'profile.name': {
        messages: {
            1: "What is your name?",
            2: "First Name, Last Name please:"
        },
        pattern: {
            regex: "^(.*)$",
            state: "profile.age"
        },
        process: {
            'name': true
        }
    },
    'profile.age': {
        messages: {
            1: "What is your age?",
            2: "Integer please:"
        },
        pattern: {
            regex: "^(\\d{2})$",
            state: "survey.president"
        },
        process: {
            'group': "Profiled"
        }
    },
    'survey.president': {
        messages: {
            1: "[[contact.name]], who among the following is your best choice for president in 2016?",
            2: "Choose a letter:"
        },
        'choices': {
            'R': "Sec. Mar Roxas",
            'B': "VP Jojo Binay",
            'P': "Sen. Grace Poe",
            'D': "Mayor Rody Duterte"
        },
        pattern: {
            regex: "^(R|B|P|D)$",
            state: "profile.thanks"
        },
        process: {
            'choice': "candidate",
            'database': true
        }
    },
    'profile.thanks': {
        messages: {
            1: "Thank you."
        }
    }
}

var congress_demo = {
    //catchall: {
    //    messages: {
    //        1: "Bayan o Sarili? Pumili ka."
    //    },
    //    goto: {
    //        bayan: "bayan",
    //        sarili: "sarili"
    //    }
    //},
    bayan: {
        messages: {
            1: "Welcome to the nth POWER demonstration of the Text Commander - ",
            2: "the serious tool for the serious candidate.",
            3: "Please choose a simulation:"
        },
        choices: {
            S: "Survey",
            W: "Poll Watch",
            P: "PCOS Quick Count",
            C: "Channel Subscriptions",
            G: "Group Messaging",
            L: "Loyalty Check",
            R: "Results",
            A: "Autorecruit"
        },
        goto: {
            S: "survey01",
            W: "pollwatch",
            P: "precinctcount",
            C: "channels",
            G: "groups",
            L: "loyalty",
            R: "results",
            A: "autorecruit",
            X: "exit"
        }
    },
    survey: {
        messages: {
            1: "Making a survey is the best way to get the pulse of your constituents. ",
            2: "Be sure to conduct once or twice before you commit to plan. - nth POWER",
            3: "Send 'Y' to continue:"
        },
        choices: {
            Y: "Yes",
            N: "No"
        },
        goto: {
            Y: "survey01",
            N: "exit"
        }
    },
    survey01: {
        messages: {
            1: "Get load credits for answering a few questions.",
            2: "Send 'Y'to proceed."
        },
        choices: {
            Y: "Yes",
            N: "No"
        },
        goto: {
            Y: "survey02",
            N: "exit"
        },
        process: {
            group: "Opted In"
        }
    },
    survey02: {
        messages: {
            1: "Please tell us your name so we can address you properly.",
            2: "Full name is appreciated but first name will do."
        },
        pattern: {
            regex: "^(?!\\s)([a-zA-Z0-9\\s]*)+$",
            state: "survey03"
        },
        process: {
            name: true
        }
    },
    survey03: {
        messages: {
            1: "[[contact.name]], who among the following is your best choice for president in 2016?",
            2: "Select a letter only:"
        },
        choices: {
            R: "Sec. Mar Roxas",
            B: "VP Jojo Binay",
            P: "Sen. Grace Poe",
            D: "Mayor Rody Duterte"
        },
        pattern: {
            regex: "^(R|B|P|D)$",
            state: "survey04"
        },
        process: {
            choice: "candidate",
            database: true
        }
    },
    survey04: {
        messages: {
            1: "[[contact.name]], why did you choose the said candidate?",
            2: "Select a numeral only:"
        },
        choices: {
            1: "Leadership",
            2: "Program or Agenda",
            3: "Personality"
        },
        pattern: {
            regex: "^(1|2|3)$",
            state: "survey05"
        },
        process: {
            choice: "reason",
            database: true
        }
    },
    survey05: {
        messages: {
            1: "[[contact.name]], what is the most important election issue for you?",
            2: "Select a letter only:"
        },
        choices: {
            P: "Poverty Alleviation",
            J: "Jobs Creation",
            H: "Healthcare"
        },
        pattern: {
            regex: "^(P|J|H)$",
            state: "exit"
        },
        process: {
            choice: "issue",
            database: true,
            credit: 10
        }
    },
    exit: {
        messages: {
            1: "Thank you for participating.",
            2: "You may send 'BAYAN' go to the main menu ",
            3: "or 'RESULTS' to get the reports. - nth POWER"
        }
    },
    channels: {
        messages: {
            1: "Subscribing to an SMS channel is like tuning to prime time tv, ",
            2: "listening to the radio and reading the newspaper done 24x7. ",
            3: "One of the most effective way to reach your constituents. - nth POWER\n",
            4: "Choose a channel:"
        },
        choices: {
            S: "Schedule of Sorties",
            M: "Mission and Vision",
            J: "Job Opportunities",
            A: "All of the above."
        },
        goto: {
            S: "subscribe_sorties",
            M: "subscribe_mission",
            J: "subscribe_jobs",
            A: "subscribe_all"
        }
    },
    subscribe_sorties: {
        messages: {
            1: "Thank you for subscribing to Schedule of Sorties channel. ",
            2: "You will receive regular updates on this topic. - nth POWER"
        },
        process: {
            group: "Sorties Subscription"
        }
    },
    subscribe_mission: {
        messages: {
            1: "Thank you for subscribing to Mission and Vision channel. ",
            2: "You will receive regular updates on this topic. - nth POWER"
        },
        process: {
            group: "Mission Subscription"
        }
    },
    subscribe_jobs: {
        messages: {
            1: "Thank you for subscribing to Job Opportunities channel. ",
            2: "You will receive regular updates on this topic. - nth POWER"
        },
        process: {
            group: "Jobs Subscription"
        }
    },
    subscribe_all: {
        messages: {
            1: "Thank you for subscribing to all the channels. ",
            2: "You will receive regular updates on these topics. - nth POWER"
        },
        process: {
            group: "All Subscription"
        }
    },
    groups: {
        messages: {
            1: "Local leaders, loyal followers and volunteers will be able to coordinate among each other ",
            2: "by sending text messages to the Text Commander 24x7. Each message by the leader will be propagated to all the members ",
            3: "in a surgical manner.  Each response of the members will be automatically be forwarded to the leader. ",
            4: "Everything will be logged for future reference.- nth POWER\n",
            5: "Choose a group:"
        },
        choices: {
            1: "Personnel",
            2: "Intelligence",
            3: "Operations",
            4: "Logistics and Supply",
            5: "Liaisons",
            6: "Comptrollership",
            7: "Security"
        },
        goto: {
            1: "join_personnel",
            2: "join_intelligence",
            3: "join_operations",
            4: "join_logistics",
            5: "join_liaisons",
            6: "join_comptrollership",
            7: "join_security"
        }
    },
    join: {
        messages: {
            1: "Join"
        },
        pattern: {
            regex: "^(JOIN)\\s?(.*)$",
            state: null
        },
        process: {
            group: "Test Group"
        }
    },
    join_personnel: {
        messages: {
            1: "Thank you for joining the Personnel Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Personnel Group"
        }
    },
    join_intelligence: {
        messages: {
            1: "Thank you for joining the Intelligence Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Intelligence Group"
        }
    },
    join_operations: {
        messages: {
            1: "Thank you for joining the Operations Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Operations Group"
        }
    },
    join_logistics: {
        messages: {
            1: "Thank you for joining the Logistics Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Logistics Group"
        }
    },
    join_liaisons: {
        messages: {
            1: "Thank you for joining the Liaisons Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Liaisons Group"
        }
    },
    join_comptrollership: {
        messages: {
            1: "Thank you for joining the Comptrollership Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Comptrollership Group"
        }
    },
    join_security: {
        messages: {
            1: "Thank you for joining the Security Group. ",
            2: "You will be able to receive and send messages on demand. - nth POWER"
        },
        process: {
            group: "Security Group"
        }
    },
    loyalty: {
        messages: {
            1: "Local leaders will always report what the candidates want to hear. ",
            2: "This application will direct and require a local leader to meet with his ",
            3: "constituents and enter their mobile numbers and a One-Time PIN generated by ",
            4: "the system. A mobile load credit will then be given upon each successful entry - ",
            5: "giving no reason for the constituent not to consent. This is the most cost-effective way ",
            6: "of auditing and building your magic number to win the elections. - nth POWER\n",
            7: "Continue with Loyalty Check Simulation? Send 'Y' to continue:"
        },
        choices: {
            //Y: "Yes",
            N: "Not yet online."
        },
        goto: {
            N: "exit"
        }
    },
    results: {
        messages: {
            1: "Choose a result:"
        },
        choices: {
            C: "Candidate",
            R: "Reason",
            I: "Issue"
        },
        pattern: {
            regex: "^(C|R|I)$",
            state: "report"
        }
    },
    report: {
        messages: {
            1: "Results:"
        },
        reports: {
            C: "survey03",
            R: "survey04",
            I: "survey05"
        },
        process: {
            test: true
        }
    },
    pollwatch: {
        messages: {
            1: "Vote Security in the precinct level is the most effective way ",
            2: "of making sure that your votes are counted and malicious activities ",
            3: "thwarted. Each poll watcher will be guided step-by-step:\n",
            4: "1. from preparation\n",
            5: "2. to ingress\n",
            6: "3. to checking of the PCOS\n",
            7: "4. to voting\n ",
            8: "5. to counting the votes casted\n",
            9: "6. to reporting the results\n",
            10: "7. to egress\n",
            11: "- nth POWER\n",
            12: "Continue with Poll Watching Simulation? Send 'Y' to continue:"
        },
        choices: {
            Y: "Yes",
            N: "No"
        },
        goto: {
            Y: "pollwatch01",
            N: "exit"
        }
    },
    pollwatch01: {
        messages: {
            1: "[[contact.name]], please proceed to Precinct 001A in Mohon Elementary School, Barangay Mohon, Sta. Teresita, Batangas. ",
            2: "Please eat your breakfast and bring your ID, snacks, whistle, pen and paper.\n",
            3: "If you are on your way, send 'Y' to proceed. - HQ"
        },
        choices: {
            Y: "Yes",
            N: "No",
            S: "SOS!"
        },
        goto: {
            Y: "pollwatch02",
            N: "exit",
            S: "sos"
        },
        process: {
            group: "pollwatch-candidate"
        }
    },
    pollwatch02: {
        messages: {
            1: "[[contact.name]], when you reach your designated precinct ",
            2: "please show your credentials to the BEI and proceed to inspect the PCOS machine.\n",
            3: "Send 'H' to proceed. - HQ"
        },
        'choices': {
            H: "Here",
            N: "Not yet there",
            S: "SOS!"
        },
        'goto': {
            H: "pollwatch03",
            S: "sos"
        },
        process: {
            group: "pollwatcher"
        }
    },
    pollwatch03: {
        messages: {
            1: "Good job [[contact.name]]! ",
            2: "Please observe the initialization of the PCOS machine.\n",
            3: "Make sure all the votes are zeroed out.\n",
            4: "Please cast you vote now. Send 'V' to continue. - HQ"
        },
        choices: {
            V: "Voted already",
            N: "Not yet voted",
            S: "SOS!"
        },
        goto: {
            V: "pollwatch04",
            S: "sos"
        },
        process: {
            group: "voter"
        }
    },
    pollwatch04: {
        messages: {
            1: "Good job [[contact.name]]! ",
            2: "How many people have casted their votes so far?\n",
            3: "Send the total number of voters every hour.\n",
            4: "Enter the code of the approximate count.\n",
            5: "Send 'O' to proceed to the next task. - HQ"
        },
        choices: {
            L: "~ 50",
            C: "~ 100",
            CC: "~ 200",
            CCC: "~ 300",
            CD: "~ 400",
            D: "~ 500",
            DC: "~ 600",
            DCC: "~ 700",
            DCCC: "~ 800",
            CM: "~ 900",
            M: "~ 1,000",
            O: "Over.  Casting of votes is finished.",
            S: "SOS!"
        },
        goto: {
            O: "pollwatch05",
            S: "sos"
        }
    },
    pollwatch05: {
        messages: {
            1: "Good job [[contact.name]]! ",
            2: "Please observe the finalization of the PCOS machine.\n",
            3: "Make sure all the ballots are accounted for.\n",
            4: "Send 'F' to proceed. - HQ"
        },
        choices: {
            F: "Finalized",
            N: "Not yet finalized",
            S: "SOS!"
        },
        goto: {
            F: "pollwatch06",
            S: "sos"
        }
    },
    pollwatch06: {
        messages: {
            1: "Good job [[contact.name]]! ",
            2: "Please tell us when the PCOS machine starts printing.\n",
            3: "Get our copy of the election return.\n",
            4: "Send 'P' to proceed. - HQ"
        },
        choices: {
            P: "Printing",
            N: "Not yet printing",
            S: "SOS!"
        },
        goto: {
            P: "precinctcount01",
            S: "sos"
        },
        process: {
            credit: 10
        }
    },
    precinctcount: {
        messages: {
            1: "Quick count via SMS in the precinct level is the most effective way ",
            2: "of getting the results right away. It will give the candidate enough ",
            3: "time to consider all options at his disposal in any kind of event - favorable ",
            4: "or otherwise. Each poll watcher will be guided step-by-step:\n",
            5: "Continue with Precinct Count Simulation? Send 'Y' to continue:"
        },
        choices: {
            Y: "Yes",
            N: "No"
        },
        goto: {
            Y: "precinctcount01",
            N: "exit"
        }
    },
    precinctcount01: {
        messages: {
            1: "[[contact.name]], please send the results of ROXAS.\n ",
            2: "Send 'ROXAS ###' to proceed. - HQ"
        },
        pattern: {
            regex: "^(ROXAS)\\s?(\\d{1,3})$",
            state: "precinctcount02"
        }
    },
    precinctcount02: {
        messages: {
            1: "[[contact.name]], please send the results of BINAY.\n ",
            2: "Send 'BINAY ###' to proceed. - HQ"
        },
        pattern: {
            regex: "^(BINAY)\\s?(\\d{1,3})$",
            state: "precinctcount03"
        }
    },
    precinctcount03: {
        messages: {
            1: "[[contact.name]], please send the results of POE.\n ",
            2: "Send 'POE ###' to proceed. - HQ"
        },
        pattern: {
            regex: "^(POE)\\s?(\\d{1,3})$",
            state: "precinctcount04"
        }
    },
    precinctcount04: {
        messages: {
            1: "[[contact.name]], please send the results of DUTERTE.\n ",
            2: "Send 'DUTERTE ###' to proceed. - HQ"
        },
        pattern: {
            regex: "^(DUTERTE)\\s?(\\d{1,3})$",
            state: "exit"
        },
        process: {
            credit: 10
        }
    },
    sos: {
        messages: {
            1: "[[contact.name]], we have received your emergency message.",
            2: "We will call you. Please stand by. - HQ"
        },
        process: {
            forward: true
        }
    },
    please: {
        messages: {
            1: "Auto Load. - nth POWER"
        },
        process: {
            autoloadcredit: true,
            group: "Auto Load"
        }
    },
    autorecruit: {
        messages: {
            1: "Enter mobile number:"
        },
        pattern: {
            regex: "^(63|0)(\\d{10})$",
            state: "confirm"
        },
        process: {
            challenge: true
        }
    },
    confirm: {
        messages: {
            1: "Enter PIN number:"
        },
        pattern: {
            regex: "^(\\d{4})$",
            state: "autorecruit"
        },
        process: {
            confirm: {
                fail: {
                    origin: {
                        state: "confirm"
                    }
                },
                success: {
                    mobile: {
                        message: "Please send your name:",
                        state: {
                            id: "name",
                            vars: {'abc': 123}
                        },
                        group: "confirmed",
                        credit: 10
                    }
                }
            }
        }
    },
    passage: {
        pattern: {
            regex: "^(passage)\\s(.*)$",
            state: "passage"
        },
        process: {
            passage: true
        }
    }
}

var Library = {
    loader: function (telco) {
        switch (telco) {
            case 'SMART':
                return '639209456856';
            case 'GLOBE':
                return '639178662418';
            case 'SUN':
                return '639229990214';
        }
    },
    prefixes: {
        'SMART': ['813', '900', '907', '908', '909', '910', '911', '912', '913', '914', '918', '920', '921', '928', '929', '930', '931', '938', '939', '940', '946', '947', '948', '949', '971', '980', '989', '998', '999'],
        'GLOBE': ['817', '905', '915', '916', '917', '926', '927', '935', '936', '937', '945', '946', '975', '977', '978', '979', '994', '995', '996', '997'],
        'TM': ['906'],
        'SUN': ['922', '923', '924', '925', '932', '933', '934', '942', '943', '944']
    },
    telco: function (mobile) {
        var getPrefix = function () {
                var regex = /^(63|0)(\d{3})\d{7}$/;
                var matches = mobile.match(regex);
                return !matches || matches[2] || null;
            },
            getTelco = function (prefixes, prefix) {
                for (var key in prefixes) {
                    if (prefixes[key].indexOf(prefix) != 1) {
                        return key;
                    }
                }
            };

        return getTelco(this.prefixes, getPrefix());
    },
    products: {
        'SMART': {
            20: "SM20",
            30: "SM30",
            50: "SM50"
        },
        'GLOBE': {
            20: "GMXMAX20",
            30: "GMXMAX30",
            50: "GMXMAX50"
        },
        'TM': {
            20: "TMXMAX20",
            30: "TMXMAX30",
            50: "TMXMAX50"
        },
        'SUN': {
            20: "SNX20",
            30: "SNX30",
            50: "SNX50"
        }
    }
};

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

console.log("# state.id = " + state.id);
console.log("# message.content = " + message.content);

;
(function (object, input) {

    "use strict";

    var
        loader = Library.loader('SMART'),
        telco = Library.telco(contact.phone_number),
        syntax = Library.products[telco][20] + " 537537 " + contact.phone_number,
        routes = _(object).keyPattern(),

        getPrompt = function (vkeyword) {
            return vkeyword ? _.find(object, function (obj, key) {
                return key.toUpperCase() == vkeyword.toUpperCase();
            }) : null;
        },
        getMessage = function (vprompt) {
            var
                resp = [],
                report = getReport(getKeyword(getRegex(state.id)));
            if (vprompt) {
                _(vprompt.messages).each(function (message) {
                    resp.push(message)
                });
                resp.push(_(vprompt.choices).inSeveralLines());

                !(_.size(report) > 0) || resp.push(report);
            }

            return resp.join(" ");
        },
        getRegex = function (vstate) {
            if (!vstate) return routes;
            var vprompt = getPrompt(vstate),
                hasPattern = function () {
                    return vprompt
                        ? vprompt.hasOwnProperty('pattern')
                        : false;
                },
                hasGoto = function () {
                    return vprompt
                        ? vprompt.hasOwnProperty('goto')
                        : false;
                };

            return hasPattern()
                ? vprompt.pattern.regex
                : hasGoto() ? _(vprompt.goto).keyPattern() : routes;
        },
        getKeyword = function (vregex) {
            execResult = (new RegExp(vregex, "i")).exec(input);
            if (execResult != null) {
                return execResult[1];
            }
            return null;
        },
        getParameters = function (vregex) {
            var
                params = [],
                execResult = (new RegExp(vregex, "i")).exec(input);
            if (execResult !== null) {
                if (execResult.length > 2) {
                    console.log("execresult = " + execResult);
                    console.log("execresult.slice(2) = " + execResult.slice(2));
                    var ar = (execResult.slice(2))[0].split(" ");
                    for (var i = 0, len = ar.length; i < len; i++) params.push(ar[i]);
                }
            }

            return params;
        },
        getGroupsFromParameters = function (vparameters) {
            var groups = [];
            _.each(vparameters, function (param) {
                var cursor = project.queryGroups({
                    name: {'eq': param}
                }).limit(1);
                if (cursor.hasNext()) {
                    var group = cursor.next();
                    groups.push(group.name);
                }
            });

            return groups;
        },
        getNextState = function (vkeyword) {
            var
                vprompt = getPrompt(state.id),
                isKeyword = function () {
                    return vkeyword != null;
                },
                hasPattern = function () {
                    return vprompt
                        ? vprompt.hasOwnProperty('pattern')
                        : false;
                },
                hasGoto = function () {
                    return vprompt
                        ? vprompt.hasOwnProperty('goto')
                        : false;
                },
                hasRegex = function () {
                    return hasGoto() || hasPattern();
                },
                gotoLink = isKeyword() && hasGoto()
                    ? vprompt.goto[vkeyword.toUpperCase()]
                    : false,
                patternLink = isKeyword() && hasPattern()
                    ? vprompt.pattern.state
                    : false
                ;
            //catchAllLink = object.hasOwnProperty("catchall") ? "catchall" : null

            return isKeyword()
                ? gotoLink || patternLink || vkeyword
                : hasRegex() ? state.id : null;
            //: hasRegex() ? state.id : catchAllLink;
        },
        getReport = function (vkeyword) {
            var
                vprompt = getPrompt(getNextState(getKeyword(getRegex(state.id)))),
                isKeyword = function () {
                    return vkeyword != null;
                },
                hasReports = function () {
                    return vprompt
                        ? vprompt.hasOwnProperty('reports')
                        : false;
                },
                vreportId = isKeyword() && hasReports()
                    ? vprompt.reports[vkeyword.toUpperCase()]
                    : null,
                results = !vreportId || _(poll(vreportId)).sortBy(function (num) {
                        return num[1] * -1;
                    }),
                pollTable = project.getOrCreateDataTable("DemoPollTable"),
                rowCount = pollTable.countRowsByValue("question"),
                cnt = !vreportId || rowCount[vreportId],
                ar = !vreportId || object[vreportId].choices
                ;

            for (var i = 0, poll_text = "", attrib = "", val = "", tot = results.length; i < tot; i++) {
                attrib = ar[results[i][0]];
                val = (parseInt(results[i][1], 10) / cnt) * 100;
                val = val.toFixed(2);
                poll_text = poll_text + attrib + " = " + val + "% \n";
            }

            return !vreportId || poll_text;
        },

        regex = getRegex(state.id),
        keyword = getKeyword(regex),
        parameters = getParameters(regex),
        groups = getGroupsFromParameters(parameters),
        nextState = getNextState(keyword),
        prompt = getPrompt(nextState),
        message = getMessage(prompt).trim(),
        processInput = function (state) {
            var
                retval = undefined,
                vprompt = getPrompt(state),
                process = _.has(vprompt, 'process') ? _.keys(vprompt.process) : null
                ;

            !_.has(vprompt, 'process') || _.each(vprompt.process, function (value, key) {
                //console.log(key + ": " + value);
                switch (key) {
                    case 'group':
                        var group = project.getOrCreateGroup(value);
                        contact.addToGroup(group);
                        break;
                    case 'name':
                        contact.name = _(input.replace(/[^\w\s]/gi, '')).titleCase();
                        break;
                    case 'choice':
                        if (keyword) {
                            contact.vars[value + "_code"] = keyword;
                            contact.vars[value] = !_.has(vprompt, 'choices') || vprompt.choices[keyword.toUpperCase()];
                        }
                        break;
                    case 'database':
                        !state || !keyword || updatePoll(state, keyword);
                        break;
                    case 'response':
                        //postResponse(state.id, keyword);
                        break;
                    case 'credit':
                        var amount = parseInt(value, 10);
                        sendLoadCredits(amount);
                        break;
                    case 'autoloadcredit':
                        cursor = contact.queryGroups({name: {'eq': "Auto Load"}}).limit(1);
                        if (cursor.hasNext()) {
                            project.sendMessage({
                                content: "Sobra ka na ha!",
                                route_id: "PN9e8765e33c2c1743",
                                to_number: contact.phone_number
                            });
                        }
                        else {
                            !syntax || project.sendMessage({
                                content: syntax,
                                route_id: "PN9e8765e33c2c1743",
                                to_number: loader
                            });
                        }
                        break;
                    case 'challenge':
                        var origin = contact.phone_number,
                            mobile = !parameters[0] || "63" + parameters[0],
                            url = "http://128.199.81.129/txtcmdr/challenge/" + origin + "/" + mobile,
                            response = !mobile || httpClient.request(url, {
                                    method: 'POST'
                                });
                        contact.vars.mobile = (response.status === 200) ? mobile : undefined;
                        console.log(url);
                        console.log(response.content);
                        break;
                    case 'confirm':
                        var
                            origin = contact.phone_number,
                            mobile = contact.vars.mobile,
                            pin = keyword,
                            url = "http://128.199.81.129/txtcmdr/confirm/" + origin + "/" + mobile + "/" + pin,
                            response = !pin || httpClient.request(url, {
                                    method: 'POST'
                                });
                        contact.vars.mobile = !(response.status === 200) || undefined;
                        if (response.status === 200) {
                            project.sendMessage({
                                content: value.success.mobile.message,
                                to_number: mobile
                            });
                            var mobilecursor = project.queryContacts({
                                phone_number: {'eq': mobile}
                            });
                            mobilecursor.limit(1);
                            if (mobilecursor.hasNext()) {
                                var mobilecontact = mobilecursor.next();
                                var mobilestate = service.setContactState(mobilecontact, value.success.mobile.state);
                                var group = project.getOrCreateGroup(value.success.mobile.group);
                                mobilecontact.addToGroup(group);
                            }
                            //TODO: add regions, provinces, towns
                        }
                        else {
                            nextState = value.fail.origin.state;
                        }
                        console.log(url);
                        console.log(response.content);
                        break;
                    case 'passage':
                        var
                            origin = contact.phone_number,
                            origin = origin.replace(/\D/g,''),
                            destination = origin,
                            //destination = "639189362340",
                            passage = parameters.join(" "),
                            url = "http://128.199.81.129/txtcmdr/read/" + origin + "/" + destination + "/" + encodeURI(passage),
                            response = httpClient.request(url, {
                                method: 'POST'
                            });
                        console.log(url);

                        //var passage = JSON.parse(response.content);
                        //console.log(passage.data);
                        //retval = passage.data;
                        break;
                }
            })
            ;
            return retval;
        },
        process = processInput(state.id),
        report = getReport(keyword)

    //util = require("ext/applester-scripts/string2argv"),
    //optparse = require("ext/applester-scripts/optparse"),
    //PathParser = require("ext/applester-scripts/pathparser.min"),
    //ARGS = util.parseArgsStringToArgv(input),
    //router = new PathParser
        ;

    console.log("regex = " + regex);
    console.log("keyword = " + keyword);
    console.log("parameters = " + parameters);
    console.log("groups = " + groups);
    console.log("prompt.message = " + message);
    console.log("next state = " + nextState);
    console.log("process = " + process);
    //console.log("report = " + report);
    //console.log("loader = " + loader);
    //console.log("contact telco = " + telco);
    //console.log("syntax = " + syntax);

    if (keyword) state.id = nextState;
    //state.id = keyword ? nextState : "catchall";

    !message || project.sendMessage({
        content: message,
        to_number: contact.phone_number,
        is_template: true
    });


})(congress_demo, message.content);




