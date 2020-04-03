import {
  Code,
  DataTable,
  DataTableBody,
  DataTableColumn,
  DataTableHeader,
  DataTableHeaderColumn,
  DataTableHeaderRow,
  DataTableRow,
  PreformattedCode,
  Toggle,
} from '@byteclaw/visage';
import Highlight, { defaultProps } from 'prism-react-renderer';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import React, { useContext, useMemo, useState } from 'react';
import { ThemeTogglerContext } from '../theme';
import {
  ComponentProperty,
  ComponentInformationMapContext,
} from './ComponentInformationMap';

function sortProps(a: ComponentProperty, b: ComponentProperty): number {
  if (a.isOptional && !b.isOptional) {
    return 1;
  }
  if (!a.isOptional && b.isOptional) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

interface PropTypesProps {
  component: string;
}

export function PropTypes({ component }: PropTypesProps) {
  const { [component]: information } = useContext(
    ComponentInformationMapContext,
  );
  const { isDark } = useContext(ThemeTogglerContext);
  const properties: {
    direct: ComponentProperty[];
    inherited: ComponentProperty[];
  } = useMemo(() => {
    const direct: ComponentProperty[] = [];
    const inherited: ComponentProperty[] = [];

    if (!information) {
      return { direct: [], inherited: [] };
    }

    information.properties.forEach(property => {
      if (!property.parent || property.parent === '__type') {
        direct.push(property);
      } else if (property.parent === 'StyleProps') {
        direct.push(property);
      } else {
        inherited.push(property);
      }
    });

    return {
      direct: direct.sort(sortProps),
      inherited: inherited.sort(sortProps),
    };
  }, [information]);
  const [showAllProps, setShowAllProps] = useState(false);

  return (
    <React.Fragment>
      <Toggle
        checked={showAllProps}
        onChange={e => setShowAllProps(e.currentTarget.checked)}
        label="Show all props"
      />
      <DataTable styles={{ border: 'none', fontSize: -1 }}>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHeaderColumn>Prop</DataTableHeaderColumn>
            <DataTableHeaderColumn>Required</DataTableHeaderColumn>
            <DataTableHeaderColumn>Type</DataTableHeaderColumn>
            <DataTableHeaderColumn>Description</DataTableHeaderColumn>
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {properties.direct.map(property => (
            <DataTableRow key={property.name}>
              <DataTableColumn>
                <Code>{property.name}</Code>
              </DataTableColumn>
              <DataTableColumn>
                {property.isOptional ? 'yes' : 'no'}
              </DataTableColumn>
              <DataTableColumn>
                <Highlight
                  {...defaultProps}
                  code={property.type}
                  language="typescript"
                  theme={isDark ? duotoneDark : duotoneLight}
                >
                  {({ tokens, getLineProps, getTokenProps }) => (
                    <PreformattedCode
                      styles={{
                        whiteSpace: 'normal',
                        maxWidth: 200,
                        m: 0,
                        p: 0,
                      }}
                    >
                      {tokens.map((line, i) => (
                        <span {...getLineProps({ line, key: i })}>
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </span>
                      ))}
                    </PreformattedCode>
                  )}
                </Highlight>
              </DataTableColumn>
              <DataTableColumn>{property.documentation}</DataTableColumn>
            </DataTableRow>
          ))}
          {showAllProps
            ? properties.inherited.map(property => (
                <DataTableRow key={property.name}>
                  <DataTableColumn>
                    <Code>{property.name}</Code>
                  </DataTableColumn>
                  <DataTableColumn>
                    {property.isOptional ? 'yes' : 'no'}
                  </DataTableColumn>
                  <DataTableColumn>
                    <Highlight
                      {...defaultProps}
                      code={property.type}
                      language="typescript"
                      theme={isDark ? duotoneDark : duotoneLight}
                    >
                      {({ tokens, getLineProps, getTokenProps }) => (
                        <PreformattedCode
                          styles={{
                            whiteSpace: 'normal',
                            maxWidth: 200,
                            m: 0,
                            p: 0,
                          }}
                        >
                          {tokens.map((line, i) => (
                            <span {...getLineProps({ line, key: i })}>
                              {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                              ))}
                            </span>
                          ))}
                        </PreformattedCode>
                      )}
                    </Highlight>
                  </DataTableColumn>
                  <DataTableColumn>{property.documentation}</DataTableColumn>
                </DataTableRow>
              ))
            : null}
        </DataTableBody>
      </DataTable>
    </React.Fragment>
  );
}
