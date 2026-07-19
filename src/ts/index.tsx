import { Canvas, createRoot, useOnMount, useReactive } from '@blinkorb/rcx';

import Clock from './clock';

const App = () => {
  const reactive = useReactive<{ geolocation: null | GeolocationCoordinates }>({
    geolocation: null,
  });

  useOnMount(() => {
    if ('geolocation' in globalThis.navigator) {
      globalThis.navigator.geolocation.getCurrentPosition(
        (location) => {
          reactive.geolocation = location.coords;
        },
        (error) => {
          alert(error.message);
        }
      );
    }
  });

  return (
    <Canvas>
      <Clock geolocation={reactive.geolocation} />
    </Canvas>
  );
};

const init = () => {
  const canvas = globalThis.document.getElementById('canvas');

  if (!canvas) {
    alert('Could not get canvas element');
    return;
  }

  const root = createRoot(canvas);

  if ('error' in root) {
    alert(root.error);
    return;
  }

  root.render(<App />);
};

init();
