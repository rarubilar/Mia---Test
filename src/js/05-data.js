/* All example data. In V03 the app replaces this file with real data from the core (same shapes). */
const HABITS = [
  {name:'Meditation', e:'🙇🏽‍♂️', note:5},  {name:'Read', e:'📘', note:7},   {name:'Study', e:'📚', note:9},
  {name:'Yoga', e:'🧘🏽‍♂️', note:4},        {name:'Run', e:'🏃🏽', note:10},  {name:'Football', e:'⚽', note:8},
  {name:'French', e:'🇨🇵', note:11},       {name:'Gym', e:'🏋🏽‍♂️', note:6}];
const DAYS = {
  1:{lines:['A GOOD MEDITATION🙇🏽‍♂️ (25min)','READ THINK LIKE A MONK📘 (55min)','STUDY STATISTICS📚 (1hr 10min)'], title:'First rain of spring', mark:true},
  2:{lines:['A QUICK MEDITATION🙇🏽‍♂️ (8min)','FOOTBALL⚽'], title:''},
  3:{lines:['A GREAT YOGA🧘🏽‍♂️ (40min)','READ📘 (1hr 30min)'], title:'Slow Saturday', mark:true},
  4:{lines:['A GOOD RUN🏃🏽 (32min)','A REGULAR MEDITATION🙇🏽‍♂️ (20min)'], title:''},
  5:{lines:['A POWERFUL MEDITATION🙇🏽‍♂️ (30min)','STUDY FRENCH🇨🇵 (30min)','STUDY STATISTICS📚 (2hrs)'], title:'Back to classes', mark:true},
  6:{lines:['A GOOD MEDITATION🙇🏽‍♂️ (24min)','READ📘 (40min)'], title:''},
};
const TODAY = 6;
// V02.15 (example): what happened before October, so each planet knows its whole life — times done before, and days since the last one before 1 Oct
const PAST = {Meditation:{n:140, last:0}, Read:{n:60, last:1}, Study:{n:45, last:2}, Yoga:{n:18, last:40}, Run:{n:25, last:3}, Football:{n:30, last:5}, French:{n:12, last:6}, Gym:{n:34, last:64}};
const INFO = {
  Meditation:{portrait:'Most mornings, about 23 minutes. Steady.', sub:'Most mornings · 23 min', days:[1,2,4,5,6], total:'5 days this month · 1hr 47min', curve:.62,
    what:'Sitting still and returning attention to the breath, again and again.',
    sci:'A large review of meditation programs found moderate evidence that they ease anxiety, depression and pain.', src:'Goyal et al., 2014, JAMA Internal Medicine'},
  Read:{portrait:'Often in the evening, after meditating.', sub:'Evenings · after meditating', days:[1,3,6], total:'3 days this month · 3hrs 5min', curve:.48,
    what:'Long-form reading, mostly books on the mind and on living well.',
    sci:'Reading stories is linked with a better understanding of what other people think and feel.', src:'Mar, 2018, Discourse Processes'},
  Study:{portrait:'Long blocks, mostly at the start of the week.', sub:'Long blocks · Mondays', days:[1,5], total:'2 days this month · 3hrs 10min', curve:.35,
    what:'Focused study sessions for classes.',
    sci:'Testing yourself and spacing sessions over days work better than rereading.', src:'Dunlosky et al., 2013, Psychological Science in the Public Interest'},
  Yoga:{portrait:'On slow days, often next to meditation.', sub:'Slow days · with meditation', days:[3], total:'1 day this month · 40min', curve:.2,
    what:'Movement and breathing practice.',
    sci:'Reviews find yoga helps with lower back pain in the short term.', src:'Cramer et al., 2013, Clinical Journal of Pain'},
  Run:{portrait:'Short runs, around half an hour.', sub:'Around half an hour', days:[4], total:'1 day this month · 32min', curve:.25,
    what:'Running outdoors.',
    sci:'Any amount of running is linked with a lower risk of early death compared with no running.', src:'Pedisic et al., 2020, British Journal of Sports Medicine'},
  Football:{portrait:'With friends, usually midweek.', sub:'With friends · midweek', days:[2], total:'1 day this month', curve:.4,
    what:'Playing football with friends.',
    sci:'Team sports were linked with the largest drop in poor mental-health days among types of exercise.', src:'Chekroud et al., 2018, Lancet Psychiatry'},
  French:{portrait:'Short sessions, half an hour.', sub:'Short sessions', days:[5], total:'1 day this month · 30min', curve:.15,
    what:'Learning French.',
    sci:'Spreading practice across days helps vocabulary last longer than cramming.', src:'Cepeda et al., 2006, Psychological Bulletin'},
  Gym:{portrait:'Not started this month.', sub:'Not started yet', days:[], total:'No days yet this month', curve:.05,
    what:'Strength training.',
    sci:'Adults are advised to do muscle-strengthening activity on two or more days a week.', src:'WHO physical activity guidelines, 2020'},
};
const CARDCOL = {Meditation:['#9DBFA4','#17221B'], Read:['#F2EBDD','#1B1C18'], Study:['#BCAAE5','#1A1622'], Yoga:['#EDCFAE','#231B12'],
                 Run:['#B0C9D3','#121A1E'], Football:['#D0DAA2','#1B1E10'], French:['#E9C1B8','#221614'], Gym:['#21251F','#EFE9DC']};
