import  ChessBoard  from './components/ChessBoard'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[min(90vw,90vh)] aspect-square">
        <ChessBoard />
      </div>
    </div>
  );
}

export default App
