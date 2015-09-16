/**
 * Created by lbhurtado on 9/16/15.
 */

if (typeof $addmobiletogroups !== 'undefined') {
    var colon_delimited_text = $addmobiletogroups.trim();
    if (colon_delimited_text.length > 0) {
        var mobile_groups_array = colon_delimited_text.split(":");
        var mobile = mobile_groups_array[0];
        var comma_delimited_text = mobile_groups_array[1];
        var groups_array = comma_delimited_text.split(",");
        var group_ids_array = [];
        for (var i in groups_array) {
            var group = project.getOrCreateGroup(groups_array[i]);
            group_ids_array.push(group.id);
        }
        project.getOrCreateContact({
            phone_number: mobile,
            add_group_ids: group_ids_array,
        });
        console.log('using addmobiletogroups.js');
    }
}