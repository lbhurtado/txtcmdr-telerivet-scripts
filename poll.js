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
    bayan: {
        messages: {
            1: "Welcome to the nth POWER demonstration.",
            2: "Please choose a simulation:"
        },
        choices: {
            S: "Survey",
            //W: "Poll Watch",
            //Q: "PCOS Quick Count",
            //C: "CCS Quick Count",
            R: "Results"
        },
        goto: {
            S: "survey01",
            //W: "pollwatch",
            //Q: "pcos",
            //C: "ccs",
            R: "results"
        }
    },
    survey01: {
        messages: {
            1: "Get load credits for answering 4 questions. Proceed?",
            2: "Answer 'Y' or 'Yes' to proceed."
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
            1: "What is your name?",
            2: "No special characters please."
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
            1: "[[contact.name]], why did you choose [[contact.vars.candidate]]",
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
            1: "Thank you for participating. - nth POWER"
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
    autoload: {
        messages: {
            1: "Auto Load. - nth POWER"
        },
        process: {
            autoloadcredit: true,
            group: "Auto Load"
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

console.log("state.id = " + state.id);
console.log("text message = " + message.content);

;
(function (object, input) {
    var
        loader = Library.loader('SMART'),
        telco = Library.telco(contact.phone_number),
        syntax = Library.products[telco][20] + " 537537 " + contact.phone_number
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
        getKeyword = function (regex) {
            execResult = (new RegExp(regex, "i")).exec(input);
            console.log(execResult);
            if (execResult != null) {
                return execResult[1];
            }
            return null;
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
                    : false;

            return isKeyword()
                ? gotoLink || patternLink || vkeyword
                : hasRegex() ? state.id : null;
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
        nextState = getNextState(keyword),
        prompt = getPrompt(nextState),
        message = getMessage(prompt),
        processInput = function (state) {
            var
                vprompt = getPrompt(state),
                process = _.has(vprompt, 'process') ? _.keys(vprompt.process) : null
                ;

            !_.has(vprompt, 'process') || _.each(vprompt.process, function (value, key) {
                console.log(key + ": " + value);
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
                            ! syntax || project.sendMessage({
                                content: syntax,
                                route_id: "PN9e8765e33c2c1743",
                                to_number: loader
                            });
                        }

                        break;
                }
            })
            ;
            return process;
        },
        process = processInput(state.id),
        report = getReport(keyword)
        ;

    console.log("regex = " + regex);
    console.log("keyword = " + keyword);
    console.log("prompt.message = " + message);
    console.log("next state = " + nextState);
    console.log("process = " + process);
    console.log("report = " + report);
    console.log("loader = " + loader);
    console.log("contact telco = " + telco);
    console.log("syntax = " + syntax);

    if (keyword) state.id = nextState;

    ! message || project.sendMessage({
        content: message,
        to_number: contact.phone_number,
        is_template: true
    });

})(congress_demo, message.content);

