'use strict';

let mergeNow = document.getElementById('mergeNow');
let popup = document.getElementById("popup");
let flag = undefined; //indicate which side are we selecting -1 unsave 1 saved
let icon;
let selected = new Set();
let nameToDetail = new Map();
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

  let b = createBottomButton();
  div.appendChild(b);
  popup.appendChild(div);
  div.className = "row";
  resizeWindow();
}

function addTextNode(text,div) {
  div.id = text;
  let t1 = "'Going to the Trash Can' list";
  let t2 = "'Going to the Cloud' list";
  if(text=="Unsaved") {
    text = t1;
  }else text = t2;
  let newtext = document.createTextNode(text);
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
    li.id = texts[i];
    li.addEventListener("click",liListener);
    rt.push(li);
  }
  appendChildren(ul,rt);
}

function liListener(evt){
  let t = evt.currentTarget;
  let pid = t.parentNode.parentNode.getAttribute("id");
  if (!flag||flag == pid){
    if(t.style.backgroundColor=="green"){
      t.style.backgroundColor = "transparent";
      selected.delete(t);
      flag = undefined;
    } else{
      t.style.backgroundColor = "green";
      selected.add(t);
      flag = pid;
      changeIcon(pid);
    }
  }
}

function changeIcon(pid){
  if (pid ==="Unsaved")
    icon.className = "fa fa-angle-double-down";
  else icon.className = "fa fa-angle-double-up";
}

function createMiddleButton(div){
  let btn = document.createElement("BUTTON");
  btn.addEventListener("click",function(){
    if (flag ==="Unsaved"||flag==="Saved"){
      let nodes = Array.from(selected);
      selected = new Set();
      let div;
      if(flag ==="Unsaved") div = document.getElementById("Saved");
      else div = document.getElementById("Unsaved");
      div = div.childNodes[1];
      removeSelf(nodes);
      appendChildren(div,nodes);
    }
    flag = undefined;
  });
  insertIcon(btn);
  div.append(btn);
}

function createBottomButton (){
  let btn = document.createElement("button");
  btn.innerHTML = "Confirm"
  btn.className = "gridsquare";
  btn.addEventListener("click",function(){
    let div = document.getElementById("Saved");
    div = div.childNodes[1];
    let nodesList = div.childNodes;
    let ls = [];
    let i;
    for (i =0; i < nodesList.length; ++i){
      ls.push(nodesList[i].id);
    }
    for (i = 0; i < ls.length; ++i){
      ls[i] = nameToDetail.get(ls[i]);
    }
    chrome.runtime.sendMessage({list: ls});
  });
  return btn;
}
function removeSelf(ls){
  for(let i  = 0; i < ls.length; ++i){
    ls[i].remove();
    ls[i].style.backgroundColor = "transparent";
  }
}

function insertIcon(div){
  icon =  document.createElement("i");
  icon.className = "fa fa-angle-double-down";
  div.append(icon);
}

function twoLists(local,remote){
  let s = new Set();
  let u = new Set();
  for(let j = 0; j < remote.length; ++j){
    s.add(remote[j].name);
    nameToDetail.set(remote[j].name,remote[j]);
  }
  for(let i =0; i < local.length; ++i){
    if(!s.has(local[i].name)){
      u.add(local[i].name);
      nameToDetail.set(local[i].name, local[i]);
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

function resizeWindow() {
  let heightOffset = document.body.offsetHeight +10;
  let widthOffset = document.body.offsetWidth+5;
  window.resizeTo(widthOffset, heightOffset);
};