import { useDesignSystem } from '@byteclaw/visage-core';
import React, { useCallback, useMemo } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { Box } from './Box';
import { Flex } from './Flex';
import { createControlActiveShadow, createControlFocusShadow } from './shared';

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

  return (
    <Range
      values={values}
      step={step}
      min={min}
      max={max}
      onChange={handleChange}
      {...restProps}
      renderTrack={({ props, children }) => (
        <Flex
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          styles={{
            ...props.style,
            height: '2.5rem',
            width: '100%',
          }}
        >
          <Box
            ref={props.ref}
            styles={{
              height: '0.5rem',
              width: '100%',
              alignSelf: 'center',
              borderRadius: 'controlBorderRadius',
            }}
            style={{ background }}
          >
            {children}
          </Box>
        </Flex>
      )}
      renderThumb={({ props }) => (
        <Flex
          {...props}
          styles={{
            ...props.style,
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
              boxShadow: `0px 2px 6px #AAA, ${createControlFocusShadow(
                'primary',
              )}`,
            },
            '&:focus:active': {
              boxShadow: createControlActiveShadow('primary'),
            },
          }}
        />
      )}
    />
  );
};
