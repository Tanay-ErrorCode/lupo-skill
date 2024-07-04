import { getDatabase, ref, get } from "firebase/database";

export const searchEvents = async (tags: string, date: string) => {
  const db = getDatabase();
  const eventsRef = ref(db, "events");
  const snapshot = await get(eventsRef);
  if (snapshot.exists()) {
    const eventsData = snapshot.val();
    return Object.keys(eventsData)
      .map((key) => ({ id: key, ...eventsData[key] }))
      .filter((event) => {
        const matchesTags = !tags || event.tags.toLowerCase().includes(tags.toLowerCase());
        const matchesDate = !date || event.date === date;
        return matchesTags && matchesDate;
      });
  }
  return [];
};
