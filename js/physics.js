let engine;
let runner;
let memeBodies = [];
let containerElement;
let mouse;
let mouseConstraint;
let walls = [];

function getContainerBounds() {
  const rect = containerElement.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function createWalls() {
  const { width, height } = getContainerBounds();
  const t = 100;

  walls = [
    Matter.Bodies.rectangle(width / 2, height + t / 2, width + t * 2, t, { isStatic: true, restitution: 0.6 }),
    Matter.Bodies.rectangle(width / 2, -t / 2, width + t * 2, t, { isStatic: true, restitution: 0.6 }),
    Matter.Bodies.rectangle(-t / 2, height / 2, t, height + t * 2, { isStatic: true, restitution: 0.6 }),
    Matter.Bodies.rectangle(width + t / 2, height / 2, t, height + t * 2, { isStatic: true, restitution: 0.6 }),
  ];

  Matter.Composite.add(engine.world, walls);
}

function updateWalls() {
  walls.forEach(function(w) {
    Matter.Composite.remove(engine.world, w);
  });
  walls = [];
  createWalls();
}

function initPhysics(container) {
  containerElement = container;

  engine = Matter.Engine.create();
  engine.world.gravity.y = 1;

  runner = Matter.Runner.create();

  createWalls();

  mouse = Matter.Mouse.create(containerElement);
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      damping: 0.1,
      render: { visible: false }
    }
  });

  Matter.Composite.add(engine.world, mouseConstraint);
  Matter.Runner.run(runner, engine);

  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateWalls, 200);
  });

  requestAnimationFrame(syncPositions);
}

function syncPositions() {
  var bounds = getContainerBounds();
  for (var i = 0; i < memeBodies.length; i++) {
    var body = memeBodies[i];
    if (body.plugin && body.plugin.element) {
      var el = body.plugin.element;
      var hw = el.offsetWidth / 2;
      var hh = el.offsetHeight / 2;

      var px = Math.max(hw, Math.min(bounds.width - hw, body.position.x));
      var py = Math.max(hh, Math.min(bounds.height - hh, body.position.y));

      el.style.left = (px - hw) + 'px';
      el.style.top = (py - hh) + 'px';
      el.style.transform = 'rotate(' + body.angle + 'rad)';
    }
  }
  requestAnimationFrame(syncPositions);
}

function createMemeBody(element, x, y) {
  var bounds = getContainerBounds();
  var width = element.offsetWidth;
  var height = element.offsetHeight;

  x = Math.max(width / 2, Math.min(bounds.width - width / 2, x));
  y = Math.max(height / 2, Math.min(bounds.height - height / 2, y));

  var body = Matter.Bodies.rectangle(x, y, width, height, {
    restitution: 0.7,
    friction: 0.05,
    frictionAir: 0.005,
    density: 0.001,
    angle: (Math.random() - 0.5) * 0.3
  });

  body.plugin = body.plugin || {};
  body.plugin.element = element;

  Matter.Composite.add(engine.world, body);
  memeBodies.push(body);
}

function applyChaos() {
  memeBodies.forEach(function(body) {
    var forceX = (Math.random() - 0.5) * 0.2;
    var forceY = (Math.random() - 0.7) * 0.2;

    Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5);
  });
}

function removeOldestMeme() {
  if (memeBodies.length > 0) {
    var oldest = memeBodies.shift();
    if (oldest.plugin && oldest.plugin.element) {
      oldest.plugin.element.remove();
    }
    Matter.Composite.remove(engine.world, oldest);
  }
}

window.MemePhysics = {
  initPhysics: initPhysics,
  createMemeBody: createMemeBody,
  applyChaos: applyChaos,
  removeOldestMeme: removeOldestMeme
};