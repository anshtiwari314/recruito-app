import React, { useState, useRef, useEffect } from 'react';

const DraggableResizableBox = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 200, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const boxRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.target === boxRef.current) {
      setIsDragging(true);
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  // Handle mouse down for resizing
  const handleResizeMouseDown = (direction, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startPos.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  // Handle mouse move for both dragging and resizing
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y
      });
    } else if (isResizing) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      setSize(prevSize => {
        const newSize = { ...prevSize };
        
        if (resizeDirection.includes('right')) {
          newSize.width = Math.max(50, prevSize.width + deltaX);
        }
        if (resizeDirection.includes('bottom')) {
          newSize.height = Math.max(50, prevSize.height + deltaY);
        }
        if (resizeDirection.includes('left')) {
          newSize.width = Math.max(50, prevSize.width - deltaX);
          setPosition(prevPos => ({
            ...prevPos,
            x: prevPos.x + deltaX
          }));
        }
        if (resizeDirection.includes('top')) {
          newSize.height = Math.max(50, prevSize.height - deltaY);
          setPosition(prevPos => ({
            ...prevPos,
            y: prevPos.y + deltaY
          }));
        }

        return newSize;
      });

      startPos.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  // Handle mouse up to stop dragging/resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  // Resize handles for each direction
  const renderResizeHandle = (direction) => (
    <div
      className={`resize-handle resize-${direction}`}
      onMouseDown={(e) => handleResizeMouseDown(direction, e)}
    />
  );

  return (
    <div
      ref={boxRef}
      className="draggable-box"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        border: '2px solid #333',
        backgroundColor: '#f0f0f0',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="box-content">
        Drag me from anywhere inside
        <br />
        Resize from the edges
      </div>
      
      {/* Resize handles */}
      {renderResizeHandle('top')}
      {renderResizeHandle('right')}
      {renderResizeHandle('bottom')}
      {renderResizeHandle('left')}
      {renderResizeHandle('top-right')}
      {renderResizeHandle('bottom-right')}
      {renderResizeHandle('bottom-left')}
      {renderResizeHandle('top-left')}
      
      <style jsx>{`
        .draggable-box {
          position: absolute;
          box-sizing: border-box;
        }
        .box-content {
          padding: 10px;
          height: calc(100% - 20px);
        }
        .resize-handle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #333;
          z-index: 10;
        }
        .resize-top {
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          cursor: n-resize;
        }
        .resize-right {
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          cursor: e-resize;
        }
        .resize-bottom {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          cursor: s-resize;
        }
        .resize-left {
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          cursor: w-resize;
        }
        .resize-top-right {
          top: -4px;
          right: -4px;
          cursor: ne-resize;
        }
        .resize-bottom-right {
          bottom: -4px;
          right: -4px;
          cursor: se-resize;
        }
        .resize-bottom-left {
          bottom: -4px;
          left: -4px;
          cursor: sw-resize;
        }
        .resize-top-left {
          top: -4px;
          left: -4px;
          cursor: nw-resize;
        }
      `}</style>
    </div>
  );
};

export default DraggableResizableBox;