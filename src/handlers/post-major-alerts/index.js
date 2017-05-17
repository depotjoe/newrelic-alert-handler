require('@google-cloud/debug-agent').start();
const bigQuery = require('@google-cloud/bigquery');

exports.postMajorAlert = function postMajorAlert (req, res) {
  if (req.body === undefined) {
    // This is an error case, as "message" is required
    res.status(400).send('No message defined!');
  } else {
    let projectId = "quotecenter-dev";
    let datasetId = "Monitors_Alerts";
    let tableId = "all_newrelic_alerts";
    let bq = bigQuery({projectId: projectId});
    
    bq.dataset(datasetId)
      .table(tableId)
      .insert(req.body)
      .then((insertErrors) => {
        if(insertErrors) 
          res.status(500).end();

        res.status(200).end();
      })
      .catch((err) => {
        res.status(500).end();
      });
  }
};

