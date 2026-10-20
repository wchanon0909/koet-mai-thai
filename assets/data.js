/* Province catalogue: 77 present-day Thai administrative provinces. */
window.THAI_PROVINCES = [
'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พะเยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์','อุทัยธานี','อุบลราชธานี'
];

/* If a present-day district was not yet its own province at birth, retain the present-day locator but show the historical province. */
window.HISTORICAL_PROVINCES = {
  'บึงกาฬ': {established:2554, month:3, day:23, parent:'หนองคาย'},
  'อำนาจเจริญ': {established:2536, month:12, day:1, parent:'อุบลราชธานี'},
  'หนองบัวลำภู': {established:2536, month:12, day:1, parent:'อุดรธานี'},
  'สระแก้ว': {established:2536, month:12, day:1, parent:'ปราจีนบุรี'},
  'มุกดาหาร': {established:2525, month:9, day:27, parent:'นครพนม'},
  'พะเยา': {established:2520, month:8, day:28, parent:'เชียงราย'},
  'ยโสธร': {established:2515, month:3, day:1, parent:'อุบลราชธานี'}
};

/* Only recorded history with a source belongs here. This is a curated starter set, not a complete national chronology. */
window.THAI_HISTORY = [
  {
    id:'asian-crisis', year:2540, month:7, day:2, title:'วิกฤตการเงินต้มยำกุ้ง',
    summary:'ประเทศไทยประกาศลอยตัวค่าเงินบาทในวันที่ 2 กรกฎาคม 2540 เป็นจุดเปลี่ยนสำคัญของวิกฤตเศรษฐกิจ',
    source:'https://www.bot.or.th/en/our-roles/special-measures/Tom-Yum-Kung-lesson.html',
    national:true, sector:'economy'
  },
  {
    id:'tsunami', year:2547, month:12, day:26, title:'สึนามิฝั่งอันดามัน',
    summary:'วันที่ 26 ธันวาคม 2547 เกิดคลื่นสึนามิส่งผลกระทบต่อชายฝั่งอันดามันของประเทศไทย',
    source:'https://thailandjourney.bangkokpost.com/timeline',
    national:false, sector:'disaster',
    provinces:['พังงา','ภูเก็ต','กระบี่','ระนอง','ตรัง','สตูล']
  },
  {
    id:'flood-2011', year:2554, month:7, title:'มหาอุทกภัย พ.ศ. 2554',
    summary:'อุทกภัยครั้งใหญ่กระทบพื้นที่จำนวนมากของประเทศ โดยเฉพาะพื้นที่ลุ่มภาคกลางและแหล่งอุตสาหกรรม',
    source:'https://documents1.worldbank.org/curated/en/099062723120515431/pdf/P179738001112b0950889d0dcc60289c10e.pdf',
    national:true, sector:'disaster',
    provinces:['กรุงเทพมหานคร','พระนครศรีอยุธยา','ปทุมธานี','นนทบุรี','นครสวรรค์','ชัยนาท','อ่างทอง','สิงห์บุรี','ลพบุรี','พิจิตร','อุทัยธานี','สุพรรณบุรี','นครปฐม','สมุทรสาคร']
  },
  {
    id:'covid', year:2563, month:1, day:13, title:'การระบาดของโรคโควิด-19',
    summary:'วันที่ 13 มกราคม 2563 ประเทศไทยยืนยันผู้ป่วยโควิด-19 รายแรกที่ตรวจพบในประเทศ',
    source:'https://www.who.int/thailand/news/detail/13-01-2020-thailand-responding-to-the-novel-coronavirus',
    national:true, sector:'health'
  }
];

