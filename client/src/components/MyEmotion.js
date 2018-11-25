import React from 'react';
import Emoji from './Emoji';
import { Link } from 'react-router-dom';

const MyEmotion = props => {
  const { emoji, color, text } = props.location.state;

  const style = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      background: color,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      fontSize: '670%',
    },
  };

  return (
    <Link to="/overview">
      <div style={style.container}>
        <div>
          <Emoji symbol={emoji} style={{ display: 'block' }} />
          <br />
          <h1 style={{ fontSize: 84, color: 'white' }}>{text}</h1>
        </div>
      </div>
    </Link>
  );
};

export default MyEmotion;
