import React from 'react';

declare global {
  namespace JSX {
    type Element = React.ReactElement;
    interface ElementClass extends React.Component {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
      children: React.ReactNode;
    }
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}

export {};
