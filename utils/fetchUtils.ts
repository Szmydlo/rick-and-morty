import { ICharacter } from "@/components/CharacterFetcher";

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

export const sortById = (characters: ICharacter[]) =>
  characters.sort((a, b) => a.id - b.id);

export const isInCache = (id: number, cache: ICharacter[] | undefined) => {
  if (!cache) return false;
  return !!cache.find((elem) => elem.id === id);
};

export const removeFromCache = (
  id: number,
  cache: ICharacter[] | undefined
) => {
  console.log("remove", id, cache);
  if (!cache) return [];
  const arrayCopy = [...cache];
  const index = arrayCopy.findIndex((elem) => elem.id === id);
  arrayCopy.splice(index, 1);
  console.log("edited array", arrayCopy);
  return arrayCopy;
};
