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