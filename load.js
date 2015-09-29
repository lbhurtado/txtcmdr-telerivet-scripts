if (typeof $load !== 'undefined') {
    var SERVICE_ID = "SV3145710a9a61d107";
    var airtimeService = project.getServiceById(SERVICE_ID);
    airtimeService.invoke({
        context: 'contact',
        contact_id: contact.id
    });
}

if (typeof $loadmobile !== 'undefined') {
    var colon_delimited_text = $loadmobile.trim();
    if (colon_delimited_text.length > 0) {
        if (colon_delimited_text.indexOf(":") != -1) {
            var load_mobile_array = colon_delimited_text.split(":");
            var mobile = load_mobile_array[0];
            var load = load_mobile_array[1];
        }
    }
    var user = project.getOrCreateContact({
        phone_number: mobile
    });
    var SERVICE_ID = "SV3145710a9a61d107";
    var airtimeService = project.getServiceById(SERVICE_ID);
    airtimeService.invoke({
        context: 'contact',
        contact_id: user.id
    });
}