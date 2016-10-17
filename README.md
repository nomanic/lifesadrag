# lifesadrag.js (Basically a very small dragger)

###A JavaScript micro-framework for dragging elements

Author: Neil Oman
Version: 1

Copyright 2016 Neil Oman
Dual licensed under MIT and GPL

## Features

* Simple
* Very lightweight (only 1.67Kb minified and gzipped)

## Samples! :)

```
//add script to page
<script type="text/javascript" src="lifesadrag.js"></script>

//set up some CSS for our boxes
<style>
#square1 {
  position:absolute;
  height: 100px;
  width: 100px;
    background-color:red;
  border: 5px solid black
}
#square1a {
  position:absolute;
  height: 40px;
  width: 40px;
    background-color:green;
  border: 5px solid black;
  margin:30px;
}
#square2,#square3 {
  position:absolute;
  height: 100px;
  width: 300px;
    background-color:Blue;
  border: 5px solid black
}
#square4 {
  position:absolute;
  height: 100px;
  width: 600px;
    background-color:red;
  border: 5px solid black
}
</style>

//set up HTML, 2 "BOXES" to drag, one with handle, inside container
//square1a is a handle to drag by
<div id="wrapper" style="width: 100%; height: 400px;">
	  <div id="square1" style="left: 100px; top: 100px;"><div id="square1a"></div></div>
	  <div id="square2" style="left: 300px; top: 100px;"></div>
	  <div id="square3" style="left: 600px; top: 100px;"></div>
	  <div id="square4" style="left: 900px; top: 100px;"></div>
</div>

<script type="text/javascript">
//make each square draggable
var sq1=lifesadrag.draggable('square1',{contain:1,collide:1,momentum:1,mass:20,collisionondrag:1,handle:'square1a'});
var sq2=lifesadrag.draggable('square2',{contain:1,collide:1,momentum:1,mass:20,collisionondrag:1});
var sq3=lifesadrag.draggable('square3',{contain:1,collide:1,momentum:1,mass:20,collisionondrag:1});
var sq4=lifesadrag.draggable('square4',{contain:1,collide:1,momentum:1,mass:20,snaptogrid:50});


</script>
```

## Options

### Mandatory Options

none
we can just have
lifesadrag.draggable('square1');

### Optional Options

**contain**, contained by parent div (bounding box)   
**collide**, whether it collides with other draggables  
**momentum**, whether it continues to glide after you have stopped dragging
**mass**, default is 10, make them as heavy or light as you want
**collisionondrag**, whether it collides as you drag
**snaptogrid**, snaps to grid as you drag, can be any number, will jump by increments of this
**handle**, target div to drag by
