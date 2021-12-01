export type HandlerType = {
  start: (callback: (msg?: string) => void) => void;
  build: (callback: () => void) => void;
  getEntry: (mode: 'development' | 'production') => string;
};

export type DefinedHandler = (handler: HandlerType) => HandlerType;
