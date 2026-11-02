(function(){
var H=Hub,L=H.L,q=function(i){return document.getElementById(i)},INT=[0,1,2,4,8,16];
var V={q:'',lang:'',lvl:'',mode:'list',edit:null,queue:[],show:false};
var F=[['word','Word','الكلمة'],['ipa','IPA','IPA'],['tr','Arabic transliteration','النطق بالعربي'],['ar','Arabic meaning','المعنى بالعربي'],['def','Definition','التعريف'],['ex','Example sentence','جملة مثال'],['syn','Synonyms','مرادفات'],['ant','Antonyms','أضداد'],['fam','Word family','عائلة الكلمة'],['pos','Part of speech','نوع الكلمة'],['cat','Category','التصنيف']];
var LV=['A1','A2','B1','B2','C1','C2'];
function today(){return H.ds(new Date())}
function plus(n){var d=new Date();d.setDate(d.getDate()+n);return H.ds(d)}
function acc(l){return l==='de'?'de':l==='ar'?'ar':'gb'}
function due(){return H.S.vocab.filter(function(w){return w.due<=today()})}
function get(id){return H.S.vocab.filter(function(w){return w.id==id})[0]}
function form(){var w=V.edit?get(V.edit):{lang:'en',level:'',fav:false,hard:false};
 return '<details'+(V.edit?' open':'')+'><summary>'+(V.edit?L('Edit word','تعديل كلمة'):L('Add a word','إضافة كلمة'))+'</summary><div class="fg">'+
 F.map(function(f){return '<label>'+f[H.S.lang==='ar'?2:1]+'<input id="f_'+f[0]+'" value="'+H.esc(w[f[0]]||'')+'"></label>'}).join('')+
 '<label>'+L('Language','اللغة')+'<select id="f_lang">'+['en','de','ar'].map(function(l){return '<option value="'+l+'"'+(w.lang===l?' selected':'')+'>'+l.toUpperCase()+'</option>'}).join('')+'</select></label>'+
 '<label>CEFR<select id="f_level"><option value="">—</option>'+LV.map(function(l){return '<option'+(w.level===l?' selected':'')+'>'+l+'</option>'}).join('')+'</select></label>'+
 '<label><input type="checkbox" id="f_fav"'+(w.fav?' checked':'')+'> '+L('Favourite','مفضلة')+'</label><label><input type="checkbox" id="f_hard"'+(w.hard?' checked':'')+'> '+L('Difficult','صعبة')+'</label></div><br>'+
 '<div class="row"><button id="vs">'+L('Save word','حفظ الكلمة')+'</button>'+(V.edit?'<button class="ghost" id="vc">'+L('Cancel','إلغاء')+'</button>':'')+'</div></details>'}
H.mods.vocab={html:function(){
 var S=H.S;
 if(V.mode==='cards'){var w=V.queue[0];
  if(!w)return '<h1>'+L('Flashcards','البطاقات')+'</h1><div class="card flash"><h2>'+L('All done for now','انتهت المراجعة الآن')+'</h2><button id="back">'+L('Back to words','العودة للمفردات')+'</button></div>';
  return '<h1>'+L('Flashcards','البطاقات')+' ('+V.queue.length+')</h1><div class="card flash"><div class="w">'+H.esc(w.word)+'</div><div class="msg">'+H.esc(w.ipa||'')+'</div><button class="ghost" id="say">🔊</button><div class="msg" id="vm"></div>'+
  (V.show?'<p><b>'+H.esc(w.ar)+'</b></p><p>'+H.esc(w.def)+'</p><p><i>'+H.esc(w.ex)+'</i></p><div class="row" style="justify-content:center"><button class="danger" id="again">'+L('Again','مرة أخرى')+'</button><button id="good">'+L('Got it','عرفتها')+'</button></div>':'<button id="rev">'+L('Show answer','أظهر الإجابة')+'</button>')+'<br><br><button class="ghost small" id="back">'+L('Stop','إنهاء')+'</button></div>'}
 var list=S.vocab.filter(function(w){var t=(w.word+' '+w.ar+' '+w.def).toLowerCase();return(!V.q||t.indexOf(V.q.toLowerCase())>-1)&&(!V.lang||w.lang===V.lang)&&(!V.lvl||w.level===V.lvl)});
 return '<h1>'+H.t('vocab')+'</h1><div class="card"><div class="row"><span>'+S.vocab.length+' '+L('words','كلمة')+' · '+due().length+' '+L('due for review','للمراجعة')+'</span><button id="rv"'+(due().length?'':' disabled')+'>'+L('Review','ابدأ المراجعة')+'</button></div><br>'+form()+'</div><br>'+
 '<div class="card"><div class="row"><input id="sq" placeholder="'+L('Search','بحث')+'" value="'+H.esc(V.q)+'"><select id="fl"><option value="">'+L('All languages','كل اللغات')+'</option>'+['en','de','ar'].map(function(l){return '<option'+(V.lang===l?' selected':'')+'>'+l+'</option>'}).join('')+'</select><select id="fv"><option value="">CEFR</option>'+LV.map(function(l){return '<option'+(V.lvl===l?' selected':'')+'>'+l+'</option>'}).join('')+'</select></div>'+
 (list.length?list.map(function(w){return '<div class="item"><span><b>'+H.esc(w.word)+'</b> <span class="chip">'+w.lang+(w.level?' '+w.level:'')+'</span>'+(w.hard?' ⚠':'')+'<br><span class="msg">'+H.esc(w.ar)+'</span></span><span class="row"><button class="ghost small" data-p="'+w.id+'">🔊</button><button class="ghost small" data-f="'+w.id+'">'+(w.fav?'★':'☆')+'</button><button class="ghost small" data-e="'+w.id+'">'+L('Edit','تعديل')+'</button><button class="danger small" data-d="'+w.id+'">'+L('Delete','حذف')+'</button></span></div>'}).join(''):'<p class="msg">'+L('No words yet. Add one above or save from the translator.','لا كلمات بعد. أضيفي كلمة أو احفظيها من المترجم.')+'</p>')+'<div class="msg" id="vm"></div></div>'},
 bind:function(){
 var S=H.S;function on(i,f){var e=q(i);if(e)e.onclick=f}
 on('back',function(){V.mode='list';H.render()});
 on('rev',function(){V.show=true;H.render()});
 on('say',function(){var w=V.queue[0];q('vm').textContent=H.speak(w.word,acc(w.lang))});
 on('again',function(){var w=V.queue.shift();w.box=0;w.due=today();V.queue.push(w);V.show=false;H.save();H.render()});
 on('good',function(){var w=V.queue.shift();w.box=Math.min(5,w.box+1);w.due=plus(INT[w.box]);V.show=false;H.save();H.render()});
 on('rv',function(){V.queue=due();V.mode='cards';V.show=false;H.render()});
 on('vc',function(){V.edit=null;H.render()});
 on('vs',function(){var o={};F.forEach(function(f){o[f[0]]=q('f_'+f[0]).value.trim()});if(!o.word){H.toast(L('Enter a word','اكتبي الكلمة'));return}
  o.lang=q('f_lang').value;o.level=q('f_level').value;o.fav=q('f_fav').checked;o.hard=q('f_hard').checked;
  if(V.edit)Object.assign(get(V.edit),o);else S.vocab.push(Object.assign(o,{id:Date.now(),box:0,due:today()}));
  V.edit=null;H.save();H.render();H.toast(L('Saved','تم الحفظ'))});
 var sq=q('sq');if(sq){sq.oninput=function(){V.q=sq.value;var p=sq.selectionStart;H.render();var n=q('sq');n.focus();n.setSelectionRange(p,p)};q('fl').onchange=function(){V.lang=this.value;H.render()};q('fv').onchange=function(){V.lvl=this.value;H.render()}}
 [].forEach.call(document.querySelectorAll('[data-p]'),function(b){b.onclick=function(){var w=get(b.dataset.p);q('vm').textContent=H.speak(w.word,acc(w.lang))}});
 [].forEach.call(document.querySelectorAll('[data-f]'),function(b){b.onclick=function(){var w=get(b.dataset.f);w.fav=!w.fav;H.save();H.render()}});
 [].forEach.call(document.querySelectorAll('[data-e]'),function(b){b.onclick=function(){V.edit=b.dataset.e;H.render();scrollTo(0,0)}});
 [].forEach.call(document.querySelectorAll('[data-d]'),function(b){b.onclick=function(){if(confirm(L('Delete this word?','حذف هذه الكلمة؟'))){S.vocab=S.vocab.filter(function(w){return w.id!=b.dataset.d});H.save();H.render()}}})}};
})();
