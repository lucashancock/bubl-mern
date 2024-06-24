- Permissions and tiers 

- Implement capacity on # of active user bubls. Join certain numbers for different tiers.
    - 1 active free tier

- Invite functionality
    - In the future, send email

- Things to look into before beta test:
    - Expiration of photos and bubls needs to be implemented
    - token expiration and refresh token mechanisms
    - https to encrpyt data in transit between client and server
    - look into whether or not my encryption methods are good
    - input validation on client AND server side
    - Look into session management to track user sessions securely. 
    - Robust error handling mechanisms and frontend reactive displays when something goes wrong. (already have some, but not all. some will just throw error message to console.)
    - Get rid of all error messages showing up in the developer console on browser
    - notifications for new uploads, comments, or likes.
    - pagination for when there is lots of photos.
        - optimization of app. look into webRTC again for socket based connection instead of pinging the backend API every second for update
        - OR implement a refresh button/functionality.

- Admin page in the bubls menu where the edit and delete are...
    - multiselect dropdown menu for kicking.

- implement tags maybe?

- get rid of invalid bubls from bubls page with negative days before mongo deletes them

- select photos functionality for downloading/liking


