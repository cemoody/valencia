import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Icon, Button, Label } from "semantic-ui-react";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const Home = () => {
  const [authState, setAuthState] = useState(false);
  Auth.currentAuthenticatedUser()
    .then(user => setAuthState(true))
    .catch(err => setAuthState(false));
  console.log({ authState });

  return (
    <div>
      <Head>
        <title>algopipes</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <link href="/index.css" rel="stylesheet" />
      </Head>
      <div id="wrapper">
        <div id="main">
          <div id="inner">
            <div>
              <span className="logoicon">
                <Icon fitted name="cubes" size="huge" inverted />
              </span>
              <span className="title fs25"> algopipes </span>
              <p />
              <span className="subtitle">
                Create a search page from your embeddings.
                <span className="highlight"> Free. </span>
              </span>
              <p />
              <p />
              <p />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
