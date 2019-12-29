import { Icon, Button, Label } from "semantic-ui-react";
import { Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI

Auth.configure(awsconfig);

const UploadFile = () => {
  return (
    <div style={styles.container}>
      <div className="centered pt1">
        <Button as="div" labelPosition="right">
          <Button icon>
            <Icon name="cloud upload" />
          </Button>
          <Label as="a" basic pointing="left">
            Upload dataframe
          </Label>
        </Button>
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
