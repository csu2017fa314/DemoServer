import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serverReturned: null
        }
    };

    render() {
        let serverNumbers;
        let numbers;
        let svg;
        if (this.state.serverReturned) { // if this.state.serverReturned is not null
            //Get list of numbers
            serverNumbers = this.state.serverReturned.aList;

            /*Create an array of HTML list items. The Array.map function in Javascript passes each individual element
            * of an array (in this case serverNumbers is the array and "num" is the name chosen for the individual element)
            * through a function and returns a new array with the mapped elements.
            * In this case f: num -> <li>num</li>, so numbers will be an array that looks like:
            * [<li>0</li>,<li>1</li>...]
            */
            numbers = serverNumbers.map((num) => {
                return <li>{num}</li>;
            });

            // set the local variable scg to this.state.serverReturned.svg
            svg = this.state.serverReturned.svg;
        }

        return (
            <div className="app-container">
                <input className="search-button" type="text" placeholder="Type and press enter"
                       onKeyUp={this.keyUp.bind(this)} autoFocus/>
                <br/>
                <h1>
                    {/* In the constructor, this.state.serverReturned.svg is not assigned a value. This means the image
                    will only display once the serverReturned state variable is set to the received json in line 73*/}
                    <img width="75%" src={svg}/>
                </h1>
                {/* Display the array of HTML list items created on line 18 */}
                <ul>
                    {numbers}
                </ul>
            </div>
        )
    }

    // This function waits until enter is pressed on the event (input)
    // A better implementation would be to have a Javascript form with an onSubmit event that calls fetch
    keyUp(event) {
        if (event.which === 13) { // Waiting for enter to be pressed. Enter is key 13: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
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
            // By default, Spark uses port 4567
            let jsonReturned = await fetch(`http://localhost:4567/testing`,
                {
                    method: "POST",
                    body: JSON.stringify(newMap)
                });
            // Wait for server to return and convert it to json.
            let ret = await jsonReturned.json();
            // Log the received JSON to the browser console
            console.log("Got back ", JSON.parse(ret));
            // set the serverReturned state variable to the received json.
            // this way, attributes of the json can be accessed via this.state.serverReturned.[field]
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
