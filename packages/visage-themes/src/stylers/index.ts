import { ThemeStylerMap } from '@byteclaw/visage-core';

export const stylers: ThemeStylerMap = {
  boxShadow: {
    resolver: 'boxShadowColor',
  },
  m: { format: 'sizeUnit', resolver: 'gridSize', outputProps: ['margin'] },
  margin: { format: 'sizeUnit', resolver: 'gridSize' },
  my: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginTop', 'marginBottom'],
  },
  mx: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginLeft', 'marginRight'],
  },
  mb: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginBottom'],
  },
  marginBottom: { format: 'sizeUnit', resolver: 'gridSize' },
  marginLeft: { format: 'sizeUnit', resolver: 'gridSize' },
  marginRight: { format: 'sizeUnit', resolver: 'gridSize' },
  marginTop: { format: 'sizeUnit', resolver: 'gridSize' },
  ml: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginLeft'],
  },
  mr: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginRight'],
  },
  mt: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['marginTop'],
  },
  p: { format: 'sizeUnit', resolver: 'gridSize', outputProps: ['padding'] },
  padding: { format: 'sizeUnit', resolver: 'gridSize' },
  py: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingTop', 'paddingBottom'],
  },
  px: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingLeft', 'paddingRight'],
  },
  paddingBottom: { format: 'sizeUnit', resolver: 'gridSize' },
  paddingLeft: { format: 'sizeUnit', resolver: 'gridSize' },
  paddingRight: { format: 'sizeUnit', resolver: 'gridSize' },
  paddingTop: { format: 'sizeUnit', resolver: 'gridSize' },
  pb: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingBottom'],
  },
  pl: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingLeft'],
  },
  pr: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingRight'],
  },
  pt: {
    format: 'sizeUnit',
    resolver: 'gridSize',
    outputProps: ['paddingTop'],
  },
  height: {
    format: 'sizeUnit',
  },
  width: {
    format: 'sizeUnit',
  },
};
