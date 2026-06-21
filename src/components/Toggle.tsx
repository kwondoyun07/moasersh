import React from 'react';
import { colors } from '../tokens';

interface Props {
  on: boolean;
  onToggle: () => void;
}

/** iOS-style switch matching the design (44×26 track, 21px knob). */
export const Toggle: React.FC<Props> = ({ on, onToggle }) => (
  <div
    role="switch"
    aria-checked={on}
    onClick={onToggle}
    style={{
      position: 'relative', width: 48, height: 27, borderRadius: 14, cursor: 'pointer',
      transition: 'background .15s', background: on ? colors.ink : '#D1D6DB',
    }}
  >
    <div
      style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 21, height: 21, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .15s',
      }}
    />
  </div>
);
