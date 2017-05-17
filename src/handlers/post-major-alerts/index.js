require('@google-cloud/debug-agent').start();
const bigQuery = require('@google-cloud/bigquery');
const pubSub = require('@google-cloud/pubsub');
const Logging = require('./errors');

const projectId = "quotecenter-dev";

exports.postMajorAlerttoBigQuery = function (event, callback) {
  if(event.data) {
    let datasetId = "Monitors_Alerts";
    let tableId = "raw_alerts";
    let bq = bigQuery({projectId: projectId});
    
    bq.dataset(datasetId)
      .table(tableId)
      .insert({"data":JSON.stringify(event.data)})
      .then((insertErrors) => {
        if(insertErrors) {
          Logging.logError(insertErrors);
          callback(insertErrors);
        }
        else {
          callback();
        }
      })
      .catch((err) => {
        Logging.logError(err);
        callback(err);
      });  }
  else {
    Logging.logError('event data not provided.')
  }
};


exports.postMajorAlert = function (req, res) {
  if (req.body === undefined) {
    // This is an error case, as "message" is required
    res.status(400).send('No message defined!');
  } else {
    let ps = pubSub({projectId: projectId});
    let topicName = 'monitors.alerts.newrelic.major';

    ps.topic(topicName)
      .publish({'data': JSON.stringify(req.body)}, (err) => {
        if(err) {
          Logging.logError(err, req, res, null, ()=>{});
          res.status(500).end();
        }
        else {
          res.status(200).end();
        }
      });
  }
};

