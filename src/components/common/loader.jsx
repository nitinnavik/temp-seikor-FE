const Loader = ({ headerLess }) => {
  return (
    <div className={`loader ${headerLess ? "header-less" : ""}`}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
export default Loader;
