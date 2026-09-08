const KEY="tlc_state_v1";
const MASTER="TheLifeCensorship 15489";
const HIGH="1754";
const ADMIN="NN55942Ghjky509#";

let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
  reports:[],
  ranks:[
    {name:"Censorship",code:"15489",canSubmit:true},
    {name:"Censorship High",code:"1754",canSubmit:true,canReview:true}
  ],
  users:[]
};
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(t){let x=document.querySelector(".toast");if(!x)return;x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",2200)}
function login(){
 document.getElementById("app").innerHTML=`<div class="center"><div class="card">
 <div class="brand">TheLife Censorship</div><div class="muted">بوابة نظام الرقابة</div>
 <div class="field"><label>الرمز السري</label><input id="master" class="code" placeholder="أدخل رمز الدخول"></div>
 <button class="btn primary" onclick="checkMaster()">دخول</button><div id="err" class="error"></div>
 </div></div>`;
}
function checkMaster(){if(document.getElementById("master").value===MASTER){sessionStorage.setItem("tlc_user","Censorship");dashboard("Censorship")}else document.getElementById("err").textContent="رمز الدخول غير صحيح."}
function highLogin(){document.getElementById("app").innerHTML=`<div class="center"><div class="card"><div class="brand">Censorship High</div><div class="muted">دخول الرقابة العليا</div><div class="field"><label>كود الدخول</label><input id="high" class="code"></div><button class="btn primary" onclick="checkHigh()">دخول</button><div id="err" class="error"></div></div></div>`}
function checkHigh(){if(document.getElementById("high").value===HIGH){sessionStorage.setItem("tlc_user","Censorship High");dashboard("Censorship High")}else document.getElementById("err").textContent="الكود غير صحيح."}
function adminLogin(){document.getElementById("app").innerHTML=`<div class="center"><div class="card"><div class="brand">Admin Panel</div><div class="muted">لوحة المسؤول</div><div class="field"><label>كود المسؤول</label><input id="admin" class="code" type="password"></div><button class="btn primary" onclick="checkAdmin()">دخول</button><div id="err" class="error"></div></div></div>`}
function checkAdmin(){if(document.getElementById("admin").value===ADMIN){sessionStorage.setItem("tlc_user","Admin");dashboard("Admin")}else document.getElementById("err").textContent="الكود غير صحيح."}
function dashboard(role){
 const canReview=role==="Censorship High"||role==="Admin";
 document.getElementById("app").innerHTML=`<div class="layout">
 <aside class="sidebar"><div class="brandSmall">TheLife Censorship</div>
 <div class="nav">
 <button class="btn ghost" onclick="page('home')">الرئيسية</button>
 <button class="btn ghost" onclick="page('submit')">نموذج الرقابة</button>
 ${canReview?'<button class="btn ghost" onclick="page(\\'reports\\')">البلاغات</button>':''}
 ${role==="Admin"?'<button class="btn ghost" onclick="page(\\'ranks\\')">إدارة الرتب</button>':''}
 </div><div class="userbox"><div class="muted">الدور الحالي</div><b>${esc(role)}</b><br><button class="btn ghost" style="margin-top:10px;width:100%" onclick="logout()">تسجيل خروج</button></div>
 </aside><main class="main"><div id="content"></div><div class="toast"></div></main></div>`;
 page("home");
}
function page(p){
 let c=document.getElementById("content"), role=sessionStorage.getItem("tlc_user");
 if(p==="home"){c.innerHTML=`<div class="top"><div><h1>لوحة التحكم</h1><div class="muted">مرحباً بك في نظام الرقابة.</div></div></div>
 <div class="grid"><div class="stat">إجمالي البلاغات<b>${state.reports.length}</b></div><div class="stat">قيد المراجعة<b>${state.reports.filter(x=>x.status==="pending").length}</b></div><div class="stat">المقبولة<b>${state.reports.filter(x=>x.status==="accepted").length}</b></div></div>
 <div class="report"><h3>صلاحياتك</h3><p class="muted">${role==="Admin"?"إدارة الرتب والبلاغات والنظام بالكامل.":role==="Censorship High"?"استقبال البلاغات واتخاذ قرار القبول أو الرفض.":"إرسال بلاغات الرقابة."}</p></div>`}
 if(p==="submit"){c.innerHTML=`<div class="top"><div><h1>نموذج الرقابة</h1><div class="muted">أرسل بلاغاً ليتم مراجعته من الرقابة العليا.</div></div></div>
 <div class="card" style="width:min(720px,100%)"><div class="field"><label>كودك الرقابي</label><input id="r_code" placeholder="مثال: C-1024"></div>
 <div class="field"><label>يوزر المخالف دسكورد</label><input id="discord" placeholder="@username"></div>
 <div class="field"><label>يوزر المخالف روبلوكس</label><input id="roblox"></div>
 <div class="field"><label>سبب المخالفة</label><textarea id="reason"></textarea></div>
 <button class="btn primary" onclick="submitReport()">إرسال البلاغ</button></div>`}
 if(p==="reports"){let rows=state.reports.map(r=>`<div class="report"><div class="reportHead"><div><b>#${r.id}</b> — ${esc(r.roblox||"بدون اسم")}</div><span class="badge ${r.status}">${r.status==="pending"?"قيد المراجعة":r.status==="accepted"?"مقبول":"مرفوض"}</span></div><p>دسكورد: ${esc(r.discord)}</p><p>كود الرقابي: <span class="code">${esc(r.code)}</span></p><p>السبب: ${esc(r.reason)}</p><div class="muted">${r.date}</div>${r.status==="pending"?`<div class="actions"><button class="btn success" onclick="decide(${r.id},'accepted')">قبول</button><button class="btn danger" onclick="decide(${r.id},'rejected')">رفض</button></div>`:""}</div>`).join("")||'<div class="report">لا توجد بلاغات.</div>';c.innerHTML=`<div class="top"><div><h1>البلاغات</h1><div class="muted">مراجعة جميع البلاغات.</div></div></div>${rows}`}
 if(p==="ranks"){c.innerHTML=`<div class="top"><div><h1>إدارة الرتب</h1><div class="muted">تعديل الرتب وأكوادها وصلاحياتها.</div></div></div><div class="card" style="width:min(850px,100%)">${state.ranks.map((r,i)=>`<div class="report"><div class="field"><label>اسم الرتبة</label><input id="rn${i}" value="${esc(r.name)}"></div><div class="field"><label>رمز الرتبة</label><input id="rc${i}" class="code" value="${esc(r.code)}"></div><label><input type="checkbox" id="rs${i}" ${r.canSubmit?"checked":""}> السماح بإرسال البلاغات</label><label style="margin-right:15px"><input type="checkbox" id="rr${i}" ${r.canReview?"checked":""}> السماح بمراجعة البلاغات</label></div>`).join("")}<button class="btn primary" onclick="saveRanks()">حفظ التعديلات</button></div>`}
}
function submitReport(){
 let code=document.getElementById("r_code").value.trim(),discord=document.getElementById("discord").value.trim(),roblox=document.getElementById("roblox").value.trim(),reason=document.getElementById("reason").value.trim();
 if(!code||!discord||!roblox||!reason){toast("أكمل جميع الحقول.");return}
 state.reports.push({id:Date.now(),code,discord,roblox,reason,status:"pending",date:new Date().toLocaleString("ar-SA")});save();toast("تم إرسال البلاغ للمراجعة.");setTimeout(()=>page("home"),500)
}
function decide(id,status){let r=state.reports.find(x=>x.id===id);if(r){r.status=status;save();page("reports");toast(status==="accepted"?"تم قبول البلاغ.":"تم رفض البلاغ.")}}
function saveRanks(){state.ranks.forEach((r,i)=>{r.name=document.getElementById("rn"+i).value;r.code=document.getElementById("rc"+i).value;r.canSubmit=document.getElementById("rs"+i).checked;r.canReview=document.getElementById("rr"+i).checked});save();toast("تم حفظ الرتب.")}
function logout(){sessionStorage.removeItem("tlc_user");login()}
function start(){let r=sessionStorage.getItem("tlc_user");if(r)dashboard(r);else login()}
start();
