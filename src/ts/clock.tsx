import {
  AnyObject,
  Circle,
  Line,
  Path,
  RCXComponent,
  Rotate,
  Text,
  Translate,
  useCanvasContext,
  useOnMount,
  useReactive,
  useWindowSize,
} from '@blinkorb/rcx';
import { Fragment } from '@blinkorb/rcx/jsx-runtime';
import { /*getMoonTimes,*/ getTimes, SunTimes } from 'suncalc';

import Arc from './arc';
import Marker from './marker';
import { getRadiansFromDegrees, getSecondsFromMidnight } from './utils';

const HOURS_IN_DAY = 24;
const SECONDS_IN_A_DAY = HOURS_IN_DAY * 60 * 60;
const MARKERS = [...Array(8)];

type ExtractDateKeys<T extends AnyObject> = {
  [K in keyof Required<T>]: Required<T>[K] extends Date | null ? K : never;
}[keyof T];

type RemoveIndexSignature<T extends AnyObject> = {
  // copy all attributes from the person interface
  // and remove the index signature
  [
    K in keyof T as string extends K ? never : number extends K ? never : K
  ]: T[K];
};

type SunTimeName = ExtractDateKeys<RemoveIndexSignature<SunTimes>>;

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

  const sunTimesInRadians = (() => {
    if (!geolocation) {
      return null;
    }

    const sunTimes = getTimes(now, geolocation.latitude, geolocation.longitude);

    return Object.fromEntries(
      Object.entries(sunTimes)
        .filter((item): item is [string, Date] => item[1] instanceof Date)
        .map(
          ([key, value]) =>
            [
              key as SunTimeName,
              ((Math.PI * 2) / SECONDS_IN_A_DAY) *
                getSecondsFromMidnight(value),
            ] as const
        )
    ) as Partial<Record<SunTimeName, number>>;
  })();

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
        y={-15}
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
        y={15}
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
            y={50}
            style={{
              fontSize: 16,
              fill: 'black',
              align: 'center',
              baseline: 'middle',
            }}
          >
            Lat: {geolocation.latitude}
          </Text>
          <Text
            x={0}
            y={50 + 20}
            style={{
              fontSize: 16,
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
            <Marker
              angle={angle}
              outerRadius={radius - 60}
              thickness={10}
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
      <Arc
        outerRadius={radius - 120}
        thickness={20}
        startAngle={Math.PI * -0.5}
        endAngle={Math.PI * 0.5}
        style={{ fill: '#6771ff' }}
      />
      <Arc
        outerRadius={radius - 120}
        thickness={20}
        startAngle={Math.PI * 0.5}
        endAngle={Math.PI * 1.5}
        style={{ fill: '#5ee0a1' }}
      />
      {sunTimesInRadians && (
        /*
        ['night', 0.1174461142487851]
        ['nadir', 0.28485227833590787]
        ['nightEnd', 0.42004257331330197]
        ['nauticalDawn', 0.8954266283252574]
        ['dawn', 1.1557715750810782]
        ['sunrise', 1.3417218624706408]
        ['sunriseEnd', 1.3597569314079154]
        ['goldenHourEnd', 1.5615606261697599]
        ['solarNoon', 3.426444931925701]
        ['goldenHour', 5.28871124380365]
        ['sunsetStart', 5.48978771804383]
        ['sunset', 5.507750064928939]
        ['dusk', 5.692682243588171]
        ['nauticalDusk', 5.9506273626225]
        */
        <>
          {typeof sunTimesInRadians.night === 'number' &&
            typeof sunTimesInRadians.nightEnd === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.night - Math.PI * 0.5}
                endAngle={sunTimesInRadians.nightEnd - Math.PI * 0.5}
                style={{ fill: 'black' }}
              />
            )}
          {typeof sunTimesInRadians.nightEnd === 'number' &&
            typeof sunTimesInRadians.dawn === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.nightEnd - Math.PI * 0.5}
                endAngle={sunTimesInRadians.dawn - Math.PI * 0.5}
                style={{ fill: '#3b4a7c' }}
              />
            )}
          {typeof sunTimesInRadians.dawn === 'number' &&
            typeof sunTimesInRadians.sunrise === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.dawn - Math.PI * 0.5}
                endAngle={sunTimesInRadians.sunrise - Math.PI * 0.5}
                style={{ fill: 'red' }}
              />
            )}
          {typeof sunTimesInRadians.sunrise === 'number' &&
            typeof sunTimesInRadians.sunriseEnd === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.sunrise - Math.PI * 0.5}
                endAngle={sunTimesInRadians.sunriseEnd - Math.PI * 0.5}
                style={{ fill: 'orange' }}
              />
            )}
          {typeof sunTimesInRadians.sunriseEnd === 'number' &&
            typeof sunTimesInRadians.sunsetStart === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.sunriseEnd - Math.PI * 0.5}
                endAngle={sunTimesInRadians.sunsetStart - Math.PI * 0.5}
                style={{ fill: '#66abff' }}
              />
            )}
          {typeof sunTimesInRadians.sunsetStart === 'number' &&
            typeof sunTimesInRadians.sunset === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.sunsetStart - Math.PI * 0.5}
                endAngle={sunTimesInRadians.sunset - Math.PI * 0.5}
                style={{ fill: 'orange' }}
              />
            )}
          {typeof sunTimesInRadians.sunset === 'number' &&
            typeof sunTimesInRadians.dusk === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.sunset - Math.PI * 0.5}
                endAngle={sunTimesInRadians.dusk - Math.PI * 0.5}
                style={{ fill: 'red' }}
              />
            )}
          {typeof sunTimesInRadians.dusk === 'number' &&
            typeof sunTimesInRadians.night === 'number' && (
              <Arc
                outerRadius={radius - 100}
                thickness={20}
                startAngle={sunTimesInRadians.dusk - Math.PI * 0.5}
                endAngle={sunTimesInRadians.night - Math.PI * 0.5}
                style={{ fill: '#3b4a7c' }}
              />
            )}
          {typeof sunTimesInRadians.goldenHour === 'number' &&
            typeof sunTimesInRadians.goldenHourEnd === 'number' && (
              <Arc
                outerRadius={radius - 90}
                thickness={10}
                startAngle={sunTimesInRadians.goldenHour - Math.PI * 0.5}
                endAngle={sunTimesInRadians.goldenHourEnd - Math.PI * 0.5}
                style={{ fill: 'orange' }}
              />
            )}
          {typeof sunTimesInRadians.nauticalDawn === 'number' && (
            <Marker
              angle={sunTimesInRadians.nauticalDawn - Math.PI * 0.5}
              outerRadius={radius - 95}
              thickness={30}
              style={{ strokeWidth: 2, stroke: 'blue', strokeCap: 'round' }}
            />
          )}
          {typeof sunTimesInRadians.nauticalDusk === 'number' && (
            <Marker
              angle={sunTimesInRadians.nauticalDusk - Math.PI * 0.5}
              outerRadius={radius - 95}
              thickness={30}
              style={{ strokeWidth: 2, stroke: 'blue', strokeCap: 'round' }}
            />
          )}
          {typeof sunTimesInRadians.nadir === 'number' && (
            <Marker
              angle={sunTimesInRadians.nadir - Math.PI * 0.5}
              outerRadius={radius - 95}
              thickness={30}
              style={{ strokeWidth: 2, stroke: 'red', strokeCap: 'round' }}
            />
          )}
          {typeof sunTimesInRadians.solarNoon === 'number' && (
            <Marker
              angle={sunTimesInRadians.solarNoon - Math.PI * 0.5}
              outerRadius={radius - 95}
              thickness={30}
              style={{ strokeWidth: 2, stroke: 'red', strokeCap: 'round' }}
            />
          )}
        </>
      )}
      <Circle x={0} y={0} radius={5} style={{ fill: 'black' }} />
      <Rotate
        rotation={
          ((Math.PI * 2) / SECONDS_IN_A_DAY) * getSecondsFromMidnight(now) -
          Math.PI * 0.5
        }
      >
        <Line
          startX={0}
          startY={0}
          endX={radius}
          endY={0}
          style={{ stroke: 'black', strokeWidth: 1 }}
        />
        <Translate x={radius - 65} y={0}>
          <Path
            beginPath
            closePath
            points={[
              { x: 0, y: 0 },
              { x: -10, y: 5 },
              { x: -20, y: 0 },
              { x: -10, y: -5 },
            ]}
            style={{ fill: 'black' }}
          />
        </Translate>
      </Rotate>
    </Translate>
  );
};

export default Clock;
