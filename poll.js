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
        mustProcess: function () {
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
        mustProcess: function () {
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
        mustProcess: function () {
            var name = message.content;
            contact.name = _(name.replace(/[^\w\s]/gi, '')).titleCase();
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
            contact.vars[this.state + '_tries'] = contact.vars[this.state + '_tries'] || 0;

            console.log(contact.vars[this.state + '_tries']);

            var retval = [
                _(this.state).capitalize() + ": ",
                this.template,
            ];
            switch (contact.vars[this.state + '_tries']) {
                case 0:
                    retval.push(this.instruction + _(this.choices).inSeveralLines());
                default:
                    retval.push(this.instruction + _(this.choices).inSeveralLines());
                    retval.push(_(this.choices).keysInALine());
            }
            return retval.join(" ");
        },
        isValid: function () {
            var valid = this.regex.test(word1);
            contact.vars[this.state + '_tries'] = valid ? 0 : contact.vars[this.state + '_tries'] + 1;
            console.log(contact.vars[this.state + '_tries']);
            return valid;
        },
        mustProcess: function () {
            var code = word1;
            contact.vars.candidate_code = code;
            contact.vars.candidate = this.choices[code];
            updatePoll(this.state, code);
            postResponse(this.state, code);
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
            return this.template + " " + this.instruction + _(this.choices).inSeveralLines();
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        mustProcess: function () {
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
            return this.template + " " + this.instruction + _(this.choices).inSeveralLines();
        },
        isValid: function () {
            return word1.match(this.regex);
        },
        mustProcess: function () {
            var code = word1;
            contact.vars.issue_code = code;
            contact.vars.issue = this.choices[code];
            updatePoll(this.state, code);
        }
    }
]

var survey2 = {
    s1: {
        'state': null,
        'question': "Bayan o sarili?",
        'instruction': "",
        'regex': {
            'pattern': "^(BAYAN)$",
            'modifier': "i"
        },
        process: {
            'group': "Bayan"
        },
        mustProcess: function () {
            var group = project.getOrCreateGroup('Bayan');
            contact.addToGroup(group);
        },
    },
    s2: {
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
        mustProcess: function () {
            var group = project.getOrCreateGroup('Opted In');
            contact.addToGroup(group);
        }
    },
    s3: {
        'state': "name",
        'question': "What is your name?",
        'instruction': "No special characters please.",
        'regex': {
            "pattern": "^[a-zA-Z0-9\\s]+$"
        },
        process: {
            'name': true
        },
        mustProcess: function () {
            var name = message.content;
            contact.name = _(name.replace(/[^\w\s]/gi, '')).titleCase();
        }
    },
    s4: {
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
            'choice': true,
            'database': true
        },
        mustProcess: function () {
            var code = word1;
            contact.vars.candidate_code = code;
            contact.vars.candidate = this.choices[code];
            updatePoll(this.state, code);
            postResponse(this.state, code);
        }
    },
    s5: {
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
            'choice': true,
            'database': true
        },
        mustProcess: function () {
            var code = word1;
            contact.vars.reason_code = code;
            contact.vars.reason = this.choices[code];
            updatePoll(this.state, code);
        }
    },
    s6: {
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
            'choice': true,
            'database': true
        },
        mustProcess: function () {
            var code = word1;
            contact.vars.issue_code = code;
            contact.vars.issue = this.choices[code];
            updatePoll(this.state, code);
        }
    }
}

/*
 //initiilze variables

 if (word1.toUpperCase().indexOf('INIT') != -1) {
 var url = "http://128.199.81.129/txtcmdr/ask4questions/survey/store/demo";
 var response = httpClient.request(url, {
 method: "POST",
 data: {
 description: "demo survey",
 data :  JSON.stringify(survey)

 }
 // headers: {'X-Example': "example"},
 // basicAuth: "my_username:my_password"
 });

 console.log(url);
 }

 //TODO: take out all functions, pattern and objects in survey data, and make it an object with lots of elements rather than an array of objects
 */

survey = _.values(survey2);

contact.vars.tries = contact.vars.tries || 0;

var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id; // get all survey elements with specified state.id
});

var prompt = _.find(prompts, function (obj) {
        regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
        return (regex.exec(word1) != null);
    //}) || prompts[FIRST_ELEMENT];  // default to first prompt if there are many prompts with same state.id
    }) || null;

var ndx = survey.indexOf(prompt);

regex = new RegExp(survey[ndx].regex.pattern, survey[ndx].regex.modifier);

//if (regex.exec(word1) != null) {
if (prompt) {
    prompt.mustProcess();
    ndx = (ndx + 1) % survey.length;
    console.log("prompt is valid");
}
else {
    console.log("prompt is null");
}

state.id = survey[ndx].state;

var question_array = [];

if (survey[ndx].state)
    question_array.push(_(survey[ndx].state).capitalize() + ": ");

question_array.push(survey[ndx].question)

if (survey[ndx].choices) {
    question_array.push(survey[ndx].instruction + _(survey[ndx].choices).inSeveralLines());
}
var question = question_array.join(" ");

console.log(prompt.state);
console.log(question);


/*
 project.sendMessage({
 content: prompts.template,
 to_number: contact.phone_number,
 is_template: true
 });
 */