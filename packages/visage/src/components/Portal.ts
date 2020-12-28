import { ReactNode, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  /**
   * @default 'portal-root'
   */
  containerId?: string;
  /**
   * @default true
   */
  removeOnUnmount?: boolean;
}

export function Portal({
  children,
  containerId = 'portal-root',
  removeOnUnmount = true,
}: PortalProps): React.ReactPortal | null {
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
  }, [containerId]);

  useEffect(
    () => () => {
      if (removeOnUnmount && portalContainer) {
        document.body.removeChild(portalContainer);
      }
    },
    [removeOnUnmount, portalContainer],
  );

  if (portalContainer == null) {
    return null;
  }

  return createPortal(children, portalContainer);
}
