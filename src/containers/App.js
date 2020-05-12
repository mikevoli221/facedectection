import React from 'react';
import './App.css';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm'
import Rank from '../components/Rank/Rank';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particlesOptions = {
  particles: {
    number : {
      value : 50,
      density : {
        enable : true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: '953f4833c2c54483a912bed1b841bde5'
 });
 

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      input : ''
    }
  }

  onInputChange = (event) => {
     console.log(event.target.value);
  }

  onButtonClick = (event) => {
    console.log('button clicked')
    app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict("https://samples.clarifai.com/metro-north.jpg");
      })
      .then(response => {
        let concepts = response['outputs'][0]['data']['concepts']
        console.log(concepts);
        console.log(response);
      })
  }

  render(){
    return (
      <div className="App">
        
        <Particles  className = 'particles' params={particlesOptions}/>
        <Navigation/>
        <Logo/>
        <Rank/>
        <ImageLinkForm onInputChange = {this.onInputChange} onButtonClick = {this.onButtonClick}/>
        
        {/*  
        <FaceRecognition/> 
        */}
      </div>  
    );
  }
}

export default App;
