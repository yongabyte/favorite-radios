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
  firstRow();
  let map = itemsMap(lists.local,lists.remote);
  map.forEach(insertRow);
  popup.appendChild(table);
}

function firstRow(){
  let row = table.insertRow();
  let cell1 = row.insertCell();
  let cell2 = row.insertCell();
  let cell3 = row.insertCell();
  cell1.innerHTML="station";
  cell2.innerHTML="local";
  cell3.innerHTML="remote";
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

function insertCheck(row){
  let cell = row.insertCell();
  let icon =  document.createElement("i"); 
  icon.className ="fa fa-check";
  cell.append(icon);
}

function insertX(row){
  let cell = row.insertCell();
  let icon =  document.createElement("i"); 
  icon.className ="fa fa-check";
  cell.append(icon);
  cell.append('<i class="fa fa-remove"></i>');
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
