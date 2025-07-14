import { Position } from "../../src/types.d";

export function provideMoveUpTestCases() {
  return [
    {
      initial: {
        x: 0,
        y: 1,
      },
      expected: {
        x: 0,
        y: 0,
      },
    },
    {
      initial: {
        x: 3,
        y: 2,
      },
      expected: {
        x: 3,
        y: 1,
      },
    },
    {
      initial: {
        x: 1,
        y: 3,
      },
      expected: {
        x: 1,
        y: 2,
      },
    },
  ] as { initial: Position; expected: Position }[];
}

export function provideMoveDownTestCases() {
  return [
    {
      initial: {
        x: 0,
        y: 1,
      },
      expected: {
        x: 0,
        y: 2,
      },
    },
    {
      initial: {
        x: 3,
        y: 2,
      },
      expected: {
        x: 3,
        y: 3,
      },
    },
    {
      initial: {
        x: 3,
        y: 0,
      },
      expected: {
        x: 3,
        y: 1,
      },
    },
  ] as { initial: Position; expected: Position }[];
}

export function provideMoveLeftTestCases() {
  return [
    {
      initial: {
        x: 1,
        y: 1,
      },
      expected: {
        x: 0,
        y: 1,
      },
    },
    {
      initial: {
        x: 3,
        y: 2,
      },
      expected: {
        x: 2,
        y: 2,
      },
    },
    {
      initial: {
        x: 3,
        y: 0,
      },
      expected: {
        x: 2,
        y: 0,
      },
    },
  ] as { initial: Position; expected: Position }[];
}

export function provideMoveRightTestCases() {
  return [
    {
      initial: {
        x: 1,
        y: 1,
      },
      expected: {
        x: 2,
        y: 1,
      },
    },
    {
      initial: {
        x: 2,
        y: 2,
      },
      expected: {
        x: 3,
        y: 2,
      },
    },
    {
      initial: {
        x: 0,
        y: 0,
      },
      expected: {
        x: 1,
        y: 0,
      },
    },
  ] as { initial: Position; expected: Position }[];
}

export function provideIncreaseTwofoldTestCases() {
  return [
    {
      initial: 2,
      expected: 4,
    },
    {
      initial: 4,
      expected: 8,
    },
    {
      initial: 8,
      expected: 16,
    },
    {
      initial: 16,
      expected: 32,
    },
    {
      initial: 2048,
      expected: 4096,
    },
  ];
}
