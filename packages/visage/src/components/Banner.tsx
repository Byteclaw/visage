import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, ReactNode, MouseEvent, Ref } from 'react';
import {
  DangerIcon,
  InfoIcon,
  NeutralMessageIcon,
  SuccessIcon,
  WarningIcon,
} from '../assets';
import { createComponent } from '../core';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles as createVariantStyles,
} from '../variants';
import { Box } from './Box';
import { CloseButton } from './CloseButton';
import { Flex } from './Flex';
import { Heading } from './Heading';
import { SvgIcon } from './SvgIcon';
import { createControlFocusShadow } from './shared';

const statusIcons = {
  default: NeutralMessageIcon,
  critical: DangerIcon,
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
};

const variantStyles: { [key: string]: VisageStyleSheet } = {
  critical: {
    borderColor: 'color(danger, shade(10%))',
    backgroundColor: 'danger',
    color: 'dangerText',
    '&:focus': {
      boxShadow: createControlFocusShadow('danger'),
    },
  },
  info: {
    borderColor: 'color(info, shade(10%))',
    backgroundColor: 'info',
    color: 'infoText',
    '&:focus': {
      boxShadow: createControlFocusShadow('info'),
    },
  },
  success: {
    borderColor: 'color(success, shade(10%))',
    backgroundColor: 'success',
    color: 'successText',
    '&:focus': {
      boxShadow: createControlFocusShadow('success'),
    },
  },
  warning: {
    borderColor: 'color(warning, shade(10%))',
    backgroundColor: 'warning',
    color: 'warningText',
    '&:focus': {
      boxShadow: createControlFocusShadow('warning'),
    },
  },
  default: {
    borderColor: 'color(neutral, shade(10%))',
    backgroundColor: 'neutral',
    color: 'neutralText',
    '&:focus': {
      boxShadow: createControlFocusShadow('neutral'),
    },
  },
};

const BannerBase = createComponent(Flex, {
  displayName: 'Banner',
  styles: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    outline: 'none',
    p: 2,
    my: 1,
    transition: 'box-shadow 150ms ease-out',
    ...booleanVariantStyles('flat', {
      off: {
        boxShadow:
          '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
      },
    }),
    ...createVariantStyles('status', variantStyles),
  },
  variants: [
    booleanVariant('flat', true),
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

const ribbonVariantStyles: { [key: string]: VisageStyleSheet } = {
  // maybe we can remove these names and use color function instead?
  critical: {
    color: 'dangerText',
  },
  info: {
    color: 'infoText',
  },
  success: {
    color: 'successText',
  },
  warning: {
    color: 'warningText',
  },
  default: {
    color: 'neutralText',
  },
};

const BannerRibbon = createComponent('div', {
  displayName: 'BannerRibbon',
  styles: {
    fontSize: 1,
    mr: 2,
    ...createVariantStyles('status', ribbonVariantStyles),
  },
  variants: [
    variant('status', true, [
      'critical',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

export type BannerRibbonProps = ExtractVisageComponentProps<
  typeof BannerRibbon
>;

const BannerContent = createComponent(Box, {
  displayName: 'BannerContent',
  styles: {
    width: '100%',
  },
});

export type BannerContentProps = ExtractVisageComponentProps<
  typeof BannerContent
>;

const BannerHeading = createComponent(Heading, {
  displayName: 'BannerHeading',
  defaultProps: {
    level: 5,
  },
  styles: {
    fontSize: 1,
    fontWeight: 500,
    lineHeight: 1,
    mt: 0,
    mb: 1,
    pt: 0,
  },
});

export type BannerHeadingProps = ExtractVisageComponentProps<
  typeof BannerHeading
>;

const BannerCloseButtonWrapper = createComponent(Box, {
  displayName: 'BannerCloseButtonWrapper',
  styles: {
    mr: -1,
    mt: -1,
  },
});

export type BannerCloseButtonWrapperProps = ExtractVisageComponentProps<
  typeof BannerCloseButtonWrapper
>;

interface BannerBaseProps
  extends Omit<ExtractVisageComponentProps<typeof BannerBase>, 'title'> {}

interface BannerProps {
  closeButtonWrapperProps?: BannerCloseButtonWrapperProps;
  contentProps?: BannerContentProps;
  headingProps?: BannerHeadingProps;
  ribbonProps?: BannerRibbonProps;
  children: ReactNode;
  dismissLabel?: string;
  /** Pass false to disable icon */
  icon?: ReactNode;
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  title?: ReactNode;
}

export const Banner: VisageComponent<
  BannerProps & BannerBaseProps
> = markAsVisageComponent(
  forwardRef(
    (
      {
        children,
        closeButtonWrapperProps,
        contentProps,
        dismissLabel = 'Dismiss notification',
        icon,
        headingProps,
        status = 'default',
        onDismiss,
        title,
        ribbonProps,
        ...restProps
      }: BannerProps & BannerBaseProps,
      ref: Ref<any>,
    ) => {
      return (
        <BannerBase
          aria-live="polite"
          role={
            status === 'critical' || status === 'warning' ? 'alert' : 'status'
          }
          tabIndex={0}
          status={status}
          ref={ref}
          {...restProps}
        >
          {icon !== false ? (
            <BannerRibbon {...ribbonProps} aria-hidden status={status}>
              {icon != null ? (
                icon
              ) : (
                <SvgIcon
                  aria-hidden
                  icon={
                    statusIcons[status as keyof typeof statusIcons] ||
                    statusIcons.default
                  }
                />
              )}
            </BannerRibbon>
          ) : null}
          <BannerContent {...contentProps}>
            {title != null ? (
              <BannerHeading {...headingProps}>{title}</BannerHeading>
            ) : null}
            {children}
          </BannerContent>
          {onDismiss ? (
            <BannerCloseButtonWrapper {...closeButtonWrapperProps}>
              <CloseButton aria-label={dismissLabel} onClick={onDismiss} />
            </BannerCloseButtonWrapper>
          ) : null}
        </BannerBase>
      );
    },
  ),
) as any;
