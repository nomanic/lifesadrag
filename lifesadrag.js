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
var lifesadrag={
	obs:[],
	sel:false,
	friction:0.7,
	elastic:0.7,
	mass:10,
	rt:false,
	ob:function(orange,quebec){return (typeof orange==='string')?((orange==='')?quebec:document.getElementById(orange)):orange;},
	IV:function(x,o){return (typeof x==='string')?(isNaN(o=parseInt(x))?0:o):((typeof(x)==='number')?x:0);},
	draggable:function(j,options) {
		var sq=new lifesadrag.drago(j,options);
		sq.auto=lifesadrag.obs.length;
		lifesadrag.obs[sq.auto]=sq;
		sq.handle.setAttribute('auto',sq.auto);
		lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200);
	},
	drago:function(j,options) {
		options=options?options:{};
		this.obj=lifesadrag.ob(j);
		this.startX=this.obj.offsetLeft;
		this.startY=this.obj.offsetTop;
		this.vx=0;
		this.vy=0;
		this.osx=0;
		this.osy=0;
		this.isdrag=0;
		this.obj.style.zIndex=1000;
		this.contain=options.contain;
		this.momentum=options.momentum;
		this.mass=options.mass?options.mass:lifesadrag.mass;
		this.collide=options.collide?options.collide:0;
		this.collisionondrag=options.collisionondrag?options.collisionondrag:0;
		this.handle=options.handle?lifesadrag.ob(options.handle):this.obj;
		this.handle.onmousedown=function(e) {
			self=lifesadrag.obs[lifesadrag.IV(this.getAttribute('auto'))];
			self.startX=self.obj.offsetLeft;
			self.startY=self.obj.offsetTop;
			self.startmX=e.clientX;
			self.startmY=e.clientY;
			self.vx=self.vy=0;
			self.isdrag=1;
			self.obj.style.zIndex=3000;
			lifesadrag.sel=self.auto;
			document.ontouchmove=document.onmousemove=self.mover;
			document.touchend=document.onmouseup=function(e) {
				var coords=lifesadrag.getCoords(e),sel=lifesadrag.obs[lifesadrag.sel],dx=coords.x-sel.ox,dy=coords.y-sel.oy,tt=((new Date().getTime()-sel.d0)/10);
				sel.isdrag=0;
				sel.vx=sel.mass*dx/tt;
				sel.vy=sel.mass*dy/tt;
				document.ontouchmove=document.onmousemove=false;
				document.touchend=document.onmouseup=false;
				sel.obj.style.zIndex=1000;
				lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200);
			}
		}
		this.mover=function(e) {
			var coords=lifesadrag.getCoords(e),sel=lifesadrag.obs[lifesadrag.sel],x=(sel.startX+(coords.x-sel.startmX)),y=(sel.startY+(coords.y-sel.startmY)),obj=sel.obj;
			sel.isdrag=1;
			sel.ox=sel.osx;
			sel.osx=coords.x;
			sel.oy=sel.osy;
			sel.osy=coords.y;
			var dx=coords.x-sel.ox,dy=coords.y-sel.oy,tt=((new Date().getTime()-sel.d0)/10);
			sel.d0=new Date().getTime();
			sel.vx=lifesadrag.mass*dx/tt;
			sel.vy=lifesadrag.mass*dy/tt;
			if (sel.contain) {
				x=Math.max(0,Math.min(obj.parentNode.offsetWidth-obj.offsetWidth,x));
				y=Math.max(0,Math.min(obj.parentNode.offsetHeight-obj.offsetHeight,y));
			}
			obj.style.left=x+'px';
			obj.style.top=y+'px';
			lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200);
		},
		this.shifter=function(a,x,y) {
			var sel=lifesadrag.obs[a],obj=sel.obj;
			if (sel.contain) {
				x=Math.max(0,Math.min(obj.parentNode.offsetWidth-obj.offsetWidth,x));
				y=Math.max(0,Math.min(obj.parentNode.offsetHeight-obj.offsetHeight,y));
			}
			obj.style.left=x+'px';
			obj.style.top=y+'px';
		}
	},
	getCoords:function(e) {
		return ((('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))&&(e&&(e.touches.length>0)))?{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}:{x:e.clientX,y:e.clientY};
	},
	overlap:function(b, t) {
		return (t.offsetLeft>(b.offsetLeft + b.offsetWidth)||(t.offsetLeft + t.offsetWidth)<b.offsetLeft||t.offsetTop>(b.offsetTop + b.offsetHeight)||(t.offsetTop + t.offsetHeight)<b.offsetTop)?0:1;
	},
	distance:function(x0, y0, x1, y1,z) {
		return Math.sqrt(((z=(x0 - x1)) * z) + ((z=(y0 - y1)) * z));
	},
	collision:function(b,blb) {
		var cx1=b.x+(b.obj.offsetWidth/2),
			cy1=b.y+(b.obj.offsetHeight/2),
			cx2=blb.x+(blb.obj.offsetWidth/2),
			cy2=blb.y+(blb.obj.offsetHeight/2),
			cmx1=b.x+b.obj.offsetWidth,
			cmy1=b.y+b.obj.offsetHeight,
			cmx2=blb.x+blb.obj.offsetWidth,
			cmy2=blb.y+blb.obj.offsetHeight,
			dx1=(b.x<blb.x)?-(cx2-cmx1):(cx1-cmx2),
			dy1=(b.y<blb.y)?-(cy2-cmy1):(cy1-cmy2),
			dx2=(b.x<blb.x)?-(cx1-cmx2):(cx2-cmx1),
			dy2=(b.y<blb.y)?-(cy1-cmy2):(cy2-cmy1),
			tt = Math.abs(((new Date()).getTime() - b.d0)/1000);
		if (b.isdrag!=1) {
			b.vx+=dx1*tt/b.mass;
			b.vy+=dy1*tt/b.mass;
		}
		blb.vx+=dx2*tt/blb.mass;
		blb.vy+=dy2*tt/blb.mass;
		blb.ismvd=b.ismvd=1;
	},
	sortcollisions:function(t) {
		t.ischecked=1;
		var sel,f;
		for (f=0;f<lifesadrag.obs.length;f++) {
			if ((sel=lifesadrag.obs[f]).collide&&(sel.ischecked!=1)&&((sel.isdrag!=1)||sel.collisionondrag)) {
				if (lifesadrag.overlap(t.obj,sel.obj)) {
					sel.ischecked=1;
					lifesadrag.collision(t,sel);
				}
			}
		}
	},
	kinetic:function() {
		var f,sel,ismvd=false;
		lifesadrag.rt=false;
		for (f=0;f<lifesadrag.obs.length;f++) {
			sel=lifesadrag.obs[f];
			sel.ismvd=0;
			sel.ischecked=0;
			sel.x=sel.obj.offsetLeft;
			sel.y=sel.obj.offsetTop;
			if (((Math.abs(sel.vx)>0.9)||(Math.abs(sel.vy)>0.9))&&(sel.isdrag!=1)) {
				sel.x=sel.x+sel.vx;
				sel.vx=sel.vx*lifesadrag.friction;
				sel.y=sel.y+sel.vy;
				sel.vy=sel.vy*lifesadrag.friction;
				sel.ismvd=1;
				ismvd=1;
			}
			else if (sel.isdrag!=1) {
				sel.vx=sel.vy=0;
			}
		}
		for (f=0;f<lifesadrag.obs.length;f++) {
			if ((sel=lifesadrag.obs[f]).contain) {
				if ((sel.x<0)||(sel.x+sel.obj.offsetWidth>sel.obj.parentNode.offsetWidth)) {
					sel.x=(sel.x<0)?0:(sel.obj.parentNode.offsetWidth-sel.obj.offsetWidth);
					sel.vx=-sel.vx*lifesadrag.elastic;
					sel.ismvd=1;
					ismvd=1;
				}
				if ((sel.y<0)||(sel.y+sel.obj.offsetHeight>sel.obj.parentNode.offsetHeight)) {
					sel.y=(sel.y<0)?0:(sel.obj.parentNode.offsetHeight-sel.obj.offsetHeight);
					sel.vy=-sel.vy*lifesadrag.elastic;
					sel.ismvd=1;
					ismvd=1;
				}
			}
		}
		for (f=0;f<lifesadrag.obs.length;f++) {
			if ((sel=lifesadrag.obs[f]).collide&&(sel.ischecked!=1)&&((sel.isdrag!=1)||(sel.collisionondrag==1))) {
				lifesadrag.sortcollisions(sel);
			}
		}
		if (ismvd) {
			for (f=0;f<lifesadrag.obs.length;f++) {
				(sel=lifesadrag.obs[f]).d0=new Date().getTime();
				if (sel.ismvd) {
					sel.shifter(f,sel.x,sel.y);
				}
			}
			lifesadrag.rt=lifesadrag.rt?lifesadrag.rt:setTimeout(lifesadrag.kinetic,200);
		}
		else {
			for (f=0;f<lifesadrag.obs.length;f++) {
				(sel=lifesadrag.obs[f]).d0=new Date().getTime();
			}
			lifesadrag.rt=false;
		}
	}
};
