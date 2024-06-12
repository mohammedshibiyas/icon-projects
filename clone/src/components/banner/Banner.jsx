import React from 'react'
import './Banner.scss'

const Banner = () => {
  return (
    <div>
      <div className="all">
      <div className="banner">
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="/public/banner-01-1.jpg" className="d-block w-100" alt="..."/>
      <div className="banner-label-1">
        <h3>MedLab</h3>
        <div><h3>Software Innovators</h3></div>
        <p>Empowering Medical Advancements with Cutting-Edge <br />Software Solutions</p>
        <button id='learn'>Learn More</button>
      </div>
    </div>
    <div className="carousel-item">
      <img src="/public/banner-01-1.jpg" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="/public/banner-01-1.jpg" className="d-block w-100" alt="..."/>
      <div className="banner-label-1">
        <h3>Elevating Healthcare</h3>
        <div><h3>Through Innovation.</h3></div>
        <p>Empowering Medical Advancements with Cutting-Edge <br />Software Solutions</p>
        <button id='learn'>Learn More</button>
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
    {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span> */}
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
    {/* <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
    <span className="visually-hidden">Next</span>
  </button>
</div>
        </div>

        <div className="what-we-do">
            <div className="heading">
                <h2>what we do?</h2>
                <div className="under"></div>
            </div>
            <div className="row row-main">
                <div className="col-lg-4 mobile">
                    <div className="cards">
                        
                         </div>    
                </div>
                <div className="col-lg-4 sms">

                </div>
                <div className="col-lg-4 barcode">

                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
