import "./ShowMoreBtn.css";

const ShowMoreBtn = ({ text, showMore, setShowMore }) => {
  return (
    <button className="round-and-back" onClick={() => setShowMore(!showMore)}>
      <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
        <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
        <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
      </svg>
      <span>{text}</span>
    </button>
  );
};

export default ShowMoreBtn;
