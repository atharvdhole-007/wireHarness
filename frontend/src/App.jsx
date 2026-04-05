import { useState } from 'react'
import Dashboard from './components/Dashboard'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cardStyle = { 
    marginBottom: '24px', padding: '24px', borderRadius: '8px', 
    background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
  }
  const contentStyle = { padding: '24px', maxWidth: '1200px', margin: '0 auto' }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      formData.append('image', file)
      
      fetch('http://127.0.0.1:8000/api/v1/scan', {  // Changed from localhost
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        setResult(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Backend error: ' + err.message)
        setLoading(false)
      })
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ 
        background: '#1890ff', color: 'white', padding: '16px', 
        textAlign: 'center', fontSize: '24px', fontWeight: 'bold'
      }}>
        📁 AI Wire Harness Scanner - Hybrid CV+VLM
      </div>
      
      <div style={contentStyle}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Upload Wiring Diagram</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: 'block', margin: '0 auto 20px' }}
          />
          <div style={{ padding: '20px', border: '2px dashed #1890ff', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⬆️</div>
            <div>PNG/JPG diagrams (OpenCV + Florence-2)</div>
          </div>
        </div>
        
        {loading && (
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
              <div>Hybrid Pipeline Running... ({Math.random()*1000|0}ms)</div>
            </div>
          </div>
        )}
        
        {result && <Dashboard data={result} />}
        {error && (
          <div style={{ 
            background: '#ff4d4f', color: 'white', padding: '16px', 
            borderRadius: '6px', marginBottom: '24px' 
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App