import { Camera, Group, Mesh, Vector2, Vector3 } from "three";
import { defineComponent, inject } from "vue";
import { RendererInjectionKey, RendererPublicInterface } from "../../core";
import {  RenderEventInterface } from "../../core/Renderer";
import { YangGLTFInjectionKey, YangGLTFPublicInterface } from "../../models/YangGLTF";

export interface ProjectMeshPosToUISetupInterface {
  allMesh : Promise<Mesh[]>;
  allMeshScreenPos : Promise<Vector2[]>;
  cachedMesh : Mesh[],
  cacheMeshScreenPos : Vector2[],
  renderer : RendererPublicInterface;
  ProjectWorldPosToScreenPos : (mesh : Mesh) => Vector2;
}

export interface ProjectMeshPosToUIPublicInterface {}

export default defineComponent({
    name: "ProjectMeshPosToUI",
    setup(props) : ProjectMeshPosToUISetupInterface {
      // TODO use props instead of inject
      const yangGltf : YangGLTFPublicInterface = inject(YangGLTFInjectionKey) as YangGLTFPublicInterface;

      const renderer : RendererPublicInterface = inject(RendererInjectionKey) as RendererPublicInterface;

      if(!renderer){
        throw new Error("ProjectMeshPosToUI: renderer not found");
      }

      if(!yangGltf){
        throw new Error("ProjectMeshPosToUI: yangGltf not found");
      }

      const gltfScene : Promise<Group> = yangGltf!.gltfSceneAsync; 

      const allMesh : Promise<Mesh[]> = gltfScene.then((scene) => {
        return scene.children.filter((child) => {
          return child instanceof Mesh;
        }).map((child) => {
          return child as Mesh;
        });
      });

      let ProjectWorldPosToScreenPos = (mesh : Mesh) => {
        const camera : Camera = renderer!.camera as Camera;
        const vector = new Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
        vector.project(camera);

        // TODO : proper
        const aspectRatio = 1;

        vector.x = Math.round((0.5 + vector.x / 2) * (window.innerWidth / aspectRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (window.innerHeight / aspectRatio));

        const returnVal = new Vector2(vector.x, vector.y);

        return returnVal;
      }

      let allMeshScreenPos : Promise<Vector2[]> = allMesh.then((meshArray) => {
        return Promise.all(meshArray.map((mesh) => {
          return ProjectWorldPosToScreenPos(mesh);
        }));
      });

      const cachedMesh : Mesh[] = [];
      const cacheMeshScreenPos : Vector2[] = [];

      return {
        allMesh,
        allMeshScreenPos,
        renderer,
        ProjectWorldPosToScreenPos,
        cachedMesh,
        cacheMeshScreenPos,
      };
    },
    async mounted() {
      this.cachedMesh = await this.allMesh;
      this.updateMeshScreenPositions();

      this.renderer.beforeRenderCallbacks.push(this.beforeRender);
    },
    methods : {
      beforeRender( props : RenderEventInterface) {
        this.updateMeshScreenPositions();
      },
      updateMeshScreenPositions(){
        this.cacheMeshScreenPos = this.cachedMesh.map((mesh) => {
          return this.ProjectWorldPosToScreenPos(mesh);
        }); 
      }
    },
    render(){
      return this.$slots.default ? this.$slots.default() : []
    }
});