import { useState } from 'react'
import { getLeaderboard, type LeaderboardEntry } from '../utils/leaderboard'

export function Leaderboard() {
  const [entries] = useState<LeaderboardEntry[]>(() => getLeaderboard())
  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>Leaderboard</h1>
      {entries.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No results yet.</p>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel)' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>#</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Mode</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Score</th>
                <th style={{ padding: 12, textAlign: 'right' }}>%</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12 }}>{i + 1}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: 12 }}>{e.mode}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{e.score}/{e.total}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{e.percent}%</td>
                  <td style={{ padding: 12 }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
