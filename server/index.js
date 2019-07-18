const fs = require('fs');
const { google } = require('googleapis');

/**
 * HTTP Cloud Function that obtains image file ID from 
 * client & makes calls to helper functions.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.analyzeImage = async (req, res) => {
  handleCors(req, res);
  const fileId = req.query.fileId;
  
  getLabels(fileId).then(labels => {
    res.status(200).type('text/json')
      .end(JSON.stringify(labels));
  }).catch(err => {
    console.log("Error: " + err);
    res.status(500).end();
  })
};

/**
 * Sends an image through the Google Vision API label
 * detection.
 *
 * @param {String} fileId Image file ID.
 */
async function getLabels(fileId) {  
  // Imports the Google Cloud client library.
  const vision = require('@google-cloud/vision');
  // Creates a client.
  const client = new vision.ImageAnnotatorClient(); 
  
  // Obtains image as file bytes.
  const imgFileBytes = await getFileBytes(fileId);
  // Sends file bytes through Vision API.
  const [result] = await client.labelDetection({image: {content: imgFileBytes}});
  var labels = result.labelAnnotations;
  labels = labels.map(label => label.description); // Only gets label descriptions.
  return labels;
}

/**
 * Takes an image's file ID and returns its file bytes.
 *
 * @param {String} fileId Image's file ID.
 */
async function getFileBytes(fileId) {
  // Gets drive authentication.
  let auth = await google.auth.getClient({ 
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  
  // Creates client.
  let drive = google.drive({version: 'v3', auth});
  let response = await drive.files.get({
    fileId: fileId,
    alt: 'media'
  }, {
    responseType: 'arraybuffer'
  });
  return Buffer.from(response.data); 
}

/**
 * HTTP function that supports CORS requests.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
handleCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }
}
