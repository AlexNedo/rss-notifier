
var rssUrl = "http://mangastream.com/rss";
var googleFeedsUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=";
var intervalID;
var savedFeeds = {};

$(document).ready(function () { 
    console.info("I'm ready");
    checkFeed();
    
    Notification.requestPermission(function (permission){
        if (permission === 'denied') {
            console.log('Permission was not granted.');
        } else if (permission === 'granted') {
            console.info("Starting periodic invocation");
            intervalID = setInterval(function(){
                console.info("Checking feed");
                checkFeed();
            }, 60000);
        }
    });

});

function stopPeriodicInvocation(){
    clearInterval(intervalID);
    console.info("Stopping periodic invocation");
}

function handleFeed(entries){
    entries.reverse();
    if (Object.getOwnPropertyNames(savedFeeds).length == 0) {
        //savedFeeds is empty
        entries.forEach( function (entry) { 
            savedFeeds[entry.title] = entry; 
            addNewChapter(entry);
        });
    }
    else{
        entries.forEach(function (entry){
            if (! (entry.title in savedFeeds)){
                savedFeeds[entry.title] = entry;
                showNotification(entry);
                addNewChapter(entry, true);
            }
        });
    }    
}

var mydata =""
function checkFeed(){
    $.get(googleFeedsUrl + encodeURIComponent(rssUrl), function (data) { 
        mydata=data;
        handleFeed(data.responseData.feed.entries);
    }, "json");
}

function showNotification(entry){
    console.log("new Notif " + entry.title);
    notif = new Notification(entry.title, {body:entry.content, data:entry.link});
    notif.onclick= function(e) { 
        window.open(e.target.data, "_blank");
    }
}

function addNewChapter(entry, newChapter=false){
    var card = $("<div class='item'><div class='title'></div><hr><a class='body'></a></div>");
    if (newChapter) {
        card.addClass("new-item");
    }
    card.find(".title").text(entry.title);
    card.find(".body")
    .text(entry.content)
    .attr("href", entry.link)
    .attr("target", "_blank")
    .click((e) => $(e.target.parentNode).removeClass("new-item"));
    card.prependTo("#container");
    
}
