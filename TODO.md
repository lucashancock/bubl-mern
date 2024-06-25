- Permissions and tiers 

- Implement capacity on # of active user bubls. Join certain numbers for different tiers.
    - 1 active free tier

- Invite functionality
    - In the future, send email

- Things to look into before beta test:
    - token expiration and refresh token mechanisms
    - https to encrpyt data in transit between client and server
    - look into whether or not my encryption methods are good
    - input validation on client AND server side
    - Look into session management to track user sessions securely. 
    - Robust error handling mechanisms and frontend reactive displays when something goes wrong. (already have some, but not all. some will just throw error message to console.)
    - Get rid of all error messages showing up in the developer console on browser
    - pagination for when there is lots of photos.

- Admin page in the bubls menu where the edit and delete are...
    - multiselect dropdown menu for kicking.

- implement tags maybe?

- get rid of invalid bubls from bubls page with negative days before mongo deletes them

- select photos functionality for downloading/liking

- try S3 storage on the NAS 

- bubl storage capacity for the different tiers, and ability to upgrade within the settings menu

- consolidate some of the backend endpoints to reduce number of calls. 
    - separate server.js into multiple files for organization

- admin/settings page for bubls is kind of cluttered --> make the popup bigger and spread the stuff out