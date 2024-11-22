import React from 'react';
import { useDrag } from 'react-dnd';

const ElementList = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type: 'TEXT_INPUT' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className="element-list">
      <h3>Form Elements</h3>
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>Text Input</div>
      <div draggable>Button</div>
      <div draggable>Checkbox</div>
      {/* Add more elements */}
    </div>
  );
};

export default ElementList;
