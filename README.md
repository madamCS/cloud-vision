# Send a Google Drive-picked image through the Vision API.

_Instantly receive Google Vision API label detection results when a 
Google Drive image is picked._

Last updated: July, 2019

The client (JavaScript in HTML) obtains end-user authentication &
displays a Drive Picker, where the end-user selects an image from her Drive. 
The client then makes a 'GET' fetch request to the server ([Google Cloud
Function][g-c-f] written in Node.js), sending the image file's ID as a parameter. 
The server then makes a call to the [Google Vision API][vision-api], obtains label
detection results, and sends them back to the client. The client displays these
results back to the user through the HTML page.

[g-c-f]: https://cloud.google.com/functions
[vision-api]: https://cloud.google.com/vision/

## Technology highlights

- The client makes a 'GET' request to the Google Cloud Function, sending in 
  a file's ID as a parameter.
- The server obtains the image file's data as bytes.
- The server sends the image file bytes through the Vision API.
- The client receives the Vision API label detection results from the server
  and displays them to the user.
