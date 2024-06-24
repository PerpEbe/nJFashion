import React from 'react'
import './Hero.css';
import arror_icon from '../Assets/arrow.png';
import hero_image from '../Assets/hero_image.png';

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS</h2>
            <div>
                <div>
                    <p>new</p>
                </div>
                <p>collections</p>
                <p>for</p>
                <p>everyone</p>
            </div>
            <div className="hero-latest-btn">
                <div>Latest Collection</div>
                <img src={arror_icon} alt="" />
            </div>
        </div>
        <div className="hero-right">
            <img src={hero_image} alt="" />
        </div>
    </div>
  )
}

export default Hero