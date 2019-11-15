import { useUniqueId } from '@byteclaw/use-unique-id';
import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  MouseEvent,
  KeyboardEvent,
  useMemo,
} from 'react';
import { createComponent } from '../core';
import { Flex } from './Flex';
import { CloseButton } from './CloseButton';
import { Heading } from './Heading';
import { Modal } from './Modal';
import { Text } from './Text';

const BaseDialog = createComponent('div', {
  displayName: 'Dialog',
  defaultStyles: {
    backgroundColor: 'white',
    height: ['100%', null],
    maxHeight: ['100%', '75%', '50%'],
    position: 'relative',
    pb: 2,
    px: 2,
    width: ['100%', '75%', '50%'],
    transform: 'translateZ(0)',
  },
});

interface DialogProps {
  children?: ReactNode;
  /** Close button label (default close dialog) */
  closeButtonLabel?: string;
  label: string | ReactElement;
  /**
   * Unique id of the dialog
   */
  id?: string;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  role?: 'dialog' | 'alertdialog';
  secondaryLabel?: string | ReactElement;
}

export function Dialog({
  children,
  closeButtonLabel = 'Close dialog',
  label,
  id: outerId,
  onClose,
  role = 'dialog',
  secondaryLabel,
}: DialogProps) {
  const idTemplate = useUniqueId();
  const id = useMemo(() => {
    return outerId || `dialog-${idTemplate}`;
  }, [outerId, idTemplate]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = `dialog-${id}-heading`;
  const onDocumentFocus: EventListener = useCallback(e => {
    if (
      dialogRef.current &&
      dialogRef.current.contains(e.target as any) === false
    ) {
      e.preventDefault();

      // return focus back to close button
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }
  }, []);

  const onClickHandler: MouseEventHandler = useCallback(
    e => {
      if (onClose) {
        e.preventDefault();
        onClose(e);
      }
    },
    [onClose],
  );

  // focus close button on mount
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  // focus trap
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('focus', onDocumentFocus, true);

      return () => {
        document.removeEventListener('focus', onDocumentFocus, true);
      };
    }
  }, []);

  return (
    <Modal contentRef={dialogRef} open id={id} onClose={onClose}>
      <BaseDialog
        aria-labelledby={headingId}
        aria-modal
        ref={dialogRef}
        role={role}
      >
        <Flex>
          <Flex styles={{ width: '100%', flexDirection: 'column' }}>
            {secondaryLabel != null && (
              <Text styles={{ mt: 2, mb: -2, color: 'neutral.4' }}>
                {secondaryLabel}
              </Text>
            )}
            <Heading id={headingId} level={3}>
              {label}
            </Heading>
          </Flex>
          <Flex
            styles={{
              alignItems: 'flex-start',
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          >
            <CloseButton
              styles={{ fontSize: 1, mx: 2, my: 2 }}
              aria-label={closeButtonLabel}
              onClick={onClickHandler}
              ref={closeButtonRef}
            />
          </Flex>
        </Flex>
        {children}
      </BaseDialog>
    </Modal>
  );
}
