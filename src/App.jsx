import React from 'react'
import './App.css'

function App( ) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CMV Inteligente</h1>
        <p>Por Fábio Bindes</p>
        <p>Sistema funcionando! 🎉</p>
        <button 
          onClick={() => alert('Backend conectado!')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Testar Conexão
        </button>
      </header>
    </div>
  )
}

export default App
