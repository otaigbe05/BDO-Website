// /site/changes/:token : older emails link here. Changes now happen in the customer's own form,
// reopened with their answers filled in, so this page just sends them there.
import { Navigate, useParams } from 'react-router-dom';

export default function SiteChanges() {
  const { token } = useParams();
  return <Navigate to={`/site/intake/${token}`} replace />;
}
