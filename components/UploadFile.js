import { Icon, Button, Label } from "semantic-ui-react";

const UploadFile = () => {
  return (
    <div style={styles.container}>
      <div className="centered pt1">
        <Button
          as="div"
          labelPosition="right"
          onClick={() => Auth.federatedSignIn()}
        >
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
