'use strict';

let mergeNow = document.getElementById('mergeNow');
let popup = document.getElementById("popup");

mergeNow.onclick = function(){
  chrome.runtime.sendMessage({askForLists:true},function(lists){
    createLayout(lists);
  })
}

function createLayout(lists){
  cleanPopUp();
  let div = document.createElement("div");
  let left = document.createElement("div");
  addTextNode("Unsaved",left);
  // left.classList.add("column", "side");
  left.className = "gridsquare";
  let middle = document.createElement("div");
  // middle.classList.add ("column");
  middle.className = "gridsquare";
  let right = document.createElement("div");
  // right.classList.add("column", "side");
  right.className = "gridsquare";
  addTextNode("Saved",right);

  let ls = twoLists(lists.local,lists.remote);
  createUl(left,ls.unsaved,"Unsaved");
  createMiddleButton(middle);
  createUl(right,ls.saved,"Saved");
  appendkids(div,[left,middle,right]);
  popup.appendChild(div);
  div.className = "row";
}

function addTextNode(text,div) {
  var newtext = document.createTextNode(text);
  div.appendChild(newtext);
}


function appendkids(div,kids){
  for(let i = 0; i < kids.length;++i){
    div.append(kids[i]);
  }
}

function appendChildren(div,kids){
  for(let i = 0; i < kids.length;++i){
    div.appendChild(kids[i]);
  }
}

function createUl(div,textset,text){
  let ul  = document.createElement('ul');
  createLis(ul,textset);
  div.appendChild(ul);
}

function createLis(ul,texts){
  if(texts.size ==0) return;
  texts = Array.from(texts);
  let rt = [];
  for(let i = 0; i < texts.length; ++i){
    let li = document.createElement("li");
    li.innerHTML=texts[i];
    rt.push(li);
  }
  appendChildren(ul,rt);
}

function createMiddleButton(div){
  let btn = document.createElement("BUTTON");
  insertIcon(btn);
  btn.fontSize = "30px";
  div.append(btn);
}

function insertIcon(div){
  let icon =  document.createElement("i");
  icon.className = "fa fa-angle-double-down";
  div.append(icon);
}

function twoLists(local,remote){
  let s = new Set();
  let u = new Set();
  for(let j = 0; j < remote.length; ++j){
    s.add(remote[j].name);
  }
  for(let i =0; i < local.length; ++i){
    if(!s.has(local[i].name)){
      u.add(local[i].name);
    }
  }
  return {
    saved: s,
    unsaved:u
  };
}

function cleanPopUp(){
  while(popup.firstChild){
    popup.removeChild(popup.firstChild);
  }
}
