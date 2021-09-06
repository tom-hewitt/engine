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
import { rgbToInt } from "../utils/colorUtils";

// Constants
// [FOV, aspect, near, far]
const defaultCamera = [75, 2, 0.1, 1000];
const defaultCameraPosition: [number, number, number] = [0, 1, 2];
const backgroundColor = 0xdcdcdc;

/**
 * Creates a THREE geometry from the given saved geometry
 * @param {string} geometry The saved geometry
 * @returns {THREE.BufferGeometry} A THREE geometry representing the saved geometry
 */
const createGeometry = (geometry: string) => {
  switch (geometry) {
    case "Box": {
      return new THREE.BoxGeometry(1, 1, 1);
    }
    case "Plane": {
      return new THREE.PlaneGeometry(1, 1);
    }
    default: {
      throw new Error(`Can't find geometry ${geometry}`);
    }
  }
};

class BaseEditorScene {
  // Constants
  defaultCamera = [75, 2, 0.1, 1000];
  defaultCameraPosition: [number, number, number] = [0, 1, 2];
  backgroundColor = 0xdcdcdc;

  canvas: HTMLCanvasElement;

  pixelRatio: number;

  width: number;
  height: number;

  renderer: THREE.WebGLRenderer;
  renderRequested = false;

  camera: THREE.PerspectiveCamera;

  scene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // The ratio of physical pixels to CSS pixels. Larger than 1 on HD-DPI displays
    this.pixelRatio = window.devicePixelRatio;

    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;

    // Setup the renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(
      this.width * this.pixelRatio,
      this.height * this.pixelRatio,
      false
    );

    // Setup the camera
    this.camera = new THREE.PerspectiveCamera(...this.defaultCamera);
    this.camera.position.set(...this.defaultCameraPosition);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Setup the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    window.addEventListener("resize", this.onWindowResize);
  }

  /**
   * Updates the camera and renderer to fit the new window size
   */
  onWindowResize = () => {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.width * this.pixelRatio,
      this.height * this.pixelRatio,
      false
    );

    this.requestRender();
  };

  render() {
    this.renderRequested = false;
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Requests for the scene to be rerendered after the current frame has
   * finished
   */
  requestRender = () => {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(this.render);
    }
  };
}

export class EditorScene extends BaseEditorScene {
  private effectComposer: EffectComposer;

  private outlinePass: OutlinePass;

  private raycaster: THREE.Raycaster;

  private clock: THREE.Clock;

  private state: State;

  private store: Store<State>;

  private sceneId: string;

  private controls: Controls;

  private oldSceneState: Scene | undefined = undefined;

  private geometries: { [key: string]: THREE.BufferGeometry } = {};

  private materials: { [key: string]: THREE.MeshStandardMaterial } = {};

  private sceneObject3Ds: { [key: string]: THREE.Object3D } = {};

  private selectedObject: SceneObjectId | undefined = undefined;

  constructor(canvas: HTMLCanvasElement, store: Store<State>, sceneId: string) {
    super(canvas);

    // Setup the postprocessing effect chain
    this.effectComposer = new EffectComposer(this.renderer);
    // Setup the render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);
    // Setup the outline effect pass, which is used to highlight the selected object
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      this.scene,
      this.camera
    );
    this.outlinePass.setSize(
      this.width * this.pixelRatio,
      this.height * this.pixelRatio
    );
    this.outlinePass.edgeThickness = 3;
    this.outlinePass.edgeStrength = 5;
    this.outlinePass.hiddenEdgeColor = new THREE.Color(0xb1b1b1);
    this.effectComposer.addPass(this.outlinePass);
    // Setup the antialias pass
    const antialiasPass = new ShaderPass(FXAAShader);
    antialiasPass.uniforms.resolution.value.set(
      (1 / this.width) * this.pixelRatio,
      (1 / this.height) * this.pixelRatio
    );
    this.effectComposer.addPass(antialiasPass);

    // Setup the raycaster, which lets the user interact with 3D objects with their cursor
    this.raycaster = new THREE.Raycaster();

    // Setup the clock, which keeps track of the time between frames
    this.clock = new THREE.Clock();

