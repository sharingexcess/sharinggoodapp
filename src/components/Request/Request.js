export function Request({ data }) {
  const { description, status, title } = data
  return (
    <div id="request-container">
      <h3>{title}</h3>
      <p>Description: {description}</p>
      <p>{status}</p>
    </div>
  )
}
