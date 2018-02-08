const APP_URL = "https://***/***/";
const APP_BOX_NAME = 'io_personium_demo_app-aizu-health-store';

getEngineEndPoint = function() {
    return Common.getAppCellUrl() + "__/html/Engine/getAppAuthToken";
};

getNamesapces = function() {
    return ['common', 'glossary'];
};

getAppRole = function() {
    // Currently we only allow role with read permission.
    return 'Friend';
};

additionalCallback = function() {
    Common.setIdleTime();

    Common.getProfileName(Common.getCellUrl(), displayMyDisplayName);
};

displayMyDisplayName = function(extUrl, dispName) {
    $("#dispName")
        .attr("data-i18n", "[html]glossary:msg.info.description")
        .localize({
            "name": dispName
        });
};
