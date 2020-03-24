import React, { ReactElement, ReactNode, useRef } from 'react';
import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
import { useUniqueId } from '../hooks';
import { booleanVariant, variant } from '../variants';
import { Box } from './Box';
import { Flex } from './Flex';
import { CloseButton } from './CloseButton';
import { Heading } from './Heading';
import { Modal } from './Modal';
import { Text } from './Text';

const DialogBase = createComponent(Flex, {
  displayName: 'Dialog',
  styles: props => ({
    boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
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

const DialogCloseButton = createComponent(CloseButton, {
  displayName: 'DialogCloseButton',
  styles: {
    fontSize: 1,
    mx: 2,
    my: 2,
  },
});

const DialogCloseButtonWrapper = createComponent(Flex, {
  displayName: 'DialogCloseButtonWrapper',
  styles: {
    alignItems: 'flex-start',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const DialogContent = createComponent(Box, {
  displayName: 'DialogContent',
  styles: {
    maxHeight: '100%',
    maxWidth: '100%',
    overflowY: 'scroll',
  },
});

const DialogHeading = createComponent(Heading, {
  displayName: 'DialogHeading',
  defaultProps: {
    level: 3,
  },
  styles: {
    mt: 2,
  },
});

const DialogSubHeading = createComponent(Text, {
  displayName: 'DialogSubHeading',
  styles: {
    mt: 2,
    mb: -2,
    color: 'neutral.2',
    fontSize: -1,
  },
});

const DialogHeadingWrapper = createComponent(Flex, {
  displayName: 'DialogHeadingWrapper',
  styles: props => ({
    width: '100%',
    flexDirection: 'column',
    marginRight: props.closable ? 6 : null,
  }),
  variants: [booleanVariant('closable', true)],
});

interface DialogProps {
  /**
   * Dialog's base styles
   */
  baseStyles?: EmotionStyleSheet;
  children?: ReactNode;
  /**
   * Content wrapper's styles
   */
  contentStyles?: EmotionStyleSheet;
  /** Close button label (default close dialog) */
  closeButtonLabel?: string;
  label: string | ReactElement;
  /**
   * Unique id of the dialog
   */
  id?: string;
  onClose?: () => void;
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
  contentStyles,
  closeButtonLabel = 'Close dialog',
  label,
  id: outerId,
  onClose,
  role = 'dialog',
  scroll = 'content',
  secondaryLabel,
}: DialogProps) {
  const id = useUniqueId(outerId, 'dialog');
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
      <DialogBase
        aria-labelledby={headingId}
        aria-modal
        ref={dialogRef}
        role={role}
        scroll={scroll}
        styles={baseStyles}
      >
        <Flex>
          <DialogHeadingWrapper closable={!!onClose}>
            {secondaryLabel != null ? (
              <DialogSubHeading>{secondaryLabel}</DialogSubHeading>
            ) : null}
            <DialogHeading id={headingId}>{label}</DialogHeading>
          </DialogHeadingWrapper>
          {onClose ? (
            <DialogCloseButtonWrapper>
              <DialogCloseButton
                aria-label={closeButtonLabel}
                onClick={onClose}
                ref={closeButtonRef}
              />
            </DialogCloseButtonWrapper>
          ) : null}
        </Flex>
        <DialogContent styles={contentStyles}>{children}</DialogContent>
      </DialogBase>
    </Modal>
  );
}
