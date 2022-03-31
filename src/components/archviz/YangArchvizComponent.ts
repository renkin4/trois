import { Vector2 } from "three";
import { ComponentPublicInstance, defineComponent, h, onMounted, ref } from "vue";
import { PerspectiveCamera, Renderer, Scene } from "../../core";
import { AmbientLight } from "../../lights";
import { YangGLTF } from "../../models";
import ProjectMeshPosToUI, { ProjectMeshPosToUIPublicInterface } from "./ProjectMeshPosToUI";

export interface YangArchvizSetupInterface {
    screenPositions : Vector2[];
} 

export interface YangArchvizPublicInterface extends ComponentPublicInstance, YangArchvizSetupInterface{}

export default defineComponent({
    name: "YangArchvizComponent",
    props: {
        gltfUrl : String,
        debug : Boolean,
    },
    components: { },
    setup(props, ctx){
        const { slots, expose } = ctx;
        const { gltfUrl } = props;
        const url : String = gltfUrl ?? "";  
        const ProjectMeshPosToUIRef = ref<ProjectMeshPosToUIPublicInterface>();
    
        let screenPositions : Vector2[] = [];

        onMounted(()=>{
            screenPositions = ProjectMeshPosToUIRef?.value?.cacheMeshScreenPos ?? [];
        });

        const instance : YangArchvizSetupInterface = {screenPositions};
        expose(instance);

        return () =>h( Renderer, {  
            resize : "window" ,  
            alpha : true
        }, () => 
        [
            h( PerspectiveCamera, {
                position: { z: 10 }
            }, () => 
            [ 
                h( Scene , {}, () =>
                [ 
                    h( AmbientLight ),
                    //@ts-ignore
                    h( YangGLTF, {
                        src : url,
                        debug : props.debug,
                    },  () => 
                    [
                        h(ProjectMeshPosToUI, { ref : ProjectMeshPosToUIRef} ),
                    ]),
                    slots.default?.() ?? [],
                ])
            ]), 
        ]);
    },
});