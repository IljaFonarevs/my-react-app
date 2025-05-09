import WalletConnector from "./components/WalletConnector";



function App() {


  return (
    <div className="flex flex-col items-center space-y-6 p-10">
      <div style={{ padding: "2rem" }}>
      <h1>Login with MetaMask</h1>
      <WalletConnector />
    </div>
    </div>
  );
}

export default App;
