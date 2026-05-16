export function FileIcon({ className = 'h-5 w-5 text-darkteal-500' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 2.5h6l4 4v11H5v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 2.5v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.5 10.5h5M7.5 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
