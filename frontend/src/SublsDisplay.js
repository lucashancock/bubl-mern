import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function SublsDisplay({ bubbles, onBubbleClick }) {
  const clickStartTime = useRef(0);
  const selectedBubl = useRef("");

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
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "white", // set the background to white
      },
    });

    // list of objects with string and size

    // common circle properties
    const circleProperties = {
      friction: 0.1,
      frictionAir: 0.25, // air resistance for dampening
      restitution: 0.7, // bounciness
      render: {
        fillStyle: "transparent", // transparent fill
        strokeStyle: "grey", // black outline
        lineWidth: 2, // outline width
      },
    };

    // create circles from the bubbles list
    const circles = bubbles.map((bubble) => {
      //   console.log("here", bubble);
      let size = 50;
      if (bubble.numPhotos < 2) {
        size = 100;
      } else if (bubble.numPhotos < 5) {
        size = 150;
      } else if (bubble.numPhotos < 7) {
        size = 175;
      } else {
        size = 200;
      }
      return Bodies.circle(
        render.options.width / 2 +
          Math.floor(Math.random() * (50 - 20 + 1)) +
          20,
        render.options.height / 2 +
          Math.floor(Math.random() * (50 - 20 + 1)) +
          20,
        size,
        {
          ...circleProperties,
          label: bubble.photo_group,
        }
      );
    });

    // function to create walls
    const createWalls = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const floor = Bodies.rectangle(
        screenWidth / 2,
        screenHeight + 30,
        screenWidth,
        60,
        { isStatic: true }
      );
      const ceiling = Bodies.rectangle(screenWidth / 2, -30, screenWidth, 60, {
        isStatic: true,
      });
      const leftWall = Bodies.rectangle(
        -30,
        screenHeight / 2,
        60,
        screenHeight,
        { isStatic: true }
      );
      const rightWall = Bodies.rectangle(
        screenWidth + 30,
        screenHeight / 2,
        60,
        screenHeight,
        { isStatic: true }
      );
      return [floor, ceiling, leftWall, rightWall];
    };

    // add walls
    let walls = createWalls();
    Composite.add(engine.world, [...circles, ...walls]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.01,
        render: {
          visible: false,
        },
      },
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
    Events.on(engine, "beforeUpdate", function (event) {
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic) continue;
        const forceMagnitude = 0.003 * body.mass; // reduced force magnitude
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
    circles.forEach((circle) => {
      originalScales[circle.id] = circle.circleRadius;
      targetScales[circle.id] = circle.circleRadius;
    });

    Events.on(mouseConstraint, "mousemove", function (event) {
      const mousePosition = event.mouse.position;
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic || body.label === "wall") continue;

        const distance = Vector.magnitude(
          Vector.sub(mousePosition, body.position)
        );
        if (distance < originalScales[body.id]) {
          targetScales[body.id] = originalScales[body.id] * 1.2;
        } else {
          targetScales[body.id] = originalScales[body.id];
        }
      }
    });

    // smooth scaling
    Events.on(engine, "beforeUpdate", function (event) {
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

    Events.on(mouseConstraint, "mousedown", function (event) {
      clickStartTime.current = new Date().getTime();

      const mousePosition = event.mouse.position;
      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic || body.label === "wall") continue;

        if (Matter.Vertices.contains(body.vertices, mousePosition)) {
          //   console.log(body.label);
          selectedBubl.selection = body.label; // set state to the label of the clicked bubble
          break;
        }
      }
    });

    Events.on(mouseConstraint, "mouseup", function (event) {
      const clickEndTime = new Date().getTime();
      if (clickEndTime - clickStartTime.current < 100) {
        onBubbleClick(selectedBubl.selection);
        // console.log("click");
      }
    });

    // render text in circles
    const renderText = () => {
      const context = render.context;
      context.font = "20px Arial";
      context.fillStyle = "black";

      const bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.label && !body.isStatic) {
          const { x, y } = body.position;
          const text = body.label;
          const textWidth = context.measureText(text).width;
          context.fillText(text, x - textWidth / 2, y + 10);
        }
      }
    };

    // run render text in a loop
    (function renderLoop() {
      Render.world(render);
      renderText();
      requestAnimationFrame(renderLoop);
    })();

    // handle window resize
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      render.options.width = screenWidth;
      render.options.height = screenHeight;
      render.canvas.width = screenWidth;
      render.canvas.height = screenHeight;

      // remove old walls and add new ones
      Composite.remove(engine.world, walls);
      walls = createWalls();
      Composite.add(engine.world, walls);
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [bubbles]);

  return <div></div>;
}
