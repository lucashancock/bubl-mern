## bubl. (WIP)

### The photo sharing app made just for you.

As it stands, this is a side project of mine to keep my skills sharp and also learn some new things over the summer of 2024. The web app consists of both a frontend and a backend, as well as a database, photo encryption, socket-based connections, complex state management, and authentication using JSON Web Tokens. The purpose of the app is to explore a missing niche in the context of photo sharing. That is, there often lacks some sort of unified software for photo sharing between and within groups, events, families, friends, etc. Bubl aims to provide temporary storage for such contexts with a seamless and integrated UI experience. This web application built mainly with React is a prototype of a more fully featured utility that may be developed soon for iOS devices. In the future, I hope for Bubl to be iOS application, where users can use its unified platform to share photos to one space, where all of your friends or other eventgoers can access them. Integration with other social media platforms on top of just your contacts like Instagram and Snapchat pose great opportunity for an app utility like Bubl, due to the rising popularity of using these apps as one's main form of communication. More detail on the app and the development process is as follows.

### Demo (WIP)

https://github.com/lucashancock/bubl-mern/assets/111306378/e1b2247d-181f-45ca-bd67-a6d68245947a

### Technology Stack

- Backend: Express

- Frontend: React

- Database: MongoDB

- Runtime: Node

- Authentication: JWT

- Encryption: Bcrypt

- Physics engine: Matter.js

### Running the app

1. Clone the repository
2. Install dependencies (cd frontend and cd backend and install both folder's dependencies)
3. Run the backend server

```
cd backend
node --watch src/server.js
```

4. Run the frontend client

```
cd frontend (you have to cd .. once)
npm start
```

SN: The terminal may prompt you to say (Y)es to run on another port since the backend is on 3000. Press Y. That will start the react frontend server and should automatically launch in your browser.

---

### Development Process

#### Frontend

- The frontend is built mainly with React. Before this project, I had little to no experience with React. I knew how popular it is, and wanted to learn something new so I gave it a try.
- From previous experience trying to build webapps, I was a little afraid of plain CSS. So instead, I built the project with Tailwind CSS. I love that tailwind minimizes the amount of separate files and overall complexity that is usually brought when trying to style something. My only gripe with Tailwind is that sometimes the classNames can get very long-winded, but thats no real fault of the technology itself. 
- I wanted the app to have a lot of interactive and nice-looking parts to it. Because of this, I opted for nice sidebar menus and modals instead of a entirely page based system where everything is its own rendered html template. 
- I tried to make the app comfortable to use and interactive by including animations and also an entire physics simulation using Matter.js. I am no UI/UX designer at all, so any feedback is appreciated.
- Overall, I'm really glad with how the frontend UI is coming along so far. I think it could use a little bit of simplification right now, but its coming along.

#### Backend

- The backend for this project is made with Node.js and Express. All the backend really is is just a bunch of CRUD API endpoints to do various things with the database. That is, Bubl (and many other web applications) are simply just overly complex CRUD applications.
- The backend is hooked up to a local MongoDB instance. More on that in the next section.
- I handle photo encryption and authentication using bcrypt and jwt, respectively, in the backend. Implementing those ideas was not as hard as I thought it was, thanks to the expansive javascript/nodejs libraries.
- The backend right now is a little bit of a mess and long-winded, but it gets the job done now for this prototype. 
- If I were to redo the backend, I think I would definitely reconsider about organization and also look further into some other open source projects and tech stacks with how they go about handling their endpoints, authentication, verification, database CRUD operations, etc.

#### Database

- For this project, I am using a local instance of MongoDB community edition.
- I used MongoDB because the MERN stack is really popular.
- I separated my database into collections of users, pictures, bubls, and invites. Most of them have foreign keys to other collections, which was causing me some issues. Also, I ended up using UUID strings to uniquely identify items (which worked for my purposes...) but MongoDB was yelling at me a little bit trying to get me to convert my IDs to ObjectIDs. However, I couldn't seem to get the conversion to work properly after hours of effort, so I kept the string UUIDs. 
- Another gripe I had while working with MongoDB is that there is not really a concept of a cascading delete. For example, if I wanted to delete a Bubl and that bubl had an array of photoIDs within it, when I deleted the Bubl, the photos wouldn't get deleted. I looked online and it seems like MongoDB doesn't really support this, and instead people on stackoverflow were recommending to just chunk everything together into one collection/document instead of separating across 3 or 4. That didn't really seem like the best alternative to me, so instead I manually wrote all of the cascading deletion edge cases. There were a lot of tricky edge cases with my database schema, so I might be missing one. Again, works fine for a prototype.
- If I were to change the database in the future ever again, I'd definitely use a relational database that supports cascading deletions and use some sort of GraphQL querying language or something like PostGRES SQL.
- Other than that, I used Mongoose to set up the models and do a lot of the CRUD operations. I wanted photos and bubls to automatically delete themselves after some ending date, too, and MongoDB didn't seem to have a surefire way of doing this out of the box. Mongoose helped here, and allowed me to set an expiration time to my schema. Figuring that out was a little difficult because my MongoDB instance was caching my old schemas so sometimes I had to completely erase the collection and remake it for the expiration index to go into effect. Also, mongo only checks these expiration indexes every minute or so, so there are times where you might have an invalid item sitting in your database for a few seconds.
- Despite the headache these things caused, it was all a great learning experience

- Looking forward to developing Bubl more and migrating to an iOS application! If you are interested in helping develop Bubl, please reach out to me!

### Built-by: Lucas Hancock

Questions? Reach out to me: lucas.hancock18@gmail.com
