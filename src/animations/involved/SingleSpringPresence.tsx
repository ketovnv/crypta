import { useEffect, useRef } from "react";
// @ts-ignore
import { core, OptimizedAnimated } from "@stores/core";

type SingleSpringPresenceProps<T> = {
  item: T | null;
  keyExtractor: (item: T) => string | number;
  from?: (item: T) => any;
  enter?: (item: T) => any;
  leave?: (item: T) => any;
  preset?: string;
  initial?: boolean;
  onDisappear?: (item: T) => void;
  children: (item: T, springs: any) => React.ReactNode;
};

export const SingleSpringPresence = <T,>({
  item,
  keyExtractor,
  from = () => ({ opacity: 0, scale: 0.9 }),
  enter = () => ({ opacity: 1, scale: 1 }),
  leave = () => ({ opacity: 0, scale: 0.9 }),
  preset = "gentle",
  initial = true,
  onDisappear,
  children,
}: SingleSpringPresenceProps<T>) => {
  const controllerRef = useRef<any>(null);
  const prevItemRef = useRef<T | null>(null);

  useEffect(() => {
    const prev = prevItemRef.current;
    const key = item ? keyExtractor(item) : null;

    if (item && key && (!prev || keyExtractor(prev) !== key)) {
      controllerRef.current?.dispose?.();
      const ctrl = core.createController(
        `single-${key}`,
        initial ? from(item) : enter(item),
        preset,
      );
      ctrl.start(enter(item));
      controllerRef.current = ctrl;
      prevItemRef.current = item;
    }

    if (!item && prev) {
      const key = keyExtractor(prev);
      controllerRef.current?.start(leave(prev), {
        onRest: () => {
          controllerRef.current?.dispose?.();
          controllerRef.current = null;
          onDisappear?.(prev);
        },
      });
      prevItemRef.current = null;
    }

    return () => {
      controllerRef.current?.dispose?.();
    };
  }, [item]);

  if (!item || !controllerRef.current) return null;

  return (
    <OptimizedAnimated.div style={controllerRef.current.springs}>
      {children(item, controllerRef.current.springs)}
    </OptimizedAnimated.div>
  );
};
