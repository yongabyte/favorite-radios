'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({url:"http://radio.garden"}, function(tab){
    chrome.tabs.onUpdated.addListener(function onLoadedListener (id , info) {
      if (info.status === 'complete' && id==tab.id) {
        chrome.tabs.onUpdated.removeListener(onLoadedListener);
        chrome.tabs.sendMessage(tab.id, {initiate: true}, function(response) {
          compareLists(response.localList,id);
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.updatedList){
      saveList(request.updatedList);
    }
});

function compareLists(local,tabId){
  chrome.storage.sync.get("favors", function(remoteList) {
    console.log(remoteList.length);
    if(!local|| local.length===0){
      if(remoteList){
        chrome.runtime.sendMessage(tabId,{remote: remoteList}, function(response) {
          console.log(response.ack);
        });
      }
    }else if(!remoteList.length) saveList(local);
    else{
      //TODO: let user decide what to keep
    }
  });
}

function saveList(list){
  chrome.storage.sync.set({favors: list}, function() {
    console.log("saved list.");
  });
}
