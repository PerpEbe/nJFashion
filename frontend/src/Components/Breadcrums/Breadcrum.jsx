import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/arrow.png';

const Breadcrum = (props) => {
    const {product} = props;
    console.log(props);
    
  return (
    <div className="breadcrum">
        HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product?.category || 'Unknown Category'} <img src={arrow_icon} alt="" /> {product?.name || 'Unknown Category'}
    </div>
  )
}

export default Breadcrum