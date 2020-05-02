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
  Tab,
  Tabs,
} from '@byteclaw/visage';
import Highlight, { defaultProps } from 'prism-react-renderer';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import React, { useContext, useMemo } from 'react';
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

function sortGroups(component: string) {
  return (a: string, b: string) => {
    if (a.startsWith(component) && !b.startsWith(component)) {
      return -1;
    }

    if (!a.startsWith(component) && b.startsWith(component)) {
      return 1;
    }

    if (a > b) {
      return 1;
    }

    if (a < b) {
      return -1;
    }

    return 0;
  };
}

interface PropTypesProps {
  component: string;
}

export function PropTypes({ component }: PropTypesProps) {
  const { [component]: information } = useContext(
    ComponentInformationMapContext,
  );
  const { isDark } = useContext(ThemeTogglerContext);
  const groups: {
    source: string;
    props: ComponentProperty[];
  }[] = useMemo(() => {
    const foundGroups: { [source: string]: ComponentProperty[] } = {};

    if (!information) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Information for ${component} is missing. Make sure you added a component name to frontmatter.components array`,
        );
      }
      return [];
    }

    const componentPropInterfaceName = `${component}Props`;

    information.properties.forEach(property => {
      // ignore emotion's css property
      if (property.name === 'css') {
        return;
      }

      if (
        !property.parent ||
        property.parent === '__type' ||
        property.parent === componentPropInterfaceName
      ) {
        foundGroups[component] = [...(foundGroups[component] || []), property];
      } else if (property.parent === 'StyleProps') {
        // ignore parentStyles because they are used internally
        if (
          property.name === 'parentStyles' ||
          property.name === '$$variants'
        ) {
          return;
        }

        foundGroups[component] = [...(foundGroups[component] || []), property];
      } else {
        const group = property.parent || 'Inherited';
        foundGroups[group] = [...(foundGroups[group] || []), property];
      }
    });

    return Object.keys(foundGroups)
      .sort(sortGroups(component))
      .map(source => ({
        source,
        props: foundGroups[source].sort(sortProps),
      })) as { source: string; props: ComponentProperty[] }[];
  }, [information]);

  return (
    <Tabs>
      {groups.map(group => (
        <Tab
          key={group.source}
          label={group.source}
          styles={{ overflowX: 'scroll' }}
        >
          {() => (
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
                {group.props.map(property => (
                  <DataTableRow key={property.name}>
                    <DataTableColumn>
                      <Code>{property.name}</Code>
                    </DataTableColumn>
                    <DataTableColumn>
                      {property.isOptional ? 'no' : 'yes'}
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
              </DataTableBody>
            </DataTable>
          )}
        </Tab>
      ))}
    </Tabs>
  );
}
