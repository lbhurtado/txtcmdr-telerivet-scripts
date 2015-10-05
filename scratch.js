/**
 * Created by lbhurtado on 10/5/15.
 */

//initialze variables

if (word1.toUpperCase().indexOf('INIT') != -1) {
    var url = "http://128.199.81.129/txtcmdr/ask4questions/survey/store/demo";
    var response = httpClient.request(url, {
        method: "POST",
        data: {
            description: "demo survey",
            data: survey2
        }
    });

    console.log(url);
}

var survey = _.values(survey2);

var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id; // get all survey elements with specified state.id
});

var indexOfCurrentPrompt = survey.indexOf(prompts[FIRST_ELEMENT]);

var prompt = _.find(prompts, function (obj) {
        regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
        return (regex.exec(word1) != null);
    }) || null;

var defaultIndexOfNextPrompt = indexOfCurrentPrompt;
var indexOfNextPrompt = defaultIndexOfNextPrompt;

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
        }
    });

    indexOfNextPrompt = (survey.indexOf(prompt) + 1) % survey.length;
}

state.id = survey[indexOfNextPrompt].state;

var question_array = [];

if (survey[indexOfNextPrompt].state)
    question_array.push(_(survey[indexOfNextPrompt].state).capitalize() + ": ");

question_array.push(survey[indexOfNextPrompt].question)

if (survey[indexOfNextPrompt].choices) {
    question_array.push(survey[indexOfNextPrompt].instruction + _(survey[indexOfNextPrompt].choices).inSeveralLines());
}
var question = question_array.join(" ");

console.log(question);


/*
 project.sendMessage({
 content: prompts.template,
 to_number: contact.phone_number,
 is_template: true
 });
 */