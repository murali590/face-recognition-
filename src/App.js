import React , { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from  './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import Register from './components/Register.js/Register';
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
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user :{
				id:'',
		        name:'',
		        email:'',
		        entries:0,
		        joined:''

			}
		}
	} 
/*componentDidMount(){
	fetch('http://localhost:3007')
	.then(response=> response.json())
	.then(console.log)
   }*/
   loaduser=(data)=>{
   	 this.setState({user:{
   	 	        id:data.id,
		        name:data.name,
		        email:data.email,
		        entries:data.entries,
		        joined:data.joined

   	 }})
   }

	calculateFaceLocation = (data)=>{
		const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
        const  image=document.getElementById('inputimage');
        const width=Number(image.width);
        const height=Number(image.height);
        return {
        	leftCol: clarifaiFace.left_col*width,
        	topRow: clarifaiFace.top_row*height,
        	rightCol: width -(clarifaiFace.right_col * width),
        	bottomRow: height -(clarifaiFace.bottom_row * height)
        }
	}

	displayFaceBox =(box)=>{
		this.setState({box: box})
	}

	onRouteChange =(route)=>{
		if(route === 'signout'){
			this.setState({isSignedIn: false})
		}
		else
			if(route === 'home')
			{
				this.setState({isSignedIn:true})
			}
		this.setState({route: route })
	}


	onInputChange =(event)=>{ 
              this.setState({input: event.target.value});
	 }
	onButtonSubmit =()=>{
	 	this.setState({imageUrl: this.state.input})
	 	app.models.predict(
	 		Clarifai.FACE_DETECT_MODEL, this.state.input)
	 	.then(response =>{
	 		if(response){
	 			fetch('http://localhost:3007/image',{
	 				   method: 'put',
                       headers :{'Content-Type': 'application/json'},
                       body: JSON.stringify({
                       id:this.state.user.id
              })
    
	 			})
	 			.then(response => response.json())
	 			.then(count=>{
	 				this.setState(Object.assign(this.state.user,{entries:count}))
	 				})
                  
	 			}
	 		
	 	this.displayFaceBox(this.calculateFaceLocation(response))
	 })
        .catch(err => console.log(err))  
         }

 render(){ 
     return (
    <div className="App">
     <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
     { this.state.route === 'home'?
       <div><Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm  
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
               />
               <FaceRecognition 
               imageUrl={this.state.imageUrl} 
               box={this.state.box}/>
         </div>
           :   (this.state.route === 'signin' || this.state.route === 'signout')  ?
           <Signin onRouteChange={this.onRouteChange}/>
           :<Register loaduser={this.loaduser}      onRouteChange={this.onRouteChange}/>
      }
    </div>
  );
}
} 

export default App;
 