import { defineComponent, h, onMounted } from "vue";
import { PerspectiveCamera, Renderer, Scene } from "../../core";
import { AmbientLight } from "../../lights";
import { YangGLTF } from "../../models";
import ProjectMeshPosToUI from "./ProjectMeshPosToUI";

export default defineComponent({
    name: "YangArchvizComponent",
    props: {
        gltfUrl : String,
        debug : Boolean,
    },
    components: { },
    setup(props : any, ctx : any) {
        const { slots, expose } = ctx;
        const { gltfUrl } = props;
        const url : String = gltfUrl ?? "";  

        onMounted(()=>{
        });

        expose({ });

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
                                    h(ProjectMeshPosToUI ),
                                ]),
                                slots.default?.() ?? [],
                            ])
                        ]), 
                    ]);
    },
});