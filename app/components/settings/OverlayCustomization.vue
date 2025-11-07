<template>
  <div>
    <h3 class="text-sm">{{ props.label }}</h3>
    <div class="m-2 flex justify-center gap-2">
      <USlider
        v-model="width"
        :min="props.min"
        :max="props.max"
        :step="10"
        tooltip
        :ui="{
          track: 'rounded-none',
          thumb: 'rounded-none ring-0 bg-cyan-800',
          range: 'rounded-none bg-cyan-600',
        }"
      />
      <UFieldGroup>
        <UInputNumber
          v-model="width"
          :min="props.min"
          :max="props.max"
          orientation="vertical"
          class="w-18"
        >
        </UInputNumber>
        <UBadge
          class=""
          color="neutral"
          variant="outline"
          >px</UBadge
        >
      </UFieldGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  const width = defineModel<number>()
  const props = defineProps<{
    min: number
    max: number
    label: string
  }>()
</script>
