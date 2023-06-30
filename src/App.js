import React from 'react';
import './App.css';
import { faPowerOff, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { soundsGroup, soundsName } from './Sounds.js';


const DrumPad = ({
  play,
  sound: { id, key, url, keyCode },
  power
}) => {
  const handleKeyDown = (e) => {
  if (power && keyCode === e.keyCode) {
    const audio = document.getElementById(key);
    play(key, id);
    const drumPad = document.getElementById(keyCode);
    drumPad.classList.add("active");
    document.activeElement.blur(); 
    setTimeout(() => {
      drumPad.classList.remove("active");
    }, 200);
  }
};

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
   
  }, [power]);

  return (
    <button
      id={keyCode}
      className="drum-pad"
      onClick={handleKeyDown}
      disabled={!power}
    >
      <audio className="clip" src={url} id={key} />
      {key}
    </button>
  );
};


const Drums = ({ sounds, play, power}) => (
  <div className="drums">
    {power
      ? sounds.map((sound) => (
          <DrumPad
            sound={sound}
            play={play}
            power={power}
            key={`${sound.id}-${sound.key}`}
            
          />
        ))
      : sounds.map((sound) => (
          <DrumPad
            sound={{ ...sound, url: "#" }}
            play={play}
            power={power}
            key={`${sound.id}-${sound.key}`}
            
          />
        ))}
  </div>
);


const DrumControl = ({
  handlePowerToggle,
  name,
  soundBankName,
  power,
  volume,
  handleVolumeChange,
  changeSoundGroup
}) => {
  const volumeIconClass = volume === 0 ? 'muted' : '';
  const volumeBarClass = power ? '' : 'power-off';
  const powerButtonClass = power ? 'glow' : '';

  return (
    <div className={`control ${power ? 'power-on' : 'power-off'}`}>
      <h2 id="display">{power ? name : ''}</h2>
      <h3>{power ? `Volume: ${Math.round(volume * 100)}%` : ''}</h3>
      <p id="bank-name">{power ? `SoundBank: ${soundBankName}` : ''}</p>
      
      <div className="volume-control">
        <FontAwesomeIcon icon={faVolumeMute} className={`volume-icon-muted ${volumeIconClass}`} />
        <input
          max="1"
          min="0"
          step="0.01"
          type="range"
          value={volume}
          onChange={power ? handleVolumeChange : null}
          className={`volume-bar ${volumeBarClass}`}
          disabled={!power}
        />
        <FontAwesomeIcon icon={faVolumeUp} className={`volume-icon ${volume === 0 ? 'hidden' : ''}`} />
      </div>
      <button onClick={changeSoundGroup} className="soundbank-button">
        Change Sound Bank
      </button>
      <button onClick={handlePowerToggle} className={`power-button ${powerButtonClass}`}>
        <FontAwesomeIcon icon={faPowerOff} />
      </button>
    </div>
  );
};

const App = () => {
  const [power, setPower] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [soundName, setSoundName] = React.useState("");
  const [soundType, setSoundType] = React.useState("heaterKit");
  const [sounds, setSounds] = React.useState(soundsGroup[soundType]);
  
  const play = (key, sound) => {
    setSoundName(sound)
    const audio = document.getElementById(key);
    
    audio.currentTime = 0;
    audio.play();
    
  }

  const stop = () => {
     setPower(!power)
  }
  
  const changeSoundGroup = () => {
    setSoundName("");
    setSounds((prevSounds) => {
      if (soundType === "heaterKit") {
        setSoundType("smoothPianoKit");
        return soundsGroup.smoothPianoKit;
      } else {
        setSoundType("heaterKit");
        return soundsGroup.heaterKit;
      }
    });
  };
  
  const handleVolumeChange = e => {
    setVolume(e.target.value)
  }
  
  const updateKeyVolume = () => {
    const audioes = sounds.map(sound => document.getElementById(sound.key));
    audioes.forEach(audio => {
      if(audio) {
        audio.volume = volume;
      }
    }) 
  }
  
  return (
    <div id="drum-machine">
      {updateKeyVolume()}
      <div className="wrapper">
     
        <Drums sounds={sounds} play={play} power={power}/>
        <DrumControl 
          handlePowerToggle={stop}
          power={power}
          volume={volume} 
          name = {soundName || soundsName[soundType]}
          soundBankName={soundsName[soundType]}
          changeSoundGroup={changeSoundGroup}
          handleVolumeChange={handleVolumeChange} 
         />
      </div>
    </div>
  )
};


export default App;