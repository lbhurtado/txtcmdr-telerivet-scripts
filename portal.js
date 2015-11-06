/**
 * Created by lbhurtado on 05/11/15.
 */

var params = (function (input, status) {
    'use strict';

    _.mixin({
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        titleCase: function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        analyzeParams: function (params) {
            var parts = [];
            _(params).each(function (param) {
                if (!_.isUndefined(param)) {
                    parts.push(param);
                }
            });
            var input = parts.pop();
            return {
                'input': input,
                'parts': parts
            };
        }
    });

    var
        argvUtililty = require("ext/applester-scripts/string2argv"),
        pathParser = require("ext/applester-scripts/pathparser.min"),
        generatedURL = argvUtililty.parseArgsStringToArgv(input).join('/'),
        generatedParams = {},
        router = new pathParser(generatedParams),
        generateNameFromURL = function (params) {
            return _(((_(params).analyzeParams())
                .parts
                .join(' '))
                .replace(/[^\w\s]/gi, ''))
                .titleCase();
        }

    router.add('subscribe/:name1/:name2/:name3/:name4', function () {
        var
            name = generateNameFromURL(generatedParams),
            group = "subscriber",
            reply = name + " are now a subscriber.",
            state = null;

        generatedParams.name = name;
        generatedParams.groups = [group];
        generatedParams.reply = reply;
        generatedParams.state = state;
    });

    router.run(generatedURL);

    return generatedParams;

}(message.content, state.id));

if (params.name)
    contact.name = params.name;

if (params.groups) {
    _(params.groups).each(function(group){
        contact.addToGroup(project.getOrCreateGroup(params.group));
    });
}

if (params.state)
    state.id = params.state;

if (params.reply)
    sendReply(params.reply);


