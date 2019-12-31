import React, { useState } from "react";
import {
  Icon,
  Button,
  Label,
  Container,
  Progress,
  Segment
} from "semantic-ui-react";
import { Auth, Storage } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI

Auth.configure(awsconfig);
Storage.configure(awsconfig, { level: "private" });
let fileInputRef = React.createRef();

const UploadFile = () => {
  const [progress, setProgress] = useState(0);
  const active = progress > 1 && progress < 99;
  console.log({ progress, active });
  const fileChange = e => {
    const file = e.target.files[0];
    const filename = file.name;
    Storage.put(filename, file, {
      level: "private",
      contentType: "application/x-binary",
      progressCallback(progress) {
        setProgress((100.0 * progress.loaded) / progress.total);
      }
    })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  };
  return (
    <div style={styles.container}>
      <div className="centered pt1">
        {progress > 1 ? (
          <div>
            <p />
            <Progress
              percent={progress.toFixed(1)}
              active={active}
              progress={active}
              indicating={active}
            ></Progress>
          </div>
        ) : (
          <div>
            <Button
              as="div"
              labelPosition="right"
              onClick={() => fileInputRef.current.click()}
            >
              <Button icon>
                <Icon name="cloud upload" />
              </Button>
              <Label as="a" basic pointing="left">
                Upload dataframe
              </Label>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={fileChange}
            />
          </div>
        )}
        {progress > 99 ? (
          <p>Upload complete. Click here to see dataframe.</p>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: 50
  }
};

export default UploadFile;
