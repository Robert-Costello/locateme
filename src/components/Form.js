import React, { Component } from "react";
import axios from "axios";
import { locations } from "./Firebase";
import { username, password } from "../secrets";
const validator = require("validator");

class Form extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate(val) {
    if (!validator.isEmail(val)) {
      alert("Please enter valid email.");
      throw new Error("Email is not valid");
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const city = e.target.city.value;
    const date = new Date().toString();
    const email = e.target.email.value;

    try {
      this.validate(email);
      const response = await axios.get(
        `http://api.geonames.org/searchJSON?q=${city}&maxRows=5&username=${username}&password=${password}`
      );

      const { lat, lng, countryName } = response.data.geonames[0];

      // Update firebase
      let docObj = { email, name, date, lat, lng, countryName };
      locations
        .doc(name)
        .set(docObj)
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });

      // Reset input fields to blank
      e.target.name.value = "";
      e.target.email.value = "";
      e.target.city.value = "";
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Enter Name"></input>
          <input type="text" name="city" placeholder="Enter City"></input>
          <input type="text" name="email" placeholder="Enter Email"></input>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Form;
