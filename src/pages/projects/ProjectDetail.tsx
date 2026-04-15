import { useParams } from 'react-router-dom';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <h1>Project Detail</h1>
      <p>Project {id} — details and linked supplies coming soon.</p>
    </div>
  );
}
