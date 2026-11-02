(function(){
var H=Hub,L=H.L,q=function(i){return document.getElementById(i)};
var E,Es={},cur='english';function sel(k){cur=k;E=Es[k]=Es[k]||{mode:'list',lid:null,res:null}}sel('english');
function norm(s){return String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?؟]/g,'').replace(/\s+/g,' ').trim()}
function conv(a){return a[0]==='mc'?{t:'mc',q:a[1],o:a[2],a:a[3],e:a[4]}:a[0]==='tf'?{t:'tf',q:a[1],a:a[2],e:a[3]}:{t:'tx',q:a[1],a:a[2],e:a[3]}}
function flat(){var f=[];COURSE[cur].levels.forEach(function(l){l.units.forEach(function(u){u.lessons.forEach(function(x){f.push(x)})})});return f}
function open(i,f){return i===0||H.S.lessonsDone.indexOf(f[i-1].id)>-1}
function qhtml(q,i){var n='q'+i,h='<div class="card"><b>'+(i+1)+'. '+H.esc(q.q)+'</b><br>';
 if(q.t==='mc')h+=q.o.map(function(o,k){return '<label><input type="radio" name="'+n+'" value="'+k+'"> '+H.esc(o)+'</label><br>'}).join('');
 else if(q.t==='tf')h+=['true','false'].map(function(v){return '<label><input type="radio" name="'+n+'" value="'+v+'"> '+(v==='true'?L('True','صح'):L('False','خطأ'))+'</label><br>'}).join('');
 else h+='<input name="'+n+'" autocomplete="off" style="width:100%">';return h+'</div><br>'}
function grade(qs){return qs.map(function(x,i){var el=document.getElementsByName('q'+i),v='',sel='',ans,ok=false;
 if(x.t==='tx'){v=el[0].value;sel=v;ans=x.a[0];ok=x.a.some(function(a){return norm(a)===norm(v)})}
 else{[].forEach.call(el,function(r){if(r.checked)v=r.value});
  if(x.t==='mc'){sel=v===''?'':x.o[v];ans=x.o[x.a];ok=v!==''&&+v===x.a}else{sel=v;ans=String(x.a);ok=v!==''&&(v==='true')===x.a}}
 return {q:x,ok:ok,sel:sel,ans:ans}})}
function show(rs){return rs.map(function(r,i){return '<div class="card"><b>'+(r.ok?'✓ ':'✗ ')+(i+1)+'. '+H.esc(r.q.q)+'</b><br>'+(r.ok?'':'<span class="msg">'+L('Your answer: ','إجابتك: ')+H.esc(r.sel||'—')+'</span><br>')+'<span class="msg">'+L('Correct answer: ','الإجابة الصحيحة: ')+H.esc(r.ans)+'</span><br>'+H.esc(r.q.e||'')+'</div><br>'}).join('')}
function record(rs,name){var S=H.S;rs.forEach(function(r){if(!r.ok&&!S.mistakes.some(function(m){return m.q.q===r.q.q&&m.lesson===name}))S.mistakes.push({id:Date.now()+Math.random(),q:r.q,sel:r.sel,lesson:name,d:H.ds(new Date())})})}
function lesson(x){var S=H.S,tries=S.attempts.filter(function(a){return a.lesson===x.id});
 return '<button class="ghost small" id="bk">‹ '+L('Back','رجوع')+'</button><h1>'+H.esc(x.title)+'</h1><div class="card"><h2>'+L('Objectives','الأهداف')+'</h2><ul>'+x.obj.map(function(o){return '<li>'+o+'</li>'}).join('')+'</ul></div><br>'+
 '<div class="card">'+x.body+'</div><br><div class="card"><h2>'+L('Examples','أمثلة')+'</h2><ul>'+x.ex.map(function(o){return '<li>'+o+'</li>'}).join('')+'</ul></div><br>'+
 '<div class="card"><h2>'+L('Common mistakes','أخطاء شائعة')+'</h2>'+x.mist.map(function(m){return '<p>✗ <s>'+m[0]+'</s><br>✓ <b>'+m[1]+'</b><br><span class="msg">'+m[2]+'</span></p>'}).join('')+'</div><br>'+
 '<div class="card"><h2>'+L('Note in Arabic','ملاحظة بالعربية')+'</h2><p dir="rtl">'+x.ar+'</p></div><br>'+
 '<div class="card"><h2>'+L('Practice','تدريب')+'</h2>'+x.prac.map(function(p){return '<details><summary>'+p[0]+'</summary><p><b>'+p[1]+'</b></p></details>'}).join('')+'</div><br>'+
 '<div class="card"><h2>'+L('In real life','في الحياة الواقعية')+'</h2><p>'+x.real+'</p></div><br><div class="card"><h2>'+L('Summary','الخلاصة')+'</h2><p>'+x.sum+'</p></div><br>'+
 '<div class="card"><h2>'+L('Key vocabulary','مفردات أساسية')+'</h2>'+x.vocab.map(function(v){return '<div class="item"><span>'+v[0]+' — '+v[1]+'</span><button class="ghost small" data-sv="'+v[0]+'|'+v[1]+'">+ '+L('Save','حفظ')+'</button><button class="ghost small" data-sp="'+v[0]+'">🔊</button></div>'}).join('')+'<div class="msg" id="vm"></div></div><br>'+
 (tries.length?'<div class="card"><h2>'+L('Attempts','المحاولات')+'</h2>'+tries.map(function(a){return '<div>'+a.d+' — '+a.pct+'% '+(a.pct>=80?'✓':'')+'</div>'}).join('')+'</div><br>':'')+
 '<button id="ex">'+(tries.length?L('Retake exam','أعيدي الاختبار'):L('Start exam','ابدئي الاختبار'))+'</button>'}
