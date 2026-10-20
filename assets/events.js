/*
 * Fictional Thai-life activity catalogue for MVP v0.2.
 * These are narrative prompts, NOT claims about actual events in a given year.
 * Entries with historical technology context are gated using sinceBE.
 * No content in this catalogue is a verified national history event.
 */
window.LIFE_FOCUS = {
  learning:   {label:'การเรียนรู้',icon:'📚',desc:'สะสมความรู้และโอกาสเรียนต่อ',effect:{knowledge:2,happiness:-1},bond:{}},
  sports:     {label:'กีฬาและสุขภาพ',icon:'🏸',desc:'สุขภาพดีขึ้น ได้ทำกิจกรรม',effect:{health:2,happiness:1},bond:{}},
  friends:    {label:'เพื่อนและสังคม',icon:'🫶',desc:'ให้เวลากับมิตรภาพ',effect:{relationships:1},bond:{friend:3}},
  family:     {label:'ครอบครัว',icon:'🏡',desc:'ดูแลและสร้างความไว้ใจในบ้าน',effect:{happiness:1,relationships:1},bond:{family:3}},
  creativity: {label:'งานอดิเรก',icon:'🎨',desc:'ค้นหาตัวตนและสิ่งที่ชอบ',effect:{knowledge:1,happiness:2,savings:-110},bond:{}},
  romance:    {label:'ความรัก',icon:'💗',desc:'เปิดใจและใส่ใจความสัมพันธ์',effect:{happiness:1,relationships:1},bond:{partner:3}},
  career:     {label:'งานและทักษะ',icon:'💼',desc:'มุ่งสร้างประสบการณ์ทำงาน',effect:{knowledge:1,happiness:-1,savings:1350},bond:{}},
  money:      {label:'การเงิน',icon:'💰',desc:'เน้นเก็บเงินและความมั่นคง',effect:{savings:1650,happiness:-1},bond:{}},
  health:     {label:'ดูแลตัวเอง',icon:'🌿',desc:'ออกกำลัง พักผ่อน ตรวจสุขภาพ',effect:{health:2,happiness:1,savings:-240},bond:{}},
  leisure:    {label:'ใช้ชีวิตให้เต็มที่',icon:'☀️',desc:'พักผ่อนและใช้เวลาอย่างมีความหมาย',effect:{happiness:2,health:1,savings:-250},bond:{}}
};
window.FOCUS_BY_AGE = age => {
  if(age < 6) return [];
  if(age <= 12) return ['learning','sports','friends','family','creativity'];
  if(age <= 18) return ['learning','sports','friends','family','creativity','romance'];
  if(age <= 29) return ['career','learning','money','friends','romance','family','health'];
  if(age <= 59) return ['career','money','health','family','romance','friends','learning'];
  return ['health','family','friends','leisure','learning','romance'];
};

