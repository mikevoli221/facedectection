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

const initialState = {
  input : '',
  imageUrl : '',
  box : {},
  route : 'signin',
  isSignedIn : false,
  user : {
    id : '',
    name : '',
    email : '',
    entries : 0,
    joined : ''
  }
}

class App extends React.Component {

  constructor(){
    super();
    this.state = initialState;
  }

loadUser = (data) => {
  this.setState({
    user : {
      id : data.id,
      name : data.name,
      email : data.email,
      entries : data.entries,
      joined : data.joined
    }
  })
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
    const imageUrl = {imageUrl : this.state.input};
    
    this.setState(imageUrl);

    fetch('https://polar-lake-80701.herokuapp.com/callClarifaiAPI', {
    //fetch('http://localhost:3000/callClarifaiAPI', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(imageUrl)
    })
    .then(response => response.json())
    .then(data => {
      if (data){
        fetch(`https://polar-lake-80701.herokuapp.com/score/${this.state.user.email}`, {
        //fetch(`http://localhost:3000/score/${this.state.user.email}`, {
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'}
        })
        .then (resp => resp.json())
        .then (user => {
            if (user.id){
                this.loadUser(user);
            };
        })
        .catch(err => console.log(err));
      }
      this.displayFacebox(this.calculateFaceLocation(data))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
       this.setState(initialState) 
    }else if (route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route : route});
  }

  render(){
    const {isSignedIn, imageUrl, box} = this.state;
    return (
      <div className="App">
        
        <Particles className = 'particles' params={particlesOptions}/>
        {
          this.state.route === 'home' 
          ? <div>
            <Navigation onRouteChange = {this.onRouteChange} isSignedIn = {isSignedIn}/>
            <Logo/>
            <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
            <ImageLinkForm onInputChange = {this.onInputChange} onButtonClick = {this.onButtonClick}/>
            <FaceRecognition box = {box} imageUrl = {imageUrl}/> 
          </div> 
          : (
              (this.state.route === 'signin' || this.state.route === 'signout')
               ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
               : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
            ) 
        }  
      </div>  
    );
  }
}

export default App;
