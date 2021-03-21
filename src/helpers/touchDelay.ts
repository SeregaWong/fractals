
type Milliseconds = number;
type AnyHandler = (...args: any[]) => void;

export function toucherBuilder<Handler extends AnyHandler>(handler: Handler, delay: Milliseconds) {
    let handlerId: NodeJS.Timeout | undefined;

    return (...args: Parameters<Handler>) => {
        if (handlerId) clearTimeout(handlerId);
        handlerId = setTimeout(() => {
            handlerId = undefined;
            handler(...args);
        }, delay);
    };
}

export function toucherHookBuilder(delay: Milliseconds) {
    let handlerId: NodeJS.Timeout | undefined;

    return (handler: () => void, ctxDelay?: Milliseconds) => {
        if (handlerId) clearTimeout(handlerId);
        handlerId = setTimeout(() => {
            handlerId = undefined;
            handler();
        }, ctxDelay || delay);
    };
}
