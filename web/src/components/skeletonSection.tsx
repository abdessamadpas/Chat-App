
import { DotChartOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Divider, Form, Radio, Skeleton, Space, Switch } from 'antd';

type SizeType = 'default' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';
type AvatarShapeType = 'circle' | 'square';

function SkeletonSection() {
    const [active, setActive] = useState(true);
    const [block, setBlock] = useState(false);
    const [size, setSize] = useState<SizeType>('small');
    const [buttonShape, setButtonShape] = useState<ButtonShapeType>('default');
    const [avatarShape, setAvatarShape] = useState<AvatarShapeType>('circle');
  return (
    < div className='flex flex-col w-full '>
    <div className='flex flex-col  p-4 '>
        <Space>
            <Skeleton.Avatar active={active} size={'large'} shape={avatarShape} />
            <Skeleton.Input active={active} size={size} />
        </Space>
        <br />
        <Skeleton.Button active={active} size={size} shape={buttonShape} block={block} />
        <br />
        <Skeleton.Input active={active} size={size} block={block} />
        <br />
        <Space>
            <Skeleton.Image active={active} />
            <Skeleton.Node active={active}>
            <DotChartOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
            </Skeleton.Node>
        </Space>
    </div>

    <div className='flex flex-col p-4 items-end'>
      <Space>
          <Skeleton.Input active={active} size={size}  />
          <Skeleton.Avatar active={active} size={'large'} shape={avatarShape} />
      </Space>
      <br />
      <Skeleton.Button active={active} size={size} shape={buttonShape} block={block} />
      <br />
      <Skeleton.Input active={active} size={size} block={block} />
      <br />
      <Space>
          <Skeleton.Image active={active} />
          <Skeleton.Node active={active}>
          <DotChartOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
          </Skeleton.Node>
      </Space>
  </div>
</div>
  );
}

export default SkeletonSection