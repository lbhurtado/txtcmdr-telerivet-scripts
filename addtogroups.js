if (typeof $addtogroups !== 'undefined') {
  if ($addtogroups.length > 0) {
    var ar = $addtogroups.split(",");
    for (var i in ar) {
      var grp = project.getOrCreateGroup(ar[i]);
      contact.addToGroup(grp);
    }
  }
}

console.log('using addtogroups.js');
