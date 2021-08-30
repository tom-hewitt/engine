import { Store } from "@reduxjs/toolkit";
import * as THREE from "three";
import Stack from "../algorithms/stack";
import scene, { Scene, SceneObject, SceneObjectId } from "../reducers/scenes";
import { State } from "../reducers/reducer";
import Controls from "./controls";
import { selectSceneObject } from "../reducers/temp";

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
  id: SceneObjectId,
  object: SceneObject,
  scene: THREE.Scene
): THREE.Object3D => {
  let object3D: THREE.Object3D;
  switch (object.objectType) {
    case "Directional Light": {
      const light = new THREE.DirectionalLight(object.color, object.intensity);

      scene.add(light.target);
      setPosition(light.target, object.lightTarget);

      object3D = light;
      break;
    }
    case "Box": {
      const geometry = new THREE.BoxGeometry(
        object.size.x,
        object.size.y,
        object.size.z
      );

      const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

      object3D = new THREE.Mesh(geometry, material);
      break;
    }
  }

  object3D.name = id;
  object3D.position.set(
    object.position.x,
    object.position.y,
    object.position.z
  );

  return object3D;
};

/**
 * Creates every object in the saved scene tree using a depth-first traversal
 * @param {THREE.Scene} scene The THREE scene to add objects to
 * @param {Level} level The level state
 * @returns A hash table of Object3Ds
 */
const populateScene = (
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

      const object3D = sceneObjectToObject3D(id, object, scene);

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

const dfs = (
  state: Scene,
  callback: (id: SceneObjectId, object: SceneObject) => void
) => {
  if (state.children) {
    const stack = new Stack<SceneObjectId>();

    stack.push(...state.children);

    while (true) {
      const id = stack.pop();

      // If the stack is empty, stop
      if (id === undefined) break;

      const object = state.objects[id];

      if (object.children) stack.push(...object.children);

      callback(id, object);
    }
  }
};

const updateScene = (
  state: Scene,
  scene: THREE.Scene,
  sceneObject3Ds: { [key: string]: THREE.Object3D }
) => {
  dfs(state, (id, object) => {
    let object3D = sceneObject3Ds[id];

    if (object3D) {
      updateObject3D(object, object3D);
    } else {
      object3D = sceneObjectToObject3D(id, object, scene);

      sceneObject3Ds[id] = object3D;
      if (object.parent) {
        sceneObject3Ds[object.parent].add(object3D);
      } else {
        scene.add(object3D);
      }
    }
  });
};

// FOV, aspect, near, far
const defaultCamera = [75, 2, 0.1, 1000];

export const setupScene = (
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

  const raycaster = new THREE.Raycaster();

  const clock = new THREE.Clock();

  let state = store.getState().current.scenes[sceneId];

  const sceneObject3Ds = populateScene(scene, state);

  let renderRequested = false;

  const render = () => {
    renderRequested = false;

    const delta = clock.getDelta();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update(delta);
    renderer.render(scene, camera);
  };

  const requestRender = () => {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  };

  const onClick = (mouse: THREE.Vector2) => {
    raycaster.setFromCamera(mouse, camera);

    const object3D = raycaster.intersectObjects(
      Object.values(sceneObject3Ds)
    )[0];

    const id = object3D ? object3D.object.name : undefined;
    store.dispatch(selectSceneObject({ id, sceneId }));
  };

  const controls = new Controls(camera, canvas, requestRender, onClick);

  window.addEventListener("resize", requestRender);

  const update = () => {
    state = store.getState().current.scenes[sceneId];

    updateScene(state, scene, sceneObject3Ds);
    requestRender();
  };

  store.subscribe(update);

  render();
};
