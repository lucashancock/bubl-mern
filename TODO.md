- Permissions and tiers 

- Implement capacity on # of active user bubls. Join certain numbers for different tiers.
    - 1 active free tier

- Invite functionality
    - In the future, send email

- Things to look into before beta test:
    - Expiration of photos and bubls needs to be implemented
    - token expiration and refresh token mechanisms
    - https to encrpyt data in transit between client and server
    - look into whether or not my encryption methods are good
    - input validation on client AND server side
    - Look into session management to track user sessions securely. 
    - Robust error handling mechanisms and frontend reactive displays when something goes wrong. (already have some, but not all. some will just throw error message to console.)
    - Get rid of all error messages showing up in the developer console on browser
    - notifications for new uploads, comments, or likes.
    - pagination for when there is lots of photos.
        - optimization of app. look into webRTC again for socket based connection instead of pinging the backend API every second for update
        - OR implement a refresh button/functionality.

- Admin page in the bubls menu where the edit and delete are...
    - multiselect dropdown menu for kicking.

- implement tags maybe?

- get rid of invalid bubls from bubls page with negative days before mongo deletes them

- select photos functionality for downloading/liking

BUBL SELECTION EXAMPLE FROM CHATGPT NO HOVER EFFECT

```
import React, { useEffect } from 'react';
import Matter from "matter-js";

export function App(props) {
  useEffect(() => {
    // module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Vector = Matter.Vector,
          Events = Matter.Events;

    // create an engine
    const engine = Engine.create();

    // turn normal gravity off
    engine.gravity.scale = 0;

    // create a renderer
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // common circle properties
    const circleProperties = {
      friction: 0.1,
      frictionAir: 0.05, // air resistance for dampening
      restitution: 0.7   // bounciness
    };

    // create 5 circles of varying sizes with properties
    const circleA = Bodies.circle(200, 200, 30, circleProperties);
    const circleB = Bodies.circle(300, 200, 40, circleProperties);
    const circleC = Bodies.circle(400, 200, 50, circleProperties);
    const circleD = Bodies.circle(500, 200, 60, circleProperties);
    const circleE = Bodies.circle(600, 200, 70, circleProperties);

    // create walls
    const floor = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    const ceiling = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, 300, 60, 620, { isStatic: true });
    const rightWall = Bodies.rectangle(810, 300, 60, 620, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [circleA, circleB, circleC, circleD, circleE, floor, ceiling, leftWall, rightWall]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // gravity towards the center
    Events.on(engine, 'beforeUpdate', function(event) {
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic) continue;
        const forceMagnitude = 0.001 * body.mass; // reduced force magnitude
        const centerX = render.options.width / 2;
        const centerY = render.options.height / 2;
        const direction = Vector.sub({ x: centerX, y: centerY }, body.position);
        const force = Vector.normalise(direction);
        const finalForce = Vector.mult(force, forceMagnitude);
        Matter.Body.applyForce(body, body.position, finalForce);
      }
    });

    // cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div>
      <h1>Click and drag the circles</h1>
    </div>
  );
}

```


BUBL STUFF WITH HOVER EFFECT

```
import React, { useEffect } from 'react';
import Matter from "matter-js";

export function App(props) {
  useEffect(() => {
    // module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Vector = Matter.Vector,
          Events = Matter.Events;

    // create an engine
    const engine = Engine.create();

    // turn normal gravity off
    engine.gravity.scale = 0;

    // create a renderer
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // common circle properties
    const circleProperties = {
      friction: 0.1,
      frictionAir: 0.05, // air resistance for dampening
      restitution: 0.7   // bounciness
    };

    // create 5 circles of varying sizes with properties
    const circleA = Bodies.circle(200, 200, 30, { ...circleProperties, label: 'circleA' });
    const circleB = Bodies.circle(300, 200, 40, { ...circleProperties, label: 'circleB' });
    const circleC = Bodies.circle(400, 200, 50, { ...circleProperties, label: 'circleC' });
    const circleD = Bodies.circle(500, 200, 60, { ...circleProperties, label: 'circleD' });
    const circleE = Bodies.circle(600, 200, 70, { ...circleProperties, label: 'circleE' });

    // create walls
    const floor = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    const ceiling = Bodies.rectangle(400, -10, 810, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, 300, 60, 620, { isStatic: true });
    const rightWall = Bodies.rectangle(810, 300, 60, 620, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [circleA, circleB, circleC, circleD, circleE, floor, ceiling, leftWall, rightWall]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // gravity towards the center
    Events.on(engine, 'beforeUpdate', function(event) {
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic) continue;
        const forceMagnitude = 0.001 * body.mass; // reduced force magnitude
        const centerX = render.options.width / 2;
        const centerY = render.options.height / 2;
        const direction = Vector.sub({ x: centerX, y: centerY }, body.position);
        const force = Vector.normalise(direction);
        const finalForce = Vector.mult(force, forceMagnitude);
        Matter.Body.applyForce(body, body.position, finalForce);
      }
    });

    // custom lerp function
    const lerp = (start, end, t) => {
      return start + (end - start) * t;
    };

    // handle hover effect
    let originalScales = {};
    let targetScales = {};

    // Initialize original scales
    const circles = [circleA, circleB, circleC, circleD, circleE];
    circles.forEach(circle => {
      originalScales[circle.id] = circle.circleRadius;
      targetScales[circle.id] = circle.circleRadius;
    });

    Events.on(mouseConstraint, 'mousemove', function(event) {
      const mousePosition = event.mouse.position;
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic || body.label === 'wall') continue;

        const distance = Vector.magnitude(Vector.sub(mousePosition, body.position));
        if (distance < originalScales[body.id]) {
          targetScales[body.id] = originalScales[body.id] * 1.2;
        } else {
          targetScales[body.id] = originalScales[body.id];
        }
      }
    });

    // smooth scaling
    Events.on(engine, 'beforeUpdate', function(event) {
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (originalScales[body.id] && targetScales[body.id]) {
          const currentScale = body.circleRadius;
          const targetScale = targetScales[body.id];
          if (Math.abs(currentScale - targetScale) > 0.1) {
            const scaleFactor = 0.05; // Adjust this value to control the speed of the transition
            const newRadius = lerp(currentScale, targetScale, scaleFactor);
            const scaleRatio = newRadius / currentScale;
            Matter.Body.scale(body, scaleRatio, scaleRatio);
          }
        }
      }
    });

    // cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div>
      <h1>Click and drag the circles</h1>
    </div>
  );
}

```