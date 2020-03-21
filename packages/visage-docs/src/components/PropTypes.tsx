import React, { useContext, useMemo } from 'react';
import {
  ComponentProperty,
  ComponentInformationMapContext,
} from './ComponentInformationMap';

interface PropTypesProps {
  component: string;
}

export function PropTypes({ component }: PropTypesProps) {
  const { [component]: information } = useContext(
    ComponentInformationMapContext,
  );
  const properties: ComponentProperty[] = useMemo(() => {
    const directProps: ComponentProperty[] = [];
    const styleProps: ComponentProperty[] = [];
    const inheritedProps: ComponentProperty[] = [];

    if (!information) {
      return [];
    }

    information.properties.forEach(property => {
      if (!property.parent || property.parent === '__type') {
        directProps.push(property);
      } else if (property.parent === 'StyleProps') {
        styleProps.push(property);
      } else {
        inheritedProps.push(property);
      }
    });

    return [...directProps, ...styleProps, ...inheritedProps];
  }, [information]);

  return (
    <table>
      <tbody>
        {properties.map(property => (
          <tr key={property.name}>
            <td>{property.name}</td>
            <td>{property.isOptional ? 'optional' : 'required'}</td>
            <td>{property.type}</td>
            <td>{property.documentation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
