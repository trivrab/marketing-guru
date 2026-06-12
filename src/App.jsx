import { useState, useEffect } from "react";

// Supabase-backed storage with localStorage fallback
(function(){
  const SB_URL="https://pzegudkacuzyhpwpqqcd.supabase.co";
  const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZWd1ZGthY3V6eWhwd3BxcWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDY2NjgsImV4cCI6MjA5NjgyMjY2OH0.KXk1DA4m8_wE1_MfBj-ceBNKvG8bYcpY__pbyuuxi4s";
  const HEADERS={"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"};

  const sbGet=async(key)=>{
    try{
      const r=await fetch(SB_URL+"/rest/v1/storage?key=eq."+encodeURIComponent(key)+"&select=key,value",{headers:HEADERS});
      if(!r.ok)return null;
      const rows=await r.json();
      return rows.length?{key,value:rows[0].value}:null;
    }catch{return null;}
  };
  const sbSet=async(key,value)=>{
    try{
      const r=await fetch(SB_URL+"/rest/v1/storage",{method:"POST",headers:HEADERS,body:JSON.stringify({key,value,updated_at:new Date().toISOString()})});
      return r.ok?{key,value}:null;
    }catch{return null;}
  };
  const sbDelete=async(key)=>{
    try{
      const r=await fetch(SB_URL+"/rest/v1/storage?key=eq."+encodeURIComponent(key),{method:"DELETE",headers:HEADERS});
      return{key,deleted:r.ok};
    }catch{return{key,deleted:false};}
  };
  const sbList=async(prefix)=>{
    try{
      const url=SB_URL+"/rest/v1/storage?select=key"+(prefix?"&key=like."+encodeURIComponent(prefix+"%"):"");
      const r=await fetch(url,{headers:HEADERS});
      if(!r.ok)return{keys:[]};
      const rows=await r.json();
      return{keys:rows.map(r=>r.key)};
    }catch{return{keys:[]};}
  };

  // localStorage fallback
  const lsGet=async k=>{const v=localStorage.getItem(k);return v!==null?{key:k,value:v}:null;};
  const lsSet=async(k,v)=>{localStorage.setItem(k,v);return{key:k,value:v};};
  const lsDelete=async k=>{localStorage.removeItem(k);return{key:k,deleted:true};};
  const lsList=async p=>{const keys=Object.keys(localStorage).filter(k=>!p||k.startsWith(p));return{keys};};

  // Try Supabase, fall back to localStorage
  window.storage={
    get:async k=>{const r=await sbGet(k);return r!==null?r:lsGet(k);},
    set:async(k,v)=>{
      // Write to both for offline resilience
      lsSet(k,v);
      const r=await sbSet(k,v);
      return r||{key:k,value:v};
    },
    delete:async k=>{lsDelete(k);return sbDelete(k);},
    list:async p=>{
      const r=await sbList(p);
      return r.keys.length?r:lsList(p);
    },
  };
  window._supabaseUrl=SB_URL;
  window._supabaseKey=SB_KEY;
})();


const INIT_KONTEXTER=[
  {id:"gepant",namn:"Ge Pant",farg:"#2dd4bf",beskrivning:"Pilotlansering – partnerföreningar ger sin pant digitalt.",metricLabel:"Pantade burkar",senderName:"Marketing Guru",senderEmail:"",aktiv:true},
  {id:"saljpant",namn:"Sälja Pant",farg:"#22c55e",beskrivning:"Föreningar säljer pant och tjänar pengar.",metricLabel:"Såld pant (kr)",senderName:"Marketing Guru",senderEmail:"",aktiv:false},
];

const BLEKINGE = [
  {id:1,namn:"KRIF Hockey",epost:"kansli@krifhockey.se",epostOrdf:"emma.persson@krifhockey.se",ort:"Kallinge",kommun:"Ronneby",idrott:"Ishockey",burkar:28147,skickadeMail:1,ordforande:"Emma Persson",telefon:"0733-015633",lan:"Blekinge",ant:"Hockeyettan",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 11:41",subject:"Vi söker 5 partnerföreningar till Ge Pant – är KRIF Hockey intresserade?",toEmail:"kansli@krifhockey.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:2,namn:"Ramdala IF",epost:"hemmainorrevik@gmail.com",epostOrdf:"hemmainorrevik@gmail.com",ort:"Ramdala",kommun:"Karlskrona",idrott:"Fotboll",burkar:20400,skickadeMail:1,ordforande:"Linda Eriksson",telefon:"0708-33 18 47",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Ramdala IF – vet ni hur mycket pant ni missar?",toEmail:"hemmainorrevik@gmail.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:3,namn:"Drottningskärs IF",epost:"",epostOrdf:"",ort:"Drottningskär",kommun:"Karlskrona",idrott:"Fotboll",burkar:14474,skickadeMail:0,ordforande:"Michael Hellman Olofsson",telefon:"0730-571024",lan:"Blekinge",ant:"Ring 15:30-19:30",mailLog:[],kontaktIds:[],taggar:[]},
  {id:4,namn:"Mörrum Hockey",epost:"kansli@morrumhockey.se",epostOrdf:"per.olsson84@gmail.com",ort:"Mörrum",kommun:"Karlshamn",idrott:"Ishockey",burkar:13232,skickadeMail:1,ordforande:"Per Olsson",telefon:"073-405 19 03",lan:"Blekinge",ant:"Hockeyettan",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Mörrum Hockey – vet ni hur mycket pant ni missar?",toEmail:"per.olsson84@gmail.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:5,namn:"Lörby IF",epost:"lorbyif@gmail.com",epostOrdf:"lorbyif@gmail.com",ort:"Lörby",kommun:"Sölvesborg",idrott:"Fotboll",burkar:10789,skickadeMail:1,ordforande:"Katarina Knese",telefon:"076-627 09 77",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Lörby IF – vet ni hur mycket pant ni missar?",toEmail:"lorbyif@gmail.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:6,namn:"AIK Atlas",epost:"post@aik-atlas.nu",epostOrdf:"",ort:"Sturkö",kommun:"Karlskrona",idrott:"Fotboll",burkar:7905,skickadeMail:1,ordforande:"Åsa Holm",telefon:"070-960 50 80",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"AIK Atlas – vet ni hur mycket pant ni missar?",toEmail:"post@aik-atlas.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:7,namn:"Kristianopels GoIF",epost:"info@kristianopelsgoif.com",epostOrdf:"lennartkarlsson100@gmail.com",ort:"Fågelmara",kommun:"Karlskrona",idrott:"Fotboll",burkar:7500,skickadeMail:1,ordforande:"Lennart Karlsson",telefon:"0704-150750",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Kristianopels GoIF – vet ni hur mycket pant ni missar?",toEmail:"info@kristianopelsgoif.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:8,namn:"Jämjö GoIF",epost:"jamjokansli@gmail.com",epostOrdf:"jgoifstyrelse@gmail.com",ort:"Jämjö",kommun:"Karlskrona",idrott:"Fotboll",burkar:7450,skickadeMail:1,ordforande:"Styrelsen",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Jämjö GoIF – vet ni hur mycket pant ni missar?",toEmail:"jgoifstyrelse@gmail.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:9,namn:"Belganet-Hallabro IF",epost:"styrelsen@belganet.nu",epostOrdf:"",ort:"Hallabro",kommun:"Ronneby",idrott:"Fotboll",burkar:5304,skickadeMail:1,ordforande:"",telefon:"073-382 21 22",lan:"Blekinge",ant:"Swish 1232136463",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Belganet-Hallabro IF – vet ni hur mycket pant ni missar?",toEmail:"styrelsen@belganet.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:10,namn:"Olofström IBK",epost:"",epostOrdf:"",ort:"Olofström",kommun:"Olofström",idrott:"Innebandy",burkar:4223,skickadeMail:0,ordforande:"Malin Mathiasson",telefon:"0768-514607",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:11,namn:"Olofströms IK",epost:"olofstroms.if@oktv.se",epostOrdf:"olofstroms.if@oktv.se",ort:"Olofström",kommun:"Olofström",idrott:"Fotboll",burkar:3815,skickadeMail:1,ordforande:"Per-Åke Samsioe",telefon:"0454-42765",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Olofströms IK – vet ni hur mycket pant ni missar?",toEmail:"olofstroms.if@oktv.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:12,namn:"KaRo IBF",epost:"andersmagnusson.karoibf@outlook.com",epostOrdf:"andersmagnusson.karoibf@outlook.com",ort:"Kallinge",kommun:"Ronneby",idrott:"Innebandy",burkar:3416,skickadeMail:1,ordforande:"Anders Magnusson",telefon:"0721926619",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"KaRo IBF – vet ni hur mycket pant ni missar?",toEmail:"andersmagnusson.karoibf@outlook.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:13,namn:"SMK Ronneby",epost:"st.roos@telia.com",epostOrdf:"st.roos@telia.com",ort:"Kallinge",kommun:"Ronneby",idrott:"Motorsport",burkar:3287,skickadeMail:1,ordforande:"Staffan Roos",telefon:"0709-907810",lan:"Blekinge",ant:"Vice: pjjansson@live.se",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"SMK Ronneby – vet ni hur mycket pant ni missar?",toEmail:"st.roos@telia.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:14,namn:"Backaryds Sportklubb",epost:"ordforande@backaryd.se",epostOrdf:"",ort:"Backaryd",kommun:"Ronneby",idrott:"Fotboll",burkar:2804,skickadeMail:1,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Backaryds Sportklubb – vet ni hur mycket pant ni missar?",toEmail:"ordforande@backaryd.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:15,namn:"Lyckå FF 2016",epost:"tommy.28475@gmail.com",epostOrdf:"tommy.28475@gmail.com",ort:"Lyckeby",kommun:"Karlskrona",idrott:"Fotboll",burkar:2290,skickadeMail:1,ordforande:"Mats Göran Hansson",telefon:"0455-28475",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Lyckå FF 2016 – vet ni hur mycket pant ni missar?",toEmail:"tommy.28475@gmail.com",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:16,namn:"Olofström MC",epost:"",epostOrdf:"",ort:"Olofström",kommun:"Olofström",idrott:"Motorsport",burkar:1914,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:17,namn:"Olofströms BK",epost:"",epostOrdf:"",ort:"Olofström",kommun:"Olofström",idrott:"Basket",burkar:1900,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:18,namn:"IF Trion",epost:"",epostOrdf:"",ort:"Rödeby",kommun:"Karlskrona",idrott:"Friidrott",burkar:1877,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:19,namn:"Ronneby Ryttarförening",epost:"ridskola@rrf.nu",epostOrdf:"",ort:"Ronneby",kommun:"Ronneby",idrott:"Ridsport",burkar:1744,skickadeMail:1,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Ronneby Ryttarförening – vet ni hur mycket pant ni missar?",toEmail:"ridskola@rrf.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:20,namn:"Ronneby Bollklubb P-13",epost:"",epostOrdf:"",ort:"Ronneby",kommun:"Ronneby",idrott:"Fotboll ungdom",burkar:1500,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:21,namn:"KHF pojkar 11/12",epost:"kansli@khk.se",epostOrdf:"ungdomsstyrelsen@khk.se",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Ishockey ungdom",burkar:1450,skickadeMail:1,ordforande:"KHK Ungdomsstyrelse",telefon:"0455-350 430",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"KHF pojkar 11/12 – vet ni hur mycket pant ni missar?",toEmail:"ungdomsstyrelsen@khk.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:22,namn:"DF Hamboringen",epost:"",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Folkdans",burkar:1329,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:23,namn:"Johannishus Pistolskytteklubb",epost:"",epostOrdf:"",ort:"Johannishus",kommun:"Ronneby",idrott:"Skytte",burkar:1323,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:24,namn:"Karlskrona Judoklubb",epost:"",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Judo",burkar:1214,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:25,namn:"Lyckeby Bordtennis",epost:"",epostOrdf:"",ort:"Lyckeby",kommun:"Karlskrona",idrott:"Bordtennis",burkar:1120,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:26,namn:"Rödeby AIF",epost:"kansli@raif.se",epostOrdf:"",ort:"Rödeby",kommun:"Karlskrona",idrott:"Fotboll",burkar:1097,skickadeMail:1,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Rödeby AIF – vet ni hur mycket pant ni missar?",toEmail:"kansli@raif.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:27,namn:"Karlshamns Ridklubb",epost:"",epostOrdf:"",ort:"Karlshamn",kommun:"Karlshamn",idrott:"Ridsport",burkar:950,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:28,namn:"Jämshög Saints HC",epost:"",epostOrdf:"",ort:"Jämshög",kommun:"Olofström",idrott:"Ishockey",burkar:750,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:29,namn:"Badmintonklubben Carlskrona",epost:"kansliet@bkc.se",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Badminton",burkar:519,skickadeMail:1,ordforande:"",telefon:"076-886 71 00",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Badmintonklubben Carlskrona – vet ni hur mycket pant ni missar?",toEmail:"kansliet@bkc.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:30,namn:"Saxemara IF",epost:"kansli@saxemaraif.se",epostOrdf:"kansli@saxemaraif.se",ort:"Saxemara",kommun:"Ronneby",idrott:"Fotboll",burkar:500,skickadeMail:1,ordforande:"Peter Mattsson",telefon:"0705 71 74 27",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Saxemara IF – vet ni hur mycket pant ni missar?",toEmail:"kansli@saxemaraif.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:31,namn:"OK ORION",epost:"info@okorion.se",epostOrdf:"",ort:"Jämjö",kommun:"Karlskrona",idrott:"Orientering",burkar:500,skickadeMail:1,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"OK ORION – vet ni hur mycket pant ni missar?",toEmail:"info@okorion.se",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:32,namn:"Olofströms Ridklubb",epost:"",epostOrdf:"",ort:"Olofström",kommun:"Olofström",idrott:"Ridsport",burkar:353,skickadeMail:0,ordforande:"",telefon:"070-597 08 66",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:33,namn:"Karlskrona Sjösportklubb",epost:"",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Segling",burkar:292,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:34,namn:"Ronneby OK",epost:"rok@rok.nu",epostOrdf:"ordforande@rok.nu",ort:"Kallinge",kommun:"Ronneby",idrott:"Orientering",burkar:261,skickadeMail:1,ordforande:"Gustav Bäcklund",telefon:"0457-460016",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Ronneby OK – vet ni hur mycket pant ni missar?",toEmail:"rok@rok.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:35,namn:"BK Union",epost:"",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Boxning",burkar:251,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:36,namn:"OK Skogsfalken",epost:"kassor@skogsfalken.nu",epostOrdf:"",ort:"Svängsta",kommun:"Karlshamn",idrott:"Orientering",burkar:250,skickadeMail:1,ordforande:"Margret Karlsson",telefon:"073-84 70 655",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"OK Skogsfalken – vet ni hur mycket pant ni missar?",toEmail:"kassor@skogsfalken.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:37,namn:"Karlskrona Segelsällskap",epost:"bokning@knss.nu",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Segling",burkar:250,skickadeMail:1,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Karlskrona Segelsällskap – vet ni hur mycket pant ni missar?",toEmail:"bokning@knss.nu",status:"sent"}],kontaktIds:[],taggar:[]},
  {id:38,namn:"FK Karlskrona",epost:"kansli@fkkarlskrona.com",epostOrdf:"kansli@fkkarlskrona.com",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Fotboll",burkar:247,skickadeMail:0,ordforande:"FK Karlskrona kansli",telefon:"0455-311850",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
  {id:39,namn:"Karlskrona Cykelklubb",epost:"",epostOrdf:"",ort:"Karlskrona",kommun:"Karlskrona",idrott:"Cykling",burkar:41,skickadeMail:0,ordforande:"",telefon:"",lan:"Blekinge",ant:"",mailLog:[],kontaktIds:[],taggar:[]},
];

// ── Dalarna leads – BottleDROP-kampanj (15 st) ─────────────────────────────────
// Mail 1 skickat 2026-05-10
const M1_SUBJ = "{{namn}} – exklusiv plats i pilotlanseringen för Ge Pant";
const M1_DATE = "2026-05-10 09:00";
const M1_CAMP = 1000000;
const M2_SUBJ = "Enkelt, effektivt och roligt – digital insamling för förening";
const M2_DATE = "2026-05-14 09:30";
const M2_CAMP = 1000001;
const M3_SUBJ = "Förening – pionjärplatserna börjar ta slut";
const M3_DATE = "2026-05-18 10:00";
const M3_CAMP = 1000002;
const ml3 = (toEmail, dual) => [
  {id:`m1_${toEmail}`,campaignId:M1_CAMP,date:M1_DATE,subject:M1_SUBJ,toEmail,status:"sent",dual:!!dual},
  {id:`m2_${toEmail}`,campaignId:M2_CAMP,date:M2_DATE,subject:M2_SUBJ,toEmail,status:"sent",dual:!!dual},
  {id:`m3_${toEmail}`,campaignId:M3_CAMP,date:M3_DATE,subject:M3_SUBJ,toEmail,status:"sent",dual:!!dual},
];
// keep backward compat alias
const ml1 = ml3;

