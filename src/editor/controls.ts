import * as THREE from "three";
import { normalise, multiply, modulus } from "../utils/vectorMath";

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

/**
 * Editor controls that can move, look around and select objects
 */
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

  mouseDown = false;

  private mouseMoved = false;

  private mouseMovementX = 0;
  private mouseMovementY = 0;

  private lon = 0;
  private lat = 0;

  private targetPosition = new THREE.Vector3();

  private mouse = new THREE.Vector2();

  update: (delta: number) => void;

  dispose: () => void;

  /**
   * Create editor controls
   * @param {THREE.Camera} camera The camera
   * @param {HTMLElement} domElement The HTML element that the scene is being rendered onto
   * @param {() => void} onUpdate Callback function for when there is a change in user input or otherwise
   * @param {(mouse: THREE.Vector2) => void} onClick Callback function for when the user clicks
   */
  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    onUpdate: () => void,
    onClick: (mouse: THREE.Vector2) => void
  ) {
    this.camera = camera;
    this.domElement = domElement;

    const onKeyDown = (event: KeyboardEvent) => {
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

    const onKeyUp = (event: KeyboardEvent) => {
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

    const onMouseDown = (event: MouseEvent) => {
      this.domElement.focus();

      this.mouseDown = true;
    };

    const onMouseUp = (event: MouseEvent) => {
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

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const onMouseMove = (event: MouseEvent) => {
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

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    this.domElement.addEventListener("mousedown", onMouseDown);
    this.domElement.addEventListener("mouseup", onMouseUp);
    this.domElement.addEventListener("contextmenu", onContextMenu);
    this.domElement.addEventListener("mousemove", onMouseMove);

    this.dispose = () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      this.domElement.removeEventListener("mousedown", onMouseDown);
      this.domElement.removeEventListener("mouseup", onMouseUp);
      this.domElement.removeEventListener("contextmenu", onContextMenu);
      this.domElement.removeEventListener("mousemove", onMouseMove);
    };
  }
}
