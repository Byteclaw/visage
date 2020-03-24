import { useUniqueId as baseUseUniqueId } from '@byteclaw/use-unique-id';
import { useRef } from 'react';

/**
 * Generates unique prefixed id if id is not provided
 */
export function useUniqueId(
  id: string | undefined | null,
  prefix: string,
): string {
  const generatedId = baseUseUniqueId();
  const idRef = useRef<string | number>(generatedId);

  // if id is provided do not use generated id
  idRef.current = id || `${prefix}-${generatedId}`;

  return idRef.current.toString();
}
