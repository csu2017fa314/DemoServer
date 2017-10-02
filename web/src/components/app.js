import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverReturned: 0
        }
    };

    render() {
        return (
            <div className="app-container">
                <div className="centered">
                    <input className="search-button" type="text" placeholder="Type and press enter"
                           onKeyUp={this.keyUp.bind(this)} autoFocus/>
                    <h1>
                        {this.state.serverReturned}
                    </h1>
                </div>
            </div>
        )
    }

    // This function waits until enter is pressed on the event (input)
    keyUp(event) {
        if (event.which === 13) { // Waiting for enter to be pressed
            this.fetch(event.target.value); // Call fetch and pass whatever text is in the input box
        }
    }

    // This function sends `input` the server and updates the state with whatever is returned
    async fetch(input) {
        // Create object to send to server
        // IMPORTANT: This object must match the structure of whatever object the server is reading into (in this case DataClass)
        let newMap = {
            name: input,
            id: "1"
        };
        try {
            // Attempt to send `newMap` via a POST request
            // Notice how the end of the url below matches what the server is listening on
            let jsonReturned = await fetch(`http://localhost:4567/testing`,
                {
                    method: "POST",
                    body: JSON.stringify(newMap)
                });
            // Wait for server to return and convert it to json.
            let ret = await jsonReturned.json();
            // Print on console what was returned
            console.log("Got back ", ret);
            // Update the state so we can see it on the web
            this.setState({
                serverReturned: ret
            });
        } catch (e) {
            console.error("Error talking to server");
            console.error(e);
        }
    }
}