window.CHOICE_EVENTS = {
  6:{title:'ก้าวแรกในโรงเรียน',question:'ครอบครัวกำลังตัดสินใจเรื่องการเรียน คุณอยากเน้นอะไร?',options:[
    {label:'เรียนใกล้บ้าน',hint:'เดินทางสะดวก ประหยัดค่าใช้จ่าย',effect:{knowledge:3,relationships:4,savings:900}},
    {label:'หาทางเลือกที่เปิดโอกาสเพิ่ม',hint:'มีค่าใช้จ่ายและความไม่แน่นอน',effect:{knowledge:8,relationships:-1,savings:-2800}}
  ]},
  15:{title:'ทางแยกวัย 15 ปี',question:'ช่วงนี้คุณอยากมุ่งไปทางไหน?',options:[
    {label:'เรียนต่อสายสามัญ',hint:'เปิดเส้นทางเรียนต่อ แต่ไม่การันตีผล',effect:{knowledge:9,happiness:-2},path:'สายสามัญ'},
    {label:'เรียนสายอาชีพ',hint:'เพิ่มทักษะอาชีพและโอกาสหารายได้',effect:{knowledge:6,savings:900},path:'สายอาชีพ'},
    {label:'ช่วยครอบครัวทำงาน',hint:'เพิ่มรายได้เร็ว แต่มีต้นทุนทางการศึกษา',effect:{knowledge:-4,savings:4600,relationships:3},path:'ทำงานตั้งแต่วัยรุ่น'}
  ]},
  18:{title:'เลือกเส้นทางวัยผู้ใหญ่',question:'เมื่ออายุ 18 ปี คุณจะลงทุนกับอนาคตอย่างไร?',options:[
    {label:'สมัครเรียนต่อ',hint:'ผลของการสมัครขึ้นอยู่กับโอกาสและเงื่อนไขชีวิต',effect:{knowledge:10,savings:-4300},education:'กำลังศึกษาต่อ'},
    {label:'ฝึกอาชีพและทำงาน',hint:'มีโอกาสเริ่มต้นหาเลี้ยงตัวเอง',effect:{knowledge:4,savings:4800},education:'ฝึกงานและทำงาน'},
    {label:'ช่วยดูแลครอบครัว',hint:'ใกล้ชิดคนที่บ้าน แต่อาจจำกัดโอกาสบางอย่าง',effect:{relationships:7,savings:1800},education:'ทำงานและดูแลครอบครัว'}
  ]},
  22:{title:'จะอยู่ที่เดิมหรือย้ายถิ่น?',question:'คุณได้รับข่าวโอกาสงานในเมืองอื่น จะลองออกไปไหม?',options:[
    {label:'ลองย้ายไปเมืองใหญ่',hint:'มีโอกาสใหม่ แต่ต้องรับภาระค่าครองชีพ',effect:{knowledge:5,happiness:-2,savings:-5200},move:true},
    {label:'อยู่ในพื้นที่เดิม',hint:'รักษาเครือข่ายคนรู้จักและครอบครัว',effect:{relationships:6,savings:3000}}
  ]},
  30:{title:'การจัดการเงินในวัย 30',question:'เมื่อมีรายได้และรายจ่ายมากขึ้น คุณจะให้ความสำคัญกับอะไร?',options:[
    {label:'กันเงินสำรองให้มากขึ้น',hint:'ช่วยเพิ่มความมั่นคงทางการเงิน',effect:{savings:12000,happiness:-1}},
    {label:'ใช้เงินกับคุณภาพชีวิต',hint:'ความสุขระยะสั้นเพิ่มขึ้น แต่เงินสำรองลดลง',effect:{savings:-4500,happiness:7,relationships:3}}
  ]},
  45:{title:'ภาระและความสัมพันธ์',question:'คุณกำลังมีหลายเรื่องที่ต้องรับผิดชอบ จะจัดเวลาชีวิตอย่างไร?',options:[
    {label:'ให้เวลาเรื่องสุขภาพและครอบครัว',hint:'ความสัมพันธ์และสุขภาพมีโอกาสดีขึ้น',effect:{health:7,relationships:8,savings:-2300}},
    {label:'ทุ่มเทให้การงาน',hint:'ฐานะอาจดีขึ้นแต่มีความเสี่ยงเรื่องความเครียด',effect:{savings:8500,happiness:-3,health:-2}}
  ]},
  60:{title:'จังหวะชีวิตหลังวัยทำงาน',question:'คุณจะให้ความสำคัญกับช่วงเวลานี้อย่างไร?',options:[
    {label:'ดูแลสุขภาพและใช้ชีวิตอย่างมีจังหวะ',hint:'มีโอกาสลดความเสี่ยงบางอย่าง',effect:{health:8,happiness:3}},
    {label:'ทำงานต่อเท่าที่ไหว',hint:'รายได้เพิ่มขึ้นแต่ต้องบริหารพลังงาน',effect:{savings:7600,health:-2}}
  ]},
  75:{title:'เรื่องสำคัญในวัย 75',question:'เวลาที่เหลือ คุณอยากใช้ไปกับอะไร?',options:[
    {label:'พบปะคนใกล้ชิด',hint:'หล่อเลี้ยงความสัมพันธ์',effect:{relationships:10,happiness:5}},
    {label:'ใช้เวลาสงบ ๆ กับตัวเอง',hint:'พักผ่อนและทบทวนชีวิต',effect:{health:3,happiness:4}}
  ]}
};
