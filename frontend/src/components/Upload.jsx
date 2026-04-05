import { useCallback } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined, CloudUploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Dragger } = Upload

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/scan'

function UploadComponent({ onResult, onLoading, onError, disabled }) {
  const [uploading, setUploading] = React.useState(false)

  const handleUpload = useCallback(async (file) => {
    if (disabled || uploading) return false
    
    setUploading(true)
    onLoading(true)
    
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000  // 30s for VLM
      })
      onResult(response.data)
      message.success('Scan complete! ✅')
    } catch (err) {
      onError(err.response?.data?.detail || 'Scan failed - backend not ready')
      message.error('Upload failed')
    } finally {
      setUploading(false)
      onLoading(false)
    }
    
    return false  // Prevent default upload
  }, [onResult, onLoading, onError, disabled, uploading])

  return (
    <Dragger
      name="image"
      multiple={false}
      accept=".jpg,.jpeg,.png"
      beforeUpload={handleUpload}
      showUploadList={false}
      disabled={disabled}
    >
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <CloudUploadOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }} />
        <h3>Drop wiring diagram here</h3>
        <p>Supports JPG/PNG up to 10MB. Hybrid OpenCV + Florence-2 processing.</p>
        {uploading && <div style={{ marginTop: '16px', color: '#1890ff' }}>Uploading...</div>}
      </div>
    </Dragger>
  )
}

export default UploadComponent