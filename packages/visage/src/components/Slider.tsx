import { useDesignSystem } from '@byteclaw/visage-core';
import React, { useCallback, useMemo } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { Box } from './Box';
import { Flex } from './Flex';

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
  const { breakpoint, theme } = useDesignSystem();

  const background = useMemo(
    () =>
      getTrackBackground({
        values,
        colors: colors.map(c => theme.resolve('color', c, breakpoint).value),
        min,
        max,
      }),
    [breakpoint, colors, values, min, max, theme],
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
      renderThumb={({ props, isDragged }) => (
        <Flex
          {...props}
          styles={{
            ...props.style,
            height: '3em',
            width: '3em',
            borderRadius: 'controlBorderRadius',
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 2px 6px #AAA',
          }}
        >
          <Box
            styles={{
              borderRadius: 'controlBorderRadius',
              backgroundColor: isDragged ? 'primary' : '#CCC',
              height: isDragged ? '2rem' : '1rem',
              width: '5px',
              transition: 'height 150ms ease-in',
            }}
          />
        </Flex>
      )}
    />
  );
};
