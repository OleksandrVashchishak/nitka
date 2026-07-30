import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderWebsiteTemplate } from "@/components/website-templates";
import { getPublicWebsite } from "@/lib/website-api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const site = await getPublicWebsite(slug);
    return {
      title: site.content.headline,
      description: `${site.content.subheadline} · ${site.content.dateLabel}`,
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "Весільний сайт", robots: { index: false } };
  }
}

export default async function PublicWeddingWebsitePage({ params }: Props) {
  const { slug } = await params;
  let site;
  try {
    site = await getPublicWebsite(slug);
  } catch {
    notFound();
  }

  return (
    <main>{renderWebsiteTemplate(site.templateId, site.content)}</main>
  );
}