    // Get the state of the application
    this.state = store.getState();
    this.store = store;

    this.sceneId = sceneId;

    this.sceneObject3Ds = this.populateScene();

    this.controls = new Controls(
      this.camera,
      canvas,
      this.requestRender,
      this.onClick
    );

    this.store.subscribe(this.update);

    this.render();
  }

  /**
   * @returns The current state of the scene
   */
  sceneState = () => this.state.current.scenes[this.sceneId];

  /**
   * Gets a THREE geometry from the given saved geometry, or creates on if it doesn't exist
   * @param {string} geometryId The saved geometry
   * @returns {THREE.BufferGeometry} A THREE geometry representing the saved geometry
   */
  getGeometry = (geometryId: string) => {
    if (this.geometries[geometryId]) {
      return this.geometries[geometryId];
    }

    const geometry = createGeometry(geometryId);

    this.geometries[geometryId] = geometry;

    return geometry;
  };

  /**
   * Gets a THREE material from a saved material, or creates one if it doesn't exist
   * @param {MaterialId} materialId The id of the saved material
   * @returns {THREE.Material} A THREE material representing the saved material
   */
  getMaterial = (materialId: MaterialId) => {
    if (this.materials[materialId]) {
      return this.materials[materialId];
    }

    const materialData = this.state.current.materials[materialId];

    const material = new THREE.MeshStandardMaterial({
      color: rgbToInt(materialData.color),
      opacity: materialData.opacity,
      emissive: rgbToInt(materialData.emissive),
      roughness: materialData.roughness,
      metalness: materialData.metalness,
      flatShading: materialData.flatShading,
    });

    this.materials[materialId] = material;

    return material;
  };

  /**
   * Creates a mesh 3D object from a saved mesh
   * @param {MeshId} meshId The id of the mesh
   * @returns {THREE.Mesh} A 3D object representing the saved mesh
   */
  createMesh = (geometry: string, materialId: string) => {
    return new THREE.Mesh(
      this.getGeometry(geometry),
      this.getMaterial(materialId)
    );
  };

  /**
   * Creates a 3d object from a saved scene object
   * @param {SceneObjectId} id The id of the scene object, so it can be
   * added to the 3D object
   * @param {SceneObject} object The scene object as it is saved in state
   * @returns {THREE.Object3D} The 3D object representation of the scene object
   */
  createObject3D = (id: SceneObjectId, object: SceneObject): THREE.Object3D => {
    let object3D: THREE.Object3D;
    switch (object.type) {
      case "Directional Light": {
        const light = new THREE.DirectionalLight(
          rgbToInt(object.attributes.Color.value),
          object.attributes.Intensity.value
        );

        this.scene.add(light.target);
        light.target.position.set(
          object.attributes["Light Target"].value.x,
          object.attributes["Light Target"].value.y,
          object.attributes["Light Target"].value.z
        );

        object3D = light;
        break;
      }
      case "Mesh": {
        object3D = this.createMesh(
          object.attributes.Geometry.value,
          object.attributes.Material.value
        );
        object3D.rotation.set(
          THREE.MathUtils.degToRad(object.attributes.Rotation.value.x),
          THREE.MathUtils.degToRad(object.attributes.Rotation.value.y),
          THREE.MathUtils.degToRad(object.attributes.Rotation.value.z)
        );
        object3D.scale.set(
          object.attributes.Size.value.x,
          object.attributes.Size.value.y,
          object.attributes.Size.value.z
        );
        break;
      }
    }

    object3D.name = id;
    object3D.position.set(
      object.attributes.Position.value.x,
      object.attributes.Position.value.y,
      object.attributes.Position.value.z
    );

    return object3D;
  };

  /**
   * Performs a depth first traversal of the scene tree
   * @param callback The function to be performed on each item in order.
   * Gives id and object as parameters
   */
  dfs = (callback: (id: SceneObjectId, object: SceneObject) => void) => {
    const state = this.sceneState();

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
  populateScene = () => {
    const sceneObject3Ds: { [key: string]: THREE.Object3D } = {};

    this.dfs((id, object) => {
      const object3D = this.createObject3D(id, object);

      sceneObject3Ds[id] = object3D;
      if (object.parent) {
        sceneObject3Ds[object.parent].add(object3D);
      } else {
        this.scene.add(object3D);
      }
    });

    return sceneObject3Ds;
  };

  /**
   * Finds the 3D object that has been clicked by drawing a raycast
   * @param {THREE.Vector2} mouse The coordinates of the click on a scale of
   * -1 to 1
   */
  onClick = (mouse: THREE.Vector2) => {
    this.raycaster.setFromCamera(mouse, this.camera);

    const object3D = this.raycaster.intersectObjects(
      Object.values(this.sceneObject3Ds)
    )[0];

    const id = object3D ? object3D.object.name : undefined;
    this.store.dispatch(selectSceneObject({ id, sceneId: this.sceneId }));
  };

  /**
   * Updates the camera, renderer and postprocessor to fit the new window size
   */
  onWindowResize = () => {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.width * this.pixelRatio,
      this.height * this.pixelRatio,
      false
    );

    this.effectComposer.setSize(
      this.width * this.pixelRatio,
      this.height * this.pixelRatio
    );

    this.requestRender();
  };

  /**
   * Updates the given 3D object according to it's saved object
   * @param {SceneObject} object The saved object
   * @param {THREE.Object3D} object3D The 3D object to update
   */
  updateObject3D = (
    id: SceneObjectId,
    object: SceneObject,
    object3D: THREE.Object3D
  ) => {
    const oldObject = this.oldSceneState?.objects[id];

    if (object !== oldObject) {
      object3D.position.set(
        object.attributes.Position.value.x,
        object.attributes.Position.value.y,
        object.attributes.Position.value.z
      );

      switch (object.type) {
        case "Directional Light": {
          if (object3D instanceof THREE.DirectionalLight) {
            object3D.target.position.set(
              object.attributes["Light Target"].value.x,
              object.attributes["Light Target"].value.y,
              object.attributes["Light Target"].value.z
            );
            object3D.color.set(rgbToInt(object.attributes.Color.value));
            object3D.intensity = object.attributes.Intensity.value;
          }
          break;
        }
        case "Mesh": {
          object3D.rotation.set(
            object.attributes.Rotation.value.x,
            object.attributes.Rotation.value.y,
            object.attributes.Rotation.value.z
          );
          object3D.scale.set(
            object.attributes.Size.value.x,
            object.attributes.Size.value.y,
            object.attributes.Size.value.z
          );
        }
      }
    }
  };

  /**
   * Performs a depth first traversal of the scene tree, updating existing
   * 3D objects and creating new ones
   */
  updateScene = () => {
    if (this.sceneState() !== this.oldSceneState) {
      this.dfs((id, object) => {
        let object3D = this.sceneObject3Ds[id];

        if (object3D) {
          this.updateObject3D(id, object, object3D);
        } else {
          object3D = this.createObject3D(id, object);

          this.sceneObject3Ds[id] = object3D;
          if (object.parent) {
            this.sceneObject3Ds[object.parent].add(object3D);
          } else {
            this.scene.add(object3D);
          }
        }
      });
    }
  };

  /**
   * If the object that is currently selected by the user has changed, update the
   * outline effect to reflect the change
   */
  updateSelectedObject = () => {
    const newSelectedObject = this.state.temp.selectedSceneObject;

    if (newSelectedObject !== this.selectedObject) {
      this.selectedObject = newSelectedObject;
      this.outlinePass.selectedObjects = newSelectedObject
        ? [this.sceneObject3Ds[newSelectedObject]]
        : [];
    }
  };

  /**
   * Reacts to an update in the app's state
   */
  update = () => {
    this.oldSceneState = this.sceneState();
    this.state = this.store.getState();

    this.updateScene();
    this.updateSelectedObject();
    this.requestRender();
  };

  /**
   * Cleanup resources
   */
  dispose = () => {
    this.renderer.dispose();
    this.outlinePass.dispose();
    this.controls.dispose();
  };

  /**
   * Renders the scene and updates the controls
   */
  render = () => {
    super.render();
    this.renderRequested = false;

    const delta = this.clock.getDelta();

    this.controls.update(delta);
    this.effectComposer.render();
  };
}
