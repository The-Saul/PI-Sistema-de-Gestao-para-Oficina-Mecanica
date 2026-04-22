function Card({ icon, value, label, color }) {
  return (
    <div className="card">
      <div className={`icon ${color}`}>
        {icon}
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default Card;