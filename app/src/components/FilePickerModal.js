'use client';

import { useEffect, useState } from 'react';
import { shellCopy } from '../content/copy';
import { FileIcon } from './FileIcon';

const fallbackFiles = [
  {
    id: 'demo-file-brief',
    storageProviderFileId: 'demo-file-brief',
    name: 'Investor-Brief.pdf',
    mimeType: 'application/pdf',
    webViewLink: '#'
  },
  {
    id: 'demo-file-plan',
    storageProviderFileId: 'demo-file-plan',
    name: 'Launch-Plan.docx',
    mimeType: 'application/document',
    webViewLink: '#'
  }
];

export function FilePickerModal({ selectedFile, onSelect, onClose }) {
  const [files, setFiles] = useState(fallbackFiles);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/file-storage/files')
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted && Array.isArray(payload.files) && payload.files.length > 0) {
          setFiles(payload.files);
        }
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-bg-music p-4">
      <div className="w-full max-w-2xl rounded-lg border border-stroke-1 bg-bg-elevated p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="t-h3 text-fg-1">{shellCopy.filePickerTitle}</h3>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white/[0.08] font-naskh text-sm transition-all">
            {shellCopy.closeLabel}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {files.map((file) => {
            const isSelected = selectedFile?.storageProviderFileId === file.storageProviderFileId;
            return (
              <button
                key={file.storageProviderFileId || file.id}
                type="button"
                onClick={() => onSelect(file)}
                className={`rounded-md bg-surface-muted p-3 text-right font-naskh text-sm text-fg-2 transition-all hover:bg-white/[0.08] ${isSelected ? 'border border-darkteal-500' : 'border border-transparent'}`}
              >
                <span className="mb-2 flex items-center gap-2 text-fg-1">
                  <FileIcon />
                  <span>{file.name}</span>
                </span>
                <span dir="ltr" className="block text-left text-xs text-fg-3">
                  {file.mimeType}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
