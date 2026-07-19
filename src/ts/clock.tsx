import {
  Circle,
  Line,
  Text,
  Translate,
  useCanvasContext,
  useWindowSize,
} from '@blinkorb/rcx';
import { Fragment } from '@blinkorb/rcx/jsx-runtime';

import { getRadiansFromDegrees } from './utils';

const HOURS_IN_DAY = 24;
const MARKERS = [...Array(8)];

const Clock = () => {
  const { width, height } = useCanvasContext();
  const windowSize = useWindowSize();
  const maxSize = Math.min(width, height);

  const padding = (() => {
    if (windowSize.width <= 480) {
      return 10;
    }

    if (windowSize.width <= 768) {
      return 20;
    }

    return 40;
  })();

  const radius = maxSize * 0.5 - padding * 2;

  return (
    <Translate x={width * 0.5} y={height * 0.5}>
      <Circle x={0} y={0} radius={radius} style={{ fill: '#eee' }} />
      {MARKERS.map((_empty, index) => {
        const angle = getRadiansFromDegrees(
          (360 / MARKERS.length) * index - 90
        );

        return (
          <Fragment $key={index}>
            <Line
              startX={Math.cos(angle) * (radius - 60)}
              startY={Math.sin(angle) * (radius - 60)}
              endX={Math.cos(angle) * (radius - 70)}
              endY={Math.sin(angle) * (radius - 70)}
              style={{ strokeWidth: 2, stroke: 'black', strokeCap: 'round' }}
            />
            <Text
              x={Math.cos(angle) * (radius - 30)}
              y={Math.sin(angle) * (radius - 30)}
              style={{
                fontSize: 16,
                fill: 'black',
                align: 'center',
                baseline: 'middle',
              }}
            >
              {((HOURS_IN_DAY / MARKERS.length) * index)
                .toString()
                .padStart(2, '0')}
              :00
            </Text>
          </Fragment>
        );
      })}
    </Translate>
  );
};

export default Clock;