/* ageMin/ageMax inclusive. condition is a known predicate string evaluated by the game engine. */
window.LIFE_ACTIVITIES = [
  // Primary school: one interactive activity each school year.
  {id:'school-club',min:6,max:12,tag:'learning',title:'ชมรมหลังเลิกเรียน',question:'โรงเรียนเปิดรับสมัครกิจกรรมหลังเลิกเรียน คุณสนใจอะไร?',options:[
    {label:'เข้าชมรมวาดรูปและงานประดิษฐ์',hint:'ใช้ความคิดสร้างสรรค์ ได้รู้จักเพื่อนใหม่',effect:{knowledge:2,happiness:3,savings:-180},bond:{friend:2},result:'คุณลองสร้างผลงานชิ้นแรก บางวันทำได้ดี บางวันต้องเริ่มใหม่ แต่ก็สนุกกับมัน'},
    {label:'เข้าชมรมกีฬา',hint:'ฝึกวินัยและทำงานเป็นทีม',effect:{health:3,relationships:2},bond:{friend:2},result:'คุณเริ่มคุ้นเคยกับการซ้อมและเพื่อนร่วมทีม'},
    {label:'กลับบ้านไปช่วยงานบ้าน',hint:'แบ่งเบาภาระของผู้ใหญ่',effect:{relationships:2,happiness:1},bond:{family:5},result:'คนที่บ้านเริ่มไว้วางใจให้คุณรับผิดชอบสิ่งเล็ก ๆ มากขึ้น'}
  ]},
  {id:'friend-next-seat',min:6,max:12,tag:'friends',title:'คนที่นั่งข้างกัน',question:'มีเพื่อนใหม่เข้ามาในห้อง เขาดูไม่ค่อยกล้าคุยกับใคร คุณจะทำอย่างไร?',options:[
    {label:'เดินเข้าไปชวนคุย',hint:'อาจได้เพื่อนสนิทคนใหม่',action:'meetFriend',bond:{friend:2},effect:{relationships:2},result:'คุณเริ่มต้นด้วยบทสนทนาง่าย ๆ ความคุ้นเคยค่อย ๆ ก่อตัว'},
    {label:'ชวนเข้ากลุ่มทำงาน',hint:'ได้ลองทำงานร่วมกัน',action:'meetFriend',effect:{knowledge:1,relationships:1},result:'งานกลุ่มกลายเป็นโอกาสให้ได้รู้จักกันมากขึ้น'},
    {label:'ให้เวลาเขาปรับตัว',hint:'เคารพพื้นที่ส่วนตัว',effect:{happiness:1},result:'คุณไม่ได้เร่งความสัมพันธ์ ปล่อยให้มิตรภาพเกิดขึ้นตามธรรมชาติ'}
  ]},
  {id:'exam-group',min:7,max:12,tag:'learning',title:'งานกลุ่มที่ทุกคนไม่เท่ากัน',question:'เพื่อนบางคนยังทำงานกลุ่มไม่ทัน คุณจะจัดการอย่างไร?',options:[
    {label:'ช่วยอธิบายและแบ่งงานใหม่',hint:'ได้ทั้งความรู้และความไว้ใจ',effect:{knowledge:3,relationships:2},bond:{friend:3},result:'กลุ่มเริ่มทำงานร่วมกันได้ดีขึ้น แม้ต้องใช้เวลามากกว่าเดิม'},
    {label:'รับผิดชอบงานส่วนใหญ่เอง',hint:'งานมีโอกาสเสร็จไว แต่คุณเหนื่อย',effect:{knowledge:2,happiness:-2},bond:{friend:-2},result:'งานเสร็จ แต่คุณเริ่มเข้าใจว่าทำทุกอย่างคนเดียวไม่ง่าย'},
    {label:'ขอคำปรึกษาคุณครู',hint:'เรียนรู้การขอความช่วยเหลือ',effect:{knowledge:2,health:1},result:'คุณครูช่วยจัดวิธีทำงานที่ทุกคนพอมีส่วนร่วมได้'}
  ]},
  {id:'school-sports',min:7,max:12,tag:'sports',title:'วันกีฬาสี',question:'โรงเรียนกำลังเตรียมงานกีฬาสี คุณอยากมีบทบาทแบบไหน?',options:[
    {label:'ลงแข่งกีฬา',hint:'ฝึกฝนและยอมรับผลการแข่งขัน',effect:{health:4,happiness:1},bond:{friend:2},result:'คุณได้รู้ว่าการฝึกซ้อมสำคัญไม่แพ้ผลที่สนาม'},
    {label:'ช่วยเพื่อนทำป้ายและเชียร์',hint:'ได้ทำงานร่วมกับเพื่อน',effect:{relationships:3,happiness:2},bond:{friend:4},result:'เสียงเชียร์และการลงมือช่วยกันทำให้ทีมใกล้ชิดขึ้น'},
    {label:'เชียร์เงียบ ๆ ที่ขอบสนาม',hint:'ใช้วันนั้นในจังหวะของตัวเอง',effect:{happiness:1,health:1},result:'แม้ไม่ได้ลงแข่ง คุณก็ได้เห็นหลายมุมของคนรอบตัว'}
  ]},
  {id:'family-weekend',min:6,max:13,tag:'family',title:'วันหยุดของครอบครัว',question:'คนที่บ้านมีเวลาว่างตรงกันไม่บ่อยนัก คุณอยากทำอะไร?',options:[
    {label:'ชวนทำอาหารหรือกินข้าวด้วยกัน',hint:'เพิ่มความใกล้ชิด ใช้เงินไม่มาก',effect:{happiness:2},bond:{family:7},result:'บทสนทนาธรรมดาบนโต๊ะอาหารกลายเป็นความทรงจำดี ๆ'},
    {label:'ออกไปเที่ยวใกล้บ้าน',hint:'ได้เปลี่ยนบรรยากาศ แต่มีรายจ่าย',effect:{happiness:4,savings:-550},bond:{family:4},result:'วันนี้มีเรื่องเล่าใหม่กลับมาที่บ้าน'},
    {label:'พักผ่อนอยู่คนเดียว',hint:'ฟื้นพลัง แต่ใช้เวลาร่วมกันน้อยลง',effect:{health:2,happiness:1},bond:{family:-1},result:'คุณมีเวลาเงียบ ๆ ให้ตัวเองและกลับมาพร้อมพลังมากขึ้น'}
  ]},
  {id:'school-trip',min:8,max:12,tag:'friends',title:'ทัศนศึกษานอกห้องเรียน',question:'โรงเรียนจัดกิจกรรมนอกสถานที่และมีค่าเดินทางบางส่วน คุณจะทำอย่างไร?',options:[
    {label:'ขอไปกับเพื่อน',hint:'ได้ประสบการณ์ แต่มีค่าใช้จ่าย',effect:{knowledge:2,happiness:3,savings:-450},bond:{friend:3},result:'คุณได้เห็นโลกนอกห้องเรียนในมุมที่หนังสือบอกไม่ได้'},
    {label:'เลือกกิจกรรมใกล้บ้านแทน',hint:'ลดภาระค่าใช้จ่าย',effect:{knowledge:2,savings:150},bond:{family:2},result:'คุณลองสังเกตสิ่งรอบบ้านและพบเรื่องใหม่ที่ไม่เคยสนใจ'},
    {label:'ช่วยงานคนที่บ้าน',hint:'ครอบครัวได้ประโยชน์ แต่พลาดกิจกรรม',effect:{relationships:2,happiness:-1},bond:{family:4},result:'คุณช่วยแบ่งเบาภาระที่บ้าน แม้จะเสียดายเรื่องทัศนศึกษา'}
  ]},
  {id:'art-show',min:6,max:12,tag:'creativity',title:'เวทีแสดงความสามารถ',question:'มีเวทีเล็ก ๆ ให้เด็กลองแสดงหรือเล่าเรื่อง คุณจะลองหรือไม่?',options:[
    {label:'ขึ้นไปลองด้วยตัวเอง',hint:'กล้าแสดงออกและค้นหาความถนัด',effect:{knowledge:2,happiness:3,relationships:1},result:'หัวใจเต้นแรง แต่คุณภูมิใจที่กล้าขึ้นไป'},
    {label:'ช่วยเพื่อนเตรียมงานหลังเวที',hint:'เก่งขึ้นจากการลงมือทำร่วมกัน',effect:{knowledge:2},bond:{friend:4},result:'งานเบื้องหลังช่วยให้คุณเข้าใจความสำเร็จของทั้งทีม'},
    {label:'เป็นผู้ชมที่ตั้งใจ',hint:'ได้แรงบันดาลใจโดยไม่ต้องแข่งขัน',effect:{happiness:2},result:'คุณกลับบ้านพร้อมไอเดียว่าอยากลองทำอะไรบ้าง'}
  ]},
  {id:'money-at-school',min:9,max:12,tag:'family',title:'เงินค่าขนม',question:'คุณเหลือเงินค่าขนมเล็กน้อย อยากทำอะไรกับมัน?',options:[
    {label:'เก็บไว้สำหรับของที่อยากได้',hint:'ฝึกอดทนและวางแผน',effect:{savings:220,knowledge:1},result:'คุณเริ่มเห็นว่าการเก็บทีละน้อยทำให้บางสิ่งเป็นไปได้'},
    {label:'ซื้อขนมแบ่งเพื่อน',hint:'ได้ความสุขร่วมกัน แต่เงินลดลง',effect:{happiness:3,savings:-100},bond:{friend:3},result:'มื้อขนมเล็ก ๆ กลายเป็นช่วงเวลาที่เพื่อนจำได้'},
    {label:'ซื้อของเล็ก ๆ ให้คนที่บ้าน',hint:'แสดงความใส่ใจต่อครอบครัว',effect:{savings:-100,happiness:2},bond:{family:4},result:'คนที่บ้านยิ้มกับของเล็กน้อยที่คุณนำมาให้'}
  ]},
  {id:'friend-argument',min:9,max:18,tag:'friends',condition:'hasFriend',title:'เรื่องเข้าใจผิดกับเพื่อน',question:'คุณกับเพื่อนสนิทมีเรื่องไม่เข้าใจกัน จะรับมืออย่างไร?',options:[
    {label:'คุยกันตรง ๆ',hint:'ต้องใช้ความกล้า แต่ช่วยสร้างความไว้ใจ',bond:{friend:6},effect:{relationships:2},result:'บทสนทนาไม่ง่าย แต่ต่างคนเริ่มรับฟังกันมากขึ้น'},
    {label:'ขอเวลาแล้วค่อยกลับมาคุย',hint:'ลดการปะทะทันที',bond:{friend:1},effect:{health:1},result:'การเว้นระยะช่วยให้คุณเรียบเรียงความรู้สึกได้'},
    {label:'ปล่อยให้เวลาผ่านไป',hint:'อาจห่างกันออกไป',bond:{friend:-7},effect:{happiness:-2},result:'เรื่องไม่ได้บานปลาย แต่ความสนิทใจลดลงไปเล็กน้อย'}
  ]},
  {id:'help-younger',min:10,max:16,tag:'family',title:'คนที่บ้านต้องการความช่วยเหลือ',question:'มีงานบ้านเพิ่มขึ้นและคุณอยากทำกิจกรรมของตัวเองด้วย จะจัดเวลาอย่างไร?',options:[
    {label:'แบ่งเวลาช่วยบ้านและทำการบ้าน',hint:'อาจเหนื่อยขึ้น แต่ทุกฝ่ายพอไหว',effect:{knowledge:1,health:-1},bond:{family:6},result:'คุณเรียนรู้ว่าการแบ่งหน้าที่ต้องพูดคุยและช่วยกัน'},
    {label:'บอกตรง ๆ ว่ารับไม่ไหว',hint:'ตั้งขอบเขตอย่างสุภาพ',effect:{happiness:2},bond:{family:1},result:'คนที่บ้านเริ่มเข้าใจว่าคุณก็มีภาระของตัวเอง'},
    {label:'พักกิจกรรมส่วนตัวสักช่วง',hint:'ให้ความสำคัญกับบ้านเป็นอันดับแรก',effect:{knowledge:-1,happiness:-1},bond:{family:7},result:'คุณช่วยบ้านได้มากขึ้น แต่ก็คิดถึงสิ่งที่ตัวเองชอบ'}
  ]},
  {id:'online-study',schoolOnly:true,min:10,max:18,sinceBE:2556,tag:'learning',title:'คลิปเรียนออนไลน์',question:'คุณเจอเนื้อหาออนไลน์ที่ช่วยอธิบายวิชายาก ๆ จะใช้มันอย่างไร?',options:[
    {label:'ลองจัดตารางเรียนจากคลิป',hint:'ได้ทบทวนด้วยตัวเอง',effect:{knowledge:4,happiness:-1},result:'คุณเจอวิธีอธิบายที่เข้ากับตัวเองมากขึ้น'},
    {label:'ชวนเพื่อนเรียนด้วยกัน',hint:'เรียนรู้และรักษามิตรภาพ',effect:{knowledge:2},bond:{friend:5},result:'การช่วยกันถามตอบทำให้ทั้งสองคนเห็นจุดที่ยังไม่เข้าใจ'},
    {label:'เลือกพักสายตาแล้วค่อยกลับมาดู',hint:'สมดุลการเรียนกับสุขภาพ',effect:{health:2,happiness:1},result:'คุณได้พักก่อน แล้วค่อยกลับมาทบทวนอย่างไม่กดดัน'}
  ]},
  // Secondary-school life.
  {id:'teen-club',schoolOnly:true,min:13,max:18,tag:'creativity',title:'เลือกชมรมที่ใช่',question:'เมื่อเริ่มโตขึ้น คุณอยากลองใช้เวลาหลังเรียนกับอะไร?',options:[
    {label:'วงดนตรี / ศิลปะ / สร้างสรรค์',hint:'ค้นหาตัวเองและเพื่อนกลุ่มใหม่',effect:{happiness:4,knowledge:2},bond:{friend:2},result:'คุณค่อย ๆ มีผลงานที่รู้สึกว่าเป็นของตัวเอง'},
    {label:'วิทยาศาสตร์ / ประดิษฐ์ / ทดลอง',hint:'สร้างทักษะการแก้ปัญหา',effect:{knowledge:4,happiness:1},result:'การลองผิดลองถูกทำให้คุณค้นพบความอดทนรูปแบบใหม่'},
    {label:'กีฬา / อาสาสมัคร',hint:'ฝึกทีมเวิร์กและความรับผิดชอบ',effect:{health:3,relationships:2},bond:{friend:2},result:'คุณได้เห็นตัวเองเวลาทำงานร่วมกับคนอื่น'}
  ]},
  {id:'parents-expect',min:13,max:18,tag:'family',title:'ความคาดหวังที่บ้าน',question:'ผู้ใหญ่มีภาพอนาคตให้คุณ แต่คุณเริ่มมีความฝันของตัวเองแล้ว',options:[
    {label:'ลองคุยเรื่องที่อยากทำ',hint:'อาจไม่เห็นตรงกัน แต่ได้เปิดใจ',bond:{family:4},effect:{happiness:2,knowledge:1},result:'ไม่ได้ทุกคำตอบในวันเดียว แต่คนที่บ้านได้ฟังเสียงของคุณ'},
    {label:'ทำตามคำแนะนำไปก่อน',hint:'รักษาความสงบ แต่คุณอาจค้างคาใจ',bond:{family:3},effect:{happiness:-2,knowledge:2},result:'คุณเดินตามเส้นทางที่บ้านเห็นว่าปลอดภัย แล้วค่อยคิดทบทวนต่อ'},
    {label:'ลองหาข้อมูลและเตรียมแผน',hint:'ใช้เหตุผลคุยในครั้งถัดไป',effect:{knowledge:4},bond:{family:1},result:'แผนที่เป็นรูปธรรมช่วยให้การคุยครั้งต่อไปง่ายขึ้น'}
  ]},
  {id:'teen-friend-new',schoolOnly:true,min:13,max:18,tag:'friends',condition:'noFriend',title:'เพื่อนคนใหม่ในโรงเรียน',question:'คุณเริ่มเจอคนที่มีความสนใจคล้ายกัน จะลองเป็นเพื่อนกันไหม?',options:[
    {label:'ชวนไปทำกิจกรรมด้วยกัน',hint:'อาจเกิดมิตรภาพใหม่',action:'meetFriend',effect:{happiness:2},result:'คุณเริ่มรู้จักกันจากความชอบเล็ก ๆ ที่เหมือนกัน'},
    {label:'เริ่มด้วยการคุยเรื่องเรียน',hint:'ค่อย ๆ สร้างความคุ้นเคย',action:'meetFriend',effect:{knowledge:1},result:'ความสนิทเริ่มจากคำถามธรรมดาระหว่างคาบเรียน'},
    {label:'ขอใช้เวลาอยู่กับตัวเองก่อน',hint:'ไม่มีข้อบังคับว่าต้องเข้าสังคมทันที',effect:{health:1},result:'ช่วงนี้คุณอยากค้นหาว่าตัวเองสบายใจกับอะไร'}
  ]},
  {id:'teen-sport',schoolOnly:true,min:13,max:18,tag:'sports',title:'แข่งกีฬาระดับโรงเรียน',question:'คุณมีโอกาสเข้าร่วมทีมแต่ต้องซ้อมหนักขึ้น',options:[
    {label:'ลองสมัครเป็นตัวจริง',hint:'ใช้เวลาฝึกและเพิ่มความฟิต',effect:{health:5,happiness:2,knowledge:-1},bond:{friend:2},result:'การซ้อมทำให้คุณได้รู้จักทั้งการแพ้ การชนะ และความรับผิดชอบ'},
    {label:'เข้าทีมแบบไม่เน้นแข่งขัน',hint:'ได้ขยับตัวและพบเพื่อน',effect:{health:3,relationships:2},bond:{friend:4},result:'คุณสนุกกับกีฬาโดยไม่ต้องแบกความคาดหวังมากนัก'},
    {label:'โฟกัสเรื่องเรียนปีนี้',hint:'ลดเวลาแข่งขัน เพิ่มเวลาอ่านหนังสือ',effect:{knowledge:4,health:-1},result:'ปีนี้คุณใช้เวลาในห้องสมุดมากกว่าสนามกีฬา'}
  ]},
  {id:'teen-crush',min:15,max:18,tag:'romance',condition:'single',title:'คนที่ทำให้ใจเต้น',question:'คุณเริ่มสนใจเพื่อนวัยใกล้กันคนหนึ่ง จะจัดการความรู้สึกอย่างไร?',options:[
    {label:'ค่อย ๆ ทำความรู้จักอย่างให้เกียรติ',hint:'ความสัมพันธ์อาจพัฒนา หรืออาจเป็นเพื่อน',action:'meetPartner',effect:{happiness:2},result:'คุณเปิดโอกาสให้ความสัมพันธ์ค่อย ๆ เติบโตโดยไม่เร่งอีกฝ่าย'},
    {label:'ชวนทำกิจกรรมกลุ่มก่อน',hint:'สานสัมพันธ์โดยไม่กดดัน',action:'meetFriend',effect:{relationships:2},result:'คุณได้เรียนรู้ว่าความสนิทไม่จำเป็นต้องเริ่มจากการคบกัน'},
    {label:'เก็บไว้เป็นความรู้สึกดี ๆ',hint:'ทุ่มเวลาให้ตัวเองก่อน',effect:{knowledge:2,happiness:1},result:'คุณยิ้มให้ความรู้สึกครั้งนี้โดยยังไม่ต้องรีบตัดสินใจ'}
  ]},
  {id:'teen-partner-talk',min:15,max:18,tag:'romance',condition:'hasPartner',title:'เวลาให้คนรักกับเวลาให้ตัวเอง',question:'ทั้งสองคนกำลังยุ่งเรื่องเรียนและเริ่มมีเวลาไม่ตรงกัน',options:[
    {label:'คุยกันเรื่องขอบเขตและเวลาว่าง',hint:'สื่อสารตรงไปตรงมา',bond:{partner:8},effect:{relationships:2},result:'คุณกับคนรักตกลงจังหวะที่สบายใจร่วมกัน'},
    {label:'พยายามเจอกันทุกวัน',hint:'สนิทขึ้น แต่กระทบการพักผ่อน',bond:{partner:5},effect:{health:-1,knowledge:-1,happiness:2},result:'ปีนี้คุณมีความทรงจำร่วมกันมากขึ้น และเริ่มต้องจัดเวลาใหม่'},
    {label:'ขอพื้นที่อ่านหนังสือและดูแลตัวเอง',hint:'รักษาพื้นที่ส่วนตัว',bond:{partner:-1},effect:{knowledge:3,health:1},result:'การพูดถึงเวลาส่วนตัวทำให้คุณได้เรียนรู้การเคารพขอบเขต'}
  ]},
  {id:'teen-exam',schoolOnly:true,min:14,max:18,tag:'learning',title:'ช่วงสอบที่สำคัญ',question:'เวลามีจำกัด แต่คุณอยากทำหลายอย่าง จะวางแผนอย่างไร?',options:[
    {label:'จัดตารางอ่านหนังสือจริงจัง',hint:'ความรู้เพิ่ม แต่ต้องระวังความเครียด',effect:{knowledge:5,happiness:-2},result:'คุณทบทวนเนื้อหาได้มากขึ้น แม้บางวันอยากพัก'},
    {label:'รวมกลุ่มติวกับเพื่อน',hint:'ได้เรียนและสนับสนุนกัน',effect:{knowledge:3},bond:{friend:4},result:'การอธิบายให้เพื่อนช่วยให้คุณจำเนื้อหาได้ดีขึ้น'},
    {label:'พักอย่างเป็นระบบ ไม่อดนอน',hint:'ดูแลสุขภาพไปพร้อมการสอบ',effect:{knowledge:2,health:3},result:'คุณพยายามรักษาจังหวะการอ่านและการพักให้พอดีกัน'}
  ]},
  {id:'community-volunteer',min:13,max:25,tag:'family',title:'กิจกรรมช่วยชุมชน',question:'มีกิจกรรมทำความสะอาดแหล่งน้ำหรือช่วยงานชุมชนใกล้บ้าน',options:[
    {label:'ไปเป็นอาสาสมัคร',hint:'รู้จักคนหลากหลายและเห็นปัญหาจริง',effect:{relationships:3,knowledge:2,health:1},result:'คุณได้เห็นว่าความเปลี่ยนแปลงเล็ก ๆ เริ่มจากคนลงมือทำ'},
    {label:'ช่วยวางแผนและประชาสัมพันธ์',hint:'ฝึกจัดการและสื่อสาร',effect:{knowledge:3,relationships:2},result:'แม้ไม่ได้ทำงานภาคสนาม คุณก็ช่วยให้งานเดินหน้าได้'},
    {label:'ดูแลภาระของคนที่บ้านก่อน',hint:'มีส่วนช่วยในรูปแบบที่ต่างกัน',bond:{family:4},effect:{happiness:1},result:'คุณช่วยงานที่บ้านซึ่งก็เป็นความรับผิดชอบสำคัญ'}
  ]},
  {id:'part-time',min:16,max:23,tag:'career',title:'โอกาสหารายได้ระหว่างเรียน',question:'มีงานพิเศษใกล้บ้านที่พอทำหลังเรียนได้ คุณจะลองหรือไม่?',options:[
    {label:'ลองทำงานบางวัน',hint:'ได้เงินและประสบการณ์ แต่เหนื่อยขึ้น',effect:{savings:3000,knowledge:2,health:-1,happiness:-1},result:'คุณเริ่มเห็นคุณค่าของเงินและการจัดเวลาของตัวเอง'},
    {label:'รับงานเฉพาะช่วงปิดเทอม',hint:'สมดุลระหว่างเรียนกับรายได้',effect:{savings:1500,knowledge:1},result:'คุณมีเวลาเตรียมตัวมากขึ้นก่อนเริ่มทำงานจริง'},
    {label:'ทุ่มเวลาให้การเรียนก่อน',hint:'เพิ่มความพร้อมสำหรับทางเลือกในอนาคต',effect:{knowledge:4},result:'คุณเลือกสะสมความรู้แทนรายได้ในช่วงนี้'}
  ]},
  {id:'early-relationship-conflict',min:15,max:35,tag:'romance',condition:'hasPartner',title:'ความเข้าใจที่ไม่ตรงกัน',question:'คุณกับคนรักคิดเห็นต่างกันเรื่องสำคัญ จะเลือกวิธีไหน?',options:[
    {label:'คุยอย่างเคารพกัน',hint:'ค่อย ๆ ทำความเข้าใจและตั้งขอบเขต',bond:{partner:7},effect:{relationships:2},result:'แม้ยังเห็นไม่ตรงกันทุกเรื่อง แต่การรับฟังทำให้ใกล้ชิดขึ้น'},
    {label:'ให้เวลาต่างคนต่างทบทวน',hint:'ได้พื้นที่ส่วนตัว ลดการเถียง',bond:{partner:1},effect:{health:2},result:'การเว้นระยะช่วยให้ทั้งคู่กลับมาคุยกันด้วยอารมณ์ที่สงบขึ้น'},
    {label:'ยุติความสัมพันธ์อย่างตรงไปตรงมา',hint:'บางความสัมพันธ์อาจไม่ใช่คำตอบ',action:'endPartner',effect:{happiness:-4},result:'คุณตัดสินใจเดินคนละทางด้วยความเคารพต่อกัน'}
  ]},
  // Young adult / work / partnership.
  {id:'young-friend-meet',min:19,max:35,tag:'friends',condition:'noFriend',title:'เพื่อนร่วมงานหรือเพื่อนร่วมกิจกรรม',question:'มีคนใหม่เข้ามาในชีวิต จะลองเปิดใจทำความรู้จักไหม?',options:[
    {label:'ชวนไปกินข้าวหรือทำกิจกรรม',hint:'อาจได้เพื่อนที่คุยกันได้ยาว ๆ',action:'meetFriend',effect:{happiness:2},result:'ความสนิทเริ่มต้นจากเวลาธรรมดาที่ได้ใช้ร่วมกัน'},
    {label:'ทำงานร่วมกันก่อน',hint:'ค่อย ๆ สร้างความไว้ใจ',action:'meetFriend',effect:{knowledge:1},result:'คุณเห็นทัศนคติของกันและกันผ่านการลงมือทำ'},
    {label:'รักษาระยะที่สบายใจ',hint:'ทุกคนมีระดับการเข้าสังคมต่างกัน',effect:{health:1},result:'คุณเลือกไม่เร่งความสัมพันธ์ใหม่ในปีนี้'}
  ]},
  {id:'young-romance',min:19,max:45,tag:'romance',condition:'single',title:'ใครบางคนเข้ามาในชีวิต',question:'คุณมีโอกาสทำความรู้จักคนที่สนใจเหมือนกัน ความสัมพันธ์นี้จะไปทางไหน?',options:[
    {label:'ชวนพูดคุยและทำความรู้จักกันต่อ',hint:'มีโอกาสเริ่มคบหา ไม่รับประกันผล',action:'meetPartner',effect:{happiness:2},result:'คุณให้พื้นที่กับความรู้สึกใหม่อย่างจริงใจ'},
    {label:'เริ่มจากการเป็นเพื่อน',hint:'ความไว้ใจอาจเติบโตในรูปแบบอื่น',action:'meetFriend',effect:{relationships:1},result:'คุณเลือกสร้างความคุ้นเคยก่อนจะตัดสินใจเรื่องความรัก'},
    {label:'ยังอยากโฟกัสชีวิตตัวเอง',hint:'โอกาสอื่นยังรออยู่',effect:{knowledge:2,health:1},result:'ปีนี้คุณเลือกลงทุนกับสิ่งที่ตัวเองให้ความสำคัญ'}
  ]},
  {id:'young-career',min:19,max:35,tag:'career',title:'งานที่เหมาะกับเรา',question:'มีโอกาสงานใหม่ที่ท้าทายกว่า แต่ยังไม่แน่ว่าจะได้ คุณจะเลือกอย่างไร?',options:[
    {label:'ลองสมัครงานใหม่',hint:'มีลุ้นขยับรายได้และทักษะ',action:'switchJob',effect:{knowledge:3,happiness:-1},result:'คุณเริ่มมองเห็นแนวทางทำงานที่ไม่จำเป็นต้องเหมือนเดิมตลอดไป'},
    {label:'อยู่ที่เดิมเพื่อเก็บประสบการณ์',hint:'ลดความเสี่ยงจากการเปลี่ยนงาน',effect:{knowledge:2,savings:2300},result:'คุณได้ฝึกความชำนาญในบทบาทเดิมเพิ่มขึ้น'},
    {label:'เก็บเงินและเรียนทักษะใหม่ก่อน',hint:'ใช้เวลาเตรียมทางเลือก',effect:{knowledge:4,savings:-1000},result:'คุณเริ่มเตรียมตัวเงียบ ๆ สำหรับจังหวะที่เหมาะกว่า'}
  ]},
  {id:'young-moving',min:19,max:33,tag:'career',title:'เมืองเดิมหรือเมืองใหม่',question:'มีคนชวนไปทำงานต่างจังหวัด คุณอยากลองเปลี่ยนที่อยู่ไหม?',options:[
    {label:'ลองย้ายไปหาโอกาส',hint:'อาจได้งานใหม่ แต่มีต้นทุนย้ายถิ่น',action:'move',effect:{knowledge:2,savings:-1600},result:'คุณลองคำนวณทั้งค่าครองชีพและสิ่งที่จะได้เรียนรู้'},
    {label:'หางานใกล้บ้าน',hint:'รักษาระยะกับครอบครัว',bond:{family:3},effect:{relationships:2},result:'คุณให้ความสำคัญกับการอยู่ใกล้คนคุ้นเคยในช่วงนี้'},
    {label:'รอให้มีเงินสำรองมากขึ้น',hint:'เตรียมความพร้อมก่อนเปลี่ยนเมือง',effect:{savings:2000,knowledge:1},result:'คุณเลือกเตรียมตัวก่อนออกเดินทาง'}
  ]},
  {id:'young-love-commit',min:22,max:50,tag:'romance',condition:'dating',title:'อนาคตกับคนรัก',question:'คุณกับคนรักเริ่มพูดถึงการใช้ชีวิตร่วมกันอย่างจริงจัง',options:[
    {label:'วางแผนชีวิตคู่ร่วมกัน',hint:'ต้องอาศัยความพร้อมทั้งสองฝ่าย',action:'commitPartner',effect:{relationships:3,savings:-1000},result:'คุณเริ่มคุยกันถึงบ้าน งาน และเป้าหมายชีวิตในระยะยาว'},
    {label:'ยังคบกันแบบไม่รีบกำหนดรูปแบบ',hint:'ให้เวลาเรียนรู้กันต่อ',bond:{partner:5},effect:{happiness:2},result:'คุณเลือกเติบโตไปด้วยกันทีละก้าว'},
    {label:'คุยว่าต่างคนต้องการอะไรจริง ๆ',hint:'ตั้งขอบเขตและตรวจความพร้อม',bond:{partner:4},effect:{knowledge:1},result:'คำตอบบางอย่างไม่เหมือนเดิม แต่ความชัดเจนช่วยให้ตัดสินใจง่ายขึ้น'}
  ]},
  {id:'young-child-plan',min:22,max:48,tag:'family',condition:'hasPartnerAndChildRoom',title:'สมาชิกใหม่ของบ้าน',question:'คุณกับคนรักเริ่มคุยเรื่องการมีลูกหรือรับอุปการะ',options:[
    {label:'เริ่มวางแผนรับสมาชิกใหม่',hint:'มีความไม่แน่นอนและค่าใช้จ่าย',action:'planChild',effect:{savings:-3000},result:'คุณเริ่มวางแผนเรื่องเวลาครอบครัวและค่าใช้จ่าย'},
    {label:'รอให้พร้อมกว่านี้',hint:'มีเวลาเตรียมเงินและสุขภาพ',effect:{savings:2200,health:1},bond:{partner:2},result:'ทั้งสองฝ่ายตกลงว่าจะทบทวนเรื่องนี้อีกครั้งในอนาคต'},
    {label:'เลือกใช้ชีวิตคู่โดยไม่มีลูก',hint:'ไม่มีเส้นทางครอบครัวแบบเดียว',effect:{happiness:2},bond:{partner:4},result:'คุณเลือกเคารพเป้าหมายชีวิตที่สองคนเห็นร่วมกัน'}
  ]},
  {id:'family-visit',min:19,max:64,tag:'family',title:'กลับบ้านไปหาคนในครอบครัว',question:'งานและการเดินทางทำให้ไม่ได้เจอกันบ่อย ปีนี้คุณจะทำอย่างไร?',options:[
    {label:'จัดเวลากลับไปเยี่ยม',hint:'ความใกล้ชิดเพิ่ม ค่าเดินทางเพิ่ม',effect:{savings:-800,happiness:2},bond:{family:7},result:'เวลาที่ได้อยู่ด้วยกันช่วยให้คุณรู้สึกเชื่อมโยงกับบ้านมากขึ้น'},
    {label:'โทรคุยและส่งข่าวเป็นประจำ',hint:'รักษาความสัมพันธ์แม้อยู่ไกล',bond:{family:5},effect:{happiness:1},result:'บทสนทนาเล็ก ๆ ทำให้คนที่บ้านรับรู้ว่าคุณยังคิดถึงกัน'},
    {label:'ขอจัดการงานตรงหน้าก่อน',hint:'รักษารายได้ แต่เวลาร่วมกันน้อยลง',effect:{savings:1800},bond:{family:-2},result:'คุณยังมีเรื่องที่ต้องรับผิดชอบ และตั้งใจว่าจะหาโอกาสในครั้งหน้า'}
  ]},
  {id:'friend-reunion',min:18,max:65,tag:'friends',condition:'hasFriend',title:'เพื่อนชวนเจอกัน',question:'เพื่อนสนิทชวนไปเจอกันหลังไม่ได้คุยนาน คุณจะเลือกอย่างไร?',options:[
    {label:'นัดเจอกัน',hint:'ได้เติมความสัมพันธ์ แต่มีค่าเดินทาง',effect:{savings:-450,happiness:3},bond:{friend:8},result:'เรื่องเล่าเก่า ๆ กับชีวิตใหม่ทำให้ได้รู้จักกันอีกครั้ง'},
    {label:'คุยกันทางโทรศัพท์',hint:'รักษาความสนิทโดยไม่ต้องเดินทาง',bond:{friend:5},effect:{happiness:2},result:'การรับฟังกันยังมีความหมายแม้ไม่ได้เจอตัว'},
    {label:'ขอเลื่อนไปก่อน',hint:'ได้เวลาให้ภาระอื่น แต่ความสัมพันธ์อาจห่าง',bond:{friend:-3},effect:{savings:500},result:'คุณยังไม่พร้อมเจอปีนี้ แต่ก็หวังว่าจะมีโอกาสใหม่'}
  ]},
  {id:'adult-family-health',min:28,max:65,tag:'family',title:'ผู้ใหญ่ที่บ้านเริ่มต้องการการดูแล',question:'มีคนในบ้านอยากให้ช่วยพาไปพบแพทย์หรือตรวจสุขภาพ คุณจะจัดเวลาอย่างไร?',options:[
    {label:'ลางานไปเป็นเพื่อน',hint:'ใช้เวลาและค่าเดินทาง แต่ได้อยู่ด้วยกัน',bond:{family:8},effect:{savings:-1200,relationships:2},result:'การมีใครสักคนไปด้วยช่วยให้ขั้นตอนที่ยุ่งยากเบาลง'},
    {label:'ช่วยประสานการเดินทางและนัดหมาย',hint:'ช่วยได้แม้ไม่มีเวลาว่างมาก',bond:{family:5},effect:{knowledge:1},result:'คุณหาวิธีช่วยให้คนที่บ้านเข้าถึงการดูแลได้สะดวกขึ้น'},
    {label:'ขอให้ญาติคนอื่นช่วยครั้งนี้',hint:'แบ่งหน้าที่กัน ไม่ต้องรับทั้งหมดคนเดียว',bond:{family:1},effect:{health:1},result:'ครอบครัวเริ่มคุยกันเรื่องการแบ่งเบาภาระอย่างเป็นธรรม'}
  ]},
  {id:'adult-project',min:25,max:60,tag:'career',title:'โอกาสใหม่ในงาน',question:'คุณได้รับชวนให้รับผิดชอบงานใหญ่ขึ้น แต่เวลาพักอาจลดลง',options:[
    {label:'รับความท้าทายใหม่',hint:'อาจได้รายได้เพิ่มแต่เหนื่อยขึ้น',effect:{knowledge:3,savings:4800,health:-2,happiness:-1},result:'คุณได้ลองบทบาทใหม่และพบว่าความรับผิดชอบมาพร้อมการเรียนรู้'},
    {label:'ต่อรองให้มีเวลาส่วนตัว',hint:'รักษาสมดุลและสื่อสารขอบเขต',effect:{knowledge:2,health:2,savings:1200},result:'คุณเริ่มจัดขอบเขตระหว่างงานกับชีวิตได้ชัดเจนขึ้น'},
    {label:'ปฏิเสธแล้วมองหางานที่เหมาะกว่า',hint:'ไม่ใช่ทุกความก้าวหน้าที่ต้องรับ',effect:{happiness:2,knowledge:1},result:'คุณตระหนักว่าคำว่าเติบโตไม่จำเป็นต้องมีรูปแบบเดียว'}
  ]},
  {id:'adult-money',min:25,max:62,tag:'money',title:'เงินก้อนหนึ่งที่ต้องตัดสินใจ',question:'คุณมีเงินเหลือในปีนี้ จะจัดสรรอย่างไร?',options:[
    {label:'เก็บสำรองเผื่อเหตุไม่คาดคิด',hint:'เพิ่มสภาพคล่องในชีวิต',effect:{savings:4500,knowledge:1},result:'คุณเริ่มมีเงินกันชนสำหรับปีที่อาจยากกว่า'},
    {label:'ลงทุนกับทักษะใหม่',hint:'เสียเงินวันนี้เพื่อโอกาสภายหน้า',effect:{savings:-2200,knowledge:4},result:'คุณได้เรียนสิ่งที่อาจใช้เปิดประตูในวันข้างหน้า'},
    {label:'ใช้เวลาพักผ่อนกับคนใกล้ตัว',hint:'ลดเงินออม เพิ่มความสุขร่วมกัน',effect:{savings:-1800,happiness:4},bond:{family:3,partner:2},result:'คุณเลือกซื้อประสบการณ์ที่เก็บไว้ในความทรงจำ'}
  ]},
  {id:'adult-partner-week',min:23,max:85,tag:'romance',condition:'hasPartner',title:'เวลาให้ความสัมพันธ์',question:'ช่วงนี้คุณกับคนรักต่างยุ่งของตัวเอง จะฟื้นความใกล้ชิดอย่างไร?',options:[
    {label:'กำหนดวันใช้เวลาร่วมกัน',hint:'ช่วยรักษาความสนิท แต่ต้องสละเวลา',bond:{partner:9},effect:{happiness:2,savings:-500},result:'เวลาที่ได้ตั้งใจฟังกันช่วยให้ความสัมพันธ์อบอุ่นขึ้น'},
    {label:'คุยกันเรื่องภาระและแบ่งหน้าที่',hint:'ทำให้ชีวิตประจำวันสมดุลขึ้น',bond:{partner:7},effect:{health:1},result:'งานเล็ก ๆ ที่แบ่งกันทำช่วยลดความค้างคาใจ'},
    {label:'ให้พื้นที่ส่วนตัวแล้วค่อยกลับมาคุย',hint:'ต่างคนต่างพัก แต่ต้องสื่อสารให้ดี',bond:{partner:1},effect:{health:2},result:'ทั้งคู่ได้มีเวลาทบทวนตัวเองในจังหวะที่ต้องการ'}
  ]},
  {id:'adult-partner-crossroad',min:24,max:65,tag:'romance',condition:'hasPartner',title:'ความสัมพันธ์มาถึงทางแยก',question:'คุณเริ่มรู้สึกว่าความต้องการบางอย่างไม่เหมือนกันอีกต่อไป',options:[
    {label:'นั่งคุยและตั้งข้อตกลงใหม่',hint:'เพิ่มโอกาสเข้าใจกัน',bond:{partner:8},effect:{relationships:3},result:'ความสัมพันธ์เดินต่อได้ด้วยความตั้งใจที่ต้องใช้จากทั้งสองฝ่าย'},
    {label:'ให้เวลาพักเพื่อทบทวน',hint:'เปิดพื้นที่ส่วนตัว',bond:{partner:-1},effect:{health:2},result:'คุณได้เห็นสิ่งสำคัญของตัวเองชัดขึ้นหลังได้พัก'},
    {label:'เลือกแยกทางอย่างให้เกียรติ',hint:'จบความสัมพันธ์ แต่ชีวิตยังเดินต่อ',action:'endPartner',effect:{happiness:-4},result:'คุณปิดบทหนึ่งของชีวิตด้วยความเคารพและความหวังดี'}
  ]},
  {id:'adult-parenting',min:24,max:65,tag:'family',condition:'hasChildren',title:'ลูกอยากได้เวลาจากคุณ',question:'มีเรื่องสำคัญในชีวิตลูกและเขาอยากให้คุณอยู่ด้วย',options:[
    {label:'เคลียร์งานให้มีเวลาไปด้วย',hint:'สร้างความเชื่อใจ แต่กระทบรายได้บางส่วน',bond:{family:7},effect:{savings:-1100,happiness:3},result:'การอยู่ตรงนั้นมีความหมายมากกว่าของขวัญราคาแพง'},
    {label:'นัดเวลาคุยกันจริงจังหลังเลิกงาน',hint:'แบ่งเวลาให้ชัด',bond:{family:5},effect:{relationships:2},result:'คุณตั้งใจรับฟังแทนที่จะถามเพียงผลสำเร็จ'},
    {label:'ช่วยสนับสนุนค่าใช้จ่ายแทน',hint:'มีประโยชน์ แต่เวลาอาจยังขาด',effect:{savings:-2200},bond:{family:1},result:'สิ่งที่ให้ช่วยได้บางส่วน แต่คุณก็เริ่มคิดถึงเวลาที่ได้อยู่ด้วยกัน'}
  ]},
  {id:'adult-life-health',min:30,max:85,tag:'health',title:'สัญญาณให้หันมาดูแลตัวเอง',question:'ช่วงนี้เหนื่อยง่ายหรือพักผ่อนน้อย คุณจะเริ่มจากอะไร?',options:[
    {label:'ปรับตารางนอนและขยับตัว',hint:'ดูแลสุขภาพอย่างค่อยเป็นค่อยไป',effect:{health:5,happiness:2},result:'ความเปลี่ยนแปลงเล็ก ๆ เริ่มจากการทำสม่ำเสมอ'},
    {label:'จัดเวลาพบแพทย์และตรวจสุขภาพ',hint:'ใช้เวลาและเงินเพื่อการดูแล',effect:{health:4,savings:-900},result:'คุณเริ่มเข้าใจเรื่องสุขภาพของตัวเองและการดูแลอย่างเหมาะสม'},
    {label:'ลดภาระบางอย่างก่อน',hint:'ลดความตึงเครียดระยะสั้น',effect:{health:2,happiness:2,savings:-350},result:'คุณยอมให้ตัวเองได้พักจากความรับผิดชอบบางเรื่อง'}
  ]},
  {id:'senior-hobby',min:60,max:120,tag:'leisure',title:'เวลาที่เป็นของคุณ',question:'เมื่อจังหวะชีวิตช้าลง คุณอยากใช้เวลาทำอะไร?',options:[
    {label:'ปลูกต้นไม้ ทำอาหาร หรือทำงานฝีมือ',hint:'ได้สร้างบางอย่างด้วยมือตัวเอง',effect:{happiness:4,health:1},result:'กิจกรรมเล็ก ๆ ทำให้แต่ละวันมีสิ่งให้ตั้งตารอ'},
    {label:'พบปะคนรู้จักในชุมชน',hint:'ลดความโดดเดี่ยวและสร้างมิตรภาพ',effect:{happiness:2,relationships:2},bond:{friend:5},result:'บทสนทนาง่าย ๆ ทำให้ชุมชนรู้สึกใกล้ตัวขึ้น'},
    {label:'อ่านหนังสือหรือเรียนเรื่องใหม่',hint:'สมองยังเรียนรู้ได้ตลอดชีวิต',effect:{knowledge:4},result:'คุณค้นพบว่าไม่มีอายุไหนที่สายเกินไปสำหรับความอยากรู้อยากเห็น'}
  ]},
  {id:'senior-generations',min:60,max:120,tag:'family',title:'เล่าเรื่องให้คนรุ่นหลัง',question:'คนในบ้านอยากฟังเรื่องราวในอดีตของคุณ',options:[
    {label:'เล่าเรื่องทั้งที่ภูมิใจและเคยพลาด',hint:'สร้างความเข้าใจระหว่างวัย',bond:{family:8},effect:{happiness:3},result:'เรื่องเก่าของคุณกลายเป็นบทเรียนที่คนอื่นนำไปคิดต่อ'},
    {label:'พาไปดูสถานที่ที่เคยสำคัญกับชีวิต',hint:'ได้ใช้เวลาและเดินทางร่วมกัน',bond:{family:6},effect:{health:1,savings:-650},result:'สถานที่เดิมเต็มไปด้วยเรื่องราวที่เพิ่งมีคนได้รับฟัง'},
    {label:'เขียนบันทึกความทรงจำ',hint:'ทบทวนชีวิตและเก็บเรื่องราวไว้',effect:{knowledge:2,happiness:3},result:'คุณเริ่มจดสิ่งที่อยากให้คนอื่นได้รู้จักคุณมากขึ้น'}
  ]},
  {id:'senior-friends',min:60,max:120,tag:'friends',condition:'hasFriend',title:'เพื่อนที่คบกันมานาน',question:'โอกาสได้พบเพื่อนสนิทมีค่ามากขึ้นในช่วงชีวิตนี้',options:[
    {label:'นัดพบกันสักวัน',hint:'ความสัมพันธ์ที่ยาวนานยังต้องได้รับการดูแล',bond:{friend:9},effect:{happiness:4},result:'บทสนทนาเดิม ๆ ยังทำให้ยิ้มได้อีกครั้ง'},
    {label:'ส่งข่าวและรูปภาพให้กัน',hint:'รักษาการติดต่อแม้อยู่ไกล',bond:{friend:5},effect:{relationships:2},result:'คุณได้รู้ว่าเพื่อนอีกคนก็ยังคิดถึงกัน'},
    {label:'พักอยู่บ้านและส่งข้อความสั้น ๆ',hint:'รักษาพลังงานตามที่ไหว',bond:{friend:2},effect:{health:2},result:'ความใส่ใจไม่จำเป็นต้องเป็นกิจกรรมใหญ่โตเสมอไป'}
  ]},
  {id:'senior-checkup',min:60,max:120,tag:'health',title:'สุขภาพในวัยที่เปลี่ยนไป',question:'คุณเริ่มใส่ใจข้อจำกัดของร่างกายมากขึ้น จะจัดชีวิตอย่างไร?',options:[
    {label:'ไปตรวจตามนัดและวางแผนการดูแล',hint:'สม่ำเสมอและขอความช่วยเหลือเมื่อจำเป็น',effect:{health:4,savings:-650},result:'คุณเลือกดูแลตัวเองเท่าที่ทำได้ และไม่จำเป็นต้องแบกทุกอย่างคนเดียว'},
    {label:'ออกกำลังกายเบา ๆ ตามกำลัง',hint:'รักษาความคล่องตัวอย่างปลอดภัย',effect:{health:3,happiness:2},result:'การเคลื่อนไหวเล็กน้อยช่วยให้วันธรรมดาสบายขึ้น'},
    {label:'ขอให้ครอบครัวช่วยจัดเวลา',hint:'ได้รับแรงสนับสนุนจากคนใกล้ชิด',bond:{family:5},effect:{health:2},result:'การดูแลไม่ต้องเป็นหน้าที่ของคนคนเดียวเสมอไป'}
  ]}
];

