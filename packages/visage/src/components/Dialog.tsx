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
import { variant } from '../variants';
import { Box } from './Box';
import { Flex } from './Flex';
import { CloseButton } from './CloseButton';
import { Heading } from './Heading';
import { Modal } from './Modal';
import { Text } from './Text';

const BaseDialog = createComponent('div', {
  displayName: 'Dialog',
  defaultStyles: props => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightShades',
    position: 'relative',
    ...(props.scroll === 'content' ? { maxHeight: ['100%', '90%'] } : {}),
    m: 'auto',
    pb: 2,
    px: 2,
    transform: 'translateZ(0)',
  }),
  variants: [
    variant('scroll', true, ['content', 'body'] as const, 'content' as any),
  ],
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
  scroll?: 'content' | 'body';
  secondaryLabel?: string | ReactElement;
}

export function Dialog({
  children,
  closeButtonLabel = 'Close dialog',
  label,
  id: outerId,
  onClose,
  role = 'dialog',
  scroll = 'content',
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
    <Modal
      contentRef={dialogRef}
      open
      scrollable={scroll === 'body'}
      id={id}
      onClose={onClose}
    >
      <BaseDialog
        aria-labelledby={headingId}
        aria-modal
        ref={dialogRef}
        role={role}
        scroll={scroll}
      >
        <Flex>
          <Flex
            styles={{
              width: '100%',
              flexDirection: 'column',
              marginRight: onClose ? 6 : null,
            }}
          >
            {secondaryLabel != null && (
              <Text styles={{ mt: 2, mb: -2, color: 'neutral.4' }}>
                {secondaryLabel}
              </Text>
            )}
            <Heading id={headingId} level={3}>
              {label}
            </Heading>
          </Flex>
          {onClose ? (
            <Flex
              styles={{
                alignItems: 'flex-start',
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <CloseButton
                aria-label={closeButtonLabel}
                styles={{ fontSize: 1, mx: 2, my: 2 }}
                onClick={onClickHandler}
                ref={closeButtonRef}
              />
            </Flex>
          ) : null}
        </Flex>
        <Box
          styles={{ maxHeight: '100%', maxWidth: '100%', overflowY: 'scroll' }}
        >
          {children}
        </Box>
      </BaseDialog>
    </Modal>
  );
}
