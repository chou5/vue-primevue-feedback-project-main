import { computed, ref } from 'vue'

export function useIdeaFilters(source, getText = (i)=>[i.title,i.description,(i.tags||[]).join(' ')].join(' ')) {
  const global = ref('');
  const categories = ref([]);
  const statuses = ref([]);

  const filtered = computed(() => {
    const q = global.value.trim().toLowerCase();
    return source.value.filter(i => {
      const matchesQ = !q || getText(i).toLowerCase().includes(q);
      const matchCat = !categories.value.length || categories.value.includes(i.category);
      const matchSt  = !statuses.value.length   || statuses.value.includes(i.status);
      return matchesQ && matchCat && matchSt;
    });
  });

  return { global, categories, statuses, filtered };
}
