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
            cursor = project.queryContacts({phone_number: {'eq': mobile}});
            cursor.limit(1);
            if (cursor.hasNext()) {
                var user = cursor.next();
                cursor = user.queryGroups();
                cursor.limit(50);
                while (cursor.hasNext()) {
                    var group = cursor.next();
                    user.removeFromGroup(group);
                }
                console.log('using removemobilefromgroups.js');
            }
        }
    }
}