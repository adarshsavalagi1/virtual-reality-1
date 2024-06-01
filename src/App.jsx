import 'aframe';
import 'aframe-extras';
import React, { useEffect, useState } from 'react';
import { Entity, Scene } from 'aframe-react';
import Image1 from './assets/1.jpg';
import Image2 from './assets/2.jpg';

function VRViewer() {
  const [image, setImage] = useState(Image1);

  const changeImage = () => {
    setImage(image === Image1 ? Image2 : Image1);
  };

  return (
    <div>
      <Scene>
        <Entity primitive="a-sky" src={image} />
        <Entity primitive="a-camera" wasd-controls-enabled="true">
          <Entity
            cursor="fuse: true; fuseTimeout: 500"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: #CCC; shader: flat"
          />
        </Entity>
      </Scene>
      <button onClick={changeImage} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Change Image
      </button>
    </div>
  );
}

export default VRViewer;
