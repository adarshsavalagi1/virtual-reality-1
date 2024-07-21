import 'aframe';
import 'aframe-extras';
import React, { useEffect, useState } from 'react';
import { Entity, Scene } from 'aframe-react';
import {
  one_one,
  one_two,
  one_three,
  one_four,
  one_five,
  two_five,
  three_five,
  four_five,
  five_five,
  five_four,
  five_three,
  five_two,
  four_one,
  three_one,
  two_one,
  three_three
} from './assets/real/Images';

function VRViewer() {
  const imageMap = {
    one_one,
    one_two,
    one_three,
    one_four,
    one_five,
    two_five,
    three_five,
    four_five,
    five_five,
    five_four,
    five_three,
    five_two,
    four_one,
    three_one,
    two_one,
    three_three
  };

  const [image, setImage] = useState(imageMap['one_one']);
  const [address, setAddress] = useState('ws://192.168.1.44:8000/ws/coordinates');
  const [got, setGot] = useState(false);

  const changeImage = (imageName) => {
    if (imageMap[imageName]) {
      setImage(imageMap[imageName]);
    } else {
      console.warn(`Image with name ${imageName} not found`);
    }
  };

  useEffect(() => {
    let socket = null;

    const connect = () => {
      socket = new WebSocket(address);
      alert('Connecting to server...');

      socket.addEventListener('open', function (event) {
        console.log('Connected to server');
      });

      socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        changeImage(data.image_name);
        console.log('Message from server: ', data.image_name);
      });

      socket.addEventListener('close', function (event) {
        console.log('Server closed connection: ', event);
        console.log('Reconnecting...');
        setTimeout(connect, 1000);
      });

      socket.addEventListener('error', function (event) {
        console.log('Error: ', event);
        alert('Error connecting to server');
      });
    };

    connect();

    return () => socket && socket.close();
  }, [address]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  };

  const inputStyle = {
    width: '80%',
    maxWidth: '400px',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <>
      {!got && (
        <div style={containerStyle}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={() => setGot(true)}
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Submit
          </button>
        </div>
      )}
      {got && (
        <div>
          <Scene>
            <Entity primitive="a-sky" src={image} />
            <Entity primitive="a-camera" wasd-controls-enabled="true">
              <Entity
                cursor="fuse: true; fuseTimeout: 500"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.005; radiusOuter: 0.01"
                material="color: #CCC; shader: flat"
              />
            </Entity>
          </Scene>
        </div>
      )}
    </>
  );
}

export default VRViewer;
