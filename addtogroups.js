/*
 $addtogroups is a temporary variable created by the
 the json response of the webhook.  If it has a value,
 a comma-delimited text of group names will be parsed.
 Each group will be created if doesn't exist yet and
 then the contact will be added to the group
 */

if (typeof $addtogroups !== 'undefined') {
    var comma_delimited_text = $addtogroups.trim();
    if (comma_delimited_text.length > 0) {
        var groups_array = comma_delimited_text.split(",");
        for (var i in groups_array) {
            var group = project.getOrCreateGroup(groups_array[i]);
            contact.addToGroup(group);
        }
        console.log('using addtogroups.js');
    }
}
