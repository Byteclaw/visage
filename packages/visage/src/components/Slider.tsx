import { useDesignSystem } from '@byteclaw/visage-core';
import React, { useCallback, useMemo } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { IProps } from 'react-range/lib/types';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';
import { createControlActiveShadow, createControlFocusShadow } from './shared';

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
  },
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
  max: number;
  min: number;
  onChange: (values: number[]) => void;
  step: number;
  values: number[];
}

export const Slider = ({
  allowedValues,
  colors = ['primary', '#ccc'],
  max,
  min,
  onChange,
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

  const handleChange = useCallback(
    (vals: number[]) => {
      if (allowedValues && !vals.every(it => allowedValues.includes(it))) {
        return;
      }
      onChange(vals);
    },
    [onChange],
  );
  const renderTrack: IProps['renderTrack'] = useCallback(
    ({ props, children }) => {
      return (
        <Track
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={props.style}
        >
          <TrackProgress ref={props.ref} style={{ background }}>
            {children}
          </TrackProgress>
        </Track>
      );
    },
    [background],
  );
  const renderThumb: IProps['renderThumb'] = useCallback(
    ({ props }) => <Thumb {...props} />,
    [],
  );

  return (
    <Range
      values={values}
      step={step}
      min={min}
      max={max}
      onChange={handleChange}
      {...restProps}
      renderTrack={renderTrack}
      renderThumb={renderThumb}
    />
  );
};
