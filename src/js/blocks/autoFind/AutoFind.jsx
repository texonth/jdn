import React, { useState } from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";
import { Slider, Row } from "antd";

const AutoFind = () => {
  const [
    {
      status,
      predictedElements,
      pageElements,
      allowIdetifyElements,
      allowRemoveElements,
    },
    { identifyElements, removeHighlighs, generateAndDownload },
  ] = useAutoFind();
  const [perception, setPerception] = useState(0.5);

  const handleGetElements = () => {
    identifyElements();
  };

  const handleRemove = () => {
    removeHighlighs();
  };

  const handleGenerate = () => {
    generateAndDownload(perception);
  };

  const handlePerceptionChange = (value) => {
    setPerception(value);
  };

  return (
    <div>
      <button disabled={!allowIdetifyElements} onClick={handleGetElements}>
        Idetify
      </button>
      <button disabled={!allowRemoveElements} onClick={handleRemove}>
        Remove
      </button>
      <button disabled={!allowRemoveElements} onClick={handleGenerate}>Generate And Download</button>
      <br></br>
      <label>Perception treshold: {perception}</label>
      <Row>
        <label>0.0</label>
        <Slider
          style={{ width: "80%" }}
          min={0.0}
          max={1}
          step={0.01}
          onChange={handlePerceptionChange}
          value={typeof perception === "number" ? perception : 0}
        />
        <label>1</label>
      </Row>
      <label>{status}</label>
      <br></br>
      <label>
        {predictedElements && allowRemoveElements ? predictedElements.length : 0} of{" "}
        {pageElements || 0} page elements are predicted for test.
      </label>
    </div>
  );
};

export default AutoFind;
