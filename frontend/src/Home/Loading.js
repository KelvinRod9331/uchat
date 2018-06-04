// eslint-disable-next-line 
import React, { Component } from "react";
import bodymovin from "lottie-web";

export default class LoadingScreen extends Component {

  select = s => {
    return document.querySelector(s);
  };

  render() {
    let animationWindow = this.select(".loading_container");
    let animData = {
      wrapper: animationWindow,
      animType: "svg",
      loop: true,
      prerender: true,
      autoplay: true,
      path: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/world.json"
    };
    let anim;
    anim = bodymovin.loadAnimation(animData);
    anim.setSpeed(0.7);
    return null
  }
}
