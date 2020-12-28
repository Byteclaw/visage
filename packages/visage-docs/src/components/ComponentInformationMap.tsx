import React from 'react';

export interface ComponentProperty {
  /**
   * If __type or undefined it means it doesn't have a parent type
   * and should be considered a direct prop
   */
  parent?: string;
  /**
   * Markdown with property documentation written as tsdoc
   */
  documentation: string;
  isOptional: boolean;
  name: string;
  type: string;
}

export interface ComponentInformation {
  properties: ComponentProperty[];
}

export interface ComponentsInformationMap {
  [component: string]: ComponentInformation;
}

export const ComponentInformationMapContext = React.createContext<ComponentsInformationMap>(
  {},
);

export function ComponentInformationMap({
  children,
  information,
}: {
  children: React.ReactNode;
  information: ComponentsInformationMap;
}) {
  return (
    <ComponentInformationMapContext.Provider value={information}>
      {children}
    </ComponentInformationMapContext.Provider>
  );
}
