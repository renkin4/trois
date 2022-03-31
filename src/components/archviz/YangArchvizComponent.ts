import { defineComponent, h } from "vue";
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
    setup(props, { slots, expose }){
        const url : String = props.gltfUrl ?? "";
 
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
                                    h(ProjectMeshPosToUI)
                                ]),
                                slots.default?.() ?? [],
                            ])
                        ]), 
                    ]);
    }, 
});