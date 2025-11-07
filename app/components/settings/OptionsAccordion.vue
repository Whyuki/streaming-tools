<template>
  <UAccordion
    type="multiple"
    :items="computedSubjects"
    class="mt-4 bg-slate-950/30 px-4"
  >
    <template #overlay-customization>
      <SettingsOverlayCustomization
        v-model="overlayStore.overlayWidth"
        label="Largeur de l'overlay principal"
        class="p-2"
        :min="300"
        :max="700"
      />
      <SettingsOverlayCustomization
        v-model="overlayStore.smallOverlayWidth"
        label="Largeur de l'overlay minimaliste"
        class="p-2"
        :min="200"
        :max="500"
      />
    </template>
    <template #textual-report>
      <SettingsTextualReport class="p-2" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
  const overlayStore = useOverlayStore()

  const computedSubjects = computed(() => {
    return [
      {
        label: "Personnalisation de l'overlay",
        slot: 'overlay-customization' as const,
      },
      {
        label: 'Sommaire textuel',
        slot: 'textual-report' as const,
      },
    ]
  })
</script>
