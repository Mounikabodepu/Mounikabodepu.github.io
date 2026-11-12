/* Calm, abstract product-thinking canvas: connected ideas, roadmap nodes and data signals. */
(function(){
  var c=document.createElement('canvas');
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.82';
  document.body.prepend(c);
  var x=c.getContext('2d'),W=0,H=0,dpr=1,nodes=[];
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var palette=['101,88,211','231,151,119','92,166,174','166,151,218'];
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);W=window.innerWidth;H=window.innerHeight;
    c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var count=Math.max(12,Math.min(28,Math.round(W*H/42000)));
    nodes=[];
    for(var i=0;i<count;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,r:2+Math.random()*3,dx:(Math.random()-.5)*.12,dy:(Math.random()-.5)*.12,col:palette[i%palette.length],phase:Math.random()*6.28});
  }
  function draw(){
    x.clearRect(0,0,W,H);
    // Fine dotted field — intentionally low contrast.
    x.fillStyle='rgba(72,75,112,.10)';
    for(var gx=24;gx<W;gx+=42)for(var gy=24;gy<H;gy+=42){x.beginPath();x.arc(gx,gy,.7,0,Math.PI*2);x.fill()}
    // Connect nearby ideas with thin, quiet lines.
    for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){
      var a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<190){x.strokeStyle='rgba(101,88,211,'+(.055*(1-dist/190))+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}
    }
    nodes.forEach(function(p){
      var glow=x.createRadialGradient(p.x,p.y,0,p.x,p.y,25);
      glow.addColorStop(0,'rgba('+p.col+',.13)');glow.addColorStop(1,'rgba('+p.col+',0)');
      x.fillStyle=glow;x.beginPath();x.arc(p.x,p.y,25,0,Math.PI*2);x.fill();
      x.fillStyle='rgba('+p.col+',.38)';x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fill();
      if(!reduced){p.x+=p.dx;p.y+=p.dy;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10}
    });
    if(!reduced)requestAnimationFrame(draw);
  }
  resize();draw();
  window.addEventListener('resize',function(){resize();if(reduced)draw()},{passive:true});
})();