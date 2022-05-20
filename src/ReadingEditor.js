import { useRef, useState, useEffect, useCallback } from "react";

//이렇게 라이브러리를 불러와서 사용하면 됩니다
import ReactQuill from "react-quill";
import Portal from "./components/Portal";
import convertRemToPixels from "./utils/convertRemToPixels";
import "./ReadingEditor.css";

const oneRem = convertRemToPixels(1);
let selection = "";
const ReadingEditor = () => {
   const quillRef = useRef();
   const [contents, setContents] = useState("");

   const getContent = () => {
      // RN에서 웹으로 데이터를 전송했을때 message이벤트가 실행됩니다.
      if (document.getElementsByClassName("test")[0]) {
         var result = document.getElementsByClassName("test")[0].innerText;
         if (result) setContents(result);
      }
   };
   // 계산
   const removeModal = useCallback(() => {
      const modal = document.getElementById("modal-dialog");
      modal.style.visibility = "hidden";
   }, []);
   const showModal = useCallback((x, y) => {
      const modal = document.getElementById("modal-dialog");
      modal.style.visibility = "visible";

      const top = y - oneRem * 4;
      const left = x;

      modal.style.top = top < 0 ? "0px" : top + "px";
      modal.style.left =
         left + oneRem * 5 > window.innerWidth
            ? window.innerWidth - oneRem * 5.2 + "px"
            : left + "px";
   }, []);

   useEffect(() => {
      let isContextMenuFired = false;
      const onSelectionChange = (e) => {
         if (!isContextMenuFired) {
            removeModal();
         } else {
            isContextMenuFired = false;
         }
      };
      const onContextMenu = (e) => {
         e.preventDefault();
         showModal(e.clientX, e.clientY);
         isContextMenuFired = true;
         selection = window.getSelection().toString();
      };

      document.addEventListener("selectionchange", onSelectionChange);
      document.addEventListener("contextmenu", onContextMenu, false);

      return () => {
         document.removeEventListener("selectionchange", onSelectionChange);
         document.removeEventListener("contextmenu", onContextMenu);
      };
   }, [removeModal, showModal]);

   const onClickInstaShare = (e) => {
      window.ReactNativeWebView?.postMessage(
         JSON.stringify({
            type: "instaShare",
            text: selection.replace(/\n+/g, "\n"),
         })
      );
      removeModal();
   };
   return (
      <>
         <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
         />
         <ReactQuill
            className="ReadingEditor"
            readOnly
            ref={quillRef}
            modules={{
               toolbar: false,
            }}
            value={contents}
            theme="snow"
         />
         <button
            id="loadingButton"
            style={{ display: "none" }}
            onClick={getContent}>
            SEND
         </button>

         <Portal>
            <div
               id="modal-dialog"
               className="modal-dialog"
               onClick={onClickInstaShare}
               style={{
                  position: "absolute",
                  pointerEvents: "all",
                  visibility: "hidden",
               }}>
               인스타 공유
            </div>
         </Portal>
      </>
   );
};

export default ReadingEditor;
