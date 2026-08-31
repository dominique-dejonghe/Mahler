export type View = 'atlas' | 'houses' | 'symphonies' | 'letters';

export function viewFromPath(pathname: string): View {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/brieven') return 'letters';
  return 'atlas';
}

export function pathFromView(view: View): string {
  return view === 'letters' ? '/brieven/' : '/';
}
