import{d as h,b as s,D as k,w as a,g as m,c as d,G as v,F as y,e,t as p,f as C,j as N,C as g}from"./entry.DME2G-rb.js";import Y from"./ContentList.BTkgGC9x.js";import{_ as b}from"./Card.D6VxqV1M.js";import"./ContentQuery.zq_sGe60.js";import"./asyncData.D3POMdNR.js";import"./query.Bf2ZAAiC.js";import"./preview.c_ZNuifT.js";const w=e("h1",{class:"text-4xl font-bold mb-8 text-center"},"存档",-1),z=e("p",null,"No posts found.",-1),B={key:0,class:"my-4"},D={class:"text-xl font-bold"},T=h({__name:"archives",setup(V){const i={path:"",where:[{listed:{$ne:!1}}],sort:[{date:-1}]};function r(n){return new Date(n).getFullYear()}function f(n,l,o){const c=r(l),_=o>0?r(n[o-1].date):null;return c!==_}return(n,l)=>{const o=g,c=Y,_=b;return s(),k(_,{class:""},{default:a(()=>[w,m(c,{query:i},{"not-found":a(()=>[z]),default:a(({list:u})=>[(s(!0),d(y,null,v(u,(t,x)=>(s(),d("div",{key:t._path},[f(u,t.date,x)?(s(),d("div",B,[e("span",D,p(r(t.date)),1)])):C("",!0),m(o,{to:t._path,class:"text-zinc-700 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"},{default:a(()=>[e("span",null,p(t.date),1),N(" · "),e("span",null,p(t.title),1)]),_:2},1032,["to"])]))),128))]),_:1})]),_:1})}}});export{T as default};
//# sourceMappingURL=archives.B1xRiVVI.js.map