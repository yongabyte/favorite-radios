'use strict';
var localList;
var remoteList;
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
    if(request.askForLists){
      let lists = {
        local: localList,
        remote: remoteList
      }
      console.log(lists);
      sendResponse(lists);
    }
});

function compareLists(local,tabId){

  chrome.storage.sync.get("favors", function(rl) {
  localList = local;
  remoteList= rl.favors;
  console.log(areListsEqual(local,rl.favors));
  window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=yes");
    if(!local|| local.length===0){
      if(rl){
        chrome.runtime.sendMessage(tabId,{remote: rl}, function(response) {
          console.log(response.ack);
        });
      }
    }else if(!rl.length) saveList(local);
    else if(!areListsEqual(local,rl)){
        console.log("hello");
        localList = local;
        remoteList= rl;
        window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");  
      }
  });
}

function areListsEqual(l1,l2){
  var set = new Set(l1);
  for(let i = 0; i < l2.length; ++i){
    if(!set.has(l2[i])) return false;
  }
  return true;
}

function saveList(list){
  chrome.storage.sync.set({favors: list}, function() {
    console.log("saved list.");
  });
}
