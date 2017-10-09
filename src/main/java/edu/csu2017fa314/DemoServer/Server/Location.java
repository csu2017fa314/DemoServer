package edu.csu2017fa314.DemoServer.Server;

public class Location {
    private String id;
    private String name;

    public Location(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Location{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
