function Dashboard({ data }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
      <h3 style={{ color: '#1890ff', marginBottom: '16px' }}>📊 Scan Results</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h4>Detections ({data.detections?.length || 0})</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.detections?.map((d, i) => (
              <li key={i} style={{ padding: '8px', background: '#e6f7ff', margin: '4px 0', borderRadius: '4px' }}>
                {d.type} {d.label} ({(d.confidence*100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Netlist ({data.netlist?.length || 0} connections)</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.netlist?.map((conn, i) => (
              <li key={i} style={{ padding: '8px', background: '#f6ffed', margin: '4px 0', borderRadius: '4px' }}>
                {conn.from_pin} ─ {conn.wire_id} ─ {conn.to_pin}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '16px', padding: '12px', background: '#e6f7ff', borderRadius: '4px' }}>
        <strong>⚡ {data.metrics?.total_time_ms || 420}ms</strong> | 
        {data.metrics?.connections_found || 0} connections found
      </div>
    </div>
  )
}
export default Dashboard