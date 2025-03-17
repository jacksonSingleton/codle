import { useState, useCallback, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { vim } from "@replit/codemirror-vim";

const monokai = createTheme({
  theme: "dark",
  settings: {
    background: "#2d2a2e",
    backgroundImage: "",
    foreground: "#fcfcfa",
    caret: "#ff6188",
    selection: "#ab9df226",
    selectionMatch: "#ab9df226",
    lineHighlight: "#8a91991a",
    gutterBackground: "#2d2a2e",
    gutterForeground: "#93929366",
    fontSize: "18px",
    fontFamily: "IBM Plex Mono, monospace",
  },
  styles: [
    { tag: t.comment, color: "#72707299" }, // dimmed3
    { tag: t.variableName, color: "#78dce8" }, // accent5
    { tag: [t.string, t.special(t.brace)], color: "#a9dc76" }, // accent4
    { tag: t.number, color: "#fc9867" }, // accent2
    { tag: t.bool, color: "#ff6188" }, // accent1
    { tag: t.null, color: "#ff6188" }, // accent1
    { tag: t.keyword, color: "#ab9df2" }, // accent6
    { tag: t.operator, color: "#fc9867" }, // accent2
    { tag: t.className, color: "#ffd866" }, // accent3
    { tag: t.definition(t.typeName), color: "#ffd866" }, // accent3
    { tag: t.typeName, color: "#ab9df2" }, // accent6
    { tag: t.angleBracket, color: "#5b595c" }, // dimmed4
    { tag: t.tagName, color: "#ab9df2" }, // accent6
    { tag: t.attributeName, color: "#fc9867" }, // accent2
  ],
});

interface Props {
  onChange: (val: string) => void;
  vim: boolean;
  initialValue: string;
}

export default function Editor(props: Props) {
  const [value, setValue] = useState(props.initialValue);

  const onChange = useCallback((val: string) => {
    props.onChange(val);
    setValue(val);
  }, []);

  useEffect(() => {
    if (props.initialValue) {
      setValue(props.initialValue);
    }
  }, [props.initialValue]);

  const ext = props.vim ? [vim()] : [];

  return (
    <CodeMirror
      value={value}
      extensions={[python(), ...ext]}
      onChange={onChange}
      theme={monokai}
      height="100%"
      className="w-full h-full"
    />
  );
}
