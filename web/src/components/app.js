import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverReturned: {
                locations: [0] //Initialized to zero to prevent map() error on first load (caused by line 19)
            }
        }
    };

    render() {
        //Get list of locations
        let serverLocations = this.state.serverReturned.locations;
        console.log("State is", serverLocations);

        //Create list items for each location (displayed in the ul tag)
        let locs = serverLocations.map((ll) => {
            return <li>{ll.name}</li>;
        });

        return (
            <div className="app-container">
                <input className="search-button" type="text" placeholder="Type and press enter"
                       onKeyUp={this.keyUp.bind(this)} autoFocus/>
                <br/>
                <h1>
                    <img width="75%" src={this.state.serverReturned.svg}/>
                </h1>
                <ul>
                    {locs}
                </ul>
            </div>
        )
    }

    // This function waits until enter is pressed on the event (input)
    // Very bad implementation
    keyUp(event) {
        if (event.which === 13) { // Waiting for enter to be pressed
            this.fetch(event.target.value); // Call fetch and pass whatever text is in the input box
        }
    }

    // This function sends `input` the server and updates the state with whatever is returned
    async fetch(input) {
        // Create object to send to server

        /*  IMPORTANT: This object must match the structure of whatever
            object the server is reading into (in this case DataClass) */
        let newMap = {
            name: input,
            id: "1",
        };
        try {
            // Attempt to send `newMap` via a POST request
            // Notice how the end of the url below matches what the server is listening on (found in java code)
            let jsonReturned = await fetch(`http://localhost:4567/testing`,
                {
                    method: "POST",
                    body: JSON.stringify(newMap)
                });
            // Wait for server to return and convert it to json.
            let ret = await jsonReturned.json();
            console.log("Got back ", Object.values(JSON.parse(ret)));
            this.setState({
                serverReturned: JSON.parse(ret)
            });
            // Print on console what was returned
            // Update the state so we can see it on the web
        } catch (e) {
            console.error("Error talking to server");
            console.error(e);
        }
    }
}
