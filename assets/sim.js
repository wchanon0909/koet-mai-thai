'use strict';
/*
 * เกิดใหม่ในไทย | interactive MVP 0.2
 * Historic events are separately sourced and dated (data.js).
 * Narrative activities and relationship mechanics are fictional (events.js).
 * Statistics and mortality are DEMONSTRATION assumptions, not calibrated Thai projections.
 * All randomness uses a saved seed; LLM/AI is NOT invoked.
 */
(() => {
  const CURRENT_BE = 2569; // Reference: 20 Oct 2026; annual simulation resolution.
  const STORAGE_KEY = 'koet-mai-thai-life-v02';
  const LAST_LIVES_KEY = 'koet-mai-thai-archives-v02';
  const $ = id => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const format = n => Math.round(n).toLocaleString('th-TH');
  const LABEL = {family:'ครอบครัว',friend:'เพื่อน',partner:'คนรัก'};
  const CAREGIVERS = ['แม่','พ่อ','ยาย','ย่า','ตา','ปู่','ป้า','น้า','ผู้ปกครอง'];
  const FRIEND_NAMES = ['ต้น','พลอย','โอม','ข้าว','ปอ','น้ำ','เบส','ตาล','ฝน','กานต์','ฟ้า','นัท','ป่าน','เฟิร์น','บอล','แก้ม','มิ้น','ภีม','กิ่ง','แพรว'];
  const JOBS = ['พนักงานบริการ','ช่างเทคนิค','พนักงานสำนักงาน','ค้าขาย','แรงงานอุตสาหกรรม','เกษตรกร','ผู้ประกอบอาชีพอิสระ','งานดูแลผู้คน','ธุรกิจขนาดเล็ก'];
  const STORIES = {
    early:[['อ้อมกอดของคนในบ้าน','โลกวัยเด็กของคุณเต็มไปด้วยผู้คนและความคุ้นเคยที่ค่อย ๆ สะสม'],['เด็กคนหนึ่งกำลังเติบโต','คุณค่อย ๆ เรียนรู้โลกผ่านสายตาและการดูแลของผู้ใหญ่รอบตัว']],
    school:[['เรื่องราวในรั้วโรงเรียน','คุณเรียนรู้ว่าความสนใจของแต่ละคนไม่เหมือนกัน และวันธรรมดาก็มีการตัดสินใจ'],['เพื่อน การบ้าน และเวลาหลังเลิกเรียน','ปีนี้มีทั้งเรื่องเรียน การเล่น และเวลาให้คนที่บ้าน ทุกอย่างแย่งพื้นที่จากหนึ่งวันเดียวกัน'],['การเติบโตที่ไม่ได้อยู่แค่ในตำรา','บางบทเรียนมาจากเพื่อน บางบทเรียนมาจากการลองผิดลองถูก']],
    teen:[['ช่วงวัยที่มีทางแยกมากขึ้น','ความฝัน ความคาดหวัง และความสัมพันธ์เริ่มมีบทบาทมากขึ้นในการตัดสินใจ'],['คำถามของคนกำลังโต','คุณอยากรู้ว่าตัวเองถนัดอะไร และใครคือคนที่คุณอยากแบ่งปันเรื่องราวด้วย']],
    young:[['การลองผิดลองถูกของวัยผู้ใหญ่','งาน เงิน ที่อยู่ และคนสำคัญค่อย ๆ กำหนดจังหวะชีวิตที่แตกต่างกัน'],['ชีวิตไม่เดินเป็นเส้นตรง','บางคนไปต่อเร็ว บางคนพักก่อน คุณค่อย ๆ ทำความเข้าใจความเป็นไปได้ของตัวเอง']],
    middle:[['การแบ่งเวลาให้สิ่งสำคัญ','งาน สุขภาพ และความสัมพันธ์ต้องแบ่งเวลาจากวันเดียวกัน'],['สิ่งที่มีคุณค่าเปลี่ยนไป','คุณเริ่มทบทวนว่าระหว่างเงิน เวลา และผู้คน อะไรสำคัญในช่วงนี้']],
    senior:[['วันธรรมดาที่มีความหมาย','เรื่องเล็ก ๆ อาจกลายเป็นความสุขของวันนี้ การมีใครให้คุยด้วยมีความสำคัญไม่แพ้กิจกรรมใหญ่'],['บทใหม่ที่ยังเขียนต่อได้','คุณยังเรียนรู้และสร้างความทรงจำใหม่ได้ แม้หลายอย่างเปลี่ยนไปจากวัยก่อน']]
  };
  let state = null;
  let timer = null;

  // Startup and resume. A v0.1 save remains intact and is intentionally not overwritten.
  const yearSelect = $('birthYear');
  for (let y=CURRENT_BE; y>=2493; --y) {
    const opt=document.createElement('option'); opt.value=String(y);
    opt.textContent=`พ.ศ. ${y} (ค.ศ. ${y-543})`;
    yearSelect.appendChild(opt);
  }
  yearSelect.addEventListener('change',()=>{$('startBtn').disabled=!yearSelect.value;});
  $('startBtn').addEventListener('click',beginLife);
  $('stepBtn').addEventListener('click',()=>advance(1));
  $('tenBtn').addEventListener('click',()=>advance(10,true));
  $('autoBtn').addEventListener('click',toggleAuto);
  $('againBtn').addEventListener('click',resetToLanding);
  $('newLifeBtn').addEventListener('click',resetToLanding);
  $('copySummaryBtn').addEventListener('click',copySummary);
  for(const id of ['guideBtn','footerGuideBtn'])$(id).addEventListener('click',()=>$('guideDialog').showModal());
  restoreOption();

  function secureSeed(){
    try{const x=new Uint32Array(1);crypto.getRandomValues(x);return x[0]||98439;}
    catch(_e){return(Date.now()^Math.floor(Math.random()*4294967295))>>>0||98439;}
  }
  function nextRandom(){
    let x=state.rng>>>0; x^=x<<13; x^=x>>>17; x^=x<<5;
    state.rng=x>>>0; return(state.rng>>>0)/4294967296;
  }
  function pick(list){return list[Math.min(list.length-1,Math.floor(nextRandom()*list.length))];}
  function between(a,b){return a+Math.floor(nextRandom()*(b-a+1));}
  function chance(p){return nextRandom()<clamp(p,0,1);}
  function weightedPick(items,weights){
    const total=weights.reduce((a,b)=>a+b,0);
    let roll=nextRandom()*total;
    for(let i=0;i<items.length;i++){roll-=weights[i];if(roll<0)return items[i];}
    return items[items.length-1];
  }
  function change(effects={}){
    for(const [key,delta] of Object.entries(effects)){
      if(key==='savings')state.savings=Math.round(state.savings+delta);
      else if(typeof state.stats[key]==='number')state.stats[key]=clamp(state.stats[key]+delta,0,100);
    }
  }
  function alterBonds(bonds={}){
    for(const [key,delta] of Object.entries(bonds)){
      const person=state.social[key];
      if(person){person.bond=clamp(person.bond+delta,0,100);change({relationships:Math.round(delta*.23)});}
    }
  }
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_e){}}
  function readSaved(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch(_e){return null;}}
  function restoreOption(){
    const saved=readSaved();
    if(!saved||saved.ended||!Number.isFinite(saved.age)||!saved.social||!saved.pendingQueue)return;
    const btn=document.createElement('button');btn.className='outline';btn.type='button';
    btn.style.cssText='width:100%;margin-top:10px';btn.textContent=`เล่นชีวิตที่ค้างไว้ต่อ · พ.ศ. ${saved.year}`;
    btn.onclick=()=>{state=saved;state.auto=false;show('lifeView');render();};
    document.querySelector('.start-card').appendChild(btn);
  }
  function provinceAtBirth(modern,year,month=12,day=31){
    const old=HISTORICAL_PROVINCES[modern];if(!old)return modern;
    return year<old.established||(year===old.established&&(month<old.month||(month===old.month&&day<old.day)))?old.parent:modern;
  }
  function beginLife(){
    const birthYear=Number(yearSelect.value);
    if(!Number.isInteger(birthYear)||birthYear<2493||birthYear>CURRENT_BE)return;
    stopAuto();const seed=secureSeed();
    state={seed,rng:seed,birthYear,year:birthYear,age:0,bornMonth:0,bornDay:0,
      birthProvince:'',birthProvinceHistorical:'',residence:'',area:'',family:'',level:0,sex:'',stats:{},savings:0,
      schoolPath:'ยังไม่เข้าสู่ระบบการศึกษา',job:'—',partnered:false,children:0,choices:[],records:[],lastStory:null,thisYearHistory:[],
      social:{family:{bond:0,caregiver:''},friend:null,partner:null,previousPartners:0},childNames:[],socialUsedYear:null,
      focus:'family',focusYears:{},recentActivities:[],lastOutcome:'',pending:null,pendingQueue:[],
      style:$('simulationStyle').value,ended:false,auto:false};
    state.bornMonth=between(1,12);state.bornDay=between(1,28);
    state.birthProvince=pick(THAI_PROVINCES); // UNIFORM: demo only, not provincial birth weights.
    state.birthProvinceHistorical=provinceAtBirth(state.birthProvince,birthYear,state.bornMonth,state.bornDay);
    state.residence=state.birthProvince;
    state.area=pick(['ในเขตเทศบาล','รอบเขตเมือง','นอกเขตเทศบาล']);
    state.level=between(1,5);state.sex=pick(['หญิง','ชาย']);
    state.family=pick(['ครอบครัว 2 คน','ครอบครัว 3 คน','ครอบครัว 4 คน','ครอบครัว 5 คน','ครอบครัวหลายรุ่น']);
    state.stats={health:clamp(74+between(-8,10),0,100),happiness:clamp(65+between(-9,13),0,100),
      knowledge:clamp(31+state.level*4+between(-4,5),0,100),relationships:clamp(62+between(-7,16),0,100)};
    state.social.family.bond=clamp(57+between(-18,24),0,100);
    state.social.family.caregiver=pick(CAREGIVERS);
    state.savings=between(0,2200)*state.level;
    state.lastStory={title:'วันแรกของชีวิต',text:`คุณเกิดในพื้นที่${state.birthProvinceHistorical} ปี พ.ศ. ${birthYear} ไม่มีใครกำหนดได้ว่าคุณจะเจอใคร ชอบทำอะไร และความสัมพันธ์ในชีวิตจะเปลี่ยนไปอย่างไร`,type:'personal'};
    addRecord('personal','กำเนิดชีวิตหนึ่ง',state.lastStory.text);
    processHistory(birthYear,true);
    save();show('lifeView');render();
  }
  function show(id){for(const name of ['landing','lifeView','endView'])$(name).hidden=name!==id;window.scrollTo({top:0,behavior:'instant'});}
  function addRecord(type,title,text,source=null){
    state.records.push({type,title,text,year:state.year,age:state.age,source});
    if(state.records.length>550)state.records=state.records.slice(-550);
  }
  function processHistory(year,fromBirth=false){
    state.thisYearHistory=[];
    for(const event of THAI_HISTORY){
      if(event.year!==year)continue;
      if(fromBirth&&(event.month<state.bornMonth||(event.month===state.bornMonth&&(event.day||1)<state.bornDay)))continue;
      if(!event.national&&!event.provinces.includes(state.residence))continue;
      const local=Array.isArray(event.provinces)&&event.provinces.includes(state.residence);
      let personalNote='';
      if(local&&chance(event.sector==='disaster'?.20:.10)){
        change({savings:-between(700,4100),happiness:-3});
        personalNote='ในเรื่องราวจำลอง ครอบครัวของคุณต้องรับมือกับผลกระทบบางส่วนของเหตุการณ์นี้';
      }else if(event.id==='asian-crisis'&&state.age>=18&&chance(.15)){
        change({savings:-between(1000,4900),happiness:-3});personalNote='ในเรื่องราวจำลอง รายได้ครัวเรือนมีความไม่แน่นอนเพิ่มขึ้น';
      }else if(event.id==='covid'&&state.age>=6&&chance(.18)){
        change({happiness:-3,relationships:-2});personalNote='ในเรื่องราวจำลอง การเรียนหรือการทำงานของคุณต้องปรับตัว';
      }
      state.thisYearHistory.push({...event,personalNote});
      addRecord('history',event.title,event.summary+(personalNote?' '+personalNote:''),event.source);
    }
  }
  function ageStage(){
    return state.age<6?'early':state.age<13?'school':state.age<19?'teen':state.age<40?'young':state.age<60?'middle':'senior';
  }
  function ensureFocus(){
    const allowed=FOCUS_BY_AGE(state.age);
    if(allowed.length&&!allowed.includes(state.focus)){
      // Milestone transitions should not silently set an inappropriate focus.
      state.focus=state.age<=18?'learning':state.age<60?'career':'health';
    }
  }
  function applyFocus(){
    ensureFocus();if(state.age<6)return;
    const f=LIFE_FOCUS[state.focus];if(!f)return;
    change(f.effect);alterBonds(f.bond);
    state.focusYears[state.focus]=(state.focusYears[state.focus]||0)+1;
  }
  function newName(exclude=''){
    return pick(FRIEND_NAMES.filter(name=>name!==exclude));
  }
  function meetFriend(probability=.72){
    if(state.social.friend)return `คุณกับ${state.social.friend.name}ค่อย ๆ ใช้เวลาร่วมกันมากขึ้น`;
    if(!chance(probability))return 'คุณได้รู้จักคนใหม่ แต่ยังไม่ถึงขั้นสนิทกัน การสร้างเพื่อนต้องอาศัยเวลาทั้งสองฝ่าย';
    const name=newName(state.social.partner?.name);
    state.social.friend={name,bond:clamp(53+between(-10,12),0,100),sinceAge:state.age};
    change({relationships:4,happiness:2});
    addRecord('relation','เพื่อนคนสำคัญ',`คุณได้รู้จัก${name} และเริ่มมีมิตรภาพที่อาจเดินไปด้วยกันอีกนาน`);
    return `คุณได้รู้จัก${name} และเริ่มสนิทกันจากการใช้เวลาร่วมกัน`;
  }
  function meetPartner(probability=.55){
    if(state.age<15)return 'ช่วงวัยนี้ยังไม่ใช่เวลาของการคบหาแบบคนรัก';
    if(state.social.partner)return `คุณยังมี${state.social.partner.name}เป็นคนรักอยู่แล้ว`;
    const p=clamp(probability+(state.focus==='romance'?.11:0)+(state.stats.relationships-65)*.001,.10,.90);
    if(!chance(p))return 'คุณกล้าเปิดใจและได้เรียนรู้สิ่งใหม่ แต่ความสัมพันธ์ยังไม่ได้พัฒนาไปถึงการคบหา';
    const name=newName(state.social.friend?.name);
    state.social.partner={name,bond:clamp(58+between(-10,10),0,100),sinceAge:state.age,stage:'คบหา'};
    state.partnered=true;
    change({happiness:4,relationships:5});
    addRecord('relation','เริ่มความสัมพันธ์',`คุณและ${name}เริ่มคบหากันหลังทำความรู้จักกัน`);
    return `คุณกับ${name}ตกลงคบหากัน และเริ่มเรียนรู้ความสัมพันธ์ที่เคารพกัน`;
  }
  function endPartner(){
    if(!state.social.partner)return 'คุณยังไม่มีความสัมพันธ์ที่ต้องยุติ';
    const name=state.social.partner.name;
    state.social.partner=null;state.partnered=false;state.social.previousPartners++;
    change({relationships:-6,happiness:-2});
    addRecord('relation','ความสัมพันธ์เปลี่ยนไป',`คุณกับ${name}ตกลงแยกทางและเดินต่อในเส้นทางของตัวเอง`);
    return `คุณกับ${name}แยกทางกัน ความสัมพันธ์ครั้งนี้กลายเป็นส่วนหนึ่งของความทรงจำ`;
  }
  function commitPartner(){
    const person=state.social.partner;if(!person)return 'การเปลี่ยนสถานะต้องเริ่มจากความสัมพันธ์ที่มีอยู่';
    if(person.stage==='คู่ชีวิต')return 'คุณกับคนรักได้ใช้ชีวิตร่วมกันอยู่แล้ว';
    if(!chance(clamp(.35+person.bond*.005,.45,.90)))return 'คุณสองคนเริ่มคุยเรื่องอนาคต แต่ยังไม่พร้อมตกลงใช้ชีวิตร่วมกันในปีนี้';
    person.stage='คู่ชีวิต';alterBonds({partner:7});
    addRecord('relation','ก้าวใหม่ของชีวิตคู่',`คุณและ${person.name}ตัดสินใจวางแผนใช้ชีวิตร่วมกัน`);
    return `คุณกับ${person.name}ตกลงวางแผนชีวิตร่วมกันอย่างจริงจัง`;
  }
  function planChild(){
    if(state.age<22||state.age>48||!state.social.partner||state.children>=4)return 'เงื่อนไขของชีวิตช่วงนี้ยังไม่เปิดให้มีสมาชิกใหม่';
    if(!chance(.61))return 'คุณเริ่มคุยและเตรียมตัวเรื่องสมาชิกใหม่ แต่ปีนี้ยังไม่มีสมาชิกเพิ่ม';
    state.children++;
    const childName=newName(state.social.partner?.name);
    state.childNames.push({name:childName,bornYear:state.year});
    change({savings:-3400,happiness:3,relationships:2});alterBonds({family:5,partner:3});
    addRecord('relation','สมาชิกใหม่ของบ้าน',`ครอบครัวได้ต้อนรับ${childName} สมาชิกใหม่ที่ทำให้ชีวิตเปลี่ยนไป ทั้งความสุข เวลา และความรับผิดชอบเพิ่มขึ้น`);
    return `ปีนี้ครอบครัวต้อนรับ${childName} ตอนนี้คุณมีลูก ${state.children} คน`;
  }
  function tryMove(){
    const p=clamp(.25+state.level*.09+state.stats.knowledge*.002,.25,.9);
    if(!chance(p))return 'คุณลองวางแผนย้ายถิ่น แต่เงื่อนไขเรื่องงานและเงินทำให้ต้องรอก่อน';
    const dest=['กรุงเทพมหานคร','ชลบุรี','ระยอง','เชียงใหม่','ขอนแก่น','สงขลา','นครราชสีมา'].filter(name=>name!==state.residence);
    state.residence=pick(dest);alterBonds({family:-3,friend:-2});
    addRecord('personal','การย้ายจังหวัด',`คุณย้ายไปอยู่${state.residence} เพื่อเริ่มบทใหม่`);
    return `คุณย้ายไปอยู่${state.residence} และเริ่มทำความคุ้นเคยกับสภาพแวดล้อมใหม่`;
  }
  function trySwitchJob(){
    if(!chance(clamp(.25+state.stats.knowledge*.004,.25,.8)))return 'คุณลองหางานใหม่และได้บทเรียนจากการสมัคร แต่ยังไม่มีข้อเสนอที่เหมาะสม';
    const pool=JOBS.filter(job=>job!==state.job);
    state.job=pick(pool);change({savings:1500,happiness:2});
    addRecord('personal','เปลี่ยนเส้นทางอาชีพ',`คุณเริ่มทำงานเป็น${state.job}`);
    return `คุณเริ่มบทบาทใหม่ในงาน${state.job} และต้องเรียนรู้อะไรหลายอย่างอีกครั้ง`;
  }
  function act(action){
    switch(action){
      case 'meetFriend':return meetFriend();
      case 'meetPartner':return meetPartner();
      case 'endPartner':return endPartner();
      case 'commitPartner':return commitPartner();
      case 'planChild':return planChild();
      case 'move':return tryMove();
      case 'switchJob':return trySwitchJob();
      default:return '';
    }
  }
  function socialDrift(){
    const s=state.social;
    alterBonds({family:between(-2,2),friend:between(-2,3),partner:between(-3,3)});
    if(state.age>=6&&!s.friend&&chance(state.age<=18?.22:.065)){
      meetFriend(1);
    }
    if(s.friend&&s.friend.bond<13&&chance(.22)){
      const name=s.friend.name;s.friend=null;addRecord('relation','เพื่อนค่อย ๆ ห่างกัน',`คุณกับ${name}มีเวลาร่วมกันน้อยลง และค่อย ๆ เติบโตไปคนละทาง`);
    }
    if(s.partner&&s.partner.bond<15&&chance(.22))endPartner();
  }
  function annualStory(){
    const stage=ageStage(),pair=pick(STORIES[stage]);
    let title=pair[0],text=pair[1];
    change({happiness:between(-2,3),knowledge:state.age<=25?between(0,2):between(-1,1)});
    if(state.age>45)change({health:-between(0,2)});
    if(state.age>=19&&state.age<65){
      if(state.job==='—'){
        state.job=pick(JOBS);title='งานแรกของคุณ';text=`คุณเริ่มทำงานเป็น${state.job} โอกาสและความรู้ที่สะสมมาช่วยเปิดทางที่แตกต่างกันในแต่ละชีวิต`;
      }
      const income=Math.round(700+state.level*180+state.stats.knowledge*9);
      state.savings+=income-between(650,1450);
    }else if(state.age>=65)state.savings-=between(400,1250);
    if(state.age>=20&&state.age<=58&&chance(.028)){
      change({savings:-between(500,2800),happiness:-2});title='รายจ่ายที่ไม่ได้คาดไว้';
      text='คุณต้องใช้เงินกับเรื่องไม่อยู่ในแผน ปีนี้อาจต้องปรับความสำคัญของสิ่งต่าง ๆ';
    }
    if(state.age>0&&state.age<=12&&state.age%2===0){
      text+=` ในช่วงวัยนี้${state.social.family.caregiver}เป็นหนึ่งในคนที่คอยดูแลคุณ`;
    }
    if(state.age>=6){
      const label=LIFE_FOCUS[state.focus]?.label;
      if(label)text+=` ปีนี้คุณตั้งใจให้เวลากับ “${label}” มากเป็นพิเศษ`;
    }
    return{title,text,type:state.year>CURRENT_BE?'future':'personal'};
  }
  function eligibleActivity(event){
    if(state.age<event.min||state.age>event.max)return false;
    if(event.sinceBE&&state.year<event.sinceBE)return false;
    if(event.schoolOnly&&['ทำงานตั้งแต่วัยรุ่น','ทำงานและดูแลครอบครัว'].includes(state.schoolPath))return false;
    if(event.untilBE&&state.year>event.untilBE)return false;
    const s=state.social;
    switch(event.condition){
      case 'hasFriend':return Boolean(s.friend);
      case 'noFriend':return !s.friend;
      case 'hasPartner':return Boolean(s.partner);
      case 'dating':return Boolean(s.partner&&s.partner.stage==='คบหา');
      case 'single':return !s.partner;
      case 'hasPartnerAndChildRoom':return Boolean(s.partner&&state.children<4);
      case 'hasChildren':return state.children>0;
      default:return true;
    }
  }
  function shouldGetActivity(){
    const age=state.age;
    if(age<6)return false;
    if(age<=18)return true;
    if(age<=29)return age%2===0||chance(.55);
    if(age<=59)return age%3===0||chance(.42);
    return age%3===0||chance(.40);
  }
  function pickActivity(){
    const available=LIFE_ACTIVITIES.filter(eligibleActivity);
    if(!available.length)return null;
    const fresh=available.filter(event=>!state.recentActivities.includes(event.id));
    const pool=fresh.length?fresh:available;
    const weights=pool.map(event=>event.tag===state.focus?3.5:1);
    const evt=weightedPick(pool,weights);
    state.recentActivities.push(evt.id);
    state.recentActivities=state.recentActivities.slice(-5);
    return evt;
  }
  function getDecision(item){
    if(!item)return null;
    if(item.kind==='milestone')return CHOICE_EVENTS[item.age]||null;
    if(item.kind==='activity')return LIFE_ACTIVITIES.find(evt=>evt.id===item.id)||null;
    return null;
  }
  function queueYearDecisions(){
    state.pendingQueue=[];
    if(CHOICE_EVENTS[state.age])state.pendingQueue.push({kind:'milestone',age:state.age});
    if(shouldGetActivity()){
      const event=pickActivity();
      if(event)state.pendingQueue.push({kind:'activity',id:event.id});
    }
    state.pending=state.pendingQueue.shift()||null;
  }
  function mortalityChance(){
    const age=state.age;
    let base;
    if(age<=1)base=.006;
    else if(age<5)base=.00075;
    else if(age<15)base=.00018;
    else if(age<25)base=.00055;
    else base=.0005*Math.exp(.09*(age-25));
    const healthFactor=clamp(1+(70-state.stats.health)*.006,.72,1.6);
    const yearsAhead=Math.max(0,state.year-CURRENT_BE);
    let scenario=1;
    if(state.style==='improving')scenario=Math.exp(-.005*yearsAhead);
    if(state.style==='adverse')scenario=Math.exp(.005*yearsAhead);
    return clamp(base*healthFactor*scenario,0,1);
  }
  function simulateOneYear(){
    if(!state||state.ended||state.pending)return false;
    state.age++;state.year=state.birthYear+state.age;state.lastOutcome='';
    // The school track must advance with age even when no separate choice is made.
    if(state.age===6)state.schoolPath='ประถมศึกษา';
    if(state.age===12)state.schoolPath='มัธยมศึกษาตอนต้น';
    processHistory(state.year);
    applyFocus();socialDrift();
    state.lastStory=annualStory();
    addRecord(state.year>CURRENT_BE?'future':'personal',state.lastStory.title,state.lastStory.text);
    // Death may occur in any year. Age 120 is a technical hard stop, not life expectancy.
    if(chance(mortalityChance())||state.age>=120){
      state.ended=true;addRecord('death','วันสุดท้ายของชีวิต','ชีวิตหนึ่งสิ้นสุดลงในโลกจำลองนี้');
      storeLifeArchive();stopAuto();save();show('endView');renderEnd();return false;
    }
    queueYearDecisions();save();return true;
  }
  function decide(index,automatic=false){
    if(!state||!state.pending)return;
    const pending=state.pending,evt=getDecision(pending);
    if(!evt||!evt.options[index])return;
    const choice=evt.options[index];
    change(choice.effect||{});alterBonds(choice.bond||{});
    let result=choice.result||'';
    if(choice.path)state.schoolPath=choice.path;
    if(choice.education){
      const p=clamp(.2+state.level*.10+state.stats.knowledge*.003,.15,.84);
      state.schoolPath=choice.education==='กำลังศึกษาต่อ'
        ?(chance(p)?'ได้เข้าเรียนต่อ':'พยายามสมัครเรียนต่อ แต่ยังไม่สำเร็จ')
        :choice.education;
    }
    if(choice.move)result=tryMove()+' '+result;
    if(choice.action)result=act(choice.action)+' '+result;
    state.choices.push({age:state.age,year:state.year,title:evt.title,choice:choice.label,kind:pending.kind,automatic});
    state.lastOutcome=`${evt.title} — คุณเลือก “${choice.label}”\n${result.trim()||'ทางเลือกนี้ค่อย ๆ ส่งผลต่อชีวิตของคุณในปีถัดไป'}`;
    addRecord('choice',evt.title,`${choice.label} — ${result.trim()||'การตัดสินใจครั้งนี้ส่งผลต่อการพัฒนาตัวละคร'}`);
    state.pending=state.pendingQueue.shift()||null;
    save();if(!automatic)render();
  }
  function clearQueuedChoices(){
    // Explicit skip/auto uses the character's RNG to decide all pending prompts.
    let iterations=0;
    while(state.pending&&iterations++<5){
      const evt=getDecision(state.pending);
      if(!evt){state.pending=state.pendingQueue.shift()||null;continue;}
      decide(between(0,evt.options.length-1),true);
    }
  }
  function advance(n,skipChoices=false){
    if(!state||state.ended)return;
    for(let i=0;i<n;i++){
      if(state.pending){
        if(!state.auto&&!skipChoices)break;
        clearQueuedChoices();
        if(state.pending)break;
      }
      if(!simulateOneYear())break;
      if(state.pending&&!state.auto&&!skipChoices)break;
      if(skipChoices&&state.pending)clearQueuedChoices();
    }
    if(!state.ended)render();
  }
  function setFocus(key){
    if(!state||state.ended||!FOCUS_BY_AGE(state.age).includes(key))return;
    if(state.focus===key)return;
    stopAuto();state.focus=key;
    state.lastOutcome=`ปีนี้คุณตั้งใจให้เวลากับ “${LIFE_FOCUS[key].label}” มากขึ้น ผลของโฟกัสจะเริ่มสะสมเมื่อปีถัดไปดำเนินไป`;
    addRecord('choice','เปลี่ยนโฟกัสชีวิต',`เลือกทุ่มเวลากับ${LIFE_FOCUS[key].label} ผลสะสมรายปีเริ่มเมื่อก้าวสู่ปีถัดไป`);
    save();render();
  }
  function socialAction(kind){
    if(!state||state.ended||state.age<6||state.socialUsedYear===state.year)return;
    stopAuto();
    let result='';
    if(kind==='family'){
      const modifier=chance(.8)?between(5,9):between(-1,2);
      alterBonds({family:modifier});change({happiness:2,savings:-between(50,280)});
      result=modifier>2?'คุณแบ่งเวลาไปทำกิจกรรมหรือพูดคุยกับคนที่บ้าน ทำให้ความไว้ใจค่อย ๆ เพิ่มขึ้น':'แม้จะตั้งใจคุยกัน แต่บางเรื่องยังเห็นไม่ตรงกัน คุณได้ลองฟังและทำความเข้าใจ';
    }else if(kind==='friend'){
      if(!state.social.friend)result=meetFriend(.63);
      else{const name=state.social.friend.name;alterBonds({friend:between(5,10)});change({happiness:2,savings:-between(60,240)});result=`คุณหาเวลาเจอหรือพูดคุยกับ${name} ความสนิทกลับมาแน่นแฟ้นขึ้น`;}
    }else if(kind==='partner'&&state.age>=15){
      if(!state.social.partner)result=meetPartner(.35);
      else{const name=state.social.partner.name;alterBonds({partner:between(5,9)});change({happiness:2,savings:-between(60,300)});result=`คุณให้เวลากับ${name} รับฟังกันมากขึ้น และค่อย ๆ สร้างความไว้ใจ`;}
    }else return;
    state.socialUsedYear=state.year;
    state.lastOutcome=`คุณเลือกให้เวลากับ${LABEL[kind]}\n${result}`;
    state.choices.push({age:state.age,year:state.year,title:'เวลาสำหรับคนสำคัญ',choice:LABEL[kind],kind:'social',automatic:false});
    addRecord('relation',`เวลาสำหรับ${LABEL[kind]}`,result);
    save();render();
  }
  function toggleAuto(){
    if(!state||state.ended)return;
    if(timer){stopAuto();render();return;}
    state.auto=true;
    timer=window.setInterval(()=>{if(!state||state.ended){stopAuto();return;}advance(1);},400);
    render();
  }
  function stopAuto(){if(timer){clearInterval(timer);timer=null;}if(state)state.auto=false;}
  function resetToLanding(){
    stopAuto();
    if(!window.confirm('เริ่มชีวิตใหม่หรือไม่? ชีวิตที่ยังไม่จบจะถูกแทนที่ (ชีวิตที่จบแล้วจะยังเก็บในอุปกรณ์)'))return;
    state=null;try{localStorage.removeItem(STORAGE_KEY);}catch(_e){}
    show('landing');
  }
  function setText(id,val){$(id).textContent=String(val);}
  function renderFocus(){
    const allowed=FOCUS_BY_AGE(state.age);
    const target=$('focusOptions');target.replaceChildren();
    if(!allowed.length){
      $('focusCurrent').textContent='ช่วงปฐมวัย';
      const p=document.createElement('p');p.className='focus-locked';
      p.textContent='ช่วงวัยแรกเกิดถึง 5 ขวบยังขึ้นอยู่กับผู้ดูแลเป็นหลัก เมื่ออายุ 6 ปี คุณจะได้เลือกโฟกัสชีวิตด้วยตัวเอง';
      target.append(p);
      setText('focusHint','ยังไม่ใช่การตัดสินใจของเด็กคนนี้โดยตรง');return;
    }
    ensureFocus();
    setText('focusCurrent','กำลังโฟกัส: '+LIFE_FOCUS[state.focus].label);
    for(const key of allowed){
      const f=LIFE_FOCUS[key];const btn=document.createElement('button');btn.type='button';btn.className='focus-tile';
      btn.setAttribute('aria-pressed',String(state.focus===key));
      const icon=document.createElement('span');icon.className='focus-icon';icon.textContent=f.icon;
      const label=document.createElement('span');label.className='focus-name';label.textContent=f.label;
      const hint=document.createElement('span');hint.className='focus-description';hint.textContent=f.desc;
      btn.append(icon,label,hint);btn.onclick=()=>setFocus(key);target.append(btn);
    }
    const count=state.focusYears[state.focus]||0;
    setText('focusHint',`สะสมกับโฟกัสนี้ ${count} ปี · มีผลต่อค่าสถานะ ความผูกพัน และโอกาสสุ่มกิจกรรมในปีต่อ ๆ ไป`);
  }
  function renderSocial(){
    const list=$('socialList');list.replaceChildren();
    const people=[
      {key:'family',title:'ครอบครัว',desc:`ผู้ดูแลในวัยเด็ก: ${state.social.family.caregiver||'คนในบ้าน'}${state.children?' · ลูก '+state.children+' คน':''}`,person:state.social.family},
      {key:'friend',title:state.social.friend?state.social.friend.name:'เพื่อนสนิท',desc:state.social.friend?`รู้จักกันตั้งแต่อายุ ${state.social.friend.sinceAge} ปี`:'ยังไม่มีเพื่อนสนิทที่บันทึกไว้',person:state.social.friend},
      {key:'partner',title:state.social.partner?state.social.partner.name:'คนรัก',desc:state.social.partner?`${state.social.partner.stage} · ตั้งแต่อายุ ${state.social.partner.sinceAge} ปี`:'ยังไม่มีความสัมพันธ์แบบคู่รัก',person:state.social.partner}
    ];
    for(const entry of people){
      const div=document.createElement('div');div.className='social-person';
      const head=document.createElement('div');head.className='social-person-header';
      const texts=document.createElement('div');
      const name=document.createElement('div');name.className='social-person-name';name.textContent=entry.title;
      const desc=document.createElement('div');desc.className='social-person-desc';desc.textContent=entry.desc;
      texts.append(name,desc);head.append(texts);
      const value=document.createElement('span');value.className='social-person-score';value.textContent=entry.person?String(Math.round(entry.person.bond))+'/100':'—';head.append(value);
      div.append(head);
      if(entry.person){
        const track=document.createElement('div');track.className='track';
        const fill=document.createElement('div');fill.className='fill';fill.style.width=entry.person.bond+'%';track.append(fill);div.append(track);
      }
      list.append(div);
    }
    const actions=$('socialActionControls');actions.replaceChildren();
    const used=state.socialUsedYear===state.year;
    if(state.age<6){setText('socialActionHint','ช่วงนี้ความสัมพันธ์ถูกกำหนดโดยการดูแลของคนในครอบครัวเป็นหลัก');return;}
    const choices=[['family','🏡 คุยหรือทำกิจกรรมกับที่บ้าน'],['friend',state.social.friend?'🫶 หาเวลาให้เพื่อนสนิท':'🫶 ลองทำความรู้จักเพื่อนใหม่']];
    if(state.age>=15)choices.push(['partner',state.social.partner?'💗 ให้เวลากับคนรัก':'💗 เปิดใจทำความรู้จักใครสักคน']);
    for(const [kind,label] of choices){
      const button=document.createElement('button');button.type='button';button.className='social-action';
      button.disabled=used;button.textContent=label+(used?' · ใช้สิทธิ์แล้ว':' ↗');
      button.onclick=()=>socialAction(kind);actions.append(button);
    }
    setText('socialActionHint',used?'คุณใช้เวลากับคนสำคัญไปแล้วในปีนี้ · จะเลือกอีกครั้งได้ในปีหน้า':'เลือกได้ 1 กิจกรรมต่อปี · บางความสัมพันธ์อาจไม่ได้สมหวังทันที');
  }
  let decisionMinimized=false;
  const closeDecision=()=>{decisionMinimized=true;updateDecisionPortal();};
  const reopenDecision=()=>{decisionMinimized=false;updateDecisionPortal();};
  document.getElementById('decisionMinimize').addEventListener('click',closeDecision);
  document.getElementById('decisionReopen').addEventListener('click',reopenDecision);
  function updateDecisionPortal(){
    const pending=Boolean(state&&state.pending)&&!document.getElementById('lifeView').hidden;
    const shown=pending&&!decisionMinimized;
    document.getElementById('decisionBackdrop').hidden=!shown;
    document.getElementById('decisionPortal').hidden=!shown;
    document.getElementById('decisionReopen').hidden=!(pending&&decisionMinimized);
    if(document.body.classList?.toggle)document.body.classList.toggle('decision-open',shown);
  }
  function updateJourney(){
    const root=document.getElementById('journeyTrack');if(!root)return;
    const marks=[0,6,12,15,18,25,40,60,80,100].filter(v=>v<=Math.max(100,state.age+5));
    root.replaceChildren();
    const progress=document.createElement('div');progress.className='journey-progress';progress.style.width=Math.min(100,state.age/100*100)+'%';root.append(progress);
    for(const age of marks){const node=document.createElement('div');node.className='journey-node'+(state.age>=age?' passed':'')+(Math.abs(state.age-age)<4?' active':'');node.style.left=age+'%';const dot=document.createElement('span');dot.className='journey-dot';const title=document.createElement('strong');title.textContent=age+' ปี';const subtitle=document.createElement('small');subtitle.textContent=age===0?'เกิด':age===6?'วัยเรียน':age===12?'วัยรุ่น':age===18?'เริ่มต้นอนาคต':age===25?'วัยทำงาน':age===40?'วัยผู้ใหญ่':age===60?'เกษียณ':'เส้นทางชีวิต';node.append(dot,title,subtitle);root.append(node);}
  }
  function render(){
    if(!state)return;
    updateJourney();
    document.getElementById('decisionMeta').textContent=`พ.ศ. ${state.year} · อายุ ${state.age} ปี · ทางเลือกของคุณ`;
    setText('birthLine',`เกิด พ.ศ. ${state.birthYear} · ${state.sex} · จุดเริ่มต้นอยู่ที่${state.birthProvinceHistorical}`);
    setText('currentYear',`พ.ศ. ${state.year}`);setText('currentAge',`${state.age} ปี`);
    setText('seedLabel',String(state.seed).padStart(10,'0'));
    const isFuture=state.year>CURRENT_BE;
    $('phase').className='phase '+(isFuture?'future':'historical');
    setText('phase',isFuture?'อนาคตจำลอง · Scenario':'ช่วงปีประวัติศาสตร์');
    setText('birthProvince',state.birthProvinceHistorical);
    setText('birthOldProvince',state.birthProvinceHistorical===state.birthProvince?'อ้างอิงชื่อจังหวัดในปีที่เกิด':`พื้นที่ปัจจุบันคือ จ.${state.birthProvince} (แยกจังหวัดภายหลัง)`);
    setText('birthYearDisplay',`พ.ศ. ${state.birthYear}`);
    setText('birthHousehold',state.family);setText('birthArea',state.area);setText('birthLevel',`ระดับ ${state.level}/5 · จำลอง`);
    setText('storyTag',isFuture?'เหตุการณ์ส่วนตัว · อนาคตจำลอง':'เหตุการณ์ส่วนตัว · จำลอง');
    setText('storyYear',`พ.ศ. ${state.year}`);
    setText('storyTitle',state.lastStory.title);setText('storyText',state.lastStory.text);
    const outcome=$('outcomeNote');
    if(state.lastOutcome){outcome.hidden=false;outcome.replaceChildren();
      const header=document.createElement('strong');header.textContent='ผลของทางเลือก / เหตุการณ์ในชีวิตจำลอง';
      const body=document.createElement('div');body.textContent=state.lastOutcome;body.style.whiteSpace='pre-line';outcome.append(header,body);
    }else outcome.hidden=true;
    const historyBox=$('historyCallout');
    if(state.thisYearHistory.length){
      historyBox.hidden=false;historyBox.replaceChildren();
      for(const event of state.thisYearHistory){
        const title=document.createElement('strong');title.textContent='บันทึกเหตุการณ์จริง: '+event.title;
        const p=document.createElement('p');p.textContent=event.summary;
        const a=document.createElement('a');a.href=event.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='อ่านแหล่งอ้างอิง ↗';
        historyBox.append(title,p,a);
        if(event.personalNote){const note=document.createElement('p');note.className='local-impact';note.textContent='* '+event.personalNote;historyBox.append(note);}
      }
    }else historyBox.hidden=true;
    renderFocus();
    const scores=[['health','สุขภาพ'],['happiness','ความสุข'],['knowledge','การเรียนรู้'],['relationships','ความสัมพันธ์']];
    $('scoreList').replaceChildren();
    for(const [key,label] of scores){
      const outer=document.createElement('div');outer.className='score';const head=document.createElement('div');head.className='score-head';
      const name=document.createElement('span');name.textContent=label;
      const val=document.createElement('strong');val.textContent=String(Math.round(state.stats[key]));head.append(name,val);
      const track=document.createElement('div');track.className='track';const bar=document.createElement('div');bar.className='fill';bar.style.width=state.stats[key]+'%';track.append(bar);
      outer.append(head,track);$('scoreList').append(outer);
    }
    renderSocial();
    const facts=[['จังหวัดปัจจุบัน',provinceAtBirth(state.residence,state.year,state.bornMonth,state.bornDay)],['การศึกษา',state.schoolPath],
      ['อาชีพ',state.job],['สถานะความสัมพันธ์',state.social.partner?(state.social.partner.stage+' · '+state.social.partner.name):'โสด / ไม่ได้คบใคร'],
      ['ลูก (จำลอง)',String(state.children)+' คน'],['เงินสำรอง (บาทจำลอง)','฿'+format(state.savings)]];
    $('factList').replaceChildren();
    for(const [key,value] of facts){const line=document.createElement('div');line.className='fact';
      const a=document.createElement('span');a.textContent=key;const b=document.createElement('strong');b.textContent=value;line.append(a,b);$('factList').append(line);}
    setText('recordCount',`${state.records.length} รายการ`);$('recordList').replaceChildren();
    for(const item of state.records.slice(-14).reverse()){
      const line=document.createElement('div');line.className='record '+item.type;
      const when=document.createElement('div');when.className='record-time';when.textContent='พ.ศ. '+item.year;
      const age=document.createElement('small');age.textContent='อายุ '+item.age+' ปี';when.append(age);
      const data=document.createElement('div');const title=document.createElement('h4');title.textContent=item.title;
      const body=document.createElement('p');body.textContent=item.text;data.append(title,body);line.append(when,data);$('recordList').append(line);
    }
    if(state.pending){
      const evt=getDecision(state.pending);
      if(evt){
        $('choiceBox').hidden=false;
        setText('choiceKind',state.pending.kind==='milestone'?'จุดเปลี่ยนสำคัญของช่วงวัย':'กิจกรรมสุ่มตามวัย · เรื่องราวจำลอง');
        setText('choiceTitle',evt.title);setText('choiceQuestion',evt.question);
        $('choiceOptions').replaceChildren();
        for(let i=0;i<evt.options.length;i++){
          const opt=evt.options[i];const btn=document.createElement('button');btn.className='choice';btn.type='button';
          const title=document.createElement('strong');title.textContent=opt.label;
          const hint=document.createElement('span');hint.textContent=opt.hint;btn.append(title,hint);
          btn.onclick=()=>decide(i);$('choiceOptions').append(btn);
        }
      }else $('choiceBox').hidden=true;
    }else $('choiceBox').hidden=true;
    if(!state.pending)decisionMinimized=false;
    updateDecisionPortal();
    $('stepBtn').disabled=Boolean(state.pending);
    $('tenBtn').disabled=false;
    setText('autoBtn',timer?'Ⅱ หยุดเดินอัตโนมัติ':'▶ เดินอัตโนมัติ');
    setText('controlNote',state.pending
      ?`มีกิจกรรมให้เลือกก่อนเดินต่อ${state.pendingQueue.length?' · ปีนี้ยังมีอีก '+state.pendingQueue.length+' เรื่องหลังจากนี้':''} · หากกดข้าม 10 ปี ระบบจะสุ่มคำตอบให้`
      :isFuture?'ปีนี้เป็นอนาคตจำลอง ไม่ใช่เหตุการณ์ที่เกิดขึ้นจริง · โฟกัสและคนสำคัญมีผลต่อเส้นทางชีวิต'
      :'ข่าวประวัติศาสตร์จัดตามปีจริง ส่วนกิจกรรมที่เลือกเป็นเรื่องสมมติ · ปีถัดไปอาจมีทางเลือกใหม่');
  }
  function storeLifeArchive(){
    try{const items=JSON.parse(localStorage.getItem(LAST_LIVES_KEY)||'[]');
      items.unshift({seed:state.seed,birthYear:state.birthYear,province:state.birthProvinceHistorical,age:state.age,deathYear:state.year,choices:state.choices.length});
      localStorage.setItem(LAST_LIVES_KEY,JSON.stringify(items.slice(0,10)));}catch(_e){}
  }
  function summaryString(){
    const partner=state.social.partner?`${state.social.partner.stage}กับ${state.social.partner.name}`:'ไม่มีคู่ชีวิตในช่วงสุดท้าย';
    return ['เกิดใหม่ในไทย · หนึ่งชีวิตที่ไม่ได้เลือกจุดเริ่มต้น',
      `เกิด พ.ศ. ${state.birthYear} ที่ ${state.birthProvinceHistorical}`,
      `เดินทางถึงอายุ ${state.age} ปี · เสียชีวิต พ.ศ. ${state.year} (โลกจำลอง)`,
      `จังหวัดสุดท้าย: ${state.residence}`,`การศึกษา: ${state.schoolPath}`,`อาชีพ: ${state.job}`,
      `ความรัก: ${partner}`,`ลูก: ${state.children} คน`,
      `การตัดสินใจที่บันทึกไว้: ${state.choices.length} ครั้ง`,
      `โฟกัสที่ใช้ชีวิตมากที่สุด: ${mainFocusLabel()}`,
      '#เกิดใหม่ในไทย','หมายเหตุ: เป็นเรื่องราวจำลอง ไม่ใช่คำทำนายรายบุคคล'].join('\n');
  }
  function mainFocusLabel(){
    const entries=Object.entries(state.focusYears);
    if(!entries.length)return '—';
    const top=entries.sort((a,b)=>b[1]-a[1])[0];
    return`${LIFE_FOCUS[top[0]]?.label||top[0]} (${top[1]} ปี)`;
  }
  function renderEnd(){
    setText('endAge',state.age);setText('endSeed','SEED '+state.seed);
    const facts=[
      ['จังหวัดที่เกิด',state.birthProvinceHistorical],['ปีเกิด','พ.ศ. '+state.birthYear],
      ['ปีที่ชีวิตสิ้นสุด','พ.ศ. '+state.year],['จังหวัดสุดท้าย',state.residence],
      ['เส้นทางการศึกษา',state.schoolPath],['อาชีพ',state.job],
      ['ครอบครัวและคนรัก',state.social.partner?`${state.social.partner.stage}กับ${state.social.partner.name}`:'ไม่มีคู่ชีวิตในช่วงสุดท้าย'],
      ['เพื่อนคนสำคัญ',state.social.friend?state.social.friend.name:'—'],
      ['ลูก',state.children+' คน'],['โฟกัสหลัก',mainFocusLabel()],
      ['จำนวนการตัดสินใจ',state.choices.length+' ครั้ง'],['บันทึกเหตุการณ์',state.records.length+' รายการ']];
    $('endFacts').replaceChildren();
    for(const [label,value] of facts){const div=document.createElement('div');div.className='end-fact';
      const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=value;div.append(a,b);$('endFacts').append(div);}
  }
  async function copySummary(){
    if(!state)return;const content=summaryString();
    try{await navigator.clipboard.writeText(content);}
    catch(_e){const t=document.createElement('textarea');t.value=content;t.style.position='fixed';t.style.opacity='0';
      document.body.append(t);t.select();document.execCommand('copy');t.remove();}
    const btn=$('copySummaryBtn');const old=btn.textContent;btn.textContent='คัดลอกแล้ว ✓';window.setTimeout(()=>{btn.textContent=old;},1800);
  }
})();
