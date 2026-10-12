declare module '*.scss';

declare module 'pagedjs' {
    export class Previewer {
        preview(content?: unknown, stylesheets?: unknown, renderTo?: HTMLElement): Promise<unknown>;
    }
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.svg" {
    const value: string;
    export default value;
}