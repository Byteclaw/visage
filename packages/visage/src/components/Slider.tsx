import { useDesignSystem } from '@byteclaw/visage-core';
import React, { useMemo, ReactElement, ReactNode } from 'react';
import { getTrackBackground, Range } from 'react-range';
import {
  Direction,
  IProps,
  IThumbProps,
  ITrackProps,
} from 'react-range/lib/types';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';
import { createControlActiveShadow, createControlFocusShadow } from './shared';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useHandlerRef } from '../hooks';

export const SliderDirection = Direction;

export const SliderThumb = createComponent(Flex, {
  displayName: 'SliderThumb',
  styles: {
    transition: 'box-shadow 150ms ease-in',
    height: ['3rem', '3rem', '1.5rem'],
    width: ['3rem', '3rem', '1.5rem'],
    borderRadius: '50%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 6px #AAA',
    '&:focus': {
      outline: 'none',
      boxShadow: `0px 2px 6px #AAA, ${createControlFocusShadow('primary')}`,
    },
    '&:focus:active': {
      boxShadow: createControlActiveShadow('primary'),
    },
  },
});

export const SliderTrack = createComponent(Flex, {
  displayName: 'SliderTrack',
  styles: {
    height: '2.5rem',
    width: '100%',
    ...booleanVariantStyles('disabled', {
      on: {
        opacity: 0.3,
      },
    }),
  },
  variants: [booleanVariant('disabled', true)],
});

export const SliderTrackProgress = createComponent(Box, {
  displayName: 'SliderTrackProgress',
  styles: {
    height: '0.5rem',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 'controlBorderRadius',
  },
});

interface SliderThumbProps extends IThumbProps {
  value: number;
  index: number;
  isDragged: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

interface SliderTrackProps extends ITrackProps {
  background: string;
  children: ReactNode;
  isDragged: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

type SliderThumbRenderer = (props: SliderThumbProps) => ReactElement;
type SliderTrackRenderer = (props: SliderTrackProps) => ReactElement;

export interface SliderProps {
  /**
   * Allows you to set up fixed steps
   */
  allowedValues?: number[];
  /**
   * If there are multiple values on a single track, should they be allowed to overlap? Default is false.
   */
  allowOverlap?: boolean;
  /**
   * Colors passed to getTrackBackground from react-range
   */
  colors?: string[];
  /**
   * Orientation of Slider (vertical vs horizontal) and the direction in in which value increases. Use enum SliderDirection as a value. Default value is SliderDirection.Right.
   */
  direction?: Direction;
  disabled?: boolean;
  /**
   * Maximal value
   */
  max?: number;
  /**
   * Minimal value
   */
  min?: number;
  onChange?: (values: number[]) => void;
  /**
   * On final change, use this to react on change in your forms
   *
   * This prop is called after user stops interacting with Thumb
   */
  onFinalChange?: (values: number[]) => void;
  readOnly?: boolean;
  /**
   * Custom render function for thumb
   */
  renderThumb?: SliderThumbRenderer;
  /**
   * Custom render function for track
   */
  renderTrack?: SliderTrackRenderer;
  /**
   * Optimize Slider for right-to-left layouts?
   */
  rtl?: boolean;
  /**
   * How big step is?
   */
  step?: number;
  /**
   * Current value, slider can be multi thumb, so it's an array
   */
  values: number[];
}

const defaultColors = [
  'primary',
  'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
];

export const Slider = ({
  allowedValues,
  colors = defaultColors,
  direction,
  disabled,
  max = 100,
  min = 0,
  onChange,
  onFinalChange,
  renderThumb: thumbRenderer,
  renderTrack: trackRenderer,
  readOnly,
  step,
  values,
  ...restProps
}: SliderProps) => {
  const ctx = useDesignSystem();

  const background = useMemo(
    () =>
      getTrackBackground({
        values,
        colors: colors.map(c =>
          ctx.ctx.resolve('color', c, ctx.ctx),
        ) as string[],
        min,
        max,
        direction,
      }),
    [ctx, colors, values, min, max, direction],
  );

  const onChangeHandler = useHandlerRef((vals: number[]) => {
    if (allowedValues && !vals.every(it => allowedValues.includes(it))) {
      return;
    }

    if (onChange) {
      onChange(vals);
    }
  });
  const onFinalChangeHandler = useHandlerRef((vals: number[]) => {
    if (allowedValues && !vals.every(it => allowedValues.includes(it))) {
      return;
    }

    if (onFinalChange) {
      onFinalChange(vals);
    }
  });
  const renderTrack: IProps['renderTrack'] = useHandlerRef(
    ({ disabled: isDisabled, props, children, ...extra }) => {
      if (trackRenderer) {
        return trackRenderer({
          ...props,
          ...extra,
          background,
          children,
          disabled: isDisabled,
          readOnly,
        });
      }

      return (
        <SliderTrack
          //  only really disabled, because we set disabled for readOnly too
          disabled={isDisabled ? disabled : false}
          onMouseDown={!readOnly ? props.onMouseDown : undefined}
          onTouchStart={!readOnly ? props.onTouchStart : undefined}
          style={props.style}
        >
          <SliderTrackProgress ref={props.ref} style={{ background }}>
            {children}
          </SliderTrackProgress>
        </SliderTrack>
      );
    },
  );
  const renderThumb: IProps['renderThumb'] = useHandlerRef(
    ({ props, ...extra }) => {
      if (thumbRenderer) {
        return thumbRenderer({ ...props, ...extra, disabled, readOnly });
      }

      return (
        <SliderThumb
          aria-disabled={disabled}
          aria-readonly={readOnly}
          {...props}
          onKeyDown={!readOnly ? props.onKeyDown : undefined}
          onKeyUp={!readOnly ? props.onKeyUp : undefined}
          tabIndex={readOnly ? undefined : props.tabIndex}
        />
      );
    },
  );

  return (
    <Range
      disabled={disabled || readOnly}
      direction={direction}
      values={values}
      step={step}
      min={min}
      max={max}
      onChange={onChangeHandler}
      onFinalChange={onFinalChangeHandler}
      {...restProps}
      renderTrack={renderTrack}
      renderThumb={renderThumb}
    />
  );
};
