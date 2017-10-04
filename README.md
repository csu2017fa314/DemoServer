# Demo Server

## Getting Started

To use this project first make sure you have `npm` or `yarn` installed. These are dependency managers that will download everything you need for the project.

### Running the frontend (web)

This should look familiar. First, navigate into the web directory and install all dependencies:

```bash
$ cd web
$ npm install //Install all dependencies
```

`npm` should start downloading everything it needs to build the app.

To launch the app:

```
$ npm run dev
```

### Running the backend (server)

You have the option of opening this in an IDE like IntelliJ and running through run configurations. I will go over running from the command line.

First, navigate to the project root (where the `pom.xml` is located). Run the following to package the code into a jar:

```bash
$ mvn package
```

Now run the jar file by running the following code:

```bash
$ java -cp target/DemoServer-0.0.1-SNAPSHOT-jar-with-dependencies.jar edu.csu2017fa314.DemoServer.Demo
```
### It works (hopefully)

You should now be able to type into the input box and press enter. The server is coded to return an image url and a list of numbers. These should be displayed on the webpage. If you open the browser console (development tools) I have added a few logs explaining what is happening. Comments can be found in the code that explains what each part is doing. If you have any questions feel free to post on Piazza or email the team directly. You may also approach me in person if to talk about this code or to set up a meeting to work through it.