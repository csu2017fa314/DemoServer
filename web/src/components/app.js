import React from 'react';

import Dropzone from 'react-dropzone';
import InlineSVG from 'svg-inline-react';
import { Button, ButtonGroup, Col, FormGroup, FormControl, Grid, ListGroup, ListGroupItem, Modal, Row } from 'react-bootstrap';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryResults : [],
            svgResults : null,
            input : "",
            sysFile: null,
            modalOpen : false,
            h3Style: {
                textAlign: 'center',
                color: 'DimGrey'
            },
            h4Style: {
                textAlign: 'center',
                color: 'SlateGrey'
            }
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
                return <ListGroupItem>{location.name}</ListGroupItem>;
            });
            if (locs.length > 0) {
                locs.splice(0, 0, <h1>Here is your trip:</h1>)
            }
            
        }
        // Once the server sends back an SVG, set the local variable "renderedSvg" to be the image
        if (this.state.svgResults) {
            svg = this.state.svgResults;
            renderedSvg = <InlineSVG src={svg.contents}></InlineSVG>;
        }

        return (
            <div className="app-container">
                <Grid>
                
                <form onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup>
                    <Col  md={10}>
                    <FormControl type="text"
                           onKeyUp={this.keyUp.bind(this)} placeholder="Enter a search term like denver" autoFocus/>
                    </Col>
                    <Col  md={2}>
                    <FormControl bsStyle="primary" type="submit" value="Submit" />
                    </Col>
                </FormGroup>
                </form>

                <Row>
                
                <ButtonGroup justified>
                
                <ButtonGroup><Button onClick={this.openModal.bind(this)} type="button">Load trip</Button></ButtonGroup>
                <Modal show={this.state.modalOpen} onHide={this.closeModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Load your trip</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropzone className="dropzone-style" onDrop={this.uploadButtonClicked.bind(this)}>
                            <h3 style={this.state.h3Style}>Upload or drop a trip JSON here</h3>
                            <Button block bsStyle="primary" type="button">Upload</Button> 
                        </Dropzone>
                        <h4 style={this.state.h4Style}>- or -</h4>
                        <h3 style={this.state.h3Style}>Load trip from server</h3>
                        <h4 style={this.state.h4Style}>Feature coming 2018</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.closeModal.bind(this)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                
                <ButtonGroup><Button onClick={this.saveButtonClicked.bind(this)}>Save trip</Button></ButtonGroup>
                
                {/* Display the array of HTML list items created on line 18 */}
                
                <ButtonGroup><Button type="button" onClick={this.svgButtonClicked.bind(this)}>Get SVG</Button></ButtonGroup>
                </ButtonGroup>
                </Row>
                {/* Display the local variable renderedSvg. It is either null or an <svg> tag containing the image*/}
                <Row>
                    {renderedSvg}
                </Row>
                <Row>
                <ListGroup>
                    {locs}
                </ListGroup>
                </Row>
                </Grid>
            </div>
        )
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }
    
    openModal() {
        this.setState({ modalOpen: true });
    }

    // File reading is almost identical how you did it in Sprint 1
    uploadButtonClicked(acceptedFiles) {
        console.log("Accepting drop");
        acceptedFiles.forEach(file => {
            console.log("Filename:", file.name, "File:", file);
            console.log(JSON.stringify(file));
            let fr = new FileReader();
            fr.onload = (function () {
                return function (e) {
                    let JsonObj = JSON.parse(e.target.result);
                    console.log(JsonObj);
                    // Do something with the file:
                    this.closeModal();
                    this.browseFile(JsonObj);
                };
            })(file).bind(this);

            fr.readAsText(file);
        });
    }

    // Set the uploaded JSON file to a state variable and send it to fetch method
    async browseFile(file) {
        console.log("Got file:", file);
        this.setState({
            sysFile: file
        })
        this.fetch("upload", this.state.sysFile.destinations);
    }

    // This function waits until enter is pressed on the event (input)
    // A better implementation would be to have a Javascript form with an onSubmit event that calls fetch
    keyUp(event) {
        if (event.which === 13) { // Waiting for enter to be pressed. Enter is key 13: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            this.fetch("query", this.state.input); // Call fetch and pass whatever text is in the input box
        } else {
            this.setState({
                input: event.target.value
            });
        }
    }

    handleSubmit(event) {
        this.fetch("query", this.state.input);
        event.preventDefault();
    }

    // if the "Click here for an SVG button is clicked"
    svgButtonClicked(event) {
        this.fetch("svg", event.target.value);
    }

    saveButtonClicked(event) {
        this.getFile();
    }

    // This function sends `input` the server and updates the state with whatever is returned
    async fetch(type, input) {
        console.log("entered fetch");
        // Create object to send to server

        /*  IMPORTANT: This object must match the structure of whatever
            object the server is reading into (in this case ServerRequest).
            Notice how we give both requests the same format */
        let clientRequest;
        // if "enter" is pressed in the input box
        if (type === "query") {
            /* We now pass input as an element of an array
               because we changed the ServerRequest class to take an ArrayList
            */
            clientRequest = {
                request: "query",
                description: [input],
            };

        // if the button is clicked:
        } else if (type === "upload") {
            // Send entire destinations array
            clientRequest = {
                request: "upload",
                description: input
            }
        } else {
            clientRequest = {
                request: "svg",
                description: []
            }
        }
        try {
            // Attempt to send `clientRequest` via a POST request
            // Notice how the end of the url below matches what the server is listening on (found in java code)
            // By default, Spark uses port 4567
            let serverUrl = window.location.href.substring(0, window.location.href.length - 6) + ":4567/testing";
            let jsonReturned = await fetch(serverUrl,
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
            // The file upload should also display the same thing
            if (returnedJson.response === "query" || returnedJson.response === "upload") {
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

    // download a file of the array a query returns
    async getFile() {
         // assign all the airport codes of the displayed locations to an array
         let locs = this.state.queryResults.map((location) => {
            return location.code;
        });

        // create an object in the format of the download file:
        let locationFile = {
            title : "selection",
            destinations: locs
        };

        // stringify the object
        let asJSONString = JSON.stringify(locationFile);
        
        // Javascript code to create an <a> element with a link to the file
        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(asJSONString));
        // Download the file instead of opening it:
        pom.setAttribute('download', "download.json");
        
        // Javascript to click the hidden link we created, causing the file to download
        if (document.createEvent) {
            let event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
        
        // remove hidden link from page
        pom.parentNode.removeChild(pom);

        // Previous method:
        /*
        let response = await fetch(`http://localhost:4567/download`,
        {
            method: "POST",
            body: JSON.stringify(clientRequest)
        });
        
        // Unlike the other responses, we don't conver this one to JSON
        // Instead, grab the file in the response with response.blob()
        response.blob().then(function(myBlob) {
            // create a URL for the file
            let fileUrl = URL.createObjectURL(myBlob);
            // Open the file. Normally, a text file would open in the browser by default,
            // which is why we set the content-type differently in the server code. 
            window.open(fileUrl);
        });*/
    }

}