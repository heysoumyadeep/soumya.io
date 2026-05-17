import NextLink from 'next/link';

// Prefetch is off by default because static export doesn't generate the RSC
// payload files that Next tries to fetch. Every prefetch would 404.
// Pages are pre-rendered HTML so navigation is still fast.
// Pass `prefetch` explicitly on a specific link to opt back in.
export default function Link({ prefetch = false, ...rest }) {
  return <NextLink prefetch={prefetch} {...rest} />;
}
