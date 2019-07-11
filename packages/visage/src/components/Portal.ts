import { ReactNode, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
  removeOnUnmount?: boolean;
}

export function Portal({
  children,
  containerId = 'portal-root',
  removeOnUnmount = true,
}: PortalProps) {
  const portalContainer: null | HTMLDivElement = useMemo(() => {
    if (typeof document !== 'undefined') {
      let el = document.getElementById(containerId);

      if (el != null) {
        return el as HTMLDivElement;
      }

      el = document.createElement('div');

      el.id = containerId;

      document.body.appendChild(el);

      return el as HTMLDivElement;
    }

    return null;
  }, [true]);

  useEffect(
    () => () => {
      if (removeOnUnmount && portalContainer) {
        document.body.removeChild(portalContainer);
      }
    },
    [],
  );

  if (portalContainer == null) {
    return null;
  }

  return createPortal(children, portalContainer);
}
