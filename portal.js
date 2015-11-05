/**
 * Created by lbhurtado on 05/11/15.
 */

var PathParser = require("ext/applester-scripts/pathparser.min");

var params = {};

var router = new PathParser(params);

router.add('subscribe/:name1/:name2/:name3/:name4', function () {
    contact.name = this.name1 + ' ' + this.name2 + ' ' + this.name3 + ' ' + this.name4 + ' ';
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



