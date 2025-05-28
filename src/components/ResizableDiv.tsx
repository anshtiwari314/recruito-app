import React, { useState, useRef, useEffect } from 'react';

const FloatingDraggableResizableDiv = () => {
  const divRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [direction, setDirection] = useState(null);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
        if (isResizing && divRef.current && direction) {
          let newWidth = dimensions.width;
          let newHeight = dimensions.height;
          let newTop = position.top;
          let newLeft = position.left;
  
          if (direction.includes('right')) {
            newWidth = startX + e.clientX - offsetX;
          } else if (direction.includes('left')) {
            newWidth = startX - (e.clientX - offsetX);
            newLeft = dragStartPosition.left + (offsetX - e.clientX);
          }
  
          if (direction.includes('bottom')) {
            newHeight = startY + e.clientY - offsetY;
          } else if (direction.includes('top')) {
            newHeight = startY - (e.clientY - offsetY);
            newTop = dragStartPosition.top + (offsetY - e.clientY);
          } else if (direction.includes('top-left')) {
            newWidth = startX - (e.clientX - offsetX);
            newLeft = dragStartPosition.left + (offsetX - e.clientX);
            newHeight = startY - (e.clientY - offsetY);
            newTop = dragStartPosition.top + (offsetY - e.clientY);
          } else if (direction.includes('top-right')) {
            newWidth = startX + e.clientX - offsetX;
            newHeight = startY - (e.clientY - offsetY);
            newTop = dragStartPosition.top + (offsetY - e.clientY);
          } else if (direction.includes('bottom-left')) {
            newWidth = startX - (e.clientX - offsetX);
            newLeft = dragStartPosition.left + (offsetX - e.clientX);
            newHeight = startY + e.clientY - offsetY;
          } else if (direction.includes('bottom-right')) {
            newWidth = startX + e.clientX - offsetX;
            newHeight = startY + e.clientY - offsetY;
          } else if (direction === 'left') {
            newWidth = startX - (e.clientX - offsetX);
            newLeft = dragStartPosition.left + (offsetX - e.clientX);
          } else if (direction === 'right') {
            newWidth = startX + e.clientX - offsetX;
          } else if (direction === 'top') {
            newHeight = startY - (e.clientY - offsetY);
            newTop = dragStartPosition.top + (offsetY - e.clientY);
          } else if (direction === 'bottom') {
            newHeight = startY + e.clientY - offsetY;
          }
  
          setDimensions({
            width: Math.max(50, newWidth),
            height: Math.max(50, newHeight),
          });
          setPosition({
            top: newTop,
            left: newLeft,
          });
        } else if (isDragging && divRef.current) {
          setPosition({
            top: dragStartPosition.top + e.clientY - dragStartY,
            left: dragStartPosition.left + e.clientX - dragStartX,
          });
        }
      };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      setDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, offsetX, offsetY, startX, startY, direction, dimensions, position, dragStartX, dragStartY]);

  const [dragStartPosition, setDragStartPosition] = useState({ top: 0, left: 0 });

  const handleResizeMouseDown = (e, dir) => {
    setIsResizing(true);
    setDirection(dir);
    setOffsetX(e.clientX);
    setOffsetY(e.clientY);
    setStartX(dimensions.width);
    setStartY(dimensions.height);
    setDragStartPosition({ top: position.top, left: position.left }); // Capture position for resizing
  };

  const handleDragMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setDragStartPosition({ top: position.top, left: position.left }); // Capture position for dragging
  };

  const resizerStyle = {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.1)',
    cursor: 'grab',
  };

  const draggableStyle = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    border: '1px solid black',
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    cursor: isDragging ? 'grabbing' : 'grab', // Change cursor during drag
  };

  return (
    <div
      ref={divRef}
      style={draggableStyle}
      onMouseDown={handleDragMouseDown} // Start dragging on mousedown on the main div
    >
      {/* Top-left resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '10px',
          height: '10px',
          top: '0',
          left: '0',
          cursor: 'nw-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation(); // Prevent dragging when resizing
          handleResizeMouseDown(e, 'top-left');
        }}
      />
      {/* Top-right resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '10px',
          height: '10px',
          top: '0',
          right: '0',
          cursor: 'ne-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'top-right');
        }}
      />
      {/* Bottom-left resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '10px',
          height: '10px',
          bottom: '0',
          left: '0',
          cursor: 'sw-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'bottom-left');
        }}
      />
      {/* Bottom-right resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '10px',
          height: '10px',
          bottom: '0',
          right: '0',
          cursor: 'se-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'bottom-right');
        }}
      />
      {/* Top resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '100%',
          height: '5px',
          top: '0',
          left: '0',
          cursor: 'n-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'top');
        }}
      />
      {/* Bottom resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '100%',
          height: '5px',
          bottom: '0',
          left: '0',
          cursor: 's-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'bottom');
        }}
      />
      {/* Left resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '5px',
          height: '100%',
          top: '0',
          left: '0',
          cursor: 'w-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'left');
        }}
      />
      {/* Right resizer */}
      <div
        style={{
          ...resizerStyle,
          width: '5px',
          height: '100%',
          top: '0',
          right: '0',
          cursor: 'e-resize',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeMouseDown(e, 'right');
        }}
      />
      {/* Content of the div */}
      <div style={{ padding: '10px' }}>Floating Draggable Resizable Content</div>
    </div>
  );
};

export default FloatingDraggableResizableDiv;