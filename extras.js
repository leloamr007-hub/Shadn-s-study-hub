(function(){
var H=Hub,L=H.L,q=function(i){return document.getElementById(i)},Q=function(){return H.quiz};
function on(i,f){var e=q(i);if(e)e.onclick=f}
function each(sel,f){[].forEach.call(document.querySelectorAll(sel),f)}
/* ---------- Pronunciation lab ---------- */
var PR={en:[['sheep /ʃiːp/ – ship /ʃɪp/','Minimal pair: long /iː/ and short /ɪ/'],['full /fʊl/ – fool /fuːl/','Minimal pair: /ʊ/ and /uː/'],['bad /bæd/ – bed /bed/','Minimal pair: /æ/ and /e/'],['cat /kæt/ – cut /kʌt/','Minimal pair: /æ/ and /ʌ/'],['bath','British /bɑːθ/, American /bæθ/'],['tomato','British /təˈmɑːtəʊ/, American /təˈmeɪtoʊ/'],['schedule','British /ˈʃedjuːl/, American /ˈskedʒuːl/'],["can't",'British /kɑːnt/, American /kænt/'],['photograph','Stress on the first syllable: /ˈfəʊtəɡrɑːf/'],['photography','Stress on the second syllable: /fəˈtɒɡrəfi/']],
 de:[['Straße','/ˈʃtʁaːsə/ — ß sounds like s; st at the start of a word sounds like scht'],['schön','/ʃøːn/ — ö is a rounded vowel'],['Bücher','/ˈbyːçɐ/ — ü is a rounded vowel; ch after ü is soft'],['Mädchen','/ˈmɛːtçən/ — ä sounds like long e'],['ich','/ɪç/ — soft ch'],['Nacht','/naxt/ — hard ch after a, o, u'],['Zeit','/tsaɪt/ — z sounds like ts'],['Wasser','/ˈvasɐ/ — w sounds like v'],['Vogel','/ˈfoːɡl̩/ — v often sounds like f']]};
H.mods.pron={html:function(){
 function rows(l,a){return PR[l].map(function(r,i){return '<div class="item"><span><b>'+H.esc(r[0])+'</b><br><span class="msg">'+H.esc(r[1])+'</span></span><span class="row">'+a.map(function(x){return '<button class="ghost small" data-l="'+l+'" data-i="'+i+'" data-a="'+x[0]+'">🔊 '+x[1]+'</button>'}).join('')+'</span></div>'}).join('')}
 return '<h1>'+H.t('pron')+'</h1><p class="msg">'+L('Tap to listen, then repeat out loud. Only voices found on your device will play.','اضغطي للاستماع ثم كرري بصوت عالٍ. تعمل فقط الأصوات الموجودة على جهازك.')+'</p><div class="card"><h2>English</h2>'+rows('en',[['gb','British'],['us','American']])+'</div><br><div class="card"><h2>Deutsch</h2>'+rows('de',[['de','German']])+'</div><div class="msg" id="vm"></div>'},
 bind:function(){each('[data-a]',function(b){b.onclick=function(){var r=PR[b.dataset.l][b.dataset.i],w=r[0].split(' ')[0].split('–')[0];
  var txt=r[0].indexOf('–')>-1?r[0].replace(/\/[^/]*\//g,'').replace('–',',').replace(/\s+/g,' '):w;q('vm').textContent=H.speak(txt,b.dataset.a)}})}};
/* ---------- Translation practice ---------- */
var RUB=['Accuracy of meaning (40)','Natural wording (30)','Grammar and spelling (20)','Register and style (10)'];
var TP=[
{id:'t1',d:'ar→en',k:'Sentence',s:'أحب القراءة في المكتبة.',m:'I like reading in the library.',a:['i like reading in the library','i love reading in the library','i like to read in the library','i enjoy reading in the library']},
{id:'t2',d:'ar→en',k:'Academic',s:'تدرس الطالبة اللغويات في الجامعة.',m:'The student studies linguistics at university.',a:['the student studies linguistics at university','the student studies linguistics at the university','the student is studying linguistics at university','the female student studies linguistics at university']},
{id:'t3',d:'ar→en',k:'Technical',s:'يرجى إغلاق الجهاز قبل تنظيفه.',m:'Please switch off the device before cleaning it.',a:['please switch off the device before cleaning it','please turn off the device before cleaning it','please switch the device off before cleaning it','please turn the device off before cleaning it']},
{id:'t4',d:'ar→de',k:'Sentence',s:'أنا أتعلم اللغة الألمانية.',m:'Ich lerne Deutsch.',a:['ich lerne deutsch','ich lerne die deutsche sprache','ich lerne gerade deutsch']},
{id:'t5',d:'en→ar',k:'Sentence',s:'The library opens at nine o’clock.',m:'تفتح المكتبة أبوابها في التاسعة.'},
{id:'t6',d:'en→ar',k:'Literary',s:'The sea was calm and the sky was full of stars.',m:'كان البحر هادئاً وكانت السماء مليئة بالنجوم.'},
{id:'t7',d:'de→ar',k:'Sentence',s:'Ich wohne in Kairo.',m:'أسكن في القاهرة.'}];
var tpS={};
H.mods.tprac={html:function(){H.S.tprac=H.S.tprac||{};
 return '<h1>'+H.t('tprac')+'</h1><p class="msg">'+L('Where several translations are correct, any accepted version counts. Other items show a model answer and you rate yourself with the rubric.','عندما توجد ترجمات صحيحة عدة تُقبل كل الصيغ المعتمدة. باقي التمارين تعرض إجابة نموذجية وتقيّمين نفسك بالمعيار.')+'</p>'+
 TP.map(function(x){var done=H.S.tprac[x.id],r=tpS[x.id];return '<div class="card"><span class="chip">'+x.d+' · '+x.k+'</span> '+(done?'✓':'')+'<p dir="auto"><b>'+H.esc(x.s)+'</b></p><textarea id="in_'+x.id+'" dir="auto" style="min-height:60px"></textarea><div class="row"><button class="small" data-c="'+x.id+'">'+(x.a?L('Check','تحقق'):L('Show model answer','أظهر النموذج'))+'</button></div>'+
 (r?'<div class="msg" dir="auto">'+(r.ok===true?'✓ '+L('Accepted','مقبول'):r.ok===false?'✗ '+L('Not an accepted version.','ليست صيغة معتمدة.'):'')+'</div><p dir="auto"><b>'+L('Model: ','النموذج: ')+'</b>'+H.esc(x.m)+'</p>'+(x.a?'':'<div class="row"><button class="small" data-g="'+x.id+'">'+L('I matched the meaning','طابقت المعنى')+'</button></div>')+'<details><summary>'+L('Rubric (100)','معيار التقييم (100)')+'</summary><ul>'+RUB.map(function(z){return '<li>'+z+'</li>'}).join('')+'</ul></details>':'')+'</div><br>'}).join('')},
 bind:function(){each('[data-c]',function(b){b.onclick=function(){var x=TP.filter(function(t){return t.id===b.dataset.c})[0],v=q('in_'+x.id).value,ok=null;
  if(x.a){ok=x.a.map(Q().norm).indexOf(Q().norm(v))>-1;if(ok){H.S.tprac[x.id]=true;H.save()}}tpS[x.id]={ok:ok};H.render()}});
 each('[data-g]',function(b){b.onclick=function(){H.S.tprac[b.dataset.g]=true;H.save();H.render()}})}};
/* ---------- Reading and listening library ---------- */
var LIB=[
{id:'r1',lang:'en',lvl:'A1',topic:'Daily life',min:5,acc:'gb',title:'A day in Manchester',text:'Tom lives in Manchester. He is a student at the university. Every morning he takes the bus to the city centre. At lunchtime he has a sandwich and a cup of tea in the canteen. In the evening he goes home by bus and watches football on television.',vocab:[['canteen','مطعم الجامعة'],['city centre','وسط المدينة'],['lunchtime','وقت الغداء']],
 q:[['mc','Where does Tom live?',['London','Manchester','Oxford'],1,'The first sentence says Manchester.'],['tf','Tom goes to the university by car.',false,'He takes the bus.'],['mc','What does he have at lunchtime?',['a sandwich and tea','pasta and juice','only coffee'],0,'Sandwich and a cup of tea.'],['tx','Where does he watch football?',['on television','on tv','at home'],'He watches football on television.']],dict:'Every morning he takes the bus to the city centre.'},
{id:'r2',lang:'de',lvl:'A1',topic:'Alltag',min:5,acc:'de',title:'Annas Tag',text:'Anna wohnt in Berlin. Sie ist Studentin. Jeden Morgen fährt sie mit dem Fahrrad zur Universität. Mittags isst sie einen Salat in der Mensa. Am Abend liest sie ein Buch.',vocab:[['die Mensa','مطعم الجامعة'],['das Fahrrad','الدراجة'],['mittags','وقت الظهر']],
 q:[['mc','Wo wohnt Anna?',['Berlin','Hamburg','München'],0,'Anna wohnt in Berlin.'],['tf','Anna fährt mit dem Bus zur Universität.',false,'Sie fährt mit dem Fahrrad.'],['mc','Was isst sie mittags?',['eine Pizza','einen Salat','ein Brot'],1,'Sie isst einen Salat.'],['tx','Was liest sie am Abend?',['ein buch','ein buch.'],'Am Abend liest sie ein Buch.']],dict:'Jeden Morgen fährt sie mit dem Fahrrad zur Universität.'}];
var LB={id:null,mode:'',res:null,dres:null};
H.mods.library={html:function(){
 var x=LIB.filter(function(i){return i.id===LB.id})[0];
 if(!x)return '<h1>'+H.t('library')+'</h1><p class="msg">'+L('Original texts written for this app. More will be added.','نصوص أصلية كتبت لهذا التطبيق. ستضاف نصوص أخرى.')+'</p>'+LIB.map(function(i){return '<div class="card"><b>'+H.esc(i.title)+'</b> <span class="chip">'+i.lang.toUpperCase()+' '+i.lvl+'</span><br><span class="msg">'+i.topic+' · ~'+i.min+' '+L('min','د')+'</span><br><br><button class="small" data-o="'+i.id+'">'+L('Open','فتح')+'</button></div><br>'}).join('');
 return '<button class="ghost small" id="lb">‹ '+L('Back','رجوع')+'</button><h1>'+H.esc(x.title)+'</h1><div class="card"><p dir="auto" style="font-size:1.1rem">'+H.esc(x.text)+'</p><div class="row"><button class="ghost small" id="ls">🔊 '+L('Listen','استمعي')+'</button><button class="ghost small" id="lx">■</button></div><div class="msg" id="vm"></div>'+
 '<p class="msg">'+x.vocab.map(function(v){return H.esc(v[0])+' = '+v[1]}).join(' · ')+'</p></div><br><h2>'+L('Comprehension','الفهم')+'</h2>'+(LB.res?Q().show(LB.res)+'<button id="lr">'+L('Try again','مرة أخرى')+'</button>':x.q.map(Q().conv).map(Q().qhtml).join('')+'<button id="lq">'+L('Check answers','تحقق من الإجابات')+'</button>')+
 '<br><br><div class="card"><h2>'+L('Dictation','إملاء')+'</h2><p class="msg">'+L('Listen and type what you hear.','استمعي واكتبي ما تسمعين.')+'</p><button class="ghost small" id="ds">🔊</button><input id="dt" style="width:100%" autocomplete="off"><br><br><button class="small" id="dc">'+L('Check','تحقق')+'</button><div class="msg" id="dm">'+(LB.dres===null?'':LB.dres?'✓':'✗ '+H.esc(x.dict))+'</div></div>'},
 bind:function(){var x=LIB.filter(function(i){return i.id===LB.id})[0];
 each('[data-o]',function(b){b.onclick=function(){LB.id=b.dataset.o;LB.res=null;LB.dres=null;H.render()}});
 on('lb',function(){LB.id=null;H.render()});if(!x)return;
 on('ls',function(){q('vm').textContent=H.speak(x.text,x.acc)});on('lx',function(){speechSynthesis.cancel()});
 on('ds',function(){q('dm').textContent=H.speak(x.dict,x.acc)});
 on('dc',function(){LB.dres=Q().norm(q('dt').value)===Q().norm(x.dict);H.render()});
 on('lq',function(){LB.res=Q().grade(x.q.map(Q().conv));H.render()});on('lr',function(){LB.res=null;H.render()})}};
/* ---------- Courses directory ---------- */
var CF='Check official website for current fees.';
var RS=[
['BBC Learning English','English','English','A1–C2','FREE','Lessons, news and pronunciation videos','https://www.bbc.co.uk/learningenglish'],
['British Council LearnEnglish','English','English','A1–C2','FREE + PAID','Free practice materials; paid courses also exist','https://learnenglish.britishcouncil.org'],
['Cambridge English','English','English','A1–C2','FREE + PAID','Exam preparation and free practice resources','https://www.cambridgeenglish.org'],
['OpenLearn (Open University)','English / Academic','English','Varies','FREE','Free university-style courses on many subjects','https://www.open.edu/openlearn'],
['English with Lucy','English','English','A1–C2','FREE','British English video lessons on YouTube','https://www.youtube.com/@EnglishwithLucy'],
['Coursera','English / Academic','English','Varies','FREE + PAID','Free auditing on many courses; certificates usually need payment','https://www.coursera.org'],
['edX','English / Academic','English','Varies','FREE + PAID','Free auditing on many courses; verified certificates are paid','https://www.edx.org'],
['Deutsche Welle: Learn German','German','German','A1–C1','FREE','Courses and videos, including the Nicos Weg course','https://learngerman.dw.com'],
['Goethe-Institut','German','German','A1–C2','FREE + PAID','Free online materials; courses and exams are paid','https://www.goethe.de'],
['VHS Lernportal','German','German','A1–B1+','FREE + PAID','German courses from adult-education centres','https://www.vhs-lernportal.de'],
['Easy German','German','German','A1–C1','FREE','Street-interview videos with subtitles; some extras may be paid','https://www.easygerman.org'],
['lingoni','German','German','A1–B2','FREE + PAID','Video lessons; some content is paid','https://www.lingoni.com']];
var RQ='';
H.mods.resources={html:function(){var l=RS.filter(function(r){return(r.join(' ')).toLowerCase().indexOf(RQ.toLowerCase())>-1});
 return '<h1>'+H.t('resources')+'</h1><input id="rq" placeholder="'+L('Search','بحث')+'" value="'+H.esc(RQ)+'" style="width:100%"><p class="msg">'+L('No prices are shown because fees change. Free courses and paid courses are labelled separately. Egyptian language centres are not listed yet: they will be added only after being verified.','لا تظهر أسعار لأنها تتغير. الدورات المجانية والمدفوعة موضحة بوضوح. مراكز اللغات المصرية غير مدرجة بعد وستضاف بعد التحقق منها.')+'</p>'+
 l.map(function(r){return '<div class="card"><b>'+r[0]+'</b> <span class="chip">'+r[4]+'</span><br><span class="msg">'+r[1]+' · '+r[3]+'</span><p>'+r[5]+'</p><span class="msg">'+L('Certificate: check the website. ','الشهادة: راجعي الموقع. ')+CF+'</span><br><br><a href="'+r[6]+'" target="_blank" rel="noopener">'+L('Official website','الموقع الرسمي')+'</a></div><br>'}).join('')},
 bind:function(){var e=q('rq');e.oninput=function(){RQ=e.value;var p=e.selectionStart;H.render();var n=q('rq');n.focus();n.setSelectionRange(p,p)}}};
/* ---------- Progress and achievements ---------- */
function streak(){var S=H.S,d=new Date(),n=0;function m(k){return S.sessions.some(function(s){return s.d===k&&s.min>0})}if(!m(H.ds(d)))d.setDate(d.getDate()-1);while(m(H.ds(d))){n++;d.setDate(d.getDate()-1)}return n}
function sum(days){var t=0,S=H.S;for(var i=0;i<days;i++){var d=new Date();d.setDate(d.getDate()-i);var k=H.ds(d);S.sessions.forEach(function(s){if(s.d===k)t+=s.min})}return t}
H.mods.progress={html:function(){var S=H.S,tot=S.sessions.reduce(function(a,s){return a+s.min},0),learned=S.vocab.filter(function(w){return w.box>=3}).length;
 var A=[['First study session','Log one study session',S.sessions.length>=1],['Seven-day streak','Study seven days in a row',streak()>=7],['First lesson passed','Pass a lesson exam with 80% or more',S.lessonsDone.length>=1],['Three lessons passed','Pass three lesson exams',S.lessonsDone.length>=3],['Perfect score','Score 100% on an exam',S.exams.some(function(e){return e.score===100})],['Ten words saved','Save ten words in your notebook',S.vocab.length>=10],['Five words learned','Move five words to box 3 or higher',learned>=5],['First task completed','Tick off a planner task',S.tasks.some(function(t){return t.done})],['Ten hours','Study for ten hours in total',tot>=600]];
 return '<h1>'+H.t('progress')+'</h1><div class="grid"><div class="card"><div class="lbl">'+L('Last 7 days (min)','آخر 7 أيام (دقيقة)')+'</div><div class="num">'+sum(7)+'</div></div><div class="card"><div class="lbl">'+L('Last 30 days (min)','آخر 30 يوماً (دقيقة)')+'</div><div class="num">'+sum(30)+'</div></div><div class="card"><div class="lbl">'+L('Words learned','كلمات متقنة')+'</div><div class="num">'+learned+'</div></div><div class="card"><div class="lbl">'+L('Streak','أيام متتالية')+'</div><div class="num">'+streak()+'</div></div></div>'+
 '<div class="card"><h2>'+L('Achievements','الإنجازات')+'</h2>'+A.map(function(a){return '<div class="item"><span>'+(a[2]?'🏆 ':'🔒 ')+'<b>'+a[0]+'</b><br><span class="msg">'+a[1]+'</span></span></div>'}).join('')+'</div>'}};
})();
