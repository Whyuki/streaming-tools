interface Source {
  id: string;
  label: string;
  logo: string;
}

interface Subject {
  id: number;
  title: string;
  status: "finished" | "active" | "upcoming";
  startTime: Date | null;
  sources: Source[];
}

export const useSubjectsStore = defineStore("subject", () => {
  const nextId = ref(0);
  const activeSubjectIndex = ref<number | null>(null);
  const startTime = ref<Date | null>(null);
  const subjects = ref<Subject[]>([]);

  function reset() {
    nextId.value = 0;
    activeSubjectIndex.value = null;
    startTime.value = null;
    subjects.value = [
      {
        id: nextId.value++,
        title: "BONJOUR",
        status: "upcoming",
        startTime: null,
        sources: [],
      },
      {
        id: nextId.value++,
        title: "SOMMAIRE",
        status: "upcoming",
        startTime: null,
        sources: [],
      },
    ];
  }

  reset();

  const previousData = localStorage.getItem("subjectsStore");
  if (previousData) {
    //TODO: validate json parsing
    const parsed = JSON.parse(previousData);
    console.log("Loaded subjects from localStorage:", parsed);
    subjects.value = parsed.subjects.map(
      (subject: {
        id: number;
        title: string;
        status: string;
        startTime: string | null;
        sources: Source[];
      }) => ({
        ...subject,
        startTime: subject.startTime ? new Date(subject.startTime) : null,
      })
    );
    nextId.value = parsed.nextId;
    activeSubjectIndex.value = parsed.activeSubjectIndex;
    startTime.value = parsed.startTime && new Date(parsed.startTime);
  }

  watch(
    [subjects, activeSubjectIndex, nextId, startTime],
    ([subjects, activeSubjectIndex, nextId, startTime]) => {
      localStorage.setItem(
        "subjectsStore",
        JSON.stringify({ subjects, activeSubjectIndex, nextId, startTime })
      );
    },
    { deep: true }
  );

  function addSubject(subject: Omit<Subject, "id">) {
    subjects.value.push({ ...subject, id: nextId.value++ });
  }

  function removeSubject(id: number) {
    subjects.value = subjects.value.filter((subject) => subject.id !== id);
  }

  function updateSubject(id: number, subject: Omit<Subject, "id">) {
    const index = subjects.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      subjects.value[index] = { ...subject, id };
    }
  }

  function moveSubject(id: number, direction: "up" | "down") {
    const index = subjects.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < subjects.value.length) {
        const [movedSubject] = subjects.value.splice(index, 1);
        if (!movedSubject) return;
        subjects.value.splice(newIndex, 0, movedSubject);
      }
    }
  }

  function getSubjectById(id: number): Subject | undefined {
    return subjects.value.find((subject) => subject.id === id);
  }

  function startStream() {
    if (subjects.value[0]) {
      activeSubjectIndex.value = 0;
      subjects.value = subjects.value.map((subject, index) => ({
        ...subject,
        status: index === 0 ? "active" : "upcoming",
        startTime: index === 0 ? new Date() : null,
      }));
    }
    startTime.value = new Date();
  }

  // ? TODO : skip empty subjects or show empty subjects in overlay?
  function nextSubject() {
    if (activeSubjectIndex.value === null) return;

    const subject = subjects.value[activeSubjectIndex.value];
    if (subject) {
      subject.status = "finished";
    }

    activeSubjectIndex.value++;

    const upcomingSubject = subjects.value[activeSubjectIndex.value];
    if (!upcomingSubject) return;

    upcomingSubject.startTime = new Date();

    if (upcomingSubject.title.trim() === "") {
      nextSubject();
      return;
    }

    upcomingSubject.status = "active";
  }

  function previousSubject() {
    if (activeSubjectIndex.value === null || activeSubjectIndex.value < 0)
      return;
    const subject = subjects.value[activeSubjectIndex.value];
    if (subject) {
      subject.status = "upcoming";
      subject.startTime = null;
    }

    activeSubjectIndex.value--;

    const prevSubject = subjects.value[activeSubjectIndex.value];
    if (!prevSubject) return;

    if (prevSubject.title.trim() === "") {
      previousSubject();
      return;
    }

    prevSubject.status = "active";
  }

  function isMovable(id: number): { up: boolean; down: boolean } {
    const index = subjects.value.findIndex((s) => s.id === id);

    const isMovableUp =
      index > 0 && subjects.value[index - 1]?.status === "upcoming";
    const isMovableDown =
      index < subjects.value.length - 1 &&
      subjects.value[index]?.status === "upcoming";

    return { up: isMovableUp, down: isMovableDown };
  }

  return {
    subjects,
    activeSubjectIndex,
    nextId,
    startTime,
    reset,
    addSubject,
    removeSubject,
    updateSubject,
    moveSubject,
    getSubjectById,
    startStream,
    nextSubject,
    previousSubject,
    isMovable,
  };
});
