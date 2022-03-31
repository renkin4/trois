<template>
    <YangArchvizComponent :gltfUrl='GLTFTest' debug ref="yangArchvizComp" />
</template>

<script setup lang="ts">
import YangArchvizComponent, { YangArchvizPublicInterface } from './components/archviz/YangArchvizComponent' 
import GLTFTest from './assets/podium_hitbox_v3.gltf'
import { Vector2 } from 'three';
import { onMounted, ref } from 'vue';

let yangArchvizComp = ref<YangArchvizPublicInterface>();

onMounted(()=>{
  
});

</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
