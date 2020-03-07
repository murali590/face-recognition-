import React , { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app= new Clarifai.App({
	apiKey:'30007f046174491592fc988050dd7422',
});



class App extends Component {
	constructor(){
		super();
		this.state={
			input: '',
			imageUrl: ''
		}
	} 
	onInputChange =(event)=>{ 
              this.setState({input: event.target.value});
	 }
	 onButtonSubmit =()=>{
	 	this.setState({imageUrl: this.state.input})
	 	app.models.predict(
	 		Clarifai.FACE_DETECT_MODEL, 
	 		this.state.input).then(
            function(response) {
             console.log(response);
            },
            function(err) {
              console.log(err);
           }
  );
	 }
 render(){ 
     return (
    <div className="App">
     <Navigation />
     <Logo />
     <Rank />
     <ImageLinkForm  
     onInputChange={this.onInputChange}
     onButtonSubmit={this.onButtonSubmit}
     />
     <FaceRecognition imageUrl={this.state.imageUrl} />
    </div>
  );
}
} 

export default App;
 