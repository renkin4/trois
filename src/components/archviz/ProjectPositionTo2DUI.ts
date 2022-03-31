import { defineComponent, inject } from "vue";
import { YangGLTFInjectionKey } from "../../models/YangGLTF";

export default defineComponent({
    name: "ProjectPositionTo2DUI",
    async setup(props){
        const yangGltf = inject(YangGLTFInjectionKey);
        
    },
    created(){
    },
    render(){
      return this.$slots.default ? this.$slots.default() : []
    }
});