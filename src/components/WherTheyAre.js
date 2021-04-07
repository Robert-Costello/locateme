import { Component } from "react";
import { locations } from "./Firebase";

class Where extends Component {
  constructor() {
    super();

    this.getAllLocations = this.getAllLocations.bind(this);
    this.state = { locations: [] };
  }

  async getAllLocations() {
    try {
      let allLocations = [];
      const snapshot = await locations.get();
      snapshot.forEach((doc) => {
        allLocations.push(doc.data());
      });

      // Update UI
      this.setState({ locations: allLocations });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllLocations();
  }

  // Disconnect from firestore and mark as unmounted
  componentWillUnmount() {
    this._isMounted = false;
    this.unsub();
  }

  render() {
    return (
      <div className="locations">
        <button onClick={this.getAllLocations}>View All Locations</button>
        {this.state.locations.map((loc) => {
          return (
            <div className="location">
              <h3>{loc.name}</h3>
              <h3>Email: {loc.email}</h3>
              <h3>Latitude: {loc.lat}</h3>
              <h3>Longitude: {loc.lng}</h3>
              <h3>Country: {loc.countryName}</h3>
              <h3>Date: {loc.date}</h3>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Where;
