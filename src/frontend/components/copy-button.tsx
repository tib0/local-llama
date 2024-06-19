import { ClipboardIcon } from "../lib/icons";

type Props = {
  code: string;
};
function CopyButton({ code }: Props) {
  function handleClick() {
    if (window && window.electronAPI) window.electronAPI.clipboardCopy(code);
  }
  return (
    <button
      className="copy-button text-primary"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
    >
      <ClipboardIcon />
    </button>
  );
}

export default CopyButton;