const RELATED = {Meditation:['Read','Study','Yoga'], Read:['Meditation'], Study:['Meditation','French'], Yoga:['Meditation'], Run:[], Football:[], French:['Study'], Gym:[]};
const EXPS = [
  {start:[.05,.28], node:[.40,.31], label:'MEDITATE BEFORE STUDY · 3 WEEKS',
   ends:[{p:[.68,.15], text:'YOU STUDIED MORE', taken:true}, {p:[.68,.45], text:'NO CHANGE', taken:false}]},
  {start:[.05,.72], node:[.40,.70], label:"MIA'S OWN · FEWER MORNING NUDGES",
   ends:[{p:[.68,.58], text:'MEDITATION DROPPED', taken:false}, {p:[.68,.86], text:'MEDITATION UNCHANGED · SO MIA STOPPED THEM', taken:true}]}];
const SEASONS = [['The quiet start',.06,'up',60],['First winter in the south',.17,'down',70],['The study months',.29,'up',90],['Summer of football',.41,'down',50],['French, slowly',.52,'up',70],['A long recovery',.62,'down',85],['The reading year',.72,'up',55],['Back to classes',.83,'down',65],['Now',.94,'up',80]];
/* v02.10: lines Mia added by herself (true = confirmed by Raúl, false = still waiting) */
DAYS[1].auto = {'STUDY STATISTICS📚 (1hr 10min)': true};
DAYS[5].auto = {'STUDY STATISTICS📚 (2hrs)': false};
DAYS[6].auto = {'READ📘 (40min)': false};
/* v02.10.1: what played each day, as playlists and their style (media keeps all: songs, podcasts, videos) */
const SONGS = {
  1:[['07:40','Morning Light','Ambient'],['10:15','Piano for Studying','Neo-classical'],['19:02','Indie Evenings','Indie folk']],
  2:[['18:20','Pre-match','Electronic'],['22:10','Night Drive','Trip-hop']],
  3:[['09:05','Slow Saturday','Acoustic'],['11:30','The Daily','Podcast'],['17:45','Quiet Piano','Neo-classical']],
  4:[['07:10','Running Pace 160','Electronic'],['20:30','Wind Down','Ambient']],
  5:[['08:00','Deep Calm','Ambient'],['15:40','Classical Focus','Classical'],['21:15','Lo-fi Nights','Lo-fi']],
  6:[['07:55','Morning Light','Ambient'],['12:30','Deep Focus','Lo-fi'],['18:05','Golden Hour','Soft rock']],
};
/* v02.10: the plan of the day (Mia's own calendar + Google read-only events), and tomorrow's */
const PLAN = {
  today: [{t:'08:00', text:'Meditation', e:'🙇🏽‍♂️', done:true}, {t:'10:00', text:'Statistics class', src:'University', done:true},
          {t:'15:00', text:'Study French', e:'🇨🇵', done:false}, {t:'18:30', text:'Run by the river', e:'🏃🏽', done:false},
          {t:'21:30', text:'Night talk with Mia', done:false}],
  tomorrow: [{t:'08:00', text:'Meditation, then reading', e:'🙇🏽‍♂️', done:false}, {t:'10:00', text:'Statistics class', src:'University', done:false},
          {t:'16:00', text:'Statistics assignment due', src:'Deadline', done:false}, {t:'20:00', text:'Football with friends', e:'⚽', done:false}],
};
/* v02.10: notifications waiting on the waves (max 2 visible, no counters) */
const NOTES = [
  {id:'anki', text:'Is Anki study?', sub:'You used Anki for 25 minutes this afternoon.', actions:['Yes','No','Which habit?']},
  {id:'night', text:'Ready for night talk?', sub:'A few minutes to close the day.', actions:['Talk now','Not tonight'], from:21},
];
