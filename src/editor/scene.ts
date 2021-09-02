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
import { MaterialId } from "../reducers/materials";
import { Geometry, MeshId, PrimitiveGeometry } from "../reducers/meshes";

const setPosition = (object: THREE.Object3D, vector: vector3d) => {
  object.position.set(vector.x, vector.y, vector.z);
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
  // The ratio of physical pixels to CSS pixels. Larger than 1 on HD-DPI displays
  const pixelRatio = window.devicePixelRatio;

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  // Setup the renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width * pixelRatio, height * pixelRatio, false);
  let renderRequested = false;

  // Setup the camera
  const camera = new THREE.PerspectiveCamera(...defaultCamera);
  camera.position.z = 2;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Setup the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xececec);

  // Setup the postprocessing effect chain
  const effectComposer = new EffectComposer(renderer);
  // Setup the render pass
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);
  // Setup the outline effect pass, which is used to highlight the selected object
  const outlinePass = new OutlinePass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    scene,
    camera
  );
  effectComposer.addPass(outlinePass);
  // Setup the antialias pass
  const antialiasPass = new ShaderPass(FXAAShader);
  antialiasPass.uniforms.resolution.value.set(
    (1 / width) * pixelRatio,
    (1 / height) * pixelRatio
  );
  effectComposer.addPass(antialiasPass);

  // Setup the raycaster, which lets the user interact with 3D objects with their cursor
  const raycaster = new THREE.Raycaster();

  // Setup the clock, which keeps track of the time between frames
  const clock = new THREE.Clock();

  // Get the state of the application
  let state = store.getState();

  /**
   * @returns The current state of the scene
   */
  const sceneState = () => state.current.scenes[sceneId];

  /**
   * Helper function to create primitive geometries
   * @param {PrimitiveGeometry} geometry The saved geometry
   * @returns {THREE.BufferGeometry} A THREE geometry representing the save geometry
   */
  const createPrimitiveGeometry = (geometry: PrimitiveGeometry) => {
    switch (geometry.primitive) {
      case "Box": {
        return new THREE.BoxGeometry(1, 1, 1);
      }
      case "Plane": {
        return new THREE.PlaneGeometry(1, 1);
      }
    }
  };

  /**
   * Creates a THREE geometry from the given saved geometry
   * @param {Geometry} geometry The saved geometry
   * @returns {THREE.BufferGeometry} A THREE geometry representing the saved geometry
   */
  const createGeometry = (geometry: Geometry) => {
    switch (geometry.type) {
      case "Primitive": {
        return createPrimitiveGeometry(geometry);
      }
    }
  };

  /**
   * Creates a THREE material from a saved material
   * @param {MaterialId} materialId The id of the saved material
   * @returns {THREE.Material} A THREE material representing the saved material
   */
  const createMaterial = (materialId: MaterialId) => {
    const material = state.current.materials[materialId];

    switch (material.type) {
      case "Phong": {
        return new THREE.MeshPhongMaterial({ color: material.color });
      }
    }
  };

  /**
   * Creates a mesh 3D object from a saved mesh
   * @param {MeshId} meshId The id of the mesh
   * @returns {THREE.Mesh} A 3D object representing the saved mesh
   */
  const createMesh = (meshId: MeshId) => {
    const mesh = state.current.meshes[meshId];

    const geometry = createGeometry(mesh.geometry);
    const material = createMaterial(mesh.material);

    return new THREE.Mesh(geometry, material);
  };

  /**
   * Creates a 3d object from a saved scene object
   * @param {SceneObjectId} id The id of the scene object, so it can be
   * added to the 3D object
   * @param {SceneObject} object The scene object as it is saved in state
   * @returns {THREE.Object3D} The 3D object representation of the scene object
   */
  const createObject3D = (
    id: SceneObjectId,
    object: SceneObject
  ): THREE.Object3D => {
    let object3D: THREE.Object3D;
    switch (object.type) {
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
      case "Mesh": {
        object3D = createMesh(object.mesh);
        object3D.scale.set(object.size.x, object.size.y, object.size.z);
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
   * Performs a depth first traversal of the scene tree
   * @param callback The function to be performed on each item in order.
   * Gives id and object as parameters
   */
  const dfs = (callback: (id: SceneObjectId, object: SceneObject) => void) => {
    const state = sceneState();

    if (state.children) {
      const stack = new Stack<SceneObjectId>();

      stack.push(...state.children);

      while (true) {
        const id = stack.pop();

        // If there are no more items on the stack, stop
        if (id === undefined) break;

        const object = state.objects[id];

        if (object.children) stack.push(...object.children);

        callback(id, object);
      }
    }
  };

  /**
   * Creates every object in the saved scene tree using a depth-first
   * traversal
   * @returns A hash table of Object3Ds
   */
  const populateScene = () => {
    const sceneObject3Ds: { [key: string]: THREE.Object3D } = {};

    dfs((id, object) => {
      const object3D = createObject3D(id, object);

      sceneObject3Ds[id] = object3D;
      if (object.parent) {
        sceneObject3Ds[object.parent].add(object3D);
      } else {
        scene.add(object3D);
      }
    });

    return sceneObject3Ds;
  };

  const sceneObject3Ds = populateScene();

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
   * Updates the given 3D object according to it's saved object
   * @param {SceneObject} object The saved object
   * @param {THREE.Object3D} object3D The 3D object to update
   */
  const updateObject3D = (object: SceneObject, object3D: THREE.Object3D) => {
    setPosition(object3D, object.position);
    switch (object.type) {
      case "Directional Light": {
      }
    }
  };

  /**
   * Performs a depth first traversal of the scene tree, updating existing
   * 3D objects and creating new ones
   */
  const updateScene = () => {
    dfs((id, object) => {
      let object3D = sceneObject3Ds[id];

      if (object3D) {
        updateObject3D(object, object3D);
      } else {
        object3D = createObject3D(id, object);

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
    state = store.getState();

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
