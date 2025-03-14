import React from 'react';
import { Button, Space } from 'antd';
import { Stage, Image, Line, Circle, Layer, Group } from 'react-konva';
import useImage from 'use-image';
import DianJi from './dianji.png';
import {
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
  SettingOutlined
} from '@ant-design/icons';

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };
type Line = { starting: Point; end: Point };

type GroupProps = { size: Size; x: number; y: number; scale: number };

export const Canvas = ({
  children,
  size
}: {
  children: (props: GroupProps) => React.ReactNode;
  size: Size;
}) => {
  const { image, ...groupProps } = useGroupProps(size);
  const { x, y, scale } = groupProps;
  return (
    <Stage {...size}>
      <Layer>
        <Group scaleX={scale} scaleY={scale} x={x} y={y}>
          {image && (
            <>
              <Image width={image.width} height={image.height} image={image} />
              {children({ ...groupProps, size })}
            </>
          )}
        </Group>
      </Layer>
    </Stage>
  );
};

export function LineMarkerList({
  lines,
  editable,
  onDragMove
}: {
  lines: Line[];
  editable: boolean;
  onDragMove: (point: Point, index: number) => void;
}) {
  return lines.map(({ starting, end }, i) => (
    <LineMarker
      key={i}
      start={starting}
      end={end}
      editable={editable}
      onDragMove={(point) => onDragMove(point, i)}
    />
  ));
}

function useGroupProps(size: Size) {
  const [image] = useImage(DianJi);
  let aspectRatio = 1,
    scaleX = 1,
    scaleY = 1,
    scale = 1,
    x = 1,
    y = 1;
  if (image) {
    aspectRatio = image.width / image.height;
    scaleX = size.width / image.width;
    scaleY = size.height / image.height;
    scale = aspectRatio < 1 ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
    x = (size.width - image.width * scale) / 2;
    y = (size.height - image.height * scale) / 2;
  }
  return { image, x, y, scale };
}

export function getCentralPoint({
  size,
  x,
  y,
  scale
}: {
  size: Size;
} & GroupProps) {
  return {
    x: (size.width / 2 - x) / scale,
    y: (size.height / 2 - y) / scale
  };
}

export function getStartingPoints(groupProps: GroupProps, popLen: number) {
  const { size, x, y, scale } = groupProps;
  const popX = popLen / 2;
  const popY = popLen;
  const leftTop = { x: (popX - x) / scale, y: (popY - y) / scale };
  const rightTop = { x: (size.width - popX - x) / scale, y: (popY - y) / scale };
  const leftBottom = { x: (popX - x) / scale, y: (size.height - popY - y) / scale };
  const rightBottom = { x: (size.width - popX - x) / scale, y: (size.height - popY - y) / scale };
  return [leftTop, rightTop, leftBottom, rightBottom];
}

const LineMarker = ({
  start,
  end,
  editable,
  onDragMove
}: {
  start: Point;
  end: Point;
  editable: boolean;
  onDragMove: (point: Point) => void;
}) => {
  const connectedPoint = [start.x, end.y];

  return (
    <React.Fragment>
      <Line
        points={[start.x, start.y].concat(connectedPoint).concat([end.x, end.y])}
        stroke={'#69b1ff'}
        strokeWidth={1}
      />
      <Circle
        {...end}
        radius={5}
        fill='#1677ff'
        draggable
        onMouseOut={() => (document.body.style.cursor = 'default')}
        onMouseOver={() => (document.body.style.cursor = 'move')}
        onDragMove={(e) => {
          document.body.style.cursor = 'move';
          onDragMove(e.target.position());
        }}
        listening={editable}
      />
    </React.Fragment>
  );
};
