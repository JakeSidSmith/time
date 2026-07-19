import {
  Circle,
  Line,
  RCXComponent,
  Text,
  Translate,
  useCanvasContext,
  useOnMount,
  useReactive,
  useUnreactive,
  useWindowSize,
} from '@blinkorb/rcx';
import { Fragment } from '@blinkorb/rcx/jsx-runtime';
import { /*getMoonTimes,*/ getTimes } from 'suncalc';

import { getRadiansFromDegrees } from './utils';

const HOURS_IN_DAY = 24;
const MARKERS = [...Array(8)];

const useTimeNow = () => {
  const reactive = useReactive({ now: Date.now() });

  useOnMount(() => {
    const interval = globalThis.setInterval(() => {
      reactive.now = Date.now();
    }, 500);

    return () => {
      globalThis.clearInterval(interval);
    };
  });

  return new Date(reactive.now);
};

const Clock: RCXComponent<{ geolocation: null | GeolocationCoordinates }> = ({
  geolocation,
}) => {
  const now = useTimeNow();
  const { width, height } = useCanvasContext();
  const windowSize = useWindowSize();
  const maxSize = Math.min(width, height);

  const sunTimes = (() => {
    if (!geolocation) {
      return null;
    }

    return getTimes(now, geolocation.latitude, geolocation.longitude);
  })();

  const unreactive = useUnreactive({ rendered: false });

  if (!unreactive.rendered && sunTimes) {
    console.log(sunTimes);
    unreactive.rendered = true;
  }

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
      <Text
        x={0}
        y={-60}
        style={{
          fontSize: 20,
          fill: 'black',
          align: 'center',
          baseline: 'middle',
        }}
      >
        {now.toLocaleTimeString(globalThis.navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })}
      </Text>
      <Text
        x={0}
        y={-30}
        style={{
          fontSize: 20,
          fill: 'black',
          align: 'center',
          baseline: 'middle',
        }}
      >
        {now.toLocaleTimeString(globalThis.navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })}
      </Text>
      {geolocation && (
        <>
          <Text
            x={0}
            y={0}
            style={{
              fontSize: 20,
              fill: 'black',
              align: 'center',
              baseline: 'middle',
            }}
          >
            Lat: {geolocation.latitude}
          </Text>
          <Text
            x={0}
            y={30}
            style={{
              fontSize: 20,
              fill: 'black',
              align: 'center',
              baseline: 'middle',
            }}
          >
            Lng: {geolocation.longitude}
          </Text>
        </>
      )}
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
