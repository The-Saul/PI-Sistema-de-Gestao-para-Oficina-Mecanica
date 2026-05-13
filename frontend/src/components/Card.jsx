import { useNavigate } from "react-router-dom";

function Card({ icon, value, label, color, rota }) {
  const navigate = useNavigate();

  return (
    <div
      className={`card ${color}`}
      onClick={() => rota && navigate(rota)}
      style={{ cursor: rota ? "pointer" : "default" }}
    >
      <div className="icon">
        <img src={icon} className="card-icon" alt="" />
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default Card;