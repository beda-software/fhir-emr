import { createContext } from 'react';

export type MarkdownProcessorFn = (value: string) => string;

export const defaultMarkdownProcessor: MarkdownProcessorFn = (value) => value;

export const MarkdownProcessorContext = createContext<MarkdownProcessorFn>(defaultMarkdownProcessor);
