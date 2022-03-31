import { Vector2 } from "three";
import { ComponentPublicInstance, defineComponent, h, onMounted, ref } from "vue";
import { PerspectiveCamera, Renderer, Scene } from "../../core";
import { AmbientLight } from "../../lights";
import { YangGLTF } from "../../models";
import ProjectMeshPosToUI, { ProjectMeshPosToUIPublicInterface } from "./ProjectMeshPosToUI";

export interface YangArchvizSetupInterface { 
} 

export interface YangArchvizPublicInterface extends ComponentPublicInstance, YangArchvizSetupInterface{}

export default defineComponent({
    name: "YangArchvizComponent",
    props: {
        gltfUrl : String,
        debug : Boolean,
        "modelValue" : String,
    }, 
    emits: ['update:modelValue'], 
    components: { },
    setup(props, ctx){
        const { slots, expose, emit } = ctx;
        const { gltfUrl } = props;
        const url : String = gltfUrl ?? "";  
        const ProjectMeshPosToUIRef = ref<ProjectMeshPosToUIPublicInterface>(); 
        let screenPositions : Vector2[] = ref();

        onMounted(()=>{
        });

        const instance : YangArchvizSetupInterface = {};
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
                        h(ProjectMeshPosToUI, { 
                            ref : ProjectMeshPosToUIRef, 
                            modelValue: screenPositions,
                            "onUpdate:modelValue" : (value : Vector2[]) => emit("update:modelValue", value)
                        }),
                    ]),
                    slots.default?.() ?? [],
                ])
            ]), 
        ]);
    },
});