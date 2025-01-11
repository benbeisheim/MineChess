import Game from './components/Game/Game';
import { TestInterface } from './components/TestInterface/TestInterface';

function App() {
  return (
    <div className="min-h-screen  bg-dark-gray">
        <main className="flex justify-center items-center h-full">
          <TestInterface />
        </main>
    </div>
  );
}

export default App
