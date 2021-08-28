import { Store } from "@reduxjs/toolkit";
import * as THREE from "three";
import Stack from "../algorithms/stack";
import {
  Level,
  LevelsState,
  SceneObject,
  SceneObjectId,
} from "../reducers/levels";
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
  level: Level
): { [key: string]: THREE.Object3D } => {
  const sceneObject3Ds: { [key: string]: THREE.Object3D } = {};

  if (level.children) {
    const stack = new Stack<SceneObjectId>();

    stack.push(...level.children);

    while (true) {
      const id = stack.pop();

      // If the stack is empty, stop
      if (id === undefined) break;

      const object = level.scene[id];

      if (object.children) stack.push(...object.children);

      const object3D = sceneObjectToObject3D(object, scene);

      // Every type of object has a position
      setPosition(object3D, object.position);

      sceneObject3Ds[id] = object3D;
      scene.add(object3D);
    }
  }

  return sceneObject3Ds;
};

// FOV, aspect, near, far
const defaultCamera = [75, 2, 0.1, 5];

export const setupLevel = (
  canvas: HTMLCanvasElement,
  store: Store<State>,
  levelId: string
) => {
  const renderer = new THREE.WebGLRenderer({ canvas });
  resizeRendererToDisplaySize(renderer);

  const camera = new THREE.PerspectiveCamera(...defaultCamera);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const level = store.getState().current.levels[levelId];

  const sceneObject3Ds = populateScene(scene, level);

  const render = () => {
    renderer.render(scene, camera);
  };

  render();
};
