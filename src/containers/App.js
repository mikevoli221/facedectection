import React from 'react';
import './App.css';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
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
      input : '',
      imageUrl : '',
      box : {},
      route : 'signin'
    }
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      //console.log(clarifaiFace);
      //console.log(width, height);
      return {
        leftCol : clarifaiFace.left_col * width,
        topRow : clarifaiFace.top_row * height,
        rightCol : width - (clarifaiFace.right_col * width),
        bottomRow : height -  (clarifaiFace.bottom_row * height)
      }
  }

  displayFacebox = (box) => {
      //console.log(box);
      this.setState({box : box})
  }

  onInputChange = (event) => {
     //console.log(event.target.value);
     this.setState({input : event.target.value});
  }

  onButtonClick = (event) => {
    //console.log('button clicked')
    this.setState({imageUrl : this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFacebox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState({route : route});
  }

  render(){
    return (
      <div className="App">
        
        <Particles className = 'particles' params={particlesOptions}/>
        {
          this.state.route === 'home' 
          ? <div>
            <Navigation onRouteChange = {this.onRouteChange}/>
            <Logo/>
            <Rank/>
            <ImageLinkForm onInputChange = {this.onInputChange} onButtonClick = {this.onButtonClick}/>
            <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/> 
          </div> 
          : (
               this.state.route === 'signin'
               ? <SignIn onRouteChange = {this.onRouteChange}/>
               : <Register onRouteChange = {this.onRouteChange}/>
            ) 
        }
        
      </div>  
    );
  }
}

export default App;
