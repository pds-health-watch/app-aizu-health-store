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

getAppDataPath = function() {
    return 'OData/HealthRecord';
};

/*
 * To be combine with the default hash to produce the following:
 * {
 *     type: 'GET',
 *     dataType: 'text',
 *     url: targetCell + getAppDataPath(),
 *     headers: {
 *         'Authorization':'Bearer ' + token,
 *     }
 *  }
 */
getAppRequestInfo = function() {
    return {
        dataType: 'text'
    };
};


additionalCallback = function() {
    Common.setIdleTime();

    Common.getProfileName(Common.getCellUrl(), displayMyDisplayName);

    $('#get_health_record').click(function(){
        displayFriendHealthRecord($('#cell_url').val());
    });
};

displayMyDisplayName = function(extUrl, dispName) {
    $("#dispName")
        .attr("data-i18n", "[html]glossary:msg.info.description")
        .localize({
            "name": dispName
        });

    $('body > div.mySpinner').hide();
    $('body > div.myHiddenDiv').show();
};

displayFriendHealthRecord = function(toCellUrl) {
    $('body > div.mySpinner').show();
    $('body > div.myHiddenDiv').hide();

    if (_.last($('#cell_url').val()) != '/') {
        toCellUrl += '/';
        $('#cell_url').val(toCellUrl);
    }
        
    $.when(Common.getTranscellToken(toCellUrl), Common.getAppAuthToken(toCellUrl))
        .done(function(result1, result2) {
            let tempTCAT = result1[0].access_token; // Transcell Access Token
            let tempAAAT = result2[0].access_token; // App Authentication Access Token
            Common.perpareToCellInfo(toCellUrl, tempTCAT, tempAAAT, function(cellUrl, boxUrl, token) {
                getAppDataAPI(boxUrl, token)
                    .done(function(data){
                        for(var i in data.d.results) {
                            console.log(data.d.results[i]);
                            let momentObj = getMomentObject(data.d.results[i].startDate);
                            let dateStr = momentObj
                                .locale("ja")
                                .format('MMMM Do YYYY, h:mm:ss a');

                            let aTd1 = $('<td>', {
                                text: data.d.results[i].__id
                            });
                            let aTd2 = $('<td>', {
                                text: dateStr
                            });
                            let aTr = $('<tr>');
                            aTr.append($(aTd1), $(aTd2));
                            $('#container table').append($(aTr));
                        }
                    })
                    .fail(function(error){
                        console.log(error.responseJSON.code);
                        console.log(error.responseJSON.message.value);
                    })
                    .always(function(){
                        $('body > div.mySpinner').hide();
                        $('body > div.myHiddenDiv').show();
                    });
            });
        })
        .fail(function(error){
            console.log(error.responseJSON.code);
            console.log(error.responseJSON.message.value);
            $('body > div.mySpinner').hide();
            $('body > div.myHiddenDiv').show();
        });
};

getAppDataAPI = function(targetBoxUrl, token) {
    let requestInfo = $.extend(true,
        {
            type: 'GET',
            url: targetBoxUrl + getAppDataPath() + '?$orderBy=startDate asc&$top=10',
            headers: {
                'Authorization':'Bearer ' + token,
                'Accept':'application/json'
            }
        },
        {}
    );

    return $.ajax(requestInfo);
};

getMomentObject = function(dateString) {
    let eventObj = moment(dateString);
    return eventObj;
};
