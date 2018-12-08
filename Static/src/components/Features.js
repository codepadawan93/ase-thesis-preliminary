import React from "react";

const Features = () => {
  return (
    <section className="features-icons bg-light text-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="icon-screen-desktop m-auto text-primary" />
              </div>
              <h3>Book online</h3>
              <p className="lead mb-0">
                <strong>Your next vacation</strong> is your fully integrated
                solution for travel - from the desktop or mobile, we are eager
                to help you plan and book
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="icon-layers m-auto text-primary" />
              </div>
              <h3>Next-gen assistance</h3>
              <p className="lead mb-0">
                Let us introduce you to your Machine Learning-enabled online
                assistant, Ionut! Just chat with him and he will recommend you
                the best location for
                <strong> Your next vacation</strong>!
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="icon-check m-auto text-primary" />
              </div>
              <h3>Easy to Use</h3>
              <p className="lead mb-0">
                You need not worry about weather, traffic or availability - let
                Ionut figure it all out and assure you have the best trip
                possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
