declare module 'react-csv' {
  import { ComponentType, ReactNode } from 'react';

  export interface CSVProps {
    data: any[];
    headers?: Array<{ label: string; key: string }>;
    filename?: string;
    separator?: string;
    target?: string;
    enclosingCharacter?: string;
    className?: string;
    style?: object;
    children?: ReactNode;
  }

  export const CSVLink: ComponentType<CSVProps>;
  export const CSVDownload: ComponentType<CSVProps>;
}