/* Household choices before school and transition to lower secondary school. */
window.CHOICE_EVENTS[4] = {title:'เวลาและการดูแลในวัยเด็ก',question:'ครอบครัวมีเวลาและกำลังจำกัด ผู้ใหญ่ที่ดูแลคุณจะเน้นเรื่องไหน?',options:[
  {label:'หาเวลาเล่นและเล่านิทานด้วยกัน',hint:'สร้างความคุ้นเคยและความใกล้ชิด',effect:{knowledge:4,happiness:2,relationships:3},bond:{family:6},result:'เวลาง่าย ๆ กับคนที่บ้านค่อย ๆ ช่วยให้คุณเรียนรู้และรู้สึกปลอดภัย'},
  {label:'ให้คุณไปทำกิจกรรมกับเด็กวัยใกล้กัน',hint:'เปิดโอกาสฝึกสื่อสาร',effect:{knowledge:2,relationships:4,health:1},result:'คุณได้ฝึกอยู่ร่วมกับคนอื่นและเรียนรู้การแบ่งปัน'},
  {label:'ให้เวลาพักและเล่นตามอัธยาศัย',hint:'ลดความกดดันในช่วงต้นของชีวิต',effect:{health:3,happiness:3},result:'โลกของคุณในวัยสี่ขวบมีเวลาสำหรับการเล่นและพักผ่อนมากขึ้น'}
]};
window.CHOICE_EVENTS[12] = {title:'ช่วงเปลี่ยนผ่านหลังประถมศึกษา',question:'เมื่อถึงช่วงต้องมองหาที่เรียนต่อ คุณและครอบครัวจะเน้นอะไร?',options:[
  {label:'เรียนต่อในพื้นที่ใกล้บ้าน',hint:'รักษาความใกล้ชิดและลดภาระการเดินทาง',effect:{knowledge:5,relationships:3,savings:600},bond:{family:2},result:'คุณเริ่มต้นระดับต่อไปโดยยังมีคนคุ้นเคยอยู่ใกล้'},
  {label:'ลองสมัครโรงเรียนที่เปิดโอกาสใหม่',hint:'มีต้นทุนและความไม่แน่นอน',effect:{knowledge:8,savings:-2600,health:-1},result:'คุณลองก้าวไปในสภาพแวดล้อมการเรียนที่แตกต่างจากเดิม'},
  {label:'เรียนพร้อมแบ่งเวลาช่วยครอบครัว',hint:'ฝึกความรับผิดชอบ แต่เวลาเรียนลดลงบ้าง',effect:{knowledge:3,relationships:4,savings:800},bond:{family:4},result:'คุณฝึกจัดเวลาระหว่างหน้าที่ที่บ้านกับการเติบโตในโรงเรียน'}
]};
