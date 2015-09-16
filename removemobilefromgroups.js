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

        //console.log(mobile);

        var user_group_ids_array = []
        var user = project.getOrCreateContact({phone_number: mobile});

        console.log(user.name);

        cursor = user.queryGroups();
        cursor.limit(50);
        while (cursor.hasNext()) {
            var group = cursor.next();
            console.log(group);
            var group_name = group.name;
            var group_id = group.id;
            console.log('group name'. group_name);
            user_group_ids_array.push({name: group_name, id: group_id});
        }

        console.log(user_group_ids_array);

        for (var i in groups_array) {
            var group_name = groups_array[i];
            var user_group_id = user_group_ids_array[group_name];
            if (user_group_id) {
                var group = project.initGroupById(user_group_id);
                user.removeFromGroup(group);
            }
        }
        console.log('using removemobilefromgroups.js');
    }
}