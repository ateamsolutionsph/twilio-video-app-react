import React from 'react';

export default function ChatIcon() {
  return (
    // <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M0 1C0 0.723858 0.223858 0.5 0.5 0.5H18.5C18.7761 0.5 19 0.723858 19 1V13C19 13.2761 18.7761 13.5 18.5 13.5H9.3096L6.32421 16.361C6.1796 16.4996 5.96624 16.5385 5.78202 16.4599C5.59779 16.3813 5.47826 16.2003 5.47826 16V13.5H0.5C0.223858 13.5 0 13.2761 0 13V1ZM1 1.5V12.5H5.97826C6.2544 12.5 6.47826 12.7239 6.47826 13V14.8283L8.76274 12.639C8.85583 12.5498 8.97977 12.5 9.1087 12.5H18V1.5H1Z"
    //     fill="#707578"
    //   />
    // </svg>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      enable-background="new 0 0 24 24"
    >
      {' '}
      <image
        id="image0"
        width="24"
        height="24"
        x="0"
        y="0"
        href="data:image/png;base64,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
    AABJRU5ErkJggg=="
      />
    </svg>
  );
}
