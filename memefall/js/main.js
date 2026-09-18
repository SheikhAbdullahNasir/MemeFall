document.addEventListener('DOMContentLoaded', () => {
  const topTextInput = document.getElementById('top-text');
  const bottomTextInput = document.getElementById('bottom-text');
  const generateBtn = document.getElementById('generate-btn');
  const chaosBtn = document.getElementById('chaos-btn');
  const memeContainer = document.getElementById('meme-container');

  window.MemePhysics.initPhysics(memeContainer);

  generateBtn.addEventListener('click', () => {
    const topText = topTextInput.value.trim() || 'TOP';
    const bottomText = bottomTextInput.value.trim() || 'BOTTOM';

    const meme = document.createElement('div');
    meme.className = 'meme';
    meme.innerHTML = `
      <div class="meme-top">${escapeHtml(topText)}</div>
      <div class="meme-bottom">${escapeHtml(bottomText)}</div>
    `;

    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 40 + Math.random() * 60) % 360;
    meme.style.background = `linear-gradient(135deg, hsl(${hue1}, 80%, 55%), hsl(${hue2}, 80%, 55%))`;

    const rot = (Math.random() - 0.5) * 20;
    meme.style.transform = `rotate(${rot}deg)`;

    const containerWidth = memeContainer.clientWidth;
    const containerHeight = memeContainer.clientHeight;
    const x = 100 + Math.random() * Math.max(1, containerWidth - 200);
    const y = 80 + Math.random() * 100;

    meme.style.left = (x - 90) + 'px';
    meme.style.top = (y - 90) + 'px';

    memeContainer.appendChild(meme);

    window.MemePhysics.createMemeBody(meme, x, y);

    if (window.MemePhysics.removeOldestMeme) {
      const memeCount = document.querySelectorAll('.meme').length;
      if (memeCount > 30) {
        window.MemePhysics.removeOldestMeme();
      }
    }

    topTextInput.value = '';
    bottomTextInput.value = '';
    topTextInput.focus();
  });

  chaosBtn.addEventListener('click', () => {
    window.MemePhysics.applyChaos();
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});