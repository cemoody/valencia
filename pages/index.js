import React from "react";
import Head from "next/head";
import { Icon } from "semantic-ui-react";

const Home = () => (
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
            <span className="title"> algopipes </span>
            <p className="subtitle">
              Create a search engine based on your embeddings.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
