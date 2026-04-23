function Card({ icon, value, label, color }) {
  return (
    <div className={`card ${color}`}>
      <div className="icon">
        <img src={icon} className="card-icon" alt="" />
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default Card;