function quizPage(title,qs,btn,back){return '<button class="ghost small" id="bk">‹ '+L('Back','رجوع')+'</button><h1>'+H.esc(title)+'</h1><p class="msg">'+L('Pass mark: 80%','درجة النجاح: 80%')+'</p>'+qs.map(qhtml).join('')+'<button id="'+btn+'">'+L('Submit answers','سلّمي الإجابات')+'</button>'}
var base={html:function(){var f=flat(),S=H.S;
 if(E.mode==='lesson')return lesson(f.filter(function(x){return x.id===E.lid})[0]);
 if(E.mode==='exam'){var x=f.filter(function(x){return x.id===E.lid})[0];return quizPage(x.title+' — '+L('Exam','اختبار'),x.exam.map(conv),'sub')}
 if(E.mode==='result'){var x=f.filter(function(x){return x.id===E.lid})[0],r=E.res,n=r.filter(function(a){return a.ok}).length,p=Math.round(n/r.length*100);
  return '<h1>'+p+'% ('+n+'/'+r.length+')</h1><div class="card"><b>'+(p>=80?L('Passed. The next lesson is unlocked.','نجحتِ. تم فتح الدرس التالي.'):L('Not passed yet. Review the lesson and try again.','لم تنجحي بعد. راجعي الدرس وأعيدي المحاولة.'))+'</b></div><br>'+show(r)+'<div class="row"><button id="again">'+L('Retake','أعيدي')+'</button><button class="ghost" id="bk">'+L('Back to lesson','العودة للدرس')+'</button></div>'}
 var h='<h1>'+H.t(cur)+'</h1><p class="msg">A1 · '+f.length+' '+L('lessons so far. More are added in later updates.','دروس حالياً، وتُضاف دروس أخرى لاحقاً.')+'</p>';
 COURSE[cur].levels.forEach(function(l){l.units.forEach(function(u){h+='<div class="card"><h2>'+l.id+' — '+H.esc(u.title)+'</h2>'+u.lessons.map(function(x){var i=f.indexOf(x),o=open(i,f),d=S.lessonsDone.indexOf(x.id)>-1;
  return '<div class="item"><span>'+(d?'✓ ':o?'':'🔒 ')+H.esc(x.title)+'</span><button class="'+(o?'':'ghost ')+'small" data-l="'+x.id+'"'+(o?'':' disabled')+'>'+(o?L('Open','فتح'):L('Locked','مقفل'))+'</button></div>'}).join('')+'</div><br>'})});return h},
 bind:function(){var f=flat(),S=H.S;function on(i,fn){var e=q(i);if(e)e.onclick=fn}
 [].forEach.call(document.querySelectorAll('[data-l]'),function(b){b.onclick=function(){E.mode='lesson';E.lid=b.dataset.l;H.render();scrollTo(0,0)}});
 [].forEach.call(document.querySelectorAll('[data-sp]'),function(b){b.onclick=function(){q('vm').textContent=H.speak(b.dataset.sp,cur==='german'?'de':'gb')}});
 [].forEach.call(document.querySelectorAll('[data-sv]'),function(b){b.onclick=function(){var p=b.dataset.sv.split('|');if(!S.vocab.some(function(w){return w.word===p[0]}))S.vocab.push({id:Date.now(),word:p[0],lang:cur==='german'?'de':'en',ar:p[1],ipa:'',tr:'',def:'',ex:'',syn:'',ant:'',fam:'',pos:'',level:'A1',cat:'',fav:false,hard:false,box:0,due:H.ds(new Date())});H.save();H.toast(L('Saved','تم الحفظ'))}});
 on('bk',function(){E.mode=E.mode==='result'?'lesson':E.mode==='exam'?'lesson':'list';H.render();scrollTo(0,0)});
 on('ex',function(){E.mode='exam';H.render();scrollTo(0,0)});on('again',function(){E.mode='exam';H.render();scrollTo(0,0)});
 on('sub',function(){var x=f.filter(function(x){return x.id===E.lid})[0],rs=grade(x.exam.map(conv)),n=rs.filter(function(a){return a.ok}).length,p=Math.round(n/rs.length*100);
  S.attempts.push({lesson:x.id,pct:p,d:H.ds(new Date())});S.exams.push({id:x.id,score:p,d:H.ds(new Date())});
  if(p>=80&&S.lessonsDone.indexOf(x.id)<0)S.lessonsDone.push(x.id);record(rs,x.title);H.save();E.res=rs;E.mode='result';H.render();scrollTo(0,0)})}};
