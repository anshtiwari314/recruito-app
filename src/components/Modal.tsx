import React, { useEffect, useState } from 'react';

const Modal = ({
  width,
  height,
  x,
  y,
  msg = null,
  heading = null,
  type = 'info',
  time = null,
  onDismiss,
  onFix
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close functionality
  useEffect(() => {
    if (time !== null && time > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, time * 1000);
      return () => clearTimeout(timer);
    }
  }, [time, onDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleFix = () => {
    setIsVisible(false);
    if (onFix) {
      onFix();
    }
  };

  if (!isVisible) {
    return null;
  }

  // --- Color Definitions Based on Type ---
  let primaryColor = '#007bff'; // Info (Blue)
  let headerTextColor = '#333';
  let messageTextColor = '#555';
  let messageBgColor = '#f9f9f9'; // Default light gray background for message

  switch (type) {
    case 'success':
      primaryColor = '#28a745'; // Green
      headerTextColor = '#28a745'; // Green heading
      messageTextColor = '#218838'; // Darker green text
      messageBgColor = '#d4edda'; // Light green background
      break;
    case 'error':
      primaryColor = '#dc3545'; // Red
      headerTextColor = '#dc3545'; // Red heading
      messageTextColor = '#c82333'; // Darker red text
      messageBgColor = '#f8d7da'; // Light red background
      break;
    case 'info':
    default:
      primaryColor = '#007bff'; // Blue
      headerTextColor = '#007bff'; // Blue heading
      messageTextColor = '#0056b3'; // Darker blue text
      messageBgColor = '#e0f7fa'; // Light blue background
      break;
  }

  // --- Inline Styles Definitions ---

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
    color: '#333',
    //borderLeft: `5px solid ${primaryColor}`, // Dynamic border color
    position: 'fixed', // Essential for x, y positioning relative to viewport
    
    // --- NEW: Min/Max Dimensions ---
    minWidth: '300px', // Minimum width to prevent content squashing
    minHeight: '250px', // Minimum height to ensure buttons and content fit
    maxWidth: 'calc(100vw - 40px)', // Max width 100vw minus 20px padding on each side (for small screens)
    maxHeight: 'calc(100vh - 40px)',// Max height 100vh minus 20px padding on each side (for small screens)
    
    // Explicit width/height from props (these will override min/max if larger)
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,

    zIndex: 1000,
    // Initialize positioning properties
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    transform: 'none' // Reset transform by default
  };

  // --- Positioning Logic ---
  let transformX = '';
  let transformY = '';

  // Handle X-coordinate
  if (typeof x === 'number') {
    modalContentStyle.left = `${x}px`;
  } else if (typeof x === 'string') {
    if (x.endsWith('%')) {
      modalContentStyle.left = x; // Apply percentage directly
    } else if (x === 'left') {
      modalContentStyle.left = '0';
    } else if (x === 'right') {
      modalContentStyle.right = '0';
    } else if (x === 'center') {
      modalContentStyle.left = '50%';
      transformX = 'translateX(-50%)'; // Add X-axis centering transform
    }
  }

  // Handle Y-coordinate (relative to bottom if numeric, otherwise relative to top/bottom/center)
  if (typeof y === 'number') {
    modalContentStyle.bottom = `${y}px`; // numeric y means from bottom
  } else if (typeof y === 'string') {
    if (y.endsWith('%')) {
      modalContentStyle.top = y; // For 'y' percentage, we typically apply to 'top'
    } else if (y === 'top') {
      modalContentStyle.top = '0';
    } else if (y === 'bottom') {
      modalContentStyle.bottom = '0';
    } else if (y === 'center') {
      modalContentStyle.top = '50%';
      transformY = 'translateY(-50%)'; // Add Y-axis centering transform
    }
  }

  // Combine transforms if both X and Y are centered
  if (transformX && transformY) {
    modalContentStyle.transform = `${transformX} ${transformY}`;
  } else if (transformX) {
    modalContentStyle.transform = transformX;
  } else if (transformY) {
    modalContentStyle.transform = transformY;
  }


  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
    marginBottom: '15px',
  };

  const headingStyle = {
    margin: 0,
    fontSize: '1.5em',
    color: headerTextColor, // Dynamic header text color
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '2em',
    lineHeight: 1,
    cursor: 'pointer',
    color: primaryColor, // Dynamic close button color (matches border)
    padding: 0,
  };

  const bodyStyle = {
    flexGrow: 1,
    fontSize: '1em',
    lineHeight: 1.5,
    color: messageTextColor, // Dynamic message text color
    marginBottom: '20px',
    padding: '10px', // Add some padding to the message background
    backgroundColor: messageBgColor, // Dynamic message background color
    borderRadius: '5px', // Slightly rounded corners for the message background
    //overflow: 'auto', // Important: Add scroll if content exceeds body height
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
  };

  const dismissButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f0f0f0',
    color: '#333',
  };

  const fixButtonStyle = {
    ...buttonStyle,
    backgroundColor: primaryColor, // Fix button color matches primary color
    color: '#fff',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          {heading && <h3 style={headingStyle}>{heading}</h3>}
          <button style={closeButtonStyle} onClick={handleClose}>
            &times;
          </button>
        </div>
        {
        msg ? 
        <div style={bodyStyle}>
          <p>{msg}</p>
        </div>
        :null
        }
        
        <div style={footerStyle}>
          {type === 'error' && (
            <button style={fixButtonStyle} onClick={handleFix}>
              Fix
            </button>
          )}
          <button style={dismissButtonStyle} onClick={handleClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;