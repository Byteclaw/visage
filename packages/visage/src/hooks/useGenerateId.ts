import { createContext, useContext, useRef } from 'react';

const IdContext = createContext({ id: 0 });

export function useGenerateId() {
  const ctx = useContext(IdContext);
  const id = useRef(++ctx.id);

  return id;
}
