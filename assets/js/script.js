const URL_CRUD = "https://nodejs-3260.rostiapp.cz/crud/";
const APP_ID = "b68df3c8a6501248e8176b23150f7382";
const date = new Date();
async function loadActivities() 
{
  let url = URL_CRUD + "read";
  let body = {};
  body.appId = APP_ID;  
  let opt = {};
  opt.method = "POST";
  opt.body = JSON.stringify(body);
  let response = await fetch(url, opt);
  let data = await response.json();
  let s = ``;
  for (let h of data.items) 
  {
    s += `<tr>`;
    s += `<td>${h.obj.jazyk}</td>`;
    s += `<td>${h.obj.aktivita}</td>`;
    s += `<td>${h.obj.cas} minut</td>`;
    s += `<td>${h.obj.hodnoceni}</td>`;
    s += `<td>${h.obj.den}.${h.obj.mesic}.${h.obj.rok}</td>`;
    // s += `<br>`;
    // s += `<td>Tagy</td>`;
    s += `</tr>`;
  }
  document.getElementById("activities").innerHTML = s;
}  
const areas = ["newActivityWindow","tableWindow"];
function showArea(area) 
{
  for (let a of areas) 
  {
    let disp = "none";
    if (a == area) 
    {
      disp = "block";
    }
    document.getElementById(a).style.display = disp;
  }
}
let check = 1;
function editTurner()
{
  if(check === 1)
  {
    tableWindowEdit();
    check = 2;
  }
  else
  {
    afterLoad();
    check = 1;
  }
}
async function tableWindowEdit()
{
  document.getElementById("log").innerHTML = "";
  let url = URL_CRUD + "read";
  let body = {};
  body.appId = APP_ID;  
  let opt = {};
  opt.method = "POST";
  opt.body = JSON.stringify(body);
  let response = await fetch(url, opt);
  let data = await response.json();
  let s = ``;
  document.getElementById("edit").style.display = "block";
  for (let h of data.items)
  {
    s += `<tr>`;
    s += `<td>${h.obj.jazyk}</td>`;
    s += `<td>${h.obj.aktivita}</td>`;
    s += `<td>${h.obj.cas} minut</td>`;
    s += `<td>${h.obj.hodnoceni}</td>`;
    s += `<td>${h.obj.den}.${h.obj.mesic}.${h.obj.rok}</td>`;
    s += `<td>`;
    s += `<button class="delete" onclick="deleteActivity(${h.id})"><i class="fa-solid fa-trash"></i></button>`;
    s += `<button class="edit" onclick="editActivity(${h.id})"><i class="fas fa-edit"></i></button>`;
    s += `</td>`;
    s += `</tr>`;
  }
  document.getElementById("activities").innerHTML = s;
}
function afterLoad() 
{
  showArea("tableWindow");
  loadActivities();
  document.getElementById("edit").style.display = "none";
}
function addActivity() 
{
    idEdit = undefined;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    document.getElementById("jazyk").value = "";
    document.getElementById("aktivita").value = "";
    document.getElementById("cas").value = 0;
    document.getElementById("hodnoceni").value = 1;
    document.getElementById("den").value = day;
    document.getElementById("mesic").value = month;
    document.getElementById("rok").value = year;
    document.getElementById("log").innerHTML = "";
  
    showArea("newActivityWindow");
}
async function saveActivity() 
{
  if(document.getElementById("hodnoceni").valueAsNumber <= 5)
  {
    let url = URL_CRUD + "create";
    let body = {};
    body.appId = APP_ID;
    body.obj = {};
    body.obj.jazyk = document.getElementById("jazyk").value;
    body.obj.aktivita = document.getElementById("aktivita").value;
    body.obj.cas = document.getElementById("cas").valueAsNumber;
    body.obj.hodnoceni = document.getElementById("hodnoceni").valueAsNumber;
    body.obj.den = document.getElementById("den").valueAsNumber;
    body.obj.mesic = document.getElementById("mesic").valueAsNumber;
    body.obj.rok = document.getElementById("rok").valueAsNumber;
    if(idEdit)
    {
      url = URL_CRUD + "update";
      body.id = idEdit;
    }
    let opt = {};
    opt.method = "POST";
    opt.body = JSON.stringify(body);
    let response = await fetch(url, opt);
    let data = await response.json();
    console.log(check);
    checkTurner();
  }
  else
  {
    // document.getElementById("log").innerHTML = "";
    document.getElementById("log").innerHTML = "Neplatná hodnota!";
  }
}
function checkTurner()
{
    if(check === 1)
  {
    afterLoad();
  }
  else
  {
    showArea("tableWindow");
    tableWindowEdit();
  }
}
let idEdit;
async function deleteActivity(id)
{
  let url = URL_CRUD + "delete";
  let body = {};
  body.appId = APP_ID;
  body.id = id;
  let opt = {};
  opt.method = "POST";
  opt.body = JSON.stringify(body);
  let response = await fetch(url, opt);
  let data = await response.json();
  tableWindowEdit();

}
async function editActivity(id)
{
  idEdit = id;
  let url = URL_CRUD + "read";
  let body = {};
  body.appId = APP_ID;
  body.id = id;
  let opt = {};
  opt.method = "POST";
  opt.body = JSON.stringify(body);
  let response = await fetch(url, opt);
  let data = await response.json();
  let h = data.items[0];
  document.getElementById("jazyk").value = h.obj.jazyk;
  document.getElementById("aktivita").value = h.obj.aktivita;
  document.getElementById("cas").value = h.obj.cas;
  document.getElementById("hodnoceni").value = h.obj.hodnoceni;
  document.getElementById("den").value = h.obj.den;
  document.getElementById("mesic").value = h.obj.mesic;
  document.getElementById("rok").value = h.obj.rok;
  showArea("newActivityWindow");
}