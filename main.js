var ar = contact.vars.addtogroups.split(",");
for (var i in ar) {
  var grp = project.getOrCreateGroup(ar[i]);
  contact.addToGroup(grp);
}
contact.vars.addtogroups = null;
