'use strict';
const fs=require('fs'), vm=require('vm'), assert=require('assert');
class Element {
  constructor(tag='div') {
    this.tagName=tag;this.value='';this.textContent='';this.innerHTML='';this.style={};this.listeners={};this.children=[];
    this.hidden=false;this.disabled=false;this.className='';this.attributes={};this.href='';
  }
  addEventListener(key,fn){this.listeners[key]=fn;}
  appendChild(node){this.children.push(node);return node;}
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=items;}
  setAttribute(k,v){this.attributes[k]=v;}
  select(){}remove(){}showModal(){}
}
const storage=new Map();const ui=new Map();
const element=id=>{if(!ui.has(id))ui.set(id,new Element(id));return ui.get(id);};
const click=(id)=>ui.get(id).listeners.click();
const intervalControl={fn:null};
element('startBtn').disabled=true;
const sandbox={
  Date,Math,JSON,Object,Array,Number,String,Uint32Array,console,
  document:{getElementById:element,querySelector:()=>new Element('div'),createElement:tag=>new Element(tag),body:new Element('body'),execCommand:()=>true},
  localStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)||null,removeItem:k=>storage.delete(k)},
  navigator:{clipboard:{writeText:async()=>true}},
  crypto:{getRandomValues:x=>{x[0]=33881241}},
  setTimeout:fn=>fn(),confirm:()=>true
};
sandbox.window=sandbox;sandbox.scrollTo=()=>{};
sandbox.setInterval=fn=>{intervalControl.fn=fn;return 1;};sandbox.clearInterval=()=>{intervalControl.fn=null;};
vm.createContext(sandbox);
for(const path of ['data.js','events.js','sim.js']){
  vm.runInContext(fs.readFileSync(__dirname+'/assets/'+path,'utf8'),sandbox,{filename:path});
}
const key='koet-mai-thai-life-v02';
const read=()=>JSON.parse(storage.get(key));
assert.equal(sandbox.THAI_PROVINCES.length,77);
assert.equal(new Set(sandbox.THAI_PROVINCES).size,77);
assert(sandbox.LIFE_ACTIVITIES.length>=30,'30+ activity templates');
assert(ui.get('startBtn').disabled,'mandatory birth year');
assert.equal(ui.get('birthYear').children.length,77,'years 2493–2569');
// School year interactive path.
ui.get('birthYear').value='2530';ui.get('birthYear').listeners.change();click('startBtn');
let life=read();assert.equal(life.year,2530);assert.equal(life.age,0);
for(let age=1;age<=6;age++){
  if(life.pending){const option=ui.get('choiceOptions').children[0];option.onclick();life=read();}
  click('stepBtn');life=read();
}
assert.equal(life.age,6);assert(life.pending);
assert.equal(life.pending.kind,'milestone','age6 milestone');
assert.equal(life.pendingQueue.length,1,'age6 extra activity queued');
assert.equal(ui.get('focusOptions').children.length,5,'school has five focus options');
// Choose sports focus, and verify one yearly social action per year.
ui.get('focusOptions').children.find(n=>n.textContent==='NA')?.onclick?.();
const sports=ui.get('focusOptions').children[1];sports.onclick();life=read();assert.equal(life.focus,'sports');
ui.get('socialActionControls').children[0].onclick();life=read();assert.equal(life.socialUsedYear,life.year);
const firstChoices=life.choices.length;
ui.get('socialActionControls').children[0].onclick();assert.equal(read().choices.length,firstChoices,'social action cannot be used twice per year');
// Work through first milestone and activity; no year advance until both resolved.
ui.get('choiceOptions').children[0].onclick();life=read();assert.equal(life.pending.kind,'activity');
ui.get('choiceOptions').children[0].onclick();life=read();assert.equal(life.pending,null);
click('stepBtn');life=read();assert.equal(life.age,7);assert.equal(life.pending.kind,'activity');
const available=ui.get('choiceOptions').children.length;assert(available>=2,'activity has 2+ options');
const yearly=[];
for(let expectedAge=7;expectedAge<=18;expectedAge++){
  while(life.pending){ui.get('choiceOptions').children[0].onclick();life=read();}
  yearly.push({age:expectedAge,choices:life.choices.filter(c=>c.age===expectedAge&&c.kind==='activity').length});
  if(expectedAge<18){click('stepBtn');life=read();assert.equal(life.age,expectedAge+1);}
}
assert(yearly.every(row=>row.choices===1),'one random activity every age 7–18');
assert(life.choices.length>17,'more decisions than v0.1 age18');
assert(life.records.some(record=>record.type==='history'&&record.year===2540),'1997 historical event appears');
// Age 18 focus list includes romance; love may develop through explicit action.
assert(ui.get('focusOptions').children.length===6);
assert(ui.get('socialActionControls').children.length===3);
console.log('PASS: Required birth year; school activities EVERY year age 6–18; stage-changing focus; family/friend/romance actions; 2540 chronology.');
// Auto chooses queued choices and should complete life in a future year.
click('autoBtn');
for(let i=0;i<160&&intervalControl.fn;i++)intervalControl.fn();
life=read();
assert(life.ended,'auto reaches death');assert.equal(life.age,life.year-life.birthYear);
assert(life.year>2569,'life continues into simulated future');
assert(life.records.some(r=>r.type==='death'));
assert(life.choices.length>25,'many interactive decisions accumulated');
assert(life.focusYears && Object.values(life.focusYears).some(v=>v>0));
console.log('PASS: Automated life ends, calendar remains consistent, >=25 decisions, multiple relationship/life systems.');
console.log('Result:',{born:life.birthYear,death:life.year,age:life.age,choices:life.choices.length,children:life.children,friend:life.social.friend?.name,partner:life.social.partner?.name});
// Starting 2569 must permit future continuation.
ui.get('birthYear').value='2569';click('startBtn');click('autoBtn');
for(let i=0;i<160&&intervalControl.fn;i++)intervalControl.fn();
life=read();assert(life.ended&&life.year>=2570);
// No past-dated tech activity may appear before availability year.
ui.get('birthYear').value='2493';click('startBtn');click('autoBtn');
for(let i=0;i<80&&intervalControl.fn;i++)intervalControl.fn();
life=read();
assert(!life.records.some(r=>r.title==='คลิปเรียนออนไลน์'&&r.year<2556),'no online school before BE2556');
console.log('PASS: Future birth life and technology chronology gates.');
// Explicit 10-year skip should auto-resolve prompts rather than stopping at first school event.
ui.get('birthYear').value='2530';click('startBtn');
let beforeSkip=read();assert.equal(beforeSkip.age,0);
click('tenBtn');
let afterSkip=read();
assert.equal(afterSkip.age,10,'10-year skip advances ten years');
assert.equal(afterSkip.pending,null,'skip resolves all queued activities');
assert(afterSkip.choices.filter(c=>c.kind==='activity').length>=5,'skip recorded intervening school activities');
assert(afterSkip.choices.some(c=>c.automatic),'skipped options marked automatic');
console.log('PASS: 10-year skip resolves all skipped choices without losing the chronology.');
