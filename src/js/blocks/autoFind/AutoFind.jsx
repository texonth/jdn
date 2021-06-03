import "./slider.less";
import React from "react";
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
      perception,
    },
    {
      identifyElements,
      removeHighlighs,
      generateAndDownload,
      onChangePerception,
    },
  ] = useAutoFind();
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
    onChangePerception(value);
  };

  const getAvailableElements = () => {
    return allowRemoveElements
      ? (predictedElements || []).filter(
          (e) => e.predicted_probability >= perception
        ).length
      : 0;
  };

  const getPredictedElements = () => {
    return predictedElements && allowRemoveElements
      ? predictedElements.length
      : 0;
  };

  return (
    <div>
      <Row>
        <button disabled={!allowIdetifyElements} onClick={handleGetElements}>
        Idetify
      </button>
      <button disabled={!allowRemoveElements} onClick={handleRemove}>
        Remove
      </button>
      <button disabled={!allowRemoveElements} onClick={handleGenerate}>
        Generate And Download
      </button>
      </Row>
      <label>Perception treshold: {perception}</label>
      <Row>
        <label>0.0</label>
        <Slider
          style={{ width: "80%" }}
          min={0.0}
          max={1}
          step={0.01}
          onChange={handlePerceptionChange}
          value={perception}
        />
        <label>1</label>
      </Row>
      <div>{status}</div>
      <div>{pageElements || 0} found on page.</div>
      <div>{getPredictedElements()} predicted.</div>
      <div>{getAvailableElements()} available for generation.</div>
    </div>
  );
};

export default AutoFind;
