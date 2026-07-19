import {
  Ellipse,
  RCXComponent,
  RCXShapeStyle,
  RCXStyleProp,
} from '@blinkorb/rcx';

export interface ArcProps {
  outerRadius: number;
  thickness: number;
  startAngle: number;
  endAngle: number;
  style?: RCXStyleProp<RCXShapeStyle>;
}

const Arc: RCXComponent<ArcProps> = ({
  outerRadius,
  thickness,
  startAngle,
  endAngle,
  style,
}) => {
  return (
    <Ellipse
      beginPath
      x={0}
      y={0}
      startAngle={startAngle}
      endAngle={endAngle}
      radiusX={outerRadius}
      radiusY={outerRadius}
      style={style}
    >
      <Ellipse
        beginPath={false}
        closePath
        x={0}
        y={0}
        counterClockwise
        startAngle={endAngle}
        endAngle={startAngle}
        radiusX={outerRadius - thickness}
        radiusY={outerRadius - thickness}
      />
    </Ellipse>
  );
};

export default Arc;
