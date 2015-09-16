//delete empty groups
cursor = project.queryGroups();

cursor.limit(50);

while (cursor.hasNext()) {
    var group = cursor.next();
    if (group.num_members == 0) {
        group.delete();
    }
}