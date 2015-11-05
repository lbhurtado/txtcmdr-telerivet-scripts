/**
 * Created by lbhurtado on 05/11/15.
 */

var PathParser = require("ext/applester-scripts/pathparser.min");

var params = {};
var router = new PathParser(params);
router.add('items/:itemID');
router.add('collections/:collectionID/items/:itemID');

console.log(params);

router.run(message.content);



