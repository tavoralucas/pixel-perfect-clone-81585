import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

/**
 * Sets client-side <title> and description for the current page.
 * SPA replacement for the SSR-era `head()` route option.
 */
export function PageMeta({ title, description }: { title: string; description?: string }) {
  const fullTitle = title.includes("GPU") ? title : `${title} — GPUaaS`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
    </Helmet>
  );
}

export function PageMetaWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
