(function(){
var H=Hub,L=H.L,q=function(i){return document.getElementById(i)};
var TAG={gb:'en-GB',us:'en-US',de:'de-DE',ar:'ar'};
var NAME={gb:['British','بريطاني'],us:['American','أمريكي'],de:['German','ألماني'],ar:['Arabic','عربي']};
var LN={ar:['Arabic','العربية'],en:['English','الإنجليزية'],de:['German','الألمانية']};
var st={from:'en',to:'ar',src:'',out:'',acc:'gb'};
function voices(a){if(!('speechSynthesis' in window))return[];return speechSynthesis.getVoices().filter(function(v){var l=v.lang.replace('_','-').toLowerCase();return a==='ar'?l.indexOf('ar')===0:l===TAG[a].toLowerCase()})}
H.speak=function(text,a,name){
 if(!('speechSynthesis' in window))return L('Speech is not supported in this browser.','المتصفح لا يدعم النطق.');
 if(!text)return L('Nothing to read.','لا يوجد نص.');
 var vs=voices(a);if(!vs.length)return L('No '+TAG[a]+' voice was detected on this device, so nothing was played. Install one in your device’s speech settings.','لم يتم العثور على صوت '+TAG[a]+' على هذا الجهاز فلم يُشغَّل شيء. ثبّتي الصوت من إعدادات النطق في الجهاز.');
 var v=vs.filter(function(x){return x.name===name})[0]||vs[0];speechSynthesis.cancel();
 var u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;speechSynthesis.speak(u);return L('Playing: '+v.name+' ('+v.lang+')','يعمل الآن: '+v.name+' ('+v.lang+')')};
function avail(){var e=q('avail');if(!e)return;e.textContent=['gb','us','de','ar'].map(function(a){return NAME[a][H.S.lang==='ar'?1:0]+': '+(voices(a).length?'✓':'✗')}).join('   ')}
function fillSel(a){var s=q('vsel');if(!s)return;s.innerHTML=voices(a).map(function(v){return '<option>'+H.esc(v.name)+'</option>'}).join('')}
function opts(sel){return Object.keys(LN).map(function(k){return '<option value="'+k+'"'+(k===sel?' selected':'')+'>'+LN[k][H.S.lang==='ar'?1:0]+'</option>'}).join('')}
function vb(id){return '<div class="row">'+['gb','us','de','ar'].map(function(a){return '<button class="ghost small" data-a="'+a+'" data-t="'+id+'">🔊 '+NAME[a][H.S.lang==='ar'?1:0]+'</button>'}).join('')+'<button class="ghost small" id="stop">■ '+L('Stop','إيقاف')+'</button></div>'}
H.mods.translator={html:function(){
 return '<h1>'+H.t('translator')+'</h1><div class="card"><div class="row"><select id="from">'+opts(st.from)+'</select><button class="ghost" id="swap" aria-label="swap">⇄</button><select id="to">'+opts(st.to)+'</select></div>'+
 '<br><textarea id="src" placeholder="'+L('Type or paste text (up to 500 characters)','اكتبي أو الصقي النص (حتى 500 حرف)')+'" maxlength="500">'+H.esc(st.src)+'</textarea>'+vb('src')+
 '<br><div class="row"><button id="go">'+L('Translate','ترجم')+'</button><button class="ghost" id="clr">'+L('Clear','مسح')+'</button></div><div class="msg" id="st"></div>'+
 '<textarea id="out" placeholder="'+L('Translation (you can edit it)','الترجمة (يمكنك تعديلها)')+'">'+H.esc(st.out)+'</textarea>'+vb('out')+
 '<br><div class="row"><label>'+L('Voice','الصوت')+' <select id="vsel"></select></label><button class="ghost" id="cp">'+L('Copy','نسخ')+'</button><button class="ghost" id="sv">'+L('Save to vocabulary','احفظ في المفردات')+'</button></div>'+
 '<div class="msg" id="vm"></div><div class="msg" id="avail"></div></div><br><div class="card"><h2>'+L('History','السجل')+'</h2>'+
 (H.S.history.length?H.S.history.map(function(h,i){return '<div class="item"><span>'+H.esc(h.s.slice(0,60))+' → '+H.esc(h.o.slice(0,60))+'</span><button class="ghost small" data-h="'+i+'">'+L('Open','فتح')+'</button></div>'}).join(''):'<p class="msg">'+L('No translations yet.','لا ترجمات بعد.')+'</p>')+'</div>'},
 bind:function(){
 avail();fillSel(st.acc);
 if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=function(){avail();fillSel(st.acc)};
 function keep(){st.src=q('src').value;st.out=q('out').value;st.from=q('from').value;st.to=q('to').value}
 q('swap').onclick=function(){keep();var f=st.from;st.from=st.to;st.to=f;var s=st.src;st.src=st.out;st.out=s;H.render()};
 q('clr').onclick=function(){st.src='';st.out='';H.render()};
 q('cp').onclick=function(){var o=q('out').value;if(navigator.clipboard)navigator.clipboard.writeText(o).then(function(){H.toast(L('Copied','تم النسخ'))},function(){H.toast('—')})};
 q('stop').onclick=function(){if('speechSynthesis' in window)speechSynthesis.cancel()};
 [].forEach.call(document.querySelectorAll('[data-a]'),function(b){b.onclick=function(){st.acc=b.dataset.a;fillSel(st.acc);q('vm').textContent=H.speak(q(b.dataset.t).value,st.acc,q('vsel').value)}});
 [].forEach.call(document.querySelectorAll('[data-h]'),function(b){b.onclick=function(){var h=H.S.history[b.dataset.h];st={from:h.f,to:h.t,src:h.s,out:h.o,acc:st.acc};H.render()}});
 q('sv').onclick=function(){keep();if(!st.src.trim())return;var en=st.from!=='ar'?st.from:st.to,w=st.from==='ar'?st.out:st.src,m=st.from==='ar'?st.src:st.out;
  if(st.from==='ar'&&st.to==='ar')return;H.S.vocab.push({id:Date.now(),word:w.trim(),lang:en,ar:m.trim(),ipa:'',tr:'',def:'',ex:'',syn:'',ant:'',fam:'',pos:'',level:'',cat:'',fav:false,hard:false,box:0,due:H.ds(new Date())});H.save();H.toast(L('Saved','تم الحفظ'))};
 q('go').onclick=function(){keep();var s=st.src.trim();if(!s)return;if(st.from===st.to){q('st').textContent=L('Choose two different languages.','اختاري لغتين مختلفتين.');return}
  q('st').textContent='…';
  fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(s)+'&langpair='+st.from+'|'+st.to).then(function(r){return r.json()}).then(function(d){
   var o=d.responseData&&d.responseData.translatedText;if(!o)throw 0;st.out=o;q('out').value=o;q('st').textContent='';
   H.S.history.unshift({f:st.from,t:st.to,s:s,o:o});H.S.history=H.S.history.slice(0,30);H.save()}).catch(function(){q('st').textContent=L('Online translation is unavailable right now. Type the translation yourself; voices and saving still work.','الترجمة عبر الإنترنت غير متاحة الآن. اكتبي الترجمة بنفسك؛ النطق والحفظ يعملان.')})}}};
})();
