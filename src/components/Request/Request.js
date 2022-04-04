export function Request({ data }) {
  const { description, status, title } = data
  return (
    <div>
      <h2>Title: {title}</h2>
      <p>Description: {description}</p>
      <p>{status}</p>
    </div>
  )
}
