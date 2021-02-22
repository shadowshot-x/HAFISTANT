import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Speech from "react-speech";
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '150px',
    height: '150px',
    background: 'red',
    borderRadius: '50%',
    margin: '0em 0 2em 0',
    color:"white"
  },
  interim: {
    color: 'white',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'white',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '700px'
  },
  stopButton: {
    width: '100px',
    height: '100px',
    background: 'white',
    borderRadius: '50%',
    margin: '1em 0 2em 0',
    color:"black"
  }
  ,
  play: {
    button: {
      width: '28',
      height: '28',
      cursor: 'pointer',
      pointerEvents: 'none',
      outline: 'none',
      backgroundColor: 'yellow',
      border: 'solid 1px rgba(255,255,255,1)',
      borderRadius: 6
    },
  }
}

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {
  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );
  let { transcript,finalTranscript ,resetTranscript, listening } = useSpeechRecognition()
  let [reminders,setReminders] = useState([""]);
  let [talk,setTalk] = useState("");
  useEffect(() => {
      if(finalTranscript.includes("assistant set reminder")){
        setReminders(reminders => [...reminders,finalTranscript.replace('assistant set reminder','')]);
        if(talk!="")
        setTalk(talk=>talk+" next "+finalTranscript.replace('assistant set reminder',''))
        else{
          setTalk(talk=>talk+" "+finalTranscript.replace('assistant set reminder',''))
        }
        console.log(reminders)
      }
      if(finalTranscript.includes("assistant reset reminders")){
        setReminders(reminders => []);
        setTalk(talk=>"")
        console.log(reminders)
      }
      if(finalTranscript.includes("activate aware mode")){
        window.location.href = "/awaremode";
      }
      if(finalTranscript.includes("read out reminders")){
        console.log(document.getElementsByTagName("button"))
        document.getElementsByTagName("button")[4].click();
      }
    }, [finalTranscript]) 
  
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Voice Controlled Hands Free <span className="text-color-primary">Assistant</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                A Fully Voice Controlled Platform with Ability to set and Read Out pending Reminders along with real time object detection to make Blind People aware of their surrounding.
                </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  <Button tag="a" color="dark" wideMobile href="https://github.com/shadowshot-x/HAFISTANT">
                    View on Github
                    </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
          <div style={styles.container}>
        <button id='microphone-btn' style={styles.button} onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening} style={styles.stopButton}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>

        <div id='interim' style={styles.final}> <p>{finalTranscript}</p></div>

       {reminders.map(ele=>{
          if(ele!="")
          return <p style={{color:"white"}}>{ele.toUpperCase()}</p>;
        })}
        
        <Speech class="speechbutton" rate={0.75} text={talk}  style={styles.play} voice="Daniel">Click Me</Speech>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;