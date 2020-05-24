export interface NavigationTreeNode {
  name: string;
  path: string;
  children: NavigationTreeNode[];
  title: string;
  urlPath: string;
}

export type NavigationTree = NavigationTreeNode[];
