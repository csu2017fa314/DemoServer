package edu.csu2017fa314.DemoServer.Server;

import java.util.Arrays;

/**
 * Created by sswensen on 10/1/17.
 */

public class ServerResponse {
    private String svg = "";
    private int[] aList;

    public ServerResponse(String svg) {
        this.svg = svg;
        this.aList = new int[]{1,2,3,4,5,6,7};
    }

    @Override
    public String toString() {
        return "ServerResponse{" +
                "svg='" + svg + '\'' +
                ", aList=" + Arrays.toString(aList) +
                '}';
    }
}
