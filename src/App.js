import React from 'react';
import './App.css';

const base_url = "http://carwler.cleverapps.io"
const fetchData = (url) => {
  return fetch(url, {
    mode: 'no-cors'
  }).then(res=> res.json())
  .catch(err=> console.log(err))
}

const Select = ({ name, value, list = [], handleChange }) => {
  return(
    <div>
      Choose {name}: 
      <select name={name} value={value} onChange={e=>handleChange(name, e.target.value)}>
        {
          list.map( (l, i) => <option key={i} value={l}>{l}</option> )
        }
      </select>
    </div>
  )
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      addCar : {
        brand: '',
        model: '',
        variant: '',
      },
      options: {
        brands: [],
        models: [],
        variants: []
      },
      addedCars: [],
    }
  }
  getBrands = () => {
    let { options } = this.state
    fetchData(base_url+'/brands')
    .then(res=> console.log(res))
    // this.setState({ options: {...options, brands: res } })
  }
  getModels = (brand) => {
    fetchData(base_url+'/models?brand=' + brand)
    .then(res=> console.log(res))
  }
  getVariants = (brand, model) => {
    fetchData(`${base_url}/variants?brand${brand}&model=${model}`)
    .then(res=> console.log(res))
  }
  handleChange = (name, value) => {
    let {addCar, options} = this.state
    if(name === 'brand'){
      addCar = {
        brand : value,
        model: '',
        variant: ''
      }
      options = {
        ...options,
        models: [],
        variants: []
      }
    }
    else if(name === 'model'){
      addCar = {
        ...addCar,
        model: value, 
        variant: ''
      }
      options = {
        ...options,
        variants: []
      }
    }
    else if(name === 'model'){
      addCar = {
        ...addCar, 
        variant: value
      }
    }
    this.setState(
      { addCar: {...addCar, [name]: value}, options},
      name==='brand' ? this.getModels(value): name==='model' ? this.getVariants(addCar.brand, value) : null
    )
  }
  addCar(){

  }
  componentDidMount(){
    this.getBrands()
  }
  render(){
    let { 
      addedCars, 
      addCar : { brand, model, variant }, 
      options: {brands, models, variants} 
    } = this.state
    return (
      <div className="App">
        <h2>Car lelo</h2>
        {
          addedCars.length !==0 &&
          <React.Fragment>
            <p>
              List of all added Cars
            </p>
            {
              addedCars.map(e=> console.log(e))
            }
          </React.Fragment>
        }
        <hr />
        <h4>Add Car to Compare</h4>
        <Select name="brand" value={brand} list={brands} handleChange={this.handleChange}/>
        <Select name="model" value={model} list={models} handleChange={this.handleChange}/>
        <Select name="variant" value={variant} list={variants} handleChange={this.handleChange}/>
        <button onClick={this.addCar}>Add</button>
      </div>
    );
  }
}

export default App;