const DALARNA = [
  {id:100,namn:"Färnäs Sportklubb",epost:"jesperottossonlassis@live.se",epostOrdf:"msj@jysk.com",ort:"Färnäs",kommun:"Mora",idrott:"Fotboll",burkar:0,skickadeMail:3,ordforande:"Jesper & Martin",telefon:"",lan:"Dalarna",ant:"Dubbel mottagare – Jesper + Martin",mailLog:ml1("jesperottossonlassis@live.se + msj@jysk.com",true),kontaktIds:[200,201],taggar:["gepant"]},
  {id:101,namn:"Avesta Brovallen HF P16",epost:"avesta.brovallen@outlook.com",epostOrdf:"",ort:"Avesta",kommun:"Avesta",idrott:"Handboll",burkar:0,skickadeMail:3,ordforande:"Linn Olsson",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("avesta.brovallen@outlook.com"),kontaktIds:[202],taggar:["gepant"]},
  {id:102,namn:"Sundborns GOIF",epost:"info@sundbornsgoif.se",epostOrdf:"",ort:"Sundborn",kommun:"Falun",idrott:"Fotboll",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@sundbornsgoif.se"),kontaktIds:[203],taggar:["gepant"]},
  {id:103,namn:"KAIS Mora IF",epost:"kansliet@kaismora.se",epostOrdf:"",ort:"Mora",kommun:"Mora",idrott:"Ishockey / Fotboll",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("kansliet@kaismora.se"),kontaktIds:[204],taggar:["gepant"]},
  {id:104,namn:"Avesta AIK",epost:"info@avestaaik.se",epostOrdf:"",ort:"Avesta",kommun:"Avesta",idrott:"Fleridrott",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@avestaaik.se"),kontaktIds:[205],taggar:["gepant"]},
  {id:105,namn:"IBF Falun Ungdom",epost:"Kansli@ibffalunub.se",epostOrdf:"",ort:"Falun",kommun:"Falun",idrott:"Innebandy",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("Kansli@ibffalunub.se"),kontaktIds:[206],taggar:["gepant"]},
  {id:106,namn:"Rättviks Ridklubb",epost:"kontakt@rattviksridklubb.se",epostOrdf:"",ort:"Rättvik",kommun:"Rättvik",idrott:"Ridsport",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("kontakt@rattviksridklubb.se"),kontaktIds:[207],taggar:["gepant"]},
  {id:107,namn:"Svärdsjö Ridklubb",epost:"svardsjoridklubb@hotmail.com",epostOrdf:"",ort:"Svärdsjö",kommun:"Falun",idrott:"Ridsport",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("svardsjoridklubb@hotmail.com"),kontaktIds:[208],taggar:["gepant"]},
  {id:108,namn:"Falu BS",epost:"info@falubs.com",epostOrdf:"",ort:"Falun",kommun:"Falun",idrott:"Fotboll",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@falubs.com"),kontaktIds:[209],taggar:["gepant"]},
  {id:109,namn:"Falu IK Skidklubb",epost:"faluikskidklubb@gmail.com",epostOrdf:"",ort:"Falun",kommun:"Falun",idrott:"Skidåkning",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("faluikskidklubb@gmail.com"),kontaktIds:[210],taggar:["gepant"]},
  {id:110,namn:"Slätta SK",epost:"info@slattask.se",epostOrdf:"",ort:"Falun",kommun:"Falun",idrott:"Fotboll",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@slattask.se"),kontaktIds:[211],taggar:["gepant"]},
  {id:111,namn:"SMK Dala Falun",epost:"info@smkdala.se",epostOrdf:"",ort:"Falun",kommun:"Falun",idrott:"Motorsport",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@smkdala.se"),kontaktIds:[212],taggar:["gepant"]},
  {id:112,namn:"Sollerö IF",epost:"info@solleroif.se",epostOrdf:"",ort:"Sollerön",kommun:"Mora",idrott:"Fleridrott",burkar:0,skickadeMail:3,ordforande:"Kansli",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("info@solleroif.se"),kontaktIds:[213],taggar:["gepant"]},
  {id:113,namn:"Bjursås Ridklubb",epost:"bjursasridklubb@hotmail.se",epostOrdf:"",ort:"Bjursås",kommun:"Falun",idrott:"Ridsport",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("bjursasridklubb@hotmail.se"),kontaktIds:[214],taggar:["gepant"]},
  {id:114,namn:"Borlänge Flygklubb",epost:"bfk@bfk.nu",epostOrdf:"",ort:"Borlänge",kommun:"Borlänge",idrott:"Flygsport",burkar:0,skickadeMail:3,ordforande:"Kontakt",telefon:"",lan:"Dalarna",ant:"",mailLog:ml1("bfk@bfk.nu"),kontaktIds:[215],taggar:["gepant"]},
];

const GOTLAND=[
  {id:300,namn:"Gotland Dart Club",epost:"teddiehallin@hotmail.com",epostOrdf:"teddiehallin@hotmail.com",ort:"Visby",kommun:"Gotland",idrott:"Dart",burkar:2750,skickadeMail:1,ordforande:"Teddie Hallin",telefon:"0703-767683",lan:"Gotland",ant:"Kontakt via IdrottOnline",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Gotland Dart Club – vet ni hur mycket pant ni missar?",toEmail:"teddiehallin@hotmail.com",status:"sent"}],kontaktIds:[300],taggar:[]},
  {id:301,namn:"IF Hansa Hoburg Fotboll Senior",epost:"hansa-hoburg@telia.com",epostOrdf:"hansa-hoburg@telia.com",ort:"Grötlingbo",kommun:"Gotland",idrott:"Fotboll",burkar:2439,skickadeMail:1,ordforande:"Styrelsen",telefon:"0498-481304",lan:"Gotland",ant:"Bekräftad via IdrottOnline & laget.se",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"IF Hansa Hoburg Fotboll Senior – vet ni hur mycket pant ni missar?",toEmail:"hansa-hoburg@telia.com",status:"sent"}],kontaktIds:[301],taggar:[]},
  {id:302,namn:"Väskinde AIS P12/13",epost:"vais@vais.nu",epostOrdf:"vais@vais.nu",ort:"Väskinde",kommun:"Gotland",idrott:"Fotboll",burkar:2384,skickadeMail:1,ordforande:"Styrelsen",telefon:"0702-362534",lan:"Gotland",ant:"Väskinde AIS – fotbollsansvarig Anders Kaungs anders.kaungs@telia.com",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Väskinde AIS P12/13 – vet ni hur mycket pant ni missar?",toEmail:"vais@vais.nu",status:"sent"}],kontaktIds:[302],taggar:[]},
  {id:303,namn:"Visby AIK",epost:"ordforande@visbyaik.se",epostOrdf:"ordforande@visbyaik.se",ort:"Visby",kommun:"Gotland",idrott:"Fleridrott",burkar:2000,skickadeMail:1,ordforande:"Niclas Larsson",telefon:"",lan:"Gotland",ant:"Ordförande bekräftad via laget.se",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Visby AIK – vet ni hur mycket pant ni missar?",toEmail:"ordforande@visbyaik.se",status:"sent"}],kontaktIds:[303],taggar:[]},
  {id:304,namn:"Visby AK",epost:"oskar.stillman@gmail.com",epostOrdf:"oskar.stillman@gmail.com",ort:"Visby",kommun:"Gotland",idrott:"Friidrott",burkar:996,skickadeMail:1,ordforande:"Oskar Stillman",telefon:"0768-393845",lan:"Gotland",ant:"Kontaktperson per IdrottOnline, tyngdlyftning",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Visby AK – vet ni hur mycket pant ni missar?",toEmail:"oskar.stillman@gmail.com",status:"sent"}],kontaktIds:[304],taggar:[]},
  {id:305,namn:"Stånga IF",epost:"",epostOrdf:"",ort:"Stånga",kommun:"Gotland",idrott:"Fleridrott",burkar:750,skickadeMail:0,ordforande:"",telefon:"",lan:"Gotland",ant:"",mailLog:[],kontaktIds:[305],taggar:[]},
  {id:306,namn:"IF Hansa-Hoburg Gymnastik",epost:"hansa-hoburg@telia.com",epostOrdf:"hansa-hoburg@telia.com",ort:"Grötlingbo",kommun:"Gotland",idrott:"Gymnastik",burkar:650,skickadeMail:1,ordforande:"Styrelsen",telefon:"0498-481304",lan:"Gotland",ant:"Ingår i IF Hansa-Hoburg",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"IF Hansa-Hoburg Gymnastik – vet ni hur mycket pant ni missar?",toEmail:"hansa-hoburg@telia.com",status:"sent"}],kontaktIds:[306],taggar:[]},
  {id:307,namn:"P18 IK",epost:"p18ik.kansli@telia.com",epostOrdf:"p18ik.kansli@telia.com",ort:"Visby",kommun:"Gotland",idrott:"Fleridrott",burkar:535,skickadeMail:1,ordforande:"Kansli",telefon:"0498-279326",lan:"Gotland",ant:"P18 IK kansli via IdrottOnline",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"P18 IK – vet ni hur mycket pant ni missar?",toEmail:"p18ik.kansli@telia.com",status:"sent"}],kontaktIds:[307],taggar:[]},
  {id:308,namn:"Gotlands Bro OK",epost:"info@gotlandsbrook.com",epostOrdf:"info@gotlandsbrook.com",ort:"Bro",kommun:"Gotland",idrott:"Orientering",burkar:250,skickadeMail:1,ordforande:"Helene Eklund",telefon:"+46498273170",lan:"Gotland",ant:"Ordförande Helene Eklund, styrelse 2022 per IdrottOnline",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Gotlands Bro OK – vet ni hur mycket pant ni missar?",toEmail:"info@gotlandsbrook.com",status:"sent"}],kontaktIds:[308],taggar:[]},
  {id:309,namn:"Väskinde AIS",epost:"vais@vais.nu",epostOrdf:"vais@vais.nu",ort:"Väskinde",kommun:"Gotland",idrott:"Fleridrott",burkar:191,skickadeMail:1,ordforande:"Styrelsen",telefon:"",lan:"Gotland",ant:"Väskinde AIS – samma e-post som id 302",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Väskinde AIS – vet ni hur mycket pant ni missar?",toEmail:"vais@vais.nu",status:"sent"}],kontaktIds:[309],taggar:[]},
  {id:310,namn:"Dalhem IF",epost:"info@dalhemif.se",epostOrdf:"info@dalhemif.se",ort:"Dalhem",kommun:"Gotland",idrott:"Fleridrott",burkar:156,skickadeMail:1,ordforande:"Kim Hermansson",telefon:"0498-381 03",lan:"Gotland",ant:"Ordförande Kim Hermansson, per SvFF",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"Dalhem IF – vet ni hur mycket pant ni missar?",toEmail:"info@dalhemif.se",status:"sent"}],kontaktIds:[310],taggar:[]},
  {id:311,namn:"MK Gutarna",epost:"info@mkgutarna.se",epostOrdf:"info@mkgutarna.se",ort:"Visby",kommun:"Gotland",idrott:"Motorsport",burkar:135,skickadeMail:1,ordforande:"Styrelsen",telefon:"",lan:"Gotland",ant:"Per mkgutarna.se – bilsport och karting",mailLog:[{id:"m1_csv",campaignId:99990001,date:"2026-06-07 12:04",subject:"MK Gutarna – vet ni hur mycket pant ni missar?",toEmail:"info@mkgutarna.se",status:"sent"}],kontaktIds:[311],taggar:[]},
  {id:312,namn:"IFK Visby",epost:"info@ifkvisby.se",epostOrdf:"styrelsen@ifkvisby.se",ort:"Visby",kommun:"Gotland",idrott:"Fleridrott",burkar:130,skickadeMail:0,ordforande:"Markus Wahlgren",telefon:"0498-296280",lan:"Gotland",ant:"Ordförande Markus Wahlgren, kansli Kristina Hård af Segerstad",mailLog:[],kontaktIds:[312],taggar:[]},
  {id:313,namn:"Föreningen TG Hästverksamhet",epost:"",epostOrdf:"",ort:"Visby",kommun:"Gotland",idrott:"Ridsport",burkar:77,skickadeMail:0,ordforande:"",telefon:"",lan:"Gotland",ant:"",mailLog:[],kontaktIds:[313],taggar:[]},
  {id:314,namn:"Mulde VK",epost:"",epostOrdf:"",ort:"Mulde",kommun:"Gotland",idrott:"Volleyboll",burkar:41,skickadeMail:0,ordforande:"",telefon:"",lan:"Gotland",ant:"",mailLog:[],kontaktIds:[314],taggar:[]},
  {id:315,namn:"Endre Skyttegille",epost:"",epostOrdf:"",ort:"Endre",kommun:"Gotland",idrott:"Skytte",burkar:2,skickadeMail:0,ordforande:"",telefon:"",lan:"Gotland",ant:"",mailLog:[],kontaktIds:[315],taggar:[]},
];

const GOTLAND_CONTACTS=[
  {id:300,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:300,anteckningar:"Gotland Dart Club"},
  {id:301,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:301,anteckningar:"IF Hansa Hoburg Fotboll"},
  {id:302,fornamn:"Styrelsen",efternamn:"",epost:"vais@vais.nu",telefon:"0702-362534",roll:"Kontakt",foreningId:302,anteckningar:"Väskinde AIS P12/13"},
  {id:303,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:303,anteckningar:"Visby AIK"},
  {id:304,fornamn:"Oskar",efternamn:"Stillman",epost:"oskar.stillman@gmail.com",telefon:"0768-393845",roll:"Kontakt",foreningId:304,anteckningar:"Visby AK"},
  {id:305,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:305,anteckningar:"Stånga IF"},
  {id:306,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:306,anteckningar:"IF Hansa-Hoburg Gymnastik"},
  {id:307,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:307,anteckningar:"P18 IK"},
  {id:308,fornamn:"Helene",efternamn:"Eklund",epost:"info@gotlandsbrook.com",telefon:"+46498273170",roll:"Kontakt",foreningId:308,anteckningar:"Gotlands Bro OK"},
  {id:309,fornamn:"Styrelsen",efternamn:"",epost:"vais@vais.nu",telefon:"",roll:"Kontakt",foreningId:309,anteckningar:"Väskinde AIS"},
  {id:310,fornamn:"Kim",efternamn:"Hermansson",epost:"info@dalhemif.se",telefon:"0498-381 03",roll:"Kontakt",foreningId:310,anteckningar:"Dalhem IF"},
  {id:311,fornamn:"Styrelsen",efternamn:"",epost:"info@mkgutarna.se",telefon:"",roll:"Kontakt",foreningId:311,anteckningar:"MK Gutarna"},
  {id:312,fornamn:"Markus",efternamn:"Wahlgren",epost:"styrelsen@ifkvisby.se",telefon:"0498-296280",roll:"Kontakt",foreningId:312,anteckningar:"IFK Visby"},
  {id:313,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:313,anteckningar:"Föreningen TG Hästverksamhet"},
  {id:314,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:314,anteckningar:"Mulde VK"},
  {id:315,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:315,anteckningar:"Endre Skyttegille"},
];


// ── Förifylld kampanjhistorik ─────────────────────────────────────────────────
const INIT_CAMP=[
  {id:M1_CAMP,date:"2026-05-10",subject:"{{namn}} – exklusiv plats i pilotlanseringen för Ge Pant",recipients:15,sent:15,failed:0,mall:"📬 Mail 1 – Introduktion",lan:"Dalarna"},
  {id:M2_CAMP,date:"2026-05-14",subject:"Enkelt, effektivt och roligt – digital insamling för förening",recipients:15,sent:15,failed:0,mall:"🤝 Mail 2 – Relationsbyggande",lan:"Dalarna"},
  {id:M3_CAMP,date:"2026-05-18",subject:"Förening – pionjärplatserna börjar ta slut",recipients:15,sent:15,failed:0,mall:"⏰ Mail 3 – Urgency",lan:"Dalarna"},
];

// ── Dalarna kontakter ──────────────────────────────────────────────────────────
const INIT_CONTACTS=[
  // Färnäs Sportklubb – dubbel mottagare
  {id:200,fornamn:"Jesper",efternamn:"Ottosson",epost:"jesperottossonlassis@live.se",telefon:"",roll:"Kontakt",foreningId:100,anteckningar:"Primär kontakt – Färnäs SK"},
  {id:201,fornamn:"Martin",efternamn:"",epost:"msj@jysk.com",telefon:"",roll:"Kontakt",foreningId:100,anteckningar:"Sekundär kontakt – Färnäs SK (Jysk)"},
  // Avesta Brovallen HF P16
  {id:202,fornamn:"Linn",efternamn:"Olsson",epost:"avesta.brovallen@outlook.com",telefon:"",roll:"Kontakt",foreningId:101,anteckningar:"Avesta Brovallen HF P16"},
  // Sundborns GOIF
  {id:203,fornamn:"Kansli",efternamn:"",epost:"info@sundbornsgoif.se",telefon:"",roll:"Kansli",foreningId:102,anteckningar:"Sundborns GOIF"},
  // KAIS Mora IF
  {id:204,fornamn:"Kansli",efternamn:"",epost:"kansliet@kaismora.se",telefon:"",roll:"Kansli",foreningId:103,anteckningar:"KAIS Mora IF"},
  // Avesta AIK
  {id:205,fornamn:"Kansli",efternamn:"",epost:"info@avestaaik.se",telefon:"",roll:"Kansli",foreningId:104,anteckningar:"Avesta AIK"},
  // IBF Falun Ungdom
  {id:206,fornamn:"Kansli",efternamn:"",epost:"Kansli@ibffalunub.se",telefon:"",roll:"Kansli",foreningId:105,anteckningar:"IBF Falun Ungdom"},
  // Rättviks Ridklubb
  {id:207,fornamn:"Kontakt",efternamn:"",epost:"kontakt@rattviksridklubb.se",telefon:"",roll:"Kontakt",foreningId:106,anteckningar:"Rättviks Ridklubb"},
  // Svärdsjö Ridklubb
  {id:208,fornamn:"Kontakt",efternamn:"",epost:"svardsjoridklubb@hotmail.com",telefon:"",roll:"Kontakt",foreningId:107,anteckningar:"Svärdsjö Ridklubb"},
  // Falu BS
  {id:209,fornamn:"Kansli",efternamn:"",epost:"info@falubs.com",telefon:"",roll:"Kansli",foreningId:108,anteckningar:"Falu BS"},
  // Falu IK Skidklubb
  {id:210,fornamn:"Kontakt",efternamn:"",epost:"faluikskidklubb@gmail.com",telefon:"",roll:"Kontakt",foreningId:109,anteckningar:"Falu IK Skidklubb"},
  // Slätta SK
  {id:211,fornamn:"Kansli",efternamn:"",epost:"info@slattask.se",telefon:"",roll:"Kansli",foreningId:110,anteckningar:"Slätta SK"},
  // SMK Dala Falun
  {id:212,fornamn:"Kontakt",efternamn:"",epost:"info@smkdala.se",telefon:"",roll:"Kontakt",foreningId:111,anteckningar:"SMK Dala Falun"},
  // Sollerö IF
  {id:213,fornamn:"Kansli",efternamn:"",epost:"info@solleroif.se",telefon:"",roll:"Kansli",foreningId:112,anteckningar:"Sollerö IF"},
  // Bjursås Ridklubb
  {id:214,fornamn:"Kontakt",efternamn:"",epost:"bjursasridklubb@hotmail.se",telefon:"",roll:"Kontakt",foreningId:113,anteckningar:"Bjursås Ridklubb"},
  // Borlänge Flygklubb
  {id:215,fornamn:"Kontakt",efternamn:"",epost:"bfk@bfk.nu",telefon:"",roll:"Kontakt",foreningId:114,anteckningar:"Borlänge Flygklubb"},
];


const GAVLEBORG=[
  {id:400,namn:"Söderhamns Simsällskap",epost:"info@soderhamnssim.se",epostOrdf:"info@soderhamnssim.se",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Simning",burkar:23205,skickadeMail:0,ordforande:"",telefon:"0270-100 86",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[400],taggar:[]},
  {id:401,namn:"Åbyggeby / Ockelbo",epost:"abyggebyfk@gavlenet.se",epostOrdf:"abyggebyfk@gavlenet.se",ort:"Ockelbo",kommun:"Ockelbo",idrott:"Fleridrott",burkar:14032,skickadeMail:0,ordforande:"",telefon:"070-342 84 72",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[401],taggar:[]},
  {id:402,namn:"Torsåkers IF Förening",epost:"kansli@torsakersif.se",epostOrdf:"anton.wallqvist@torsakersif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:9392,skickadeMail:0,ordforande:"",telefon:"0730-76 08 72",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[402],taggar:[]},
  {id:403,namn:"IFK Bergvik",epost:"kansliifkbergvik@gmail.com",epostOrdf:"kansliifkbergvik@gmail.com",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:9053,skickadeMail:0,ordforande:"",telefon:"0270-424438",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[403],taggar:[]},
  {id:404,namn:"Forsbacka IK Henrik Niems Fotbollsfond",epost:"forsbacka.ik@outlook.com",epostOrdf:"forsbacka.ik@outlook.com",ort:"Gävle",kommun:"Gävle",idrott:"Fotboll",burkar:5650,skickadeMail:0,ordforande:"",telefon:"0738-435640",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[404],taggar:[]},
  {id:405,namn:"IK Huge P2013 Fotboll",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Fotboll",burkar:5396,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[405],taggar:[]},
  {id:406,namn:"IK Sätra Volleyboll",epost:"kansli@iksatra.se",epostOrdf:"kansli@iksatra.se",ort:"Gävle",kommun:"Gävle",idrott:"Volleyboll",burkar:4404,skickadeMail:0,ordforande:"",telefon:"026-12 05 12",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[406],taggar:[]},
  {id:407,namn:"Ljusne AIK FF",epost:"hakan@hwgkonsult.se",epostOrdf:"hakan@hwgkonsult.se",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:3809,skickadeMail:0,ordforande:"",telefon:"0706-866534",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[407],taggar:[]},
  {id:408,namn:"Brobergs Bandy",epost:"kansli@brobergsoderhamn.se",epostOrdf:"kansli@brobergsoderhamn.se",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Bandy",burkar:3764,skickadeMail:0,ordforande:"",telefon:"0270-157 09",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[408],taggar:[]},
  {id:409,namn:"Strömsbro IF Innebandy Herrjuniorer",epost:"kansli@stromsbroif.se",epostOrdf:"kansli@stromsbroif.se",ort:"Gävle",kommun:"Gävle",idrott:"Bandy",burkar:3381,skickadeMail:0,ordforande:"",telefon:"0768-166111",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[409],taggar:[]},
  {id:410,namn:"Ockelbo Ryttarförening",epost:"info@orf.nu",epostOrdf:"info@orf.nu",ort:"Ockelbo",kommun:"Ockelbo",idrott:"Ridsport",burkar:2912,skickadeMail:0,ordforande:"",telefon:"070-855 05 90",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[410],taggar:[]},
  {id:411,namn:"Sandvikens IF Kiosker",epost:"kansli@sandvikensif.se",epostOrdf:"kansli@sandvikensif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:2607,skickadeMail:0,ordforande:"",telefon:"026-275954",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[411],taggar:[]},
  {id:412,namn:"Hofors AIF Styrelsen",epost:"hofors.aif@telia.com",epostOrdf:"hofors.aif@telia.com",ort:"Hofors",kommun:"Hofors",idrott:"Fleridrott",burkar:2122,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[412],taggar:[]},
  {id:413,namn:"IK Huge Pojkar 2012 (IB)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Innebandy",burkar:2111,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[413],taggar:[]},
  {id:414,namn:"Alfta GIF Ishockeyförening",epost:"kansli@alftahockey.com",epostOrdf:"kansli@alftahockey.com",ort:"Bollnäs",kommun:"Bollnäs",idrott:"Ishockey",burkar:1775,skickadeMail:0,ordforande:"",telefon:"0271-559 18",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[414],taggar:[]},
  {id:415,namn:"Söderhamns FF",epost:"1986sff@gmail.com",epostOrdf:"1986sff@gmail.com",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:1242,skickadeMail:0,ordforande:"",telefon:"073-053 78 80",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[415],taggar:[]},
  {id:416,namn:"Söderhamns UIF",epost:"info@suif.se",epostOrdf:"info@suif.se",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:1184,skickadeMail:0,ordforande:"",telefon:"0270-26 57 00",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[416],taggar:[]},
  {id:417,namn:"Sandvikens Show och Dans Förening",epost:"kansli@sandvikensif.se",epostOrdf:"kansli@sandvikensif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Dans",burkar:1100,skickadeMail:0,ordforande:"",telefon:"026-275954",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[417],taggar:[]},
  {id:418,namn:"Hille-Åbyggeby IK",epost:"",epostOrdf:"",ort:"Ockelbo",kommun:"Ockelbo",idrott:"Fleridrott",burkar:1050,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[418],taggar:[]},
  {id:419,namn:"Hille Idrottsförening",epost:"hilleif@telia.com",epostOrdf:"hilleif@telia.com",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:1025,skickadeMail:0,ordforande:"",telefon:"026-16 76 72",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[419],taggar:[]},
  {id:420,namn:"IK Huge Pojkar 2019 (IB)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Innebandy",burkar:1024,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[420],taggar:[]},
  {id:421,namn:"IK Huge Team 11 (U14) (H)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:900,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[421],taggar:[]},
  {id:422,namn:"Bergsjö IF",epost:"bergsjoif@gmail.com",epostOrdf:"bergsjoif@gmail.com",ort:"Nordanstig",kommun:"Nordanstig",idrott:"Fleridrott",burkar:882,skickadeMail:0,ordforande:"",telefon:"0652-10901",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[422],taggar:[]},
  {id:423,namn:"Gefle Baseboll",epost:"info.geflebsc@gmail.com",epostOrdf:"info.geflebsc@gmail.com",ort:"Gävle",kommun:"Gävle",idrott:"Baseboll",burkar:736,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[423],taggar:[]},
  {id:424,namn:"Norrsundets IF",epost:"",epostOrdf:"",ort:"Ockelbo",kommun:"Ockelbo",idrott:"Fleridrott",burkar:725,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[424],taggar:[]},
  {id:425,namn:"Ockelbo Orienteringsklubb",epost:"mickei63@live.se",epostOrdf:"mickei63@live.se",ort:"Ockelbo",kommun:"Ockelbo",idrott:"Orientering",burkar:691,skickadeMail:0,ordforande:"",telefon:"070-314 90 37",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[425],taggar:[]},
  {id:426,namn:"Söderhamns IK",epost:"ulrika@soderhamnsik.se",epostOrdf:"ulrika@soderhamnsik.se",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:687,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[426],taggar:[]},
  {id:427,namn:"IBK Runsten P16",epost:"ibk@runsten.nu",epostOrdf:"ibk@runsten.nu",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:628,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[427],taggar:[]},
  {id:428,namn:"IK Huge Fotboll P-2011 (F)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Fotboll",burkar:604,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[428],taggar:[]},
  {id:429,namn:"Gefle GF Trupp 5B",epost:"info@geflegymnastik.se",epostOrdf:"info@geflegymnastik.se",ort:"Gävle",kommun:"Gävle",idrott:"Gymnastik",burkar:545,skickadeMail:0,ordforande:"",telefon:"026-12 41 15",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[429],taggar:[]},
  {id:430,namn:"IK Huge Pojkar 2011 (IB)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Innebandy",burkar:527,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[430],taggar:[]},
  {id:431,namn:"IK Huge Pojkar 2013 (IB)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Innebandy",burkar:498,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[431],taggar:[]},
  {id:432,namn:"Brynäs Support Gävle",epost:"medlem@gavle.brynassupport.se",epostOrdf:"medlem@gavle.brynassupport.se",ort:"Gävle",kommun:"Gävle",idrott:"Supporterklubb",burkar:483,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[432],taggar:[]},
  {id:433,namn:"Sandvikens IF P-2017",epost:"kansli@sandvikensif.se",epostOrdf:"kansli@sandvikensif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:356,skickadeMail:0,ordforande:"",telefon:"026-275954",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[433],taggar:[]},
  {id:434,namn:"Trönö IK fotboll",epost:"",epostOrdf:"",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fotboll",burkar:302,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[434],taggar:[]},
  {id:435,namn:"Sandvikens Sim- och Hoppklubb",epost:"sshk@sshk.net",epostOrdf:"sshk@sshk.net",ort:"Sandviken",kommun:"Sandviken",idrott:"Simning",burkar:296,skickadeMail:0,ordforande:"",telefon:"026-25 59 59",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[435],taggar:[]},
  {id:436,namn:"Gefle GF Trupp 5A",epost:"info@geflegymnastik.se",epostOrdf:"info@geflegymnastik.se",ort:"Gävle",kommun:"Gävle",idrott:"Gymnastik",burkar:289,skickadeMail:0,ordforande:"",telefon:"026-12 41 15",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[436],taggar:[]},
  {id:437,namn:"Hudiksvalls Gymnastikförening",epost:"",epostOrdf:"",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Gymnastik",burkar:286,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[437],taggar:[]},
  {id:438,namn:"IK Huge Flickor 2011 (F)",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:265,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[438],taggar:[]},
  {id:439,namn:"Ålbrons Bangolfklubb",epost:"",epostOrdf:"",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Bangolf",burkar:250,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[439],taggar:[]},
  {id:440,namn:"Skärså AIK",epost:"",epostOrdf:"",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:227,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[440],taggar:[]},
  {id:441,namn:"Forsa IF",epost:"",epostOrdf:"",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:219,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[441],taggar:[]},
  {id:442,namn:"Brynäs IF Fotboll",epost:"kansli@brynasiffotboll.se",epostOrdf:"kansli@brynasiffotboll.se",ort:"Gävle",kommun:"Gävle",idrott:"Fotboll",burkar:212,skickadeMail:0,ordforande:"",telefon:"026-14 28 12",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[442],taggar:[]},
  {id:443,namn:"Stensätra IF F2009/2010",epost:"kansliet@stensatraif.se",epostOrdf:"kansliet@stensatraif.se",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:203,skickadeMail:0,ordforande:"",telefon:"076-022 99 85",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[443],taggar:[]},
  {id:444,namn:"Harnäs Skutskär Simsällskap",epost:"",epostOrdf:"",ort:"Gävle",kommun:"Gävle",idrott:"Simning",burkar:194,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[444],taggar:[]},
  {id:445,namn:"Näsvikens Bygdegård",epost:"",epostOrdf:"",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Förening",burkar:192,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[445],taggar:[]},
  {id:446,namn:"IF Team Hudik Fotbollsförening för flickor",epost:"ifteamhudik@teamhudik.se",epostOrdf:"ifteamhudik@teamhudik.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fotboll",burkar:178,skickadeMail:0,ordforande:"",telefon:"072-183 9494",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[446],taggar:[]},
  {id:447,namn:"Sandvikens IF F-2015",epost:"kansli@sandvikensif.se",epostOrdf:"kansli@sandvikensif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:153,skickadeMail:0,ordforande:"",telefon:"026-275954",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[447],taggar:[]},
  {id:448,namn:"Strands IF Handboll",epost:"kansliet@strandsif.se",epostOrdf:"kansliet@strandsif.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Handboll",burkar:127,skickadeMail:0,ordforande:"",telefon:"0650-17750",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[448],taggar:[]},
  {id:449,namn:"Strands IF Hudik Cup",epost:"kansliet@strandsif.se",epostOrdf:"kansliet@strandsif.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:83,skickadeMail:0,ordforande:"",telefon:"0650-17750",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[449],taggar:[]},
  {id:450,namn:"Strands IF Konståkning",epost:"kansliet@strandsif.se",epostOrdf:"kansliet@strandsif.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Konståkning",burkar:82,skickadeMail:0,ordforande:"",telefon:"0650-17750",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[450],taggar:[]},
  {id:451,namn:"Gävle GIK F11/13",epost:"kansliet@ggik.se",epostOrdf:"kansliet@ggik.se",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:79,skickadeMail:0,ordforande:"",telefon:"026-123073",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[451],taggar:[]},
  {id:452,namn:"IFK Gävle Fotboll",epost:"",epostOrdf:"",ort:"Gävle",kommun:"Gävle",idrott:"Fotboll",burkar:67,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[452],taggar:[]},
  {id:453,namn:"Storvik-Ovansjö Ridklubb",epost:"",epostOrdf:"",ort:"Sandviken",kommun:"Sandviken",idrott:"Ridsport",burkar:60,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[453],taggar:[]},
  {id:454,namn:"IK Huge",epost:"david.karlsson@ikhuge.se",epostOrdf:"david.karlsson@ikhuge.se",ort:"Gävle",kommun:"Gävle",idrott:"Fleridrott",burkar:57,skickadeMail:0,ordforande:"",telefon:"0731-807596",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[454],taggar:[]},
  {id:455,namn:"Delsbo IF",epost:"kansli@delsboif.com",epostOrdf:"kansli@delsboif.com",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:53,skickadeMail:0,ordforande:"",telefon:"0653-16520",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[455],taggar:[]},
  {id:456,namn:"Årsunda IF",epost:"",epostOrdf:"",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:53,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[456],taggar:[]},
  {id:457,namn:"Moheds Vattenskidklubb",epost:"",epostOrdf:"",ort:"Gävle",kommun:"Gävle",idrott:"Vattenskidor",burkar:49,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[457],taggar:[]},
  {id:458,namn:"Sandvikens IF Flickor 02",epost:"kansli@sandvikensif.se",epostOrdf:"kansli@sandvikensif.se",ort:"Sandviken",kommun:"Sandviken",idrott:"Fleridrott",burkar:44,skickadeMail:0,ordforande:"",telefon:"026-275954",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[458],taggar:[]},
  {id:459,namn:"Gefle Gymnastikförening",epost:"info@geflegymnastik.se",epostOrdf:"info@geflegymnastik.se",ort:"Gävle",kommun:"Gävle",idrott:"Gymnastik",burkar:39,skickadeMail:0,ordforande:"",telefon:"026-12 41 15",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[459],taggar:[]},
  {id:460,namn:"Bollnäs Kurd IF",epost:"bollnaskurdif2003@gmail.com",epostOrdf:"bollnaskurdif2003@gmail.com",ort:"Bollnäs",kommun:"Bollnäs",idrott:"Fleridrott",burkar:26,skickadeMail:0,ordforande:"",telefon:"073-721 7777",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[460],taggar:[]},
  {id:461,namn:"Ala IF Handboll",epost:"kansli@alaif.se",epostOrdf:"kansli@alaif.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Handboll",burkar:25,skickadeMail:0,ordforande:"",telefon:"",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[461],taggar:[]},
  {id:462,namn:"IBK Hudik",epost:"kansli@ibkhudik.se",epostOrdf:"kansli@ibkhudik.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:21,skickadeMail:0,ordforande:"",telefon:"0650-185 23",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[462],taggar:[]},
  {id:463,namn:"Söderhamns IBF",epost:"soderhamnsibf@gmail.com",epostOrdf:"soderhamnsibf@gmail.com",ort:"Söderhamn",kommun:"Söderhamn",idrott:"Fleridrott",burkar:18,skickadeMail:0,ordforande:"",telefon:"070-595 37 67",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[463],taggar:[]},
  {id:464,namn:"Iggesunds IK",epost:"iik@iggesundsik.se",epostOrdf:"iik@iggesundsik.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:17,skickadeMail:0,ordforande:"",telefon:"0650-20624",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[464],taggar:[]},
  {id:465,namn:"Näsvikens IK",epost:"kansli@nasvikensik.se",epostOrdf:"kansli@nasvikensik.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Fleridrott",burkar:15,skickadeMail:0,ordforande:"",telefon:"0650-30560",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[465],taggar:[]},
  {id:466,namn:"Hudik Hockey",epost:"kansliet@hudikhockey.se",epostOrdf:"kansliet@hudikhockey.se",ort:"Hudiksvall",kommun:"Hudiksvall",idrott:"Ishockey",burkar:14,skickadeMail:0,ordforande:"",telefon:"0650-933 50",lan:"Gävleborg",ant:"",mailLog:[],kontaktIds:[466],taggar:[]}
];

const GAVLEBORG_CONTACTS=[
  {id:400,fornamn:"Kansli",efternamn:"",epost:"info@soderhamnssim.se",telefon:"0270-100 86",roll:"Kontakt",foreningId:400,anteckningar:"Söderhamns Simsällskap"},
  {id:401,fornamn:"Kansli",efternamn:"",epost:"abyggebyfk@gavlenet.se",telefon:"070-342 84 72",roll:"Kontakt",foreningId:401,anteckningar:"Åbyggeby / Ockelbo"},
  {id:402,fornamn:"Kansli",efternamn:"",epost:"kansli@torsakersif.se",telefon:"0730-76 08 72",roll:"Kontakt",foreningId:402,anteckningar:"Torsåkers IF Förening"},
  {id:403,fornamn:"Kansli",efternamn:"",epost:"kansliifkbergvik@gmail.com",telefon:"0270-424438",roll:"Kontakt",foreningId:403,anteckningar:"IFK Bergvik"},
  {id:404,fornamn:"Kansli",efternamn:"",epost:"forsbacka.ik@outlook.com",telefon:"0738-435640",roll:"Kontakt",foreningId:404,anteckningar:"Forsbacka IK Henrik Niems Fotbollsfond"},
  {id:405,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:405,anteckningar:"IK Huge P2013 Fotboll"},
  {id:406,fornamn:"Kansli",efternamn:"",epost:"kansli@iksatra.se",telefon:"026-12 05 12",roll:"Kontakt",foreningId:406,anteckningar:"IK Sätra Volleyboll"},
  {id:407,fornamn:"Kansli",efternamn:"",epost:"hakan@hwgkonsult.se",telefon:"0706-866534",roll:"Kontakt",foreningId:407,anteckningar:"Ljusne AIK FF"},
  {id:408,fornamn:"Kansli",efternamn:"",epost:"kansli@brobergsoderhamn.se",telefon:"0270-157 09",roll:"Kontakt",foreningId:408,anteckningar:"Brobergs Bandy"},
  {id:409,fornamn:"Kansli",efternamn:"",epost:"kansli@stromsbroif.se",telefon:"0768-166111",roll:"Kontakt",foreningId:409,anteckningar:"Strömsbro IF Innebandy Herrjuniorer"},
  {id:410,fornamn:"Kansli",efternamn:"",epost:"info@orf.nu",telefon:"070-855 05 90",roll:"Kontakt",foreningId:410,anteckningar:"Ockelbo Ryttarförening"},
  {id:411,fornamn:"Kansli",efternamn:"",epost:"kansli@sandvikensif.se",telefon:"026-275954",roll:"Kontakt",foreningId:411,anteckningar:"Sandvikens IF Kiosker"},
  {id:412,fornamn:"Kansli",efternamn:"",epost:"hofors.aif@telia.com",telefon:"",roll:"Kontakt",foreningId:412,anteckningar:"Hofors AIF Styrelsen"},
  {id:413,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:413,anteckningar:"IK Huge Pojkar 2012 (IB)"},
  {id:414,fornamn:"Kansli",efternamn:"",epost:"kansli@alftahockey.com",telefon:"0271-559 18",roll:"Kontakt",foreningId:414,anteckningar:"Alfta GIF Ishockeyförening"},
  {id:415,fornamn:"Kansli",efternamn:"",epost:"1986sff@gmail.com",telefon:"073-053 78 80",roll:"Kontakt",foreningId:415,anteckningar:"Söderhamns FF"},
  {id:416,fornamn:"Kansli",efternamn:"",epost:"info@suif.se",telefon:"0270-26 57 00",roll:"Kontakt",foreningId:416,anteckningar:"Söderhamns UIF"},
  {id:417,fornamn:"Kansli",efternamn:"",epost:"kansli@sandvikensif.se",telefon:"026-275954",roll:"Kontakt",foreningId:417,anteckningar:"Sandvikens Show och Dans Förening"},
  {id:418,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:418,anteckningar:"Hille-Åbyggeby IK"},
  {id:419,fornamn:"Kansli",efternamn:"",epost:"hilleif@telia.com",telefon:"026-16 76 72",roll:"Kontakt",foreningId:419,anteckningar:"Hille Idrottsförening"},
  {id:420,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:420,anteckningar:"IK Huge Pojkar 2019 (IB)"},
  {id:421,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:421,anteckningar:"IK Huge Team 11 (U14) (H)"},
  {id:422,fornamn:"Kansli",efternamn:"",epost:"bergsjoif@gmail.com",telefon:"0652-10901",roll:"Kontakt",foreningId:422,anteckningar:"Bergsjö IF"},
  {id:423,fornamn:"Kansli",efternamn:"",epost:"info.geflebsc@gmail.com",telefon:"",roll:"Kontakt",foreningId:423,anteckningar:"Gefle Baseboll"},
  {id:424,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:424,anteckningar:"Norrsundets IF"},
  {id:425,fornamn:"Kansli",efternamn:"",epost:"mickei63@live.se",telefon:"070-314 90 37",roll:"Kontakt",foreningId:425,anteckningar:"Ockelbo Orienteringsklubb"},
  {id:426,fornamn:"Kansli",efternamn:"",epost:"ulrika@soderhamnsik.se",telefon:"",roll:"Kontakt",foreningId:426,anteckningar:"Söderhamns IK"},
  {id:427,fornamn:"Kansli",efternamn:"",epost:"ibk@runsten.nu",telefon:"",roll:"Kontakt",foreningId:427,anteckningar:"IBK Runsten P16"},
  {id:428,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:428,anteckningar:"IK Huge Fotboll P-2011 (F)"},
  {id:429,fornamn:"Kansli",efternamn:"",epost:"info@geflegymnastik.se",telefon:"026-12 41 15",roll:"Kontakt",foreningId:429,anteckningar:"Gefle GF Trupp 5B"},
  {id:430,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:430,anteckningar:"IK Huge Pojkar 2011 (IB)"},
  {id:431,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:431,anteckningar:"IK Huge Pojkar 2013 (IB)"},
  {id:432,fornamn:"Kansli",efternamn:"",epost:"medlem@gavle.brynassupport.se",telefon:"",roll:"Kontakt",foreningId:432,anteckningar:"Brynäs Support Gävle"},
  {id:433,fornamn:"Kansli",efternamn:"",epost:"kansli@sandvikensif.se",telefon:"026-275954",roll:"Kontakt",foreningId:433,anteckningar:"Sandvikens IF P-2017"},
  {id:434,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:434,anteckningar:"Trönö IK fotboll"},
  {id:435,fornamn:"Kansli",efternamn:"",epost:"sshk@sshk.net",telefon:"026-25 59 59",roll:"Kontakt",foreningId:435,anteckningar:"Sandvikens Sim- och Hoppklubb"},
  {id:436,fornamn:"Kansli",efternamn:"",epost:"info@geflegymnastik.se",telefon:"026-12 41 15",roll:"Kontakt",foreningId:436,anteckningar:"Gefle GF Trupp 5A"},
  {id:437,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:437,anteckningar:"Hudiksvalls Gymnastikförening"},
  {id:438,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:438,anteckningar:"IK Huge Flickor 2011 (F)"},
  {id:439,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:439,anteckningar:"Ålbrons Bangolfklubb"},
  {id:440,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:440,anteckningar:"Skärså AIK"},
  {id:441,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:441,anteckningar:"Forsa IF"},
  {id:442,fornamn:"Kansli",efternamn:"",epost:"kansli@brynasiffotboll.se",telefon:"026-14 28 12",roll:"Kontakt",foreningId:442,anteckningar:"Brynäs IF Fotboll"},
  {id:443,fornamn:"Kansli",efternamn:"",epost:"kansliet@stensatraif.se",telefon:"076-022 99 85",roll:"Kontakt",foreningId:443,anteckningar:"Stensätra IF F2009/2010"},
  {id:444,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:444,anteckningar:"Harnäs Skutskär Simsällskap"},
  {id:445,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:445,anteckningar:"Näsvikens Bygdegård"},
  {id:446,fornamn:"Kansli",efternamn:"",epost:"ifteamhudik@teamhudik.se",telefon:"072-183 9494",roll:"Kontakt",foreningId:446,anteckningar:"IF Team Hudik Fotbollsförening för flickor"},
  {id:447,fornamn:"Kansli",efternamn:"",epost:"kansli@sandvikensif.se",telefon:"026-275954",roll:"Kontakt",foreningId:447,anteckningar:"Sandvikens IF F-2015"},
  {id:448,fornamn:"Kansli",efternamn:"",epost:"kansliet@strandsif.se",telefon:"0650-17750",roll:"Kontakt",foreningId:448,anteckningar:"Strands IF Handboll"},
  {id:449,fornamn:"Kansli",efternamn:"",epost:"kansliet@strandsif.se",telefon:"0650-17750",roll:"Kontakt",foreningId:449,anteckningar:"Strands IF Hudik Cup"},
  {id:450,fornamn:"Kansli",efternamn:"",epost:"kansliet@strandsif.se",telefon:"0650-17750",roll:"Kontakt",foreningId:450,anteckningar:"Strands IF Konståkning"},
  {id:451,fornamn:"Kansli",efternamn:"",epost:"kansliet@ggik.se",telefon:"026-123073",roll:"Kontakt",foreningId:451,anteckningar:"Gävle GIK F11/13"},
  {id:452,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:452,anteckningar:"IFK Gävle Fotboll"},
  {id:453,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:453,anteckningar:"Storvik-Ovansjö Ridklubb"},
  {id:454,fornamn:"Kansli",efternamn:"",epost:"david.karlsson@ikhuge.se",telefon:"0731-807596",roll:"Kontakt",foreningId:454,anteckningar:"IK Huge"},
  {id:455,fornamn:"Kansli",efternamn:"",epost:"kansli@delsboif.com",telefon:"0653-16520",roll:"Kontakt",foreningId:455,anteckningar:"Delsbo IF"},
  {id:456,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:456,anteckningar:"Årsunda IF"},
  {id:457,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:457,anteckningar:"Moheds Vattenskidklubb"},
  {id:458,fornamn:"Kansli",efternamn:"",epost:"kansli@sandvikensif.se",telefon:"026-275954",roll:"Kontakt",foreningId:458,anteckningar:"Sandvikens IF Flickor 02"},
  {id:459,fornamn:"Kansli",efternamn:"",epost:"info@geflegymnastik.se",telefon:"026-12 41 15",roll:"Kontakt",foreningId:459,anteckningar:"Gefle Gymnastikförening"},
  {id:460,fornamn:"Kansli",efternamn:"",epost:"bollnaskurdif2003@gmail.com",telefon:"073-721 7777",roll:"Kontakt",foreningId:460,anteckningar:"Bollnäs Kurd IF"},
  {id:461,fornamn:"Kansli",efternamn:"",epost:"kansli@alaif.se",telefon:"",roll:"Kontakt",foreningId:461,anteckningar:"Ala IF Handboll"},
  {id:462,fornamn:"Kansli",efternamn:"",epost:"kansli@ibkhudik.se",telefon:"0650-185 23",roll:"Kontakt",foreningId:462,anteckningar:"IBK Hudik"},
  {id:463,fornamn:"Kansli",efternamn:"",epost:"soderhamnsibf@gmail.com",telefon:"070-595 37 67",roll:"Kontakt",foreningId:463,anteckningar:"Söderhamns IBF"},
  {id:464,fornamn:"Kansli",efternamn:"",epost:"iik@iggesundsik.se",telefon:"0650-20624",roll:"Kontakt",foreningId:464,anteckningar:"Iggesunds IK"},
  {id:465,fornamn:"Kansli",efternamn:"",epost:"kansli@nasvikensik.se",telefon:"0650-30560",roll:"Kontakt",foreningId:465,anteckningar:"Näsvikens IK"},
  {id:466,fornamn:"Kansli",efternamn:"",epost:"kansliet@hudikhockey.se",telefon:"0650-933 50",roll:"Kontakt",foreningId:466,anteckningar:"Hudik Hockey"}
];

const HALLAND=[
  {id:600,namn:"Bua IF",epost:"info@buaif.se",epostOrdf:"info@buaif.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:53921,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[600],taggar:[]},
  {id:601,namn:"Laholms FK",epost:"info@laholmsfk.se",epostOrdf:"info@laholmsfk.se",ort:"Laholm",kommun:"Laholm",idrott:"Fotboll",burkar:45783,skickadeMail:0,ordforande:"",telefon:"0430-101 85",lan:"Halland",ant:"",mailLog:[],kontaktIds:[601],taggar:[]},
  {id:602,namn:"Stafsinge IF",epost:"stafsingeif@telia.com",epostOrdf:"stafsingeif@telia.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:40434,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[602],taggar:[]},
  {id:603,namn:"Unnaryds GoIF",epost:"kansli@ugoif.se",epostOrdf:"kansli@ugoif.se",ort:"Hylte",kommun:"Hylte",idrott:"Fotboll",burkar:26245,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[603],taggar:[]},
  {id:604,namn:"Vessigebro BK",epost:"vessigebrobk@gmail.com",epostOrdf:"vessigebrobk@gmail.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:23459,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[604],taggar:[]},
  {id:605,namn:"Glommens IF",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fotboll",burkar:22851,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[605],taggar:[]},
  {id:606,namn:"Derome BK",epost:"kansli@deromebk.se",epostOrdf:"kansli@deromebk.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:22183,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[606],taggar:[]},
  {id:607,namn:"Väröbacka GIF",epost:"fredrik.l@ge-sprinkler.se",epostOrdf:"fredrik.l@ge-sprinkler.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:19517,skickadeMail:0,ordforande:"",telefon:"070-941 8303",lan:"Halland",ant:"",mailLog:[],kontaktIds:[607],taggar:[]},
  {id:608,namn:"Tvååkers IF",epost:"tif@telia.com",epostOrdf:"tif@telia.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:18757,skickadeMail:0,ordforande:"",telefon:"0340-40375",lan:"Halland",ant:"",mailLog:[],kontaktIds:[608],taggar:[]},
  {id:609,namn:"Slöinge GOIF",epost:"sloingegoif.fotboll@gmail.com",epostOrdf:"sloingegoif.fotboll@gmail.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:18334,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[609],taggar:[]},
  {id:610,namn:"Morups IF",epost:"sekr@morupsif.se",epostOrdf:"sekr@morupsif.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:17878,skickadeMail:0,ordforande:"",telefon:"0346-828 10",lan:"Halland",ant:"",mailLog:[],kontaktIds:[610],taggar:[]},
  {id:611,namn:"Galtabäcks BK",epost:"kansli@g-bk.com",epostOrdf:"kansli@g-bk.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:17593,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[611],taggar:[]},
  {id:612,namn:"Tvååkers IBK",epost:"Info@tvaakersibk.se",epostOrdf:"Info@tvaakersibk.se",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:15706,skickadeMail:0,ordforande:"",telefon:"070-297 87 38",lan:"Halland",ant:"",mailLog:[],kontaktIds:[612],taggar:[]},
  {id:613,namn:"Skrea IF",epost:"skreaif@telia.com",epostOrdf:"skreaif@telia.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:14588,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[613],taggar:[]},
  {id:614,namn:"Ysby BK",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Fotboll",burkar:13244,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[614],taggar:[]},
  {id:615,namn:"Hasslövs IS",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Fleridrott",burkar:12952,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[615],taggar:[]},
  {id:616,namn:"Kvibille BK",epost:"christian.bangdal@kvibillebk.se",epostOrdf:"christian.bangdal@kvibillebk.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:12603,skickadeMail:0,ordforande:"",telefon:"0766-122212",lan:"Halland",ant:"",mailLog:[],kontaktIds:[616],taggar:[]},
  {id:617,namn:"Träslövsläge IF",epost:"info@tlif.se",epostOrdf:"info@tlif.se",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:11100,skickadeMail:0,ordforande:"",telefon:"0340-411 68",lan:"Halland",ant:"",mailLog:[],kontaktIds:[617],taggar:[]},
  {id:618,namn:"Skogaby BK",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fotboll",burkar:11094,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[618],taggar:[]},
  {id:619,namn:"Fegens GK Myrorna",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:11064,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[619],taggar:[]},
  {id:620,namn:"HGHFC",epost:"info@hghfc.se",epostOrdf:"info@hghfc.se",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:10971,skickadeMail:0,ordforande:"",telefon:"035-505 40",lan:"Halland",ant:"",mailLog:[],kontaktIds:[620],taggar:[]},
  {id:621,namn:"Rolfstorps GIF",epost:"rgif.fotboll@outlook.com",epostOrdf:"rgif.fotboll@outlook.com",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:10522,skickadeMail:0,ordforande:"",telefon:"070-3695850",lan:"Halland",ant:"",mailLog:[],kontaktIds:[621],taggar:[]},
  {id:622,namn:"LTIK Seniorer",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:10494,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[622],taggar:[]},
  {id:623,namn:"Skottorps IF",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fotboll",burkar:10100,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[623],taggar:[]},
  {id:624,namn:"Grimmared IF",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fotboll",burkar:10074,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[624],taggar:[]},
  {id:625,namn:"Ränneslövs GIF",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Fotboll",burkar:9253,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[625],taggar:[]},
  {id:626,namn:"Warberg F11 Prag",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:8961,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[626],taggar:[]},
  {id:627,namn:"Frillesås FF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:7916,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[627],taggar:[]},
  {id:628,namn:"Kungsäter IF",epost:"",epostOrdf:"",ort:"Kungsäter",kommun:"Kungsäter",idrott:"Fotboll",burkar:7445,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[628],taggar:[]},
  {id:629,namn:"Slättåkra Skytteförening",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Skytte",burkar:7300,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[629],taggar:[]},
  {id:630,namn:"Skällinge BK",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:7157,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[630],taggar:[]},
  {id:631,namn:"IF Norvalla",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:7145,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[631],taggar:[]},
  {id:632,namn:"IF Centern",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:7123,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[632],taggar:[]},
  {id:633,namn:"Sportfiskeklubben Laxen",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fiske",burkar:6630,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[633],taggar:[]},
  {id:634,namn:"Vinbergs IF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:6400,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[634],taggar:[]},
  {id:635,namn:"Tofta GIF - Varberg",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:6333,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[635],taggar:[]},
  {id:636,namn:"Katrinebergs Idrottsförening",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:6084,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[636],taggar:[]},
  {id:637,namn:"Hyltebruks IF",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Fotboll",burkar:6000,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[637],taggar:[]},
  {id:638,namn:"Kornhults IK",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fleridrott",burkar:5713,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[638],taggar:[]},
  {id:639,namn:"Hishults AIS",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fleridrott",burkar:5361,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[639],taggar:[]},
  {id:640,namn:"ULLAREDS IDROTTSKLUBB",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Fleridrott",burkar:5350,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[640],taggar:[]},
  {id:641,namn:"Frillesås Rid och Körklubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Ridsport",burkar:5289,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[641],taggar:[]},
  {id:642,namn:"Sennans IF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:5250,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[642],taggar:[]},
  {id:643,namn:"Knäreds Idrottsklubb",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Fleridrott",burkar:5200,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[643],taggar:[]},
  {id:644,namn:"IBK Puma",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:5146,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[644],taggar:[]},
  {id:645,namn:"Veddige IBK",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:4917,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[645],taggar:[]},
  {id:646,namn:"Landeryds GoIF",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Fotboll",burkar:4913,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[646],taggar:[]},
  {id:647,namn:"Våxtorps Bois",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fotboll",burkar:4884,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[647],taggar:[]},
  {id:648,namn:"Valinge IF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:4700,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[648],taggar:[]},
  {id:649,namn:"Frillesås Bandy",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Bandy",burkar:4694,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[649],taggar:[]},
  {id:650,namn:"Varbergs Roddklubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Rodd",burkar:4627,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[650],taggar:[]},
  {id:651,namn:"Warberg IBF - kansli",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:4513,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[651],taggar:[]},
  {id:652,namn:"Trönninge IF P13",epost:"kansli@tronningeif.nu",epostOrdf:"kansli@tronningeif.nu",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:4505,skickadeMail:0,ordforande:"",telefon:"035-40685",lan:"Halland",ant:"",mailLog:[],kontaktIds:[652],taggar:[]},
  {id:653,namn:"Warberg IBF F16",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:4448,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[653],taggar:[]},
  {id:654,namn:"Kungsbacka Dartklubb",epost:"",epostOrdf:"",ort:"Kungsbacka",kommun:"Kungsbacka",idrott:"Dart",burkar:4385,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[654],taggar:[]},
  {id:655,namn:"Warberg P12",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:4225,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[655],taggar:[]},
  {id:656,namn:"Falkenbergs Motorklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Motorsport",burkar:4183,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[656],taggar:[]},
  {id:657,namn:"Hylte Ryttarförening",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Ridsport",burkar:3632,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[657],taggar:[]},
  {id:658,namn:"Laholm BK",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Fotboll",burkar:3549,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[658],taggar:[]},
  {id:659,namn:"Varbergs Hockey Klubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Ishockey",burkar:3400,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[659],taggar:[]},
  {id:660,namn:"Falkenbergs IBK",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Innebandy",burkar:2690,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[660],taggar:[]},
  {id:661,namn:"HK Varberg",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:2635,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[661],taggar:[]},
  {id:662,namn:"Halmstad Handbollförening P09",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Handboll",burkar:2520,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[662],taggar:[]},
  {id:663,namn:"Arvidstorps IK",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:2313,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[663],taggar:[]},
  {id:664,namn:"SMBK",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:2204,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[664],taggar:[]},
  {id:665,namn:"Falkenbergs Kraftsportklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Tyngdlyftning",burkar:2080,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[665],taggar:[]},
  {id:666,namn:"Wärö Dragkampklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Tyngdlyftning",burkar:2027,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[666],taggar:[]},
  {id:667,namn:"Vinbergs IF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:2000,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[667],taggar:[]},
  {id:668,namn:"Brottarklubben Falkenberg",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Tyngdlyftning",burkar:1969,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[668],taggar:[]},
  {id:669,namn:"Varbergs Bois BK - Brottning",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:1857,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[669],taggar:[]},
  {id:670,namn:"Laholms Boulesällskap",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Boule",burkar:1676,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[670],taggar:[]},
  {id:671,namn:"Warberg Innebandyförening F12",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:1531,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[671],taggar:[]},
  {id:672,namn:"Halmstad Handboll P 2012",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Handboll",burkar:1499,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[672],taggar:[]},
  {id:673,namn:"Simlångsdalens Idrottsförening",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Simning",burkar:1420,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[673],taggar:[]},
  {id:674,namn:"Vinbergs IBS",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:1400,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[674],taggar:[]},
  {id:675,namn:"HALMSTAD KANOTKLUBB",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Vattensport",burkar:1377,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[675],taggar:[]},
  {id:676,namn:"Särökometernas HK",epost:"",epostOrdf:"",ort:"Kungsbacka",kommun:"Kungsbacka",idrott:"Handboll",burkar:1356,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[676],taggar:[]},
  {id:677,namn:"Ätrafors BK",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fotboll",burkar:1336,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[677],taggar:[]},
  {id:678,namn:"IF Böljan",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:1300,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[678],taggar:[]},
  {id:679,namn:"Laholms Ryttarförening",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Ridsport",burkar:1250,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[679],taggar:[]},
  {id:680,namn:"Hylte Bowling BK Turbo",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Fotboll",burkar:1250,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[680],taggar:[]},
  {id:681,namn:"Laholms Skytteförening",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Skytte",burkar:1250,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[681],taggar:[]},
  {id:682,namn:"Falkenbergs Tennisklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Tennis",burkar:1243,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[682],taggar:[]},
  {id:683,namn:"Vinbergs IF P2015",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:1153,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[683],taggar:[]},
  {id:684,namn:"SK Stimmet",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:1119,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[684],taggar:[]},
  {id:685,namn:"Falkenbergs Roddklubb Team Frk",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Rodd",burkar:1019,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[685],taggar:[]},
  {id:686,namn:"Varbergs Kraftsportklubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Tyngdlyftning",burkar:1014,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[686],taggar:[]},
  {id:687,namn:"Grimeton IK",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:963,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[687],taggar:[]},
  {id:688,namn:"Tölö GF Trupp Mint",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Gymnastik",burkar:921,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[688],taggar:[]},
  {id:689,namn:"Halmstad Boulehallsallians",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Boule",burkar:907,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[689],taggar:[]},
  {id:690,namn:"Lövstavikens Båtförening",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Vattensport",burkar:900,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[690],taggar:[]},
  {id:691,namn:"Falkenbergs Skytteförening",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Skytte",burkar:824,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[691],taggar:[]},
  {id:692,namn:"IS Halmia",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:750,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[692],taggar:[]},
  {id:693,namn:"Laholms Korpen",epost:"",epostOrdf:"",ort:"Laholm",kommun:"Laholm",idrott:"Fleridrott",burkar:650,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[693],taggar:[]},
  {id:694,namn:"Sandö IBK",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:638,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[694],taggar:[]},
  {id:695,namn:"Söndrums Skolidrottsförening",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:599,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[695],taggar:[]},
  {id:696,namn:"Club Of Aces",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:597,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[696],taggar:[]},
  {id:697,namn:"IF Centern P07",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:595,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[697],taggar:[]},
  {id:698,namn:"Ullareds Brukshundklubb",epost:"",epostOrdf:"",ort:"Hylte",kommun:"Hylte",idrott:"Hundsport",burkar:585,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[698],taggar:[]},
  {id:699,namn:"Getinge Bowlingklubb",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Bowling",burkar:576,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[699],taggar:[]},
  {id:700,namn:"Falkenbergs Bågskytteklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Skytte",burkar:521,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[700],taggar:[]},
  {id:701,namn:"Onsala Bollklubb Pojkar 2015",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:519,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[701],taggar:[]},
  {id:702,namn:"Skedala Ridklubb Tävling",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Ridsport",burkar:510,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[702],taggar:[]},
  {id:703,namn:"IS Orion Handboll",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Handboll",burkar:500,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[703],taggar:[]},
  {id:704,namn:"Bouleföreningen",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Boule",burkar:480,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[704],taggar:[]},
  {id:705,namn:"BK Astrio P2013",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:468,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[705],taggar:[]},
  {id:706,namn:"Falkenbergs Spelförening",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Fleridrott",burkar:465,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[706],taggar:[]},
  {id:707,namn:"Halmstads Fältrittklubb",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:427,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[707],taggar:[]},
  {id:708,namn:"Halmstads Segelflygklubb",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Vattensport",burkar:389,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[708],taggar:[]},
  {id:709,namn:"BK Astrio Fotboll",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fotboll",burkar:343,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[709],taggar:[]},
  {id:710,namn:"Föreningen Falken Petanque",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Boule",burkar:317,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[710],taggar:[]},
  {id:711,namn:"IFK Halmstad Friidrott",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Friidrott",burkar:310,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[711],taggar:[]},
  {id:712,namn:"Varbergs Vattenskidklubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Vattenskidor",burkar:298,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[712],taggar:[]},
  {id:713,namn:"GOIF Ginsten",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:287,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[713],taggar:[]},
  {id:714,namn:"Åsklosters IF",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:268,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[714],taggar:[]},
  {id:715,namn:"Warberg IBF P13",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:240,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[715],taggar:[]},
  {id:716,namn:"Alets IK F10/11",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:212,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[716],taggar:[]},
  {id:717,namn:"BK Astrio P2012",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:189,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[717],taggar:[]},
  {id:718,namn:"Warberg IBF F15",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Innebandy",burkar:186,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[718],taggar:[]},
  {id:719,namn:"Slöinge Tennisklubb",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Tennis",burkar:184,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[719],taggar:[]},
  {id:720,namn:"OK Löftan",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Orientering",burkar:150,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[720],taggar:[]},
  {id:721,namn:"Alets IK",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:149,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[721],taggar:[]},
  {id:722,namn:"Falkenbergs Volleybollklubb",epost:"",epostOrdf:"",ort:"Falkenberg",kommun:"Falkenberg",idrott:"Volleyboll",burkar:146,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[722],taggar:[]},
  {id:723,namn:"Träningskompaniet",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:68,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[723],taggar:[]},
  {id:724,namn:"Trönninge IF",epost:"kansli@tronningeif.nu",epostOrdf:"kansli@tronningeif.nu",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:66,skickadeMail:0,ordforande:"",telefon:"035-40685",lan:"Halland",ant:"",mailLog:[],kontaktIds:[724],taggar:[]},
  {id:725,namn:"Astrio P2011",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:57,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[725],taggar:[]},
  {id:726,namn:"Halmstad Innebandy ungdom",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Innebandy",burkar:54,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[726],taggar:[]},
  {id:727,namn:"Särö Kullavik IF",epost:"",epostOrdf:"",ort:"Kungsbacka",kommun:"Kungsbacka",idrott:"Fotboll",burkar:52,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[727],taggar:[]},
  {id:728,namn:"Halmstad Handboll F2011",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Handboll",burkar:41,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[728],taggar:[]},
  {id:729,namn:"Varbergs GIF Gymnastikförening",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:38,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[729],taggar:[]},
  {id:730,namn:"FK Friskus-Varberg",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fleridrott",burkar:31,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[730],taggar:[]},
  {id:731,namn:"Varbergs Skateboardklubb Skatehallen",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Skateboard",burkar:30,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[731],taggar:[]},
  {id:732,namn:"Tvååkers Sport o Fiskevårdsförening",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fiske",burkar:21,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[732],taggar:[]},
  {id:733,namn:"Vapnö Idrottsförening F14-16",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:19,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[733],taggar:[]},
  {id:734,namn:"Varbergs BOIS FC",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:15,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[734],taggar:[]},
  {id:735,namn:"BK Astrio P07",epost:"",epostOrdf:"",ort:"Halland",kommun:"Halland",idrott:"Fleridrott",burkar:15,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[735],taggar:[]},
  {id:736,namn:"Trönninge BK Fotboll",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Fotboll",burkar:14,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[736],taggar:[]},
  {id:737,namn:"Halmstad Hammers",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fleridrott",burkar:10,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[737],taggar:[]},
  {id:738,namn:"Läjets Boule Huvudföreningen",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Boule",burkar:7,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[738],taggar:[]},
  {id:739,namn:"Båt/Kultur/Miljöförening Halmstad",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Vattensport",burkar:6,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[739],taggar:[]},
  {id:740,namn:"Friskis & Svettis IF",epost:"",epostOrdf:"",ort:"Halmstad",kommun:"Halmstad",idrott:"Fotboll",burkar:5,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[740],taggar:[]},
  {id:741,namn:"Föreningen Varbergs SIM",epost:"",epostOrdf:"",ort:"Varberg",kommun:"Varberg",idrott:"Simning",burkar:1,skickadeMail:0,ordforande:"",telefon:"",lan:"Halland",ant:"",mailLog:[],kontaktIds:[741],taggar:[]}
];

const HALLAND_CONTACTS=[
  {id:600,fornamn:"Kansli",efternamn:"",epost:"info@buaif.se",telefon:"",roll:"Kontakt",foreningId:600,anteckningar:"Bua IF"},
  {id:601,fornamn:"Kansli",efternamn:"",epost:"info@laholmsfk.se",telefon:"0430-101 85",roll:"Kontakt",foreningId:601,anteckningar:"Laholms FK"},
  {id:602,fornamn:"Kansli",efternamn:"",epost:"stafsingeif@telia.com",telefon:"",roll:"Kontakt",foreningId:602,anteckningar:"Stafsinge IF"},
  {id:603,fornamn:"Kansli",efternamn:"",epost:"kansli@ugoif.se",telefon:"",roll:"Kontakt",foreningId:603,anteckningar:"Unnaryds GoIF"},
  {id:604,fornamn:"Kansli",efternamn:"",epost:"vessigebrobk@gmail.com",telefon:"",roll:"Kontakt",foreningId:604,anteckningar:"Vessigebro BK"},
  {id:605,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:605,anteckningar:"Glommens IF"},
  {id:606,fornamn:"Kansli",efternamn:"",epost:"kansli@deromebk.se",telefon:"",roll:"Kontakt",foreningId:606,anteckningar:"Derome BK"},
  {id:607,fornamn:"Kansli",efternamn:"",epost:"fredrik.l@ge-sprinkler.se",telefon:"070-941 8303",roll:"Kontakt",foreningId:607,anteckningar:"Väröbacka GIF"},
  {id:608,fornamn:"Kansli",efternamn:"",epost:"tif@telia.com",telefon:"0340-40375",roll:"Kontakt",foreningId:608,anteckningar:"Tvååkers IF"},
  {id:609,fornamn:"Kansli",efternamn:"",epost:"sloingegoif.fotboll@gmail.com",telefon:"",roll:"Kontakt",foreningId:609,anteckningar:"Slöinge GOIF"},
  {id:610,fornamn:"Kansli",efternamn:"",epost:"sekr@morupsif.se",telefon:"0346-828 10",roll:"Kontakt",foreningId:610,anteckningar:"Morups IF"},
  {id:611,fornamn:"Kansli",efternamn:"",epost:"kansli@g-bk.com",telefon:"",roll:"Kontakt",foreningId:611,anteckningar:"Galtabäcks BK"},
  {id:612,fornamn:"Kansli",efternamn:"",epost:"Info@tvaakersibk.se",telefon:"070-297 87 38",roll:"Kontakt",foreningId:612,anteckningar:"Tvååkers IBK"},
  {id:613,fornamn:"Kansli",efternamn:"",epost:"skreaif@telia.com",telefon:"",roll:"Kontakt",foreningId:613,anteckningar:"Skrea IF"},
  {id:614,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:614,anteckningar:"Ysby BK"},
  {id:615,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:615,anteckningar:"Hasslövs IS"},
  {id:616,fornamn:"Kansli",efternamn:"",epost:"christian.bangdal@kvibillebk.se",telefon:"0766-122212",roll:"Kontakt",foreningId:616,anteckningar:"Kvibille BK"},
  {id:617,fornamn:"Kansli",efternamn:"",epost:"info@tlif.se",telefon:"0340-411 68",roll:"Kontakt",foreningId:617,anteckningar:"Träslövsläge IF"},
  {id:618,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:618,anteckningar:"Skogaby BK"},
  {id:619,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:619,anteckningar:"Fegens GK Myrorna"},
  {id:620,fornamn:"Kansli",efternamn:"",epost:"info@hghfc.se",telefon:"035-505 40",roll:"Kontakt",foreningId:620,anteckningar:"HGHFC"},
  {id:621,fornamn:"Kansli",efternamn:"",epost:"rgif.fotboll@outlook.com",telefon:"070-3695850",roll:"Kontakt",foreningId:621,anteckningar:"Rolfstorps GIF"},
  {id:622,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:622,anteckningar:"LTIK Seniorer"},
  {id:623,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:623,anteckningar:"Skottorps IF"},
  {id:624,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:624,anteckningar:"Grimmared IF"},
  {id:625,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:625,anteckningar:"Ränneslövs GIF"},
  {id:626,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:626,anteckningar:"Warberg F11 Prag"},
  {id:627,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:627,anteckningar:"Frillesås FF"},
  {id:628,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:628,anteckningar:"Kungsäter IF"},
  {id:629,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:629,anteckningar:"Slättåkra Skytteförening"},
  {id:630,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:630,anteckningar:"Skällinge BK"},
  {id:631,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:631,anteckningar:"IF Norvalla"},
  {id:632,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:632,anteckningar:"IF Centern"},
  {id:633,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:633,anteckningar:"Sportfiskeklubben Laxen"},
  {id:634,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:634,anteckningar:"Vinbergs IF"},
  {id:635,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:635,anteckningar:"Tofta GIF - Varberg"},
  {id:636,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:636,anteckningar:"Katrinebergs Idrottsförening"},
  {id:637,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:637,anteckningar:"Hyltebruks IF"},
  {id:638,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:638,anteckningar:"Kornhults IK"},
  {id:639,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:639,anteckningar:"Hishults AIS"},
  {id:640,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:640,anteckningar:"ULLAREDS IDROTTSKLUBB"},
  {id:641,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:641,anteckningar:"Frillesås Rid och Körklubb"},
  {id:642,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:642,anteckningar:"Sennans IF"},
  {id:643,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:643,anteckningar:"Knäreds Idrottsklubb"},
  {id:644,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:644,anteckningar:"IBK Puma"},
  {id:645,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:645,anteckningar:"Veddige IBK"},
  {id:646,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:646,anteckningar:"Landeryds GoIF"},
  {id:647,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:647,anteckningar:"Våxtorps Bois"},
  {id:648,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:648,anteckningar:"Valinge IF"},
  {id:649,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:649,anteckningar:"Frillesås Bandy"},
  {id:650,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:650,anteckningar:"Varbergs Roddklubb"},
  {id:651,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:651,anteckningar:"Warberg IBF - kansli"},
  {id:652,fornamn:"Kansli",efternamn:"",epost:"kansli@tronningeif.nu",telefon:"035-40685",roll:"Kontakt",foreningId:652,anteckningar:"Trönninge IF P13"},
  {id:653,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:653,anteckningar:"Warberg IBF F16"},
  {id:654,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:654,anteckningar:"Kungsbacka Dartklubb"},
  {id:655,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:655,anteckningar:"Warberg P12"},
  {id:656,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:656,anteckningar:"Falkenbergs Motorklubb"},
  {id:657,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:657,anteckningar:"Hylte Ryttarförening"},
  {id:658,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:658,anteckningar:"Laholm BK"},
  {id:659,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:659,anteckningar:"Varbergs Hockey Klubb"},
  {id:660,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:660,anteckningar:"Falkenbergs IBK"},
  {id:661,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:661,anteckningar:"HK Varberg"},
  {id:662,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:662,anteckningar:"Halmstad Handbollförening P09"},
  {id:663,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:663,anteckningar:"Arvidstorps IK"},
  {id:664,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:664,anteckningar:"SMBK"},
  {id:665,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:665,anteckningar:"Falkenbergs Kraftsportklubb"},
  {id:666,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:666,anteckningar:"Wärö Dragkampklubb"},
  {id:667,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:667,anteckningar:"Vinbergs IF"},
  {id:668,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:668,anteckningar:"Brottarklubben Falkenberg"},
  {id:669,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:669,anteckningar:"Varbergs Bois BK - Brottning"},
  {id:670,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:670,anteckningar:"Laholms Boulesällskap"},
  {id:671,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:671,anteckningar:"Warberg Innebandyförening F12"},
  {id:672,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:672,anteckningar:"Halmstad Handboll P 2012"},
  {id:673,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:673,anteckningar:"Simlångsdalens Idrottsförening"},
  {id:674,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:674,anteckningar:"Vinbergs IBS"},
  {id:675,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:675,anteckningar:"HALMSTAD KANOTKLUBB"},
  {id:676,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:676,anteckningar:"Särökometernas HK"},
  {id:677,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:677,anteckningar:"Ätrafors BK"},
  {id:678,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:678,anteckningar:"IF Böljan"},
  {id:679,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:679,anteckningar:"Laholms Ryttarförening"},
  {id:680,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:680,anteckningar:"Hylte Bowling BK Turbo"},
  {id:681,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:681,anteckningar:"Laholms Skytteförening"},
  {id:682,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:682,anteckningar:"Falkenbergs Tennisklubb"},
  {id:683,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:683,anteckningar:"Vinbergs IF P2015"},
  {id:684,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:684,anteckningar:"SK Stimmet"},
  {id:685,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:685,anteckningar:"Falkenbergs Roddklubb Team Frk"},
  {id:686,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:686,anteckningar:"Varbergs Kraftsportklubb"},
  {id:687,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:687,anteckningar:"Grimeton IK"},
  {id:688,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:688,anteckningar:"Tölö GF Trupp Mint"},
  {id:689,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:689,anteckningar:"Halmstad Boulehallsallians"},
  {id:690,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:690,anteckningar:"Lövstavikens Båtförening"},
  {id:691,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:691,anteckningar:"Falkenbergs Skytteförening"},
  {id:692,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:692,anteckningar:"IS Halmia"},
  {id:693,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:693,anteckningar:"Laholms Korpen"},
  {id:694,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:694,anteckningar:"Sandö IBK"},
  {id:695,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:695,anteckningar:"Söndrums Skolidrottsförening"},
  {id:696,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:696,anteckningar:"Club Of Aces"},
  {id:697,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:697,anteckningar:"IF Centern P07"},
  {id:698,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:698,anteckningar:"Ullareds Brukshundklubb"},
  {id:699,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:699,anteckningar:"Getinge Bowlingklubb"},
  {id:700,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:700,anteckningar:"Falkenbergs Bågskytteklubb"},
  {id:701,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:701,anteckningar:"Onsala Bollklubb Pojkar 2015"},
  {id:702,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:702,anteckningar:"Skedala Ridklubb Tävling"},
  {id:703,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:703,anteckningar:"IS Orion Handboll"},
  {id:704,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:704,anteckningar:"Bouleföreningen"},
  {id:705,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:705,anteckningar:"BK Astrio P2013"},
  {id:706,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:706,anteckningar:"Falkenbergs Spelförening"},
  {id:707,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:707,anteckningar:"Halmstads Fältrittklubb"},
  {id:708,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:708,anteckningar:"Halmstads Segelflygklubb"},
  {id:709,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:709,anteckningar:"BK Astrio Fotboll"},
  {id:710,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:710,anteckningar:"Föreningen Falken Petanque"},
  {id:711,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:711,anteckningar:"IFK Halmstad Friidrott"},
  {id:712,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:712,anteckningar:"Varbergs Vattenskidklubb"},
  {id:713,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:713,anteckningar:"GOIF Ginsten"},
  {id:714,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:714,anteckningar:"Åsklosters IF"},
  {id:715,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:715,anteckningar:"Warberg IBF P13"},
  {id:716,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:716,anteckningar:"Alets IK F10/11"},
  {id:717,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:717,anteckningar:"BK Astrio P2012"},
  {id:718,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:718,anteckningar:"Warberg IBF F15"},
  {id:719,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:719,anteckningar:"Slöinge Tennisklubb"},
  {id:720,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:720,anteckningar:"OK Löftan"},
  {id:721,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:721,anteckningar:"Alets IK"},
  {id:722,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:722,anteckningar:"Falkenbergs Volleybollklubb"},
  {id:723,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:723,anteckningar:"Träningskompaniet"},
  {id:724,fornamn:"Kansli",efternamn:"",epost:"kansli@tronningeif.nu",telefon:"035-40685",roll:"Kontakt",foreningId:724,anteckningar:"Trönninge IF"},
  {id:725,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:725,anteckningar:"Astrio P2011"},
  {id:726,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:726,anteckningar:"Halmstad Innebandy ungdom"},
  {id:727,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:727,anteckningar:"Särö Kullavik IF"},
  {id:728,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:728,anteckningar:"Halmstad Handboll F2011"},
  {id:729,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:729,anteckningar:"Varbergs GIF Gymnastikförening"},
  {id:730,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:730,anteckningar:"FK Friskus-Varberg"},
  {id:731,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:731,anteckningar:"Varbergs Skateboardklubb Skatehallen"},
  {id:732,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:732,anteckningar:"Tvååkers Sport o Fiskevårdsförening"},
  {id:733,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:733,anteckningar:"Vapnö Idrottsförening F14-16"},
  {id:734,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:734,anteckningar:"Varbergs BOIS FC"},
  {id:735,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:735,anteckningar:"BK Astrio P07"},
  {id:736,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:736,anteckningar:"Trönninge BK Fotboll"},
  {id:737,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:737,anteckningar:"Halmstad Hammers"},
  {id:738,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:738,anteckningar:"Läjets Boule Huvudföreningen"},
  {id:739,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:739,anteckningar:"Båt/Kultur/Miljöförening Halmstad"},
  {id:740,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:740,anteckningar:"Friskis & Svettis IF"},
  {id:741,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:741,anteckningar:"Föreningen Varbergs SIM"}
];

const JAMTLAND=[
  {id:742,namn:"Alsens IF",epost:"alsensif@gmail.com",epostOrdf:"bertil@friaskog.se",ort:"Alsen",kommun:"Krokom",idrott:"Fotboll",burkar:8243,skickadeMail:0,ordforande:"Bertil Johansson",telefon:"0640-421 89",lan:"Jämtland",ant:"",mailLog:[],kontaktIds:[742],taggar:[]},
  {id:743,namn:"Krokoms Motorklubb",epost:"",epostOrdf:"",ort:"Krokom",kommun:"Krokom",idrott:"Motorsport",burkar:400,skickadeMail:0,ordforande:"Kenneth Andersson",telefon:"0640-624 33",lan:"Jämtland",ant:"",mailLog:[],kontaktIds:[743],taggar:[]},
  {id:744,namn:"Bräcke Ridklubb",epost:"info@brackeridklubb.se",epostOrdf:"info@brackeridklubb.se",ort:"Bräcke",kommun:"Bräcke",idrott:"Ridsport",burkar:22,skickadeMail:0,ordforande:"Styrelsen",telefon:"0693-716 14",lan:"Jämtland",ant:"",mailLog:[],kontaktIds:[744],taggar:[]},
  {id:745,namn:"Bergs IK Fotboll",epost:"bergsik@telia.com",epostOrdf:"bergsik@telia.com",ort:"Svenstavik",kommun:"Berg",idrott:"Fotboll",burkar:9,skickadeMail:0,ordforande:"Anneli Prestberg",telefon:"0687-10020",lan:"Jämtland",ant:"",mailLog:[],kontaktIds:[745],taggar:[]}
];

const JAMTLAND_CONTACTS=[
  {id:742,fornamn:"Kansli",efternamn:"",epost:"alsensif@gmail.com",telefon:"0640-421 89",roll:"Kontakt",foreningId:742,anteckningar:"Alsens IF"},
  {id:743,fornamn:"Kansli",efternamn:"",epost:"",telefon:"0640-624 33",roll:"Kontakt",foreningId:743,anteckningar:"Krokoms Motorklubb"},
  {id:744,fornamn:"Kansli",efternamn:"",epost:"info@brackeridklubb.se",telefon:"0693-716 14",roll:"Kontakt",foreningId:744,anteckningar:"Bräcke Ridklubb"},
  {id:745,fornamn:"Kansli",efternamn:"",epost:"bergsik@telia.com",telefon:"0687-10020",roll:"Kontakt",foreningId:745,anteckningar:"Bergs IK Fotboll"}
];

const SMALAND=[
  {id:746,namn:"Smålandsstenar GoIF",epost:"sgoif@bahnhof.se",epostOrdf:"sgoif@bahnhof.se",ort:"Smålandsstenar",kommun:"Smålandsstenar",idrott:"Fotboll",burkar:39080,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[746],taggar:[]},
  {id:747,namn:"Norrahammars GIS",epost:"erik@framtiden.com",epostOrdf:"erik@framtiden.com",ort:"Norrahammar",kommun:"Norrahammar",idrott:"Fleridrott",burkar:35631,skickadeMail:0,ordforande:"Erik Holmkvist Olin",telefon:"036-611 81",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[747],taggar:[]},
  {id:748,namn:"Sommens AIF",epost:"info@sommensaif.se",epostOrdf:"info@sommensaif.se",ort:"Sommen",kommun:"Sommen",idrott:"Fleridrott",burkar:20832,skickadeMail:0,ordforande:"Kjell Johansson",telefon:"0140-303 99",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[748],taggar:[]},
  {id:749,namn:"Malmbäcks Dartklubb",epost:"",epostOrdf:"",ort:"Malmbäck",kommun:"Malmbäck",idrott:"Dart",burkar:20374,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[749],taggar:[]},
  {id:750,namn:"Månsarps IF",epost:"ordforande@mansarpsif.se",epostOrdf:"ordforande@mansarpsif.se",ort:"Månsarp",kommun:"Månsarp",idrott:"Fleridrott",burkar:19332,skickadeMail:0,ordforande:"Jessika Albrektsson",telefon:"0707-184586",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[750],taggar:[]},
  {id:751,namn:"Fagerhult Habo IB",epost:"",epostOrdf:"",ort:"Habo",kommun:"Habo",idrott:"Innebandy",burkar:16051,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[751],taggar:[]},
  {id:752,namn:"Stensjöns IF",epost:"",epostOrdf:"",ort:"Stensjön",kommun:"Stensjön",idrott:"Fotboll",burkar:16029,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[752],taggar:[]},
  {id:753,namn:"Tranås AIF Ishockeyförening",epost:"kansli@taif.se",epostOrdf:"kansli@taif.se",ort:"Tranås",kommun:"Tranås",idrott:"Ishockey",burkar:15615,skickadeMail:0,ordforande:"",telefon:"0140-146 24",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[753],taggar:[]},
  {id:754,namn:"Burseryds idrottsförening",epost:"burserydsif@gmail.com",epostOrdf:"burserydsif@gmail.com",ort:"Burseryd",kommun:"Burseryd",idrott:"Fleridrott",burkar:12845,skickadeMail:0,ordforande:"",telefon:"0768-009017",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[754],taggar:[]},
  {id:755,namn:"HA 74",epost:"",epostOrdf:"",ort:"Huskvarna",kommun:"Huskvarna",idrott:"Fleridrott",burkar:10405,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[755],taggar:[]},
  {id:756,namn:"Boro/Vetlanda HC",epost:"",epostOrdf:"",ort:"Vetlanda",kommun:"Vetlanda",idrott:"Ishockey",burkar:9850,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[756],taggar:[]},
  {id:757,namn:"Näshults IF",epost:"",epostOrdf:"",ort:"Näshult",kommun:"Näshult",idrott:"Fotboll",burkar:8686,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[757],taggar:[]},
  {id:758,namn:"Visingsö AIS",epost:"visingso_ais@hotmail.se",epostOrdf:"visingso_ais@hotmail.se",ort:"Visingsö",kommun:"Visingsö",idrott:"Fleridrott",burkar:8521,skickadeMail:0,ordforande:"Johan Strandberg",telefon:"0763-010200",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[758],taggar:[]},
  {id:759,namn:"Skeppshults BK P-01/02/03",epost:"",epostOrdf:"",ort:"Skeppshult",kommun:"Skeppshult",idrott:"Fotboll",burkar:7732,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[759],taggar:[]},
  {id:760,namn:"Holsby Sportklubb",epost:"",epostOrdf:"",ort:"Holsby",kommun:"Holsby",idrott:"Fleridrott",burkar:7700,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[760],taggar:[]},
  {id:761,namn:"Nässjö IF Pantamera",epost:"kansli@nassjoif.se",epostOrdf:"kansli@nassjoif.se",ort:"Nässjö",kommun:"Nässjö",idrott:"Fleridrott",burkar:7688,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[761],taggar:[]},
  {id:762,namn:"HC Dalen",epost:"urban@hcdalen.se",epostOrdf:"urban@hcdalen.se",ort:"Dalen",kommun:"Dalen",idrott:"Ishockey",burkar:7216,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[762],taggar:[]},
  {id:763,namn:"Mariebo IK P2016",epost:"kansli@marieboik.org",epostOrdf:"kansli@marieboik.org",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:7189,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[763],taggar:[]},
  {id:764,namn:"Aneby Sportklubb",epost:"",epostOrdf:"",ort:"Aneby",kommun:"Aneby",idrott:"Fleridrott",burkar:6300,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[764],taggar:[]},
  {id:765,namn:"Forsheda IF",epost:"info@forshedaif.se",epostOrdf:"info@forshedaif.se",ort:"Forsheda",kommun:"Forsheda",idrott:"Fotboll",burkar:5962,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[765],taggar:[]},
  {id:766,namn:"Skinnarebo Golf & Country Club",epost:"skinnarebo.golf@telia.com",epostOrdf:"skinnarebo.golf@telia.com",ort:"Skillingaryd",kommun:"Skillingaryd",idrott:"Golf",burkar:5842,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[766],taggar:[]},
  {id:767,namn:"Bratteborgs Ryttarsällskap",epost:"styrelsen@bratteborgsrs.se",epostOrdf:"styrelsen@bratteborgsrs.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Ridsport",burkar:5695,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[767],taggar:[]},
  {id:768,namn:"Hooks Idrottsförening",epost:"info@hooksif.se",epostOrdf:"info@hooksif.se",ort:"Hook",kommun:"Hook",idrott:"Fleridrott",burkar:5650,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[768],taggar:[]},
  {id:769,namn:"Mullsjö AIS",epost:"info@mullsjoais.se",epostOrdf:"info@mullsjoais.se",ort:"Mullsjö",kommun:"Mullsjö",idrott:"Fleridrott",burkar:5643,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[769],taggar:[]},
  {id:770,namn:"Rydaholms skridskoklubb",epost:"adam.lantz85@gmail.com",epostOrdf:"adam.lantz85@gmail.com",ort:"Rydaholm",kommun:"Rydaholm",idrott:"Skridskor",burkar:5100,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[770],taggar:[]},
  {id:771,namn:"Club I Stan Boule",epost:"clubistanboule@outlook.com",epostOrdf:"clubistanboule@outlook.com",ort:"Jönköping",kommun:"Jönköping",idrott:"Boule",burkar:4903,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[771],taggar:[]},
  {id:772,namn:"IF Haga",epost:"ifhaga.kontakt@gmail.com",epostOrdf:"ifhaga.kontakt@gmail.com",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:3467,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[772],taggar:[]},
  {id:773,namn:"Österkorsberga IF",epost:"info@osterkorsbergaif.se",epostOrdf:"info@osterkorsbergaif.se",ort:"Österkorsberga",kommun:"Österkorsberga",idrott:"Fotboll",burkar:3446,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[773],taggar:[]},
  {id:774,namn:"Hallby IF Handboll Kiosk",epost:"info@hallbyhandboll.se",epostOrdf:"info@hallbyhandboll.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Handboll",burkar:3416,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[774],taggar:[]},
  {id:775,namn:"Kvillsfors IF",epost:"lolaf@spray.se",epostOrdf:"lolaf@spray.se",ort:"Kvillsfors",kommun:"Kvillsfors",idrott:"Fleridrott",burkar:3178,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[775],taggar:[]},
  {id:776,namn:"Husqvarna IK",epost:"info@husqvarnaik.nu",epostOrdf:"info@husqvarnaik.nu",ort:"Huskvarna",kommun:"Huskvarna",idrott:"Fleridrott",burkar:3164,skickadeMail:0,ordforande:"Paul Jacobsson",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[776],taggar:[]},
  {id:777,namn:"Tranås BoIS BK Bandysektion",epost:"info@tranasbois.se",epostOrdf:"info@tranasbois.se",ort:"Tranås",kommun:"Tranås",idrott:"Bandy",burkar:3030,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[777],taggar:[]},
  {id:778,namn:"Kännestubba BTK",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Bordtennis",burkar:2999,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[778],taggar:[]},
  {id:779,namn:"Bors SK",epost:"info@borssk.nu",epostOrdf:"info@borssk.nu",ort:"Bor",kommun:"Bor",idrott:"Fotboll",burkar:2907,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[779],taggar:[]},
  {id:780,namn:"Highland Dart Club",epost:"info@highlanddart.se",epostOrdf:"info@highlanddart.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Dart",burkar:2871,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[780],taggar:[]},
  {id:781,namn:"Norrahammars IK",epost:"norrahammarsik@outlook.com",epostOrdf:"norrahammarsik@outlook.com",ort:"Norrahammar",kommun:"Norrahammar",idrott:"Fleridrott",burkar:2759,skickadeMail:0,ordforande:"Patric Eriksson",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[781],taggar:[]},
  {id:782,namn:"Barnarps IF",epost:"barnarpsif@gmail.com",epostOrdf:"barnarpsif@gmail.com",ort:"Barnarp",kommun:"Barnarp",idrott:"Fotboll",burkar:2504,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[782],taggar:[]},
  {id:783,namn:"KFUM Jönköping Ungdom",epost:"info@kfum.org",epostOrdf:"info@kfum.org",ort:"Jönköping",kommun:"Jönköping",idrott:"Fleridrott",burkar:2284,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[783],taggar:[]},
  {id:784,namn:"Sandsjöfors SK Bordtennis",epost:"",epostOrdf:"",ort:"Sandsjöfors",kommun:"Sandsjöfors",idrott:"Bordtennis",burkar:1750,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[784],taggar:[]},
  {id:785,namn:"IFK Hult Damlag",epost:"ifkhult@hotmail.com",epostOrdf:"ifkhult@hotmail.com",ort:"Hult",kommun:"Hult",idrott:"Fotboll",burkar:1564,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[785],taggar:[]},
  {id:786,namn:"Svartmyra",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Fleridrott",burkar:1500,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[786],taggar:[]},
  {id:787,namn:"FK Liljan Värnamo",epost:"",epostOrdf:"",ort:"Värnamo",kommun:"Värnamo",idrott:"Fotboll",burkar:1441,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[787],taggar:[]},
  {id:788,namn:"HVetlanda Gymnastikförening/Tävling",epost:"hvetlandagf@gmail.com",epostOrdf:"hvetlandagf@gmail.com",ort:"Vetlanda",kommun:"Vetlanda",idrott:"Gymnastik",burkar:1250,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[788],taggar:[]},
  {id:789,namn:"Jönköping Bandy IF",epost:"kansli@jonkopingbandy.nu",epostOrdf:"kansli@jonkopingbandy.nu",ort:"Jönköping",kommun:"Jönköping",idrott:"Bandy",burkar:1200,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[789],taggar:[]},
  {id:790,namn:"Östra Sportklubb",epost:"pauline@gard.at",epostOrdf:"pauline@gard.at",ort:"Jönköping",kommun:"Jönköping",idrott:"Fleridrott",burkar:1126,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[790],taggar:[]},
  {id:791,namn:"Farstorps IK/Styrelsen",epost:"kjell.conradsson1@gmail.com",epostOrdf:"kjell.conradsson1@gmail.com",ort:"Farstorp",kommun:"Farstorp",idrott:"Fleridrott",burkar:1003,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[791],taggar:[]},
  {id:792,namn:"Nässjö HC",epost:"kansli@nhc.se",epostOrdf:"kansli@nhc.se",ort:"Nässjö",kommun:"Nässjö",idrott:"Ishockey",burkar:948,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[792],taggar:[]},
  {id:793,namn:"Jönköpings Bollklubb",epost:"john.bjurevik@jonkopingsbk.se",epostOrdf:"john.bjurevik@jonkopingsbk.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:900,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[793],taggar:[]},
  {id:794,namn:"BK Sture",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:765,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[794],taggar:[]},
  {id:795,namn:"IBF Tranås F06/07",epost:"ibf-tranas@hotmail.se",epostOrdf:"ibf-tranas@hotmail.se",ort:"Tranås",kommun:"Tranås",idrott:"Innebandy",burkar:735,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[795],taggar:[]},
  {id:796,namn:"KFUM Nässjö IA-Basket",epost:"",epostOrdf:"",ort:"Nässjö",kommun:"Nässjö",idrott:"Basket",burkar:729,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[796],taggar:[]},
  {id:797,namn:"Frinnaryds IF Styrelsen",epost:"jannew46@passagen.se",epostOrdf:"jannew46@passagen.se",ort:"Frinnaryd",kommun:"Frinnaryd",idrott:"Fleridrott",burkar:701,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[797],taggar:[]},
  {id:798,namn:"Smålandsstenar TK",epost:"",epostOrdf:"",ort:"Smålandsstenar",kommun:"Smålandsstenar",idrott:"Tennis",burkar:660,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[798],taggar:[]},
  {id:799,namn:"Jönköpings AK",epost:"jonkopingsak@gmail.com",epostOrdf:"jonkopingsak@gmail.com",ort:"Jönköping",kommun:"Jönköping",idrott:"Friidrott",burkar:644,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[799],taggar:[]},
  {id:800,namn:"Hultsjö IF Atom",epost:"anita.ahnstedt@hotmail.com",epostOrdf:"anita.ahnstedt@hotmail.com",ort:"Hultsjö",kommun:"Hultsjö",idrott:"Fotboll",burkar:563,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[800],taggar:[]},
  {id:801,namn:"Jönköping Spartans Cheer",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Cheerleading",burkar:501,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[801],taggar:[]},
  {id:802,namn:"Värnamo Brottarklubb",epost:"vbk@varnamobk.se",epostOrdf:"vbk@varnamobk.se",ort:"Värnamo",kommun:"Värnamo",idrott:"Brottning",burkar:418,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[802],taggar:[]},
  {id:803,namn:"BTK Clipper",epost:"info.btkclipper@gmail.com",epostOrdf:"info.btkclipper@gmail.com",ort:"Jönköping",kommun:"Jönköping",idrott:"Bordtennis",burkar:400,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[803],taggar:[]},
  {id:804,namn:"Nässjö Golfklubb",epost:"info@nassjogk.se",epostOrdf:"info@nassjogk.se",ort:"Nässjö",kommun:"Nässjö",idrott:"Golf",burkar:397,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[804],taggar:[]},
  {id:805,namn:"Tranås Ridklubb",epost:"tranasridklubbstyrelsen@gmail.com",epostOrdf:"tranasridklubbstyrelsen@gmail.com",ort:"Tranås",kommun:"Tranås",idrott:"Ridsport",burkar:391,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[805],taggar:[]},
  {id:806,namn:"Wettern Taekwondo",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Kampsport",burkar:386,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[806],taggar:[]},
  {id:807,namn:"Nässjö Jaktskyttecenter",epost:"jakt@nassjojaktskyttecenter.se",epostOrdf:"jakt@nassjojaktskyttecenter.se",ort:"Nässjö",kommun:"Nässjö",idrott:"Skytte",burkar:377,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[807],taggar:[]},
  {id:808,namn:"Jönköpings OK",epost:"info@jonkopingsok.nu",epostOrdf:"info@jonkopingsok.nu",ort:"Jönköping",kommun:"Jönköping",idrott:"Orientering",burkar:358,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[808],taggar:[]},
  {id:809,namn:"Jönköpings Södra IF P7",epost:"",epostOrdf:"",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:288,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[809],taggar:[]},
  {id:810,namn:"IF Hallby SOK",epost:"skidor@hallbysok.se",epostOrdf:"skidor@hallbysok.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Orientering",burkar:271,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[810],taggar:[]},
  {id:811,namn:"Rörviks Idrottsförening",epost:"ronnieroos@telia.com",epostOrdf:"ronnieroos@telia.com",ort:"Rörvik",kommun:"Rörvik",idrott:"Fleridrott",burkar:260,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[811],taggar:[]},
  {id:812,namn:"Ölmstad IS Huvudstyrelsen",epost:"willaredt@telia.com",epostOrdf:"willaredt@telia.com",ort:"Ölmstad",kommun:"Ölmstad",idrott:"Fleridrott",burkar:253,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[812],taggar:[]},
  {id:813,namn:"Tranås FF",epost:"tranasff@live.se",epostOrdf:"tranasff@live.se",ort:"Tranås",kommun:"Tranås",idrott:"Fotboll",burkar:212,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[813],taggar:[]},
  {id:814,namn:"Nässjö Ridklubb",epost:"",epostOrdf:"",ort:"Nässjö",kommun:"Nässjö",idrott:"Ridsport",burkar:195,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[814],taggar:[]},
  {id:815,namn:"Tranås Badmintonklubb",epost:"tranasbmkkassor@gmail.com",epostOrdf:"tranasbmkkassor@gmail.com",ort:"Tranås",kommun:"Tranås",idrott:"Badminton",burkar:133,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[815],taggar:[]},
  {id:816,namn:"Mariebo IK F 2011/12",epost:"kansli@marieboik.org",epostOrdf:"kansli@marieboik.org",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:132,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[816],taggar:[]},
  {id:817,namn:"Bodafors Innebandysällskap",epost:"bodaforsinnebandy@gmail.com",epostOrdf:"bodaforsinnebandy@gmail.com",ort:"Bodafors",kommun:"Bodafors",idrott:"Innebandy",burkar:127,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[817],taggar:[]},
  {id:818,namn:"Gislaved Skridsko Klubb Ishockey",epost:"borje.eriksson@gsk-hockey.se",epostOrdf:"borje.eriksson@gsk-hockey.se",ort:"Gislaved",kommun:"Gislaved",idrott:"Ishockey",burkar:98,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[818],taggar:[]},
  {id:819,namn:"Jönköpings Fältrittklubb",epost:"kansliet@jonkopingsfaltrittklubb.se",epostOrdf:"kansliet@jonkopingsfaltrittklubb.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Ridsport",burkar:96,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[819],taggar:[]},
  {id:820,namn:"Nässjö FF",epost:"styrelsen@nff.nu",epostOrdf:"styrelsen@nff.nu",ort:"Nässjö",kommun:"Nässjö",idrott:"Fotboll",burkar:94,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[820],taggar:[]},
  {id:821,namn:"Mariebo IK P09",epost:"kansli@marieboik.org",epostOrdf:"kansli@marieboik.org",ort:"Jönköping",kommun:"Jönköping",idrott:"Fotboll",burkar:72,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[821],taggar:[]},
  {id:822,namn:"Holavedens AIS",epost:"info@holavedensais.se",epostOrdf:"info@holavedensais.se",ort:"Holaveden",kommun:"Holaveden",idrott:"Fleridrott",burkar:64,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[822],taggar:[]},
  {id:823,namn:"Bankeryds Ridklubb Saloon",epost:"",epostOrdf:"",ort:"Bankeryd",kommun:"Bankeryd",idrott:"Ridsport",burkar:50,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[823],taggar:[]},
  {id:824,namn:"Hovslätts IK Innebandy",epost:"hovslattsik@gmail.com",epostOrdf:"hovslattsik@gmail.com",ort:"Hovslätt",kommun:"Hovslätt",idrott:"Innebandy",burkar:47,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[824],taggar:[]},
  {id:825,namn:"IKHP",epost:"kansli@ikhp.se",epostOrdf:"kansli@ikhp.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Fleridrott",burkar:44,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[825],taggar:[]},
  {id:826,namn:"Brunnsparkskyrkan",epost:"exp@brunnsparkskyrkan.se",epostOrdf:"exp@brunnsparkskyrkan.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Förening",burkar:40,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[826],taggar:[]},
  {id:827,namn:"Hovslätts Idrottsklubb Huvudföreningen",epost:"hovslattsik@gmail.com",epostOrdf:"hovslattsik@gmail.com",ort:"Hovslätt",kommun:"Hovslätt",idrott:"Fleridrott",burkar:37,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[827],taggar:[]},
  {id:828,namn:"Team Clan Nässjö BK",epost:"bonabow@gmail.com",epostOrdf:"bonabow@gmail.com",ort:"Nässjö",kommun:"Nässjö",idrott:"Fleridrott",burkar:29,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[828],taggar:[]},
  {id:829,namn:"IF Eksjö Fotboll",epost:"eksjofotboll@gmail.com",epostOrdf:"eksjofotboll@gmail.com",ort:"Eksjö",kommun:"Eksjö",idrott:"Fotboll",burkar:26,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[829],taggar:[]},
  {id:830,namn:"Tabergsdalens Tennisklubb",epost:"tabergsdalens.tk@telia.com",epostOrdf:"tabergsdalens.tk@telia.com",ort:"Taberg",kommun:"Taberg",idrott:"Tennis",burkar:23,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[830],taggar:[]},
  {id:831,namn:"Tabergs Sportklubb",epost:"",epostOrdf:"",ort:"Taberg",kommun:"Taberg",idrott:"Fleridrott",burkar:20,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[831],taggar:[]},
  {id:832,namn:"IFK Värnamo Ungdom",epost:"kansli@ifkvarnamo.se",epostOrdf:"kansli@ifkvarnamo.se",ort:"Värnamo",kommun:"Värnamo",idrott:"Fotboll",burkar:14,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[832],taggar:[]},
  {id:833,namn:"Brahe Basket",epost:"kansli@brahebasket.se",epostOrdf:"kansli@brahebasket.se",ort:"Jönköping",kommun:"Jönköping",idrott:"Basket",burkar:1,skickadeMail:0,ordforande:"",telefon:"",lan:"Jönköping",ant:"",mailLog:[],kontaktIds:[833],taggar:[]}
];

const SMALAND_CONTACTS=[
  {id:746,fornamn:"Kansli",efternamn:"",epost:"info@sgoif.se",telefon:"",roll:"Kontakt",foreningId:746,anteckningar:"Smålandsstenar GoIF"},
  {id:747,fornamn:"Kansli",efternamn:"",epost:"",telefon:"036-611 81",roll:"Kontakt",foreningId:747,anteckningar:"Norrahammars GIS"},
  {id:748,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:748,anteckningar:"Sommens AIF"},
  {id:749,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:749,anteckningar:"Malmbäcks Dartklubb"},
  {id:750,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:750,anteckningar:"Månsarps IF"},
  {id:751,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:751,anteckningar:"Fagerhult Habo IB"},
  {id:752,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:752,anteckningar:"Stensjöns IF"},
  {id:753,fornamn:"Kansli",efternamn:"",epost:"kansli@taif.se",telefon:"0140-146 24",roll:"Kontakt",foreningId:753,anteckningar:"Tranås AIF Ishockeyförening"},
  {id:754,fornamn:"Kansli",efternamn:"",epost:"burserydsif@gmail.com",telefon:"0768-009017",roll:"Kontakt",foreningId:754,anteckningar:"Burseryds idrottsförening"},
  {id:755,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:755,anteckningar:"HA 74"},
  {id:756,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:756,anteckningar:"Boro/Vetlanda HC"},
  {id:757,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:757,anteckningar:"Näshults IF"},
  {id:758,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:758,anteckningar:"Visingsö AIS"},
  {id:759,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:759,anteckningar:"Skeppshults BK P-01/02/03"},
  {id:760,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:760,anteckningar:"Holsby Sportklubb"},
  {id:761,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:761,anteckningar:"Nässjö IF Pantamera"},
  {id:762,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:762,anteckningar:"HC Dalen"},
  {id:763,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:763,anteckningar:"Mariebo IK P2016"},
  {id:764,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:764,anteckningar:"Aneby Sportklubb"},
  {id:765,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:765,anteckningar:"Forsheda IF"},
  {id:766,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:766,anteckningar:"Skinnarebo Golf & Country Club"},
  {id:767,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:767,anteckningar:"Bratteborgs Ryttarsällskap"},
  {id:768,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:768,anteckningar:"Hooks Idrottsförening"},
  {id:769,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:769,anteckningar:"Mullsjö AIS"},
  {id:770,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:770,anteckningar:"Rydaholms skridskoklubb"},
  {id:771,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:771,anteckningar:"Club I Stan Boule"},
  {id:772,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:772,anteckningar:"IF Haga"},
  {id:773,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:773,anteckningar:"Österkorsberga IF"},
  {id:774,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:774,anteckningar:"Hallby IF Handboll Kiosk"},
  {id:775,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:775,anteckningar:"Kvillsfors IF"},
  {id:776,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:776,anteckningar:"Husqvarna IK"},
  {id:777,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:777,anteckningar:"Tranås BoIS BK Bandysektion"},
  {id:778,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:778,anteckningar:"Kännestubba BTK"},
  {id:779,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:779,anteckningar:"Bors SK"},
  {id:780,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:780,anteckningar:"Highland Dart Club"},
  {id:781,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:781,anteckningar:"Norrahammars IK"},
  {id:782,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:782,anteckningar:"Barnarps IF"},
  {id:783,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:783,anteckningar:"KFUM Jönköping Ungdom"},
  {id:784,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:784,anteckningar:"Sandsjöfors SK Bordtennis"},
  {id:785,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:785,anteckningar:"IFK Hult Damlag"},
  {id:786,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:786,anteckningar:"Svartmyra"},
  {id:787,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:787,anteckningar:"FK Liljan Värnamo"},
  {id:788,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:788,anteckningar:"HVetlanda Gymnastikförening/Tävling"},
  {id:789,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:789,anteckningar:"Jönköping Bandy IF"},
  {id:790,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:790,anteckningar:"Östra Sportklubb"},
  {id:791,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:791,anteckningar:"Farstorps IK/Styrelsen"},
  {id:792,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:792,anteckningar:"Nässjö HC"},
  {id:793,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:793,anteckningar:"Jönköpings Bollklubb"},
  {id:794,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:794,anteckningar:"BK Sture"},
  {id:795,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:795,anteckningar:"IBF Tranås F06/07"},
  {id:796,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:796,anteckningar:"KFUM Nässjö IA-Basket"},
  {id:797,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:797,anteckningar:"Frinnaryds IF Styrelsen"},
  {id:798,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:798,anteckningar:"Smålandsstenar TK"},
  {id:799,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:799,anteckningar:"Jönköpings AK"},
  {id:800,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:800,anteckningar:"Hultsjö IF Atom"},
  {id:801,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:801,anteckningar:"Jönköping Spartans Cheer"},
  {id:802,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:802,anteckningar:"Värnamo Brottarklubb"},
  {id:803,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:803,anteckningar:"BTK Clipper"},
  {id:804,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:804,anteckningar:"Nässjö Golfklubb"},
  {id:805,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:805,anteckningar:"Tranås Ridklubb"},
  {id:806,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:806,anteckningar:"Wettern Taekwondo"},
  {id:807,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:807,anteckningar:"Nässjö Jaktskyttecenter"},
  {id:808,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:808,anteckningar:"Jönköpings OK"},
  {id:809,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:809,anteckningar:"Jönköpings Södra IF P7"},
  {id:810,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:810,anteckningar:"IF Hallby SOK"},
  {id:811,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:811,anteckningar:"Rörviks Idrottsförening"},
  {id:812,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:812,anteckningar:"Ölmstad IS Huvudstyrelsen"},
  {id:813,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:813,anteckningar:"Tranås FF"},
  {id:814,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:814,anteckningar:"Nässjö Ridklubb"},
  {id:815,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:815,anteckningar:"Tranås Badmintonklubb"},
  {id:816,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:816,anteckningar:"Mariebo IK F 2011/12"},
  {id:817,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:817,anteckningar:"Bodafors Innebandysällskap"},
  {id:818,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:818,anteckningar:"Gislaved Skridsko Klubb Ishockey"},
  {id:819,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:819,anteckningar:"Jönköpings Fältrittklubb"},
  {id:820,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:820,anteckningar:"Nässjö FF"},
  {id:821,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:821,anteckningar:"Mariebo IK P09"},
  {id:822,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:822,anteckningar:"Holavedens AIS"},
  {id:823,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:823,anteckningar:"Bankeryds Ridklubb Saloon"},
  {id:824,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:824,anteckningar:"Hovslätts IK Innebandy"},
  {id:825,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:825,anteckningar:"IKHP"},
  {id:826,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:826,anteckningar:"Brunnsparkskyrkan"},
  {id:827,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:827,anteckningar:"Hovslätts Idrottsklubb Huvudföreningen"},
  {id:828,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:828,anteckningar:"Team Clan Nässjö BK"},
  {id:829,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:829,anteckningar:"IF Eksjö Fotboll"},
  {id:830,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:830,anteckningar:"Tabergsdalens Tennisklubb"},
  {id:831,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:831,anteckningar:"Tabergs Sportklubb"},
  {id:832,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:832,anteckningar:"IFK Värnamo Ungdom"},
  {id:833,fornamn:"Kansli",efternamn:"",epost:"",telefon:"",roll:"Kontakt",foreningId:833,anteckningar:"Brahe Basket"}
];

const INIT_FR=[...BLEKINGE,...DALARNA,...GOTLAND,...GAVLEBORG,...HALLAND,...JAMTLAND,...SMALAND];

const INIT_CONTACTS_ALL=[...INIT_CONTACTS,...GOTLAND_CONTACTS,...GAVLEBORG_CONTACTS,...HALLAND_CONTACTS,...JAMTLAND_CONTACTS,...SMALAND_CONTACTS];

const TEMPLATES=[
  {
    id:"mail1",
    namn:"📬 Mail 1 – Introduktion",
    steg:1,
    subject:"{{namn}} – vet ni hur mycket pant ni missar?",
    body:`Hej {{namn}}!

Vi lanserar just nu BottleDROP – Ge Pant — en ny plattform som gör det enklare för människor att ge sin pant till lokala föreningar.

Vi söker nu 5 partnerföreningar som vill få tidig access till plattformen och vara med under pilotlanseringen.

Som partnerförening får {{namn}}:

• Kostnadsfri access under pilotlanseringen
• Möjlighet att påverka utvecklingen
• Prioriterad support
• 50% lägre abonnemangspris for life

Ansök här: https://www.bottledrop.se/

Vi väljer partnerföreningar löpande.

Allt gott,
{{avsandare}}`,
    html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Aptos,Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
  <!-- Header -->
  <tr><td style="background:#0f172a;padding:24px 32px;text-align:center">
    <div style="color:#2dd4bf;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">BottleDROP</div>
    <div style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3">Ge Pant — Pilotlansering</div>
    <div style="color:#94a3b8;font-size:13px;margin-top:6px">Vi söker 5 partnerföreningar</div>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:32px 32px 24px">
    <p style="margin:0 0 16px;font-size:15px;color:#1e293b;line-height:1.6">Hej {{namn}}!</p>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7">Vi lanserar just nu <strong>BottleDROP – Ge Pant</strong> — en ny plattform som gör det enklare för människor att ge sin pant till lokala föreningar.</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">Vi söker <strong>5 partnerföreningar</strong> som vill få tidig access till plattformen och vara med under pilotlanseringen.</p>
    <!-- Benefits -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:24px">
      <tr><td style="padding:20px 24px">
        <div style="font-size:12px;font-weight:700;color:#2dd4bf;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Som partnerförening får {{namn}}</div>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Kostnadsfri access under pilotlanseringen</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Möjlighet att påverka utvecklingen</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Prioriterad support</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b"><strong>50% lägre abonnemangspris for life</strong></span></td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6">Vi väljer partnerföreningar löpande — platserna är begränsade.</p>
    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr><td style="background:#2dd4bf;border-radius:8px;padding:14px 28px;text-align:center">
        <a href="https://www.bottledrop.se/" style="color:#0f172a;font-size:15px;font-weight:700;text-decoration:none">Ansök om partnerskap →</a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6">Mer information: <a href="https://www.bottledrop.se/" style="color:#2dd4bf">www.bottledrop.se</a></p>
  </td></tr>
  <!-- Footer -->
  <tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0">
    <p style="margin:0;font-size:13px;color:#94a3b8">Allt gott,<br><strong style="color:#374151">{{avsandare}}</strong></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
  },
  {
    id:"mail2",
    namn:"🤝 Mail 2 – Uppföljning",
    steg:2,
    subject:"De flesta föreningar vet inte om det här",
    body:`Hej {{namn}}!

Följer upp mitt förra mail – och tänkte dela en sak som ofta förvånar föreningar.

Problemet ser ut så här: ett hushåll vill ge sin pant till {{namn}}, men vet inte riktigt hur. De samlar på sig tills nästa insamlingsrunda – men glömmer, eller orkar inte köra dit. Föreningen å sin sida vet inte när det är värt att köra en runda, för de vet inte hur mycket som väntar.

Resultatet: pengarna stannar hos butiken i stället.

Ge Pant löser det. Hushållet pantar när det passar dem – och summan går direkt till {{namn}} via appen. Inga rundor att planera. Inga påminnelser att skicka. Ingen logistik.

Vill ni vara med och testa det under piloten?

Ansök här: https://www.bottledrop.se/

Allt gott,
{{avsandare}}`,
    html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Aptos,Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
  <tr><td style="background:#0f172a;padding:20px 32px;text-align:center">
    <div style="color:#2dd4bf;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">BottleDROP – Ge Pant</div>
  </td></tr>
  <tr><td style="padding:32px 32px 8px">
    <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.6">Hej {{namn}}!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">Följer upp mitt förra mail – och tänkte dela en sak som ofta förvånar föreningar.</p>
    <!-- Problem box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px">
      <tr><td style="padding:20px 24px">
        <div style="font-size:12px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Hur det ser ut idag</div>
        <table cellpadding="0" cellspacing="0" style="width:100%">
          <tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9">
            <span style="color:#ef4444;font-weight:700;margin-right:10px">✗</span>
            <span style="font-size:14px;color:#374151">Hushållet vill ge sin pant till {{namn}} – men vet inte hur</span>
          </td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9">
            <span style="color:#ef4444;font-weight:700;margin-right:10px">✗</span>
            <span style="font-size:14px;color:#374151">De samlar på sig, glömmer bort, orkar inte köra</span>
          </td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9">
            <span style="color:#ef4444;font-weight:700;margin-right:10px">✗</span>
            <span style="font-size:14px;color:#374151">{{namn}} vet inte när det är värt att köra en runda</span>
          </td></tr>
          <tr><td style="padding:7px 0">
            <span style="color:#ef4444;font-weight:700;margin-right:10px">✗</span>
            <span style="font-size:14px;color:#374151">Pengarna stannar hos butiken i stället</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <!-- Solution box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:24px">
      <tr><td style="padding:20px 24px">
        <div style="font-size:12px;font-weight:700;color:#16a34a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Ge Pant löser det</div>
        <table cellpadding="0" cellspacing="0" style="width:100%">
          <tr><td style="padding:7px 0;border-bottom:1px solid #dcfce7">
            <span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span>
            <span style="font-size:14px;color:#374151">Hushållet pantar när det passar dem – direkt via appen</span>
          </td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid #dcfce7">
            <span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span>
            <span style="font-size:14px;color:#374151">Summan går direkt till {{namn}} – automatiskt</span>
          </td></tr>
          <tr><td style="padding:7px 0">
            <span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span>
            <span style="font-size:14px;color:#374151">Inga rundor att planera. Ingen logistik.</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6">Vill ni vara med och testa det under piloten?</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:8px">
      <tr><td style="background:#2dd4bf;border-radius:8px;padding:14px 28px">
        <a href="https://www.bottledrop.se/" style="color:#0f172a;font-size:15px;font-weight:700;text-decoration:none">Ansök om partnerskap →</a>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0">
    <p style="margin:0;font-size:13px;color:#94a3b8">Allt gott,<br><strong style="color:#374151">{{avsandare}}</strong></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
  },
  {
    id:"mail3",
    namn:"⏰ Mail 3 – Sista chansen",
    steg:3,
    subject:"{{namn}} – vi går vidare utan er om ni inte hör av er",
    body:`Hej {{namn}}!

Sista gången jag hör av mig om det här.

Vi söker 5 partnerföreningar till Ge Pant och platserna fylls löpande. De föreningar som är med nu låser in villkor som inte erbjuds igen:

• Kostnadsfri access under pilotlanseringen
• Möjlighet att påverka utvecklingen
• Prioriterad support
• 50% lägre abonnemangspris for life

Om {{namn}} är intresserade: ansök på https://www.bottledrop.se/ så återkommer vi direkt.

Vi väljer partnerföreningar löpande – villkoren efter lansering kommer att se annorlunda ut.

Allt gott,
{{avsandare}}`,
    html:`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Aptos,Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
  <tr><td style="background:#0f172a;padding:24px 32px;text-align:center">
    <div style="color:#f59e0b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Sista chansen</div>
    <div style="color:#ffffff;font-size:20px;font-weight:700">BottleDROP – Ge Pant</div>
    <div style="color:#94a3b8;font-size:13px;margin-top:6px">Pilotplatsen snart full</div>
  </td></tr>
  <!-- Urgency bar -->
  <tr><td style="background:#fef3c7;padding:12px 32px;text-align:center;border-bottom:1px solid #fde68a">
    <span style="font-size:13px;color:#92400e;font-weight:600">⚡ Platserna fylls löpande – begränsat antal kvar</span>
  </td></tr>
  <tr><td style="padding:32px 32px 24px">
    <p style="margin:0 0 16px;font-size:15px;color:#1e293b;line-height:1.6">Hej {{namn}}!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">Sista gången jag hör av mig om det här. De föreningar som är med nu låser in villkor som <strong>inte erbjuds igen</strong>:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:24px">
      <tr><td style="padding:20px 24px">
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Kostnadsfri access under pilotlanseringen</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Möjlighet att påverka utvecklingen</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b">Prioriterad support</span></td></tr>
          <tr><td style="padding:5px 0"><span style="color:#22c55e;font-weight:700;margin-right:10px">✓</span><span style="font-size:14px;color:#1e293b"><strong>50% lägre abonnemangspris for life</strong></span></td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.7">Om {{namn}} är intresserade: ansök nedan så återkommer vi direkt.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="background:#f59e0b;border-radius:8px;padding:14px 28px">
        <a href="https://www.bottledrop.se/" style="color:#0f172a;font-size:15px;font-weight:700;text-decoration:none">Ansök nu →</a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6">Villkoren efter lansering kommer att se annorlunda ut.</p>
  </td></tr>
  <tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0">
    <p style="margin:0;font-size:13px;color:#94a3b8">Allt gott,<br><strong style="color:#374151">{{avsandare}}</strong></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
  },
  {
    id:"custom",
    namn:"✏️ Eget meddelande",
    steg:null,
    subject:"",
    body:"",
    html:""
  },
]

const ROLLER=["Ordförande","Vice ordförande","Kassör","Sekreterare","Styrelseledamot","Tränare","Kansliansvarig","Kontakt","Annan"];

const C={bg:"#0f172a",bg2:"#0c1628",bg3:"#111827",bg4:"#0a1020",border:"#1e3a5f",blue:"#3b82f6",text:"#e2e8f0",muted:"#64748b",green:"#22c55e",amber:"#f59e0b",red:"#ef4444",purple:"#a78bfa",teal:"#2dd4bf"};
const I=(x={})=>({background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",width:"100%",...x});
const card=(x={})=>({background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",...x});
const lbl={fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:C.blue,marginBottom:4,display:"block"};
const btn=(v="primary",lg=false)=>({padding:lg?"14px 20px":"9px 18px",borderRadius:9,border:v==="ghost"?`1px solid ${C.border}`:"none",background:v==="primary"?C.blue:v==="danger"?C.red:"transparent",color:v==="ghost"?C.muted:"#fff",fontWeight:600,fontSize:lg?15:13,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,minHeight:lg?52:40,WebkitTapHighlightColor:"transparent"});
const fmtN=n=>(n||0).toLocaleString("sv-SE");
const hasEmail=f=>!!(f.epost||f.epostOrdf);
const hasDual=f=>!!(f.epost&&f.epostOrdf&&f.epost!==f.epostOrdf);
const getEmail=(f,pref)=>(pref&&f.epostOrdf)?f.epostOrdf:(f.epost||f.epostOrdf||"");
const uniq=arr=>[...new Set(arr.filter(Boolean))].sort();
const lastSent=f=>{
  const log=(f.mailLog||[]).filter(m=>m.status==="sent");
  if(!log.length)return null;
  return log[log.length-1].date;
};

const fill=(t,f,s)=>(t||"").replace(/{{namn}}/g,(f&&f.namn)||"").replace(/{{mottagare}}/g,(f&&(f.ordforande||f.namn))||"föreningen").replace(/{{ordforande}}/g,(f&&(f.ordforande||f.namn))||"föreningen").replace(/{{burkar}}/g,fmtN(f&&f.burkar)).replace(/{{ort}}/g,(f&&f.ort)||"").replace(/{{idrott}}/g,(f&&f.idrott)||"").replace(/{{avsandare}}/g,s||"Marketing Guru");

const PIPE_STAGES=[
  {id:"prospekt",label:"Ej kontaktad",icon:"👀",color:"#64748b",bg:"rgba(100,116,139,0.12)"},
  {id:"mail1",label:"Fått mail 1",icon:"📬",color:"#3b82f6",bg:"rgba(59,130,246,0.12)"},
  {id:"mail2",label:"Fått mail 1–2",icon:"🤝",color:"#2dd4bf",bg:"rgba(45,212,191,0.12)"},
  {id:"mail3",label:"Fått alla 3",icon:"⏰",color:"#f59e0b",bg:"rgba(245,158,11,0.12)"},
  {id:"ansökt",label:"Ansökt",icon:"📋",color:"#a78bfa",bg:"rgba(167,139,250,0.12)"},
  {id:"antagen",label:"Antagen ✓",icon:"🎉",color:"#22c55e",bg:"rgba(34,197,94,0.12)"},
  {id:"avvisad",label:"Avvisad",icon:"✕",color:"#ef4444",bg:"rgba(239,68,68,0.10)"},
];

function getAutoStage(f,overrides){
  if(!f)return"prospekt";
  if(!overrides)overrides={};
  if(overrides[f.id])return overrides[f.id];
  const m=f.skickadeMail||0;
  if(m>=3)return"mail3";
  if(m>=2)return"mail2";
  if(m>=1)return"mail1";
  return"prospekt";
}

function useWidth(){const[w,setW]=useState(()=>typeof window!=="undefined"?window.innerWidth:680);useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);return w;}
function BackBar({onBack,title,actions}){return(<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:C.bg3,borderBottom:`1px solid ${C.border}`,minHeight:52}}><button onClick={onBack} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,cursor:"pointer",fontSize:13,fontWeight:600,padding:"7px 12px",fontFamily:"inherit"}}>← Tillbaka</button><span style={{flex:1,fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span>{actions}</div>);}
function Chip({color,children,sm}){return <span style={{background:color+"22",color,padding:sm?"1px 7px":"2px 9px",borderRadius:10,fontSize:sm?10:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;}
function SectionHd({children,right}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:11,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",color:C.blue}}>{children}</div>{right}</div>;}

export default function App(){
  const w=useWidth();const M=w<640;
  const [tab,setTab]=useState("oversikt");
  const [fr,setFr]=useState(INIT_FR);
  const [camp,setCamp]=useState(INIT_CAMP);
  const [contacts,setContacts]=useState(INIT_CONTACTS_ALL);
  const [cfg,setCfg]=useState({apiKey:"",senderName:"Marketing Guru",senderEmail:"",preferOrdf:false,proxyUrl:"",brevoTag:"Marketingguru - BottleDROP"});
  const [templates,setTemplates]=useState(TEMPLATES);
  const [kontexter,setKontexter]=useState(INIT_KONTEXTER);
  const [aktivKontextId,setAktivKontextId]=useState("gepant");
  const [pipelineOverrides,setPipelineOverrides]=useState({});
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get("bd5_fr");if(r?.value){const s=JSON.parse(r.value);const ids=new Set(s.map(f=>f.id));setFr([...s,...INIT_FR.filter(f=>!ids.has(f.id))]);}else setFr(INIT_FR);}catch{setFr(INIT_FR);}
      try{const r=await window.storage.get("bd5_contacts");if(r?.value){const s=JSON.parse(r.value);const ids=new Set(s.map(c=>c.id));setContacts([...s,...INIT_CONTACTS_ALL.filter(c=>!ids.has(c.id))]);}else setContacts(INIT_CONTACTS_ALL);}catch{setContacts(INIT_CONTACTS_ALL);}
      try{const r=await window.storage.get("bd5_camp");if(r?.value)setCamp(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("bd5_cfg");if(r?.value)setCfg(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("bd5_kontexter");if(r?.value)setKontexter(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("bd5_aktiv");if(r?.value)setAktivKontextId(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("bd5_pipe");if(r?.value)setPipelineOverrides(JSON.parse(r.value));}catch{}
      setTemplates(TEMPLATES);
      await window.storage.set("bd5_templates",JSON.stringify(TEMPLATES)).catch(()=>{});
      setReady(true);
    })();
  },[]);

  const saveFr=async d=>{setFr(d);try{await window.storage.set("bd5_fr",JSON.stringify(d));}catch{}};
  const saveCamp=async d=>{setCamp(d);try{await window.storage.set("bd5_camp",JSON.stringify(d));}catch{}};
  const saveContacts=async d=>{setContacts(d);try{await window.storage.set("bd5_contacts",JSON.stringify(d));}catch{}};
  const saveCfg=async d=>{setCfg(d);try{await window.storage.set("bd5_cfg",JSON.stringify(d));}catch{}};
  const saveTemplates=async d=>{setTemplates(d);try{await window.storage.set("bd5_templates",JSON.stringify(d));}catch{}};
  const saveKontexter=async d=>{setKontexter(d);try{await window.storage.set("bd5_kontexter",JSON.stringify(d));}catch{}};
  const saveAktivKontext=async id=>{setAktivKontextId(id);try{await window.storage.set("bd5_aktiv",JSON.stringify(id));}catch{}};
  const savePipe=async d=>{setPipelineOverrides(d);try{await window.storage.set("bd5_pipe",JSON.stringify(d));}catch{}};

  if(!ready)return <div style={{background:C.bg,height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontFamily:"Aptos,Calibri,system-ui,sans-serif"}}>Laddar…</div>;

  // Count ready for each mail step
  const readyM1=fr.filter(f=>hasEmail(f)&&(f.skickadeMail||0)===0).length;
  const readyM2=fr.filter(f=>hasEmail(f)&&(f.skickadeMail||0)===1).length;
  const readyM3=fr.filter(f=>hasEmail(f)&&(f.skickadeMail||0)===2).length;
  const utskickBadge=readyM1+readyM2+readyM3;
  const TABS=[{id:"oversikt",icon:"📊",short:"Övers."},{id:"pipeline",icon:"🎯",short:"Pipeline"},{id:"foreningar",icon:"🏆",short:"Fören."},{id:"utskick",icon:"📧",short:"Utskick",badge:utskickBadge},{id:"mallar",icon:"🤖",short:"Mallar"},{id:"kontakter",icon:"👥",short:"Kont."},{id:"installningar",icon:"⚙️",short:"Inställn."}];
  const aktivK=kontexter.find(k=>k.id===aktivKontextId);

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Aptos,Calibri,system-ui,-apple-system,sans-serif",fontSize:14}}>
      <style>{`
  :root { --font: "Aptos", "Aptos Display", Calibri, system-ui, -apple-system, sans-serif; }
  body, button, input, textarea, select, option { font-family: var(--font) !important; }
  pre, code { font-family: "Courier New", monospace !important; }
  .mail-preview { font-family: Georgia, "Times New Roman", serif !important; }
`}</style>
      <div style={{background:C.bg3,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",overflowX:"auto",scrollbarWidth:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,padding:"0 14px",flexShrink:0,borderRight:`1px solid ${C.border}`}}>
            <div style={{width:26,height:26,background:C.blue,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>♻️</div>
            {!M&&<span style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Marketing Guru</span>}
            {aktivK&&<span style={{fontSize:10,fontWeight:700,background:aktivK.farg+"22",color:aktivK.farg,border:`1px solid ${aktivK.farg}44`,borderRadius:10,padding:"2px 8px",flexShrink:0}}>{aktivK.namn}</span>}
          </div>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:M?"12px 10px":"11px 14px",fontSize:M?11:12,fontWeight:tab===t.id?600:400,color:tab===t.id?C.text:C.muted,borderBottom:`2px solid ${tab===t.id?C.blue:"transparent"}`,whiteSpace:"nowrap",flexShrink:0}}>
              {t.icon} {t.short}
              {t.badge>0&&<span style={{background:C.blue,color:"#fff",fontSize:9,fontWeight:800,borderRadius:10,padding:"1px 5px",marginLeft:2,lineHeight:"14px",display:"inline-block"}}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:M?"10px 12px":"16px 18px",maxWidth:M?"100%":1200,margin:"0 auto"}}>
        {tab==="oversikt"&&<Oversikt fr={fr} camp={camp} contacts={contacts} kontexter={kontexter} M={M}/>}
        {tab==="pipeline"&&<Pipeline fr={fr} pipelineOverrides={pipelineOverrides} savePipe={savePipe} kontexter={kontexter} M={M}/>}
        {tab==="foreningar"&&<Foreningar fr={fr} saveFr={saveFr} contacts={contacts} saveContacts={saveContacts} kontexter={kontexter} pipelineOverrides={pipelineOverrides} savePipe={savePipe} M={M}/>}
        {tab==="utskick"&&<Utskick fr={fr} camp={camp} saveCamp={saveCamp} saveFr={saveFr} cfg={cfg} saveCfg={saveCfg} templates={templates} kontexter={kontexter} M={M}/>}
        {tab==="mallar"&&<MallarAI templates={templates} saveTemplates={saveTemplates} cfg={cfg} fr={fr} M={M}/>}
        {tab==="kontakter"&&<Kontakter contacts={contacts} saveContacts={saveContacts} fr={fr} saveFr={saveFr} M={M}/>}
        {tab==="installningar"&&<Installningar cfg={cfg} saveCfg={saveCfg} templates={templates} saveTemplates={saveTemplates} kontexter={kontexter} saveKontexter={saveKontexter} aktivKontextId={aktivKontextId} saveAktivKontext={saveAktivKontext} fr={fr} camp={camp} contacts={contacts} M={M}/>}
      </div>
    </div>
  );
}

function Oversikt({fr,camp,contacts,kontexter,M}){
  const dalarna=fr.filter(f=>f.lan==="Dalarna");
  const blekinge=fr.filter(f=>f.lan==="Blekinge");
  const withE=fr.filter(hasEmail).length;
  const kontaktade=fr.filter(f=>(f.skickadeMail||0)>0).length;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:M?"1fr 1fr":"repeat(4,1fr)",gap:M?8:10,marginBottom:14}}>
        {[[fmtN(fr.length),"Föreningar","🏆",C.blue],[`${dalarna.length}/${blekinge.length}`,"Dalarna/Blekinge","📍",C.teal],[`${withE}/${fr.length}`,"Har e-post","📧",C.amber],[contacts.length,"Kontakter","👥",C.purple]].map(([v,l,ic,co])=>(
          <div key={l} style={{...card(),borderColor:co+"44",padding:M?"12px":"14px 16px"}}>
            <div style={{fontSize:M?17:20,marginBottom:3}}>{ic}</div>
            <div style={{fontSize:M?18:22,fontWeight:700,color:co,lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{...card({marginBottom:12,borderColor:C.teal+"44"})}}>
        <SectionHd>🎯 Kampanjsekvens – Dalarna ({dalarna.length} leads)</SectionHd>
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"repeat(3,1fr)",gap:8}}>
          {TEMPLATES.filter(t=>t.steg).map(t=>{
            const sent=dalarna.filter(f=>(f.skickadeMail||0)>=t.steg).length;
            const total=dalarna.filter(f=>hasEmail(f)).length;
            const pct=total>0?Math.round(sent/total*100):0;
            const co=[C.blue,C.teal,C.amber][t.steg-1]||C.blue;
            return(<div key={t.id} style={{background:C.bg3,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:600,fontSize:12,marginBottom:3,color:co}}>{t.namn}</div>
              <div style={{height:4,background:C.bg4,borderRadius:2,marginBottom:4}}><div style={{height:"100%",width:`${pct}%`,background:co,borderRadius:2}}/></div>
              <div style={{fontSize:11,color:co}}>{sent}/{total} skickade</div>
            </div>);
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:12}}>
        <div style={card()}>
          <SectionHd>Topplista Blekinge</SectionHd>
          {[...blekinge].sort((a,b)=>b.burkar-a.burkar).slice(0,6).map((f,i)=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<5?`1px solid ${C.border}`:"none"}}>
              <div style={{width:20,fontSize:i<3?14:11,textAlign:"center"}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.namn}</div><div style={{fontSize:10,color:C.muted}}>{f.idrott}</div></div>
              <div style={{fontSize:12,fontWeight:600,color:C.green}}>{fmtN(f.burkar)}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={card()}>
            <SectionHd>Kontaktstatus</SectionHd>
            {[[withE,fr.length,"Har e-post",C.green],[kontaktade,fr.length,"Kontaktade",C.blue]].map(([c2,t,l,col])=>{
              const p=t>0?Math.round(c2/t*100):0;
              return <div key={l} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}><span style={{color:C.muted}}>{l}</span><span style={{color:col,fontWeight:500}}>{c2} ({p}%)</span></div><div style={{height:4,background:C.bg4,borderRadius:2}}><div style={{height:"100%",width:`${p}%`,background:col,borderRadius:2}}/></div></div>;
            })}
          </div>
          <div style={card()}>
            <SectionHd>Senaste kampanjer</SectionHd>
            {camp.length===0?<div style={{fontSize:12,color:C.muted}}>Inga ännu</div>:[...camp].reverse().slice(0,4).map((c2,i)=>(
              <div key={c2.id||i} style={{padding:"7px 0",borderBottom:i<3?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",gap:8}}>
                <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c2.subject||"Utskick"}</div><div style={{fontSize:11,color:C.muted}}>{c2.date}</div></div>
                <div style={{flexShrink:0}}><span style={{color:C.green,fontSize:12}}>{c2.sent}✓</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pipeline({fr,pipelineOverrides,savePipe,kontexter,M}){
  const [filterLan,setFilterLan]=useState("");
  const [selected,setSelected]=useState(null);
  const [view,setView]=useState("kanban");
  const [dragId,setDragId]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const laner=uniq(fr.map(f=>f.lan));
  const leads=fr.filter(f=>!filterLan||f.lan===filterLan);
  const stageOf=f=>getAutoStage(f,pipelineOverrides);
  const setStage=(id,s)=>savePipe({...pipelineOverrides,[id]:s});
  const clearStage=id=>{const n={...pipelineOverrides};delete n[id];savePipe(n);};
  const isOv=id=>!!pipelineOverrides[id];
  const byStage=s=>leads.filter(f=>stageOf(f)===s);
  const selF=selected?fr.find(f=>f.id===selected):null;
  const selStg=selF?PIPE_STAGES.find(s=>s.id===stageOf(selF)):null;
  const conv=leads.length>0?Math.round(leads.filter(f=>["ansökt","antagen"].includes(stageOf(f))).length/leads.length*100):0;

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
        <div><div style={{fontWeight:700,fontSize:M?14:16}}>🎯 Pipeline</div><div style={{fontSize:11,color:C.muted}}>{leads.length} leads · {conv}% konverterade</div></div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <select value={filterLan} onChange={e=>{setFilterLan(e.target.value);setSelected(null);}} style={{...I({fontSize:12,padding:"6px 10px",width:"auto",minHeight:38})}}>
            <option value="">Alla</option>{laner.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          {!M&&<div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
            {[["kanban","☰ Kanban"],["list","≡ Lista"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{background:view===v?C.blue:"transparent",border:"none",color:view===v?"#fff":C.muted,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>{l}</button>
            ))}
          </div>}
        </div>
      </div>
      <div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:12,paddingBottom:2}}>
        {PIPE_STAGES.map(s=><div key={s.id} style={{flexShrink:0,background:s.bg,border:`1px solid ${s.color}44`,borderRadius:20,padding:"4px 12px",display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:12}}>{s.icon}</span><span style={{fontSize:12,fontWeight:700,color:s.color}}>{byStage(s.id).length}</span>
          {!M&&<span style={{fontSize:10,color:C.muted}}>{s.label}</span>}
        </div>)}
      </div>
      {(view==="kanban"||M)&&(
        <div style={{display:M?"flex":"grid",flexDirection:M?"column":undefined,gridTemplateColumns:"repeat(7,minmax(140px,1fr))",gap:8,alignItems:"start",overflowX:M?"visible":"auto"}}>
          {PIPE_STAGES.map(s=>{
            const items=byStage(s.id);
            return(
              <div key={s.id}
                onDragOver={e=>{e.preventDefault();setDragOver(s.id);}}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>{e.preventDefault();if(dragId&&dragId!==s.id+"_"){setStage(dragId,s.id);setDragId(null);}setDragOver(null);}}
                style={{background:dragOver===s.id?"rgba(59,130,246,0.08)":C.bg3,borderRadius:12,overflow:"hidden",minWidth:M?"auto":140,outline:dragOver===s.id?`2px dashed ${s.color}`:"none",transition:"background 0.15s"}}>
                <div style={{background:s.bg,borderBottom:`2px solid ${s.color}`,padding:"9px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:M?13:11,fontWeight:700,color:s.color}}>{s.icon} {s.label}</div>
                  <div style={{background:s.color,borderRadius:"50%",width:19,height:19,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff"}}>{items.length}</div>
                </div>
                <div style={{padding:"6px",minHeight:50}}>
                  {items.map(f=>{
                    const isSel=selected===f.id;
                    const cardStgIdx=PIPE_STAGES.findIndex(x=>x.id===stageOf(f));
                    return(
                      <div key={f.id}
                        draggable
                        onDragStart={e=>{e.dataTransfer.effectAllowed="move";setDragId(f.id);setSelected(null);}}
                        onDragEnd={()=>{setDragId(null);setDragOver(null);}}
                        onClick={()=>setSelected(isSel?null:f.id)}
                        style={{background:dragId===f.id?"rgba(59,130,246,0.3)":isSel?"rgba(59,130,246,0.15)":C.bg,border:`1px solid ${dragId===f.id?C.blue:isSel?C.blue:s.color+"33"}`,borderRadius:9,padding:"9px 10px",marginBottom:5,cursor:"grab",userSelect:"none",opacity:dragId===f.id?0.5:1,transition:"opacity 0.15s"}}>
                        <div style={{fontWeight:600,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.namn}</div>
                        <div style={{fontSize:9,color:C.muted,marginBottom:4}}>{f.idrott} · {f.ort}</div>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {[1,2,3].map(n=><span key={n} style={{fontSize:8,padding:"0 4px",borderRadius:3,fontWeight:700,background:(f.skickadeMail||0)>=n?C.blue+"33":C.bg3,color:(f.skickadeMail||0)>=n?C.blue:C.muted}}>M{n}</span>)}
                          {isOv(f.id)&&<span style={{fontSize:8,color:C.amber}}>✎</span>}
                          {(f.taggar||[]).map(tid=>{const k=kontexter.find(x=>x.id===tid);return k?<span key={tid} style={{fontSize:8,padding:"0 3px",borderRadius:3,background:k.farg+"22",color:k.farg,fontWeight:700}}>{k.namn}</span>:null;})}
                        </div>
                        {isSel&&(
                          <div style={{marginTop:8,borderTop:`1px solid ${C.border}`,paddingTop:7}}>
                            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                              {PIPE_STAGES.filter(ps=>ps.id!==s.id).map(ps=>(
                                <button key={ps.id} onClick={e=>{e.stopPropagation();setStage(f.id,ps.id);setSelected(null);}} style={{background:ps.color+"20",border:`1px solid ${ps.color}55`,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:700,color:ps.color}}>
                                  {ps.icon} {ps.label}
                                </button>
                              ))}
                              {isOv(f.id)&&<button onClick={e=>{e.stopPropagation();clearStage(f.id);}} style={{background:C.amber+"15",border:`1px solid ${C.amber}44`,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:700,color:C.amber}}>↺</button>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {items.length===0&&!M&&<div style={{fontSize:9,color:C.muted,textAlign:"center",padding:"12px 0"}}>Inga leads</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {view==="list"&&!M&&(
        <div style={{...card({padding:0,overflow:"hidden"})}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.bg3,borderBottom:`1px solid ${C.border}`}}>
              {["Förening","Idrott","Ort","Mail","Steg","Flytta"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:C.muted}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[...leads].sort((a,b)=>PIPE_STAGES.findIndex(s=>s.id===stageOf(a))-PIPE_STAGES.findIndex(s=>s.id===stageOf(b))).map((f,i)=>{
                const stg=PIPE_STAGES.find(s=>s.id===stageOf(f))||PIPE_STAGES[0];
                const idx=PIPE_STAGES.findIndex(s=>s.id===stageOf(f));
                return(
                  <tr key={f.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.bg2:"transparent"}}>
                    <td style={{padding:"9px 12px",fontWeight:500}}>{f.namn}</td>
                    <td style={{padding:"9px 12px",color:C.muted}}>{f.idrott}</td>
                    <td style={{padding:"9px 12px",color:C.muted}}>{f.ort}</td>
                    <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:3}}>{[1,2,3].map(n=><span key={n} style={{fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700,background:(f.skickadeMail||0)>=n?C.blue+"33":C.bg3,color:(f.skickadeMail||0)>=n?C.blue:C.muted}}>M{n}</span>)}</div></td>
                    <td style={{padding:"9px 12px"}}><span style={{color:stg.color,fontWeight:700}}>{stg.icon} {stg.label}</span></td>
                    <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:4}}>
                      <button onClick={()=>{if(idx>0)setStage(f.id,PIPE_STAGES[idx-1].id);}} disabled={idx===0} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,color:idx===0?C.muted:C.text,cursor:idx===0?"not-allowed":"pointer",padding:"3px 8px",fontSize:10,fontFamily:"inherit"}}>←</button>
                      <button onClick={()=>{if(idx<PIPE_STAGES.length-1)setStage(f.id,PIPE_STAGES[idx+1].id);}} disabled={idx===PIPE_STAGES.length-1} style={{background:idx===PIPE_STAGES.length-1?"none":stg.color,border:`1px solid ${idx===PIPE_STAGES.length-1?C.border:stg.color}`,borderRadius:5,color:idx===PIPE_STAGES.length-1?C.muted:"#fff",cursor:idx===PIPE_STAGES.length-1?"not-allowed":"pointer",padding:"3px 8px",fontSize:10,fontFamily:"inherit"}}>→</button>
                      {isOv(f.id)&&<button onClick={()=>clearStage(f.id)} style={{background:"none",border:`1px solid ${C.amber}44`,borderRadius:5,color:C.amber,cursor:"pointer",padding:"3px 7px",fontSize:9,fontFamily:"inherit"}}>↺</button>}
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {selF&&selStg&&(
        <div style={{marginTop:14,background:C.bg2,border:`1px solid ${selStg.color}55`,borderRadius:14,overflow:"hidden"}}>
          <div style={{background:selStg.bg,borderBottom:`1px solid ${selStg.color}44`,padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontWeight:700,fontSize:14,color:selStg.color}}>{selStg.icon} {selF.namn}</span>
            <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{padding:"14px 16px",display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:8}}>Förening</div>
              {[["Idrott",selF.idrott],["Ort",selF.ort],["Lan",selF.lan],["E-post",selF.epost||selF.epostOrdf],["Mail skickade",selF.skickadeMail||0]].map(([l,v])=>(
                <div key={l} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                  <span style={{color:C.muted,minWidth:90,flexShrink:0}}>{l}</span><span>{v||"—"}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:8}}>Flytta i pipeline</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {PIPE_STAGES.map(ps=>(
                  <button key={ps.id} onClick={()=>setStage(selF.id,ps.id)} style={{display:"flex",alignItems:"center",gap:8,background:stageOf(selF)===ps.id?ps.color:"transparent",border:`1px solid ${stageOf(selF)===ps.id?ps.color:C.border}`,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
                    <span style={{fontSize:14}}>{ps.icon}</span>
                    <span style={{fontSize:12,fontWeight:600,color:stageOf(selF)===ps.id?"#fff":C.muted,flex:1}}>{ps.label}</span>
                    {stageOf(selF)===ps.id&&<span style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>← Nu</span>}
                  </button>
                ))}
                {isOv(selF.id)&&<button onClick={()=>clearStage(selF.id)} style={{background:"none",border:`1px solid ${C.amber}44`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",color:C.amber,fontSize:11,fontWeight:600}}>↺ Återställ automatiskt</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BLANK_F={q:"",lan:"",ort:"",idrott:"",epost:"all",mail:"all",kontext:""};
function Foreningar({fr,saveFr,contacts,saveContacts,kontexter,pipelineOverrides,savePipe,M}){
  const [selectedId,setSelectedId]=useState(null);
  const [detTab,setDetTab]=useState("info");
  const [filters,setFilters]=useState(BLANK_F);
  const [showFilt,setShowFilt]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editVals,setEditVals]=useState({});
  const [adding,setAdding]=useState(false);
  const [viewMode,setViewMode]=useState("list");
  const [bulkMode,setBulkMode]=useState(false);
  const [bulkSel,setBulkSel]=useState({});
  const [bulkPanel,setBulkPanel]=useState(false);
  const blank={namn:"",epost:"",epostOrdf:"",ort:"",kommun:"",idrott:"",burkar:"",ordforande:"",telefon:"",ant:"",lan:"Blekinge",skickadeMail:0,mailLog:[],kontaktIds:[],taggar:[]};
  const [nw,setNw]=useState(blank);
  const orter=uniq(fr.map(f=>f.ort));
  const idrotts=uniq(fr.map(f=>f.idrott));
  const laner=uniq(fr.map(f=>f.lan));
  const stageOf=f=>getAutoStage(f,pipelineOverrides);

  const applyF=f=>{
    const{q,lan,ort,idrott,epost,mail,kontext}=filters;
    if(q&&![f.namn,f.ort,f.idrott,f.epost,f.ordforande].some(v=>v?.toLowerCase().includes(q.toLowerCase())))return false;
    if(lan&&f.lan!==lan)return false;
    if(ort&&f.ort!==ort)return false;
    if(idrott&&f.idrott!==idrott)return false;
    if(epost==="yes"&&!hasEmail(f))return false;
    if(epost==="no"&&hasEmail(f))return false;
    const m=f.skickadeMail||0;
    if(mail==="0"&&m!==0)return false;
    if(mail==="1"&&m!==1)return false;
    if(mail==="2"&&m!==2)return false;
    if(mail==="3+"&&m<3)return false;
    if(kontext&&!(f.taggar||[]).includes(kontext))return false;
    return true;
  };

  const shown=fr.filter(applyF).sort((a,b)=>{if(a.lan!==b.lan)return a.lan.localeCompare(b.lan,"sv");return b.burkar-a.burkar;});
  const sel=selectedId?fr.find(f=>f.id===selectedId):null;
  const activeF=Object.entries(filters).filter(([k,v])=>v&&v!=="all"&&k!=="q").length+(filters.q?1:0);
  const saveEdit=()=>{saveFr(fr.map(f=>f.id===sel.id?{...f,...editVals,burkar:parseInt(editVals.burkar)||0}:f));setEditing(false);};
  const del=id=>{if(confirm("Ta bort?"))saveFr(fr.filter(f=>f.id!==id));if(selectedId===id)setSelectedId(null);};
  const add=()=>{if(!nw.namn)return;saveFr([...fr,{...nw,id:Math.max(...fr.map(f=>f.id))+1,burkar:parseInt(nw.burkar)||0}]);setAdding(false);setNw(blank);};

  const DetailView=()=>{
    const linked=contacts.filter(c=>sel.kontaktIds?.includes(c.id));
    return(
      <div>
        {M&&<BackBar onBack={()=>{setSelectedId(null);setEditing(false);}} title={sel.namn}/>}
        {!M&&<div style={{background:C.bg3,borderBottom:`1px solid ${C.border}`,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260}}>{sel.namn}</div><button onClick={()=>setSelectedId(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button></div>}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.bg4}}>
          {[["info","Info"],["mail",`Mail (${(sel.mailLog||[]).length})`],["kontakter",`Kont. (${linked.length})`]].map(([v,l])=>(
            <button key={v} onClick={()=>setDetTab(v)} style={{flex:1,background:"none",border:"none",borderBottom:`2px solid ${detTab===v?C.blue:"transparent"}`,cursor:"pointer",padding:"10px 6px",fontSize:M?13:11,fontWeight:detTab===v?600:400,color:detTab===v?C.text:C.muted,fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
        <div style={{padding:"14px",maxHeight:M?"none":"55vh",overflowY:"auto"}}>
          {detTab==="info"&&(editing?(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                {[["namn","Namn"],["epost","E-post 1"],["epostOrdf","E-post 2"],["ordforande","Mottagare"],["telefon","Telefon"],["idrott","Idrott"],["ort","Ort"],["burkar","Mätvärde"]].map(([k,l])=>(
                  <div key={k}><label style={lbl}>{l}</label><input value={editVals[k]||""} onChange={e=>setEditVals(p=>({...p,[k]:e.target.value}))} style={{...I(),minHeight:M?46:40}}/></div>
                ))}
              </div>
              <div style={{marginBottom:10}}><label style={lbl}>Anteckningar</label><textarea value={editVals.ant||""} onChange={e=>setEditVals(p=>({...p,ant:e.target.value}))} rows={2} style={{...I(),resize:"vertical"}}/></div>
              <div style={{display:"flex",gap:8}}><button onClick={saveEdit} style={{...btn("primary"),flex:1,justifyContent:"center"}}>Spara</button><button onClick={()=>setEditing(false)} style={{...btn("ghost"),flex:1,justifyContent:"center"}}>Avbryt</button></div>
            </div>
          ):(
            <div>
              {hasDual(sel)&&<div style={{...card({padding:"8px 12px",marginBottom:8,borderColor:C.teal+"66"}),background:"rgba(45,212,191,0.06)"}}><span style={{fontSize:11,color:C.teal}}>✉️ Dubbel mottagare</span></div>}
              {[["Idrott",sel.idrott],["Ort",sel.ort],["Mottagare",sel.ordforande],["E-post",sel.epost],["E-post 2",hasDual(sel)?sel.epostOrdf:""],["Telefon",sel.telefon],["Lan",sel.lan],["Mätvärde",sel.burkar>0?fmtN(sel.burkar):null],["Mail skickade",sel.skickadeMail||0],["Senast skickat",lastSent(sel)||"—"],["Anteckningar",sel.ant]].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{display:"flex",gap:8,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{color:C.muted,fontSize:11,minWidth:110,flexShrink:0}}>{l}</span>
                  <span style={{fontSize:13,wordBreak:"break-all"}}>{v}</span>
                </div>
              ))}
              <InlineMetricEdit f={sel} fr={fr} saveFr={saveFr}/>
              <div style={{marginTop:12,padding:"10px 12px",background:C.bg4,borderRadius:9,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Pipeline-status</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[["ansökt","📋 Ansökt",C.purple],["antagen","🎉 Antagen",C.green],["avvisad","✕ Avvisad",C.red]].map(([stage,label,color])=>{
                    const curr=pipelineOverrides&&pipelineOverrides[sel.id]===stage;
                    return <button key={stage} onClick={()=>{if(curr){const n={...pipelineOverrides};delete n[sel.id];savePipe(n);}else savePipe({...pipelineOverrides,[sel.id]:stage});}} style={{background:curr?color+"22":"transparent",border:`1px solid ${curr?color:C.border}`,borderRadius:20,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:curr?700:400,color:curr?color:C.muted}}>{curr?"✓ ":""}{label}</button>;
                  })}
                  {pipelineOverrides&&pipelineOverrides[sel.id]&&<button onClick={()=>{const n={...pipelineOverrides};delete n[sel.id];savePipe(n);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>↺</button>}
                </div>
              </div>
              {kontexter.length>0&&(
                <div style={{marginTop:10,padding:"10px 12px",background:C.bg4,borderRadius:9,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Kontext</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {kontexter.map(k=>{const tagged=(sel.taggar||[]).includes(k.id);return(
                      <button key={k.id} onClick={()=>{const curr=sel.taggar||[];const next=tagged?curr.filter(x=>x!==k.id):[...curr,k.id];saveFr(fr.map(f=>f.id===sel.id?{...f,taggar:next}:f));}} style={{background:tagged?k.farg+"22":"transparent",border:`1px solid ${tagged?k.farg:C.border}`,borderRadius:20,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:tagged?700:400,color:tagged?k.farg:C.muted}}>
                        {tagged?"✓ ":""}{k.namn}
                      </button>
                    );})}
                  </div>
                </div>
              )}
              <button onClick={()=>{setEditVals({...sel});setEditing(true);}} style={{...btn("ghost"),marginTop:12,width:"100%",justifyContent:"center"}}>✎ Redigera</button>
            </div>
          ))}
          {detTab==="mail"&&(
            <MailLogEditor f={sel} fr={fr} saveFr={saveFr}/>
          )}
          {detTab==="kontakter"&&<LinkedContacts f={sel} contacts={contacts} saveFr={saveFr} fr={fr}/>}
        </div>
      </div>
    );
  };

  if(M&&sel)return <DetailView/>;
  if(M&&adding)return(
    <div><BackBar onBack={()=>setAdding(false)} title="Ny förening"/>
      <div style={{padding:"14px 12px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          {[["namn","Namn *"],["epost","E-post"],["ordforande","Mottagare"],["idrott","Idrott"],["ort","Ort"]].map(([k,l])=>(
            <div key={k}><label style={lbl}>{l}</label><input value={nw[k]||""} onChange={e=>setNw(p=>({...p,[k]:e.target.value}))} style={{...I(),minHeight:46}}/></div>
          ))}
        </div>
        <button onClick={add} disabled={!nw.namn} style={{...btn("primary",true),width:"100%",justifyContent:"center",minHeight:52}}>Spara</button>
      </div>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:showFilt?8:12,alignItems:"stretch"}}>
        <input value={filters.q} onChange={e=>setFilters(p=>({...p,q:e.target.value}))} placeholder="Sök förening…" style={{...I(),flex:1,minHeight:44}}/>
        <button onClick={()=>setShowFilt(v=>!v)} style={{...btn(activeF>0?"primary":"ghost"),padding:"0 14px",minHeight:44,flexShrink:0}}>🔽{activeF>0?` (${activeF})`:""}</button>
        <button onClick={()=>{setBulkMode(v=>!v);setBulkSel({});setBulkPanel(false);}} title="Massredigera" style={{...btn(bulkMode?"primary":"ghost"),padding:"0 14px",minHeight:44,flexShrink:0,borderColor:bulkMode?C.blue:C.border}}>☑</button>
        <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:9,overflow:"hidden",flexShrink:0}}>
          <button onClick={()=>setViewMode("list")} style={{background:viewMode==="list"?C.blue:"transparent",border:"none",color:viewMode==="list"?"#fff":C.muted,padding:"0 13px",minHeight:44,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>≡</button>
          <button onClick={()=>setViewMode("kanban")} style={{background:viewMode==="kanban"?C.blue:"transparent",border:"none",color:viewMode==="kanban"?"#fff":C.muted,padding:"0 13px",minHeight:44,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>☰</button>
        </div>
        <button onClick={()=>setAdding(true)} style={{...btn("primary"),padding:"0 14px",minHeight:44,flexShrink:0}}>+</button>
      </div>
      {/* Bulk toolbar */}
      {bulkMode&&(
        <div style={{...card({marginBottom:10,borderColor:C.blue+"44",background:"rgba(59,130,246,0.04)",padding:"10px 14px"}),display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{fontSize:12,fontWeight:600,color:C.blue}}>☑ Massredigera</div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>{const n={};shown.forEach(f=>{n[f.id]=true;});setBulkSel(n);}} style={{...btn("ghost"),fontSize:11,minHeight:30,padding:"0 10px"}}>Välj alla ({shown.length})</button>
            <button onClick={()=>setBulkSel({})} style={{...btn("ghost"),fontSize:11,minHeight:30,padding:"0 10px"}}>Rensa</button>
          </div>
          {Object.values(bulkSel).filter(Boolean).length>0&&(
            <button onClick={()=>setBulkPanel(v=>!v)} style={{...btn(bulkPanel?"primary":"ghost"),fontSize:11,minHeight:30,padding:"0 12px",marginLeft:"auto",borderColor:C.amber+"66",color:bulkPanel?"#fff":C.amber,background:bulkPanel?C.amber:"transparent"}}>
              ✎ Redigera {Object.values(bulkSel).filter(Boolean).length} st
            </button>
          )}
        </div>
      )}
      {/* Bulk edit panel */}
      {bulkMode&&bulkPanel&&(
        <BulkMailEditor
          selectedIds={Object.entries(bulkSel).filter(([,v])=>v).map(([k])=>parseInt(k))}
          fr={fr} saveFr={saveFr}
          onDone={()=>{setBulkPanel(false);setBulkMode(false);setBulkSel({});}}
        />
      )}
      {/* Region quick-filter */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
        <span style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase",flexShrink:0,marginRight:2}}>Region</span>
        {[["","Alla"],["Blekinge","Blekinge"],["Dalarna","Dalarna"],["Gotland","Gotland"],["Gävleborg","Gävleborg"],["Halland","Halland"],["Jämtland","Jämtland"],["Jönköping","Jönköping"]].map(([v,l])=>{
          const active=filters.lan===v;
          const count=v?fr.filter(f=>f.lan===v).length:fr.length;
          return(
            <button key={v} onClick={()=>setFilters(p=>({...p,lan:v,ort:""}))} style={{background:active?C.blue+"22":"transparent",border:`1px solid ${active?C.blue:C.border}`,borderRadius:20,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:active?700:400,color:active?C.blue:C.muted,whiteSpace:"nowrap"}}>
              {l}
              <span style={{marginLeft:4,fontSize:9,color:active?C.blue:C.muted,fontWeight:400}}>({count})</span>
            </button>
          );
        })}
      </div>

      {showFilt&&(
        <div style={{...card({marginBottom:12})}}>
          <div style={{display:"grid",gridTemplateColumns:M?"1fr 1fr":"repeat(4,1fr)",gap:8,marginBottom:10}}>
            {[["Ort","ort",[["","Alla orter"],...orter.map(o=>[o,o])]],["Idrott","idrott",[["","Alla"],...idrotts.map(i=>[i,i])]],["E-post","epost",[["all","Alla"],["yes","Ja"],["no","Nej"]]],["Mail","mail",[["all","Alla"],["0","Ej kontaktad"],["1","Mail 1"],["2","Mail 1–2"],["3+","Alla 3"]]],["Kontext","kontext",[["","Alla"],...kontexter.map(k=>[k.id,k.namn])]]].map(([l,k,opts])=>(
              <div key={k}><label style={lbl}>{l}</label><select value={filters[k]} onChange={e=>setFilters(p=>({...p,[k]:e.target.value}))} style={{...I(),minHeight:M?46:40}}>{opts.map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setFilters(BLANK_F)} style={{...btn("ghost"),minHeight:40}}>Rensa</button>
            <button onClick={()=>setShowFilt(false)} style={{...btn("primary"),minHeight:40}}>Stäng ({shown.length})</button>
          </div>
        </div>
      )}
      {!M&&adding&&(
        <div style={{...card({marginBottom:12})}}>
          <div style={{fontWeight:600,marginBottom:10}}>Ny förening</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
            {[["namn","Namn *"],["epost","E-post"],["ordforande","Mottagare"],["telefon","Telefon"],["ort","Ort"],["idrott","Idrott"]].map(([k,l])=>(
              <div key={k}><label style={lbl}>{l}</label><input value={nw[k]||""} onChange={e=>setNw(p=>({...p,[k]:e.target.value}))} style={{...I(),padding:"7px 10px"}}/></div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}><button onClick={add} disabled={!nw.namn} style={btn()}>Spara</button><button onClick={()=>setAdding(false)} style={btn("ghost")}>Avbryt</button></div>
        </div>
      )}
      <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{shown.length} av {fr.length} föreningar</div>
      {viewMode==="kanban"&&!M?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(140px,1fr))",gap:8,overflowX:"auto"}}>
          {PIPE_STAGES.map(s=>{
            const items=shown.filter(f=>stageOf(f)===s.id);
            return(
              <div key={s.id}
                onDragOver={e=>{e.preventDefault();}}
                onDrop={e=>{e.preventDefault();const fid=parseInt(e.dataTransfer.getData("text/plain"));if(fid)savePipe({...pipelineOverrides,[fid]:s.id});}}
                style={{background:C.bg3,borderRadius:12,overflow:"hidden",outline:"2px dashed transparent",transition:"all 0.15s"}}
                onDragEnter={e=>{e.currentTarget.style.outline=`2px dashed ${s.color}`;e.currentTarget.style.background="rgba(59,130,246,0.06)";}}
                onDragLeave={e=>{e.currentTarget.style.outline="2px dashed transparent";e.currentTarget.style.background=C.bg3;}}>
                <div style={{background:s.bg,borderBottom:`2px solid ${s.color}`,padding:"8px 10px",display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontSize:11,fontWeight:700,color:s.color}}>{s.icon} {s.label}</div>
                  <div style={{background:s.color,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>{items.length}</div>
                </div>
                <div style={{padding:"6px",minHeight:50}}>
                  {items.map(f=>(
                    <div key={f.id}
                      draggable
                      onDragStart={e=>{e.dataTransfer.setData("text/plain",String(f.id));e.dataTransfer.effectAllowed="move";e.currentTarget.style.opacity="0.4";}}
                      onDragEnd={e=>{e.currentTarget.style.opacity="1";}}
                      onClick={()=>{setSelectedId(f.id);setDetTab("info");setEditing(false);setViewMode("list");}}
                      style={{background:C.bg,border:`1px solid ${s.color+"33"}`,borderRadius:9,padding:"8px 10px",marginBottom:5,cursor:"grab"}}>
                      <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.namn}</div>
                      <div style={{fontSize:9,color:C.muted}}>{f.idrott}</div>
                      <div style={{display:"flex",gap:3,marginTop:3}}>
                        {[1,2,3].map(n=><span key={n} style={{fontSize:8,padding:"0 3px",borderRadius:3,background:(f.skickadeMail||0)>=n?C.blue+"33":C.bg3,color:(f.skickadeMail||0)>=n?C.blue:C.muted,fontWeight:700}}>M{n}</span>)}
                        {(f.taggar||[]).map(tid=>{const k=kontexter.find(x=>x.id===tid);return k?<span key={tid} style={{fontSize:8,padding:"0 3px",borderRadius:3,background:k.farg+"22",color:k.farg,fontWeight:700}}>{k.namn}</span>:null;})}
                      </div>
                    </div>
                  ))}
                  {items.length===0&&<div style={{fontSize:9,color:C.muted,textAlign:"center",padding:"10px 0"}}>Inga</div>}
                </div>
              </div>
            );
          })}
        </div>
      ):M?(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {shown.map(f=>(
            <div key={f.id} onClick={()=>{setSelectedId(f.id);setDetTab("info");setEditing(false);}} style={{...card({cursor:"pointer",padding:"14px 16px",borderColor:f.lan==="Dalarna"?C.teal+"44":C.border})}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontWeight:600,fontSize:14,flex:1}}>{f.namn}</div><span style={{color:C.muted}}>›</span></div>
              <div style={{fontSize:12,color:C.muted,marginBottom:5}}>{f.idrott} · {f.ort} · <span style={{color:f.lan==="Dalarna"?C.teal:C.muted}}>{f.lan}</span></div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                {f.burkar>0&&<Chip color={C.green} sm>♻️ {fmtN(f.burkar)}</Chip>}
                {(f.skickadeMail||0)>0&&<Chip color={C.blue} sm>✉️ {f.skickadeMail}</Chip>}
                {lastSent(f)&&<span style={{fontSize:10,color:C.muted}}>Senast {lastSent(f)}</span>}
                {(f.taggar||[]).map(tid=>{const k=kontexter.find(x=>x.id===tid);return k?<Chip key={tid} color={k.farg} sm>{k.namn}</Chip>:null;})}
              </div>
            </div>
          ))}
          {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>Inga träffar</div>}
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:sel?"1fr 420px":"1fr",gap:14,alignItems:"start"}}>
          <div style={{...card({padding:0,overflow:"hidden"})}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.bg3,borderBottom:`1px solid ${C.border}`}}>
                  {["Förening","Idrott","Ort","Lan","E-post","Mottagare","Värde","Mail","Kontext",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:C.muted}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {shown.map((f,i)=>(
                    <tr key={f.id} onClick={()=>setSelectedId(selectedId===f.id?null:f.id)} style={{borderBottom:`1px solid ${C.border}`,background:selectedId===f.id?"rgba(59,130,246,0.1)":i%2===0?C.bg2:"transparent",cursor:"pointer"}}>
                      <td style={{padding:"9px 12px",fontWeight:500,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.namn}</td>
                      <td style={{padding:"9px 12px",color:C.muted,fontSize:11}}>{f.idrott}</td>
                      <td style={{padding:"9px 12px",color:C.muted,fontSize:11}}>{f.ort}</td>
                      <td style={{padding:"9px 12px"}}><Chip color={f.lan==="Dalarna"?C.teal:C.muted} sm>{f.lan}</Chip></td>
                      <td style={{padding:"9px 12px",fontSize:11}}>{hasDual(f)?<Chip color={C.teal} sm>2</Chip>:hasEmail(f)?<span style={{color:C.green}}>✓</span>:<span style={{color:C.red}}>✗</span>}</td>
                      <td style={{padding:"9px 12px",color:C.muted,fontSize:11,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.ordforande||"—"}</td>
                      <td style={{padding:"9px 12px",color:C.green,fontWeight:500}}>{f.burkar>0?fmtN(f.burkar):"—"}</td>
                      <td style={{padding:"9px 12px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                        {(f.skickadeMail||0)>0?<Chip color={C.blue} sm>✉️ {f.skickadeMail}</Chip>:<span style={{color:C.muted,fontSize:11}}>0</span>}
                        {lastSent(f)&&<span style={{fontSize:9,color:C.muted,whiteSpace:"nowrap"}}>{lastSent(f)}</span>}
                      </div>
                    </td>
                      <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:3}}>{(f.taggar||[]).map(tid=>{const k=kontexter.find(x=>x.id===tid);return k?<Chip key={tid} color={k.farg} sm>{k.namn}</Chip>:null;})}</div></td>
                      <td style={{padding:"9px 12px"}}><button onClick={e=>{e.stopPropagation();del(f.id);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {shown.length===0&&<div style={{padding:24,textAlign:"center",color:C.muted}}>Inga träffar</div>}
            </div>
          </div>
          {sel&&<div style={{...card({padding:0,overflow:"hidden",position:"sticky",top:60})}}>
            <DetailView/>
          </div>}
        </div>
      )}
    </div>
  );
}

function LinkedContacts({f,contacts,saveFr,fr}){
  const linked=contacts.filter(c=>f.kontaktIds?.includes(c.id));
  const unlinked=contacts.filter(c=>!f.kontaktIds?.includes(c.id));
  const [pick,setPick]=useState("");const [adding,setAdding]=useState(false);
  const link=()=>{if(!pick)return;const id=parseInt(pick);saveFr(fr.map(x=>x.id===f.id?{...x,kontaktIds:[...(x.kontaktIds||[]),id]}:x));setAdding(false);setPick("");};
  const unlink=cid=>saveFr(fr.map(x=>x.id===f.id?{...x,kontaktIds:(x.kontaktIds||[]).filter(i=>i!==cid)}:x));
  return(
    <div>
      {linked.map(c=>(
        <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.purple,flexShrink:0}}>{c.fornamn?.[0]||"?"}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{c.fornamn} {c.efternamn}</div><div style={{fontSize:11,color:C.muted}}>{c.roll||"—"} · {c.epost||"ingen epost"}</div></div>
          <button onClick={()=>unlink(c.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
      ))}
      {adding?(
        <div style={{marginTop:10,display:"flex",gap:8}}>
          <select value={pick} onChange={e=>setPick(e.target.value)} style={{...I({flex:1,minHeight:44})}}>
            <option value="">Välj kontakt…</option>
            {unlinked.map(c=><option key={c.id} value={c.id}>{c.fornamn} {c.efternamn} – {c.roll}</option>)}
          </select>
          <button onClick={link} disabled={!pick} style={{...btn("primary"),minHeight:44}}>Länka</button>
          <button onClick={()=>setAdding(false)} style={{...btn("ghost"),minHeight:44}}>✕</button>
        </div>
      ):<button onClick={()=>setAdding(true)} style={{...btn("ghost"),marginTop:10,width:"100%",justifyContent:"center"}}>+ Länka kontakt</button>}
    </div>
  );
}

function InlineMetricEdit({f,fr,saveFr}){
  const [editing,setEditing]=useState(false);
  const [val,setVal]=useState(String(f.burkar||0));
  const [flash,setFlash]=useState(false);
  const save=()=>{saveFr(fr.map(x=>x.id===f.id?{...x,burkar:parseInt(val)||0}:x));setEditing(false);setFlash(true);setTimeout(()=>setFlash(false),1500);};
  if(editing)return(
    <div style={{display:"flex",gap:6,marginTop:12,alignItems:"stretch"}}>
      <input type="number" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")setEditing(false);}} autoFocus style={{...I({flex:1,minHeight:38,border:`1px solid ${C.blue}`})}}/>
      <button onClick={save} style={{background:C.blue,border:"none",borderRadius:7,color:"#fff",padding:"0 12px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,minHeight:38}}>✓</button>
      <button onClick={()=>setEditing(false)} style={{...btn("ghost"),minHeight:38}}>✕</button>
    </div>
  );
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:12,padding:"10px 12px",background:C.bg4,borderRadius:9}}>
      <span style={{fontSize:18,fontWeight:700,color:C.green}}>{fmtN(f.burkar||0)}{flash&&<span style={{fontSize:11,color:C.green,marginLeft:6,fontWeight:400}}>✓ sparat</span>}</span>
      <button onClick={()=>{setVal(String(f.burkar||0));setEditing(true);}} style={{...btn("ghost"),padding:"4px 10px",fontSize:11}}>✎ Uppdatera</button>
    </div>
  );
}

function Utskick({fr,camp,saveCamp,saveFr,cfg,saveCfg,templates,kontexter,M}){
  const T=Array.isArray(templates)&&templates.length>0?templates:TEMPLATES;
  const [tmpl,setTmpl]=useState(T[0]?.id||"mail1");
  const [seqActive,setSeqActive]=useState(null); // id of locked sequence step, or null
  const [subj,setSubj]=useState(T[0]?.subject||"");
  const [body,setBody]=useState(T[0]?.body||"");
  const [sel,setSel]=useState(()=>{const s={};fr.filter(f=>hasEmail(f)).forEach(f=>{s[f.id]=true;});return s;});
  const [lanFilt,setLanFilt]=useState("Dalarna");
  const [mailFilt,setMailFilt]=useState("all");
  const [kontFilt,setKontFilt]=useState("");
  const [daysFilt,setDaysFilt]=useState("all"); // all | 7 | 14 | 30 | never
  const [cfgOpen,setCfgOpen]=useState(!cfg.apiKey||!cfg.senderEmail);
  const [view,setView]=useState("compose"); // compose | preview | history
  const [sending,setSending]=useState(false);
  const [results,setResults]=useState(null); // [{id,namn,ok,msg}]
  const [testEmail,setTestEmail]=useState("");
  const [testSending,setTestSending]=useState(false);
  const [testResult,setTestResult]=useState(null);
  const laner=uniq(fr.map(f=>f.lan));

  const withE=fr.filter(f=>{
    if(!hasEmail(f))return false;
    if(lanFilt&&f.lan!==lanFilt)return false;
    const m=f.skickadeMail||0;
    if(mailFilt==="0"&&m!==0)return false;
    if(mailFilt==="1"&&m!==1)return false;
    if(mailFilt==="2"&&m!==2)return false;
    if(mailFilt==="3+"&&m<3)return false;
    if(kontFilt&&!(f.taggar||[]).includes(kontFilt))return false;
    if(daysFilt!=="all"){
      const ls=lastSent(f);
      if(daysFilt==="never"&&ls)return false;
      if(daysFilt!=="never"){
        if(!ls)return false;
        // Parse date string "YYYY-MM-DD HH:MM" or "YYYY-MM-DD"
        const sentDate=new Date(ls.replace(" ","T"));
        const daysAgo=(Date.now()-sentDate.getTime())/(1000*60*60*24);
        if(daysAgo<parseInt(daysFilt))return false;
      }
    }
    return true;
  });
  const selList=withE.filter(f=>sel[f.id]);
  const pickTmpl=(id,fromSeq=false)=>{
    const t=T.find(t=>t.id===id);
    if(t){
      setSubj(t.subject||"");
      setBody(t.body||"");
      // Auto-set recipient filter based on template step
      if(t.steg!=null){
        const newFilt=String(t.steg-1); // steg 1→"0", steg 2→"1", steg 3→"2"
        setMailFilt(newFilt);
        // Auto-select matching recipients
        const matched=fr.filter(f=>hasEmail(f)&&(f.skickadeMail||0)===parseInt(newFilt));
        const n={};matched.forEach(f=>{n[f.id]=true;});
        setSel(n);
      }
    }
    setTmpl(id);
    if(!fromSeq)setSeqActive(null);
  };
  const getRecipients=f=>{if(hasDual(f))return[{email:f.epost,name:f.namn},{email:f.epostOrdf,name:f.namn}];const email=getEmail(f,cfg.preferOrdf);return email?[{email,name:f.namn}]:[];};

  const brevoPost=async(payload)=>{
    const target="https://api.brevo.com/v3/smtp/email";
    const url=cfg.proxyUrl?cfg.proxyUrl.replace(/\/$/,"")+"?url="+encodeURIComponent(target):target;
    return fetch(url,{method:"POST",headers:{"accept":"application/json","content-type":"application/json","api-key":cfg.apiKey},body:JSON.stringify(payload)});
  };
  const brevoGet=async(path)=>{
    const target="https://api.brevo.com"+path;
    const url=cfg.proxyUrl?cfg.proxyUrl.replace(/\/$/,"")+"?url="+encodeURIComponent(target):target;
    return fetch(url,{headers:{"accept":"application/json","api-key":cfg.apiKey}});
  };

  const makeHtml=(text,htmlTmpl,f,senderName)=>{
    if(htmlTmpl){
      // Use rich HTML template with variable substitution
      return fill(htmlTmpl,f,senderName);
    }
    // Fallback: convert plain text to simple HTML
    return `<div style="font-family:Aptos,Arial,sans-serif;max-width:580px;margin:auto;padding:28px;color:#1e293b;line-height:1.7">${text.split("\n").map(l=>l.trim()?`<p style="margin:0 0 10px">${l}</p>`:"<p style='margin:0 0 6px'></p>").join("")}</div>`;
  };
  // Find active template's html field
  const getHtmlTmpl=()=>{const t=T.find(t=>t.id===tmpl);return t?.html||null;};

  const sendAll=async()=>{
    if(!cfg.apiKey||!cfg.senderEmail||!selList.length)return;
    setSending(true);setResults(null);setView("preview");
    const res=[];
    const campId=Date.now();
    const now=new Date().toLocaleDateString("sv-SE")+" "+new Date().toLocaleTimeString("sv-SE",{hour:"2-digit",minute:"2-digit"});
    // Accumulate all fr updates – apply once at end to avoid stale closure overwrites
    const frUpdates={}; // id → updated forening object
    for(const f of selList){
      const recs=getRecipients(f);
      if(!recs.length){res.push({id:f.id,namn:f.namn,ok:false,msg:"Ingen e-post"});continue;}
      try{
        const r=await brevoPost({sender:{name:cfg.senderName||"Marketing Guru",email:cfg.senderEmail},to:recs,subject:fill(subj,f,cfg.senderName),htmlContent:makeHtml(fill(body,f,cfg.senderName),getHtmlTmpl(),f,cfg.senderName),textContent:fill(body,f,cfg.senderName),tags:cfg.brevoTag?[cfg.brevoTag]:[]});
        if(r.ok){
          res.push({id:f.id,namn:f.namn,ok:true});
          const email=recs.map(r=>r.email).join(" + ");
          const logEntry={id:campId+"_"+f.id,campaignId:campId,date:now,subject:fill(subj,f,cfg.senderName),toEmail:email,status:"sent"};
          // Build on top of any earlier update in this batch, not stale fr
          const base=frUpdates[f.id]||f;
          frUpdates[f.id]={...base,skickadeMail:(base.skickadeMail||0)+1,mailLog:[...(base.mailLog||[]),logEntry]};
        }else{
          const err=await r.json().catch(()=>({}));
          res.push({id:f.id,namn:f.namn,ok:false,msg:err.message||"HTTP "+r.status});
        }
      }catch(e){res.push({id:f.id,namn:f.namn,ok:false,msg:e.message});}
      setResults([...res]);
      await new Promise(r=>setTimeout(r,150));
    }
    // Single saveFr with all updates applied
    if(Object.keys(frUpdates).length>0){
      saveFr(fr.map(x=>frUpdates[x.id]||x));
    }
    const sent=res.filter(r=>r.ok).length;
    if(sent>0)saveCamp([...camp,{id:campId,date:new Date().toLocaleDateString("sv-SE"),subject:fill(subj,selList[0]||{},cfg.senderName),recipients:selList.length,sent,failed:res.length-sent,mottagare:res.map(r=>({id:r.id,namn:r.namn,ok:r.ok}))}]);
    setSending(false);
  };

  const sendTest=async()=>{
    if(!testEmail||!selList[0])return;
    setTestSending(true);setTestResult(null);
    const f=selList[0];
    try{
      const testBanner=`<div style="background:#fff3cd;padding:8px 14px;font-family:sans-serif;font-size:11px;color:#856404;border-bottom:2px solid #ffc107">⚠️ TESTMAIL – personaliserat med data från: <strong>${f.namn}</strong></div>`;
      const r=await brevoPost({sender:{name:cfg.senderName||"Marketing Guru",email:cfg.senderEmail},to:[{email:testEmail,name:"Test"}],subject:"[TEST] "+fill(subj,f,cfg.senderName),htmlContent:testBanner+makeHtml(fill(body,f,cfg.senderName),getHtmlTmpl(),f,cfg.senderName),textContent:"[TEST] "+fill(body,f,cfg.senderName),tags:cfg.brevoTag?[cfg.brevoTag]:[]});
      if(r.ok)setTestResult({ok:true,msg:"✓ Testmail skickat till "+testEmail});
      else{const e=await r.json().catch(()=>({}));setTestResult({ok:false,msg:e.message||"HTTP "+r.status});}
    }catch(e){setTestResult({ok:false,msg:e.message});}
    setTestSending(false);
  };


  // ── Sidebar: Avsändare + Mottagare
  const Sidebar=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={card()}>
        <button onClick={()=>setCfgOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",color:C.text,fontFamily:"inherit",padding:0,minHeight:36}}>
          <span style={{fontWeight:600,fontSize:13}}>⚙️ Avsändare {cfg.apiKey&&cfg.senderEmail?"✓":""}</span>
          <span style={{color:C.muted,fontSize:11}}>{cfgOpen?"▲":"▼"}</span>
        </button>
        {cfgOpen&&<div style={{marginTop:10}}>
          {[["API-nyckel","apiKey","password"],["Avsändarnamn","senderName","text"],["Avsändar-e-post","senderEmail","email"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:8}}><label style={lbl}>{l}</label><input type={t} value={cfg[k]||""} onChange={e=>saveCfg({...cfg,[k]:e.target.value})} style={{...I(),minHeight:M?46:40}}/></div>
          ))}
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.muted,cursor:"pointer"}}>
            <input type="checkbox" checked={cfg.preferOrdf||false} onChange={e=>saveCfg({...cfg,preferOrdf:e.target.checked})} style={{accentColor:C.blue,width:16,height:16}}/>
            Prioritera ordförandemail
          </label>
        </div>}
      </div>
      <div style={card()}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>👥 Mottagare <span style={{fontSize:11,fontWeight:400,color:C.muted}}>({selList.length}/{withE.length})</span></div>
        <div style={{display:"flex",gap:4,marginBottom:8}}>
          <button onClick={()=>{const n={};withE.forEach(f=>{n[f.id]=true;});setSel(n);}} style={{...btn("primary"),flex:1,justifyContent:"center",padding:"4px 0",fontSize:11,minHeight:30}}>✓ Alla</button>
          <button onClick={()=>setSel({})} style={{...btn("ghost"),flex:1,justifyContent:"center",padding:"4px 0",fontSize:11,minHeight:30}}>✕ Rensa</button>
        </div>
        <div style={{marginBottom:6}}>
          <select value={lanFilt} onChange={e=>{setLanFilt(e.target.value);setSel({});}} style={{...I({fontSize:12,padding:"5px 8px",minHeight:36})}}>
            <option value="">Alla regioner</option>{laner.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>
          {[["all","Alla",C.muted],["0","Ej kontaktad",C.muted],["1","Fått M1",C.blue],["2","Fått M1–2",C.teal],["3+","Fått alla 3",C.amber]].map(([v,l,co])=>(
            <button key={v} onClick={()=>{setMailFilt(v);setSel({});}} style={{background:mailFilt===v?co+"22":"transparent",border:`1px solid ${mailFilt===v?co:C.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:mailFilt===v?700:400,color:mailFilt===v?co:C.muted,textAlign:"left"}}>{l}</button>
          ))}
        </div>
        <div style={{marginBottom:8}}>
          <label style={lbl}>Sedan senaste mail</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {[["all","Oavsett",C.muted],["never","Aldrig skickat",C.muted],["7","7+ dagar",C.blue],["14","14+ dagar",C.teal],["30","30+ dagar",C.amber],["60","60+ dagar",C.red]].map(([v,l,co])=>(
              <button key={v} onClick={()=>{setDaysFilt(v);setSel({});}} style={{background:daysFilt===v?co+"22":"transparent",border:`1px solid ${daysFilt===v?co:C.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:daysFilt===v?700:400,color:daysFilt===v?co:C.muted,textAlign:"left"}}>{l}</button>
            ))}
          </div>
        </div>
        {kontexter.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
          {[{id:"",namn:"Alla",farg:C.muted},...kontexter].map(k=>(
            <button key={k.id} onClick={()=>setKontFilt(k.id)} style={{background:kontFilt===k.id?k.farg+"22":"transparent",border:`1px solid ${kontFilt===k.id?k.farg:C.border}`,borderRadius:14,padding:"3px 9px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:kontFilt===k.id?700:400,color:kontFilt===k.id?k.farg:C.muted}}>{k.namn}</button>
          ))}
        </div>}
        <div style={{maxHeight:220,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
          {withE.map(f=>(
            <label key={f.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 4px",borderRadius:6,cursor:"pointer",background:sel[f.id]?"rgba(59,130,246,0.1)":"transparent",minHeight:34}}>
              <input type="checkbox" checked={!!sel[f.id]} onChange={e=>setSel(p=>({...p,[f.id]:e.target.checked}))} style={{accentColor:C.blue,width:15,height:15,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12,fontWeight:500}}>{f.namn}</div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <div style={{display:"flex",gap:2}}>{[1,2,3].map(n=><span key={n} style={{fontSize:8,padding:"0 3px",borderRadius:3,fontWeight:700,background:(f.skickadeMail||0)>=n?C.blue+"33":C.bg3,color:(f.skickadeMail||0)>=n?C.blue:C.muted}}>M{n}</span>)}</div>
                  {lastSent(f)&&<span style={{fontSize:9,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lastSent(f).split(" ")[0]}</span>}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div>

      {/* View switcher */}
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {[["compose","✉️ Komponera"],["preview","📋 Granska & skicka"],["history","📚 Historik"]].map(([v,l])=>(
          <button key={v} onClick={()=>{setView(v);if(v!=="preview")setResults(null);}} style={{...btn(view===v?"primary":"ghost"),minHeight:M?44:38}}>{l}{v==="preview"&&selList.length>0?` (${selList.length})`:""}</button>
        ))}
      </div>

      {/* Historik */}
      {view==="history"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {camp.length===0?<div style={{...card({textAlign:"center",padding:40,color:C.muted})}}>Inga kampanjer</div>:
          [...camp].reverse().map((c2,i)=>(
            <div key={c2.id||i} style={card()}>
              <div style={{fontWeight:500,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c2.subject||"Utskick"}</div>
              <div style={{display:"flex",gap:12,fontSize:12,color:C.muted,flexWrap:"wrap"}}><span>{c2.date}</span><span>{c2.recipients} mottagare</span><span style={{color:C.green}}>{c2.sent}✓</span>{c2.failed>0&&<span style={{color:C.red}}>{c2.failed}✗</span>}</div>
            </div>
          ))}
        </div>
      )}

      {/* Komponera */}
      {view==="compose"&&(
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"260px 1fr",gap:12}}>
          <Sidebar/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={card()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <label style={{...lbl,margin:0}}>Mall</label>
                {seqActive&&<span style={{fontSize:10,color:C.amber,fontWeight:600}}>🔒 Låst av sekvens – <button onClick={()=>setSeqActive(null)} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:600,padding:0}}>lås upp</button></span>}
              </div>
              {seqActive?(
                <div style={{...I({marginBottom:10,minHeight:M?46:40,display:"flex",alignItems:"center",gap:8,opacity:0.8})}}>
                  <span style={{flex:1}}>{T.find(t=>t.id===tmpl)?.namn||tmpl}</span>
                  <span style={{fontSize:11,color:C.muted}}>🔒</span>
                </div>
              ):(
                <select value={tmpl} onChange={e=>pickTmpl(e.target.value)} style={{...I(),marginBottom:10,minHeight:M?46:40}}>{T.map(t=><option key={t.id} value={t.id}>{t.namn}</option>)}</select>
              )}
              <label style={lbl}>Ämnesrad</label>
              <input value={subj} onChange={e=>setSubj(e.target.value)} style={{...I(),marginBottom:10,minHeight:M?46:40}}/>
              <label style={lbl}>Meddelande</label>
              <textarea value={body} onChange={e=>setBody(e.target.value)} rows={M?10:12} style={{...I(),resize:"vertical",lineHeight:1.7}}/>
              <div style={{fontSize:10,color:C.muted,marginTop:4}}>{"{{namn}} {{mottagare}} {{ort}} {{idrott}} {{avsandare}}"}</div>
            </div>
            <button onClick={()=>setView("preview")} disabled={!selList.length} style={{...btn("primary",M),width:"100%",justifyContent:"center",minHeight:M?52:44,opacity:selList.length?1:0.4}}>
              Granska {selList.length} mail →
            </button>
          </div>
        </div>
      )}

      {/* Granska & Skicka */}
      {view==="preview"&&(
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"260px 1fr",gap:12}}>
          <Sidebar/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Preview list */}
            <MailPreviewList selList={selList} subj={subj} body={body} htmlTmpl={getHtmlTmpl()} cfg={cfg} getRecipients={getRecipients} hasDual={hasDual} M={M}/>

            {/* Testmail */}
            <div style={{...card({borderColor:C.amber+"44",background:"rgba(245,158,11,0.03)"})}}>
              <div style={{fontWeight:600,fontSize:12,marginBottom:8,color:C.amber}}>🧪 Skicka testmail (personaliserat med första mottagaren)</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                <input value={testEmail} onChange={e=>{setTestEmail(e.target.value);setTestResult(null);}} placeholder="din@epost.se" type="email" style={{...I({minHeight:M?44:38,flex:1,minWidth:150})}}/>
                <button onClick={sendTest} disabled={testSending||!testEmail||!cfg.apiKey||!cfg.senderEmail} style={{...btn("ghost"),minHeight:M?44:38,borderColor:C.amber+"66",color:C.amber}}>{testSending?"⏳":selList[0]?`Skicka till mig →`:"Välj mottagare"}</button>
              </div>
              {testResult&&<div style={{fontSize:12,color:testResult.ok?C.green:C.red,padding:"6px 8px",background:testResult.ok?"rgba(34,197,94,0.07)":"rgba(239,68,68,0.07)",borderRadius:6}}>{testResult.msg}</div>}
              {(!cfg.apiKey||!cfg.senderEmail)&&<div style={{fontSize:11,color:C.muted}}>⚙️ Fyll i API-nyckel och avsändar-e-post under Inställningar</div>}

            </div>

            {/* Sending results */}
            {results&&(
              <div style={card()}>
                <div style={{fontWeight:600,marginBottom:8}}>{sending?"Skickar…":results.filter(r=>r.ok).length+"/"+results.length+" skickade"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:240,overflowY:"auto"}}>
                  {results.map(r=>(
                    <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,background:r.ok?"rgba(34,197,94,0.07)":"rgba(239,68,68,0.07)"}}>
                      <span style={{color:r.ok?C.green:C.red,width:14,flexShrink:0}}>{r.ok?"✓":"✗"}</span>
                      <span style={{flex:1,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.namn}</span>
                      {!r.ok&&<span style={{fontSize:11,color:C.red,flexShrink:0,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.msg}</span>}
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Send button */}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setView("compose")} style={{...btn("ghost"),flex:1,justifyContent:"center"}}>← Tillbaka</button>
              <button onClick={sendAll} disabled={sending||!cfg.apiKey||!cfg.senderEmail||!selList.length} style={{...btn("primary"),flex:2,justifyContent:"center",minHeight:M?52:46,opacity:(!cfg.apiKey||!cfg.senderEmail)?0.5:1}}>
                {sending?"⏳ Skickar…":"🚀 Skicka till "+selList.length+" föreningar"}
              </button>
            </div>
            {(!cfg.apiKey||!cfg.senderEmail)&&<div style={{fontSize:11,color:C.amber,textAlign:"center"}}>⚠️ Fyll i API-nyckel och avsändar-e-post under ⚙️ Inställningar</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MailPreviewList ────────────────────────────────────────────────────────────
function MailPreviewList({selList,subj,body,htmlTmpl,cfg,getRecipients,hasDual,M}){
  const [expanded,setExpanded]=useState({});
  const [previewMode,setPreviewMode]=useState(htmlTmpl?"html":"text"); // html | text
  const [showAll,setShowAll]=useState(false);
  const visible=showAll?selList:selList.slice(0,6);
  const toggleAll=()=>{const allOpen=visible.every(f=>expanded[f.id]);const n={};selList.forEach(f=>{n[f.id]=!allOpen;});setExpanded(n);};
  return(
    <div style={{...card({padding:0,overflow:"hidden"})}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"rgba(59,130,246,0.07)",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap",gap:8}}>
        <div style={{fontWeight:600,fontSize:13}}>📋 {selList.length} mottagare</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {htmlTmpl&&(
            <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
              {[["html","🌐 HTML"],["text","📝 Text"]].map(([v,l])=>(
                <button key={v} onClick={()=>setPreviewMode(v)} style={{background:previewMode===v?C.blue:"transparent",border:"none",color:previewMode===v?"#fff":C.muted,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,WebkitTapHighlightColor:"transparent"}}>{l}</button>
              ))}
            </div>
          )}
          <button onClick={toggleAll} style={{...btn("ghost"),padding:"3px 10px",fontSize:11,minHeight:28}}>
            {visible.every(f=>expanded[f.id])?"Fäll ihop":"Expandera alla"}
          </button>
        </div>
      </div>
      <div style={{maxHeight:M?500:580,overflowY:"auto"}}>
        {visible.map((f,i)=>{
          const isOpen=expanded[f.id];
          const recs=getRecipients(f);
          const sn=cfg.senderName||"Marketing Guru";
          const pSubj=fill(subj,f,sn);
          const pBody=fill(body,f,sn);
          const pHtml=htmlTmpl?fill(htmlTmpl,f,sn):null;
          return(
            <div key={f.id} style={{borderBottom:i<visible.length-1?`1px solid ${C.border}`:"none"}}>
              {/* Row header */}
              <div onClick={()=>setExpanded(e=>({...e,[f.id]:!e[f.id]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:isOpen?"rgba(59,130,246,0.05)":"transparent",WebkitTapHighlightColor:"transparent"}}>
                <span style={{color:isOpen?C.blue:C.muted,fontSize:11,width:12,flexShrink:0,fontWeight:700}}>{isOpen?"▼":"▶"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.namn}</div>
                  <div style={{fontSize:11,color:hasDual(f)?C.teal:C.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {hasDual(f)?<>✉️ {f.epost} + {f.epostOrdf}</>:recs[0]?.email||"—"}
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  {hasDual(f)&&<Chip color={C.teal} sm>×2</Chip>}
                  {(f.skickadeMail||0)>0&&<Chip color={C.blue} sm>M{f.skickadeMail}</Chip>}
                  {lastSent(f)&&<span style={{fontSize:9,color:C.muted,whiteSpace:"nowrap"}}>{lastSent(f)}</span>}
                </div>
              </div>

              {/* Expanded preview */}
              {isOpen&&(
                <div style={{margin:"0 14px 14px",borderRadius:9,overflow:"hidden",border:"1px solid #e2e8f0"}}>
                  {/* Header */}
                  <div style={{background:"#f1f5f9",padding:"9px 14px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:10,color:"#64748b",marginBottom:2}}>
                        Från: <strong>{cfg.senderName||"Marketing Guru"}</strong> &lt;{cfg.senderEmail||"..."}&gt; → {recs.map(r=>r.email).join(", ")}
                      </div>
                      <div style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{pSubj}</div>
                    </div>
                    {pHtml&&(
                      <div style={{display:"flex",border:"1px solid #e2e8f0",borderRadius:6,overflow:"hidden",flexShrink:0}}>
                        {[["html","🌐 HTML"],["text","📝 Text"]].map(([v,l])=>(
                          <button key={v} onClick={e=>{e.stopPropagation();setPreviewMode(v);}} style={{background:previewMode===v?"#3b82f6":"transparent",border:"none",color:previewMode===v?"#fff":"#64748b",padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:600}}>{l}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  {previewMode==="html"&&pHtml?(
                    <iframe
                      srcDoc={pHtml}
                      style={{width:"100%",height:M?360:420,border:"none",background:"#fff",display:"block"}}
                      title={`HTML preview – ${f.namn}`}
                      sandbox="allow-same-origin"
                    />
                  ):(
                    <div style={{padding:"16px 18px",color:"#1e293b",fontSize:13,lineHeight:1.8,fontFamily:"Georgia,serif",maxHeight:300,overflowY:"auto",background:"#fff",whiteSpace:"pre-wrap"}}>
                      {pBody||"(tomt)"}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selList.length>6&&(
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,textAlign:"center"}}>
          <button onClick={()=>setShowAll(v=>!v)} style={{...btn("ghost"),fontSize:12,minHeight:30}}>{showAll?`Visa färre ▲`:`Visa alla ${selList.length} ▼`}</button>
        </div>
      )}
    </div>
  );
}

// ── MallarAI ──────────────────────────────────────────────────────────────────
function MallarAI({templates:rawT,saveTemplates,cfg,fr,M}){
  const templates=Array.isArray(rawT)&&rawT.length>0?rawT:TEMPLATES;
  const saveT=d=>saveTemplates&&saveTemplates(Array.isArray(d)?d:TEMPLATES);
  const [view,setView]=useState("list");
  const [editIdx,setEditIdx]=useState(null);
  const [editDraft,setEditDraft]=useState(null);
  const [previewFr,setPreviewFr]=useState("");
  const [editMode,setEditMode]=useState("text"); // text | html
  const [genStep,setGenStep]=useState(1);
  const [genForening,setGenForening]=useState("");
  const [genExtra,setGenExtra]=useState("");
  const [genResult,setGenResult]=useState("");
  const [genSubj,setGenSubj]=useState("");
  const [genLoading,setGenLoading]=useState(false);
  const [genErr,setGenErr]=useState("");
  const [saveName,setSaveName]=useState("");
  const [saveSteg,setSaveSteg]=useState(null);
  const [flash,setFlash]=useState("");
  const VARS=["{{namn}}","{{mottagare}}","{{ort}}","{{idrott}}","{{avsandare}}"];
  const STEP_LABELS={1:"Mail 1 – Introduktion",2:"Mail 2 – Uppföljning",3:"Mail 3 – Sista chansen"};
  const STEP_HINTS={1:"Presentera Ge Pant, sök 5 partnerföreningar, lista fördelar, ansök bottledrop.se",2:"Följ upp, förklara enkelhet och värde, personlig onboarding",3:"Urgency – platser fyllda, sista chansen, waitlist"};

  const generate=async()=>{
    setGenLoading(true);setGenErr("");setGenResult("");setGenSubj("");
    const sf=fr.find(f=>String(f.id)===genForening)||{};
    const prompt=`Skriv ett säljmail på svenska för BottleDROP – Ge Pant (digital pantplattform).\nSteg ${genStep}: ${STEP_LABELS[genStep]}. Fokus: ${STEP_HINTS[genStep]}\nFörening: ${sf.namn||"{{namn}}"}, idrott: ${sf.idrott||"{{idrott}}"}, ort: ${sf.ort||"{{ort}}"}\n${genExtra?`Extra: ${genExtra}`:""}\nTon: varm, konkret. Max 180 ord. Använd {{namn}} {{mottagare}} {{avsandare}} {{ort}} {{idrott}}.\nSvara BARA med JSON: {"subject":"...","body":"..."}`;
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await resp.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"";
      const json=JSON.parse(text.replace(/```json|```/g,"").trim());
      setGenSubj(json.subject||"");setGenResult(json.body||"");
      setSaveName(`${STEP_LABELS[genStep]}${sf.namn?" – "+sf.namn:""}`);setSaveSteg(genStep);
    }catch(e){setGenErr("Kunde inte generera – "+e.message);}
    setGenLoading(false);
  };
  const saveAsTemplate=()=>{if(!genResult)return;saveT([...templates,{id:"tmpl_"+Date.now(),namn:saveName||"Ny mall",steg:saveSteg,subject:genSubj,body:genResult,generatedAt:new Date().toLocaleDateString("sv-SE")}]);setFlash("✓ Mall sparad!");setTimeout(()=>setFlash(""),2000);setView("list");};
  const saveEdit=()=>{saveT(templates.map((t,i)=>i===editIdx?{...t,...editDraft}:t));setFlash("✓ Sparad!");setTimeout(()=>setFlash(""),2000);setView("list");setPreviewFr("");};

  if(view==="list")return(
    <div style={{maxWidth:800}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:M?15:17,fontWeight:700}}>🤖 Mallar</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Anpassningsbara mailmallar</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {flash&&<span style={{color:C.green,fontSize:12,fontWeight:500}}>{flash}</span>}
          <button onClick={async()=>{saveT(TEMPLATES);setFlash("✓ Återställd!");setTimeout(()=>setFlash(""),2000);}} style={{...btn("ghost"),fontSize:11,minHeight:36,color:C.amber,borderColor:C.amber+"55"}}>🗑 Återställ</button>
          <button onClick={()=>setView("generate")} style={{...btn("primary"),minHeight:M?46:40}}>🤖 Generera med AI</button>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {templates.map((t,i)=>{
          const co=t.steg===1?C.blue:t.steg===2?C.teal:t.steg===3?C.amber:C.muted;
          return(<div key={t.id||i} style={{...card({borderColor:co+"33"})}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:13}}>{t.namn||"Mall"}</span>{t.steg&&<Chip color={co} sm>Steg {t.steg}</Chip>}{t.generatedAt&&<Chip color={C.purple} sm>🤖 AI</Chip>}</div>
                <div style={{fontSize:12,color:C.muted,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(t.subject||"").replace(/{{.*?}}/g,"…")||"(inget ämne)"}</div>
              </div>
              <button onClick={()=>{if(!t)return;setEditIdx(i);setEditDraft({...t});setView("edit");setPreviewFr("");}} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,minHeight:32,flexShrink:0}}>✎ Redigera</button>
            </div>
            <div style={{fontSize:11,color:C.muted,background:C.bg4,borderRadius:6,padding:"7px 10px",maxHeight:44,overflow:"hidden",lineHeight:1.5}}>{(t.body||"").replace(/\n+/g," ").slice(0,140)}{(t.body||"").length>140?"…":""}</div>
            <div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap"}}>{VARS.map(v=><span key={v} style={{fontSize:9,background:"rgba(59,130,246,0.12)",color:C.blue,padding:"1px 6px",borderRadius:5,fontFamily:"monospace"}}>{v}</span>)}</div>
          </div>);
        })}
      </div>
    </div>
  );

  if(view==="generate")return(
    <div style={{maxWidth:760}}>
      <BackBar onBack={()=>{setView("list");setGenResult("");setGenErr("");}} title="🤖 Generera mailmall med AI"/>
      <div style={{padding:M?"12px 0":"14px 0",display:"flex",flexDirection:"column",gap:12}}>
        <div style={card()}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>1. Välj steg</div>
          <div style={{display:"grid",gridTemplateColumns:M?"1fr":"repeat(3,1fr)",gap:8}}>
            {[1,2,3].map(s=>(
              <button key={s} onClick={()=>setGenStep(s)} style={{background:genStep===s?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.03)",border:`1px solid ${genStep===s?C.blue:C.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                <div style={{fontWeight:600,fontSize:12,color:genStep===s?C.blue:C.text,marginBottom:4}}>{STEP_LABELS[s]}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.4}}>{STEP_HINTS[s]}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={card()}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>2. Anpassa (valfritt)</div>
          <label style={lbl}>Välj förening</label>
          <select value={genForening} onChange={e=>setGenForening(e.target.value)} style={{...I(),marginBottom:10,minHeight:M?46:42}}>
            <option value="">Generisk</option>{fr.filter(f=>hasEmail(f)).slice(0,20).map(f=><option key={f.id} value={f.id}>{f.namn} – {f.idrott}, {f.ort}</option>)}
          </select>
          <label style={lbl}>Extra info</label>
          <input value={genExtra} onChange={e=>setGenExtra(e.target.value)} placeholder="T.ex. föreningen har 200 medlemmar" style={{...I(),minHeight:M?46:42}}/>
        </div>
        <button onClick={generate} disabled={genLoading} style={{...btn("primary",M),width:"100%",justifyContent:"center",minHeight:M?52:48}}>{genLoading?"⏳ Genererar…":"🤖 Generera"}</button>
        {genErr&&<div style={{color:C.red,fontSize:12,padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8}}>{genErr}</div>}
        {genResult&&(
          <div style={{...card({borderColor:C.green+"44"})}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:10,color:C.green}}>✓ Genererat</div>
            <label style={lbl}>Ämnesrad</label>
            <input value={genSubj} onChange={e=>setGenSubj(e.target.value)} style={{...I(),marginBottom:10,minHeight:M?46:42}}/>
            <label style={lbl}>Mailtext</label>
            <textarea value={genResult} onChange={e=>setGenResult(e.target.value)} rows={M?12:14} style={{...I(),resize:"vertical",lineHeight:1.7,marginBottom:10}}/>
            <label style={lbl}>Mallnamn</label>
            <input value={saveName} onChange={e=>setSaveName(e.target.value)} style={{...I(),marginBottom:8,minHeight:M?46:42}}/>
            <label style={lbl}>Steg</label>
            <select value={saveSteg||""} onChange={e=>setSaveSteg(e.target.value?parseInt(e.target.value):null)} style={{...I(),marginBottom:12,minHeight:M?46:42}}>
              <option value="">Ingen</option><option value="1">Steg 1</option><option value="2">Steg 2</option><option value="3">Steg 3</option>
            </select>
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveAsTemplate} style={{...btn("primary",M),flex:2,justifyContent:"center",minHeight:M?50:44}}>💾 Spara mall</button>
              <button onClick={generate} disabled={genLoading} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:M?50:44}}>🔄 Igen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if(view==="edit"&&editDraft&&editDraft.namn!==undefined)return(
    <div style={{maxWidth:900}}>
      <BackBar onBack={()=>setView("list")} title={`✎ ${editDraft.namn||"mall"}`} actions={<span style={{color:C.green,fontSize:12}}>{flash}</span>}/>
      <div style={{padding:M?"12px 0":"14px 0",display:"flex",flexDirection:"column",gap:10}}>

        {/* Meta */}
        <div style={card()}>
          <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            <div><label style={lbl}>Mallnamn</label><input value={editDraft.namn||""} onChange={e=>setEditDraft(p=>({...p,namn:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
            <div><label style={lbl}>Steg</label><select value={editDraft.steg||""} onChange={e=>setEditDraft(p=>({...p,steg:e.target.value?parseInt(e.target.value):null}))} style={{...I(),minHeight:M?46:42}}><option value="">Ingen</option><option value="1">Steg 1</option><option value="2">Steg 2</option><option value="3">Steg 3</option></select></div>
            <div><label style={lbl}>Ämnesrad</label><input value={editDraft.subject||""} onChange={e=>setEditDraft(p=>({...p,subject:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
          </div>
        </div>

        {/* Editor tabs: Text | HTML | Preview */}
        <div style={card()}>
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:12,gap:0}}>
            {[["text","📝 Plaintext"],["html","🌐 HTML"],["preview","👁 Förhandsgranskning"]].map(([v,l])=>(
              <button key={v} onClick={()=>setEditMode(v)} style={{background:"none",border:"none",borderBottom:`2px solid ${editMode===v?C.blue:"transparent"}`,cursor:"pointer",fontFamily:"inherit",padding:"8px 14px",fontSize:12,fontWeight:editMode===v?600:400,color:editMode===v?C.text:C.muted}}>
                {l}
              </button>
            ))}
            <div style={{flex:1}}/>
            <div style={{display:"flex",gap:4,alignItems:"center",paddingRight:4,flexWrap:"wrap"}}>
              {VARS.map(v=>(
                <button key={v} onClick={()=>{
                  if(editMode==="html")setEditDraft(p=>({...p,html:(p.html||"")+v}));
                  else setEditDraft(p=>({...p,body:(p.body||"")+v}));
                }} style={{background:"rgba(59,130,246,0.1)",border:"none",borderRadius:5,padding:"2px 7px",fontSize:9,fontFamily:"monospace",color:C.blue,cursor:"pointer"}}>{v}</button>
              ))}
            </div>
          </div>

          {editMode==="text"&&(
            <div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Ren text – används som fallback och i textbaserade e-postklienter</div>
              <textarea value={editDraft.body||""} onChange={e=>setEditDraft(p=>({...p,body:e.target.value}))} rows={M?14:18} style={{...I({fontFamily:"monospace",fontSize:12}),resize:"vertical",lineHeight:1.7}}/>
            </div>
          )}

          {editMode==="html"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:11,color:C.muted}}>HTML – renderas i moderna e-postklienter</div>
                <div style={{display:"flex",gap:6}}>
                  {!editDraft.html&&(
                    <button onClick={()=>{
                      // Generate HTML from body text as starting point
                      const bodyHtml=`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
  <tr><td style="background:#0f172a;padding:20px 32px;text-align:center"><div style="color:#2dd4bf;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">BottleDROP – Ge Pant</div></td></tr>
  <tr><td style="padding:32px">${(editDraft.body||"").split("\n").map(l=>l.trim()?`<p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.7">${l}</p>`:"").join("")}</td></tr>
  <tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0"><p style="margin:0;font-size:13px;color:#94a3b8">Allt gott,<br><strong style="color:#374151">{{avsandare}}</strong></p></td></tr>
</table></td></tr></table></body></html>`;
                      setEditDraft(p=>({...p,html:bodyHtml}));
                    }} style={{...btn("ghost"),fontSize:11,minHeight:30,padding:"0 10px",color:C.teal,borderColor:C.teal+"44"}}>
                      ✨ Generera från text
                    </button>
                  )}
                  {editDraft.html&&(
                    <button onClick={()=>setEditDraft(p=>({...p,html:""}))} style={{...btn("ghost"),fontSize:11,minHeight:30,padding:"0 10px",color:C.red,borderColor:C.red+"33"}}>
                      🗑 Rensa HTML
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={editDraft.html||""}
                onChange={e=>setEditDraft(p=>({...p,html:e.target.value}))}
                rows={M?16:22}
                spellCheck={false}
                style={{...I({fontFamily:"'Courier New',monospace",fontSize:11,color:"#58a6ff",background:"#0d1117",border:"1px solid #30363d"}),resize:"vertical",lineHeight:1.6,tabSize:2}}
              />
              <div style={{fontSize:10,color:C.muted,marginTop:4}}>Använd {"{{namn}}"} {"{{mottagare}}"} {"{{avsandare}}"} {"{{ort}}"} {"{{idrott}}"} som variabler</div>
            </div>
          )}

          {editMode==="preview"&&(()=>{
            const pf=previewFr?fr.find(f=>String(f.id)===previewFr):null;
            const pd=pf||{namn:"Testföreningen",ordforande:"Mottagaren",ort:"Testorten",idrott:"Idrott",burkar:0};
            const htmlSrc=editDraft.html?fill(editDraft.html,pd,cfg.senderName||"Marketing Guru"):null;
            const textSrc=fill(editDraft.body||"",pd,cfg.senderName||"Marketing Guru");
            return(
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
                  <select value={previewFr} onChange={e=>setPreviewFr(e.target.value)} style={{...I({fontSize:12,padding:"5px 8px",minHeight:36,flex:1,maxWidth:280})}}>
                    <option value="">Generisk testdata</option>
                    {fr.filter(f=>hasEmail(f)).slice(0,20).map(f=><option key={f.id} value={f.id}>{f.namn}</option>)}
                  </select>
                  {editDraft.html&&(
                    <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
                      {[["html","🌐 HTML"],["text","📝 Text"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setEditMode("preview_"+v)} style={{background:editMode==="preview_"+v||(!editMode.includes("_")&&v==="html")?C.blue:"transparent",border:"none",color:editMode==="preview_"+v||(!editMode.includes("_")&&v==="html")?"#fff":C.muted,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>{l}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{fontWeight:600,fontSize:12,marginBottom:6,color:C.muted}}>
                  Ämne: <span style={{color:C.text}}>{fill(editDraft.subject||"",pd,cfg.senderName||"Marketing Guru")}</span>
                </div>
                {(htmlSrc&&editMode!=="preview_text")?(
                  <iframe
                    srcDoc={htmlSrc}
                    style={{width:"100%",height:M?400:500,border:`1px solid ${C.border}`,borderRadius:8,background:"#fff"}}
                    title="HTML preview"
                    sandbox="allow-same-origin"
                  />
                ):(
                  <div style={{background:"#fff",borderRadius:8,border:`1px solid ${C.border}`,padding:"20px 24px",color:"#1e293b",fontSize:13,lineHeight:1.8,fontFamily:"Georgia,serif",minHeight:200,whiteSpace:"pre-wrap"}}>{textSrc||"(tomt)"}</div>
                )}
              </div>
            );
          })()}

          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={saveEdit} style={{...btn("primary",M),flex:2,justifyContent:"center",minHeight:M?50:44}}>💾 Spara</button>
            <button onClick={()=>setView("list")} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:M?50:44}}>Avbryt</button>
          </div>
        </div>

      </div>
    </div>
  );
  return null;
}

// ── Kontakter ─────────────────────────────────────────────────────────────────
function Kontakter({contacts,saveContacts,fr,saveFr,M}){
  const [q,setQ]=useState("");const [screen,setScreen]=useState("list");
  const [editing,setEditing]=useState(null);
  const blank={fornamn:"",efternamn:"",epost:"",telefon:"",roll:"",foreningId:null,anteckningar:""};
  const [form,setForm]=useState(blank);
  const [selContact,setSelContact]=useState(null);
  const shown=contacts.filter(c=>!q||[c.fornamn,c.efternamn,c.epost,c.roll].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  const getFrNamn=id=>fr.find(f=>f.id===id)?.namn||"—";
  const getMailsForContact=c=>{if(!c.foreningId)return[];const f=fr.find(x=>x.id===c.foreningId);return f?.mailLog||[];};
  const save=()=>{
    const contact={...form,id:editing||Math.max(0,...contacts.map(c=>c.id))+1,foreningId:form.foreningId?parseInt(form.foreningId):null};
    const nc=editing?contacts.map(c=>c.id===editing?contact:c):[...contacts,contact];
    saveContacts(nc);
    let nfr=[...fr];
    if(editing){const old=contacts.find(c=>c.id===editing);if(old?.foreningId&&old.foreningId!==contact.foreningId)nfr=nfr.map(f=>f.id===old.foreningId?{...f,kontaktIds:(f.kontaktIds||[]).filter(id=>id!==editing)}:f);}
    if(contact.foreningId){const f=nfr.find(f=>f.id===contact.foreningId);if(f&&!(f.kontaktIds||[]).includes(contact.id))nfr=nfr.map(f=>f.id===contact.foreningId?{...f,kontaktIds:[...(f.kontaktIds||[]),contact.id]}:f);}
    saveFr(nfr);setScreen("list");
  };
  const del=c=>{if(!confirm("Ta bort?"))return;saveContacts(contacts.filter(x=>x.id!==c.id));if(c.foreningId)saveFr(fr.map(f=>f.id===c.foreningId?{...f,kontaktIds:(f.kontaktIds||[]).filter(id=>id!==c.id)}:f));};

  if(screen==="form")return(
    <div><BackBar onBack={()=>setScreen("list")} title={editing?"Redigera kontakt":"Ny kontakt"}/>
      <div style={{padding:"14px 12px"}}>
        <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:8,marginBottom:8}}>
          {[["fornamn","Förnamn"],["efternamn","Efternamn"],["epost","E-post"],["telefon","Telefon"]].map(([k,l])=>(
            <div key={k}><label style={lbl}>{l}</label><input value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{...I(),minHeight:M?46:40}}/></div>
          ))}
          <div><label style={lbl}>Roll</label><select value={form.roll||""} onChange={e=>setForm(p=>({...p,roll:e.target.value}))} style={{...I(),minHeight:M?46:40}}><option value="">Välj…</option>{ROLLER.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
          <div><label style={lbl}>Förening</label><select value={form.foreningId||""} onChange={e=>setForm(p=>({...p,foreningId:e.target.value}))} style={{...I(),minHeight:M?46:40}}><option value="">Ingen</option>{fr.map(f=><option key={f.id} value={f.id}>{f.namn}</option>)}</select></div>
        </div>
        <div style={{marginBottom:12}}><label style={lbl}>Anteckningar</label><input value={form.anteckningar||""} onChange={e=>setForm(p=>({...p,anteckningar:e.target.value}))} style={{...I(),minHeight:M?46:40}}/></div>
        <button onClick={save} style={{...btn("primary",M),width:"100%",justifyContent:"center",minHeight:M?52:44}}>Spara kontakt</button>
      </div>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"flex-end"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Sök…" style={{...I(),flex:1,minHeight:M?46:40}}/>
        <button onClick={()=>{setForm(blank);setEditing(null);setScreen("form");}} style={{...btn("primary"),padding:"0 18px",minHeight:M?46:40}}>+</button>
      </div>
      <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{shown.length} av {contacts.length} kontakter</div>
      {M?(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {shown.map(c=>{const mails=getMailsForContact(c);const isOpen=selContact===c.id;return(
            <div key={c.id} style={card()}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.purple,flexShrink:0}}>{c.fornamn?.[0]||"?"}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13}}>{c.fornamn} {c.efternamn}</div>{c.roll&&<Chip color={C.blue} sm>{c.roll}</Chip>}</div>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{setForm({...c,foreningId:c.foreningId||""});setEditing(c.id);setScreen("form");}} style={{...btn("ghost"),padding:"5px 10px",fontSize:11}}>✎</button>
                  <button onClick={()=>del(c)} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,color:C.red,borderColor:"rgba(239,68,68,0.3)"}}>✕</button>
                </div>
              </div>
              {c.epost&&<div style={{fontSize:11,color:C.green,marginBottom:2}}>📧 {c.epost}</div>}
              {c.foreningId&&<div style={{fontSize:11,color:C.muted}}>🏆 {getFrNamn(c.foreningId)}</div>}
              {mails.length>0&&<button onClick={()=>setSelContact(isOpen?null:c.id)} style={{...btn("ghost"),marginTop:7,width:"100%",justifyContent:"center",fontSize:11,minHeight:34}}>{isOpen?"Dölj mail":"📋 Visa mail ("+mails.length+")"}</button>}
              {isOpen&&<div style={{marginTop:7,borderTop:`1px solid ${C.border}`,paddingTop:7}}>{[...mails].reverse().map((m,i)=>(
                <div key={i} style={{padding:"5px 0",borderBottom:i<mails.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:1}}><span style={{fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.subject||"Utskick"}</span><Chip color={m.status==="sent"?C.green:C.red} sm>{m.status==="sent"?"✓":"✗"}</Chip></div>
                  <div style={{fontSize:10,color:C.muted}}>{m.date}</div>
                </div>
              ))}</div>}
            </div>
          );})}
        </div>
      ):(
        <div style={{...card({padding:0,overflow:"hidden"})}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.bg3,borderBottom:`1px solid ${C.border}`}}>
              {["Namn","Roll","E-post","Förening","Mail",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:C.muted}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {shown.map((c,i)=>{const mails=getMailsForContact(c);const isOpen=selContact===c.id;return(
                <>
                <tr key={c.id} style={{borderBottom:`1px solid ${C.border}`,background:isOpen?"rgba(59,130,246,0.07)":i%2===0?C.bg2:"transparent",cursor:"pointer"}} onClick={()=>setSelContact(isOpen?null:c.id)}>
                  <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:26,height:26,borderRadius:"50%",background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.purple}}>{c.fornamn?.[0]||"?"}</div><span style={{fontWeight:500}}>{c.fornamn} {c.efternamn}</span></div></td>
                  <td style={{padding:"9px 12px"}}>{c.roll?<Chip color={C.blue} sm>{c.roll}</Chip>:"—"}</td>
                  <td style={{padding:"9px 12px",color:c.epost?C.green:C.muted,fontSize:11}}>{c.epost||"—"}</td>
                  <td style={{padding:"9px 12px",fontSize:11}}>{c.foreningId?getFrNamn(c.foreningId):"—"}</td>
                  <td style={{padding:"9px 12px"}}>{mails.length>0?<span style={{fontSize:11,color:C.blue}}>📋 {mails.length}</span>:"—"}</td>
                  <td style={{padding:"9px 12px"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:5}}>
                    <button onClick={()=>{setForm({...c,foreningId:c.foreningId||""});setEditing(c.id);setScreen("form");}} style={{...btn("ghost"),padding:"4px 10px",fontSize:11,minHeight:30}}>✎</button>
                    <button onClick={()=>del(c)} style={{...btn("ghost"),padding:"4px 10px",fontSize:11,minHeight:30,color:C.red,borderColor:"rgba(239,68,68,0.3)"}}>✕</button>
                  </div></td>
                </tr>
                {isOpen&&mails.length>0&&(
                  <tr style={{background:"rgba(59,130,246,0.04)"}}><td colSpan={6} style={{padding:"0 14px 10px"}}><div style={{borderTop:`1px solid ${C.border}`,paddingTop:7,display:"flex",flexDirection:"column",gap:3}}>
                    {[...mails].reverse().map((m,mi)=>(
                      <div key={mi} style={{display:"flex",alignItems:"center",gap:10,fontSize:11,padding:"3px 0",borderBottom:mi<mails.length-1?`1px solid ${C.border}`:"none"}}>
                        <span style={{color:m.status==="sent"?C.green:C.red,width:12}}>{m.status==="sent"?"✓":"✗"}</span>
                        <span style={{color:C.muted,flexShrink:0}}>{m.date}</span>
                        <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.subject||"Utskick"}</span>
                      </div>
                    ))}
                  </div></td></tr>
                )}
                </>
              );})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Installningar ─────────────────────────────────────────────────────────────
function Installningar({cfg,saveCfg,templates:tmplsProp,saveTemplates,kontexter,saveKontexter,aktivKontextId,saveAktivKontext,fr,camp,contacts,M}){
  const [tab,setTab]=useState("kontexter");
  const tmplList=Array.isArray(tmplsProp)&&tmplsProp.length>0?tmplsProp:TEMPLATES;
  const dalarna=fr.filter(f=>f.lan==="Dalarna");
  const allMails=fr.flatMap(f=>(f.mailLog||[]).map(m=>({...m,foreningNamn:f.namn})));
  const [editTmplIdx,setEditTmplIdx]=useState(null);
  const [editDraft,setEditDraft]=useState(null);
  const [previewFr,setPreviewFr]=useState("");
  const [tmplFlash,setTmplFlash]=useState("");
  const SUBTABS=[["kontexter","🎯 Kontexter"],["brevo","🔑 Brevo & Avsändare"],["mallar","📝 Mallar"],["statistik","📊 Statistik"],["maillog","📋 Alla mail"],["databas","☁️ Databas"]];
  const VARS=["{{namn}}","{{mottagare}}","{{ort}}","{{idrott}}","{{avsandare}}"];
  const startEditTmpl=i=>{if(!tmplList[i])return;setEditTmplIdx(i);setEditDraft({...tmplList[i]});setPreviewFr("");};
  const saveTmpl=()=>{const next=tmplList.map((t,i)=>i===editTmplIdx?{...t,...editDraft}:t);saveTemplates&&saveTemplates(next);setEditTmplIdx(null);setEditDraft(null);setTmplFlash("✓ Sparad!");setTimeout(()=>setTmplFlash(""),2000);};
  const resetTmpl=async()=>{if(!confirm("Återställ?"))return;try{await window.storage.set("bd5_templates",JSON.stringify(TEMPLATES));}catch{}saveTemplates&&saveTemplates(TEMPLATES);setEditTmplIdx(null);setEditDraft(null);setTmplFlash("✓ Återställd!");setTimeout(()=>setTmplFlash(""),2000);};

  return(
    <div style={{maxWidth:760}}>
      <div style={{fontWeight:700,fontSize:M?16:18,marginBottom:16}}>⚙️ Inställningar</div>
      <div style={{display:"flex",gap:0,marginBottom:16,overflowX:"auto",borderBottom:`1px solid ${C.border}`}}>
        {SUBTABS.map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===v?C.blue:"transparent"}`,cursor:"pointer",fontFamily:"inherit",padding:M?"10px 12px":"9px 16px",fontSize:M?11:12,fontWeight:tab===v?600:400,color:tab===v?C.text:C.muted,whiteSpace:"nowrap"}}>{l}</button>
        ))}
      </div>

      {tab==="kontexter"&&<KontexterEditor kontexter={kontexter} saveKontexter={saveKontexter} aktivKontextId={aktivKontextId} saveAktivKontext={saveAktivKontext} fr={fr} M={M}/>}

      {tab==="brevo"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <BrevoStatus cfg={cfg}/>
          <div style={{...card({borderColor:C.blue+"44"})}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>🔑 API-nyckel</div>
            <label style={lbl}>Brevo API-nyckel</label>
            <input type="password" value={cfg.apiKey||""} onChange={e=>saveCfg({...cfg,apiKey:e.target.value})} placeholder="xkeysib-…" style={{...I(),marginBottom:6,minHeight:M?46:42}}/>
            <div style={{fontSize:10,color:C.muted}}>app.brevo.com → ditt namn → SMTP & API → API Keys</div>
          </div>

          <div style={{...card({borderColor:cfg.proxyUrl?C.green+"44":C.amber+"44",background:cfg.proxyUrl?"rgba(34,197,94,0.03)":"rgba(245,158,11,0.03)"})}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{fontWeight:600,fontSize:13}}>🔀 Proxy-URL</div>
              {cfg.proxyUrl?<Chip color={C.green} sm>Aktiv ✓</Chip>:<Chip color={C.amber} sm>Behövs för Claude.ai</Chip>}
            </div>
            <label style={lbl}>Proxy-URL (lämna tom om appen körs på egen domän)</label>
            <input value={cfg.proxyUrl||""} onChange={e=>saveCfg({...cfg,proxyUrl:e.target.value})} placeholder="https://din-proxy.din-domän.workers.dev" style={{...I({border:`1px solid ${cfg.proxyUrl?C.green+"66":C.amber+"66"}`}),marginBottom:10,minHeight:M?46:42}}/>
            <div style={{...card({background:C.bg4,padding:"12px 14px",borderColor:C.border})}}>
              <div style={{fontWeight:600,fontSize:11,marginBottom:8,color:C.muted}}>⚡ Sätt upp en proxy på 2 min med Cloudflare Workers (gratis)</div>
              <ol style={{margin:0,padding:"0 0 0 16px",fontSize:11,color:C.muted,lineHeight:2}}>
                <li>Gå till <strong style={{color:C.text}}>workers.cloudflare.com</strong> → skapa konto (gratis)</li>
                <li>Klicka <strong style={{color:C.text}}>Create Worker</strong> → klistra in koden nedan → Deploy</li>
                <li>Kopiera Worker-URL:n och klistra in ovan</li>
              </ol>
              <div style={{background:"#0d1117",borderRadius:7,padding:"10px 12px",marginTop:8,position:"relative"}}>
                <WorkerCopyButton/>
              </div>
            </div>
          </div>
          <div style={{...card({borderColor:C.teal+"44"})}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>✉️ Avsändare</div>
            <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
              <div><label style={lbl}>Avsändarnamn</label><input value={cfg.senderName||""} onChange={e=>saveCfg({...cfg,senderName:e.target.value})} placeholder="Marketing Guru" style={{...I(),minHeight:M?46:42}}/></div>
              <div><label style={lbl}>Avsändar-e-post <span style={{color:C.red}}>*</span></label><input type="email" value={cfg.senderEmail||""} onChange={e=>saveCfg({...cfg,senderEmail:e.target.value})} placeholder="din@epost.se" style={{...I({border:`1px solid ${cfg.senderEmail?C.border:C.red+"66"}`}),minHeight:M?46:42}}/></div>
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:C.muted,cursor:"pointer",minHeight:36,marginBottom:6}}>
              <input type="checkbox" checked={cfg.preferOrdf||false} onChange={e=>saveCfg({...cfg,preferOrdf:e.target.checked})} style={{accentColor:C.blue,width:18,height:18}}/>
              Prioritera ordförandemail framför generell e-post
            </label>
            {!cfg.senderEmail&&<div style={{fontSize:11,color:C.red,padding:"6px 10px",background:"rgba(239,68,68,0.07)",borderRadius:7}}>⚠️ E-postadressen måste vara verifierad i Brevo under Senders & IP.</div>}
            <div style={{marginTop:10}}>
              <label style={lbl}>Brevo-tagg (valfritt)</label>
              <input value={cfg.brevoTag||""} onChange={e=>saveCfg({...cfg,brevoTag:e.target.value})} placeholder="Marketingguru - BottleDROP" style={{...I(),minHeight:M?46:42}}/>
              <div style={{fontSize:10,color:C.muted,marginTop:4}}>Taggen läggs på alla mail som skickas och syns i Brevo under Transactional → Logs. Lämna tomt för ingen tagg.</div>
            </div>
          </div>
        </div>
      )}

      {tab==="mallar"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div style={{fontWeight:600,fontSize:13}}>📝 Mailmallar</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>{tmplFlash&&<span style={{color:C.green,fontSize:12,fontWeight:500}}>{tmplFlash}</span>}{editTmplIdx===null&&<button onClick={resetTmpl} style={{...btn("ghost"),fontSize:11,minHeight:34,color:C.amber,borderColor:C.amber+"55"}}>🗑 Återställ</button>}</div>
          </div>
          {editTmplIdx!==null&&editDraft?(
            <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:14}}>
              <div style={card()}>
                <label style={lbl}>Ämnesrad</label>
                <input value={editDraft.subject||""} onChange={e=>setEditDraft(p=>({...p,subject:e.target.value}))} style={{...I(),marginBottom:9,minHeight:M?46:40}}/>
                <label style={lbl}>Mailtext</label>
                <textarea value={editDraft.body||""} onChange={e=>setEditDraft(p=>({...p,body:e.target.value}))} rows={M?10:14} style={{...I(),resize:"vertical",lineHeight:1.7,marginBottom:6}}/>
                <div style={{marginBottom:10,display:"flex",gap:4,flexWrap:"wrap"}}>{VARS.map(v=><button key={v} onClick={()=>setEditDraft(p=>({...p,body:(p.body||"")+v}))} style={{background:"rgba(59,130,246,0.1)",border:"none",borderRadius:6,padding:"2px 8px",fontSize:10,fontFamily:"monospace",color:C.blue,cursor:"pointer"}}>{v}</button>)}</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={saveTmpl} style={{...btn("primary",M),flex:2,justifyContent:"center",minHeight:M?48:40}}>💾 Spara</button>
                  <button onClick={()=>{setEditTmplIdx(null);setEditDraft(null);}} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:M?48:40}}>Avbryt</button>
                </div>
              </div>
              <div style={{...card({borderColor:C.amber+"44"})}}>
                <div style={{fontWeight:600,fontSize:12,marginBottom:8,color:C.amber}}>👁 Preview</div>
                <select value={previewFr} onChange={e=>setPreviewFr(e.target.value)} style={{...I({fontSize:12}),marginBottom:8}}>
                  <option value="">Generisk</option>{fr.filter(f=>hasEmail(f)).slice(0,15).map(f=><option key={f.id} value={f.id}>{f.namn}</option>)}
                </select>
                {(()=>{const pf=previewFr?fr.find(f=>String(f.id)===previewFr):null;const pd=pf||{namn:"Föreningen",ordforande:"Mottagaren",ort:"Orten",idrott:"Idrott",burkar:0};return(<div style={{background:"#fff",borderRadius:8,overflow:"hidden"}}>{pf&&<div style={{background:"#eef4ff",padding:"5px 12px",fontSize:11,color:"#3b82f6"}}>{pf.namn}</div>}<div style={{background:"#f8fafc",padding:"8px 12px",borderBottom:"1px solid #e2e8f0"}}><div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>{fill(editDraft.subject||"",pd,cfg.senderName||"Marketing Guru")}</div></div><div style={{padding:"12px",color:"#1e293b",fontSize:12,lineHeight:1.8,fontFamily:"Georgia,serif",maxHeight:200,overflowY:"auto"}} dangerouslySetInnerHTML={{__html:fill(editDraft.body||"",pd,cfg.senderName||"Marketing Guru").split("\n").map(l=>l.trim()?`<p style="margin:0 0 8px">${l}</p>`:"<p style='margin:0 0 4px'></p>").join("")}}/></div>);})()}
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {tmplList.map((t,i)=>{
                const co=t.steg===1?C.blue:t.steg===2?C.teal:t.steg===3?C.amber:C.muted;
                return(<div key={t.id||i} style={{...card({borderColor:co+"33"})}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,justifyContent:"space-between"}}>
                    <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:13}}>{t.namn||"Mall"}</span>{t.steg&&<Chip color={co} sm>Steg {t.steg}</Chip>}</div><div style={{fontSize:12,color:C.muted,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(t.subject||"").replace(/{{.*?}}/g,"…")||"(inget ämne)"}</div></div>
                    <button onClick={()=>startEditTmpl(i)} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,minHeight:32,flexShrink:0}}>✎</button>
                  </div>
                  <div style={{marginTop:7,fontSize:11,color:C.muted,background:C.bg4,borderRadius:6,padding:"6px 10px",maxHeight:40,overflow:"hidden",lineHeight:1.5}}>{(t.body||"").replace(/\n+/g," ").slice(0,130)}{(t.body||"").length>130?"…":""}</div>
                </div>);
              })}
            </div>
          )}
        </div>
      )}

      {tab==="statistik"&&(
        <div style={{display:"grid",gridTemplateColumns:M?"1fr 1fr":"repeat(4,1fr)",gap:10}}>
          {[[fr.length,"Föreningar","🏆",C.blue],[dalarna.length,"Dalarna","📍",C.teal],[contacts.length,"Kontakter","👥",C.purple],[camp.length,"Kampanjer","🚀",C.amber],[fr.filter(hasEmail).length,"Har e-post","📧",C.green],[fr.filter(f=>!hasEmail(f)).length,"Saknar e-post","📧",C.red],[fr.reduce((s,f)=>s+(f.skickadeMail||0),0),"Mail skickade","✉️",C.blue],[fr.filter(f=>(f.taggar||[]).length>0).length,"Taggade","🏷",C.teal]].map(([v,l,ic,co])=>(
            <div key={l} style={{...card({borderColor:co+"33",padding:"14px 16px"})}}>
              <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
              <div style={{fontSize:22,fontWeight:700,color:co}}>{v}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {tab==="databas"&&(
        <DatabasPanel/>
      )}

      {tab==="maillog"&&(
        <div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{allMails.length} mail totalt</div>
          {allMails.length===0?<div style={{...card({textAlign:"center",padding:40,color:C.muted})}}>Inga mail loggade</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:M?8:0}}>
              {[...allMails].reverse().map((m,i)=>M?(
                <div key={i} style={card({padding:"12px 14px"})}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}><span style={{fontWeight:500,fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.foreningNamn}</span><Chip color={m.status==="sent"?C.green:C.red} sm>{m.status==="sent"?"✓":"✗"}</Chip></div>
                  <div style={{fontSize:11,color:C.muted}}>{m.date} · {m.toEmail}</div>
                </div>
              ):(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 14px",background:i%2===0?C.bg2:C.bg,borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                  <span style={{color:m.status==="sent"?C.green:C.red,width:14}}>{m.status==="sent"?"✓":"✗"}</span>
                  <span style={{fontWeight:500,minWidth:160,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.foreningNamn}</span>
                  <span style={{flex:1,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.subject||"Utskick"}</span>
                  <span style={{color:C.muted,flexShrink:0,minWidth:100}}>{m.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── KontexterEditor ───────────────────────────────────────────────────────────
function KontexterEditor({kontexter,saveKontexter,aktivKontextId,saveAktivKontext,fr,M}){
  const [editing,setEditing]=useState(null);
  const blank={id:"k_"+Date.now(),namn:"",farg:"#3b82f6",beskrivning:"",metricLabel:"",senderName:"Marketing Guru",senderEmail:"",aktiv:true};
  const [draft,setDraft]=useState(blank);
  const [flash,setFlash]=useState("");
  const COLORS=["#3b82f6","#2dd4bf","#22c55e","#f59e0b","#ef4444","#a78bfa","#f97316","#ec4899"];
  const save=()=>{let next=editing==="new"?[...kontexter,draft]:kontexter.map(k=>k.id===editing?{...k,...draft}:k);saveKontexter(next);setEditing(null);setFlash("✓ Sparad!");setTimeout(()=>setFlash(""),2000);};
  const del=id=>{if(!confirm("Ta bort?"))return;saveKontexter(kontexter.filter(k=>k.id!==id));};
  const taggedCount=id=>(fr||[]).filter(f=>(f.taggar||[]).includes(id)).length;
  const aktivK=kontexter.find(k=>k.id===aktivKontextId);
  return(
    <div style={{maxWidth:700}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div><div style={{fontSize:M?14:16,fontWeight:700}}>🎯 Kontexter</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>Definiera kampanjer och tagga föreningar</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>{flash&&<span style={{color:C.green,fontSize:12,fontWeight:500}}>{flash}</span>}<button onClick={()=>{setDraft({...blank,id:"k_"+Date.now()});setEditing("new");}} style={{...btn("primary"),minHeight:M?44:38}}>+ Ny kontext</button></div>
      </div>
      {aktivK&&<div style={{...card({borderColor:aktivK.farg+"55",background:aktivK.farg+"08",marginBottom:14,padding:"10px 14px"})}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:"50%",background:aktivK.farg}}/><span style={{fontWeight:700,color:aktivK.farg}}>{aktivK.namn}</span><span style={{fontSize:11,color:C.muted}}>Aktiv kontext</span></div>
      </div>}
      {editing&&(
        <div style={{...card({marginBottom:14,borderColor:C.blue+"44"})}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:12,color:C.blue}}>{editing==="new"?"Ny kontext":"Redigera"}</div>
          <div style={{display:"grid",gridTemplateColumns:M?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={lbl}>Namn *</label><input value={draft.namn} onChange={e=>setDraft(p=>({...p,namn:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
            <div><label style={lbl}>Metric-label</label><input value={draft.metricLabel} onChange={e=>setDraft(p=>({...p,metricLabel:e.target.value}))} placeholder="T.ex. Pantade burkar" style={{...I(),minHeight:M?46:42}}/></div>
            <div><label style={lbl}>Avsändarnamn</label><input value={draft.senderName} onChange={e=>setDraft(p=>({...p,senderName:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
            <div><label style={lbl}>Avsändar-e-post</label><input type="email" value={draft.senderEmail} onChange={e=>setDraft(p=>({...p,senderEmail:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
          </div>
          <div style={{marginBottom:10}}><label style={lbl}>Beskrivning</label><input value={draft.beskrivning} onChange={e=>setDraft(p=>({...p,beskrivning:e.target.value}))} style={{...I(),minHeight:M?46:42}}/></div>
          <div style={{marginBottom:12}}><label style={lbl}>Färg</label><div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
            {COLORS.map(col=><button key={col} onClick={()=>setDraft(p=>({...p,farg:col}))} style={{width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${draft.farg===col?"#fff":"transparent"}`,cursor:"pointer",outline:draft.farg===col?`2px solid ${col}`:"none",outlineOffset:2}}/>)}
            <input type="color" value={draft.farg} onChange={e=>setDraft(p=>({...p,farg:e.target.value}))} style={{width:28,height:28,borderRadius:"50%",border:"none",cursor:"pointer",padding:0}}/>
          </div></div>
          <div style={{display:"flex",gap:8}}><button onClick={save} disabled={!draft.namn} style={{...btn("primary",M),flex:2,justifyContent:"center",minHeight:M?48:42}}>💾 Spara</button><button onClick={()=>setEditing(null)} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:M?48:42}}>Avbryt</button></div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {kontexter.map(k=>{const isAkt=k.id===aktivKontextId;const cnt=taggedCount(k.id);return(
          <div key={k.id} style={{...card({borderColor:k.farg+(isAkt?"88":"33"),padding:"14px 16px"})}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12,justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1,minWidth:0}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:k.farg,flexShrink:0,marginTop:3}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}><span style={{fontWeight:700,fontSize:14}}>{k.namn}</span>{isAkt&&<Chip color={k.farg} sm>Aktiv</Chip>}<Chip color={C.muted} sm>{cnt} föreningar</Chip></div>
                  {k.beskrivning&&<div style={{fontSize:12,color:C.muted}}>{k.beskrivning}</div>}
                  <div style={{display:"flex",gap:10,fontSize:11,color:C.muted,flexWrap:"wrap",marginTop:3}}>{k.metricLabel&&<span>📊 {k.metricLabel}</span>}{k.senderName&&<span>✉️ {k.senderName}</span>}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                {!isAkt&&<button onClick={()=>saveAktivKontext&&saveAktivKontext(k.id)} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,minHeight:32,color:k.farg,borderColor:k.farg+"44"}}>Aktivera</button>}
                <button onClick={()=>{setDraft({...k});setEditing(k.id);}} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,minHeight:32}}>✎</button>
                {kontexter.length>1&&<button onClick={()=>del(k.id)} style={{...btn("ghost"),padding:"5px 10px",fontSize:11,minHeight:32,color:C.red,borderColor:"rgba(239,68,68,0.3)"}}>✕</button>}
              </div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ── BrevoStatus ───────────────────────────────────────────────────────────────
function BrevoStatus({cfg,brevoGet}){
  const [status,setStatus]=useState(null);
  const check=async()=>{
    if(!cfg.apiKey){setStatus({ok:false,msg:"Ingen API-nyckel angiven"});return;}
    setStatus("checking");
    const doGet=brevoGet||(async p=>fetch("https://api.brevo.com"+p,{headers:{"accept":"application/json","api-key":cfg.apiKey}}));
    try{
      const r=await doGet("/v3/account");
      if(!r.ok){const e=await r.json().catch(()=>({}));setStatus({ok:false,msg:e.message||"HTTP "+r.status});return;}
      const acct=await r.json();
      const r2=await doGet("/v3/senders");
      const senders=(r2.ok?(await r2.json()).senders||[]:[]).filter(s=>s.active);
      setStatus({ok:true,name:acct.firstName+" "+acct.lastName,plan:acct.plan?.[0]?.type,senders});
    }catch(e){setStatus({ok:false,msg:e.message});}
  };
  const match=status?.ok&&cfg.senderEmail&&status.senders?.some(s=>s.email===cfg.senderEmail);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <div style={{...card({borderColor:(cfg.apiKey?C.green:C.red)+"44",padding:"8px 12px",flex:1,minWidth:120})}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:2}}>🔑 API-nyckel</div>
          <div style={{fontSize:12,fontWeight:600,color:cfg.apiKey?C.green:C.red}}>{cfg.apiKey?"Inlagd ✓":"Saknas ✗"}</div>
          {cfg.apiKey&&<div style={{fontSize:10,color:C.muted,fontFamily:"monospace",marginTop:2}}>{cfg.apiKey.slice(0,14)}…</div>}
        </div>
        <div style={{...card({borderColor:(cfg.senderEmail?C.green:C.red)+"44",padding:"8px 12px",flex:1,minWidth:120})}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:2}}>✉️ Avsändare</div>
          <div style={{fontSize:12,fontWeight:600,color:cfg.senderEmail?C.green:C.red,wordBreak:"break-all"}}>{cfg.senderEmail||"Saknas ✗"}</div>
          {cfg.senderName&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{cfg.senderName}</div>}
        </div>
        {status?.ok&&<div style={{...card({borderColor:C.blue+"44",padding:"8px 12px",flex:1,minWidth:120})}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:2}}>👤 Konto</div>
          <div style={{fontSize:12,fontWeight:600,color:C.blue}}>{status.name}</div>
          {status.plan&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{status.plan}</div>}
        </div>}
      </div>
      <button onClick={check} disabled={status==="checking"||!cfg.apiKey} style={{...btn(status?.ok?"ghost":"primary"),justifyContent:"center",minHeight:40,opacity:!cfg.apiKey?0.5:1,borderColor:status?.ok?C.green+"55":"",color:status?.ok?C.green:""}}>
        {status==="checking"?"⏳ Kontrollerar…":status?.ok?"✓ Verifierad – kontrollera igen":"🔍 Verifiera anslutning"}
      </button>
      {status&&status!=="checking"&&(
        <div style={{...card({borderColor:(status.ok?C.green:C.red)+"44",padding:"12px 14px",background:status.ok?"rgba(34,197,94,0.05)":"rgba(239,68,68,0.05)"})}}>
          {status.ok?(
            <div>
              <div style={{fontWeight:600,fontSize:13,color:C.green,marginBottom:8}}>✓ Anslutning OK</div>
              {status.senders?.length>0&&<div>
                <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Verifierade avsändare</div>
                {status.senders.map(s=>{const isA=s.email===cfg.senderEmail;return(
                  <div key={s.id||s.email} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:7,background:isA?"rgba(34,197,94,0.08)":"transparent",marginBottom:3,border:isA?`1px solid ${C.green}44`:"1px solid transparent"}}>
                    <span style={{color:C.green}}>✓</span>
                    <div style={{flex:1}}><div style={{fontSize:12,fontWeight:isA?600:400}}>{s.email}</div>{s.name&&<div style={{fontSize:10,color:C.muted}}>{s.name}</div>}</div>
                    {isA&&<span style={{fontSize:10,fontWeight:700,color:C.green,background:"rgba(34,197,94,0.15)",padding:"2px 7px",borderRadius:8}}>Aktiv ✓</span>}
                  </div>
                );})}
                {cfg.senderEmail&&!match&&<div style={{marginTop:6,fontSize:11,color:C.amber,padding:"6px 8px",background:"rgba(245,158,11,0.07)",borderRadius:7}}>⚠️ {cfg.senderEmail} ej bland verifierade avsändare</div>}
              </div>}
            </div>
          ):(
            <div style={{color:C.red,fontSize:12}}>✗ {status.msg}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── WorkerCopyButton – Cloudflare Worker script copy ─────────────────────────
const WORKER_SCRIPT=`export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) return new Response("Missing ?url=", { status: 400 });
    const resp = await fetch(target, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" ? request.body : undefined,
    });
    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: {
        "content-type": resp.headers.get("content-type") || "application/json",
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      },
    });
  },
};`;

function WorkerCopyButton(){
  const [copied,setCopied]=useState(false);
  const copy=()=>{
    if(navigator.clipboard)navigator.clipboard.writeText(WORKER_SCRIPT).catch(()=>{});
    setCopied(true);setTimeout(()=>setCopied(false),2500);
  };
  return(
    <div>
      <div style={{fontFamily:"monospace",fontSize:9,color:"#58a6ff",lineHeight:1.6,whiteSpace:"pre",overflow:"auto",maxHeight:120}}>{WORKER_SCRIPT}</div>
      <button onClick={copy} style={{marginTop:8,...btn(copied?"ghost":"primary"),padding:"4px 14px",fontSize:11,minHeight:28,background:copied?"rgba(34,197,94,0.15)":C.blue,border:copied?`1px solid ${C.green}`:"none",color:copied?C.green:"#fff"}}>
        {copied?"✓ Kopierat!":"📋 Kopiera Worker-koden"}
      </button>
    </div>
  );
}

// ── MailLogEditor ─────────────────────────────────────────────────────────────
function MailLogEditor({f,fr,saveFr}){
  const [editIdx,setEditIdx]=useState(null);
  const [editDraft,setEditDraft]=useState(null);
  const [adding,setAdding]=useState(false);
  const blankEntry={date:new Date().toLocaleDateString("sv-SE")+" "+new Date().toLocaleTimeString("sv-SE",{hour:"2-digit",minute:"2-digit"}),subject:"",toEmail:f.epost||f.epostOrdf||"",status:"sent"};
  const [newEntry,setNewEntry]=useState(blankEntry);

  const log=[...(f.mailLog||[])].reverse();
  const realIdx=i=>((f.mailLog||[]).length-1)-i;

  const save=(idx,entry)=>{
    const newLog=(f.mailLog||[]).map((m,i)=>i===idx?entry:m);
    // Recalculate skickadeMail from sent entries
    const sentCount=newLog.filter(m=>m.status==="sent").length;
    saveFr(fr.map(x=>x.id===f.id?{...x,mailLog:newLog,skickadeMail:sentCount}:x));
    setEditIdx(null);setEditDraft(null);
  };

  const del=(idx)=>{
    if(!confirm("Ta bort detta utskick ur loggen?"))return;
    const newLog=(f.mailLog||[]).filter((_,i)=>i!==idx);
    const sentCount=newLog.filter(m=>m.status==="sent").length;
    saveFr(fr.map(x=>x.id===f.id?{...x,mailLog:newLog,skickadeMail:sentCount}:x));
  };

  const addEntry=()=>{
    if(!newEntry.subject||!newEntry.date)return;
    const newLog=[...(f.mailLog||[]),{...newEntry,id:"manual_"+Date.now()}];
    const sentCount=newLog.filter(m=>m.status==="sent").length;
    saveFr(fr.map(x=>x.id===f.id?{...x,mailLog:newLog,skickadeMail:sentCount}:x));
    setAdding(false);setNewEntry(blankEntry);
  };

  const statusColor=s=>s==="sent"?C.green:s==="failed"?C.red:C.amber;
  const statusLabel=s=>s==="sent"?"✓ Skickat":s==="failed"?"✗ Misslyckades":"⏳ Pågår";

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:11,color:C.muted}}>{(f.mailLog||[]).length} utskick · <span style={{color:C.blue,fontWeight:600}}>{(f.mailLog||[]).filter(m=>m.status==="sent").length} skickade</span></div>
        <button onClick={()=>{setAdding(v=>!v);setEditIdx(null);}} style={{...btn("ghost"),padding:"4px 10px",fontSize:11,minHeight:28,color:adding?C.red:C.blue,borderColor:adding?C.red+"44":C.blue+"44"}}>
          {adding?"✕ Avbryt":"+ Lägg till"}
        </button>
      </div>

      {/* Add entry form */}
      {adding&&(
        <div style={{...card({marginBottom:12,borderColor:C.blue+"44",background:"rgba(59,130,246,0.04)"})}}>
          <div style={{fontWeight:600,fontSize:12,marginBottom:10,color:C.blue}}>Nytt utskick</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={lbl}>Ämne</label>
              <input value={newEntry.subject} onChange={e=>setNewEntry(p=>({...p,subject:e.target.value}))} placeholder="Ämnesrad…" style={{...I(),minHeight:40}}/>
            </div>
            <div>
              <label style={lbl}>Datum (YYYY-MM-DD HH:MM)</label>
              <input value={newEntry.date} onChange={e=>setNewEntry(p=>({...p,date:e.target.value}))} style={{...I(),minHeight:40}}/>
            </div>
            <div>
              <label style={lbl}>E-post</label>
              <input value={newEntry.toEmail} onChange={e=>setNewEntry(p=>({...p,toEmail:e.target.value}))} style={{...I(),minHeight:40}}/>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select value={newEntry.status} onChange={e=>setNewEntry(p=>({...p,status:e.target.value}))} style={{...I(),minHeight:40}}>
                <option value="sent">✓ Skickat</option>
                <option value="failed">✗ Misslyckades</option>
              </select>
            </div>
          </div>
          <button onClick={addEntry} disabled={!newEntry.subject} style={{...btn("primary"),width:"100%",justifyContent:"center",minHeight:38}}>Spara utskick</button>
        </div>
      )}

      {/* Log list */}
      {log.length===0&&!adding&&(
        <div style={{textAlign:"center",padding:"32px 0",color:C.muted,fontSize:13}}>Inga utskick ännu</div>
      )}

      {log.map((m,i)=>{
        const origIdx=realIdx(i);
        const isEditing=editIdx===origIdx;
        return(
          <div key={m.id||i} style={{borderBottom:`1px solid ${C.border}`,padding:"10px 0"}}>
            {isEditing&&editDraft?(
              <div style={{background:C.bg4,borderRadius:8,padding:"10px 12px",marginBottom:2}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{gridColumn:"1/-1"}}>
                    <label style={lbl}>Ämne</label>
                    <input value={editDraft.subject||""} onChange={e=>setEditDraft(p=>({...p,subject:e.target.value}))} style={{...I(),minHeight:38}}/>
                  </div>
                  <div>
                    <label style={lbl}>Datum</label>
                    <input value={editDraft.date||""} onChange={e=>setEditDraft(p=>({...p,date:e.target.value}))} style={{...I(),minHeight:38}}/>
                  </div>
                  <div>
                    <label style={lbl}>E-post</label>
                    <input value={editDraft.toEmail||""} onChange={e=>setEditDraft(p=>({...p,toEmail:e.target.value}))} style={{...I(),minHeight:38}}/>
                  </div>
                  <div>
                    <label style={lbl}>Status</label>
                    <select value={editDraft.status||"sent"} onChange={e=>setEditDraft(p=>({...p,status:e.target.value}))} style={{...I(),minHeight:38}}>
                      <option value="sent">✓ Skickat</option>
                      <option value="failed">✗ Misslyckades</option>
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>save(origIdx,editDraft)} style={{...btn("primary"),flex:2,justifyContent:"center",minHeight:34,fontSize:12}}>💾 Spara</button>
                  <button onClick={()=>{setEditIdx(null);setEditDraft(null);}} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:34,fontSize:12}}>Avbryt</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260}}>{m.subject||"Utskick"}</span>
                    <span style={{fontSize:10,fontWeight:700,color:statusColor(m.status),background:statusColor(m.status)+"15",padding:"1px 7px",borderRadius:8,flexShrink:0}}>{statusLabel(m.status)}</span>
                  </div>
                  <div style={{fontSize:11,color:C.muted}}>{m.date}{m.toEmail?" · "+m.toEmail:""}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>{setEditIdx(origIdx);setEditDraft({...m});setAdding(false);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,cursor:"pointer",fontSize:11,padding:"2px 8px",fontFamily:"inherit"}}>✎</button>
                  <button onClick={()=>del(origIdx)} style={{background:"none",border:`1px solid rgba(239,68,68,0.3)`,borderRadius:6,color:C.red,cursor:"pointer",fontSize:11,padding:"2px 8px",fontFamily:"inherit"}}>✕</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── BulkMailEditor ─────────────────────────────────────────────────────────────
function BulkMailEditor({selectedIds,fr,saveFr,onDone}){
  const selected=fr.filter(f=>selectedIds.includes(f.id));
  const [action,setAction]=useState("add"); // add | set | reset
  const [entry,setEntry]=useState({
    date:new Date().toLocaleDateString("sv-SE")+" "+new Date().toLocaleTimeString("sv-SE",{hour:"2-digit",minute:"2-digit"}),
    subject:"",
    status:"sent",
  });
  const [setTo,setSetTo]=useState("1");
  const [saving,setSaving]=useState(false);

  const apply=()=>{
    setSaving(true);
    let updated=fr.map(f=>{
      if(!selectedIds.includes(f.id))return f;
      if(action==="reset"){
        return{...f,mailLog:[],skickadeMail:0};
      }
      if(action==="set"){
        const n=parseInt(setTo)||0;
        return{...f,skickadeMail:n};
      }
      if(action==="add"){
        if(!entry.subject)return f;
        const newLog=[...(f.mailLog||[]),{
          id:"bulk_"+Date.now()+"_"+f.id,
          campaignId:99990000,
          date:entry.date,
          subject:entry.subject.replace("{{namn}}",f.namn),
          toEmail:f.epost||f.epostOrdf||"",
          status:entry.status,
        }];
        const sentCount=newLog.filter(m=>m.status==="sent").length;
        return{...f,mailLog:newLog,skickadeMail:sentCount};
      }
      return f;
    });
    saveFr(updated);
    setSaving(false);
    onDone();
  };

  return(
    <div style={{...card({marginBottom:12,borderColor:C.amber+"44",background:"rgba(245,158,11,0.04)"})}}>
      <div style={{fontWeight:600,fontSize:13,marginBottom:12,color:C.amber}}>✎ Massredigera {selected.length} föreningar</div>

      {/* Selected preview */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
        {selected.slice(0,8).map(f=>(
          <span key={f.id} style={{fontSize:10,background:C.bg4,border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 8px",color:C.muted}}>{f.namn}</span>
        ))}
        {selected.length>8&&<span style={{fontSize:10,color:C.muted,padding:"2px 4px"}}>+{selected.length-8} till</span>}
      </div>

      {/* Action selector */}
      <label style={lbl}>Åtgärd</label>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {[["add","+ Lägg till utskick",C.blue],["set","≡ Sätt antal skickade",C.teal],["reset","⊘ Nollställ utskick",C.red]].map(([v,l,co])=>(
          <button key={v} onClick={()=>setAction(v)} style={{background:action===v?co+"22":"transparent",border:`1px solid ${action===v?co:C.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:action===v?700:400,color:action===v?co:C.muted}}>
            {l}
          </button>
        ))}
      </div>

      {/* Action-specific fields */}
      {action==="add"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <div style={{gridColumn:"1/-1"}}>
            <label style={lbl}>Ämne (använd {"{{namn}}"} för föreningsnamn)</label>
            <input value={entry.subject} onChange={e=>setEntry(p=>({...p,subject:e.target.value}))} placeholder="{{namn}} – vet ni hur mycket pant ni missar?" style={{...I(),minHeight:42}}/>
          </div>
          <div>
            <label style={lbl}>Datum</label>
            <input value={entry.date} onChange={e=>setEntry(p=>({...p,date:e.target.value}))} style={{...I(),minHeight:42}}/>
          </div>
          <div>
            <label style={lbl}>Status</label>
            <select value={entry.status} onChange={e=>setEntry(p=>({...p,status:e.target.value}))} style={{...I(),minHeight:42}}>
              <option value="sent">✓ Skickat</option>
              <option value="failed">✗ Misslyckades</option>
            </select>
          </div>
          <div style={{gridColumn:"1/-1",fontSize:11,color:C.muted,padding:"6px 10px",background:C.bg4,borderRadius:7}}>
            Mailet läggs till i loggen för varje vald förening. skickadeMail räknas om automatiskt.
          </div>
        </div>
      )}

      {action==="set"&&(
        <div style={{marginBottom:12}}>
          <label style={lbl}>Antal mail skickade (0–3)</label>
          <div style={{display:"flex",gap:6}}>
            {["0","1","2","3"].map(n=>(
              <button key={n} onClick={()=>setSetTo(n)} style={{background:setTo===n?C.teal+"22":"transparent",border:`1px solid ${setTo===n?C.teal:C.border}`,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:setTo===n?700:400,color:setTo===n?C.teal:C.muted}}>
                {n}
              </button>
            ))}
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:6}}>Påverkar bara räknaren – mailloggen ändras inte.</div>
        </div>
      )}

      {action==="reset"&&(
        <div style={{marginBottom:12,padding:"10px 14px",background:"rgba(239,68,68,0.07)",border:`1px solid ${C.red}44`,borderRadius:8}}>
          <div style={{fontSize:12,color:C.red,fontWeight:600,marginBottom:4}}>⚠️ Varning</div>
          <div style={{fontSize:12,color:C.muted}}>Raderar hela mailloggen och sätter skickadeMail till 0 för alla {selected.length} valda föreningar. Kan inte ångras.</div>
        </div>
      )}

      {/* Apply */}
      <div style={{display:"flex",gap:8}}>
        <button
          onClick={apply}
          disabled={saving||(action==="add"&&!entry.subject)}
          style={{...btn(action==="reset"?"danger":"primary"),flex:2,justifyContent:"center",minHeight:44,opacity:action==="add"&&!entry.subject?0.4:1}}
        >
          {saving?"Sparar…":action==="reset"?"⊘ Nollställ "+selected.length+" föreningar":action==="set"?"≡ Sätt skickadeMail="+setTo:"+ Lägg till i "+selected.length+" loggar"}
        </button>
        <button onClick={onDone} style={{...btn("ghost"),flex:1,justifyContent:"center",minHeight:44}}>Avbryt</button>
      </div>
    </div>
  );
}

// ── DatabasPanel ──────────────────────────────────────────────────────────────
function DatabasPanel(){
  const SB_URL=window._supabaseUrl||"";
  const SB_KEY=window._supabaseKey||"";
  const KEYS=["bd5_fr","bd5_contacts","bd5_camp","bd5_cfg","bd5_kontexter","bd5_aktiv","bd5_pipe","bd5_templates"];
  const KEY_LABELS={"bd5_fr":"Föreningar","bd5_contacts":"Kontakter","bd5_camp":"Kampanjer","bd5_cfg":"Inställningar","bd5_kontexter":"Kontexter","bd5_aktiv":"Aktiv kontext","bd5_pipe":"Pipeline","bd5_templates":"Mallar"};
  const [status,setStatus]=useState(null);   // null | "running" | {done,failed,keys}
  const [dbStatus,setDbStatus]=useState(null); // null | "checking" | {connected, rows}
  const [flash,setFlash]=useState("");

  const checkDb=async()=>{
    if(!SB_URL){setDbStatus({connected:false,msg:"Ingen Supabase-URL konfigurerad"});return;}
    setDbStatus("checking");
    try{
      const r=await fetch(SB_URL+"/rest/v1/storage?select=key&limit=100",{
        headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY}
      });
      if(!r.ok){setDbStatus({connected:false,msg:"HTTP "+r.status+" – tabellen kanske inte finns ännu"});return;}
      const rows=await r.json();
      const appKeys=rows.filter(r=>KEYS.includes(r.key)).map(r=>r.key);
      setDbStatus({connected:true,rows:rows.length,appKeys});
    }catch(e){
      setDbStatus({connected:false,msg:e.message});
    }
  };

  const migrate=async()=>{
    setStatus("running");
    const done=[];const failed=[];
    for(const key of KEYS){
      const ls=localStorage.getItem(key);
      if(!ls){continue;}
      try{
        const r=await fetch(SB_URL+"/rest/v1/storage",{
          method:"POST",
          headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},
          body:JSON.stringify({key,value:ls,updated_at:new Date().toISOString()})
        });
        if(r.ok)done.push(key);
        else failed.push(key);
      }catch{failed.push(key);}
    }
    setStatus({done,failed});
    if(done.length>0){setFlash("✓ "+done.length+" nycklar migrerade");setTimeout(()=>setFlash(""),3000);}
    checkDb();
  };

  const clearDb=async()=>{
    if(!confirm("Rensa ALL data från Supabase? localStorage påverkas inte."))return;
    for(const key of KEYS){
      await fetch(SB_URL+"/rest/v1/storage?key=eq."+encodeURIComponent(key),{
        method:"DELETE",
        headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY}
      }).catch(()=>{});
    }
    setFlash("✓ Databasen rensad");setTimeout(()=>setFlash(""),2000);
    checkDb();
  };

  return(
    <div style={{maxWidth:600,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>☁️ Supabase-databas</div>

      {/* Connection status */}
      <div style={card()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontWeight:600,fontSize:13}}>Anslutningsstatus</div>
          <button onClick={checkDb} disabled={dbStatus==="checking"} style={{...btn("ghost"),fontSize:11,minHeight:30,padding:"0 12px"}}>
            {dbStatus==="checking"?"⏳ Kontrollerar…":"🔍 Kontrollera"}
          </button>
        </div>
        {!dbStatus&&<div style={{fontSize:12,color:C.muted}}>Klicka Kontrollera för att se databasstatus</div>}
        {dbStatus==="checking"&&<div style={{fontSize:12,color:C.muted}}>Ansluter till Supabase…</div>}
        {dbStatus&&dbStatus!=="checking"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:dbStatus.connected?10:0}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:dbStatus.connected?C.green:C.red,flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:600,color:dbStatus.connected?C.green:C.red}}>
                {dbStatus.connected?"Ansluten ✓":"Ej ansluten"}
              </span>
            </div>
            {dbStatus.connected&&(
              <div>
                <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{dbStatus.rows} rader i databasen</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {KEYS.map(k=>{
                    const inDb=dbStatus.appKeys?.includes(k);
                    const inLs=!!localStorage.getItem(k);
                    return(
                      <div key={k} style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:inDb?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.08)",border:`1px solid ${inDb?C.green+"44":C.red+"33"}`,color:inDb?C.green:C.muted}}>
                        {inDb?"☁️":"💾"} {KEY_LABELS[k]}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!dbStatus.connected&&(
              <div style={{fontSize:12,color:C.red,marginTop:4}}>{dbStatus.msg}</div>
            )}
          </div>
        )}
      </div>

      {/* Migration */}
      <div style={{...card({borderColor:C.blue+"44",background:"rgba(59,130,246,0.03)"})}}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:6}}>📤 Migrera från localStorage → Supabase</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:12,lineHeight:1.6}}>
          Kopierar all sparad data från din webbläsares localStorage till Supabase. Gör detta en gång för att komma igång — sedan synkas allt automatiskt.
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
          {KEYS.map(k=>{
            const has=!!localStorage.getItem(k);
            return <span key={k} style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:has?"rgba(59,130,246,0.1)":"rgba(100,116,139,0.1)",color:has?C.blue:C.muted}}>{has?"✓":"–"} {KEY_LABELS[k]}</span>;
          })}
        </div>
        <button onClick={migrate} disabled={status==="running"||!SB_URL} style={{...btn("primary"),width:"100%",justifyContent:"center",minHeight:44}}>
          {status==="running"?"⏳ Migrerar…":"📤 Kopiera localStorage → Supabase"}
        </button>
        {status&&status!=="running"&&(
          <div style={{marginTop:10}}>
            {status.done.length>0&&<div style={{fontSize:12,color:C.green,marginBottom:4}}>✓ {status.done.map(k=>KEY_LABELS[k]).join(", ")}</div>}
            {status.failed.length>0&&<div style={{fontSize:12,color:C.red}}>✗ Misslyckades: {status.failed.map(k=>KEY_LABELS[k]).join(", ")}</div>}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div style={{...card({borderColor:C.red+"33",background:"rgba(239,68,68,0.02)"})}}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:6,color:C.red}}>⚠️ Rensa databas</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:10}}>Raderar all appdata från Supabase. localStorage påverkas inte — data finns kvar lokalt.</div>
        <button onClick={clearDb} style={{...btn("ghost"),borderColor:C.red+"44",color:C.red,fontSize:12,minHeight:36}}>🗑 Rensa Supabase-data</button>
      </div>

      {flash&&<div style={{fontSize:13,color:C.green,fontWeight:500,textAlign:"center"}}>{flash}</div>}
    </div>
  );
}

// ── HistoryList – expandable campaign history ─────────────────────────────────
function HistoryList({camp,M}){
  const [open,setOpen]=useState({});
  if(!camp.length)return <div style={{...card({textAlign:"center",padding:40,color:C.muted})}}>Inga kampanjer</div>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[...camp].reverse().map((c2,i)=>{
        const isOpen=open[c2.id||i];
        const mottagare=c2.mottagare||[];
        const sent=mottagare.filter(m=>m.ok);
        const failed=mottagare.filter(m=>!m.ok);
        return(
          <div key={c2.id||i} style={{...card({padding:0,overflow:"hidden"})}}>
            {/* Header row */}
            <div
              onClick={()=>mottagare.length>0&&setOpen(p=>({...p,[c2.id||i]:!p[c2.id||i]}))}
              style={{padding:"12px 14px",cursor:mottagare.length>0?"pointer":"default",display:"flex",alignItems:"flex-start",gap:10}}
            >
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c2.subject||"Utskick"}</div>
                <div style={{display:"flex",gap:10,fontSize:12,color:C.muted,flexWrap:"wrap",alignItems:"center"}}>
                  <span>{c2.date}</span>
                  <span>{c2.recipients||mottagare.length} mottagare</span>
                  <span style={{color:C.green,fontWeight:600}}>{c2.sent}✓</span>
                  {c2.failed>0&&<span style={{color:C.red,fontWeight:600}}>{c2.failed}✗</span>}
                </div>
              </div>
              {mottagare.length>0&&(
                <span style={{color:C.muted,fontSize:12,flexShrink:0,marginTop:2}}>{isOpen?"▲":"▼"}</span>
              )}
            </div>

            {/* Expanded mottagarlista */}
            {isOpen&&mottagare.length>0&&(
              <div style={{borderTop:`1px solid ${C.border}`,background:C.bg4}}>
                {/* Summary chips */}
                <div style={{padding:"8px 14px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,color:C.green,background:"rgba(34,197,94,0.1)",padding:"2px 8px",borderRadius:8,fontWeight:600}}>✓ {sent.length} skickade</span>
                  {failed.length>0&&<span style={{fontSize:11,color:C.red,background:"rgba(239,68,68,0.08)",padding:"2px 8px",borderRadius:8,fontWeight:600}}>✗ {failed.length} misslyckades</span>}
                </div>

                {/* Recipient rows */}
                <div style={{maxHeight:M?300:400,overflowY:"auto"}}>
                  {/* Sent */}
                  {sent.length>0&&(
                    <div>
                      {sent.map((m,j)=>(
                        <div key={m.id||j} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                          <span style={{color:C.green,width:14,flexShrink:0}}>✓</span>
                          <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.namn}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Failed */}
                  {failed.length>0&&(
                    <div>
                      {failed.map((m,j)=>(
                        <div key={m.id||j} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderBottom:`1px solid ${C.border}`,fontSize:12,background:"rgba(239,68,68,0.04)"}}>
                          <span style={{color:C.red,width:14,flexShrink:0}}>✗</span>
                          <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.muted}}>{m.namn}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No detail available */}
            {!mottagare.length&&(
              <div style={{padding:"4px 14px 10px",fontSize:11,color:C.muted}}>Detaljinfo ej tillgänglig för äldre utskick</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
