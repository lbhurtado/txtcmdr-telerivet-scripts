/**
 * Created by lbhurtado on 05/11/15.
 */

var PathParser = require("ext/applester-scripts/pathparser.min");

var params = {};

var router = new PathParser(params);

router.add('subscribe/:name', function () {
    contact.name = this.name;
    var group = project.getOrCreateGroup('subscriber');
    contact.addToGroup(group);  
});

router.add('items/:itemID');
router.add('collections/:collectionID/items/:itemID');

router.run(message.content);

var array = _.map(params, function(value, index) {
    return [value];
});

console.log(array);


