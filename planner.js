(function(){
var H=Hub,L=H.L,q=function(i){return document.getElementById(i)};
var P={off:0,edit:null},PR={high:[ 'High','عالية'],med:['Medium','متوسطة'],low:['Low','منخفضة']};
function day(n){var d=new Date();d.setDate(d.getDate()+n);return d}
function get(id){return H.S.tasks.filter(function(t){return t.id==id})[0]}
function subj(){return[H.t('en'),H.t('de'),H.t('al')]}
H.mods.planner={html:function(){
 var S=H.S,t0=get(P.edit)||{title:'',subject:H.t('en'),date:H.ds(new Date()),time:'18:00',dur:30,pri:'med'};
 var start=-((new Date().getDay()+1)%7)+P.off*7,out='',total=0,done=0;
 for(var i=0;i<7;i++){var d=day(start+i),k=H.ds(d),ts=S.tasks.filter(function(t){return t.date===k}).sort(function(a,b){return a.time<b.time?-1:1});
  out+='<div class="card"><b>'+d.toLocaleDateString(S.lang==='ar'?'ar-EG':'en-GB',{weekday:'long',day:'numeric',month:'short'})+'</b>'+(k===H.ds(new Date())?' <span class="chip">'+L('Today','اليوم')+'</span>':'')+
  (ts.length?ts.map(function(t){total++;if(t.done)done++;return '<div class="item'+(t.done?' done':'')+'"><span><input type="checkbox" data-c="'+t.id+'"'+(t.done?' checked':'')+'> <b>'+H.esc(t.title)+'</b><br><span class="msg">'+t.time+' · '+t.dur+' '+L('min','د')+' · '+H.esc(t.subject)+' · '+PR[t.pri][S.lang==='ar'?1:0]+'</span></span><span class="row"><button class="ghost small" data-e="'+t.id+'">'+L('Edit','تعديل')+'</button><button class="danger small" data-d="'+t.id+'">'+L('Delete','حذف')+'</button></span></div>'}).join(''):'<p class="msg">'+L('No tasks.','لا مهام.')+'</p>')+'</div><br>'}
 return '<h1>'+H.t('planner')+'</h1><div class="card"><h2>'+(P.edit?L('Edit task','تعديل مهمة'):L('Add a task','إضافة مهمة'))+'</h2><div class="fg"><label>'+L('Task','المهمة')+'<input id="pt" value="'+H.esc(t0.title)+'" maxlength="80"></label>'+
 '<label>'+L('Subject','المادة')+'<select id="ps">'+subj().map(function(s){return '<option'+(s===t0.subject?' selected':'')+'>'+s+'</option>'}).join('')+'</select></label>'+
 '<label>'+L('Date','التاريخ')+'<input id="pd" type="date" value="'+t0.date+'"></label><label>'+L('Time','الوقت')+'<input id="pm" type="time" value="'+t0.time+'"></label>'+
 '<label>'+L('Minutes','الدقائق')+'<input id="pu" type="number" min="5" max="600" value="'+t0.dur+'"></label><label>'+L('Priority','الأولوية')+'<select id="pp">'+Object.keys(PR).map(function(k){return '<option value="'+k+'"'+(k===t0.pri?' selected':'')+'>'+PR[k][S.lang==='ar'?1:0]+'</option>'}).join('')+'</select></label></div><br>'+
 '<div class="row"><button id="ps2">'+L('Save task','حفظ المهمة')+'</button>'+(P.edit?'<button class="ghost" id="pc">'+L('Cancel','إلغاء')+'</button>':'')+'</div></div><br>'+
 '<div class="row"><button class="ghost" id="pv">‹</button><span class="msg">'+done+' / '+total+' '+L('tasks done this week','مهام منجزة هذا الأسبوع')+'</span><button class="ghost" id="nx">›</button></div><br>'+out},
 bind:function(){
 var S=H.S;function on(i,f){var e=q(i);if(e)e.onclick=f}
 on('pv',function(){P.off--;H.render()});on('nx',function(){P.off++;H.render()});on('pc',function(){P.edit=null;H.render()});
 on('ps2',function(){var o={title:q('pt').value.trim(),subject:q('ps').value,date:q('pd').value,time:q('pm').value||'00:00',dur:Math.max(5,parseInt(q('pu').value,10)||30),pri:q('pp').value};
  if(!o.title||!o.date){H.toast(L('Enter a task and a date','اكتبي المهمة والتاريخ'));return}
  if(P.edit)Object.assign(get(P.edit),o);else S.tasks.push(Object.assign(o,{id:Date.now(),done:false}));P.edit=null;H.save();H.render()});
 [].forEach.call(document.querySelectorAll('[data-c]'),function(c){c.onchange=function(){var t=get(c.dataset.c);t.done=c.checked;
  S.sessions=S.sessions.filter(function(s){return s.tid!==t.id});if(t.done)S.sessions.push({d:H.ds(new Date()),min:t.dur,subject:t.subject,tid:t.id});H.save();H.render()}});
 [].forEach.call(document.querySelectorAll('[data-e]'),function(b){b.onclick=function(){P.edit=b.dataset.e;H.render();scrollTo(0,0)}});
 [].forEach.call(document.querySelectorAll('[data-d]'),function(b){b.onclick=function(){if(confirm(L('Delete this task?','حذف هذه المهمة؟'))){S.tasks=S.tasks.filter(function(t){return t.id!=b.dataset.d});S.sessions=S.sessions.filter(function(s){return s.tid!=b.dataset.d});H.save();H.render()}}})}};
})();
