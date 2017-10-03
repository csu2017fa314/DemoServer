import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverReturned: {
                aList: [0] //Initialized to zero to prevent map() error on first load (caused by line 18)
            }
        }
    };

    render() {
        //Get list of numbers
        let serverNumbers = this.state.serverReturned.aList;

        //Create list items for each number (displayed in the ul tag)
        let numbers = serverNumbers.map((num) => {
            return <li>{num}</li>;
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
                    {numbers}
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
            console.log("Got back ", JSON.parse(ret));
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
