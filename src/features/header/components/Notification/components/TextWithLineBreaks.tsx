import React from "react";

export const TextWithLineBreaks: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))}
  </>
);