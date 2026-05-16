'use client';

import { useEffect, useState } from 'react';
import { shellCopy } from '../content/copy';
import { FileIcon } from './FileIcon';

export function FilePickerModal({ onClose, onSelect, selectedFile }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/file-storage/files')
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted) setFiles(payload.files || []);
      })
      .catch(() => {
        if (isMounted) setFiles([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-bg-music/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-stroke-1 bg-bg-elevated p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="t-h3 text-fg-1">{shellCopy.filePickerTitle}</h3>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white/[0.08] font-naskh text-sm transition-all">
            {shellCopy.closeLabel}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {files.length === 0 ? <p className="t-body text-fg-2">{shellCopy.emptyFileList}</p> : null}
          {files.map((file) => {
            const isSelected = selectedFile?.id === file.id;
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => onSelect(file)}
                className={`rounded-md bg-surface-muted p-3 text-right text-fg-2 font-naskh text-sm hover:bg-white/[0.08] transition-all ${isSelected ? 'border border-darkteal-500' : 'border border-transparent'}`}
              >
                <FileIcon />
                <span className="mt-2 block truncate">{file.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
