<template>
  <pre
    class="overflow-hidden pb-4 text-sm wrap-break-word whitespace-pre-wrap text-muted select-all"
    >{{ computedSubjects }}</pre
  >
</template>

<script setup lang="ts">
  import { useSubjectsStore } from '~/stores/subjects'

  const subjectsStore = useSubjectsStore()

  const computedSubjects = computed(() => {
    return subjectsStore.subjects
      .filter((subject) => subject.title.trim() !== '')
      .reduce((acc, subject) => {
        return (
          acc +
          '- ' +
          subject.title +
          ': ' +
          (subject.startTime && subjectsStore.startTime
            ? subject.startTime?.getHours().toString().padStart(2, '0') +
              ':' +
              subject.startTime?.getMinutes().toString().padStart(2, '0') +
              ' (' +
              computeElapsedTime(
                subjectsStore.startTime.getTime(),
                subject.startTime.getTime(),
                true,
              ) +
              "')"
            : 'à venir') +
          '\n'
        )
      }, '')
  })
</script>
