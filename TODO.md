TO-DO LIST FOR BUBL APP:

- Get SQLite for Javascript
- Implement databases and change code to access records through SQL queries.
- After implemented SQLite, consider using other alternatives since local storage isn't going to cut it.
  - Implement a server? Would like to avoid this but probably will be unavoidable since the clients have to get the pictures someway through some sort of middle man (unless the clients can call the SQL queries themselves... but that exposes risk of SQL injection attack.)
- Organize the way data is stored in the databases.
- Look into encryption (long term step)
- Look into user authorization (after figuring out the database stuff and basic functionality)

- Seriously consider switching out of plain JS
- Look into the frameworks and their capabilities.
- Maybe a multi-page web app would be a better approach.
- Frameworks with libraries would ease implementation of certain things (ex: authorization, routing, dynamic display, eventual fancy and smooth UI stuff with pseudo-3d interfaces)

---

STACK DISCUSSION:

- MERN stack, or another fullstack combo.
  - MongoDB (database), Express (backend/API), React (frontend dev), Node (obligatory)
- Could also do it in Flask or Django with Python backend
  - MongoDB (database), Django (backend/API), Vue.js (frontend dev), Node (probably)

---

Database of all active profiles on the platform

```
profile:
    profile_id:
    username:
    password:
    email(optional):
```

Database of all active bubls on the platform

```
bubls:
    bubl_id: id
    name: string
    creator_id: id
    members: [ ] list of ids of regular members
    admins: [ ] list of ids of admins of bubl
    start_date: date
    end_date: date (required end date when record will be wiped from storage)
```

Database of all stored pictures/videos/other media on the bubl platform

```
pictures:
    picture_id: id
    name(optional): string
    creator_id: id
    likes: int
    bubl_id: id
    end_date: date (to remove them when done using)
```

---

MERN stack architecture from ChatGPT

photo-sharing-app/
├── backend/
│ ├── config/
│ │ └── config.js
│ ├── controllers/
│ │ ├── photoController.js
│ │ └── bublController.js
│ ├── models/
│ │ ├── Photo.js
│ │ └── Bubl.js
│ ├── routes/
│ │ ├── photoRoutes.js
│ │ └── bublRoutes.js
│ ├── uploads/
│ ├── app.js
│ └── server.js
└── frontend/
├── public/
│ ├── index.html
│ └── ...
├── src/
│ ├── components/
│ │ ├── PhotoList.js
│ │ ├── BublForm.js
│ │ └── ...
│ ├── pages/
│ │ ├── Home.js
│ │ ├── Bubls.js
│ │ └── ...
│ ├── services/
│ │ └── api.js
│ ├── App.js
│ └── index.js
├── package.json
└── ...

Now, let's briefly describe the contents of each directory and file:

backend/: Contains the server-side code using Node.js with Express.

config/: Configuration files, such as database connection settings.
controllers/: Controllers for handling business logic.
models/: MongoDB schema models.
routes/: Express route handlers for different API endpoints.
uploads/: Directory for storing uploaded photos.
app.js: Main Express application file.
server.js: File to start the Express server.
frontend/: Contains the client-side code using React.

public/: Static files like HTML templates.
src/: Source code directory.
components/: Reusable UI components.
pages/: React components representing different pages/views of the app.
services/: Utility functions for making API requests.
App.js: Root component of the React app.
index.js: Entry point for the React app.
package.json: npm package file for frontend dependencies.
Other Files:

config.js: Configuration file for backend settings like database URI and secret keys.
photoController.js and bublController.js: Controllers for handling photo and bubl-related logic.
Photo.js and Bubl.js: MongoDB schema models for photos and bubls.
photoRoutes.js and bublRoutes.js: Express route handlers for API endpoints related to photos and bubls.
api.js: Utility functions for making HTTP requests to the backend API from the frontend.
This structure provides a basic foundation for organizing your code. As you develop your app, you may add more directories and files based on your specific requirements and project complexity.
