import React from "react";
import { Icon, Button, Label } from "semantic-ui-react";
import { Auth, Storage } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI

Auth.configure(awsconfig);
Storage.configure(awsconfig, { level: "private" });
let fileInputRef = React.createRef();

const fileChange = e => {
  const file = e.target.files[0];
  const filename = file.name;
  Storage.put(filename, file, {
    contentType: "application/x-binary"
  })
    .then(result => console.log(result))
    .catch(err => console.log(err));
};

const UploadFile = () => {
  return (
    <div style={styles.container}>
      <div className="centered pt1">
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
        <input ref={fileInputRef} type="file" hidden onChange={fileChange} />
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
