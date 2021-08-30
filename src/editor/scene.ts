import { Store } from "@reduxjs/toolkit";
import * as THREE from "three";
import Stack from "../algorithms/stack";
import { Scene, SceneObject, SceneObjectId } from "../reducers/scenes";
import { State } from "../reducers/reducer";
import Controls from "./controls";
import { selectSceneObject } from "../reducers/temp";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

const setPosition = (object: THREE.Object3D, vector: vector3d) => {
  object.position.set(vector.x, vector.y, vector.z);
};

const updateObject3D = (object: SceneObject, object3D: THREE.Object3D) => {
  setPosition(object3D, object.position);
  switch (object.objectType) {
    case "Directional Light": {
    }
  }
};

// [FOV, aspect, near, far]
const defaultCamera = [75, 2, 0.1, 1000];

/**
 * Sets up an editor scene to render
 * @param {HTMLCanvasElement} canvas The canvas element to render the scene on
 * @param store The app redux store
 * @param sceneId The id of the scene to render
 */
export const setupScene = (
  canvas: HTMLCanvasElement,
  store: Store<State>,
  sceneId: string
) => {
  const pixelRatio = window.devicePixelRatio;

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width * pixelRatio, height * pixelRatio, false);
  let renderRequested = false;

  const camera = new THREE.PerspectiveCamera(...defaultCamera);
  camera.position.z = 2;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xececec);

  const effectComposer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  const outlinePass = new OutlinePass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    scene,
    camera
  );
  effectComposer.addPass(outlinePass);

  const antialiasPass = new ShaderPass(FXAAShader);
  antialiasPass.uniforms.resolution.value.set(
    (1 / width) * pixelRatio,
    (1 / height) * pixelRatio
  );
  effectComposer.addPass(antialiasPass);

  const raycaster = new THREE.Raycaster();

  const clock = new THREE.Clock();

  let state = store.getState().current.scenes[sceneId];

  /**
   * Turns a scene object from the saved state into a 3D object that
   * can be rendered
   * @param {SceneObjectId} id The id of the scene object, so it can be
   * added to the 3D object
   * @param {SceneObject} object The scene object as it is saved in state
   * @returns {THREE.Object3D} The 3D object representation of the scene object
   */
  const sceneObjectToObject3D = (
    id: SceneObjectId,
    object: SceneObject
  ): THREE.Object3D => {
    let object3D: THREE.Object3D;
    switch (object.objectType) {
      case "Directional Light": {
        const light = new THREE.DirectionalLight(
          object.color,
          object.intensity
        );

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
   * Creates every object in the saved scene tree using a depth-first
   * traversal
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

        const object3D = sceneObjectToObject3D(id, object);

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

  const sceneObject3Ds = populateScene(scene, state);

  /**
   * Renders the scene and updates the controls
   */
  const render = () => {
    renderRequested = false;

    const delta = clock.getDelta();

    controls.update(delta);
    effectComposer.render();
  };

  /**
   * Requests for the scene to be rerendered after the current frame has
   * finished
   */
  const requestRender = () => {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  };

  /**
   * Finds the 3D object that has been clicked by drawing a raycast
   * @param {THREE.Vector2} mouse The coordinates of the click on a scale of
   * -1 to 1
   */
  const onClick = (mouse: THREE.Vector2) => {
    raycaster.setFromCamera(mouse, camera);

    const object3D = raycaster.intersectObjects(
      Object.values(sceneObject3Ds)
    )[0];

    const id = object3D ? object3D.object.name : undefined;
    store.dispatch(selectSceneObject({ id, sceneId }));
  };

  const controls = new Controls(camera, canvas, requestRender, onClick);

  /**
   * Updates the camera, renderer and postprocessor to fit the new window size
   */
  const onWindowResize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width * pixelRatio, height * pixelRatio, false);
    effectComposer.setSize(width * pixelRatio, height * pixelRatio);

    requestRender();
  };

  window.addEventListener("resize", onWindowResize);

  let selectedObject: SceneObjectId | undefined = undefined;

  /**
   * Performs a depth first traversal of the scene tree
   * @param callback The function to be performed on each item in order
   */
  const dfs = (callback: (id: SceneObjectId, object: SceneObject) => void) => {
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

  /**
   * Reacts to a change in the app's state by performing a depth first traversal
   * of the scene tree
   */
  const updateScene = () => {
    dfs((id, object) => {
      let object3D = sceneObject3Ds[id];

      if (object3D) {
        updateObject3D(object, object3D);
      } else {
        object3D = sceneObjectToObject3D(id, object);

        sceneObject3Ds[id] = object3D;
        if (object.parent) {
          sceneObject3Ds[object.parent].add(object3D);
        } else {
          scene.add(object3D);
        }
      }
    });
  };

  /**
   * If the object that is currently selected by the user has changed, update the
   * outline effect to reflect the change
   */
  const updateSelectedObject = () => {
    const newSelectedObject = store.getState().temp.selectedSceneObject;

    if (newSelectedObject !== selectedObject) {
      selectedObject = newSelectedObject;
      outlinePass.selectedObjects = newSelectedObject
        ? [sceneObject3Ds[newSelectedObject]]
        : [];
    }
  };

  /**
   * Reacts to an update in the app's state
   */
  const update = () => {
    state = store.getState().current.scenes[sceneId];

    updateScene();
    updateSelectedObject();
    requestRender();
  };

  store.subscribe(update);

  render();

  // Return dispose function to cleanup
  return function dispose() {
    renderer.dispose();
    outlinePass.dispose();
    controls.dispose();
  };
};
