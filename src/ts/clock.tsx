import { Circle, useCanvasContext, useWindowSize } from '@blinkorb/rcx';

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

  return (
    <Circle
      x={width * 0.5}
      y={height * 0.5}
      radius={maxSize * 0.5 - padding * 2}
      style={{ fill: 'red' }}
    />
  );
};

export default Clock;
