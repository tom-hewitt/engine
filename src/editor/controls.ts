import * as THREE from "three";
import { normalise, multiply, modulus } from "../math/vectorMath";

interface Directions {
  forwards: boolean;
  backwards: boolean;
  right: boolean;
  left: boolean;
  up: boolean;
  down: boolean;
}

const vectorFromDirections = (directions: Directions) => {
  return {
    x:
      directions.right && !directions.left
        ? 1
        : directions.left && !directions.right
        ? -1
        : 0,
    y:
      directions.up && !directions.down
        ? 1
        : directions.down && !directions.up
        ? -1
        : 0,
    z:
      directions.forwards && !directions.backwards
        ? -1
        : directions.backwards && !directions.forwards
        ? 1
        : 0,
  };
};

export default class Controls {
  camera: THREE.Camera;
  domElement: HTMLElement;

  speed = 1;

  sensitivity = 0.5;

  input = {
    forwards: false,
    backwards: false,
    right: false,
    left: false,
    up: false,
    down: false,
  };

  isMoving = false;

  rightClick = false;

  mouseDown = false;

  mouseMoved = false;

  mouseMovementX = 0;
  mouseMovementY = 0;

  private lon = 0;
  private lat = 0;

  private targetPosition = new THREE.Vector3();

  private mouse = new THREE.Vector2();

  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: (event: KeyboardEvent) => void;

  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onContextMenu: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;

  update: (delta: number) => void;

  dispose: () => void;

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    onUpdate: () => void,
    onClick: (mouse: THREE.Vector2) => void
  ) {
    this.camera = camera;
    this.domElement = domElement;

    this.onKeyDown = (event) => {
      if (this.mouseDown) {
        switch (event.code) {
          // Forwards
          case "ArrowUp":
          case "KeyW":
            this.input.forwards = true;
            break;

          // Backwards
          case "ArrowDown":
          case "KeyS":
            this.input.backwards = true;
            break;

          // Right
          case "ArrowRight":
          case "KeyD":
            this.input.right = true;
            break;

          // Left
          case "ArrowLeft":
          case "KeyA":
            this.input.left = true;
            break;

          // Up
          case "Space":
          case "KeyE":
            this.input.up = true;
            break;

          // Down
          case "ControlLeft":
          case "KeyQ":
            this.input.down = true;
            break;
        }
        onUpdate();
      }
    };

    this.onKeyUp = (event) => {
      if (this.mouseDown) {
        switch (event.code) {
          // Forwards
          case "ArrowUp":
          case "KeyW":
            this.input.forwards = false;
            break;

          // Backwards
          case "ArrowDown":
          case "KeyS":
            this.input.backwards = false;
            break;

          // Right
          case "ArrowRight":
          case "KeyD":
            this.input.right = false;
            break;

          // Left
          case "ArrowLeft":
          case "KeyA":
            this.input.left = false;
            break;

          // Up
          case "Space":
          case "KeyE":
            this.input.up = false;
            break;

          // Down
          case "ControlLeft":
          case "KeyQ":
            this.input.down = false;
            break;
        }
        onUpdate();
      }
    };

    this.onMouseDown = (event) => {
      this.domElement.focus();

      this.mouseDown = true;
    };

    this.onMouseUp = (event) => {
      this.mouseDown = false;

      if (this.mouseMoved) {
        this.domElement.blur();

        this.mouseMoved = false;
        this.domElement.style.cursor = "default";

        this.input = {
          forwards: false,
          backwards: false,
          right: false,
          left: false,
          up: false,
          down: false,
        };
      } else {
        this.mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.domElement.clientHeight) * 2 + 1;
        onClick(this.mouse);
      }
    };

    this.onContextMenu = (event) => {
      event.preventDefault();
    };

    this.onMouseMove = (event) => {
      if (this.mouseDown) {
        if (!this.mouseMoved) {
          this.mouseMoved = true;
          this.domElement.style.cursor = "all-scroll";
        }
        this.mouseMovementX = event.movementX;
        this.mouseMovementY = event.movementY;
        onUpdate();
      }
    };

    this.update = (delta) => {
      const vector = vectorFromDirections(this.input);

      // Update the the frame after input, so delta is accurate
      if (this.isMoving) {
        const movementInput = multiply(normalise(vector), delta * this.speed);

        this.camera.translateX(movementInput.x);
        this.camera.translateY(movementInput.y);
        this.camera.translateZ(movementInput.z);
      }

      // If moving, continue rendering
      if (modulus(vector) > 0) {
        this.isMoving = true;
        onUpdate();
      } else {
        this.isMoving = false;
      }

      if (this.mouseDown && (this.mouseMovementX || this.mouseMovementY)) {
        this.lon -= this.mouseMovementX * this.sensitivity;
        this.lat -= this.mouseMovementY * this.sensitivity;

        // Don't let the camera rotate more than vertical
        this.lat = Math.max(-85, Math.min(85, this.lat));

        const phi = THREE.MathUtils.degToRad(90 - this.lat);
        const theta = THREE.MathUtils.degToRad(this.lon + 180);

        const position = this.camera.position;

        const radius = 1;

        this.targetPosition
          .setFromSphericalCoords(radius, phi, theta)
          .add(position);

        this.camera.lookAt(this.targetPosition);
      }
    };

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    this.domElement.addEventListener("mousedown", this.onMouseDown);
    this.domElement.addEventListener("mouseup", this.onMouseUp);
    this.domElement.addEventListener("contextmenu", this.onContextMenu);
    this.domElement.addEventListener("mousemove", this.onMouseMove);

    this.dispose = () => {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
      this.domElement.removeEventListener("mousedown", this.onMouseDown);
      this.domElement.removeEventListener("mouseup", this.onMouseUp);
      this.domElement.removeEventListener("contextmenu", this.onContextMenu);
      this.domElement.removeEventListener("mousemove", this.onMouseMove);
    };
  }
}
