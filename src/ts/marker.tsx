import { Line, RCXComponent, RCXShapeStyle, RCXStyleProp } from '@blinkorb/rcx';

export interface MarkerProps {
  outerRadius: number;
  thickness: number;
  angle: number;
  style?: RCXStyleProp<RCXShapeStyle>;
}

const Marker: RCXComponent<MarkerProps> = ({
  outerRadius,
  thickness,
  angle,
  style,
}) => {
  return (
    <Line
      startX={Math.cos(angle) * (outerRadius - thickness)}
      startY={Math.sin(angle) * (outerRadius - thickness)}
      endX={Math.cos(angle) * outerRadius}
      endY={Math.sin(angle) * outerRadius}
      style={style}
    />
  );
};

export default Marker;
