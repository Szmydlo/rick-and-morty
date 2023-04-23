export const fetchPerson = async (
  characterId: number,
  controller: AbortController
) => {
  let characterData = null;
  const signal = controller.signal;
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${characterId}`,
    { signal }
  );
  characterData = await response.json();

  if (!characterData.name)
    // if no character found reject
    return Promise.reject({ message: "No character found" });

  return characterData;
};
