
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import React from 'react';

function App() {
  return (
    <div className="App">
      <ReactPhotoSphereViewer src="https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg" height={'100vh'} width={"100%"}></ReactPhotoSphereViewer>
    </div>
  );
}

export default App;