import React from 'react';
import { Visage } from './types';

export const VisageContext = React.createContext<Visage<any> | undefined>(
  undefined,
);

VisageContext.displayName = 'VisageContext';
