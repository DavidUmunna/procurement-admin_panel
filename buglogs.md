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

###[29-06-25]
##fileupload issue while implementing csrfToken 
#Issue Summary:
After implementing CSRF token validation and confirming it worked correctly, an issue arose during a file upload test. The application entered a loading state (`setLoading(true)`) and remained stuck, with the request never reaching the backend endpoint.
##Initial INvestigation:
- Extensive debugging showed no activity on the server side — the request was not hitting the endpoint.
- CSRF validation was completely removed, and JWT tokens were used instead (`httpOnly: false`, standard for SPAs), but the issue persisted.
- This eliminated CSRF as the root cause of the hanging behavior.

---
## Root Cause

- Further inspection revealed that the file used during testing was an **Nginx server configuration file** (essentially a script).
- Uploads of other file types (e.g., images, PDFs, Word documents) worked without any issues.
- This behavior pointed to a problem specific to the **content** or **type** of the file being uploaded.

### Possible Technical Causes

- The script-like content of the file may have triggered browser or security middleware blocks.
- MIME type mismatch or misclassification could have interfered with handling.
- Some server configurations or middlewares may reject certain script types silently.

---

## Resolution Plan

- Re-enable CSRF token validation.
- Avoid using configuration or script files as test files for upload functionality.
- Ensure the backend accepts only whitelisted MIME types:
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `application/vnd.oasis.opendocument.text`
- Improve error handling on the frontend to notify users when requests fail silently or hang.
- Add logging to middleware to inspect incoming files before full processing.

---