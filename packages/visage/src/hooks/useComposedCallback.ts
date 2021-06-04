import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';

function composeHandler<TCallback extends (...args: any[]) => any = () => void>(
  ...handlers: (TCallback | undefined)[]
): TCallback {
  return ((...args: any[]) => {
    handlers.forEach(handler => {
      if (handler) {
        handler(...args);
      }
    });
  }) as TCallback;
}

export function useComposedCallbackCreator<
  TCallback extends (...args: any[]) => any = () => void,
>(...callbacks: (TCallback | undefined)[]) {
  return useStaticCallbackCreator(composeHandler, callbacks);
}
