document.addEventListener('DOMContentLoaded', function() {
  var topTextInput = document.getElementById('top-text');
  var bottomTextInput = document.getElementById('bottom-text');
  var generateBtn = document.getElementById('generate-btn');
  var chaosBtn = document.getElementById('chaos-btn');
  var memeContainer = document.getElementById('meme-container');
  var templateGrid = document.getElementById('template-grid');
  var howToToggle = document.getElementById('how-to-toggle');
  var howToContent = document.getElementById('how-to-content');

  var templates = [
    { top: 'WHEN YOU', bottom: 'FINALLY FIX THE BUG' },
    { top: 'ME EXPLAINING CODE', bottom: 'TO MY RUBBER DUCK' },
    { top: 'IT WORKS', bottom: 'ON MY MACHINE' },
    { top: 'DELETE PRODUCTION DB', bottom: 'OOPS' },
    { top: 'CODE COMPILES', bottom: 'SHIP IT' },
    { top: 'STACK OVERFLOW', bottom: 'COPY PASTE ENGINEER' },
    { top: 'ONE SEMICOLON', bottom: '3 HOURS LATER' },
    { top: 'THIS IS FINE', bottom: 'EVERYTHING IS BURNING' },
    { top: 'REFACTOR LATER', bottom: 'NEVER REFACTORS' },
    { top: 'TESTS PASS', bottom: 'NO TESTS WRITTEN' },
    { top: 'ME REVIEWING PR', bottom: 'LGTM WITHOUT READING' },
    { top: 'WORKING FROM HOME', bottom: 'ACTUALLY WORKING' },
    { top: 'I\'LL ADD COMMENTS', bottom: 'LATER (NEVER)' },
    { top: 'PROD IS DOWN', bottom: 'WHO DEPLOYED FRIDAY?' },
    { top: 'REVIEW MY CODE', bottom: 'PLEASE BE GENTLE' }
  ];

  var gradients = [
    ['#f9d423', '#ff4e50'],
    ['#fc913a', '#f9d423'],
    ['#ff4e50', '#fc913a'],
    ['#e44d26', '#f16529'],
    ['#8e2de2', '#4a00e0'],
    ['#00c6ff', '#0072ff'],
    ['#11998e', '#38ef7d'],
    ['#ee0979', '#ff6a00'],
    ['#7f00ff', '#e100ff'],
    ['#f7971e', '#ffd200'],
    ['#00b09b', '#96c93d'],
    ['#e53935', '#e35d5b'],
    ['#6a11cb', '#2575fc'],
    ['#ff0844', '#ffb199'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
  ];

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function randomGradient() {
    var pair = gradients[Math.floor(Math.random() * gradients.length)];
    return 'linear-gradient(135deg, ' + pair[0] + ', ' + pair[1] + ')';
  }

  function renderTemplates() {
    templates.forEach(function(t) {
      var card = document.createElement('div');
      card.className = 'template-card';
      card.style.background = randomGradient();
      card.innerHTML = '<div class="template-top">' + escapeHtml(t.top) + '</div>' +
                       '<div class="template-bottom">' + escapeHtml(t.bottom) + '</div>';
      card.addEventListener('click', function() {
        generateMeme(t.top, t.bottom);
      });
      templateGrid.appendChild(card);
    });
  }

  function generateMeme(topText, bottomText) {
    var containerWidth = memeContainer.clientWidth;
    var containerHeight = memeContainer.clientHeight;

    var meme = document.createElement('div');
    meme.className = 'meme';
    meme.innerHTML = '<div class="meme-top">' + escapeHtml(topText) + '</div>' +
                     '<div class="meme-bottom">' + escapeHtml(bottomText) + '</div>';

    meme.style.background = randomGradient();

    var memeWidth = Math.min(220, containerWidth - 40);
    meme.style.width = memeWidth + 'px';
    memeContainer.appendChild(meme);

    var memeHeight = meme.offsetHeight;
    var x = memeWidth / 2 + Math.random() * (containerWidth - memeWidth);
    var y = memeHeight / 2 + Math.random() * (containerHeight - memeHeight);

    meme.style.left = (x - memeWidth / 2) + 'px';
    meme.style.top = (y - memeHeight / 2) + 'px';

    window.MemePhysics.createMemeBody(meme, x, y);

    var memeCount = document.querySelectorAll('.meme').length;
    if (memeCount > 30) {
      window.MemePhysics.removeOldestMeme();
    }

    topTextInput.value = '';
    bottomTextInput.value = '';
    topTextInput.focus();
  }

  window.MemePhysics.initPhysics(memeContainer);
  renderTemplates();

  generateBtn.addEventListener('click', function() {
    var topText = topTextInput.value.trim() || 'TOP';
    var bottomText = bottomTextInput.value.trim() || 'BOTTOM';
    generateMeme(topText, bottomText);
  });

  chaosBtn.addEventListener('click', function() {
    window.MemePhysics.applyChaos();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (document.activeElement === topTextInput || document.activeElement === bottomTextInput) {
        generateBtn.click();
      }
    }
  });

  howToToggle.addEventListener('click', function() {
    howToContent.classList.toggle('open');
  });

  document.addEventListener('click', function(e) {
    if (!howToToggle.contains(e.target) && !howToContent.contains(e.target)) {
      howToContent.classList.remove('open');
    }
  });
});