import "./404ErrorPage.css";

const PageNotFound = () => {
  return (
    <div
      className="not-found-container"
      style={{
        paddingTop: "3.5em",
      }}
    >
      <div className="content">
        <p className="content-text">Oops! It looks like you're lost.</p>
        <a href="/" className="home-button">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
