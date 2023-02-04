import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useContext } from 'react';
import { useUserData } from '../hooks/useUserData';
import { ClickedMarkerContext } from '../contexts/ClickedMarkerContext';
import Map from '../components/Map';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import FocusedPointModal from '../components/mapMarkers/FocusedPointModal';
import ClickedMarkerDialog from '../components/mapMarkers/ClickedMarkerDialog';

export default withPageAuthRequired(function Home() {
  const { user } = useUser();
  const { isError, isLoading, error, data } = useUserData(user!);

  const { clickedPointId, setClickedPointId } =
    useContext(ClickedMarkerContext);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && error instanceof Error) {
    return <span className="text-black">Error: {error.message}</span>;
  }
  console.log({ data });
  return (
    <main className="flex flex-col h-screen justify-between bg-white">
      <Header />
      <section className="mb-auto">
        <ClickedMarkerDialog />
        <Map />
        <FocusedPointModal />
      </section>
    </main>
  );
});
