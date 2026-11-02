(function(){
'use strict';
var KEY='shadnHub.v1';
var T={en:{tagline:'Learn Better. Grow Further.',dash:'Dashboard',english:'British English',german:'German',alsun:'Alsun',settings:'Settings',
 hi:'Welcome back, ',sub:'Everything here is calculated from the study time you log.',
 prog:'Overall progress',lessons:'Completed lessons',exams:'Passed exams',avg:'Average exam score',hours:'Total study hours',streak:'Study streak (days)',
 today:'Today',goalD:'Daily goal (min)',goalW:'This week (min)',week:'Weekly activity (minutes)',log:'Log study time',subject:'Subject',minutes:'Minutes',add:'Save session',
 none:'No exams yet',nolesson:'Lessons arrive in the next stage. No lessons yet.',recent:'Recent sessions',norecent:'No sessions logged yet. Log your first one above.',
 soonT:'Coming in the next stage',soonB:'This section has no lessons yet. The lesson and exam engine is built next.',
 profile:'Profile',name:'Name',save:'Save',backup:'Backup and restore',backupNote:'Your data is stored only in this browser. Export a backup regularly, especially before clearing browser data or changing device.',
 exp:'Export backup (JSON)',imp:'Import backup',reset:'Reset all progress',confirm:'Delete all saved progress? This cannot be undone.',saved:'Saved',imported:'Backup imported',bad:'That file is not a valid backup.',days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
 en:'British English',de:'German',al:'Alsun'},
ar:{tagline:'تعلّمي أفضل. انطلقي أبعد.',dash:'الرئيسية',english:'الإنجليزية البريطانية',german:'الألمانية',alsun:'ألسن',settings:'الإعدادات',
 hi:'أهلاً بعودتك، ',sub:'كل الأرقام هنا محسوبة من وقت المذاكرة الذي تسجّلينه.',
 prog:'التقدم الكلي',lessons:'الدروس المكتملة',exams:'الاختبارات المجتازة',avg:'متوسط الدرجات',hours:'إجمالي ساعات المذاكرة',streak:'أيام متتالية',
 today:'اليوم',goalD:'الهدف اليومي (دقيقة)',goalW:'هذا الأسبوع (دقيقة)',week:'النشاط الأسبوعي (دقائق)',log:'سجّلي وقت المذاكرة',subject:'المادة',minutes:'الدقائق',add:'حفظ الجلسة',
 none:'لا اختبارات بعد',nolesson:'الدروس تأتي في المرحلة التالية. لا توجد دروس بعد.',recent:'آخر الجلسات',norecent:'لم تُسجَّل جلسات بعد. سجّلي أول جلسة من الأعلى.',
 soonT:'قريباً في المرحلة التالية',soonB:'لا توجد دروس في هذا القسم بعد. يُبنى محرك الدروس والاختبارات تالياً.',
 profile:'الملف الشخصي',name:'الاسم',save:'حفظ',backup:'النسخ الاحتياطي والاستعادة',backupNote:'بياناتك محفوظة في هذا المتصفح فقط. صدّري نسخة احتياطية بانتظام، خاصة قبل مسح بيانات المتصفح أو تغيير الجهاز.',
 exp:'تصدير نسخة احتياطية (JSON)',imp:'استيراد نسخة احتياطية',reset:'مسح كل التقدم',confirm:'هل تريدين حذف كل التقدم المحفوظ؟ لا يمكن التراجع.',saved:'تم الحفظ',imported:'تم استيراد النسخة',bad:'هذا الملف ليس نسخة احتياطية صالحة.',days:['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'],
 en:'الإنجليزية البريطانية',de:'الألمانية',al:'ألسن'}};
Object.assign(T.en,{translator:'Translator',pron:'Pronunciation',tprac:'Translation practice',library:'Library',resources:'Courses',progress:'Progress',mistakes:'Mistakes',vocab:'Vocabulary',planner:'Planner'});Object.assign(T.ar,{translator:'المترجم',pron:'النطق',tprac:'تدريب الترجمة',library:'المكتبة',resources:'الكورسات',progress:'التقدم',mistakes:'دفتر الأخطاء',vocab:'المفردات',planner:'المخطط'});
var DEF={v:1,mistakes:[],attempts:[],vocab:[],tasks:[],history:[],name:'Shadn',lang:'en',theme:'light',dailyGoal:30,sessions:[],lessonsDone:[],exams:[]};
var S=load();
function load(){try{var r=JSON.parse(localStorage.getItem(KEY));return Object.assign({},DEF,r||{})}catch(e){return Object.assign({},DEF)}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Storage unavailable')}}
function t(k){return (T[S.lang]||T.en)[k]||T.en[k]||k}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ds(d){var m=d.getMonth()+1,x=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(x<10?'0':'')+x}
function mins(day){return S.sessions.reduce(function(a,s){return a+(s.d===day?s.min:0)},0)}
function streak(){var d=new Date(),n=0;if(!mins(ds(d)))d.setDate(d.getDate()-1);while(mins(ds(d))>0){n++;d.setDate(d.getDate()-1)}return n}
function toast(m){var e=document.getElementById('toast');e.textContent=m;e.className='show';setTimeout(function(){e.className=''},2000)}
function apply(){document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';document.documentElement.dataset.theme=S.theme;
 document.getElementById('langBtn').textContent=S.lang==='ar'?'English':'عربي';
 document.querySelector('[data-i=tagline]').textContent=t('tagline');
 document.getElementById('brandName').textContent=S.lang==='ar'?'منصة '+S.name+' التعليمية':S.name+'’s Learning Hub'}
window.Hub={get S(){return S},save:save,t:t,esc:esc,ds:ds,toast:toast,render:render,mods:{},L:function(e,a){return S.lang==='ar'?a:e}};
var routes=['dash','translator','vocab','planner','mistakes','pron','tprac','library','resources','progress','english','german','alsun','settings'];
function route(){var h=location.hash.slice(1);return routes.indexOf(h)>-1?h:'dash'}
function nav(){var r=route();document.getElementById('nav').innerHTML=routes.map(function(k){return '<a href="#'+k+'"'+(k===r?' class="on" aria-current="page"':'')+'>'+t(k)+'</a>'}).join('')}
function dash(){
 var now=new Date(),tot=S.sessions.reduce(function(a,s){return a+s.min},0),today=mins(ds(now)),wk=0,bars='',mx=1,vals=[];
 for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var m=mins(ds(d));vals.push([d.getDay(),m]);wk+=m;mx=Math.max(mx,m)}
 bars=vals.map(function(v){return '<div><span style="height:'+Math.round(v[1]/mx*100)+'%"></span>'+t('days')[v[0]]+'</div>'}).join('');
 var avg=S.exams.length?Math.round(S.exams.reduce(function(a,e){return a+e.score},0)/S.exams.length)+'%':'—';
 var pass=S.exams.filter(function(e){return e.score>=80}).length;
 var pct=Math.min(100,Math.round(today/S.dailyGoal*100));
 var rec=S.sessions.slice(-5).reverse().map(function(s){return '<li>'+esc(s.d)+' · '+esc(s.subject)+' · '+s.min+'</li>'}).join('');
 return '<section class="hero"><h1>'+t('hi')+esc(S.name)+'</h1><p>'+t('sub')+'</p></section>'+
 '<div class="grid"><div class="card"><div class="lbl">'+t('goalD')+'</div><div class="num">'+today+' / '+S.dailyGoal+'</div><div class="bar"><i style="width:'+pct+'%"></i></div></div>'+
 '<div class="card"><div class="lbl">'+t('goalW')+'</div><div class="num">'+wk+' / '+S.dailyGoal*7+'</div><div class="bar"><i style="width:'+Math.min(100,Math.round(wk/(S.dailyGoal*7)*100))+'%"></i></div></div>'+
 '<div class="card"><div class="lbl">'+t('streak')+'</div><div class="num">'+streak()+'</div></div>'+
 '<div class="card"><div class="lbl">'+t('hours')+'</div><div class="num">'+(tot/60).toFixed(1)+'</div></div>'+
 '<div class="card"><div class="lbl">'+t('lessons')+'</div><div class="num">'+S.lessonsDone.length+'</div></div>'+
 '<div class="card"><div class="lbl">'+t('exams')+'</div><div class="num">'+pass+'</div></div>'+
 '<div class="card"><div class="lbl">'+t('avg')+'</div><div class="num">'+avg+'</div></div></div>'+
 '<div class="grid"><div class="card big"><h2>'+t('week')+'</h2><div class="chart">'+bars+'</div></div>'+
 '<div class="card big"><h2>'+t('log')+'</h2><div class="row"><label>'+t('subject')+' <select id="sub"><option>'+t('en')+'</option><option>'+t('de')+'</option><option>'+t('al')+'</option></select></label>'+
 '<label>'+t('minutes')+' <input id="min" type="number" min="1" max="600" value="25"></label><button id="addS">'+t('add')+'</button></div></div>'+
 '<div class="card big"><h2>'+t('recent')+'</h2>'+(rec?'<ul>'+rec+'</ul>':'<p class="lbl">'+t('norecent')+'</p>')+'</div></div>'+
 '<div class="grid">'+['english','german','alsun'].map(function(k){return '<a class="card" href="#'+k+'" style="text-decoration:none;color:inherit"><h2>'+t(k)+'</h2>'+prog(k)+'</a>'}).join('')+'</div>'}
function prog(k){var c=window.COURSE&&COURSE[k];if(!c)return '<div class="lbl">'+t('nolesson')+'</div><div class="bar"><i style="width:0"></i></div>';var n=0,d=0;c.levels.forEach(function(l){l.units.forEach(function(u){u.lessons.forEach(function(x){n++;if(S.lessonsDone.indexOf(x.id)>-1)d++})})});return '<div class="lbl">'+d+' / '+n+'</div><div class="bar"><i style="width:'+Math.round(d/n*100)+'%"></i></div>'}
function soon(k){return '<h1>'+t(k)+'</h1><div class="card soon"><h2>'+t('soonT')+'</h2><p>'+t('soonB')+'</p></div>'}
function settings(){return '<h1>'+t('settings')+'</h1><div class="card"><h2>'+t('profile')+'</h2><div class="row"><label>'+t('name')+' <input id="nm" value="'+esc(S.name)+'" maxlength="30"></label>'+
 '<label>'+t('goalD')+' <input id="gl" type="number" min="5" max="600" value="'+S.dailyGoal+'"></label><button id="sv">'+t('save')+'</button></div></div><br>'+
 '<div class="card"><h2>'+t('backup')+'</h2><p class="lbl">'+t('backupNote')+'</p><div class="row"><button id="ex">'+t('exp')+'</button><button class="ghost" id="im">'+t('imp')+'</button><input id="fi" type="file" accept="application/json" hidden></div></div><br>'+
 '<button class="danger" id="rs">'+t('reset')+'</button>'}
function bind(){
 var a=document.getElementById('addS');if(a)a.onclick=function(){var m=parseInt(document.getElementById('min').value,10);if(!(m>0))return;
  S.sessions.push({d:ds(new Date()),min:Math.min(m,600),subject:document.getElementById('sub').value});save();render();toast(t('saved'))};
 var sv=document.getElementById('sv');if(sv)sv.onclick=function(){S.name=document.getElementById('nm').value.trim()||'Shadn';S.dailyGoal=Math.max(5,parseInt(document.getElementById('gl').value,10)||30);save();apply();toast(t('saved'))};
 var ex=document.getElementById('ex');if(ex)ex.onclick=function(){var b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download='shadns-learning-hub-backup-'+ds(new Date())+'.json';l.click();setTimeout(function(){URL.revokeObjectURL(u)},1000)};
 var im=document.getElementById('im'),fi=document.getElementById('fi');if(im){im.onclick=function(){fi.click()};fi.onchange=function(){var f=fi.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var d=JSON.parse(r.result);if(!d||d.v!==1||!Array.isArray(d.sessions))throw 0;S=Object.assign({},DEF,d);save();apply();render();toast(t('imported'))}catch(e){toast(t('bad'))}};r.readAsText(f)}}
 var rs=document.getElementById('rs');if(rs)rs.onclick=function(){if(confirm(t('confirm'))){var l=S.lang,th=S.theme;S=Object.assign({},DEF,{lang:l,theme:th});save();apply();render()}}}
function render(){var r=route();nav();var m=Hub.mods[r];document.getElementById('view').innerHTML=m?m.html():r==='dash'?dash():r==='settings'?settings():soon(r);bind();if(m&&m.bind)m.bind()}
document.getElementById('langBtn').onclick=function(){S.lang=S.lang==='ar'?'en':'ar';save();apply();render()};
document.getElementById('themeBtn').onclick=function(){S.theme=S.theme==='dark'?'light':'dark';save();apply()};
window.addEventListener('hashchange',render);
window.addEventListener('load',function(){apply();render()});
})();
