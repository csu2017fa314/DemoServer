package edu.csu2017fa314.DemoServer.Server;

/**
 * Created by sswensen on 10/1/17.
 */

public class DataClass {
    private String name = "";
    private String id = "";

    public DataClass(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "DataClass{" +
                "name='" + name + '\'' +
                ", id='" + id + '\'' +
                '}';
    }
}
