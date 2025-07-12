export function provideInvalidInputKeyTestCases() {
  return [
    {
      key: "Enter",
    },
    {
      key: "KeyA",
    },
    {
      key: "KeyC",
    },
    {
      key: "ShiftLeft",
    },
    {
      key: "LeftShift",
    },
  ];
}

export function provideValidInputKeyTestCases() {
  return [
    {
      keyboardEvent: { key: "ArrowUp" },
      direction: "Up",
    },
    {
      keyboardEvent: { key: "ArrowDown" },
      direction: "Down",
    },
    {
      keyboardEvent: { key: "ArrowLeft" },
      direction: "Left",
    },
    {
      keyboardEvent: { key: "ArrowRight" },
      direction: "Right",
    },
  ];
}
