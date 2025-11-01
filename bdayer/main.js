 (function(){
  const $ = (sel)=>document.querySelector(sel);
  const giftScreen = $('#giftScreen');
  const giftInner = $('#giftInner');
  const nameModal = $('#nameModal');
  const nameOkBtn = $('#nameOkBtn');
  const wisherName = $('#wisherName');
  const wishScreen = $('#wishScreen');
  const wishName = $('#wishName');
  const letterScreen = $('#letterScreen');
  const revealScreen = document.querySelector('#revealScreen');
  const openSurprise = $('#openSurprise');
  const surpriseScreen = $('#surpriseScreen');
  const galleryScreen = document.querySelector('#galleryScreen');
  const goToGallery = document.querySelector('#goToGallery');
  const startGallery = $('#startGallery');
  const gallerySection = $('#gallerySection');
  const carousel = $('#carousel3d');
  const spinLeft = $('#spinLeft');
  const spinRight = $('#spinRight');

  function show(el){ if(el) el.classList.remove('hidden'); }
  function hide(el){ if(el) el.classList.add('hidden'); }
  function showOnly(target){
    const sections = [
      document.querySelector('#wishScreen'),
      document.querySelector('#revealScreen'),
      document.querySelector('#letterScreen'),
      document.querySelector('#surpriseScreen'),
      document.querySelector('#galleryScreen')
    ];
    sections.forEach(s=>s && s.classList.add('hidden'));
    if(target) target.classList.remove('hidden');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // Entry gift box
  if(giftInner){
    giftInner.addEventListener('click', ()=>{
      giftInner.parentElement.classList.add('open');
      // After lid open, continue
      setTimeout(()=>{
        hide(giftScreen);
        showOnly(null); // hide all content sections
        show(nameModal);
      }, 900);
    });
  }

  // Name OK -> Wish screen
  if(nameOkBtn){
    nameOkBtn.addEventListener('click', ()=>{
      const name = (wisherName && wisherName.value.trim());
      if(!name){
        wisherName.classList.add('ring-2','ring-rose-500');
        wisherName.placeholder = 'Please enter your beautiful name ✨';
        wisherName.focus();
        return;
      }
      wisherName.classList.remove('ring-rose-500');
      if(wishName) wishName.textContent = name;
      hide(nameModal);
      showOnly(wishScreen);
      burstConfetti();
    });
  }

  // Surprise and confetti
  function burstConfetti(){
    try{
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setTimeout(()=>confetti({ particleCount: 80, spread: 100 }), 300);
      setTimeout(()=>confetti({ particleCount: 150, spread: 120, scalar: 0.9 }), 600);
    }catch(e){/* noop */}
  }

  // Romantic floating background
  const bg = document.getElementById('bgRomance');
  if(bg){
    const symbols = ['❤️','💖','💘','💞','🧸','✨'];
    for(let i=0;i<36;i++){
      const s = document.createElement('span');
      s.textContent = symbols[i % symbols.length];
      s.style.left = Math.random()*100 + 'vw';
      s.style.top = Math.random()*100 + 'vh';
      s.style.animationDelay = (Math.random()*12)+'s';
      s.style.fontSize = (14+Math.random()*18)+'px';
      bg.appendChild(s);
    }
  }

  // Particles on click with varied emojis
  function clickBurst(x,y){
    const variants = [['❤️','💖','💘'],['🎈','🎊','🎉'],['✨','🌟','💫'],['🧸','❤️','💞']];
    const set = variants[Math.floor(Math.random()*variants.length)];
    for(let i=0;i<6;i++){
      const p = document.createElement('div');
      p.className = 'particle rise';
      p.style.left = x+'px'; p.style.top = y+'px';
      p.textContent = set[i % set.length];
      document.body.appendChild(p);
      setTimeout(()=>p.remove(), 900);
    }
  }
  document.addEventListener('click', (e)=>{
    clickBurst(e.clientX, e.clientY);
  });

  if(openSurprise){
    openSurprise.addEventListener('click', ()=>{
      // Go straight to separate Gallery page and hide others
      showOnly(galleryScreen);
      burstConfetti();
      setupMusic();
    });
  }

  // Q&A sequence: reveal answers and unlock next
  const qaItems = Array.from(document.querySelectorAll('.qa-item'));
  qaItems.forEach((item, idx)=>{
    const q = item.querySelector('.qa-q');
    const a = item.querySelector('.qa-a');
    if(!q || !a) return;
    if(idx>0) item.classList.add('opacity-50','pointer-events-none');
    q.addEventListener('click', ()=>{
      a.classList.toggle('hidden');
      a.classList.add('fade-in');
      burstConfetti();
      const next = qaItems[idx+1];
      if(next){ next.classList.remove('opacity-50','pointer-events-none'); }
    });
  });

  // Next to reveal page
  const nextToReveal = document.querySelector('#nextToReveal');
  if(nextToReveal){
    nextToReveal.addEventListener('click', ()=>{
      showOnly(revealScreen);
      burstConfetti();
    });
  }

  // Reveal buttons
  const revealYes = document.querySelector('#revealYes');
  const revealNo = document.querySelector('#revealNo');
  if(revealYes){
    revealYes.addEventListener('click', ()=>{
      showOnly(letterScreen);
      burstConfetti();
    });
  }
  if(revealNo){
    revealNo.addEventListener('click', ()=>{
      // playful shake
      revealNo.classList.add('animate-pulse');
      setTimeout(()=>revealNo.classList.remove('animate-pulse'),600);
    });
  }

  if(startGallery){
    startGallery.addEventListener('click', ()=>{
      show(gallerySection);
      setupMusic();
    });
  }

  // 3D Carousel logic
  let images = [];
  let rotation = 0; // degrees
  function computeRadius(){
    const wrap = document.querySelector('.carousel');
    const w = wrap ? wrap.clientWidth : 800;
    return Math.max(200, Math.min(Math.floor(w * 0.55), 460));
  }
  let radius = computeRadius();

  function renderCarousel(){
    if(!carousel) return;
    carousel.innerHTML = '';
    const n = images.length;
    if(n === 0){
      const tip = document.createElement('div');
      tip.className = 'text-center text-gray-600';
      tip.textContent = 'No photos found. Add p1…p50 (.jpg/.jpeg/.png/.webp) into: New folder, assets/photos, assets/images, assets/newphotos, photos, or images.';
      carousel.appendChild(tip);
      return;
    }
    const angleStep = 360 / n;
    images.forEach((src, i)=>{
      const img = document.createElement('img');
      img.src = src;
      img.alt = `photo-${i+1}`;
      const angle = i * angleStep;
      img.style.transformOrigin = `50% 50% -${radius}px`;
      img.style.transform = `translateX(-50%) rotateY(${angle}deg) translateZ(${radius}px) scale(0.75)`;
      carousel.appendChild(img);
    });
    updateRotation();
  }

  function updateRotation(){
    const container = document.querySelector('.carousel-3d');
    if(container){ container.style.transform = `rotateY(${rotation}deg)`; }
  }

  // Discover images in assets/photos with multiple extensions: p1…p50
  const maxN = 50;
  const folders = ['assets/photos','New folder'];
  const exts = ['jpg','jpeg','png','webp','jpg.jpg','JPG','JPEG','PNG','WEBP'];
  const candidates = folders.flatMap(dir =>
    Array.from({length:maxN}, (_,i)=> i+1).flatMap(n =>
      exts.map(ext => `${dir}/p${n}.${ext}`)
    )
  ).map(p=>encodeURI(p));

  if(spinLeft){ spinLeft.addEventListener('click', ()=>{ rotation -= 30; updateRotation(); }); }
  if(spinRight){ spinRight.addEventListener('click', ()=>{ rotation += 30; updateRotation(); }); }

  // Preload and only use images that successfully load so blanks don't appear
  function preloadList(list){
    return Promise.all(list.map(src=>new Promise(res=>{ const im=new Image(); im.onload=()=>res(src); im.onerror=()=>res(null); im.src=src; })));
  }
  preloadList(candidates).then(results=>{
    images = results.filter(Boolean);
    if(images.length===0){
      // If none loaded, keep carousel empty but show a tip
      const tip = document.createElement('div');
      tip.className = 'text-center text-gray-600 mt-6';
      tip.textContent = 'No photos found. Add p1…p50 (.jpg/.jpeg/.png/.webp) into assets/photos, then reload.';
      const ctn = document.querySelector('.carousel-3d');
      if(ctn) ctn.appendChild(tip);
    }
    renderCarousel();
  });

  // Recompute radius on resize for better fit
  window.addEventListener('resize', ()=>{
    radius = computeRadius();
    renderCarousel();
  });

  // Gentle autoplay rotation with pause on hover/touch
  let autoTimer = null;
  function startAuto(){
    if(autoTimer) return;
    autoTimer = setInterval(()=>{ rotation += 0.6; updateRotation(); }, 80);
  }
  function stopAuto(){ if(autoTimer){ clearInterval(autoTimer); autoTimer = null; } }
  startAuto();
  const galleryWrap = document.querySelector('.carousel');
  if(galleryWrap){
    ['mouseenter','touchstart','pointerdown'].forEach(ev=>galleryWrap.addEventListener(ev, stopAuto));
    ['mouseleave','touchend','pointerup'].forEach(ev=>galleryWrap.addEventListener(ev, startAuto));
  }

  // Background music handlers
  function setupMusic(){
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    if(!audio || !btn) return;
    // Set the song file (supports spaces in file name)
    if(!audio.src){
      audio.src = encodeURI('./parugu mp3 song cut.mp3');
    }
    // Keep button label in sync with audio state
    const onPlay = ()=>{ btn.textContent = '⏸'; };
    const onPause = ()=>{ btn.textContent = '♫'; };
    const onEnded = ()=>{ audio.currentTime = 0; btn.textContent = '♫'; };
    audio.removeEventListener('play', onPlay);
    audio.removeEventListener('pause', onPause);
    audio.removeEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    // Toggle play/pause on button click
    btn.onclick = ()=>{
      if(audio.paused){ audio.play(); }
      else{ audio.pause(); }
    };
  }
})();
