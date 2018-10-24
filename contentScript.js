'use strict';
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.onInstall === true){
      let ls = JSON.parse(localStorage.getItem("favorites-list"));
      sendResponse({localList:ls});
    }
    if(request.remote){
      localStorage.setItem("favorites-list",JSON.stringify(request.remote));
      sendResponse({ack:true});
    }
  });

if(!localStorage.getItem("favorites-list")){
  chrome.runtime.sendMessage({askForRemote: true}, function(list) {
    console.log(list);
    if(list){
      localStorage.setItem("favorites-list",JSON.stringify(list));
    }
  });
}

let addFavor = "icon-button mod-favorite mod-interactive mod-hide-border mod-no-hover";
let removeFavor = "icon-button mod-favorite mod-interactive mod-active mod-hide-border mod-no-hover";

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i];
      if(node.innerHTML=="Remove favorite"||node.innerHTML=="Add favorite"){
        document.getElementsByClassName(removeFavor)[0].addEventListener("click",onchanged);
        document.getElementsByClassName(addFavor)[0].addEventListener("click",onchanged);
        observer.disconnect();
      }
    }
  })
});

observer.observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
});

function onchanged(){
  let list = JSON.parse(localStorage.getItem("favorites-list"));
  chrome.runtime.sendMessage({updatedList: list}, function() {
    console.log("list updated");
  });
}
