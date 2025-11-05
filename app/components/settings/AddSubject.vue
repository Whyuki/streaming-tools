<template>
  <UForm :state class="space-y-4" @submit="onSubmit">
    <UFormField label="Titre" name="title">
      <UInput v-model="state.title" />
    </UFormField>

    <UFormField label="Source" name="source">
      <UCheckboxGroup
        v-model="state.source"
        :items="items"
        orientation="horizontal"
        indicator="hidden"
        variant="card"
      />
    </UFormField>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { useSubjectsStore } from "~/stores/subjects";

const subjectsStore = useSubjectsStore();

const state = reactive({
  title: "",
  source: [],
});

const items = ref([
  { label: "Le Monde", value: "le-monde" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
]);

async function onSubmit(event: FormSubmitEvent<typeof state>) {
	
  console.log(event.data);
}
</script>
