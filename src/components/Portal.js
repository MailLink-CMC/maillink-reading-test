import { useMemo } from "react";
import { createPortal } from "react-dom";

function Portal({ children, elementId = "modal-root" }) {
   const rootElement = useMemo(
      () => document.getElementById(elementId),
      [elementId]
   );

   return createPortal(children, rootElement);
}

export default Portal;
