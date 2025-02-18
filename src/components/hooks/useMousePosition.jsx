import React from 'react';

const useMousePosition = ({id}) => {
  const [
    mousePosition,
    setMousePosition
  ] = React.useState({ x: null, y: null });

  React.useEffect(() => {
    const updateMousePosition = e => {
      setMousePosition({ x: e.offsetX, y: e.offsetY });
    };

    window.document.getElementById(id).addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;