/**
 * Created by lbhurtado on 05/11/15.
 */

var Router = require("ext/applester-scripts/router.min");

var router = new Router()
    .addRoute('#/search/:testparam', function(req,next){
        console.group();
        console.log('Matched /query/. Checking for query parameter' );
        console.log(req.query);
        console.log('Using req.get("q")',req.get('q'));
        console.log('Using req.get("missing_param","default value")',req.get("missing_param","default value"));
        console.log(req);
        console.groupEnd();
    })

    .addRoute('#/:username', function(req, next){
        console.group();
        console.log('Routed to user',req.params.username);
        console.log('Can also use req.get(\'username\')',req.get('username'));
        console.log(arguments);
        console.groupEnd();
    })
    
    .run(message.content);