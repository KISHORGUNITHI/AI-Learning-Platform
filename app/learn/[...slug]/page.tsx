import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { getArticleBySlug, getArticleSlugs } from '@/lib/content';
import { mdxComponents } from '@/components/article/MDXComponents';
import ArticleHeader from '@/components/article/ArticleHeader';
import PrevNextNav from '@/components/article/PrevNextNav';
import ReadingProgressBar from '@/components/navigation/ReadingProgressBar';

// ─── Static params ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug: slug.split('/') }));
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join('/');
  try {
    const { metadata } = getArticleBySlug(slugStr);
    return {
      title: metadata.title,
      description: metadata.description,
      keywords: metadata.tags,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        type: 'article',
        ...(metadata.createdAt && { publishedTime: metadata.createdAt }),
        ...(metadata.updatedAt && { modifiedTime: metadata.updatedAt }),
      },
    };
  } catch {
    return { title: 'Not Found' };
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join('/');

  let article: ReturnType<typeof getArticleBySlug>;
  try {
    article = getArticleBySlug(slugStr);
  } catch {
    notFound();
  }

  const { metadata, content } = article!;

  return (
    <>
      <ReadingProgressBar />

      {/*
        Max reading width centred within the content column.
        The layout (app/learn/layout.tsx) already provides the
        left sidebar, so this page only needs to render the article.
      */}
      <div style={{ padding: 'clamp(2rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <article style={{ maxWidth: '680px' }}>

          {/* Sections 1–3: title, objectives, prerequisites */}
          <ArticleHeader metadata={metadata} />

          {/* Sections 4–11: MDX prose */}
          <div className="article-body">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                blockJS: false,
                blockDangerousJS: true,
                mdxOptions: {
                  remarkPlugins: [remarkMath],
                  rehypePlugins: [rehypeKatex],
                },
              }}
            />
          </div>

          {/* Prev / Next */}
          <PrevNextNav
            previous={metadata.previous}
            next={metadata.next}
          />

        </article>
      </div>
    </>
  );
}
