import React, { useState, useEffect } from 'react';

const Service = () => {
  return (
    <React.Fragment>
    <h4>My services</h4>
    <div className="row">
        <div className="services">
            <a href="BBTC" className="action">
                BBTC
            </a>
            <a href="exchange" className="action">
                Pension
            </a>
            <a href="" className="action">
                HMRC
            </a>
        </div>
    </div>
    <div className="vertical-center second">
        <h5>More services</h5>
        <span className="line"></span>
    </div>
    <div className="row">
        <div className="services">
            <a href="" className="action">
                Smart insurance
            </a>
            <a href="" className="action">
                Smart banking
            </a>
       
        </div>
    </div>
    </React.Fragment>
  );
};

export default Service;