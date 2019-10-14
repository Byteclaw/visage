import { createContext, useContext, useRef } from 'react';

export const IdContext = createContext({ id: 0 });

IdContext.displayName = 'ComponentIdContext';

export function useGenerateId(): number {
  const ctx = useContext(IdContext);
  const id = useRef<number | null>(null);

  if (id.current == null) {
    id.current = ctx.id++;
  }

  return id.current;
}
