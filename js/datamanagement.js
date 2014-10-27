function removeDelegation(delegationID, showRemoveDelegationMessage){
        var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID;
        $.support.cors = true;
        $.ajax({
                url : urlEndp,
                //type : "DELETE" <-- use directly this is not working
                data: {"_method":"delete"},
                dataType:'script',
                type : "POST",
                xhrFields : {
                        withCredentials : true
                },
                success : function(data1, status) {
                        if (showRemoveDelegationMessage)
                                console.log("delegation removed correctly");
                        showDelegateModal();
                        showNoProxyMessages();
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error removing the existing delegation. "+ supportText);
                }
        });
}

