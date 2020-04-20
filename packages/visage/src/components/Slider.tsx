import { useDesignSystem } from '@byteclaw/visage-core';
import React, { useMemo } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { IProps } from 'react-range/lib/types';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';
import { createControlActiveShadow, createControlFocusShadow } from './shared';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useHandlerRef } from '../hooks';

const Thumb = createComponent(Flex, {
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

const Track = createComponent(Flex, {
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

const TrackProgress = createComponent(Box, {
  displayName: 'SliderTrackProgress',
  styles: {
    height: '0.5rem',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 'controlBorderRadius',
  },
});

export interface SliderProps {
  allowedValues?: number[];
  colors: string[];
  disabled?: boolean;
  max?: number;
  min?: number;
  onChange?: (values: number[]) => void;
  onFinalChange?: (values: number[]) => void;
  readOnly?: boolean;
  step?: number;
  values: number[];
}

export const Slider = ({
  allowedValues,
  colors = [
    'primary',
    'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
  ],
  disabled,
  max = 100,
  min = 0,
  onChange,
  onFinalChange,
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
      }),
    [ctx, colors, values, min, max],
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
    ({ disabled: isDisabled, props, children }) => {
      return (
        <Track
          //  only really disabled, because we set disabled for readOnly too
          disabled={isDisabled ? disabled : false}
          onMouseDown={!readOnly ? props.onMouseDown : undefined}
          onTouchStart={!readOnly ? props.onTouchStart : undefined}
          style={props.style}
        >
          <TrackProgress ref={props.ref} style={{ background }}>
            {children}
          </TrackProgress>
        </Track>
      );
    },
  );
  const renderThumb: IProps['renderThumb'] = useHandlerRef(({ props }) => (
    <Thumb
      aria-disabled={disabled}
      aria-readonly={readOnly}
      {...props}
      onKeyDown={!readOnly ? props.onKeyDown : undefined}
      onKeyUp={!readOnly ? props.onKeyUp : undefined}
      tabIndex={readOnly ? undefined : props.tabIndex}
    />
  ));

  return (
    <Range
      disabled={disabled || readOnly}
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
