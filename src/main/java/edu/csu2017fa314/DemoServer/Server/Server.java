package edu.csu2017fa314.DemoServer.Server;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import edu.csu2017fa314.DemoServer.Database.QueryBuilder;
import spark.Request;
import spark.Response;

import java.io.*;
import java.util.ArrayList;

import static spark.Spark.post;

/**
 * Created by sswensen on 10/1/17.
 */

public class Server {
    public static void main(String[] args) {
        Server s = new Server();
        s.serve();
    }

    public void serve() {
        Gson g = new Gson();
        post("/testing", (rec, res) -> {
            return g.toJson(testing(rec, res));
        }); // Create new listener
        post("/download", (rec, res) -> {
            download(rec, res);
            return rec.raw();
        });
    }

    private Object download(Request rec, Response res) {
        JsonParser parser = new JsonParser();
        JsonElement elm = parser.parse(rec.body());
        Gson gson = new Gson();
        ServerRequest sRec = gson.fromJson(elm, ServerRequest.class);
        System.out.println(sRec);

        // Sending a file back requires different response headers
        setHeadersFile(res);
        writeFile(res, sRec.getDescription());

        return res;
    }

    // called by testing method if the client requests an svg
    private Object serveSvg() {
        Gson gson = new Gson();
        // Instead of writing the SVG to a file, we send it in plaintext back to the client to be rendered inline
        String sampleSvg =
                "<svg width=\"120\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\">" +
                "  <line id=\"north\" y2=\"100\" x2=\"120\" y1=\"0\" x1=\"0\" stroke-width=\"5\" stroke=\"red\"/>" +
                "  <line id=\"west\" y2=\"100\" x2=\"0\" y1=\"0\" x1=\"120\" stroke-width=\"5\" stroke=\"blue\"/>" +
                " </svg>";
        ServerSvgResponse ssres = new ServerSvgResponse(120, 100, sampleSvg);

        return gson.toJson(ssres, ServerSvgResponse.class);
    }

    // if the user uploads a file
    private Object serveUpload(ArrayList<String> locations) {
        Gson gson = new Gson();

        // Build a query of every code in the destinations file:
        QueryBuilder q = new QueryBuilder("user", "pass"); // TODO: replace with credentials 
        String queryString = "SELECT * FROM airports WHERE ";
        for (int i = 0; i < locations.size(); i++) {
            if (i == locations.size() - 1) {
                queryString += "code LIKE '%" + locations.get(i) + "%';";
            } else {
                queryString += "code LIKE '%" + locations.get(i) + "%' OR ";
            }
        }

        // Query database with queryString
        ArrayList<Location> queryResults = q.query(queryString);
        System.out.println(queryResults);

        // Same response structure as the query request
        ServerResponse serverResponse = new ServerResponse(queryResults);
        // set response type to upload
        serverResponse.setResponseType("upload");

        return gson.toJson(serverResponse, ServerResponse.class);
    }

    // called by testing method if client requests a search
    private Object serveQuery(String searched) {
        Gson gson = new Gson();
        QueryBuilder q = new QueryBuilder("user", "pass"); // Create new QueryBuilder instance and pass in credentials //TODO update credentials
        String queryString = String.format("SELECT * FROM airports WHERE municipality LIKE '%%%s%%' OR name LIKE '%%%s%%' OR type LIKE '%%%s%%' LIMIT 10", searched, searched, searched);
        ArrayList<Location> queryResults = q.query(queryString);

        // Create object with svg file path and array of matching database entries to return to server
        ServerResponse sRes = new ServerResponse(queryResults); //TODO update file path to your svg, change to "./testing.png" for a sample image
        sRes.setResponseType("query");
        System.out.println("Sending \"" + sRes.toString() + "\" to server.");

        //Convert response to json
        return gson.toJson(sRes, ServerResponse.class);
    }

    // called by testing method if client requests to download a location file
    private void writeFile(Response res, ArrayList<String> locations) {
        Gson gson = new Gson();

        try {
            PrintWriter fileWriter = new PrintWriter(new File("selection.json"));
            for (String location : locations) {
                fileWriter.println(location);
            }
            fileWriter.flush();
            fileWriter.close();

            // This should send the file to browser
            OutputStream out = res.raw().getOutputStream();
            FileInputStream in = new FileInputStream("selection.json");
            byte[] buffer = new byte[4096];
            int length;
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }
            in.close();
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Object testing(Request rec, Response res) {
        setHeaders(res);

        // Init json parser
        JsonParser parser = new JsonParser();

        // Grab the json body from POST
        JsonElement elm = parser.parse(rec.body());

        // Create new Gson (a Google library for creating a JSON representation of a java class)
        Gson gson = new Gson();

        // Create new Object from received JsonElement elm
        // Note that both possible requests have the same format (see app.js)
        ServerRequest sRec = gson.fromJson(elm, ServerRequest.class);

        // The object generated by the frontend should match whatever class you are reading into.
        // Notice how DataClass has name and ID and how the frontend is generating an object with name and ID.
        System.out.println("Got \"" + sRec.toString() + "\" from server.");

        // Because both possible requests from the client have the same format, 
        // we can check the "type" of request we've received: either "query" or "svg"
        if (sRec.getRequest().equals("query")) {
            // Set the return headers
            return serveQuery(sRec.getDescription().get(0));
        // if the user uploads a file
        } else if (sRec.getRequest().equals("upload")) {
            return serveUpload(sRec.getDescription());
        // assume if the request is not "query" it is "svg":
        } else {
            return serveSvg();
        }
    }

    private void setHeaders(Response res) {
        // Declares returning type json
        res.header("Content-Type", "application/json");

        // Ok for browser to call even if different host host
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
    }

    private void setHeadersFile(Response res) {
        res.raw().addHeader("Access-Control-Allow-Origin", "*");
        res.raw().addHeader("Access-Control-Allow-Headers", "*");
        res.raw().setContentType("application/force-download");
        res.raw().addHeader("Content-Disposition", "attachment; filename=\"selection.json\"");
    }
}
