/* Ambient financial-data texture: abstract signals, no literal flowchart. */
(function(){
  var canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  document.body.prepend(canvas);

  var ctx=canvas.getContext('2d'),W=0,H=0,D=1,raf=0,time=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles=[];
  var palette=['94,234,212','183,156,255','242,169,59'];

  function resize(){
    D=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;H=window.innerHeight;
    canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);
    ctx.setTransform(D,0,0,D,0,0);
    particles=[];
    var count=Math.max(18,Math.min(42,Math.round(W*H/36000)));
    for(var i=0;i<count;i++)particles.push({
      x:Math.random()*W,y:Math.random()*H,
      r:.6+Math.random()*1.5,
      speed:.08+Math.random()*.2,
      phase:Math.random()*Math.PI*2,
      color:palette[i%palette.length]
    });
    draw(0);
  }

  function glow(x,y,r,color,alpha){
    var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba('+color+','+alpha+')');
    g.addColorStop(1,'rgba('+color+',0)');
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }

  function draw(t){
    time=t||time;
    ctx.clearRect(0,0,W,H);

    /* Diffuse colour fields: intentionally soft, spacious and unobtrusive. */
    var drift=reduced?0:Math.sin(time/9000)*24;
    glow(W*.13+drift,H*.22,Math.min(W,H)*.42,'94,234,212',.035);
    glow(W*.82-drift,H*.68,Math.min(W,H)*.48,'183,156,255',.038);
    glow(W*.56,H*.04+drift*.4,Math.min(W,H)*.3,'242,169,59',.018);

    /* Faint market-like curves, drawn as texture rather than a diagram. */
    var curves=[
      {base:.69,amp:.055,freq:1.1,phase:.2,color:'94,234,212'},
      {base:.78,amp:.035,freq:1.55,phase:2.1,color:'183,156,255'}
    ];
    curves.forEach(function(c,idx){
      ctx.beginPath();
      for(var i=0;i<=120;i++){
        var p=i/120,x=W*p;
        var y=H*(c.base+c.amp*Math.sin(p*Math.PI*2*c.freq+c.phase+(reduced?0:time/15000))+
          .012*Math.sin(p*Math.PI*7+idx));
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba('+c.color+',.055)';
      ctx.lineWidth=1.1;ctx.stroke();
    });

    /* Sparse, independent data motes; no links, labels or directional flow. */
    particles.forEach(function(p){
      var bob=reduced?0:Math.sin(time/2600+p.phase)*5;
      var x=p.x+(reduced?0:Math.sin(time/7000+p.phase)*8);
      var y=p.y+bob;
      ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+p.color+',.27)';ctx.fill();
      if(!reduced){
        p.y-=p.speed*.18;
        if(p.y<-4)p.y=H+4;
      }
    });

    /* A barely visible fine grain / drafting texture. */
    ctx.strokeStyle='rgba(220,230,235,.018)';ctx.lineWidth=1;
    for(var gx=0;gx<W;gx+=128){
      ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();
    }
    if(!reduced)raf=requestAnimationFrame(draw);
  }

  resize();
  if(!reduced)raf=requestAnimationFrame(draw);
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)cancelAnimationFrame(raf);
    else if(!reduced){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}
  });
})();
