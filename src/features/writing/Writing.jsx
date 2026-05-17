import Link from '@components/link/Link';
import { SectionHeader, ArrowRightIcon } from '@components';
import { getRecentPostsMeta } from '@lib/posts';
import PostCard from '@features/blog/PostCard';
import './Writing.scss';

export default function Writing() {
  const posts = getRecentPostsMeta(3);

  return (
    <section id="writing" className="section">
      <div className="container">
        <div className="writing__head">
          <SectionHeader number="04" label="Writing" title="Recent posts." />
          <Link href="/blog" className="writing__all">
            All posts <ArrowRightIcon size={14} />
          </Link>
        </div>

        <ul className="writing__list reveal">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <PostCard post={post} index={index} showImage showTags={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
