if (typeof $addtogroups !== 'undefined') {
    var comma_delimited_text = $addtogroups.trim();
    if (comma_delimited_text.length > 0) {
        var groups_array = comma_delimited_text.split(",");
        for (var i in groups_array) {
            var group = project.getOrCreateGroup(groups_array[i]);
            contact.addToGroup(group);
        }
    }
}

if (typeof $removefromgroups !== 'undefined') {
    var comma_delimited_text = $removefromgroups.trim();
    if (comma_delimited_text.length > 0) {
        var groups_array = comma_delimited_text.split(",");
        groupCursor = contact.queryGroups();
        groupCursor.limit(50);
        while (groupCursor.hasNext()) {
            var group = groupCursor.next();
            if (groups_array.indexOf(group.name) != -1) {
                contact.removeFromGroup(group);
            }
        }
    }
}

if (typeof $addmobiletogroups !== 'undefined') {
    var colon_delimited_text = $addmobiletogroups.trim();
    if (colon_delimited_text.length > 0) {
        if (colon_delimited_text.indexOf(":") != -1) {
            var mobile_groups_array = colon_delimited_text.split(":");
            var mobile = mobile_groups_array[0];
            var comma_delimited_text = mobile_groups_array[1];
            if (comma_delimited_text.length > 0) {
                var group_ids_array = [];
                var groups_array = comma_delimited_text.split(",");
                for (var i in groups_array) {
                    var group = project.getOrCreateGroup(groups_array[i]);
                    group_ids_array.push(group.id);
                }
                var user = project.getOrCreateContact({
                    phone_number: mobile,
                    add_group_ids: group_ids_array,
                });
            }
        }
    }
}

if (typeof $removemobilefromgroups !== 'undefined') {
    var colon_delimited_text = $removemobilefromgroups.trim();
    if (colon_delimited_text.length > 0) {
        if (colon_delimited_text.indexOf(":") != -1) {
            var mobile_groups_array = colon_delimited_text.split(":");

            var mobile = mobile_groups_array[0];
            console.log(mobile);
            
            var comma_delimited_text = mobile_groups_array[1];
            if (comma_delimited_text.length > 0) {
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
                        }
                        console.log(user);
                    }
                }
            }
        }
    }
}