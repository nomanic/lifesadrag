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
var lifesadrag={obs:[],sel:!1,friction:.7,elastic:.7,mass:10,rt:!1,ob:function(t,e){return"string"==typeof t?""===t?e:document.getElementById(t):t},IV:function(t,e){return"string"==typeof t?isNaN(e=parseInt(t))?0:e:"number"==typeof t?t:0},draggable:function(t,e){var s=new lifesadrag.drago(t,e)
s.auto=lifesadrag.obs.length,lifesadrag.obs[s.auto]=s,s.handle.setAttribute("auto",s.auto),lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)},drago:function(t,e){e=e?e:{},this.obj=lifesadrag.ob(t),this.startX=this.obj.offsetLeft,this.startY=this.obj.offsetTop,this.vx=0,this.vy=0,this.osx=0,this.osy=0,this.isdrag=0,this.obj.style.zIndex=1e3,this.contain=e.contain,this.momentum=e.momentum,this.mass=e.mass?e.mass:lifesadrag.mass,this.collide=e.collide?e.collide:0,this.collisionondrag=e.collisionondrag?e.collisionondrag:0,this.snaptogrid=e.snaptogrid?e.snaptogrid:0,this.handle=e.handle?lifesadrag.ob(e.handle):this.obj,this.handle.touchstart=this.handle.onmousedown=function(t){self=lifesadrag.obs[lifesadrag.IV(this.getAttribute("auto"))],self.startX=self.obj.offsetLeft,self.startY=self.obj.offsetTop,self.startmX=t.clientX,self.startmY=t.clientY,self.vx=self.vy=0,self.isdrag=1,self.obj.style.zIndex=3e3,lifesadrag.sel=self.auto,document.ontouchmove=document.onmousemove=self.mover,document.touchend=document.onmouseup=function(t){var e=lifesadrag.getCoords(t),s=lifesadrag.obs[lifesadrag.sel],o=e.x-s.ox,a=e.y-s.oy,i=((new Date).getTime()-s.d0)/10
s.isdrag=0,s.vx=s.mass*o/i,s.vy=s.mass*a/i,document.ontouchmove=document.onmousemove=!1,document.touchend=document.onmouseup=!1,s.obj.style.zIndex=1e3,lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)}},this.mover=function(t){var e=lifesadrag.getCoords(t),s=lifesadrag.obs[lifesadrag.sel],o=s.startX+(e.x-s.startmX),a=s.startY+(e.y-s.startmY),i=s.obj
s.isdrag=1,s.ox=s.osx,s.osx=e.x,s.oy=s.osy,s.osy=e.y
var f=e.x-s.ox,r=e.y-s.oy,d=((new Date).getTime()-s.d0)/10
s.d0=(new Date).getTime(),s.vx=lifesadrag.mass*f/d,s.vy=lifesadrag.mass*r/d,s.contain&&(o=s.snaptogrid?Math.round(o/s.snaptogrid)*s.snaptogrid:o,a=s.snaptogrid?Math.round(a/s.snaptogrid)*s.snaptogrid:a,o=Math.max(0,Math.min(i.parentNode.offsetWidth-i.offsetWidth,o)),a=Math.max(0,Math.min(i.parentNode.offsetHeight-i.offsetHeight,a))),i.style.left=o+"px",i.style.top=a+"px",lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)},this.shifter=function(t,e,s){var o=lifesadrag.obs[t],a=o.obj
o.contain&&(e=Math.max(0,Math.min(a.parentNode.offsetWidth-a.offsetWidth,e)),s=Math.max(0,Math.min(a.parentNode.offsetHeight-a.offsetHeight,s))),a.style.left=e+"px",a.style.top=s+"px"}},getCoords:function(t){return("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)&&t&&t.touches.length>0?{x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY}:{x:t.clientX,y:t.clientY}},overlap:function(t,e){return e.offsetLeft>t.offsetLeft+t.offsetWidth||e.offsetLeft+e.offsetWidth<t.offsetLeft||e.offsetTop>t.offsetTop+t.offsetHeight||e.offsetTop+e.offsetHeight<t.offsetTop?0:1},distance:function(t,e,s,o,a){return Math.sqrt((a=t-s)*a+(a=e-o)*a)},collision:function(t,e){var s=t.x+t.obj.offsetWidth/2,o=t.y+t.obj.offsetHeight/2,a=e.x+e.obj.offsetWidth/2,i=e.y+e.obj.offsetHeight/2,f=t.x+t.obj.offsetWidth,r=t.y+t.obj.offsetHeight,d=e.x+e.obj.offsetWidth,n=e.y+e.obj.offsetHeight,l=t.x<e.x?-(a-f):s-d,g=t.y<e.y?-(i-r):o-n,h=t.x<e.x?-(s-d):a-f,c=t.y<e.y?-(o-n):i-r,m=Math.abs(((new Date).getTime()-t.d0)/1e3)
1!=t.isdrag&&(t.vx+=l*m/t.mass,t.vy+=g*m/t.mass),e.vx+=h*m/e.mass,e.vy+=c*m/e.mass,e.ismvd=t.ismvd=1},sortcollisions:function(t){t.ischecked=1
var e,s,o=0
for(s=0;s<lifesadrag.obs.length;s++)(e=lifesadrag.obs[s]).collide&&1!=e.ischecked&&(1!=e.isdrag||e.collisionondrag)&&lifesadrag.overlap(t.obj,e.obj)&&(e.ischecked=1,lifesadrag.collision(t,e),o=1)
return o},kinetic:function(){var t,e,s=!1
for(lifesadrag.rt=!1,t=0;t<lifesadrag.obs.length;t++)e=lifesadrag.obs[t],e.ismvd=0,e.ischecked=0,e.x=e.obj.offsetLeft,e.y=e.obj.offsetTop,(Math.abs(e.vx)>.9||Math.abs(e.vy)>.9)&&1!=e.isdrag?(e.x=e.x+e.vx,e.vx=e.vx*lifesadrag.friction,e.y=e.y+e.vy,e.vy=e.vy*lifesadrag.friction,e.ismvd=1,s=1):1!=e.isdrag&&(e.vx=e.vy=0)
for(t=0;t<lifesadrag.obs.length;t++)(e=lifesadrag.obs[t]).contain&&((e.x<0||e.x+e.obj.offsetWidth>e.obj.parentNode.offsetWidth)&&(e.x=e.x<0?0:e.obj.parentNode.offsetWidth-e.obj.offsetWidth,e.vx=-e.vx*lifesadrag.elastic,e.ismvd=1,s=1),(e.y<0||e.y+e.obj.offsetHeight>e.obj.parentNode.offsetHeight)&&(e.y=e.y<0?0:e.obj.parentNode.offsetHeight-e.obj.offsetHeight,e.vy=-e.vy*lifesadrag.elastic,e.ismvd=1,s=1))
for(t=0;t<lifesadrag.obs.length;t++)!(e=lifesadrag.obs[t]).collide||1==e.ischecked||1==e.isdrag&&1!=e.collisionondrag||(s=1==lifesadrag.sortcollisions(e)?1:s)
if(s){for(t=0;t<lifesadrag.obs.length;t++)(e=lifesadrag.obs[t]).d0=(new Date).getTime(),e.ismvd&&e.shifter(t,e.x,e.y)
lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200)}else{for(t=0;t<lifesadrag.obs.length;t++)(e=lifesadrag.obs[t]).d0=(new Date).getTime()
lifesadrag.rt=!1}}}
