let engine;
let runner;
let memeBodies = [];
let containerElement;
let mouse;
let mouseConstraint;

function createWalls() {
  const { width, height } = containerElement.getBoundingClientRect();
  const thickness = 100;
  const offset = thickness / 2;

  const walls = [
    Matter.Bodies.rectangle(width / 2, -offset, width, thickness, { isStatic: true }),
    Matter.Bodies.rectangle(width / 2, height + offset, width, thickness, { isStatic: true }),
    Matter.Bodies.rectangle(-offset, height / 2, thickness, height, { isStatic: true }),
    Matter.Bodies.rectangle(width + offset, height / 2, thickness, height, { isStatic: true }),
  ];

  walls.forEach(wall => Matter.World.add(engine.world, wall));
  return walls;
}

function updateWalls() {
  Matter.Composite.allBodies(engine.world)
    .filter(body => body.isStatic)
    .forEach(body => Matter.World.remove(engine.world, body));
  createWalls();
}

function initPhysics(container) {
  containerElement = container;

  engine = Matter.Engine.create();
  engine.world.gravity.y = 0.8;

  runner = Matter.Runner.create();

  createWalls();

  mouse = Matter.Mouse.create(containerElement);
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: containerElement,
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Matter.World.add(engine.world, mouseConstraint);

  Matter.Runner.run(runner, engine);

  window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(updateWalls, 150);
  });

  requestAnimationFrame(syncPositions);
}

function syncPositions() {
  memeBodies.forEach(body => {
    if (body.plugin && body.plugin.element) {
      const el = body.plugin.element;
      const rect = el.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      el.style.left = (body.position.x - rect.width / 2) + 'px';
      el.style.top = (body.position.y - rect.height / 2) + 'px';
      el.style.transform = `rotate(${body.angle}rad)`;
    }
  });

  requestAnimationFrame(syncPositions);
}

function createMemeBody(element, x, y) {
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const body = Matter.Bodies.rectangle(x, y, width, height, {
    restitution: 0.6,
    friction: 0.001,
    frictionAir: 0.01,
    angle: (Math.random() - 0.5) * 0.2
  });

  body.plugin = body.plugin || {};
  body.plugin.element = element;

  Matter.World.add(engine.world, body);
  memeBodies.push(body);
}

function applyChaos() {
  memeBodies.forEach(body => {
    Matter.Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05 - 0.02
    });
  });
}

function removeOldestMeme() {
  if (memeBodies.length > 0) {
    const oldest = memeBodies.shift();
    if (oldest.plugin && oldest.plugin.element) {
      oldest.plugin.element.remove();
    }
    Matter.World.remove(engine.world, oldest);
  }
}

window.MemePhysics = {
  initPhysics,
  createMemeBody,
  applyChaos,
  removeOldestMeme
};