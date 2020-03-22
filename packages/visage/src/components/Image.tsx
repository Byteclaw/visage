import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef } from 'react';
import { createComponent } from '../core';

const ImageContainer = createComponent('div', {
  displayName: 'ImageContainer',
  styles: {
    position: 'relative',
    minWidth: '4rem',
    maxWidth: '100%',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'relative',
    },
  },
});

const Img = createComponent('img', {
  displayName: 'Img',
  styles: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '100%',
    maxWidth: '100%',
  },
});

interface ImageProps {
  alt?: string;
  aspectRatio?: number;
  containerProps?: ExtractVisageComponentProps<typeof ImageContainer>;
  imgProps?: ExtractVisageComponentProps<typeof Img>;
  height?: number;
  src?: string;
  width?: number;
}

export const Image: VisageComponent<ImageProps> = forwardRef(
  (
    {
      alt,
      aspectRatio,
      containerProps,
      imgProps,
      height,
      src,
      width,
      ...restProps
    }: any,
    ref: any,
  ) => {
    return (
      <ImageContainer
        {...restProps}
        {...containerProps}
        styles={{
          height,
          width,
          '&::after': {
            paddingBottom:
              typeof aspectRatio === 'number'
                ? `${100 / aspectRatio}%`
                : '100%',
          },
          ...(containerProps ? containerProps.styles : {}),
        }}
      >
        <Img alt={alt} ref={ref} src={src} {...imgProps} />
      </ImageContainer>
    );
  },
);

markAsVisageComponent(Image);
