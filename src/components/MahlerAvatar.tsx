/**
 * Gustav Mahler, Vienna 1907. Photograph: Moritz Nähr.
 * Wikimedia Commons — File:Photo of Gustav Mahler by Moritz Nähr 02.jpg
 * Public domain (Nähr d. 1945; published 1908 in the US before 1930).
 */
export const MAHLER_PORTRAIT_SRC = '/images/mahler-naehr-1907.jpg';

export function MahlerAvatar({
  size = 56,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      className={`mahler-avatar${className ? ` ${className}` : ''}`}
      src={MAHLER_PORTRAIT_SRC}
      alt="Gustav Mahler"
      title="Gustav Mahler, Wenen 1907. Foto: Moritz Nähr. Wikimedia Commons, public domain."
      width={size}
      height={size}
      draggable={false}
    />
  );
}
