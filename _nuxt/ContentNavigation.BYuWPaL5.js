function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./client-db.lhKPYfRr.js","./entry.DME2G-rb.js","./entry.3Bo2ylQ3.css","./query.Bf2ZAAiC.js","./preview.c_ZNuifT.js","./index.BsYmvPZw.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{u as f}from"./asyncData.D3POMdNR.js";import{m as v,$ as c,_ as d,d as g,ad as l,I as h,q as _,aa as C,ac as r,C as y}from"./entry.DME2G-rb.js";import{q as w,w as m,e as $,s as P,j as N,u as j}from"./query.Bf2ZAAiC.js";import{u as T}from"./preview.c_ZNuifT.js";const D=async e=>{const{content:t}=v().public;typeof(e==null?void 0:e.params)!="function"&&(e=w(e));const a=e.params(),s=t.experimental.stripQueryParameters?m(`/navigation/${`${c(a)}.${t.integrity}`}/${$(a)}.json`):m(`/navigation/${c(a)}.${t.integrity}.json`);if(P())return(await d(()=>import("./client-db.lhKPYfRr.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url).then(o=>o.generateNavigation))(a);const n=await $fetch(s,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:N(a),previewToken:T().getPreviewToken()}});if(typeof n=="string"&&n.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return n},E=g({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=l(e),a=h(()=>{var n;return typeof((n=t.value)==null?void 0:n.params)=="function"?t.value.params():t.value});if(!a.value&&_("dd-navigation").value){const{navigation:n}=j();return{navigation:n}}const{data:s}=await f(`content-navigation-${c(a.value)}`,()=>D(a.value));return{navigation:s}},render(e){const t=C(),{navigation:a}=e,s=o=>r(y,{to:o._path},()=>o.title),n=(o,u)=>r("ul",u?{"data-level":u}:null,o.map(i=>i.children?r("li",null,[s(i),n(i.children,u+1)]):r("li",null,s(i)))),p=o=>n(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):p(a)}}),Q=E;export{Q as default};
//# sourceMappingURL=ContentNavigation.BYuWPaL5.js.map
