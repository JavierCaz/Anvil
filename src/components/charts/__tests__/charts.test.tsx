import { fireEvent, render as rtlRender, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { BarTrendChart } from '@/components/charts/BarTrendChart';
import { LineTrendChart } from '@/components/charts/LineTrendChart';
import { MuscleDonut } from '@/components/charts/MuscleDonut';

// Reanimated 4 needs its worklets runtime mocked under Jest.
jest.mock('react-native-worklets', () => jest.requireActual('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));
jest.mock('@/theme/app-theme-provider', () => ({
  useAppTheme: () => ({ scheme: 'dark', colors: jest.requireActual('@/theme/colors').darkColors }),
}));
jest.mock('@/components/charts/chart-dismiss', () => ({ useChartDismiss: () => {} }));
jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn(() => Promise.resolve()) }));

type Container = Awaited<ReturnType<typeof rtlRender>>['container'];
type Instance = ReturnType<Container['queryAll']>[number];
let container: Container;

async function render(element: ReactElement) {
  container = (await rtlRender(element)).container;
}

const findAll = (predicate: (instance: Instance) => boolean) => container.queryAll(predicate);
const svgNodes = (type: string) => findAll((instance) => instance.type === type);

/** Charts draw nothing until they know their width — simulate the layout pass. */
async function layout(width: number) {
  const [node] = findAll((instance) => typeof instance.props.onLayout === 'function');
  await fireEvent(node, 'layout', { nativeEvent: { layout: { width, height: 180, x: 0, y: 0 } } });
}

describe('BarTrendChart', () => {
  const data = [
    { label: 'mon', value: 1 },
    { label: 'tue', value: 0 },
    { label: 'wed', value: 3 },
  ];

  it('draws one bar per point', async () => {
    await render(<BarTrendChart data={data} highlightIndex={2} color="#E86A33" colorDeep="#B04A1E" />);
    await layout(300);
    const bars = svgNodes('RNSVGRect').filter((node) => node.props.rx === 6);
    expect(bars).toHaveLength(3);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('shows a tooltip for a selected bar', async () => {
    await render(
      <BarTrendChart
        data={data}
        color="#E86A33"
        colorDeep="#B04A1E"
        formatValue={(value) => `${value} workouts`}
      />
    );
    await layout(300);
    await fireEvent(screen.getByLabelText('wed: 3 workouts'), 'accessibilityAction', {
      nativeEvent: { actionName: 'activate' },
    });
    expect(screen.getByText('3 workouts')).toBeTruthy();
  });
});

describe('LineTrendChart', () => {
  const data = [
    { day: '2026-11-01', value: 80, average: 80 },
    { day: '2026-11-03', value: 79.4, average: 79.7 },
    { day: '2026-11-08', value: 79.1, average: 79.4 },
  ];

  it('draws a marker for every weigh-in and selects the nearest on tap', async () => {
    await render(<LineTrendChart data={data} formatValue={(value) => `${value} kg`} />);
    await layout(320);
    const markers = svgNodes('RNSVGCircle');
    expect(markers).toHaveLength(3);

    const last = markers[2].props;
    // The Pressable hit area renders as a host View wired up as a touch responder.
    const [hitArea] = findAll((instance) => typeof instance.props.onResponderRelease === 'function');
    await fireEvent.press(hitArea, { nativeEvent: { locationX: last.cx, locationY: last.cy } });
    expect(screen.getByText('79.1 kg')).toBeTruthy();
  });

  it('draws nothing for an empty series', async () => {
    await render(<LineTrendChart data={[]} />);
    await layout(320);
    expect(svgNodes('RNSVGCircle')).toHaveLength(0);
  });
});

describe('MuscleDonut', () => {
  const slices = [
    { label: 'Chest', value: 6, color: '#E86A33' },
    { label: 'Back', value: 3, color: '#4A90D9' },
    { label: 'Legs', value: 3, color: '#3FB37F' },
  ];

  it('draws a ring slice per muscle with separators between them', async () => {
    await render(<MuscleDonut slices={slices} centerCaption="sets" />);
    expect(svgNodes('RNSVGPath')).toHaveLength(3);
    expect(svgNodes('RNSVGLine')).toHaveLength(3);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('shows the selected muscle in the centre', async () => {
    await render(<MuscleDonut slices={slices} centerCaption="sets" />);
    await fireEvent.press(screen.getAllByRole('button')[0]); // legend is ranked: Chest first
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('50% · sets')).toBeTruthy();
  });

  it('skips separators for a single muscle', async () => {
    await render(<MuscleDonut slices={[slices[0]]} centerCaption="sets" />);
    expect(svgNodes('RNSVGLine')).toHaveLength(0);
  });
});
