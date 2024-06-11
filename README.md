## bubl.

### The photo sharing app made just for you.

---

Backend: Express

Frontend: React

Database: MongoDB

Runtime: Node

---

### Install dependencies:

```
npm install
```

![https://stackoverflow.com/questions/8367031/how-do-i-install-package-json-dependencies-in-the-current-directory-using-npm]

---

### To run:

```
cd backend
node --watch server.js
```

Server then will run on PORT 3000 by default. --watch sets it in watch mode which will automatically update the server upon Save.

```
cd frontend (you have to cd .. once)
npm start
```

The terminal may prompt you to say (Y)es to run on another port since the backend is on 3000. Press Y. That will start the react frontend server and should automatically launch in your browser.

---

### Development:

#### Frontend

- Built with React.
- Currently its (kind of, very) messy since I'm still a noob with React.
- The `src` folder houses all of the React components. They are (mostly) bite sized chunks of the entire web app. They can pass props and state between eachother. I'd recommend watching a React crash course if you intend on developing the frontend on this project.
- To create a new react component, just create a new "___.js" file and start coding! Linking it up to the rest of the application will take some experience with React. Reach out to Lucas if you need help (although he doesn't really know what he's doing).
- Styling is done using Tailwind CSS. To apply styles, you can use the className tag in an html element. Tailwind requires a bit of finnicking to get right. ChatGPT has no design skills, be warned.

#### Backend

- Built with Express.js and Node.js
- Node.js is the javascript runtime and Express.js allows for quick and easy API creation and server stuff. 
- Feel free to add any new libraries you might need in your development. You can install a new library by navigating to the backend directory in your terminal and doing `npm install {library here}`. Same goes for the frontend. 
- Currently, the backend is just one, big server.js file. Eek. I didn't feel like separating it, and just let it grow bigger and bigger. 
- Currently, the "database" I am serving to the frontend is just a javascript array of objects. Eventually, I will migrate all of this code to MongoDB, which shouldn't be too bad.
- Follow the other examples in the file for how to create an endpoint and also how to call it at certain points in the frontend. 
- Files are currently stored as an encrypted base64 string. This will perhaps change when I migrate to Mongo. Keep that in mind when you are developing.
- Feel free to refactor any of my messy code! I would really appreciate it (if it still works)... jk.

#### Database

- The backend database is a MongoDB database.
- Make sure you have Mongodb installed on your machine. See this link for help: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
- I recommend downloading with brew. That's what worked for me.
- Once installed, run `brew services start mongodb-community@7.0` to start up a mongodb local server on your machine. This allows for local development, until we eventually move to a cloud based alternative.
- You can leave the service running (I think) even when you are done developing. But if you wanna shut it down, run `brew services stop mongodb-community`.
- For coding the backend, please use mongoose to interact with the database.
- When you Save the server.js file, the database will reset to the data defined in `pictures.json`, `profiles.json`, and `bubls.json`. This is to aid debugging, for example, if you enter a item into the database that you don't want there. You can also manipulate the .json files in the backend folder if you want to start the server with different values. 
- `db.js` just starts the mongodb connection.
- `resetDabase.js` resets the database as mentioned earlier.

## Any other questions -> reach out to me

### Built-by: Lucas Hancock

