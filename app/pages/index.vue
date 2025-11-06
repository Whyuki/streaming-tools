<template>
  <div class="inline-flex">
    <div id="settings" class="w-150 max-h-screen overflow-y-scroll p-2 pb-16">
      <SettingsOverlayControls />
      <SettingsSubjectList />
      <SettingsOptionsAccordion />
    </div>
    <div id="overlay" class="ms-8">
      <OverlayObs :style="{ width: overlayStore.overlayWidth + 'px' }" />
    </div>
    <div id="overlay" class="ms-8">
      <OverlayObs
        :style="{ width: overlayStore.smallOverlayWidth + 'px' }"
        small
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOverlayStore } from "~/stores/overlay";

const overlayStore = useOverlayStore();
</script>
