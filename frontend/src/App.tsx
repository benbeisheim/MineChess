import LocalGame from './components/Game/LocalGame';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[min(90vw,90vh)] aspect-square">
        <LocalGame />
      </div>
    </div>
  );
}

export default App
