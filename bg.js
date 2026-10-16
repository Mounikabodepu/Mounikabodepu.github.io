/* Subtle product-management themed background: roadmap grid, drifting cards, dependency lines */
(function(){
  var c=document.createElement('canvas');c.setAttribute('aria-hidden','true');
  c.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  document.body.prepend(c);
  var x=c.getContext('2d'),W,H,cards=[],tags=['PRD','MVP','KPI','P0','P1','OKR','A/B','Q4'];
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){
    var d=window.devicePixelRatio||1;W=innerWidth;H=innerHeight;
    c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    var n=Math.round(Math.min(18,Math.max(7,W*H/70000)));cards=[];
    for(var i=0;i<n;i++)cards.push({x:Math.random()*W,y:Math.random()*H,w:70+Math.random()*30,v:.08+Math.random()*.16,t:tags[i%tags.length],a:i%5==0});
  }
  function rr(px,py,w,h,r){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath()}
  function draw(){
    x.clearRect(0,0,W,H);
    x.strokeStyle='rgba(231,233,234,.035)';x.lineWidth=1;
    for(var gx=0;gx<W;gx+=88){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,H);x.stroke()}
    for(var gy=0;gy<H;gy+=88){x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke()}
    for(var i=0;i<cards.length;i++)for(var j=i+1;j<cards.length;j++){
      var a=cards[i],b=cards[j],dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<260){x.strokeStyle='rgba(94,234,212,'+(.09*(1-dist/260))+')';x.beginPath();x.moveTo(a.x+a.w/2,a.y+20);x.lineTo(b.x+b.w/2,b.y+20);x.stroke()}
    }
    x.globalAlpha=.5;
    cards.forEach(function(k){
      var col=k.a?'242,169,59':'94,234,212';
      x.fillStyle='rgba(18,22,27,.55)';x.strokeStyle='rgba('+col+',.2)';rr(k.x,k.y,k.w,40,6);x.fill();x.stroke();
      x.fillStyle='rgba('+col+',.38)';x.font='9px ui-monospace,monospace';x.fillText(k.t,k.x+8,k.y+15);
      x.fillStyle='rgba(231,233,234,.1)';x.fillRect(k.x+8,k.y+23,k.w-16,3);x.fillRect(k.x+8,k.y+30,(k.w-16)*.6,3);
      if(!still){k.y-=k.v;k.x+=Math.sin(k.y/90)*.12;if(k.y<-50){k.y=H+10;k.x=Math.random()*W}}
    });
    x.globalAlpha=1;
    if(!still)requestAnimationFrame(draw);
  }
  size();draw();
  addEventListener('resize',function(){size();if(still)draw()});
})();
