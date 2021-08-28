import { Store } from "@reduxjs/toolkit";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stack from "../algorithms/stack";
import { Scene, SceneObject, SceneObjectId } from "../reducers/scenes";
import { State } from "../reducers/reducer";

const setPosition = (object: THREE.Object3D, vector: vector3d) => {
  object.position.set(vector.x, vector.y, vector.z);
};

const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

const sceneObjectToObject3D = (
  object: SceneObject,
  scene: THREE.Scene
): THREE.Object3D => {
  switch (object.objectType) {
    case "Directional Light": {
      const light = new THREE.DirectionalLight(object.color, object.intensity);

      scene.add(light.target);
      setPosition(light.target, object.lightTarget);

      return light;
    }
    case "Box": {
      const geometry = new THREE.BoxGeometry(
        object.size.x,
        object.size.y,
        object.size.z
      );

      const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

      return new THREE.Mesh(geometry, material);
    }
  }
};

/**
 * Creates every object in the saved scene tree using a depth-first traversal
 * @param {THREE.Scene} scene The THREE scene to add objects to
 * @param {Level} level The level state
 * @returns A hash table of Object3Ds
 */
export const populateScene = (
  scene: THREE.Scene,
  state: Scene
): { [key: string]: THREE.Object3D } => {
  const sceneObject3Ds: { [key: string]: THREE.Object3D } = {};

  if (state.children) {
    const stack = new Stack<SceneObjectId>();

    stack.push(...state.children);

    while (true) {
      const id = stack.pop();

      // If the stack is empty, stop
      if (id === undefined) break;

      const object = state.objects[id];

      if (object.children) stack.push(...object.children);

      const object3D = sceneObjectToObject3D(object, scene);

      // Every type of object has a position
      setPosition(object3D, object.position);

      sceneObject3Ds[id] = object3D;
      if (object.parent) {
        sceneObject3Ds[object.parent].add(object3D);
      } else {
        scene.add(object3D);
      }
    }
  }

  return sceneObject3Ds;
};

const updateObject3D = (object: SceneObject, object3D: THREE.Object3D) => {
  setPosition(object3D, object.position);
  switch (object.objectType) {
    case "Directional Light": {
    }
  }
};

const updateScene = (
  state: Scene,
  scene: THREE.Scene,
  sceneObject3Ds: { [key: string]: THREE.Object3D }
) => {
  if (state.children) {
    const stack = new Stack<SceneObjectId>();

    stack.push(...state.children);

    while (true) {
      const id = stack.pop();

      // If the stack is empty, stop
      if (id === undefined) break;

      const object = state.objects[id];
      let object3D = sceneObject3Ds[id];

      if (object.children) stack.push(...object.children);

      if (object3D) {
        updateObject3D(object, object3D);
      } else {
        object3D = sceneObjectToObject3D(object, scene);

        // Every type of object has a position
        setPosition(object3D, object.position);

        sceneObject3Ds[id] = object3D;
        if (object.parent) {
          sceneObject3Ds[object.parent].add(object3D);
        } else {
          scene.add(object3D);
        }
      }
    }
  }
};

// FOV, aspect, near, far
const defaultCamera = [75, 2, 0.1, 5];

export const setupLevel = (
  canvas: HTMLCanvasElement,
  store: Store<State>,
  sceneId: string
) => {
  const renderer = new THREE.WebGLRenderer({ canvas });
  resizeRendererToDisplaySize(renderer);

  const camera = new THREE.PerspectiveCamera(...defaultCamera);
  camera.position.z = 2;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xececec);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.update();

  let state = store.getState().current.scenes[sceneId];

  const sceneObject3Ds = populateScene(scene, state);

  let renderRequested = false;

  const render = () => {
    renderRequested = false;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
  };

  const requestRender = () => {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  };

  controls.addEventListener("change", requestRender);
  window.addEventListener("resize", requestRender);

  const update = () => {
    state = store.getState().current.scenes[sceneId];

    updateScene(state, scene, sceneObject3Ds);
    requestRender();
  };

  store.subscribe(update);

  render();
};
