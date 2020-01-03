var AWS = require("aws-sdk");
AWS.config.region = "us-east-2";
var lambda = new aws.Lambda({
  region: "us-east-2" //change to your region
});

exports.handler = function(event, context) {
  //eslint-disable-line
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  // manually form JSON blob to avoid weird whitespacing url encoding
  const blob = `{"bucket": ${bucket}, "key": ${key}}`;
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);
  var params = {
    FunctionName: "valencia-prod-indexer",
    ClientContext: "e30=",
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: blob
  };
  console.log("invoking lambda", params);
  lambda.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
  console.log("invoked lambda", params);
  context.done(null, "Successfully processed S3 event");
};
