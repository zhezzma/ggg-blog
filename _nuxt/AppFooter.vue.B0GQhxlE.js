import{d as F,x as N,r as m,b as s,c as n,g as p,w as h,e as t,F as U,G as V,E as e,D as S,j as d,t as l,f as u,at as T,a4 as j,au as E,av as L,C as q,a7 as I}from"./entry.DME2G-rb.js";import{_ as M}from"./SocialIcons.vue.B5RylXl0.js";import{_ as O}from"./Container.jI9t9SeF.js";import{f as P}from"./useAuthor.BBb4QS7L.js";const R=""+globalThis.__publicAssetsURL("images/beian.png"),G={class:"bg-zinc-200 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-500"},Y={class:"flex"},$={class:"w-1/3"},H=t("h3",{class:"font-bold text-lg mb-2"},"链接",-1),J={class:"w-1/3"},K=t("h3",{class:"font-bold text-lg mb-2"},"关注",-1),Q={key:0,class:"text-2xl"},W={key:0},X=t("h3",{class:"font-bold text-lg mb-2"},"订阅",-1),Z=t("p",{class:"mb-2"},"通过电子邮件获取最新文章",-1),tt={key:0,class:"text-red-500 text-xs italic mb-2"},et={key:1,class:"text-green-500 text-xs italic mb-2"},st=["action"],ot=t("input",{type:"hidden",name:"ml-submit",value:"1"},null,-1),nt=t("input",{type:"hidden",name:"anticsrf",value:"true"},null,-1),at={class:"flex max-w-7xl m-auto mt-5 space-x-2 text-sm justify-center flex-wrap"},lt=t("div",null,"•",-1),ct=t("div",null,"•",-1),it={href:"https://github.com/zhezzma"},rt=t("div",null,"•",-1),_t={href:"https://beian.miit.gov.cn/",rel:"noopener",target:"_blank"},dt=t("div",null,"•",-1),ut=t("img",{src:R,alt:"",class:"w-4 h-4"},null,-1),bt=F({__name:"AppFooter",setup(mt){const o=N(),v=o.menu,k=o.newsletter.enabled,f=o.newsletter.form_action,c=m(""),x=m(!1),b=m(!1),r=P(),y="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode="+o.wangan.slice(5);async function z(){const i=new FormData;i.append("fields[email]",c.value),i.append("ml-submit","1"),i.append("anticsrf","true");const _=await fetch(f,{method:"POST",body:i});c.value="",_.ok?x.value=!0:b.value=!0}return(i,_)=>{const C=q,D=M,A=I,B=O;return s(),n("footer",G,[p(B,{class:"py-5"},{default:h(()=>{var g,w;return[t("div",Y,[t("div",$,[H,t("ul",null,[(s(!0),n(U,null,V(e(v),a=>(s(),n("li",{key:a.path},[(s(),S(C,{key:a.path,to:a.path,class:"hover:text-zinc-400"},{default:h(()=>[d(l(a.name),1)]),_:2},1032,["to"]))]))),128))])]),t("div",J,[K,(g=e(r))!=null&&g.socials&&Object.entries(e(r).socials)?(s(),n("div",Q,[p(D,{socials:e(r).socials,class:"pr-5"},null,8,["socials"])])):u("",!0)]),e(k)?(s(),n("div",W,[X,Z,e(b)?(s(),n("p",tt," 订阅失败。请稍后重试 ")):u("",!0),e(x)?(s(),n("p",et," 您已成功订阅 ")):u("",!0),t("form",{action:e(f),method:"post",target:"_blank"},[T(t("input",{"onUpdate:modelValue":_[0]||(_[0]=a=>j(c)?c.value=a:null),name:"fields[email]",autocomplete:"email",type:"email",placeholder:"welcome@hello.world",class:"p-2 text-zinc-700 w-full",required:""},null,512),[[E,e(c)]]),ot,nt,p(A,{icon:"i-heroicons-pencil-square",size:"lg",class:"mt-2 w-full",onClick:L(z,["prevent"])},{default:h(()=>[d(" 订阅 ")]),_:1})],8,st)])):u("",!0)]),t("div",at,[t("div",null,"Copyright © "+l(new Date().getFullYear()),1),lt,d("  "+l(e(o).title)+" ",1),ct,d("   Powered by "),t("a",it,l((w=e(r))==null?void 0:w.username),1),rt,t("a",_t,l(e(o).icp),1),dt,ut,t("a",{href:y,rel:"noopener",target:"_blank"},l(e(o).wangan),1)])]}),_:1})])}}});export{bt as _};
//# sourceMappingURL=AppFooter.vue.B0GQhxlE.js.map
