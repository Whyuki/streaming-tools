export const useOverlayStore = defineStore("overlay", () => {
  const overlayWidth = ref(500);
  const smallOverlayWidth = ref(300);

  const previousData = localStorage.getItem("overlayStore");
  if (previousData) {
    //TODO: validate json parsing
    const parsed = JSON.parse(previousData);
    console.log("Loaded overlay settings from localStorage:", parsed);
    overlayWidth.value = parsed.overlayWidth;
    smallOverlayWidth.value = parsed.smallOverlayWidth;
  }

  watch(
    [overlayWidth, smallOverlayWidth],
    ([overlayWidth, smallOverlayWidth]) => {
      localStorage.setItem(
        "overlayStore",
        JSON.stringify({ overlayWidth, smallOverlayWidth })
      );
    },
    { deep: true }
  );

  return {
    overlayWidth,
    smallOverlayWidth,
  };
});
