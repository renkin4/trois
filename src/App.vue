<template>
    <YangArchvizComponent :gltfUrl='GLTFTest' debug>
      <ProjectPositionTo2DUI />
    </YangArchvizComponent>
</template>

<script setup lang="ts">
import YangArchvizComponent from './components/archviz/YangArchvizComponent'
import { ProjectPositionTo2DUI } from './export';
import GLTFTest from './assets/podium_hitbox_v3.gltf'

</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
