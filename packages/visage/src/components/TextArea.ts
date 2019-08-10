import { createComponent } from '../core';
import { disabledControl, invalidControl } from './shared';

const TextAreaBaseControl = createComponent('textarea', {
  displayName: 'TextArea',
  defaultStyles: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: '1px',
    background: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: '2px solid transparent',
    outlineOffset: '-2px',
    m: 0,
    resize: 'vertical',
    py: 1,
    px: 2,
    width: '100%',
  },
});

export const TextArea = disabledControl(invalidControl(TextAreaBaseControl));
