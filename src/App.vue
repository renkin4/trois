<template>
    <YangArchvizComponent :gltfUrl='GLTFTest' debug ref="yangArchvizComp" :modelValue="screenPositions" @update:modelValue="handleModelWValueChange"/>
</template>

<script setup lang="ts">
import YangArchvizComponent, { YangArchvizPublicInterface } from './components/archviz/YangArchvizComponent' 
import GLTFTest from './assets/podium_hitbox_v3.gltf'
import { Vector2 } from 'three';
import { onMounted, ref } from 'vue';

let yangArchvizComp = ref<YangArchvizPublicInterface>();

let screenPositions = ref();

onMounted(()=>{  
});

let handleModelWValueChange = (value : Vector2[]) => { 
}

</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
