<template>
  <div class="ui-container">
    <div class="ui annotation" v-for="pos in screenPositions" :style="`top: ${pos.y}px; left : ${pos.x}px`">

    </div>
  </div>
  <YangArchvizComponent :gltfUrl='GLTFTest' debug ref="yangArchvizComp" @update:modelValue="handleModelWValueChange"/>
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
  screenPositions.value = value
}

</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}

.annotation{
    position: absolute;
    border-radius: 50%;
    display: inline-block;
    z-index: 10;
    cursor: pointer;
    
    height: 64px;
    width: 64px;
    background-color: #FF00FF; 
    transform: translate(-50%, -50%);
}

</style>
