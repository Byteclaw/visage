import { useUniqueId } from '@byteclaw/use-unique-id';
import React, {
  ReactElement,
  ReactNode,
  useRef,
  MouseEvent,
  KeyboardEvent,
  useMemo,
} from 'react';
import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
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
    borderRadius: 'controlBorderRadius',
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
  baseStyles?: EmotionStyleSheet;
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
  baseStyles,
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

  return (
    <Modal
      contentRef={dialogRef}
      focusElementRef={closeButtonRef}
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
        styles={baseStyles}
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
              <Text
                styles={{ mt: 2, mb: -1, color: 'neutral.2', fontSize: -1 }}
              >
                {secondaryLabel}
              </Text>
            )}
            <Heading
              styles={{ mt: secondaryLabel == null ? 1.5 : 1 }}
              id={headingId}
              level={3}
            >
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
                onClick={onClose}
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
