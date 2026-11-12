/* Finance-led ambient background: quiet market data, numerals and chart texture. */
(function(){
  var canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  document.body.prepend(canvas);

  var ctx=canvas.getContext('2d'),W=0,H=0,D=1,raf=0,time=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motes=[];
  var green='94,234,212',red='226,112,125',violet='183,156,255',amber='242,169,59';
  var figures=['₹ 1,24,500','+12.4%','P&L  +8.2%','−2.1%','₹ 48,250','VOL  1.8M','EPS  24.6','₹ 9,840'];
  var candles=[];

  function resize(){
    D=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;H=window.innerHeight;
    canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);
    ctx.setTransform(D,0,0,D,0,0);
    motes=[];
    for(var i=0;i<28;i++)motes.push({
      x:Math.random()*W,y:Math.random()*H,
      r:.6+Math.random()*1.1,phase:Math.random()*6.28
    });
    candles=[];
    for(var j=0;j<34;j++){
      var base=H*(.23+Math.random()*.48);
      var open=base+(Math.random()-.5)*24;
      var close=open+(Math.random()-.5)*34;
      candles.push({x:j/33,y:base,open:open,close:close,
        high:Math.min(open,close)-Math.random()*18,
        low:Math.max(open,close)+Math.random()*18,
        up:close<open});
    }
    draw(0);
  }

  function glow(x,y,r,color,a){
    var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba('+color+','+a+')');
    g.addColorStop(1,'rgba('+color+',0)');
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }

  function draw(t){
    time=t||time;
    ctx.clearRect(0,0,W,H);
    var drift=reduced?0:Math.sin(time/11000)*18;

    /* Soft colour atmosphere, kept away from the central reading area. */
    glow(W*.08+drift,H*.25,Math.min(W,H)*.4,green,.028);
    glow(W*.91-drift,H*.72,Math.min(W,H)*.42,violet,.032);
    glow(W*.55,H*.08,Math.min(W,H)*.25,amber,.012);

    /* Fine vertical price-grid marks. */
    ctx.strokeStyle='rgba(220,230,235,.018)';ctx.lineWidth=1;
    for(var gx=0;gx<W;gx+=112){
      ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();
    }
    for(var gy=80;gy<H;gy+=112){
      ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();
    }

    /* Candlestick silhouettes live near the outer margins, not behind text. */
    var candleAlpha=W<700?.045:.075;
    candles.forEach(function(c,i){
      var x=W*(.04+c.x*.92);
      var y=c.y+(reduced?0:Math.sin(time/5000+i*.7)*3);
      var col=c.up?green:red;
      ctx.strokeStyle='rgba('+col+','+(candleAlpha*.9)+')';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x,c.high);ctx.lineTo(x,c.low);ctx.stroke();
      ctx.fillStyle='rgba('+col+','+candleAlpha+')';
      var top=Math.min(c.open,c.close),h=Math.max(3,Math.abs(c.close-c.open));
      ctx.fillRect(x-2,top,4,h);
    });

    /* Faint market-style numerals, scattered toward the edges. */
    if(W>540){
      ctx.font='10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign='left';
      figures.forEach(function(v,i){
        var left=i%2===0;
        var x=left?W*.035:W*.83;
        var y=H*(.16+Math.floor(i/2)*.19)+(reduced?0:Math.sin(time/7000+i)*4);
        var col=v.indexOf('+')===0?green:(v.indexOf('−')===0?red:(i%3===0?amber:'220,230,235'));
        ctx.fillStyle='rgba('+col+',.12)';
        ctx.fillText(v,x,y);
      });
    }

    /* Two fine performance curves, deliberately subdued. */
    [{base:.84,amp:.025,color:green,phase:.4},{base:.89,amp:.018,color:violet,phase:2.2}].forEach(function(c){
      ctx.beginPath();
      for(var k=0;k<=100;k++){
        var p=k/100,x=W*p;
        var y=H*(c.base+c.amp*Math.sin(p*7+c.phase+(reduced?0:time/18000))+
          .008*Math.sin(p*23+c.phase));
        if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba('+c.color+',.065)';ctx.lineWidth=1;ctx.stroke();
    });

    /* A few independent data points add depth without connecting into a diagram. */
    motes.forEach(function(p){
      var x=p.x+(reduced?0:Math.sin(time/6500+p.phase)*6);
      var y=p.y+(reduced?0:Math.sin(time/3100+p.phase)*4);
      ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+green+',.2)';ctx.fill();
    });

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
