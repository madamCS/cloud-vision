const fs = require('fs');
const { google } = require('googleapis');

exports.analyzeImage = async (req, res) => {
  handleCors(req, res);
  const inputImageUrl = req.query.fileId;
  
  getLabels(inputImageUrl).then(labels => {
    res.status(200).type('text/json')
      .end(JSON.stringify(labels));
  }).catch(err => {
    console.log("Error: " + err);
    res.status(500).end();
  })
};

// Helper function gets Image labels.
async function getLabels(imageUrl) {  
  // Imports the Google Cloud client library.
  const vision = require('@google-cloud/vision');
  // Creates a client.
  const client = new vision.ImageAnnotatorClient(); 
  const imgFileBytes = await getFileBytes(imageUrl);
  console.log("got file bytes");
  const [result] = await client.labelDetection({image: {content: imgFileBytes}});
  
  var labels = result.labelAnnotations;
  labels = labels.map(label => label.description);
  return labels;
}

// Function gets the image's file bytes to pass through the Vision API.
async function getFileBytes(fileId) {
  // Get auth.
  let auth = await google.auth.getClient({ 
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  
  let drive = google.drive({version: 'v3', auth});
  let response = await drive.files.get({
    fileId: fileId,
    alt: 'media'
  }, {
    responseType: 'arraybuffer'
  });
  return Buffer.from(response.data); 
}

handleCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }
}
