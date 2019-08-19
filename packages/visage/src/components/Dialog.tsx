import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import { createComponent } from '../core';
import { CloseIcon } from '../assets';
import { Heading } from './Heading';
import { Modal } from './Modal';
import { SvgIcon } from './SvgIcon';

const BaseDialog = createComponent('div', {
  displayName: 'BaseDialog',
  defaultStyles: {
    backgroundColor: 'white',
    height: ['100%', null],
    maxHeight: ['100%', '75%', '50%'],
    p: 1,
    position: 'relative',
    width: ['100%', '75%', '50%'],
    transform: 'translateZ(0)',
  },
});

const DialogCloseButton = createComponent('button', {
  displayName: 'DialogCloseButton',
  defaultStyles: {
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'solid',
    cursor: 'pointer',
    position: 'absolute',
    outline: 'none',
    overflow: 'hidden',
    top: 0,
    right: 0,
    height: '3em',
    width: '3em',
    '&:focus': {
      borderColor: 'blue',
    },
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
  id: string;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  role?: 'dialog' | 'alertdialog';
}

export function Dialog({
  children,
  closeButtonLabel = 'close dialog',
  label,
  id,
  onClose,
  role = 'dialog',
}: DialogProps) {
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
    <Modal open id={id} onClose={onClose}>
      <BaseDialog
        aria-labelledby={headingId}
        aria-modal
        ref={dialogRef}
        role={role}
      >
        <DialogCloseButton
          aria-label={closeButtonLabel}
          onClick={onClickHandler}
          ref={closeButtonRef}
          type="button"
        >
          <SvgIcon icon={CloseIcon} />
        </DialogCloseButton>
        <Heading id={headingId} level={3}>
          {label}
        </Heading>
        {children}
      </BaseDialog>
    </Modal>
  );
}
