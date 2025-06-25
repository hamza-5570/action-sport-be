declare module 'swagger-ui-dist/swagger-ui-es-bundle.js' {
  export interface SwaggerUIOptions {
    url?: string;
    dom_id?: string;
    spec?: Record<string, unknown>;
    presets?: unknown[];
    plugins?: unknown[];
    layout?: string;
    deepLinking?: boolean;
    [key: string]: unknown; // allow additional unknown properties
  }

  function SwaggerUI(opts: SwaggerUIOptions): void;

  export default SwaggerUI;
}
