"use client";

import { useEffect, useRef } from "react";

export default function ConvertKitEmbed() {
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.uid = "e3ae48a640";
    script.src = "https://thorough-beauty.kit.com/e3ae48a640/index.js";

    // Insert the script right after the anchor so CK renders here
    anchor.insertAdjacentElement("afterend", script);

    return () => {
      script.remove();
      anchor.innerHTML = "";
    };
  }, []);

  return (
    <>
      <div ref={anchorRef} id="ck_embed_e3ae48a640" />

      <style>
        {`
          @media (min-width: 600px) {
            #ck_embed_e3ae48a640 + * {
              padding-left: 0.8rem !important;
              padding-right: 0.8rem !important;
            }
          }

          /* Remove borders (and shadow borders) from the CK embed container */
          #ck_embed_e3ae48a640 + * {
            border: 0 !important;
            box-shadow: none !important;
          }
          /* Also catch common CK form containers just in case */
          #ck_embed_e3ae48a640 + * .formkit-form,
          #ck_embed_e3ae48a640 + * .seva-form {
            border: 0 !important;
            box-shadow: none !important;
          }
          /* Tame the large h2 margins inside the CK embed */
          #ck_embed_e3ae48a640 + * h2,
          #ck_embed_e3ae48a640 + * .formkit-form h2,
          #ck_embed_e3ae48a640 + * .seva-form h2 {
            margin: 0.5rem 0 !important; /* adjust as desired */
          }
          /* Reduce margin bottom for formkit-header */
          #ck_embed_e3ae48a640 + * .formkit-header {
            margin-bottom: 0.5rem !important; /* adjust as desired */
          }

          
        `}
      </style>
    </>
  );
}


