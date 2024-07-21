import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [ws, setWs] = useState(null);
  const [coordinates, setCoordinates] = useState({ grid_x: null, grid_y: null });

  useEffect(() => {
    const ws = new WebSocket('wss://192.168.1.44:8000/ws/coordinates');

    ws.onopen = () => {
      console.log('WebSocket connected');
      alert('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received coordinates:', data);
      setCoordinates({ grid_x: data.grid_x, grid_y: data.grid_y });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Define grid size and total number of cells
  const gridSize = 50;
  const numCellsX = 10; // Example: 10 cells in X direction
  const numCellsY = 10; // Example: 10 cells in Y direction

  // Calculate styles for marking coordinates
  const cellStyle = {
    width: gridSize,
    height: gridSize,
    border: '1px solid #ccc',
    display: 'inline-block',
    boxSizing: 'border-box',
    position: 'relative',
  };

  const markStyle = {
    position: 'absolute',
    width: gridSize,
    height: gridSize,
    backgroundColor: 'rgba(0, 255, 0, 0.5)', // Green with transparency
  };

  // Render grid with marked coordinates
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < numCellsY; y++) {
      for (let x = 0; x < numCellsX; x++) {
        const cellKey = `${x}-${y}`;
        const isMarked = coordinates.grid_x === x && coordinates.grid_y === y;

        cells.push(
          <div key={cellKey} style={cellStyle}>
            {isMarked && <div style={markStyle} />}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div>
      <h2>Grid with WebSocket Coordinates</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: numCellsX * gridSize }}>
        {renderGrid()}
      </div>
    </div>
  );
};

export default WebSocketComponent;
