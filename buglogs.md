###[17-06-25]
##comment state bug
#Issue Summary:
While a user was interacting with the request component, it was observed that when a comment was submitted alongside an approval decision, the comment was appropriately recorded. However, an unexpected behavior occurred when the user approved a different request without entering a new comment — the previously entered comment still appeared alongside the new approval decision.

#Root Cause:
Investigation revealed that the comment input was managed using a shared state not scoped to any specific request. As a result, the comment persisted across multiple approvals, causing it to be erroneously attached to unrelated requests. This was a state management issue in which the comment data was stored globally rather than per request.

#Resolution:
The solution involved restructuring the comment state to be an object keyed by request ID. This ensured that each request had its own associated comment in state, preventing comments from "leaking" between requests. With this fix, comments are now correctly submitted and displayed relative to the specific request they were made on.

###[17-06-25]
##image download bug
#Issue Summary:
When attempting to download an image file attached to a request, the downloaded file was empty and unreadable. Initial assumptions pointed to a backend issue, but after detailed debugging, it was discovered that the request never reached the file download endpoint on the server.

#Root Cause:
A closer inspection of the frontend network behavior revealed that the request returned a 404 Not Found error from the Nginx server. With the help of AI tools, it was identified that Nginx interpreted image requests (e.g., .png, .jpg) as static assets, attempting to resolve them from the React build/ directory. Since the image did not exist in that directory, Nginx returned a 404 error before the request could reach the backend.

#Resolution:
The solution involved explicitly modifying the Nginx configuration. A location ^~ /download/ block was added before the static asset matcher to ensure that all download requests, including those for image files, are proxied directly to the backend server without being intercepted by Nginx's static file handling logic.