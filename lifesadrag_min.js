/**
 * lifesadrag.js
 *
 * A JavaScript micro-framework for dragging elements
 *
 * @author     Neil Oman
 * @version    1
 * @copyright  Copyright 2016 Neil Oman
 * @license    Dual licensed under MIT and GPL
 */
var lifesadrag={obs:[],sel:!1,friction:.7,elastic:.7,mass:10,rt:!1,ob:function(e,t){return"string"==typeof e?""===e?t:document.getElementById(e):e},IV:function(e,t){return"string"==typeof e?isNaN(t=parseInt(e))?0:t:"number"==typeof e?e:0},draggable:function(e,t){var s=new lifesadrag.drago(e,t)
s.auto=lifesadrag.obs.length,lifesadrag.obs[s.auto]=s,s.handle.setAttribute("auto",s.auto),lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)},drago:function(e,t){t=t?t:{},this.obj=lifesadrag.ob(e),this.startX=this.obj.offsetLeft,this.startY=this.obj.offsetTop,this.vx=0,this.vy=0,this.osx=0,this.osy=0,this.isdrag=0,this.obj.style.zIndex=1e3,this.contain=t.contain,this.momentum=t.momentum,this.mass=t.mass?t.mass:lifesadrag.mass,this.collide=t.collide?t.collide:0,this.collisionondrag=t.collisionondrag?t.collisionondrag:0,this.handle=t.handle?lifesadrag.ob(t.handle):this.obj,this.handle.onmousedown=function(e){self=lifesadrag.obs[lifesadrag.IV(this.getAttribute("auto"))],self.startX=self.obj.offsetLeft,self.startY=self.obj.offsetTop,self.startmX=e.clientX,self.startmY=e.clientY,self.vx=self.vy=0,self.isdrag=1,self.obj.style.zIndex=3e3,lifesadrag.sel=self.auto,document.ontouchmove=document.onmousemove=self.mover,document.touchend=document.onmouseup=function(e){var t=lifesadrag.getCoords(e),s=lifesadrag.obs[lifesadrag.sel],o=t.x-s.ox,a=t.y-s.oy,i=((new Date).getTime()-s.d0)/10
s.isdrag=0,s.vx=s.mass*o/i,s.vy=s.mass*a/i,document.ontouchmove=document.onmousemove=!1,document.touchend=document.onmouseup=!1,s.obj.style.zIndex=1e3,lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)}},this.mover=function(e){var t=lifesadrag.getCoords(e),s=lifesadrag.obs[lifesadrag.sel],o=s.startX+(t.x-s.startmX),a=s.startY+(t.y-s.startmY),i=s.obj
s.isdrag=1,s.ox=s.osx,s.osx=t.x,s.oy=s.osy,s.osy=t.y
var f=t.x-s.ox,r=t.y-s.oy,d=((new Date).getTime()-s.d0)/10
s.d0=(new Date).getTime(),s.vx=lifesadrag.mass*f/d,s.vy=lifesadrag.mass*r/d,s.contain&&(o=Math.max(0,Math.min(i.parentNode.offsetWidth-i.offsetWidth,o)),a=Math.max(0,Math.min(i.parentNode.offsetHeight-i.offsetHeight,a))),i.style.left=o+"px",i.style.top=a+"px",lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)},this.shifter=function(e,t,s){var o=lifesadrag.obs[e],a=o.obj
o.contain&&(t=Math.max(0,Math.min(a.parentNode.offsetWidth-a.offsetWidth,t)),s=Math.max(0,Math.min(a.parentNode.offsetHeight-a.offsetHeight,s))),a.style.left=t+"px",a.style.top=s+"px"}},getCoords:function(e){return("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)&&e&&e.touches.length>0?{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}:{x:e.clientX,y:e.clientY}},overlap:function(e,t){return t.offsetLeft>e.offsetLeft+e.offsetWidth||t.offsetLeft+t.offsetWidth<e.offsetLeft||t.offsetTop>e.offsetTop+e.offsetHeight||t.offsetTop+t.offsetHeight<e.offsetTop?0:1},distance:function(e,t,s,o,a){return Math.sqrt((a=e-s)*a+(a=t-o)*a)},collision:function(e,t){var s=e.x+e.obj.offsetWidth/2,o=e.y+e.obj.offsetHeight/2,a=t.x+t.obj.offsetWidth/2,i=t.y+t.obj.offsetHeight/2,f=e.x+e.obj.offsetWidth,r=e.y+e.obj.offsetHeight,d=t.x+t.obj.offsetWidth,n=t.y+t.obj.offsetHeight,l=e.x<t.x?-(a-f):s-d,g=e.y<t.y?-(i-r):o-n,h=e.x<t.x?-(s-d):a-f,c=e.y<t.y?-(o-n):i-r,m=Math.abs(((new Date).getTime()-e.d0)/1e3)
1!=e.isdrag&&(e.vx+=l*m/e.mass,e.vy+=g*m/e.mass),t.vx+=h*m/t.mass,t.vy+=c*m/t.mass,t.ismvd=e.ismvd=1},sortcollisions:function(e){e.ischecked=1
var t,s
for(s=0;s<lifesadrag.obs.length;s++)(t=lifesadrag.obs[s]).collide&&1!=t.ischecked&&(1!=t.isdrag||t.collisionondrag)&&lifesadrag.overlap(e.obj,t.obj)&&(t.ischecked=1,lifesadrag.collision(e,t))},kinetic:function(){var e,t,s=!1
for(lifesadrag.rt=!1,e=0;e<lifesadrag.obs.length;e++)t=lifesadrag.obs[e],t.ismvd=0,t.ischecked=0,t.x=t.obj.offsetLeft,t.y=t.obj.offsetTop,(Math.abs(t.vx)>.9||Math.abs(t.vy)>.9)&&1!=t.isdrag?(t.x=t.x+t.vx,t.vx=t.vx*lifesadrag.friction,t.y=t.y+t.vy,t.vy=t.vy*lifesadrag.friction,t.ismvd=1,s=1):1!=t.isdrag&&(t.vx=t.vy=0)
for(e=0;e<lifesadrag.obs.length;e++)(t=lifesadrag.obs[e]).contain&&((t.x<0||t.x+t.obj.offsetWidth>t.obj.parentNode.offsetWidth)&&(t.x=t.x<0?0:t.obj.parentNode.offsetWidth-t.obj.offsetWidth,t.vx=-t.vx*lifesadrag.elastic,t.ismvd=1,s=1),(t.y<0||t.y+t.obj.offsetHeight>t.obj.parentNode.offsetHeight)&&(t.y=t.y<0?0:t.obj.parentNode.offsetHeight-t.obj.offsetHeight,t.vy=-t.vy*lifesadrag.elastic,t.ismvd=1,s=1))
for(e=0;e<lifesadrag.obs.length;e++)!(t=lifesadrag.obs[e]).collide||1==t.ischecked||1==t.isdrag&&1!=t.collisionondrag||lifesadrag.sortcollisions(t)
if(s){for(e=0;e<lifesadrag.obs.length;e++)(t=lifesadrag.obs[e]).d0=(new Date).getTime(),t.ismvd&&t.shifter(e,t.x,t.y)
lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)}else{for(e=0;e<lifesadrag.obs.length;e++)(t=lifesadrag.obs[e]).d0=(new Date).getTime()
lifesadrag.rt=!1}}}
