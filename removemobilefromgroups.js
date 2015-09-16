/**
 * Created by lbhurtado on 9/16/15.
 */

if (typeof $removemobilefromgroups !== 'undefined') {
    var colon_delimited_text = $removemobilefromgroups.trim();
    if (colon_delimited_text.length > 0) {
        var mobile_groups_array = colon_delimited_text.split(":");
        var mobile = mobile_groups_array[0];
        var comma_delimited_text = mobile_groups_array[1];
        var groups_array = comma_delimited_text.split(",");

        if (mobile) {
            userCursor = project.queryContacts({phone_number: {'eq': mobile}});
            userCursor.limit(1);
            if (userCursor.hasNext()) {
                var user = userCursor.next();
                groupCursor = user.queryGroups();
                groupCursor.limit(50);
                while (groupCursor.hasNext()) {
                    var group = groupCursor.next();
                    user.removeFromGroup(group);
                    console.log('deleted ' . group.name);
                }
                console.log('using removemobilefromgroups.js');
            }
        }
    }
}