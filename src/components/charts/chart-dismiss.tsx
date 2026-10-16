import { createContext, useContext, useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type Subscribe = (listener: () => void) => () => void;

const ChartDismissContext = createContext<Subscribe | null>(null);

interface ChartDismissAreaProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Surface (e.g. a chart card) where a tap that lands on no chart element
 * clears the selection of every chart inside it. Chart elements are nested
 * pressables, so they win the touch and this only sees the misses.
 */
export function ChartDismissArea({ style, children }: ChartDismissAreaProps) {
  const [listeners] = useState(() => new Set<() => void>());
  const [subscribe] = useState<Subscribe>(() => (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  });

  return (
    <ChartDismissContext.Provider value={subscribe}>
      <Pressable
        style={style}
        accessible={false}
        onPress={() => listeners.forEach((listener) => listener())}
      >
        {children}
      </Pressable>
    </ChartDismissContext.Provider>
  );
}

/** Runs `onDismiss` when the enclosing `ChartDismissArea` is tapped outside any chart element. */
export function useChartDismiss(onDismiss: () => void) {
  const subscribe = useContext(ChartDismissContext);
  const handleDismiss = useEffectEvent(onDismiss);
  useEffect(() => subscribe?.(() => handleDismiss()), [subscribe]);
}
