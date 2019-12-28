import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Icon, Button, Label } from "semantic-ui-react";
import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "../src/aws-exports";

import { listenUser } from "../src/utils";
import Logo from "../components/Logo";
import UploadFile from "../components/UploadFile";
import AuthForm from "../components/AuthForm";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const Home = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    Hub.listen("auth", data => {
      const { payload } = data;
      const email = payload.data.attributes.email;
      console.log("A new auth event has happened: ", data);
      if (payload.event === "signIn") {
        setEmail(email);
      }
      if (payload.event === "signOut") {
        setEmail("");
      }
    });
    const checkUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log(user);
        setEmail(user.attributes.email);
        return user;
      } catch (err) {
        return err;
      }
    };
    checkUser();
  }, []);
  console.log({ email });

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
            <Logo size="huge" />
            {email === "" ? <AuthForm /> : <UploadFile />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