H.mods.english={html:function(){sel('english');return base.html()},bind:function(){sel('english');base.bind()}};
H.mods.german={html:function(){sel('german');return base.html()},bind:function(){sel('german');base.bind()}};
var M={on:false};
H.mods.mistakes={html:function(){var S=H.S;
 if(M.on)return quizPage(L('Practise your mistakes','تدرّبي على أخطائك'),S.mistakes.map(function(m){return m.q}),'msub');
 if(M.res)return '<h1>'+M.res.filter(function(r){return r.ok}).length+' / '+M.res.length+'</h1>'+show(M.res)+'<button id="mdone">'+L('Done','تم')+'</button>';
 return '<h1>'+H.t('mistakes')+'</h1>'+(S.mistakes.length?'<button id="mp">'+L('Practise all','تدرّبي على الكل')+' ('+S.mistakes.length+')</button><br><br>'+S.mistakes.map(function(m){return '<div class="card"><b>'+H.esc(m.q.q)+'</b><br><span class="msg">'+L('You answered: ','أجبتِ: ')+H.esc(m.sel||'—')+' · '+m.d+' · '+H.esc(m.lesson)+'</span><br>'+L('Correct: ','الصحيح: ')+H.esc(m.q.t==='mc'?m.q.o[m.q.a]:m.q.t==='tx'?m.q.a[0]:String(m.q.a))+'<br>'+H.esc(m.q.e||'')+'</div><br>'}).join(''):'<div class="card soon"><p>'+L('No mistakes yet. Wrong exam answers are saved here automatically.','لا أخطاء بعد. تُحفظ الإجابات الخاطئة هنا تلقائياً.')+'</p></div>')},
 bind:function(){var S=H.S;function on(i,fn){var e=q(i);if(e)e.onclick=fn}
 on('mp',function(){M.on=true;M.res=null;H.render()});on('bk',function(){M.on=false;H.render()});on('mdone',function(){M.res=null;H.render()});
 on('msub',function(){var rs=grade(S.mistakes.map(function(m){return m.q}));S.mistakes=S.mistakes.filter(function(m,i){return !rs[i].ok});H.save();M.on=false;M.res=rs;H.render()})}};
H.quiz={qhtml:qhtml,grade:grade,show:show,conv:conv,norm:norm};
})();
