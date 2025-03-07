import React from 'react';
import { Button, Space } from 'antd';
import {
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useSize } from 'ahooks';
import useImage from 'use-image';
import Konva from 'konva';
import { Circle, Layer, Stage, Image, Line } from 'react-konva';
import { Card } from '../../../../components';
import DianJi from './dianji.png';

type LineData = { start: [number, number]; end: [number, number] };

export const PositionImage = () => {
  const [editable, setEditable] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const [lines, setLines] = React.useState<LineData[]>([
    { start: [100, 200], end: [522, 343] },
    { start: [310, 200], end: [390, 260] }
  ]);
  const [prevLines, setPrevLines] = React.useState<LineData[]>([]);

  return (
    <Card ref={ref} style={{ height: '100%', minHeight: 500, position: 'relative' }}>
      {size && (
        <Stage width={size.width - 32} height={size.height - 32}>
          <Layer>
            <DianJiImage size={size} />
            <DianJiOver
              lines={lines}
              editable={editable}
              onDragMove={(points, i) =>
                setLines(
                  lines.map((line, index) => {
                    if (i === index) {
                      return { ...line, end: points };
                    } else {
                      return line;
                    }
                  })
                )
              }
            />
          </Layer>
        </Stage>
      )}
      <Space direction='vertical' style={{ position: 'absolute', bottom: 16, right: 16 }}>
        {editable ? (
          <>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setEditable(false);
                setLines(prevLines);
              }}
            />
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                setEditable(false);
                setPrevLines([]);
              }}
            />
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditable(true);
                setPrevLines(lines);
              }}
            />
            <Button icon={<SettingOutlined />} />
          </>
        )}
      </Space>
    </Card>
  );
};

function DianJiImage({ size }: { size: { width: number; height: number } }) {
  const imageRef = React.useRef<Konva.Image>(null);
  console.log('size', size);
  console.log('image width, height', imageRef?.current?.getWidth(), imageRef?.current?.getHeight());
  const x = (size.width - 32 - imageRef?.current?.getWidth()) / 2;
  const y = (size.height - 32 - imageRef.current?.getHeight()) / 2;
  React.useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, []);
  const [image] = useImage(DianJi);
  return <Image image={image} x={x} y={y} ref={imageRef} strokeWidth={2} stroke={'red'} />;
}

function DianJiOver({
  lines,
  editable,
  onDragMove
}: {
  lines: LineData[];
  editable: boolean;
  onDragMove: (point: [number, number], index: number) => void;
}) {
  const listening = editable;
  return lines.map((line, i) => {
    const { start, end } = line;
    const connectedPoint = [start[0], end[1]];
    return (
      <React.Fragment key={i}>
        <Line
          points={start.concat(connectedPoint).concat(end)}
          stroke={'#69b1ff'}
          strokeWidth={1}
        />
        <Circle
          x={end[0]}
          y={end[1]}
          radius={6}
          fill='#1677ff'
          draggable
          onMouseOut={() => (document.body.style.cursor = 'default')}
          onMouseOver={() => (document.body.style.cursor = 'pointer')}
          onDragMove={(e) => {
            document.body.style.cursor = 'pointer';
            onDragMove([e.target.x(), e.target.y()], i);
          }}
          listening={listening}
        />
      </React.Fragment>
    );
  });
}
