import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import React, { useEffect, useState } from 'react';
import Image1 from './assets/1.jpg';
import Image2 from './assets/2.jpg';

function App() {
  
  const [image, setImage] = useState(1);
  const [zoom,setZoom]= useState(0);
  const changeZoom=(obj)=>{console.log(obj.zoomLevel);setZoom(0)}
  useEffect(()=>{console.log(zoom)},[zoom])
  const changeImage = () => {
    setImage(image === 1 ? 2 : 1);
  }
  
  return (
    <div className="App">
      {image == 1 && <ReactPhotoSphereViewer src={Image1} onZoomChange={changeZoom} defaultZoomLvl={0} height={'100vh'} width={"100%"}></ReactPhotoSphereViewer>}
      {image == 2 && <ReactPhotoSphereViewer src={Image2} height={'100vh'} defaultZoomLvl={0} width={"100%"}></ReactPhotoSphereViewer>}
      <button onClick={changeImage}>hi</button>
    </div>
  );
}

export default App;