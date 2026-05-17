// Server component. Inlines JSON-LD script tags into the prerendered HTML, no client JS.

export default function JsonLd({ data }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.filter(Boolean).map((schema, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
