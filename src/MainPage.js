import * as tf from '@tensorflow/tfjs';
import React, { Component } from 'react';
import Speech from "react-speech";
import Header from "./components/layout/Header";

// import './App.css';

const cocoSsd = require('@tensorflow-models/coco-ssd');

class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      text:"Initial"
     }
  }
  // reference to both the video and canvas
  videoRef = React.createRef();
  canvasRef = React.createRef();

  objectSet = [];

  // we are gonna use inline style
  styles = {
    position: 'fixed',
    top: 150,
    left: 600,
  };
  
  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(predictions => {
      this.showDetections(predictions);
      this.objectSet = predictions;
      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      console.log("Couldn't start the webcam")
      console.error(error)
    });
  };

  showDetections = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "red";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // draw top left rectangle
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // draw bottom left rectangle
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };
  componentDidMount() {
    
    if (navigator.mediaDevices.getUserMedia) {
      // define a Promise that'll be used to load the webcam and read its frames
      const webcamPromise = navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then(stream => {
          // pass the current frame to the window.stream
          window.stream = stream;
          // pass the stream to the videoRef
          this.videoRef.current.srcObject = stream;

          return new Promise(resolve => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        }, (error) => {
          console.log("Couldn't start the webcam")
          console.error(error)
        });

      // define a Promise that'll be used to load the model
      const loadlModelPromise = cocoSsd.load();
      
      
      // resolve all the Promises
      Promise.all([loadlModelPromise, webcamPromise])
        .then(values => {
          this.detectFromVideoFrame(values[0], this.videoRef.current);
        })
        .catch(error => {
          console.error(error);
        });
      
        this.interval = setInterval(()=>{
          if(this.objectSet[0]){
            let str ="";
            this.objectSet.forEach(ele=>{
              if(str!="")
              str = str + "and " + ele.class+" ";
              else str = str+ele.class+" "; 
            })
            this.setState({text:str});
          }
          else{
            this.setState({text:"Nothing Yet"})}
          }
           ,1000);
          
           this.interval = setInterval(()=>{
            document.getElementsByTagName("button")[1].click();}
             ,5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div> 
        <Header/>
        <video
          style={this.styles}
          autoPlay
          muted
          ref={this.videoRef}
          width="720"
          height="720"
        />
        <canvas style={this.styles} ref={this.canvasRef} width="720" height="650" />
        <Speech textAsButton={true}  text={this.state.text} rate={0.75}>Speak</Speech>
      </div>
    );
  }
}

export default MainPage;