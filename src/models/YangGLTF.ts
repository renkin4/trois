import { AnimationClip, Group, Mesh, PerspectiveCamera } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { defineComponent, InjectionKey } from "vue";
import { RendererInjectionKey } from "../core";
import Model from "./Model";

interface YangGLTFInterface {
  gltfScene? : Group,
  gltfAnimation? : AnimationClip[],
  gltfSceneAsync : Promise<Group>,
  gltfAnimationAsync : Promise<AnimationClip[]>,
}

export interface YangGLTFSetupInterface extends YangGLTFInterface {
  scenePromiseResolve : (value: Group | PromiseLike<Group>) => void,
  scenePromiseReject : (reason?: any) => void,

  animationPromiseResolve : (value: AnimationClip[] | PromiseLike<AnimationClip[]>) => void,
  animationPromiseReject : (reason?: any) => void,
}

export interface YangGLTFPublicInterface extends YangGLTFInterface {
}

export const YangGLTFInjectionKey : InjectionKey<YangGLTFPublicInterface> = Symbol("YangGLTF");

export default defineComponent({
    name: "YangGLTF",
    extends: Model,
    props: {
      debug : Boolean,
    },
    inject: {
      renderer: RendererInjectionKey as symbol,
    },
    provide() {
      return {
        [YangGLTFInjectionKey as symbol]: this,
      }
    },
    setup(props) : YangGLTFSetupInterface {
      let scenePromiseResolve : (value: Group | PromiseLike<Group>) => void = () => {};
      let scenePromiseReject : (reason?: any) => void = () => {};
      let animationPromiseResolve : (value: AnimationClip[] | PromiseLike<AnimationClip[]>) => void = () => {};
      let animationPromiseReject : (reason?: any) => void = () => {};

      const gltfSceneAsync = new Promise<Group>((resolve, reject) => {
        scenePromiseResolve = resolve;
        scenePromiseReject = reject;
      });
      const gltfAnimationAsync = new Promise<AnimationClip[]>((resolve, reject) => {
        animationPromiseResolve = resolve;
        animationPromiseReject = reject;
      });

      return {
        gltfSceneAsync,
        gltfAnimationAsync,
        scenePromiseResolve,
        scenePromiseReject,
        animationPromiseResolve,
        animationPromiseReject,
      };
    },
    created() {
      const loader = new GLTFLoader();
      this.$emit('before-load', loader);

      loader.load(this.src, (gltf) => {
        this.onLoad(gltf);

        const gltfCamera : PerspectiveCamera = gltf.cameras[0] as PerspectiveCamera;
        if(!this.renderer){
          console.error("Please wrap renderer around YangGLTF");
          return;
        }

        if(!this.debug){
          gltf.scene.children.forEach((child) => {
              const isMesh = child instanceof Mesh;
              if(!isMesh) return;

              child.visible = false;
          });
        }

        this.gltfAnimation = gltf.animations;
        this.gltfScene = gltf.scene;
        
        this.scenePromiseResolve(this.gltfScene);
        this.animationPromiseResolve(this.gltfAnimation);

        this.renderer!.camera = gltfCamera; 
        this.renderer!.three.forceResize();
        
        this.initObject3D(gltf.scene);
      }, this.onProgress, (error : ErrorEvent) => { this.onError(error); });
    },  
    methods:{
      onError(error: ErrorEvent) {
        super.onError(error);
        //@ts-ignore
        this.scenePromiseReject("GLTF Load Error");
        //@ts-ignore
        this.animationPromiseReject("GLTF Load Error");
      },
    },
    render(){
      return this.$slots.default ? this.$slots.default() : []
    }
});