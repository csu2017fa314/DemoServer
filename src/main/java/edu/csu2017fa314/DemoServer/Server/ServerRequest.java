package edu.csu2017fa314.DemoServer.Server;

import java.util.ArrayList;

/**
 * Created by sswensen on 10/1/17.
 */

public class ServerRequest {
    private String request = "";

    // description changed to ArrayList to handle a description array
    // can access .get(0) of description for single element descriptions
    private ArrayList<String> description = null;

    public ServerRequest(String request, ArrayList<String> description) {
        this.request = request;
        this.description = description;
    }

    public String getRequest() {
        return request;
    }

    public void setQuery(String request) {
        this.request = request;
    }

    public ArrayList<String> getDescription() {
        return description;
    }

    public void setDescription(ArrayList<String> description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Request{" +
                "request='" + request + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
