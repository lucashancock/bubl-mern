- Clean up frontend for bubl cards
    - Make it so that only owner can see bubl id
        - What can admins do? Figure that out
    - Or figure out another way to let people join. Join codes?
    - Add random Ad card way in the future?
    - Editing modal and new endpoints for modifying bubl stuff
        - Only available to creator or admin
        - Endpoint will check that
        - Allow creator to appoint/demote admins
- Clean up frontend for gallery
    - Add random Ad card way in the future?

- Filtering and search for both Gallery and Bubl cards. (way future)

- Invite functionality
    - Works for when the user is registered
    - In the future, send email
    - In the future, provide unique endpoint link to send and automatically propogate the invite stuff.
- sort by likes, date added in gallery

- Change the bubls page to NOT call the api every second or two seconds. That is way too costly. 
    - Use something like WebRTC instead with a socket based connection.
    - This one is tough, I couldn't figure it out tonight. 
    - Maybe add a refresh button instead

- Things to look into before beta test:
    - Expiration of photos and bubls needs to be implemented
    - token expiration and refresh token mechanisms
    - https to encrpy data in transit between client and server
    - look into whether or not my encryption methods are good
    - input validation on client AND server side
    - Look into session management to track user sessions securely. 
    - Robust error handling mechanisms and frontend reactive displays when something goes wrong. (already have some, but not all. some will just throw error message to console.)
    - Get rid of all error messages showing up in the developer console on browser
    - notifications for new uploads, comments, or likes.
    - pagination for when there is lots of photos.
        - optimization of app. look into webRTC again for socket based connection instead of pinging the backend API every second for update
        - OR implement a refresh button/functionality.
