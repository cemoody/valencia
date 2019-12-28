import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Icon, Button, Label } from "semantic-ui-react";
import Amplify, { Auth, Hub } from "aws-amplify";
import { withOAuth } from "aws-amplify-react";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const Upload = props => {
  console.log(props);
  const authState = false;
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
                <Icon fitted name="cubes" size="large" inverted />
              </span>
              <span className="title"> algopipes </span>
              <p />
              {authState ? (
                <div>
                  <span className="subtitle">
                    Great, you're signed in. Go ahead and upload a dataframe.
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
              ) : (
                <div className="centered pt1">
                  <span className="subtitle">
                    Sign in or register to continue.
                  </span>
                  <p />
                  <p />
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={props.OAuthSignIn}
                  >
                    <Button icon>
                      <Icon name="user" />
                    </Button>
                    <Label as="a" basic pointing="left">
                      Sign in
                    </Label>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withOAuth(Upload);
