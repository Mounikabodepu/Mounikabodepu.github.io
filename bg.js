/* Quiet, finance-and-AI product system: records flow through a ledger into useful signals. */
(function(){
  var canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  document.body.prepend(canvas);

  var ctx=canvas.getContext('2d'),W=0,H=0,D=1,raf=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tracks=[
    {y:.24,bend:-.055,color:'94,234,212',labels:['CUSTOMER','INVOICE','LEDGER','INSIGHT']},
    {y:.49,bend:.035,color:'183,156,255',labels:['BUSINESS','WORKFLOW','AI LAYER','DECISION']},
    {y:.74,bend:-.025,color:'242,169,59',labels:['SUPPLIER','PAYMENT','RISK CHECK','ACTION']}
  ];
  var nodes=[.12,.37,.64,.89];
  var packets=[0,.28,.57,.82];

  function resize(){
    D=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;H=window.innerHeight;
    canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);
    ctx.setTransform(D,0,0,D,0,0);
    draw(0);
  }
  function point(track,t){
    var x=W*(.07+t*.86);
    var y=H*track.y+Math.sin(t*Math.PI)*H*track.bend;
    return {x:x,y:y};
  }
  function draw(time){
    ctx.clearRect(0,0,W,H);
    /* A restrained drafting grid, like a financial workspace. */
    ctx.strokeStyle='rgba(220,230,235,.022)';ctx.lineWidth=1;
    for(var gx=0;gx<W;gx+=96){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke()}
    for(var gy=0;gy<H;gy+=96){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke()}

    tracks.forEach(function(track,ti){
      ctx.beginPath();
      for(var s=0;s<=80;s++){
        var p=point(track,s/80);
        if(s===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
      }
      ctx.strokeStyle='rgba('+track.color+',.105)';
      ctx.lineWidth=1;ctx.stroke();

      nodes.forEach(function(n,ni){
        var p=point(track,n);
        ctx.beginPath();ctx.arc(p.x,p.y,ni===2?3:2.2,0,Math.PI*2);
        ctx.fillStyle='rgba('+track.color+','+(ni===2?.42:.24)+')';ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,ni===2?8:6,0,Math.PI*2);
        ctx.strokeStyle='rgba('+track.color+',.075)';ctx.stroke();

        if(W>700){
          ctx.font='9px ui-monospace,monospace';
          ctx.fillStyle='rgba(220,230,235,.16)';
          ctx.fillText(track.labels[ni],p.x-25,p.y+(ti===1?18:-12));
        }
      });

      var phase=reduced?.5:((time/10500+ti*.23)%1);
      var packet=point(track,phase);
      ctx.beginPath();ctx.arc(packet.x,packet.y,2.4,0,Math.PI*2);
      ctx.fillStyle='rgba('+track.color+',.72)';
      ctx.shadowBlur=10;ctx.shadowColor='rgba('+track.color+',.4)';
      ctx.fill();ctx.shadowBlur=0;
      ctx.beginPath();ctx.arc(packet.x,packet.y,7,0,Math.PI*2);
      ctx.strokeStyle='rgba('+track.color+',.12)';ctx.stroke();
    });

    /* Occasional cross-links suggest systems, controls and data working together. */
    for(var i=0;i<nodes.length;i++){
      var a=point(tracks[0],nodes[i]),b=point(tracks[2],nodes[i]);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle='rgba(220,230,235,.035)';ctx.setLineDash([2,7]);ctx.stroke();ctx.setLineDash([]);
    }
    if(!reduced)raf=requestAnimationFrame(draw);
  }
  resize();
  if(!reduced)raf=requestAnimationFrame(draw);
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){cancelAnimationFrame(raf)}
    else if(!reduced){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}
  });
})();