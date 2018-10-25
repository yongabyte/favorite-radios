'use strict';

var localList;
var remoteList;

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({url:"http://radio.garden"}, function(tab){
    chrome.tabs.onUpdated.addListener(function onLoadedListener (id , info) {
      if (info.status === 'complete' && id==tab.id) {
        chrome.tabs.onUpdated.removeListener(onLoadedListener);
        chrome.tabs.sendMessage(tab.id, {onInstall: true}, function(response) {
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
      sendResponse(lists);
    }
    if (request.askForRemote){
      chrome.storage.sync.get("favors",function(req){
        console.log(req);
        sendResponse(req.favors);
      });
      return true; //tell chrome to wait for a sync response
    }
});

function compareLists(local,tabId){
  chrome.storage.sync.get("favors", function(req) {
    let rl =  req.favors;
    //TODO: rm
    localList = local;
    remoteList= rl;
    window.open("mergePopup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");

    if(!local|| local.length===0){
        if(rl){
          chrome.tabs.sendMessage(tabId,{remote: rl}, function(response) {
            console.log(response.ack);
          });
        }
      }else if(!rl||!rl.length) saveList(local);
    else if(!areListsEqual(local,rl)){
        console.log("hello");
        localList = local;
        remoteList= rl;
        window.open("mergePopup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
      }
  });
}

function areListsEqual(l1,l2){
  let set = new Set();
  for(let i =0; i < l1.length;++i){
    set.add(l1[i].name);
  }
  for(let i = 0; i < l2.length; ++i){
    if(!set.has(l2[i].name)) return false;
  }
  return true;
}

function saveList(list){
  chrome.storage.sync.set({favors: list}, function() {
    console.log("saved list.");
  });
}
