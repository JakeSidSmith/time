import { Canvas, createRoot } from '@blinkorb/rcx';

import Clock from './clock';

const App = () => {
  return (
    <Canvas>
      <Clock />
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
