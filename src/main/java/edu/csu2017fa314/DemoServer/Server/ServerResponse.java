package edu.csu2017fa314.DemoServer.Server;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by sswensen on 10/1/17.
 */

public class ServerResponse {
    private String response;
    private ArrayList<Location> locations;

    public ServerResponse(ArrayList locations) {
        this.locations = locations;
        System.out.println(this.toString());
    }

    public void setResponseType(String response) {
        this.response = response;
    }

    @Override
    public String toString() {
        return "ServerResponse{" +
                "response='" + response + '\'' +
                ", locations=" + locations +
                '}';
    }
}
