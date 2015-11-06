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
    }
});

var PathParser = require("ext/applester-scripts/pathparser.min");

var params = {};

var router = new PathParser(params);

router.add('subscribe/:name1/:name2/:name3/:name4', function () {
    var obj1 = _(params).reject(function (param) {
        return _.isUndefined(value);
    });
    var ar1 = _(obj1).toArray();
    console.log(ar1);

    var name = ar1.join(' ');

    //_(params).each(function(param){
    //    if (param) {
    //        name.push(param);
    //    }
    //});
    /*
     if (this.name1) name.push(this.name1);
     if (this.name2) name.push(this.name2);
     if (this.name3) name.push(this.name3);
     if (this.name4) name.push(this.name4);
     */

    //contact.name = _(name.join(' ').replace(/[^\w\s]/gi, '')).titleCase();

    contact.name = name;

    var group = project.getOrCreateGroup('subscriber');
    contact.addToGroup(group);
});

router.add('items/:itemID');
router.add('collections/:collectionID/items/:itemID');

var util = require("ext/applester-scripts/string2argv")
var ARGS = util.parseArgsStringToArgv(message.content);
var url = ARGS.join('/');

console.log('url = ' + url);

router.run(url);



