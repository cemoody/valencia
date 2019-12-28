import { Icon } from "semantic-ui-react";

const Logo = ({ size = "huge", showSubtitle = true }) => {
  return (
    <div>
      <span className="logoicon">
        <Icon fitted name="cubes" size={size} inverted />
      </span>
      <span className={size === "huge" ? "title fs25" : "title"}>
        algopipes
      </span>
      <p />
      {showSubtitle ? (
        <span className="subtitle">
          Create a search page from your embeddings.
          <span className="highlight"> Free. </span>
        </span>
      ) : null}
    </div>
  );
};

export default Logo;
