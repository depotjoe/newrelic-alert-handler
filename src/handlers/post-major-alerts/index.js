exports.postMajorAlert = function postMajorAlert (req, res) {
  if (req.body === undefined) {
    // This is an error case, as "message" is required
    res.status(400).send('No message defined!');
  } else {
    // Everything is ok
    //console.log(req.body.message);
    res.body = req.body;
    res.status(200).end();
  }
};