export function provideHandleTouchStartTestCases() {
  return [
    {
      touches: [{ clientX: 0, clientY: 0 }],
    },
    {
      touches: [{ clientX: 20, clientY: 1900 }],
    },
    {
      touches: [{ clientX: 912, clientY: 250 }],
    },
  ];
}

export function provideHandleTouchMoveTestCases() {
  return [
    {
      touches: [{ clientX: 20, clientY: 0 }],
    },
    {
      touches: [{ clientX: 120, clientY: 250 }],
    },
    {
      touches: [{ clientX: 394, clientY: 680 }],
    },
  ];
}

export function provideValidTouchInputTestCases() {
  return [
    {
      touchStartEvent: { touches: [{ clientX: 0, clientY: 0 }] },
      touchEvents: [{ touches: [{ clientX: 0, clientY: 40 }] }],
      direction: "Down",
    },
    {
      touchStartEvent: { touches: [{ clientX: 35, clientY: 10 }] },
      touchEvents: [
        {
          touches: [
            { clientX: 40, clientY: 12 },
            { clientX: 44, clientY: 12 },
          ],
        },
      ],
      direction: "Right",
    },
    {
      touchStartEvent: { touches: [{ clientX: 0, clientY: 1200 }] },
      touchEvents: [
        {
          touches: [{ clientX: 1190, clientY: 0 }],
        },
      ],
      direction: "Up",
    },
    {
      touchStartEvent: { touches: [{ clientX: 50, clientY: 40 }] },
      touchEvents: [
        {
          touches: [
            { clientX: 40, clientY: 40 },
            { clientX: 35, clientY: 42 },
          ],
        },
      ],
      direction: "Left",
    },
  ];
}

export function provideInputBelowThresholdTestCases() {
  return [
    {
      touchStartEvent: { touches: [{ clientX: 0, clientY: 0 }] },
      touchEvents: [{ touches: [{ clientX: 0, clientY: 4 }] }],
      minThreshold: 5,
    },
    {
      touchStartEvent: { touches: [{ clientX: 0, clientY: 0 }] },
      touchEvents: [
        {
          touches: [
            { clientX: 0, clientY: 4 },
            { clientX: 12, clientY: 44 },
          ],
        },
      ],
      minThreshold: 50,
    },
  ];
}
