package edu.csu2017fa314.DemoServer.Server;

public class Location {
    private String id;
    private String name;
    private String code;

    public Location(String id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    @Override
    public String toString() {
        return "Location{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
