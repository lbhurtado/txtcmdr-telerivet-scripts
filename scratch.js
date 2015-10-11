/**
 * Created by lbhurtado on 10/5/15.
 */


var prompts = _.filter(survey, function (obj) {
    return obj.state == state.id; // get all survey elements with specified state.id
});

var execResult = null;

var prompt = _.find(prompts, function (obj) {
        regex = new RegExp(obj.regex.pattern, obj.regex.modifier);
        //execResult = regex.exec(word1);

        execResult = regex.exec(message.content);
        return (execResult != null);
    }) || null;

var nextPrompt = null;

if (prompt) {
    console.log("keyword is valid.");
    console.log(Object.keys(prompt));

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
            case 'credit':
                var amount = parseInt(value, 10);
                sendLoadCredits(amount);
                break;
        }
    });

    var nextId = prompt.next;
    nextPrompt = _.find(survey, function (obj) {
        if (prompt.goto) {
            console.log(execResult);
            nextId = prompt.goto[execResult[1].toUpperCase()] || nextId;
            console.log("nextId: " + nextId);
        }
        return obj.id == nextId;
    });

    if (nextPrompt)
        console.log("nextPrompt.id:" + nextPrompt.id);
    else
        console.log("nextPrompt is null. " + prompt.next);
}
else {
    console.log("keyword is NOT valid!");
    nextPrompt = _.find(prompts, function (obj) {
            return ((obj.id).toUpperCase().indexOf("DEFAULT") != -1);
        }) || prompts[FIRST_ELEMENT];
}

console.log("type of nextPrompt: " + typeof nextPrompt);
state.id = nextPrompt.state;

var question_array = [];
if (nextPrompt.state)
    question_array.push(_(nextPrompt.state).capitalize() + ": ");
question_array.push(nextPrompt.question);

if (nextPrompt.choices) {
    question_array.push(nextPrompt.instruction + "\n" + _(nextPrompt.choices).inSeveralLines());
}
var question = question_array.join(" ");

console.log(question);


project.sendMessage({
    content: question,
    to_number: contact.phone_number,
    is_template: true
});
