/**
 * Created by lbhurtado on 05/11/15.
 */

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
        _(params).each(function(param){
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
    PathParser = require("ext/applester-scripts/pathparser.min"),
    params = {},
    router = new PathParser(params);

router.add('subscribe/:name1/:name2/:name3/:name4', function () {
    params.name = _(((_(params).analyzeParams())
        .parts
        .join(' '))
        .replace(/[^\w\s]/gi, ''))
        .titleCase();
    params.group = 'subscriber';
});

var
    util = require("ext/applester-scripts/string2argv"),
    args = util.parseArgsStringToArgv(message.content),
    url = args.join('/');

router.run(url);

if (params.name) contact.name = params.name;
if (params.group) contact.addToGroup(project.getOrCreateGroup(params.group));

