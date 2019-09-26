import React, { useMemo } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { Box } from './Box';
import { Flex } from './Flex';

export interface SliderProps {
  colors: string[];
  max: number;
  min: number;
  onChange: (values: number[]) => void;
  step: number;
  values: number[];
}

export const Slider = ({
  colors = ['#548BF4', '#ccc'],
  max,
  min,
  onChange,
  step,
  values,
  ...restProps
}: SliderProps) => {
  const background = useMemo(
    () =>
      getTrackBackground({
        values,
        colors,
        min,
        max,
      }),
    [colors, values, min, max],
  );

  return (
    <Range
      values={values}
      step={step}
      min={min}
      max={max}
      onChange={onChange}
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
            height: '3rem',
            width: '3rem',
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 2px 6px #AAA',
          }}
        >
          <Box
            styles={{
              height: isDragged ? '2rem' : '1rem',
              width: '5px',
            }}
            style={{
              backgroundColor: isDragged ? '#548BF4' : '#CCC',
            }}
          />
        </Flex>
      )}
    />
  );
};
