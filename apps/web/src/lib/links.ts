/**
 * Anchor links like "#work" or "#contact" only exist on the home page. On any
 * other route they have to become "/#work" so the browser navigates home first.
 */
export const resolveHref = (href: string, pathname: string): string => {
  if (!href.startsWith('#')) return href;

  return pathname === '/' ? href : `/${href}`;
};
