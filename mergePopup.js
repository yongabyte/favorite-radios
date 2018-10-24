'use strict';

let mergeNow = document.getElementById('mergeNow');
let popup = document.getElementById("popup");
let table;
mergeNow.onclick = function(){
  chrome.runtime.sendMessage({askForLists:true},function(lists){
    createTable(lists);
  })
}

function createTable(lists){
  cleanPopUp();
  table  = document.createElement('table');
  insertTextRow(["station","local","remote"]);
  let map = itemsMap(lists.local,lists.remote);
  map.forEach(insertRow);
  popup.appendChild(table);
}

function insertTextRow(texts){
  let row = table.insertRow();
  for(let i = 0; i < texts.length; ++i){
    let cell = row.insertCell();
    cell.innerHTML=texts[i];
  }
}

function insertRow(val, key, map) {
    let row = table.insertRow();
    let cell = row.insertCell();
    cell.innerHTML= key;
    if(val===2){
      insertCheck(row);
      insertCheck(row);
    }else if (val==='l'){
      insertCheck(row);
      insertX(row);
    }
  }

function insertIcon(row,className){
  let cell = row.insertCell();
  let icon =  document.createElement("i");
  icon.className = className;
  cell.append(icon);
}

function insertCheck(row){
  insertIcon(row,"fa fa-check");
}

function insertX(row){ 
  insertIcon(row,"fa fa-remove");
}

function itemsMap(local,remote){
  let map = new Map();
  for(let i =0; i < local.length; ++i){
    map.set(local[i].name,'l');
  }
  for(let j = 0; j < remote.length; ++j){
    if(map.get(remote[j].name)) map.set(remote[j].name,2);
    else map.set(remote[j].name,'r');
  }
  return map;
}

function cleanPopUp(){
  while(popup.firstChild){
    popup.removeChild(popup.firstChild);
  }
}
