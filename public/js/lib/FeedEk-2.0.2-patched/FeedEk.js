/*
* FeedEk jQuery RSS/ATOM Feed Plugin v2.0
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com   
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            FeedUrl: "http://rss.cnn.com/rss/edition.rss",
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            CharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: "",
            DateFormatLang:"en"
        }, opt);

        var id = $(this).attr("id"), i, s = "",dt;
        $("#" + id).empty().append('<img src="js/lib/FeedEk-2.0.2-patched/loader.gif" />');

        $.ajax({
            url: 'https://api.rss2json.com/v1/api.json',
	    method: 'GET',
            data: {
              rss_url: def.FeedUrl,
              api_key: 'llehy9e1xzodyvu0bpacwc1qwjqnqifknwn7nnoq', // put your api key here
              count: def.MaxCount,
            }, 
            dataType: "json",
            success: function (data) {
                $("#" + id).empty();
                $.each(data.items, function (e, item) {
        	    s += '<li><div class="itemTitle"><a onclick="window.open(this.href,\'_blank\');return false;" href="' + item.link + '" target="' + def.TitleLinkTarget + '">' + item.title + "</a></div>";
                    if (def.ShowPubDate){
                        dt= new Date(item.pubDate);
                        if ($.trim(def.DateFormat).length > 0) {
                            try {
                                moment.lang(def.DateFormatLang);
                                s += '<div class="itemDate">' + moment(dt).format(def.DateFormat) + "</div>";
                            }
                            catch (e){s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";}                            
                        }
                        else {
                            s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";
                        }                        
                    }
                    if (def.ShowDesc) {
                        if (def.DescCharacterLimit > 0 && item.content.length > def.DescCharacterLimit) {
                            s += '<div class="itemContent">' + item.content.substr(0, def.DescCharacterLimit) + "...</div>";
                        }
                        else {
                            s += '<div class="itemContent">' + item.content + "</div>";
                        }
                    }
                });
                $("#" + id).append('<ul class="feedEkList">' + s + "</ul>");
            }
        });
    };
})(jQuery);
