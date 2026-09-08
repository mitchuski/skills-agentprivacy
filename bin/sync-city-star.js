// Sync only the explicitly circulating City/Star cohort. No network or farm writes.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),source=path.resolve(root,'../agentprivacy-skills');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cfg=read(path.join(root,'skillsync.config.json'));
const pii=read(path.join(root,'pii.local.json')).replacements.map(([re,flags,to])=>[new RegExp(re,flags),to]);
const leaks=cfg.leak_patterns.map(p=>new RegExp(p));
const neutral=text=>{let s=text;for(const [re,to] of pii)s=s.replace(re,to);return s;};
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const manifest=read(path.join(source,'CITY_STAR_DISTRIBUTION.json'));
const catalog=read(path.join(root,'registry/catalog-full.json'));
const packets=new Map(catalog.packets.map(p=>[p.name,p]));
const pending=[];
// Repair the known corrupted public body from its existing source, too.
const records = [...manifest.records, {slug:'compression-defence',title:'Compression Defence',kind:'pattern',category:'privacy-layer',source:'privacy-layer/agentprivacy-compression-defence/SKILL.md',classification:'circulating'}];
for(const record of records){
 if(record.classification!=='circulating')continue;
 const file=path.resolve(source,record.source);
 if(!file.startsWith(source+path.sep))throw Error('Source must remain within the skills repository.');
 const raw=fs.readFileSync(file,'utf8');
 if(leaks.some(re=>re.test(raw)))throw Error('Publication scan refused '+record.slug);
 const fm=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
 if(!fm)throw Error('Missing skill frontmatter: '+record.slug);
 const field=k=>{const m=fm[1].match(new RegExp('^'+k+':\\s*(.+)$','m'));return m?m[1].replace(/^["']|["']$/g,'').trim():'';};
 const name=field('name');
 let description=field('description');
 if (/^[>|][-+]?$/.test(description)) { const m=fm[1].match(/^description:\s*[>|][-+]?\r?\n([\s\S]*?)(?=^\S|$(?![\s\S]))/m); description=m?m[1].split(/\r?\n/).map(s=>s.trim()).filter(Boolean).join(' '):''; }
 if(!/^[a-z0-9-]+$/.test(name)||!description||['>','|'].includes(description))throw Error('Review frontmatter: '+record.slug);
 const body=neutral(raw),old=packets.get(name);
 const packet={...old,spec:'skill-packet/0.1',name,kind:record.kind==='role'?'skill':record.kind,title:record.title,emoji:old?.emoji||'',card:neutral(description).slice(0,280),brief:neutral(description+'\n\n'+(record.practice||raw.slice(fm[0].length).replace(/^#[^\n]*\n/gm,'').trim())).slice(0,1200),body_ref:'assets/'+name+'/SKILL.md',origin:{...old?.origin,author:cfg.member,universe:'agentprivacy',category:record.category||record.kind,source_path:'https://github.com/mitchuski/agentprivacy-skills/blob/main/'+record.source},hash:hash(body),published:new Date(fs.statSync(file).mtime).toISOString(),listing:old?.listing||'featured',requires:old?.requires||[],trust:old?.trust||{adoptions:0,attested_runs:0}};
 packets.set(name,packet);pending.push({name,body,packet});
}
// Validate every input before writing any output. Retain unrelated catalogue entries.
for(const {name,body,packet} of pending){
 for(const base of ['registry/assets','site/assets']){const dir=path.join(root,base,name);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'SKILL.md'),body);}
 fs.writeFileSync(path.join(root,'registry/packets',name+'.json'),JSON.stringify(packet,null,2));
}
catalog.packets=[...packets.values()].sort((a,b)=>a.name.localeCompare(b.name));catalog.count=catalog.packets.length;catalog.updated=new Date().toISOString();
for(const file of ['registry/catalog-full.json','site/data/catalog.json','site/assets/skillsync/catalog-full.json'])fs.writeFileSync(path.join(root,file),JSON.stringify(catalog,null,2));
const cards={...catalog,packets:catalog.packets.map(({brief,...p})=>p)};
for(const file of ['registry/catalog.json','site/assets/skillsync/catalog.json'])fs.writeFileSync(path.join(root,file),JSON.stringify(cards,null,2));
const deck={spec:'skill-loadout/0.1',name:'city-star-arrival',emoji:'âœ§',purpose:'Enter through the model, choose a Star reading, follow a scoped City task and return a reviewable receipt.',packets:pending.filter(p=>p.packet.origin.category==='role').map(p=>p.name)};
fs.writeFileSync(path.join(root,'loadouts/city-star-arrival.json'),JSON.stringify(deck,null,2));
const decks=read(path.join(root,'site/data/decks.json')).filter(d=>d.name!==deck.name);decks.unshift(deck);fs.writeFileSync(path.join(root,'site/data/decks.json'),JSON.stringify(decks,null,2));
console.log('Synced '+pending.length+' circulating packets; no adoption or service actions.');
