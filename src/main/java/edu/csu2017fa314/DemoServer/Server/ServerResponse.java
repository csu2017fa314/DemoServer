package edu.csu2017fa314.DemoServer.Server;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by sswensen on 10/1/17.
 */

public class ServerResponse {
    private String svg = "";
    private ArrayList<Location> locations;

    public ServerResponse(String svg, ArrayList locations) {
        this.svg = svg;
        this.locations = locations;
        System.out.println(this.toString());
    }

    @Override
    public String toString() {
        return "ServerResponse{" +
                "svg='" + svg + '\'' +
                ", locations=" + locations +
                '}';
    }
}
