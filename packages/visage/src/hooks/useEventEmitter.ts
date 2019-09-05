import { createContext, useContext, useState } from 'react';

interface EventEmitter<TEvents extends string> {
  emit(event: TEvents, ...args: any[]): void;
  on(event: TEvents, listener: Function): Function;
}

export function createEventEmitter<
  TEvents extends string = string
>(): EventEmitter<TEvents> {
  const events: Record<TEvents, Function[]> = {} as Record<TEvents, Function[]>;

  return {
    emit(event: TEvents, ...args: any[]) {
      (events[event] || []).forEach(listener => listener(...args));
    },
    on(event: TEvents, listener: Function) {
      (events[event] = events[event] || []).push(listener);

      return () => {
        events[event] = events[event].filter(cb => cb !== listener);
      };
    },
  };
}

export const EventEmitterContext = createContext<EventEmitter<any>>(
  createEventEmitter(),
);

/**
 * Connects to event emitter in context
 */
export function useEventEmitter<
  TEvents extends string = string
>(): EventEmitter<TEvents> {
  return useContext(EventEmitterContext);
}

/**
 * Creates an instance of event emitter
 */
export function useEventEmitterInstance<
  TEvents extends string = string
>(): EventEmitter<TEvents> {
  return useState(createEventEmitter())[0];
}
