import React from 'react';
import InlineSVG from 'svg-inline-react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryResults : [],
            svgResults : null
        }
    };

    render() {
        let serverLocations;
        let locs;
        let svg;
        let renderedSvg;
        if (this.state.queryResults) { // if this.state.serverReturned is not null
            // set local variable to results of sent query
            serverLocations = this.state.queryResults;

            /*Create an array of HTML list items. The Array.map function in Javascript passes each individual element
            * of an array (in this case serverLocations is the array and "location" is the name chosen for the individual element)
            * through a function and returns a new array with the mapped elements.
            * In this case f: location -> <li>location.name</li>, so the array will look like:
            * [<li>[name1]</li>,<li>[name2]</li>...]
            */
            locs = serverLocations.map((location) => {
                console.log(location.name);
                return <li>{location.name}</li>;
            });

        }
        // Once the server sends back an SVG, set the local variable "renderedSvg" to be the image
        if (this.state.svgResults) {
            svg = this.state.svgResults;
            renderedSvg = <InlineSVG src={svg.contents}></InlineSVG>;
        }

        return (
            <div className="app-container">
                <input size="35" className="search-button" type="text" placeholder="type a query like 'denver' and press enter"
                       onKeyUp={this.keyUp.bind(this)} autoFocus/>

                <br />
                <br />
                <button type="button" onClick={this.buttonClicked.bind(this)}>Click here for an SVG</button>
                <br/>
                {/* Display the array of HTML list items created on line 18 */}
                <ul>
                    {locs}
                </ul>
                <h1>
                    {/* Display the local variable renderedSvg. It is either null or an <svg> tag containing the image*/}
                    {renderedSvg}
                </h1>
            </div>
        )
    }

    // This function waits until enter is pressed on the event (input)
    // A better implementation would be to have a Javascript form with an onSubmit event that calls fetch
    keyUp(event) {
        if (event.which === 13) { // Waiting for enter to be pressed. Enter is key 13: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            this.fetch("query", event.target.value); // Call fetch and pass whatever text is in the input box
        }
    }

    // if the "Click here for an SVG button is clicked"
    buttonClicked(event) {
        this.fetch("svg", event.target.value);
    }

    // This function sends `input` the server and updates the state with whatever is returned
    async fetch(type, input) {
        // Create object to send to server

        /*  IMPORTANT: This object must match the structure of whatever
            object the server is reading into (in this case ServerRequest).
            Notice how we give both requests the same format */
        let clientRequest;
        // if "enter" is pressed in the input box
        if (type === "query") {
            clientRequest = {
                request: "query",
                description: input,
            };

        // if the button is clicked:
        } else {
            clientRequest = {
                request: "svg",
                description: ""
            }
        }
        try {
            // Attempt to send `clientRequest` via a POST request
            // Notice how the end of the url below matches what the server is listening on (found in java code)
            // By default, Spark uses port 4567
            let jsonReturned = await fetch(`http://localhost:4567/testing`,
                {
                    method: "POST",
                    body: JSON.stringify(clientRequest)
                });
            // Wait for server to return and convert it to json.
            let ret = await jsonReturned.json();
            let returnedJson = JSON.parse(ret);
            // Log the received JSON to the browser console
            console.log("Got back ", returnedJson);

            // if the response field of the returned json is "query", that means the server responded to the SQL query request
            if (returnedJson.response === "query") {
                this.setState({
                    queryResults: returnedJson.locations
                });
            // if it's not, we assume the response field is "svg" and contains the an svg image
            } else {
                this.setState({
                    svgResults: JSON.parse(ret)
                })
            }

            // Print on console what was returned
            // Update the state so we can see it on the web
        } catch (e) {
            console.error("Error talking to server");
            console.error(e);
        }
    }

}