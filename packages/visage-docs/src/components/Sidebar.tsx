import React from 'react';
import { Link } from '../../../visage/src';

export function Sidebar() {
  return (
    <ul>
      <li>
        <Link href="/">Introduction</Link>
      </li>
      <li>
        <Link href="/">Getting started</Link>
      </li>
      <li>
        <Link href="/">Design system</Link>
      </li>
      <li>
        <Link href="/">Components</Link>
      </li>
      <li>
        <Link href="/">Core</Link>
      </li>
      <li>
        <Link href="/">Utilities</Link>
      </li>
    </ul>
  );
}
