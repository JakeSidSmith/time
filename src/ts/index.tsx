import { Canvas, createRoot, Rectangle } from '@blinkorb/rcx';

const App = () => {
  return (
    <Canvas>
      <Rectangle x={0} y={0} width={100} height={100} style={{ fill: 'red' }} />
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
